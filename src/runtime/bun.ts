import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcRequestPreflight,
  RpcBodyResult,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamHandlerOptionsArgs,
  RpcManifestRouteStreamHandlerOptionsArgsFor,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryHandlerOptionsArgs,
  RpcManifestRouteUnaryHandlerOptionsArgsFor,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import {
  createRpcBodyResultHandler,
  createRpcRequestPreflight,
  createRouteStreamRpcBodyResultHandler,
  createRouteUnaryRpcBodyResultHandler,
} from '../rpc/dispatcher.js';
import type { RpcEnvelope } from '../rpc/protocol.js';
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
  transportResultToResponse,
  type RouteStreamTransportBodyResultFor,
  type RouteUnaryTransportBodyResultFor,
  type SerializedJsonEnvelope,
  type TransportBodyResultFor,
} from './response.js';

export interface BunServeOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TRequest extends Request = Request,
  TBody = unknown,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly port?: number;
  readonly hostname?: string;
}

export interface BunServer {
  readonly hostname?: string;
  readonly port?: number;
  readonly url?: URL;
  readonly stop: (force?: boolean) => void;
  readonly ref?: () => void;
  readonly unref?: () => void;
}

export type BunServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = BunServeOptions<TPlugins, TRequest, TBody> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunServeOptions<TPlugins, TRequest, TBody> &
  RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunServeOptions<TPlugins, TRequest, TBody> &
  RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunRouteStreamRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type BunServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  BunServeOptions<TPlugins, TRequest, TBody>,
  TBody,
  BunServeOptions<TPlugins, TRequest, TBody> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type BunRouteUnaryServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  BunServeOptions<TPlugins, TRequest, TBody>,
  TBody,
  BunServeOptions<TPlugins, TRequest, TBody>,
  TRequest
>;

export type BunUnaryRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = BunRouteUnaryServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  BunServeOptions<TPlugins, TRequest, TBody>,
  TBody,
  BunServeOptions<TPlugins, TRequest, TBody>,
  TRequest
>;

export type BunStreamRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = BunRouteStreamServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunTransportBodyResult<
  TEnvelope extends RpcEnvelope = RpcEnvelope,
> = RpcBodyResult<TEnvelope> | SerializedJsonEnvelope;
type MaybePromise<TValue> = TValue | Promise<TValue>;
export type BunTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type BunRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type BunUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = BunRouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type BunRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RouteStreamTransportBodyResultFor<TManifest, TBody>;
export type BunStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = BunRouteStreamTransportBodyResultFor<TManifest, TBody>;
export type BunFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type BunRpcRequestHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type BunTransportRequestHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;
export type BunRouteUnaryTransportRequestHandler<
  TRequest extends Request = Request,
> = BunTransportRequestHandler<TRequest>;
export type BunUnaryRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = BunRouteUnaryTransportRequestHandler<TRequest>;
export type BunRouteStreamTransportRequestHandler<
  TRequest extends Request = Request,
> = BunTransportRequestHandler<TRequest>;
export type BunStreamRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = BunRouteStreamTransportRequestHandler<TRequest>;

export type BunTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => MaybePromise<TResult>;

export type BunTransportBodyResultHandlerFor<TManifest extends JoorManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<BunTransportBodyResultFor<TManifest, TBody>>;

export type BunRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<BunRouteUnaryTransportBodyResultFor<TManifest, TBody>>;

export type BunUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = BunRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type BunRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<BunRouteStreamTransportBodyResultFor<TManifest, TBody>>;

export type BunStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = BunRouteStreamTransportBodyResultHandlerFor<TManifest>;

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

export function createBunFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): BunFetchHandler<TRequest>;
export function createBunFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): BunFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
}

