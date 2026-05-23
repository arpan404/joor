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
  request?: ClientRequestInit;
  manifest?: TManifest;
  maxStreamEventBytes?: number;
}

export type ClientFetch = (request: Request) => Promise<Response>;

export type ClientHeaderValues = Record<string, string | undefined>;

export type ClientRequestInit = Omit<
  RequestInit,
  'body' | 'headers' | 'method'
>;

export type RpcRouteMap = Record<string, ProcedureRuntime>;

export type RpcRouteId<TRoutes extends RpcRouteMap> = Extract<
  keyof TRoutes,
  string
>;

export type RpcRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = TRoutes[TId];

export type RpcRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureInput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureOutput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ClientProcedureHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureHasHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureRequiresHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureResponseHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ProcedureHasResponseHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
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
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = RpcProcedureError<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> =
  | ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
  | Exclude<
      RpcFrameworkErrorCode,
      ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
    >;

export type RpcRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
  TCode extends RpcRouteErrorCode<TRoutes, TId> = RpcRouteErrorCode<
    TRoutes,
    TId
  >,
> =
  TCode extends ProcedureErrorCode<RpcRouteProcedure<TRoutes, TId>>
    ? ProcedureErrorDetails<RpcRouteProcedure<TRoutes, TId>, TCode>
    : JsonValue | undefined;

export type RpcRouteStreamEvent<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteStreamId<TRoutes>,
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

export type RpcRouteUnaryId<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteId<TRoutes>]: [RpcRouteStreamEvent<TRoutes, TId>] extends [
    never,
  ]
    ? TId
    : never;
}[RpcRouteId<TRoutes>];

export type RpcUnaryRouteId<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryId<TRoutes>;

export type RpcRouteStreamId<TRoutes extends RpcRouteMap> = Exclude<
  RpcRouteId<TRoutes>,
  RpcRouteUnaryId<TRoutes>
>;

export type RpcStreamRouteId<TRoutes extends RpcRouteMap> =
  RpcRouteStreamId<TRoutes>;

export type RpcRouteUnaryProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteProcedure<TRoutes, TId>;

export type RpcUnaryRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryProcedure<TRoutes, TId>;

export type RpcRouteStreamProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteProcedure<TRoutes, TId>;

export type RpcStreamRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamProcedure<TRoutes, TId>;

export type RpcRouteUnaryInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteInput<TRoutes, TId>;

export type RpcUnaryRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryInput<TRoutes, TId>;

export type RpcRouteStreamInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteInput<TRoutes, TId>;

export type RpcStreamRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamInput<TRoutes, TId>;

export type RpcRouteUnaryOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteOutput<TRoutes, TId>;

export type RpcUnaryRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryOutput<TRoutes, TId>;

export type RpcRouteStreamOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteOutput<TRoutes, TId>;

export type RpcStreamRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamOutput<TRoutes, TId>;

export type RpcRouteUnaryHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteHeaders<TRoutes, TId>;

export type RpcUnaryRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryHeaders<TRoutes, TId>;

export type RpcRouteStreamHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteHeaders<TRoutes, TId>;

export type RpcStreamRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamHeaders<TRoutes, TId>;

export type RpcRouteUnaryClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteClientHeaders<TRoutes, TId>;

export type RpcUnaryRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryClientHeaders<TRoutes, TId>;

export type RpcRouteStreamClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteClientHeaders<TRoutes, TId>;

export type RpcStreamRouteClientHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamClientHeaders<TRoutes, TId>;

export type RpcRouteUnaryHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteHasHeaders<TRoutes, TId>;

export type RpcUnaryRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryHasHeaders<TRoutes, TId>;

export type RpcRouteStreamHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteHasHeaders<TRoutes, TId>;

export type RpcStreamRouteHasHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamHasHeaders<TRoutes, TId>;

export type RpcRouteUnaryRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteRequiresHeaders<TRoutes, TId>;

