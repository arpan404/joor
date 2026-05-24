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
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import { createNodeRpcRequestHandler } from './node.js';

export interface KoaContext<
  TRequest extends IncomingMessage = IncomingMessage,
  TResponse extends ServerResponse<TRequest> = ServerResponse<TRequest>,
> {
  req: TRequest;
  res: TResponse;
  originalUrl?: string;
  respond?: boolean;
}

export type KoaNext = () => unknown | Promise<unknown>;

export type KoaMiddleware<
  TContext extends KoaContext = KoaContext,
  TNext extends KoaNext = KoaNext,
> = (
  context: TContext,
  next: TNext
) => void | Promise<void>;

export interface KoaHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  hostname?: string;
  useOriginalUrl?: boolean;
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type KoaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type KoaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type KoaRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type KoaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = KoaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

const createKoaHandlerWithOptions = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: KoaHandlerOptions = {}
): KoaMiddleware => {
  const handler = createNodeRpcRequestHandler(
    manifest,
    options as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>,
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

export const createKoaHandlerFor =
  <
    TContext extends KoaContext = KoaContext,
    TNext extends KoaNext = KoaNext,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
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
