import {
  createPlugin,
  defineManifest,
  defineProcedure,
  errorStatus,
  ok as rootOk,
  t,
} from 'joor';
import { createAuthPolicy } from 'joor/auth';
import { createManifestClient } from 'joor/client';
import { defineConfigFor } from 'joor/config';
import { createRuntimeContext } from 'joor/context';
import { build } from 'joor/compiler';
import { ok } from 'joor/procedure';
import { createJoorHandler } from 'joor/runtime';
import { createAwsLambdaHandler } from 'joor/runtime/aws-lambda';
import { DEFAULT_MAX_BODY_BYTES } from 'joor/runtime/body';
import { createBunFetch } from 'joor/runtime/bun';
import { createCloudflareFetch } from 'joor/runtime/cloudflare';
import { createCompiledRpcBodyResultHandler } from 'joor/runtime/compiled';
import { createDenoCompiledTransportRequestHandler } from 'joor/runtime/deno-compiled-transport';
import { createDenoRpcRequestHandler } from 'joor/runtime/deno';
import { createDenoTransportRequestHandler } from 'joor/runtime/deno-transport';
import { createElysiaHandler } from 'joor/runtime/elysia';
import { createExpressHandler } from 'joor/runtime/express';
import { createFastifyHandler } from 'joor/runtime/fastify';
import { createHonoHandler } from 'joor/runtime/hono';
import { createKoaHandler } from 'joor/runtime/koa';
import { createNetlifyFetch } from 'joor/runtime/netlify';
import { createNextHandler } from 'joor/runtime/next';
import { createNodeTransportRequestHandler } from 'joor/runtime/node';
import { jsonOkResponseInit } from 'joor/runtime/response';
import { createVercelFetch } from 'joor/runtime/vercel';
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

const packageSubpathProcedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: packageSubpathOutputSchema,
  handler(ctx, input) {
    return ctx.ok({ name: input.id });
  },
});

const packageSubpathManifest = defineManifest({
  procedures: {
    'users.get': packageSubpathProcedure,
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

const packageSubpathAuthPolicy = createAuthPolicy.withContext<PackageSubpathServices>()(
  {
    name: 'package-subpath',
    authenticate(ctx) {
      return { user: ctx.services.users.findById('1') };
    },
  }
);
packageSubpathAuthPolicy.name.toUpperCase();

const packageSubpathValues = [
  build,
  createAwsLambdaHandler,
  createBunFetch,
  createCloudflareFetch,
  createCompiledRpcBodyResultHandler,
  createDenoCompiledTransportRequestHandler,
  createDenoRpcRequestHandler,
  createDenoTransportRequestHandler,
  createElysiaHandler,
  createExpressHandler,
  createFastifyHandler,
  createHonoHandler,
  createJoorHandler,
  createKoaHandler,
  createNetlifyFetch,
  createNextHandler,
  createNodeTransportRequestHandler,
  createRuntimeContext,
  createVercelFetch,
  DEFAULT_MAX_BODY_BYTES,
  errorStatus,
  jsonOkResponseInit,
  ok,
  rootOk,
] as const;
packageSubpathValues.length.toFixed();

type PackageSubpathManifest = typeof packageSubpathManifest;
type PackageSubpathPlugins = readonly [typeof packageSubpathPlugin];
type PackageSubpathBody =
  Manifest.JoorManifestRouteUnaryBody<PackageSubpathManifest>;

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
  Procedure.ProcedureResult<{ name: string }, string>,
  Rpc.RpcRouteUnaryProtocolRequest<
    Manifest.JoorManifestRoutes<PackageSubpathManifest>,
    'users.get'
  >,
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
  Cloudflare.CloudflareFetchHandler,
  Compiled.CompiledRpcRequestHandler,
  Compiled.CompiledRpcBodyResultHandlerForConfig<typeof packageSubpathConfig>,
  Root.CompiledRpcTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Config.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Context.HandlerOptionsBody<typeof packageSubpathConfig>,
  Context.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Deno.DenoRpcRequestHandler,
  DenoCompiledTransport.DenoCompiledTransportRequestHandler,
  DenoTransport.DenoTransportRequestHandler,
  Elysia.ElysiaHandler,
  Express.ExpressRequestHandler,
  Fastify.FastifyHandler,
  FetchRuntime.JoorFetchHandler,
  Hono.HonoHandler,
  Koa.KoaMiddleware,
  Netlify.NetlifyFetchHandler,
  Next.NextHandler,
  NodeRuntime.NodeTransportRequestHandler,
  ResponseRuntime.TransportBodyResultFor<PackageSubpathManifest>,
  Vercel.VercelFetchHandler,
];
