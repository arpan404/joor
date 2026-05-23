import { defineManifest, defineProcedure, t } from '../src/index.js';
import type * as Root from '../src/index.js';
import type * as Manifest from '../src/manifest.js';
import type * as Rpc from '../src/rpc/index.js';

const unaryProcedure = defineProcedure({
  input: t.object({ id: t.string() }),
  headers: t.object({ 'x-tenant-id': t.string() }),
  output: t.object({ id: t.string(), name: t.string() }),
  responseHeaders: t.object({ 'cache-control': t.string() }),
  handler(ctx, input) {
    return ctx.ok(
      { id: input.id, name: 'Ada' },
      { 'cache-control': 'private' }
    );
  },
});

const streamProcedure = defineProcedure({
  input: t.object({ userId: t.string() }),
  stream: t.object({
    type: t.literal('user.updated'),
    userId: t.string(),
  }),
  async *handler(_ctx, input) {
    yield { type: 'user.updated' as const, userId: input.userId };
  },
});

const manifest = defineManifest({
  procedures: {
    'users.get': unaryProcedure,
    'users.watch': streamProcedure,
  },
});

type Routes = typeof manifest.procedures;
type UnaryProtocolRequest = Root.RpcRouteUnaryProtocolRequest<
  Routes,
  'users.get'
>;
type StreamProtocolRequest = Root.RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
>;
type ManifestType = typeof manifest;

export type RootRouteFirstRpcAliases = [
  Root.RpcRouteUnaryId<Routes>,
  Root.RpcRouteStreamId<Routes>,
  Root.RpcRouteUnaryProcedure<Routes, 'users.get'>,
  Root.RpcRouteStreamProcedure<Routes, 'users.watch'>,
  Root.RpcRouteUnaryInput<Routes, 'users.get'>,
  Root.RpcRouteStreamInput<Routes, 'users.watch'>,
  Root.RpcRouteUnaryOutput<Routes, 'users.get'>,
  Root.RpcRouteStreamOutput<Routes, 'users.watch'>,
  Root.RpcRouteUnaryHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryClientHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamClientHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryHasHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamHasHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryRequiresHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamRequiresHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryResponseHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamResponseHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryHasResponseHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamHasResponseHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryRequiresResponseHeaders<Routes, 'users.get'>,
  Root.RpcRouteStreamRequiresResponseHeaders<Routes, 'users.watch'>,
  Root.RpcRouteUnaryError<Routes, 'users.get'>,
  Root.RpcRouteStreamError<Routes, 'users.watch'>,
  Root.RpcRouteUnaryErrorCode<Routes, 'users.get'>,
  Root.RpcRouteStreamErrorCode<Routes, 'users.watch'>,
  Root.RpcRouteUnaryErrorDetails<Routes, 'users.get', 'PARSE_ERROR'>,
  Root.RpcRouteStreamErrorDetails<Routes, 'users.watch', 'PARSE_ERROR'>,
  Root.RpcRouteUnaryEnvelope<Routes, 'users.get'>,
  Root.RpcRouteUnaryEnvelopeUnion<Routes>,
  Root.RpcRouteUnaryResult<Routes, 'users.get'>,
  Root.RpcRouteUnaryResultUnion<Routes>,
  Root.RpcRouteUnaryBatchRequest<Routes, readonly [UnaryProtocolRequest]>,
  Root.RpcRouteUnaryBatchResults<Routes, readonly [UnaryProtocolRequest]>,
  Root.RpcRouteUnaryBody<Routes>,
  Root.RpcRouteStreamBody<Routes>,
  Root.RpcRouteUnaryBodyResult<Routes>,
  Root.RpcRouteStreamBodyResult<Routes>,
  Root.RpcRouteUnaryBodyResultFor<Routes, UnaryProtocolRequest>,
  Root.RpcRouteStreamBodyResultFor<Routes, StreamProtocolRequest>,
  Root.RpcRouteUnaryRequest<Routes, 'users.get'>,
  Root.RpcRouteUnaryRequestUnion<Routes>,
  Root.RpcRouteUnaryRequestOptions<Routes, 'users.get'>,
  Root.RpcRouteStreamRequestOptions<Routes, 'users.watch'>,
  Root.RpcRouteUnaryClientArgs<Routes, 'users.get'>,
  Root.RpcRouteStreamClientArgs<Routes, 'users.watch'>,
  Root.RpcRouteUnaryTransportClient<Routes>,
  Root.RpcRouteStreamTransportClient<Routes>,
  Root.RpcManifestRouteUnaryTransportClient<ManifestType>,
  Root.RpcManifestRouteStreamTransportClient<ManifestType>,
];

