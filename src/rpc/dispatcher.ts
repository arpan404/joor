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
  ProcedureRequest,
  ProcedureRequiresHeaders,
  ProcedureRequiresResponseHeaders,
  ProcedureRuntime,
  ProcedureResponseHeaders,
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
import type { ClientRequestInit } from './client.js';
import { parseDurationMs } from '../internal/duration.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from '../runtime/body.js';
import {
  createCorsHeaderRecord,
  jsonContentHeaders,
  rpcEnvelopeToResponse,
  transportResultToResponse,
} from '../runtime/response.js';

export interface RpcManifest<
  TProcedures extends Readonly<Record<string, ProcedureRuntime>> = Readonly<
    Record<string, ProcedureRuntime>
  >,
> {
  readonly procedures: TProcedures;
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
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteStreamProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteUnaryInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteInput<TManifest, TId>;

export type RpcManifestRouteStreamInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteInput<TManifest, TId>;

export type RpcManifestRouteUnaryOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteOutput<TManifest, TId>;

export type RpcManifestRouteStreamOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteOutput<TManifest, TId>;

export type RpcManifestRouteUnaryHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHasHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHasHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteError<TManifest, TId>;

export type RpcManifestRouteStreamError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteError<TManifest, TId>;

export type RpcManifestRouteUnaryErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteErrorCode<TManifest, TId>;

export type RpcManifestRouteStreamErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteErrorCode<TManifest, TId>;

export type RpcManifestRouteUnaryErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<TManifest, TId> =
    RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcManifestRouteErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteStreamErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<TManifest, TId> =
    RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcManifestRouteErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteServices<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureServices<RpcManifestRoutes<TManifest>[TId]>;

export type RpcManifestRouteRuntimeRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureRequest<RpcManifestRoutes<TManifest>[TId]>;

export type RpcManifestRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcManifestRoutes<TManifest>[TId];

export type RpcManifestRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureInput<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureOutput<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureHasHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureRequiresHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureHasResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = ProcedureRequiresResponseHeaders<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcManifestProcedureError<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> =
  | ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
  | Exclude<
      RpcFrameworkErrorCode,
      ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
    >;

export type RpcManifestRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
  TCode extends RpcManifestRouteErrorCode<TManifest, TId> =
    RpcManifestRouteErrorCode<TManifest, TId>,
> =
  TCode extends ProcedureErrorCode<RpcManifestRouteProcedure<TManifest, TId>>
    ? ProcedureErrorDetails<RpcManifestRouteProcedure<TManifest, TId>, TCode>
    : JsonValue | undefined;

export type RpcManifestRouteStreamEvent<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = StreamEvent<RpcManifestRouteProcedure<TManifest, TId>>;

export type RpcManifestStreamRouteEvent<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
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

type RpcManifestRequestContribution<TRequest> = [Request] extends [TRequest]
  ? never
  : TRequest;

type RpcManifestRequestContributions<TManifest extends RpcManifest> = {
  [TId in RpcManifestRouteId<TManifest>]: RpcManifestRequestContribution<
    RpcManifestRouteRuntimeRequest<TManifest, TId>
  >;
}[RpcManifestRouteId<TManifest>];

export type RpcManifestRequiredRuntimeRequest<TManifest extends RpcManifest> = [
  RpcManifestRequestContributions<TManifest>,
] extends [never]
  ? Request
  : UnionToIntersection<RpcManifestRequestContributions<TManifest>> & Request;

export type RpcManifestProcedureFrameworkError<TProcedure> = RpcError<
  Exclude<RpcFrameworkErrorCode, ProcedureErrorCode<TProcedure>>,
  JsonValue
>;

export type RpcManifestProcedureError<TProcedure> =
  | ProcedureError<TProcedure>
  | RpcManifestProcedureFrameworkError<TProcedure>;

type RpcManifestRouteEnvelopeFor<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = RpcEnvelope<
  ProcedureOutput<RpcManifestRoutes<TManifest>[TId]> & JsonValue,
  TId,
  ProcedureResponseHeaders<RpcManifestRoutes<TManifest>[TId]>,
  RpcManifestProcedureError<RpcManifestRoutes<TManifest>[TId]>
>;

export type RpcManifestRouteEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = {
  [TRouteId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteEnvelopeFor<
    TManifest,
    TRouteId
  >;
}[TId];

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
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryResult<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteResult<TManifest, TId>;

export type RpcManifestRouteResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteEnvelopeUnion<TManifest>;

export type RpcManifestUnaryRouteResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteResultUnion<TManifest>;

type RpcManifestRouteProtocolRequestFor<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> = {
  readonly id: TId;
  readonly input: ProcedureInput<RpcManifestRoutes<TManifest>[TId]> & JsonValue;
  readonly traceId?: string;
};

export type RpcManifestRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> =
  TId extends RpcManifestRouteId<TManifest>
    ? RpcManifestRouteProtocolRequestFor<TManifest, TId>
    : never;

export type RpcManifestProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestRouteUnaryProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestUnaryProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type RpcManifestRouteStreamProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestStreamProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestUnaryRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type RpcManifestStreamRouteProtocolRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteId<TManifest>]: RpcManifestRouteProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteId<TManifest>];

export type RpcManifestProtocolRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteProtocolRequestUnion<TManifest>;

export type RpcManifestRouteUnaryProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteUnaryProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteUnaryId<TManifest>];

export type RpcManifestUnaryProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestUnaryRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestRouteBatchRequestUnion<TManifest extends RpcManifest> =
  | RpcManifestRouteUnaryProtocolRequestUnion<TManifest>
  | RpcManifestRouteRequestUnion<TManifest>;

export type RpcManifestRouteUnaryBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteBatchRequestUnion<TManifest>;

export type RpcManifestUnaryRouteBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryBatchRequestUnion<TManifest>;

export type RpcManifestRouteProtocolBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestRouteUnaryProtocolBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteProtocolBatchRequestUnion<TManifest>;

export type RpcManifestUnaryRouteProtocolBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>;

export type RpcManifestProtocolBatchRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteProtocolBatchRequestUnion<TManifest>;

