import type { HandlerOptions, RpcManifest } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export const createVercelFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);
