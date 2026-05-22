import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler } from './fetch.js';

export function createNetlifyFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): (request: Request) => Promise<Response>;
export function createNetlifyFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): (request: Request) => Promise<Response> {
  return createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}
