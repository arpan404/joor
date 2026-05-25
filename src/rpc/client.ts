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
import type { RpcManifestRequiredRuntimeRequest } from './dispatcher.js';

type IsExactRequest<TRequest extends Request> = [Request] extends [TRequest]
  ? [TRequest] extends [Request]
    ? true
    : false
  : false;

type ClientRequestFactoryOption<TRequest extends Request> =
  IsExactRequest<TRequest> extends true
    ? { readonly createRequest?: ClientRequestFactory<TRequest> }
    : { readonly createRequest: ClientRequestFactory<TRequest> };

export type ClientOptions<
  TManifest extends JoorManifest | undefined = undefined,
  TRequest extends Request = TManifest extends JoorManifest
    ? RpcManifestRequiredRuntimeRequest<TManifest>
    : Request,
> = {
  readonly url: string;
  readonly fetch?: ClientFetch<TRequest>;
  readonly headers?: ClientHeaderValues;
  readonly request?: ClientRequestInit;
  readonly manifest?: TManifest;
  readonly maxStreamEventBytes?: number;
} & ClientRequestFactoryOption<TRequest>;

export type ClientFetch<TRequest extends Request = Request> = (
  request: TRequest
) => Response | Promise<Response>;

export interface ClientRequestFactoryArgs {
  readonly url: string;
  readonly body: JsonValue;
  readonly headers: Headers;
  readonly baseRequest?: ClientRequestInit | undefined;
  readonly request?: ClientRequestInit | undefined;
}

export type ClientRequestFactory<TRequest extends Request = Request> = (
  args: ClientRequestFactoryArgs
) => TRequest;

export type ClientHeaderValues = Readonly<Record<string, string | undefined>>;

export type ClientRequestInit = Omit<
  RequestInit,
  'body' | 'headers' | 'method'
>;

export type RpcRouteMap = Readonly<Record<string, ProcedureRuntime>>;

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

export type RpcManifestRoutes<TManifest extends JoorManifest> =
  JoorManifestRoutes<TManifest>;

export type RpcManifestRouteId<TManifest extends JoorManifest> = RpcRouteId<
  JoorManifestRoutes<TManifest>
>;

export type RpcManifestRouteUnaryId<TManifest extends JoorManifest> =
  RpcRouteUnaryId<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteId<TManifest extends JoorManifest> =
  RpcManifestRouteUnaryId<TManifest>;

export type RpcManifestRouteStreamId<TManifest extends JoorManifest> =
  RpcRouteStreamId<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamRouteId<TManifest extends JoorManifest> =
  RpcManifestRouteStreamId<TManifest>;

export type RpcManifestRouteProcedure<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteProcedure<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryProcedure<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryProcedure<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteProcedure<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryProcedure<TManifest, TId>;

export type RpcManifestRouteStreamProcedure<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamProcedure<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteProcedure<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamProcedure<TManifest, TId>;

export type RpcManifestRouteInput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteInput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryInput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryInput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteInput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryInput<TManifest, TId>;

export type RpcManifestRouteStreamInput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamInput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteInput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamInput<TManifest, TId>;

export type RpcManifestRouteOutput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteOutput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryOutput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryOutput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteOutput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryOutput<TManifest, TId>;

export type RpcManifestRouteStreamOutput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamOutput<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteOutput<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamOutput<TManifest, TId>;

export type RpcManifestRouteHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHeaders<TManifest, TId>;

export type RpcManifestRouteClientHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryClientHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteClientHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientHeaders<TManifest, TId>;

export type RpcManifestRouteStreamClientHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteClientHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientHeaders<TManifest, TId>;

export type RpcManifestRouteHasHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryHasHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteHasHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteHasHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasHeaders<TManifest, TId>;

export type RpcManifestRouteRequiresHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryRequiresHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteRequiresHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteRequiresHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresHeaders<TManifest, TId>;

export type RpcManifestRouteResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamResponseHeaders<TManifest, TId>;

export type RpcManifestRouteHasResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryHasResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteHasResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamHasResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamHasResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteHasResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamHasResponseHeaders<TManifest, TId>;

export type RpcManifestRouteRequiresResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryRequiresResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteRequiresResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteStreamRequiresResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequiresResponseHeaders<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteRequiresResponseHeaders<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequiresResponseHeaders<TManifest, TId>;

export type RpcManifestRouteError<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteError<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryError<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryError<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteError<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryError<TManifest, TId>;

export type RpcManifestRouteStreamError<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamError<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteError<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamError<TManifest, TId>;

export type RpcManifestRouteErrorCode<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryErrorCode<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteErrorCode<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryErrorCode<TManifest, TId>;

export type RpcManifestRouteStreamErrorCode<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamErrorCode<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteErrorCode<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamErrorCode<TManifest, TId>;

export type RpcManifestRouteErrorDetails<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
  TCode extends RpcManifestRouteErrorCode<
    TManifest,
    TId
  > = RpcManifestRouteErrorCode<TManifest, TId>,
> = RpcRouteErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type RpcManifestRouteUnaryErrorDetails<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<
    TManifest,
    TId
  > = RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcRouteUnaryErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type RpcManifestUnaryRouteErrorDetails<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
  TCode extends RpcManifestRouteUnaryErrorCode<
    TManifest,
    TId
  > = RpcManifestRouteUnaryErrorCode<TManifest, TId>,
> = RpcManifestRouteUnaryErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteStreamErrorDetails<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<
    TManifest,
    TId
  > = RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcRouteStreamErrorDetails<JoorManifestRoutes<TManifest>, TId, TCode>;

export type RpcManifestStreamRouteErrorDetails<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
  TCode extends RpcManifestRouteStreamErrorCode<
    TManifest,
    TId
  > = RpcManifestRouteStreamErrorCode<TManifest, TId>,
> = RpcManifestRouteStreamErrorDetails<TManifest, TId, TCode>;

export type RpcManifestRouteStreamEvent<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamEvent<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteEvent<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamEvent<TManifest, TId>;

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

export type RpcManifestRouteEnvelope<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryEnvelope<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryEnvelope<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteEnvelope<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryEnvelope<TManifest, TId>;

export type RpcManifestRouteEnvelopeUnion<TManifest extends JoorManifest> =
  RpcRouteEnvelopeUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryEnvelopeUnion<
  TManifest extends JoorManifest,
> = RpcRouteUnaryEnvelopeUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteEnvelopeUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryEnvelopeUnion<TManifest>;

export type RpcManifestRouteResult<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteResult<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryResult<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryResult<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteResult<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryResult<TManifest, TId>;

export type RpcManifestRouteResultUnion<TManifest extends JoorManifest> =
  RpcRouteResultUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryResultUnion<
  TManifest extends JoorManifest,
> = RpcRouteUnaryResultUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteResultUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryResultUnion<TManifest>;

type RpcRouteProtocolRequestFor<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = {
  readonly id: TId;
  readonly input: RpcRouteInput<TRoutes, TId> & JsonValue;
  readonly traceId?: string;
};

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
  readonly traceId?: string;
}

const createProtocolRequestObject = <TId extends string>(
  id: TId,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest<TId> =>
  Object.freeze({
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
): RpcManifestRouteProtocolRequest<TManifest, TId>;
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
): RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;
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
): RpcManifestRouteStreamProtocolRequest<TManifest, TId>;
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

export function createRouteStreamRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteStreamId<TRoutes> = RpcRouteStreamId<TRoutes>,
>(
  id: TId,
  input: RpcRouteInput<TRoutes, TId>,
  options?: RpcProtocolRequestOptions
): RpcRouteStreamRequest<TRoutes, TId>;
export function createRouteStreamRequest(
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createStreamRouteRequest: typeof createRouteStreamRequest =
  createRouteStreamRequest;

export function createManifestRouteStreamRequest<
  const TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
>(
  manifest: TManifest,
  id: TId,
  input: RpcRouteInput<JoorManifestRoutes<TManifest>, TId>,
  options?: RpcProtocolRequestOptions
): RpcManifestRouteStreamRequest<TManifest, TId>;
export function createManifestRouteStreamRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  options?: RpcProtocolRequestOptions
): RpcRequest {
  return createProtocolRequestObject(id, input, options);
}

export const createManifestStreamRouteRequest: typeof createManifestRouteStreamRequest =
  createManifestRouteStreamRequest;

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

export type RpcManifestRouteProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteId<JoorManifestRoutes<TManifest>> = RpcRouteId<
    JoorManifestRoutes<TManifest>
  >,
> = RpcRouteProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteId<JoorManifestRoutes<TManifest>> = RpcRouteId<
    JoorManifestRoutes<TManifest>
  >,
> = RpcManifestRouteProtocolRequest<TManifest, TId>;

export type RpcManifestRouteUnaryProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcRouteUnaryProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type RpcManifestUnaryRouteProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteUnaryProtocolRequest<TManifest, TId>;

export type RpcManifestRouteStreamProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
> = RpcRouteStreamProtocolRequest<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestStreamRouteProtocolRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteStreamProtocolRequest<TManifest, TId>;

export type RpcManifestRouteProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestProtocolRequestUnion<TManifest extends JoorManifest> =
  RpcManifestRouteProtocolRequestUnion<TManifest>;

export type RpcManifestRouteUnaryProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteUnaryProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestUnaryRouteProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryProtocolRequestUnion<TManifest>;

export type RpcManifestRouteStreamProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteStreamProtocolRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

export type RpcManifestStreamRouteProtocolRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamProtocolRequestUnion<TManifest>;

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

export type RpcManifestRouteStreamRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
> = RpcRouteStreamRequest<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteStreamId<JoorManifestRoutes<TManifest>> =
    RpcRouteStreamId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteStreamRequest<TManifest, TId>;

export type RpcManifestRouteStreamRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteStreamRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamRouteRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamRequestUnion<TManifest>;

export type RpcRouteBatchRequestUnion<TRoutes extends RpcRouteMap> =
  | RpcRouteRequestUnion<TRoutes>
  | RpcRouteUnaryProtocolRequestUnion<TRoutes>;

export type RpcRouteUnaryBatchRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteBatchRequestUnion<TRoutes>;

export type RpcUnaryRouteBatchRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryBatchRequestUnion<TRoutes>;

export type RpcRouteProtocolBatchRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteUnaryProtocolRequestUnion<TRoutes>;

export type RpcRouteUnaryProtocolBatchRequestUnion<
  TRoutes extends RpcRouteMap,
> = RpcRouteProtocolBatchRequestUnion<TRoutes>;

export type RpcUnaryRouteProtocolBatchRequestUnion<
  TRoutes extends RpcRouteMap,
> = RpcRouteUnaryProtocolBatchRequestUnion<TRoutes>;

export type RpcProtocolBatchRequestUnion<TRoutes extends RpcRouteMap> =
  RpcRouteProtocolBatchRequestUnion<TRoutes>;

export type RpcManifestRouteProtocolBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteProtocolBatchRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryProtocolBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteUnaryProtocolBatchRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteProtocolBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>;

export type RpcManifestProtocolBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteProtocolBatchRequestUnion<TManifest>;

export type RpcManifestRouteBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcRouteUnaryBatchRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteBatchRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryBatchRequestUnion<TManifest>;

export type RpcRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteBatchRequestUnion<TRoutes>[],
> = Readonly<TRequests>;

export type RpcRouteUnaryBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchRequest<TRoutes, TRequests>;

export type RpcUnaryRouteBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[] =
    readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchRequest<TRoutes, TRequests>;

export type RpcManifestRouteBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends readonly RpcManifestRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = RpcRouteBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcRouteUnaryBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestUnaryRouteBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[] =
      readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchRequest<TManifest, TRequests>;

type RpcRouteProtocolBatchRequestHasHeaders<TRequest> =
  'headers' extends keyof TRequest
    ? [Exclude<TRequest['headers'], undefined>] extends [never]
      ? false
      : true
    : false;

type RpcRouteProtocolBatchRequestRejectsHeaders<
  TRequests extends readonly unknown[],
> = true extends {
  [TIndex in keyof TRequests]: RpcRouteProtocolBatchRequestHasHeaders<
    TRequests[TIndex]
  >;
}[number]
  ? never
  : Readonly<TRequests>;

export type RpcRouteProtocolBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteProtocolBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteProtocolBatchRequestRejectsHeaders<TRequests>;

export type RpcRouteUnaryProtocolBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends
    readonly RpcRouteUnaryProtocolBatchRequestUnion<TRoutes>[] =
      readonly RpcRouteUnaryProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteProtocolBatchRequest<TRoutes, TRequests>;

export type RpcUnaryRouteProtocolBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends
    readonly RpcUnaryRouteProtocolBatchRequestUnion<TRoutes>[] =
      readonly RpcUnaryRouteProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryProtocolBatchRequest<TRoutes, TRequests>;

export type RpcProtocolBatchRequest<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcProtocolBatchRequestUnion<TRoutes>[] =
    readonly RpcProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteProtocolBatchRequest<TRoutes, TRequests>;

export type RpcManifestRouteProtocolBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcRouteProtocolBatchRequest<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcRouteUnaryProtocolBatchRequest<
  JoorManifestRoutes<TManifest>,
  TRequests
>;

export type RpcManifestUnaryRouteProtocolBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchRequest<TManifest, TRequests>;

export type RpcManifestProtocolBatchRequest<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchRequest<TManifest, TRequests>;

export type RpcRouteBody<TRoutes extends RpcRouteMap> =
  | RpcRouteProtocolRequestUnion<TRoutes>
  | RpcRouteProtocolBatchRequest<TRoutes>;

export type RpcRouteUnaryBody<TRoutes extends RpcRouteMap> =
  | RpcRouteUnaryProtocolRequestUnion<TRoutes>
  | RpcRouteUnaryProtocolBatchRequest<TRoutes>;

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

export type RpcManifestRouteBody<TManifest extends JoorManifest> =
  RpcRouteBody<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryBody<TManifest extends JoorManifest> =
  RpcRouteUnaryBody<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteBody<TManifest extends JoorManifest> =
  RpcManifestRouteUnaryBody<TManifest>;

export type RpcManifestRouteStreamBody<TManifest extends JoorManifest> =
  RpcRouteStreamBody<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamRouteBody<TManifest extends JoorManifest> =
  RpcManifestRouteStreamBody<TManifest>;

export type RpcManifestRouteBodyResult<TManifest extends JoorManifest> =
  RpcRouteBodyResult<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryBodyResult<
  TManifest extends JoorManifest,
> = RpcRouteUnaryBodyResult<JoorManifestRoutes<TManifest>>;

export type RpcManifestUnaryRouteBodyResult<TManifest extends JoorManifest> =
  RpcManifestRouteUnaryBodyResult<TManifest>;

export type RpcManifestRouteStreamBodyResult<
  TManifest extends JoorManifest = JoorManifest,
> = RpcRouteStreamBodyResult<JoorManifestRoutes<TManifest>>;

export type RpcManifestStreamRouteBodyResult<
  TManifest extends JoorManifest = JoorManifest,
