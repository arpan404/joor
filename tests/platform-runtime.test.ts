import { describe, expect, it } from 'vitest';
import config from './fixtures/basic-app/joor.config.js';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import {
  createCloudflareWorker,
  createCloudflareWorkerFor,
  createRouteStreamCloudflareWorker,
  createRouteUnaryCloudflareWorkerFor,
} from '../src/runtime/cloudflare.js';
import {
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createRouteStreamNetlifyEdgeFunction,
  createRouteUnaryNetlifyEdgeFunctionFor,
} from '../src/runtime/netlify.js';
import {
  createRouteStreamVercelFunction,
  createRouteUnaryVercelFunctionFor,
  createVercelFunction,
} from '../src/runtime/vercel.js';
import { defineProcedure, t } from '../src/index.js';

const manifest = {
  procedures: { 'users.get': getUser },
};

const routeManifest = {
  procedures: {
    'users.get': defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ id: t.string(), tenantId: t.string() }),
      headers: t.object({ 'x-tenant-id': t.string() }),
      async handler(ctx, input) {
        return ctx.ok({
          id: input.id,
          tenantId: ctx.headers['x-tenant-id'],
        });
      },
    }),
    'users.watch': defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    }),
  },
};

const createRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 'users.get',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
    }),
  });

const createRouteUnaryRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-tenant-id': 'tenant-1',
    },
    body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
  });

const createRouteStreamRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
  });

const createWrongRouteUnaryRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
  });

const createWrongRouteStreamRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'content-type': 'application/json',
      'x-tenant-id': 'tenant-1',
    },
    body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
  });

const expectUserResponse = async (response: Response): Promise<void> => {
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.data.name).toBe('Ada');
};

const expectRouteUnaryResponse = async (response: Response): Promise<void> => {
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.data).toEqual({ id: '1', tenantId: 'tenant-1' });
};

const expectRouteStreamResponse = async (response: Response): Promise<void> => {
  const body = await response.text();
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('text/event-stream');
  expect(body).toContain('event: data');
  expect(body).toContain('"event":"updated"');
  expect(body).toContain('event: done');
};

const expectRouteKindErrorResponse = async (
  response: Response,
  id: string
): Promise<void> => {
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body).toMatchObject({
    ok: false,
    id,
    error: { code: 'NOT_FOUND', status: 404 },
  });
};

