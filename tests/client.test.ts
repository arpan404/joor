import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import { createClient, createJoorHandler } from '../src/index.js';

describe('client', () => {
  it('calls a local fetch handler', async () => {
    const handler = createJoorHandler({ procedures: { 'users.get': getUser } });
    const client = createClient({
      url: 'http://localhost/rpc',
      fetch: handler,
    });

    const result = await client.call<typeof getUser>('users.get', {
      id: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.ok).toBe(true);
  });
});
