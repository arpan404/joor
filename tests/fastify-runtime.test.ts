import type { AddressInfo } from 'node:net';
import fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import {
  createFastifyHandler,
  createRouteStreamFastifyHandler,
  createRouteUnaryFastifyHandlerFor,
  defineProcedure,
  t,
} from '../src/index.js';

describe('fastify runtime', () => {
  it('adapts parsed Fastify requests to the transport runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean(), tenantId: t.string() }),
      headers: t.object({ 'x-tenant-id': t.string() }),
      async handler(ctx, input) {
        return ctx.ok({
          ok: input.ok,
          tenantId: ctx.headers['x-tenant-id'],
        });
      },
    });
    const app = fastify();
    app.post(
      '/api/rpc',
      createFastifyHandler(
        { procedures: { ping: procedure } },
        { path: '/api/rpc' }
      )
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${address.port}/api/rpc`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        id: 'ping',
        traceId: expect.any(String),
        data: { ok: true, tenantId: 'tenant-1' },
      });
    } finally {
      await app.close();
    }
  });

  it('writes declared response headers through Fastify', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      responseHeaders: t.object({
        'cache-control': t.string(),
        'x-safe': t.string(),
      }),
      async handler(ctx, input) {
        return ctx.ok(input, {
          'cache-control': 'private',
          'x-safe': 'ok',
        });
      },
    });
    const app = fastify();
    app.post(
      '/api/rpc',
      createFastifyHandler(
        { procedures: { ping: procedure } },
        { path: '/api/rpc' }
      )
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${address.port}/api/rpc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
      expect(response.headers.get('cache-control')).toBe('private');
      expect(response.headers.get('x-safe')).toBe('ok');
      expect(body).toEqual({
        ok: true,
        id: 'ping',
        traceId: expect.any(String),
        data: { ok: true },
        headers: {
          'cache-control': 'private',
          'x-safe': 'ok',
        },
      });
    } finally {
      await app.close();
    }
  });

  it('writes configured CORS headers on successful Fastify responses', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const app = fastify();
    app.post(
      '/api/rpc',
      createFastifyHandler(
        { procedures: { ping: procedure } },
        {
          path: '/api/rpc',
          cors: { origin: 'https://app.example' },
        }
      )
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${address.port}/api/rpc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe(
        'https://app.example'
      );
      expect(body.ok).toBe(true);
    } finally {
      await app.close();
    }
  });

  it('adapts route-specific unary Fastify handlers through the typed transport runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ id: t.string(), tenantId: t.string() }),
      headers: t.object({ 'x-tenant-id': t.string() }),
      async handler(ctx, input) {
        return ctx.ok({
          id: input.id,
          tenantId: ctx.headers['x-tenant-id'],
        });
      },
    });
    const app = fastify();
    app.post(
      '/api/rpc',
      createRouteUnaryFastifyHandlerFor()(
        { procedures: { 'users.get': procedure } },
        { path: '/api/rpc' }
      )
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${address.port}/api/rpc`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({ id: '1', tenantId: 'tenant-1' });
    } finally {
      await app.close();
    }
  });

  it('adapts route-specific stream Fastify handlers through the typed transport runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    });
    const app = fastify();
    app.post(
      '/api/rpc',
      createRouteStreamFastifyHandler(
        { procedures: { 'users.watch': procedure } },
        { path: '/api/rpc' }
      )
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${address.port}/api/rpc`, {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
      });
      const body = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain(
        'text/event-stream'
      );
      expect(body).toContain('event: data');
      expect(body).toContain('"event":"updated"');
      expect(body).toContain('event: done');
    } finally {
      await app.close();
    }
  });

  it('rejects wrong route kinds in route-specific Fastify handlers', async () => {
    let unaryInvoked = false;
    let streamInvoked = false;
    const unary = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        unaryInvoked = true;
        return ctx.ok(input);
      },
    });
    const stream = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        streamInvoked = true;
        yield input;
      },
    });
    const manifest = { procedures: { unary, stream } };
    const app = fastify();
    app.post(
      '/api/unary',
      createRouteUnaryFastifyHandlerFor()(manifest, { path: '/api/unary' })
    );
    app.post(
      '/api/stream',
      createRouteStreamFastifyHandler(manifest, { path: '/api/stream' })
    );
    await app.listen({ port: 0, host: '127.0.0.1' });
    try {
      const address = app.server.address() as AddressInfo;
      const unaryResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/unary`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: 'stream', input: { ok: true } }),
        }
      );
      const streamResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/stream`,
        {
          method: 'POST',
          headers: {
            accept: 'text/event-stream',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ id: 'unary', input: { ok: true } }),
        }
      );

      expect(unaryResponse.status).toBe(200);
      expect(await unaryResponse.json()).toMatchObject({
        ok: false,
        id: 'stream',
        error: { code: 'NOT_FOUND', status: 404 },
      });
      expect(streamResponse.status).toBe(200);
      expect(await streamResponse.json()).toMatchObject({
        ok: false,
        id: 'unary',
        error: { code: 'NOT_FOUND', status: 404 },
      });
      expect(unaryInvoked).toBe(false);
      expect(streamInvoked).toBe(false);
    } finally {
      await app.close();
    }
  });

  it('snapshots Fastify handler options at creation time', async () => {
    const procedure = defineProcedure({
      input: t.json(),
      output: t.json(),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const errors: string[] = [];
    const hooks: string[] = [];
    const options = {
      path: '/rpc',
      cors: { origin: 'https://original.example' },
      maxBodyBytes: 1024,
      hooks: {
        beforeRequest() {
          hooks.push('original');
          return undefined;
        },
      },
      onError() {
        errors.push('original');
      },
    };
    const app = fastify();
    app.post(
      '/rpc',
      createFastifyHandler({ procedures: { ping: procedure } }, options)
    );

    options.cors.origin = 'https://changed.example';
    options.maxBodyBytes = 1;
    options.hooks.beforeRequest = () => {
      hooks.push('changed');
      return undefined;
    };
    options.onError = () => {
      errors.push('changed');
    };

    try {
      const accepted = await app.inject({
        method: 'POST',
        url: '/rpc',
        headers: { 'content-type': 'application/json' },
        payload: {
          id: 'ping',
          input: { ok: true, pad: 'x'.repeat(32) },
        },
      });
      const rejected = await app.inject({
        method: 'POST',
        url: '/rpc',
        headers: { 'content-type': 'application/json' },
        payload: {
          id: 'ping',
          input: { ok: true, pad: 'x'.repeat(2048) },
        },
      });

      expect(accepted.statusCode).toBe(200);
      expect(accepted.headers['access-control-allow-origin']).toBe(
        'https://original.example'
      );
      expect(rejected.statusCode).toBe(413);
      expect(rejected.headers['access-control-allow-origin']).toBe(
        'https://original.example'
      );
      expect(errors).toEqual(['original']);
      expect(hooks).toEqual(['original']);
    } finally {
      await app.close();
    }
  });
});
