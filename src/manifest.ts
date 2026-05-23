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
  RpcManifestStreamRouteBodyHandler,
  RpcManifestStreamRouteBodyResultHandler,
  RpcManifestStreamRouteTransportBodyResultHandler,
  RpcManifestRequiredServices,
  RpcManifestRouteServices,
  RpcManifestUnaryRouteBodyHandler,
  RpcManifestUnaryRouteBodyResultHandler,
  RpcManifestUnaryRouteTransportBodyResultHandler,
} from './rpc/dispatcher.js';
import type {
  RpcRouteBody,
  RpcRouteBodyResult,
  RpcRouteBodyResultFor,
  RpcRouteBatchRequest,
  RpcUnaryRouteBatchRequest,
  RpcRouteBatchResults,
  RpcUnaryRouteBatchResults,
  RpcManifestClientOptions,
  RpcManifestStreamRouteTransportClient,
  RpcManifestTransportClient,
  RpcManifestUnaryRouteTransportClient,
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
  RpcStreamRouteBody,
  RpcStreamRouteBodyResult,
  RpcStreamRouteBodyResultFor,
  RpcStreamRouteError,
  RpcStreamRouteErrorCode,
  RpcStreamRouteErrorDetails,
  RpcStreamRouteEvent,
  RpcStreamRouteHasHeaders,
  RpcStreamRouteHasResponseHeaders,
  RpcStreamRouteHeaders,
  RpcStreamRouteInput,
  RpcStreamRouteRequiresHeaders,
  RpcStreamRouteRequiresResponseHeaders,
  RpcStreamRouteRequestOptions,
  RpcStreamRouteProtocolRequest,
  RpcStreamRouteProtocolRequestUnion,
  RpcRouteStreamEvent,
  RpcRouteStreamProtocolRequest,
  RpcRouteStreamProtocolRequestUnion,
  RpcUnaryRouteProcedure,
  RpcUnaryRouteClientArgs,
  RpcUnaryRouteClientHeaders,
  RpcUnaryRouteBody,
  RpcUnaryRouteBodyResult,
  RpcUnaryRouteBodyResultFor,
  RpcUnaryRouteEnvelope,
  RpcUnaryRouteEnvelopeUnion,
  RpcUnaryRouteError,
  RpcUnaryRouteErrorCode,
  RpcUnaryRouteErrorDetails,
  RpcUnaryRouteHasHeaders,
  RpcUnaryRouteHasResponseHeaders,
  RpcUnaryRouteHeaders,
  RpcUnaryRouteInput,
  RpcUnaryRouteOutput,
  RpcUnaryRouteResponseHeaders,
  RpcUnaryRouteResult,
  RpcUnaryRouteResultUnion,
  RpcUnaryRouteRequiresHeaders,
  RpcUnaryRouteRequiresResponseHeaders,
  RpcUnaryRouteRequestOptions,
  RpcUnaryRouteProtocolRequest,
  RpcUnaryRouteProtocolRequestUnion,
  RpcUnaryRouteRequest,
  RpcUnaryRouteRequestUnion,
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

export type JoorManifestUnaryRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestUnaryRouteTransportClient<TManifest>;

export type JoorManifestStreamRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestStreamRouteTransportClient<TManifest>;

export type JoorManifestUnaryRouteBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestUnaryRouteBodyResultHandler<TManifest>;

export type JoorManifestStreamRouteBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestStreamRouteBodyResultHandler<TManifest>;

export type JoorManifestUnaryRouteBodyHandler<TManifest extends JoorManifest> =
  RpcManifestUnaryRouteBodyHandler<TManifest>;

export type JoorManifestStreamRouteBodyHandler<TManifest extends JoorManifest> =
  RpcManifestStreamRouteBodyHandler<TManifest>;

export type JoorManifestUnaryRouteTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestUnaryRouteTransportBodyResultHandler<TManifest>;

export type JoorManifestStreamRouteTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestStreamRouteTransportBodyResultHandler<TManifest>;

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

export type JoorManifestUnaryRouteHasHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

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

export type JoorManifestUnaryRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteError<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteError<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteError<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteErrorCode<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteErrorCode<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
  TCode extends JoorManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<JoorManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<JoorManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type JoorManifestUnaryRouteErrorDetails<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
  TCode extends JoorManifestUnaryRouteErrorCode<TManifest, TId>,
> = RpcUnaryRouteErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type JoorManifestStreamRouteErrorDetails<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
  TCode extends JoorManifestStreamRouteErrorCode<TManifest, TId>,
> = RpcStreamRouteErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

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

export type JoorManifestUnaryRouteEnvelopeUnion<TManifest> =
  RpcUnaryRouteEnvelopeUnion<JoorManifestRoutes<TManifest>>;

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

export type JoorManifestUnaryRouteResultUnion<TManifest> =
  RpcUnaryRouteResultUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteRequestUnion<TManifest> = RpcRouteRequestUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteRequestUnion<TManifest> =
  RpcUnaryRouteRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestUnaryRouteRequestUnion<TManifest>
    | JoorManifestUnaryRouteProtocolRequestUnion<TManifest>
  )[],
> = RpcUnaryRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

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

export type JoorManifestUnaryRouteBody<TManifest> = RpcUnaryRouteBody<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestStreamRouteBody<TManifest> = RpcStreamRouteBody<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteBodyResult<TManifest> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResult<TManifest>
    : RpcRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteBodyResult<TManifest> =
  RpcUnaryRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteBodyResult = RpcStreamRouteBodyResult;

export type JoorManifestRouteBodyResultFor<TManifest, TBody> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResultFor<TManifest, TBody>
    : RpcRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestUnaryRouteBodyResultFor<TManifest, TBody> =
  RpcUnaryRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestStreamRouteBodyResultFor<TManifest, TBody> =
  RpcStreamRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestRouteUnaryProtocolRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcUnaryRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryProtocolRequestUnion<TManifest> =
  RpcRouteUnaryProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteProtocolRequestUnion<TManifest> =
  RpcUnaryRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteStreamProtocolRequest<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcRouteStreamProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcStreamRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteStreamProtocolRequestUnion<TManifest> =
  RpcRouteStreamProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteProtocolRequestUnion<TManifest> =
  RpcStreamRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestUnaryRouteProtocolRequestUnion<TManifest>[],
> = RpcUnaryRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

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
