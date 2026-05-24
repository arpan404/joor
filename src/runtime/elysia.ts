import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import { createJoorHandler, createJoorHandlerFor } from './fetch.js';

export interface ElysiaContext<TRequest extends Request = Request> {
  request: TRequest;
}

export type ElysiaHandler<TContext extends ElysiaContext = ElysiaContext> = (
  context: TContext
) => Response | Promise<Response>;

type ElysiaContextRequest<TContext extends ElysiaContext> =
  TContext extends ElysiaContext<infer TRequest> ? TRequest : Request;

export type ElysiaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = ElysiaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createElysiaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = Request,
>(
  manifest: TManifest,
  ...args: ElysiaHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): ElysiaHandler<ElysiaContext<TRequest>>;
export function createElysiaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ElysiaHandler {
  const fetch = createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
  return (context) => fetch(context.request);
}

export const createElysiaHandlerFor =
  <TContext extends ElysiaContext>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: ElysiaHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      ElysiaContextRequest<TContext>
    >
  ): ElysiaHandler<TContext> => {
    const fetch = createJoorHandlerFor<ElysiaContextRequest<TContext>>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        ElysiaContextRequest<TContext>
      >
    );
    return (context) => fetch(context.request as ElysiaContextRequest<TContext>);
  };