export type RpcManifestRouteBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = Readonly<TRequests>;

export type RpcManifestRouteUnaryBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchRequest<TManifest, TRequests>;

type RpcManifestRouteProtocolBatchRequestHasHeaders<TRequest> =
  'headers' extends keyof TRequest
    ? [Exclude<TRequest['headers'], undefined>] extends [never]
      ? false
      : true
    : false;

type RpcManifestRouteProtocolBatchRequestRejectsHeaders<
  TRequests extends readonly unknown[],
> = true extends {
  [TIndex in keyof TRequests]: RpcManifestRouteProtocolBatchRequestHasHeaders<
    TRequests[TIndex]
  >;
}[number]
  ? never
  : Readonly<TRequests>;

export type RpcManifestRouteProtocolBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchRequestRejectsHeaders<TRequests>;

export type RpcManifestRouteUnaryProtocolBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchRequest<TManifest, TRequests>;

export type RpcManifestUnaryRouteProtocolBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchRequest<TManifest, TRequests>;

export type RpcManifestProtocolBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchRequest<TManifest, TRequests>;

type RpcManifestRouteBatchResultFor<
  TManifest extends RpcManifest,
  TRequest,
> = TRequest extends {
  id: infer TId extends RpcManifestRouteUnaryId<TManifest>;
}
  ? TRequest extends
      | RpcManifestRouteUnaryProtocolRequest<TManifest, TId>
      | RpcManifestRouteRequest<TManifest, TId>
    ? RpcManifestRouteEnvelope<TManifest, TId>
    : never
  : never;

export type RpcManifestRouteBatchResults<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = {
  readonly [TIndex in keyof TRequests]: RpcManifestRouteBatchResultFor<
    TManifest,
    TRequests[TIndex]
  >;
};

export type RpcManifestRouteUnaryBatchResults<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchResults<TManifest, TRequests>;

export type RpcManifestRouteProtocolBatchResults<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchResults<TManifest, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchResults<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type RpcManifestUnaryRouteProtocolBatchResults<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchResults<TManifest, TRequests>;

export type RpcManifestProtocolBatchResults<
  TManifest extends RpcManifest,
  TRequests extends readonly RpcManifestProtocolBatchRequestUnion<TManifest>[] =
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchResults<TManifest, TRequests>;

type RpcManifestRouteBatchRequestId<
  TManifest extends RpcManifest,
  TRequest,
> = TRequest extends {
  readonly id: infer TId extends RpcManifestRouteUnaryId<TManifest>;
}
  ? TId
  : never;

type RpcManifestRouteBatchRequestIds<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[],
> = RpcManifestRouteBatchRequestId<TManifest, TRequests[number]>;

type RpcManifestRouteBatchClientHeaderIds<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[],
> = {
  [TId in RpcManifestRouteBatchRequestIds<
    TManifest,
    TRequests
  >]: RpcManifestRouteHasHeaders<TManifest, TId> extends true ? TId : never;
}[RpcManifestRouteBatchRequestIds<TManifest, TRequests>];

type RpcManifestRouteBatchClientHeadersForIds<
  TManifest extends RpcManifest,
  TIds extends RpcManifestRouteUnaryId<TManifest>,
> = [TIds] extends [never]
  ? never
  : UnionToIntersection<
      TIds extends RpcManifestRouteUnaryId<TManifest>
        ? RpcManifestRouteClientHeaders<TManifest, TIds>
        : never
    >;

export type RpcManifestRouteBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchClientHeadersForIds<
  TManifest,
  RpcManifestRouteBatchClientHeaderIds<TManifest, TRequests>
>;

export type RpcManifestRouteUnaryBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestUnaryRouteBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestRouteProtocolBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestUnaryRouteProtocolBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestProtocolBatchClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchClientHeaders<TManifest, TRequests>;

type RpcManifestRouteBatchRequestCarriesHeaders<TRequest> =
  'headers' extends keyof TRequest
    ? [Exclude<TRequest['headers'], undefined>] extends [never]
      ? false
      : true
    : false;

type RpcManifestRouteBatchRequestMissingHeaderId<
  TManifest extends RpcManifest,
  TRequest,
> = TRequest extends {
  readonly id: infer TId extends RpcManifestRouteUnaryId<TManifest>;
}
  ? RpcManifestRouteRequiresHeaders<TManifest, TId> extends true
    ? RpcManifestRouteBatchRequestCarriesHeaders<TRequest> extends true
      ? never
      : TId
    : never
  : never;

type RpcManifestRouteBatchMissingHeaderIds<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[],
> = RpcManifestRouteBatchRequestMissingHeaderId<TManifest, TRequests[number]>;

type RpcManifestRouteBatchMissingClientHeaders<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[],
> = RpcManifestRouteBatchClientHeadersForIds<
  TManifest,
  RpcManifestRouteBatchMissingHeaderIds<TManifest, TRequests>
>;

type RpcManifestRouteBatchBaseOptions = {
  readonly request?: ClientRequestInit;
};

export type RpcManifestRouteBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = [RpcManifestRouteBatchMissingHeaderIds<TManifest, TRequests>] extends [
  never,
]
  ? RpcManifestRouteBatchBaseOptions & {
      readonly headers?: RpcManifestRouteBatchClientHeaders<
        TManifest,
        TRequests
      >;
    }
  : RpcManifestRouteBatchBaseOptions & {
      readonly headers: RpcManifestRouteBatchMissingClientHeaders<
        TManifest,
        TRequests
      >;
    };

export type RpcManifestRouteUnaryBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchOptions<TManifest, TRequests>;

export type RpcManifestUnaryRouteBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchOptions<TManifest, TRequests>;

export type RpcManifestRouteProtocolBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchOptions<TManifest, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchOptions<TManifest, TRequests>;

export type RpcManifestUnaryRouteProtocolBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchOptions<TManifest, TRequests>;

export type RpcManifestProtocolBatchOptions<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchOptions<TManifest, TRequests>;

