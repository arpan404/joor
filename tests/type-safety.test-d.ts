import {
  createPlugin,
  createAuthPolicy,
  defineConfig,
  defineManifest,
  defineProcedure,
  resolvePluginServices,
  createBunFetch,
  createBunTransportRequestHandler,
  createCloudflareWorker,
  createDenoFetch,
  createDenoCompiledTransportRequestHandlerWithPath as createRootDenoCompiledTransportRequestHandlerWithPath,
  createDenoRpcRequestHandler,
  createDenoTransportRequestHandler,
  createDenoTransportRequestHandlerWithPath,
  createJoorHandler,
  createNetlifyFetch,
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
  type BunServeOptionsFor,
  type BunServeOptions,
  type AuthPolicyAuth,
  type AuthPolicyHeaders,
  type AuthPolicyServices,
  type BunTransportBodyResult,
  type BunTransportBodyResultHandler,
  type CloudflareWorker,
  type CompiledDispatch as RootCompiledDispatch,
  type CompiledFixedUnaryDispatch as RootCompiledFixedUnaryDispatch,
  type CompiledRuntimeState as RootCompiledRuntimeState,
  type DenoServeOptionsFor,
  type DenoServeOptions,
  type DenoTransportBodyResult,
  type DenoTransportBodyResultHandler,
  type HandlerHookContext,
  type HandlerHooks,
  type HandlerOptionServices,
  type HandlerOptionsFor,
  type HandlerOptions,
  type JoorMiddleware,
  type JoorConfig,
  type JoorConfigContext,
  type PluginServices,
  type Infer,
  type JsonObject,
  type JsonPrimitive,
  type JoorManifestRouteBody,
  type JoorManifestRouteBodyResult,
  type JoorManifestRouteBodyResultFor,
  type JoorManifestRouteBatchRequest,
  type JoorManifestRouteBatchResults,
  type JoorManifestRouteEnvelope,
  type JoorManifestRouteError,
  type JoorManifestRouteHeaders,
  type JoorManifestRouteId,
  type JoorManifestRouteInput,
  type JoorManifestRouteOutput,
  type JoorManifestRouteProcedure,
  type JoorManifestRouteProtocolRequest,
  type JoorManifestRouteProtocolRequestUnion,
  type JoorManifestRouteRequest,
  type JoorManifestRouteRequestUnion,
  type JoorManifestRouteResponseHeaders,
  type JoorManifestRequiredServices,
  type JoorManifestRouteServices,
  type JoorManifestRouteStreamEvent,
  type JoorManifestRouteStreamProtocolRequest,
  type JoorManifestRouteStreamProtocolRequestUnion,
  type JoorManifestRouteUnaryProtocolRequest,
  type JoorManifestRouteUnaryProtocolRequestUnion,
  type JoorManifestRoutes,
  type JoorManifestStreamRouteId,
  type JoorManifestUnaryRouteId,
  type ListenOptionsFor,
  type ListenOptions,
  type NextRouteHandlers,
  type NodeTransportBodyResult,
  type NodeTransportBodyResultHandler,
  type PendingRpcRequest,
  type Procedure,
  type ProcedureError,
  type ProcedureErrorCode,
  type ProcedureFailure,
  type ProcedureHasHeaders,
  type ProcedureInput,
  type ProcedureAuth,
  type ProcedureOutput,
  type ProcedureResponseHeaders,
  type ProcedureRequiresHeaders,
  type ProcedureServices,
  type RpcEnvelope,
  type RpcBatchRequest,
  type RpcBodyResult,
  type RpcFailure,
  type RpcFrameworkErrorCode,
  type RpcManifest,
  type RpcManifestBody,
  type RpcManifestBodyResult,
  type RpcManifestBodyResultFor,
  type RpcManifestRouteBatchResults,
  type RpcManifestRouteEnvelopeUnion,
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
  type RpcRequest,
  type RpcResponse,
  type RpcRouteError,
  type RpcRouteEnvelope,
  type RpcRouteEnvelopeUnion,
  type RpcRouteBody,
  type RpcRouteBodyResult,
  type RpcRouteBodyResultFor,
  type RpcRouteRequest,
  type RpcRouteRequestUnion,
  type RpcRouteResponseHeaders,
  type RpcRouteBatchRequest,
  type RpcRouteProtocolRequest,
  type RpcRouteProtocolRequestUnion,
  type RpcRouteStreamProtocolRequest,
  type RpcRouteStreamProtocolRequestUnion,
  type RpcRouteUnaryProtocolRequest,
  type RpcRouteUnaryProtocolRequestUnion,
  type RpcSuccess,
  type RpcStreamProcedure,
  type RpcStreamRouteId,
  type RpcUnaryProcedure,
  type RpcUnaryRouteId,
  type Schema,
  type SchemaMeta,
  type StringSchema,
  type ValidationResult,
  type OpenApiSchema,
  type JsonValue,
} from '../src/index.js';
import {
  createAuthPolicy as createAuthPolicySubpath,
  type AuthPolicyAuth as AuthSubpathPolicyAuth,
  type AuthPolicyHeaders as AuthSubpathPolicyHeaders,
  type AuthPolicyServices as AuthSubpathPolicyServices,
} from '../src/auth/index.js';
import { createClient, createManifestClient } from '../src/rpc/client.js';
import {
  createAuthPolicy as createContextSubpathAuthPolicy,
  createPlugin as createContextSubpathPlugin,
  defineConfig as defineContextSubpathConfig,
  resolvePluginServices as resolveContextSubpathPluginServices,
  type AuthPolicy as ContextSubpathAuthPolicy,
  type JoorConfig as ContextSubpathConfig,
  type JoorConfigContext as ContextSubpathConfigContext,
  type JoorContext as ContextSubpathJoorContext,
  type PluginServices as ContextSubpathPluginServices,
} from '../src/context/index.js';
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
  createRpcBodyResultHandler as createRpcSubpathBodyResultHandler,
  createRpcTransportBodyResultHandler as createRpcSubpathTransportBodyResultHandler,
  defineHandlerOptions as defineRpcSubpathHandlerOptions,
  type HandlerHookContext as RpcSubpathHandlerHookContext,
  type RpcManifestBody as RpcSubpathManifestBody,
  type RpcManifestBodyResultFor as RpcSubpathManifestBodyResultFor,
  type RpcRouteBody as RpcSubpathRouteBody,
  type RpcRouteBodyResultFor as RpcSubpathRouteBodyResultFor,
  type RpcRouteEnvelope as RpcSubpathRouteEnvelope,
  type RpcRouteProtocolRequest as RpcSubpathRouteProtocolRequest,
} from '../src/rpc/index.js';
import {
  defineManifest as defineManifestSubpath,
  type JoorManifestRouteBody as JoorSubpathManifestRouteBody,
  type JoorManifestRouteBodyResultFor as JoorSubpathManifestRouteBodyResultFor,
  type JoorManifestRouteEnvelope as JoorSubpathManifestRouteEnvelope,
  type JoorManifestRouteId as JoorSubpathManifestRouteId,
  type JoorManifestRouteInput as JoorSubpathManifestRouteInput,
  type JoorManifestRouteProtocolRequest as JoorSubpathManifestRouteProtocolRequest,
  type JoorManifestRequiredServices as JoorSubpathManifestRequiredServices,
  type JoorManifestRouteServices as JoorSubpathManifestRouteServices,
  type JoorManifestRouteStreamProtocolRequest as JoorSubpathManifestRouteStreamProtocolRequest,
  type JoorManifestRoutes as JoorSubpathManifestRoutes,
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
  type ProcedureResponseHeaders as SubpathProcedureResponseHeaders,
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
  type DenoServeOptionsFor as StandaloneDenoServeOptionsFor,
  type DenoServeOptions as StandaloneDenoServeOptions,
  type DenoTransportBodyResult as StandaloneDenoTransportBodyResult,
  type DenoTransportBodyResultHandler as StandaloneDenoTransportBodyResultHandler,
} from '../src/runtime/deno-transport.js';
import { createDenoCompiledTransportRequestHandlerWithPath } from '../src/runtime/deno-compiled-transport.js';
import {
  createCompiledRpcHandler,
  createCompiledRpcTransportBodyResultHandler,
  createCompiledRuntimeState,
  type executeCompiledProcedure,
} from '../src/runtime/compiled.js';
import type {
  CompiledDispatch,
  CompiledFixedUnaryDispatch,
  CompiledRuntimeState,
} from '../src/runtime/compiled.js';
import {
  createBunTransportRequestHandler as createRuntimeSubpathBunTransportRequestHandler,
  createCloudflareWorker as createRuntimeSubpathCloudflareWorker,
  createDenoTransportRequestHandler as createRuntimeSubpathDenoTransportRequestHandler,
  createJoorHandler as createRuntimeSubpathJoorHandler,
  createNextRouteHandlers as createRuntimeSubpathNextRouteHandlers,
  createNodeTransportRequestHandler as createRuntimeSubpathNodeTransportRequestHandler,
  type BunTransportBodyResultHandler as RuntimeSubpathBunTransportBodyResultHandler,
  type DenoTransportBodyResult as RuntimeSubpathDenoTransportBodyResult,
  type NextRouteHandlers as RuntimeSubpathNextRouteHandlers,
  type NodeTransportBodyResultHandler as RuntimeSubpathNodeTransportBodyResultHandler,
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
const authPolicyAuthFromRoot: AuthPolicyAuth<typeof authPolicy> = {
  userId: '1',
};
authPolicyAuthFromRoot.userId.toUpperCase();
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
    }
  });

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
const manifestRouteResponseHeaders: JoorManifestRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
manifestRouteResponseHeaders['cache-control'].toUpperCase();
const manifestRouteError: JoorManifestRouteError<typeof manifest, 'users.get'> =
  {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { message: 'User not found' },
  };
