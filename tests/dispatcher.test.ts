import { createServer } from 'node:http';
import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import listPosts from './fixtures/basic-app/rpc/posts/list.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createAuthPolicy,
  createJoorHandler,
  createPlugin,
  defineConfig,
  defineManifest,
  defineProcedure,
  t,
} from '../src/index.js';
import {
  createCompiledRpcBodyResultHandler,
  createCompiledRuntimeState,
} from '../src/runtime/compiled.js';
import {
  createBunRpcRequestHandler,
  createBunTransportRequestHandlerWithPath,
} from '../src/runtime/bun.js';
import { createDenoCompiledTransportRequestHandler } from '../src/runtime/deno-compiled-transport.js';
import { createDenoRpcRequestHandler } from '../src/runtime/deno.js';
import { createNodeTransportRequestHandlerWithPath } from '../src/runtime/node.js';

const manifest = {
  procedures: {
    'users.get': getUser,
    'posts.list': listPosts,
  },
};

const call = (body: object): Promise<Response> => {
  const handler = createJoorHandler(manifest, config);
  return Promise.resolve(
    handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    )
  );
};

describe('dispatcher', () => {
  it('freezes defined manifests and procedure maps', () => {
    const source = {
      procedures: {
        'users.get': getUser,
        'posts.list': listPosts,
      },
    };
    const defined = defineManifest(source);

    expect(defined).not.toBe(source);
    expect(defined.procedures).not.toBe(source.procedures);
    expect(Object.isFrozen(defined)).toBe(true);
    expect(Object.isFrozen(defined.procedures)).toBe(true);
    expect(Object.isFrozen(source)).toBe(false);
    expect(Object.isFrozen(source.procedures)).toBe(false);
    expect(defined.procedures['users.get']).toBe(getUser);
    expect(defined.procedures['posts.list']).toBe(listPosts);
  });

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
    const hooksPlugin = createPlugin({
      name: 'hooks',
      setup() {
        return {
          hooks: {
            record(value: string) {
              seen.push(value);
            },
          },
        };
      },
    });
    const handler = createJoorHandler(
      { procedures: { limited } },
      {
        plugins: [hooksPlugin] as const,
        hooks: {
          beforeRequest(_request, context) {
            context.services.hooks.record('before');
            context.services.hooks.record(
              `before-body:${(context.body as { id?: string }).id}`
            );
            return undefined;
          },
          afterResponse(response, _request, context) {
            context.services.hooks.record('after');
            context.services.hooks.record(
              `after-body:${(context.body as { id?: string }).id}`
            );
            return response;
          },
        },
      }
    );
    const request = (): Promise<Response> =>
      Promise.resolve(
        handler(
          new Request('http://localhost/rpc', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-forwarded-for': 'rate-limit-test',
            },
            body: JSON.stringify({ id: 'limited', input: { ok: true } }),
          })
        )
      );

    expect((await (await request()).json()).ok).toBe(true);
    const limitedBody = await (await request()).json();

    expect(limitedBody.ok).toBe(false);
    expect(limitedBody.error.code).toBe('RATE_LIMITED');
    expect(seen).toEqual([
      'before',
      'before-body:limited',
      'after',
      'after-body:limited',
      'before',
      'before-body:limited',
      'after',
      'after-body:limited',
    ]);
  });

  it('runs compiled runtime hooks with plugin services', async () => {
    const seen: string[] = [];
    const hooksPlugin = createPlugin({
      name: 'compiled-hooks',
      setup() {
        return {
          hooks: {
            record(value: string) {
              seen.push(value);
            },
          },
        };
      },
    });
    const compiledConfig = defineConfig({
      plugins: [hooksPlugin] as const,
      hooks: {
        beforeRequest(_request, context) {
          context.services.hooks.record('before');
          context.services.hooks.record(
            `before-body:${(context.body as { id?: string }).id}`
          );
          return undefined;
        },
        afterResponse(response, _request, context) {
          context.services.hooks.record('after');
          context.services.hooks.record(
            `after-body:${(context.body as { id?: string }).id}`
          );
          return response;
        },
      },
    });
    const handler = createCompiledRpcBodyResultHandler(
      async (body) => ({
        ok: true,
        id: body.id,
        data: { ok: true },
        traceId: 'trace-compiled',
      }),
      compiledConfig
    );

    const result = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }),
      { id: 'compiled', input: { ok: true } }
    );

    expect(result).toBeInstanceOf(Response);
    expect(await (result as Response).json()).toMatchObject({
      ok: true,
      id: 'compiled',
      data: { ok: true },
    });
    expect(seen).toEqual([
      'before',
      'before-body:compiled',
      'after',
      'after-body:compiled',
    ]);
  });

  it('handles default-path compiled Deno transport requests', async () => {
    const handler = createDenoCompiledTransportRequestHandler(
      createCompiledRuntimeState(),
      async () => ({
        ok: false,
        id: 'fallback',
        traceId: 'trace-fallback',
        error: { code: 'NOT_FOUND', message: 'Not found', status: 404 },
      }),
      async (body) => {
        const id = typeof body['id'] === 'string' ? body['id'] : 'unknown';
        return {
          ok: true,
          id,
          traceId: 'trace-deno-compiled',
          data: { ok: true },
        };
      }
    );

    const wrongPath = await handler(
      new Request('http://localhost/not-rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );

    expect(wrongPath.status).toBe(404);

    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      id: 'users.get',
      traceId: 'trace-deno-compiled',
      data: { ok: true },
    });
  });

  it('handles path-scoped Bun transport requests', async () => {
    const handler = createBunTransportRequestHandlerWithPath(
      async (_request, body) => {
        const id =
          typeof body === 'object' &&
          body !== null &&
          'id' in body &&
          typeof body['id'] === 'string'
            ? body['id']
            : 'unknown';
        return {
          ok: true,
          id,
          traceId: 'trace-bun-transport',
          data: { ok: true },
        };
      },
      '/rpc'
    );

    const wrongPath = await handler(
      new Request('http://localhost/not-rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );

    expect(wrongPath.status).toBe(404);

    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      id: 'users.get',
      traceId: 'trace-bun-transport',
      data: { ok: true },
    });
  });

  it('handles path-scoped Node transport requests', async () => {
    const handler = createNodeTransportRequestHandlerWithPath(
      async (_request, body) => {
        const id =
          typeof body === 'object' &&
          body !== null &&
          'id' in body &&
          typeof body['id'] === 'string'
            ? body['id']
            : 'unknown';
        return {
          ok: true,
          id,
          traceId: 'trace-node-transport',
          data: { ok: true },
        };
      },
      '/rpc',
      '127.0.0.1'
    );
    const server = createServer((incoming, outgoing) => {
      void handler(incoming, outgoing);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    try {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        throw new Error('Expected Node test server to listen on a TCP port');
      }
      const base = `http://127.0.0.1:${address.port}`;
      const wrongPath = await fetch(`${base}/not-rpc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      });

      expect(wrongPath.status).toBe(404);

      const response = await fetch(`${base}/rpc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        ok: true,
        id: 'users.get',
        traceId: 'trace-node-transport',
        data: { ok: true },
      });
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });

  it('applies configured CORS to Bun and Deno RPC successes', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const options = { cors: { origin: 'https://app.example' } };
    const request = (): Request =>
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      });
    const bun = createBunRpcRequestHandler(
      { procedures: { ping: procedure } },
      options
    );
    const deno = createDenoRpcRequestHandler(
      { procedures: { ping: procedure } },
      options
    );

    for (const response of [await bun(request()), await deno(request())]) {
      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe(
        'https://app.example'
      );
      expect(response.headers.get('access-control-allow-methods')).toBe(
        'POST, OPTIONS'
      );
      expect((await response.json()).ok).toBe(true);
    }
  });

  it('honors sanitized Node transport serialized response headers', async () => {
    const handler = createNodeTransportRequestHandlerWithPath(
      async () => ({
        body: '{"ok":true}',
        responseHeaders: {
          'cache-control': 'private',
          'content-length': '999',
          'content-type': 'text/plain',
          connection: 'close',
          'x-bad': 'bad\r\nx-injected: yes',
          'x-safe': 'ok',
        },
      }),
      '/rpc',
      '127.0.0.1'
    );
    const server = createServer((incoming, outgoing) => {
      void handler(incoming, outgoing);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    try {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        throw new Error('Expected Node test server to listen on a TCP port');
      }
      const response = await fetch(`http://127.0.0.1:${address.port}/rpc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
      expect(response.headers.get('cache-control')).toBe('private');
      expect(response.headers.get('content-length')).not.toBe('999');
      expect(response.headers.get('connection')).not.toBe('close');
      expect(response.headers.get('x-bad')).toBeNull();
      expect(response.headers.get('x-safe')).toBe('ok');
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });

  it('caches successful query responses when meta.cache is configured', async () => {
    let calls = 0;
    const cached = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ value: t.number() }),
      meta: {
        kind: 'query',
        cache: {
          ttl: '1m',
          key: ['input.id'],
        },
      },
      async handler(ctx) {
        calls += 1;
        return ctx.ok({ value: calls });
      },
    });
    const handler = createJoorHandler({ procedures: { cached } });
    const request = (): Promise<Response> =>
      Promise.resolve(
        handler(
          new Request('http://localhost/rpc', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: 'cached', input: { id: 'same' } }),
          })
        )
      );

    const first = await (await request()).json();
    const second = await (await request()).json();

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(first.data.value).toBe(1);
    expect(second.data.value).toBe(1);
    expect(calls).toBe(1);
  });

  it('memoizes auth within a batch for shared policies', async () => {
    let authCalls = 0;
    const auth = createAuthPolicy({
      name: 'shared-bearer',
      authenticate(ctx) {
        authCalls += 1;
        if (ctx.rawHeaders.get('authorization') !== 'Bearer shared') {
          return ctx.error('UNAUTHORIZED', { message: 'Unauthorized' });
        }
        return { subject: 'user-1' };
      },
    });
    const first = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ subject: t.string() }),
      auth,
      async handler(ctx) {
        return ctx.ok({ subject: ctx.auth.subject });
      },
    });
    const second = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ subject: t.string() }),
      auth,
      async handler(ctx) {
        return ctx.ok({ subject: ctx.auth.subject });
      },
    });
    const handler = createJoorHandler({
      procedures: { first, second },
    });
    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          authorization: 'Bearer shared',
          'content-type': 'application/json',
        },
        body: JSON.stringify([
          { id: 'first', input: { ok: true } },
          { id: 'second', input: { ok: true } },
        ]),
      })
    );
    const body = await response.json();

    expect(body[0].ok).toBe(true);
    expect(body[1].ok).toBe(true);
    expect(authCalls).toBe(1);
  });
});
