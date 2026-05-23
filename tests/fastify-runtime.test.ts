import type { AddressInfo } from 'node:net';
import fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { createFastifyHandler, defineProcedure, t } from '../src/index.js';

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
});