export type RpcUnaryRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryRequiresHeaders<TRoutes, TId>;

export type RpcRouteStreamRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteRequiresHeaders<TRoutes, TId>;

export type RpcStreamRouteRequiresHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamRequiresHeaders<TRoutes, TId>;

export type RpcRouteUnaryResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryResponseHeaders<TRoutes, TId>;

export type RpcRouteStreamResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteResponseHeaders<TRoutes, TId>;

export type RpcStreamRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamResponseHeaders<TRoutes, TId>;

export type RpcRouteUnaryHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteHasResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryHasResponseHeaders<TRoutes, TId>;

export type RpcRouteStreamHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteHasResponseHeaders<TRoutes, TId>;

export type RpcStreamRouteHasResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamHasResponseHeaders<TRoutes, TId>;

export type RpcRouteUnaryRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteRequiresResponseHeaders<TRoutes, TId>;

export type RpcUnaryRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryRequiresResponseHeaders<TRoutes, TId>;

export type RpcRouteStreamRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteRequiresResponseHeaders<TRoutes, TId>;

export type RpcStreamRouteRequiresResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamRequiresResponseHeaders<TRoutes, TId>;

export type RpcRouteUnaryError<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteError<TRoutes, TId>;

export type RpcUnaryRouteError<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryError<TRoutes, TId>;

export type RpcRouteStreamError<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteError<TRoutes, TId>;

export type RpcStreamRouteError<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamError<TRoutes, TId>;

export type RpcRouteUnaryErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteErrorCode<TRoutes, TId>;

export type RpcUnaryRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryErrorCode<TRoutes, TId>;

export type RpcRouteStreamErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteErrorCode<TRoutes, TId>;

export type RpcStreamRouteErrorCode<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamErrorCode<TRoutes, TId>;

export type RpcRouteUnaryErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
  TCode extends RpcRouteUnaryErrorCode<TRoutes, TId> = RpcRouteUnaryErrorCode<
    TRoutes,
    TId
  >,
> = RpcRouteErrorDetails<TRoutes, TId, TCode>;

export type RpcUnaryRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
  TCode extends RpcRouteUnaryErrorCode<TRoutes, TId> = RpcRouteUnaryErrorCode<
    TRoutes,
    TId
  >,
> = RpcRouteUnaryErrorDetails<TRoutes, TId, TCode>;

export type RpcRouteStreamErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
  TCode extends RpcRouteStreamErrorCode<TRoutes, TId> = RpcRouteStreamErrorCode<
    TRoutes,
    TId
  >,
> = RpcRouteErrorDetails<TRoutes, TId, TCode>;

export type RpcStreamRouteErrorDetails<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
  TCode extends RpcRouteStreamErrorCode<TRoutes, TId> = RpcRouteStreamErrorCode<
    TRoutes,
    TId
  >,
> = RpcRouteStreamErrorDetails<TRoutes, TId, TCode>;

export type RpcStreamRouteEvent<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamEvent<TRoutes, TId>;

type RpcRouteEnvelopeFor<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes>,
> = RpcEnvelope<
  RpcRouteOutput<TRoutes, TId> & JsonValue,
  TId,
  RpcRouteResponseHeaders<TRoutes, TId>,
  RpcRouteError<TRoutes, TId>
>;

export type RpcRouteEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = {
  [TRouteId in RpcRouteUnaryId<TRoutes>]: RpcRouteEnvelopeFor<
    TRoutes,
    TRouteId
  >;
}[TId];

export type RpcRouteEnvelopeUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteUnaryId<TRoutes>]: RpcRouteEnvelope<TRoutes, TId>;
}[RpcRouteUnaryId<TRoutes>];

export type RpcRouteUnaryEnvelopeUnion<TRoutes extends RpcRouteMap> =
  RpcRouteEnvelopeUnion<TRoutes>;

export type RpcUnaryRouteEnvelopeUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryEnvelopeUnion<TRoutes>;

