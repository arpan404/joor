import type { JoorManifest } from '../manifest.js';
import type { HandlerOptions, HandlerOptionsFor } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface CloudflareWorker {
  fetch(request: Request): Promise<Response>;
}

export const createCloudflareWorker = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): CloudflareWorker => ({
  fetch: createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  ),
});
