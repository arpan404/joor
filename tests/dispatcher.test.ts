import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import listPosts from './fixtures/basic-app/rpc/posts/list.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import { createJoorHandler, defineProcedure, t } from '../src/index.js';

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
      async handler(ctx) {
        return ctx.ok({ tenantId: ctx.headers['x-tenant-id'] });
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
});
