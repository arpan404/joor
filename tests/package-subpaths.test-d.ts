import {
  createPlugin,
  createAwsLambdaHandlerFor as createRootAwsLambdaHandlerFor,
  createAwsLambdaHttpApiHandlerFor as createRootAwsLambdaHttpApiHandlerFor,
  createAwsLambdaRestApiHandlerFor as createRootAwsLambdaRestApiHandlerFor,
  createRouteUnaryAwsLambdaHandlerFor as createRootRouteUnaryAwsLambdaHandlerFor,
  createStreamRouteAwsLambdaHandlerFor as createRootStreamRouteAwsLambdaHandlerFor,
  createRouteUnaryAwsLambdaHttpApiHandlerFor as createRootRouteUnaryAwsLambdaHttpApiHandlerFor,
  createStreamRouteAwsLambdaHttpApiHandlerFor as createRootStreamRouteAwsLambdaHttpApiHandlerFor,
  createRouteUnaryAwsLambdaRestApiHandlerFor as createRootRouteUnaryAwsLambdaRestApiHandlerFor,
  createStreamRouteAwsLambdaRestApiHandlerFor as createRootStreamRouteAwsLambdaRestApiHandlerFor,
  createBunFetchFor as createRootBunFetchFor,
  createBunRpcRequestHandlerFor as createRootBunRpcRequestHandlerFor,
  createRouteUnaryBunFetchFor as createRootRouteUnaryBunFetchFor,
  createRouteUnaryBunRpcRequestHandlerFor as createRootRouteUnaryBunRpcRequestHandlerFor,
  createStreamRouteBunFetchFor as createRootStreamRouteBunFetchFor,
  createStreamRouteBunRpcRequestHandlerFor as createRootStreamRouteBunRpcRequestHandlerFor,
  createBunTransportRequestHandlerFor as createRootBunTransportRequestHandlerFor,
  createBunTransportRequestHandlerWithPathFor as createRootBunTransportRequestHandlerWithPathFor,
  createDenoFetchFor as createRootDenoFetchFor,
  createDenoCompiledTransportRequestHandlerFor as createRootDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPathFor as createRootDenoCompiledTransportRequestHandlerWithPathFor,
  createDenoRpcRequestHandlerFor as createRootDenoRpcRequestHandlerFor,
  createRouteUnaryDenoFetchFor as createRootRouteUnaryDenoFetchFor,
  createRouteUnaryDenoRpcRequestHandlerFor as createRootRouteUnaryDenoRpcRequestHandlerFor,
  createStreamRouteDenoFetchFor as createRootStreamRouteDenoFetchFor,
  createStreamRouteDenoRpcRequestHandlerFor as createRootStreamRouteDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandlerFor as createRootDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor as createRootDenoTransportRequestHandlerWithPathFor,
  createRuntimeContext as createRootRuntimeContext,
  createCloudflareFetchFor as createRootCloudflareFetchFor,
  createCloudflareWorker as createRootCloudflareWorker,
  createCloudflareWorkerFor as createRootCloudflareWorkerFor,
  createRouteStreamCloudflareFetchFor as createRootRouteStreamCloudflareFetchFor,
  createRouteStreamCloudflareWorkerFor as createRootRouteStreamCloudflareWorkerFor,
  createRouteUnaryCloudflareFetchFor as createRootRouteUnaryCloudflareFetchFor,
  createRouteUnaryCloudflareWorkerFor as createRootRouteUnaryCloudflareWorkerFor,
  createStreamRouteCloudflareFetchFor as createRootStreamRouteCloudflareFetchFor,
  createStreamRouteCloudflareWorkerFor as createRootStreamRouteCloudflareWorkerFor,
  createUnaryRouteCloudflareFetchFor as createRootUnaryRouteCloudflareFetchFor,
  createUnaryRouteCloudflareWorkerFor as createRootUnaryRouteCloudflareWorkerFor,
  createCorsHeaderRecord as createRootCorsHeaderRecord,
  createElysiaHandlerFor as createRootElysiaHandlerFor,
  createRouteUnaryElysiaHandlerFor as createRootRouteUnaryElysiaHandlerFor,
  createStreamRouteElysiaHandlerFor as createRootStreamRouteElysiaHandlerFor,
  createExpressHandlerFor as createRootExpressHandlerFor,
  createRouteUnaryExpressHandlerFor as createRootRouteUnaryExpressHandlerFor,
  createStreamRouteExpressHandlerFor as createRootStreamRouteExpressHandlerFor,
  createFastifyHandlerFor as createRootFastifyHandlerFor,
  createRouteUnaryFastifyHandlerFor as createRootRouteUnaryFastifyHandlerFor,
  createStreamRouteFastifyHandlerFor as createRootStreamRouteFastifyHandlerFor,
  createHonoHandlerFor as createRootHonoHandlerFor,
  createRouteUnaryHonoHandlerFor as createRootRouteUnaryHonoHandlerFor,
  createStreamRouteHonoHandlerFor as createRootStreamRouteHonoHandlerFor,
  createJoorHandlerFor as createRootJoorHandlerFor,
  createRouteStreamJoorHandlerFor as createRootRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandlerFor as createRootRouteUnaryJoorHandlerFor,
  createStreamRouteJoorHandlerFor as createRootStreamRouteJoorHandlerFor,
  createUnaryRouteJoorHandlerFor as createRootUnaryRouteJoorHandlerFor,
  createKoaHandlerFor as createRootKoaHandlerFor,
  createRouteUnaryKoaHandlerFor as createRootRouteUnaryKoaHandlerFor,
  createStreamRouteKoaHandlerFor as createRootStreamRouteKoaHandlerFor,
  createNodeRpcRequestHandlerFor as createRootNodeRpcRequestHandlerFor,
  createRouteUnaryNodeRpcRequestHandlerFor as createRootRouteUnaryNodeRpcRequestHandlerFor,
  createStreamRouteNodeRpcRequestHandlerFor as createRootStreamRouteNodeRpcRequestHandlerFor,
  createNodeTransportRequestHandlerFor as createRootNodeTransportRequestHandlerFor,
  createNodeTransportRequestHandlerWithPathFor as createRootNodeTransportRequestHandlerWithPathFor,
  defineRouteStreamConfigFor as defineRootRouteStreamConfigFor,
  defineRouteUnaryConfigFor as defineRootRouteUnaryConfigFor,
  defineStreamRouteConfigFor as defineRootStreamRouteConfigFor,
  defineUnaryRouteConfigFor as defineRootUnaryRouteConfigFor,
  defineManifest,
  defineProcedure,
  errorStatus,
  createRpcBodyHandlerFor as createRootRpcBodyHandlerFor,
  createRpcBodyResultHandlerFor as createRootRpcBodyResultHandlerFor,
  createRpcHandlerFor as createRootRpcHandlerFor,
  createRouteStreamRpcBodyHandler as createRootRouteStreamRpcBodyHandler,
  createRouteStreamRpcBodyHandlerFor as createRootRouteStreamRpcBodyHandlerFor,
  createRouteStreamRpcBodyResultHandler as createRootRouteStreamRpcBodyResultHandler,
  createRouteStreamRpcBodyResultHandlerFor as createRootRouteStreamRpcBodyResultHandlerFor,
  createRouteStreamRpcTransportBodyResultHandler as createRootRouteStreamRpcTransportBodyResultHandler,
  createRouteUnaryRpcBodyHandler as createRootRouteUnaryRpcBodyHandler,
  createRouteUnaryRpcBodyHandlerFor as createRootRouteUnaryRpcBodyHandlerFor,
  createRouteUnaryRpcBodyResultHandler as createRootRouteUnaryRpcBodyResultHandler,
  createRouteUnaryRpcBodyResultHandlerFor as createRootRouteUnaryRpcBodyResultHandlerFor,
  createRouteUnaryRpcTransportBodyResultHandler as createRootRouteUnaryRpcTransportBodyResultHandler,
  createStreamRouteRpcBodyHandler as createRootStreamRouteRpcBodyHandler,
  createStreamRouteRpcBodyHandlerFor as createRootStreamRouteRpcBodyHandlerFor,
  createStreamRouteRpcBodyResultHandler as createRootStreamRouteRpcBodyResultHandler,
  createStreamRouteRpcBodyResultHandlerFor as createRootStreamRouteRpcBodyResultHandlerFor,
  createStreamRouteRpcTransportBodyResultHandler as createRootStreamRouteRpcTransportBodyResultHandler,
  createUnaryRouteRpcBodyHandler as createRootUnaryRouteRpcBodyHandler,
  createUnaryRouteRpcBodyHandlerFor as createRootUnaryRouteRpcBodyHandlerFor,
  createUnaryRouteRpcBodyResultHandler as createRootUnaryRouteRpcBodyResultHandler,
  createUnaryRouteRpcBodyResultHandlerFor as createRootUnaryRouteRpcBodyResultHandlerFor,
  createUnaryRouteRpcTransportBodyResultHandler as createRootUnaryRouteRpcTransportBodyResultHandler,
  defineRouteStreamHandlerOptions as defineRootRouteStreamHandlerOptions,
  defineRouteUnaryHandlerOptions as defineRootRouteUnaryHandlerOptions,
  defineStreamRouteHandlerOptions as defineRootStreamRouteHandlerOptions,
  defineUnaryRouteHandlerOptions as defineRootUnaryRouteHandlerOptions,
  createCompiledRouteStreamRpcBodyResultHandler as createRootCompiledRouteStreamRpcBodyResultHandler,
  createCompiledRouteStreamRpcTransportBodyResultHandler as createRootCompiledRouteStreamRpcTransportBodyResultHandler,
  createCompiledRouteUnaryRpcBodyResultHandler as createRootCompiledRouteUnaryRpcBodyResultHandler,
  createCompiledRouteUnaryRpcTransportBodyResultHandler as createRootCompiledRouteUnaryRpcTransportBodyResultHandler,
  createCompiledRpcHandlerFor as createRootCompiledRpcHandlerFor,
  createCompiledStreamRouteRpcBodyResultHandler as createRootCompiledStreamRouteRpcBodyResultHandler,
  createCompiledStreamRouteRpcTransportBodyResultHandler as createRootCompiledStreamRouteRpcTransportBodyResultHandler,
  createCompiledUnaryRouteRpcBodyResultHandler as createRootCompiledUnaryRouteRpcBodyResultHandler,
  createCompiledUnaryRouteRpcTransportBodyResultHandler as createRootCompiledUnaryRouteRpcTransportBodyResultHandler,
  compiledCreateProcedureCacheKey as rootCompiledCreateProcedureCacheKey,
  createNetlifyEdgeFunction as createRootNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor as createRootNetlifyEdgeFunctionFor,
  createNetlifyFetchFor as createRootNetlifyFetchFor,
  createRouteStreamNetlifyEdgeFunctionFor as createRootRouteStreamNetlifyEdgeFunctionFor,
  createRouteStreamNetlifyFetchFor as createRootRouteStreamNetlifyFetchFor,
  createRouteUnaryNetlifyEdgeFunctionFor as createRootRouteUnaryNetlifyEdgeFunctionFor,
  createRouteUnaryNetlifyFetchFor as createRootRouteUnaryNetlifyFetchFor,
  createStreamRouteNetlifyEdgeFunctionFor as createRootStreamRouteNetlifyEdgeFunctionFor,
  createStreamRouteNetlifyFetchFor as createRootStreamRouteNetlifyFetchFor,
  createUnaryRouteNetlifyEdgeFunctionFor as createRootUnaryRouteNetlifyEdgeFunctionFor,
  createUnaryRouteNetlifyFetchFor as createRootUnaryRouteNetlifyFetchFor,
  createNextRouteHandlersFor as createRootNextRouteHandlersFor,
  createRouteUnaryNextRouteHandlersFor as createRootRouteUnaryNextRouteHandlersFor,
  createStreamRouteNextRouteHandlersFor as createRootStreamRouteNextRouteHandlersFor,
  createRouteStreamVercelFetchFor as createRootRouteStreamVercelFetchFor,
  createRouteStreamVercelFunctionFor as createRootRouteStreamVercelFunctionFor,
  createRouteUnaryVercelFetchFor as createRootRouteUnaryVercelFetchFor,
  createRouteUnaryVercelFunctionFor as createRootRouteUnaryVercelFunctionFor,
  createStreamRouteVercelFetchFor as createRootStreamRouteVercelFetchFor,
  createStreamRouteVercelFunctionFor as createRootStreamRouteVercelFunctionFor,
  createUnaryRouteVercelFetchFor as createRootUnaryRouteVercelFetchFor,
  createUnaryRouteVercelFunctionFor as createRootUnaryRouteVercelFunctionFor,
  createVercelFetchFor as createRootVercelFetchFor,
  createVercelFunctionFor as createRootVercelFunctionFor,
  encodeSse as rootEncodeSse,
  listen as rootListen,
  ok as rootOk,
  serveBun as rootServeBun,
  serveDeno as rootServeDeno,
  t,
} from 'joor';
import { createAuthPolicy } from 'joor/auth';
import { createManifestClient } from 'joor/client';
import {
  defineConfigFor,
  defineRouteStreamConfigFor,
  defineRouteUnaryConfigFor,
  defineStreamRouteConfigFor,
  defineUnaryRouteConfigFor,
} from 'joor/config';
import {
  createRuntimeContext,
  defineRouteStreamConfigFor as defineContextRouteStreamConfigFor,
  defineRouteUnaryConfigFor as defineContextRouteUnaryConfigFor,
  defineStreamRouteConfigFor as defineContextStreamRouteConfigFor,
  defineUnaryRouteConfigFor as defineContextUnaryRouteConfigFor,
} from 'joor/context';
import { build, createAiDocs, createOpenApiDocument } from 'joor/compiler';
import { ok } from 'joor/procedure';
import {
  createManifestRouteStreamProtocolRequest,
  createManifestRouteStreamRequest,
  createRpcBodyHandlerFor,
  createRpcBodyResultHandlerFor,
  createRpcHandlerFor,
  createRouteStreamRpcBodyHandler,
  createRouteStreamRpcBodyHandlerFor,
  createRouteStreamRpcBodyResultHandler,
  createRouteStreamRpcBodyResultHandlerFor,
  createRouteStreamRpcTransportBodyResultHandler,
  createRouteUnaryRpcBodyHandler,
  createRouteUnaryRpcBodyHandlerFor,
  createRouteUnaryRpcBodyResultHandler,
  createRouteUnaryRpcBodyResultHandlerFor,
  createRouteUnaryRpcTransportBodyResultHandler,
  createStreamRouteRpcBodyHandler,
  createStreamRouteRpcBodyHandlerFor,
  createStreamRouteRpcBodyResultHandler,
  createStreamRouteRpcBodyResultHandlerFor,
  createStreamRouteRpcTransportBodyResultHandler,
  createUnaryRouteRpcBodyHandler,
  createUnaryRouteRpcBodyHandlerFor,
  createUnaryRouteRpcBodyResultHandler,
  createUnaryRouteRpcBodyResultHandlerFor,
  createUnaryRouteRpcTransportBodyResultHandler,
  defineRouteStreamHandlerOptions,
  defineRouteUnaryHandlerOptions,
  defineStreamRouteHandlerOptions,
  defineUnaryRouteHandlerOptions,
  encodeSse as rpcEncodeSse,
} from 'joor/rpc';
import {
  createCompiledRouteStreamRpcBodyResultHandler as createRuntimeCompiledRouteStreamRpcBodyResultHandler,
  createCompiledRouteStreamRpcTransportBodyResultHandler as createRuntimeCompiledRouteStreamRpcTransportBodyResultHandler,
  createCompiledRouteUnaryRpcBodyResultHandler as createRuntimeCompiledRouteUnaryRpcBodyResultHandler,
  createCompiledRouteUnaryRpcTransportBodyResultHandler as createRuntimeCompiledRouteUnaryRpcTransportBodyResultHandler,
  createCompiledRpcHandlerFor as createRuntimeCompiledRpcHandlerFor,
  createCompiledStreamRouteRpcBodyResultHandler as createRuntimeCompiledStreamRouteRpcBodyResultHandler,
  createCompiledStreamRouteRpcTransportBodyResultHandler as createRuntimeCompiledStreamRouteRpcTransportBodyResultHandler,
  createCompiledUnaryRouteRpcBodyResultHandler as createRuntimeCompiledUnaryRouteRpcBodyResultHandler,
  createCompiledUnaryRouteRpcTransportBodyResultHandler as createRuntimeCompiledUnaryRouteRpcTransportBodyResultHandler,
  createDenoCompiledTransportRequestHandlerFor as createRuntimeDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPathFor as createRuntimeDenoCompiledTransportRequestHandlerWithPathFor,
  createRouteUnaryCloudflareFetchFor as createRuntimeRouteUnaryCloudflareFetchFor,
  createRouteUnaryCloudflareWorkerFor as createRuntimeRouteUnaryCloudflareWorkerFor,
  createDenoFetchFor as createRuntimeDenoFetchFor,
  createDenoRpcRequestHandlerFor as createRuntimeDenoRpcRequestHandlerFor,
  createRouteUnaryDenoFetchFor as createRuntimeRouteUnaryDenoFetchFor,
  createRouteUnaryDenoRpcRequestHandlerFor as createRuntimeRouteUnaryDenoRpcRequestHandlerFor,
  createStreamRouteDenoFetchFor as createRuntimeStreamRouteDenoFetchFor,
  createStreamRouteDenoRpcRequestHandlerFor as createRuntimeStreamRouteDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandlerFor as createRuntimeDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor as createRuntimeDenoTransportRequestHandlerWithPathFor,
  createJoorHandler,
  createJoorHandlerFor,
  createRouteStreamJoorHandlerFor as createRuntimeRouteStreamJoorHandlerFor,
  createRouteUnaryJoorHandlerFor as createRuntimeRouteUnaryJoorHandlerFor,
  createStreamRouteJoorHandlerFor as createRuntimeStreamRouteJoorHandlerFor,
  createUnaryRouteJoorHandlerFor as createRuntimeUnaryRouteJoorHandlerFor,
  createStandaloneDenoRpcRequestHandlerFor as createRuntimeStandaloneDenoRpcRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerFor as createRuntimeStandaloneDenoTransportRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerWithPathFor as createRuntimeStandaloneDenoTransportRequestHandlerWithPathFor,
} from 'joor/runtime';
import {
  createAwsLambdaHandler,
  createAwsLambdaHandlerFor,
  createRouteStreamAwsLambdaHandler,
  createRouteStreamAwsLambdaHttpApiHandler,
  createRouteStreamAwsLambdaRestApiHandler,
  createRouteUnaryAwsLambdaHandler,
  createRouteUnaryAwsLambdaHttpApiHandler,
  createRouteUnaryAwsLambdaRestApiHandler,
  createAwsLambdaHttpApiHandlerFor,
  createAwsLambdaRestApiHandlerFor,
  createStreamRouteAwsLambdaHandler,
  createStreamRouteAwsLambdaHttpApiHandler,
  createStreamRouteAwsLambdaRestApiHandler,
  createUnaryRouteAwsLambdaHandler,
  createUnaryRouteAwsLambdaHttpApiHandler,
  createUnaryRouteAwsLambdaRestApiHandler,
} from 'joor/runtime/aws-lambda';
import { DEFAULT_MAX_BODY_BYTES } from 'joor/runtime/body';
import {
  createBunFetch,
  createBunFetchFor,
  createBunRpcRequestHandlerFor,
  createRouteStreamBunFetch,
  createRouteStreamBunRpcRequestHandler,
  createRouteUnaryBunFetch,
  createRouteUnaryBunRpcRequestHandler,
  createStreamRouteBunFetch,
  createStreamRouteBunRpcRequestHandler,
  createUnaryRouteBunFetch,
  createUnaryRouteBunRpcRequestHandler,
  createBunTransportRequestHandlerFor,
  createBunTransportRequestHandlerWithPathFor,
} from 'joor/runtime/bun';
import {
  createCloudflareFetch,
  createCloudflareFetchFor,
  createCloudflareWorker,
  createCloudflareWorkerFor,
  createRouteStreamCloudflareFetch,
  createRouteStreamCloudflareWorker,
  createRouteUnaryCloudflareFetch,
  createRouteUnaryCloudflareWorker,
  createStreamRouteCloudflareFetch,
  createStreamRouteCloudflareWorker,
  createUnaryRouteCloudflareFetch,
  createUnaryRouteCloudflareWorker,
} from 'joor/runtime/cloudflare';
import {
  compiledCreateProcedureCacheKey,
  createCompiledRouteStreamRpcBodyResultHandler,
  createCompiledRouteStreamRpcTransportBodyResultHandler,
  createCompiledRouteUnaryRpcBodyResultHandler,
  createCompiledRouteUnaryRpcTransportBodyResultHandler,
  createCompiledRpcBodyResultHandler,
  createCompiledRpcHandlerFor,
  createCompiledStreamRouteRpcBodyResultHandler,
  createCompiledStreamRouteRpcTransportBodyResultHandler,
  createCompiledUnaryRouteRpcBodyResultHandler,
  createCompiledUnaryRouteRpcTransportBodyResultHandler,
} from 'joor/runtime/compiled';
import {
  createDenoCompiledTransportRequestHandler,
  createDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPathFor,
} from 'joor/runtime/deno-compiled-transport';
import {
  createRouteStreamDenoFetch,
  createRouteStreamDenoRpcRequestHandler,
  createRouteUnaryDenoFetch,
  createRouteUnaryDenoRpcRequestHandler,
  createStreamRouteDenoFetch,
  createStreamRouteDenoRpcRequestHandler,
  createUnaryRouteDenoFetch,
  createUnaryRouteDenoRpcRequestHandler,
  createDenoFetchFor,
  createDenoRpcRequestHandler,
  createDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor,
} from 'joor/runtime/deno';
import {
  createDenoRpcRequestHandlerFor as createStandaloneDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandler,
  createDenoTransportRequestHandlerFor as createStandaloneDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor as createStandaloneDenoTransportRequestHandlerWithPathFor,
} from 'joor/runtime/deno-transport';
import {
  createElysiaHandler,
  createElysiaHandlerFor,
  createRouteStreamElysiaHandler,
  createRouteUnaryElysiaHandler,
  createStreamRouteElysiaHandler,
  createUnaryRouteElysiaHandler,
} from 'joor/runtime/elysia';
import {
  createExpressHandler,
  createExpressHandlerFor,
  createRouteStreamExpressHandler,
  createRouteUnaryExpressHandler,
  createStreamRouteExpressHandler,
  createUnaryRouteExpressHandler,
} from 'joor/runtime/express';
import {
  createFastifyHandler,
  createFastifyHandlerFor,
  createRouteStreamFastifyHandler,
  createRouteUnaryFastifyHandler,
  createStreamRouteFastifyHandler,
  createUnaryRouteFastifyHandler,
} from 'joor/runtime/fastify';
import {
  createHonoHandler,
  createHonoHandlerFor,
  createRouteStreamHonoHandler,
  createRouteUnaryHonoHandler,
  createStreamRouteHonoHandler,
  createUnaryRouteHonoHandler,
} from 'joor/runtime/hono';
import {
  createRouteStreamJoorHandler,
  createRouteUnaryJoorHandler,
  createStreamRouteJoorHandler,
  createUnaryRouteJoorHandler,
} from 'joor/runtime/fetch';
import {
  createKoaHandler,
  createKoaHandlerFor,
  createRouteStreamKoaHandler,
  createRouteUnaryKoaHandler,
  createStreamRouteKoaHandler,
  createUnaryRouteKoaHandler,
} from 'joor/runtime/koa';
import {
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createNetlifyFetch,
  createNetlifyFetchFor,
  createRouteStreamNetlifyEdgeFunction,
  createRouteStreamNetlifyFetch,
  createRouteUnaryNetlifyEdgeFunction,
  createRouteUnaryNetlifyFetch,
  createStreamRouteNetlifyEdgeFunction,
  createStreamRouteNetlifyFetch,
  createUnaryRouteNetlifyEdgeFunction,
  createUnaryRouteNetlifyFetch,
} from 'joor/runtime/netlify';
import {
  createNextHandlerFor,
  createNextHandler,
  createNextRouteHandlersFor,
  createRouteStreamNextHandler,
  createRouteStreamNextRouteHandlers,
  createRouteUnaryNextHandler,
  createRouteUnaryNextRouteHandlers,
  createStreamRouteNextHandler,
  createStreamRouteNextRouteHandlers,
  createUnaryRouteNextHandler,
  createUnaryRouteNextRouteHandlers,
} from 'joor/runtime/next';
import {
  createNodeRpcRequestHandlerFor,
  createNodeTransportRequestHandler,
  createNodeTransportRequestHandlerFor,
  createNodeTransportRequestHandlerWithPathFor,
  createRouteStreamNodeRpcRequestHandler,
  createRouteUnaryNodeRpcRequestHandler,
  createStreamRouteNodeRpcRequestHandler,
  createUnaryRouteNodeRpcRequestHandler,
  listen,
  listenRouteStream,
  listenRouteUnary,
} from 'joor/runtime/node';
import {
  createCorsHeaderRecord,
  jsonOkResponseInit,
} from 'joor/runtime/response';
import {
  createRouteStreamVercelFetch,
  createRouteStreamVercelFunction,
  createRouteUnaryVercelFetch,
  createRouteUnaryVercelFunction,
  createStreamRouteVercelFetch,
  createStreamRouteVercelFunction,
  createUnaryRouteVercelFetch,
  createUnaryRouteVercelFunction,
  createVercelFetch,
  createVercelFetchFor,
  createVercelFunction,
  createVercelFunctionFor,
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
type PackageSubpathManifest = typeof packageSubpathManifest;

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
const packageSubpathConfigRequest: Root.HandlerOptionsRequest<
  typeof packageSubpathConfig
> = new Request('https://example.com/rpc');
packageSubpathConfigRequest.url.toUpperCase();
const packageSubpathJoorConfigRequest: Config.JoorConfigRequest<
  typeof packageSubpathConfig
> = packageSubpathConfigRequest;
packageSubpathJoorConfigRequest.url.toUpperCase();
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
const typedPackageSubpathClient: Client.RpcManifestTransportClient<PackageSubpathManifest> =
  packageSubpathClient;
const typedPackageSubpathUnaryClient: Client.RpcManifestRouteUnaryTransportClient<PackageSubpathManifest> =
  packageSubpathClient;
const typedPackageSubpathStreamClient: Client.RpcManifestRouteStreamTransportClient<PackageSubpathManifest> =
  packageSubpathClient;
const packageSubpathRequest = packageSubpathClient.request('users.get', {
  id: '1',
});
const typedPackageSubpathRequest: Client.RpcManifestRouteRequest<
  PackageSubpathManifest,
  'users.get'
> = packageSubpathRequest;
packageSubpathRequest.input.id.toUpperCase();
const packageSubpathStream = packageSubpathClient.stream('users.watch', {
  userId: '1',
});
const typedPackageSubpathStream: AsyncIterable<
  Client.RpcManifestRouteStreamEvent<PackageSubpathManifest, 'users.watch'> &
    Root.JsonValue
> = packageSubpathStream;
typedPackageSubpathClient.call('users.get', { id: '1' });
typedPackageSubpathUnaryClient.batch([typedPackageSubpathRequest] as const);
typedPackageSubpathStreamClient.stream('users.watch', { userId: '1' });
typedPackageSubpathStream[Symbol.asyncIterator]();
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

const packageSubpathAuthPolicy =
  createAuthPolicy.withContext<PackageSubpathServices>()({
    name: 'package-subpath',
    authenticate(ctx) {
      return { user: ctx.services.users.findById('1') };
    },
  });
packageSubpathAuthPolicy.name.toUpperCase();
const packageSubpathAuthPolicyRequest: Context.AuthPolicyRequest<
  typeof packageSubpathAuthPolicy
> = new Request('https://example.com/rpc');
packageSubpathAuthPolicyRequest.url.toUpperCase();
const packageSubpathProcedureRequest: Procedure.ProcedureRequest<
  typeof packageSubpathProcedure
> = packageSubpathAuthPolicyRequest;
packageSubpathProcedureRequest.url.toUpperCase();
const rootPackageSubpathProcedureRequest: Root.ProcedureRequest<
  typeof packageSubpathProcedure
> = packageSubpathProcedureRequest;
rootPackageSubpathProcedureRequest.url.toUpperCase();

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
  createAwsLambdaHandlerFor,
  createAwsLambdaHttpApiHandlerFor,
  createAwsLambdaRestApiHandlerFor,
  createRouteStreamAwsLambdaHandler,
  createRouteStreamAwsLambdaHttpApiHandler,
  createRouteStreamAwsLambdaRestApiHandler,
  createRouteUnaryAwsLambdaHandler,
  createRouteUnaryAwsLambdaHttpApiHandler,
  createRouteUnaryAwsLambdaRestApiHandler,
  createRootAwsLambdaHandlerFor,
  createRootAwsLambdaHttpApiHandlerFor,
  createRootAwsLambdaRestApiHandlerFor,
  createRootRouteUnaryAwsLambdaHandlerFor,
  createRootRouteUnaryAwsLambdaHttpApiHandlerFor,
  createRootRouteUnaryAwsLambdaRestApiHandlerFor,
  createRootStreamRouteAwsLambdaHandlerFor,
  createRootStreamRouteAwsLambdaHttpApiHandlerFor,
  createRootStreamRouteAwsLambdaRestApiHandlerFor,
  createStreamRouteAwsLambdaHandler,
  createStreamRouteAwsLambdaHttpApiHandler,
  createStreamRouteAwsLambdaRestApiHandler,
  createUnaryRouteAwsLambdaHandler,
  createUnaryRouteAwsLambdaHttpApiHandler,
  createUnaryRouteAwsLambdaRestApiHandler,
  createBunFetch,
  createBunFetchFor,
  createBunRpcRequestHandlerFor,
  createRouteStreamBunFetch,
  createRouteStreamBunRpcRequestHandler,
  createRouteUnaryBunFetch,
  createRouteUnaryBunRpcRequestHandler,
  createRootRouteUnaryBunFetchFor,
  createRootRouteUnaryBunRpcRequestHandlerFor,
  createRootStreamRouteBunFetchFor,
  createRootStreamRouteBunRpcRequestHandlerFor,
  createStreamRouteBunFetch,
  createStreamRouteBunRpcRequestHandler,
  createUnaryRouteBunFetch,
  createUnaryRouteBunRpcRequestHandler,
  createBunTransportRequestHandlerFor,
  createBunTransportRequestHandlerWithPathFor,
  createRootBunFetchFor,
  createRootBunRpcRequestHandlerFor,
  createRootBunTransportRequestHandlerFor,
  createRootBunTransportRequestHandlerWithPathFor,
  createCloudflareFetch,
  createCloudflareFetchFor,
  createCloudflareWorker,
  createCloudflareWorkerFor,
  createRouteStreamCloudflareFetch,
  createRouteStreamCloudflareWorker,
  createRouteUnaryCloudflareFetch,
  createRouteUnaryCloudflareWorker,
  createRootCloudflareFetchFor,
  createRootCloudflareWorker,
  createRootCloudflareWorkerFor,
  createRootRouteStreamCloudflareFetchFor,
  createRootRouteStreamCloudflareWorkerFor,
  createRootRouteUnaryCloudflareFetchFor,
  createRootRouteUnaryCloudflareWorkerFor,
  createRootStreamRouteCloudflareFetchFor,
  createRootStreamRouteCloudflareWorkerFor,
  createRootUnaryRouteCloudflareFetchFor,
  createRootUnaryRouteCloudflareWorkerFor,
  createRuntimeRouteUnaryCloudflareFetchFor,
  createRuntimeRouteUnaryCloudflareWorkerFor,
  createStreamRouteCloudflareFetch,
  createStreamRouteCloudflareWorker,
  createUnaryRouteCloudflareFetch,
  createUnaryRouteCloudflareWorker,
  createOpenApiDocument,
  compiledCreateProcedureCacheKey,
  createCorsHeaderRecord,
  createRootCorsHeaderRecord,
  rootCompiledCreateProcedureCacheKey,
  createManifestRouteStreamProtocolRequest,
  createRpcBodyHandlerFor,
  createRootRpcBodyHandlerFor,
  createRpcBodyResultHandlerFor,
  createRootRpcBodyResultHandlerFor,
  createRpcHandlerFor,
  createRootRpcHandlerFor,
  createRouteStreamRpcBodyHandler,
  createRouteStreamRpcBodyHandlerFor,
  createRouteStreamRpcBodyResultHandler,
  createRouteStreamRpcBodyResultHandlerFor,
  createRouteStreamRpcTransportBodyResultHandler,
  createRouteUnaryRpcBodyHandler,
  createRouteUnaryRpcBodyHandlerFor,
  createRouteUnaryRpcBodyResultHandler,
  createRouteUnaryRpcBodyResultHandlerFor,
  createRouteUnaryRpcTransportBodyResultHandler,
  createRootRouteStreamRpcBodyHandler,
  createRootRouteStreamRpcBodyHandlerFor,
  createRootRouteStreamRpcBodyResultHandler,
  createRootRouteStreamRpcBodyResultHandlerFor,
  createRootRouteStreamRpcTransportBodyResultHandler,
  createRootRouteUnaryRpcBodyHandler,
  createRootRouteUnaryRpcBodyHandlerFor,
  createRootRouteUnaryRpcBodyResultHandler,
  createRootRouteUnaryRpcBodyResultHandlerFor,
  createRootRouteUnaryRpcTransportBodyResultHandler,
  createRootStreamRouteRpcBodyHandler,
  createRootStreamRouteRpcBodyHandlerFor,
  createRootStreamRouteRpcBodyResultHandler,
  createRootStreamRouteRpcBodyResultHandlerFor,
  createRootStreamRouteRpcTransportBodyResultHandler,
  createRootUnaryRouteRpcBodyHandler,
  createRootUnaryRouteRpcBodyHandlerFor,
  createRootUnaryRouteRpcBodyResultHandler,
  createRootUnaryRouteRpcBodyResultHandlerFor,
  createRootUnaryRouteRpcTransportBodyResultHandler,
  createStreamRouteRpcBodyHandler,
  createStreamRouteRpcBodyHandlerFor,
  createStreamRouteRpcBodyResultHandler,
  createStreamRouteRpcBodyResultHandlerFor,
  createStreamRouteRpcTransportBodyResultHandler,
  createUnaryRouteRpcBodyHandler,
  createUnaryRouteRpcBodyHandlerFor,
  createUnaryRouteRpcBodyResultHandler,
  createUnaryRouteRpcBodyResultHandlerFor,
  createUnaryRouteRpcTransportBodyResultHandler,
  defineRouteStreamHandlerOptions,
  defineRouteUnaryHandlerOptions,
  defineRootRouteStreamHandlerOptions,
  defineRootRouteUnaryHandlerOptions,
  defineRootStreamRouteHandlerOptions,
  defineRootUnaryRouteHandlerOptions,
  defineStreamRouteHandlerOptions,
  defineUnaryRouteHandlerOptions,
  createCompiledRouteStreamRpcBodyResultHandler,
  createCompiledRouteStreamRpcTransportBodyResultHandler,
  createCompiledRouteUnaryRpcBodyResultHandler,
  createCompiledRouteUnaryRpcTransportBodyResultHandler,
  createCompiledStreamRouteRpcBodyResultHandler,
  createCompiledStreamRouteRpcTransportBodyResultHandler,
  createCompiledUnaryRouteRpcBodyResultHandler,
  createCompiledUnaryRouteRpcTransportBodyResultHandler,
  createRootCompiledRouteStreamRpcBodyResultHandler,
  createRootCompiledRouteStreamRpcTransportBodyResultHandler,
  createRootCompiledRouteUnaryRpcBodyResultHandler,
  createRootCompiledRouteUnaryRpcTransportBodyResultHandler,
  createCompiledRpcHandlerFor,
  createRootCompiledRpcHandlerFor,
  createRuntimeCompiledRpcHandlerFor,
  createCompiledRpcBodyResultHandler,
  createRootCompiledStreamRouteRpcBodyResultHandler,
  createRootCompiledStreamRouteRpcTransportBodyResultHandler,
  createRootCompiledUnaryRouteRpcBodyResultHandler,
  createRootCompiledUnaryRouteRpcTransportBodyResultHandler,
  createRuntimeCompiledRouteStreamRpcBodyResultHandler,
  createRuntimeCompiledRouteStreamRpcTransportBodyResultHandler,
  createRuntimeCompiledRouteUnaryRpcBodyResultHandler,
  createRuntimeCompiledRouteUnaryRpcTransportBodyResultHandler,
  createRuntimeCompiledStreamRouteRpcBodyResultHandler,
  createRuntimeCompiledStreamRouteRpcTransportBodyResultHandler,
  createRuntimeCompiledUnaryRouteRpcBodyResultHandler,
  createRuntimeCompiledUnaryRouteRpcTransportBodyResultHandler,
  createDenoCompiledTransportRequestHandler,
  createDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPathFor,
  createRootDenoCompiledTransportRequestHandlerFor,
  createRootDenoCompiledTransportRequestHandlerWithPathFor,
  createRuntimeDenoCompiledTransportRequestHandlerFor,
  createRuntimeDenoCompiledTransportRequestHandlerWithPathFor,
  createDenoFetchFor,
  createDenoRpcRequestHandler,
  createDenoRpcRequestHandlerFor,
  createRouteStreamDenoFetch,
  createRouteStreamDenoRpcRequestHandler,
  createRouteUnaryDenoFetch,
  createRouteUnaryDenoRpcRequestHandler,
  createRootRouteUnaryDenoFetchFor,
  createRootRouteUnaryDenoRpcRequestHandlerFor,
  createRootStreamRouteDenoFetchFor,
  createRootStreamRouteDenoRpcRequestHandlerFor,
  createStreamRouteDenoFetch,
  createStreamRouteDenoRpcRequestHandler,
  createUnaryRouteDenoFetch,
  createUnaryRouteDenoRpcRequestHandler,
  createDenoTransportRequestHandler,
  createDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor,
  createRootDenoFetchFor,
  createRootDenoRpcRequestHandlerFor,
  createRootDenoTransportRequestHandlerFor,
  createRootDenoTransportRequestHandlerWithPathFor,
  createRuntimeDenoFetchFor,
  createRuntimeDenoRpcRequestHandlerFor,
  createRuntimeRouteUnaryDenoFetchFor,
  createRuntimeRouteUnaryDenoRpcRequestHandlerFor,
  createRuntimeStreamRouteDenoFetchFor,
  createRuntimeStreamRouteDenoRpcRequestHandlerFor,
  createRuntimeDenoTransportRequestHandlerFor,
  createRuntimeDenoTransportRequestHandlerWithPathFor,
  createStandaloneDenoRpcRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerWithPathFor,
  createRuntimeStandaloneDenoRpcRequestHandlerFor,
  createRuntimeStandaloneDenoTransportRequestHandlerFor,
  createRuntimeStandaloneDenoTransportRequestHandlerWithPathFor,
  createElysiaHandler,
  createElysiaHandlerFor,
  createRouteStreamElysiaHandler,
  createRouteUnaryElysiaHandler,
  createRootRouteUnaryElysiaHandlerFor,
  createRootStreamRouteElysiaHandlerFor,
  createStreamRouteElysiaHandler,
  createUnaryRouteElysiaHandler,
  createExpressHandler,
  createExpressHandlerFor,
  createRouteStreamExpressHandler,
  createRouteUnaryExpressHandler,
  createRootRouteUnaryExpressHandlerFor,
  createRootStreamRouteExpressHandlerFor,
  createStreamRouteExpressHandler,
  createUnaryRouteExpressHandler,
  createFastifyHandler,
  createFastifyHandlerFor,
  createRouteStreamFastifyHandler,
  createRouteUnaryFastifyHandler,
  createRootRouteUnaryFastifyHandlerFor,
  createRootStreamRouteFastifyHandlerFor,
  createStreamRouteFastifyHandler,
  createUnaryRouteFastifyHandler,
  createHonoHandler,
  createHonoHandlerFor,
  createRouteStreamHonoHandler,
  createRouteUnaryHonoHandler,
  createRootRouteUnaryHonoHandlerFor,
  createRootStreamRouteHonoHandlerFor,
  createStreamRouteHonoHandler,
  createUnaryRouteHonoHandler,
  createJoorHandler,
  createJoorHandlerFor,
  createRouteStreamJoorHandler,
  createRouteUnaryJoorHandler,
  createRootRouteStreamJoorHandlerFor,
  createRootRouteUnaryJoorHandlerFor,
  createRootStreamRouteJoorHandlerFor,
  createRootUnaryRouteJoorHandlerFor,
  createRuntimeRouteStreamJoorHandlerFor,
  createRuntimeRouteUnaryJoorHandlerFor,
  createRuntimeStreamRouteJoorHandlerFor,
  createRuntimeUnaryRouteJoorHandlerFor,
  createStreamRouteJoorHandler,
  createUnaryRouteJoorHandler,
  createKoaHandler,
  createKoaHandlerFor,
  createRouteStreamKoaHandler,
  createRouteUnaryKoaHandler,
  createRootRouteUnaryKoaHandlerFor,
  createRootStreamRouteKoaHandlerFor,
  createStreamRouteKoaHandler,
  createUnaryRouteKoaHandler,
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createNetlifyFetch,
  createNetlifyFetchFor,
  createRouteStreamNetlifyEdgeFunction,
  createRouteStreamNetlifyFetch,
  createRouteUnaryNetlifyEdgeFunction,
  createRouteUnaryNetlifyFetch,
  createStreamRouteNetlifyEdgeFunction,
  createStreamRouteNetlifyFetch,
  createUnaryRouteNetlifyEdgeFunction,
  createUnaryRouteNetlifyFetch,
  createNextHandlerFor,
  createNextHandler,
  createNextRouteHandlersFor,
  createRouteStreamNextHandler,
  createRouteStreamNextRouteHandlers,
  createRouteUnaryNextHandler,
  createRouteUnaryNextRouteHandlers,
  createRootRouteUnaryNextRouteHandlersFor,
  createRootStreamRouteNextRouteHandlersFor,
  createStreamRouteNextHandler,
  createStreamRouteNextRouteHandlers,
  createUnaryRouteNextHandler,
  createUnaryRouteNextRouteHandlers,
  createNodeRpcRequestHandlerFor,
  createNodeTransportRequestHandler,
  createNodeTransportRequestHandlerFor,
  createNodeTransportRequestHandlerWithPathFor,
  createRouteStreamNodeRpcRequestHandler,
  createRouteUnaryNodeRpcRequestHandler,
  createRootRouteUnaryNodeRpcRequestHandlerFor,
  createRootStreamRouteNodeRpcRequestHandlerFor,
  createStreamRouteNodeRpcRequestHandler,
  createUnaryRouteNodeRpcRequestHandler,
  createRuntimeContext,
  createRootRuntimeContext,
  createRootElysiaHandlerFor,
  createRootExpressHandlerFor,
  createRootFastifyHandlerFor,
  createRootHonoHandlerFor,
  createRootJoorHandlerFor,
  createRootKoaHandlerFor,
  createRootNodeRpcRequestHandlerFor,
  createRootNodeTransportRequestHandlerFor,
  createRootNodeTransportRequestHandlerWithPathFor,
  defineContextRouteStreamConfigFor,
  defineContextRouteUnaryConfigFor,
  defineContextStreamRouteConfigFor,
  defineContextUnaryRouteConfigFor,
  defineRouteStreamConfigFor,
  defineRouteUnaryConfigFor,
  defineRootRouteStreamConfigFor,
  defineRootRouteUnaryConfigFor,
  defineRootStreamRouteConfigFor,
  defineRootUnaryRouteConfigFor,
  defineStreamRouteConfigFor,
  defineUnaryRouteConfigFor,
  createRootNetlifyEdgeFunction,
  createRootNetlifyEdgeFunctionFor,
  createRootNetlifyFetchFor,
  createRootRouteStreamNetlifyEdgeFunctionFor,
  createRootRouteStreamNetlifyFetchFor,
  createRootRouteUnaryNetlifyEdgeFunctionFor,
  createRootRouteUnaryNetlifyFetchFor,
  createRootStreamRouteNetlifyEdgeFunctionFor,
  createRootStreamRouteNetlifyFetchFor,
  createRootUnaryRouteNetlifyEdgeFunctionFor,
  createRootUnaryRouteNetlifyFetchFor,
  createRootNextRouteHandlersFor,
  createRootRouteUnaryNextRouteHandlersFor,
  createRootStreamRouteNextRouteHandlersFor,
  createRootRouteStreamVercelFetchFor,
  createRootRouteStreamVercelFunctionFor,
  createRootRouteUnaryVercelFetchFor,
  createRootRouteUnaryVercelFunctionFor,
  createRootStreamRouteVercelFetchFor,
  createRootStreamRouteVercelFunctionFor,
  createRootUnaryRouteVercelFetchFor,
  createRootUnaryRouteVercelFunctionFor,
  createRouteStreamVercelFetch,
  createRouteStreamVercelFunction,
  createRouteUnaryVercelFetch,
  createRouteUnaryVercelFunction,
  createStreamRouteVercelFetch,
  createStreamRouteVercelFunction,
  createUnaryRouteVercelFetch,
  createUnaryRouteVercelFunction,
  createRootVercelFetchFor,
  createRootVercelFunctionFor,
  createVercelFetch,
  createVercelFetchFor,
  createVercelFunction,
  createVercelFunctionFor,
  DEFAULT_MAX_BODY_BYTES,
  errorStatus,
  jsonOkResponseInit,
  listen,
  listenRouteStream,
  listenRouteUnary,
  ok,
  rootEncodeSse,
  rootListen,
  rootOk,
  rootServeBun,
  rootServeDeno,
  rpcEncodeSse,
] as const;
packageSubpathValues.length.toFixed();

