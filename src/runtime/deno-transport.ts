import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcBodyResult,
  RpcManifestBody,
  RpcManifestStreamRouteBody,
  RpcManifestUnaryRouteBody,
  RpcRequestPreflight,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import {
  createRpcBodyResultHandler,
  createRpcRequestPreflight,
} from '../rpc/dispatcher.js';
import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type { JsonValue } from '../schema/json.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from './body.js';
import type { JoorFetchHandler } from './fetch.js';
import { jsonContentHeaders, transportResultToResponse } from './response.js';
import type {
  SerializedJsonEnvelope,
  TransportBodyResultFor,
} from './response.js';

export interface DenoServeOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> extends HandlerOptions<TPlugins> {
  port?: number;
  hostname?: string;
}

export interface DenoServer {
  readonly finished: Promise<void>;
  shutdown(): Promise<void>;
  ref?(): void;
  unref?(): void;
}

export type DenoServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = DenoServeOptions<TPlugins> & HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DenoUnaryRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = DenoServeOptionsFor<TManifest, TPlugins, TBody>;

export type DenoStreamRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = DenoServeOptionsFor<TManifest, TPlugins, TBody>;

export type DenoRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DenoUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = DenoRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DenoStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = DenoRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DenoRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type DenoUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = DenoRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type DenoStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = DenoRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type DenoServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  DenoServeOptions<TPlugins>,
  TBody
>;

export type DenoUnaryRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = DenoServeOptionsArgs<TManifest, TPlugins, TBody>;

export type DenoStreamRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = DenoServeOptionsArgs<TManifest, TPlugins, TBody>;

export type DenoTransportBodyResult = RpcBodyResult | SerializedJsonEnvelope;
export type DenoTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type DenoUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type DenoStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type DenoRpcRequestHandler = JoorFetchHandler;
export type DenoTransportRequestHandler = JoorFetchHandler;

export type DenoTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => Promise<TResult>;

export type DenoTransportBodyResultHandlerFor<TManifest extends JoorManifest> =
  <const TBody extends RpcManifestBody<TManifest>>(
    request: ContextRequestSource,
    body: TBody
  ) => Promise<DenoTransportBodyResultFor<TManifest, TBody>>;

export type DenoUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestUnaryRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<DenoUnaryRouteTransportBodyResultFor<TManifest, TBody>>;

export type DenoStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestStreamRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<DenoStreamRouteTransportBodyResultFor<TManifest, TBody>>;

const matchesPath = (url: string, path: string): boolean => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return path === '/';
  if (!url.startsWith(path, pathStart)) return false;
  const next = url[pathStart + path.length];
  return next === undefined || next === '?' || next === '#';
};

const isJsonContentType = (value: string): boolean => {
  if (value === 'application/json') return true;
  const semicolonIndex = value.indexOf(';');
  const type = semicolonIndex === -1 ? value : value.slice(0, semicolonIndex);
  const normalized = type.trim().toLowerCase();
  return normalized === 'application/json' || normalized.endsWith('+json');
};

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

const requestPathPreflight = (
  request: Request,
  path: string
): Response | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  const contentType = request.headers.get('content-type') ?? '';
  if (!isJsonContentType(contentType)) {
    const headerTrace = request.headers.get('x-request-id');
    return new Response(
      JSON.stringify({
        ok: false,
        id: '',
        traceId: headerTrace ?? 'trace-body-error',
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Content-Type must be application/json',
          status: 415,
        },
      }),
      { status: 415, headers: jsonContentHeaders }
    );
  }
  return undefined;
};

export const createDenoTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
>(
  handler: DenoTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): DenoTransportRequestHandler => {
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

export const createDenoTransportRequestHandlerWithPath = <
  TBody = JsonValue,
  TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
>(
  handler: DenoTransportBodyResultHandler<TBody, TResult>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoTransportRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  return async (request: Request): Promise<Response> => {
    const early = requestPathPreflight(request, path);
    if (early !== undefined) return early;
    const source = createFetchRequestSource(request);
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

export function createDenoRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): DenoRpcRequestHandler;
export function createDenoRpcRequestHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoRpcRequestHandler {
  const handler = createRpcBodyResultHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>,
    false
  );
  return createDenoTransportRequestHandler(
    (request, body) =>
      handler(request.toRequest(), body as RpcManifestBody<TManifest>),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options)
  );
}

export function serveDeno<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgsFor<
    TManifest,
    TPlugins,
    DenoServeOptions<TPlugins>
  >
): DenoServer;
export function serveDeno<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: DenoServeOptions = {}
): DenoServer {
  const fetch = createDenoRpcRequestHandler(
    manifest,
    options as DenoServeOptionsFor<TManifest>
  );
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(options: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): DenoServer;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  return denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: fetch,
  });
}