export type RpcRouteResult<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteEnvelope<TRoutes, TId>;

export type RpcRouteUnaryEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteEnvelope<TRoutes, TId>;

export type RpcUnaryRouteEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryEnvelope<TRoutes, TId>;

export type RpcRouteUnaryResult<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteResult<TRoutes, TId>;

export type RpcUnaryRouteResult<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryResult<TRoutes, TId>;

export type RpcRouteResultUnion<TRoutes extends RpcRouteMap> =
  RpcRouteEnvelopeUnion<TRoutes>;

export type RpcRouteUnaryResultUnion<TRoutes extends RpcRouteMap> =
  RpcRouteResultUnion<TRoutes>;

export type RpcUnaryRouteResultUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryResultUnion<TRoutes>;

declare const rpcRouteProtocolRequestKind: unique symbol;

type RpcRouteProtocolRequestKind<TProcedure> = [
  StreamEvent<TProcedure>,
] extends [never]
  ? { readonly [rpcRouteProtocolRequestKind]?: 'unary' }
  : { readonly [rpcRouteProtocolRequestKind]?: 'stream' };

type RpcRouteProtocolRequestFor<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = {
  id: TId;
  input: RpcRouteInput<TRoutes, TId> & JsonValue;
  traceId?: string;
} & RpcRouteProtocolRequestKind<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> =
  TId extends RpcRouteId<TRoutes>
    ? RpcRouteProtocolRequestFor<TRoutes, TId>
    : never;

export type RpcProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = RpcRouteProtocolRequest<TRoutes, TId>;

export type RpcRouteUnaryProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteProtocolRequest<TRoutes, TId>;

export type RpcUnaryProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryProtocolRequest<TRoutes, TId>;

export type RpcRouteStreamProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteProtocolRequest<TRoutes, TId>;

export type RpcStreamProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamProtocolRequest<TRoutes, TId>;

export type RpcUnaryRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryProtocolRequest<TRoutes, TId>;

export type RpcStreamRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamProtocolRequest<TRoutes, TId>;

export interface RpcProtocolRequestOptions {
  traceId?: string;
}

