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
import {
  createJoorHandlerFor,
  type JoorFetchHandler,
} from './fetch.js';

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
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = NextRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

const createRouteHandlers = <
  TContext,
  TRequest extends Request,
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options?: HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>
): NextRouteHandlers<TContext, TRequest> => {
  const fetch = createJoorHandlerFor<TRequest>()(
    manifest,
    (options ?? {}) as HandlerOptionsFor<
      TManifest,
      TPlugins,
      TBody,
      TRequest
    >
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
  TRequest extends Request = Request,
>(
  manifest: TManifest,
  ...args: NextRouteHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): NextRouteHandlers<never, TRequest>;
export function createNextRouteHandlers<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NextRouteHandlers {
  return createRouteHandlers<never, Request, TManifest>(
    manifest,
    options as HandlerOptionsFor<TManifest> | undefined
  );
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
    ...args: NextRouteHandlersOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): NextRouteHandlers<TContext, TRequest> =>
    createRouteHandlers<
      TContext,
      TRequest,
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>
    >(
      manifest,
      args[0] as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    );

export const createNextHandlerFor: typeof createNextRouteHandlersFor =
  createNextRouteHandlersFor;
