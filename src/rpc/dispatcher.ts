import {
  createFetchRequestSource,
  createRuntimeContext,
  emptyContextObject,
  emptyJsonObject,
  type ContextRequestSource,
} from '../context/context.js';
import {
  resolvePluginServices,
  type JoorPlugin,
  type PluginServices,
  type UnionToIntersection,
} from '../context/plugin.js';
import type {
  MaybePromise,
  ProcedureError,
  ProcedureErrorCode,
  ProcedureErrorDetails,
  ProcedureHasHeaders,
  ProcedureHasResponseHeaders,
  ProcedureHeaders,
  ProcedureInput,
  ProcedureOutput,
  ProcedureRequiresHeaders,
  ProcedureRequiresResponseHeaders,
  ProcedureRuntime,
  ProcedureResponseHeaders,
  ProcedureRuntimeValue,
  ProcedureServices,
  StreamEvent,
} from '../procedure/types.js';
import type { ProcedureResult } from '../procedure/result.js';
import {
  isJsonObject,
  type JsonObject,
  type JsonValue,
} from '../schema/json.js';
import { validate } from '../schema/validate.js';
import { createSseResponse, encodeSse } from './stream.js';
import {
  authenticateOnce,
  createExecutionState,
  type ExecutionState,
  uncachedExecutionState,
} from '../runtime/internal/auth-execution.js';
import {
  createProcedureCacheKey,
  DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
  readCachedProcedureSuccess,
  type CachedProcedureHeaders,
  type CachedProcedureSuccess,
  type ProcedureCacheHeaderValues,
  writeCachedProcedureSuccess,
} from '../runtime/internal/procedure-cache.js';
import {
  createRateLimitKey,
  DEFAULT_RATE_LIMIT_MAX_ENTRIES,
  reserveRateLimitSlot,
  type RateLimitIdentityResolver,
  type RateLimitRuntimeOptions,
  type RateLimitWindow,
} from '../runtime/internal/rate-limit.js';
import {
  validationDetails,
  type RpcEnvelope,
  type RpcError,
  type RpcFailure,
  type RpcFrameworkErrorCode,
  type RpcRequest,
} from './protocol.js';
import { parseDurationMs } from '../internal/duration.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from '../runtime/body.js';
import {
  jsonContentHeaders,
  rpcEnvelopeToResponse,
} from '../runtime/response.js';

export interface RpcManifest<
  TProcedures extends Record<string, ProcedureRuntime> = Record<
    string,
    ProcedureRuntime
  >,
> {
  procedures: TProcedures;
}

export type RpcManifestRoutes<TManifest extends RpcManifest> =
  TManifest extends RpcManifest<infer TProcedures> ? TProcedures : never;

export type RpcManifestRouteId<TManifest extends RpcManifest> = Extract<
  keyof RpcManifestRoutes<TManifest>,
  string
>;

export type RpcManifestRouteUnaryId<TManifest extends RpcManifest> = {
  [TId in RpcManifestRouteId<TManifest>]: [
    StreamEvent<RpcManifestRoutes<TManifest>[TId]>,
  ] extends [never]
    ? TId
    : never;
}[RpcManifestRouteId<TManifest>];

export type RpcManifestUnaryRouteId<TManifest extends RpcManifest> =
  RpcManifestRouteUnaryId<TManifest>;

export type RpcManifestRouteStreamId<TManifest extends RpcManifest> = Exclude<
  RpcManifestRouteId<TManifest>,
  RpcManifestRouteUnaryId<TManifest>
>;

export type RpcManifestStreamRouteId<TManifest extends RpcManifest> =
  RpcManifestRouteStreamId<TManifest>;

export type RpcManifestRouteUnaryProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteStreamProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteUnaryInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteInput<TManifest, TId>;

export type RpcManifestRouteStreamInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteInput<TManifest, TId>;

export type RpcManifestRouteUnaryOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteOutput<TManifest, TId>;

export type RpcManifestRouteStreamOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteOutput<TManifest, TId>;

export type RpcManifestRouteUnaryHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHasHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHasHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteError<TManifest, TId>;

export type RpcManifestRouteStreamError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteError<TManifest, TId>;

export type RpcManifestRouteUnaryErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteErrorCode<TManifest, TId>;

export type RpcManifestRouteStreamErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteErrorCode<TManifest, TId>;

export type RpcManifestRouteUnaryErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcManifestRouteErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteStreamErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcManifestRouteErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteServices<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureServices<RpcManifestRoutes<TManifest>[TId]>;

export type RpcManifestRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureInput<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureOutput<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureHasHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureRequiresHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureHasResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = ProcedureRequiresResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = RpcManifestProcedureError<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> =
  | ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
  | Exclude<
      RpcFrameworkErrorCode,
      ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
    >;

export type RpcManifestRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
  TCode extends RpcManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<RpcManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type RpcManifestRouteStreamEvent<
  TManifest extends RpcManifest,
  TId extends RpcManifestStreamRouteId<TManifest>,
> = StreamEvent<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestStreamRouteEvent<
  TManifest extends RpcManifest,
  TId extends RpcManifestStreamRouteId<TManifest>,
> = RpcManifestRouteStreamEvent<TManifest, TId>;

type RpcManifestServiceContribution<TServices> = [TServices] extends [
  Record<string, never>,
]
  ? never
  : TServices;

type RpcManifestServiceContributions<TManifest extends RpcManifest> = {
  [TId in RpcManifestRouteId<TManifest>]: RpcManifestServiceContribution<
    RpcManifestRouteServices<TManifest, TId>
  >;
}[RpcManifestRouteId<TManifest>];

export type RpcManifestRequiredServices<TManifest extends RpcManifest> = [
  RpcManifestServiceContributions<TManifest>,
] extends [never]
  ? Record<string, never>
  : UnionToIntersection<RpcManifestServiceContributions<TManifest>>;

export type RpcManifestProcedureFrameworkError<TProcedure> = RpcError<
  Exclude<RpcFrameworkErrorCode, ProcedureErrorCode<TProcedure>>,
  JsonValue
>;

export type RpcManifestProcedureError<TProcedure> =
  | ProcedureError<TProcedure>
  | RpcManifestProcedureFrameworkError<TProcedure>;

