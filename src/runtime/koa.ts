import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamHandlerOptionsArgsFor,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryHandlerOptionsArgsFor,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
} from '../rpc/dispatcher.js';
import {
  createNodeRpcRequestHandler,
  createRouteStreamNodeRpcRequestHandler,
  createRouteUnaryNodeRpcRequestHandler,
  type NodeRpcRequestHandler,
} from './node.js';

export interface KoaContext<
  TRequest extends IncomingMessage = IncomingMessage,
  TResponse extends ServerResponse<TRequest> = ServerResponse<TRequest>,
> {
  readonly __types?: (
    request: TRequest,
    response: TResponse
  ) => readonly [TRequest, TResponse];
  req: TRequest;
  res: TResponse;
  originalUrl?: string;
  respond?: boolean;
}

type KoaContextLike = {
  req: IncomingMessage;
  res: ServerResponse;
  originalUrl?: string;
  respond?: boolean;
};

export type KoaNext = () => unknown | Promise<unknown>;

export type KoaMiddleware<
  TContext extends KoaContextLike = KoaContext,
  TNext extends KoaNext = KoaNext,
> = (context: TContext, next: TNext) => void | Promise<void>;

export interface KoaHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly hostname?: string;
  readonly useOriginalUrl?: boolean;
}

export type KoaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptions<TPlugins, TBody, TRequest> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = KoaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = KoaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  KoaHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  KoaHandlerOptions<TPlugins, TBody, TRequest> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type KoaRouteUnaryHandlerOptionsArgs<
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
  KoaHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  KoaHandlerOptions<TPlugins, TBody, TRequest>,
  TRequest
>;

export type KoaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = KoaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type KoaRouteStreamHandlerOptionsArgs<
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
  KoaHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  KoaHandlerOptions<TPlugins, TBody, TRequest>,
  TRequest
>;

export type KoaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = KoaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

type KoaNodeHandlerFactory<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = (
  manifest: TManifest,
  options: HandlerOptionsFor<
    TManifest,
    readonly JoorPlugin<object>[],
    TBody,
    Request
  >,
  hostname: string
) => NodeRpcRequestHandler;

const createKoaHandlerWithOptions = <
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options: KoaHandlerOptions = {},
  createHandler: KoaNodeHandlerFactory<TManifest, TBody> = (
    handlerManifest,
    handlerOptions,
    hostname
  ) => createNodeRpcRequestHandler(handlerManifest, handlerOptions, hostname)
): KoaMiddleware => {
  const handler = createHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      TBody,
      Request
    >,
    options.hostname ?? '0.0.0.0'
  );
  const useOriginalUrl = options.useOriginalUrl ?? true;
  return async (context) => {
    const originalUrl = context.req.url;
    context.respond = false;
    if (useOriginalUrl && context.originalUrl !== undefined) {
      context.req.url = context.originalUrl;
    }
    try {
      await handler(context.req, context.res);
    } finally {
      context.req.url = originalUrl;
    }
  };
};

export function createKoaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: KoaHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): KoaMiddleware;
export function createKoaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: KoaHandlerOptions = {}
): KoaMiddleware {
  return createKoaHandlerWithOptions(manifest, options);
}

export function createRouteUnaryKoaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: KoaRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): KoaMiddleware;
export function createRouteUnaryKoaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: KoaHandlerOptions = {}
): KoaMiddleware {
  return createKoaHandlerWithOptions<
    TManifest,
    RpcManifestRouteUnaryBody<TManifest>
  >(manifest, options, createRouteUnaryNodeRpcRequestHandler);
}

export const createUnaryRouteKoaHandler: typeof createRouteUnaryKoaHandler =
  createRouteUnaryKoaHandler;

export function createRouteStreamKoaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: KoaRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): KoaMiddleware;
export function createRouteStreamKoaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: KoaHandlerOptions = {}
): KoaMiddleware {
  return createKoaHandlerWithOptions<
    TManifest,
    RpcManifestRouteStreamBody<TManifest>
  >(manifest, options, createRouteStreamNodeRpcRequestHandler);
}

export const createStreamRouteKoaHandler: typeof createRouteStreamKoaHandler =
  createRouteStreamKoaHandler;

export const createKoaHandlerFor =
  <
    TContext extends KoaContextLike = KoaContext,
    TNext extends KoaNext = KoaNext,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: KoaHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      THookRequest
    >
  ): KoaMiddleware<TContext, TNext> =>
    createKoaHandlerWithOptions(
      manifest,
      (args[0] ?? {}) as KoaHandlerOptions
    ) as KoaMiddleware<TContext, TNext>;

export const createRouteUnaryKoaHandlerFor =
  <
    TContext extends KoaContextLike = KoaContext,
    TNext extends KoaNext = KoaNext,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: KoaRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      THookRequest
    >
  ): KoaMiddleware<TContext, TNext> =>
    createKoaHandlerWithOptions<
      TManifest,
      RpcManifestRouteUnaryBody<TManifest>
    >(
      manifest,
      (args[0] ?? {}) as KoaHandlerOptions,
      createRouteUnaryNodeRpcRequestHandler
    ) as KoaMiddleware<TContext, TNext>;

export const createUnaryRouteKoaHandlerFor: typeof createRouteUnaryKoaHandlerFor =
  createRouteUnaryKoaHandlerFor;

export const createRouteStreamKoaHandlerFor =
  <
    TContext extends KoaContextLike = KoaContext,
    TNext extends KoaNext = KoaNext,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: KoaRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      THookRequest
    >
  ): KoaMiddleware<TContext, TNext> =>
    createKoaHandlerWithOptions<
      TManifest,
      RpcManifestRouteStreamBody<TManifest>
    >(
      manifest,
      (args[0] ?? {}) as KoaHandlerOptions,
      createRouteStreamNodeRpcRequestHandler
    ) as KoaMiddleware<TContext, TNext>;

export const createStreamRouteKoaHandlerFor: typeof createRouteStreamKoaHandlerFor =
  createRouteStreamKoaHandlerFor;