> = RpcManifestRouteStreamBodyResult<TManifest>;

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
  ? TBody extends readonly RpcRouteProtocolBatchRequestUnion<TRoutes>[]
    ? RpcRouteProtocolBatchRequest<TRoutes, TBody> extends never
      ? never
      : RpcRouteProtocolBatchResults<TRoutes, TBody> | Response
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

export type RpcManifestRouteBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteBody<TManifest>,
> = RpcRouteBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type RpcManifestRouteUnaryBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest>,
> = RpcRouteUnaryBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type RpcManifestUnaryRouteBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>;

export type RpcManifestRouteStreamBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest>,
> = RpcRouteStreamBodyResultFor<JoorManifestRoutes<TManifest>, TBody>;

export type RpcManifestStreamRouteBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamBodyResultFor<TManifest, TBody>;

type PendingRpcRequestInput<TProcedure> = [TProcedure] extends [never]
  ? JsonValue
  : ProcedureInput<TProcedure>;

type OptionalClientHeaderKeys<THeaders extends object> = keyof {
  [TKey in keyof THeaders as undefined extends THeaders[TKey]
    ? TKey
    : never]: true;
};

type RequiredClientHeaderFields<THeaders extends object> = {
  readonly [TKey in keyof THeaders as TKey extends OptionalClientHeaderKeys<
    THeaders
  >
    ? never
    : TKey]: THeaders[TKey];
};

type OptionalClientHeaderFields<THeaders extends object> = {
  readonly [TKey in OptionalClientHeaderKeys<THeaders>]?:
    | THeaders[TKey]
    | undefined;
};

export type ClientProcedureHeaders<TProcedure> =
  ProcedureHeaders<TProcedure> extends infer THeaders
    ? THeaders extends object
      ? RequiredClientHeaderFields<THeaders> &
          OptionalClientHeaderFields<THeaders>
      : never
    : never;

type PendingRpcRequestHeaders<TProcedure> = [TProcedure] extends [never]
  ? { readonly headers?: ClientHeaderValues }
  : ProcedureRequiresHeaders<TProcedure> extends false
    ? { readonly headers?: ClientProcedureHeaders<TProcedure> }
    : { readonly headers: ClientProcedureHeaders<TProcedure> };

interface ClientTraceOptions {
  readonly traceId?: string;
}

type ClientRequestOptionsTuple<TProcedure> =
  ProcedureRequiresHeaders<TProcedure> extends false
    ? [ClientRequestOptions<TProcedure>?]
    : [ClientRequestOptions<TProcedure>];

export type PendingRpcRequest<
  TProcedure = never,
  TId extends string = string,
> = {
  readonly id: TId;
  readonly input: PendingRpcRequestInput<TProcedure>;
  readonly traceId?: string;
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

export type RpcManifestRouteRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcRouteRequest<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteRequest<TManifest, TId>;

export type RpcManifestUnaryRouteRequest<
  TManifest extends JoorManifest,
  TId extends RpcRouteUnaryId<JoorManifestRoutes<TManifest>> =
    RpcRouteUnaryId<JoorManifestRoutes<TManifest>>,
> = RpcManifestRouteUnaryRequest<TManifest, TId>;

export type RpcManifestRouteRequestUnion<TManifest extends JoorManifest> =
  RpcRouteRequestUnion<JoorManifestRoutes<TManifest>>;

export type RpcManifestRouteUnaryRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteRequestUnion<TManifest>;

export type RpcManifestUnaryRouteRequestUnion<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryRequestUnion<TManifest>;

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
  readonly [TIndex in keyof TRequests]: RpcRouteBatchResultFor<
    TRoutes,
    TRequests[TIndex]
  >;
};

export type RpcRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchResultsFor<TRoutes, TRequests>;

export type RpcRouteUnaryBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchResults<TRoutes, TRequests>;

export type RpcUnaryRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[] =
    readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchResults<TRoutes, TRequests>;

export type RpcRouteProtocolBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcRouteProtocolBatchRequestUnion<TRoutes>[] =
    readonly RpcRouteProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchResults<TRoutes, TRequests>;

export type RpcRouteUnaryProtocolBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends
    readonly RpcRouteUnaryProtocolBatchRequestUnion<TRoutes>[] =
      readonly RpcRouteUnaryProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchResults<TRoutes, TRequests>;

export type RpcUnaryRouteProtocolBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends
    readonly RpcUnaryRouteProtocolBatchRequestUnion<TRoutes>[] =
      readonly RpcUnaryRouteProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryProtocolBatchResults<TRoutes, TRequests>;

export type RpcProtocolBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly RpcProtocolBatchRequestUnion<TRoutes>[] =
    readonly RpcProtocolBatchRequestUnion<TRoutes>[],
> = RpcRouteProtocolBatchResults<TRoutes, TRequests>;

export type RpcManifestRouteBatchResults<
  TManifest extends JoorManifest,
  TRequests extends readonly RpcManifestRouteBatchRequestUnion<TManifest>[] =
    readonly RpcManifestRouteBatchRequestUnion<TManifest>[],
> = RpcRouteBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteUnaryBatchRequestUnion<TManifest>[],
> = RpcRouteUnaryBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestUnaryRouteBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[] =
      readonly RpcManifestUnaryRouteBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryBatchResults<TManifest, TRequests>;

export type RpcManifestRouteProtocolBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcRouteProtocolBatchResults<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryProtocolBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestRouteUnaryProtocolBatchRequestUnion<TManifest>[],
> = RpcRouteUnaryProtocolBatchResults<
  JoorManifestRoutes<TManifest>,
  TRequests
>;

export type RpcManifestUnaryRouteProtocolBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestUnaryRouteProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteUnaryProtocolBatchResults<TManifest, TRequests>;

export type RpcManifestProtocolBatchResults<
  TManifest extends JoorManifest,
  TRequests extends
    readonly RpcManifestProtocolBatchRequestUnion<TManifest>[] =
      readonly RpcManifestProtocolBatchRequestUnion<TManifest>[],
> = RpcManifestRouteProtocolBatchResults<TManifest, TRequests>;

export type ClientRequestOptions<TProcedure> = ClientTraceOptions &
  ([TProcedure] extends [never]
    ? {
        readonly headers?: ClientHeaderValues;
        readonly request?: ClientRequestInit;
      }
    : ProcedureRequiresHeaders<TProcedure> extends false
      ? {
          readonly headers?: ClientProcedureHeaders<TProcedure>;
          readonly request?: ClientRequestInit;
        }
      : {
          readonly headers: ClientProcedureHeaders<TProcedure>;
          readonly request?: ClientRequestInit;
        });

export interface ClientBatchOptions {
  readonly headers?: ClientHeaderValues;
  readonly request?: ClientRequestInit;
}

type RpcRouteBatchRequestId<
  TRoutes extends RpcRouteMap,
  TRequest,
> = TRequest extends { readonly id: infer TId extends RpcRouteUnaryId<TRoutes> }
  ? TId
  : never;

type RpcRouteBatchRequestIds<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = RpcRouteBatchRequestId<TRoutes, TRequests[number]>;

type UnionToIntersection<TUnion> =
  (TUnion extends unknown ? (value: TUnion) => void : never) extends (
    value: infer TIntersection
  ) => void
    ? TIntersection
    : never;

type RpcRouteBatchClientHeaderIds<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = {
  [TId in RpcRouteBatchRequestIds<
    TRoutes,
    TRequests
  >]: RpcRouteHasHeaders<TRoutes, TId> extends true ? TId : never;
}[RpcRouteBatchRequestIds<TRoutes, TRequests>];

type RpcRouteBatchClientHeadersForIds<
  TRoutes extends RpcRouteMap,
  TIds extends RpcRouteUnaryId<TRoutes>,
> = [TIds] extends [never]
  ? never
  : UnionToIntersection<
      TIds extends RpcRouteUnaryId<TRoutes>
        ? RpcRouteClientHeaders<TRoutes, TIds>
        : never
    >;

export type RpcRouteBatchClientHeaders<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchClientHeadersForIds<
  TRoutes,
  RpcRouteBatchClientHeaderIds<TRoutes, TRequests>
>;

export type RpcRouteUnaryBatchClientHeaders<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchClientHeaders<TRoutes, TRequests>;

export type RpcUnaryRouteBatchClientHeaders<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchClientHeaders<TRoutes, TRequests>;

type RpcRouteBatchRequestCarriesHeaders<TRequest> =
  'headers' extends keyof TRequest
    ? [Exclude<TRequest['headers'], undefined>] extends [never]
      ? false
      : true
    : false;

type RpcRouteBatchRequestMissingHeaderId<
  TRoutes extends RpcRouteMap,
  TRequest,
> = TRequest extends {
  readonly id: infer TId extends RpcRouteUnaryId<TRoutes>;
}
  ? RpcRouteRequiresHeaders<TRoutes, TId> extends true
    ? RpcRouteBatchRequestCarriesHeaders<TRequest> extends true
      ? never
      : TId
    : never
  : never;

type RpcRouteBatchMissingHeaderIds<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = RpcRouteBatchRequestMissingHeaderId<TRoutes, TRequests[number]>;

type RpcRouteBatchMissingClientHeaders<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = RpcRouteBatchClientHeadersForIds<
  TRoutes,
  RpcRouteBatchMissingHeaderIds<TRoutes, TRequests>
>;

type RpcRouteBatchBaseOptions = {
  readonly request?: ClientRequestInit;
};

export type RpcRouteBatchOptions<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<TRoutes>[],
> = [RpcRouteBatchMissingHeaderIds<TRoutes, TRequests>] extends [never]
  ? RpcRouteBatchBaseOptions & {
      readonly headers?: RpcRouteBatchClientHeaders<TRoutes, TRequests>;
    }
  : RpcRouteBatchBaseOptions & {
      readonly headers: RpcRouteBatchMissingClientHeaders<TRoutes, TRequests>;
    };

export type RpcRouteUnaryBatchOptions<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchOptions<TRoutes, TRequests>;

export type RpcUnaryRouteBatchOptions<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchOptions<TRoutes, TRequests>;

export type RpcManifestRouteBatchClientHeaders<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteBatchClientHeaders<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryBatchClientHeaders<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteUnaryBatchClientHeaders<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestUnaryRouteBatchClientHeaders<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcManifestRouteUnaryBatchClientHeaders<TManifest, TRequests>;

