import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import { createJoorHandler } from './fetch.js';

export interface CloudflareWorker {
  fetch(request: Request): Promise<Response>;
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
    fetch: createJoorHandler(
      manifest,
      (options ?? {}) as HandlerOptionsFor<TManifest>
    ),
  };
}
