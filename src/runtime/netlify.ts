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
  createJoorHandler,
  createJoorHandlerFor,
  createRouteStreamJoorHandler,
  createRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandler,
  createRouteUnaryJoorHandlerFor,
  type JoorFetchHandler,
} from './fetch.js';

type MaybePromise<TValue> = TValue | Promise<TValue>;

export type NetlifyFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;

export type NetlifyEdgeResult = Response | URL | undefined;

export type NetlifyEdgeFetchHandler<
  TContext = unknown,
  TRequest extends Request = Request,
> = (request: TRequest, context: TContext) => MaybePromise<NetlifyEdgeResult>;

export type NetlifyFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NetlifyRouteUnaryFetchOptionsFor<
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

export type NetlifyUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NetlifyRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NetlifyRouteStreamFetchOptionsFor<
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

export type NetlifyStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NetlifyRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NetlifyFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NetlifyRouteUnaryFetchOptionsArgs<
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

export type NetlifyUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NetlifyRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NetlifyRouteStreamFetchOptionsArgs<
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

export type NetlifyStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NetlifyRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createNetlifyFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): NetlifyFetchHandler<TRequest>;
export function createNetlifyFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NetlifyFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
}

export function createRouteUnaryNetlifyFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): NetlifyFetchHandler<TRequest>;
export function createRouteUnaryNetlifyFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NetlifyFetchHandler {
  return createRouteUnaryJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const createUnaryRouteNetlifyFetch: typeof createRouteUnaryNetlifyFetch =
  createRouteUnaryNetlifyFetch;

export function createRouteStreamNetlifyFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): NetlifyFetchHandler<TRequest>;
export function createRouteStreamNetlifyFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NetlifyFetchHandler {
  return createRouteStreamJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const createStreamRouteNetlifyFetch: typeof createRouteStreamNetlifyFetch =
  createRouteStreamNetlifyFetch;

export function createNetlifyFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => NetlifyFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createNetlifyFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => NetlifyFetchHandler<TRequest>;
export function createNetlifyFetchFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): NetlifyFetchHandler<TRequest> =>
    createJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    );
}

export function createRouteUnaryNetlifyFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => NetlifyFetchHandler<
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryNetlifyFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => NetlifyFetchHandler<TRequest>;
export function createRouteUnaryNetlifyFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): NetlifyFetchHandler<TRequest> =>
    createRouteUnaryJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    );
}

export const createUnaryRouteNetlifyFetchFor: typeof createRouteUnaryNetlifyFetchFor =
  createRouteUnaryNetlifyFetchFor;

export function createRouteStreamNetlifyFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => NetlifyFetchHandler<
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamNetlifyFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => NetlifyFetchHandler<TRequest>;
export function createRouteStreamNetlifyFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): NetlifyFetchHandler<TRequest> =>
    createRouteStreamJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    );
}

export const createStreamRouteNetlifyFetchFor: typeof createRouteStreamNetlifyFetchFor =
  createRouteStreamNetlifyFetchFor;

export function createNetlifyEdgeFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): NetlifyEdgeFetchHandler<unknown, TRequest>;
export function createNetlifyEdgeFunction<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NetlifyEdgeFetchHandler {
  const fetch = createNetlifyFetch(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
  return (request) => fetch(request);
}

export function createRouteUnaryNetlifyEdgeFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): NetlifyEdgeFetchHandler<unknown, TRequest>;
export function createRouteUnaryNetlifyEdgeFunction<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): NetlifyEdgeFetchHandler {
  const fetch = createRouteUnaryNetlifyFetch(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
  return (request) => fetch(request);
}

export const createUnaryRouteNetlifyEdgeFunction: typeof createRouteUnaryNetlifyEdgeFunction =
  createRouteUnaryNetlifyEdgeFunction;

export function createRouteStreamNetlifyEdgeFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): NetlifyEdgeFetchHandler<unknown, TRequest>;
export function createRouteStreamNetlifyEdgeFunction<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): NetlifyEdgeFetchHandler {
  const fetch = createRouteStreamNetlifyFetch(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
  return (request) => fetch(request);
}

export const createStreamRouteNetlifyEdgeFunction: typeof createRouteStreamNetlifyEdgeFunction =
  createRouteStreamNetlifyEdgeFunction;

export function createNetlifyEdgeFunctionFor<TContext = unknown>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => NetlifyEdgeFetchHandler<
  TContext,
  RpcManifestRequiredRuntimeRequest<TManifest>
>;
export function createNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => NetlifyEdgeFetchHandler<TContext, TRequest>;
export function createNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): NetlifyEdgeFetchHandler<TContext, TRequest> => {
    const fetch = createJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    );
    return (request) => fetch(request);
  };
}

export function createRouteUnaryNetlifyEdgeFunctionFor<TContext = unknown>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => NetlifyEdgeFetchHandler<
  TContext,
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => NetlifyEdgeFetchHandler<TContext, TRequest>;
export function createRouteUnaryNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): NetlifyEdgeFetchHandler<TContext, TRequest> => {
    const fetch = createRouteUnaryJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    );
    return (request) => fetch(request);
  };
}

export const createUnaryRouteNetlifyEdgeFunctionFor: typeof createRouteUnaryNetlifyEdgeFunctionFor =
  createRouteUnaryNetlifyEdgeFunctionFor;

export function createRouteStreamNetlifyEdgeFunctionFor<TContext = unknown>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => NetlifyEdgeFetchHandler<
  TContext,
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: NetlifyRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => NetlifyEdgeFetchHandler<TContext, TRequest>;
export function createRouteStreamNetlifyEdgeFunctionFor<
  TContext = unknown,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: NetlifyRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): NetlifyEdgeFetchHandler<TContext, TRequest> => {
    const fetch = createRouteStreamJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    );
    return (request) => fetch(request);
  };
}

export const createStreamRouteNetlifyEdgeFunctionFor: typeof createRouteStreamNetlifyEdgeFunctionFor =
  createRouteStreamNetlifyEdgeFunctionFor;
