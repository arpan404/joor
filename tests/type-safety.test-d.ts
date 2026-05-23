import {
  createPlugin,
  createAuthPolicy,
  defineConfig,
  defineConfigFor,
  defineManifest,
  defineProcedure,
  resolvePluginServices,
  createBunFetch,
  createBunRpcRequestHandler,
  createBunTransportRequestHandler,
  createCloudflareWorker,
  createDenoFetch,
  createDenoCompiledTransportRequestHandlerWithPath as createRootDenoCompiledTransportRequestHandlerWithPath,
  createDenoRpcRequestHandler,
  createDenoTransportRequestHandler,
  createDenoTransportRequestHandlerWithPath,
  createJoorHandler,
  createNetlifyFetch,
  createNextHandler,
  createNextRouteHandlers,
  createNodeRpcRequestHandler,
  createNodeTransportRequestHandler,
  createVercelFetch,
  createClient as createRootClient,
  createManifestClient as createRootManifestClient,
  createRpcBodyHandler,
  createRpcBodyResultHandler,
  createRpcHandler,
  createRpcRequestPreflight,
  createRpcTransportBodyResultHandler,
  createCompiledRpcHandler as createRootCompiledRpcHandler,
  createCompiledRpcTransportBodyResultHandler as createRootCompiledRpcTransportBodyResultHandler,
  createCompiledRuntimeState as createRootCompiledRuntimeState,
  defineHandlerOptions,
  isJsonObject,
  listen,
  parseJson,
  serveBun,
  serveDeno,
  t,
  toJsonSchema,
  validate,
  type ArrayChain,
  type BatchResults,
  type BunFetchHandler,
  type BunRpcRequestHandler,
  type BunServer,
  type BunServeOptionsFor,
  type BunServeOptions,
  type AuthPolicyAuth,
  type AuthPolicy,
  type AuthPolicyHeaders,
  type AuthPolicyHeaderValues,
  type AuthPolicyResult,
  type AuthPolicyResultLike,
  type AuthPolicyServices,
  type BunTransportBodyResult,
  type BunTransportBodyResultFor,
  type BunTransportBodyResultHandler,
  type BunTransportBodyResultHandlerFor,
  type BunTransportRequestHandler,
  type ClientFetch,
  type ClientHeaderValues,
  type ClientOptions,
  type ClientProcedureHeaders,
  type CloudflareFetchHandler,
  type CloudflareWorkerOptionsFor,
  type CloudflareWorker,
  type CompiledAuthResult as RootCompiledAuthResult,
  type CompiledAuthResultLike as RootCompiledAuthResultLike,
  type CompiledDispatch as RootCompiledDispatch,
  type CompiledFixedUnaryDispatch as RootCompiledFixedUnaryDispatch,
  type CompiledRpcBodyResultHandlerFor as RootCompiledRpcBodyResultHandlerFor,
  type CompiledRpcRequestHandler as RootCompiledRpcRequestHandler,
  type CompiledRpcTransportBodyResultHandlerFor as RootCompiledRpcTransportBodyResultHandlerFor,
  type CompiledRuntimeState as RootCompiledRuntimeState,
  type CompiledSerializedEnvelope as RootCompiledSerializedEnvelope,
  type DenoCompiledTransportBodyResult as RootDenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor as RootDenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler as RootDenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor as RootDenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler as RootDenoCompiledTransportRequestHandler,
  type DenoFetchHandler,
  type DenoRpcRequestHandler,
  type DenoServeOptionsFor,
  type DenoServer,
  type DenoServeOptions,
  type DenoTransportBodyResult,
  type DenoTransportBodyResultFor,
  type DenoTransportBodyResultHandler,
  type DenoTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler,
  type DefineConfigFor,
  type HandlerHookContext,
  type HandlerHookContextFor,
  type HandlerHooks,
  type HandlerHooksFor,
  type HandlerOptionServices,
  type HandlerOptionsFor,
  type HandlerOptions,
  type JoorMiddleware,
  type JoorMiddlewareFor,
  type JoorConfig,
  type JoorConfigFor,
  type JoorConfigContext,
  type JoorContext,
  type PluginServices,
  type Infer,
  type HeaderObjectSchema,
  type HeaderValueSchema,
  type JsonObject,
  type JsonPrimitive,
  type JoorFetchHandler,
  type JoorHandlerOptionsFor,
  type JoorManifestClientOptions,
  type JoorManifestRouteBody,
  type JoorManifestRouteBodyResult,
  type JoorManifestRouteBodyResultFor,
  type JoorManifestRouteBatchRequest,
  type JoorManifestRouteBatchResults,
  type JoorManifestRouteClientArgs,
  type JoorManifestRouteClientHeaders,
  type JoorManifestRouteEnvelope,
  type JoorManifestRouteEnvelopeUnion,
  type JoorManifestRouteResult,
  type JoorManifestRouteResultUnion,
  type JoorManifestRouteError,
  type JoorManifestRouteErrorCode,
  type JoorManifestRouteErrorDetails,
  type JoorManifestRouteHasHeaders,
  type JoorManifestRouteHasResponseHeaders,
  type JoorManifestRouteHeaders,
  type JoorManifestRouteId,
  type JoorManifestRouteInput,
  type JoorManifestRouteOutput,
  type JoorManifestRouteProcedure,
  type JoorManifestRouteProtocolRequest,
  type JoorManifestRouteProtocolRequestUnion,
  type JoorManifestRouteRequest,
  type JoorManifestRouteRequestOptions,
  type JoorManifestRouteRequestUnion,
  type JoorManifestRouteResponseHeaders,
  type JoorManifestRouteRequiresHeaders,
  type JoorManifestRouteRequiresResponseHeaders,
  type JoorManifestRequiredServices,
  type JoorManifestRouteServices,
  type JoorManifestRouteStreamEvent,
  type JoorManifestRouteStreamProtocolRequest,
  type JoorManifestRouteStreamProtocolRequestUnion,
  type JoorManifestRouteUnaryProtocolRequest,
  type JoorManifestRouteUnaryProtocolRequestUnion,
  type JoorManifestRoutes,
  type JoorManifestStreamRouteId,
  type JoorManifestTransportClient,
  type JoorManifestUnaryRouteId,
  type LegacyRpcTransportClient,
  type ListenOptionsFor,
  type ListenOptions,
  type NetlifyFetchHandler,
  type NextHandler,
  type NextHandlerOptionsFor,
  type NextRouteHandler,
  type NextRouteHandlers,
  type NextRouteHandlersOptionsFor,
  type NodeServer,
  type NodeTransportBodyResult,
  type NodeTransportBodyResultFor,
  type NodeTransportBodyResultHandler,
  type NodeTransportBodyResultHandlerFor,
  type PendingRpcRequest,
  type Procedure,
  type ProcedureError,
  type ProcedureErrorCode,
  type ProcedureFailure,
  type ProcedureHasHeaders,
  type ProcedureHasResponseHeaders,
  type ProcedureInput,
  type ProcedureAuth,
  type ProcedureOutput,
  type ProcedureResponseHeaderValues,
  type ProcedureResponseHeaders,
  type ProcedureRequiresHeaders,
  type ProcedureRequiresResponseHeaders,
  type ProcedureRuntime,
  type ProcedureServices,
  type ProcedureSuccess,
  type RpcEnvelope,
  type RpcBatchRequest,
  type RpcBodyHandler,
  type RpcBodyResult,
  type RpcFailure,
  type RpcFrameworkErrorCode,
  type RpcManifest,
  type RpcManifestBody,
  type RpcManifestBodyResult,
  type RpcManifestBodyResultFor,
  type RpcManifestRouteBatchResults,
  type RpcManifestRouteEnvelopeUnion,
  type RpcManifestRouteResultUnion,
  type RpcManifestRouteBatchRequest,
  type RpcManifestRouteId,
  type RpcManifestRouteProtocolRequest,
  type RpcManifestRouteProtocolRequestUnion,
  type RpcManifestRequiredServices,
  type RpcManifestRouteServices,
  type RpcManifestRoutes,
  type RpcManifestRouteStreamProtocolRequest,
  type RpcManifestRouteStreamProtocolRequestUnion,
  type RpcManifestRouteUnaryProtocolRequest,
  type RpcManifestRouteUnaryProtocolRequestUnion,
  type RpcManifestStreamRouteId,
  type RpcManifestUnaryRouteId,
  type RpcProtocolEnvelope,
  type RpcProtocolError,
  type RpcRequestHandler,
  type RpcRequest,
  type RpcResponse,
  type RpcResponseHeaderValues,
  type RpcRouteError,
  type RpcRouteErrorCode,
  type RpcRouteErrorDetails,
  type RpcRouteEnvelope,
  type RpcRouteEnvelopeUnion,
  type RpcRouteResult,
  type RpcRouteResultUnion,
  type RpcRouteBody,
  type RpcRouteBodyResult,
  type RpcRouteBodyResultFor,
  type RpcRouteHasHeaders,
  type RpcRouteHasResponseHeaders,
  type RpcRouteRequest,
  type RpcRouteRequestUnion,
  type RpcRouteResponseHeaders,
  type RpcRouteRequiresHeaders,
  type RpcRouteRequiresResponseHeaders,
  type RpcRouteBatchRequest,
  type RpcRouteProtocolRequest,
  type RpcRouteProtocolRequestUnion,
  type RpcRouteStreamProtocolRequest,
  type RpcRouteStreamProtocolRequestUnion,
  type RpcRouteUnaryProtocolRequest,
  type RpcRouteUnaryProtocolRequestUnion,
  type RouteRpcTransportClient,
  type RpcManifestClientOptions,
  type RpcManifestTransportClient,
  type RpcSuccess,
  type RpcStreamProcedure,
  type RpcRouteClientArgs,
  type RpcRouteClientHeaders,
  type RpcRouteRequestOptions,
  type RpcStreamRouteId,
  type RpcUnaryProcedure,
  type RpcUnaryRouteId,
  type Schema,
  type SchemaMeta,
  type StringSchema,
  type NumberSchema,
  type ValidationResult,
  type OpenApiSchema,
  type JsonValue,
  type NetlifyFetchOptionsFor,
  type VercelFetchHandler,
  type VercelFetchOptionsFor,
} from '../src/index.js';
import {
  createAuthPolicy as createAuthPolicySubpath,
  type AuthPolicyAuth as AuthSubpathPolicyAuth,
  type AuthPolicyHeaders as AuthSubpathPolicyHeaders,
  type AuthPolicyResult as AuthSubpathPolicyResult,
  type AuthPolicyResultLike as AuthSubpathPolicyResultLike,
  type AuthPolicyServices as AuthSubpathPolicyServices,
} from '../src/auth/index.js';
import { createClient, createManifestClient } from '../src/rpc/client.js';
import {
  createAuthPolicy as createContextSubpathAuthPolicy,
  createPlugin as createContextSubpathPlugin,
  defineConfig as defineContextSubpathConfig,
  defineConfigFor as defineContextSubpathConfigFor,
  resolvePluginServices as resolveContextSubpathPluginServices,
  type AuthPolicy as ContextSubpathAuthPolicy,
  type AuthPolicyResult as ContextSubpathAuthPolicyResult,
  type AuthPolicyResultLike as ContextSubpathAuthPolicyResultLike,
  type DefineConfigFor as ContextSubpathDefineConfigFor,
  type JoorConfig as ContextSubpathConfig,
  type JoorConfigFor as ContextSubpathConfigFor,
  type JoorConfigContext as ContextSubpathConfigContext,
  type JoorContext as ContextSubpathJoorContext,
  type PluginServices as ContextSubpathPluginServices,
} from '../src/context/index.js';
import {
  defineConfigFor as defineConfigSubpathFor,
  type DefineConfigFor as ConfigSubpathDefineConfigFor,
  type JoorConfigFor as ConfigSubpathConfigFor,
  type JoorConfigContext as ConfigSubpathConfigContext,
} from '../src/config.js';
import {
  build as buildCompilerSubpath,
  createAiDocs as createCompilerSubpathAiDocs,
  createOpenApiDocument as createCompilerSubpathOpenApiDocument,
  type BuildOptions as CompilerSubpathBuildOptions,
  type CompilerManifest as CompilerSubpathManifest,
  type CompiledProcedureGenerationOptions as CompilerSubpathCompiledProcedureGenerationOptions,
  type CompiledProcedureMode as CompilerSubpathCompiledProcedureMode,
  type ProcedureFile as CompilerSubpathProcedureFile,
} from '../src/compiler/index.js';
import {
  createRpcBodyHandler as createRpcSubpathBodyHandler,
  createRpcBodyResultHandler as createRpcSubpathBodyResultHandler,
  createRpcHandler as createRpcSubpathHandler,
  createRpcTransportBodyResultHandler as createRpcSubpathTransportBodyResultHandler,
  defineHandlerOptions as defineRpcSubpathHandlerOptions,
  type BatchResults as RpcSubpathBatchResults,
  type ClientFetch as RpcSubpathClientFetch,
  type ClientOptions as RpcSubpathClientOptions,
  type ClientProcedureHeaders as RpcSubpathClientProcedureHeaders,
  type HandlerHookContext as RpcSubpathHandlerHookContext,
  type HandlerHookContextFor as RpcSubpathHandlerHookContextFor,
  type HandlerHooksFor as RpcSubpathHandlerHooksFor,
  type JoorMiddlewareFor as RpcSubpathJoorMiddlewareFor,
  type RpcManifestClientOptions as RpcSubpathManifestClientOptions,
  type RpcManifestTransportClient as RpcSubpathManifestTransportClient,
  type RpcManifestBody as RpcSubpathManifestBody,
  type RpcManifestBodyResultFor as RpcSubpathManifestBodyResultFor,
  type RpcManifestRouteResultUnion as RpcSubpathManifestRouteResultUnion,
  type RpcBodyHandler as RpcSubpathBodyHandler,
  type RpcRequestHandler as RpcSubpathRequestHandler,
  type RpcRouteBody as RpcSubpathRouteBody,
  type RpcRouteBodyResultFor as RpcSubpathRouteBodyResultFor,
  type RpcRouteClientArgs as RpcSubpathRouteClientArgs,
  type RpcRouteClientHeaders as RpcSubpathRouteClientHeaders,
  type RpcRouteErrorCode as RpcSubpathRouteErrorCode,
  type RpcRouteErrorDetails as RpcSubpathRouteErrorDetails,
  type RpcRouteEnvelope as RpcSubpathRouteEnvelope,
  type RpcRouteResult as RpcSubpathRouteResult,
  type RpcRouteResultUnion as RpcSubpathRouteResultUnion,
  type RpcRouteRequestOptions as RpcSubpathRouteRequestOptions,
  type RpcRouteRequiresHeaders as RpcSubpathRouteRequiresHeaders,
  type RpcRouteRequiresResponseHeaders as RpcSubpathRouteRequiresResponseHeaders,
  type RpcRouteProtocolRequest as RpcSubpathRouteProtocolRequest,
} from '../src/rpc/index.js';
import {
  defineManifest as defineManifestSubpath,
  type JoorManifestClientOptions as JoorSubpathManifestClientOptions,
  type JoorManifestRouteBody as JoorSubpathManifestRouteBody,
  type JoorManifestRouteBodyResultFor as JoorSubpathManifestRouteBodyResultFor,
  type JoorManifestRouteClientArgs as JoorSubpathManifestRouteClientArgs,
  type JoorManifestRouteClientHeaders as JoorSubpathManifestRouteClientHeaders,
  type JoorManifestRouteEnvelope as JoorSubpathManifestRouteEnvelope,
  type JoorManifestRouteEnvelopeUnion as JoorSubpathManifestRouteEnvelopeUnion,
  type JoorManifestRouteResult as JoorSubpathManifestRouteResult,
  type JoorManifestRouteResultUnion as JoorSubpathManifestRouteResultUnion,
  type JoorManifestRouteId as JoorSubpathManifestRouteId,
  type JoorManifestRouteInput as JoorSubpathManifestRouteInput,
  type JoorManifestRouteProtocolRequest as JoorSubpathManifestRouteProtocolRequest,
  type JoorManifestRouteRequestOptions as JoorSubpathManifestRouteRequestOptions,
  type JoorManifestRequiredServices as JoorSubpathManifestRequiredServices,
  type JoorManifestRouteServices as JoorSubpathManifestRouteServices,
  type JoorManifestRouteStreamProtocolRequest as JoorSubpathManifestRouteStreamProtocolRequest,
  type JoorManifestRoutes as JoorSubpathManifestRoutes,
  type JoorManifestTransportClient as JoorSubpathManifestTransportClient,
} from '../src/manifest.js';
import {
  defineProcedure as defineProcedureSubpath,
  failure as procedureFailureSubpath,
  ok as procedureOkSubpath,
  type ProcedureErrorDetails as SubpathProcedureErrorDetails,
  type ProcedureFailure as SubpathProcedureFailure,
  type ProcedureInput as SubpathProcedureInput,
  type ProcedureOutput as SubpathProcedureOutput,
  type ProcedureResult as SubpathProcedureResult,
  type ProcedureHasResponseHeaders as SubpathProcedureHasResponseHeaders,
  type ProcedureResponseHeaders as SubpathProcedureResponseHeaders,
  type ProcedureRequiresResponseHeaders as SubpathProcedureRequiresResponseHeaders,
  type RpcEnvelope as SubpathProcedureRpcEnvelope,
  type StreamEvent as SubpathStreamEvent,
} from '../src/procedure/index.js';
import {
  isJsonObject as isSchemaSubpathJsonObject,
  t as schemaSubpathT,
  toJsonSchema as toSchemaSubpathJsonSchema,
  validate as validateSchemaSubpath,
  type Infer as SchemaSubpathInfer,
  type JsonObject as SchemaSubpathJsonObject,
  type JsonValue as SchemaSubpathJsonValue,
  type OpenApiSchema as SchemaSubpathOpenApiSchema,
  type Schema as SchemaSubpathSchema,
  type ValidationResult as SchemaSubpathValidationResult,
} from '../src/schema/index.js';
import {
  createDenoRpcRequestHandler as createStandaloneDenoRpcRequestHandler,
  createDenoTransportRequestHandler as createStandaloneDenoTransportRequestHandler,
  createDenoTransportRequestHandlerWithPath as createStandaloneDenoTransportRequestHandlerWithPath,
  serveDeno as serveStandaloneDeno,
  type DenoRpcRequestHandler as StandaloneDenoRpcRequestHandler,
  type DenoServer as StandaloneDenoServer,
  type DenoServeOptionsFor as StandaloneDenoServeOptionsFor,
  type DenoServeOptions as StandaloneDenoServeOptions,
  type DenoTransportBodyResult as StandaloneDenoTransportBodyResult,
  type DenoTransportBodyResultFor as StandaloneDenoTransportBodyResultFor,
  type DenoTransportBodyResultHandler as StandaloneDenoTransportBodyResultHandler,
  type DenoTransportBodyResultHandlerFor as StandaloneDenoTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler as StandaloneDenoTransportRequestHandler,
} from '../src/runtime/deno-transport.js';
import {
  createDenoCompiledTransportRequestHandlerWithPath,
  type DenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler,
} from '../src/runtime/deno-compiled-transport.js';
import {
  compiledUncachedExecutionState,
  compiledAuthenticate,
  compiledAuthenticateUncached,
  createCompiledRpcHandler,
  createCompiledRpcTransportBodyResultHandler,
  createCompiledRuntimeState,
  type executeCompiledProcedure,
} from '../src/runtime/compiled.js';
import {
  createProcedureCacheKey,
  type CachedProcedureHeaders,
  type CachedProcedureSuccess,
  type ProcedureCacheHeaderValues,
} from '../src/runtime/internal/procedure-cache.js';
import type {
  CompiledAuthResult,
  CompiledAuthResultLike,
  CompiledDispatch,
  CompiledFixedUnaryDispatch,
  CompiledRpcBodyResultHandlerFor,
  CompiledRpcRequestHandler,
  CompiledRpcTransportBodyResultHandlerFor,
  CompiledRuntimeState,
  CompiledSerializedEnvelope,
} from '../src/runtime/compiled.js';
import {
  createBunTransportRequestHandler as createRuntimeSubpathBunTransportRequestHandler,
  createCloudflareWorker as createRuntimeSubpathCloudflareWorker,
  createDenoTransportRequestHandler as createRuntimeSubpathDenoTransportRequestHandler,
  createJoorHandler as createRuntimeSubpathJoorHandler,
  createNetlifyFetch as createRuntimeSubpathNetlifyFetch,
  createNextHandler as createRuntimeSubpathNextHandler,
  createNextRouteHandlers as createRuntimeSubpathNextRouteHandlers,
  createNodeTransportRequestHandler as createRuntimeSubpathNodeTransportRequestHandler,
  createVercelFetch as createRuntimeSubpathVercelFetch,
  type BunFetchHandler as RuntimeSubpathBunFetchHandler,
  type BunRpcRequestHandler as RuntimeSubpathBunRpcRequestHandler,
  type BunTransportBodyResultFor as RuntimeSubpathBunTransportBodyResultFor,
  type BunTransportBodyResultHandler as RuntimeSubpathBunTransportBodyResultHandler,
  type BunTransportBodyResultHandlerFor as RuntimeSubpathBunTransportBodyResultHandlerFor,
  type BunTransportRequestHandler as RuntimeSubpathBunTransportRequestHandler,
  type CloudflareFetchHandler as RuntimeSubpathCloudflareFetchHandler,
  type CompiledRpcRequestHandler as RuntimeSubpathCompiledRpcRequestHandler,
  type DenoCompiledTransportBodyResult as RuntimeSubpathDenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor as RuntimeSubpathDenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler as RuntimeSubpathDenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler as RuntimeSubpathDenoCompiledTransportRequestHandler,
  type DenoFetchHandler as RuntimeSubpathDenoFetchHandler,
  type DenoRpcRequestHandler as RuntimeSubpathDenoRpcRequestHandler,
  type DenoTransportBodyResult as RuntimeSubpathDenoTransportBodyResult,
  type DenoTransportBodyResultFor as RuntimeSubpathDenoTransportBodyResultFor,
  type DenoTransportBodyResultHandlerFor as RuntimeSubpathDenoTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler as RuntimeSubpathDenoTransportRequestHandler,
  type JoorFetchHandler as RuntimeSubpathJoorFetchHandler,
  type JoorHandlerOptionsFor as RuntimeSubpathJoorHandlerOptionsFor,
  type NetlifyFetchHandler as RuntimeSubpathNetlifyFetchHandler,
  type NetlifyFetchOptionsFor as RuntimeSubpathNetlifyFetchOptionsFor,
  type NextHandler as RuntimeSubpathNextHandler,
  type NextHandlerOptionsFor as RuntimeSubpathNextHandlerOptionsFor,
  type NextRouteHandler as RuntimeSubpathNextRouteHandler,
  type NextRouteHandlers as RuntimeSubpathNextRouteHandlers,
  type NextRouteHandlersOptionsFor as RuntimeSubpathNextRouteHandlersOptionsFor,
  type NodeTransportBodyResultHandler as RuntimeSubpathNodeTransportBodyResultHandler,
  type NodeTransportBodyResultFor as RuntimeSubpathNodeTransportBodyResultFor,
  type NodeTransportBodyResultHandlerFor as RuntimeSubpathNodeTransportBodyResultHandlerFor,
  type VercelFetchHandler as RuntimeSubpathVercelFetchHandler,
  type VercelFetchOptionsFor as RuntimeSubpathVercelFetchOptionsFor,
  type CloudflareWorkerOptionsFor as RuntimeSubpathCloudflareWorkerOptionsFor,
} from '../src/runtime/index.js';

