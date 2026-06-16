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

export type VercelFetchHandler<TRequest extends Request = Request> =
  JoorFetchHandler<TRequest>;

export interface VercelFunction<TRequest extends Request = Request> {
  readonly fetch: VercelFetchHandler<TRequest>;
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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type VercelUnaryRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelUnaryFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteStreamFetchOptionsFor<
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

export type VercelStreamRouteFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = VercelRouteStreamFetchOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type VercelStreamFetchOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
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
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type VercelUnaryRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelUnaryFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = VercelRouteUnaryFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelRouteStreamFetchOptionsArgs<
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

export type VercelStreamRouteFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = VercelRouteStreamFetchOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type VercelStreamFetchOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
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
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >
  );
}

export function createRouteUnaryVercelFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): VercelFetchHandler<TRequest>;
export function createRouteUnaryVercelFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFetchHandler {
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

export const createUnaryRouteVercelFetch: typeof createRouteUnaryVercelFetch =
  createRouteUnaryVercelFetch;

export const createUnaryVercelFetch: typeof createRouteUnaryVercelFetch =
  createRouteUnaryVercelFetch;

export function createRouteStreamVercelFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): VercelFetchHandler<TRequest>;
export function createRouteStreamVercelFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFetchHandler {
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

export const createStreamRouteVercelFetch: typeof createRouteStreamVercelFetch =
  createRouteStreamVercelFetch;

export const createStreamVercelFetch: typeof createRouteStreamVercelFetch =
  createRouteStreamVercelFetch;

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

export function createRouteUnaryVercelFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => VercelFetchHandler<RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryVercelFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => VercelFetchHandler<TRequest>;
export function createRouteUnaryVercelFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): VercelFetchHandler<TRequest> =>
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

export const createUnaryRouteVercelFetchFor: typeof createRouteUnaryVercelFetchFor =
  createRouteUnaryVercelFetchFor;

export const createUnaryVercelFetchFor: typeof createRouteUnaryVercelFetchFor =
  createRouteUnaryVercelFetchFor;

export function createRouteStreamVercelFetchFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => VercelFetchHandler<
  RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
>;
export function createRouteStreamVercelFetchFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => VercelFetchHandler<TRequest>;
export function createRouteStreamVercelFetchFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): VercelFetchHandler<TRequest> =>
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

export const createStreamRouteVercelFetchFor: typeof createRouteStreamVercelFetchFor =
  createRouteStreamVercelFetchFor;

export const createStreamVercelFetchFor: typeof createRouteStreamVercelFetchFor =
  createRouteStreamVercelFetchFor;

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
      (options ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        readonly JoorPlugin<object>[],
        RpcManifestBody<TManifest>,
        Request
      >
    ),
  };
}

export function createRouteUnaryVercelFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): VercelFunction<TRequest>;
export function createRouteUnaryVercelFunction<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFunction {
  return {
    fetch: createRouteUnaryVercelFetch(
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

export const createUnaryRouteVercelFunction: typeof createRouteUnaryVercelFunction =
  createRouteUnaryVercelFunction;

export const createUnaryVercelFunction: typeof createRouteUnaryVercelFunction =
  createRouteUnaryVercelFunction;

export function createRouteStreamVercelFunction<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): VercelFunction<TRequest>;
export function createRouteStreamVercelFunction<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFunction {
  return {
    fetch: createRouteStreamVercelFetch(
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

export const createStreamRouteVercelFunction: typeof createRouteStreamVercelFunction =
  createRouteStreamVercelFunction;

export const createStreamVercelFunction: typeof createRouteStreamVercelFunction =
  createRouteStreamVercelFunction;

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

export function createRouteUnaryVercelFunctionFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>
  >
) => VercelFunction<RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>>;
export function createRouteUnaryVercelFunctionFor<TRequest extends Request>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteUnaryFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
) => VercelFunction<TRequest>;
export function createRouteUnaryVercelFunctionFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelRouteUnaryFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): VercelFunction<TRequest> => ({
    fetch: createRouteUnaryJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteUnaryHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteUnaryBody<TManifest>,
        TRequest
      >
    ),
  });
}

export const createUnaryRouteVercelFunctionFor: typeof createRouteUnaryVercelFunctionFor =
  createRouteUnaryVercelFunctionFor;

export const createUnaryVercelFunctionFor: typeof createRouteUnaryVercelFunctionFor =
  createRouteUnaryVercelFunctionFor;

export function createRouteStreamVercelFunctionFor(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>
  >
) => VercelFunction<RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>>;
export function createRouteStreamVercelFunctionFor<
  TRequest extends Request,
>(): <
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: VercelRouteStreamFetchOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
) => VercelFunction<TRequest>;
export function createRouteStreamVercelFunctionFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: VercelRouteStreamFetchOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): VercelFunction<TRequest> => ({
    fetch: createRouteStreamJoorHandlerFor<TRequest>()(
      manifest,
      (args[0] ?? {}) as RpcManifestRouteStreamHandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestRouteStreamBody<TManifest>,
        TRequest
      >
    ),
  });
}

export const createStreamRouteVercelFunctionFor: typeof createRouteStreamVercelFunctionFor =
  createRouteStreamVercelFunctionFor;

export const createStreamVercelFunctionFor: typeof createRouteStreamVercelFunctionFor =
  createRouteStreamVercelFunctionFor;
