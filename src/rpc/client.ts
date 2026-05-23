import type { JsonValue } from '../schema/json.js';
import type { JoorManifest, JoorManifestRoutes } from '../manifest.js';
import type {
  ProcedureInput,
  ProcedureOutput,
  ProcedureHasHeaders,
  ProcedureHeaders,
  ProcedureRequiresHeaders,
  ProcedureHasResponseHeaders,
  ProcedureResponseHeaders,
  ProcedureRequiresResponseHeaders,
  ProcedureError,
  ProcedureErrorCode,
  ProcedureErrorDetails,
  ProcedureRuntime,
  StreamEvent,
} from '../procedure/types.js';
import type {
  RpcEnvelope,
  RpcError,
  RpcFrameworkErrorCode,
  RpcRequest,
  RpcResponseHeaderValues,
} from './protocol.js';

export interface ClientOptions<
  TManifest extends JoorManifest | undefined = undefined,
> {
  url: string;
  fetch?: ClientFetch;
  headers?: ClientHeaderValues;
  manifest?: TManifest;
  maxStreamEventBytes?: number;
}

export type ClientFetch = (request: Request) => Promise<Response>;

export type ClientHeaderValues = Record<string, string | undefined>;

export type RpcRouteMap = Record<string, ProcedureRuntime>;

export type RpcRouteId<TRoutes extends RpcRouteMap> = Extract<
  keyof TRoutes,
  string
>;

export type RpcRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = TRoutes[TId];

export type RpcRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureInput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureOutput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ClientProcedureHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureHasHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureRequiresHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureResponseHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureHasResponseHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureRequiresResponseHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcProcedureFrameworkError<TProcedure> = RpcError<
  Exclude<RpcFrameworkErrorCode, ProcedureErrorCode<TProcedure>>,
  JsonValue
>;

export type RpcProcedureError<TProcedure> =
  | ProcedureError<TProcedure>
  | RpcProcedureFrameworkError<TProcedure>;

export type RpcRouteError<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = RpcProcedureError<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> =
  | ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
  | Exclude<
      RpcFrameworkErrorCode,
      ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
    >;

export type RpcRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
  TCode extends RpcRouteErrorCode<TRoutes, TId>,
> =
  TCode extends ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
    ? ProcedureErrorDetails<RpcRouteProcedure<TRoutes, TId>, TCode>
    : JsonValue | undefined;

export type RpcRouteStreamEvent<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = StreamEvent<RpcRouteProcedure<TRoutes, TId>>;

export type RpcUnaryProcedure<TProcedure> = [StreamEvent<TProcedure>] extends [
  never,
]
  ? TProcedure
  : never;

export type RpcStreamProcedure<TProcedure> = [StreamEvent<TProcedure>] extends [
  never,
]
  ? never
  : TProcedure;

export type RpcUnaryRouteId<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteId<TRoutes>]: [RpcRouteStreamEvent<TRoutes, TId>] extends [
    never,
  ]
    ? TId
    : never;
}[RpcRouteId<TRoutes>];

export type RpcStreamRouteId<TRoutes extends RpcRouteMap> = Exclude<
  RpcRouteId<TRoutes>,
  RpcUnaryRouteId<TRoutes>
>;

export type RpcUnaryRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteProcedure<TRoutes, TId>;

export type RpcStreamRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteProcedure<TRoutes, TId>;

export type RpcUnaryRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteInput<TRoutes, TId>;

export type RpcStreamRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteInput<TRoutes, TId>;

export type RpcUnaryRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteOutput<TRoutes, TId>;

export type RpcUnaryRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteHeaders<TRoutes, TId>;

export type RpcStreamRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteHeaders<TRoutes, TId>;

export type RpcUnaryRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteClientHeaders<TRoutes, TId>;

export type RpcStreamRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteClientHeaders<TRoutes, TId>;

export type RpcUnaryRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteHasHeaders<TRoutes, TId>;

export type RpcStreamRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteHasHeaders<TRoutes, TId>;

export type RpcUnaryRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteRequiresHeaders<TRoutes, TId>;

export type RpcStreamRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteRequiresHeaders<TRoutes, TId>;

export type RpcUnaryRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteHasResponseHeaders<TRoutes, TId>;

export type RpcStreamRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteHasResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteRequiresResponseHeaders<TRoutes, TId>;

export type RpcStreamRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteRequiresResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteError<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteError<TRoutes, TId>;

export type RpcStreamRouteError<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteError<TRoutes, TId>;