const usersPlugin = createPlugin({
  name: 'users',
  setup() {
    return {
      users: {
        findById(id: string) {
          return { id, name: 'Ada' };
        },
      },
    };
  },
});

const config = defineConfig({ plugins: [usersPlugin] as const });
type Services = JoorConfigContext<typeof config>;
type RootPluginServices = PluginServices<readonly [typeof usersPlugin]>;
const rootPluginServices: RootPluginServices = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
rootPluginServices.users.findById('1').name.toUpperCase();
const configWithServiceAwareHooks = defineConfig({
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      context.services.users.findById('1').name.toUpperCase();
      return undefined;
    },
  },
  middleware: [
    {
      name: 'config-audit',
      afterResponse(response, _request, context) {
        context.services.users.findById('1').name.toUpperCase();
        return response;
      },
    },
  ],
});
type ConfigWithHookServices = JoorConfigContext<
  typeof configWithServiceAwareHooks
>;
const configWithHookServices: ConfigWithHookServices = rootPluginServices;
configWithHookServices.users.findById('1').name.toUpperCase();
const _configWithoutHookPlugins = defineConfig({
  hooks: {
    beforeRequest(_request, context) {
      // @ts-expect-error config hooks without plugins do not expose plugin services.
      context.services.users;
      return undefined;
    },
  },
});
_configWithoutHookPlugins;
resolvePluginServices([usersPlugin] as const).then((services) => {
  services.users.findById('1').name.toUpperCase();
});
const defaultProcedureServices: ProcedureServices<Procedure> = {};
// @ts-expect-error default procedure types do not expose plugin services.
defaultProcedureServices.users;
const annotatedConfig: JoorConfig<readonly [typeof usersPlugin]> = {
  plugins: [usersPlugin] as const,
};
type AnnotatedConfigServices = JoorConfigContext<typeof annotatedConfig>;
const annotatedConfigServices: AnnotatedConfigServices = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
annotatedConfigServices.users.findById('1').name.toUpperCase();

const procedure = defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string()),
    'x-tenant-id': t.string(),
  }),
  output: t.object({ id: t.string(), name: t.string() }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  async handler(ctx, input) {
    ctx.headers['x-tenant-id'].toUpperCase();
    ctx.headers.authorization?.toUpperCase();
    // @ts-expect-error ctx.error details must match the declared error schema.
    ctx.error('NOT_FOUND', { missing: 'message' });
    // @ts-expect-error ctx.error code must be declared by the procedure.
    ctx.error('UNDECLARED', { message: 'Nope' });
    const user = ctx.services.users.findById(input.id);
    // @ts-expect-error ctx.ok requires declared response headers.
    ctx.ok(user);
    // @ts-expect-error ctx.ok response headers must match the declared schema.
    ctx.ok(user, { missing: 'cache-control' });
    return ctx.ok(user, { 'cache-control': 'private' });
  },
});
const _readRootContextOkResult = (
  ctx: JoorContext<
    Services,
    { 'x-tenant-id': string },
    { 'cache-control': string },
    Record<string, never>
  >
) => {
  const result = ctx.ok(
    { id: '1', name: 'Ada' },
    { 'cache-control': 'private' }
  );
  result.headers['cache-control'].toUpperCase();
  // @ts-expect-error ctx.ok results preserve declared response header keys.
  result.headers.missing;
};
_readRootContextOkResult;

defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string(), name: t.string() }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  // @ts-expect-error manual success results must include declared response headers.
  handler(_ctx, input) {
    return {
      kind: 'success' as const,
      data: { id: input.id, name: 'Ada' },
    };
  },
});

const authPolicy = createAuthPolicy<
  Services,
  Record<string, never>,
  { userId: string }
>({
  name: 'session',
  authenticate(ctx) {
    ctx.services.users.findById('1');
    return { userId: '1' };
  },
});
type AuthPolicyServicesFromRoot = AuthPolicyServices<typeof authPolicy>;
const authPolicyServicesFromRoot: AuthPolicyServicesFromRoot = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
authPolicyServicesFromRoot.users.findById('1').name.toUpperCase();
const _authPolicyHeadersFromRoot: AuthPolicyHeaders<typeof authPolicy> = {};
_authPolicyHeadersFromRoot;
const authPolicyHeaderValues: AuthPolicyHeaderValues = {
  authorization: 'Bearer token',
  'x-optional': undefined,
};
authPolicyHeaderValues['authorization']?.toUpperCase();
type _WrongAuthPolicyHeaderValues = AuthPolicy<
  Services,
  // @ts-expect-error auth policy headers must be HTTP string values.
  { authorization: number },
  { userId: string }
>;
const authPolicyAuthFromRoot: AuthPolicyAuth<typeof authPolicy> = {
  userId: '1',
};
authPolicyAuthFromRoot.userId.toUpperCase();
const authPolicyResultFromRoot: AuthPolicyResult<
  AuthPolicyAuth<typeof authPolicy>
> = authPolicyAuthFromRoot;
const authPolicyFailureFromRoot: AuthPolicyResult<
  AuthPolicyAuth<typeof authPolicy>
> = {
  kind: 'error',
  error: {
    code: 'UNAUTHORIZED',
    message: 'Missing session',
    status: 401,
  },
};
authPolicyFailureFromRoot.error.code.toUpperCase();
const authPolicyResultLikeFromRoot: AuthPolicyResultLike<
  AuthPolicyAuth<typeof authPolicy>
> = Promise.resolve(authPolicyResultFromRoot);
Promise.resolve(authPolicyResultLikeFromRoot).then((result) => {
  result.valueOf();
});
const authSubpathPolicy = createAuthPolicySubpath.withContext<Services>()<
  { authorization: string },
  { userId: string; tenantId: string }
>({
  name: 'session-headers',
  authenticate(ctx) {
    ctx.services.users.findById('1');
    ctx.headers.authorization.toUpperCase();
    return { userId: '1', tenantId: 'tenant-1' };
  },
});
const authSubpathServices: AuthSubpathPolicyServices<typeof authSubpathPolicy> =
  authPolicyServicesFromRoot;
authSubpathServices.users.findById('1');
const authSubpathHeaders: AuthSubpathPolicyHeaders<typeof authSubpathPolicy> = {
  authorization: 'Bearer token',
};
authSubpathHeaders.authorization.toUpperCase();
const authSubpathAuth: AuthSubpathPolicyAuth<typeof authSubpathPolicy> = {
  userId: '1',
  tenantId: 'tenant-1',
};
authSubpathAuth.tenantId.toUpperCase();
const authSubpathResult: AuthSubpathPolicyResult<
  AuthSubpathPolicyAuth<typeof authSubpathPolicy>
> = authSubpathAuth;
const authSubpathResultLike: AuthSubpathPolicyResultLike<
  AuthSubpathPolicyAuth<typeof authSubpathPolicy>
> = Promise.resolve(authSubpathResult);
Promise.resolve(authSubpathResultLike).then((result) => result.valueOf());

const authenticatedProcedure = defineProcedure.withContext<Services>()({
  input: t.object({ ok: t.boolean() }),
  output: t.object({ userId: t.string() }),
  auth: authPolicy,
  async handler(ctx) {
    ctx.auth.userId.toUpperCase();
    return ctx.ok({ userId: ctx.auth.userId });
  },
});
type AuthenticatedProcedureErrorCodeIsNever = [
  ProcedureErrorCode<typeof authenticatedProcedure>,
] extends [never]
  ? true
  : false;
const authenticatedProcedureErrorCodeIsNever: AuthenticatedProcedureErrorCodeIsNever = true;
authenticatedProcedureErrorCodeIsNever.valueOf();
type AuthenticatedProcedureErrorIsNever = [
  ProcedureError<typeof authenticatedProcedure>,
] extends [never]
  ? true
  : false;
const authenticatedProcedureErrorIsNever: AuthenticatedProcedureErrorIsNever = true;
authenticatedProcedureErrorIsNever.valueOf();
const authenticatedHeaderProcedure = defineProcedure.withContext<Services>()({
  input: t.object({ ok: t.boolean() }),
  headers: t.object({ authorization: t.string() }),
  output: t.object({ tenantId: t.string() }),
  auth: authSubpathPolicy,
  handler(ctx) {
    ctx.auth.tenantId.toUpperCase();
    return ctx.ok({ tenantId: ctx.auth.tenantId });
  },
});
authenticatedHeaderProcedure.auth?.name.toUpperCase();
const authenticatedHeaderProcedureRequiresHeaders: ProcedureRequiresHeaders<
  typeof authenticatedHeaderProcedure
> = true;
authenticatedHeaderProcedureRequiresHeaders.valueOf();

defineProcedure.withContext<Services>()({
  input: t.object({ ok: t.boolean() }),
  output: t.object({ tenantId: t.string() }),
  // @ts-expect-error auth policies with required headers require matching procedure headers.
  auth: authSubpathPolicy,
  handler() {
    return { tenantId: 'tenant-1' };
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
defineProcedure({
  input: t.object({ userId: t.string() }),
  // @ts-expect-error stream procedures cannot declare response headers.
  responseHeaders: t.object({ 'cache-control': t.string() }),
  stream: t.object({
    type: t.literal('user.updated'),
    userId: t.string(),
  }),
  async *handler(_ctx, input) {
    yield { type: 'user.updated' as const, userId: input.userId };
  },
});
const _streamProcedureResponseHeaders: ProcedureResponseHeaders<
  typeof streamProcedure
> = {};
_streamProcedureResponseHeaders;
type StreamProcedureOutputIsNever = [
  ProcedureOutput<typeof streamProcedure>,
] extends [never]
  ? true
  : false;
const streamProcedureOutputIsNever: StreamProcedureOutputIsNever = true;
streamProcedureOutputIsNever.valueOf();
const subpathStreamEvent: SubpathStreamEvent<typeof streamProcedure> = {
  type: 'user.updated',
  userId: '1',
};
subpathStreamEvent.userId.toUpperCase();

const authShape: ProcedureAuth<typeof authenticatedProcedure> = {
  userId: '1',
};
authShape.userId.toUpperCase();

const validInput: ProcedureInput<typeof procedure> = { id: '1' };
validInput.id.toUpperCase();
const procedureServices: ProcedureServices<typeof procedure> = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
procedureServices.users.findById('1').name.toUpperCase();
const procedureHasHeaders: ProcedureHasHeaders<typeof procedure> = true;
procedureHasHeaders.valueOf();
const procedureRequiresHeaders: ProcedureRequiresHeaders<typeof procedure> =
  true;
procedureRequiresHeaders.valueOf();
const authenticatedProcedureHasHeaders: ProcedureHasHeaders<
  typeof authenticatedProcedure
> = false;
authenticatedProcedureHasHeaders.valueOf();
const authenticatedProcedureRequiresHeaders: ProcedureRequiresHeaders<
  typeof authenticatedProcedure
> = false;
authenticatedProcedureRequiresHeaders.valueOf();
const procedureHasResponseHeaders: ProcedureHasResponseHeaders<
  typeof procedure
> = true;
procedureHasResponseHeaders.valueOf();
const procedureRequiresResponseHeaders: ProcedureRequiresResponseHeaders<
  typeof procedure
> = true;
procedureRequiresResponseHeaders.valueOf();
const authenticatedProcedureHasResponseHeaders: ProcedureHasResponseHeaders<
  typeof authenticatedProcedure
> = false;
authenticatedProcedureHasResponseHeaders.valueOf();
const authenticatedProcedureRequiresResponseHeaders: ProcedureRequiresResponseHeaders<
  typeof authenticatedProcedure
> = false;
authenticatedProcedureRequiresResponseHeaders.valueOf();
const optionalResponseHeaderProcedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  responseHeaders: t.object({ etag: t.optional(t.string()) }),
  handler(ctx, input) {
    return ctx.ok({ id: input.id });
  },
});
const optionalProcedureHasResponseHeaders: ProcedureHasResponseHeaders<
  typeof optionalResponseHeaderProcedure
> = true;
optionalProcedureHasResponseHeaders.valueOf();
const optionalProcedureRequiresResponseHeaders: ProcedureRequiresResponseHeaders<
  typeof optionalResponseHeaderProcedure
> = false;
optionalProcedureRequiresResponseHeaders.valueOf();
const subpathProcedureHasResponseHeaders: SubpathProcedureHasResponseHeaders<
  typeof optionalResponseHeaderProcedure
> = true;
subpathProcedureHasResponseHeaders.valueOf();
const subpathProcedureRequiresResponseHeaders: SubpathProcedureRequiresResponseHeaders<
  typeof optionalResponseHeaderProcedure
> = false;
subpathProcedureRequiresResponseHeaders.valueOf();
const executeCompiledProcedureServices: Parameters<
  typeof executeCompiledProcedure<typeof procedure>
>[4] = procedureServices;
executeCompiledProcedureServices.users.findById('1');
// @ts-expect-error compiled procedure execution requires selected procedure services.
const _missingExecuteCompiledProcedureServices: Parameters<
  typeof executeCompiledProcedure<typeof procedure>
>[4] = {};

// @ts-expect-error id is required and must be a string.
const _invalidInput: ProcedureInput<typeof procedure> = { id: 1 };
_invalidInput;

const validOutput: ProcedureOutput<typeof procedure> = {
  id: '1',
  name: 'Ada',
};
validOutput.name.toUpperCase();
const procedureEnvelope: RpcEnvelope<
  { id: string; name: string },
  'users.get'
> = {
  ok: true,
  id: 'users.get',
  data: validOutput,
  traceId: 'trace-1',
};
const procedureEnvelopeId: 'users.get' = procedureEnvelope.id;
procedureEnvelopeId.toUpperCase();
const procedureEnvelopeWithHeaders: RpcEnvelope<
  { id: string; name: string },
  'users.get',
  { 'cache-control': string }
> = {
  ok: true,
  id: 'users.get',
  data: validOutput,
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
};
procedureEnvelopeWithHeaders.headers['cache-control'].toUpperCase();
const _wrongProcedureEnvelopeHeaders: RpcEnvelope<
  { id: string; name: string },
  'users.get',
  { 'x-retry-count': number }
> = {
  ok: true,
  id: 'users.get',
  data: validOutput,
  headers: {
    // @ts-expect-error procedure envelopes require HTTP string response headers.
    'x-retry-count': 1,
  },
  traceId: 'trace-1',
};
_wrongProcedureEnvelopeHeaders.id.toUpperCase();
// @ts-expect-error procedure envelopes preserve route id literals.
const _wrongProcedureEnvelopeId: 'users.authenticated' = procedureEnvelope.id;
const procedureErrorCode: ProcedureErrorCode<typeof procedure> = 'NOT_FOUND';
procedureErrorCode.toUpperCase();
// @ts-expect-error procedure error codes only include declared errors.
const _wrongProcedureErrorCode: ProcedureErrorCode<typeof procedure> =
  'UNDECLARED';
const _missingProcedureFailureDetails: ProcedureFailure<
  'NOT_FOUND',
  { message: string }
> = {
  kind: 'error',
  // @ts-expect-error procedure failures with specific details require details.
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
  },
};
const subpathProcedure = defineProcedureSubpath({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string(), name: t.string() }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  handler(ctx, input) {
    return ctx.ok({ id: input.id, name: 'Ada' });
  },
});
const subpathProcedureInput: SubpathProcedureInput<typeof subpathProcedure> = {
  id: '1',
};
subpathProcedureInput.id.toUpperCase();
const subpathProcedureOutput: SubpathProcedureOutput<typeof subpathProcedure> =
  { id: '1', name: 'Ada' };
