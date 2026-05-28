import { defineManifest, defineProcedure, t } from '../src/index.js';
import type * as ConfigSubpath from '../src/config.js';
import type * as ContextSubpath from '../src/context/index.js';
import type * as ManifestSubpath from '../src/manifest.js';
import type * as CompiledSubpath from '../src/runtime/compiled.js';
import type * as FetchSubpath from '../src/runtime/fetch.js';
import type * as Root from '../src/index.js';
import type * as RpcSubpath from '../src/rpc/index.js';

const unaryProcedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ name: t.string() }),
  handler(ctx, input) {
    return ctx.ok({ name: input.id });
  },
});

const streamProcedure = defineProcedure({
  input: t.object({ userId: t.string() }),
  stream: t.object({ userId: t.string() }),
  async *handler(_ctx, input) {
    yield { userId: input.userId };
  },
});

const routeFirstManifest = defineManifest({
  procedures: {
    'users.get': unaryProcedure,
    'users.watch': streamProcedure,
  },
});

type AliasManifest = typeof routeFirstManifest;
type AliasRoutes = Root.JoorManifestRoutes<AliasManifest>;
type AliasPlugins = readonly [];
type UnaryId = 'users.get';
type StreamId = 'users.watch';
type UnaryProtocolRequest = Root.RpcManifestRouteUnaryProtocolRequest<
  AliasManifest,
  UnaryId
>;
type UnaryBatchRequest = readonly [UnaryProtocolRequest];
type UnaryBody = Root.RpcManifestRouteUnaryBody<AliasManifest>;
type StreamBody = Root.RpcManifestRouteStreamBody<AliasManifest>;

export type ConciseRpcRouteAliasSurface = [
  Root.RpcUnaryId<AliasRoutes>,
  Root.RpcStreamId<AliasRoutes>,
  Root.RpcUnaryInput<AliasRoutes, UnaryId>,
  Root.RpcStreamInput<AliasRoutes, StreamId>,
  Root.RpcUnaryOutput<AliasRoutes, UnaryId>,
  Root.RpcStreamOutput<AliasRoutes, StreamId>,
  Root.RpcUnaryHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryClientHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamClientHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryHasHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamHasHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryRequiresHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamRequiresHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryResponseHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamResponseHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryHasResponseHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamHasResponseHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryRequiresResponseHeaders<AliasRoutes, UnaryId>,
  Root.RpcStreamRequiresResponseHeaders<AliasRoutes, StreamId>,
  Root.RpcUnaryError<AliasRoutes, UnaryId>,
  Root.RpcStreamError<AliasRoutes, StreamId>,
  Root.RpcUnaryErrorCode<AliasRoutes, UnaryId>,
  Root.RpcStreamErrorCode<AliasRoutes, StreamId>,
  Root.RpcUnaryErrorDetails<AliasRoutes, UnaryId>,
  Root.RpcStreamErrorDetails<AliasRoutes, StreamId>,
  Root.RpcStreamEvent<AliasRoutes, StreamId>,
  Root.RpcUnaryEnvelope<AliasRoutes, UnaryId>,
  Root.RpcUnaryEnvelopeUnion<AliasRoutes>,
  Root.RpcUnaryResult<AliasRoutes, UnaryId>,
  Root.RpcUnaryResultUnion<AliasRoutes>,
  Root.RpcUnaryBody<AliasRoutes>,
  Root.RpcStreamBody<AliasRoutes>,
  Root.RpcUnaryBodyResult<AliasRoutes>,
  Root.RpcStreamBodyResult<AliasRoutes>,
  Root.RpcUnaryBodyResultFor<AliasRoutes, UnaryProtocolRequest>,
  Root.RpcStreamBodyResultFor<
    AliasRoutes,
    Root.RpcStreamProtocolRequest<AliasRoutes, StreamId>
  >,
  Root.RpcUnaryRequest<AliasRoutes, UnaryId>,
  Root.RpcUnaryRequestUnion<AliasRoutes>,
  Root.RpcStreamRequest<AliasRoutes, StreamId>,
  Root.RpcStreamRequestUnion<AliasRoutes>,
  Root.RpcUnaryRequestOptions<AliasRoutes, UnaryId>,
  Root.RpcStreamRequestOptions<AliasRoutes, StreamId>,
  Root.RpcUnaryClientArgs<AliasRoutes, UnaryId>,
  Root.RpcStreamClientArgs<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryId<AliasRoutes>,
  RpcSubpath.RpcStreamId<AliasRoutes>,
  RpcSubpath.RpcUnaryInput<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamInput<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryOutput<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamOutput<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryClientHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamClientHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryHasHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamHasHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryRequiresHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamRequiresHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryResponseHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamResponseHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryHasResponseHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamHasResponseHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryRequiresResponseHeaders<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamRequiresResponseHeaders<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryError<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamError<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryErrorCode<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamErrorCode<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryErrorDetails<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamErrorDetails<AliasRoutes, StreamId>,
  RpcSubpath.RpcStreamEvent<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryEnvelope<AliasRoutes, UnaryId>,
  RpcSubpath.RpcUnaryEnvelopeUnion<AliasRoutes>,
  RpcSubpath.RpcUnaryResult<AliasRoutes, UnaryId>,
  RpcSubpath.RpcUnaryResultUnion<AliasRoutes>,
  RpcSubpath.RpcUnaryBody<AliasRoutes>,
  RpcSubpath.RpcStreamBody<AliasRoutes>,
  RpcSubpath.RpcUnaryBodyResult<AliasRoutes>,
  RpcSubpath.RpcStreamBodyResult<AliasRoutes>,
  RpcSubpath.RpcUnaryBodyResultFor<AliasRoutes, UnaryProtocolRequest>,
  RpcSubpath.RpcStreamBodyResultFor<
    AliasRoutes,
    RpcSubpath.RpcStreamProtocolRequest<AliasRoutes, StreamId>
  >,
  RpcSubpath.RpcUnaryRequest<AliasRoutes, UnaryId>,
  RpcSubpath.RpcUnaryRequestUnion<AliasRoutes>,
  RpcSubpath.RpcStreamRequest<AliasRoutes, StreamId>,
  RpcSubpath.RpcStreamRequestUnion<AliasRoutes>,
  RpcSubpath.RpcUnaryRequestOptions<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamRequestOptions<AliasRoutes, StreamId>,
  RpcSubpath.RpcUnaryClientArgs<AliasRoutes, UnaryId>,
  RpcSubpath.RpcStreamClientArgs<AliasRoutes, StreamId>,
];

