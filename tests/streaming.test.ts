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
  createCompiledRuntimeState,
  executeCompiledProcedure,
} from '../src/runtime/compiled.js';

describe('streaming', () => {
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
});