export type RpcManifestRouteBatchOptions<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteBatchOptions<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryBatchOptions<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteUnaryBatchOptions<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestUnaryRouteBatchOptions<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcManifestRouteUnaryBatchOptions<TManifest, TRequests>;

export type RpcRouteBatchOptionsTuple<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<TRoutes>[],
> =
  RpcRouteBatchOptions<TRoutes, TRequests> extends { readonly headers: unknown }
    ? [options: RpcRouteBatchOptions<TRoutes, TRequests>]
    : [options?: RpcRouteBatchOptions<TRoutes, TRequests>];

export type RpcRouteUnaryBatchOptionsTuple<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<TRoutes>[],
> = RpcRouteBatchOptionsTuple<TRoutes, TRequests>;

export type RpcUnaryRouteBatchOptionsTuple<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<TRoutes>[],
> = RpcRouteUnaryBatchOptionsTuple<TRoutes, TRequests>;

export type RpcManifestRouteBatchOptionsTuple<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteBatchOptionsTuple<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestRouteUnaryBatchOptionsTuple<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcRouteUnaryBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcRouteUnaryBatchOptionsTuple<JoorManifestRoutes<TManifest>, TRequests>;

export type RpcManifestUnaryRouteBatchOptionsTuple<
  TManifest extends JoorManifest,
  TRequests extends readonly unknown[] =
    readonly RpcUnaryRouteBatchRequestUnion<JoorManifestRoutes<TManifest>>[],
> = RpcManifestRouteUnaryBatchOptionsTuple<TManifest, TRequests>;

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

export type RpcManifestRouteRequestOptions<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryRequestOptions<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteRequestOptions<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryRequestOptions<TManifest, TId>;

export type RpcManifestRouteStreamRequestOptions<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamRequestOptions<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteRequestOptions<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamRequestOptions<TManifest, TId>;

type RpcRouteClientArgsFor<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> =
  RpcRouteRequiresHeaders<TRoutes, TId> extends false
    ? readonly [
        input: RpcRouteInput<TRoutes, TId>,
        options?: RpcRouteRequestOptions<TRoutes, TId>,
      ]
    : readonly [
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

export type RpcManifestRouteClientArgs<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteId<TManifest> = RpcManifestRouteId<TManifest>,
> = RpcRouteClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestRouteUnaryClientArgs<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcRouteUnaryClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestUnaryRouteClientArgs<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteUnaryId<TManifest> =
    RpcManifestRouteUnaryId<TManifest>,
> = RpcManifestRouteUnaryClientArgs<TManifest, TId>;

export type RpcManifestRouteStreamClientArgs<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcRouteStreamClientArgs<JoorManifestRoutes<TManifest>, TId>;

export type RpcManifestStreamRouteClientArgs<
  TManifest extends JoorManifest,
  TId extends RpcManifestRouteStreamId<TManifest> =
    RpcManifestRouteStreamId<TManifest>,
> = RpcManifestRouteStreamClientArgs<TManifest, TId>;

const createPendingRpcRequest = <TProcedure, TId extends string>(
  id: TId,
  input: ProcedureInput<TProcedure>,
  ...requestOptions: ProcedureRequiresHeaders<TProcedure> extends false
    ? [ClientRequestOptions<TProcedure>?]
    : [ClientRequestOptions<TProcedure>]
): PendingRpcRequest<TProcedure, TId> & PendingRpcRequestHeaders<TProcedure> =>
  Object.freeze({
    id,
    input,
    ...(requestOptions[0]?.traceId === undefined
      ? {}
      : { traceId: requestOptions[0].traceId }),
    ...(requestOptions[0]?.headers === undefined
      ? {}
      : { headers: Object.freeze({ ...requestOptions[0].headers }) }),
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
  ...options: [(ClientTraceOptions & { headers?: object })?]
): PendingRpcRequest {
  return Object.freeze({
    id,
    input: input as JsonValue,
    ...(options[0]?.traceId === undefined
      ? {}
      : { traceId: options[0].traceId }),
    ...(options[0]?.headers === undefined
      ? {}
      : { headers: Object.freeze({ ...options[0].headers }) }),
  }) as PendingRpcRequest;
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
): RpcManifestRouteRequest<TManifest, TId>;
export function createManifestRouteRequest(
  _manifest: JoorManifest,
  id: string,
  input: unknown,
  ...options: [(ClientTraceOptions & { headers?: object })?]
): PendingRpcRequest {
  return Object.freeze({
    id,
    input: input as JsonValue,
    ...(options[0]?.traceId === undefined
      ? {}
      : { traceId: options[0].traceId }),
    ...(options[0]?.headers === undefined
      ? {}
      : { headers: Object.freeze({ ...options[0].headers }) }),
  }) as PendingRpcRequest;
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
  readonly call: <TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<RpcUnaryProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcUnaryProcedure<TProcedure>>
  ) => Promise<
    RpcEnvelope<
      ProcedureOutput<RpcUnaryProcedure<TProcedure>> & JsonValue,
      TId,
      ProcedureResponseHeaders<RpcUnaryProcedure<TProcedure>>,
      RpcProcedureError<RpcUnaryProcedure<TProcedure>>
    >
  >;
  readonly request: <TProcedure, TId extends string = string>(
    id: TId,
    input: ProcedureInput<RpcUnaryProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcUnaryProcedure<TProcedure>>
  ) => PendingRpcRequest<RpcUnaryProcedure<TProcedure>, TId> &
    PendingRpcRequestHeaders<RpcUnaryProcedure<TProcedure>>;
  readonly batch: <const TRequests extends readonly LegacyBatchRequest[]>(
    requests: TRequests,
    options?: ClientBatchOptions
  ) => Promise<BatchResults<TRequests>>;
  readonly stream: <TProcedure>(
    id: string,
    input: ProcedureInput<RpcStreamProcedure<TProcedure>>,
    ...options: ClientRequestOptionsTuple<RpcStreamProcedure<TProcedure>>
  ) => AsyncIterable<StreamEvent<RpcStreamProcedure<TProcedure>> & JsonValue>;
}

export interface RpcRouteUnaryTransportClient<TRoutes extends RpcRouteMap> {
  readonly call: <TId extends RpcRouteUnaryId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ) => Promise<RpcRouteEnvelope<TRoutes, TId>>;
  readonly request: <TId extends RpcRouteUnaryId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ) => RpcRouteRequest<TRoutes, TId>;
  readonly batch: <
    const TRequests extends readonly [...RpcRouteBatchRequestUnion<TRoutes>[]],
  >(
    requests: TRequests,
    ...options: RpcRouteBatchOptionsTuple<TRoutes, NoInfer<TRequests>>
  ) => Promise<RpcRouteBatchResults<TRoutes, TRequests>>;
}

