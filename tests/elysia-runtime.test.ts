import { describe, expect, it } from 'vitest';
import {
  createElysiaHandler,
  defineProcedure,
  t,
  type ElysiaContext,
} from '../src/index.js';

describe('elysia runtime', () => {
  it('adapts Elysia contexts to the fetch runtime', async () => {
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
    const handler = createElysiaHandler(
      { procedures: { ping: procedure } },
      { path: '/api/rpc' }
    );
    const context: ElysiaContext = {
      request: new Request('https://example.com/api/rpc', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      }),
    };
    const response = await handler(context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      id: 'ping',
      traceId: expect.any(String),
      data: { ok: true, tenantId: 'tenant-1' },
    });
  });
});
