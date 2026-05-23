import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import {
  createAwsLambdaHandler,
  createAwsLambdaRestApiHandler,
  defineProcedure,
  t,
} from '../src/index.js';

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

  it('adapts API Gateway REST API v1 events to the fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({
        ok: t.boolean(),
        cookie: t.string(),
        query: t.array(t.string()),
      }),
      async handler(ctx, input) {
        const url = new URL(ctx.request.url);
        return ctx.ok({
          ok: input.ok,
          cookie: ctx.rawHeaders.get('cookie') ?? '',
          query: url.searchParams.getAll('tag'),
        });
      },
    });
    const handler = createAwsLambdaRestApiHandler(
      { procedures: { ping: procedure } },
      {
        path: '/api/rpc',
        cors: { origin: 'https://app.example' },
      }
    );

    const response = await handler({
      path: '/api/rpc',
      httpMethod: 'POST',
      headers: {
        host: 'rest.example',
        'content-type': 'application/json',
      },
      multiValueHeaders: {
        cookie: ['sid=123', 'theme=light'],
      },
      queryStringParameters: {
        tag: 'stale',
      },
      multiValueQueryStringParameters: {
        tag: ['one', 'two'],
      },
      body: JSON.stringify({ id: 'ping', input: { ok: true } }),
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers?.['access-control-allow-origin']).toBe(
      'https://app.example'
    );
    const payload = JSON.parse(response.body ?? '{}');
    expect(payload.ok).toBe(true);
    expect(payload.data).toEqual({
      ok: true,
      cookie: 'sid=123; theme=light',
      query: ['one', 'two'],
    });
  });
});
