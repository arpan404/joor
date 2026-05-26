import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamHandlerOptionsArgs,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryHandlerOptionsArgs,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import {
  createJoorHandlerFor,
  createRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandlerFor,
  type JoorFetchHandler,
} from './fetch.js';

type MaybePromise<TValue> = TValue | Promise<TValue>;

export type NextRouteParamValue = string | readonly string[] | undefined;

export type NextRouteParams = Readonly<Record<string, NextRouteParamValue>>;

export interface NextRouteContext<TParams extends object = NextRouteParams> {
  readonly __paramsType?: (params: TParams) => TParams;
  readonly params: Promise<TParams>;
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
  readonly GET: NextRouteHandler<TContext, TRequest>;
  readonly POST: NextRouteHandler<TContext, TRequest>;
  readonly OPTIONS: NextRouteHandler<TContext, TRequest>;
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NextUnaryRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NextStreamRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlersOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NextUnaryRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NextStreamRouteHandlersOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = NextRouteHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NextRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlersOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NextStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NextRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

type NextFetchHandlerFactory<
  TRequest extends Request,
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = (
  manifest: TManifest,
  options: HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>
) => JoorFetchHandler<TRequest>;

const createRouteHandlers = <
  TContext,
  TRequest extends Request,
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options?: HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  createFetch: NextFetchHandlerFactory<TRequest, TManifest, TPlugins, TBody> = (
    handlerManifest,
    handlerOptions
  ) => createJoorHandlerFor<TRequest>()(handlerManifest, handlerOptions)
): NextRouteHandlers<TContext, TRequest> => {
  const fetch = createFetch(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
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
    options as unknown as
      | HandlerOptionsFor<
          TManifest,
          readonly JoorPlugin<object>[],
          RpcManifestBody<TManifest>,
          Request
        >
      | undefined
  );
}

export const createNextHandler: typeof createNextRouteHandlers =
  createNextRouteHandlers;

export function createRouteUnaryNextRouteHandlers<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NextRouteUnaryHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): NextRouteHandlers<never, TRequest>;
export function createRouteUnaryNextRouteHandlers<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): NextRouteHandlers {
  return createRouteHandlers<
    never,
    Request,
    TManifest,
    readonly JoorPlugin<object>[],
    RpcManifestRouteUnaryBody<TManifest>
  >(
    manifest,
    options as
      | RpcManifestRouteUnaryHandlerOptionsFor<
          TManifest,
          readonly JoorPlugin<object>[],
          RpcManifestRouteUnaryBody<TManifest>,
          Request
        >
      | undefined,
    (handlerManifest, handlerOptions) =>
      createRouteUnaryJoorHandlerFor<Request>()(handlerManifest, handlerOptions)
  );
}

export const createUnaryRouteNextRouteHandlers: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;
export const createRouteUnaryNextHandler: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;
export const createUnaryRouteNextHandler: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;

export function createRouteStreamNextRouteHandlers<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NextRouteStreamHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): NextRouteHandlers<never, TRequest>;
export function createRouteStreamNextRouteHandlers<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): NextRouteHandlers {
  return createRouteHandlers<
    never,
    Request,
    TManifest,
    readonly JoorPlugin<object>[],
    RpcManifestRouteStreamBody<TManifest>
  >(
    manifest,
    options as
      | RpcManifestRouteStreamHandlerOptionsFor<
          TManifest,
          readonly JoorPlugin<object>[],
          RpcManifestRouteStreamBody<TManifest>,
          Request
        >
      | undefined,
    (handlerManifest, handlerOptions) =>
      createRouteStreamJoorHandlerFor<Request>()(
        handlerManifest,
        handlerOptions
      )
  );
}

export const createStreamRouteNextRouteHandlers: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;
export const createRouteStreamNextHandler: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;
export const createStreamRouteNextHandler: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;

export function createNextRouteHandlersFor<TContext = never>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NextRouteHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => NextRouteHandlers<TContext, RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>(): <
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
) => NextRouteHandlers<TContext, TRequest>;
export function createNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
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
}

export const createNextHandlerFor: typeof createNextRouteHandlersFor =
  createNextRouteHandlersFor;

export function createRouteUnaryNextRouteHandlersFor<TContext = never>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NextRouteUnaryHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => NextRouteHandlers<
  TContext,
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NextRouteUnaryHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => NextRouteHandlers<TContext, TRequest>;
export function createRouteUnaryNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NextRouteUnaryHandlersOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): NextRouteHandlers<TContext, TRequest> =>
    createRouteHandlers<
      TContext,
      TRequest,
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>
    >(
      manifest,
      args[0] as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >,
      (handlerManifest, handlerOptions) =>
        createRouteUnaryJoorHandlerFor<TRequest>()(
          handlerManifest,
          handlerOptions
        )
    );
}

export const createUnaryRouteNextRouteHandlersFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;
export const createRouteUnaryNextHandlerFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;
export const createUnaryRouteNextHandlerFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;

export function createRouteStreamNextRouteHandlersFor<TContext = never>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NextRouteStreamHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => NextRouteHandlers<
  TContext,
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NextRouteStreamHandlersOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => NextRouteHandlers<TContext, TRequest>;
export function createRouteStreamNextRouteHandlersFor<
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NextRouteStreamHandlersOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): NextRouteHandlers<TContext, TRequest> =>
    createRouteHandlers<
      TContext,
      TRequest,
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>
    >(
      manifest,
      args[0] as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >,
      (handlerManifest, handlerOptions) =>
        createRouteStreamJoorHandlerFor<TRequest>()(
          handlerManifest,
          handlerOptions
        )
    );
}

export const createStreamRouteNextRouteHandlersFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
export const createRouteStreamNextHandlerFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
export const createStreamRouteNextHandlerFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