type PackageSubpathPlugins = readonly [typeof packageSubpathPlugin];
type PackageSubpathBody =
  Manifest.JoorManifestRouteUnaryBody<PackageSubpathManifest>;
type PackageSubpathStreamBody =
  Manifest.JoorManifestRouteStreamBody<PackageSubpathManifest>;
type PackageSubpathManifestBody =
  Manifest.JoorManifestRouteBody<PackageSubpathManifest>;
type PackageSubpathRootManifestBody =
  Root.JoorManifestRouteBody<PackageSubpathManifest>;
type PackageSubpathRpcRouteUnaryHandlerOptionsArgsFor =
  Rpc.RpcManifestRouteUnaryHandlerOptionsArgsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRpcRouteUnaryHandlerOptionsWithTrailingArgs =
  Rpc.RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
    PackageSubpathManifest,
    [preflight?: boolean],
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRpcRouteUnaryHandlerOptionsWithPreflightArgs =
  Rpc.RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRpcRouteStreamHandlerOptionsArgsFor =
  Rpc.RpcManifestRouteStreamHandlerOptionsArgsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathRpcRouteStreamHandlerOptionsWithTrailingArgs =
  Rpc.RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
    PackageSubpathManifest,
    [preflight?: boolean],
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathRpcRouteStreamHandlerOptionsWithPreflightArgs =
  Rpc.RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathRootRouteUnaryHandlerOptionsArgsFor =
  Root.RpcManifestRouteUnaryHandlerOptionsArgsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRootRouteUnaryHandlerOptionsWithTrailingArgs =
  Root.RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
    PackageSubpathManifest,
    [preflight?: boolean],
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRootRouteUnaryHandlerOptionsWithPreflightArgs =
  Root.RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >;