const createProtocolRequestObject = <TId extends string>(
  id: TId,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest<TId> =>
  ({
    id,
    input: input as JsonValue,
    ...(options?.traceId === undefined ? {} : { traceId: options.traceId }),
  }) as RpcRequest<TId>;

export function createRouteProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
>(
  id: TId,
  input: RpcRouteInput<TRoutes, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteProtocolRequest<TRoutes, TId>;
export function createRouteProtocolRequest(
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export function createRouteUnaryProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
>(
  id: TId,
  input: RpcRouteInput<TRoutes, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteUnaryProtocolRequest<TRoutes, TId>;
export function createRouteUnaryProtocolRequest(
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createUnaryRouteProtocolRequest: typeof createRouteUnaryProtocolRequest =
  createRouteUnaryProtocolRequest;

export function createRouteStreamProtocolRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
>(
  id: TId,
  input: RpcRouteInput<TRoutes, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteStreamProtocolRequest<TRoutes, TId>;
export function createRouteStreamProtocolRequest(
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createStreamRouteProtocolRequest: typeof createRouteStreamProtocolRequest =
  createRouteStreamProtocolRequest;

export function createManifestRouteProtocolRequest<
  const TManifest extends JoorManifest,
  TId extends RpcRouteId<JoorManifestRoutes<TManifest>> = RpcRouteId<
    JoorManifestRoutes<TManifest>
  >,
>(
  manifest: TManifest,
  id: TId,
  input: RpcRouteInput<JoorManifestRoutes<TManifest>, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;
export function createManifestRouteProtocolRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export function createManifestRouteUnaryProtocolRequest<
  const TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> = RpcRouteUnaryId<
    JoorManifestRoutes<TManifest>
  >,
>(
  manifest: TManifest,
  id: TId,
  input: RpcRouteInput<JoorManifestRoutes<TManifest>, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;
export function createManifestRouteUnaryProtocolRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createManifestUnaryRouteProtocolRequest: typeof createManifestRouteUnaryProtocolRequest =
  createManifestRouteUnaryProtocolRequest;

export function createManifestRouteStreamProtocolRequest<
  const TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
>(
  manifest: TManifest,
  id: TId,
  input: RpcRouteInput<JoorManifestRoutes<TManifest>, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteStreamProtocolRequest<JoorManifestRoutes<TManifest>, TId>;
export function createManifestRouteStreamProtocolRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createManifestStreamRouteProtocolRequest: typeof createManifestRouteStreamProtocolRequest =
  createManifestRouteStreamProtocolRequest;

export type RpcRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteId<TRoutes>]: RpcRouteProtocolRequest<TRoutes, TId>;
}[RpcRouteId<TRoutes>];

export type RpcProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteProtocolRequestUnion<TRoutes>;

export type RpcRouteUnaryProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteUnaryId<TRoutes>]: RpcRouteUnaryProtocolRequest<TRoutes, TId>;
}[RpcRouteUnaryId<TRoutes>];

export type RpcUnaryProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryProtocolRequestUnion<TRoutes>;

export type RpcUnaryRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryProtocolRequestUnion<TRoutes>;

export type RpcRouteStreamProtocolRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteStreamId<TRoutes>]: RpcRouteStreamProtocolRequest<
    TRoutes,
    TId
  >;
}[RpcRouteStreamId<TRoutes>];

export type RpcStreamProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteStreamProtocolRequestUnion<TRoutes>;

export type RpcStreamRouteProtocolRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteStreamProtocolRequestUnion<TRoutes>;

export type RpcRouteStreamRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamProtocolRequest<TRoutes, TId>;

export type RpcStreamRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamRequest<TRoutes, TId>;

export type RpcRouteStreamRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteStreamProtocolRequestUnion<TRoutes>;

export type RpcStreamRouteRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteStreamRequestUnion<TRoutes>;

export type RpcRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[] =
    readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[],
> = TRequests;

export type RpcRouteUnaryBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[] =
    readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[],
> = RpcRouteBatchRequest<TRoutes, TRequests>;

export type RpcUnaryRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[] =
    readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchRequest<TRoutes, TRequests>;

export type RpcRouteBody<TRoutes extends RpcRouteMap> =
  | RpcRouteProtocolRequestUnion<TRoutes>
  | RpcRouteBatchRequest<
      TRoutes,
      readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[]
    >;

export type RpcRouteUnaryBody<TRoutes extends RpcRouteMap> =
  | RpcRouteUnaryProtocolRequestUnion<TRoutes>
  | RpcRouteUnaryBatchRequest<
      TRoutes,
      readonly RpcRouteUnaryProtocolRequestUnion<TRoutes>[]
    >;

export type RpcUnaryRouteBody<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryBody<TRoutes>;

export type RpcRouteStreamBody<TRoutes extends RpcRouteMap> =
  RpcRouteStreamProtocolRequestUnion<TRoutes>;

export type RpcStreamRouteBody<TRoutes extends RpcRouteMap> =
  RpcRouteStreamBody<TRoutes>;

export type RpcRouteBodyResult<TRoutes extends RpcRouteMap> =
  | RpcRouteEnvelopeUnion<TRoutes>
  | readonly RpcRouteEnvelopeUnion<TRoutes>[]
  | Response;

export type RpcRouteUnaryBodyResult<TRoutes extends RpcRouteMap> =
  RpcRouteBodyResult<TRoutes>;

export type RpcUnaryRouteBodyResult<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryBodyResult<TRoutes>;

export type RpcRouteStreamBodyResult<
  _TRoutes extends RpcRouteMap = RpcRouteMap,
> = Response;

export type RpcStreamRouteBodyResult<
  TRoutes extends RpcRouteMap = RpcRouteMap,
> = RpcRouteStreamBodyResult<TRoutes>;

type RpcRouteProtocolBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody,
> = TBody extends { id: infer TId extends RpcRouteId<TRoutes> }
  ? TId extends RpcRouteStreamId<TRoutes>
    ? TBody extends RpcRouteStreamProtocolRequest<TRoutes, TId>
      ? Response
      : never
    : TId extends RpcRouteUnaryId<TRoutes>
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

export type RpcRouteUnaryBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody extends RpcRouteUnaryBody<TRoutes>,
> = RpcRouteBodyResultFor<TRoutes, TBody>;

export type RpcUnaryRouteBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody extends RpcRouteUnaryBody<TRoutes>,
> = RpcRouteUnaryBodyResultFor<TRoutes, TBody>;

export type RpcRouteStreamBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody extends RpcRouteStreamBody<TRoutes>,
> = RpcRouteBodyResultFor<TRoutes, TBody>;

export type RpcStreamRouteBodyResultFor<
  TRoutes extends RpcRouteMap,
  TBody extends RpcRouteStreamBody<TRoutes>,
> = RpcRouteStreamBodyResultFor<TRoutes, TBody>;

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

type RpcRouteRequestFor<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes>,
> = PendingRpcRequest<RpcRouteProcedure<TRoutes, TId>, TId> &
  PendingRpcRequestHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = {
  [TRouteId in RpcRouteUnaryId<TRoutes>]: RpcRouteRequestFor<TRoutes, TRouteId>;
}[TId];

export type RpcRouteUnaryRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteRequest<TRoutes, TId>;

export type RpcUnaryRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryRequest<TRoutes, TId>;

export type RpcRouteRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteUnaryId<TRoutes>]: RpcRouteRequest<TRoutes, TId>;
}[RpcRouteUnaryId<TRoutes>];

export type RpcRouteUnaryRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteRequestUnion<TRoutes>;

export type RpcUnaryRouteRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryRequestUnion<TRoutes>;

type RpcRouteBatchResultRequest<TRoutes extends RpcRouteMap> =
  | RpcRouteRequestUnion<TRoutes>
  | RpcRouteUnaryProtocolRequestUnion<TRoutes>;

type RpcRouteBatchResultFor<
  TRoutes extends RpcRouteMap,
  TRequest,
> = TRequest extends {
  id: infer TId extends RpcRouteUnaryId<TRoutes>;
}
  ? TRequest extends
      | RpcRouteRequest<TRoutes, TId>
      | RpcRouteUnaryProtocolRequest<TRoutes, TId>
    ? RpcRouteEnvelope<TRoutes, TId>
    : never
  : never;

type RpcRouteBatchResultsFor<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = {
  [TIndex in keyof TRequests]: RpcRouteBatchResultFor<
    TRoutes,
    TRequests[TIndex]
  >;
};

export type RpcRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchResultRequest<TRoutes>[] =
    readonly RpcRouteBatchResultRequest<TRoutes>[],
> = RpcRouteBatchResultsFor<TRoutes, TRequests>;

export type RpcRouteUnaryBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchResultRequest<TRoutes>[] =
    readonly RpcRouteBatchResultRequest<TRoutes>[],
> = RpcRouteBatchResults<TRoutes, TRequests>;

export type RpcUnaryRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchResultRequest<TRoutes>[] =
    readonly RpcRouteBatchResultRequest<TRoutes>[],
> = RpcRouteUnaryBatchResults<TRoutes, TRequests>;

export type ClientRequestOptions<TProcedure> = [TProcedure] extends [never]
  ? { headers?: ClientHeaderValues; request?: ClientRequestInit }
  : ProcedureRequiresHeaders<TProcedure> extends false
    ? {
        headers?: ClientProcedureHeaders<TProcedure>;
        request?: ClientRequestInit;
      }
    : {
        headers: ClientProcedureHeaders<TProcedure>;
        request?: ClientRequestInit;
      };

export interface ClientBatchOptions {
  headers?: ClientHeaderValues;
  request?: ClientRequestInit;
}

export type RpcRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> = ClientRequestOptions<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteUnaryRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteRequestOptions<TRoutes, TId>;

export type RpcUnaryRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryRequestOptions<TRoutes, TId>;

export type RpcRouteStreamRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteRequestOptions<TRoutes, TId>;

export type RpcStreamRouteRequestOptions<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamRequestOptions<TRoutes, TId>;

type RpcRouteClientArgsFor<
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

export type RpcRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes> = RpcRouteId<TRoutes>,
> =
  TId extends RpcRouteId<TRoutes> ? RpcRouteClientArgsFor<TRoutes, TId> : never;

export type RpcRouteUnaryClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteClientArgs<TRoutes, TId>;

export type RpcUnaryRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
> = RpcRouteUnaryClientArgs<TRoutes, TId>;

export type RpcRouteStreamClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteClientArgs<TRoutes, TId>;

export type RpcStreamRouteClientArgs<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
> = RpcRouteStreamClientArgs<TRoutes, TId>;

const createPendingRpcRequest = <TProcedure, TId extends string>(
  id: TId,
  input: ProcedureInput<TProcedure>,
  ...requestOptions: ProcedureRequiresHeaders<TProcedure> extends false
    ? [ClientRequestOptions<TProcedure>?]
    : [ClientRequestOptions<TProcedure>]
): PendingRpcRequest<TProcedure, TId> & PendingRpcRequestHeaders<TProcedure> =>
  ({
    id,
    input,
    ...(requestOptions[0]?.headers === undefined
      ? {}
      : { headers: requestOptions[0].headers }),
  }) as PendingRpcRequest<TProcedure, TId> &
    PendingRpcRequestHeaders<TProcedure>;

export function createRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteUnaryId<TRoutes> = RpcRouteUnaryId<TRoutes>,
>(
  id: TId,
  input: RpcRouteInput<TRoutes, TId>,
  ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
): RpcRouteRequest<TRoutes, TId>;
export function createRouteRequest(
  id: string,
  input: unknown,
  ...options: [{ headers?: object }?]
): PendingRpcRequest {
  return {
    id,
    input: input as JsonValue,
    ...(options[0]?.headers === undefined
      ? {}
      : { headers: options[0].headers }),
  } as PendingRpcRequest;
}

export const createRouteUnaryRequest: typeof createRouteRequest =
  createRouteRequest;

export const createUnaryRouteRequest: typeof createRouteUnaryRequest =
  createRouteUnaryRequest;

export function createManifestRouteRequest<
  const TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> = RpcRouteUnaryId<
    JoorManifestRoutes<TManifest>
  >,
>(
  manifest: TManifest,
  id: TId,
  input: RpcRouteInput<JoorManifestRoutes<TManifest>, TId>,
  ...options: ClientRequestOptionsTuple<
    RpcRouteProcedure<JoorManifestRoutes<TManifest>, TId>
  >
): RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;
export function createManifestRouteRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  ...options: [{ headers?: object }?]
): PendingRpcRequest {
  return {
    id,
    input: input as JsonValue,
    ...(options[0]?.headers === undefined
      ? {}
      : { headers: options[0].headers }),
  } as PendingRpcRequest;
}

export const createManifestRouteUnaryRequest: typeof createManifestRouteRequest =
  createManifestRouteRequest;

export const createManifestUnaryRouteRequest: typeof createManifestRouteUnaryRequest =
  createManifestRouteUnaryRequest;

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

export type ClientProtocolBatchRequest = RpcRequest & { headers?: never };

export type ClientBatchRequest = PendingRpcRequest | ClientProtocolBatchRequest;

export type LegacyBatchRequest = ClientBatchRequest;

export type BatchResults<
  TRequests extends readonly LegacyBatchRequest[] =
    readonly LegacyBatchRequest[],
> = {
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
  batch<const TRequests extends readonly LegacyBatchRequest[]>(
    requests: TRequests,
    options?: ClientBatchOptions
  ): Promise<BatchResults<TRequests>>;
  stream<TProcedure>(
    id: string,
    input: ProcedureInput<RpcStreamProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcStreamProcedure<TProcedure>>
  ): AsyncIterable<StreamEvent<RpcStreamProcedure<TProcedure>> & JsonValue>;
}

export interface RpcRouteUnaryTransportClient<TRoutes extends RpcRouteMap> {
  call<TId extends RpcRouteUnaryId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): Promise<RpcRouteEnvelope<TRoutes, TId>>;
  request<TId extends RpcRouteUnaryId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): RpcRouteRequest<TRoutes, TId>;
  batch<
    const TRequests extends readonly [...RpcRouteBatchResultRequest<TRoutes>[]],
  >(
    requests: TRequests,
    options?: ClientBatchOptions
  ): Promise<RpcRouteBatchResults<TRoutes, TRequests>>;
}

