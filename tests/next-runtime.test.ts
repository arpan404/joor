import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createNextRouteHandlers,
  createNextRouteHandlersFor,
  createRouteStreamNextRouteHandlers,
  createRouteUnaryNextRouteHandlersFor,
  type NextRouteContext,
} from '../src/runtime/next.js';
import { defineProcedure, t } from '../src/index.js';

describe('next runtime', () => {
  it('creates app router handlers for Next.js api routes', async () => {
    const handlers = createNextRouteHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      })
    );
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });

  it('creates context-aware handlers for dynamic Next.js route segments', async () => {
    type Params = { team: string };
    const createHandlers = createNextRouteHandlersFor<
      NextRouteContext<Params>
    >();
    const handlers = createHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/team/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/team/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      }),
      { params: Promise.resolve({ team: 'core' }) }
    );
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });

  it('creates request-aware handlers for extended Next.js requests', async () => {
    interface AppRequest extends Request {
      readonly requestId: string;
    }

    const createHandlers = createNextRouteHandlersFor<never, AppRequest>();
    const handlers = createHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/rpc' }
    );
    const request = Object.assign(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      }),
      { requestId: 'req_1' }
    ) as AppRequest;

    const response = await handlers.POST(request);
    const body = await response.json();

    expect(request.requestId).toBe('req_1');
    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });

  it('creates route-specific unary Next.js handlers through the typed fetch runtime', async () => {
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
    const handlers = createRouteUnaryNextRouteHandlersFor()(
      { procedures: { 'users.get': procedure } },
      { path: '/api/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-tenant-id': 'tenant-1',
        },
        body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({ id: '1', tenantId: 'tenant-1' });
  });

  it('creates route-specific stream Next.js handlers through the typed fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    });
    const handlers = createRouteStreamNextRouteHandlers(
      { procedures: { 'users.watch': procedure } },
      { path: '/api/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
      })
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain(
      'text/event-stream'
    );
    expect(body).toContain('event: data');
    expect(body).toContain('"event":"updated"');
    expect(body).toContain('event: done');
  });

  it('rejects wrong route kinds in route-specific Next.js handlers', async () => {
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
    const unaryHandlers = createRouteUnaryNextRouteHandlersFor()(manifest, {
      path: '/api/rpc',
    });
    const streamHandlers = createRouteStreamNextRouteHandlers(manifest, {
      path: '/api/rpc',
    });

    const unaryResponse = await unaryHandlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'stream', input: { ok: true } }),
      })
    );
    const streamResponse = await streamHandlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'unary', input: { ok: true } }),
      })
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