type PackageSubpathRootRouteStreamHandlerOptionsArgsFor =
  Root.RpcManifestRouteStreamHandlerOptionsArgsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathRootRouteStreamHandlerOptionsWithTrailingArgs =
  Root.RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
    PackageSubpathManifest,
    [preflight?: boolean],
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathRootRouteStreamHandlerOptionsWithPreflightArgs =
  Root.RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >;
type PackageSubpathClientProtocolRequest =
  Client.RpcManifestRouteUnaryProtocolRequest<
    PackageSubpathManifest,
    'users.get'
  >;
type PackageSubpathClientProtocolBatch =
  Client.RpcManifestRouteProtocolBatchRequest<
    PackageSubpathManifest,
    readonly [PackageSubpathClientProtocolRequest]
  >;
type PackageSubpathClientMixedBatch = Client.RpcManifestRouteBatchRequest<
  PackageSubpathManifest,
  readonly [PackageSubpathClientRequest]
>;
type PackageSubpathClientMixedBatchResults =
  Client.RpcManifestRouteBatchResults<
    PackageSubpathManifest,
    PackageSubpathClientMixedBatch
  >;
type PackageSubpathClientProtocolBatchResults =
  Client.RpcManifestRouteProtocolBatchResults<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
const packageSubpathClientProtocolBatchResults: PackageSubpathClientProtocolBatchResults =
  [
    {
      ok: true,
      id: 'users.get',
      traceId: 'trace-1',
      data: { name: 'Ada' },
    },
  ] as const;