export function createRouteUnaryBunFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): BunFetchHandler<TRequest>;
export function createRouteUnaryBunFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): BunFetchHandler {
  return createRouteUnaryJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const createUnaryRouteBunFetch: typeof createRouteUnaryBunFetch =
  createRouteUnaryBunFetch;

export const createUnaryBunFetch: typeof createRouteUnaryBunFetch =
  createRouteUnaryBunFetch;

export function createRouteStreamBunFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): BunFetchHandler<TRequest>;
export function createRouteStreamBunFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): BunFetchHandler {
  return createRouteStreamJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const createStreamRouteBunFetch: typeof createRouteStreamBunFetch =
  createRouteStreamBunFetch;

export const createStreamBunFetch: typeof createRouteStreamBunFetch =
  createRouteStreamBunFetch;

export function createBunFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => BunFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createBunFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => BunFetchHandler<TRequest>;
export function createBunFetchFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): BunFetchHandler<TRequest> =>
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

export function createRouteUnaryBunFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => BunFetchHandler<RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryBunFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => BunFetchHandler<TRequest>;
export function createRouteUnaryBunFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): BunFetchHandler<TRequest> =>
    createRouteUnaryJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    );
}

export const createUnaryRouteBunFetchFor: typeof createRouteUnaryBunFetchFor =
  createRouteUnaryBunFetchFor;

export const createUnaryBunFetchFor: typeof createRouteUnaryBunFetchFor =
  createRouteUnaryBunFetchFor;

export function createRouteStreamBunFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => BunFetchHandler<RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>>;
export function createRouteStreamBunFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => BunFetchHandler<TRequest>;
export function createRouteStreamBunFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): BunFetchHandler<TRequest> =>
    createRouteStreamJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    );
}

export const createStreamRouteBunFetchFor: typeof createRouteStreamBunFetchFor =
  createRouteStreamBunFetchFor;

export const createStreamBunFetchFor: typeof createRouteStreamBunFetchFor =
  createRouteStreamBunFetchFor;

export const createBunTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
>(
  handler: BunTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): BunTransportRequestHandler => {
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

export const createBunTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
    TBody = JsonValue,
    TResult extends BunTransportBodyResult = BunTransportBodyResult,
  >(
    handler: BunTransportBodyResultHandler<TBody, TResult>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): BunTransportRequestHandler<TRequest> =>
    createBunTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as BunTransportRequestHandler<TRequest>;

export const createRouteUnaryBunTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: BunRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): BunRouteUnaryTransportRequestHandler =>
  createBunTransportRequestHandler(
    handler as BunTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      BunRouteUnaryTransportBodyResultFor<TManifest>
    >,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createUnaryRouteBunTransportRequestHandler: typeof createRouteUnaryBunTransportRequestHandler =
  createRouteUnaryBunTransportRequestHandler;

export const createRouteUnaryBunTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: BunRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): BunRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryBunTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as BunRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteBunTransportRequestHandlerFor: typeof createRouteUnaryBunTransportRequestHandlerFor =
  createRouteUnaryBunTransportRequestHandlerFor;

export const createRouteStreamBunTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: BunRouteStreamTransportBodyResultHandlerFor<TManifest>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): BunRouteStreamTransportRequestHandler =>
  createBunTransportRequestHandler(
    handler as BunTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      BunRouteStreamTransportBodyResultFor<TManifest>
    >,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createStreamRouteBunTransportRequestHandler: typeof createRouteStreamBunTransportRequestHandler =
  createRouteStreamBunTransportRequestHandler;

export const createRouteStreamBunTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: BunRouteStreamTransportBodyResultHandlerFor<TManifest>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): BunRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamBunTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as BunRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteBunTransportRequestHandlerFor: typeof createRouteStreamBunTransportRequestHandlerFor =
  createRouteStreamBunTransportRequestHandlerFor;

export const createBunTransportRequestHandlerWithPath = <
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
>(
  handler: BunTransportBodyResultHandler<TBody, TResult>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): BunTransportRequestHandler =>
  createBunTransportRequestHandler(
    handler,
    maxBodyBytes,
    createRpcRequestPreflight({ path })
  );

export const createBunTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <
    TBody = JsonValue,
    TResult extends BunTransportBodyResult = BunTransportBodyResult,
  >(
    handler: BunTransportBodyResultHandler<TBody, TResult>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): BunTransportRequestHandler<TRequest> =>
    createBunTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as BunTransportRequestHandler<TRequest>;

