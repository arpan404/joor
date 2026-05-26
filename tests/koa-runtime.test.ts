import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, expect, it } from 'vitest';
import {
  createKoaHandler,
  createRouteStreamKoaHandler,
  createRouteUnaryKoaHandlerFor,
  defineProcedure,
  t,
  type KoaContext,
  type KoaMiddleware,
} from '../src/index.js';

const listenWithKoaHandler = async (handler: KoaMiddleware) => {
  const server = createServer((request, response) => {
    const context: KoaContext = {
      req: request,
      res: response,
      ...(request.url === undefined ? {} : { originalUrl: request.url }),
    };
    Promise.resolve(handler(context, async () => undefined)).catch((error) => {
      response.statusCode = 500;
      response.end(String(error));
    });
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  return server;
};

const closeServer = async (
  server: Awaited<ReturnType<typeof listenWithKoaHandler>>
) => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

describe('koa runtime', () => {
  it('adapts Koa contexts to the Node runtime', async () => {
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
    const handler = createKoaHandler(
      { procedures: { ping: procedure } },
      { path: '/api/rpc' }
    );
    const server = await listenWithKoaHandler(handler);
    try {
      const address = server.address() as AddressInfo;
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
      await closeServer(server);
    }
  });

  it('adapts route-specific unary Koa handlers through the typed Node runtime', async () => {
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
    const handler = createRouteUnaryKoaHandlerFor()(
      { procedures: { 'users.get': procedure } },
      { path: '/api/rpc' }
    );
    const server = await listenWithKoaHandler(handler);
    try {
      const address = server.address() as AddressInfo;
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
      await closeServer(server);
    }
  });

  it('adapts route-specific stream Koa handlers through the typed Node runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    });
    const handler = createRouteStreamKoaHandler(
      { procedures: { 'users.watch': procedure } },
      { path: '/api/rpc' }
    );
    const server = await listenWithKoaHandler(handler);
    try {
      const address = server.address() as AddressInfo;
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
      await closeServer(server);
    }
  });
});