if (packageSubpathClientProtocolBatchResults[0].ok) {
  packageSubpathClientProtocolBatchResults[0].data.name.toUpperCase();
}
type PackageSubpathClientRequest = Client.RpcManifestRouteRequest<
  PackageSubpathManifest,
  'users.get'
>;
type PackageSubpathClientRequestUnion =
  Client.RpcManifestRouteRequestUnion<PackageSubpathManifest>;
type PackageSubpathClientStreamRequest = Client.RpcManifestRouteStreamRequest<
  PackageSubpathManifest,
  'users.watch'
>;
type PackageSubpathClientStreamRequestUnion =
  Client.RpcManifestRouteStreamRequestUnion<PackageSubpathManifest>;
type PackageSubpathClientBatch =
  Client.RpcManifestRouteUnaryProtocolBatchRequest<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathClientBatchOptions =
  Client.RpcManifestRouteUnaryBatchOptions<
    PackageSubpathManifest,
    PackageSubpathClientBatch
  >;
type PackageSubpathClientProtocolBatchClientHeaders =
  Client.RpcManifestRouteProtocolBatchClientHeaders<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathClientProtocolBatchOptions =
  Client.RpcManifestRouteProtocolBatchOptions<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathClientProtocolBatchOptionsTuple =
  Client.RpcManifestRouteProtocolBatchOptionsTuple<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathManifestProtocolBatchClientHeaders =
  Manifest.JoorManifestRouteProtocolBatchClientHeaders<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathManifestProtocolBatchOptions =
  Manifest.JoorManifestRouteProtocolBatchOptions<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathManifestProtocolBatchOptionsTuple =
  Manifest.JoorManifestRouteProtocolBatchOptionsTuple<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRpcProtocolBatchClientHeaders =
  Rpc.RpcManifestRouteProtocolBatchClientHeaders<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRpcProtocolBatchOptions =
  Rpc.RpcManifestRouteProtocolBatchOptions<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRpcProtocolBatchOptionsTuple =
  Rpc.RpcManifestRouteProtocolBatchOptionsTuple<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRootProtocolBatchClientHeaders =
  Root.RpcManifestRouteProtocolBatchClientHeaders<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRootProtocolBatchOptions =
  Root.RpcManifestRouteProtocolBatchOptions<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathRootProtocolBatchOptionsTuple =
  Root.RpcManifestRouteProtocolBatchOptionsTuple<
    PackageSubpathManifest,
    PackageSubpathClientProtocolBatch
  >;
