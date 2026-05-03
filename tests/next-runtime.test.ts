import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import { createNextRouteHandlers } from '../src/runtime/next.js';

describe('next runtime', () => {
  it('creates app router handlers for Next.js api routes', async () => {
    const handlers = createNextRouteHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      })
    );
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });
});
