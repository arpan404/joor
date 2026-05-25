import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcBodyResult,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
  RpcRequestPreflight,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import {
  createRpcBodyResultHandler,
  createRpcRequestPreflight,
} from '../rpc/dispatcher.js';
import type { RpcEnvelope } from '../rpc/protocol.js';
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
import {
  createJoorHandler,
  createJoorHandlerFor,
  createRouteStreamJoorHandler,
  createRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandler,
  createRouteUnaryJoorHandlerFor,
  type JoorFetchHandler,
} from './fetch.js';
import {
  createCorsHeaderRecord,
  createJsonHeaderRecord,
  jsonContentHeaders,
  transportResultToResponse,
  type SerializedJsonEnvelope,
  type TransportBodyResultFor,
} from './response.js';

export interface DenoServeOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TRequest extends Request = Request,
  TBody = unknown,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly port?: number;
  readonly hostname?: string;
}

export interface DenoServer {
  readonly finished: Promise<void>;
  readonly shutdown: () => Promise<void>;
  readonly ref?: () => void;
  readonly unref?: () => void;
}

export type DenoServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoServeOptions<TPlugins, TRequest, TBody> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteUnaryServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteStreamServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DenoRouteStreamRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DenoFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DenoRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DenoServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  DenoServeOptions<TPlugins, TRequest, TBody>,
  TBody,
  DenoServeOptions<TPlugins, TRequest, TBody> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type DenoRouteUnaryServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoUnaryRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteUnaryServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoRouteStreamServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoStreamRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = DenoRouteStreamServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type DenoTransportBodyResult<
  TEnvelope extends RpcEnvelope = RpcEnvelope,
> = RpcBodyResult<TEnvelope> | SerializedJsonEnvelope;
export type DenoTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type DenoRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;

export type DenoUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = DenoRouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type DenoRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;

export type DenoStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = DenoRouteStreamTransportBodyResultFor<TManifest, TBody>;
export type DenoFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type DenoRpcRequestHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type DenoTransportRequestHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type DenoRouteUnaryTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoTransportRequestHandler<TRequest>;
export type DenoUnaryRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoRouteUnaryTransportRequestHandler<TRequest>;
export type DenoRouteStreamTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoTransportRequestHandler<TRequest>;
export type DenoStreamRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoRouteStreamTransportRequestHandler<TRequest>;

type MaybePromise<TValue> = TValue | Promise<TValue>;

export type DenoTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => MaybePromise<TResult>;

export type DenoTransportBodyResultHandlerFor<TManifest extends JoorManifest> =
  <const TBody extends RpcManifestBody<TManifest>>(
    request: ContextRequestSource,
    body: TBody
  ) => MaybePromise<DenoTransportBodyResultFor<TManifest, TBody>>;

export type DenoRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<DenoRouteUnaryTransportBodyResultFor<TManifest, TBody>>;

export type DenoUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type DenoRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<DenoRouteStreamTransportBodyResultFor<TManifest, TBody>>;

export type DenoStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoRouteStreamTransportBodyResultHandlerFor<TManifest>;

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

const bodyReadFailure = (
  request: Request,
  error: object,
  extraHeaders?: Record<string, string>
): Response => {
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
    headers: createJsonHeaderRecord(extraHeaders),
  });
};

const snapshotExtraResponseHeaders = (
  headers: Record<string, string> | undefined
): Record<string, string> | undefined =>
  headers === undefined ? undefined : Object.freeze({ ...headers });

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

export function createDenoFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): DenoFetchHandler<TRequest>;
export function createDenoFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
  );
}

export function createRouteUnaryDenoFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): DenoFetchHandler<TRequest>;
export function createRouteUnaryDenoFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoFetchHandler {
  return createRouteUnaryJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const createUnaryRouteDenoFetch: typeof createRouteUnaryDenoFetch =
  createRouteUnaryDenoFetch;

export function createRouteStreamDenoFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): DenoFetchHandler<TRequest>;
export function createRouteStreamDenoFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoFetchHandler {
  return createRouteStreamJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const createStreamRouteDenoFetch: typeof createRouteStreamDenoFetch =
  createRouteStreamDenoFetch;

export function createDenoFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createDenoFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => DenoFetchHandler<TRequest>;
export function createDenoFetchFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): DenoFetchHandler<TRequest> =>
    createJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    );
}

export function createRouteUnaryDenoFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryDenoFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => DenoFetchHandler<TRequest>;
export function createRouteUnaryDenoFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): DenoFetchHandler<TRequest> =>
    createRouteUnaryJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    );
}

export const createUnaryRouteDenoFetchFor: typeof createRouteUnaryDenoFetchFor =
  createRouteUnaryDenoFetchFor;

