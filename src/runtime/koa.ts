import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcManifestBody,
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
> extends HandlerOptions<TPlugins> {
  hostname?: string;
  useOriginalUrl?: boolean;
}

export type KoaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = KoaHandlerOptions<TPlugins> & HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type KoaRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = KoaHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type KoaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = KoaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type KoaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = KoaHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type KoaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = KoaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type KoaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  KoaHandlerOptions<TPlugins>,
  TBody
>;

export type KoaRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = KoaHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type KoaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = KoaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type KoaRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = KoaHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type KoaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = KoaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

const createKoaHandlerWithOptions = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: KoaHandlerOptions = {}
): KoaMiddleware => {
  const handler = createNodeRpcRequestHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
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
>(
  manifest: TManifest,
  ...args: KoaHandlerOptionsArgs<TManifest, TPlugins>
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
  >(
    manifest: TManifest,
    ...args: KoaHandlerOptionsArgs<TManifest, TPlugins>
  ): KoaMiddleware<TContext, TNext> =>
    createKoaHandlerWithOptions(
      manifest,
      (args[0] ?? {}) as KoaHandlerOptions
    ) as KoaMiddleware<TContext, TNext>;
