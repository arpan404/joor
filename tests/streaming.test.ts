import { describe, expect, it } from 'vitest';
import watchUser from './fixtures/basic-app/rpc/users/watch.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import { createJoorHandler } from '../src/index.js';

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
});