export type RpcManifestRouteEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestUnaryRouteId<TManifest>,
> = RpcEnvelope<
  ProcedureOutput<RpcManifestRoutes<TManifest>[TId]> & JsonValue,
  TId,
  ProcedureResponseHeaders<RpcManifestRoutes<TManifest>[TId]>,
  RpcManifestProcedureError<RpcManifestRoutes<TManifest>[TId]>
>;

export type RpcManifestRouteEnvelopeUnion<TManifest extends RpcManifest> = {
  [TId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteEnvelope<
    TManifest,
    TId
  >;
}[RpcManifestRouteUnaryId<TManifest>];

export type RpcManifestUnaryRouteEnvelopeUnion<TManifest extends RpcManifest> =
  RpcManifestRouteEnvelopeUnion<TManifest>;

export type RpcManifestRouteResult<
  TManifest extends RpcManifest,
  TId extends RpcManifestUnaryRouteId<TManifest>,
> = RpcManifestRouteEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryResult<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteResult<TManifest, TId>;

export type RpcManifestRouteResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteEnvelopeUnion<TManifest>;

export type RpcManifestUnaryRouteResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteResultUnion<TManifest>;

export type RpcManifestRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = {
  id: TId;
  input: ProcedureInput<RpcManifestRoutes<TManifest>[TId]> & JsonValue;
  traceId?: string;
};

export type RpcManifestRouteUnaryProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestUnaryRouteId<TManifest>,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestRouteStreamProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestStreamRouteId<TManifest>,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestUnaryRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestUnaryRouteId<TManifest>,
> = RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type RpcManifestStreamRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestStreamRouteId<TManifest>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteId<TManifest>]: RpcManifestRouteProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteId<TManifest>];

export type RpcManifestRouteUnaryProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteUnaryProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteUnaryId<TManifest>];

export type RpcManifestUnaryRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestRouteBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = TRequests;

export type RpcManifestRouteUnaryBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcManifestRouteBatchRequest<TManifest, TRequests>;

type RpcManifestRouteBatchResultRequest<TManifest extends RpcManifest> =
  | RpcManifestRouteUnaryProtocolRequestUnion<TManifest>
  | RpcManifestRouteRequestUnion<TManifest>;

type RpcManifestRouteBatchResultFor<
  TManifest extends RpcManifest,
  TRequest,
> = TRequest extends {
  id: infer TId extends RpcManifestUnaryRouteId<TManifest>;
}
  ? TRequest extends
      | RpcManifestRouteUnaryProtocolRequest<TManifest, TId>
      | RpcManifestRouteRequest<TManifest, TId>
    ? RpcManifestRouteEnvelope<TManifest, TId>
    : never
  : never;

export type RpcManifestRouteBatchResults<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestRouteBatchResultRequest<TManifest>[],
> = {
  [TIndex in keyof TRequests]: RpcManifestRouteBatchResultFor<
    TManifest,
    TRequests[TIndex]
  >;
};

export type RpcManifestRouteUnaryBatchResults<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestRouteBatchResultRequest<TManifest>[],
> = RpcManifestRouteBatchResults<TManifest, TRequests>;

export type RpcManifestRouteStreamProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteStreamId<TManifest>]: RpcManifestRouteStreamProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteStreamId<TManifest>];

export type RpcManifestStreamRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestBody<TManifest extends RpcManifest> =
  | RpcManifestRouteProtocolRequestUnion<TManifest>
  | RpcManifestRouteBatchRequest<
      TManifest,
      readonly RpcManifestRouteUnaryProtocolRequestUnion<TManifest>[]
    >;

export type RpcManifestRouteUnaryBody<TManifest extends RpcManifest> =
  | RpcManifestRouteUnaryProtocolRequestUnion<TManifest>
  | RpcManifestRouteUnaryBatchRequest<
      TManifest,
      readonly RpcManifestRouteUnaryProtocolRequestUnion<TManifest>[]
    >;

export type RpcManifestUnaryRouteBody<TManifest extends RpcManifest> =
  RpcManifestRouteUnaryBody<TManifest>;

export type RpcManifestRouteStreamBody<TManifest extends RpcManifest> =
  RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestStreamRouteBody<TManifest extends RpcManifest> =
  RpcManifestRouteStreamBody<TManifest>;

export type RpcBodyResult = RpcEnvelope | readonly RpcEnvelope[] | Response;

export type RpcManifestBodyResult<TManifest extends RpcManifest> =
  | RpcManifestRouteEnvelopeUnion<TManifest>
  | readonly RpcManifestRouteEnvelopeUnion<TManifest>[]
  | Response;

export type RpcManifestRouteUnaryBodyResult<TManifest extends RpcManifest> =
  RpcManifestBodyResult<TManifest>;

export type RpcManifestUnaryRouteBodyResult<TManifest extends RpcManifest> =
  RpcManifestRouteUnaryBodyResult<TManifest>;

export type RpcManifestRouteStreamBodyResult<
  _TManifest extends RpcManifest = RpcManifest,
> = Response;

export type RpcManifestStreamRouteBodyResult<
  TManifest extends RpcManifest = RpcManifest,
> = RpcManifestRouteStreamBodyResult<TManifest>;

type RpcManifestOptionalHeaderKeys<THeaders extends object> = keyof {
  [TKey in keyof THeaders as undefined extends THeaders[TKey]
    ? TKey
    : never]: true;
};

type RpcManifestRequiredHeaderFields<THeaders extends object> = {
  [TKey in keyof THeaders as TKey extends RpcManifestOptionalHeaderKeys<THeaders>
    ? never
    : TKey]: THeaders[TKey];
};

type RpcManifestOptionalHeaderFields<THeaders extends object> = {
  [TKey in RpcManifestOptionalHeaderKeys<THeaders>]?:
    | THeaders[TKey]
    | undefined;
};

type RpcManifestRouteRequestHeaders<TManifest extends RpcManifest, TId> =
  TId extends RpcManifestRouteId<TManifest>
    ? ProcedureHeaders<
        RpcManifestRouteProcedure<TManifest, TId>
      > extends infer THeaders
      ? THeaders extends object
        ? RpcManifestRequiredHeaderFields<THeaders> &
            RpcManifestOptionalHeaderFields<THeaders>
        : never
      : never
    : never;

