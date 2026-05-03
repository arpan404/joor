import {
  createRpcHandler,
  type HandlerOptions,
  type RpcManifest,
} from '../rpc/dispatcher.js';

export const createJoorHandler = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createRpcHandler(manifest, options);