export type RpcManifestRouteBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> =
  RpcManifestRouteBatchOptions<TManifest, TRequests> extends {
    readonly headers: unknown;
  }
    ? [options: RpcManifestRouteBatchOptions<TManifest, TRequests>]
    : [options?: RpcManifestRouteBatchOptions<TManifest, TRequests>];

export type RpcManifestRouteUnaryBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestUnaryRouteBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestRouteProtocolBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestUnaryRouteProtocolBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestProtocolBatchOptionsTuple<
  TManifest extends RpcManifest,
  TRequests extends readonly unknown[] =
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchOptionsTuple<TManifest, TRequests>;

export type RpcManifestRouteStreamProtocolRequestUnion<
  TManifest extends RpcManifest,
> = {
  [TId in RpcManifestRouteStreamId<TManifest>]: RpcManifestRouteStreamProtocolRequest<
    TManifest,
    TId
  >;
}[RpcManifestRouteStreamId<TManifest>];

export type RpcManifestStreamProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestStreamRouteProtocolRequestUnion<
  TManifest extends RpcManifest,
> = RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestRouteStreamRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestStreamRouteRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequest<TManifest, TId>;

export type RpcManifestRouteStreamRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestStreamRouteRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteStreamRequestUnion<TManifest>;

export type RpcManifestBody<TManifest extends RpcManifest> =
  | RpcManifestRouteProtocolRequestUnion<TManifest>
  | RpcManifestRouteProtocolBatchRequest<TManifest>;

export type RpcManifestRouteUnaryBody<TManifest extends RpcManifest> =
  | RpcManifestRouteUnaryProtocolRequestUnion<TManifest>
  | RpcManifestRouteUnaryProtocolBatchRequest<TManifest>;

export type RpcManifestUnaryRouteBody<TManifest extends RpcManifest> =
  RpcManifestRouteUnaryBody<TManifest>;

export type RpcManifestRouteStreamBody<TManifest extends RpcManifest> =
  RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestStreamRouteBody<TManifest extends RpcManifest> =
  RpcManifestRouteStreamBody<TManifest>;

export type RpcBodyResult<TEnvelope extends RpcEnvelope = RpcEnvelope> =
  | TEnvelope
  | readonly TEnvelope[]
  | Response;

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
  readonly [TKey in keyof THeaders as TKey extends RpcManifestOptionalHeaderKeys<THeaders>
    ? never
    : TKey]: THeaders[TKey];
};

type RpcManifestOptionalHeaderFields<THeaders extends object> = {
  readonly [TKey in RpcManifestOptionalHeaderKeys<THeaders>]?:
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
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcManifestRouteRequestHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteClientHeaders<TManifest, TId>;

export type RpcManifestRouteStreamClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteClientHeaders<TManifest, TId>;

export type RpcManifestRouteUnaryResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteResponseHeaders<TManifest, TId>;

export type RpcManifestRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> =
  ProcedureRequiresHeaders<
    RpcManifestRouteProcedure<TManifest, TId>
  > extends false
    ? { readonly headers?: RpcManifestRouteClientHeaders<TManifest, TId> }
    : { readonly headers: RpcManifestRouteClientHeaders<TManifest, TId> };

export type RpcManifestRouteUnaryRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteRequestOptions<TManifest, TId>;

export type RpcManifestRouteStreamRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteRequestOptions<TManifest, TId>;

type RpcManifestRouteClientArgsFor<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest>,
> =
  RpcManifestRouteRequiresHeaders<TManifest, TId> extends false
    ? readonly [
        input: RpcManifestRouteInput<TManifest, TId>,
        options?: RpcManifestRouteRequestOptions<TManifest, TId>,
      ]
    : readonly [
        input: RpcManifestRouteInput<TManifest, TId>,
        options: RpcManifestRouteRequestOptions<TManifest, TId>,
      ];

export type RpcManifestRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> =
  TId extends RpcManifestRouteId<TManifest>
    ? RpcManifestRouteClientArgsFor<TManifest, TId>
    : never;

export type RpcManifestRouteUnaryClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteClientArgs<TManifest, TId>;

export type RpcManifestRouteStreamClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteClientArgs<TManifest, TId>;

type RpcManifestRouteRequestFor<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest>,
> = {
  readonly id: TId;
  readonly input: RpcManifestRouteInput<TManifest, TId>;
} & (RpcManifestRouteRequiresHeaders<TManifest, TId> extends false
  ? { readonly headers?: RpcManifestRouteClientHeaders<TManifest, TId> }
  : { readonly headers: RpcManifestRouteClientHeaders<TManifest, TId> });

export type RpcManifestRouteRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = {
  [TRouteId in RpcManifestRouteUnaryId<TManifest>]: RpcManifestRouteRequestFor<
    TManifest,
    TRouteId
  >;
}[TId];

export type RpcManifestRouteUnaryRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
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
  ? TId extends RpcManifestRouteStreamId<TManifest>
    ? TBody extends RpcManifestRouteStreamProtocolRequest<TManifest, TId>
      ? Response
      : never
    : TId extends RpcManifestRouteUnaryId<TManifest>
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
  ? TBody extends readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[]
    ? RpcManifestRouteProtocolBatchRequest<TManifest, TBody> extends never
      ? never
      : RpcManifestRouteProtocolBatchResults<TManifest, TBody> | Response
    : never
  : RpcManifestProtocolBodyResultFor<TManifest, TBody>;

export type RpcManifestRouteUnaryBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestBodyResultFor<TManifest, TBody>;

export type RpcManifestRouteStreamBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestBodyResultFor<TManifest, TBody>;

export type RpcBodyResultHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<RpcManifestBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteUnaryBodyResultHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteStreamBodyResultHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<RpcManifestRouteStreamBodyResultFor<TManifest, TBody>>;

export type RpcRequestHandler<TRequest extends Request = Request> = (
  request: TRequest
) => MaybePromise<Response>;

export type RpcBodyHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<Response>;

export type RpcManifestRouteUnaryBodyHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<Response>;

export type RpcManifestRouteStreamBodyHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: TRequest,
  body: TBody
) => MaybePromise<Response>;

export type RpcManifestUnaryRouteBodyHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryBodyHandler<TManifest, TRequest>;

export type RpcManifestStreamRouteBodyHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamBodyHandler<TManifest, TRequest>;

export type RpcTransportBodyResultHandler<TManifest extends RpcManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<RpcManifestBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteUnaryTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>>;

export type RpcManifestRouteStreamTransportBodyResultHandler<
  TManifest extends RpcManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<RpcManifestRouteStreamBodyResultFor<TManifest, TBody>>;

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
  cors: Record<string, string>;
  cacheMaxEntries: number;
  enforceRateLimit: boolean;
  rateLimit: RateLimitRuntimeOptions;
  validateHeaders: boolean;
  validateInput: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
}

export type RateLimitIdentityResolver<TRequest extends Request = Request> = (
  request: TRequest
) => string | undefined;

export interface RateLimitRuntimeOptions {
  readonly trustProxy: boolean;
  readonly maxEntries: number;
  readonly identity?: RateLimitIdentityResolver;
}

export interface HandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> {
  readonly plugins?: TPlugins;
  readonly middleware?: readonly JoorMiddleware<
    PluginServices<TPlugins>,
    TBody,
    TRequest
  >[];
  readonly hooks?: HandlerHooks<PluginServices<TPlugins>, TBody, TRequest>;
  readonly path?: string;
  readonly cors?: {
    readonly origin?: string;
    readonly headers?: readonly string[];
    readonly methods?: readonly string[];
  };
  readonly maxBodyBytes?: number;
  readonly cache?: {
    readonly maxEntries?: number;
  };
  readonly rateLimit?: {
    readonly trustProxy?: boolean;
    readonly maxEntries?: number;
    readonly identity?: RateLimitIdentityResolver<TRequest>;
  };
  readonly validateInput?: boolean;
  readonly validateHeaders?: boolean;
  readonly validateOutput?: boolean;
  readonly validateResponseHeaders?: boolean;
  readonly enforceRateLimit?: boolean;
  readonly onError?: (error: Error, request: TRequest) => void;
}

type FreezableHandlerOptions = {
  readonly plugins?: readonly JoorPlugin<object>[];
  readonly middleware?: readonly unknown[];
  readonly hooks?: object;
  readonly cors?: {
    readonly origin?: string;
    readonly headers?: readonly string[];
    readonly methods?: readonly string[];
  };
  readonly cache?: object;
  readonly rateLimit?: object;
};

const freezeHandlerOptions = <TOptions extends FreezableHandlerOptions>(
  options: TOptions
): TOptions =>
  Object.freeze({
    ...options,
    ...(options.plugins === undefined
      ? {}
      : { plugins: Object.freeze([...options.plugins]) }),
    ...(options.middleware === undefined
      ? {}
      : { middleware: Object.freeze([...options.middleware]) }),
    ...(options.hooks === undefined
      ? {}
      : { hooks: Object.freeze({ ...options.hooks }) }),
    ...(options.cors === undefined
      ? {}
      : {
          cors: Object.freeze({
            ...options.cors,
            ...(options.cors.headers === undefined
              ? {}
              : { headers: Object.freeze([...options.cors.headers]) }),
            ...(options.cors.methods === undefined
              ? {}
              : { methods: Object.freeze([...options.cors.methods]) }),
          }),
        }),
    ...(options.cache === undefined
      ? {}
      : { cache: Object.freeze({ ...options.cache }) }),
    ...(options.rateLimit === undefined
      ? {}
      : { rateLimit: Object.freeze({ ...options.rateLimit }) }),
  }) as TOptions;

export type HandlerOptionServices<TOptions> =
  TOptions extends HandlerOptions<infer TPlugins, infer _TBody, infer _TRequest>
    ? PluginServices<TPlugins>
    : Record<string, never>;

export type HandlerOptionsServices<TOptions> = HandlerOptionServices<TOptions>;

declare const handlerOptionsManifest: unique symbol;

export type HandlerOptionsManifest<TOptions> = TOptions extends {
  readonly [handlerOptionsManifest]?: infer TManifest;
}
  ? TManifest
  : never;

export type HandlerOptionsBody<TOptions> =
  TOptions extends HandlerOptions<
    readonly JoorPlugin<object>[],
    infer TBody,
    infer _TRequest
  >
    ? TBody
    : never;

export type HandlerOptionsRequest<TOptions> =
  TOptions extends HandlerOptions<
    readonly JoorPlugin<object>[],
    infer _TBody,
    infer TRequest
  >
    ? TRequest
    : never;

type HandlerOptionsHaveRequiredServices<TRequiredServices, TAvailableServices> =
  [TRequiredServices] extends [Record<string, never>]
    ? true
    : [TRequiredServices] extends [object]
      ? [TAvailableServices] extends [TRequiredServices]
        ? true
        : false
      : false;

type HandlerOptionsRequestMatches<
  TRequiredRequest extends Request,
  TRequest extends Request,
> = TRequest extends TRequiredRequest ? true : false;

export type HandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptions<TPlugins, TBody, TRequest> & {
  readonly [handlerOptionsManifest]?: TManifest;
} & (HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? unknown
    : {
        readonly plugins: TPlugins & {
          readonly __joorMissingServices: RpcManifestRequiredServices<TManifest>;
        };
      }) &
  (HandlerOptionsRequestMatches<
    RpcManifestRequiredRuntimeRequest<TManifest>,
    TRequest
  > extends true
    ? unknown
    : {
        readonly __joorRequestTypeMismatch: RpcManifestRequiredRuntimeRequest<TManifest>;
      });

export type RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestRouteStreamHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

type HandlerOptionsArgsBodyFor<
  TPlugins extends readonly JoorPlugin<object>[],
  TOptionsOrBody,
  TAllowedBody,
> =
  TOptionsOrBody extends HandlerOptions<TPlugins, infer TBody, infer _TRequest>
    ? [unknown] extends [TBody]
      ? TAllowedBody
      : TBody & TAllowedBody
    : TOptionsOrBody & TAllowedBody;

type HandlerOptionsArgsBody<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TOptionsOrBody,
> = HandlerOptionsArgsBodyFor<
  TPlugins,
  TOptionsOrBody,
  RpcManifestBody<TManifest>
>;