export type RpcManifestRouteClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = RpcManifestRouteRequestHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteClientHeaders<TManifest, TId>;

export type RpcManifestRouteStreamClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteClientHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteResponseHeaders<TManifest, TId>;

export type RpcManifestRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> =
  ProcedureRequiresHeaders<
    RpcManifestRouteProcedure<TManifest, TId>
  > extends false
    ? { headers?: RpcManifestRouteClientHeaders<TManifest, TId> }
    : { headers: RpcManifestRouteClientHeaders<TManifest, TId> };

export type RpcManifestRouteUnaryRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequestOptions<TManifest, TId>;

export type RpcManifestRouteStreamRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequestOptions<TManifest, TId>;

export type RpcManifestRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> =
  RpcManifestRouteRequiresHeaders<TManifest, TId> extends false
    ? [
        input: RpcManifestRouteInput<TManifest, TId>,
        options?: RpcManifestRouteRequestOptions<TManifest, TId>,
      ]
    : [
        input: RpcManifestRouteInput<TManifest, TId>,
        options: RpcManifestRouteRequestOptions<TManifest, TId>,
      ];

export type RpcManifestRouteUnaryClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteClientArgs<TManifest, TId>;

export type RpcManifestRouteStreamClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteClientArgs<TManifest, TId>;

export type RpcManifestRouteRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestUnaryRouteId<TManifest>,
> = {
  id: TId;
  input: RpcManifestRouteInput<TManifest, TId>;
} & (RpcManifestRouteRequiresHeaders<TManifest, TId> extends false
  ? { headers?: RpcManifestRouteClientHeaders<TManifest, TId> }
  : { headers: RpcManifestRouteClientHeaders<TManifest, TId> });

export type RpcManifestRouteUnaryRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequest<TManifest, TId>;

export type RpcManifestRouteRequestUnion<TManifest extends RpcManifest> = {
  [TId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteUnaryId<TManifest>];

export type RpcManifestUnaryRouteRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteRequestUnion<TManifest>;

type RpcManifestProtocolBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = TBody extends { id: infer TId extends RpcManifestRouteId<TManifest> }
  ? TId extends RpcManifestStreamRouteId<TManifest>
    ? TBody extends RpcManifestRouteStreamProtocolRequest<TManifest, TId>
      ? Response
      : never
    : TId extends RpcManifestUnaryRouteId<TManifest>
      ? TBody extends
          | RpcManifestRouteUnaryProtocolRequest<TManifest, TId>
          | RpcManifestRouteRequest<TManifest, TId>
        ? RpcManifestRouteEnvelope<TManifest, TId> | Response
        : never
      : never
  : TBody extends { id: string }
    ? never
    : RpcManifestBodyResult<TManifest>;

export type RpcManifestBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = TBody extends readonly unknown[]
  ? TBody extends readonly RpcManifestRouteBatchResultRequest<TManifest>[]
    ? RpcManifestRouteBatchResults<TManifest, TBody> | Response
    : never
  : RpcManifestProtocolBodyResultFor<TManifest, TBody>;

export type RpcManifestRouteUnaryBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = RpcManifestBodyResultFor<TManifest, TBody>;

export type RpcManifestRouteStreamBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = RpcManifestBodyResultFor<TManifest, TBody>;

export type RpcBodyResultHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: Request,
  body: TBody
) => Promise<RpcManifestBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteUnaryBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: Request,
  body: TBody
) => Promise<RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteStreamBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: Request,
  body: TBody
) => Promise<RpcManifestRouteStreamBodyResultFor<TManifest, TBody>>;

export type RpcRequestHandler = (request: Request) => Promise<Response>;

export type RpcBodyHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: Request,
  body: TBody
) => Promise<Response>;

export type RpcManifestRouteUnaryBodyHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestRouteUnaryBody<TManifest>,
>(
  request: Request,
  body: TBody
) => Promise<Response>;

export type RpcManifestRouteStreamBodyHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestRouteStreamBody<TManifest>,
>(
  request: Request,
  body: TBody
) => Promise<Response>;

export type RpcManifestUnaryRouteBodyHandler<TManifest extends RpcManifest> =
  RpcManifestRouteUnaryBodyHandler<TManifest>;

export type RpcManifestStreamRouteBodyHandler<TManifest extends RpcManifest> =
  RpcManifestRouteStreamBodyHandler<TManifest>;

export type RpcTransportBodyResultHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: ContextRequestSource,
  body: TBody
) => Promise<RpcManifestBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteUnaryTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteStreamTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<RpcManifestRouteStreamBodyResultFor<TManifest, TBody>>;

interface PreparedProcedure {
  procedure: ProcedureRuntime;
  headers?: ProcedureRuntime['headers'];
  responseHeaders?: ProcedureRuntime['responseHeaders'];
  auth?: ProcedureRuntime['auth'];
  output?: ProcedureRuntime['output'];
  headerKeys?: string[];
  rateLimit?: {
    limit: number;
    window: string;
    windowMs: number;
  };
}

interface RuntimeOptions {
  cors: HeadersInit;
  cacheMaxEntries: number;
  enforceRateLimit: boolean;
  rateLimit: RateLimitRuntimeOptions;
  validateHeaders: boolean;
  validateInput: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
}

export interface HandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
> {
  plugins?: TPlugins;
  middleware?: readonly JoorMiddleware<PluginServices<TPlugins>, TBody>[];
  hooks?: HandlerHooks<PluginServices<TPlugins>, TBody>;
  path?: string;
  cors?: {
    origin?: string;
    headers?: string[];
    methods?: string[];
  };
  maxBodyBytes?: number;
  cache?: {
    maxEntries?: number;
  };
  rateLimit?: {
    trustProxy?: boolean;
    maxEntries?: number;
    identity?: RateLimitIdentityResolver;
  };
  validateInput?: boolean;
  validateHeaders?: boolean;
  validateOutput?: boolean;
  validateResponseHeaders?: boolean;
  enforceRateLimit?: boolean;
  onError?(error: Error, request: Request): void;
}

export type HandlerOptionServices<TOptions> =
  TOptions extends HandlerOptions<infer TPlugins>
    ? PluginServices<TPlugins>
    : Record<string, never>;