export interface RpcRouteStreamTransportClient<TRoutes extends RpcRouteMap> {
  readonly stream: <TId extends RpcRouteStreamId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ) => AsyncIterable<RpcRouteStreamEvent<TRoutes, TId> & JsonValue>;
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

export interface RpcManifestRouteUnaryTransportClient<
  TManifest extends JoorManifest,
> {
  readonly call: <TId extends RpcManifestRouteUnaryId<TManifest>>(
    id: TId,
    input: RpcManifestRouteInput<TManifest, TId>,
    ...options: ClientRequestOptionsTuple<
      RpcManifestRouteProcedure<TManifest, TId>
    >
  ) => Promise<RpcManifestRouteEnvelope<TManifest, TId>>;
  readonly request: <TId extends RpcManifestRouteUnaryId<TManifest>>(
    id: TId,
    input: RpcManifestRouteInput<TManifest, TId>,
    ...options: ClientRequestOptionsTuple<
      RpcManifestRouteProcedure<TManifest, TId>
    >
  ) => RpcManifestRouteRequest<TManifest, TId>;
  readonly batch: <
    const TRequests extends readonly [
      ...RpcManifestRouteBatchRequestUnion<TManifest>[],
    ],
  >(
    requests: TRequests,
    ...options: RpcManifestRouteBatchOptionsTuple<TManifest, NoInfer<TRequests>>
  ) => Promise<RpcManifestRouteBatchResults<TManifest, TRequests>>;
}

export type RpcManifestUnaryRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestRouteUnaryTransportClient<TManifest>;

export interface RpcManifestRouteStreamTransportClient<
  TManifest extends JoorManifest,
> {
  readonly stream: <TId extends RpcManifestRouteStreamId<TManifest>>(
    id: TId,
    input: RpcManifestRouteInput<TManifest, TId>,
    ...options: ClientRequestOptionsTuple<
      RpcManifestRouteProcedure<TManifest, TId>
    >
  ) => AsyncIterable<RpcManifestRouteStreamEvent<TManifest, TId> & JsonValue>;
}

export type RpcManifestStreamRouteTransportClient<
  TManifest extends JoorManifest,
> = RpcManifestRouteStreamTransportClient<TManifest>;

export interface RpcManifestTransportClient<TManifest extends JoorManifest>
  extends
    RpcManifestRouteUnaryTransportClient<TManifest>,
    RpcManifestRouteStreamTransportClient<TManifest> {}

export type RpcManifestClientOptions<
  TManifest extends JoorManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = Omit<
  ClientOptions<TManifest, TRequest>,
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

const freezeRequestBody = (body: JsonValue): JsonValue =>
  body !== null && typeof body === 'object' ? Object.freeze(body) : body;

const copyClientRequestInit = (
  value: ClientRequestInit | undefined
): ClientRequestInit | undefined =>
  value === undefined
    ? undefined
    : Object.freeze({ ...value }) as ClientRequestInit;

const createClientRequestFactoryArgs = (
  args: ClientRequestFactoryArgs
): ClientRequestFactoryArgs =>
  Object.freeze({
    ...args,
    body: freezeRequestBody(args.body),
    request: copyClientRequestInit(args.request),
  });

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

const createDefaultClientRequest = ({
  url,
  body,
  headers,
  baseRequest,
  request,
}: ClientRequestFactoryArgs): Request =>
  createRpcRequest(url, body, headers, baseRequest, request);

const defaultMaxStreamEventBytes = 1024 * 1024;

const normalizeMaxStreamEventBytes = (value: number | undefined): number =>
  value === undefined || !Number.isFinite(value) || value < 0
    ? defaultMaxStreamEventBytes
    : Math.floor(value);

