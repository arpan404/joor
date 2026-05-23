import { describe, expect, it } from 'vitest';
import config from './fixtures/basic-app/joor.config.js';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import { createCloudflareWorker } from '../src/runtime/cloudflare.js';
import { createNetlifyEdgeFunction } from '../src/runtime/netlify.js';
import { createVercelFunction } from '../src/runtime/vercel.js';

const manifest = {
  procedures: { 'users.get': getUser },
};

const createRpcRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 'users.get',
      input: { id: '550e8400-e29b-41d4-a716-446655440000' },
    }),
  });

const expectUserResponse = async (response: Response): Promise<void> => {
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.data.name).toBe('Ada');
};

describe('platform runtime helpers', () => {
  it('dispatches through a Cloudflare Worker export object', async () => {
    const worker = createCloudflareWorker(manifest, config);
    await expectUserResponse(await worker.fetch(createRpcRequest()));
  });

  it('dispatches through a Vercel fetch object', async () => {
    const vercel = createVercelFunction(manifest, config);
    await expectUserResponse(await vercel.fetch(createRpcRequest()));
  });

  it('dispatches through a Netlify Edge function handler', async () => {
    const edge = createNetlifyEdgeFunction(manifest, config);
    const response = await edge(createRpcRequest(), {
      requestId: 'request-1',
    });

    expect(response).toBeInstanceOf(Response);
    await expectUserResponse(response as Response);
  });
});
