import type { UnionToIntersection } from './context/plugin.js';
import type {
  ProcedureErrorCode,
  ProcedureErrorDetails,
  ProcedureRuntime,
  ProcedureServices,
} from './procedure/types.js';
import type {
  RpcManifestClientOptions,
  RpcManifestRouteStreamTransportClient,
  RpcManifestRouteUnaryTransportClient,
  RpcManifestTransportClient,
  RpcRouteBatchRequest,
  RpcRouteBatchResults,
  RpcRouteBody,
  RpcRouteBodyResult,
  RpcRouteBodyResultFor,
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
  RpcRouteRequiresHeaders,
  RpcRouteRequiresResponseHeaders,
  RpcRouteResponseHeaders,
  RpcRouteStreamBodyResult,
  RpcRouteStreamClientArgs,
  RpcRouteStreamClientHeaders,
  RpcRouteStreamError,
  RpcRouteStreamErrorCode,
  RpcRouteStreamErrorDetails,
  RpcRouteStreamEvent,
  RpcRouteStreamHasHeaders,
  RpcRouteStreamHasResponseHeaders,
  RpcRouteStreamHeaders,
  RpcRouteStreamInput,
  RpcRouteStreamOutput,
  RpcRouteStreamProcedure,
  RpcRouteStreamProtocolRequest,
  RpcRouteStreamProtocolRequestUnion,
  RpcRouteStreamRequestOptions,
  RpcRouteStreamRequiresHeaders,
  RpcRouteStreamRequiresResponseHeaders,
  RpcRouteStreamResponseHeaders,
  RpcRouteUnaryBatchRequest,
  RpcRouteUnaryBatchResults,
  RpcRouteUnaryClientArgs,
  RpcRouteUnaryClientHeaders,
  RpcRouteUnaryEnvelope,
  RpcRouteUnaryError,
  RpcRouteUnaryErrorCode,
  RpcRouteUnaryErrorDetails,
  RpcRouteUnaryHasHeaders,
  RpcRouteUnaryHasResponseHeaders,
  RpcRouteUnaryHeaders,
  RpcRouteUnaryInput,
  RpcRouteUnaryOutput,
  RpcRouteUnaryProcedure,
  RpcRouteUnaryProtocolRequest,
  RpcRouteUnaryProtocolRequestUnion,
  RpcRouteUnaryRequest,
  RpcRouteUnaryRequestOptions,
  RpcRouteUnaryRequiresHeaders,
  RpcRouteUnaryRequiresResponseHeaders,
  RpcRouteUnaryResponseHeaders,
  RpcRouteUnaryResult,
  RpcStreamRouteBody,
  RpcStreamRouteBodyResultFor,
  RpcStreamRouteId,
  RpcStreamRouteProtocolRequestUnion,
  RpcUnaryRouteBody,
  RpcUnaryRouteBodyResult,
  RpcUnaryRouteBodyResultFor,
  RpcUnaryRouteEnvelopeUnion,
  RpcUnaryRouteId,
  RpcUnaryRouteProtocolRequestUnion,
  RpcUnaryRouteRequestUnion,
  RpcUnaryRouteResultUnion,
} from './rpc/client.js';
import type {
  RpcManifest,
  RpcManifestBody,
  RpcManifestBodyResult,
  RpcManifestBodyResultFor,
  RpcManifestRequiredServices,
  RpcManifestRouteServices,
  RpcManifestRouteStreamBodyResultHandler,
  RpcManifestRouteStreamTransportBodyResultHandler,
  RpcManifestRouteUnaryBodyResultHandler,
  RpcManifestRouteUnaryTransportBodyResultHandler,
  RpcManifestStreamRouteBodyHandler,
  RpcManifestUnaryRouteBodyHandler,
} from './rpc/dispatcher.js';
import type { JsonValue } from './schema/json.js';

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

export type JoorManifestRouteUnaryTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryTransportClient<TManifest>;

export type JoorManifestUnaryRouteTransportClient<
  TManifest extends JoorManifest,
> = JoorManifestRouteUnaryTransportClient<TManifest>;

export type JoorManifestRouteStreamTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamTransportClient<TManifest>;

export type JoorManifestStreamRouteTransportClient<
  TManifest extends JoorManifest,
> = JoorManifestRouteStreamTransportClient<TManifest>;

export type JoorManifestRouteUnaryBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryBodyResultHandler<TManifest>;

export type JoorManifestRouteStreamBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamBodyResultHandler<TManifest>;

export type JoorManifestUnaryRouteBodyResultHandler<
  TManifest extends JoorManifest,
> = JoorManifestRouteUnaryBodyResultHandler<TManifest>;

export type JoorManifestStreamRouteBodyResultHandler<
  TManifest extends JoorManifest,
> = JoorManifestRouteStreamBodyResultHandler<TManifest>;

export type JoorManifestUnaryRouteBodyHandler<TManifest extends JoorManifest> =
  RpcManifestUnaryRouteBodyHandler<TManifest>;

export type JoorManifestStreamRouteBodyHandler<TManifest extends JoorManifest> =
  RpcManifestStreamRouteBodyHandler<TManifest>;

export type JoorManifestRouteUnaryBodyHandler<TManifest extends JoorManifest> =
  JoorManifestUnaryRouteBodyHandler<TManifest>;

export type JoorManifestRouteStreamBodyHandler<TManifest extends JoorManifest> =
  JoorManifestStreamRouteBodyHandler<TManifest>;

export type JoorManifestRouteUnaryTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryTransportBodyResultHandler<TManifest>;

export type JoorManifestRouteStreamTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamTransportBodyResultHandler<TManifest>;

export type JoorManifestUnaryRouteTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = JoorManifestRouteUnaryTransportBodyResultHandler<TManifest>;

export type JoorManifestStreamRouteTransportBodyResultHandler<
  TManifest extends JoorManifest,
> = JoorManifestRouteStreamTransportBodyResultHandler<TManifest>;

export type JoorManifestClientOptions<TManifest extends JoorManifest> =
  RpcManifestClientOptions<TManifest>;

export type JoorManifestRouteId<TManifest> = RpcRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteId<TManifest> = RpcUnaryRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteUnaryId<TManifest> =
  JoorManifestUnaryRouteId<TManifest>;

export type JoorManifestStreamRouteId<TManifest> = RpcStreamRouteId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteStreamId<TManifest> =
  JoorManifestStreamRouteId<TManifest>;

export type JoorManifestRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryProcedure<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryProcedure<TManifest, TId>;

export type JoorManifestRouteStreamProcedure<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamProcedure<TManifest, TId>;

export type JoorManifestRouteUnaryInput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteInput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryInput<TManifest, TId>;

export type JoorManifestRouteStreamInput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteInput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamInput<TManifest, TId>;

export type JoorManifestRouteUnaryOutput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteOutput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryOutput<TManifest, TId>;

export type JoorManifestRouteStreamOutput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteOutput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamOutput<TManifest, TId>;

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
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryClientHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryClientHeaders<TManifest, TId>;

export type JoorManifestRouteStreamClientHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamClientHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryHasHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHasHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHasHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHasHeaders<TManifest, TId>;

export type JoorManifestRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequiresHeaders<TManifest, TId>;

export type JoorManifestRouteStreamRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequiresHeaders<TManifest, TId>;

export type JoorManifestRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamResponseHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHasResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHasResponseHeaders<TManifest, TId>;

export type JoorManifestRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequiresResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequiresResponseHeaders<TManifest, TId>;

export type JoorManifestRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteError<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryError<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteError<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryError<TManifest, TId>;

export type JoorManifestRouteStreamError<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteError<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamError<TManifest, TId>;

export type JoorManifestRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryErrorCode<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryErrorCode<TManifest, TId>;

export type JoorManifestRouteStreamErrorCode<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamErrorCode<TManifest, TId>;

export type JoorManifestRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
  TCode extends JoorManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<JoorManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<JoorManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type JoorManifestRouteUnaryErrorDetails<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
  TCode extends JoorManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcRouteUnaryErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type JoorManifestUnaryRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
  TCode extends JoorManifestRouteUnaryErrorCode<TManifest, TId>,
> = JoorManifestRouteUnaryErrorDetails<TManifest, TId, TCode>;

export type JoorManifestRouteStreamErrorDetails<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
  TCode extends JoorManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcRouteStreamErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type JoorManifestStreamRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
  TCode extends JoorManifestRouteStreamErrorCode<TManifest, TId>,
> = JoorManifestRouteStreamErrorDetails<TManifest, TId, TCode>;

