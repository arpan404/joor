import type { JoorManifest } from '../manifest.js';
import type { HandlerOptions, HandlerOptionsFor } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export const createNetlifyFetch = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, (options ?? {}) as HandlerOptionsFor<TManifest>);
