import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler, type JoorFetchHandler } from './fetch.js';

type MaybePromise<TValue> = TValue | Promise<TValue>;

export type NextRouteParamValue = string | string[] | undefined;

export type NextRouteParams = Record<string, NextRouteParamValue>;

export interface NextRouteContext<TParams extends object = NextRouteParams> {
  params: Promise<TParams>;
}

export type NextRouteHandler<
  TContext = never,
  TRequest extends Request = Request,
> = [TContext] extends [never]
  ? JoorFetchHandler<TRequest>
  : (request: TRequest, context: TContext) => MaybePromise<Response>;

export interface NextRouteHandlers<
  TContext = never,
  TRequest extends Request = Request,
> {
  GET: NextRouteHandler<TContext, TRequest>;
  POST: NextRouteHandler<TContext, TRequest>;
  OPTIONS: NextRouteHandler<TContext, TRequest>;
}

export type NextHandler<
  TContext = never,
  TRequest extends Request = Request,
> = NextRouteHandlers<TContext, TRequest>;

export type NextRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type NextRouteUnaryHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextUnaryRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextRouteStreamHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextStreamRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type NextRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody>;

export type NextStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type NextRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type NextRouteUnaryHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextUnaryRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextRouteStreamHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextStreamRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NextRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type NextRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody>;

export type NextStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NextRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

const createRouteHandlers = <
  TContext,
  TRequest extends Request,
  TManifest extends JoorManifest,
>(
  manifest: TManifest,
  options?: HandlerOptions
): NextRouteHandlers<TContext, TRequest> => {
  const fetch = createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
  return {
    GET: fetch,
    POST: fetch,
    OPTIONS: fetch,
  } as NextRouteHandlers<TContext, TRequest>;
};

export function createNextRouteHandlers<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): NextRouteHandlers;
export function createNextRouteHandlers<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NextRouteHandlers {
  return createRouteHandlers<never, Request, TManifest>(manifest, options);
}

export const createNextHandler: typeof createNextRouteHandlers =
  createNextRouteHandlers;

export const createNextRouteHandlersFor =
  <TContext = never, TRequest extends Request = Request>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HandlerOptionsArgs<TManifest, TPlugins>
  ): NextRouteHandlers<TContext, TRequest> =>
    createRouteHandlers<TContext, TRequest, TManifest>(
      manifest,
      args[0] as HandlerOptions | undefined
    );

export const createNextHandlerFor: typeof createNextRouteHandlersFor =
  createNextRouteHandlersFor;
