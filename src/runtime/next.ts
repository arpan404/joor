import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler, type JoorFetchHandler } from './fetch.js';

export type NextRouteHandler = JoorFetchHandler;

export interface NextRouteHandlers {
  GET: NextRouteHandler;
  POST: NextRouteHandler;
  OPTIONS: NextRouteHandler;
}

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

export const createNextHandler = createNextRouteHandlers;
