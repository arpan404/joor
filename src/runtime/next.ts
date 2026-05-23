import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler, type JoorFetchHandler } from './fetch.js';

export type NextRouteHandler = JoorFetchHandler;

export interface NextRouteHandlers {
  GET: NextRouteHandler;
  POST: NextRouteHandler;
  OPTIONS: NextRouteHandler;
}

export type NextHandler = NextRouteHandlers;

export type NextRouteHandlersOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type NextHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = NextRouteHandlersOptionsFor<TManifest, TPlugins, TBody>;

export function createNextRouteHandlers<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): NextRouteHandlers;
export function createNextRouteHandlers<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NextRouteHandlers {
  const fetch = createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
  return {
    GET: fetch,
    POST: fetch,
    OPTIONS: fetch,
  };
}

export const createNextHandler: typeof createNextRouteHandlers =
  createNextRouteHandlers;
