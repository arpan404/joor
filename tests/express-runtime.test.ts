import type { AddressInfo } from 'node:net';
import express from 'express';
import { describe, expect, it } from 'vitest';
import { createExpressHandler, defineProcedure, t } from '../src/index.js';

describe('express runtime', () => {
  it('adapts mounted Express requests to the Node runtime', async () => {
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
    const app = express();
    app.use(
      '/api/rpc',
      createExpressHandler(
        { procedures: { ping: procedure } },
        { path: '/api/rpc' }
      )
    );
    const server = await new Promise<ReturnType<typeof app.listen>>(
      (resolve) => {
        const listening = app.listen(0, '127.0.0.1', () => {
          resolve(listening);
        });
      }
    );
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
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });

  it('writes configured CORS headers on successful Express responses', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const app = express();
    app.use(
      '/api/rpc',
      createExpressHandler(
        { procedures: { ping: procedure } },
        {
          path: '/api/rpc',
          cors: { origin: 'https://app.example' },
        }
      )
    );
    const server = await new Promise<ReturnType<typeof app.listen>>(
      (resolve) => {
        const listening = app.listen(0, '127.0.0.1', () => {
          resolve(listening);
        });
      }
    );
    try {
      const address = server.address() as AddressInfo;
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
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });
});