describe('platform runtime helpers', () => {
  it('dispatches through a Cloudflare Worker export object', async () => {
    const worker = createCloudflareWorker(manifest, config);
    await expectUserResponse(await worker.fetch(createRpcRequest()));
  });

  it('dispatches through a typed Cloudflare Worker export object', async () => {
    interface Env {
      accountId: string;
    }
    interface ExecutionContext {
      waitUntil(promise: Promise<unknown>): void;
    }
    const createWorker = createCloudflareWorkerFor<Env, ExecutionContext>();
    const worker = createWorker(manifest, config);

    await expectUserResponse(
      await worker.fetch(
        createRpcRequest(),
        { accountId: 'acct_1' },
        {
          waitUntil(promise) {
            promise.then(Boolean);
          },
        }
      )
    );
  });

  it('dispatches route-specific unary Cloudflare Workers through the typed fetch runtime', async () => {
    const worker = createRouteUnaryCloudflareWorkerFor()(routeManifest, config);
    await expectRouteUnaryResponse(
      await worker.fetch(createRouteUnaryRpcRequest())
    );
  });

  it('dispatches route-specific stream Cloudflare Workers through the typed fetch runtime', async () => {
    const worker = createRouteStreamCloudflareWorker(routeManifest, config);
    await expectRouteStreamResponse(
      await worker.fetch(createRouteStreamRpcRequest())
    );
  });

  it('dispatches through a Vercel fetch object', async () => {
    const vercel = createVercelFunction(manifest, config);
    await expectUserResponse(await vercel.fetch(createRpcRequest()));
  });

  it('dispatches route-specific unary Vercel functions through the typed fetch runtime', async () => {
    const vercel = createRouteUnaryVercelFunctionFor()(routeManifest, config);
    await expectRouteUnaryResponse(
      await vercel.fetch(createRouteUnaryRpcRequest())
    );
  });

  it('dispatches route-specific stream Vercel functions through the typed fetch runtime', async () => {
    const vercel = createRouteStreamVercelFunction(routeManifest, config);
    await expectRouteStreamResponse(
      await vercel.fetch(createRouteStreamRpcRequest())
    );
  });

  it('dispatches through a Netlify Edge function handler', async () => {
    const edge = createNetlifyEdgeFunction(manifest, config);
    const response = await edge(createRpcRequest(), {
      requestId: 'request-1',
    });

    expect(response).toBeInstanceOf(Response);
    await expectUserResponse(response as Response);
  });

  it('dispatches route-specific unary Netlify Edge functions through the typed fetch runtime', async () => {
    const edge = createRouteUnaryNetlifyEdgeFunctionFor()(
      routeManifest,
      config
    );
    const response = await edge(createRouteUnaryRpcRequest(), {
      requestId: 'request-1',
    });

    expect(response).toBeInstanceOf(Response);
    await expectRouteUnaryResponse(response as Response);
  });

  it('dispatches route-specific stream Netlify Edge functions through the typed fetch runtime', async () => {
    const edge = createRouteStreamNetlifyEdgeFunction(routeManifest, config);
    const response = await edge(createRouteStreamRpcRequest(), {
      requestId: 'request-1',
    });

    expect(response).toBeInstanceOf(Response);
    await expectRouteStreamResponse(response as Response);
  });

  it('rejects wrong route kinds in route-specific platform helpers', async () => {
    const unaryCloudflare = createRouteUnaryCloudflareWorkerFor()(
      routeManifest,
      config
    );
    const streamCloudflare = createRouteStreamCloudflareWorker(
      routeManifest,
      config
    );
    const unaryVercel = createRouteUnaryVercelFunctionFor()(
      routeManifest,
      config
    );
    const streamVercel = createRouteStreamVercelFunction(routeManifest, config);
    const unaryNetlify = createRouteUnaryNetlifyEdgeFunctionFor()(
      routeManifest,
      config
    );
    const streamNetlify = createRouteStreamNetlifyEdgeFunction(
      routeManifest,
      config
    );

    await expectRouteKindErrorResponse(
      await unaryCloudflare.fetch(createWrongRouteUnaryRpcRequest()),
      'users.watch'
    );
    await expectRouteKindErrorResponse(
      await streamCloudflare.fetch(createWrongRouteStreamRpcRequest()),
      'users.get'
    );
    await expectRouteKindErrorResponse(
      await unaryVercel.fetch(createWrongRouteUnaryRpcRequest()),
      'users.watch'
    );
    await expectRouteKindErrorResponse(
      await streamVercel.fetch(createWrongRouteStreamRpcRequest()),
      'users.get'
    );
    await expectRouteKindErrorResponse(
      (await unaryNetlify(createWrongRouteUnaryRpcRequest(), {
        requestId: 'request-1',
      })) as Response,
      'users.watch'
    );
    await expectRouteKindErrorResponse(
      (await streamNetlify(createWrongRouteStreamRpcRequest(), {
        requestId: 'request-1',
      })) as Response,
      'users.get'
    );
  });

  it('dispatches through a typed Netlify Edge function handler', async () => {
    interface Context {
      requestId: string;
      geo: {
        city?: string;
      };
    }
    const createEdge = createNetlifyEdgeFunctionFor<Context>();
    const edge = createEdge(manifest, config);
    const response = await edge(createRpcRequest(), {
      requestId: 'request-1',
      geo: { city: 'San Francisco' },
    });

    expect(response).toBeInstanceOf(Response);
    await expectUserResponse(response as Response);
  });
});