type PackageSubpathClientRequestOptions =
  Client.RpcManifestRouteUnaryRequestOptions<
    PackageSubpathManifest,
    'users.get'
  >;
type PackageSubpathClientArgs = Client.RpcManifestRouteUnaryClientArgs<
  PackageSubpathManifest,
  'users.get'
>;
type PackageSubpathClientBodyResultFor = Client.RpcManifestRouteBodyResultFor<
  PackageSubpathManifest,
  PackageSubpathClientProtocolRequest
>;
type PackageSubpathClientBodyResult =
  Client.RpcManifestRouteBodyResult<PackageSubpathManifest>;
type PackageSubpathRpcBody = Rpc.RpcManifestRouteBody<PackageSubpathManifest>;
type PackageSubpathRpcBodyResultFor = Rpc.RpcManifestRouteBodyResultFor<
  PackageSubpathManifest,
  PackageSubpathClientProtocolRequest
>;
type PackageSubpathRpcBodyResult =
  Rpc.RpcManifestRouteBodyResult<PackageSubpathManifest>;
type PackageSubpathRootBody = Root.RpcManifestRouteBody<PackageSubpathManifest>;
type PackageSubpathRootBodyResultFor = Root.RpcManifestRouteBodyResultFor<
  PackageSubpathManifest,
  PackageSubpathClientProtocolRequest
