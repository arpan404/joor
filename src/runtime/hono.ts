import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import { createJoorHandler, createJoorHandlerFor } from './fetch.js';

export interface HonoContext<TRequest extends Request = Request> {
  req: {
    raw: TRequest;
  };
}

export type HonoHandler<TContext extends HonoContext = HonoContext> = (
  context: TContext
) => Response | Promise<Response>;

type HonoContextRequest<TContext extends HonoContext> =
  TContext extends HonoContext<infer TRequest> ? TRequest : Request;

export type HonoHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HonoRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HonoUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HonoRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HonoStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HonoHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type HonoRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type HonoUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type HonoRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type HonoStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HonoRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createHonoHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HonoHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): HonoHandler<HonoContext<TRequest>>;
export function createHonoHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): HonoHandler {
  const fetch = createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
  );
  return (context) => fetch(context.req.raw);
}

export function createHonoHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HonoHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => HonoHandler<HonoContext<RpcManifestRequiredRuntimeRequest<TManifest>>>;
export function createHonoHandlerFor<TContext extends HonoContext>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HonoHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    HonoContextRequest<TContext>
  >
) => HonoHandler<TContext>;
export function createHonoHandlerFor<TContext extends HonoContext>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HonoHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      HonoContextRequest<TContext>
    >
  ): HonoHandler<TContext> => {
    const fetch = createJoorHandlerFor<HonoContextRequest<TContext>>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        HonoContextRequest<TContext>
      >
    );
    return (context) => fetch(context.req.raw as HonoContextRequest<TContext>);
  };
}