subpathProcedureOutput.name.toUpperCase();
const subpathProcedureErrorDetails: SubpathProcedureErrorDetails<
  typeof subpathProcedure,
  'NOT_FOUND'
> = { message: 'Missing' };
subpathProcedureErrorDetails.message.toUpperCase();
const subpathProcedureResult: SubpathProcedureResult<
  { id: string; name: string },
  'NOT_FOUND',
  { message: string }
> = procedureOkSubpath({ id: '1', name: 'Ada' });
const procedureResponseHeaderValues: ProcedureResponseHeaderValues = {
  'cache-control': 'private',
  etag: 'v1',
};
procedureResponseHeaderValues['cache-control']?.toUpperCase();
procedureOkSubpath({ id: '1', name: 'Ada' }, procedureResponseHeaderValues);
const requiredProcedureSuccess: ProcedureSuccess<
  { id: string; name: string },
  { 'cache-control': string }
> = {
  kind: 'success',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
};
requiredProcedureSuccess.headers['cache-control'].toUpperCase();
// @ts-expect-error procedure successes require declared response headers.
const _missingProcedureSuccessHeaders: ProcedureSuccess<
  { id: string; name: string },
  { 'cache-control': string }
> = {
  kind: 'success',
  data: { id: '1', name: 'Ada' },
};
_missingProcedureSuccessHeaders.data.name.toUpperCase();
const optionalProcedureSuccess: ProcedureSuccess<
  { id: string },
  { etag?: string }
> = {
  kind: 'success',
  data: { id: '1' },
};
optionalProcedureSuccess.headers?.etag?.toUpperCase();
procedureOkSubpath(
  { id: '1', name: 'Ada' },
  // @ts-expect-error manual success headers must be HTTP string values.
  { 'x-retry-count': 1 }
);
const _wrongProcedureSuccessHeaders: ProcedureSuccess<
  { id: string; name: string },
  { 'x-retry-count': number }
> = {
  kind: 'success',
  data: { id: '1', name: 'Ada' },
  headers: {
    // @ts-expect-error procedure success headers must be HTTP string values.
    'x-retry-count': 1,
  },
};
_wrongProcedureSuccessHeaders.data.name.toUpperCase();
const _wrongProcedureResultHeaders: SubpathProcedureResult<
  { id: string; name: string },
  'NOT_FOUND',
  { message: string },
  { 'x-retry-count': number }
> = {
  kind: 'success',
  data: { id: '1', name: 'Ada' },
  headers: {
    // @ts-expect-error procedure result headers must be HTTP string values.
    'x-retry-count': 1,
  },
};
if (_wrongProcedureResultHeaders.kind === 'success') {
  _wrongProcedureResultHeaders.data.name.toUpperCase();
}
if (subpathProcedureResult.kind === 'success') {
  subpathProcedureResult.data.name.toUpperCase();
}
const subpathProcedureEnvelope: SubpathProcedureRpcEnvelope<
  { id: string; name: string },
  'users.get'
> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  traceId: 'trace-1',
};
const subpathProcedureEnvelopeId: 'users.get' = subpathProcedureEnvelope.id;
subpathProcedureEnvelopeId.toUpperCase();
const subpathProcedureEnvelopeWithHeaders: SubpathProcedureRpcEnvelope<
  { id: string; name: string },
  'users.get',
  { 'cache-control': string }
> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
};
subpathProcedureEnvelopeWithHeaders.headers['cache-control'].toUpperCase();
const subpathProcedureFailure = procedureFailureSubpath(
  'NOT_FOUND',
  subpathProcedureErrorDetails
);
if (subpathProcedureFailure.kind === 'error') {
  subpathProcedureFailure.error.details.message.toUpperCase();
}
const _missingSubpathProcedureFailureDetails: SubpathProcedureFailure<
  'NOT_FOUND',
  { message: string }
> = {
  kind: 'error',
  // @ts-expect-error procedure failures with specific details require details.
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
  },
};

const rootUserSchema = t.object({
  id: t.string().uuid(),
  email: t.string().email(),
  tags: t.array(t.string()),
  nickname: t.string().optional(),
});
const rootSchema: Schema = rootUserSchema;
rootSchema.kind.toUpperCase();
const rootStringSchema: StringSchema = t.string().min(1);
rootStringSchema.kind.toUpperCase();
const rootSchemaMeta: SchemaMeta = { description: 'User payload' };
rootSchemaMeta.description?.toUpperCase();
const rootHeaderValueSchema: HeaderValueSchema = t.string().optional();
rootHeaderValueSchema.kind.toUpperCase();
const rootHeaderSchema: HeaderObjectSchema = t.object({
  authorization: t.string().optional(),
  'x-route-mode': t.enum(['read', 'write']),
});
const authorizationHeaderSchema = rootHeaderSchema.shape['authorization'];
authorizationHeaderSchema?.kind.toUpperCase();
// @ts-expect-error header schemas must be object schemas.
const _wrongHeaderSchema: HeaderObjectSchema = t.string();
// @ts-expect-error header schema values must be string-like HTTP values.
const _wrongHeaderValueSchema: HeaderObjectSchema = t.object({
  'x-retry-count': t.number(),
});
type _WrongProcedureHeaderGeneric = Procedure<
  typeof rootUserSchema,
  typeof rootUserSchema,
  Record<string, never>,
  undefined,
  // @ts-expect-error procedure header generics must use header object schemas.
  NumberSchema
>;
type _WrongProcedureResponseHeaderGeneric = Procedure<
  typeof rootUserSchema,
  typeof rootUserSchema,
  Record<string, never>,
  undefined,
  undefined,
  // @ts-expect-error procedure response header generics must use header object schemas.
  NumberSchema
>;
const rootProcedureRuntimeWithHeaders: ProcedureRuntime = {
  input: rootUserSchema,
  headers: rootHeaderSchema,
  responseHeaders: rootHeaderSchema,
  errors: {},
  meta: {},
  handler() {
    return {};
  },
};
rootProcedureRuntimeWithHeaders.headers?.kind.toUpperCase();
const _wrongRuntimeHeaderSchema: ProcedureRuntime = {
  input: rootUserSchema,
  // @ts-expect-error runtime procedure headers must use header object schemas.
  headers: t.object({ 'x-retry-count': t.number() }),
  errors: {},
  meta: {},
  handler() {
    return {};
  },
};
_wrongRuntimeHeaderSchema.input.kind.toUpperCase();
const _wrongRuntimeResponseHeaderSchema: ProcedureRuntime = {
  input: rootUserSchema,
  // @ts-expect-error runtime procedure response headers must use header object schemas.
  responseHeaders: t.object({ 'x-retry-count': t.number() }),
  errors: {},
  meta: {},
  handler() {
    return {};
  },
};
_wrongRuntimeResponseHeaderSchema.input.kind.toUpperCase();
const rootArrayChain: ArrayChain<typeof rootStringSchema> = t
  .array(rootStringSchema)
  .min(1);
rootArrayChain.item.kind.toUpperCase();
const rootUserValue: Infer<typeof rootUserSchema> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'ada@example.com',
  tags: ['member'],
};
rootUserValue.email.toUpperCase();
const rootParsedJson: JsonValue = parseJson(
  '{"id":"550e8400-e29b-41d4-a716-446655440000","email":"ada@example.com","tags":["member"]}'
);
const rootJsonPrimitive: JsonPrimitive = 'value';
rootJsonPrimitive.toUpperCase();
if (isJsonObject(rootParsedJson)) {
  const rootJsonObject: JsonObject = rootParsedJson;
  rootJsonObject['email'];
}
const rootValidation: ValidationResult<Infer<typeof rootUserSchema>> = validate(
  rootUserSchema,
  rootParsedJson
);
if (rootValidation.ok) {
  rootValidation.value.tags[0]?.toUpperCase();
}
const rootOpenApiSchema: OpenApiSchema = toJsonSchema(rootUserSchema);
rootOpenApiSchema['type'];

const schemaSubpathUserSchema = schemaSubpathT.object({
  id: schemaSubpathT.string(),
  email: schemaSubpathT.string().email(),
  roles: schemaSubpathT.array(schemaSubpathT.enum(['admin', 'member'])),
  nickname: schemaSubpathT.string().optional(),
});
const schemaSubpathSchema: SchemaSubpathSchema = schemaSubpathUserSchema;
schemaSubpathSchema.kind.toUpperCase();
const schemaSubpathUser: SchemaSubpathInfer<typeof schemaSubpathUserSchema> = {
  id: '1',
  email: 'ada@example.com',
  roles: ['admin'],
};
schemaSubpathUser.roles[0]?.toUpperCase();
const schemaSubpathRouteSchema = schemaSubpathT.object({
  status: schemaSubpathT
    .literal('active')
    .describe('Status discriminator')
    .optional(),
  role: schemaSubpathT.enum(['admin', 'member']).nullable(),
  filter: schemaSubpathT
    .union([schemaSubpathT.string(), schemaSubpathT.number()])
    .optional(),
  metadata: schemaSubpathT.record(schemaSubpathT.string()).optional(),
  raw: schemaSubpathT.json().nullable(),
});
const schemaSubpathRouteValue: SchemaSubpathInfer<
  typeof schemaSubpathRouteSchema
> = {
  role: null,
  filter: 'Ada',
  metadata: { source: 'test' },
  raw: { ok: true },
};
schemaSubpathRouteValue.filter?.valueOf();
const schemaSubpathLiteralStatus: 'active' | undefined =
  schemaSubpathRouteValue.status;
schemaSubpathLiteralStatus?.toUpperCase();
const schemaSubpathJson: SchemaSubpathJsonValue = schemaSubpathUser;
if (isSchemaSubpathJsonObject(schemaSubpathJson)) {
  const schemaSubpathObject: SchemaSubpathJsonObject = schemaSubpathJson;
  schemaSubpathObject['id'];
}
const schemaSubpathValidation: SchemaSubpathValidationResult<
  SchemaSubpathInfer<typeof schemaSubpathUserSchema>
> = validateSchemaSubpath(schemaSubpathUserSchema, schemaSubpathJson);
if (schemaSubpathValidation.ok) {
  schemaSubpathValidation.value.email.toUpperCase();
}
const schemaSubpathJsonSchema: SchemaSubpathOpenApiSchema =
  toSchemaSubpathJsonSchema(schemaSubpathUserSchema);
schemaSubpathJsonSchema['type'];
const schemaSubpathProcedure = defineProcedureSubpath({
  input: schemaSubpathT.object({ id: schemaSubpathT.string() }),
  output: schemaSubpathT.object({ user: schemaSubpathUserSchema }),
  handler(ctx, input) {
    return ctx.ok({
      user: {
        id: input.id,
        email: 'ada@example.com',
        roles: ['member'],
      },
    });
  },
});
const schemaSubpathProcedureInput: SubpathProcedureInput<
  typeof schemaSubpathProcedure
> = { id: '1' };
schemaSubpathProcedureInput.id.toUpperCase();
const schemaSubpathProcedureOutput: SubpathProcedureOutput<
  typeof schemaSubpathProcedure
> = {
  user: {
    id: '1',
    email: 'ada@example.com',
    roles: ['member'],
  },
};
schemaSubpathProcedureOutput.user.email.toUpperCase();

const contextSubpathPlugin = createContextSubpathPlugin({
  name: 'audit',
  setup() {
    return {
      audit: {
        record(action: string) {
          return action.length;
        },
      },
    };
  },
});
type ContextSubpathServices = ContextSubpathPluginServices<
  [typeof contextSubpathPlugin]
>;
const contextSubpathServices: ContextSubpathServices = {
  audit: {
    record(action) {
      return action.length;
    },
  },
};
contextSubpathServices.audit.record('view');
resolveContextSubpathPluginServices([contextSubpathPlugin] as const).then(
  (services) => {
    services.audit.record('view').toFixed();
  }
);
const contextSubpathConfig = defineContextSubpathConfig({
  plugins: [contextSubpathPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      context.services.audit.record('config');
      return undefined;
    },
  },
});
type ContextSubpathConfigServices = ContextSubpathConfigContext<
  typeof contextSubpathConfig
>;
const contextSubpathConfigServices: ContextSubpathConfigServices =
  contextSubpathServices;
contextSubpathConfigServices.audit.record('config');
const annotatedContextSubpathConfig: ContextSubpathConfig<
  readonly [typeof contextSubpathPlugin]
> = {
  plugins: [contextSubpathPlugin] as const,
};
type AnnotatedContextSubpathConfigServices = ContextSubpathConfigContext<
  typeof annotatedContextSubpathConfig
>;
const annotatedContextSubpathConfigServices: AnnotatedContextSubpathConfigServices =
  contextSubpathServices;
annotatedContextSubpathConfigServices.audit.record('config');
const contextSubpathAuthPolicy = createContextSubpathAuthPolicy<
  ContextSubpathConfigServices,
  { authorization: string },
  { userId: string }
>({
  name: 'session',
  authenticate(ctx) {
    ctx.services.audit.record(ctx.headers.authorization);
    return { userId: '1' };
  },
});
const contextSubpathTypedPolicy: ContextSubpathAuthPolicy<
  ContextSubpathConfigServices,
  { authorization: string },
  { userId: string }
> = contextSubpathAuthPolicy;
contextSubpathTypedPolicy.name.toUpperCase();
const contextSubpathAuthResult: ContextSubpathAuthPolicyResult<{
  userId: string;
}> = { userId: '1' };
contextSubpathAuthResult.userId.toUpperCase();
const contextSubpathAuthResultLike: ContextSubpathAuthPolicyResultLike<{
  userId: string;
}> = Promise.resolve(contextSubpathAuthResult);
Promise.resolve(contextSubpathAuthResultLike).then((result) =>
  result.valueOf()
);
const _readContextSubpathContext = (
  ctx: ContextSubpathJoorContext<
    ContextSubpathConfigServices,
    { authorization: string },
    Record<string, never>,
    { userId: string }
  >
) => {
  ctx.services.audit.record(ctx.headers.authorization);
  ctx.auth.userId.toUpperCase();
};
_readContextSubpathContext;
const contextSubpathProcedure =
  defineProcedureSubpath.withContext<ContextSubpathConfigServices>()({
    input: schemaSubpathT.object({ action: schemaSubpathT.string() }),
    headers: schemaSubpathT.object({ authorization: schemaSubpathT.string() }),
    output: schemaSubpathT.object({
      recorded: schemaSubpathT.number(),
      userId: schemaSubpathT.string(),
    }),
    auth: contextSubpathAuthPolicy,
    handler(ctx, input) {
      const recorded = ctx.services.audit.record(input.action);
      return ctx.ok({ recorded, userId: ctx.auth.userId });
    },
  });
const contextSubpathProcedureOutput: SubpathProcedureOutput<
  typeof contextSubpathProcedure
> = { recorded: 4, userId: '1' };
contextSubpathProcedureOutput.userId.toUpperCase();

const responseHeaders: ProcedureResponseHeaders<typeof procedure> = {
  'cache-control': 'private',
};
responseHeaders['cache-control'].toUpperCase();
const subpathResponseHeaders: SubpathProcedureResponseHeaders<
  typeof procedure
> = responseHeaders;
subpathResponseHeaders['cache-control'].toUpperCase();