manifestRouteError.code.toUpperCase();
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

const _wrongManifestBatchBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  readonly [InvalidManifestUnaryProtocolRequest]
> = [
  // @ts-expect-error manifest batch result inference validates request input by route id.
  manifestRouteEnvelope,
];
const _wrongManifestRouteBatchResults: JoorManifestRouteBatchResults<
  typeof manifest,
  readonly [
    {
      id: 'users.get';
      input: { ok: true };
      headers: { 'x-tenant-id': 'tenant-1' };
    },
  ]
> = [
  // @ts-expect-error manifest route batch results validate pending request input by route id.
  manifestRouteEnvelope,
];

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
const publicManifestBodyResult: RpcManifestBodyResult<typeof manifest> =
  publicManifestEnvelopeUnion;
const publicManifestBodyResultFor: RpcManifestBodyResultFor<
  typeof manifest,
  typeof publicManifestProtocolRequest
> = publicManifestEnvelopeUnion;
const _wrongPublicManifestBatchBodyResultFor: RpcManifestBodyResultFor<
  typeof manifest,
  readonly [InvalidManifestUnaryProtocolRequest]
> = [
  // @ts-expect-error public manifest batch result inference validates request input by route id.
  publicManifestEnvelopeUnion,
];
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
};
handlerHookContext.services.users.findById('1').name.toUpperCase();
const rpcSubpathHandlerHookContext: RpcSubpathHandlerHookContext<RootPluginServices> =
  handlerHookContext;
