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
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteUnaryWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
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
  TRequest extends Request = Request,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = CloudflareRouteStreamWorkerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export function createCloudflareFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareFetchOptionsArgs<TManifest, TPlugins>
): CloudflareFetchHandler;
export function createCloudflareFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}

export const createCloudflareFetchFor =
  <TRequest extends Request>() =>
  <
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

export function createCloudflareWorker<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareWorkerOptionsArgs<TManifest, TPlugins>
): CloudflareWorker;
export function createCloudflareWorker<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareWorker {
  return {
    fetch: createCloudflareFetch(
      manifest,
      (options ?? {}) as HandlerOptionsFor<TManifest>
    ),
  };
}

export const createCloudflareWorkerFor =
  <
    TEnv = unknown,
    TContext = unknown,
    TRequest extends Request = Request,
  >() =>
  <
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
