import {
  createRpcHandler,
  type HandlerOptions,
  type HandlerOptionsFor,
  type HandlerOptionsArgs,
  type RpcManifestBody,
  type RpcManifestRouteStreamBody,
  type RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import type { JoorManifest } from '../manifest.js';
import type { JoorPlugin } from '../context/plugin.js';

export type JoorFetchHandler<TRequest extends Request = Request> = (
  request: TRequest
) => Response | Promise<Response>;

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
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = JoorHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = JoorRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = JoorHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type JoorStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
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
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = JoorHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = JoorRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = JoorHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type JoorStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
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

export const createJoorHandlerFor =
  <TRequest extends Request>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: JoorHandlerOptionsArgs<TManifest, TPlugins>
  ): JoorFetchHandler<TRequest> =>
    createRpcHandler(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<TManifest>
    ) as JoorFetchHandler<TRequest>;
