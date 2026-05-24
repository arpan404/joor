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
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import {
  createRpcBodyResultHandler,
  createRpcRequestPreflight,
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
  type JoorFetchHandler,
} from './fetch.js';
import {
  createCorsHeaderRecord,
  createJsonHeaderRecord,
  transportResultToResponse,
  type SerializedJsonEnvelope,
  type TransportBodyResultFor,
} from './response.js';

export interface BunServeOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TRequest extends Request = Request,
  TBody = unknown,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  port?: number;
  hostname?: string;
}

export interface BunServer {
  readonly hostname?: string;
  readonly port?: number;
  readonly url?: URL;
  stop(force?: boolean): void;
  ref?(): void;
  unref?(): void;
}

export type BunServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = BunServeOptions<TPlugins, TRequest, TBody> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteUnaryServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteStreamServeOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = BunRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = BunRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = BunServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunUnaryRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = BunRouteUnaryServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunRouteStreamServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = BunServeOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type BunStreamRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
> = TransportBodyResultFor<TManifest, TBody>;
export type BunUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = BunRouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type BunRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
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

export function createBunFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = Request,
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
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}

export const createBunFetchFor =
  <TRequest extends Request = Request>() =>
  <
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

export const createBunTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
>(
  handler: BunTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>
): BunTransportRequestHandler => {
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
      return bodyReadFailure(request, error, extraResponseHeaders);
    }
    return transportResultToResponse(
      await handler(source, body as TBody),
      extraResponseHeaders
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
    extraResponseHeaders?: Record<string, string>
  ): BunTransportRequestHandler<TRequest> =>
    createBunTransportRequestHandler(
      handler,
      maxBodyBytes,
      preflight,
      extraResponseHeaders
    ) as BunTransportRequestHandler<TRequest>;

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

export function createBunRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = Request,
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
    (options ?? {}) as HandlerOptionsFor<TManifest>,
    false
  );
  return createBunTransportRequestHandler(
    (request, body) =>
      handler(request.toRequest(), body as RpcManifestBody<TManifest>),
    options?.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options?.cors)
  );
}

export const createBunRpcRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
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
      createCorsHeaderRecord(options.cors)
    ) as BunRpcRequestHandler<TRequest>;
  };

export function serveBun<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: BunServeOptionsArgs<TManifest, TPlugins>
): BunServer;
export function serveBun<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: BunServeOptions = {}
): BunServer {
  const fetch = createBunRpcRequestHandler(
    manifest,
    options as BunServeOptionsFor<TManifest>
  );
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
}