export type RouteFirstCompiledAliasSurface = [
  Root.CompiledRouteUnaryTransportBodyResultFor<AliasManifest, UnaryBody>,
  Root.CompiledUnaryRouteTransportBodyResultFor<AliasManifest, UnaryBody>,
  Root.CompiledRouteStreamTransportBodyResultFor<AliasManifest, StreamBody>,
  Root.CompiledStreamRouteTransportBodyResultFor<AliasManifest, StreamBody>,
  Root.CompiledRouteUnaryBodyResultFor<AliasManifest, UnaryBody>,
  Root.CompiledUnaryRouteBodyResultFor<AliasManifest, UnaryBody>,
  Root.CompiledRouteStreamBodyResultFor<AliasManifest, StreamBody>,
  Root.CompiledStreamRouteBodyResultFor<AliasManifest, StreamBody>,
  Root.CompiledRouteUnaryRpcRequestHandler,
  Root.CompiledUnaryRouteRpcRequestHandler,
  Root.CompiledRouteStreamRpcRequestHandler,
  Root.CompiledStreamRouteRpcRequestHandler,
  Root.CompiledRpcRouteUnaryBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcUnaryRouteBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcRouteStreamBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcStreamRouteBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcRouteUnaryTransportBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcUnaryRouteTransportBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcRouteStreamTransportBodyResultHandlerFor<AliasManifest>,
  Root.CompiledRpcStreamRouteTransportBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRouteUnaryTransportBodyResultFor<
    AliasManifest,
    UnaryBody
  >,
  CompiledSubpath.CompiledUnaryRouteTransportBodyResultFor<
    AliasManifest,
    UnaryBody
  >,
  CompiledSubpath.CompiledRouteStreamTransportBodyResultFor<
    AliasManifest,
    StreamBody
  >,
  CompiledSubpath.CompiledStreamRouteTransportBodyResultFor<
    AliasManifest,
    StreamBody
  >,
  CompiledSubpath.CompiledRouteUnaryBodyResultFor<AliasManifest, UnaryBody>,
  CompiledSubpath.CompiledUnaryRouteBodyResultFor<AliasManifest, UnaryBody>,
  CompiledSubpath.CompiledRouteStreamBodyResultFor<AliasManifest, StreamBody>,
  CompiledSubpath.CompiledStreamRouteBodyResultFor<AliasManifest, StreamBody>,
  CompiledSubpath.CompiledRouteUnaryRpcRequestHandler,
  CompiledSubpath.CompiledUnaryRouteRpcRequestHandler,
  CompiledSubpath.CompiledRouteStreamRpcRequestHandler,
  CompiledSubpath.CompiledStreamRouteRpcRequestHandler,
  CompiledSubpath.CompiledRpcRouteUnaryBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcUnaryRouteBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcRouteStreamBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcStreamRouteBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcRouteUnaryTransportBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcUnaryRouteTransportBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcRouteStreamTransportBodyResultHandlerFor<AliasManifest>,
  CompiledSubpath.CompiledRpcStreamRouteTransportBodyResultHandlerFor<AliasManifest>,
];

