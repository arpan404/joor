import {
  createRpcHandler,
  type HandlerOptions,
  type HandlerOptionsFor,
  type HandlerOptionsArgs,
  type RpcManifestBody,
  type RpcManifestStreamRouteBody,
  type RpcManifestUnaryRouteBody,
} from '../rpc/dispatcher.js';
import type { JoorManifest } from '../manifest.js';
import type { JoorPlugin } from '../context/plugin.js';

export type JoorFetchHandler = (request: Request) => Promise<Response>;

export type JoorHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = JoorHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = JoorRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = JoorHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = JoorRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = JoorHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = JoorRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = JoorHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = JoorRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export function createJoorHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): JoorFetchHandler;
export function createJoorHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): JoorFetchHandler {
  return createRpcHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}
