import {
  createPlugin,
  createRuntimeContext as createRootRuntimeContext,
  createCloudflareWorker as createRootCloudflareWorker,
  createCloudflareWorkerFor as createRootCloudflareWorkerFor,
  createCorsHeaderRecord as createRootCorsHeaderRecord,
  createElysiaHandlerFor as createRootElysiaHandlerFor,
  createExpressHandlerFor as createRootExpressHandlerFor,
  createFastifyHandlerFor as createRootFastifyHandlerFor,
  createHonoHandlerFor as createRootHonoHandlerFor,
  createKoaHandlerFor as createRootKoaHandlerFor,
  defineManifest,
  defineProcedure,
  errorStatus,
  compiledCreateProcedureCacheKey as rootCompiledCreateProcedureCacheKey,
  createNetlifyEdgeFunction as createRootNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor as createRootNetlifyEdgeFunctionFor,
  createNextRouteHandlersFor as createRootNextRouteHandlersFor,
  encodeSse as rootEncodeSse,
  listen as rootListen,
  ok as rootOk,
  serveBun as rootServeBun,
  serveDeno as rootServeDeno,
  t,
} from 'joor';
import { createAuthPolicy } from 'joor/auth';
import { createManifestClient } from 'joor/client';
import { defineConfigFor } from 'joor/config';
import { createRuntimeContext } from 'joor/context';
import {
  build,
  createAiDocs,
  createOpenApiDocument,
} from 'joor/compiler';
import { ok } from 'joor/procedure';
import {
  createManifestRouteStreamProtocolRequest,
  createManifestRouteStreamRequest,
  encodeSse as rpcEncodeSse,
} from 'joor/rpc';
import { createJoorHandler } from 'joor/runtime';
import { createAwsLambdaHandler } from 'joor/runtime/aws-lambda';
import { DEFAULT_MAX_BODY_BYTES } from 'joor/runtime/body';
import { createBunFetch } from 'joor/runtime/bun';
import {
  createCloudflareFetch,
  createCloudflareWorker,
  createCloudflareWorkerFor,
} from 'joor/runtime/cloudflare';
import {
  compiledCreateProcedureCacheKey,
  createCompiledRpcBodyResultHandler,
} from 'joor/runtime/compiled';
import { createDenoCompiledTransportRequestHandler } from 'joor/runtime/deno-compiled-transport';
import { createDenoRpcRequestHandler } from 'joor/runtime/deno';
import { createDenoTransportRequestHandler } from 'joor/runtime/deno-transport';
import {
  createElysiaHandler,
  createElysiaHandlerFor,
} from 'joor/runtime/elysia';
import {
  createExpressHandler,
  createExpressHandlerFor,
} from 'joor/runtime/express';
import {
  createFastifyHandler,
  createFastifyHandlerFor,
} from 'joor/runtime/fastify';
import { createHonoHandler, createHonoHandlerFor } from 'joor/runtime/hono';
import { createKoaHandler, createKoaHandlerFor } from 'joor/runtime/koa';
import {
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createNetlifyFetch,
} from 'joor/runtime/netlify';
import {
  createNextHandlerFor,
  createNextHandler,
  createNextRouteHandlersFor,
} from 'joor/runtime/next';
import {
  createNodeTransportRequestHandler,
  listen,
} from 'joor/runtime/node';
import {
  createCorsHeaderRecord,
  jsonOkResponseInit,
} from 'joor/runtime/response';
import {
  createVercelFetch,
  createVercelFunction,
} from 'joor/runtime/vercel';
import type * as Auth from 'joor/auth';
import type * as Client from 'joor/client';
import type * as Compiler from 'joor/compiler';
import type * as Config from 'joor/config';
import type * as Context from 'joor/context';
import type * as Manifest from 'joor/manifest';
import type * as Procedure from 'joor/procedure';
import type * as Root from 'joor';
import type * as Rpc from 'joor/rpc';
import type * as Schema from 'joor/schema';
import type * as Runtime from 'joor/runtime';
import type * as AwsLambda from 'joor/runtime/aws-lambda';
import type * as Body from 'joor/runtime/body';
import type * as Bun from 'joor/runtime/bun';
import type * as Cloudflare from 'joor/runtime/cloudflare';
import type * as Compiled from 'joor/runtime/compiled';
import type * as Deno from 'joor/runtime/deno';
import type * as DenoCompiledTransport from 'joor/runtime/deno-compiled-transport';
import type * as DenoTransport from 'joor/runtime/deno-transport';
import type * as Elysia from 'joor/runtime/elysia';
import type * as Express from 'joor/runtime/express';
import type * as Fastify from 'joor/runtime/fastify';
import type * as FetchRuntime from 'joor/runtime/fetch';
import type * as Hono from 'joor/runtime/hono';
import type * as Koa from 'joor/runtime/koa';
import type * as Netlify from 'joor/runtime/netlify';
import type * as Next from 'joor/runtime/next';
import type * as NodeRuntime from 'joor/runtime/node';
import type * as ResponseRuntime from 'joor/runtime/response';
import type * as Vercel from 'joor/runtime/vercel';