export function createRouteStreamDenoFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRouteStreamDenoFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => DenoFetchHandler<TRequest>;
export function createRouteStreamDenoFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): DenoFetchHandler<TRequest> =>
    createRouteStreamJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    );
}

export const createStreamRouteDenoFetchFor: typeof createRouteStreamDenoFetchFor =
  createRouteStreamDenoFetchFor;

export const createDenoTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
>(
  handler: DenoTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): DenoTransportRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  const responseHeaders = snapshotExtraResponseHeaders(extraResponseHeaders);
  const bodyReadError = onBodyReadError;
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
      bodyReadError?.(error, request);
      return bodyReadFailure(request, error, responseHeaders);
    }
    return transportResultToResponse(
      await handler(source, body as TBody),
      responseHeaders
    );
  };
};

export const createDenoTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
    TBody = JsonValue,
    TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
  >(
    handler: DenoTransportBodyResultHandler<TBody, TResult>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): DenoTransportRequestHandler<TRequest> =>
    createDenoTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as DenoTransportRequestHandler<TRequest>;

export const createRouteUnaryDenoTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: DenoRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): DenoRouteUnaryTransportRequestHandler =>
  createDenoTransportRequestHandler(
    handler as DenoTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      DenoRouteUnaryTransportBodyResultFor<TManifest>
    >,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createUnaryRouteDenoTransportRequestHandler: typeof createRouteUnaryDenoTransportRequestHandler =
  createRouteUnaryDenoTransportRequestHandler;

export const createRouteUnaryDenoTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: DenoRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): DenoRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryDenoTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as DenoRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteDenoTransportRequestHandlerFor: typeof createRouteUnaryDenoTransportRequestHandlerFor =
  createRouteUnaryDenoTransportRequestHandlerFor;

export const createRouteStreamDenoTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: DenoRouteStreamTransportBodyResultHandlerFor<TManifest>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): DenoRouteStreamTransportRequestHandler =>
  createDenoTransportRequestHandler(
    handler as DenoTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      DenoRouteStreamTransportBodyResultFor<TManifest>
    >,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createStreamRouteDenoTransportRequestHandler: typeof createRouteStreamDenoTransportRequestHandler =
  createRouteStreamDenoTransportRequestHandler;

export const createRouteStreamDenoTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: DenoRouteStreamTransportBodyResultHandlerFor<TManifest>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): DenoRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamDenoTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as DenoRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteDenoTransportRequestHandlerFor: typeof createRouteStreamDenoTransportRequestHandlerFor =
  createRouteStreamDenoTransportRequestHandlerFor;

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

export const createDenoTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <
    TBody = JsonValue,
    TResult extends DenoTransportBodyResult = DenoTransportBodyResult,
  >(
    handler: DenoTransportBodyResultHandler<TBody, TResult>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): DenoTransportRequestHandler<TRequest> =>
    createDenoTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as DenoTransportRequestHandler<TRequest>;

export const createRouteUnaryDenoTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: DenoRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoRouteUnaryTransportRequestHandler =>
  createDenoTransportRequestHandlerWithPath(
    handler as DenoTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      DenoRouteUnaryTransportBodyResultFor<TManifest>
    >,
    path,
    maxBodyBytes
  );

export const createUnaryRouteDenoTransportRequestHandlerWithPath: typeof createRouteUnaryDenoTransportRequestHandlerWithPath =
  createRouteUnaryDenoTransportRequestHandlerWithPath;

export const createRouteUnaryDenoTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: DenoRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): DenoRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryDenoTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as DenoRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteDenoTransportRequestHandlerWithPathFor: typeof createRouteUnaryDenoTransportRequestHandlerWithPathFor =
  createRouteUnaryDenoTransportRequestHandlerWithPathFor;

export const createRouteStreamDenoTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: DenoRouteStreamTransportBodyResultHandlerFor<TManifest>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoRouteStreamTransportRequestHandler =>
  createDenoTransportRequestHandlerWithPath(
    handler as DenoTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      DenoRouteStreamTransportBodyResultFor<TManifest>
    >,
    path,
    maxBodyBytes
  );

export const createStreamRouteDenoTransportRequestHandlerWithPath: typeof createRouteStreamDenoTransportRequestHandlerWithPath =
  createRouteStreamDenoTransportRequestHandlerWithPath;

export const createRouteStreamDenoTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: DenoRouteStreamTransportBodyResultHandlerFor<TManifest>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): DenoRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamDenoTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as DenoRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteDenoTransportRequestHandlerWithPathFor: typeof createRouteStreamDenoTransportRequestHandlerWithPathFor =
  createRouteStreamDenoTransportRequestHandlerWithPathFor;