rpcSubpathHandlerHookContext.services.users.findById('1').name.toUpperCase();
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
> = handlerOptions;
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
rpcHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching handler plugins.
createRpcHandler(manifest);
const rpcBodyHandler = createRpcBodyHandler(manifest, handlerOptions);
// @ts-expect-error service-dependent manifests require matching body handler plugins.
createRpcBodyHandler(manifest);
rpcBodyHandler(new Request('https://example.com/rpc'), {
  id: 'users.get',
  input: { id: '1' },
});
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
// @ts-expect-error low-level typed batch bodies reject stream routes.
rpcTransportResultHandler(createFetchRequestSourceForTypes(), [
  { id: 'users.watch', input: { userId: '1' } },
]);

// @ts-expect-error low-level runtime handlers only accept typed procedure manifests.
createRpcBodyResultHandler({ procedures: { broken: { input: t.string() } } });

const fetchHandler = createJoorHandler(manifest, handlerOptions);
fetchHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching fetch handler plugins.
createJoorHandler(manifest);

// @ts-expect-error runtime adapters only accept typed procedure manifests.
createJoorHandler({ procedures: { broken: { input: t.string() } } });

const bunFetch = createBunFetch(manifest, handlerOptions);
bunFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Bun adapter plugins.
createBunFetch(manifest);
const typedBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
serveBun(manifest, typedBunServeOptions);
// @ts-expect-error service-dependent manifests require matching Bun serve plugins.
serveBun(manifest);
const denoFetch = createDenoFetch(manifest, handlerOptions);
denoFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno adapter plugins.
createDenoFetch(manifest);
const typedDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
serveDeno(manifest, typedDenoServeOptions);
// @ts-expect-error service-dependent manifests require matching Deno serve plugins.
serveDeno(manifest);

