import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  type ClientRequestFactoryArgs,
  type ClientRequestInit,
  createClient,
  createManifestRouteRequest,
  createManifestRouteProtocolRequest,
  createManifestRouteStreamRequest,
  createManifestRouteStreamProtocolRequest,
  createManifestRouteStreamClient,
  createManifestRouteUnaryProtocolRequest,
  createManifestRouteUnaryClient,
  createManifestStreamRouteClient,
  createManifestUnaryRouteClient,
  createJoorHandler,
  createRouteProtocolRequest,
  createRouteRequest,
  createRouteStreamClient,
  createRouteStreamProtocolRequest,
  createRouteUnaryClient,
  createRouteUnaryProtocolRequest,
  defineProcedure,
  t,
} from '../src/index.js';
import type { JsonValue } from '../src/index.js';

type StreamTestProcedure = {
  types?: {
    input: { ok: boolean };
    output: JsonValue;
    stream: { ok: boolean };
    errors: string;
    headers: Record<string, never>;
    responseHeaders: Record<string, never>;
    auth: Record<string, never>;
    services: Record<string, never>;
  };
};

describe('client', () => {
  it('builds standalone protocol requests with optional trace ids', () => {
    const streamProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        yield input;
      },
    });
    const routeRequest = createRouteProtocolRequest<
      { protected: typeof getUser },
      'protected'
    >(
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { traceId: 'trace-1' }
    );
    const routeUnaryRequest = createRouteUnaryProtocolRequest<
      { protected: typeof getUser },
      'protected'
    >('protected', { id: '550e8400-e29b-41d4-a716-446655440000' });
    const routeStreamRequest = createRouteStreamProtocolRequest<
      { stream: typeof streamProcedure },
      'stream'
    >('stream', { ok: true });
    const manifestRouteRequest = createManifestRouteProtocolRequest(
      { procedures: { protected: getUser, stream: streamProcedure } },
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { traceId: 'trace-2' }
    );
    const manifestRouteUnaryRequest = createManifestRouteUnaryProtocolRequest(
      { procedures: { protected: getUser, stream: streamProcedure } },
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' }
    );
    const manifestRouteStreamRequest = createManifestRouteStreamProtocolRequest(
      { procedures: { protected: getUser, stream: streamProcedure } },
      'stream',
      { ok: true }
    );

    expect(routeRequest).toEqual({
      id: 'protected',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
      traceId: 'trace-1',
    });
    expect(routeUnaryRequest).toEqual({
      id: 'protected',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
    });
    expect(routeStreamRequest).toEqual({
      id: 'stream',
      input: { ok: true },
    });
    expect(manifestRouteRequest.traceId).toBe('trace-2');
    expect(manifestRouteUnaryRequest.id).toBe('protected');
    expect(manifestRouteStreamRequest.id).toBe('stream');
    expect(Object.isFrozen(routeRequest)).toBe(true);
    expect(Object.isFrozen(routeUnaryRequest)).toBe(true);
    expect(Object.isFrozen(routeStreamRequest)).toBe(true);
    expect(Object.isFrozen(manifestRouteRequest)).toBe(true);
    expect(Object.isFrozen(manifestRouteUnaryRequest)).toBe(true);
    expect(Object.isFrozen(manifestRouteStreamRequest)).toBe(true);
  });

  it('builds standalone route requests for batches', () => {
    const headers = { authorization: 'Bearer token' };
    const routeRequest = createRouteRequest<
      { protected: typeof getUser },
      'protected'
    >(
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { headers, traceId: 'trace-route' }
    );
    const manifestRouteRequest = createManifestRouteRequest(
      { procedures: { protected: getUser } },
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { headers, traceId: 'trace-manifest' }
    );

    expect(routeRequest).toEqual({
      id: 'protected',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
      traceId: 'trace-route',
      headers: { authorization: 'Bearer token' },
    });
    expect(manifestRouteRequest).toEqual({
      ...routeRequest,
      traceId: 'trace-manifest',
    });
    expect(Object.isFrozen(routeRequest)).toBe(true);
    expect(Object.isFrozen(routeRequest.headers)).toBe(true);
    expect(Object.isFrozen(manifestRouteRequest)).toBe(true);
    expect(Object.isFrozen(manifestRouteRequest.headers)).toBe(true);
    expect(Object.isFrozen(headers)).toBe(false);
  });

  it('validates manifest-aware route request ids and route kinds at runtime', () => {
    const streamProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        yield input;
      },
    });
    const manifest = {
      procedures: { protected: getUser, stream: streamProcedure },
    };

    const createAnyProtocolRequest =
      createManifestRouteProtocolRequest as unknown as (
        routeManifest: typeof manifest,
        id: string,
        input: unknown
      ) => unknown;
    const createUnaryProtocolRequest =
      createManifestRouteUnaryProtocolRequest as unknown as (
        routeManifest: typeof manifest,
        id: string,
        input: unknown
      ) => unknown;
    const createStreamProtocolRequest =
      createManifestRouteStreamProtocolRequest as unknown as (
        routeManifest: typeof manifest,
        id: string,
        input: unknown
      ) => unknown;
    const createUnaryRequest = createManifestRouteRequest as unknown as (
      routeManifest: typeof manifest,
      id: string,
      input: unknown
    ) => unknown;
    const createStreamRequest = createManifestRouteStreamRequest as unknown as (
      routeManifest: typeof manifest,
      id: string,
      input: unknown
    ) => unknown;

    expect(() =>
      createAnyProtocolRequest(manifest, 'missing', {})
    ).toThrowError('Unknown RPC route "missing"');
    expect(() =>
      createUnaryProtocolRequest(manifest, 'stream', { ok: true })
    ).toThrowError('RPC route "stream" is a stream route, expected unary');
    expect(() =>
      createStreamProtocolRequest(manifest, 'protected', {})
    ).toThrowError('RPC route "protected" is a unary route, expected stream');
    expect(() =>
      createUnaryRequest(manifest, 'stream', { ok: true })
    ).toThrowError('RPC route "stream" is a stream route, expected unary');
    expect(() =>
      createStreamRequest(manifest, 'protected', {})
    ).toThrowError('RPC route "protected" is a unary route, expected stream');
  });

  it('validates manifest client ids and route kinds at runtime', async () => {
    const streamProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        yield input;
      },
    });
    const manifest = {
      procedures: { protected: getUser, stream: streamProcedure },
    };
    const client = createClient({
      url: 'http://localhost/rpc',
      manifest,
      async fetch() {
        throw new Error('Unexpected fetch');
      },
    }) as unknown as {
      readonly call: (id: string, input: unknown) => Promise<unknown>;
      readonly request: (id: string, input: unknown) => unknown;
      readonly batch: (
        requests: readonly { readonly id: string; readonly input: unknown }[]
      ) => Promise<unknown>;
      readonly stream: (id: string, input: unknown) => AsyncIterable<unknown>;
    };

    await expect(client.call('missing', {})).rejects.toThrowError(
      'Unknown RPC route "missing"'
    );
    await expect(client.call('stream', { ok: true })).rejects.toThrowError(
      'RPC route "stream" is a stream route, expected unary'
    );
    expect(() => client.request('stream', { ok: true })).toThrowError(
      'RPC route "stream" is a stream route, expected unary'
    );
    await expect(
      client.batch([{ id: 'stream', input: { ok: true } }] as const)
    ).rejects.toThrowError(
      'RPC route "stream" is a stream route, expected unary'
    );
    expect(() => client.stream('protected', {})).toThrowError(
      'RPC route "protected" is a unary route, expected stream'
    );
  });

  it('exposes narrowed route-specific client objects at runtime', () => {
    const streamProcedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        yield input;
      },
    });
    const manifest = {
      procedures: { protected: getUser, stream: streamProcedure },
    };
    const options = {
      url: 'http://localhost/rpc',
      async fetch() {
        throw new Error('Unexpected fetch');
      },
    };

    for (const client of [
      createRouteUnaryClient({ ...options, manifest }),
      createManifestRouteUnaryClient(manifest, options),
      createManifestUnaryRouteClient(manifest, options),
    ]) {
      expect(Object.isFrozen(client)).toBe(true);
      expect(Object.keys(client).sort()).toEqual(['batch', 'call', 'request']);
      expect('stream' in client).toBe(false);
    }

    for (const client of [
      createRouteStreamClient({ ...options, manifest }),
      createManifestRouteStreamClient(manifest, options),
      createManifestStreamRouteClient(manifest, options),
    ]) {
      expect(Object.isFrozen(client)).toBe(true);
      expect(Object.keys(client)).toEqual(['stream']);
      expect('call' in client).toBe(false);
      expect('request' in client).toBe(false);
      expect('batch' in client).toBe(false);
    }
  });

  it('forwards typed trace ids through calls, requests, batches, and streams', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const bodies: JsonValue[] = [];
    const client = createClient({
      url: 'http://localhost/rpc',
      async fetch(request) {
        const body = (await request.json()) as JsonValue;
        bodies.push(body);
        if (request.headers.get('accept') === 'text/event-stream') {
          return new Response('event: data\ndata: {"ok":true}\n\nevent: done\ndata: null\n\n', {
            headers: { 'content-type': 'text/event-stream' },
          });
        }
        if (Array.isArray(body)) {
          return Response.json(
            body.map((entry) => ({
              ok: true,
              id: entry.id,
              traceId: entry.traceId ?? 'generated',
              data: { ok: true },
            }))
          );
        }
        const rpcRequest = body as { id: string; traceId?: string };
        return Response.json({
          ok: true,
          id: rpcRequest.id,
          traceId: rpcRequest.traceId ?? 'generated',
          data: { ok: true },
        });
      },
    });

    const call = await client.call<typeof procedure>(
      'call',
      { ok: true },
      { traceId: 'trace-call' }
    );
    const pending = client.request<typeof procedure>(
      'pending',
      { ok: true },
      { traceId: 'trace-pending' }
    );
    const [batch] = await client.batch([pending] as const);
    const streamEvents: JsonValue[] = [];
    for await (const event of client.stream<StreamTestProcedure>(
      'stream',
      { ok: true },
      { traceId: 'trace-stream' }
    )) {
      streamEvents.push(event);
    }

    expect(call.traceId).toBe('trace-call');
    expect(pending.traceId).toBe('trace-pending');
    expect(Object.isFrozen(pending)).toBe(true);
    expect(batch?.traceId).toBe('trace-pending');
    expect(streamEvents).toEqual([{ ok: true }]);
    expect(bodies).toEqual([
      { id: 'call', input: { ok: true }, traceId: 'trace-call' },
      [{ id: 'pending', input: { ok: true }, traceId: 'trace-pending' }],
      { id: 'stream', input: { ok: true }, traceId: 'trace-stream' },
    ]);
  });

  it('batches standalone protocol requests', async () => {
    const handler = createJoorHandler(
      { procedures: { protected: getUser } },
      config
    );
    const client = createClient<{ protected: typeof getUser }>({
      url: 'http://localhost/rpc',
      fetch: handler,
    });
    const request = createRouteUnaryProtocolRequest<
      { protected: typeof getUser },
      'protected'
    >(
      'protected',
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { traceId: 'trace-1' }
    );

    const [result] = await client.batch([request] as const);

    expect(result?.ok).toBe(true);
    expect(result?.traceId).toBe('trace-1');
  });

  it('calls a local fetch handler', async () => {
    const handler = createJoorHandler(
      { procedures: { 'users.get': getUser } },
      config
    );
    const client = createClient({
      url: 'http://localhost/rpc',
      fetch: handler,
    });

    const result = await client.call<typeof getUser>('users.get', {
      id: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.ok).toBe(true);
  });

  it('sends typed request headers', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      headers: t.object({ 'x-tenant-id': t.string() }),
      output: t.object({ tenantId: t.string() }),
      async handler(ctx) {
        return ctx.ok({ tenantId: ctx.headers['x-tenant-id'] });
      },
    });
    const handler = createJoorHandler({ procedures: { protected: procedure } });
    const client = createClient({
      url: 'http://localhost/rpc',
      fetch: handler,
    });

    const result = await client.call<typeof procedure>(
      'protected',
      { ok: true },
      { headers: { 'x-tenant-id': 'tenant-1' } }
    );

    expect(result.ok).toBe(true);
  });

  it('skips undefined configured and request headers', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      headers: t.object({
        authorization: t.optional(t.string()),
        'x-skip': t.optional(t.string()),
      }),
      output: t.object({}),
      async handler(ctx) {
        return ctx.ok({});
      },
    });
    const seen: Headers[] = [];
    const client = createClient({
      url: 'http://localhost/rpc',
      headers: {
        authorization: undefined,
        'x-base': 'base',
      },
      async fetch(request) {
        seen.push(request.headers);
        const body = await request.json();
        return Response.json(
          Array.isArray(body) ? [] : { ok: true, id: body.id, data: {} }
        );
      },
    });

    await client.call<typeof procedure>(
      'single',
      { ok: true },
      {
        headers: {
          authorization: 'Bearer request',
          'x-skip': undefined,
        },
      }
    );
    await client.batch([
      {
        id: 'batch',
        input: { ok: true },
        headers: {
          authorization: undefined,
          'x-batch': 'batch',
        },
      },
    ]);

    expect(seen[0]?.get('authorization')).toBe('Bearer request');
    expect(seen[0]?.get('x-base')).toBe('base');
    expect(seen[0]?.get('x-skip')).toBeNull();
    expect(seen[1]?.get('authorization')).toBeNull();
    expect(seen[1]?.get('x-base')).toBe('base');
    expect(seen[1]?.get('x-batch')).toBe('batch');
  });

  it('forwards request init options through calls, batches, and streams', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const seen: Request[] = [];
    const client = createClient({
      url: 'http://localhost/rpc',
      request: {
        cache: 'reload',
        credentials: 'same-origin',
      },
      async fetch(request) {
        seen.push(request);
        if (request.headers.get('accept') === 'text/event-stream') {
          return new Response('event: done\ndata: null\n\n', {
            headers: { 'content-type': 'text/event-stream' },
          });
        }
        const body = await request.json();
        return Response.json(
          Array.isArray(body)
            ? body.map((entry) => ({ ok: true, id: entry.id, data: {} }))
            : { ok: true, id: body.id, data: { ok: true } }
        );
      },
    });

    await client.call<typeof procedure>(
      'call',
      { ok: true },
      {
        request: {
          credentials: 'include',
          keepalive: true,
        },
      }
    );
    await client.batch([{ id: 'batch', input: { ok: true } }] as const, {
      headers: { 'x-batch': '1' },
      request: { cache: 'no-store' },
    });
    for await (const _event of client.stream<StreamTestProcedure>(
      'stream',
      { ok: true },
      { request: { redirect: 'manual' } }
    )) {
      void _event;
    }

    expect(seen[0]?.credentials).toBe('include');
    expect(seen[0]?.cache).toBe('reload');
    expect(seen[0]?.keepalive).toBe(true);
    expect(seen[1]?.credentials).toBe('same-origin');
    expect(seen[1]?.cache).toBe('no-store');
    expect(seen[1]?.headers.get('x-batch')).toBe('1');
    expect(seen[2]?.redirect).toBe('manual');
    expect(seen[2]?.cache).toBe('reload');
  });

  it('snapshots client options at creation time', async () => {
    const procedure = defineProcedure({
      input: t.object({}),
      output: t.object({}),
      async handler(ctx) {
        return ctx.ok({});
      },
    });
    const seen: Request[] = [];
    const request: ClientRequestInit = { cache: 'reload' };
    const options = {
      url: 'http://localhost/rpc',
      headers: { authorization: 'Bearer original' },
      request,
      async fetch(fetchRequest) {
        seen.push(fetchRequest);
        return Response.json({ ok: true, id: 'snapshot', data: {} });
      },
    } satisfies Parameters<typeof createClient>[0];
    const client = createClient(options);

    options.url = 'http://localhost/changed';
    options.headers.authorization = 'Bearer changed';
    options.request = { cache: 'no-store' };

    await client.call<typeof procedure>('snapshot', {});

    expect(Object.isFrozen(client)).toBe(true);
    expect(seen[0]?.url).toBe('http://localhost/rpc');
    expect(seen[0]?.headers.get('authorization')).toBe('Bearer original');
    expect(seen[0]?.cache).toBe('reload');
  });

  it('uses custom request factories for typed client fetches', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    interface AppRequest extends Request {
      readonly requestId: string;
    }

    const seen: AppRequest[] = [];
    const seenArgs: ClientRequestFactoryArgs[] = [];
    const callRequest: ClientRequestInit = { cache: 'reload' };
    const client = createClient<never, AppRequest>({
      url: 'http://localhost/rpc',
      createRequest(args) {
        seenArgs.push(args);
        return Object.assign(
          new Request(args.url, {
            ...args.baseRequest,
            ...args.request,
            method: 'POST',
            headers: args.headers,
            body: JSON.stringify(args.body),
          }),
          { requestId: 'req_1' }
        ) as AppRequest;
      },
      async fetch(request) {
        seen.push(request);
        const body = await request.json();
        return Response.json(
          Array.isArray(body)
            ? body.map((entry) => ({ ok: true, id: entry.id, data: {} }))
            : { ok: true, id: body.id, data: { ok: true } }
        );
      },
    });

    await client.call<typeof procedure>('call', { ok: true }, {
      request: callRequest,
    });
    await client.batch([{ id: 'batch', input: { ok: true } }] as const);

    expect(seen).toHaveLength(2);
    expect(seen[0]?.requestId).toBe('req_1');
    expect(seen[1]?.requestId).toBe('req_1');
    const firstArgs = seenArgs[0];
    const secondArgs = seenArgs[1];
    if (firstArgs === undefined || secondArgs === undefined) {
      throw new Error('Expected request factory args');
    }
    expect(Object.isFrozen(firstArgs)).toBe(true);
    expect(Object.isFrozen(firstArgs.body)).toBe(true);
    expect(firstArgs.request).not.toBe(callRequest);
    expect(Object.isFrozen(firstArgs.request)).toBe(true);
    expect(Object.isFrozen(secondArgs)).toBe(true);
    expect(Object.isFrozen(secondArgs.body)).toBe(true);
  });

  it('bounds SSE event buffering', async () => {
    const client = createClient({
      url: 'http://localhost/rpc',
      maxStreamEventBytes: 32,
      async fetch() {
        return new Response(`event: data\ndata: ${'x'.repeat(64)}`, {
          headers: { 'content-type': 'text/event-stream' },
        });
      },
    });

    const consume = async (): Promise<void> => {
      for await (const _event of client.stream<StreamTestProcedure>('stream', {
        ok: true,
      })) {
        void _event;
      }
    };

    await expect(consume()).rejects.toThrow('SSE event exceeds');
  });

  it('parses standard crlf and multiline sse data frames', async () => {
    const client = createClient({
      url: 'http://localhost/rpc',
      async fetch() {
        return new Response(
          [
            'event: data',
            'data: {',
            'data: "ok": true',
            'data: }',
            '',
            'event: done',
            'data: null',
            '',
          ].join('\r\n'),
          {
            headers: { 'content-type': 'text/event-stream; charset=utf-8' },
          }
        );
      },
    });
    const events: JsonValue[] = [];

    for await (const event of client.stream<StreamTestProcedure>('stream', {
      ok: true,
    })) {
      events.push(event);
    }

    expect(events).toEqual([{ ok: true }]);
  });

  it('throws json rpc failures returned from stream requests', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const handler = createJoorHandler({ procedures: { unary: procedure } });
    const client = createClient({
      url: 'http://localhost/rpc',
      fetch: handler,
    });

    const consume = async (): Promise<void> => {
      for await (const _event of client.stream<StreamTestProcedure>('unary', {
        ok: true,
      })) {
        void _event;
      }
    };

    await expect(consume()).rejects.toThrow('NOT_STREAMING');
  });
});