export type RouteFirstConfigAliasSurface = [
  Root.DefineRouteUnaryConfigFor<AliasManifest>,
  Root.DefineRouteStreamConfigFor<AliasManifest>,
  Root.JoorRouteUnaryConfigFor<AliasManifest, AliasPlugins, UnaryBody>,
  Root.JoorRouteStreamConfigFor<AliasManifest, AliasPlugins, StreamBody>,
  ConfigSubpath.DefineRouteUnaryConfigFor<AliasManifest>,
  ConfigSubpath.DefineRouteStreamConfigFor<AliasManifest>,
  ConfigSubpath.JoorRouteUnaryConfigFor<AliasManifest, AliasPlugins, UnaryBody>,
  ConfigSubpath.JoorRouteStreamConfigFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  ContextSubpath.DefineRouteUnaryConfigFor<AliasManifest>,
  ContextSubpath.DefineRouteStreamConfigFor<AliasManifest>,
  ContextSubpath.JoorRouteUnaryConfigFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  ContextSubpath.JoorRouteStreamConfigFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
];

export type RouteFirstManifestHandlerAliasSurface = [
  Root.JoorManifestRouteUnaryBodyHandler<AliasManifest>,
  Root.JoorManifestRouteStreamBodyHandler<AliasManifest>,
  Root.JoorManifestRouteUnaryBodyResultHandler<AliasManifest>,
  Root.JoorManifestRouteStreamBodyResultHandler<AliasManifest>,
  Root.JoorManifestRouteUnaryTransportBodyResultHandler<AliasManifest>,
  Root.JoorManifestRouteStreamTransportBodyResultHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteUnaryBodyHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteStreamBodyHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteUnaryBodyResultHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteStreamBodyResultHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteUnaryTransportBodyResultHandler<AliasManifest>,
  ManifestSubpath.JoorManifestRouteStreamTransportBodyResultHandler<AliasManifest>,
];

export type RouteFirstJoorManifestProtocolBatchAliasSurface = [
  Root.JoorManifestRouteProtocolBatchRequestUnion<AliasManifest>,
  Root.JoorManifestRouteUnaryProtocolBatchRequestUnion<AliasManifest>,
  Root.JoorManifestUnaryRouteProtocolBatchRequestUnion<AliasManifest>,
  Root.JoorManifestRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestRouteUnaryProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestUnaryRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestProtocolBatchClientHeaders<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteProtocolBatchOptions<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteUnaryProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestUnaryRouteProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestProtocolBatchOptions<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestRouteUnaryProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestUnaryRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestProtocolBatchOptionsTuple<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteProtocolBatchRequest<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteUnaryProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestUnaryRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestRouteProtocolBatchResults<AliasManifest, UnaryBatchRequest>,
  Root.JoorManifestRouteUnaryProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.JoorManifestUnaryRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteProtocolBatchRequestUnion<AliasManifest>,
  ManifestSubpath.JoorManifestRouteUnaryProtocolBatchRequestUnion<AliasManifest>,
  ManifestSubpath.JoorManifestUnaryRouteProtocolBatchRequestUnion<AliasManifest>,
  ManifestSubpath.JoorManifestRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteUnaryProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestUnaryRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestRouteUnaryProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  ManifestSubpath.JoorManifestUnaryRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
];