type HandlerOptionsArgsOptions<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TOptionsOrBody,
  TBody extends RpcManifestBody<TManifest>,
> =
  TOptionsOrBody extends HandlerOptions<TPlugins, unknown, infer _TRequest>
    ? TOptionsOrBody
    : HandlerOptions<TPlugins, TBody>;

export type HandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody = HandlerOptions<TPlugins, RpcManifestBody<TManifest>>,
  TBody extends RpcManifestBody<TManifest> = HandlerOptionsArgsBody<
    TManifest,
    TPlugins,
    TOptionsOrBody
  >,
  TOptions = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> =
  HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? readonly [
        options?: TOptions &
          HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
      ]
    : readonly [
        options: TOptions &
          HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
      ];

export type HandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  HandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  HandlerOptions<TPlugins, TBody, TRequest>,
  TRequest
>;

export type RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestRouteUnaryHandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody = HandlerOptions<
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>
  >,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    HandlerOptionsArgsBodyFor<
      TPlugins,
      TOptionsOrBody,
      RpcManifestRouteUnaryBody<TManifest>
    >,
  TOptions = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  TOptionsOrBody,
  TBody,
  TOptions,
  TRequest
>;

export type RpcManifestUnaryRouteHandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody = HandlerOptions<
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>
  >,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    HandlerOptionsArgsBodyFor<
      TPlugins,
      TOptionsOrBody,
      RpcManifestRouteUnaryBody<TManifest>
    >,
  TOptions = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  TOptionsOrBody,
  TBody,
  TOptions,
  TRequest
>;

export type RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestRouteStreamHandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody = HandlerOptions<
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>
  >,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    HandlerOptionsArgsBodyFor<
      TPlugins,
      TOptionsOrBody,
      RpcManifestRouteStreamBody<TManifest>
    >,
  TOptions = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  TOptionsOrBody,
  TBody,
  TOptions,
  TRequest
>;

export type RpcManifestStreamRouteHandlerOptionsArgsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TOptionsOrBody = HandlerOptions<
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>
  >,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    HandlerOptionsArgsBodyFor<
      TPlugins,
      TOptionsOrBody,
      RpcManifestRouteStreamBody<TManifest>
    >,
  TOptions = HandlerOptionsArgsOptions<
    TManifest,
    TPlugins,
    TOptionsOrBody,
    TBody
  >,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  TOptionsOrBody,
  TBody,
  TOptions,
  TRequest
>;

type HandlerOptionsForTrailing<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest>,
  TRequest extends Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type HandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> =
  HandlerOptionsHaveRequiredServices<
    RpcManifestRequiredServices<TManifest>,
    PluginServices<TPlugins>
  > extends true
    ? readonly [
        options?: HandlerOptionsForTrailing<
          TManifest,
          TPlugins,
          TBody,
          TRequest
        >,
        ...trailingArgs: TTrailingArgs,
      ]
    : readonly [
        options: HandlerOptionsForTrailing<
          TManifest,
          TPlugins,
          TBody,
          TRequest
        >,
        ...trailingArgs: TTrailingArgs,
      ];

export type HandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsWithTrailingArgs<
  TManifest,
  [preflight?: boolean],
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsWithTrailingArgs<
  TManifest,
  TTrailingArgs,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestUnaryRouteHandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
  TManifest,
  TTrailingArgs,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsWithTrailingArgs<
  TManifest,
  TTrailingArgs,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestStreamRouteHandlerOptionsWithTrailingArgs<
  TManifest extends RpcManifest,
  TTrailingArgs extends readonly unknown[],
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
  TManifest,
  TTrailingArgs,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
  TManifest,
  [preflight?: boolean],
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestUnaryRouteHandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
  TManifest,
  [preflight?: boolean],
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestStreamRouteHandlerOptionsWithPreflightArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DefineHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  options: HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>
) => HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineRouteUnaryHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  options: RpcManifestRouteUnaryHandlerOptionsFor<
    TManifest,
    TPlugins,
    TBody,
    TRequest
  >
) => RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type DefineUnaryRouteHandlerOptions<TManifest extends RpcManifest> =
  DefineRouteUnaryHandlerOptions<TManifest>;

export type DefineRouteStreamHandlerOptions<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  options: RpcManifestRouteStreamHandlerOptionsFor<
    TManifest,
    TPlugins,
    TBody,
    TRequest
  >
) => RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

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
  return ((options) =>
    freezeHandlerOptions(options)) as DefineHandlerOptions<TManifest>;
}

export function defineRouteUnaryHandlerOptions<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineRouteUnaryHandlerOptions<TManifest>;
export function defineRouteUnaryHandlerOptions<
  TManifest extends RpcManifest,
>(): DefineRouteUnaryHandlerOptions<TManifest>;
export function defineRouteUnaryHandlerOptions<
  TManifest extends RpcManifest,
>(_manifest?: TManifest): DefineRouteUnaryHandlerOptions<TManifest> {
  return ((options) =>
    freezeHandlerOptions(options)) as DefineRouteUnaryHandlerOptions<TManifest>;
}

export const defineUnaryRouteHandlerOptions: typeof defineRouteUnaryHandlerOptions =
  defineRouteUnaryHandlerOptions;

export function defineRouteStreamHandlerOptions<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineRouteStreamHandlerOptions<TManifest>;
export function defineRouteStreamHandlerOptions<
  TManifest extends RpcManifest,
>(): DefineRouteStreamHandlerOptions<TManifest>;
export function defineRouteStreamHandlerOptions<
  TManifest extends RpcManifest,
>(_manifest?: TManifest): DefineRouteStreamHandlerOptions<TManifest> {
  return ((options) =>
    freezeHandlerOptions(options)) as DefineRouteStreamHandlerOptions<TManifest>;
}

export const defineStreamRouteHandlerOptions: typeof defineRouteStreamHandlerOptions =
  defineRouteStreamHandlerOptions;

export interface HandlerHookContext<
  TServices extends object = object,
  TBody = unknown,
> {
  readonly services: TServices;
  readonly body?: TBody;
}

