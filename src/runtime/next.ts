import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler } from './fetch.js';

export interface NextRouteHandlers {
  GET(request: Request): Promise<Response>;
  POST(request: Request): Promise<Response>;
  OPTIONS(request: Request): Promise<Response>;
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