type HandlerOptionsHaveRequiredServices<TRequiredServices, TAvailableServices> =
  [TRequiredServices] extends [Record<string, never>]
    ? true
    : [TRequiredServices] extends [object]
      ? [TAvailableServices] extends [TRequiredServices]
        ? true
        : false
      : false;

export type HandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptions<TPlugins, TBody> &
  (HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? unknown
    : {
        plugins: TPlugins & {
          readonly __joorMissingServices: RpcManifestRequiredServices<TManifest>;
        };
      });

export type RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type RpcManifestRouteStreamHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

type HandlerOptionsArgsBody<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TOptionsOrBody,
> =
  TOptionsOrBody extends HandlerOptions<TPlugins, infer TBody>
    ? [unknown] extends [TBody]
      ? RpcManifestBody<TManifest>
      : TBody & RpcManifestBody<TManifest>
    : TOptionsOrBody & RpcManifestBody<TManifest>;

type HandlerOptionsArgsOptions<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TOptionsOrBody,
  TBody extends RpcManifestBody<TManifest>,
> =
  TOptionsOrBody extends HandlerOptions<TPlugins>
    ? TOptionsOrBody
    : HandlerOptions<TPlugins, TBody>;

export type HandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody extends HandlerOptions<TPlugins> | RpcManifestBody<TManifest> =
    HandlerOptions<TPlugins, RpcManifestBody<TManifest>>,
  TBody extends RpcManifestBody<TManifest> = HandlerOptionsArgsBody<
    TManifest,
    TPlugins,
    TOptionsOrBody
  >,
  TOptions extends HandlerOptions<TPlugins> = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
> =
  HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? [options?: TOptions & HandlerOptionsFor<TManifest, TPlugins, TBody>]
    : [options: TOptions & HandlerOptionsFor<TManifest, TPlugins, TBody>];

export type HandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<TManifest, TPlugins, TBody>;

export type RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

type HandlerOptionsForTrailing<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type HandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> =
  HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? [
        options?: HandlerOptionsForTrailing<TManifest, TPlugins, TBody>,
        ...trailingArgs: TTrailingArgs,
      ]
    : [
        options: HandlerOptionsForTrailing<TManifest, TPlugins, TBody>,
        ...trailingArgs: TTrailingArgs,
      ];

export type HandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsWithTrailingArgs<
  TManifest,
  [preflight?: boolean],
  TPlugins,
  TBody
>;

export type DefineHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  options: HandlerOptionsFor<TManifest, TPlugins, TBody>
) => HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DefineRouteUnaryHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
>(
  options: RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>
) => RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DefineUnaryRouteHandlerOptions<TManifest extends RpcManifest> =
  DefineRouteUnaryHandlerOptions<TManifest>;

export type DefineRouteStreamHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
>(
  options: RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>
) => RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type DefineStreamRouteHandlerOptions<TManifest extends RpcManifest> =
  DefineRouteStreamHandlerOptions<TManifest>;

export function defineHandlerOptions<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineHandlerOptions<TManifest>;
export function defineHandlerOptions<
  TManifest extends RpcManifest,
>(): DefineHandlerOptions<TManifest>;
export function defineHandlerOptions<TManifest extends RpcManifest>(
  _manifest?: TManifest
): DefineHandlerOptions<TManifest> {
  return ((options) => options) as DefineHandlerOptions<TManifest>;
}

export interface HandlerHookContext<
  TServices extends object = object,
  TBody = unknown,
> {
  services: TServices;
  body?: TBody;
}

export interface HandlerHooks<
  TServices extends object = object,
  TBody = unknown,
> {
  beforeRequest?(
    request: Request,
    context: HandlerHookContext<TServices, TBody>
  ): MaybePromise<Response | undefined>;
  afterResponse?(
    response: Response,
    request: Request,
    context: HandlerHookContext<TServices, TBody>
  ): MaybePromise<Response | undefined>;
}

export interface JoorMiddleware<
  TServices extends object = object,
  TBody = unknown,
> extends HandlerHooks<TServices, TBody> {
  name: string;
}

export type HandlerHookContextFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerHookContext<PluginServices<TPlugins>, TBody>;

export type RpcManifestRouteUnaryHandlerHookContextFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = HandlerHookContextFor<TManifest, TPlugins, TBody>;

export type RpcManifestRouteStreamHandlerHookContextFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = HandlerHookContextFor<TManifest, TPlugins, TBody>;

export type HandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerHooks<PluginServices<TPlugins>, TBody>;

export type RpcManifestRouteUnaryHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = HandlerHooksFor<TManifest, TPlugins, TBody>;

export type RpcManifestRouteStreamHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = HandlerHooksFor<TManifest, TPlugins, TBody>;

export type JoorMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = JoorMiddleware<PluginServices<TPlugins>, TBody>;

export type RpcManifestRouteUnaryMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = JoorMiddlewareFor<TManifest, TPlugins, TBody>;

export type RpcManifestRouteStreamMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = JoorMiddlewareFor<TManifest, TPlugins, TBody>;

export type RpcManifestUnaryRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryProcedure<TManifest, TId>;

export type RpcManifestStreamRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProcedure<TManifest, TId>;

export type RpcManifestUnaryRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryInput<TManifest, TId>;

export type RpcManifestStreamRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamInput<TManifest, TId>;

export type RpcManifestUnaryRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryOutput<TManifest, TId>;

export type RpcManifestStreamRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamOutput<TManifest, TId>;

export type RpcManifestUnaryRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientHeaders<TManifest, TId>;

export type RpcManifestStreamRouteClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresHeaders<TManifest, TId>;

export type RpcManifestStreamRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryError<TManifest, TId>;

export type RpcManifestStreamRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamError<TManifest, TId>;

export type RpcManifestUnaryRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryErrorCode<TManifest, TId>;

export type RpcManifestStreamRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamErrorCode<TManifest, TId>;

export type RpcManifestUnaryRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcManifestRouteUnaryErrorDetails<TManifest, TId, TCode>;

export type RpcManifestStreamRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcManifestRouteStreamErrorDetails<TManifest, TId, TCode>;

export type RpcManifestUnaryRouteEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryEnvelopeUnion<TManifest extends RpcManifest> =
  RpcManifestRouteEnvelopeUnion<TManifest>;

export type RpcManifestUnaryRouteResult<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResult<TManifest, TId>;

export type RpcManifestRouteUnaryResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteResultUnion<TManifest>;

export type RpcManifestUnaryRouteRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequest<TManifest, TId>;

export type RpcManifestRouteUnaryRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteRequestUnion<TManifest>;

export type RpcManifestUnaryRouteBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchRequest<TManifest, TRequests>;

export type RpcManifestUnaryRouteBatchResults<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestRouteBatchResultRequest<TManifest>[],
> = RpcManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type RpcManifestUnaryRouteBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>;

export type RpcManifestStreamRouteBodyResultFor<
  TManifest extends RpcManifest,
  TBody,
> = RpcManifestRouteStreamBodyResultFor<TManifest, TBody>;

export type RpcManifestUnaryRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequestOptions<TManifest, TId>;

export type RpcManifestStreamRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequestOptions<TManifest, TId>;

export type RpcManifestUnaryRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientArgs<TManifest, TId>;

export type RpcManifestStreamRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientArgs<TManifest, TId>;

export type RpcManifestUnaryRouteBodyResultHandler<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryBodyResultHandler<TManifest>;

export type RpcManifestStreamRouteBodyResultHandler<
  TManifest extends RpcManifest,
> = RpcManifestRouteStreamBodyResultHandler<TManifest>;

export type RpcManifestUnaryRouteTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryTransportBodyResultHandler<TManifest>;

export type RpcManifestStreamRouteTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = RpcManifestRouteStreamTransportBodyResultHandler<TManifest>;

export type RpcManifestUnaryRouteHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type RpcManifestStreamRouteHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type RpcManifestUnaryRouteHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type RpcManifestStreamRouteHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type RpcManifestUnaryRouteHandlerHookContextFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryHandlerHookContextFor<TManifest, TPlugins, TBody>;

export type RpcManifestStreamRouteHandlerHookContextFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamHandlerHookContextFor<TManifest, TPlugins, TBody>;

export type RpcManifestUnaryRouteHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryHandlerHooksFor<TManifest, TPlugins, TBody>;

export type RpcManifestStreamRouteHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamHandlerHooksFor<TManifest, TPlugins, TBody>;

export type RpcManifestUnaryRouteMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryMiddlewareFor<TManifest, TPlugins, TBody>;

export type RpcManifestStreamRouteMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamMiddlewareFor<TManifest, TPlugins, TBody>;

const rateLimitWindows = new Map<string, RateLimitWindow>();
const procedureSuccessCache = new Map<string, CachedProcedureSuccess>();
let traceCounter = 0;

const corsHeaders = (options: HandlerOptions): Record<string, string> => {
  if (options.cors === undefined) return {};
  if (options.cors.origin === undefined) return {};
  return {
    'access-control-allow-origin': options.cors.origin,
    'access-control-allow-methods': (
      options.cors.methods ?? ['POST', 'OPTIONS']
    ).join(', '),
    'access-control-allow-headers': (
      options.cors.headers ?? ['content-type', 'accept', 'x-request-id']
    ).join(', '),
  };
};

const traceId = (request: ContextRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return `trace-${traceCounter}`;
};

const rpcFailure = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number,
  details?: JsonValue
): RpcFailure => ({
  ok: false,
  id,
  traceId: trace,
  error:
    details === undefined
      ? { code, message, status }
      : { code, message, status, details },
});

const toResponse = (
  payload: RpcEnvelope | readonly RpcEnvelope[],
  options: HandlerOptions = {}
): Response =>
  rpcEnvelopeToResponse(
    payload,
    options.cors === undefined ? undefined : corsHeaders(options)
  );

export type RpcRequestPreflight = (
  request: ContextRequestSource
) => Response | undefined;

const isRpcRequest = (value: JsonValue): value is JsonObject & RpcRequest =>
  isJsonObject(value) &&
  typeof value['id'] === 'string' &&
  (value['traceId'] === undefined || typeof value['traceId'] === 'string');

const isAsyncIterable = (
  value: ProcedureRuntimeValue
): value is AsyncIterable<JsonValue> => Symbol.asyncIterator in Object(value);

const headersToJsonObject = (
  request: ContextRequestSource,
  prepared: PreparedProcedure
): ProcedureCacheHeaderValues => {
  const output: ProcedureCacheHeaderValues = {};
  if (prepared.headerKeys !== undefined) {
    for (const key of prepared.headerKeys) {
      const value = request.getHeader(key);
      if (value !== null) output[key] = value;
    }
    return output;
  }
  for (const [key, value] of request.toHeaders())
    output[key.toLowerCase()] = value;
  return output;
};

const isProcedureFailure = (
  value: object
): value is { kind: 'error'; error: RpcFailure['error'] } =>
  'kind' in value && value.kind === 'error' && 'error' in value;

const isProcedureResult = (
  value: JsonValue | ProcedureResult<JsonValue, string>
): value is ProcedureResult<JsonValue, string> =>
  typeof value === 'object' &&
  value !== null &&
  'kind' in value &&
  (value.kind === 'success' || value.kind === 'error');

const matchesPath = (url: string, path: string): boolean => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return path === '/';
  if (!url.startsWith(path, pathStart)) return false;
  const next = url[pathStart + path.length];
  return next === undefined || next === '?' || next === '#';
};

const isJsonContentType = (value: string): boolean => {
  if (value === 'application/json') return true;
  const semicolonIndex = value.indexOf(';');
  const type = semicolonIndex === -1 ? value : value.slice(0, semicolonIndex);
  const normalized = type.trim().toLowerCase();
  return normalized === 'application/json' || normalized.endsWith('+json');
};

export const createRpcRequestPreflight = (
  options: HandlerOptions = {}
): RpcRequestPreflight => {
  const cors = corsHeaders(options);
  const rpcPath = options.path ?? '/rpc';
  return (request: ContextRequestSource): Response | undefined => {
    if (!matchesPath(request.url, rpcPath)) {
      return new Response(null, { status: 404, headers: cors });
    }
    if (request.method === 'OPTIONS' && options.cors !== undefined) {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: { allow: 'POST', ...cors },
      });
    }
    const contentType = request.getHeader('content-type') ?? '';
    if (!isJsonContentType(contentType)) {
      return toResponse(
        rpcFailure(
          '',
          traceId(request),
          'UNSUPPORTED_MEDIA_TYPE',
          'Content-Type must be application/json',
          415
        ),
        options
      );
    }
    return undefined;
  };
};