export const createRouteUnaryBunTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: BunRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): BunRouteUnaryTransportRequestHandler =>
  createBunTransportRequestHandlerWithPath(
    handler as BunTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      BunRouteUnaryTransportBodyResultFor<TManifest>
    >,
    path,
    maxBodyBytes
  );

export const createUnaryRouteBunTransportRequestHandlerWithPath: typeof createRouteUnaryBunTransportRequestHandlerWithPath =
  createRouteUnaryBunTransportRequestHandlerWithPath;

export const createRouteUnaryBunTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: BunRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): BunRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryBunTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as BunRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteBunTransportRequestHandlerWithPathFor: typeof createRouteUnaryBunTransportRequestHandlerWithPathFor =
  createRouteUnaryBunTransportRequestHandlerWithPathFor;

export const createRouteStreamBunTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: BunRouteStreamTransportBodyResultHandlerFor<TManifest>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): BunRouteStreamTransportRequestHandler =>
  createBunTransportRequestHandlerWithPath(
    handler as BunTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      BunRouteStreamTransportBodyResultFor<TManifest>
    >,
    path,
    maxBodyBytes
  );

export const createStreamRouteBunTransportRequestHandlerWithPath: typeof createRouteStreamBunTransportRequestHandlerWithPath =
  createRouteStreamBunTransportRequestHandlerWithPath;

export const createRouteStreamBunTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <TManifest extends JoorManifest>(
    handler: BunRouteStreamTransportBodyResultHandlerFor<TManifest>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): BunRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamBunTransportRequestHandlerWithPath(
      handler,
      path,
      maxBodyBytes
    ) as BunRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteBunTransportRequestHandlerWithPathFor: typeof createRouteStreamBunTransportRequestHandlerWithPathFor =
  createRouteStreamBunTransportRequestHandlerWithPathFor;

export function createBunRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): BunRpcRequestHandler<TRequest>;
export function createBunRpcRequestHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): BunRpcRequestHandler {
  const handler = createRpcBodyResultHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >,
    false
  );
  return createBunTransportRequestHandler(
    (request, body) =>
      handler(request.toRequest(), body as RpcManifestBody<TManifest>),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options?.cors),
    options?.onError as ((error: Error, request: Request) => void) | undefined
  );
}

export function createRouteUnaryBunRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): BunRpcRequestHandler<TRequest>;
export function createRouteUnaryBunRpcRequestHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): BunRpcRequestHandler {
  const handler = createRouteUnaryRpcBodyResultHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >,
    false
  );
  const routeHandler = ((request, body) =>
    handler(
      request.toRequest(),
      body as unknown as RpcManifestRouteUnaryBody<TManifest>
    )) as BunRouteUnaryTransportBodyResultHandlerFor<TManifest>;
  return createRouteUnaryBunTransportRequestHandler(
    routeHandler,
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options?.cors),
    options?.onError as ((error: Error, request: Request) => void) | undefined
  );
}

export const createUnaryRouteBunRpcRequestHandler: typeof createRouteUnaryBunRpcRequestHandler =
  createRouteUnaryBunRpcRequestHandler;

export function createRouteStreamBunRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): BunRpcRequestHandler<TRequest>;
export function createRouteStreamBunRpcRequestHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): BunRpcRequestHandler {
  const handler = createRouteStreamRpcBodyResultHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >,
    false
  );
  const routeHandler = ((request, body) =>
    handler(
      request.toRequest(),
      body as unknown as RpcManifestRouteStreamBody<TManifest>
    )) as BunRouteStreamTransportBodyResultHandlerFor<TManifest>;
  return createRouteStreamBunTransportRequestHandler(
    routeHandler,
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options?.cors),
    options?.onError as ((error: Error, request: Request) => void) | undefined
  );
}

export const createStreamRouteBunRpcRequestHandler: typeof createRouteStreamBunRpcRequestHandler =
  createRouteStreamBunRpcRequestHandler;

