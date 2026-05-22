import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  RpcRequestPreflight,
  RpcBodyResult,
  RpcManifestBody,
} from '../rpc/dispatcher.js';
import {
  createRpcBodyResultHandler,
  createRpcRequestPreflight,
} from '../rpc/dispatcher.js';
import type { JsonValue } from '../schema/json.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
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
export type BunTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => Promise<TResult>;

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

export const createBunFetch = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const createBunTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
>(
  handler: BunTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): ((request: Request) => Promise<Response>) => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  const requestPreflight =
    preflight === false
      ? undefined
      : (preflight ?? createRpcRequestPreflight());
  return async (request: Request): Promise<Response> => {
    const source = createFetchRequestSource(request);
    const early = requestPreflight?.(source);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
    return transportResultToResponse(await handler(source, body as TBody));
  };
};

export const createBunRpcRequestHandler = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) => {
  const handler = createRpcBodyResultHandler(manifest, options, false);
  return createBunTransportRequestHandler(
    (request, body) =>
      handler(request.toRequest(), body as RpcManifestBody<TManifest>),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options)
  );
};

export const serveBun = <TManifest extends JoorManifest>(
  manifest: TManifest,
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
