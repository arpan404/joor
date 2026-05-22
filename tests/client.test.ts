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