export interface HandlerHooks<
  TServices extends object = object,
  TBody = unknown,
  TRequest extends Request = Request,
> {
  beforeRequest?(
    request: TRequest,
    context: HandlerHookContext<TServices, TBody>
  ): MaybePromise<Response | undefined>;
  afterResponse?(
    response: Response,
    request: TRequest,
    context: HandlerHookContext<TServices, TBody>
  ): MaybePromise<Response | undefined>;
}

export interface JoorMiddleware<
  TServices extends object = object,
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerHooks<TServices, TBody, TRequest> {
  readonly name: string;
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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerHooks<PluginServices<TPlugins>, TBody, TRequest>;

export type RpcManifestRouteUnaryHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerHooksFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestRouteStreamHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerHooksFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = JoorMiddleware<PluginServices<TPlugins>, TBody, TRequest>;

export type RpcManifestRouteUnaryMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = JoorMiddlewareFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestRouteStreamMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = JoorMiddlewareFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestUnaryRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryProcedure<TManifest, TId>;

export type RpcManifestStreamRouteProcedure<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProcedure<TManifest, TId>;

export type RpcManifestUnaryRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryInput<TManifest, TId>;

export type RpcManifestStreamRouteInput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamInput<TManifest, TId>;

export type RpcManifestUnaryRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryOutput<TManifest, TId>;

export type RpcManifestStreamRouteOutput<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamOutput<TManifest, TId>;

export type RpcManifestUnaryRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientHeaders<TManifest, TId>;

export type RpcManifestStreamRouteClientHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHasHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresHeaders<TManifest, TId>;

export type RpcManifestStreamRouteRequiresHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteHasResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestStreamRouteRequiresResponseHeaders<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestUnaryRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryError<TManifest, TId>;

export type RpcManifestStreamRouteError<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamError<TManifest, TId>;

export type RpcManifestUnaryRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryErrorCode<TManifest, TId>;

export type RpcManifestStreamRouteErrorCode<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamErrorCode<TManifest, TId>;

export type RpcManifestUnaryRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<TManifest, TId> =
    RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcManifestRouteUnaryErrorDetails<TManifest, TId, TCode>;

export type RpcManifestStreamRouteErrorDetails<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<TManifest, TId> =
    RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcManifestRouteStreamErrorDetails<TManifest, TId, TCode>;

export type RpcManifestUnaryRouteEnvelope<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryEnvelope<TManifest, TId>;

export type RpcManifestRouteUnaryEnvelopeUnion<TManifest extends RpcManifest> =
  RpcManifestRouteEnvelopeUnion<TManifest>;

export type RpcManifestUnaryRouteResult<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResult<TManifest, TId>;

export type RpcManifestRouteUnaryResultUnion<TManifest extends RpcManifest> =
  RpcManifestRouteResultUnion<TManifest>;

export type RpcManifestUnaryRouteRequest<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequest<TManifest, TId>;

export type RpcManifestRouteUnaryRequestUnion<TManifest extends RpcManifest> =
  RpcManifestRouteRequestUnion<TManifest>;

export type RpcManifestUnaryRouteBatchRequest<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchRequest<TManifest, TRequests>;

export type RpcManifestUnaryRouteBatchResults<
  TManifest extends RpcManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type RpcManifestUnaryRouteBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>;

export type RpcManifestStreamRouteBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamBodyResultFor<TManifest, TBody>;

export type RpcManifestUnaryRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequestOptions<TManifest, TId>;

export type RpcManifestStreamRouteRequestOptions<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequestOptions<TManifest, TId>;

export type RpcManifestUnaryRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientArgs<TManifest, TId>;

export type RpcManifestStreamRouteClientArgs<
  TManifest extends RpcManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientArgs<TManifest, TId>;

export type RpcManifestUnaryRouteBodyResultHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryBodyResultHandler<TManifest, TRequest>;

export type RpcManifestStreamRouteBodyResultHandler<
  TManifest extends RpcManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamBodyResultHandler<TManifest, TRequest>;

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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestStreamRouteHandlerOptionsFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestUnaryRouteHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type RpcManifestStreamRouteHandlerOptionsArgs<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

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
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerHooksFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestStreamRouteHandlerHooksFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerHooksFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestUnaryRouteMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryMiddlewareFor<TManifest, TPlugins, TBody, TRequest>;

export type RpcManifestStreamRouteMiddlewareFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamMiddlewareFor<TManifest, TPlugins, TBody, TRequest>;

const rateLimitWindows = new Map<string, RateLimitWindow>();
const procedureSuccessCache = new Map<string, CachedProcedureSuccess>();
let traceCounter = 0;

const corsHeaders = (options: HandlerOptions): Record<string, string> => {
  return createCorsHeaderRecord(options.cors) ?? {};
};

const optionalCorsHeaders = (
  options: HandlerOptions
): Record<string, string> | undefined =>
  options.cors === undefined ? undefined : corsHeaders(options);

const traceId = (request: ContextRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return `trace-${traceCounter}`;
};

const rpcFailure = <TId extends string>(
  id: TId,
  trace: string,
  code: RpcFrameworkErrorCode,
  message: string,
  status: number,
  details?: JsonValue
): RpcFailure<TId> => ({
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
): Response => rpcEnvelopeToResponse(payload, optionalCorsHeaders(options));

export type RpcRequestPreflight = (
  request: ContextRequestSource
) => Response | undefined;

const isRpcRequest = (value: JsonValue): value is JsonObject & RpcRequest =>
  isJsonObject(value) &&
  typeof value['id'] === 'string' &&
  (value['traceId'] === undefined || typeof value['traceId'] === 'string');

const isAsyncIterable = (value: unknown): value is AsyncIterable<JsonValue> =>
  Symbol.asyncIterator in Object(value);

const headersToJsonObject = (
  request: ContextRequestSource,
  prepared: PreparedProcedure
): ProcedureCacheHeaderValues => {
  const output: Record<string, string> = {};
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
  const responseCors = options.cors === undefined ? undefined : cors;
  const corsEnabled = options.cors !== undefined;
  const rpcPath = options.path ?? '/rpc';
  return (request: ContextRequestSource): Response | undefined => {
    if (!matchesPath(request.url, rpcPath)) {
      return new Response(null, { status: 404, headers: cors });
    }
    if (request.method === 'OPTIONS' && corsEnabled) {
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
      return rpcEnvelopeToResponse(
        rpcFailure(
          '',
          traceId(request),
          'UNSUPPORTED_MEDIA_TYPE',
          'Content-Type must be application/json',
          415
        ),
        responseCors
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

const rateLimitFailure = <TId extends string>(
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  trace: string,
  runtime: RuntimeOptions
): RpcFailure<TId> | undefined => {
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

const executeUnary = async <TId extends string>(
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope<JsonValue, TId>> => {
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
    const responseHeaders =
      responseHeaderResult.value as CachedProcedureHeaders;
    if (cacheKey !== undefined && cacheConfig !== undefined) {
      writeCachedProcedureSuccess(
        procedureSuccessCache,
        cacheKey,
        parseDurationMs(cacheConfig.ttl),
        data,
        responseHeaders,
        runtime.cacheMaxEntries
      );
    }
    return {
      ok: true,
      id: rpcRequest.id,
      traceId: trace,
      data,
      headers: responseHeaders,
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

const executeTrustedUnary = async <TId extends string>(
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope<JsonValue, TId>> => {
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

const executeStream = async <TId extends string>(
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<Response> => {
  const toRuntimeResponse = (payload: RpcEnvelope): Response =>
    rpcEnvelopeToResponse(payload, runtime.cors);
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    prepared,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return toRuntimeResponse(limited);
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
    return toRuntimeResponse(
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
    return toRuntimeResponse({
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
    return toRuntimeResponse(
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
    return toRuntimeResponse(
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
  const iterable = await procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (!isAsyncIterable(iterable)) {
    return toRuntimeResponse(
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
                )
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
            rpcFailure(rpcRequest.id, trace, 'INTERNAL_ERROR', message, 500)
          )
        );
      } finally {
        controller.close();
      }
    },
  });
  return transportResultToResponse(createSseResponse(stream), runtime.cors);
};

export function createRpcHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): RpcRequestHandler<TRequest>;
export function createRpcHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {}
): RpcRequestHandler {
  const handlerOptions = freezeHandlerOptions(options);
  const handleParsed = createRpcBodyHandler(
    manifest,
    handlerOptions as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >,
    false
  );
  const preflight = createRpcRequestPreflight(handlerOptions);
  const bodyLimit = normalizeMaxBodyBytes(
    handlerOptions.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
  return async (request: Request): Promise<Response> => {
    const source = createFetchRequestSource(request);
    const early = preflight(source);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      if (error instanceof Error) handlerOptions.onError?.(error, request);
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
          ...(handlerOptions.cors === undefined
            ? {}
            : corsHeaders(handlerOptions)),
        },
      });
    }
    return handleParsed(request, body as RpcManifestBody<TManifest>);
  };
}

export function createRpcHandlerFor(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => RpcRequestHandler<RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRpcHandlerFor<TRequest extends Request>(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => RpcRequestHandler<TRequest>;
export function createRpcHandlerFor<TRequest extends Request = Request>() {
  return <
    TManifest extends RpcManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): RpcRequestHandler<TRequest> =>
    createRpcHandler(
      manifest,
      (args[0] ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >
    ) as RpcRequestHandler<TRequest>;
}

export function createRpcBodyHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): RpcBodyHandler<TManifest, TRequest>;
export function createRpcBodyHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcBodyHandler<TManifest, Request> {
  const handlerOptions = freezeHandlerOptions(options);
  const handleResult = createRpcBodyResultHandler(
    manifest,
    handlerOptions as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >,
    preflight
  );
  const extraHeaders = optionalCorsHeaders(handlerOptions);
  return async (
    request: Request,
    body: RpcManifestBody<TManifest>
  ): Promise<Response> => {
    const result = await handleResult(request, body);
    return result instanceof Response
      ? transportResultToResponse(result, extraHeaders)
      : toResponse(result, handlerOptions);
  };
}

export function createRpcBodyHandlerFor(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => RpcBodyHandler<TManifest, RpcManifestRequiredRuntimeRequest<TManifest>>;
export function createRpcBodyHandlerFor<TRequest extends Request>(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => RpcBodyHandler<TManifest, TRequest>;
export function createRpcBodyHandlerFor<TRequest extends Request = Request>() {
  return <
    TManifest extends RpcManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HandlerOptionsWithPreflightArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): RpcBodyHandler<TManifest, TRequest> =>
    createRpcBodyHandler(
      manifest,
      (args[0] ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >,
      args[1] ?? true
    ) as RpcBodyHandler<TManifest, TRequest>;
}

export function createRouteUnaryRpcBodyHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): RpcManifestRouteUnaryBodyHandler<TManifest, TRequest>;
export function createRouteUnaryRpcBodyHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteUnaryBodyHandler<TManifest, Request> {
  return createRpcBodyHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >,
    preflight
  ) as RpcManifestRouteUnaryBodyHandler<TManifest, Request>;
}

export const createUnaryRouteRpcBodyHandler: typeof createRouteUnaryRpcBodyHandler =
  createRouteUnaryRpcBodyHandler;

export function createRouteStreamRpcBodyHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): RpcManifestRouteStreamBodyHandler<TManifest, TRequest>;
export function createRouteStreamRpcBodyHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteStreamBodyHandler<TManifest, Request> {
  return createRpcBodyHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >,
    preflight
  ) as RpcManifestRouteStreamBodyHandler<TManifest, Request>;
}

export const createStreamRouteRpcBodyHandler: typeof createRouteStreamRpcBodyHandler =
  createRouteStreamRpcBodyHandler;

export function createRpcBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): RpcBodyResultHandler<TManifest, TRequest>;
export function createRpcBodyResultHandler<TManifest extends RpcManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcBodyResultHandler<TManifest, Request> {
  const handlerOptions = freezeHandlerOptions(options);
  const handleTransport = createRpcTransportBodyResultHandler(
    manifest,
    handlerOptions as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >,
    preflight
  );
  return (<const TBody extends RpcManifestBody<TManifest>>(
    request: Request,
    body: TBody
  ): Promise<RpcManifestBodyResultFor<TManifest, TBody>> =>
    Promise.resolve(
      handleTransport(createFetchRequestSource(request), body)
    )) as RpcBodyResultHandler<TManifest, Request>;
}

export function createRpcBodyResultHandlerFor(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    RpcManifestRequiredRuntimeRequest<TManifest>
  >
) => RpcBodyResultHandler<
  TManifest,
  RpcManifestRequiredRuntimeRequest<TManifest>
>;
export function createRpcBodyResultHandlerFor<TRequest extends Request>(): <
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
) => RpcBodyResultHandler<TManifest, TRequest>;
export function createRpcBodyResultHandlerFor<
  TRequest extends Request = Request,
>() {
  return <
    TManifest extends RpcManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  >(
    manifest: TManifest,
    ...args: HandlerOptionsWithPreflightArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): RpcBodyResultHandler<TManifest, TRequest> =>
    createRpcBodyResultHandler(
      manifest,
      (args[0] ?? {}) as unknown as HandlerOptionsFor<
        TManifest,
        TPlugins,
        RpcManifestBody<TManifest>,
        TRequest
      >,
      args[1] ?? true
    ) as RpcBodyResultHandler<TManifest, TRequest>;
}

export function createRouteUnaryRpcBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): RpcManifestRouteUnaryBodyResultHandler<TManifest, TRequest>;
export function createRouteUnaryRpcBodyResultHandler<
  TManifest extends RpcManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteUnaryBodyResultHandler<TManifest, Request> {
  return createRpcBodyResultHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >,
    preflight
  ) as RpcManifestRouteUnaryBodyResultHandler<TManifest, Request>;
}

export const createUnaryRouteRpcBodyResultHandler: typeof createRouteUnaryRpcBodyResultHandler =
  createRouteUnaryRpcBodyResultHandler;

export function createRouteStreamRpcBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): RpcManifestRouteStreamBodyResultHandler<TManifest, TRequest>;
export function createRouteStreamRpcBodyResultHandler<
  TManifest extends RpcManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteStreamBodyResultHandler<TManifest, Request> {
  return createRpcBodyResultHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >,
    preflight
  ) as RpcManifestRouteStreamBodyResultHandler<TManifest, Request>;
}

export const createStreamRouteRpcBodyResultHandler: typeof createRouteStreamRpcBodyResultHandler =
  createRouteStreamRpcBodyResultHandler;

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
  const handlerOptions = freezeHandlerOptions(options);
  const procedures = prepareProcedures(manifest);
  const requestPreflight = preflight
    ? createRpcRequestPreflight(handlerOptions)
    : undefined;
  const runtime: RuntimeOptions = {
    cors: corsHeaders(handlerOptions),
    cacheMaxEntries:
      handlerOptions.cache?.maxEntries ?? DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
    enforceRateLimit: handlerOptions.enforceRateLimit ?? true,
    rateLimit: {
      trustProxy: handlerOptions.rateLimit?.trustProxy ?? false,
      maxEntries:
        handlerOptions.rateLimit?.maxEntries ?? DEFAULT_RATE_LIMIT_MAX_ENTRIES,
      ...(handlerOptions.rateLimit?.identity === undefined
        ? {}
        : { identity: handlerOptions.rateLimit.identity }),
    },
    validateHeaders: handlerOptions.validateHeaders ?? true,
    validateInput: handlerOptions.validateInput ?? true,
    validateOutput: handlerOptions.validateOutput ?? true,
    validateResponseHeaders: handlerOptions.validateResponseHeaders ?? true,
  };
  const useTrustedUnary =
    !runtime.enforceRateLimit &&
    !runtime.validateHeaders &&
    !runtime.validateInput &&
    !runtime.validateOutput &&
    !runtime.validateResponseHeaders;
  const plugins = handlerOptions.plugins ?? [];
  let services: object | undefined;
  const servicesPromise =
    plugins.length === 0
      ? Promise.resolve({})
      : resolvePluginServices(plugins).then((resolved) => {
          services = resolved;
          return resolved;
        });
  if (plugins.length === 0) services = {};
  const middleware = handlerOptions.middleware ?? [];
  const hasBeforeHooks =
    handlerOptions.hooks?.beforeRequest !== undefined ||
    middleware.some((item) => item.beforeRequest !== undefined);
  const hasAfterHooks =
    handlerOptions.hooks?.afterResponse !== undefined ||
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
    const hookResult = await handlerOptions.hooks?.beforeRequest?.(
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
    const hookResult = await handlerOptions.hooks?.afterResponse?.(
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
      toResponse(result, handlerOptions),
      request,
      body
    )) as RpcManifestBodyResultFor<TManifest, TBody>;
  }) as RpcTransportBodyResultHandler<TManifest>;
}

export function createRouteUnaryRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins
  >
): RpcManifestRouteUnaryTransportBodyResultHandler<TManifest>;
export function createRouteUnaryRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteUnaryTransportBodyResultHandler<TManifest> {
  return createRpcTransportBodyResultHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>
    >,
    preflight
  ) as RpcManifestRouteUnaryTransportBodyResultHandler<TManifest>;
}

export const createUnaryRouteRpcTransportBodyResultHandler: typeof createRouteUnaryRpcTransportBodyResultHandler =
  createRouteUnaryRpcTransportBodyResultHandler;

export function createRouteStreamRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    TManifest,
    TPlugins
  >
): RpcManifestRouteStreamTransportBodyResultHandler<TManifest>;
export function createRouteStreamRpcTransportBodyResultHandler<
  TManifest extends RpcManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  preflight = true
): RpcManifestRouteStreamTransportBodyResultHandler<TManifest> {
  return createRpcTransportBodyResultHandler(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>
    >,
    preflight
  ) as RpcManifestRouteStreamTransportBodyResultHandler<TManifest>;
}

export const createStreamRouteRpcTransportBodyResultHandler: typeof createRouteStreamRpcTransportBodyResultHandler =
  createRouteStreamRpcTransportBodyResultHandler;