>;
type PackageSubpathRootBodyResult =
  Root.RpcManifestRouteBodyResult<PackageSubpathManifest>;
type PackageSubpathManifestBodyResultFor =
  Manifest.JoorManifestRouteBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathClientProtocolRequest
  >;
type PackageSubpathManifestBodyResult =
  Manifest.JoorManifestRouteBodyResult<PackageSubpathManifest>;
type PackageSubpathRootManifestBodyResultFor =
  Root.JoorManifestRouteBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathClientProtocolRequest
  >;
type PackageSubpathRootManifestBodyResult =
  Root.JoorManifestRouteBodyResult<PackageSubpathManifest>;
const packageSubpathClientBodyResultFor: PackageSubpathClientBodyResultFor =
  new Response();
packageSubpathClientBodyResultFor.headers.get('content-type');
const packageSubpathClientBodyResult: PackageSubpathClientBodyResult =
  packageSubpathClientProtocolBatchResults;
packageSubpathClientBodyResult.valueOf();
const packageSubpathRpcBody: PackageSubpathRpcBody =
  typedPackageSubpathRequest;
packageSubpathRpcBody.input.id.toUpperCase();
const packageSubpathRpcBodyResultFor: PackageSubpathRpcBodyResultFor =
  packageSubpathClientBodyResultFor;
