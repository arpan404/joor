import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { createAwsLambdaHandler, defineProcedure, t } from '../src/index.js';

describe('aws lambda runtime', () => {
  it('adapts API Gateway HTTP API events to the fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean(), cookie: t.string() }),
      async handler(ctx, input) {
        return ctx.ok({
          ok: input.ok,
          cookie: ctx.rawHeaders.get('cookie') ?? '',
        });
      },
    });
    const handler = createAwsLambdaHandler(
      { procedures: { ping: procedure } },
      {
        path: '/api/rpc',
        cors: { origin: 'https://app.example' },
      }
    );
    const body = JSON.stringify({ id: 'ping', input: { ok: true } });

    const response = await handler({
      rawPath: '/api/rpc',
      rawQueryString: '',
      headers: {
        host: 'api.example',
        'content-type': 'application/json',
      },
      cookies: ['sid=123', 'theme=light'],
      body: Buffer.from(body).toString('base64'),
      isBase64Encoded: true,
      requestContext: {
        http: { method: 'POST' },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.isBase64Encoded).toBe(false);
    expect(response.headers?.['content-type']).toBe('application/json');
    expect(response.headers?.['access-control-allow-origin']).toBe(
      'https://app.example'
    );
    const payload = JSON.parse(response.body ?? '{}');
    expect(payload.ok).toBe(true);
    expect(payload.data).toEqual({
      ok: true,
      cookie: 'sid=123; theme=light',
    });
  });

  it('handles lambda preflight requests', async () => {
    const handler = createAwsLambdaHandler(
      { procedures: {} },
      {
        path: '/api/rpc',
        cors: { origin: 'https://app.example' },
      }
    );

    const response = await handler({
      rawPath: '/api/rpc',
      headers: { host: 'api.example' },
      requestContext: {
        http: { method: 'OPTIONS' },
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.headers?.['access-control-allow-origin']).toBe(
      'https://app.example'
    );
  });
});
