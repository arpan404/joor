import { createRpcHandler, type HandlerOptions } from '../rpc/dispatcher.js';
import type { JoorManifest } from '../manifest.js';

export const createJoorHandler = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createRpcHandler(manifest, options);