const readSseFieldValue = (line: string, prefix: string): string | undefined => {
  if (!line.startsWith(prefix)) return undefined;
  const value = line.slice(prefix.length);
  return value.startsWith(' ') ? value.slice(1) : value;
};

const nextSseChunk = (
  buffer: string
): { chunk: string; rest: string } | undefined => {
  const separator = /\r?\n\r?\n/.exec(buffer);
  if (separator === null) return undefined;
  return {
    chunk: buffer.slice(0, separator.index),
    rest: buffer.slice(separator.index + separator[0].length),
  };
};

const parseSseChunk = (
  chunk: string
): { eventName?: string; data?: string } => {
  const data: string[] = [];
  let eventName: string | undefined;
  for (const line of chunk.split(/\r?\n/)) {
    const eventValue = readSseFieldValue(line, 'event:');
    if (eventValue !== undefined) {
      eventName = eventValue;
      continue;
    }
    const dataValue = readSseFieldValue(line, 'data:');
    if (dataValue !== undefined) data.push(dataValue);
  }
  return {
    ...(eventName === undefined ? {} : { eventName }),
    ...(data.length === 0 ? {} : { data: data.join('\n') }),
  };
};

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
    for (;;) {
      const next = nextSseChunk(buffer);
      if (next === undefined) break;
      const { chunk } = next;
      buffer = next.rest;
      if (chunk.length > maxEventBytes) {
        throw new Error('SSE event exceeds maxStreamEventBytes');
      }
      const { eventName, data } = parseSseChunk(chunk);
      if (eventName === 'done') return;
      if (data !== undefined) {
        const parsed = JSON.parse(data) as JsonValue;
        if (eventName === 'error') {
          throw new Error(JSON.stringify(parsed));
        }
        yield parsed as TEvent;
      }
    }
  }
};

const assertSseResponse = async (response: Response): Promise<void> => {
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.startsWith('text/event-stream')) return;
  if (contentType.includes('json')) {
    const payload = (await response.json()) as JsonValue;
    throw new Error(JSON.stringify(payload));
  }
  const text = await response.text();
  throw new Error(
    text.length === 0
      ? 'Expected text/event-stream response'
      : `Expected text/event-stream response: ${text}`
  );
};

export function createClient<
  const TManifest extends JoorManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  options: ClientOptions<TManifest, TRequest> & { manifest: TManifest }
): RpcManifestTransportClient<TManifest>;
export function createClient<
  TRoutes extends RpcRouteMap = never,
  TRequest extends Request = Request,
>(
  options: ClientOptions<undefined, TRequest>
): RpcTransportClient<TRoutes>;
export function createClient<TRequest extends Request = Request>(
  options: ClientOptions<JoorManifest | undefined, TRequest>
): LegacyRpcTransportClient | RouteRpcTransportClient<RpcRouteMap> {
  const url = options.url;
  const baseHeaders =
    options.headers === undefined
      ? undefined
      : Object.freeze({ ...options.headers });
  const baseRequest = copyClientRequestInit(options.request);
  const fetcher =
    options.fetch ??
    ((request: TRequest): Promise<Response> => globalThis.fetch(request));
  const requestFactory = (options.createRequest ??
    createDefaultClientRequest) as ClientRequestFactory<TRequest>;
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
      requestFactory(createClientRequestFactoryArgs({
        url,
        body: {
          id,
          input,
          ...(callOptions?.traceId === undefined
            ? {}
            : { traceId: callOptions.traceId }),
        } as JsonValue,
        headers: createHeaders(baseHeaders, callOptions?.headers),
        baseRequest,
        request: callOptions?.request,
      }))
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
    const body: JsonValue = requests.map((pending): JsonValue => ({
      id: pending.id,
      input: pending.input as JsonValue,
      ...('traceId' in pending && pending.traceId === undefined
        ? {}
        : 'traceId' in pending
          ? { traceId: pending.traceId }
          : {}),
    }));
    const requestHeaders = createHeaders(
      baseHeaders,
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
      requestFactory(createClientRequestFactoryArgs({
        url,
        body,
        headers: requestHeaders,
        baseRequest,
        request: batchOptions?.request,
      }))
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
        baseHeaders,
        requestOptions[0]?.headers
      );
      headers.set('accept', 'text/event-stream');
      const response = await fetcher(
        requestFactory(createClientRequestFactoryArgs({
          url,
          body: {
            id,
            input,
            ...(requestOptions[0]?.traceId === undefined
              ? {}
              : { traceId: requestOptions[0].traceId }),
          } as JsonValue,
          headers,
          baseRequest,
          request: requestOptions[0]?.request,
        }))
      );
      await assertSseResponse(response);
      yield* parseSse<JsonValue>(
        response,
        maxStreamEventBytes
      ) as AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
    },
  });
  return Object.freeze({
    call,
    request,
    batch,
    stream,
  });
}

export const createManifestClient = <
  const TManifest extends JoorManifest,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  options: RpcManifestClientOptions<TManifest, TRequest>
): RpcManifestTransportClient<TManifest> =>
  createClient<TManifest, TRequest>({
    ...(options as ClientOptions<TManifest, TRequest>),
    manifest,
  });
