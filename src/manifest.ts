import type { JsonValue } from './schema/json.js';
import type {
  ProcedureErrorCode,
  ProcedureErrorDetails,
  ProcedureRuntime,
  ProcedureServices,
} from './procedure/types.js';
import type { UnionToIntersection } from './context/plugin.js';
import type {
  RpcManifest,
  RpcManifestBody,
  RpcManifestBodyResult,
  RpcManifestBodyResultFor,
  RpcManifestRequiredServices,
  RpcManifestRouteServices,
} from './rpc/dispatcher.js';
import type {
  RpcRouteBody,
  RpcRouteBodyResult,
  RpcRouteBodyResultFor,
  RpcRouteBatchRequest,
  RpcRouteBatchResults,
  RpcManifestClientOptions,
  RpcManifestTransportClient,
  RpcRouteClientArgs,
  RpcRouteClientHeaders,
  RpcRouteEnvelope,
  RpcRouteEnvelopeUnion,
  RpcRouteError,
  RpcRouteErrorCode,
  RpcRouteHasHeaders,
  RpcRouteHasResponseHeaders,
  RpcRouteHeaders,
  RpcRouteId,
  RpcRouteInput,
  RpcRouteOutput,
  RpcRouteProcedure,
  RpcRouteProtocolRequest,
  RpcRouteProtocolRequestUnion,
  RpcRouteRequest,
  RpcRouteRequestOptions,
  RpcRouteRequestUnion,
  RpcRouteResponseHeaders,
  RpcRouteRequiresHeaders,
  RpcRouteRequiresResponseHeaders,
  RpcStreamRouteProcedure,
  RpcStreamRouteClientArgs,
  RpcStreamRouteClientHeaders,
  RpcStreamRouteEvent,
  RpcStreamRouteHeaders,
  RpcStreamRouteInput,
  RpcStreamRouteRequestOptions,
  RpcRouteStreamEvent,
  RpcRouteStreamProtocolRequest,
  RpcRouteStreamProtocolRequestUnion,
  RpcUnaryRouteProcedure,
  RpcUnaryRouteClientArgs,
  RpcUnaryRouteClientHeaders,
  RpcUnaryRouteEnvelope,
  RpcUnaryRouteHeaders,
  RpcUnaryRouteInput,
  RpcUnaryRouteOutput,
  RpcUnaryRouteResponseHeaders,
  RpcUnaryRouteResult,
  RpcUnaryRouteRequestOptions,
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

export type JoorManifestTransportClient<TManifest extends JoorManifest> =
  RpcManifestTransportClient<TManifest>;

export type JoorManifestClientOptions<TManifest extends JoorManifest> =
  RpcManifestClientOptions<TManifest>;

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

export type JoorManifestUnaryRouteProcedure<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteProcedure<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteInput<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteInput<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteOutput<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteServices<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = TManifest extends JoorManifest
  ? RpcManifestRouteServices<TManifest, TId & JoorManifestRouteId<TManifest>>
  : ProcedureServices<JoorManifestRouteProcedure<TManifest, TId>>;

export type JoorManifestRequiredServices<TManifest> =
  TManifest extends JoorManifest
    ? RpcManifestRequiredServices<TManifest>
    : UnionToIntersection<
        {
          [TId in JoorManifestRouteId<TManifest>]: JoorManifestRouteServices<
            TManifest,
            TId
          >;
        }[JoorManifestRouteId<TManifest>]
      >;

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

export type JoorManifestRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteError<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
  TCode extends JoorManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<JoorManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<JoorManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type JoorManifestRouteEnvelope<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteEnvelope<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteEnvelopeUnion<TManifest> = RpcRouteEnvelopeUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteResult<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = JoorManifestRouteEnvelope<TManifest, TId>;

export type JoorManifestUnaryRouteResult<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteResult<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteResultUnion<TManifest> =
  JoorManifestRouteEnvelopeUnion<TManifest>;

export type JoorManifestRouteRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequestUnion<TManifest> = RpcRouteRequestUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteStreamEvent<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcRouteStreamEvent<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteEvent<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteEvent<JoorManifestRoutes<TManifest>, TId>;

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

export type JoorManifestRouteBodyResultFor<TManifest, TBody> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResultFor<TManifest, TBody>
    : RpcRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

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

export type JoorManifestRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequestOptions<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequestOptions<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientArgs<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientArgs<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export const defineManifest = <const TProcedures extends JoorRouteMap>(
  manifest: JoorManifest<TProcedures>
): JoorManifest<TProcedures> => manifest;
