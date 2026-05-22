import type { ProcedureRuntime } from './procedure/types.js';
import type { RpcManifest } from './rpc/dispatcher.js';

export type JoorRouteMap = Record<string, ProcedureRuntime>;

export type JoorManifest<
  TProcedures extends JoorRouteMap = JoorRouteMap,
> = Omit<RpcManifest, 'procedures'> & {
  procedures: TProcedures;
};

export type JoorManifestRoutes<TManifest> = TManifest extends {
  procedures: infer TProcedures extends JoorRouteMap;
}
  ? TProcedures
  : never;

export const defineManifest = <const TProcedures extends JoorRouteMap>(
  manifest: JoorManifest<TProcedures>
): JoorManifest<TProcedures> => manifest;
