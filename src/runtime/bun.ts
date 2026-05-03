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
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  readJsonRequestBody,
} from './body.js';
import { createJoorHandler } from './fetch.js';
import {
  jsonContentHeaders,
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

const bodyReadFailure = (request: Request, error: object): Response => {
  const payloadTooLarge = isBodySizeLimitError(error);
  const status = payloadTooLarge ? 413 : 400;
  const body = {
    ok: false,
    id: '',
    traceId: request.headers.get('x-request-id') ?? 'trace-body-error',
    error: {
      code: payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      message: payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status,
    },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonContentHeaders,
  });
};

export const createBunFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const createBunTransportRequestHandler = (
  handler: BunTransportBodyResultHandler,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): ((request: Request) => Promise<Response>) => {
  return async (request: Request): Promise<Response> => {
    let body: JsonValue;
    try {
      body = await readJsonRequestBody(request, maxBodyBytes);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
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
  return createBunTransportRequestHandler(
    (request, body) => handler(request.toRequest(), body),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
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