export type JoorManifestRouteEnvelope<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryEnvelope<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteEnvelope<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryEnvelope<TManifest, TId>;

export type JoorManifestRouteEnvelopeUnion<TManifest> = RpcRouteEnvelopeUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteEnvelopeUnion<TManifest> =
  RpcUnaryRouteEnvelopeUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryEnvelopeUnion<TManifest> =
  JoorManifestUnaryRouteEnvelopeUnion<TManifest>;

export type JoorManifestRouteResult<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = JoorManifestRouteEnvelope<TManifest, TId>;

export type JoorManifestRouteUnaryResult<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResult<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteResult<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryResult<TManifest, TId>;

export type JoorManifestRouteResultUnion<TManifest> =
  JoorManifestRouteEnvelopeUnion<TManifest>;

export type JoorManifestUnaryRouteResultUnion<TManifest> =
  RpcUnaryRouteResultUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryResultUnion<TManifest> =
  JoorManifestUnaryRouteResultUnion<TManifest>;

export type JoorManifestRouteRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequest<TManifest, TId>;

export type JoorManifestRouteRequestUnion<TManifest> = RpcRouteRequestUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteRequestUnion<TManifest> =
  RpcUnaryRouteRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryRequestUnion<TManifest> =
  JoorManifestUnaryRouteRequestUnion<TManifest>;

export type JoorManifestRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteUnaryBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteUnaryBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = JoorManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type JoorManifestRouteStreamEvent<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = RpcRouteStreamEvent<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteEvent<
  TManifest,
  TId extends JoorManifestStreamRouteId<TManifest>,
> = JoorManifestRouteStreamEvent<TManifest, TId>;

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

export type JoorManifestRouteUnaryBody<TManifest> =
  JoorManifestUnaryRouteBody<TManifest>;

export type JoorManifestStreamRouteBody<TManifest> = RpcStreamRouteBody<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteStreamBody<TManifest> =
  JoorManifestStreamRouteBody<TManifest>;

export type JoorManifestRouteBodyResult<TManifest> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResult<TManifest>
    : RpcRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteBodyResult<TManifest> =
  RpcUnaryRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryBodyResult<TManifest> =
  JoorManifestUnaryRouteBodyResult<TManifest>;

export type JoorManifestRouteStreamBodyResult<
  TManifest extends JoorManifest = JoorManifest,
> = RpcRouteStreamBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteBodyResult<
  TManifest extends JoorManifest = JoorManifest,
> = JoorManifestRouteStreamBodyResult<TManifest>;

export type JoorManifestRouteBodyResultFor<TManifest, TBody> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResultFor<TManifest, TBody>
    : RpcRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestUnaryRouteBodyResultFor<TManifest, TBody> =
  RpcUnaryRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestRouteUnaryBodyResultFor<TManifest, TBody> =
  JoorManifestUnaryRouteBodyResultFor<TManifest, TBody>;

export type JoorManifestStreamRouteBodyResultFor<TManifest, TBody> =
  RpcStreamRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestRouteStreamBodyResultFor<TManifest, TBody> =
  JoorManifestStreamRouteBodyResultFor<TManifest, TBody>;

export type JoorManifestRouteUnaryProtocolRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestUnaryRouteId<TManifest>,
> = JoorManifestRouteUnaryProtocolRequest<TManifest, TId>;

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
> = JoorManifestRouteStreamProtocolRequest<TManifest, TId>;

export type JoorManifestRouteStreamProtocolRequestUnion<TManifest> =
  RpcRouteStreamProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteProtocolRequestUnion<TManifest> =
  RpcStreamRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteUnaryBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteUnaryBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = JoorManifestRouteUnaryBatchRequest<TManifest, TRequests>;

export type JoorManifestRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequestOptions<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequestOptions<TManifest, TId>;

export type JoorManifestRouteStreamRequestOptions<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequestOptions<TManifest, TId>;

export type JoorManifestRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteId<TManifest>,
> = RpcRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryClientArgs<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryClientArgs<TManifest, TId>;

export type JoorManifestRouteStreamClientArgs<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamClientArgs<TManifest, TId>;

export const defineManifest = <const TProcedures extends JoorRouteMap>(
  manifest: JoorManifest<TProcedures>
): JoorManifest<TProcedures> => manifest;