export type RpcUnaryRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteErrorCode<TRoutes, TId>;

export type RpcStreamRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteErrorCode<TRoutes, TId>;

export type RpcUnaryRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
  TCode extends RpcUnaryRouteErrorCode<TRoutes, TId>,
> = RpcRouteErrorDetails<TRoutes, TId, TCode>;

export type RpcStreamRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
  TCode extends RpcStreamRouteErrorCode<TRoutes, TId>,
> = RpcRouteErrorDetails<TRoutes, TId, TCode>;

export type RpcStreamRouteEvent<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteStreamEvent<TRoutes, TId>;

export type RpcRouteEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcEnvelope<
  RpcRouteOutput<TRoutes, TId> & JsonValue,
  TId,
  RpcRouteResponseHeaders<TRoutes, TId>,
  RpcRouteError<TRoutes, TId>
>;

export type RpcRouteEnvelopeUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcUnaryRouteId<TRoutes>]: RpcRouteEnvelope<TRoutes, TId>;
}[RpcUnaryRouteId<TRoutes>];

export type RpcUnaryRouteEnvelopeUnion<TRoutes extends RpcRouteMap> =
  RpcRouteEnvelopeUnion<TRoutes>;

export type RpcRouteResult<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteEnvelope<TRoutes, TId>;

export type RpcUnaryRouteEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteEnvelope<TRoutes, TId>;

export type RpcUnaryRouteResult<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteResult<TRoutes, TId>;

export type RpcRouteResultUnion<TRoutes extends RpcRouteMap> =
  RpcRouteEnvelopeUnion<TRoutes>;

export type RpcUnaryRouteResultUnion<TRoutes extends RpcRouteMap> =
  RpcRouteResultUnion<TRoutes>;

export type RpcRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = {
  id: TId;
  input: RpcRouteInput<TRoutes, TId> & JsonValue;
  traceId?: string;
};

export type RpcRouteUnaryProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteProtocolRequest<TRoutes, TId>;

export type RpcRouteStreamProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteProtocolRequest<TRoutes, TId>;

export type RpcUnaryRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteUnaryProtocolRequest<TRoutes, TId>;

export type RpcStreamRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteStreamProtocolRequest<TRoutes, TId>;

export type RpcRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteId<TRoutes>]: RpcRouteProtocolRequest<TRoutes, TId>;
}[RpcRouteId<TRoutes>];

export type RpcRouteUnaryProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcUnaryRouteId<TRoutes>]: RpcRouteUnaryProtocolRequest<TRoutes, TId>;
}[RpcUnaryRouteId<TRoutes>];

export type RpcUnaryRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryProtocolRequestUnion<TRoutes>;

export type RpcRouteStreamProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcStreamRouteId<TRoutes>]: RpcRouteStreamProtocolRequest<
    TRoutes,
    TId
  >;
}[RpcStreamRouteId<TRoutes>];

export type RpcStreamRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteStreamProtocolRequestUnion<TRoutes>;

export type RpcRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[],
> = TRequests;

export type RpcUnaryRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcUnaryRouteProtocolRequestUnion<TRoutes>[],
> = RpcRouteBatchRequest<TRoutes, TRequests>;

export type RpcRouteBody<TRoutes extends RpcRouteMap> =
  | RpcRouteProtocolRequestUnion<TRoutes>
  | RpcRouteBatchRequest<
      TRoutes,
      readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[]
    >;

export type RpcUnaryRouteBody<TRoutes extends RpcRouteMap> =
  | RpcUnaryRouteProtocolRequestUnion<TRoutes>
  | RpcUnaryRouteBatchRequest<
      TRoutes,
      readonly RpcUnaryRouteProtocolRequestUnion<TRoutes>[]
    >;

export type RpcStreamRouteBody<TRoutes extends RpcRouteMap> =
  RpcStreamRouteProtocolRequestUnion<TRoutes>;

export type RpcRouteBodyResult<TRoutes extends RpcRouteMap> =
  | RpcRouteEnvelopeUnion<TRoutes>
  | readonly RpcRouteEnvelopeUnion<TRoutes>[]
  | Response;

export type RpcUnaryRouteBodyResult<TRoutes extends RpcRouteMap> =
  RpcRouteBodyResult<TRoutes>;

export type RpcStreamRouteBodyResult = Response;

type RpcRouteProtocolBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody,
> = TBody extends { id: infer TId extends RpcRouteId<TRoutes> }
  ? TId extends RpcStreamRouteId<TRoutes>
    ? TBody extends RpcRouteStreamProtocolRequest<TRoutes, TId>
      ? Response
      : never
    : TId extends RpcUnaryRouteId<TRoutes>
      ? TBody extends
          | RpcRouteUnaryProtocolRequest<TRoutes, TId>
          | RpcRouteRequest<TRoutes, TId>
        ? RpcRouteEnvelope<TRoutes, TId> | Response
        : never
      : never
  : TBody extends { id: string }
    ? never
    : RpcRouteBodyResult<TRoutes>;

export type RpcRouteBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody,
> = TBody extends readonly unknown[]
  ? TBody extends readonly RpcRouteBatchResultRequest<TRoutes>[]
    ? RpcRouteBatchResults<TRoutes, TBody> | Response
    : never
  : RpcRouteProtocolBodyResultFor<TRoutes, TBody>;

export type RpcUnaryRouteBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody,
> = RpcRouteBodyResultFor<TRoutes, TBody>;

export type RpcStreamRouteBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody,
> = RpcRouteBodyResultFor<TRoutes, TBody>;

type PendingRpcRequestInput<TProcedure> = [TProcedure] extends [never]
  ? JsonValue
  : ProcedureInput<TProcedure>;

type OptionalClientHeaderKeys<THeaders extends object> = keyof {
  [TKey in keyof THeaders as undefined extends THeaders[TKey]
    ? TKey
    : never]: true;
};

type RequiredClientHeaderFields<THeaders extends object> = {
  [TKey in keyof THeaders as TKey extends OptionalClientHeaderKeys<THeaders>
    ? never
    : TKey]: THeaders[TKey];
};

type OptionalClientHeaderFields<THeaders extends object> = {
  [TKey in OptionalClientHeaderKeys<THeaders>]?: THeaders[TKey] | undefined;
};

export type ClientProcedureHeaders<TProcedure> =
  ProcedureHeaders<TProcedure> extends infer THeaders
    ? THeaders extends object
      ? RequiredClientHeaderFields<THeaders> &
          OptionalClientHeaderFields<THeaders>
      : never
    : never;

type PendingRpcRequestHeaders<TProcedure> = [TProcedure] extends [never]
  ? { headers?: ClientHeaderValues }
  : ProcedureRequiresHeaders<TProcedure> extends false
    ? { headers?: ClientProcedureHeaders<TProcedure> }
    : { headers: ClientProcedureHeaders<TProcedure> };

type ClientRequestOptionsTuple<TProcedure> =
  ProcedureRequiresHeaders<TProcedure> extends false
    ? [ClientRequestOptions<TProcedure>?]
    : [ClientRequestOptions<TProcedure>];

export type PendingRpcRequest<
  TProcedure = never,
  TId extends string = string,
> = {
  id: TId;
  input: PendingRpcRequestInput<TProcedure>;
} & PendingRpcRequestHeaders<TProcedure>;

export type RpcRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = PendingRpcRequest<RpcRouteProcedure<TRoutes, TId>, TId> &
  PendingRpcRequestHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcUnaryRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteRequest<TRoutes, TId>;

export type RpcRouteRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcUnaryRouteId<TRoutes>]: RpcRouteRequest<TRoutes, TId>;
}[RpcUnaryRouteId<TRoutes>];

export type RpcUnaryRouteRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteRequestUnion<TRoutes>;

type RpcRouteBatchResultRequest<TRoutes extends RpcRouteMap> =
  | RpcRouteRequestUnion<TRoutes>
  | RpcRouteUnaryProtocolRequestUnion<TRoutes>;

type RpcRouteBatchResultFor<
  TRoutes extends RpcRouteMap,
  TRequest,
> = TRequest extends {
  id: infer TId extends RpcUnaryRouteId<TRoutes>;
}
  ? TRequest extends
      | RpcRouteRequest<TRoutes, TId>
      | RpcRouteUnaryProtocolRequest<TRoutes, TId>
    ? RpcRouteEnvelope<TRoutes, TId>
    : never
  : never;

export type RpcRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchResultRequest<TRoutes>[],
> = {
  [TIndex in keyof TRequests]: RpcRouteBatchResultFor<
    TRoutes,
    TRequests[TIndex]
  >;
};

export type ClientRequestOptions<TProcedure> = [TProcedure] extends [never]
  ? { headers?: ClientHeaderValues }
  : ProcedureRequiresHeaders<TProcedure> extends false
    ? { headers?: ClientProcedureHeaders<TProcedure> }
    : { headers: ClientProcedureHeaders<TProcedure> };