const client = createClient({ url: '/rpc' });
client.call<typeof procedure>(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
// @ts-expect-error x-tenant-id is required by the procedure header schema.
client.call<typeof procedure>('users.get', { id: '1' });

const legacyUnaryProcedure: RpcUnaryProcedure<typeof procedure> = procedure;
legacyUnaryProcedure.output;
const legacyStreamProcedure: RpcStreamProcedure<typeof streamProcedure> =
  streamProcedure;
legacyStreamProcedure.stream;
client.stream<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy call rejects stream procedures.
client.call<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy request rejects stream procedures.
client.request<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy stream rejects unary procedures.
client.stream<typeof procedure>('users.get', { id: '1' });

type Routes = {
  'users.get': typeof procedure;
  'users.authenticated': typeof authenticatedProcedure;
  'users.watch': typeof streamProcedure;
};
const routeHasHeaders: RpcRouteHasHeaders<Routes, 'users.get'> = true;
routeHasHeaders.valueOf();
const routeRequiresHeaders: RpcRouteRequiresHeaders<Routes, 'users.get'> = true;
routeRequiresHeaders.valueOf();
const routeHasResponseHeaders: RpcRouteHasResponseHeaders<Routes, 'users.get'> =
  true;
routeHasResponseHeaders.valueOf();
const routeRequiresResponseHeaders: RpcRouteRequiresResponseHeaders<
  Routes,
  'users.get'
> = true;
routeRequiresResponseHeaders.valueOf();
const authenticatedRouteHasHeaders: RpcRouteHasHeaders<
  Routes,
  'users.authenticated'
> = false;
authenticatedRouteHasHeaders.valueOf();
const authenticatedRouteRequiresResponseHeaders: RpcRouteRequiresResponseHeaders<
  Routes,
  'users.authenticated'
> = false;
authenticatedRouteRequiresResponseHeaders.valueOf();
const streamRouteHasResponseHeaders: RpcRouteHasResponseHeaders<
  Routes,
  'users.watch'
> = false;
streamRouteHasResponseHeaders.valueOf();
const subpathRouteRequiresHeaders: RpcSubpathRouteRequiresHeaders<
  Routes,
  'users.get'
> = true;
subpathRouteRequiresHeaders.valueOf();
const subpathRouteRequiresResponseHeaders: RpcSubpathRouteRequiresResponseHeaders<
  Routes,
  'users.get'
> = true;
subpathRouteRequiresResponseHeaders.valueOf();
const routeErrorCode: RpcRouteErrorCode<Routes, 'users.get'> = 'NOT_FOUND';
routeErrorCode.toUpperCase();
const routeErrorDetails: RpcRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
routeErrorDetails.message.toUpperCase();
const subpathRouteErrorCode: RpcSubpathRouteErrorCode<Routes, 'users.get'> =
  'NOT_FOUND';
subpathRouteErrorCode.toUpperCase();
const subpathRouteErrorDetails: RpcSubpathRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = routeErrorDetails;
subpathRouteErrorDetails.message.toUpperCase();
// @ts-expect-error route error details preserve the selected error schema.
const _wrongRouteErrorDetails: RpcRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = {
  missing: 'message',
};
_wrongRouteErrorDetails;

const manifest = defineManifest({
  procedures: {
    'users.get': procedure,
    'users.authenticated': authenticatedProcedure,
    'users.watch': streamProcedure,
  },
});
type ManifestRoutes = JoorManifestRoutes<typeof manifest>;
const joorManifestRequiredServices: JoorManifestRequiredServices<
  typeof manifest
> = procedureServices;
joorManifestRequiredServices.users.findById('1').name.toUpperCase();
const joorManifestRouteServices: JoorManifestRouteServices<
  typeof manifest,
  'users.get'
> = procedureServices;
joorManifestRouteServices.users.findById('1');
const manifestRequiredServices: RpcManifestRequiredServices<typeof manifest> =
  procedureServices;
manifestRequiredServices.users.findById('1').id.toUpperCase();
const manifestRouteServices: RpcManifestRouteServices<
  typeof manifest,
  'users.get'
> = procedureServices;
manifestRouteServices.users.findById('1');
const manifestFromSubpath = defineManifestSubpath({
  procedures: {
    'users.get': procedure,
    'users.authenticated': authenticatedProcedure,
    'users.watch': streamProcedure,
  },
});
const manifestAwareConfig = defineConfigFor(manifest)({
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      context.services.users.findById('1').name.toUpperCase();
      if (
        context.body !== undefined &&
        !('length' in context.body) &&
        context.body.id === 'users.get'
      ) {
        context.body.input.id.toUpperCase();
        // @ts-expect-error manifest-aware configs keep route input exact.
        context.body.input.ok;
      }
      return undefined;
    },
  },
});
const manifestAwareConfigShape: JoorConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestAwareConfig;
manifestAwareConfigShape.plugins?.[0]?.name.toUpperCase();
const manifestAwareConfigFactory: DefineConfigFor<typeof manifest> =
  defineConfigFor(manifest);
manifestAwareConfigFactory({ plugins: [usersPlugin] as const });
defineConfigFor(manifest)({
  // @ts-expect-error manifest-aware configs reject missing service plugins.
  plugins: [] as const,
});
const contextSubpathManifestAwareConfig = defineContextSubpathConfigFor(
  manifest
)({
  plugins: [usersPlugin] as const,
});
const contextSubpathManifestAwareConfigShape: ContextSubpathConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = contextSubpathManifestAwareConfig;
contextSubpathManifestAwareConfigShape.plugins?.[0]?.setup;
const contextSubpathManifestAwareConfigFactory: ContextSubpathDefineConfigFor<
  typeof manifest
> = defineContextSubpathConfigFor(manifest);
contextSubpathManifestAwareConfigFactory({ plugins: [usersPlugin] as const });
const configSubpathManifestAwareConfig = defineConfigSubpathFor(manifest)({
  plugins: [usersPlugin] as const,
});
const configSubpathManifestAwareConfigShape: ConfigSubpathConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = configSubpathManifestAwareConfig;
configSubpathManifestAwareConfigShape.plugins?.[0]?.setup;
const configSubpathManifestAwareConfigFactory: ConfigSubpathDefineConfigFor<
  typeof manifest
> = defineConfigSubpathFor(manifest);
configSubpathManifestAwareConfigFactory({ plugins: [usersPlugin] as const });
type ConfigSubpathServices = ConfigSubpathConfigContext<
  typeof configSubpathManifestAwareConfig
>;
const configSubpathServices: ConfigSubpathServices = procedureServices;
configSubpathServices.users.findById('1').name.toUpperCase();
defineConfigSubpathFor(manifest)({
  // @ts-expect-error config subpath manifest-aware configs reject missing service plugins.
  plugins: [] as const,
});
type ManifestSubpathRoutes = JoorSubpathManifestRoutes<
  typeof manifestFromSubpath
>;
const manifestSubpathRouteId: JoorSubpathManifestRouteId<
  typeof manifestFromSubpath
> = 'users.get';
manifestSubpathRouteId.toUpperCase();
const manifestSubpathRouteInput: JoorSubpathManifestRouteInput<
  typeof manifestFromSubpath,
  'users.get'
> = { id: '1' };
manifestSubpathRouteInput.id.toUpperCase();
const manifestSubpathRequiredServices: JoorSubpathManifestRequiredServices<
  typeof manifestFromSubpath
> = procedureServices;
manifestSubpathRequiredServices.users.findById('1').id.toUpperCase();
const manifestSubpathRouteServices: JoorSubpathManifestRouteServices<
  typeof manifestFromSubpath,
  'users.get'
> = procedureServices;
manifestSubpathRouteServices.users.findById('1');
const _manifestSubpathRoutes: ManifestSubpathRoutes =
  manifestFromSubpath.procedures;
_manifestSubpathRoutes['users.get'].input;
const _compilerSubpathBuild: typeof buildCompilerSubpath = buildCompilerSubpath;
_compilerSubpathBuild;
const compilerSubpathBuildOptions: CompilerSubpathBuildOptions = {
  cwd: '/tmp/joor-app',
  entry: './rpc',
  outDir: './.joor',
};
compilerSubpathBuildOptions.outDir?.toUpperCase();
const compilerSubpathProcedureFile: CompilerSubpathProcedureFile = {
  path: '/tmp/joor-app/rpc/users/get.rpc.ts',
  id: 'users.get',
};
compilerSubpathProcedureFile.id.toUpperCase();
const compilerSubpathGenerationOptions: CompilerSubpathCompiledProcedureGenerationOptions =
  {
    enforceRateLimit: true,
    validateHeaders: true,
    validateInput: true,
    validateOutput: true,
    validateResponseHeaders: true,
    modes: ['body', 'serialized', 'response'],
  };
const compilerSubpathMode: CompilerSubpathCompiledProcedureMode =
  compilerSubpathGenerationOptions.modes?.[0] ?? 'body';
compilerSubpathMode.toUpperCase();
const compilerSubpathManifest: CompilerSubpathManifest = {
  procedures: [
    {
      id: 'users.get',
      importPath: '/tmp/joor-app/rpc/users/get.rpc.ts',
      exportName: 'users_get',
      procedure,
    },
  ],
};
const compilerSubpathOpenApi = createCompilerSubpathOpenApiDocument(
  compilerSubpathManifest
);
compilerSubpathOpenApi['openapi'];
const compilerSubpathAiDocs = createCompilerSubpathAiDocs(
  compilerSubpathManifest
);
compilerSubpathAiDocs['framework'];
const manifestRouteClient = createClient<ManifestRoutes>({ url: '/rpc' });
manifestRouteClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);

// @ts-expect-error manifest-derived clients reject unknown route ids.
manifestRouteClient.call('users.missing', { id: '1' });

const inferredManifestClient = createClient({ url: '/rpc', manifest });
inferredManifestClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
inferredManifestClient.stream('users.watch', { userId: '1' });

// @ts-expect-error manifest-inferred clients reject unknown route ids.
inferredManifestClient.call('users.missing', { id: '1' });

// @ts-expect-error manifest-inferred clients reject stream routes in call.
inferredManifestClient.call('users.watch', { userId: '1' });

const explicitManifestClient = createManifestClient(manifest, { url: '/rpc' });
explicitManifestClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
explicitManifestClient.stream('users.watch', { userId: '1' });

// @ts-expect-error explicit manifest clients reject unknown route ids.
explicitManifestClient.call('users.missing', { id: '1' });

// @ts-expect-error explicit manifest clients reject stream routes in call.
explicitManifestClient.call('users.watch', { userId: '1' });

const rootManifestClient = createRootClient({ url: '/rpc', manifest });
const rootManifestClientShape: RpcManifestTransportClient<typeof manifest> =
  rootManifestClient;
rootManifestClientShape.call('users.authenticated', { ok: true });
const rpcSubpathManifestClientShape: RpcSubpathManifestTransportClient<
  typeof manifest
> = rootManifestClient;
rpcSubpathManifestClientShape.call('users.authenticated', { ok: true });
const joorManifestClientShape: JoorManifestTransportClient<typeof manifest> =
  rootManifestClient;
const joorSubpathManifestClientShape: JoorSubpathManifestTransportClient<
  typeof manifestFromSubpath
> = joorManifestClientShape;
joorManifestClientShape.call('users.authenticated', { ok: true });
joorSubpathManifestClientShape.call('users.authenticated', { ok: true });
const clientFetch: ClientFetch = async (request) => new Response(request.url);
const rpcSubpathClientFetch: RpcSubpathClientFetch = clientFetch;
clientFetch(new Request('https://example.com/rpc'));
rpcSubpathClientFetch(new Request('https://example.com/rpc'));
const procedureClientHeaders: ClientProcedureHeaders<typeof procedure> = {
  authorization: undefined,
  'x-tenant-id': 'tenant-1',
};
const rpcSubpathProcedureClientHeaders: RpcSubpathClientProcedureHeaders<
  typeof procedure
> = procedureClientHeaders;
client.call<typeof procedure>(
  'users.get',
  { id: '1' },
  {
    headers: procedureClientHeaders,
  }
);
createClient({ url: '/rpc' }).call<typeof procedure>(
  'users.get',
  { id: '1' },
  {
    headers: rpcSubpathProcedureClientHeaders,
  }
);
const _wrongProcedureClientHeaders: ClientProcedureHeaders<typeof procedure> = {
  authorization: 'Bearer token',
  // @ts-expect-error required procedure headers cannot be undefined.
  'x-tenant-id': undefined,
};
_wrongProcedureClientHeaders.authorization?.toUpperCase();
const manifestClientOptions: RpcManifestClientOptions<typeof manifest> = {
  url: '/rpc',
  fetch: clientFetch,
  headers: { authorization: 'Bearer token', 'x-optional': undefined },
};
createRootManifestClient(manifest, manifestClientOptions);
const rpcSubpathManifestClientOptions: RpcSubpathManifestClientOptions<
  typeof manifest
> = manifestClientOptions;
createRootManifestClient(manifest, rpcSubpathManifestClientOptions);
const joorManifestClientOptions: JoorManifestClientOptions<typeof manifest> =
  manifestClientOptions;
const joorSubpathManifestClientOptions: JoorSubpathManifestClientOptions<
  typeof manifestFromSubpath
> = joorManifestClientOptions;
createRootManifestClient(manifest, joorManifestClientOptions);
createRootManifestClient(manifestFromSubpath, joorSubpathManifestClientOptions);
const clientOptionsWithOptionalHeaders: ClientOptions = {
  url: '/rpc',
  headers: {
    authorization: 'Bearer token',
    'x-optional': undefined,
  },
};
const rpcSubpathClientOptionsWithOptionalHeaders: RpcSubpathClientOptions =
  clientOptionsWithOptionalHeaders;
createRootClient(clientOptionsWithOptionalHeaders);
createClient(rpcSubpathClientOptionsWithOptionalHeaders);
rootManifestClient.call('users.authenticated', { ok: true });

// @ts-expect-error root manifest clients keep route id safety.
rootManifestClient.stream('users.get', { id: '1' });

const rootExplicitManifestClient = createRootManifestClient(manifest, {
  url: '/rpc',
});
rootExplicitManifestClient.call('users.authenticated', { ok: true });

// @ts-expect-error root explicit manifest clients keep route id safety.
rootExplicitManifestClient.stream('users.get', { id: '1' });

const legacyClient = createClient({ url: '/rpc' });
const legacyClientShape: LegacyRpcTransportClient = legacyClient;
legacyClientShape
  .request<typeof procedure, 'users.get'>(
    'users.get',
    { id: '1' },
    {
      headers: { 'x-tenant-id': 'tenant-1' },
    }
  )
  .id.toUpperCase();
const legacyRequest = legacyClient.request<typeof procedure, 'users.get'>(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const legacyRequestId: 'users.get' = legacyRequest.id;
legacyRequestId.toUpperCase();
legacyRequest.headers['x-tenant-id'].toUpperCase();
const typedPendingLegacyRequest: PendingRpcRequest<
  typeof procedure,
  'users.get'
> = legacyRequest;
typedPendingLegacyRequest.headers['x-tenant-id'].toUpperCase();
// @ts-expect-error typed pending requests require declared procedure headers.
const _missingHeaderPendingLegacyRequest: PendingRpcRequest<
  typeof procedure,
  'users.get'
> = {
  id: 'users.get',
  input: { id: '1' },
};
// @ts-expect-error legacy client requests preserve explicit route id literals.
const _wrongLegacyRequestId: 'users.authenticated' = legacyRequest.id;
legacyClient
  .call<typeof procedure, 'users.get'>(
    'users.get',
    { id: '1' },
    { headers: { 'x-tenant-id': 'tenant-1' } }
  )
  .then((result) => {
    const legacyResultId: 'users.get' = result.id;
    legacyResultId.toUpperCase();
  });
const rootLegacyClient = createRootClient({ url: '/rpc' });
const rootLegacyRequest = rootLegacyClient.request<
  typeof procedure,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const rootLegacyRequestId: 'users.get' = rootLegacyRequest.id;
rootLegacyRequestId.toUpperCase();
const legacyClientHeaderValues: ClientHeaderValues = {
  authorization: 'Bearer token',
  'x-optional': undefined,
};
legacyClientHeaderValues['authorization']?.toUpperCase();
const legacyUntypedRequest: PendingRpcRequest = {
  id: 'users.untyped',
  input: { id: '1' },
  headers: legacyClientHeaderValues,
};
legacyUntypedRequest.headers?.['authorization']?.toUpperCase();
const _wrongLegacyUntypedRequest: PendingRpcRequest = {
  id: 'users.untyped',
  input: { id: '1' },
  // @ts-expect-error legacy pending request headers must be HTTP string values.
  headers: { authorization: 1 },
};
_wrongLegacyUntypedRequest.id.toUpperCase();
legacyClient
  .batch([{ id: 'users.untyped', input: { id: '1' } }] as const)
  .then((results) => {
    const first = results[0];
    const firstId: 'users.untyped' = first.id;
    firstId.toUpperCase();
    if (first.ok) {
      type UntypedLegacyBatchDataIsNever = [typeof first.data] extends [never]
        ? true
        : false;
      const untypedLegacyBatchDataIsNever: UntypedLegacyBatchDataIsNever = false;
      untypedLegacyBatchDataIsNever.valueOf();
      first.headers?.['cache-control']?.toUpperCase();
    }
  });
const untypedLegacyBatchResults: BatchResults<
  readonly [typeof legacyUntypedRequest]
> = [
  {
    ok: true,
    id: 'users.untyped',
    traceId: 'trace-1',
    data: { id: '1' },
    headers: { 'cache-control': 'private' },
  },
];
if (untypedLegacyBatchResults[0].ok) {
  untypedLegacyBatchResults[0].headers?.['cache-control']?.toUpperCase();
}
const subpathUntypedLegacyBatchResults: RpcSubpathBatchResults<
  readonly [typeof legacyUntypedRequest]
> = untypedLegacyBatchResults;
if (subpathUntypedLegacyBatchResults[0].ok) {
  subpathUntypedLegacyBatchResults[0].headers?.['cache-control']?.toUpperCase();
}
const _wrongUntypedLegacyBatchResults: BatchResults<
  readonly [typeof legacyUntypedRequest]
> = [
  {
    ok: true,
    id: 'users.untyped',
    traceId: 'trace-1',
    data: { id: '1' },
    headers: {
      // @ts-expect-error legacy batch result headers must be HTTP string values.
      'x-retry-count': 1,
    },
  },
];
_wrongUntypedLegacyBatchResults[0].id.toUpperCase();
legacyClient.batch([
  {
    id: 'users.untyped',
    input: { id: '1' },
    headers: { authorization: 'Bearer token' },
  },
] as const);
legacyClient.batch([
  {
    id: 'users.untyped',
    input: { id: '1' },
    // @ts-expect-error legacy client batches reject non-string headers.
    headers: { authorization: 1 },
  },
] as const);

const manifestRouteId: JoorManifestRouteId<typeof manifest> = 'users.get';
manifestRouteId.toUpperCase();
const manifestUnaryRouteId: JoorManifestUnaryRouteId<typeof manifest> =
  'users.authenticated';
manifestUnaryRouteId.toUpperCase();
const manifestStreamRouteId: JoorManifestStreamRouteId<typeof manifest> =
  'users.watch';
manifestStreamRouteId.toUpperCase();
type _InvalidManifestStreamRouteOutput = JoorManifestRouteOutput<
  typeof manifest,
  // @ts-expect-error manifest route outputs are only available for unary routes.
  'users.watch'
>;
const manifestRouteInput: JoorManifestRouteInput<typeof manifest, 'users.get'> =
  { id: '1' };
manifestRouteInput.id.toUpperCase();
const manifestRouteProcedure: JoorManifestRouteProcedure<
  typeof manifest,
  'users.get'
> = procedure;
manifestRouteProcedure.output;
const manifestRouteOutput: JoorManifestRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
manifestRouteOutput.name.toUpperCase();
const manifestRouteHeaders: JoorManifestRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
manifestRouteHeaders['x-tenant-id'].toUpperCase();
const manifestRouteClientHeaders: JoorManifestRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { authorization: undefined, 'x-tenant-id': 'tenant-1' };
manifestRouteClientHeaders['x-tenant-id'].toUpperCase();
const manifestSubpathRouteClientHeaders: JoorSubpathManifestRouteClientHeaders<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteClientHeaders;
manifestSubpathRouteClientHeaders['x-tenant-id'].toUpperCase();
const manifestRouteHasHeaders: JoorManifestRouteHasHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestRouteHasHeaders.valueOf();
const manifestRouteRequiresHeaders: JoorManifestRouteRequiresHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestRouteRequiresHeaders.valueOf();
const manifestRouteResponseHeaders: JoorManifestRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
manifestRouteResponseHeaders['cache-control'].toUpperCase();
const manifestRouteHasResponseHeaders: JoorManifestRouteHasResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestRouteHasResponseHeaders.valueOf();
const manifestRouteRequiresResponseHeaders: JoorManifestRouteRequiresResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestRouteRequiresResponseHeaders.valueOf();
const manifestAuthenticatedRouteHasHeaders: JoorManifestRouteHasHeaders<
  typeof manifest,
  'users.authenticated'
> = false;
manifestAuthenticatedRouteHasHeaders.valueOf();
const manifestAuthenticatedRouteRequiresResponseHeaders: JoorManifestRouteRequiresResponseHeaders<
  typeof manifest,
  'users.authenticated'
> = false;
manifestAuthenticatedRouteRequiresResponseHeaders.valueOf();
const manifestRouteError: JoorManifestRouteError<typeof manifest, 'users.get'> =
  {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { message: 'User not found' },
  };
manifestRouteError.code.toUpperCase();
const manifestRouteErrorCode: JoorManifestRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
manifestRouteErrorCode.toUpperCase();
const manifestRouteErrorDetails: JoorManifestRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
manifestRouteErrorDetails.message.toUpperCase();
// @ts-expect-error declared manifest route errors require schema-backed details.
const _missingManifestRouteErrorDetails: JoorManifestRouteError<
  typeof manifest,
  'users.get'
> = {
  code: 'NOT_FOUND',
  message: 'Not found',
  status: 404,
};
const manifestRouteEnvelope: JoorManifestRouteEnvelope<
  typeof manifest,
  'users.get'
> = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
};
manifestRouteEnvelope.id.toUpperCase();
const manifestRouteEnvelopeUnion: JoorManifestRouteEnvelopeUnion<
  typeof manifest
