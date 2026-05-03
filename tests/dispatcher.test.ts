import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import listPosts from './fixtures/basic-app/rpc/posts/list.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createAuthPolicy,
  createJoorHandler,
  defineProcedure,
  t,
} from '../src/index.js';

const manifest = {
  procedures: {
    'users.get': getUser,
    'posts.list': listPosts,
  },
};

const call = (body: object): Promise<Response> => {
  const handler = createJoorHandler(manifest, config);
  return handler(
    new Request('http://localhost/rpc', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
};

describe('dispatcher', () => {
  it('handles unary success', async () => {
    const response = await call({
      id: 'users.get',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
      traceId: 'trace-1',
    });

    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.traceId).toBe('trace-1');
    expect(body.headers['cache-control']).toBe('private, max-age=60');
    expect(response.headers.get('cache-control')).toBe('private, max-age=60');
  });

  it('handles validation failure', async () => {
    const response = await call({ id: 'users.get', input: { id: 'bad' } });
    const body = await response.json();

    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('handles batch requests in order', async () => {
    const response = await call([
      {
        id: 'users.get',
        input: { id: '550e8400-e29b-41d4-a716-446655440000' },
      },
      { id: 'posts.list', input: { userId: '1' } },
    ]);
    const body = await response.json();

    expect(body).toHaveLength(2);
    expect(body[0].id).toBe('users.get');
    expect(body[1].id).toBe('posts.list');
  });

  it('validates typed procedure headers', async () => {
    const protectedProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      headers: t.object({
        'x-tenant-id': t.string().min(1),
      }),
      output: t.object({ tenantId: t.string() }),
      responseHeaders: t.object({
        'x-result': t.string(),
      }),
      async handler(ctx) {
        return ctx.ok(
          { tenantId: ctx.headers['x-tenant-id'] },
          { 'x-result': 'ok' }
        );
      },
    });
    const handler = createJoorHandler({
      procedures: { protected: protectedProcedure },
    });
    const missingHeader = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'protected', input: { ok: true } }),
      })
    );
    const missingBody = await missingHeader.json();

    expect(missingBody.ok).toBe(false);
    expect(missingBody.error.code).toBe('HEADER_VALIDATION_ERROR');

    const success = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'protected', input: { ok: true } }),
      })
    );
    const successBody = await success.json();

    expect(successBody.ok).toBe(true);
    expect(successBody.data.tenantId).toBe('tenant-1');
  });

  it('authenticates procedures and exposes ctx.auth', async () => {
    const auth = createAuthPolicy({
      name: 'bearer',
      authenticate(ctx) {
        if (ctx.rawHeaders.get('authorization') !== 'Bearer token') {
          return ctx.error('UNAUTHORIZED', { message: 'Unauthorized' });
        }
        return { userId: 'user-1' };
      },
    });
    const protectedProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ userId: t.string() }),
      auth,
      async handler(ctx) {
        return ctx.ok({ userId: ctx.auth.userId });
      },
    });
    const handler = createJoorHandler({
      procedures: { protected: protectedProcedure },
    });
    const denied = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'protected', input: { ok: true } }),
      })
    );
    const deniedBody = await denied.json();

    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.error.code).toBe('UNAUTHORIZED');

    const allowed = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          authorization: 'Bearer token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'protected', input: { ok: true } }),
      })
    );
    const allowedBody = await allowed.json();

    expect(allowedBody.ok).toBe(true);
    expect(allowedBody.data.userId).toBe('user-1');
  });

  it('runs hooks and enforces rate limits', async () => {
    const limited = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      meta: {
        rateLimit: {
          limit: 1,
          window: '1m',
        },
      },
      async handler(ctx, input) {
        return ctx.ok({ ok: input.ok });
      },
    });
    const seen: string[] = [];
    const handler = createJoorHandler(
      { procedures: { limited } },
      {
        hooks: {
          beforeRequest() {
            seen.push('before');
            return undefined;
          },
          afterResponse(response) {
            seen.push('after');
            return response;
          },
        },
      }
    );
    const request = (): Promise<Response> =>
      handler(
        new Request('http://localhost/rpc', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': 'rate-limit-test',
          },
          body: JSON.stringify({ id: 'limited', input: { ok: true } }),
        })
      );

    expect((await (await request()).json()).ok).toBe(true);
    const limitedBody = await (await request()).json();

    expect(limitedBody.ok).toBe(false);
    expect(limitedBody.error.code).toBe('RATE_LIMITED');
    expect(seen).toEqual(['before', 'after', 'before', 'after']);
  });
});
