import type { HandlerOptions, RpcManifest } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface CloudflareWorker {
  fetch(request: Request): Promise<Response>;
}

export const createCloudflareWorker = (
  manifest: RpcManifest,
  options?: HandlerOptions
): CloudflareWorker => ({
  fetch: createJoorHandler(manifest, options),
});