export interface RpcRouteStreamTransportClient<TRoutes extends RpcRouteMap> {
  stream<TId extends RpcRouteStreamId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): AsyncIterable<RpcRouteStreamEvent<TRoutes, TId> & JsonValue>;
}

export type RpcUnaryRouteTransportClient<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryTransportClient<TRoutes>;

export type RpcStreamRouteTransportClient<TRoutes extends RpcRouteMap> =
  RpcRouteStreamTransportClient<TRoutes>;

export interface RouteRpcTransportClient<TRoutes extends RpcRouteMap>
  extends
    RpcRouteUnaryTransportClient<TRoutes>,
    RpcRouteStreamTransportClient<TRoutes> {}

export type RpcTransportClient<TRoutes extends RpcRouteMap = never> = [
  TRoutes,
] extends [never]
  ? LegacyRpcTransportClient
  : RouteRpcTransportClient<TRoutes>;

export type RpcManifestTransportClient<TManifest extends JoorManifest> =
  RpcTransportClient<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcRouteUnaryTransportClient<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryTransportClient<
  TManifest extends JoorManifest,
> = RpcRouteUnaryTransportClient<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcRouteStreamTransportClient<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteStreamTransportClient<
  TManifest extends JoorManifest,
> = RpcRouteStreamTransportClient<JoorManifestRoutes<TManifest>>;

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

