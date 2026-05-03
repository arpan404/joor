import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcBodyResultHandler } from '../rpc/dispatcher.js';
import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
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

export interface DenoServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type DenoTransportBodyResult = RpcBodyResult | SerializedJsonEnvelope;

export type DenoTransportBodyResultHandler = (
  request: ContextRequestSource,
  body: JsonValue
) => Promise<DenoTransportBodyResult>;

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

export const createDenoFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const createDenoTransportRequestHandler = (
  handler: DenoTransportBodyResultHandler,
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

export const createDenoRpcRequestHandler = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) => {
  const handler = createRpcBodyResultHandler(manifest, options);
  return createDenoTransportRequestHandler(
    (request, body) => handler(request.toRequest(), body),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
};

export const serveDeno = (
  manifest: RpcManifest,
  options: DenoServeOptions = {}
): void => {
  const fetch = createDenoRpcRequestHandler(manifest, options);
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(options: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: fetch,
  });
};
