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

export type CloudflareFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;

export type CloudflareWorkerFetchHandler<
  TEnv = unknown,
  TContext = unknown,
  TRequest extends Request = Request,
> = (request: TRequest, env: TEnv, context: TContext) => MaybePromise<Response>;

type CloudflareWorkerFetch<TEnv, TContext, TRequest extends Request> = [
  TEnv,
] extends [never]
  ? CloudflareFetchHandler<TRequest>
  : CloudflareWorkerFetchHandler<TEnv, TContext, TRequest>;

export interface CloudflareWorker<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
> {
  readonly fetch: CloudflareWorkerFetch<TEnv, TContext, TRequest>;
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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteStreamFetchOptionsFor<
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

export type CloudflareStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareUnaryRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteStreamWorkerOptionsFor<
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

export type CloudflareStreamRouteWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamWorkerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamWorkerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteStreamFetchOptionsArgs<
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

export type CloudflareStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareUnaryRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareUnaryWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteUnaryWorkerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type CloudflareRouteStreamWorkerOptionsArgs<
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

export type CloudflareStreamRouteWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = CloudflareRouteStreamWorkerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type CloudflareStreamWorkerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
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
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
}

export function createRouteUnaryCloudflareFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): CloudflareFetchHandler<TRequest>;
export function createRouteUnaryCloudflareFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareFetchHandler {
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

export const createUnaryRouteCloudflareFetch: typeof createRouteUnaryCloudflareFetch =
  createRouteUnaryCloudflareFetch;

export const createUnaryCloudflareFetch: typeof createRouteUnaryCloudflareFetch =
  createRouteUnaryCloudflareFetch;

export function createRouteStreamCloudflareFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): CloudflareFetchHandler<TRequest>;
export function createRouteStreamCloudflareFetch<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): CloudflareFetchHandler {
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

export const createStreamRouteCloudflareFetch: typeof createRouteStreamCloudflareFetch =
  createRouteStreamCloudflareFetch;

export const createStreamCloudflareFetch: typeof createRouteStreamCloudflareFetch =
  createRouteStreamCloudflareFetch;

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
export function createCloudflareFetchFor<TRequest extends Request = Request>() {
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

export function createRouteUnaryCloudflareFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => CloudflareFetchHandler<
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryCloudflareFetchFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => CloudflareFetchHandler<TRequest>;
export function createRouteUnaryCloudflareFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): CloudflareFetchHandler<TRequest> =>
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

export const createUnaryRouteCloudflareFetchFor: typeof createRouteUnaryCloudflareFetchFor =
  createRouteUnaryCloudflareFetchFor;

export const createUnaryCloudflareFetchFor: typeof createRouteUnaryCloudflareFetchFor =
  createRouteUnaryCloudflareFetchFor;

export function createRouteStreamCloudflareFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => CloudflareFetchHandler<
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamCloudflareFetchFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => CloudflareFetchHandler<TRequest>;
export function createRouteStreamCloudflareFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): CloudflareFetchHandler<TRequest> =>
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

export const createStreamRouteCloudflareFetchFor: typeof createRouteStreamCloudflareFetchFor =
  createRouteStreamCloudflareFetchFor;

export const createStreamCloudflareFetchFor: typeof createRouteStreamCloudflareFetchFor =
  createRouteStreamCloudflareFetchFor;

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
      (options ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        readonly JoorPlugin<object>[],
        RpcManifestBody<TManifest>,
        Request
      >
    ),
  };
}

export function createRouteUnaryCloudflareWorker<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): CloudflareWorker<never, never, TRequest>;
export function createRouteUnaryCloudflareWorker<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): CloudflareWorker {
  return {
    fetch: createRouteUnaryCloudflareFetch(
      manifest,
      (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        readonly JoorPlugin<object>[],
        RpcManifestRouteUnaryBody<TManifest>,
        Request
      >
    ),
  };
}

export const createUnaryRouteCloudflareWorker: typeof createRouteUnaryCloudflareWorker =
  createRouteUnaryCloudflareWorker;

export const createUnaryCloudflareWorker: typeof createRouteUnaryCloudflareWorker =
  createRouteUnaryCloudflareWorker;

export function createRouteStreamCloudflareWorker<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): CloudflareWorker<never, never, TRequest>;
export function createRouteStreamCloudflareWorker<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): CloudflareWorker {
  return {
    fetch: createRouteStreamCloudflareFetch(
      manifest,
      (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        readonly JoorPlugin<object>[],
        RpcManifestRouteStreamBody<TManifest>,
        Request
      >
    ),
  };
}

export const createStreamRouteCloudflareWorker: typeof createRouteStreamCloudflareWorker =
  createRouteStreamCloudflareWorker;

export const createStreamCloudflareWorker: typeof createRouteStreamCloudflareWorker =
  createRouteStreamCloudflareWorker;

export function createCloudflareWorkerFor<TEnv = never, TContext = never>(): <
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

export function createRouteUnaryCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => CloudflareWorker<
  TEnv,
  TContext,
  RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
>;
export function createRouteUnaryCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteUnaryWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => CloudflareWorker<TEnv, TContext, TRequest>;
export function createRouteUnaryCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareRouteUnaryWorkerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): CloudflareWorker<TEnv, TContext, TRequest> =>
    ({
      fetch: createRouteUnaryJoorHandlerFor<TRequest>()(
        manifest,
        (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
          TManifest,
          TPlugins,
          RpcManifestRouteUnaryBody<TManifest>,
          TRequest
        >
      ),
    }) as CloudflareWorker<TEnv, TContext, TRequest>;
}

export const createUnaryRouteCloudflareWorkerFor: typeof createRouteUnaryCloudflareWorkerFor =
  createRouteUnaryCloudflareWorkerFor;

export const createUnaryCloudflareWorkerFor: typeof createRouteUnaryCloudflareWorkerFor =
  createRouteUnaryCloudflareWorkerFor;

export function createRouteStreamCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => CloudflareWorker<
  TEnv,
  TContext,
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: CloudflareRouteStreamWorkerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => CloudflareWorker<TEnv, TContext, TRequest>;
export function createRouteStreamCloudflareWorkerFor<
  TEnv = never,
  TContext = never,
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: CloudflareRouteStreamWorkerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): CloudflareWorker<TEnv, TContext, TRequest> =>
    ({
      fetch: createRouteStreamJoorHandlerFor<TRequest>()(
        manifest,
        (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
          TManifest,
          TPlugins,
          RpcManifestRouteStreamBody<TManifest>,
          TRequest
        >
      ),
    }) as CloudflareWorker<TEnv, TContext, TRequest>;
}

export const createStreamRouteCloudflareWorkerFor: typeof createRouteStreamCloudflareWorkerFor =
  createRouteStreamCloudflareWorkerFor;

export const createStreamCloudflareWorkerFor: typeof createRouteStreamCloudflareWorkerFor =
  createRouteStreamCloudflareWorkerFor;