export function createBunRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => BunRpcRequestHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createBunRpcRequestHandlerFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => BunRpcRequestHandler<TRequest>;
export function createBunRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): BunRpcRequestHandler<TRequest> => {
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
    return createBunTransportRequestHandler(
      (request, body) =>
        handler(
          request.toRequest() as TRequest,
          body as RpcManifestBody<TManifest>
        ),
      options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
      createRpcRequestPreflight(options as unknown as HandlerOptions),
      createCorsHeaderRecord(options.cors),
      options.onError as ((error: Error, request: Request) => void) | undefined
    ) as BunRpcRequestHandler<TRequest>;
  };
}

export function createRouteUnaryBunRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => BunRpcRequestHandler<
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryBunRpcRequestHandlerFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => BunRpcRequestHandler<TRequest>;
export function createRouteUnaryBunRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunRouteUnaryRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): BunRpcRequestHandler<TRequest> =>
    createRouteUnaryBunRpcRequestHandler(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    ) as BunRpcRequestHandler<TRequest>;
}

export const createUnaryRouteBunRpcRequestHandlerFor: typeof createRouteUnaryBunRpcRequestHandlerFor =
  createRouteUnaryBunRpcRequestHandlerFor;

export function createRouteStreamBunRpcRequestHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => BunRpcRequestHandler<
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamBunRpcRequestHandlerFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => BunRpcRequestHandler<TRequest>;
export function createRouteStreamBunRpcRequestHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: BunRouteStreamRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): BunRpcRequestHandler<TRequest> =>
    createRouteStreamBunRpcRequestHandler(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    ) as BunRpcRequestHandler<TRequest>;
}

export const createStreamRouteBunRpcRequestHandlerFor: typeof createRouteStreamBunRpcRequestHandlerFor =
  createRouteStreamBunRpcRequestHandlerFor;

const serveBunWithFetch = (
  fetch: BunRpcRequestHandler,
  options: BunServeOptions = {}
): BunServer => {
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(options: {
        port: number;
        hostname: string;
        fetch(request: Request): Response | Promise<Response>;
      }): BunServer;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  return bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch,
  });
};

export function serveBun<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): BunServer;
export function serveBun<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: BunServeOptions = {}
): BunServer {
  const fetch = createBunRpcRequestHandler(
    manifest,
    options as unknown as BunServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
  return serveBunWithFetch(fetch, options);
}

export function serveRouteUnaryBun<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteUnaryServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): BunServer;
export function serveRouteUnaryBun<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: BunServeOptions = {}
): BunServer {
  const fetch = createRouteUnaryBunRpcRequestHandler(
    manifest,
    options as unknown as BunRouteUnaryServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
  return serveBunWithFetch(fetch, options);
}

export const serveUnaryRouteBun: typeof serveRouteUnaryBun = serveRouteUnaryBun;
export const serveUnaryBun: typeof serveRouteUnaryBun = serveRouteUnaryBun;
export const serveBunRouteUnary: typeof serveRouteUnaryBun = serveRouteUnaryBun;
export const serveBunUnaryRoute: typeof serveRouteUnaryBun = serveRouteUnaryBun;
export const serveBunUnary: typeof serveRouteUnaryBun = serveRouteUnaryBun;

export function serveRouteStreamBun<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: BunRouteStreamServeOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): BunServer;
export function serveRouteStreamBun<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: BunServeOptions = {}
): BunServer {
  const fetch = createRouteStreamBunRpcRequestHandler(
    manifest,
    options as unknown as BunRouteStreamServeOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
  return serveBunWithFetch(fetch, options);
}

export const serveStreamRouteBun: typeof serveRouteStreamBun =
  serveRouteStreamBun;
export const serveStreamBun: typeof serveRouteStreamBun =
  serveRouteStreamBun;
export const serveBunRouteStream: typeof serveRouteStreamBun =
  serveRouteStreamBun;
export const serveBunStreamRoute: typeof serveRouteStreamBun =
  serveRouteStreamBun;
export const serveBunStream: typeof serveRouteStreamBun =
  serveRouteStreamBun;
