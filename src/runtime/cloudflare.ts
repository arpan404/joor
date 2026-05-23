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

export type CloudflareFetchHandler = JoorFetchHandler;

export type CloudflareWorkerFetchHandler<
  TEnv = unknown,
  TContext = unknown,
> = (
  request: Request,
  env: TEnv,
  context: TContext
) => MaybePromise<Response>;

type CloudflareWorkerFetch<
  TEnv,
  TContext,
> = [TEnv] extends [never]
  ? CloudflareFetchHandler
  : CloudflareWorkerFetchHandler<TEnv, TContext>;

export interface CloudflareWorker<TEnv = never, TContext = never> {
  fetch: CloudflareWorkerFetch<TEnv, TContext>;
}

export type CloudflareFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareRouteUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareRouteStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = CloudflareFetchOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareRouteUnaryWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareUnaryRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareRouteStreamWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareWorkerOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareStreamRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareRouteStreamWorkerOptionsFor<TManifest, TPlugins, TBody>;

export type CloudflareFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareRouteUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareRouteStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = CloudflareFetchOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareRouteUnaryWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareUnaryRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareRouteStreamWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareWorkerOptionsArgs<TManifest, TPlugins, TBody>;

export type CloudflareStreamRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CloudflareRouteStreamWorkerOptionsArgs<TManifest, TPlugins, TBody>;

export function createCloudflareFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
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

export function createCloudflareWorker<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
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
  <TEnv = unknown, TContext = unknown>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HandlerOptionsArgs<TManifest, TPlugins>
  ): CloudflareWorker<TEnv, TContext> =>
    ({
      fetch: createCloudflareFetch(
        manifest,
        (args[0] ?? {}) as HandlerOptionsFor<TManifest>
      ),
    }) as CloudflareWorker<TEnv, TContext>;
