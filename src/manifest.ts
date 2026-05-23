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
  RpcRouteStreamRequest,
  RpcRouteStreamRequestUnion,
  RpcRouteStreamRequestOptions,
  RpcRouteStreamRequiresHeaders,
  RpcRouteStreamRequiresResponseHeaders,
  RpcRouteStreamResponseHeaders,
  RpcRouteUnaryBatchRequest,
  RpcRouteUnaryBatchResults,
  RpcRouteUnaryClientArgs,
  RpcRouteUnaryClientHeaders,
  RpcRouteUnaryEnvelope,
  RpcRouteUnaryEnvelopeUnion,
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
  RpcRouteUnaryRequestUnion,
  RpcRouteUnaryRequiresHeaders,
  RpcRouteUnaryRequiresResponseHeaders,
  RpcRouteUnaryResponseHeaders,
  RpcRouteUnaryResult,
  RpcRouteUnaryResultUnion,
  RpcRouteStreamBody,
  RpcRouteStreamBodyResultFor,
  RpcRouteStreamId,
  RpcRouteUnaryBody,
  RpcRouteUnaryBodyResult,
  RpcRouteUnaryBodyResultFor,
  RpcRouteUnaryId,
  RpcStreamRouteRequest,
  RpcStreamRouteRequestUnion,
} from './rpc/client.js';
import type {
  RpcManifest,
  RpcManifestBody,
  RpcManifestBodyResult,
  RpcManifestBodyResultFor,
  RpcManifestRequiredServices,
  RpcManifestRouteServices,
  RpcManifestRouteStreamBodyHandler,
  RpcManifestRouteStreamBodyResultHandler,
  RpcManifestRouteStreamTransportBodyResultHandler,
  RpcManifestRouteUnaryBodyHandler,
  RpcManifestRouteUnaryBodyResultHandler,
  RpcManifestRouteUnaryTransportBodyResultHandler,
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

export type JoorManifestRouteUnaryBodyHandler<TManifest extends JoorManifest> =
  RpcManifestRouteUnaryBodyHandler<TManifest>;

export type JoorManifestRouteStreamBodyHandler<TManifest extends JoorManifest> =
  RpcManifestRouteStreamBodyHandler<TManifest>;

export type JoorManifestUnaryRouteBodyHandler<TManifest extends JoorManifest> =
  JoorManifestRouteUnaryBodyHandler<TManifest>;

export type JoorManifestStreamRouteBodyHandler<TManifest extends JoorManifest> =
  JoorManifestRouteStreamBodyHandler<TManifest>;

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

export type JoorManifestRouteUnaryId<TManifest> = RpcRouteUnaryId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteId<TManifest> =
  JoorManifestRouteUnaryId<TManifest>;

export type JoorManifestRouteStreamId<TManifest> = RpcRouteStreamId<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestStreamRouteId<TManifest> =
  JoorManifestRouteStreamId<TManifest>;

export type JoorManifestRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryProcedure<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryProcedure<TManifest, TId>;

export type JoorManifestRouteStreamProcedure<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamProcedure<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteProcedure<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamProcedure<TManifest, TId>;

export type JoorManifestRouteUnaryInput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteInput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryInput<TManifest, TId>;

export type JoorManifestRouteStreamInput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteInput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamInput<TManifest, TId>;

export type JoorManifestRouteUnaryOutput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteOutput<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryOutput<TManifest, TId>;

export type JoorManifestRouteStreamOutput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteOutput<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamOutput<TManifest, TId>;

export type JoorManifestRouteServices<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
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
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteInput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteOutput<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteOutput<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryClientHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryClientHeaders<TManifest, TId>;

export type JoorManifestRouteStreamClientHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamClientHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryHasHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHasHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHasHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHasHeaders<TManifest, TId>;

export type JoorManifestRouteHasHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequiresHeaders<TManifest, TId>;

export type JoorManifestRouteStreamRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequiresHeaders<TManifest, TId>;

export type JoorManifestRouteRequiresHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamResponseHeaders<TManifest, TId>;

export type JoorManifestRouteUnaryHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryHasResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamHasResponseHeaders<TManifest, TId>;

export type JoorManifestRouteHasResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequiresResponseHeaders<TManifest, TId>;

export type JoorManifestRouteStreamRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequiresResponseHeaders<TManifest, TId>;

export type JoorManifestRouteRequiresResponseHeaders<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteError<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryError<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteError<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryError<TManifest, TId>;

export type JoorManifestRouteStreamError<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamError<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteError<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamError<TManifest, TId>;

export type JoorManifestRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryErrorCode<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryErrorCode<TManifest, TId>;

export type JoorManifestRouteStreamErrorCode<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteErrorCode<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamErrorCode<TManifest, TId>;

export type JoorManifestRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
  TCode extends JoorManifestRouteErrorCode<
    TManifest,
    TId
  > = JoorManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<JoorManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<JoorManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type JoorManifestRouteUnaryErrorDetails<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
  TCode extends JoorManifestRouteUnaryErrorCode<
    TManifest,
    TId
  > = JoorManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcRouteUnaryErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type JoorManifestUnaryRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
  TCode extends JoorManifestRouteUnaryErrorCode<
    TManifest,
    TId
  > = JoorManifestRouteUnaryErrorCode<TManifest, TId>,
> = JoorManifestRouteUnaryErrorDetails<TManifest, TId, TCode>;

export type JoorManifestRouteStreamErrorDetails<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
  TCode extends JoorManifestRouteStreamErrorCode<
    TManifest,
    TId
  > = JoorManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcRouteStreamErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type JoorManifestStreamRouteErrorDetails<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
  TCode extends JoorManifestRouteStreamErrorCode<
    TManifest,
    TId
  > = JoorManifestRouteStreamErrorCode<TManifest, TId>,
> = JoorManifestRouteStreamErrorDetails<TManifest, TId, TCode>;

export type JoorManifestRouteEnvelope<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryEnvelope<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteEnvelope<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryEnvelope<TManifest, TId>;

export type JoorManifestRouteEnvelopeUnion<TManifest> = RpcRouteEnvelopeUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteUnaryEnvelopeUnion<TManifest> =
  RpcRouteUnaryEnvelopeUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteEnvelopeUnion<TManifest> =
  JoorManifestRouteUnaryEnvelopeUnion<TManifest>;

export type JoorManifestRouteResult<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteEnvelope<TManifest, TId>;

export type JoorManifestRouteUnaryResult<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResult<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteResult<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryResult<TManifest, TId>;

export type JoorManifestRouteResultUnion<TManifest> =
  JoorManifestRouteEnvelopeUnion<TManifest>;

export type JoorManifestRouteUnaryResultUnion<TManifest> =
  RpcRouteUnaryResultUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteResultUnion<TManifest> =
  JoorManifestRouteUnaryResultUnion<TManifest>;

export type JoorManifestRouteRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequest<TManifest, TId>;

export type JoorManifestRouteRequestUnion<TManifest> = RpcRouteRequestUnion<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestRouteUnaryRequestUnion<TManifest> =
  RpcRouteUnaryRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteRequestUnion<TManifest> =
  JoorManifestRouteUnaryRequestUnion<TManifest>;

export type JoorManifestRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[] = readonly (
    | JoorManifestRouteRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteUnaryBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[] = readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = RpcRouteUnaryBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchResults<
  TManifest,
  TRequests extends readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[] = readonly (
    | JoorManifestRouteUnaryRequestUnion<TManifest>
    | JoorManifestRouteUnaryProtocolRequestUnion<TManifest>
  )[],
> = JoorManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type JoorManifestRouteStreamEvent<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamEvent<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteEvent<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamEvent<TManifest, TId>;

export type JoorManifestRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteProtocolRequestUnion<TManifest> =
  RpcRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBody<TManifest> = TManifest extends JoorManifest
  ? RpcManifestBody<TManifest>
  : RpcRouteBody<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryBody<TManifest> = RpcRouteUnaryBody<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestUnaryRouteBody<TManifest> =
  JoorManifestRouteUnaryBody<TManifest>;

export type JoorManifestRouteStreamBody<TManifest> = RpcRouteStreamBody<
  JoorManifestRoutes<TManifest>
>;

export type JoorManifestStreamRouteBody<TManifest> =
  JoorManifestRouteStreamBody<TManifest>;

export type JoorManifestRouteBodyResult<TManifest> =
  TManifest extends JoorManifest
    ? RpcManifestBodyResult<TManifest>
    : RpcRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteUnaryBodyResult<TManifest> =
  RpcRouteUnaryBodyResult<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteBodyResult<TManifest> =
  JoorManifestRouteUnaryBodyResult<TManifest>;

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

export type JoorManifestRouteUnaryBodyResultFor<
  TManifest,
  TBody extends JoorManifestRouteUnaryBody<TManifest>,
> =
  RpcRouteUnaryBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestUnaryRouteBodyResultFor<
  TManifest,
  TBody extends JoorManifestRouteUnaryBody<TManifest>,
> =
  JoorManifestRouteUnaryBodyResultFor<TManifest, TBody>;

export type JoorManifestRouteStreamBodyResultFor<
  TManifest,
  TBody extends JoorManifestRouteStreamBody<TManifest>,
> =
  RpcRouteStreamBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type JoorManifestStreamRouteBodyResultFor<
  TManifest,
  TBody extends JoorManifestRouteStreamBody<TManifest>,
> =
  JoorManifestRouteStreamBodyResultFor<TManifest, TBody>;

export type JoorManifestRouteUnaryProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type JoorManifestRouteUnaryProtocolRequestUnion<TManifest> =
  RpcRouteUnaryProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestUnaryRouteProtocolRequestUnion<TManifest> =
  JoorManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type JoorManifestRouteStreamProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteProtocolRequest<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamProtocolRequest<TManifest, TId>;

export type JoorManifestRouteStreamProtocolRequestUnion<TManifest> =
  RpcRouteStreamProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteProtocolRequestUnion<TManifest> =
  JoorManifestRouteStreamProtocolRequestUnion<TManifest>;

export type JoorManifestRouteStreamRequest<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequest<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcStreamRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteStreamRequestUnion<TManifest> =
  RpcRouteStreamRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestStreamRouteRequestUnion<TManifest> =
  RpcStreamRouteRequestUnion<JoorManifestRoutes<TManifest>>;

export type JoorManifestRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[] =
      readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestRouteUnaryBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[] =
      readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcRouteUnaryBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type JoorManifestUnaryRouteBatchRequest<
  TManifest,
  TRequests extends
    readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[] =
      readonly JoorManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = JoorManifestRouteUnaryBatchRequest<TManifest, TRequests>;

export type JoorManifestRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryRequestOptions<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryRequestOptions<TManifest, TId>;

export type JoorManifestRouteStreamRequestOptions<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteRequestOptions<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamRequestOptions<TManifest, TId>;

export type JoorManifestRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteId<TManifest> = JoorManifestRouteId<TManifest>,
> = RpcRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestRouteUnaryClientArgs<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestUnaryRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteUnaryId<TManifest> = JoorManifestRouteUnaryId<TManifest>,
> = JoorManifestRouteUnaryClientArgs<TManifest, TId>;

export type JoorManifestRouteStreamClientArgs<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type JoorManifestStreamRouteClientArgs<
  TManifest,
  TId extends JoorManifestRouteStreamId<TManifest> = JoorManifestRouteStreamId<TManifest>,
> = JoorManifestRouteStreamClientArgs<TManifest, TId>;

export const defineManifest = <const TProcedures extends JoorRouteMap>(
  manifest: JoorManifest<TProcedures>
): JoorManifest<TProcedures> => manifest;
