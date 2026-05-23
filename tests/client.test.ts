import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createClient,
  createJoorHandler,
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
    await client.batch(
      [{ id: 'batch', input: { ok: true } }] as const,
      {
        headers: { 'x-batch': '1' },
        request: { cache: 'no-store' },
      }
    );
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
});