const prepareProcedures = (
  manifest: RpcManifest
): Record<string, PreparedProcedure> => {
  const procedures: Record<string, PreparedProcedure> = Object.create(
    null
  ) as Record<string, PreparedProcedure>;
  for (const [id, procedure] of Object.entries(manifest.procedures)) {
    const headerKeys =
      procedure.headers?.kind === 'object'
        ? Object.keys(procedure.headers.shape)
        : undefined;
    const limit = procedure.meta.rateLimit;
    procedures[id] = {
      procedure,
      ...(procedure.headers === undefined
        ? {}
        : { headers: procedure.headers }),
      ...(procedure.responseHeaders === undefined
        ? {}
        : { responseHeaders: procedure.responseHeaders }),
      ...(procedure.auth === undefined ? {} : { auth: procedure.auth }),
      ...(procedure.output === undefined ? {} : { output: procedure.output }),
      ...(headerKeys === undefined ? {} : { headerKeys }),
      ...(limit === undefined
        ? {}
        : {
            rateLimit: {
              limit: limit.limit,
              window: limit.window,
              windowMs: parseDurationMs(limit.window),
            },
          }),
    };
  }
  return procedures;
};

const rateLimitFailure = (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  trace: string,
  runtime: RuntimeOptions
): RpcFailure | undefined => {
  if (!runtime.enforceRateLimit) return undefined;
  const limit = prepared.rateLimit;
  if (limit === undefined) return undefined;
  const allowed = reserveRateLimitSlot(
    rateLimitWindows,
    createRateLimitKey(rpcRequest.id, request, runtime.rateLimit),
    limit.limit,
    limit.windowMs,
    runtime.rateLimit.maxEntries
  );
  if (!allowed) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'RATE_LIMITED',
      'Rate limit exceeded',
      429,
      { limit: limit.limit, window: limit.window }
    );
  }
  return undefined;
};

const executeUnary = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    prepared,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return limited;
  const headerValue =
    prepared.headers === undefined
      ? emptyJsonObject
      : headersToJsonObject(request, prepared);
  const headerResult =
    prepared.headers === undefined
      ? ({ ok: true, value: {} } as const)
      : !runtime.validateHeaders
        ? ({ ok: true, value: headerValue } as const)
        : validate(prepared.headers, headerValue, 'headers');
  if (!headerResult.ok) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'HEADER_VALIDATION_ERROR',
      'Header validation failed',
      400,
      validationDetails(headerResult.issues)
    );
  }
  const ctx = createRuntimeContext(
    request,
    trace,
    services,
    headerResult.value as object,
    emptyContextObject
  );
  const authResultValue = authenticateOnce(prepared.auth, ctx, state);
  const authResult =
    authResultValue instanceof Promise
      ? await authResultValue
      : authResultValue;
  if (isProcedureFailure(authResult)) {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    };
  }
  const inputResult = !runtime.validateInput
    ? ({ ok: true, value: rpcRequest.input } as const)
    : validate(procedure.input, rpcRequest.input, 'input');
  if (!inputResult.ok) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      validationDetails(inputResult.issues)
    );
  }

  ctx.auth = authResult;
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  const cacheKey =
    cacheConfig === undefined
      ? undefined
      : createProcedureCacheKey(
          rpcRequest.id,
          cacheConfig.key,
          (inputResult.value ?? {}) as JsonValue,
          headerResult.value as ProcedureCacheHeaderValues,
          authResult
        );
  if (cacheKey !== undefined) {
    const cached = readCachedProcedureSuccess(procedureSuccessCache, cacheKey);
    if (cached !== undefined) {
      return cached.headers === undefined
        ? {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
          }
        : {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
            headers: cached.headers,
          };
    }
  }
  const result = await procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (isAsyncIterable(result)) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (isProcedureResult(result) && result.kind === 'error') {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: result.error,
    };
  }
  const data = isProcedureResult(result) ? result.data : result;
  const headers = isProcedureResult(result) ? result.headers : undefined;
  if (prepared.output !== undefined && runtime.validateOutput) {
    const outputResult = validate(prepared.output, data, 'output');
    if (!outputResult.ok) {
      return rpcFailure(
        rpcRequest.id,
        trace,
        'OUTPUT_VALIDATION_ERROR',
        'Handler returned invalid output',
        500,
        validationDetails(outputResult.issues)
      );
    }
  }
  if (
    prepared.responseHeaders !== undefined &&
    runtime.validateResponseHeaders
  ) {
    const responseHeaderResult = validate(
      prepared.responseHeaders,
      headers,
      'responseHeaders'
    );
    if (!responseHeaderResult.ok) {
      return rpcFailure(
        rpcRequest.id,
        trace,
        'RESPONSE_HEADER_VALIDATION_ERROR',
        'Handler returned invalid response headers',
        500,
        validationDetails(responseHeaderResult.issues)
      );
    }
    return {
      ok: true,
      id: rpcRequest.id,
      traceId: trace,
      data,
      headers: responseHeaderResult.value as CachedProcedureHeaders,
    };
  }
  if (headers !== undefined) {
    if (cacheKey !== undefined && cacheConfig !== undefined) {
      writeCachedProcedureSuccess(
        procedureSuccessCache,
        cacheKey,
        parseDurationMs(cacheConfig.ttl),
        data,
        headers,
        runtime.cacheMaxEntries
      );
    }
    return { ok: true, id: rpcRequest.id, traceId: trace, data, headers };
  }
  if (cacheKey !== undefined && cacheConfig !== undefined) {
    writeCachedProcedureSuccess(
      procedureSuccessCache,
      cacheKey,
      parseDurationMs(cacheConfig.ttl),
      data,
      undefined,
      runtime.cacheMaxEntries
    );
  }
  return { ok: true, id: rpcRequest.id, traceId: trace, data };
};

