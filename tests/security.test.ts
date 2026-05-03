import { describe, expect, it } from 'vitest';
import {
  createAuthPolicy,
  createJoorHandler,
  defineProcedure,
  t,
} from '../src/index.js';

const postJson = (
  body: string,
  headers: Record<string, string> = {}
): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body,
  });

describe('security defaults', () => {
  it('rejects request bodies over the configured limit', async () => {
    const echo = defineProcedure({
      input: t.object({ value: t.string() }),
      output: t.object({ value: t.string() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const handler = createJoorHandler(
      { procedures: { echo } },
      { maxBodyBytes: 32 }
    );

    const response = await handler(
      postJson(JSON.stringify({ id: 'echo', input: { value: 'x'.repeat(64) } }))
    );
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('does not trust forwarded rate-limit identity headers by default', async () => {
    const limited = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      meta: {
        rateLimit: {
          limit: 1,
          window: '1m',
        },
      },
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const handler = createJoorHandler({
      procedures: { secureLimited: limited },
    });

    const first = await handler(
      postJson(JSON.stringify({ id: 'secureLimited', input: { ok: true } }), {
        'x-forwarded-for': '203.0.113.1',
      })
    );
    const second = await handler(
      postJson(JSON.stringify({ id: 'secureLimited', input: { ok: true } }), {
        'x-forwarded-for': '203.0.113.2',
      })
    );
    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(firstBody.ok).toBe(true);
    expect(secondBody.ok).toBe(false);
    expect(secondBody.error.code).toBe('RATE_LIMITED');
  });

  it('can explicitly trust proxy headers for rate-limit identity', async () => {
    const limited = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      meta: {
        rateLimit: {
          limit: 1,
          window: '1m',
        },
      },
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const handler = createJoorHandler(
      { procedures: { proxyLimited: limited } },
      { rateLimit: { trustProxy: true } }
    );

    const first = await handler(
      postJson(JSON.stringify({ id: 'proxyLimited', input: { ok: true } }), {
        'x-forwarded-for': '203.0.113.10',
      })
    );
    const second = await handler(
      postJson(JSON.stringify({ id: 'proxyLimited', input: { ok: true } }), {
        'x-forwarded-for': '203.0.113.11',
      })
    );
    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(firstBody.ok).toBe(true);
    expect(secondBody.ok).toBe(true);
  });

  it('keys default query cache entries by auth and headers', async () => {
    const auth = createAuthPolicy({
      name: 'subject',
      authenticate(ctx) {
        const subject = ctx.rawHeaders.get('authorization');
        if (subject === null) {
          return ctx.error('UNAUTHORIZED', { message: 'Missing subject' });
        }
        return { subject };
      },
    });
    const cached = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ subject: t.string() }),
      auth,
      meta: {
        kind: 'query',
        cache: {
          ttl: '1m',
        },
      },
      async handler(ctx) {
        return ctx.ok({ subject: ctx.auth.subject });
      },
    });
    const handler = createJoorHandler({ procedures: { secureCached: cached } });
    const body = JSON.stringify({
      id: 'secureCached',
      input: { id: 'same-input' },
    });

    const first = await handler(postJson(body, { authorization: 'subject-a' }));
    const second = await handler(
      postJson(body, { authorization: 'subject-b' })
    );
    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(firstBody.ok).toBe(true);
    expect(secondBody.ok).toBe(true);
    expect(firstBody.data.subject).toBe('subject-a');
    expect(secondBody.data.subject).toBe('subject-b');
  });

  it('does not emit wildcard CORS headers when origin is omitted', async () => {
    const handler = createJoorHandler(
      { procedures: {} },
      { cors: { methods: ['POST', 'OPTIONS'] } }
    );
    const response = await handler(
      new Request('http://localhost/rpc', { method: 'OPTIONS' })
    );

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
  });
});
