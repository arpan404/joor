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

type MaybePromise<TValue> = TValue | Promise<TValue>;

export type CloudflareFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;

export type CloudflareWorkerFetchHandler<
  TEnv = unknown,
  TContext = unknown,
  TRequest extends Request = Request,
> = (
  request: TRequest,
  env: TEnv,
  context: TContext
) => MaybePromise<Response>;

type CloudflareWorkerFetch<
  TEnv,
  TContext,
  TRequest extends Request,
> = [TEnv] extends [never]
  ? CloudflareFetchHandler<TRequest>
  : CloudflareWorkerFetchHandler<TEnv, TContext, TRequest>;

export interface CloudflareWorker<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
> {
  fetch: CloudflareWorkerFetch<TEnv, TContext, TRequest>;
}

export type CloudflareFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareRouteStreamWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamWorkerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareRouteStreamWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamWorkerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export function createCloudflareFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): CloudflareFetchHandler<TRequest>;
export function createCloudflareFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
  );
}

export function createCloudflareFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => CloudflareFetchHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createCloudflareFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => CloudflareFetchHandler<TRequest>;
export function createCloudflareFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): CloudflareFetchHandler<TRequest> =>
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

export function createCloudflareWorker<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): CloudflareWorker<never, never, TRequest>;
export function createCloudflareWorker<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareWorker {
  return {
    fetch: createCloudflareFetch(
      manifest,
      (options ?? {}) as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>
    ),
  };
}

export function createCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => CloudflareWorker<
  TEnv,
  TContext,
  RpcManifestRequiredRuntimeRequest<TManifest>
>;
export function createCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => CloudflareWorker<TEnv, TContext, TRequest>;
export function createCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareWorkerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): CloudflareWorker<TEnv, TContext, TRequest> =>
    ({
      fetch: createJoorHandlerFor<TRequest>()(
        manifest,
        (args[0] ?? {}) as HandlerOptionsFor<
          TManifest,
          TPlugins,
          RpcManifestBody<TManifest>,
          TRequest
        >
      ),
    }) as CloudflareWorker<TEnv, TContext, TRequest>;
}