> = manifestRouteEnvelope;
manifestRouteEnvelopeUnion.id.toUpperCase();
const manifestRouteResult: JoorManifestRouteResult<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
const manifestRouteResultUnion: JoorManifestRouteResultUnion<typeof manifest> =
  manifestRouteResult;
manifestRouteResultUnion.id.toUpperCase();
// @ts-expect-error success envelopes require declared response headers.
const _missingManifestRouteEnvelopeHeaders: JoorManifestRouteEnvelope<
  typeof manifest,
  'users.get'
> = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '1', name: 'Ada' },
};
_missingManifestRouteEnvelopeHeaders;
const authenticatedRouteEnvelope: JoorManifestRouteEnvelope<
  typeof manifest,
  'users.authenticated'
> = {
  ok: true,
  id: 'users.authenticated',
  traceId: 'trace-1',
  data: { userId: '1' },
};
authenticatedRouteEnvelope.data.userId.toUpperCase();
const manifestRouteBodyResult: JoorManifestRouteBodyResult<typeof manifest> =
  manifestRouteEnvelope;
if (!(manifestRouteBodyResult instanceof Response)) {
  if (Array.isArray(manifestRouteBodyResult)) {
    manifestRouteBodyResult[0]?.id.toUpperCase();
  } else if (manifestRouteBodyResult.ok) {
    manifestRouteBodyResult.data.id.toUpperCase();
  }
}
const manifestRouteRequest: JoorManifestRouteRequest<
  typeof manifest,
  'users.get'
> = {
  id: 'users.get',
  input: { id: '1' },
  headers: { 'x-tenant-id': 'tenant-1' },
};
manifestRouteRequest.headers['x-tenant-id'].toUpperCase();
const manifestRouteRequestOptions: JoorManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = { headers: { authorization: undefined, 'x-tenant-id': 'tenant-1' } };
manifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
const manifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }, manifestRouteRequestOptions];
manifestRouteClientArgs[0].id.toUpperCase();
const optionalManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.authenticated'
> = [{ ok: true }];
optionalManifestRouteClientArgs[0].ok.valueOf();
const manifestSubpathRouteRequestOptions: JoorSubpathManifestRouteRequestOptions<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteRequestOptions;
const manifestSubpathRouteClientArgs: JoorSubpathManifestRouteClientArgs<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteClientArgs;
manifestSubpathRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
manifestSubpathRouteClientArgs[0].id.toUpperCase();
const _wrongManifestRouteRequestOptions: JoorManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = {
  headers: {
    // @ts-expect-error manifest route request options preserve declared header value types.
    'x-tenant-id': 1,
  },
};
_wrongManifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
const manifestRouteRequestUnion: JoorManifestRouteRequestUnion<
  typeof manifest
> = manifestRouteRequest;
manifestRouteRequestUnion.id.toUpperCase();
const manifestRouteBatchResults: JoorManifestRouteBatchResults<
  typeof manifest,
  [typeof manifestRouteRequest]
> = [manifestRouteEnvelope];
manifestRouteBatchResults[0].id.toUpperCase();
const manifestStreamEvent: JoorManifestRouteStreamEvent<
  typeof manifest,
  'users.watch'
> = { type: 'user.updated', userId: '1' };
manifestStreamEvent.userId.toUpperCase();
const manifestProtocolRequest: JoorManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = { id: 'users.get', input: { id: '1' } };
manifestProtocolRequest.input.id.toUpperCase();
const _extraManifestProtocolRequest: JoorManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = {
  id: 'users.get',
  input: { id: '1' },
  // @ts-expect-error manifest protocol requests reject unknown envelope fields.
  extra: true,
};
_extraManifestProtocolRequest.id.toUpperCase();
const manifestProtocolRequestUnion: JoorManifestRouteProtocolRequestUnion<
  typeof manifest
> = manifestProtocolRequest;
manifestProtocolRequestUnion.id.toUpperCase();
const manifestRouteBody: JoorManifestRouteBody<typeof manifest> =
  manifestProtocolRequest;
manifestRouteBody.id.toUpperCase();
const manifestUnaryProtocolRequest: JoorManifestRouteUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestProtocolRequest;
manifestUnaryProtocolRequest.input.id.toUpperCase();
const manifestUnaryProtocolRequestUnion: JoorManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = manifestUnaryProtocolRequest;
manifestUnaryProtocolRequestUnion.id.toUpperCase();
const manifestStreamProtocolRequest: JoorManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
manifestStreamProtocolRequest.input.userId.toUpperCase();
const manifestStreamProtocolRequestUnion: JoorManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = manifestStreamProtocolRequest;
manifestStreamProtocolRequestUnion.input.userId.toUpperCase();
const manifestBatchRequest: JoorManifestRouteBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = [manifestUnaryProtocolRequest];
manifestBatchRequest[0].input.id.toUpperCase();
const readonlyManifestBatchRequest = [manifestUnaryProtocolRequest] as const;
const manifestReadonlyBatchBody: JoorManifestRouteBody<typeof manifest> =
  readonlyManifestBatchRequest;
manifestReadonlyBatchBody.length.toFixed();
const manifestBatchBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof readonlyManifestBatchRequest
> = [manifestRouteEnvelope];
if (!(manifestBatchBodyResultFor instanceof Response)) {
  const first = manifestBatchBodyResultFor[0];
  if (first.ok) first.data.name.toUpperCase();
}
const manifestRouteBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof manifestProtocolRequest
> = manifestRouteEnvelope;
if (!(manifestRouteBodyResultFor instanceof Response)) {
  if (manifestRouteBodyResultFor.ok)
    manifestRouteBodyResultFor.data.name.toUpperCase();
}
const manifestSubpathProtocolRequest: JoorSubpathManifestRouteProtocolRequest<
  typeof manifestFromSubpath,
  'users.get'
> = manifestProtocolRequest;
const manifestSubpathRouteBody: JoorSubpathManifestRouteBody<
  typeof manifestFromSubpath
> = manifestSubpathProtocolRequest;
const manifestSubpathEnvelope: JoorSubpathManifestRouteEnvelope<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteEnvelope;
const manifestSubpathEnvelopeUnion: JoorSubpathManifestRouteEnvelopeUnion<
  typeof manifestFromSubpath
> = manifestSubpathEnvelope;
manifestSubpathEnvelopeUnion.id.toUpperCase();
const manifestSubpathRouteResult: JoorSubpathManifestRouteResult<
  typeof manifestFromSubpath,
  'users.get'
> = manifestSubpathEnvelope;
const manifestSubpathRouteResultUnion: JoorSubpathManifestRouteResultUnion<
  typeof manifestFromSubpath
> = manifestSubpathRouteResult;
manifestSubpathRouteResultUnion.id.toUpperCase();
const manifestSubpathBodyResultFor: JoorSubpathManifestRouteBodyResultFor<
  typeof manifestFromSubpath,
  typeof manifestSubpathProtocolRequest
> = manifestSubpathEnvelope;
manifestSubpathRouteBody.id.toUpperCase();
if (!(manifestSubpathBodyResultFor instanceof Response)) {
  if (manifestSubpathBodyResultFor.ok)
    manifestSubpathBodyResultFor.data.name.toUpperCase();
}

const _wrongManifestSubpathStreamProtocolRequest: JoorSubpathManifestRouteStreamProtocolRequest<
  typeof manifestFromSubpath,
  // @ts-expect-error manifest subpath stream protocol requests reject unary route ids.
  'users.get'
> = manifestSubpathProtocolRequest;

// @ts-expect-error route body result inference keeps the requested route id.
const _wrongManifestRouteBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof manifestProtocolRequest
> = authenticatedRouteEnvelope;

type InvalidManifestUnaryProtocolRequest = {
  id: 'users.get';
  input: { ok: true };
};
// @ts-expect-error manifest body result inference validates request input by route id.
const _wrongManifestSingleBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  InvalidManifestUnaryProtocolRequest
> = manifestRouteEnvelope;

// @ts-expect-error manifest route ids reject missing routes.
const _wrongManifestRouteId: JoorManifestRouteId<typeof manifest> =
  'users.missing';

const _wrongManifestStreamProtocolRequest: JoorManifestRouteStreamProtocolRequest<
  typeof manifest,
  // @ts-expect-error manifest stream protocol requests reject unary route ids.
  'users.get'
> = manifestProtocolRequest;

const _wrongManifestBatchRequest: JoorManifestRouteBatchRequest<
  typeof manifest,
  // @ts-expect-error manifest protocol batches reject stream request bodies.
  [typeof manifestStreamProtocolRequest]
> = [manifestStreamProtocolRequest];

// @ts-expect-error manifest batch result inference rejects invalid request tuples.
const _wrongManifestBatchBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  readonly [InvalidManifestUnaryProtocolRequest]
> = [manifestRouteEnvelope];
type _WrongManifestRouteBatchResults = JoorManifestRouteBatchResults<
  typeof manifest,
  // @ts-expect-error manifest route batch results reject invalid request tuples.
  readonly [
    {
      id: 'users.get';
      input: { ok: true };
      headers: { 'x-tenant-id': 'tenant-1' };
    },
  ]
>;

// @ts-expect-error manifests only accept procedure runtimes.
defineManifest({ procedures: { broken: { input: t.string() } } });

const publicManifest: RpcManifest = manifest;
publicManifest.procedures['users.get'];
const typedPublicManifest: RpcManifest<ManifestRoutes> = manifest;
typedPublicManifest.procedures['users.get'].output;
type PublicManifestRoutes = RpcManifestRoutes<typeof manifest>;
const publicManifestRouteId: RpcManifestRouteId<typeof manifest> = 'users.get';
publicManifestRouteId.toUpperCase();
const publicManifestUnaryRouteId: RpcManifestUnaryRouteId<typeof manifest> =
  'users.authenticated';
publicManifestUnaryRouteId.toUpperCase();
const publicManifestStreamRouteId: RpcManifestStreamRouteId<typeof manifest> =
  'users.watch';
publicManifestStreamRouteId.toUpperCase();
const publicManifestProtocolRequest: RpcManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = { id: 'users.get', input: { id: '1' } };
publicManifestProtocolRequest.input.id.toUpperCase();
const publicManifestProtocolRequestUnion: RpcManifestRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestProtocolRequest;
publicManifestProtocolRequestUnion.id.toUpperCase();
const publicManifestUnaryProtocolRequest: RpcManifestRouteUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestProtocolRequest;
publicManifestUnaryProtocolRequest.input.id.toUpperCase();
const publicManifestUnaryProtocolRequestUnion: RpcManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryProtocolRequest;
publicManifestUnaryProtocolRequestUnion.id.toUpperCase();
const publicManifestStreamProtocolRequest: RpcManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
publicManifestStreamProtocolRequest.input.userId.toUpperCase();
const publicManifestStreamProtocolRequestUnion: RpcManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamProtocolRequest;
publicManifestStreamProtocolRequestUnion.input.userId.toUpperCase();
const publicManifestBody: RpcManifestBody<typeof manifest> =
  publicManifestProtocolRequest;
const publicManifestBatchBody: RpcManifestRouteUnaryProtocolRequest<
  typeof manifest,
  'users.get'
>[] = [publicManifestUnaryProtocolRequest];
const publicManifestBatchBodyUnion: RpcManifestBody<typeof manifest> =
  publicManifestBatchBody;
const publicManifestBatchRequest: RpcManifestRouteBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryProtocolRequest]
> = [publicManifestUnaryProtocolRequest];
const publicManifestBatchResults: RpcManifestRouteBatchResults<
  typeof manifest,
  readonly [typeof publicManifestUnaryProtocolRequest]
> = [manifestRouteEnvelope];
const publicManifestEnvelopeUnion: RpcManifestRouteEnvelopeUnion<
  typeof manifest
> = manifestRouteEnvelope;
const publicManifestResultUnion: RpcManifestRouteResultUnion<typeof manifest> =
  publicManifestEnvelopeUnion;
const rpcSubpathManifestResultUnion: RpcSubpathManifestRouteResultUnion<
  typeof manifest
> = publicManifestResultUnion;
rpcSubpathManifestResultUnion.id.toUpperCase();
const publicManifestBodyResult: RpcManifestBodyResult<typeof manifest> =
  publicManifestEnvelopeUnion;
const publicManifestBodyResultFor: RpcManifestBodyResultFor<
  typeof manifest,
  typeof publicManifestProtocolRequest
> = publicManifestEnvelopeUnion;
// @ts-expect-error public manifest batch result inference rejects invalid request tuples.
const _wrongPublicManifestBatchBodyResultFor: RpcManifestBodyResultFor<
  typeof manifest,
  readonly [InvalidManifestUnaryProtocolRequest]
> = [publicManifestEnvelopeUnion];
// @ts-expect-error public manifest body result inference validates request input by route id.
const _wrongPublicManifestSingleBodyResultFor: RpcManifestBodyResultFor<
  typeof manifest,
  InvalidManifestUnaryProtocolRequest
> = publicManifestEnvelopeUnion;
publicManifestBody.id.toUpperCase();
publicManifestBatchBody[0]?.input.id.toUpperCase();
publicManifestBatchBodyUnion.length.toFixed();
publicManifestBatchRequest[0].input.id.toUpperCase();
if (publicManifestBatchResults[0].ok) {
  publicManifestBatchResults[0].data.name.toUpperCase();
}
if (!(publicManifestBodyResult instanceof Response)) {
  if (Array.isArray(publicManifestBodyResult)) {
    publicManifestBodyResult[0]?.id.toUpperCase();
  } else {
    publicManifestBodyResult.id.toUpperCase();
  }
}
if (!(publicManifestBodyResultFor instanceof Response)) {
  if (publicManifestBodyResultFor.ok)
    publicManifestBodyResultFor.data.name.toUpperCase();
}
const _publicManifestRoutes: PublicManifestRoutes = manifest.procedures;
_publicManifestRoutes['users.get'].output;

const _wrongPublicManifestBatchRequest: RpcManifestRouteBatchRequest<
  typeof manifest,
  // @ts-expect-error RpcManifest protocol batches reject stream request bodies.
  [typeof publicManifestStreamProtocolRequest]
> = [publicManifestStreamProtocolRequest];

// @ts-expect-error RpcManifest route maps require procedure runtimes.
type _WrongRpcManifest = RpcManifest<{ broken: { input: string } }>;

function createFetchRequestSourceForTypes() {
  const request = new Request('https://example.com/rpc', { method: 'POST' });
  return {
    method: 'POST',
    remoteAddress: undefined,
    signal: request.signal,
    url: request.url,
    getHeader(_name: string) {
      return null;
    },
    toHeaders() {
      return new Headers();
    },
    toRequest() {
      return request;
    },
  };
}

const handlerOptions: HandlerOptions<readonly [typeof usersPlugin]> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
};
const handlerOptionServices: HandlerOptionServices<typeof handlerOptions> =
  procedureServices;
handlerOptionServices.users.findById('1').name.toUpperCase();
const handlerHookContext: HandlerHookContext<RootPluginServices> = {
  services: rootPluginServices,
  body: manifestRouteRequest,
};
handlerHookContext.services.users.findById('1').name.toUpperCase();
const rpcSubpathHandlerHookContext: RpcSubpathHandlerHookContext<RootPluginServices> =
  handlerHookContext;
rpcSubpathHandlerHookContext.services.users.findById('1').name.toUpperCase();
const typedHandlerHookContext: HandlerHookContext<
  RootPluginServices,
  JoorManifestRouteBody<typeof manifest>
> = {
  services: rootPluginServices,
  body: manifestRouteRequest,
};
if (
  typedHandlerHookContext.body !== undefined &&
  !('length' in typedHandlerHookContext.body)
) {
  typedHandlerHookContext.body.id.toUpperCase();
}
const manifestHandlerHookContext: HandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  services: rootPluginServices,
  body: manifestRouteRequest,
};
if (
  manifestHandlerHookContext.body !== undefined &&
  !('length' in manifestHandlerHookContext.body) &&
  manifestHandlerHookContext.body.id === 'users.get'
) {
  manifestHandlerHookContext.body.input.id.toUpperCase();
}
const rpcSubpathManifestHandlerHookContext: RpcSubpathHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestHandlerHookContext;
rpcSubpathManifestHandlerHookContext.services.users
  .findById('1')
  .name.toUpperCase();
