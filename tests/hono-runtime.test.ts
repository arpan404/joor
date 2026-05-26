import { describe, expect, it } from 'vitest';
import {
  createHonoHandler,
  createRouteStreamHonoHandler,
  createRouteUnaryHonoHandlerFor,
  defineProcedure,
  t,
  type HonoContext,
} from '../src/index.js';

const createContext = (request: Request): HonoContext => ({
  req: { raw: request },
});

describe('hono runtime', () => {
  it('adapts Hono contexts to the fetch runtime', async () => {
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
    const handler = createHonoHandler(
      { procedures: { ping: procedure } },
      { path: '/api/rpc' }
    );
    const context = createContext(
      new Request('https://edge.example/api/rpc', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      })
    );

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

  it('adapts route-specific unary Hono handlers through the typed fetch runtime', async () => {
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
    const handler = createRouteUnaryHonoHandlerFor()(
      { procedures: { 'users.get': procedure } },
      { path: '/api/rpc' }
    );
    const context = createContext(
      new Request('https://edge.example/api/rpc', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );

    const response = await handler(context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({ id: '1', tenantId: 'tenant-1' });
  });

  it('adapts route-specific stream Hono handlers through the typed fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    });
    const handler = createRouteStreamHonoHandler(
      { procedures: { 'users.watch': procedure } },
      { path: '/api/rpc' }
    );
    const context = createContext(
      new Request('https://edge.example/api/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
      })
    );

    const response = await handler(context);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain(
      'text/event-stream'
    );
    expect(body).toContain('event: data');
    expect(body).toContain('"event":"updated"');
    expect(body).toContain('event: done');
  });

  it('rejects wrong route kinds in route-specific Hono handlers', async () => {
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
    const unaryHandler = createRouteUnaryHonoHandlerFor()(manifest, {
      path: '/api/rpc',
    });
    const streamHandler = createRouteStreamHonoHandler(manifest, {
      path: '/api/rpc',
    });

    const unaryResponse = await unaryHandler(
      createContext(
        new Request('https://edge.example/api/rpc', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: 'stream', input: { ok: true } }),
        })
      )
    );
    const streamResponse = await streamHandler(
      createContext(
        new Request('https://edge.example/api/rpc', {
          method: 'POST',
          headers: {
            accept: 'text/event-stream',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ id: 'unary', input: { ok: true } }),
        })
      )
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
  });
});