export type RpcSubpathRouteFirstAliases = [
  Rpc.RpcRouteUnaryInput<Routes, 'users.get'>,
  Rpc.RpcRouteStreamInput<Routes, 'users.watch'>,
  Rpc.RpcRouteUnaryClientArgs<Routes, 'users.get'>,
  Rpc.RpcRouteStreamClientArgs<Routes, 'users.watch'>,
  Rpc.RpcRouteUnaryBodyResultFor<Routes, UnaryProtocolRequest>,
  Rpc.RpcRouteStreamBodyResultFor<Routes, StreamProtocolRequest>,
  Rpc.RpcManifestRouteUnaryTransportClient<ManifestType>,
  Rpc.RpcManifestRouteStreamTransportClient<ManifestType>,
];

export type RootRouteFirstManifestAliases = [
  Root.JoorManifestRouteUnaryId<ManifestType>,
  Root.JoorManifestRouteStreamId<ManifestType>,
  Root.JoorManifestRouteUnaryProcedure<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamProcedure<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryInput<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamInput<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryOutput<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamOutput<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryClientHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamClientHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryHasHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamHasHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryRequiresHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamRequiresHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryResponseHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamResponseHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryHasResponseHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamHasResponseHeaders<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryRequiresResponseHeaders<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamRequiresResponseHeaders<
    ManifestType,
    'users.watch'
  >,
  Root.JoorManifestRouteUnaryError<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamError<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryErrorCode<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamErrorCode<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryErrorDetails<
    ManifestType,
    'users.get',
    'PARSE_ERROR'
  >,
  Root.JoorManifestRouteStreamErrorDetails<
    ManifestType,
    'users.watch',
    'PARSE_ERROR'
  >,
  Root.JoorManifestRouteUnaryEnvelope<ManifestType, 'users.get'>,
  Root.JoorManifestRouteUnaryEnvelopeUnion<ManifestType>,
  Root.JoorManifestRouteUnaryResult<ManifestType, 'users.get'>,
  Root.JoorManifestRouteUnaryResultUnion<ManifestType>,
  Root.JoorManifestRouteUnaryRequest<ManifestType, 'users.get'>,
  Root.JoorManifestRouteUnaryRequestUnion<ManifestType>,
  Root.JoorManifestRouteUnaryBatchResults<
    ManifestType,
    readonly [
      Root.JoorManifestRouteUnaryProtocolRequest<ManifestType, 'users.get'>,
    ]
  >,
  Root.JoorManifestRouteUnaryBody<ManifestType>,
  Root.JoorManifestRouteStreamBody<ManifestType>,
  Root.JoorManifestRouteUnaryBodyResult<ManifestType>,
  Root.JoorManifestRouteStreamBodyResult<ManifestType>,
  Root.JoorManifestRouteUnaryBodyResultFor<
    ManifestType,
    Root.JoorManifestRouteUnaryProtocolRequest<ManifestType, 'users.get'>
  >,
  Root.JoorManifestRouteStreamBodyResultFor<
    ManifestType,
    Root.JoorManifestRouteStreamProtocolRequest<ManifestType, 'users.watch'>
  >,
  Root.JoorManifestRouteUnaryBatchRequest<
    ManifestType,
    readonly [
      Root.JoorManifestRouteUnaryProtocolRequest<ManifestType, 'users.get'>,
    ]
  >,
  Root.JoorManifestRouteUnaryRequestOptions<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamRequestOptions<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryClientArgs<ManifestType, 'users.get'>,
  Root.JoorManifestRouteStreamClientArgs<ManifestType, 'users.watch'>,
  Root.JoorManifestRouteUnaryTransportClient<ManifestType>,
  Root.JoorManifestRouteStreamTransportClient<ManifestType>,
];

export type ManifestSubpathRouteFirstAliases = [
  Manifest.JoorManifestRouteUnaryInput<ManifestType, 'users.get'>,
  Manifest.JoorManifestRouteStreamInput<ManifestType, 'users.watch'>,
  Manifest.JoorManifestRouteUnaryClientArgs<ManifestType, 'users.get'>,
  Manifest.JoorManifestRouteStreamClientArgs<ManifestType, 'users.watch'>,
  Manifest.JoorManifestRouteUnaryBodyResultFor<
    ManifestType,
    Manifest.JoorManifestRouteUnaryProtocolRequest<ManifestType, 'users.get'>
  >,
  Manifest.JoorManifestRouteStreamBodyResultFor<
    ManifestType,
    Manifest.JoorManifestRouteStreamProtocolRequest<ManifestType, 'users.watch'>
  >,
  Manifest.JoorManifestRouteUnaryTransportClient<ManifestType>,
  Manifest.JoorManifestRouteStreamTransportClient<ManifestType>,
];
