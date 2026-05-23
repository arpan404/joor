import {
  createRpcHandler,
  type HandlerOptions,
  type HandlerOptionsFor,
  type HandlerOptionsArgs,
  type RpcManifestBody,
} from '../rpc/dispatcher.js';
import type { JoorManifest } from '../manifest.js';
import type { JoorPlugin } from '../context/plugin.js';

export type JoorFetchHandler = (request: Request) => Promise<Response>;

export type JoorHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export function createJoorHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): JoorFetchHandler;
export function createJoorHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): JoorFetchHandler {
  return createRpcHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
}
