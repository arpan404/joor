import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import config from './fixtures/basic-app/joor.config.js';
import {
  createNextRouteHandlers,
  createNextRouteHandlersFor,
  type NextRouteContext,
} from '../src/runtime/next.js';

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

  it('creates context-aware handlers for dynamic Next.js route segments', async () => {
    type Params = { team: string };
    const createHandlers = createNextRouteHandlersFor<
      NextRouteContext<Params>
    >();
    const handlers = createHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/team/rpc' }
    );

    const response = await handlers.POST(
      new Request('http://localhost/api/team/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      }),
      { params: Promise.resolve({ team: 'core' }) }
    );
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });

  it('creates request-aware handlers for extended Next.js requests', async () => {
    interface AppRequest extends Request {
      readonly requestId: string;
    }

    const createHandlers = createNextRouteHandlersFor<never, AppRequest>();
    const handlers = createHandlers(
      { procedures: { 'users.get': getUser } },
      { ...config, path: '/api/rpc' }
    );
    const request = Object.assign(
      new Request('http://localhost/api/rpc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'users.get',
          input: { id: '550e8400-e29b-41d4-a716-446655440000' },
        }),
      }),
      { requestId: 'req_1' }
    ) as AppRequest;

    const response = await handlers.POST(request);
    const body = await response.json();

    expect(request.requestId).toBe('req_1');
    expect(body.ok).toBe(true);
    expect(body.data.name).toBe('Ada');
  });
});