export type RootRouteFirstRpcAliasSurface = [
  Root.DefineUnaryHandlerOptions<AliasManifest>,
  Root.DefineStreamHandlerOptions<AliasManifest>,
  Root.DefineRouteUnaryHandlerOptions<AliasManifest>,
  Root.DefineRouteStreamHandlerOptions<AliasManifest>,
  Root.RpcManifestRouteUnaryId<AliasManifest>,
  Root.RpcManifestRouteStreamId<AliasManifest>,
  Root.RpcManifestRouteUnaryProcedure<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamProcedure<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryInput<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamInput<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryOutput<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamOutput<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryClientHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamClientHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryHasHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamHasHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryRequiresHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamRequiresHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryResponseHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamResponseHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryHasResponseHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamHasResponseHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryRequiresResponseHeaders<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamRequiresResponseHeaders<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryError<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamError<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryErrorCode<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamErrorCode<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryErrorDetails<
    AliasManifest,
    UnaryId,
    'VALIDATION_ERROR'
  >,
  Root.RpcManifestRouteStreamErrorDetails<
    AliasManifest,
    StreamId,
    'VALIDATION_ERROR'
  >,
  Root.RpcManifestRouteUnaryEnvelope<AliasManifest, UnaryId>,
  Root.RpcManifestRouteUnaryEnvelopeUnion<AliasManifest>,
  Root.RpcManifestRouteUnaryResult<AliasManifest, UnaryId>,
  Root.RpcManifestRouteUnaryResultUnion<AliasManifest>,
  Root.RpcManifestRouteUnaryRequest<AliasManifest, UnaryId>,
  Root.RpcManifestRouteUnaryRequestUnion<AliasManifest>,
  Root.RpcManifestRouteUnaryBatchRequest<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteUnaryBatchResults<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteProtocolBatchRequestUnion<AliasManifest>,
  Root.RpcManifestRouteUnaryProtocolBatchRequestUnion<AliasManifest>,
  Root.RpcManifestUnaryRouteProtocolBatchRequestUnion<AliasManifest>,
  Root.RpcManifestRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestRouteUnaryProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestUnaryRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestProtocolBatchClientHeaders<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteProtocolBatchOptions<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteUnaryProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestUnaryRouteProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestProtocolBatchOptions<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestRouteUnaryProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestUnaryRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestProtocolBatchOptionsTuple<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteProtocolBatchRequest<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteUnaryProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestUnaryRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestRouteProtocolBatchResults<AliasManifest, UnaryBatchRequest>,
  Root.RpcManifestRouteUnaryProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  Root.RpcManifestUnaryRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  UnaryBody,
  StreamBody,
  Root.RpcManifestRouteUnaryBodyResult<AliasManifest>,
  Root.RpcManifestRouteStreamBodyResult<AliasManifest>,
  Root.RpcManifestRouteUnaryBodyResultFor<AliasManifest, UnaryBody>,
  Root.RpcManifestRouteStreamBodyResultFor<AliasManifest, StreamBody>,
  Root.RpcManifestRouteUnaryRequestOptions<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamRequestOptions<AliasManifest, StreamId>,
  Root.RpcManifestRouteUnaryClientArgs<AliasManifest, UnaryId>,
  Root.RpcManifestRouteStreamClientArgs<AliasManifest, StreamId>,
  Root.RpcManifestUnaryBodyHandler<AliasManifest>,
  Root.RpcManifestStreamBodyHandler<AliasManifest>,
  Root.RpcManifestRouteUnaryBodyHandler<AliasManifest>,
  Root.RpcManifestRouteStreamBodyHandler<AliasManifest>,
  Root.RpcManifestUnaryBodyResultHandler<AliasManifest>,
  Root.RpcManifestStreamBodyResultHandler<AliasManifest>,
  Root.RpcManifestRouteUnaryBodyResultHandler<AliasManifest>,
  Root.RpcManifestRouteStreamBodyResultHandler<AliasManifest>,
  Root.RpcManifestUnaryTransportBodyResultHandler<AliasManifest>,
  Root.RpcManifestStreamTransportBodyResultHandler<AliasManifest>,
  Root.RpcManifestRouteUnaryTransportBodyResultHandler<AliasManifest>,
  Root.RpcManifestRouteStreamTransportBodyResultHandler<AliasManifest>,
  Root.RpcManifestUnaryHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestStreamHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteUnaryHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteStreamHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestUnaryHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteUnaryHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestUnaryHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteUnaryHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestUnaryHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestUnaryHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestStreamHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteStreamHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestStreamHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteStreamHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestStreamHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestStreamHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteUnaryHandlerHookContextFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteStreamHandlerHookContextFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteUnaryHandlerHooksFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteStreamHandlerHooksFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  Root.RpcManifestRouteUnaryMiddlewareFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  Root.RpcManifestRouteStreamMiddlewareFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
];