export type RpcRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ClientRequestOptions<RpcRouteProcedure<TRoutes, TId>>;

export type RpcUnaryRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteRequestOptions<TRoutes, TId>;

export type RpcStreamRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteRequestOptions<TRoutes, TId>;

export type RpcRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> =
  RpcRouteRequiresHeaders<TRoutes, TId> extends false
    ? [
        input: RpcRouteInput<TRoutes, TId>,
        options?: RpcRouteRequestOptions<TRoutes, TId>,
      ]
    : [
        input: RpcRouteInput<TRoutes, TId>,
        options: RpcRouteRequestOptions<TRoutes, TId>,
      ];

export type RpcUnaryRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcRouteClientArgs<TRoutes, TId>;

export type RpcStreamRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcStreamRouteId<TRoutes>,
> = RpcRouteClientArgs<TRoutes, TId>;

type BatchResultData<TProcedure> = [TProcedure] extends [never]
  ? JsonValue
  : ProcedureOutput<TProcedure> & JsonValue;

type BatchResultHeaders<TProcedure> = [TProcedure] extends [never]
  ? RpcResponseHeaderValues
  : ProcedureResponseHeaders<TProcedure>;

type BatchResultError<TProcedure> = [TProcedure] extends [never]
  ? RpcError
  : RpcProcedureError<TProcedure>;

type BatchResultFor<TRequest> =
  TRequest extends PendingRpcRequest<infer TProcedure, infer TId>
    ? RpcEnvelope<
        BatchResultData<TProcedure>,
        TId,
        BatchResultHeaders<TProcedure>,
        BatchResultError<TProcedure>
      >
    : TRequest extends { id: infer TId extends string }
      ? RpcEnvelope<JsonValue, TId, RpcResponseHeaderValues, RpcError>
      : never;

export type BatchResults<TRequests extends readonly PendingRpcRequest[]> = {
  [TIndex in keyof TRequests]: BatchResultFor<TRequests[TIndex]>;
};

export interface LegacyRpcTransportClient {
  call<TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<RpcUnaryProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcUnaryProcedure<TProcedure>>
  ): Promise<
    RpcEnvelope<
      ProcedureOutput<RpcUnaryProcedure<TProcedure>> & JsonValue,
      TId,
      ProcedureResponseHeaders<RpcUnaryProcedure<TProcedure>>,
      RpcProcedureError<RpcUnaryProcedure<TProcedure>>
    >
  >;
  request<TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<RpcUnaryProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcUnaryProcedure<TProcedure>>
  ): PendingRpcRequest<RpcUnaryProcedure<TProcedure>, TId> &
    PendingRpcRequestHeaders<RpcUnaryProcedure<TProcedure>>;
  batch<const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>>;
  stream<TProcedure>(
    id: string,
    input: ProcedureInput<RpcStreamProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcStreamProcedure<TProcedure>>
  ): AsyncIterable<StreamEvent<RpcStreamProcedure<TProcedure>> & JsonValue>;
}

export interface RouteRpcTransportClient<TRoutes extends RpcRouteMap> {
  call<TId extends RpcUnaryRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): Promise<RpcRouteEnvelope<TRoutes, TId>>;
  request<TId extends RpcUnaryRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): RpcRouteRequest<TRoutes, TId>;
  batch<const TRequests extends readonly RpcRouteRequestUnion<TRoutes>[]>(
    requests: TRequests
  ): Promise<RpcRouteBatchResults<TRoutes, TRequests>>;
  stream<TId extends RpcStreamRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): AsyncIterable<RpcRouteStreamEvent<TRoutes, TId> & JsonValue>;
}

export type RpcTransportClient<TRoutes extends RpcRouteMap = never> = [
  TRoutes,
] extends [never]
  ? LegacyRpcTransportClient
  : RouteRpcTransportClient<TRoutes>;

export type RpcManifestTransportClient<TManifest extends JoorManifest> =
  RpcTransportClient<JoorManifestRoutes<TManifest>>;

export type RpcManifestClientOptions<TManifest extends JoorManifest> = Omit<
  ClientOptions<TManifest>,
  'manifest'
>;

const appendStringHeaders = (
  output: Headers,
  values: object | undefined
): void => {
  if (values === undefined) return;
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string') {
      output.set(key, value);
    }
  }
};