export function createDenoRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): DenoRpcRequestHandler<TRequest>;
export function createDenoRpcRequestHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoRpcRequestHandler {
  const handler = createRpcBodyResultHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>,
    false
  );
  return createDenoTransportRequestHandler(
    (request, body) =>
      handler(request.toRequest(), body as RpcManifestBody<TManifest>),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options?.cors),
    options?.onError as ((error: Error, request: Request) => void) | undefined
  );
}

export function createRouteUnaryDenoRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): DenoRpcRequestHandler<TRequest>;
export function createRouteUnaryDenoRpcRequestHandler<
  TManifest extends JoorManifest,
>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoRpcRequestHandler {
  return createDenoRpcRequestHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const createUnaryRouteDenoRpcRequestHandler: typeof createRouteUnaryDenoRpcRequestHandler =
  createRouteUnaryDenoRpcRequestHandler;

export function createRouteStreamDenoRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): DenoRpcRequestHandler<TRequest>;
export function createRouteStreamDenoRpcRequestHandler<
  TManifest extends JoorManifest,
>(
  manifest: TManifest,
  options?: HandlerOptions
): DenoRpcRequestHandler {
  return createDenoRpcRequestHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const createStreamRouteDenoRpcRequestHandler: typeof createRouteStreamDenoRpcRequestHandler =
  createRouteStreamDenoRpcRequestHandler;

export function createDenoRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoRpcRequestHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createDenoRpcRequestHandlerFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => DenoRpcRequestHandler<TRequest>;
export function createDenoRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): DenoRpcRequestHandler<TRequest> => {
    const options = (args[0] ?? {}) as HandlerOptions<
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >;
    const handler = createRpcBodyResultHandler(
      manifest,
      options as unknown as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >,
      false
    );
    return createDenoTransportRequestHandler(
      (request, body) =>
        handler(
          request.toRequest() as TRequest,
          body as RpcManifestBody<TManifest>
        ),
      options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
      createRpcRequestPreflight(options as unknown as HandlerOptions),
      createCorsHeaderRecord(options.cors),
      options.onError as ((error: Error, request: Request) => void) | undefined
    ) as DenoRpcRequestHandler<TRequest>;
  };
}

export function createRouteUnaryDenoRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoRpcRequestHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryDenoRpcRequestHandlerFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => DenoRpcRequestHandler<TRequest>;
export function createRouteUnaryDenoRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoRouteUnaryRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): DenoRpcRequestHandler<TRequest> =>
    createRouteUnaryDenoRpcRequestHandler(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    ) as DenoRpcRequestHandler<TRequest>;
}

export const createUnaryRouteDenoRpcRequestHandlerFor: typeof createRouteUnaryDenoRpcRequestHandlerFor =
  createRouteUnaryDenoRpcRequestHandlerFor;

export function createRouteStreamDenoRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => DenoRpcRequestHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRouteStreamDenoRpcRequestHandlerFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: DenoRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => DenoRpcRequestHandler<TRequest>;
export function createRouteStreamDenoRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: DenoRouteStreamRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): DenoRpcRequestHandler<TRequest> =>
    createRouteStreamDenoRpcRequestHandler(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    ) as DenoRpcRequestHandler<TRequest>;
}

export const createStreamRouteDenoRpcRequestHandlerFor: typeof createRouteStreamDenoRpcRequestHandlerFor =
  createRouteStreamDenoRpcRequestHandlerFor;

export function serveDeno<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): DenoServer;
export function serveDeno<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: DenoServeOptions = {}
): DenoServer {
  const fetch = createDenoRpcRequestHandler(
    manifest,
    options as unknown as DenoServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(options: {
        port: number;
        hostname: string;
        handler(request: Request): Response | Promise<Response>;
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

export function serveRouteUnaryDeno<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteUnaryServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): DenoServer;
export function serveRouteUnaryDeno<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: DenoServeOptions = {}
): DenoServer {
  return serveDeno(
    manifest,
    options as unknown as DenoRouteUnaryServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const serveUnaryRouteDeno: typeof serveRouteUnaryDeno =
  serveRouteUnaryDeno;
export const serveDenoRouteUnary: typeof serveRouteUnaryDeno =
  serveRouteUnaryDeno;
export const serveDenoUnaryRoute: typeof serveRouteUnaryDeno =
  serveRouteUnaryDeno;

export function serveRouteStreamDeno<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: DenoRouteStreamServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): DenoServer;
export function serveRouteStreamDeno<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: DenoServeOptions = {}
): DenoServer {
  return serveDeno(
    manifest,
    options as unknown as DenoRouteStreamServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const serveStreamRouteDeno: typeof serveRouteStreamDeno =
  serveRouteStreamDeno;
export const serveDenoRouteStream: typeof serveRouteStreamDeno =
  serveRouteStreamDeno;
export const serveDenoStreamRoute: typeof serveRouteStreamDeno =
  serveRouteStreamDeno;
