import {
  createRpcHandler,
  createRouteStreamRpcHandler,
  createRouteUnaryRpcHandler,
  type HandlerOptions,
  type HandlerOptionsFor,
  type HandlerOptionsArgs,
  type RpcManifestBody,
  type RpcManifestRequiredRuntimeRequest,
  type RpcManifestRouteStreamBody,
  type RpcManifestRouteStreamHandlerOptionsArgs,
  type RpcManifestRouteStreamHandlerOptionsFor,
  type RpcManifestRouteStreamRequiredRuntimeRequest,
  type RpcManifestRouteUnaryBody,
  type RpcManifestRouteUnaryHandlerOptionsArgs,
  type RpcManifestRouteUnaryHandlerOptionsFor,
  type RpcManifestRouteUnaryRequiredRuntimeRequest,
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteUnaryHandlerOptionsFor<
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

export type JoorUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteStreamHandlerOptionsFor<
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

export type JoorStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteUnaryHandlerOptionsArgs<
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

export type JoorUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type JoorUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteStreamHandlerOptionsArgs<
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

export type JoorStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type JoorStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createJoorHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: JoorHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): JoorFetchHandler<TRequest>;
export function createJoorHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): JoorFetchHandler {
  return createRpcHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
}

export function createRouteUnaryJoorHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: JoorRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): JoorFetchHandler<TRequest>;
export function createRouteUnaryJoorHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): JoorFetchHandler {
  return createRouteUnaryRpcHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );
}

export const createUnaryRouteJoorHandler: typeof createRouteUnaryJoorHandler =
  createRouteUnaryJoorHandler;

export const createUnaryJoorHandler: typeof createRouteUnaryJoorHandler =
  createRouteUnaryJoorHandler;

export function createRouteStreamJoorHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: JoorRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): JoorFetchHandler<TRequest>;
export function createRouteStreamJoorHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): JoorFetchHandler {
  return createRouteStreamRpcHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );
}

export const createStreamRouteJoorHandler: typeof createRouteStreamJoorHandler =
  createRouteStreamJoorHandler;

export const createStreamJoorHandler: typeof createRouteStreamJoorHandler =
  createRouteStreamJoorHandler;

export function createJoorHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => JoorFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createJoorHandlerFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => JoorFetchHandler<TRequest>;
export function createJoorHandlerFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: JoorHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): JoorFetchHandler<TRequest> =>
    createRpcHandler(
      manifest,
      (args[0] ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    ) as JoorFetchHandler<TRequest>;
}

export function createRouteUnaryJoorHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => JoorFetchHandler<RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryJoorHandlerFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => JoorFetchHandler<TRequest>;
export function createRouteUnaryJoorHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: JoorRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): JoorFetchHandler<TRequest> =>
    createRouteUnaryJoorHandler(
      manifest,
      (args[0] ?? {}) as unknown as JoorRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    ) as JoorFetchHandler<TRequest>;
}

export const createUnaryRouteJoorHandlerFor: typeof createRouteUnaryJoorHandlerFor =
  createRouteUnaryJoorHandlerFor;

export const createUnaryJoorHandlerFor: typeof createRouteUnaryJoorHandlerFor =
  createRouteUnaryJoorHandlerFor;

export function createRouteStreamJoorHandlerFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => JoorFetchHandler<RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>>;
export function createRouteStreamJoorHandlerFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: JoorRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => JoorFetchHandler<TRequest>;
export function createRouteStreamJoorHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: JoorRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): JoorFetchHandler<TRequest> =>
    createRouteStreamJoorHandler(
      manifest,
      (args[0] ?? {}) as unknown as JoorRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    ) as JoorFetchHandler<TRequest>;
}

export const createStreamRouteJoorHandlerFor: typeof createRouteStreamJoorHandlerFor =
  createRouteStreamJoorHandlerFor;

export const createStreamJoorHandlerFor: typeof createRouteStreamJoorHandlerFor =
  createRouteStreamJoorHandlerFor;