packageSubpathRpcBodyResultFor.valueOf();
const packageSubpathRpcBodyResult: PackageSubpathRpcBodyResult =
  packageSubpathClientBodyResult;
packageSubpathRpcBodyResult.valueOf();
const packageSubpathRootBody: PackageSubpathRootBody = packageSubpathRpcBody;
packageSubpathRootBody.input.id.toUpperCase();
const packageSubpathRootBodyResultFor: PackageSubpathRootBodyResultFor =
  packageSubpathRpcBodyResultFor;
packageSubpathRootBodyResultFor.valueOf();
const packageSubpathRootBodyResult: PackageSubpathRootBodyResult =
  packageSubpathRpcBodyResult;
packageSubpathRootBodyResult.valueOf();
const packageSubpathManifestBody: PackageSubpathManifestBody =
  packageSubpathRpcBody;
packageSubpathManifestBody.input.id.toUpperCase();
const packageSubpathRootManifestBody: PackageSubpathRootManifestBody =
  packageSubpathManifestBody;
packageSubpathRootManifestBody.input.id.toUpperCase();
const packageSubpathManifestBodyResultFor: PackageSubpathManifestBodyResultFor =
  packageSubpathRootBodyResultFor;
packageSubpathManifestBodyResultFor.valueOf();
const packageSubpathManifestBodyResult: PackageSubpathManifestBodyResult =
  packageSubpathRootBodyResult;
packageSubpathManifestBodyResult.valueOf();
const packageSubpathRootManifestBodyResultFor: PackageSubpathRootManifestBodyResultFor =
  packageSubpathManifestBodyResultFor;
packageSubpathRootManifestBodyResultFor.valueOf();
const packageSubpathRootManifestBodyResult: PackageSubpathRootManifestBodyResult =
  packageSubpathManifestBodyResult;