export type RpcSubpathRouteFirstAliasSurface = [
  RpcSubpath.DefineUnaryHandlerOptions<AliasManifest>,
  RpcSubpath.DefineStreamHandlerOptions<AliasManifest>,
  RpcSubpath.DefineRouteUnaryHandlerOptions<AliasManifest>,
  RpcSubpath.DefineRouteStreamHandlerOptions<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryId<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamId<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryProcedure<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamProcedure<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryInput<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamInput<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryOutput<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamOutput<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryClientHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamClientHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryHasHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamHasHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryRequiresHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamRequiresHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryResponseHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamResponseHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryHasResponseHeaders<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamHasResponseHeaders<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryRequiresResponseHeaders<
    AliasManifest,
    UnaryId
  >,
  RpcSubpath.RpcManifestRouteStreamRequiresResponseHeaders<
    AliasManifest,
    StreamId
  >,
  RpcSubpath.RpcManifestRouteUnaryError<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamError<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryErrorCode<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamErrorCode<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryErrorDetails<
    AliasManifest,
    UnaryId,
    'VALIDATION_ERROR'
  >,
  RpcSubpath.RpcManifestRouteStreamErrorDetails<
    AliasManifest,
    StreamId,
    'VALIDATION_ERROR'
  >,
  RpcSubpath.RpcManifestRouteUnaryEnvelope<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteUnaryEnvelopeUnion<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryResult<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteUnaryResultUnion<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryRequest<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteUnaryRequestUnion<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteUnaryBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteProtocolBatchRequestUnion<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryProtocolBatchRequestUnion<AliasManifest>,
  RpcSubpath.RpcManifestUnaryRouteProtocolBatchRequestUnion<AliasManifest>,
  RpcSubpath.RpcManifestRouteProtocolBatchClientHeaders<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteProtocolBatchOptions<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteProtocolBatchOptionsTuple<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteUnaryProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestUnaryRouteProtocolBatchRequest<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteUnaryProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestUnaryRouteProtocolBatchResults<
    AliasManifest,
    UnaryBatchRequest
  >,
  RpcSubpath.RpcManifestRouteUnaryBody<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamBody<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryBodyResult<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamBodyResult<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryBodyResultFor<AliasManifest, UnaryBody>,
  RpcSubpath.RpcManifestRouteStreamBodyResultFor<AliasManifest, StreamBody>,
  RpcSubpath.RpcManifestRouteUnaryRequestOptions<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamRequestOptions<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestRouteUnaryClientArgs<AliasManifest, UnaryId>,
  RpcSubpath.RpcManifestRouteStreamClientArgs<AliasManifest, StreamId>,
  RpcSubpath.RpcManifestUnaryBodyHandler<AliasManifest>,
  RpcSubpath.RpcManifestStreamBodyHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryBodyHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamBodyHandler<AliasManifest>,
  RpcSubpath.RpcManifestUnaryBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestStreamBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestUnaryTransportBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestStreamTransportBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteUnaryTransportBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestRouteStreamTransportBodyResultHandler<AliasManifest>,
  RpcSubpath.RpcManifestUnaryHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestStreamHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestUnaryHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestUnaryHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestUnaryHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestUnaryHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestStreamHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestStreamHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerOptionsArgsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestStreamHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
    AliasManifest,
    [preflight?: boolean],
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestStreamHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerHookContextFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerHookContextFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteUnaryHandlerHooksFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteStreamHandlerHooksFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  RpcSubpath.RpcManifestRouteUnaryMiddlewareFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  RpcSubpath.RpcManifestRouteStreamMiddlewareFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
];

export type RuntimeFetchConciseAliasSurface = [
  Root.JoorUnaryHandlerOptionsFor<AliasManifest, AliasPlugins, UnaryBody>,
  Root.JoorStreamHandlerOptionsFor<AliasManifest, AliasPlugins, StreamBody>,
  Root.JoorUnaryHandlerOptionsArgs<AliasManifest, AliasPlugins, UnaryBody>,
  Root.JoorStreamHandlerOptionsArgs<AliasManifest, AliasPlugins, StreamBody>,
  FetchSubpath.JoorUnaryHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  FetchSubpath.JoorStreamHandlerOptionsFor<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
  FetchSubpath.JoorUnaryHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    UnaryBody
  >,
  FetchSubpath.JoorStreamHandlerOptionsArgs<
    AliasManifest,
    AliasPlugins,
    StreamBody
  >,
];