const _wrongManifestHandlerHookContext: HandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  services: rootPluginServices,
  // @ts-expect-error manifest-aware hook contexts reject unknown body route ids.
  body: {
    id: 'users.missing',
    input: { id: '1' },
  },
};
const serviceAwareHandlerHooks: HandlerHooks<RootPluginServices> = {
  beforeRequest(_request, context) {
    context.services.users.findById('1').name.toUpperCase();
    return undefined;
  },
  afterResponse(response, _request, context) {
    context.services.users.findById('1').name.toUpperCase();
    return response;
  },
};
serviceAwareHandlerHooks.beforeRequest?.(
  new Request('https://example.com/rpc'),
  handlerHookContext
);
const serviceAwareMiddleware: JoorMiddleware<RootPluginServices> = {
  name: 'audit',
  beforeRequest(_request, context) {
    context.services.users.findById('1').name.toUpperCase();
    return undefined;
  },
};
const manifestAwareHandlerHooks: HandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  beforeRequest(_request, context) {
    context.services.users.findById('1').name.toUpperCase();
    if (
      context.body !== undefined &&
      !('length' in context.body) &&
      context.body.id === 'users.get'
    ) {
      context.body.input.id.toUpperCase();
      // @ts-expect-error manifest-aware hooks keep route input exact.
      context.body.input.missing;
    }
    return undefined;
  },
};
const rpcSubpathManifestAwareHandlerHooks: RpcSubpathHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestAwareHandlerHooks;
rpcSubpathManifestAwareHandlerHooks.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestHandlerHookContext
);
const manifestAwareMiddleware: JoorMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  name: 'route-audit',
  afterResponse(response, _request, context) {
    if (
      context.body !== undefined &&
      !('length' in context.body) &&
      context.body.id === 'users.authenticated'
    ) {
      context.body.input.ok.valueOf();
    }
    return response;
  },
};
const rpcSubpathManifestAwareMiddleware: RpcSubpathJoorMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestAwareMiddleware;
rpcSubpathManifestAwareMiddleware.name.toUpperCase();
const handlerOptionsWithHooks: HandlerOptions<readonly [typeof usersPlugin]> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: serviceAwareHandlerHooks,
  middleware: [serviceAwareMiddleware],
};
handlerOptionsWithHooks.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  handlerHookContext
);
const _handlerOptionsWithoutHookPlugins: HandlerOptions = {
  hooks: {
    beforeRequest(_request, context) {
      // @ts-expect-error default handler hooks do not expose plugin services.
      context.services.users;
      return undefined;
    },
  },
};
_handlerOptionsWithoutHookPlugins;
const serviceAwareHandlerOptions: HandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      if (context.body !== undefined && !('length' in context.body)) {
        context.body.id.toUpperCase();
      }
      return undefined;
    },
    afterResponse(response, _request, context) {
      if (
        context.body !== undefined &&
        !('length' in context.body) &&
        context.body.id === 'users.get'
      ) {
        context.body.input.id.toUpperCase();
      }
      return response;
    },
  },
};
serviceAwareHandlerOptions.plugins?.[0]?.name.toUpperCase();
const handlerOptionsWithExtraServices: HandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin, typeof contextSubpathPlugin]
> = {
  plugins: [usersPlugin, contextSubpathPlugin] as const,
};
handlerOptionsWithExtraServices.plugins?.[1]?.name.toUpperCase();
const definedHandlerOptions = defineHandlerOptions(manifest)({
  path: '/rpc',
  plugins: [usersPlugin] as const,
});
definedHandlerOptions.plugins?.[0]?.setup;
const definedHandlerOptionServices: HandlerOptionServices<
  typeof definedHandlerOptions
> = procedureServices;
definedHandlerOptionServices.users.findById('1').name.toUpperCase();
const rpcSubpathDefinedHandlerOptions = defineRpcSubpathHandlerOptions(
  manifest
)({
  plugins: [usersPlugin] as const,
});
rpcSubpathDefinedHandlerOptions.plugins?.[0]?.name.toUpperCase();
// @ts-expect-error service-aware handler options reject missing service plugins.
const _missingServiceHandlerOptions: HandlerOptionsFor<
  typeof manifest,
  readonly []
> = { path: '/rpc' };
defineHandlerOptions(manifest)({
  path: '/rpc',
  // @ts-expect-error manifest-aware handler options reject missing service plugins.
  plugins: [] as const,
});
const rpcPreflight = createRpcRequestPreflight(handlerOptions);
rpcPreflight(createFetchRequestSourceForTypes());
const rpcHandler = createRpcHandler(manifest, handlerOptions);
const typedRpcHandler: RpcRequestHandler = rpcHandler;
const rpcSubpathHandler = createRpcSubpathHandler(manifest, handlerOptions);
const typedRpcSubpathHandler: RpcSubpathRequestHandler = rpcSubpathHandler;
rpcHandler(new Request('https://example.com/rpc'));
typedRpcHandler(new Request('https://example.com/rpc'));
typedRpcSubpathHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching handler plugins.
createRpcHandler(manifest);
const rpcBodyHandler = createRpcBodyHandler(manifest, handlerOptions);
const typedRpcBodyHandler: RpcBodyHandler<typeof manifest> = rpcBodyHandler;
const rpcSubpathBodyHandler = createRpcSubpathBodyHandler(
  manifest,
  handlerOptions
);
const typedRpcSubpathBodyHandler: RpcSubpathBodyHandler<typeof manifest> =
  rpcSubpathBodyHandler;
// @ts-expect-error service-dependent manifests require matching body handler plugins.
createRpcBodyHandler(manifest);
rpcBodyHandler(new Request('https://example.com/rpc'), {
  id: 'users.get',
  input: { id: '1' },
});
typedRpcBodyHandler(new Request('https://example.com/rpc'), manifestRouteBody);
typedRpcSubpathBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteBody
);
rpcBodyHandler(new Request('https://example.com/rpc'), {
  // @ts-expect-error low-level typed body handlers reject unknown route ids.
  id: 'users.missing',
  input: { id: '1' },
});
const rpcBodyResultHandler = createRpcBodyResultHandler(
  manifest,
  handlerOptions
);
// @ts-expect-error service-dependent manifests require matching body result handler plugins.
createRpcBodyResultHandler(manifest);
rpcBodyResultHandler(new Request('https://example.com/rpc'), {
  id: 'users.get',
  input: { id: '1' },
}).then((result) => {
  const typedResult: JoorManifestRouteBodyResult<typeof manifest> = result;
  if (!(typedResult instanceof Response) && !Array.isArray(typedResult)) {
    typedResult.id.toUpperCase();
    if (typedResult.ok && typedResult.id === 'users.get') {
      typedResult.data.name.toUpperCase();
    }
  }
});
rpcBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestProtocolRequest
).then((result) => {
  const exactResult: JoorManifestRouteBodyResultFor<
    typeof manifest,
    typeof manifestProtocolRequest
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
rpcBodyResultHandler(
  new Request('https://example.com/rpc'),
  readonlyManifestBatchRequest
).then((result) => {
  if (!(result instanceof Response)) {
    if (result[0].ok) result[0].data.name.toUpperCase();
  }
});
// @ts-expect-error low-level typed body handlers validate input by route id.
rpcBodyResultHandler(new Request('https://example.com/rpc'), {
  id: 'users.get',
  input: { ok: true },
});
const rpcTransportResultHandler = createRpcTransportBodyResultHandler(
  manifest,
  handlerOptions
);
// @ts-expect-error service-dependent manifests require matching transport handler plugins.
createRpcTransportBodyResultHandler(manifest);
rpcTransportResultHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { id: '1' },
}).then((result) => {
  const typedResult: RpcManifestBodyResult<typeof manifest> = result;
  if (!(typedResult instanceof Response) && !Array.isArray(typedResult)) {
    typedResult.id.toUpperCase();
  }
});
rpcTransportResultHandler(createFetchRequestSourceForTypes(), [
  { id: 'users.authenticated', input: { ok: true } },
]);
rpcTransportResultHandler(createFetchRequestSourceForTypes(), [
  // @ts-expect-error low-level typed batch bodies reject stream routes.
  { id: 'users.watch', input: { userId: '1' } },
]);

// @ts-expect-error low-level runtime handlers only accept typed procedure manifests.
createRpcBodyResultHandler({ procedures: { broken: { input: t.string() } } });

const fetchHandler = createJoorHandler(manifest, handlerOptions);
const typedFetchHandler: JoorFetchHandler = fetchHandler;
const runtimeSubpathTypedFetchHandler: RuntimeSubpathJoorFetchHandler =
  typedFetchHandler;
fetchHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedFetchHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching fetch handler plugins.
createJoorHandler(manifest);

// @ts-expect-error runtime adapters only accept typed procedure manifests.
createJoorHandler({ procedures: { broken: { input: t.string() } } });

const bunFetch = createBunFetch(manifest, handlerOptions);
const typedBunFetch: BunFetchHandler = bunFetch;
const runtimeSubpathTypedBunFetch: RuntimeSubpathBunFetchHandler =
  typedBunFetch;
bunFetch(new Request('https://example.com/rpc'));
runtimeSubpathTypedBunFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Bun adapter plugins.
createBunFetch(manifest);
const bunRpcHandler: BunRpcRequestHandler = createBunRpcRequestHandler(
  manifest,
  handlerOptions
);
const runtimeSubpathBunRpcHandler: RuntimeSubpathBunRpcRequestHandler =
  bunRpcHandler;
runtimeSubpathBunRpcHandler(new Request('https://example.com/rpc'));
const typedBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunServer: BunServer = serveBun(manifest, typedBunServeOptions);
bunServer.stop();
bunServer.ref?.();
// @ts-expect-error service-dependent manifests require matching Bun serve plugins.
serveBun(manifest);
const denoFetch = createDenoFetch(manifest, handlerOptions);
const typedDenoFetch: DenoFetchHandler = denoFetch;
const runtimeSubpathTypedDenoFetch: RuntimeSubpathDenoFetchHandler =
  typedDenoFetch;
denoFetch(new Request('https://example.com/rpc'));
runtimeSubpathTypedDenoFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno adapter plugins.
createDenoFetch(manifest);
const typedDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoServer: DenoServer = serveDeno(manifest, typedDenoServeOptions);
denoServer.shutdown().then(() => undefined);
denoServer.finished.then(() => undefined);
// @ts-expect-error service-dependent manifests require matching Deno serve plugins.
serveDeno(manifest);

// @ts-expect-error Deno adapters only accept typed procedure manifests.
createDenoFetch({ procedures: { broken: { input: t.string() } } });

const denoHandler = createDenoRpcRequestHandler(manifest, handlerOptions);
const typedDenoHandler: DenoRpcRequestHandler = denoHandler;
const runtimeSubpathTypedDenoHandler: RuntimeSubpathDenoRpcRequestHandler =
  typedDenoHandler;
denoHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedDenoHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno RPC adapter plugins.
createDenoRpcRequestHandler(manifest);
const standaloneDenoHandler = createStandaloneDenoRpcRequestHandler(
  manifest,
  handlerOptions
);
const typedStandaloneDenoHandler: StandaloneDenoRpcRequestHandler =
  standaloneDenoHandler;
standaloneDenoHandler(new Request('https://example.com/rpc'));
typedStandaloneDenoHandler(new Request('https://example.com/rpc'));
const typedStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const standaloneDenoServer: StandaloneDenoServer = serveStandaloneDeno(
  manifest,
  typedStandaloneDenoServeOptions
);
standaloneDenoServer.shutdown().then(() => undefined);
// @ts-expect-error service-dependent manifests require matching standalone Deno serve plugins.
serveStandaloneDeno(manifest);

createStandaloneDenoRpcRequestHandler({
  procedures: {
    // @ts-expect-error standalone Deno transport adapters only accept typed procedure manifests.
    broken: { input: t.string() },
  },
});

const denoTransportResult: DenoTransportBodyResult = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: {},
};
const denoTransportResultFor: DenoTransportBodyResultFor<typeof manifest> =
  manifestRouteBodyResult;
if (
  !(denoTransportResultFor instanceof Response) &&
  !Array.isArray(denoTransportResultFor) &&
  'ok' in denoTransportResultFor &&
  denoTransportResultFor.ok
) {
  denoTransportResultFor.data.name.toUpperCase();
}
const denoTransportHandler: DenoTransportBodyResultHandler = async () =>
  denoTransportResult;
const denoTransportRequestHandler: DenoTransportRequestHandler =
  createDenoTransportRequestHandler(denoTransportHandler);
const denoTransportRequestHandlerWithPath: DenoTransportRequestHandler =
  createDenoTransportRequestHandlerWithPath(denoTransportHandler, '/rpc');
const runtimeSubpathDenoTransportRequestHandler: RuntimeSubpathDenoTransportRequestHandler =
  denoTransportRequestHandler;
denoTransportRequestHandler(new Request('https://example.com/rpc'));
denoTransportRequestHandlerWithPath(new Request('https://example.com/rpc'));
runtimeSubpathDenoTransportRequestHandler(
  new Request('https://example.com/rpc')
);
const routeTypedDenoTransportHandler: DenoTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
  }
  return manifestRouteBodyResult;
};
createDenoTransportRequestHandler(routeTypedDenoTransportHandler);
createDenoTransportRequestHandlerWithPath(
  routeTypedDenoTransportHandler,
  '/rpc'
);
const manifestDenoTransportHandler: DenoTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
    // @ts-expect-error manifest-aware Deno handlers keep route input exact.
    body.input.ok;
  }
  return {
    body: '{"ok":true}',
    headers: { 'cache-control': 'private' },
    responseHeaders: { 'cache-control': 'private' },
  };
};
createDenoTransportRequestHandler(manifestDenoTransportHandler);
manifestDenoTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteRequest
).then((result) => {
  if (!(result instanceof Response) && 'ok' in result && result.ok) {
    result.data.name.toUpperCase();
  }
});
// @ts-expect-error manifest-aware Deno handlers validate body input by route id.
manifestDenoTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
// @ts-expect-error typed Deno transport handlers validate body input by route id.
routeTypedDenoTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
const _bunTransportResult: BunTransportBodyResult = denoTransportResult;
const bunTransportResultFor: BunTransportBodyResultFor<typeof manifest> =
  denoTransportResultFor;
const rootDenoCompiledTransportResultFor: RootDenoCompiledTransportBodyResultFor<
  typeof manifest
> = bunTransportResultFor;
const routeTypedBunTransportHandler: BunTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.authenticated') {
    body.input.ok.valueOf();
  }
  return manifestRouteBodyResult;
};
const bunTransportRequestHandler: BunTransportRequestHandler =
  createBunTransportRequestHandler(routeTypedBunTransportHandler);
const runtimeSubpathBunTransportRequestHandler: RuntimeSubpathBunTransportRequestHandler =
  bunTransportRequestHandler;
bunTransportRequestHandler(new Request('https://example.com/rpc'));
runtimeSubpathBunTransportRequestHandler(
  new Request('https://example.com/rpc')
);
const manifestBunTransportHandler: BunTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
createBunTransportRequestHandler(manifestBunTransportHandler);
manifestBunTransportHandler(createFetchRequestSourceForTypes(), {
  // @ts-expect-error manifest-aware Bun handlers reject unknown body route ids.
  id: 'users.missing',
  input: { id: '1' },
});
routeTypedBunTransportHandler(createFetchRequestSourceForTypes(), {
  // @ts-expect-error typed Bun transport handlers reject missing route ids.
  id: 'users.missing',
  // @ts-expect-error typed Bun transport handlers reject missing route inputs.
  input: {},
});
const standaloneDenoTransportResult: StandaloneDenoTransportBodyResult =
  denoTransportResult;
const standaloneDenoTransportResultFor: StandaloneDenoTransportBodyResultFor<
  typeof manifest
> = rootDenoCompiledTransportResultFor;
const denoCompiledTransportResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest
> = standaloneDenoTransportResultFor;
const standaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandler =
  async () => standaloneDenoTransportResult;
const standaloneDenoTransportRequestHandler: StandaloneDenoTransportRequestHandler =
  createStandaloneDenoTransportRequestHandler(standaloneDenoTransportHandler);
standaloneDenoTransportRequestHandler(new Request('https://example.com/rpc'));
createStandaloneDenoTransportRequestHandler(standaloneDenoTransportHandler);
createStandaloneDenoTransportRequestHandlerWithPath(
  standaloneDenoTransportHandler,
  '/rpc'
);
const routeTypedStandaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
  }
  return manifestRouteBodyResult;
};
createStandaloneDenoTransportRequestHandler(
  routeTypedStandaloneDenoTransportHandler
);
createStandaloneDenoTransportRequestHandlerWithPath(
  routeTypedStandaloneDenoTransportHandler,
  '/rpc'
);
const manifestStandaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
createStandaloneDenoTransportRequestHandler(
  manifestStandaloneDenoTransportHandler
);
manifestStandaloneDenoTransportHandler(createFetchRequestSourceForTypes(), [
  // @ts-expect-error manifest-aware standalone Deno handlers reject stream requests in batches.
  { id: 'users.watch', input: { userId: '1' } },
]);
const compiledSerializedEnvelope: CompiledSerializedEnvelope = {
  body: '{"ok":true}',
  headers: { 'cache-control': 'private' },
  responseHeaders: { 'cache-control': 'private' },
};
compiledSerializedEnvelope.headers?.['cache-control']?.toUpperCase();
const rootCompiledSerializedEnvelope: RootCompiledSerializedEnvelope =
  compiledSerializedEnvelope;
rootCompiledSerializedEnvelope.body.toUpperCase();
const _wrongCompiledSerializedEnvelopeHeaders: CompiledSerializedEnvelope = {
  body: '{"ok":true}',
  headers: {
    // @ts-expect-error compiled serialized envelope headers must be HTTP string values.
    'x-retry-count': 1,
  },
};
_wrongCompiledSerializedEnvelopeHeaders.body.toUpperCase();
const compiledAuthResult: CompiledAuthResult = {};
const rootCompiledAuthResult: RootCompiledAuthResult = compiledAuthResult;
const compiledAuthFailure: CompiledAuthResult = {
  kind: 'error',
  code: 'UNAUTHORIZED',
  details: { message: 'nope' },
};
const compiledAuthResultLike: CompiledAuthResultLike =
  Promise.resolve(compiledAuthFailure);
const rootCompiledAuthResultLike: RootCompiledAuthResultLike =
  compiledAuthResultLike;