const createRpcRequest = (
  url: string,
  body: JsonValue,
  headers: Headers,
  baseRequest?: ClientRequestInit,
  request?: ClientRequestInit
): Request =>
  new Request(url, {
    ...baseRequest,
    ...request,
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

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
      createRpcRequest(
        options.url,
        { id, input } as JsonValue,
        createHeaders(options.headers, callOptions?.headers),
        options.request,
        callOptions?.request
      )
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
    createPendingRpcRequest(id, input, ...requestOptions);
  const batch = async <const TRequests extends readonly LegacyBatchRequest[]>(
    requests: TRequests,
    batchOptions?: ClientBatchOptions
  ): Promise<BatchResults<TRequests>> => {
    const body: RpcRequest[] = requests.map((pending) => ({
      id: pending.id,
      input: pending.input as JsonValue,
      ...('traceId' in pending && pending.traceId === undefined
        ? {}
        : 'traceId' in pending
          ? { traceId: pending.traceId }
          : {}),
    }));
    const requestHeaders = createHeaders(
      options.headers,
      batchOptions?.headers
    );
    for (const pending of requests) {
      appendStringHeaders(
        requestHeaders,
        'headers' in pending ? pending.headers : undefined
      );
    }
    requestHeaders.set('content-type', 'application/json');
    const response = await fetcher(
      createRpcRequest(
        options.url,
        body as unknown as JsonValue,
        requestHeaders,
        options.request,
        batchOptions?.request
      )
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
        createRpcRequest(
          options.url,
          { id, input } as JsonValue,
          headers,
          options.request,
          requestOptions[0]?.request
        )
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