const executeTrustedUnary = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const headerValue =
    prepared.headers === undefined
      ? emptyJsonObject
      : headersToJsonObject(request, prepared);
  const ctx = createRuntimeContext(
    request,
    trace,
    services,
    headerValue,
    emptyContextObject
  );
  const authResultValue = authenticateOnce(prepared.auth, ctx, state);
  const authResult =
    authResultValue instanceof Promise
      ? await authResultValue
      : authResultValue;
  if (isProcedureFailure(authResult)) {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    };
  }

  ctx.auth = authResult;
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  const cacheKey =
    cacheConfig === undefined
      ? undefined
      : createProcedureCacheKey(
          rpcRequest.id,
          cacheConfig.key,
          rpcRequest.input ?? {},
          headerValue as ProcedureCacheHeaderValues,
          authResult
        );
  if (cacheKey !== undefined) {
    const cached = readCachedProcedureSuccess(procedureSuccessCache, cacheKey);
    if (cached !== undefined) {
      return cached.headers === undefined
        ? {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
          }
        : {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
            headers: cached.headers,
          };
    }
  }
  const result = await procedure.handler(ctx, rpcRequest.input ?? {});
  if (isAsyncIterable(result)) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (isProcedureResult(result) && result.kind === 'error') {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: result.error,
    };
  }
  const data = isProcedureResult(result) ? result.data : result;
  const headers = isProcedureResult(result) ? result.headers : undefined;
  if (cacheKey !== undefined && cacheConfig !== undefined) {
    writeCachedProcedureSuccess(
      procedureSuccessCache,
      cacheKey,
      parseDurationMs(cacheConfig.ttl),
      data,
      headers,
      runtime.cacheMaxEntries
    );
  }
  return headers === undefined
    ? { ok: true, id: rpcRequest.id, traceId: trace, data }
    : { ok: true, id: rpcRequest.id, traceId: trace, data, headers };
};

const executeStream = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<Response> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    prepared,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return toResponse(limited);
  const headerValue =
    prepared.headers === undefined
      ? {}
      : headersToJsonObject(request, prepared);
  const headerResult =
    prepared.headers === undefined
      ? ({ ok: true, value: {} } as const)
      : !runtime.validateHeaders
        ? ({ ok: true, value: headerValue } as const)
        : validate(prepared.headers, headerValue, 'headers');
  if (!headerResult.ok) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'HEADER_VALIDATION_ERROR',
        'Header validation failed',
        400,
        validationDetails(headerResult.issues)
      )
    );
  }
  const ctx = createRuntimeContext(
    request,
    trace,
    services,
    headerResult.value as object,
    emptyContextObject
  );
  const authResultValue = authenticateOnce(prepared.auth, ctx, state);
  const authResult =
    authResultValue instanceof Promise
      ? await authResultValue
      : authResultValue;
  if (isProcedureFailure(authResult)) {
    return toResponse({
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    });
  }
  const inputResult = !runtime.validateInput
    ? ({ ok: true, value: rpcRequest.input } as const)
    : validate(procedure.input, rpcRequest.input, 'input');
  if (!inputResult.ok) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'VALIDATION_ERROR',
        'Validation failed',
        400,
        validationDetails(inputResult.issues)
      )
    );
  }
  const streamSchema = procedure.stream;
  if (streamSchema === undefined) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'NOT_STREAMING',
        'Procedure is not streaming',
        400
      )
    );
  }

  ctx.auth = authResult;
  const iterable = procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (!isAsyncIterable(iterable)) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'NOT_STREAMING',
        'Procedure is not streaming',
        400
      )
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of iterable) {
          const eventResult = validate(streamSchema, event, 'event');
          if (!eventResult.ok) {
            controller.enqueue(
              encodeSse(
                'error',
                rpcFailure(
                  rpcRequest.id,
                  trace,
                  'STREAM_VALIDATION_ERROR',
                  'Stream event failed validation',
                  500,
                  validationDetails(eventResult.issues)
                ) as unknown as JsonValue
              )
            );
            break;
          }
          controller.enqueue(encodeSse('data', eventResult.value as JsonValue));
        }
        controller.enqueue(encodeSse('done', {}));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Stream failed';
        controller.enqueue(
          encodeSse(
            'error',
            rpcFailure(
              rpcRequest.id,
              trace,
              'INTERNAL_ERROR',
              message,
              500
            ) as unknown as JsonValue
          )
        );
      } finally {
        controller.close();
      }
    },
  });
  return createSseResponse(stream);
};

export function createRpcHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): RpcRequestHandler;
export function createRpcHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {}
): RpcRequestHandler {
  const handleParsed = createRpcBodyHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
    false
  );
  const preflight = createRpcRequestPreflight(options);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
  return async (request: Request): Promise<Response> => {
    const source = createFetchRequestSource(request);
    const early = preflight(source);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      if (error instanceof Error) options.onError?.(error, request);
      const payloadTooLarge =
        error instanceof Error && isBodySizeLimitError(error);
      const status = payloadTooLarge ? 413 : 400;
      const body = rpcFailure(
        '',
        traceId(source),
        payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
        payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
        status
      );
      return new Response(JSON.stringify(body), {
        status,
        headers: {
          ...jsonContentHeaders,
          ...(options.cors === undefined ? {} : corsHeaders(options)),
        },
      });
    }
    return handleParsed(request, body as RpcManifestBody<TManifest>);
  };
}

export function createRpcBodyHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<TManifest, TPlugins>
): RpcBodyHandler<TManifest>;
export function createRpcBodyHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcBodyHandler<TManifest> {
  const handleResult = createRpcBodyResultHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
    preflight
  );
  return async (
    request: Request,
    body: RpcManifestBody<TManifest>
  ): Promise<Response> => {
    const result = await handleResult(request, body);
    return result instanceof Response ? result : toResponse(result, options);
  };
}

export function createRpcBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<TManifest, TPlugins>
): RpcBodyResultHandler<TManifest>;
export function createRpcBodyResultHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcBodyResultHandler<TManifest> {
  const handleTransport = createRpcTransportBodyResultHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
    preflight
  );
  return (<const TBody extends RpcManifestBody<TManifest>>(
    request: Request,
    body: TBody
  ): Promise<RpcManifestBodyResultFor<TManifest, TBody>> =>
    handleTransport(
      createFetchRequestSource(request),
      body
    )) as RpcBodyResultHandler<TManifest>;
}

