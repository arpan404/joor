import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import { createNodeRpcRequestHandler } from './node.js';

export interface ExpressRequest extends IncomingMessage {
  originalUrl?: string;
}

export type ExpressResponse = ServerResponse<IncomingMessage>;

export type ExpressNextFunction = (error?: unknown) => void;

export type ExpressRequestHandler<
  TRequest extends ExpressRequest = ExpressRequest,
  TResponse extends ExpressResponse = ExpressResponse,
  TNext extends ExpressNextFunction = ExpressNextFunction,
> = (
  request: TRequest,
  response: TResponse,
  next: TNext
) => void;

export interface ExpressHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> extends HandlerOptions<TPlugins> {
  hostname?: string;
  useOriginalUrl?: boolean;
}

export type ExpressHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = ExpressHandlerOptions<TPlugins> &
  HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type ExpressRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = ExpressHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type ExpressUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = ExpressRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type ExpressRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = ExpressHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type ExpressStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = ExpressRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type ExpressHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ExpressHandlerOptions<TPlugins>,
  TBody
>;

export type ExpressRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = ExpressHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type ExpressUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = ExpressRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type ExpressRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = ExpressHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type ExpressStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = ExpressRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

const createExpressHandlerWithOptions = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {}
): ExpressRequestHandler => {
  const handler = createNodeRpcRequestHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
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
>(
  manifest: TManifest,
  ...args: ExpressHandlerOptionsArgs<TManifest, TPlugins>
): ExpressRequestHandler;
export function createExpressHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ExpressHandlerOptions = {}
): ExpressRequestHandler {
  return createExpressHandlerWithOptions(manifest, options);
}

export const createExpressHandlerFor =
  <
    TRequest extends ExpressRequest = ExpressRequest,
    TResponse extends ExpressResponse = ExpressResponse,
    TNext extends ExpressNextFunction = ExpressNextFunction,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: ExpressHandlerOptionsArgs<TManifest, TPlugins>
  ): ExpressRequestHandler<TRequest, TResponse, TNext> =>
    createExpressHandlerWithOptions(
      manifest,
      (args[0] ?? {}) as ExpressHandlerOptions
    ) as ExpressRequestHandler<TRequest, TResponse, TNext>;