const packageSubpathOutputSchema = t.object({ name: t.string() });
const packageSubpathStreamSchema = t.object({ eventId: t.string() });

const packageSubpathProcedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: packageSubpathOutputSchema,
  handler(ctx, input) {
    return ctx.ok({ name: input.id });
  },
});

const packageSubpathStreamProcedure = defineProcedure({
  input: t.object({ userId: t.string() }),
  stream: packageSubpathStreamSchema,
  async *handler(_ctx, input) {
    yield { eventId: input.userId };
  },
});

const packageSubpathManifest = defineManifest({
  procedures: {
    'users.get': packageSubpathProcedure,
    'users.watch': packageSubpathStreamProcedure,
  },
});

const packageSubpathPlugin = createPlugin({
  name: 'package-subpath',
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

const packageSubpathConfig = defineConfigFor(packageSubpathManifest)({
  plugins: [packageSubpathPlugin] as const,
});
type PackageSubpathServices = Config.JoorConfigContext<
  typeof packageSubpathConfig
>;
const packageSubpathServices: PackageSubpathServices = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
packageSubpathServices.users.findById('1').name.toUpperCase();

const packageSubpathClient = createManifestClient(packageSubpathManifest, {
  url: 'https://example.com/rpc',
});
const packageSubpathRequest = packageSubpathClient.request('users.get', {
  id: '1',
});
packageSubpathRequest.input.id.toUpperCase();
const packageSubpathStream = packageSubpathClient.stream('users.watch', {
  userId: '1',
});
const packageSubpathStreamRequest = createManifestRouteStreamProtocolRequest(
  packageSubpathManifest,
  'users.watch',
  { userId: '1' }
);
packageSubpathStreamRequest.input.userId.toUpperCase();
const packageSubpathRouteStreamRequest = createManifestRouteStreamRequest(
  packageSubpathManifest,
  'users.watch',
  { userId: '1' }
);
packageSubpathRouteStreamRequest.input.userId.toUpperCase();
async function consumePackageSubpathStream() {
  for await (const event of packageSubpathStream) {
    event.eventId.toUpperCase();
  }
}
consumePackageSubpathStream();

const packageSubpathAuthPolicy = createAuthPolicy.withContext<PackageSubpathServices>()(
  {
    name: 'package-subpath',
    authenticate(ctx) {
      return { user: ctx.services.users.findById('1') };
    },
  }
);
packageSubpathAuthPolicy.name.toUpperCase();

const packageSubpathCompilerManifest: Compiler.CompilerManifest = {
  procedures: [
    {
      id: 'users.get',
      importPath: '/tmp/joor/users.get.ts',
      exportName: 'users_get',
      procedure: packageSubpathProcedure,
    },
  ],
};
createAiDocs(packageSubpathCompilerManifest)['framework'];
createOpenApiDocument(packageSubpathCompilerManifest)['openapi'];
compiledCreateProcedureCacheKey(
  'users.get',
  ['input.id'],
  { id: '1' },
  {},
  {}
).toUpperCase();
rootCompiledCreateProcedureCacheKey(
  'users.get',
  ['input.id'],
  { id: '1' },
  {},
  {}
).toUpperCase();
createCorsHeaderRecord({ origin: 'https://app.example' })?.[
  'access-control-allow-origin'
]?.toUpperCase();
createRootCorsHeaderRecord({ origin: 'https://app.example' })?.[
  'access-control-allow-origin'
]?.toUpperCase();

const packageSubpathValues = [
  build,
  createAiDocs,
  createAwsLambdaHandler,
  createBunFetch,
  createCloudflareFetch,
  createCloudflareWorker,
  createCloudflareWorkerFor,
  createRootCloudflareWorker,
  createRootCloudflareWorkerFor,
  createOpenApiDocument,
  compiledCreateProcedureCacheKey,
  createCorsHeaderRecord,
  createRootCorsHeaderRecord,
  rootCompiledCreateProcedureCacheKey,
  createManifestRouteStreamProtocolRequest,
  createCompiledRpcBodyResultHandler,
  createDenoCompiledTransportRequestHandler,
  createDenoRpcRequestHandler,
  createDenoTransportRequestHandler,
  createElysiaHandler,
  createElysiaHandlerFor,
  createExpressHandler,
  createExpressHandlerFor,
  createFastifyHandler,
  createFastifyHandlerFor,
  createHonoHandler,
  createHonoHandlerFor,
  createJoorHandler,
  createKoaHandler,
  createKoaHandlerFor,
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createNetlifyFetch,
  createNextHandlerFor,
  createNextHandler,
  createNextRouteHandlersFor,
  createNodeTransportRequestHandler,
  createRuntimeContext,
  createRootRuntimeContext,
  createRootElysiaHandlerFor,
  createRootExpressHandlerFor,
  createRootFastifyHandlerFor,
  createRootHonoHandlerFor,
  createRootKoaHandlerFor,
  createRootNetlifyEdgeFunction,
  createRootNetlifyEdgeFunctionFor,
  createRootNextRouteHandlersFor,
  createVercelFetch,
  createVercelFunction,
  DEFAULT_MAX_BODY_BYTES,
  errorStatus,
  jsonOkResponseInit,
  listen,
  ok,
  rootEncodeSse,
  rootListen,
  rootOk,
  rootServeBun,
  rootServeDeno,
  rpcEncodeSse,
] as const;
packageSubpathValues.length.toFixed();

type PackageSubpathManifest = typeof packageSubpathManifest;
type PackageSubpathPlugins = readonly [typeof packageSubpathPlugin];
type PackageSubpathBody =
  Manifest.JoorManifestRouteUnaryBody<PackageSubpathManifest>;
type PackageSubpathStreamBody =
  Manifest.JoorManifestRouteStreamBody<PackageSubpathManifest>;

export type PackageSubpathSurface = [
  Root.JoorConfigFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >,
  Auth.AuthPolicy<
    PackageSubpathServices,
    Auth.AuthPolicyHeaderValues,
    { user: { id: string; name: string } }
  >,
  Client.ClientOptions,
  Compiler.BuildOptions,
  Compiler.CompiledProcedureGenerationOptions,
  Compiler.CompilerManifest,
  Compiler.EmitOptions,
  Compiler.LoadedProcedure,
  Compiler.ProcedureFile,
  Config.JoorConfigFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >,
  Context.JoorPlugin<PackageSubpathServices>,
  Manifest.JoorManifestRouteUnaryRequest<
    PackageSubpathManifest,
    'users.get'
  >,
  Manifest.JoorManifestRouteStreamRequest<
    PackageSubpathManifest,
    'users.watch'
  >,
  Manifest.JoorManifestRouteStreamEvent<PackageSubpathManifest, 'users.watch'>,
  Procedure.ProcedureResult<{ name: string }, string>,
  Rpc.RateLimitIdentityResolver,
  Rpc.RateLimitRuntimeOptions,
  Rpc.RpcRouteUnaryProtocolRequest<
    Manifest.JoorManifestRoutes<PackageSubpathManifest>,
    'users.get'
  >,
  Rpc.RpcRouteStreamProtocolRequest<
    Manifest.JoorManifestRoutes<PackageSubpathManifest>,
    'users.watch'
  >,
  Rpc.StreamEvent<Root.JsonObject, 'users.get'>,
  Schema.Infer<typeof packageSubpathOutputSchema>,
  Runtime.JoorFetchHandler,
  AwsLambda.AwsLambdaHandler,
  AwsLambda.AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >,
  AwsLambda.AwsLambdaHttpApiUnaryRouteHandlerOptionsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >,
  Body.BodySizeLimitError,
  Bun.BunFetchHandler,
  Bun.BunServer,
  Root.BunServer,
  Cloudflare.CloudflareFetchHandler,
  Cloudflare.CloudflareWorker,
  Root.CloudflareWorker,
  Compiled.CompiledCachedProcedureSuccess,
  Compiled.CompiledExecutionState,
  Compiled.CompiledRpcRequestHandler,
  Compiled.CompiledRuntime['rateLimit'],
  Compiled.CompiledRpcBodyResultHandlerForConfig<typeof packageSubpathConfig>,
  Root.CompiledRpcTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledCachedProcedureHeaders,
  Root.CompiledProcedureCacheHeaderValues,
  Root.RateLimitRuntimeOptions,
  Config.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Context.HandlerOptionsBody<typeof packageSubpathConfig>,
  Context.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Root.ContextRequestSource,
  Root.CorsHeaderOptions,
  Deno.DenoRpcRequestHandler,
  DenoCompiledTransport.DenoCompiledTransportRequestHandler,
  DenoTransport.DenoTransportRequestHandler,
  Elysia.ElysiaHandler,
  Express.ExpressRequestHandler,
  Fastify.FastifyHandler,
  FetchRuntime.JoorFetchHandler,
  Hono.HonoHandler,
  Koa.KoaMiddleware,
  Netlify.NetlifyEdgeFetchHandler,
  Netlify.NetlifyEdgeResult,
  Netlify.NetlifyFetchHandler,
  Root.NetlifyEdgeFetchHandler,
  Root.NetlifyEdgeResult,
  Next.NextRouteContext,
  Next.NextHandler,
  Next.NextRouteParamValue,
  Next.NextRouteParams,
  Root.NextRouteContext,
  NodeRuntime.NodeTransportRequestHandler,
  NodeRuntime.NodeServer,
  Root.NodeServer,
  ResponseRuntime.TransportBodyResultFor<PackageSubpathManifest>,
  ResponseRuntime.CorsHeaderOptions,
  ResponseRuntime.TransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathStreamBody
  >,
  Vercel.VercelFetchHandler,
  Vercel.VercelFunction,
  Root.VercelFunction,
];
