import { describe, expect, it } from 'vitest';
import watchUser from './fixtures/basic-app/rpc/users/watch.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createFetchRequestSource,
  createJoorHandler,
  defineProcedure,
  t,
} from '../src/index.js';
import {
  compiledUncachedExecutionState,
  createCompiledRpcHandler,
  createCompiledRuntimeState,
  executeCompiledProcedure,
} from '../src/runtime/compiled.js';

describe('streaming', () => {
  const streamEvents = async function* (ok: boolean): AsyncIterable<{
    ok: boolean;
  }> {
    yield { ok };
  };

  it('emits typed sse events', async () => {
    const handler = createJoorHandler(
      {
        procedures: { 'users.watch': watchUser },
      },
      config
    );
    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'users.watch', input: { userId: '1' } }),
      })
    );
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(text).toContain('event: data');
    expect(text).toContain('event: done');
  });

  it('applies cors headers to typed sse responses', async () => {
    const streamingProcedure = defineProcedure({
      input: t.object({}),
      stream: t.object({ ok: t.boolean() }),
      async *handler() {
        yield { ok: true };
      },
    });
    const handler = createJoorHandler(
      {
        procedures: { 'events.watch': streamingProcedure },
      },
      { cors: { origin: 'https://app.example' } }
    );
    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'events.watch', input: {} }),
      })
    );
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'https://app.example'
    );
    expect(text).toContain('event: data');
    expect(text).toContain('event: done');
  });

  it('accepts async stream factories', async () => {
    const streamingProcedure = defineProcedure({
      input: t.object({}),
      stream: t.object({ ok: t.boolean() }),
      async handler() {
        return streamEvents(true);
      },
    });
    const handler = createJoorHandler({
      procedures: { 'events.watch': streamingProcedure },
    });
    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'events.watch', input: {} }),
      })
    );
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(text).toContain('event: data');
    expect(text).toContain('"ok":true');
    expect(text).toContain('event: done');
  });

  it('emits compiled sse error events when streams throw', async () => {
    const throwingStream = defineProcedure({
      input: t.object({}),
      stream: t.object({ ok: t.boolean() }),
      async *handler() {
        yield { ok: true };
        throw new Error('stream exploded');
      },
    });
    const request = new Request('http://localhost/rpc', {
      method: 'POST',
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
    });
    const runtimeState = createCompiledRuntimeState();
    const response = await executeCompiledProcedure(
      'users.throw',
      throwingStream,
      { id: 'users.throw', input: {} },
      createFetchRequestSource(request),
      {},
      runtimeState.runtime,
      compiledUncachedExecutionState,
      false
    );

    if (!(response instanceof Response)) {
      throw new Error('Expected compiled stream response');
    }
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(text).toContain('event: error');
    expect(text).toContain('INTERNAL_ERROR');
    expect(text).toContain('stream exploded');
  });

  it('applies cors headers to compiled sse responses', async () => {
    const streamingProcedure = defineProcedure({
      input: t.object({}),
      stream: t.object({ ok: t.boolean() }),
      async *handler() {
        yield { ok: true };
      },
    });
    const handler = createCompiledRpcHandler(
      (rpcRequest, request, services, runtime, state, serialize) =>
        executeCompiledProcedure(
          rpcRequest.id,
          streamingProcedure,
          rpcRequest,
          request,
          services,
          runtime,
          state,
          serialize
        ),
      { cors: { origin: 'https://app.example' } }
    );
    const response = await handler(
      new Request('http://localhost/rpc', {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: 'events.watch', input: {} }),
      })
    );
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'https://app.example'
    );
    expect(text).toContain('event: data');
    expect(text).toContain('event: done');
  });

  it('accepts async stream factories in compiled dispatch', async () => {
    const streamingProcedure = defineProcedure({
      input: t.object({}),
      stream: t.object({ ok: t.boolean() }),
      async handler() {
        return streamEvents(true);
      },
    });
    const request = new Request('http://localhost/rpc', {
      method: 'POST',
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
    });
    const runtimeState = createCompiledRuntimeState();
    const response = await executeCompiledProcedure(
      'events.watch',
      streamingProcedure,
      { id: 'events.watch', input: {} },
      createFetchRequestSource(request),
      {},
      runtimeState.runtime,
      compiledUncachedExecutionState,
      false
    );

    if (!(response instanceof Response)) {
      throw new Error('Expected compiled stream response');
    }
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(text).toContain('event: data');
    expect(text).toContain('"ok":true');
    expect(text).toContain('event: done');
  });
});
