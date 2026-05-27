import type { JoorPlugin } from '../context/plugin.js';
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
import {
  createJoorHandler,
  createJoorHandlerFor,
  createRouteStreamJoorHandler,
  createRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandler,
  createRouteUnaryJoorHandlerFor,
} from './fetch.js';

export interface ElysiaContext<TRequest extends Request = Request> {
  readonly __requestType?: (request: TRequest) => TRequest;
  readonly request: TRequest;
}

type ElysiaContextLike = {
  readonly request: Request;
};

export type ElysiaHandler<TContext extends ElysiaContextLike = ElysiaContext> =
  (context: TContext) => Response | Promise<Response>;

type ElysiaContextRequest<TContext extends ElysiaContextLike> =
  TContext extends ElysiaContext<infer TRequest> ? TRequest : Request;

export type ElysiaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteUnaryHandlerOptionsFor<
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

export type ElysiaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteStreamHandlerOptionsFor<
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

export type ElysiaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteUnaryHandlerOptionsArgs<
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

export type ElysiaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaRouteStreamHandlerOptionsArgs<
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

export type ElysiaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ElysiaStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ElysiaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createElysiaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
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
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
  return (context) => fetch(context.request);
}

export function createRouteUnaryElysiaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ElysiaRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): ElysiaHandler<ElysiaContext<TRequest>>;
export function createRouteUnaryElysiaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ElysiaHandler {
  const fetch = createRouteUnaryJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
  return (context) => fetch(context.request);
}

export const createUnaryRouteElysiaHandler: typeof createRouteUnaryElysiaHandler =
  createRouteUnaryElysiaHandler;

export const createUnaryElysiaHandler: typeof createRouteUnaryElysiaHandler =
  createRouteUnaryElysiaHandler;

export function createRouteStreamElysiaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ElysiaRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): ElysiaHandler<ElysiaContext<TRequest>>;
export function createRouteStreamElysiaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ElysiaHandler {
  const fetch = createRouteStreamJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
  return (context) => fetch(context.request);
}

export const createStreamRouteElysiaHandler: typeof createRouteStreamElysiaHandler =
  createRouteStreamElysiaHandler;

export const createStreamElysiaHandler: typeof createRouteStreamElysiaHandler =
  createRouteStreamElysiaHandler;

export function createElysiaHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: ElysiaHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => ElysiaHandler<ElysiaContext<RpcManifestRequiredRuntimeRequest<TManifest>>>;
export function createElysiaHandlerFor<TContext extends ElysiaContextLike>(): <
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
) => ElysiaHandler<TContext>;
export function createElysiaHandlerFor<TContext extends ElysiaContextLike>() {
  return <
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
    return (context) =>
      fetch(context.request as ElysiaContextRequest<TContext>);
  };
}

export function createRouteUnaryElysiaHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: ElysiaRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => ElysiaHandler<
  ElysiaContext<RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>>
>;
export function createRouteUnaryElysiaHandlerFor<
  TContext extends ElysiaContextLike,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: ElysiaRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    ElysiaContextRequest<TContext>
  >
) => ElysiaHandler<TContext>;
export function createRouteUnaryElysiaHandlerFor<
  TContext extends ElysiaContextLike,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: ElysiaRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      ElysiaContextRequest<TContext>
    >
  ): ElysiaHandler<TContext> => {
    const fetch = createRouteUnaryJoorHandlerFor<
      ElysiaContextRequest<TContext>
    >()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        ElysiaContextRequest<TContext>
      >
    );
    return (context) =>
      fetch(context.request as ElysiaContextRequest<TContext>);
  };
}

export const createUnaryRouteElysiaHandlerFor: typeof createRouteUnaryElysiaHandlerFor =
  createRouteUnaryElysiaHandlerFor;

export const createUnaryElysiaHandlerFor: typeof createRouteUnaryElysiaHandlerFor =
  createRouteUnaryElysiaHandlerFor;

export function createRouteStreamElysiaHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: ElysiaRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => ElysiaHandler<
  ElysiaContext<RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>>
>;
export function createRouteStreamElysiaHandlerFor<
  TContext extends ElysiaContextLike,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: ElysiaRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    ElysiaContextRequest<TContext>
  >
) => ElysiaHandler<TContext>;
export function createRouteStreamElysiaHandlerFor<
  TContext extends ElysiaContextLike,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: ElysiaRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      ElysiaContextRequest<TContext>
    >
  ): ElysiaHandler<TContext> => {
    const fetch = createRouteStreamJoorHandlerFor<
      ElysiaContextRequest<TContext>
    >()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        ElysiaContextRequest<TContext>
      >
    );
    return (context) =>
      fetch(context.request as ElysiaContextRequest<TContext>);
  };
}

export const createStreamRouteElysiaHandlerFor: typeof createRouteStreamElysiaHandlerFor =
  createRouteStreamElysiaHandlerFor;

export const createStreamElysiaHandlerFor: typeof createRouteStreamElysiaHandlerFor =
  createRouteStreamElysiaHandlerFor;