const createHeaders = (
  baseHeaders?: ClientHeaderValues,
  requestHeaders?: object
): Headers => {
  const output = new Headers();
  appendStringHeaders(output, baseHeaders);
  appendStringHeaders(output, requestHeaders);
  output.set('content-type', 'application/json');
  return output;
};

const defaultMaxStreamEventBytes = 1024 * 1024;

const normalizeMaxStreamEventBytes = (value: number | undefined): number =>
  value === undefined || !Number.isFinite(value) || value < 0
    ? defaultMaxStreamEventBytes
    : Math.floor(value);

const parseSse = async function* <TEvent extends JsonValue>(
  response: Response,
  maxEventBytes: number
): AsyncIterable<TEvent> {
  if (response.body === null) return;
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    buffer += read.value;
    if (buffer.length > maxEventBytes) {
      throw new Error('SSE event exceeds maxStreamEventBytes');
    }
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';
    for (const chunk of chunks) {
      if (chunk.length > maxEventBytes) {
        throw new Error('SSE event exceeds maxStreamEventBytes');
      }
      const eventLine = chunk
        .split('\n')
        .find((line) => line.startsWith('event: '));
      const eventName = eventLine?.slice(7);
      if (eventName === 'done') return;
      const dataLine = chunk
        .split('\n')
        .find((line) => line.startsWith('data: '));
      if (dataLine !== undefined) {
        const parsed = JSON.parse(dataLine.slice(6)) as JsonValue;
        if (eventName === 'error') {
          throw new Error(JSON.stringify(parsed));
        }
        yield parsed as TEvent;
      }
    }
  }
};

export function createClient<const TManifest extends JoorManifest>(
  options: ClientOptions<TManifest> & { manifest: TManifest }
): RpcManifestTransportClient<TManifest>;
export function createClient<TRoutes extends RpcRouteMap = never>(
  options: ClientOptions
): RpcTransportClient<TRoutes>;
export function createClient(
  options: ClientOptions<JoorManifest | undefined>
): LegacyRpcTransportClient | RouteRpcTransportClient<RpcRouteMap> {
  const fetcher =
    options.fetch ??
    ((request: Request): Promise<Response> => globalThis.fetch(request));
  const maxStreamEventBytes = normalizeMaxStreamEventBytes(
    options.maxStreamEventBytes
  );
  const call = async <TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: ProcedureRequiresHeaders<TProcedure> extends false
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): Promise<
    RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue,
      TId,
      ProcedureResponseHeaders<TProcedure>,
      RpcProcedureError<TProcedure>
    >
  > => {
    const [callOptions] = requestOptions;
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: createHeaders(options.headers, callOptions?.headers),
        body: JSON.stringify({ id, input }),
      })
    );
    return (await response.json()) as RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue,
      TId,
      ProcedureResponseHeaders<TProcedure>,
      RpcProcedureError<TProcedure>
    >;
  };
  const request = <TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: ProcedureRequiresHeaders<TProcedure> extends false
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): PendingRpcRequest<TProcedure, TId> &
    PendingRpcRequestHeaders<TProcedure> =>
    ({
      id,
      input,
      ...(requestOptions[0]?.headers === undefined
        ? {}
        : { headers: requestOptions[0].headers }),
    }) as PendingRpcRequest<TProcedure, TId> &
      PendingRpcRequestHeaders<TProcedure>;
  const batch = async <const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>> => {
    const body: RpcRequest[] = requests.map((pending) => ({
      id: pending.id,
      input: pending.input as JsonValue,
    }));
    const requestHeaders = createHeaders(options.headers);
    for (const pending of requests) {
      appendStringHeaders(requestHeaders, pending.headers);
    }
    requestHeaders.set('content-type', 'application/json');
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(body),
      })
    );
    return (await response.json()) as BatchResults<TRequests>;
  };
  const stream = <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: ProcedureRequiresHeaders<TProcedure> extends false
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue> => ({
    async *[Symbol.asyncIterator]() {
      const headers = createHeaders(
        options.headers,
        requestOptions[0]?.headers
      );
      headers.set('accept', 'text/event-stream');
      const response = await fetcher(
        new Request(options.url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ id, input }),
        })
      );
      yield* parseSse<JsonValue>(
        response,
        maxStreamEventBytes
      ) as AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
    },
  });
  return {
    call,
    request,
    batch,
    stream,
  };
}

export const createManifestClient = <const TManifest extends JoorManifest>(
  manifest: TManifest,
  options: RpcManifestClientOptions<TManifest>
): RpcManifestTransportClient<TManifest> =>
  createClient({ ...options, manifest });
