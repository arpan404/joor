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
import type { JoorPlugin } from '../context/plugin.js';
import {
  createJoorHandler,
  createJoorHandlerFor,
  type JoorFetchHandler,
} from './fetch.js';

export type VercelFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;

export interface VercelFunction<TRequest extends Request = Request> {
  fetch: VercelFetchHandler<TRequest>;
}

export type VercelFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = VercelRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export function createVercelFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): VercelFetchHandler<TRequest>;
export function createVercelFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
  );
}

export function createVercelFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => VercelFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createVercelFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => VercelFetchHandler<TRequest>;
export function createVercelFetchFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): VercelFetchHandler<TRequest> =>
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

export function createVercelFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): VercelFunction<TRequest>;
export function createVercelFunction<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFunction {
  return {
    fetch: createVercelFetch(
      manifest,
      (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
    ),
  };
}

export function createVercelFunctionFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => VercelFunction<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createVercelFunctionFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => VercelFunction<TRequest>;
export function createVercelFunctionFor<TRequest extends Request = Request>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): VercelFunction<TRequest> => ({
    fetch: createJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    ),
  });
}
