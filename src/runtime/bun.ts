import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcBodyResultHandler } from '../rpc/dispatcher.js';
import type { JsonValue } from '../schema/json.js';
import { readJsonRequestBody } from './body.js';
import { createJoorHandler } from './fetch.js';
import {
  transportResultToResponse,
  type SerializedJsonEnvelope,
} from './response.js';

export interface BunServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type BunTransportBodyResult = RpcBodyResult | SerializedJsonEnvelope;
export type BunTransportBodyResultHandler = (
  request: ContextRequestSource,
  body: JsonValue
) => Promise<BunTransportBodyResult>;

export const createBunFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const createBunTransportRequestHandler = (
  handler: BunTransportBodyResultHandler
): ((request: Request) => Promise<Response>) => {
  return async (request: Request): Promise<Response> => {
    let body: JsonValue;
    try {
      body = await readJsonRequestBody(request);
    } catch {
      body = {};
    }
    return transportResultToResponse(
      await handler(createFetchRequestSource(request), body)
    );
  };
};

export const createBunRpcRequestHandler = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) => {
  const handler = createRpcBodyResultHandler(manifest, options);
  return createBunTransportRequestHandler((request, body) =>
    handler(request.toRequest(), body)
  );
};

export const serveBun = (
  manifest: RpcManifest,
  options: BunServeOptions = {}
): void => {
  const fetch = createBunRpcRequestHandler(manifest, options);
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(options: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch,
  });
};