packageSubpathRootManifestBodyResult.valueOf();

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
  Client.RpcManifestRouteProtocolRequest<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteProtocolRequestUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteId<PackageSubpathManifest>,
  Client.RpcManifestRouteUnaryId<PackageSubpathManifest>,
  Client.RpcManifestRouteStreamId<PackageSubpathManifest>,
  Client.RpcManifestRouteProcedure<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryProcedure<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteStreamProcedure<PackageSubpathManifest, 'users.watch'>,
  Client.RpcManifestRouteInput<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryInput<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteStreamInput<PackageSubpathManifest, 'users.watch'>,
  Client.RpcManifestRouteOutput<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryOutput<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteStreamOutput<PackageSubpathManifest, 'users.watch'>,
  Client.RpcManifestRouteClientHeaders<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryClientHeaders<
    PackageSubpathManifest,
    'users.get'
  >,
  Client.RpcManifestRouteStreamClientHeaders<
    PackageSubpathManifest,
    'users.watch'
  >,
  Client.RpcManifestRouteResponseHeaders<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryResponseHeaders<
    PackageSubpathManifest,
    'users.get'
  >,
  Client.RpcManifestRouteErrorCode<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteUnaryErrorCode<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteStreamErrorCode<PackageSubpathManifest, 'users.watch'>,
  Client.RpcManifestRouteEnvelope<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteEnvelopeUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteResult<PackageSubpathManifest, 'users.get'>,
  Client.RpcManifestRouteResultUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteStreamEvent<PackageSubpathManifest, 'users.watch'>,
  Client.RpcManifestRouteUnaryProtocolRequest<
    PackageSubpathManifest,
    'users.get'
  >,
  Client.RpcManifestRouteStreamProtocolRequest<
    PackageSubpathManifest,
    'users.watch'
  >,
  Client.RpcManifestRouteProtocolBatchRequestUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteBatchRequestUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteUnaryBatchRequestUnion<PackageSubpathManifest>,
  Client.RpcManifestRouteBatchRequest<
    PackageSubpathManifest,
    readonly [PackageSubpathClientRequest]
  >,
  Client.RpcManifestRouteUnaryBatchRequest<
    PackageSubpathManifest,
    readonly [PackageSubpathClientRequest]
  >,
  Client.RpcManifestRouteBatchResults<
    PackageSubpathManifest,
    PackageSubpathClientMixedBatch
  >,
  Client.RpcManifestRouteUnaryBatchResults<
    PackageSubpathManifest,
    PackageSubpathClientMixedBatch
  >,
  PackageSubpathClientMixedBatchResults,
  PackageSubpathClientProtocolBatch,
  PackageSubpathClientProtocolBatchResults,
  PackageSubpathClientBatchOptions,
  PackageSubpathClientProtocolBatchClientHeaders,
  PackageSubpathClientProtocolBatchOptions,
  PackageSubpathClientProtocolBatchOptionsTuple,
  PackageSubpathManifestProtocolBatchClientHeaders,
  PackageSubpathManifestProtocolBatchOptions,
  PackageSubpathManifestProtocolBatchOptionsTuple,
  PackageSubpathRpcProtocolBatchClientHeaders,
  PackageSubpathRpcProtocolBatchOptions,
  PackageSubpathRpcProtocolBatchOptionsTuple,
  PackageSubpathRootProtocolBatchClientHeaders,
  PackageSubpathRootProtocolBatchOptions,
  PackageSubpathRootProtocolBatchOptionsTuple,
  PackageSubpathClientRequestOptions,
  PackageSubpathClientArgs,
  Client.RpcManifestRouteBody<PackageSubpathManifest>,
  Client.RpcManifestRouteUnaryBody<PackageSubpathManifest>,
  Client.RpcManifestRouteStreamBody<PackageSubpathManifest>,
  PackageSubpathClientBodyResultFor,
  PackageSubpathClientBodyResult,
  PackageSubpathRpcBody,
  PackageSubpathRpcBodyResultFor,
  PackageSubpathRpcBodyResult,
  PackageSubpathRootBody,
  PackageSubpathRootBodyResultFor,
  PackageSubpathRootBodyResult,
  PackageSubpathManifestBody,
  PackageSubpathManifestBodyResultFor,
  PackageSubpathManifestBodyResult,
  PackageSubpathRootManifestBody,
  PackageSubpathRootManifestBodyResultFor,
  PackageSubpathRootManifestBodyResult,
  PackageSubpathRpcRouteUnaryHandlerOptionsArgsFor,
  PackageSubpathRpcRouteUnaryHandlerOptionsWithTrailingArgs,
  PackageSubpathRpcRouteUnaryHandlerOptionsWithPreflightArgs,
  PackageSubpathRpcRouteStreamHandlerOptionsArgsFor,
  PackageSubpathRpcRouteStreamHandlerOptionsWithTrailingArgs,
  PackageSubpathRpcRouteStreamHandlerOptionsWithPreflightArgs,
  PackageSubpathRootRouteUnaryHandlerOptionsArgsFor,
  PackageSubpathRootRouteUnaryHandlerOptionsWithTrailingArgs,
  PackageSubpathRootRouteUnaryHandlerOptionsWithPreflightArgs,
  PackageSubpathRootRouteStreamHandlerOptionsArgsFor,
  PackageSubpathRootRouteStreamHandlerOptionsWithTrailingArgs,
  PackageSubpathRootRouteStreamHandlerOptionsWithPreflightArgs,
  PackageSubpathClientRequest,
  PackageSubpathClientRequestUnion,
  PackageSubpathClientStreamRequest,
  PackageSubpathClientStreamRequestUnion,
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
  Manifest.JoorManifestRouteUnaryRequest<PackageSubpathManifest, 'users.get'>,
  Manifest.JoorManifestRouteStreamRequest<
    PackageSubpathManifest,
    'users.watch'
  >,
  Manifest.JoorManifestRouteStreamEvent<PackageSubpathManifest, 'users.watch'>,
  Procedure.ProcedureInput<typeof packageSubpathProcedure>,
  Procedure.ProcedureOutput<typeof packageSubpathProcedure>,
  Procedure.ProcedureRequest<typeof packageSubpathProcedure>,
  Procedure.ProcedureResult<{ name: string }, string>,
  Root.ProcedureInput<typeof packageSubpathProcedure>,
  Root.ProcedureOutput<typeof packageSubpathProcedure>,
  Root.ProcedureRequest<typeof packageSubpathProcedure>,
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
  Compiled.CompiledRpcRequestHandlerForConfig<typeof packageSubpathConfig>,
  Compiled.CompiledRuntime['rateLimit'],
  Compiled.CompiledRpcBodyResultHandlerForConfig<typeof packageSubpathConfig>,
  Compiled.CompiledRpcRouteStreamBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Compiled.CompiledRpcRouteStreamTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Compiled.CompiledRpcRouteUnaryBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Compiled.CompiledRpcRouteUnaryTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledRpcRequestHandlerForConfig<typeof packageSubpathConfig>,
  Root.CompiledRpcTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledRpcRouteStreamBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledRpcRouteStreamTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledRpcRouteUnaryBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledRpcRouteUnaryTransportBodyResultHandlerForConfig<
    typeof packageSubpathConfig
  >,
  Root.CompiledCachedProcedureHeaders,
  Root.CompiledProcedureCacheHeaderValues,
  Root.RateLimitRuntimeOptions,
  Config.JoorConfigBody<typeof packageSubpathConfig>,
  Config.JoorConfigManifest<typeof packageSubpathConfig>,
  Config.JoorConfigRequest<typeof packageSubpathConfig>,
  Config.JoorConfigServices<typeof packageSubpathConfig>,
  Context.JoorConfigBody<typeof packageSubpathConfig>,
  Context.JoorConfigManifest<typeof packageSubpathConfig>,
  Context.JoorConfigRequest<typeof packageSubpathConfig>,
  Context.JoorConfigServices<typeof packageSubpathConfig>,
  Root.JoorConfigBody<typeof packageSubpathConfig>,
  Root.JoorConfigManifest<typeof packageSubpathConfig>,
  Root.JoorConfigRequest<typeof packageSubpathConfig>,
  Root.JoorConfigServices<typeof packageSubpathConfig>,
  Config.HandlerOptionsBody<typeof packageSubpathConfig>,
  Config.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Config.HandlerOptionsRequest<typeof packageSubpathConfig>,
  Config.HandlerOptionServices<typeof packageSubpathConfig>,
  Config.HandlerOptionsServices<typeof packageSubpathConfig>,
  Context.HandlerOptionsBody<typeof packageSubpathConfig>,
  Context.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Context.HandlerOptionsRequest<typeof packageSubpathConfig>,
  Context.HandlerOptionServices<typeof packageSubpathConfig>,
  Context.HandlerOptionsServices<typeof packageSubpathConfig>,
  Rpc.HandlerOptionsBody<typeof packageSubpathConfig>,
  Rpc.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Rpc.HandlerOptionsRequest<typeof packageSubpathConfig>,
  Rpc.HandlerOptionServices<typeof packageSubpathConfig>,
  Rpc.HandlerOptionsServices<typeof packageSubpathConfig>,
  Root.HandlerOptionsBody<typeof packageSubpathConfig>,
  Root.HandlerOptionsManifest<typeof packageSubpathConfig>,
  Root.HandlerOptionsRequest<typeof packageSubpathConfig>,
  Root.HandlerOptionServices<typeof packageSubpathConfig>,
  Root.HandlerOptionsServices<typeof packageSubpathConfig>,
  Context.AuthPolicyRequest<typeof packageSubpathAuthPolicy>,
  Root.ContextRequestSource,
  Root.CorsHeaderOptions,
  Deno.DenoRpcRequestHandler,
  DenoCompiledTransport.DenoCompiledTransportRequestHandler,
  DenoTransport.DenoTransportRequestHandler,
  Elysia.ElysiaHandler,
  Express.ExpressRequestHandler,
  Fastify.FastifyHandler,
  FetchRuntime.JoorFetchHandler,
  FetchRuntime.JoorRouteStreamHandlerOptionsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathStreamBody
  >,
  FetchRuntime.JoorRouteUnaryHandlerOptionsFor<
    PackageSubpathManifest,
    PackageSubpathPlugins,
    PackageSubpathBody
  >,
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
  ResponseRuntime.RouteUnaryTransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathBody
  >,
  ResponseRuntime.UnaryRouteTransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathBody
  >,
  ResponseRuntime.RouteStreamTransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathStreamBody
  >,
  ResponseRuntime.StreamRouteTransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathStreamBody
  >,
  ResponseRuntime.CorsHeaderOptions,
  ResponseRuntime.TransportBodyResultFor<
    PackageSubpathManifest,
    PackageSubpathStreamBody
  >,
  Vercel.VercelFetchHandler,
  Vercel.VercelFunction,
  Root.VercelFunction,
];