rootCompiledAuthResult.valueOf();
Promise.resolve(rootCompiledAuthResultLike).then((result) => {
  result.valueOf();
});
compiledAuthenticate(
  authPolicy,
  {} as JoorContext<object, object, object, object>,
  compiledUncachedExecutionState
);
compiledAuthenticateUncached(
  authPolicy,
  {} as JoorContext<object, object, object, object>
);
const manifestCompiledTransportHandler: CompiledRpcTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
    // @ts-expect-error manifest-aware compiled transport handlers keep route input exact.
    body.input.ok;
  }
  return compiledSerializedEnvelope;
};
const rootManifestCompiledTransportHandler: RootCompiledRpcTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledTransportHandler;
manifestCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteRequest
).then((result) => {
  if (!(result instanceof Response) && 'ok' in result && result.ok) {
    result.data.name.toUpperCase();
  }
});
// @ts-expect-error manifest-aware compiled transport handlers validate body input by route id.
rootManifestCompiledTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
const manifestCompiledBodyHandler: CompiledRpcBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.authenticated') {
    body.input.ok.valueOf();
  }
  return compiledSerializedEnvelope;
};
const rootManifestCompiledBodyHandler: RootCompiledRpcBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledBodyHandler;
rootManifestCompiledBodyHandler(new Request('https://example.com/rpc'), [
  // @ts-expect-error manifest-aware compiled body handlers reject stream requests in batches.
  { id: 'users.watch', input: { userId: '1' } },
]);
const cachedProcedureHeaders: CachedProcedureHeaders = {
  'cache-control': 'private',
};
cachedProcedureHeaders['cache-control']?.toUpperCase();
const procedureCacheHeaderValues: ProcedureCacheHeaderValues = {
  authorization: 'Bearer token',
};
procedureCacheHeaderValues['authorization']?.toUpperCase();
createProcedureCacheKey(
  'users.get',
  ['headers.authorization'],
  { id: '1' },
  procedureCacheHeaderValues,
  {}
).toUpperCase();
createProcedureCacheKey(
  'users.get',
  ['headers.authorization'],
  { id: '1' },
  {
    // @ts-expect-error procedure cache request headers must be HTTP string values.
    authorization: 1,
  },
  {}
);
const cachedProcedureSuccess: CachedProcedureSuccess = {
  data: { ok: true },
  headers: cachedProcedureHeaders,
  expiresAt: Date.now() + 1_000,
};
cachedProcedureSuccess.headers?.['cache-control']?.toUpperCase();
const _wrongCachedProcedureSuccessHeaders: CachedProcedureSuccess = {
  data: { ok: true },
  headers: {
    // @ts-expect-error cached procedure headers must be HTTP string values.
    'x-retry-count': 1,
  },
  expiresAt: Date.now() + 1_000,
};
_wrongCachedProcedureSuccessHeaders.data;
const compiledRuntimeState: CompiledRuntimeState = {
  path: '/rpc',
  runtime: {
    validateInput: true,
    validateHeaders: true,
    validateOutput: true,
    validateResponseHeaders: true,
    enforceRateLimit: true,
    cacheMaxEntries: 100,
    maxBodyBytes: 1_000,
    rateLimit: { trustProxy: false, maxEntries: 100 },
  },
  services: {},
  getServices() {
    return {};
  },
  async resolveServices() {
    return {};
  },
};
const typedCompiledRuntimeState = createCompiledRuntimeState(config);
typedCompiledRuntimeState.getServices()?.users.findById('1').name.toUpperCase();
typedCompiledRuntimeState.resolveServices().then((services) => {
  services.users.findById('1').name.toUpperCase();
});
const rootTypedCompiledRuntimeState = createRootCompiledRuntimeState(config);
rootTypedCompiledRuntimeState
  .getServices()
  ?.users.findById('1')
  .name.toUpperCase();
const rootCompiledRuntimeState: RootCompiledRuntimeState<Services> =
  rootTypedCompiledRuntimeState;
rootCompiledRuntimeState.resolveServices().then((services) => {
  services.users.findById('1').name.toUpperCase();
});
const serviceTypedCompiledRuntimeState: CompiledRuntimeState<Services> =
  typedCompiledRuntimeState;
serviceTypedCompiledRuntimeState.getServices()?.users.findById('1');
const compiledUnaryDispatch: CompiledFixedUnaryDispatch = async () => undefined;
const _serviceTypedCompiledUnaryDispatch: CompiledFixedUnaryDispatch<
  Services
> = async (_body, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return undefined;
};
const _serviceTypedCompiledDispatch: CompiledDispatch<Services> = async (
  _rpcRequest,
  _request,
  services
) => {
  services.users.findById('1').name.toUpperCase();
  return manifestRouteEnvelope;
};
const _rootServiceTypedCompiledUnaryDispatch: RootCompiledFixedUnaryDispatch<Services> =
  _serviceTypedCompiledUnaryDispatch;
const _rootServiceTypedCompiledDispatch: RootCompiledDispatch<Services> =
  _serviceTypedCompiledDispatch;
createCompiledRpcTransportBodyResultHandler(
  _serviceTypedCompiledDispatch,
  config,
  _serviceTypedCompiledUnaryDispatch,
  false,
  true,
  typedCompiledRuntimeState
);
const compiledRpcHandler: CompiledRpcRequestHandler = createCompiledRpcHandler(
  _serviceTypedCompiledDispatch,
  config,
  _serviceTypedCompiledUnaryDispatch
);
const runtimeSubpathCompiledRpcHandler: RuntimeSubpathCompiledRpcRequestHandler =
  compiledRpcHandler;
compiledRpcHandler(new Request('https://example.com/rpc'));
runtimeSubpathCompiledRpcHandler(new Request('https://example.com/rpc'));
createCompiledRpcTransportBodyResultHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
createCompiledRpcHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
createRootCompiledRpcTransportBodyResultHandler(
  _rootServiceTypedCompiledDispatch,
  config,
  _rootServiceTypedCompiledUnaryDispatch,
  false,
  true,
  rootCompiledRuntimeState
);
const rootCompiledRpcHandler: RootCompiledRpcRequestHandler =
  createRootCompiledRpcHandler(
    _rootServiceTypedCompiledDispatch,
    config,
    _rootServiceTypedCompiledUnaryDispatch
  );
rootCompiledRpcHandler(new Request('https://example.com/rpc'));
createRootCompiledRpcHandler(
  _rootServiceTypedCompiledDispatch,
  manifestAwareConfig,
  _rootServiceTypedCompiledUnaryDispatch
);
// @ts-expect-error service-dependent compiled dispatches require matching config services.
createCompiledRpcHandler(_serviceTypedCompiledDispatch);
// @ts-expect-error root compiled dispatches require matching config services.
createRootCompiledRpcHandler(_rootServiceTypedCompiledDispatch);
// @ts-expect-error service-dependent compiled transports require matching config services.
createCompiledRpcTransportBodyResultHandler(_serviceTypedCompiledDispatch, {});
createRootCompiledRpcTransportBodyResultHandler(
  // @ts-expect-error root compiled transports require matching config services.
  _rootServiceTypedCompiledDispatch,
  {}
);
createDenoCompiledTransportRequestHandlerWithPath(
  typedCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _serviceTypedCompiledUnaryDispatch,
  '/rpc'
);
createRootDenoCompiledTransportRequestHandlerWithPath(
  rootCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _rootServiceTypedCompiledUnaryDispatch,
  '/rpc'
);
createDenoCompiledTransportRequestHandlerWithPath(
  // @ts-expect-error compiled Deno transports require unary dispatch services to match runtime state services.
  compiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _serviceTypedCompiledUnaryDispatch,
  '/rpc'
);
const standaloneDenoCompiledHandler =
  createDenoCompiledTransportRequestHandlerWithPath(
    compiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    compiledUnaryDispatch,
    '/rpc'
  );
const typedStandaloneDenoCompiledHandler: DenoCompiledTransportRequestHandler =
  standaloneDenoCompiledHandler;
const rootTypedStandaloneDenoCompiledHandler: RootDenoCompiledTransportRequestHandler =
  typedStandaloneDenoCompiledHandler;
const runtimeSubpathTypedStandaloneDenoCompiledHandler: RuntimeSubpathDenoCompiledTransportRequestHandler =
  rootTypedStandaloneDenoCompiledHandler;
const manifestDenoCompiledTransportHandler: DenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const rootManifestDenoCompiledTransportHandler: RootDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
const runtimeSubpathManifestDenoCompiledTransportHandler: RuntimeSubpathDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledTransportHandler;
const denoCompiledTransportResult: DenoCompiledTransportBodyResult =
  standaloneDenoTransportResult;
const rootDenoCompiledTransportResult: RootDenoCompiledTransportBodyResult =
  denoCompiledTransportResult;
const _runtimeSubpathDenoCompiledTransportResult: RuntimeSubpathDenoCompiledTransportBodyResult =
  rootDenoCompiledTransportResult;
const denoCompiledTransportHandler: DenoCompiledTransportBodyResultHandler =
  standaloneDenoTransportHandler;
const rootDenoCompiledTransportHandler: RootDenoCompiledTransportBodyResultHandler =
  denoCompiledTransportHandler;
const runtimeSubpathDenoCompiledTransportHandler: RuntimeSubpathDenoCompiledTransportBodyResultHandler =
  rootDenoCompiledTransportHandler;
runtimeSubpathDenoCompiledTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { id: '1' },
});
createDenoCompiledTransportRequestHandlerWithPath(
  typedCompiledRuntimeState,
  runtimeSubpathManifestDenoCompiledTransportHandler,
  _serviceTypedCompiledUnaryDispatch,
  '/rpc'
);
standaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
rootTypedStandaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedStandaloneDenoCompiledHandler(
  new Request('https://example.com/rpc')
);
const joorHandlerOptions: JoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorHandlerOptions;
createJoorHandler(manifest, joorHandlerOptions);
createRuntimeSubpathJoorHandler(manifest, runtimeSubpathJoorHandlerOptions);
const nextHandlers: NextRouteHandlers = createNextRouteHandlers(
  manifest,
  handlerOptions
);
const nextRouteHandlersOptions: NextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const nextHandlerOptions: NextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptions;
const runtimeSubpathNextRouteHandlersOptions: RuntimeSubpathNextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptions;
const runtimeSubpathNextHandlerOptions: RuntimeSubpathNextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextHandlerOptions;
createNextRouteHandlers(manifest, nextRouteHandlersOptions);
createRuntimeSubpathNextRouteHandlers(
  manifest,
  runtimeSubpathNextRouteHandlersOptions
);
const nextHandler: NextHandler = createNextHandler(
  manifest,
  nextHandlerOptions
);
const runtimeSubpathNextHandler: RuntimeSubpathNextHandler =
  createRuntimeSubpathNextHandler(manifest, runtimeSubpathNextHandlerOptions);
const nextRouteHandler: NextRouteHandler = nextHandlers.POST;
const runtimeSubpathNextRouteHandler: RuntimeSubpathNextRouteHandler =
  nextRouteHandler;
nextHandler.POST(new Request('https://example.com/rpc'));
runtimeSubpathNextHandler.POST(new Request('https://example.com/rpc'));
nextHandlers.POST(new Request('https://example.com/rpc'));
runtimeSubpathNextRouteHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Next adapter plugins.
createNextRouteHandlers(manifest);
const cloudflareWorker: CloudflareWorker = createCloudflareWorker(
  manifest,
  handlerOptions
);
const cloudflareFetch: CloudflareFetchHandler = cloudflareWorker.fetch;
const runtimeSubpathCloudflareFetch: RuntimeSubpathCloudflareFetchHandler =
  cloudflareFetch;
const cloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathCloudflareWorkerOptions: RuntimeSubpathCloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareWorkerOptions;
createCloudflareWorker(manifest, cloudflareWorkerOptions);
createRuntimeSubpathCloudflareWorker(
  manifest,
  runtimeSubpathCloudflareWorkerOptions
);
cloudflareWorker.fetch(new Request('https://example.com/rpc'));
runtimeSubpathCloudflareFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Cloudflare adapter plugins.
createCloudflareWorker(manifest);
const netlifyFetch = createNetlifyFetch(manifest, handlerOptions);
const typedNetlifyFetch: NetlifyFetchHandler = netlifyFetch;
const runtimeSubpathNetlifyFetch: RuntimeSubpathNetlifyFetchHandler =
  typedNetlifyFetch;
const netlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathNetlifyFetchOptions: RuntimeSubpathNetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyFetchOptions;
createNetlifyFetch(manifest, netlifyFetchOptions);
createRuntimeSubpathNetlifyFetch(manifest, runtimeSubpathNetlifyFetchOptions);
netlifyFetch(new Request('https://example.com/rpc'));
runtimeSubpathNetlifyFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Netlify adapter plugins.
createNetlifyFetch(manifest);
const vercelFetch = createVercelFetch(manifest, handlerOptions);
const typedVercelFetch: VercelFetchHandler = vercelFetch;
const runtimeSubpathVercelFetch: RuntimeSubpathVercelFetchHandler =
  typedVercelFetch;
const vercelFetchOptions: VercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathVercelFetchOptions: RuntimeSubpathVercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelFetchOptions;
createVercelFetch(manifest, vercelFetchOptions);
createRuntimeSubpathVercelFetch(manifest, runtimeSubpathVercelFetchOptions);
vercelFetch(new Request('https://example.com/rpc'));
runtimeSubpathVercelFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Vercel adapter plugins.
createVercelFetch(manifest);
const _nodeHandler = createNodeRpcRequestHandler(manifest, handlerOptions);
_nodeHandler;
// @ts-expect-error service-dependent manifests require matching Node adapter plugins.
createNodeRpcRequestHandler(manifest);
const typedListenOptions: ListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const nodeServer: NodeServer = listen(manifest, typedListenOptions);
nodeServer.close();
nodeServer.address();
nodeServer.ref().unref();
// @ts-expect-error service-dependent manifests require matching Node listen plugins.
listen(manifest);
const transportResult: RpcBodyResult = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: {},
};
createNodeTransportRequestHandler(async () => transportResult);
const _nodeTransportResult: NodeTransportBodyResult = transportResult;
const nodeTransportResultFor: NodeTransportBodyResultFor<typeof manifest> =
  denoCompiledTransportResultFor;
const routeTypedNodeTransportHandler: NodeTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.watch') {
    body.input.userId.toUpperCase();
  }
  return manifestRouteBodyResult;
};
createNodeTransportRequestHandler(routeTypedNodeTransportHandler);
const manifestNodeTransportHandler: NodeTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
createNodeTransportRequestHandler(manifestNodeTransportHandler);
manifestNodeTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.authenticated',
  input: { ok: true },
}).then((result) => {
  if (!(result instanceof Response) && 'ok' in result && result.ok) {
    result.data.userId.toUpperCase();
  }
});
routeTypedNodeTransportHandler(createFetchRequestSourceForTypes(), [
  // @ts-expect-error typed Node transport handlers reject stream requests in batches.
  { id: 'users.watch', input: { userId: '1' } },
]);
const runtimeSubpathFetch = createRuntimeSubpathJoorHandler(
  manifest,
  handlerOptions
);
runtimeSubpathFetch(new Request('https://example.com/rpc'));
const runtimeSubpathDenoResult: RuntimeSubpathDenoTransportBodyResult =
  transportResult;
runtimeSubpathDenoResult.id.toUpperCase();
const runtimeSubpathBunTransportResultFor: RuntimeSubpathBunTransportBodyResultFor<
  typeof manifest
> = nodeTransportResultFor;
const runtimeSubpathDenoTransportResultFor: RuntimeSubpathDenoTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathBunTransportResultFor;
const runtimeSubpathDenoCompiledTransportResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathDenoTransportResultFor;
const runtimeSubpathNodeTransportResultFor: RuntimeSubpathNodeTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathDenoCompiledTransportResultFor;
if (
  !(runtimeSubpathNodeTransportResultFor instanceof Response) &&
  !Array.isArray(runtimeSubpathNodeTransportResultFor) &&
  'ok' in runtimeSubpathNodeTransportResultFor &&
  runtimeSubpathNodeTransportResultFor.ok
) {
  runtimeSubpathNodeTransportResultFor.data.id.toUpperCase();
}
const runtimeSubpathBunTransportHandler: RuntimeSubpathBunTransportBodyResultHandler<
  typeof manifestRouteRequest,
  JoorManifestRouteBodyResultFor<typeof manifest, typeof manifestRouteRequest>
> = async (_request, body) => {
  body.input.id.toUpperCase();
  return manifestRouteEnvelope;
};
createRuntimeSubpathBunTransportRequestHandler(
  runtimeSubpathBunTransportHandler
);
createRuntimeSubpathDenoTransportRequestHandler(
  runtimeSubpathBunTransportHandler
);
const runtimeSubpathManifestBunTransportHandler: RuntimeSubpathBunTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const runtimeSubpathManifestDenoTransportHandler: RuntimeSubpathDenoTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
createRuntimeSubpathBunTransportRequestHandler(
  runtimeSubpathManifestBunTransportHandler
);
createRuntimeSubpathDenoTransportRequestHandler(
  runtimeSubpathManifestDenoTransportHandler
);
const runtimeSubpathNodeTransportHandler: RuntimeSubpathNodeTransportBodyResultHandler<
  typeof manifestRouteRequest,
  JoorManifestRouteBodyResultFor<typeof manifest, typeof manifestRouteRequest>
> = runtimeSubpathBunTransportHandler;
createRuntimeSubpathNodeTransportRequestHandler(
  runtimeSubpathNodeTransportHandler
);
const runtimeSubpathManifestNodeTransportHandler: RuntimeSubpathNodeTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
createRuntimeSubpathNodeTransportRequestHandler(
  runtimeSubpathManifestNodeTransportHandler
);
runtimeSubpathNodeTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  // @ts-expect-error aggregate runtime transport handlers preserve route body input.
  input: { ok: true },
});
const runtimeSubpathNextHandlers: RuntimeSubpathNextRouteHandlers =
  createRuntimeSubpathNextRouteHandlers(manifest, handlerOptions);
runtimeSubpathNextHandlers.POST(new Request('https://example.com/rpc'));
const runtimeSubpathCloudflareWorker = createRuntimeSubpathCloudflareWorker(
  manifest,
  handlerOptions
);
runtimeSubpathCloudflareWorker.fetch(new Request('https://example.com/rpc'));
const bunOptions: BunServeOptions = { port: 3000 };
bunOptions.port?.toFixed();
const denoOptions: DenoServeOptions = { hostname: '127.0.0.1' };
denoOptions.hostname?.toUpperCase();
const standaloneDenoOptions: StandaloneDenoServeOptions = { port: 3001 };
standaloneDenoOptions.port?.toFixed();
const listenOptions: ListenOptions = { hostname: '127.0.0.1' };
listenOptions.hostname?.toUpperCase();

const protocolRequest: RpcRequest<'users.get', { id: string }> = {
  id: 'users.get',
  input: { id: '1' },
  traceId: 'trace-1',
};
protocolRequest.input?.id.toUpperCase();
const _extraProtocolRequestEnvelope: RpcRequest<'users.get', { id: string }> = {
  id: 'users.get',
  input: { id: '1' },
  // @ts-expect-error protocol requests reject unknown envelope fields.
  extra: true,
};
_extraProtocolRequestEnvelope.id.toUpperCase();
// @ts-expect-error protocol requests require an input payload.
const _missingProtocolRequestInput: RpcRequest<'users.get', { id: string }> = {
  id: 'users.get',
};
const protocolBatch: RpcBatchRequest<[typeof protocolRequest]> = [
  protocolRequest,
];
protocolBatch[0].id.toUpperCase();
const readonlyProtocolBatch = [protocolRequest] as const;
const protocolReadonlyBatch: RpcBatchRequest<typeof readonlyProtocolBatch> =
  readonlyProtocolBatch;
