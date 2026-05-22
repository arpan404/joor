import type { ProcedureRuntime } from './procedure/types.js';
import type {
  RpcManifest,
  RpcManifestBody,
  RpcManifestBodyResult,
} from './rpc/dispatcher.js';
import type {
  RpcRouteBody,
  RpcRouteBodyResult,
  RpcRouteBatchRequest,
  RpcRouteBatchResults,
  RpcRouteEnvelope,
  RpcRouteError,
  RpcRouteHeaders,
  RpcRouteId,
  RpcRouteInput,
  RpcRouteOutput,
  RpcRouteProcedure,
  RpcRouteProtocolRequest,
  RpcRouteProtocolRequestUnion,
  RpcRouteRequest,
  RpcRouteRequestUnion,
  RpcRouteResponseHeaders,
  RpcRouteStreamEvent,
  RpcRouteStreamProtocolRequest,
  RpcRouteStreamProtocolRequestUnion,
  RpcRouteUnaryProtocolRequest,
  RpcRouteUnaryProtocolRequestUnion,
  RpcStreamRouteId,
  RpcUnaryRouteId,
} from './rpc/client.js';

export type JoorRouteMap = Record<string, ProcedureRuntime>;

export type JoorManifest<TProcedures extends JoorRouteMap = JoorRouteMap> =
  Omit<RpcManifest, 'procedures'> & {
    procedures: TProcedures;
  };

export type JoorManifestRoutes<TManifest> = TManifest extends {
  procedures: infer TProcedures extends JoorRouteMap;
}
  ? TProcedures
  : never;

export type JoorManifestRouteId<TManifest> = RpcRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteId<TManifest> = RpcUnaryRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestStreamRouteId<TManifest> = RpcStreamRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteInput<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteOutput<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteError<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteEnvelope<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequestUnion<TManifest> = RpcRouteRequestUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteBatchResults<
  TManifest,
  TRequests extends readonly unknown[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteStreamEvent<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcRouteStreamEvent<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteProtocolRequestUnion<TManifest> =
  RpcRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBody<TManifest> = TManifest extends JoorManifest
  ? RpcManifestBody<TManifest>
  : RpcRouteBody<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBodyResult<TManifest> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResult<TManifest>
    : RpcRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryProtocolRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryProtocolRequestUnion<TManifest> =
  RpcRouteUnaryProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteStreamProtocolRequest<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcRouteStreamProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteStreamProtocolRequestUnion<TManifest> =
  RpcRouteStreamProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export const defineManifest = <const TProcedures extends JoorRouteMap>(
  manifest: JoorManifest<TProcedures>
): JoorManifest<TProcedures> => manifest;