// @ts-expect-error Deno adapters only accept typed procedure manifests.
createDenoFetch({ procedures: { broken: { input: t.string() } } });

const denoHandler = createDenoRpcRequestHandler(manifest, handlerOptions);
denoHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno RPC adapter plugins.
createDenoRpcRequestHandler(manifest);
const standaloneDenoHandler = createStandaloneDenoRpcRequestHandler(
  manifest,
  handlerOptions
);
standaloneDenoHandler(new Request('https://example.com/rpc'));
const typedStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
serveStandaloneDeno(manifest, typedStandaloneDenoServeOptions);
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
const denoTransportHandler: DenoTransportBodyResultHandler = async () =>
  denoTransportResult;
createDenoTransportRequestHandler(denoTransportHandler);
createDenoTransportRequestHandlerWithPath(denoTransportHandler, '/rpc');
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
// @ts-expect-error typed Deno transport handlers validate body input by route id.
routeTypedDenoTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
const _bunTransportResult: BunTransportBodyResult = denoTransportResult;
const routeTypedBunTransportHandler: BunTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.authenticated') {
    body.input.ok.valueOf();
  }
  return manifestRouteBodyResult;
};
createBunTransportRequestHandler(routeTypedBunTransportHandler);
routeTypedBunTransportHandler(createFetchRequestSourceForTypes(), {
  // @ts-expect-error typed Bun transport handlers reject missing route ids.
  id: 'users.missing',
  // @ts-expect-error typed Bun transport handlers reject missing route inputs.
  input: {},
});
const standaloneDenoTransportResult: StandaloneDenoTransportBodyResult =
  denoTransportResult;
const standaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandler =
  async () => standaloneDenoTransportResult;
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
createCompiledRpcHandler(
  _serviceTypedCompiledDispatch,
  config,
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
createRootCompiledRpcHandler(
  _rootServiceTypedCompiledDispatch,
  config,
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
standaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
const nextHandlers: NextRouteHandlers = createNextRouteHandlers(
  manifest,
  handlerOptions
);
nextHandlers.POST(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Next adapter plugins.
createNextRouteHandlers(manifest);
const cloudflareWorker: CloudflareWorker = createCloudflareWorker(
  manifest,
  handlerOptions
);
cloudflareWorker.fetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Cloudflare adapter plugins.
createCloudflareWorker(manifest);
const netlifyFetch = createNetlifyFetch(manifest, handlerOptions);
netlifyFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Netlify adapter plugins.
createNetlifyFetch(manifest);
const vercelFetch = createVercelFetch(manifest, handlerOptions);
vercelFetch(new Request('https://example.com/rpc'));
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
listen(manifest, typedListenOptions);
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
// @ts-expect-error typed Node transport handlers reject stream requests in batches.
routeTypedNodeTransportHandler(createFetchRequestSourceForTypes(), [
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
const runtimeSubpathNodeTransportHandler: RuntimeSubpathNodeTransportBodyResultHandler<
  typeof manifestRouteRequest,
  JoorManifestRouteBodyResultFor<typeof manifest, typeof manifestRouteRequest>
> = runtimeSubpathBunTransportHandler;
createRuntimeSubpathNodeTransportRequestHandler(
  runtimeSubpathNodeTransportHandler
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

// @ts-expect-error route bodies reject stream request batches.
const _wrongRouteBody: RpcRouteBody<Routes> = [
  { id: 'users.watch', input: { userId: '1' } },
];

const routeClient = createClient<Routes>({ url: '/rpc' });
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
// @ts-expect-error route success envelopes require declared response headers.
const _missingRouteEnvelopeHeaders: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  traceId: 'trace-1',
};
_missingRouteEnvelopeHeaders;
const routeEnvelopeUnion: RpcRouteEnvelopeUnion<Routes> = routeEnvelope;
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

// @ts-expect-error typed route errors reject invalid declared details.
const _wrongRouteErrorEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
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
