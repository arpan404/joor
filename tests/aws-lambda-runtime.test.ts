import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import {
  createAwsLambdaHandler,
  createAwsLambdaRestApiHandler,
  createRouteStreamAwsLambdaHandler,
  createRouteStreamAwsLambdaRestApiHandler,
  createRouteUnaryAwsLambdaHandlerFor,
  createRouteUnaryAwsLambdaRestApiHandler,
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

  it('adapts route-specific HTTP API handlers through unary fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ id: t.string(), header: t.string() }),
      handler(ctx, input) {
        return ctx.ok({
          id: input.id,
          header: ctx.rawHeaders.get('x-route') ?? '',
        });
      },
    });
    const handler = createRouteUnaryAwsLambdaHandlerFor()(
      { procedures: { 'users.get': procedure } },
      { path: '/api/rpc' }
    );

    const response = await handler({
      rawPath: '/api/rpc',
      headers: {
        host: 'api.example',
        'content-type': 'application/json',
        'x-route': 'unary',
      },
      body: JSON.stringify({ id: 'users.get', input: { id: '1' } }),
      requestContext: {
        http: { method: 'POST' },
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.body ?? '{}');
    expect(payload.data).toEqual({ id: '1', header: 'unary' });
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

  it('adapts route-specific REST API handlers through stream fetch runtime', async () => {
    const procedure = defineProcedure({
      input: t.object({ userId: t.string() }),
      stream: t.object({ userId: t.string(), event: t.string() }),
      async *handler(_ctx, input) {
        yield { userId: input.userId, event: 'updated' };
      },
    });
    const handler = createRouteStreamAwsLambdaRestApiHandler(
      { procedures: { 'users.watch': procedure } },
      { path: '/api/rpc' }
    );

    const response = await handler({
      path: '/api/rpc',
      httpMethod: 'POST',
      headers: {
        host: 'rest.example',
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers?.['content-type']).toContain('text/event-stream');
    expect(response.body).toContain('event: data');
    expect(response.body).toContain('"event":"updated"');
    expect(response.body).toContain('event: done');
  });

  it('rejects wrong route kinds in route-specific Lambda handlers', async () => {
    const unary = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        return ctx.ok(input);
      },
    });
    const stream = defineProcedure({
      input: t.object({ ok: t.boolean() }),
      stream: t.object({ ok: t.boolean() }),
      async *handler(_ctx, input) {
        yield input;
      },
    });
    const routeManifest = { procedures: { ping: unary, watch: stream } };
    const unaryHttpHandler = createRouteUnaryAwsLambdaHandlerFor()(
      routeManifest,
      { path: '/api/rpc' }
    );
    const streamHttpHandler = createRouteStreamAwsLambdaHandler(routeManifest, {
      path: '/api/rpc',
    });
    const unaryRestHandler = createRouteUnaryAwsLambdaRestApiHandler(
      routeManifest,
      { path: '/api/rpc' }
    );
    const streamRestHandler = createRouteStreamAwsLambdaRestApiHandler(
      routeManifest,
      { path: '/api/rpc' }
    );

    const wrongUnaryHttpResponse = await unaryHttpHandler({
      rawPath: '/api/rpc',
      headers: { host: 'api.example', 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'watch', input: { ok: true } }),
      requestContext: { http: { method: 'POST' } },
    });
    const wrongStreamHttpResponse = await streamHttpHandler({
      rawPath: '/api/rpc',
      headers: {
        host: 'api.example',
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: 'ping', input: { ok: true } }),
      requestContext: { http: { method: 'POST' } },
    });
    const wrongUnaryRestResponse = await unaryRestHandler({
      path: '/api/rpc',
      httpMethod: 'POST',
      headers: { host: 'rest.example', 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'watch', input: { ok: true } }),
    });
    const wrongStreamRestResponse = await streamRestHandler({
      path: '/api/rpc',
      httpMethod: 'POST',
      headers: {
        host: 'rest.example',
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: 'ping', input: { ok: true } }),
    });

    expect(wrongUnaryHttpResponse.statusCode).toBe(200);
    expect(JSON.parse(wrongUnaryHttpResponse.body ?? '{}')).toMatchObject({
      ok: false,
      id: 'watch',
      error: { code: 'NOT_FOUND', status: 404 },
    });
    expect(wrongStreamHttpResponse.statusCode).toBe(200);
    expect(JSON.parse(wrongStreamHttpResponse.body ?? '{}')).toMatchObject({
      ok: false,
      id: 'ping',
      error: { code: 'NOT_FOUND', status: 404 },
    });
    expect(wrongUnaryRestResponse.statusCode).toBe(200);
    expect(JSON.parse(wrongUnaryRestResponse.body ?? '{}')).toMatchObject({
      ok: false,
      id: 'watch',
      error: { code: 'NOT_FOUND', status: 404 },
    });
    expect(wrongStreamRestResponse.statusCode).toBe(200);
    expect(JSON.parse(wrongStreamRestResponse.body ?? '{}')).toMatchObject({
      ok: false,
      id: 'ping',
      error: { code: 'NOT_FOUND', status: 404 },
    });
  });
});
