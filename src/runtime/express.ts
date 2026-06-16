import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamHandlerOptionsArgsFor,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryHandlerOptionsArgsFor,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
} from '../rpc/dispatcher.js';
import {
  createNodeRpcRequestHandler,
  createRouteStreamNodeRpcRequestHandler,
  createRouteUnaryNodeRpcRequestHandler,
  type NodeRpcRequestHandler,
} from './node.js';

export interface ExpressRequest extends IncomingMessage {
  originalUrl?: string;
}

export type ExpressResponse<
  TRequest extends IncomingMessage = IncomingMessage,
> = ServerResponse<TRequest> & {
  readonly __requestType?: (request: TRequest) => TRequest;
};

export type ExpressNextFunction = (error?: unknown) => void;

export type ExpressRequestHandler<
  TRequest extends ExpressRequest = ExpressRequest,
  TResponse extends ExpressResponse<TRequest> = ExpressResponse<TRequest>,
  TNext extends ExpressNextFunction = ExpressNextFunction,
> = (request: TRequest, response: TResponse, next: TNext) => void;

export interface ExpressHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly hostname?: string;
  readonly useOriginalUrl?: boolean;
}

export type ExpressHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = ExpressHandlerOptions<TPlugins, TBody, TRequest> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ExpressHandlerOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ExpressRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ExpressRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ExpressHandlerOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ExpressRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ExpressRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ExpressHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ExpressHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  ExpressHandlerOptions<TPlugins, TBody, TRequest> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type ExpressRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ExpressHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  ExpressHandlerOptions<TPlugins, TBody, TRequest> &
    RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      TPlugins,
      TBody,
      TRequest
    >,
  TRequest
>;

export type ExpressUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ExpressRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ExpressUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ExpressRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ExpressRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ExpressHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  ExpressHandlerOptions<TPlugins, TBody, TRequest> &
    RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      TPlugins,
      TBody,
      TRequest
    >,
  TRequest
>;

export type ExpressStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ExpressRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type ExpressStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ExpressRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

type ExpressNodeHandlerFactory<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = (
  manifest: TManifest,
  options: HandlerOptionsFor<
    TManifest,
    readonly JoorPlugin<object>[],
    TBody,
    Request
  >,
  hostname: string
) => NodeRpcRequestHandler;

const createExpressHandlerWithOptions = <
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {},
  createHandler: ExpressNodeHandlerFactory<TManifest, TBody> = (
    handlerManifest,
    handlerOptions,
    hostname
  ) => createNodeRpcRequestHandler(handlerManifest, handlerOptions, hostname)
): ExpressRequestHandler => {
  const handler = createHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      TBody,
      Request
    >,
    options.hostname ?? '0.0.0.0'
  );
  const useOriginalUrl = options.useOriginalUrl ?? true;
  return (request, response, next) => {
    const originalUrl = request.url;
    if (useOriginalUrl && request.originalUrl !== undefined) {
      request.url = request.originalUrl;
    }
    Promise.resolve(handler(request, response))
      .catch(next)
      .finally(() => {
        request.url = originalUrl;
      });
  };
};

export function createExpressHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ExpressHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): ExpressRequestHandler;
export function createExpressHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {}
): ExpressRequestHandler {
  return createExpressHandlerWithOptions(manifest, options);
}

export function createRouteUnaryExpressHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ExpressRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): ExpressRequestHandler;
export function createRouteUnaryExpressHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {}
): ExpressRequestHandler {
  return createExpressHandlerWithOptions<
    TManifest,
    RpcManifestRouteUnaryBody<TManifest>
  >(manifest, options, createRouteUnaryNodeRpcRequestHandler);
}

export const createUnaryRouteExpressHandler: typeof createRouteUnaryExpressHandler =
  createRouteUnaryExpressHandler;

export const createUnaryExpressHandler: typeof createRouteUnaryExpressHandler =
  createRouteUnaryExpressHandler;

export function createRouteStreamExpressHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ExpressRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): ExpressRequestHandler;
export function createRouteStreamExpressHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {}
): ExpressRequestHandler {
  return createExpressHandlerWithOptions<
    TManifest,
    RpcManifestRouteStreamBody<TManifest>
  >(manifest, options, createRouteStreamNodeRpcRequestHandler);
}

export const createStreamRouteExpressHandler: typeof createRouteStreamExpressHandler =
  createRouteStreamExpressHandler;

export const createStreamExpressHandler: typeof createRouteStreamExpressHandler =
  createRouteStreamExpressHandler;

export const createExpressHandlerFor =
  <
    TRequest extends ExpressRequest = ExpressRequest,
    TResponse extends ExpressResponse<TRequest> = ExpressResponse<TRequest>,
    TNext extends ExpressNextFunction = ExpressNextFunction,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: ExpressHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      THookRequest
    >
  ): ExpressRequestHandler<TRequest, TResponse, TNext> =>
    createExpressHandlerWithOptions(
      manifest,
      (args[0] ?? {}) as ExpressHandlerOptions
    ) as unknown as ExpressRequestHandler<TRequest, TResponse, TNext>;

export const createRouteUnaryExpressHandlerFor =
  <
    TRequest extends ExpressRequest = ExpressRequest,
    TResponse extends ExpressResponse<TRequest> = ExpressResponse<TRequest>,
    TNext extends ExpressNextFunction = ExpressNextFunction,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: ExpressRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      THookRequest
    >
  ): ExpressRequestHandler<TRequest, TResponse, TNext> =>
    createExpressHandlerWithOptions<
      TManifest,
      RpcManifestRouteUnaryBody<TManifest>
    >(
      manifest,
      (args[0] ?? {}) as ExpressHandlerOptions,
      createRouteUnaryNodeRpcRequestHandler
    ) as unknown as ExpressRequestHandler<TRequest, TResponse, TNext>;

export const createUnaryRouteExpressHandlerFor: typeof createRouteUnaryExpressHandlerFor =
  createRouteUnaryExpressHandlerFor;

export const createUnaryExpressHandlerFor: typeof createRouteUnaryExpressHandlerFor =
  createRouteUnaryExpressHandlerFor;

export const createRouteStreamExpressHandlerFor =
  <
    TRequest extends ExpressRequest = ExpressRequest,
    TResponse extends ExpressResponse<TRequest> = ExpressResponse<TRequest>,
    TNext extends ExpressNextFunction = ExpressNextFunction,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: ExpressRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      THookRequest
    >
  ): ExpressRequestHandler<TRequest, TResponse, TNext> =>
    createExpressHandlerWithOptions<
      TManifest,
      RpcManifestRouteStreamBody<TManifest>
    >(
      manifest,
      (args[0] ?? {}) as ExpressHandlerOptions,
      createRouteStreamNodeRpcRequestHandler
    ) as unknown as ExpressRequestHandler<TRequest, TResponse, TNext>;

export const createStreamRouteExpressHandlerFor: typeof createRouteStreamExpressHandlerFor =
  createRouteStreamExpressHandlerFor;

export const createStreamExpressHandlerFor: typeof createRouteStreamExpressHandlerFor =
  createRouteStreamExpressHandlerFor;