protocolReadonlyBatch[0].input?.id.toUpperCase();
const frameworkCode: RpcFrameworkErrorCode = 'VALIDATION_ERROR';
frameworkCode.toUpperCase();
const protocolError: RpcProtocolError<
  'VALIDATION_ERROR',
  { issues: JsonValue[] }
> = {
  code: 'VALIDATION_ERROR',
  message: 'Invalid input',
  status: 400,
  details: { issues: [] },
};
// @ts-expect-error protocol errors with specific details require details.
const _missingProtocolErrorDetails: RpcProtocolError<
  'VALIDATION_ERROR',
  { issues: JsonValue[] }
> = {
  code: 'VALIDATION_ERROR',
  message: 'Invalid input',
  status: 400,
};
const protocolSuccess: RpcSuccess<
  { id: string },
  'users.get',
  { 'cache-control': string }
> = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '1' },
  headers: { 'cache-control': 'private' },
};
const _extraProtocolSuccess: RpcSuccess<
  { id: string },
  'users.get',
  { 'cache-control': string }
> = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '1' },
  headers: { 'cache-control': 'private' },
  // @ts-expect-error protocol success envelopes reject unknown envelope fields.
  extra: true,
};
_extraProtocolSuccess.data.id.toUpperCase();
const rpcResponseHeaderValues: RpcResponseHeaderValues = {
  'cache-control': 'private',
};
rpcResponseHeaderValues['cache-control']?.toUpperCase();
const _wrongProtocolSuccessHeaders: RpcSuccess<
  { id: string },
  'users.get',
  { 'x-retry-count': number }
> = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '1' },
  headers: {
    // @ts-expect-error protocol success headers must be HTTP string values.
    'x-retry-count': 1,
  },
};
_wrongProtocolSuccessHeaders.data.id.toUpperCase();
const protocolFailure: RpcFailure<'users.get', typeof protocolError> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
  error: protocolError,
};
const protocolEnvelope: RpcProtocolEnvelope<
  { id: string },
  'users.get',
  { 'cache-control': string },
  typeof protocolError
> = protocolSuccess;
const protocolResponse: RpcResponse<
  { id: string },
  'users.get',
  { 'cache-control': string },
  typeof protocolError
> = [protocolEnvelope, protocolFailure];
protocolResponse[0]?.id.toUpperCase();
const protocolReadonlyResponse: RpcResponse<
  { id: string },
  'users.get',
  { 'cache-control': string },
  typeof protocolError
> = [protocolEnvelope, protocolFailure] as const;
protocolReadonlyResponse[0]?.id.toUpperCase();

const routeResponseHeaders: RpcRouteResponseHeaders<Routes, 'users.get'> = {
  'cache-control': 'private',
};
routeResponseHeaders['cache-control'].toUpperCase();

const routeNotFoundError: RpcRouteError<Routes, 'users.get'> = {
  code: 'NOT_FOUND',
  message: 'Not found',
  status: 404,
  details: { message: 'User not found' },
};
if (routeNotFoundError.code === 'NOT_FOUND') {
  routeNotFoundError.details?.message.toUpperCase();
}
// @ts-expect-error declared route errors require schema-backed details.
const _missingRouteErrorDetails: RpcRouteError<Routes, 'users.get'> = {
  code: 'NOT_FOUND',
  message: 'Not found',
  status: 404,
};

const routeProtocolRequest: RpcRouteProtocolRequest<Routes, 'users.get'> = {
  id: 'users.get',
  input: { id: '1' },
  traceId: 'trace-1',
};
routeProtocolRequest.input.id.toUpperCase();
const _extraRouteProtocolRequest: RpcRouteProtocolRequest<Routes, 'users.get'> =
  {
    id: 'users.get',
    input: { id: '1' },
    // @ts-expect-error route protocol requests reject unknown envelope fields.
    extra: true,
  };
_extraRouteProtocolRequest.id.toUpperCase();
const streamProtocolRequest: RpcRouteProtocolRequest<Routes, 'users.watch'> = {
  id: 'users.watch',
  input: { userId: '1' },
};
streamProtocolRequest.input.userId.toUpperCase();
const routeProtocolRequestUnion: RpcRouteProtocolRequestUnion<Routes> =
  streamProtocolRequest;
routeProtocolRequestUnion.id.toUpperCase();
const routeBody: RpcRouteBody<Routes> = streamProtocolRequest;
routeBody.id.toUpperCase();
const streamOnlyProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = streamProtocolRequest;
streamOnlyProtocolRequest.input.userId.toUpperCase();
const streamProtocolRequestUnion: RpcRouteStreamProtocolRequestUnion<Routes> =
  streamOnlyProtocolRequest;
streamProtocolRequestUnion.input.userId.toUpperCase();
const unaryProtocolRequest: RpcRouteUnaryProtocolRequest<Routes, 'users.get'> =
  routeProtocolRequest;
unaryProtocolRequest.input.id.toUpperCase();
const unaryProtocolRequestUnion: RpcRouteUnaryProtocolRequestUnion<Routes> =
  unaryProtocolRequest;
unaryProtocolRequestUnion.id.toUpperCase();
const routeBatchRequest: RpcRouteBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = [routeProtocolRequest];
routeBatchRequest[0].input.id.toUpperCase();
const routeBatchBody: RpcRouteBody<Routes> = routeBatchRequest;
routeBatchBody.length.toFixed();
const readonlyRouteBatchBody: RpcRouteBody<Routes> = [
  routeProtocolRequest,
] as const;
readonlyRouteBatchBody.length.toFixed();

const _wrongRouteProtocolRequest: RpcRouteProtocolRequest<Routes, 'users.get'> =
  // @ts-expect-error route protocol requests validate input by id.
  { id: 'users.get', input: { ok: true } };

const _wrongUnaryProtocolRequest: RpcRouteUnaryProtocolRequest<
  Routes,
  // @ts-expect-error unary protocol requests reject stream route ids.
  'users.watch'
> = streamProtocolRequest;

const _wrongStreamProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  // @ts-expect-error stream protocol requests reject unary route ids.
  'users.get'
> = routeProtocolRequest;

const _wrongRouteBatchRequest: RpcRouteBatchRequest<
  Routes,
  // @ts-expect-error route protocol batches reject stream request bodies.
  [typeof streamProtocolRequest]
> = [streamProtocolRequest];

const _wrongRouteBody: RpcRouteBody<Routes> = [
  // @ts-expect-error route bodies reject stream request batches.
  { id: 'users.watch', input: { userId: '1' } },
];

const routeClient = createClient<Routes>({ url: '/rpc' });
const routeClientShape: RouteRpcTransportClient<Routes> = routeClient;
const routeRequestOptions: RpcRouteRequestOptions<Routes, 'users.get'> = {
  headers: { authorization: undefined, 'x-tenant-id': 'tenant-1' },
};
const routeClientHeaders: RpcRouteClientHeaders<Routes, 'users.get'> = {
  authorization: undefined,
  'x-tenant-id': 'tenant-1',
};
const rpcSubpathRouteClientHeaders: RpcSubpathRouteClientHeaders<
  Routes,
  'users.get'
> = routeClientHeaders;
routeClientHeaders['x-tenant-id'].toUpperCase();
rpcSubpathRouteClientHeaders['x-tenant-id'].toUpperCase();
const rpcSubpathRouteRequestOptions: RpcSubpathRouteRequestOptions<
  Routes,
  'users.get'
> = routeRequestOptions;
routeRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
const routeClientArgs: RpcRouteClientArgs<Routes, 'users.get'> = [
  { id: '1' },
  routeRequestOptions,
];
const rpcSubpathRouteClientArgs: RpcSubpathRouteClientArgs<
  Routes,
  'users.get'
> = routeClientArgs;
routeClient.call('users.get', ...routeClientArgs);
routeClient.call('users.get', ...rpcSubpathRouteClientArgs);
const noHeaderRouteClientArgs: RpcRouteClientArgs<
  Routes,
  'users.authenticated'
> = [{ ok: true }];
routeClient.call('users.authenticated', ...noHeaderRouteClientArgs);
const _wrongRouteRequestOptions: RpcRouteRequestOptions<Routes, 'users.get'> = {
  headers: {
    // @ts-expect-error route request options preserve declared header value types.
    'x-tenant-id': 1,
  },
};
_wrongRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
routeClientShape.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const unaryRouteId: RpcUnaryRouteId<Routes> = 'users.get';
unaryRouteId.toUpperCase();
const streamRouteId: RpcStreamRouteId<Routes> = 'users.watch';
streamRouteId.toUpperCase();

// @ts-expect-error route maps require procedure runtimes.
createClient<{ broken: { input: string } }>({ url: '/rpc' });

// @ts-expect-error stream routes are not unary route ids.
const _wrongUnaryRouteId: RpcUnaryRouteId<Routes> = 'users.watch';

// @ts-expect-error unary routes are not stream route ids.
const _wrongStreamRouteId: RpcStreamRouteId<Routes> = 'users.get';

routeClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
routeClient.call('users.authenticated', { ok: true });
routeClient.stream('users.watch', { userId: '1' });

async function consumeRouteStream() {
  for await (const event of routeClient.stream('users.watch', {
    userId: '1',
  })) {
    const eventType: 'user.updated' = event.type;
    eventType.toUpperCase();
    event.userId.toUpperCase();
  }
}
consumeRouteStream();

const routeRequest = routeClient.request(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const typedRouteRequest: RpcRouteRequest<Routes, 'users.get'> = routeRequest;
typedRouteRequest.input.id.toUpperCase();
typedRouteRequest.headers['x-tenant-id'].toUpperCase();
const routeRequestId: 'users.get' = routeRequest.id;
routeRequestId.toUpperCase();

const unionRouteRequest: RpcRouteRequestUnion<Routes> = routeRequest;
unionRouteRequest.id.toUpperCase();

// @ts-expect-error request ids preserve the selected route literal.
const _wrongRouteRequestId: 'users.authenticated' = routeRequest.id;

routeClient
  .call('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } })
  .then((result) => {
    const routeResultId: 'users.get' = result.id;
    routeResultId.toUpperCase();
    if (result.ok) {
      result.data.name.toUpperCase();
      result.headers?.['cache-control'].toUpperCase();

      // @ts-expect-error route response headers preserve the declared shape.
      result.headers?.missing;
    }
    if (!result.ok && result.error.code === 'NOT_FOUND') {
      result.error.details?.message.toUpperCase();

      // @ts-expect-error route errors preserve declared detail schemas.
      result.error.details?.missing;
    }
    if (!result.ok && result.error.code === 'VALIDATION_ERROR') {
      const _runtimeDetails: JsonValue | undefined = result.error.details;
      _runtimeDetails;
    }

    // @ts-expect-error envelopes preserve the selected route literal.
    const _wrongRouteResultId: 'users.authenticated' = result.id;
    _wrongRouteResultId;
  });

routeClient
  .batch([
    routeRequest,
    routeClient.request('users.authenticated', { ok: true }),
  ] as const)
  .then((results) => {
    const firstRouteId: 'users.get' = results[0].id;
    const secondRouteId: 'users.authenticated' = results[1].id;
    firstRouteId.toUpperCase();
    secondRouteId.toUpperCase();
  });

routeClient.batch([
  {
    id: 'users.get',
    input: { id: '1' },
    headers: { 'x-tenant-id': 'tenant-1' },
  },
  {
    id: 'users.authenticated',
    input: { ok: true },
  },
] as const);

routeClient
  .batch([
    {
      id: 'users.get',
      input: { id: '1' },
      headers: { 'x-tenant-id': 'tenant-1' },
    },
  ] as const)
  .then((results) => {
    const directBatchRouteId: 'users.get' = results[0].id;
    directBatchRouteId.toUpperCase();
  });

// @ts-expect-error route client batches reject unknown route ids.
routeClient.batch([{ id: 'users.missing', input: { id: '1' } }] as const);

// @ts-expect-error route client batches validate direct request input by id.
routeClient.batch([{ id: 'users.authenticated', input: { id: '1' } }] as const);

routeClient.batch([
  // @ts-expect-error route client batches require headers for protected routes.
  { id: 'users.get', input: { id: '1' } },
] as const);

const routeEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
};
routeEnvelope.id.toUpperCase();
const _extraRouteEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
  // @ts-expect-error typed route envelopes reject unknown envelope fields.
  extra: true,
};
_extraRouteEnvelope.id.toUpperCase();
// @ts-expect-error route success envelopes require declared response headers.
const _missingRouteEnvelopeHeaders: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  traceId: 'trace-1',
};
_missingRouteEnvelopeHeaders;
const routeEnvelopeUnion: RpcRouteEnvelopeUnion<Routes> = routeEnvelope;
const routeResult: RpcRouteResult<Routes, 'users.get'> = routeEnvelope;
const routeResultUnion: RpcRouteResultUnion<Routes> = routeResult;
const rpcSubpathRouteResult: RpcSubpathRouteResult<Routes, 'users.get'> =
  routeResult;
const rpcSubpathRouteResultUnion: RpcSubpathRouteResultUnion<Routes> =
  routeResultUnion;
rpcSubpathRouteResult.id.toUpperCase();
rpcSubpathRouteResultUnion.id.toUpperCase();
const routeBodyResult: RpcRouteBodyResult<Routes> = routeEnvelopeUnion;
const routeBodyResultFor: RpcRouteBodyResultFor<
  Routes,
  typeof routeProtocolRequest
> = routeEnvelopeUnion;
if (!(routeBodyResultFor instanceof Response)) {
  routeBodyResultFor.data.name.toUpperCase();
}
type InvalidRouteProtocolBody = {
  id: 'users.get';
  input: { ok: true };
};
// @ts-expect-error route body result inference validates request input by route id.
const _wrongRouteBodyResultFor: RpcRouteBodyResultFor<
  Routes,
  InvalidRouteProtocolBody
> = routeEnvelopeUnion;
const rpcSubpathRouteProtocolRequest: RpcSubpathRouteProtocolRequest<
  Routes,
  'users.get'
> = routeProtocolRequest;
const rpcSubpathRouteBody: RpcSubpathRouteBody<Routes> =
  rpcSubpathRouteProtocolRequest;
const rpcSubpathRouteEnvelope: RpcSubpathRouteEnvelope<Routes, 'users.get'> =
  routeEnvelope;
const rpcSubpathRouteBodyResultFor: RpcSubpathRouteBodyResultFor<
  Routes,
  typeof rpcSubpathRouteProtocolRequest
> = rpcSubpathRouteEnvelope;
rpcSubpathRouteBody.id.toUpperCase();
if (!(rpcSubpathRouteBodyResultFor instanceof Response)) {
  rpcSubpathRouteBodyResultFor.data.name.toUpperCase();
}

const rpcSubpathManifestBody: RpcSubpathManifestBody<typeof manifest> =
  publicManifestProtocolRequest;
rpcSubpathManifestBody.id.toUpperCase();
const rpcSubpathManifestBodyResult: RpcSubpathManifestBodyResultFor<
  typeof manifest,
  typeof publicManifestProtocolRequest
> = manifestRouteEnvelope;
if (!(rpcSubpathManifestBodyResult instanceof Response)) {
  if (rpcSubpathManifestBodyResult.ok)
    rpcSubpathManifestBodyResult.data.name.toUpperCase();
}
createRpcSubpathBodyResultHandler(manifest, handlerOptions)(
  new Request('https://example.com/rpc'),
  manifestProtocolRequest
);
createRpcSubpathTransportBodyResultHandler(manifest, handlerOptions)(
  createFetchRequestSourceForTypes(),
  manifestProtocolRequest
);
if (!(routeBodyResult instanceof Response)) {
  if (Array.isArray(routeBodyResult)) {
    routeBodyResult[0]?.id.toUpperCase();
  } else if (routeBodyResult.ok && routeBodyResult.id === 'users.get') {
    routeBodyResult.data.name.toUpperCase();
  }
}
if (routeEnvelope.ok) {
  routeEnvelope.headers?.['cache-control'].toUpperCase();

  // @ts-expect-error typed route envelopes reject unknown response headers.
  routeEnvelope.headers?.missing;
}

const routeErrorEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { message: 'User not found' },
  },
};
if (!routeErrorEnvelope.ok && routeErrorEnvelope.error.code === 'NOT_FOUND') {
  routeErrorEnvelope.error.details?.message.toUpperCase();
}

// @ts-expect-error typed route envelopes require the matching route id.
const _wrongRouteEnvelopeId: RpcRouteEnvelope<Routes, 'users.get'>['id'] =
  'users.authenticated';

const _wrongRouteErrorEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
  // @ts-expect-error typed route errors reject invalid declared details.
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { reason: 'missing' },
  },
};

// @ts-expect-error route-map clients only accept known procedure ids.
routeClient.call('users.missing', { id: '1' });

// @ts-expect-error stream routes cannot be called through unary call.
routeClient.call('users.watch', { userId: '1' });

// @ts-expect-error stream routes cannot create unary batch requests.
routeClient.request('users.watch', { userId: '1' });

// @ts-expect-error stream routes cannot be included in unary batches.
routeClient.batch([{ id: 'users.watch', input: { userId: '1' } }] as const);

routeClient.stream(
  // @ts-expect-error unary routes cannot be consumed through streaming transport.
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);

// @ts-expect-error procedure id controls the input type.
routeClient.call('users.authenticated', { id: '1' });

// @ts-expect-error procedure id controls required headers.
routeClient.call('users.get', { id: '1' });

defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  // @ts-expect-error handler output must match the declared output schema.
  async handler(ctx, input) {
    ctx.services.users.findById(input.id);
    return ctx.ok({ missing: 'id' });
  },
});

defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  // @ts-expect-error manual procedure error results must include declared details.
  handler() {
    return {
      kind: 'error' as const,
      error: {
        code: 'NOT_FOUND' as const,
        message: 'Not found',
        status: 404,
      },
    };
  },
});

defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  // @ts-expect-error manual procedure error result details must match the declared schema.
  handler() {
    return {
      kind: 'error' as const,
      error: {
        code: 'NOT_FOUND' as const,
        message: 'Not found',
        status: 404,
        details: { missing: 'message' },
      },
    };
  },
});

defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  async handler(ctx, input) {
    input.id.toUpperCase();
    // @ts-expect-error no plugin context is available without withContext().
    ctx.services.users.findById(input.id);
    // @ts-expect-error no typed headers are available unless declared.
    ctx.headers.authorization.toUpperCase();
    // @ts-expect-error ctx.error is unavailable without declared errors.
    ctx.error('UNDECLARED', { message: 'Nope' });
    return ctx.ok({ id: input.id });
  },
});