export function createRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<TManifest, TPlugins>
): RpcTransportBodyResultHandler<TManifest>;
export function createRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcTransportBodyResultHandler<TManifest> {
  const procedures = prepareProcedures(manifest);
  const requestPreflight = preflight
    ? createRpcRequestPreflight(options)
    : undefined;
  const runtime: RuntimeOptions = {
    cors: corsHeaders(options),
    cacheMaxEntries:
      options.cache?.maxEntries ?? DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
    enforceRateLimit: options.enforceRateLimit ?? true,
    rateLimit: {
      trustProxy: options.rateLimit?.trustProxy ?? false,
      maxEntries:
        options.rateLimit?.maxEntries ?? DEFAULT_RATE_LIMIT_MAX_ENTRIES,
      ...(options.rateLimit?.identity === undefined
        ? {}
        : { identity: options.rateLimit.identity }),
    },
    validateHeaders: options.validateHeaders ?? true,
    validateInput: options.validateInput ?? true,
    validateOutput: options.validateOutput ?? true,
    validateResponseHeaders: options.validateResponseHeaders ?? true,
  };
  const useTrustedUnary =
    !runtime.enforceRateLimit &&
    !runtime.validateHeaders &&
    !runtime.validateInput &&
    !runtime.validateOutput &&
    !runtime.validateResponseHeaders;
  const plugins = options.plugins ?? [];
  let services: object | undefined;
  const servicesPromise =
    plugins.length === 0
      ? Promise.resolve({})
      : resolvePluginServices(plugins).then((resolved) => {
          services = resolved;
          return resolved;
        });
  if (plugins.length === 0) services = {};
  const middleware = options.middleware ?? [];
  const hasBeforeHooks =
    options.hooks?.beforeRequest !== undefined ||
    middleware.some((item) => item.beforeRequest !== undefined);
  const hasAfterHooks =
    options.hooks?.afterResponse !== undefined ||
    middleware.some((item) => item.afterResponse !== undefined);
  const createHookContext = async (
    body?: unknown
  ): Promise<HandlerHookContext<object, unknown>> => ({
    services: services ?? (await servicesPromise),
    ...(body === undefined ? {} : { body }),
  });
  const runBefore = async (
    request: ContextRequestSource,
    body: unknown
  ): Promise<Response | undefined> => {
    const hookRequest = request.toRequest();
    const context = await createHookContext(body);
    const hookResult = await options.hooks?.beforeRequest?.(
      hookRequest,
      context
    );
    if (hookResult instanceof Response) return hookResult;
    for (const item of middleware) {
      const result = await item.beforeRequest?.(hookRequest, context);
      if (result instanceof Response) return result;
    }
    return undefined;
  };
  const runAfter = async (
    response: Response,
    request: ContextRequestSource,
    body: unknown
  ): Promise<RpcBodyResult> => {
    let next = response;
    const hookRequest = request.toRequest();
    const context = await createHookContext(body);
    for (const item of middleware) {
      const result = await item.afterResponse?.(next, hookRequest, context);
      if (result instanceof Response) next = result;
    }
    const hookResult = await options.hooks?.afterResponse?.(
      next,
      hookRequest,
      context
    );
    return hookResult instanceof Response ? hookResult : next;
  };
  const handleRequest = async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<RpcBodyResult> => {
    const early = requestPreflight?.(request);
    if (early !== undefined) return early;

    const requestServices = services ?? (await servicesPromise);
    if (Array.isArray(body)) {
      const state = createExecutionState(true);
      const responses: RpcEnvelope[] = [];
      for (const item of body) {
        if (!isRpcRequest(item)) {
          responses.push(
            rpcFailure(
              '',
              traceId(request),
              'BAD_REQUEST',
              'Invalid RPC request',
              400
            )
          );
          continue;
        }
        const procedure = procedures[item.id];
        if (procedure === undefined) {
          responses.push(
            rpcFailure(
              item.id,
              traceId(request, item.traceId),
              'NOT_FOUND',
              'Procedure not found',
              404
            )
          );
          continue;
        }
        responses.push(
          useTrustedUnary
            ? await executeTrustedUnary(
                procedure,
                item,
                request,
                requestServices,
                runtime,
                state
              )
            : await executeUnary(
                procedure,
                item,
                request,
                requestServices,
                runtime,
                state
              )
        );
      }
      return responses;
    }

    if (!isRpcRequest(body)) {
      return rpcFailure(
        '',
        traceId(request),
        'BAD_REQUEST',
        'Invalid RPC request',
        400
      );
    }

    const procedure = procedures[body.id];
    if (procedure === undefined) {
      return rpcFailure(
        body.id,
        traceId(request, body.traceId),
        'NOT_FOUND',
        'Procedure not found',
        404
      );
    }

    if (request.getHeader('accept')?.includes('text/event-stream') === true) {
      return executeStream(
        procedure,
        body,
        request,
        requestServices,
        runtime,
        uncachedExecutionState
      );
    }
    return useTrustedUnary
      ? executeTrustedUnary(
          procedure,
          body,
          request,
          requestServices,
          runtime,
          uncachedExecutionState
        )
      : executeUnary(
          procedure,
          body,
          request,
          requestServices,
          runtime,
          uncachedExecutionState
        );
  };
  if (!hasBeforeHooks && !hasAfterHooks) {
    return ((request, body) =>
      handleRequest(
        request,
        body as JsonValue
      )) as RpcTransportBodyResultHandler<TManifest>;
  }
  return (async <const TBody extends RpcManifestBody<TManifest>>(
    request: ContextRequestSource,
    body: TBody
  ): Promise<RpcManifestBodyResultFor<TManifest, TBody>> => {
    const early = hasBeforeHooks ? await runBefore(request, body) : undefined;
    if (early !== undefined) {
      return (
        hasAfterHooks ? await runAfter(early, request, body) : early
      ) as RpcManifestBodyResultFor<TManifest, TBody>;
    }
    const result = await handleRequest(request, body as JsonValue);
    if (!hasAfterHooks)
      return result as RpcManifestBodyResultFor<TManifest, TBody>;
    if (result instanceof Response) {
      return (await runAfter(
        result,
        request,
        body
      )) as RpcManifestBodyResultFor<TManifest, TBody>;
    }
    return (await runAfter(
      toResponse(result, options),
      request,
      body
    )) as RpcManifestBodyResultFor<TManifest, TBody>;
  }) as RpcTransportBodyResultHandler<TManifest>;
}
