import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler, type JoorFetchHandler } from './fetch.js';

export type VercelFetchHandler = JoorFetchHandler;

export function createVercelFetch<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): VercelFetchHandler;
export function createVercelFetch<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): VercelFetchHandler {
  return createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}
