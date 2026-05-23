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
  RpcManifestStreamRouteBody,
  RpcManifestUnaryRouteBody,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
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
import { createJoorHandler, type JoorFetchHandler } from './fetch.js';
import {
  jsonContentHeaders,
  transportResultToResponse,
  type SerializedJsonEnvelope,
  type TransportBodyResultFor,
} from './response.js';

export interface BunServeOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> extends HandlerOptions<TPlugins> {
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
> = BunServeOptions<TPlugins> & HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunUnaryRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunServeOptionsFor<TManifest, TPlugins, TBody>;

export type BunStreamRouteServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunServeOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteUnaryServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteServeOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteStreamServeOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteServeOptionsFor<TManifest, TPlugins, TBody>;

export type BunFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunFetchOptionsFor<TManifest, TPlugins, TBody>;

export type BunStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunFetchOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteFetchOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteFetchOptionsFor<TManifest, TPlugins, TBody>;

export type BunRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunRouteStreamRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteRpcRequestHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type BunFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type BunStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteRpcRequestHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type BunServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  BunServeOptions<TPlugins>,
  TBody
>;

export type BunUnaryRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunServeOptionsArgs<TManifest, TPlugins, TBody>;

export type BunStreamRouteServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunServeOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteUnaryServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteServeOptionsArgs<TManifest, TPlugins, TBody>;

export type BunRouteStreamServeOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteServeOptionsArgs<TManifest, TPlugins, TBody>;

export type BunTransportBodyResult = RpcBodyResult | SerializedJsonEnvelope;
export type BunTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type BunUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type BunStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type BunRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = BunUnaryRouteTransportBodyResultFor<TManifest, TBody>;
export type BunRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = BunStreamRouteTransportBodyResultFor<TManifest, TBody>;
export type BunFetchHandler = JoorFetchHandler;
export type BunRpcRequestHandler = JoorFetchHandler;
export type BunTransportRequestHandler = JoorFetchHandler;

export type BunTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => Promise<TResult>;

export type BunTransportBodyResultHandlerFor<TManifest extends JoorManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: ContextRequestSource,
  body: TBody
) => Promise<BunTransportBodyResultFor<TManifest, TBody>>;

export type BunUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestUnaryRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<BunUnaryRouteTransportBodyResultFor<TManifest, TBody>>;

export type BunStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestStreamRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<BunStreamRouteTransportBodyResultFor<TManifest, TBody>>;

export type BunRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = BunUnaryRouteTransportBodyResultHandlerFor<TManifest>;

export type BunRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = BunStreamRouteTransportBodyResultHandlerFor<TManifest>;

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

export function createBunFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): BunFetchHandler;
export function createBunFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): BunFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}

export const createBunTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends BunTransportBodyResult = BunTransportBodyResult,
>(
  handler: BunTransportBodyResultHandler<TBody, TResult>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
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
      return bodyReadFailure(request, error);
    }
    return transportResultToResponse(await handler(source, body as TBody));
  };
};

export function createBunRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): BunRpcRequestHandler;
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
    createRpcRequestPreflight(options)
  );
}

export function serveBun<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgsFor<TManifest, TPlugins, BunServeOptions<TPlugins>>
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
        fetch(request: Request): Promise<Response>;
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
