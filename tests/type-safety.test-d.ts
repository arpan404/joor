import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  createPlugin,
  createAuthPolicy,
  createFetchRequestSource,
  createRuntimeContext,
  defineConfig,
  defineConfigFor,
  defineManifest,
  defineProcedure,
  errorStatus as rootErrorStatus,
  failure as rootProcedureFailure,
  ok as rootProcedureOk,
  resolvePluginServices,
  createAwsLambdaHandler,
  createAwsLambdaHandlerFor,
  createAwsLambdaHttpApiHandler,
  createAwsLambdaHttpApiHandlerFor,
  createAwsLambdaRestApiHandler,
  createAwsLambdaRestApiHandlerFor,
  BodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES,
  createBunFetch,
  createBunFetchFor,
  createBunRpcRequestHandler,
  createBunRpcRequestHandlerFor,
  createBunTransportRequestHandler,
  createBunTransportRequestHandlerFor,
  createBunTransportRequestHandlerWithPath,
  createBunTransportRequestHandlerWithPathFor,
  createCloudflareFetch,
  createCloudflareFetchFor,
  createCloudflareWorker,
  createCloudflareWorkerFor,
  createDenoFetch,
  createDenoFetchFor,
  createDenoCompiledTransportRequestHandler as createRootDenoCompiledTransportRequestHandler,
  createDenoCompiledTransportRequestHandlerFor as createRootDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPath as createRootDenoCompiledTransportRequestHandlerWithPath,
  createDenoCompiledTransportRequestHandlerWithPathFor as createRootDenoCompiledTransportRequestHandlerWithPathFor,
  createDenoRpcRequestHandler,
  createDenoRpcRequestHandlerFor,
  createStandaloneDenoRpcRequestHandler as createRootStandaloneDenoRpcRequestHandler,
  createStandaloneDenoRpcRequestHandlerFor as createRootStandaloneDenoRpcRequestHandlerFor,
  createStandaloneDenoTransportRequestHandler as createRootStandaloneDenoTransportRequestHandler,
  createStandaloneDenoTransportRequestHandlerFor as createRootStandaloneDenoTransportRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerWithPath as createRootStandaloneDenoTransportRequestHandlerWithPath,
  createStandaloneDenoTransportRequestHandlerWithPathFor as createRootStandaloneDenoTransportRequestHandlerWithPathFor,
  createDenoTransportRequestHandler,
  createDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPath,
  createDenoTransportRequestHandlerWithPathFor,
  createElysiaHandler,
  createElysiaHandlerFor,
  createExpressHandler,
  createExpressHandlerFor,
  createFastifyHandler,
  createFastifyHandlerFor,
  createHonoHandler,
  createHonoHandlerFor,
  createJoorHandler,
  createJoorHandlerFor,
  createKoaHandler,
  createKoaHandlerFor,
  createNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor,
  createNetlifyFetch,
  createNetlifyFetchFor,
  createNextHandler,
  createNextHandlerFor,
  createNextRouteHandlers,
  createNextRouteHandlersFor,
  createNodeRpcRequestHandler,
  createNodeRpcRequestHandlerFor,
  createNodeTransportRequestHandler,
  createNodeTransportRequestHandlerFor,
  createNodeTransportRequestHandlerWithPath,
  createNodeTransportRequestHandlerWithPathFor,
  createVercelFetch,
  createVercelFetchFor,
  createVercelFunction,
  createVercelFunctionFor,
  createClient as createRootClient,
  createManifestClient as createRootManifestClient,
  createManifestRouteProtocolRequest,
  createManifestRouteRequest,
  createManifestRouteStreamProtocolRequest,
  createManifestRouteStreamRequest,
  createManifestRouteUnaryProtocolRequest,
  createManifestStreamRouteProtocolRequest,
  createManifestStreamRouteRequest,
  createManifestUnaryRouteProtocolRequest,
  createManifestRouteUnaryRequest,
  createManifestUnaryRouteRequest,
  createRouteProtocolRequest,
  createRouteRequest,
  createRouteStreamProtocolRequest,
  createRouteStreamRequest,
  createRouteUnaryProtocolRequest,
  createRouteUnaryRequest,
  createStreamRouteProtocolRequest,
  createStreamRouteRequest,
  createUnaryRouteProtocolRequest,
  createUnaryRouteRequest,
  createSseResponse,
  createRpcBodyHandler,
  createRpcBodyHandlerFor,
  createRpcBodyResultHandler,
  createRpcBodyResultHandlerFor,
  createRpcHandler,
  createRpcHandlerFor,
  createRpcRequestPreflight,
  createRpcTransportBodyResultHandler,
  compiledCreateProcedureCacheKey as rootCompiledCreateProcedureCacheKey,
  createCompiledRpcHandler as createRootCompiledRpcHandler,
  createCompiledRpcHandlerFor as createRootCompiledRpcHandlerFor,
  createCompiledRpcBodyResultHandler as createRootCompiledRpcBodyResultHandler,
  createCompiledRpcTransportBodyResultHandler as createRootCompiledRpcTransportBodyResultHandler,
  createCompiledRuntimeState as createRootCompiledRuntimeState,
  defineHandlerOptions,
  encodeSse,
  appendJsonStringHeaders,
  createJsonHeaderRecord,
  hasInvalidHeaderValue,
  isBodySizeLimitError,
  isRpcEnvelopeArray,
  isJsonObject,
  isSerializedJsonEnvelope,
  jsonContentHeaders,
  jsonOkResponseInit,
  listen,
  normalizeMaxBodyBytes,
  parseJson,
  readJsonRequestBody,
  readJsonRequestBodyWithLimit,
  serveBun,
  serveDeno,
  serveStandaloneDeno as serveRootStandaloneDeno,
  t,
  toJsonSchema,
  rpcEnvelopeToResponse,
  serializedEnvelopeToResponse,
  transportResultToResponse,
  validate,
  type ArrayChain,
  type ContextRequestSource,
  type AwsLambdaHandler,
  type AwsLambdaHandlerOptionsArgs,
  type AwsLambdaHandlerOptionsFor,
  type AwsLambdaHttpApiHandler,
  type AwsLambdaHttpApiHandlerOptionsArgs,
  type AwsLambdaHttpApiHandlerOptionsFor,
  type AwsLambdaHttpApiRouteStreamHandlerOptionsArgs,
  type AwsLambdaHttpApiRouteStreamHandlerOptionsFor,
  type AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs,
  type AwsLambdaHttpApiRouteUnaryHandlerOptionsFor,
  type AwsLambdaHttpApiStreamRouteHandlerOptionsArgs,
  type AwsLambdaHttpApiStreamRouteHandlerOptionsFor,
  type AwsLambdaHttpApiUnaryRouteHandlerOptionsArgs,
  type AwsLambdaHttpApiUnaryRouteHandlerOptionsFor,
  type AwsLambdaHttpEventV2,
  type AwsLambdaHttpResponseV2,
  type AwsLambdaRestApiEventV1,
  type AwsLambdaRestApiHandler,
  type AwsLambdaRestApiHandlerOptionsArgs,
  type AwsLambdaRestApiHandlerOptionsFor,
  type AwsLambdaRestApiResponseV1,
  type AwsLambdaRestApiRouteStreamHandlerOptionsArgs,
  type AwsLambdaRestApiRouteStreamHandlerOptionsFor,
  type AwsLambdaRestApiRouteUnaryHandlerOptionsArgs,
  type AwsLambdaRestApiRouteUnaryHandlerOptionsFor,
  type AwsLambdaRestApiStreamRouteHandlerOptionsArgs,
  type AwsLambdaRestApiStreamRouteHandlerOptionsFor,
  type AwsLambdaRestApiUnaryRouteHandlerOptionsArgs,
  type AwsLambdaRestApiUnaryRouteHandlerOptionsFor,
  type AwsLambdaRouteStreamHandlerOptionsArgs,
  type AwsLambdaRouteStreamHandlerOptionsFor,
  type AwsLambdaRouteUnaryHandlerOptionsArgs,
  type AwsLambdaRouteUnaryHandlerOptionsFor,
  type AwsLambdaStreamRouteHandlerOptionsArgs,
  type AwsLambdaStreamRouteHandlerOptionsFor,
  type AwsLambdaUnaryRouteHandlerOptionsArgs,
  type AwsLambdaUnaryRouteHandlerOptionsFor,
  type BatchResults,
  type BunFetchOptionsArgs,
  type BunFetchOptionsFor,
  type BunFetchHandler,
  type BunRpcRequestHandlerOptionsArgs,
  type BunRpcRequestHandlerOptionsFor,
  type BunRpcRequestHandler,
  type BunRouteStreamFetchOptionsArgs,
  type BunRouteStreamFetchOptionsFor,
  type BunRouteStreamRpcRequestHandlerOptionsArgs,
  type BunRouteStreamRpcRequestHandlerOptionsFor,
  type BunRouteStreamServeOptionsArgs,
  type BunRouteStreamServeOptionsFor,
  type BunRouteStreamTransportBodyResultFor,
  type BunRouteStreamTransportBodyResultHandlerFor,
  type BunRouteUnaryFetchOptionsArgs,
  type BunRouteUnaryFetchOptionsFor,
  type BunRouteUnaryRpcRequestHandlerOptionsArgs,
  type BunRouteUnaryRpcRequestHandlerOptionsFor,
  type BunRouteUnaryServeOptionsArgs,
  type BunRouteUnaryServeOptionsFor,
  type BunRouteUnaryTransportBodyResultFor,
  type BunRouteUnaryTransportBodyResultHandlerFor,
  type BunServer,
  type BunStreamRouteFetchOptionsArgs,
  type BunStreamRouteFetchOptionsFor,
  type BunStreamRouteRpcRequestHandlerOptionsArgs,
  type BunStreamRouteRpcRequestHandlerOptionsFor,
  type BunStreamRouteServeOptionsArgs,
  type BunStreamRouteServeOptionsFor,
  type BunServeOptionsArgs,
  type BunServeOptionsFor,
  type BunServeOptions,
  type AuthPolicyAuth,
  type AuthPolicy,
  type AuthPolicyHeaders,
  type AuthPolicyHeaderValues,
  type AuthPolicyResult,
  type AuthPolicyResultLike,
  type AuthPolicyRequest,
  type AuthPolicyServices,
  type BunTransportBodyResult,
  type BunTransportBodyResultFor,
  type BunTransportBodyResultHandler,
  type BunTransportBodyResultHandlerFor,
  type BunStreamRouteTransportBodyResultFor,
  type BunStreamRouteTransportBodyResultHandlerFor,
  type BunTransportRequestHandler,
  type BunUnaryRouteFetchOptionsArgs,
  type BunUnaryRouteFetchOptionsFor,
  type BunUnaryRouteRpcRequestHandlerOptionsArgs,
  type BunUnaryRouteRpcRequestHandlerOptionsFor,
  type BunUnaryRouteServeOptionsArgs,
  type BunUnaryRouteServeOptionsFor,
  type BunUnaryRouteTransportBodyResultFor,
  type BunUnaryRouteTransportBodyResultHandlerFor,
  type ElysiaContext,
  type ElysiaHandler,
  type ElysiaHandlerOptionsArgs,
  type ElysiaHandlerOptionsFor,
  type ElysiaRouteStreamHandlerOptionsArgs,
  type ElysiaRouteStreamHandlerOptionsFor,
  type ElysiaRouteUnaryHandlerOptionsArgs,
  type ElysiaRouteUnaryHandlerOptionsFor,
  type ElysiaStreamRouteHandlerOptionsArgs,
  type ElysiaStreamRouteHandlerOptionsFor,
  type ElysiaUnaryRouteHandlerOptionsArgs,
  type ElysiaUnaryRouteHandlerOptionsFor,
  type ExpressHandlerOptions,
  type ExpressHandlerOptionsArgs,
  type ExpressHandlerOptionsFor,
  type ExpressNextFunction,
  type ExpressRequest,
  type ExpressRequestHandler,
  type ExpressResponse,
  type ExpressRouteStreamHandlerOptionsArgs,
  type ExpressRouteStreamHandlerOptionsFor,
  type ExpressRouteUnaryHandlerOptionsArgs,
  type ExpressRouteUnaryHandlerOptionsFor,
  type ExpressStreamRouteHandlerOptionsArgs,
  type ExpressStreamRouteHandlerOptionsFor,
  type ExpressUnaryRouteHandlerOptionsArgs,
  type ExpressUnaryRouteHandlerOptionsFor,
  type FastifyHandler,
  type FastifyHandlerOptions,
  type FastifyHandlerOptionsArgs,
  type FastifyHandlerOptionsFor,
  type FastifyReply,
  type FastifyRequest,
  type FastifyRouteStreamHandlerOptionsArgs,
  type FastifyRouteStreamHandlerOptionsFor,
  type FastifyRouteUnaryHandlerOptionsArgs,
  type FastifyRouteUnaryHandlerOptionsFor,
  type FastifyStreamRouteHandlerOptionsArgs,
  type FastifyStreamRouteHandlerOptionsFor,
  type FastifyUnaryRouteHandlerOptionsArgs,
  type FastifyUnaryRouteHandlerOptionsFor,
  type HonoContext,
  type HonoHandler,
  type HonoHandlerOptionsArgs,
  type HonoHandlerOptionsFor,
  type HonoRouteStreamHandlerOptionsArgs,
  type HonoRouteStreamHandlerOptionsFor,
  type HonoRouteUnaryHandlerOptionsArgs,
  type HonoRouteUnaryHandlerOptionsFor,
  type HonoStreamRouteHandlerOptionsArgs,
  type HonoStreamRouteHandlerOptionsFor,
  type HonoUnaryRouteHandlerOptionsArgs,
  type HonoUnaryRouteHandlerOptionsFor,
  type KoaContext,
  type KoaHandlerOptions,
  type KoaHandlerOptionsArgs,
  type KoaHandlerOptionsFor,
  type KoaMiddleware,
  type KoaNext,
  type KoaRouteStreamHandlerOptionsArgs,
  type KoaRouteStreamHandlerOptionsFor,
  type KoaRouteUnaryHandlerOptionsArgs,
  type KoaRouteUnaryHandlerOptionsFor,
  type KoaStreamRouteHandlerOptionsArgs,
  type KoaStreamRouteHandlerOptionsFor,
  type KoaUnaryRouteHandlerOptionsArgs,
  type KoaUnaryRouteHandlerOptionsFor,
  type ClientBatchRequest,
  type ClientBatchOptions,
  type ClientFetch,
  type ClientHeaderValues,
  type ClientOptions,
  type ClientProtocolBatchRequest,
  type ClientRequestFactory,
  type ClientRequestFactoryArgs,
  type ClientProcedureHeaders,
  type ClientRequestInit,
  type ClientRequestOptions,
  type CloudflareFetchHandler,
  type CloudflareWorkerFetchHandler,
  type CloudflareFetchOptionsArgs,
  type CloudflareFetchOptionsFor,
  type CloudflareRouteStreamFetchOptionsArgs,
  type CloudflareRouteStreamFetchOptionsFor,
  type CloudflareRouteUnaryFetchOptionsArgs,
  type CloudflareRouteUnaryFetchOptionsFor,
  type CloudflareStreamRouteFetchOptionsArgs,
  type CloudflareStreamRouteFetchOptionsFor,
  type CloudflareUnaryRouteFetchOptionsArgs,
  type CloudflareUnaryRouteFetchOptionsFor,
  type CloudflareRouteStreamWorkerOptionsArgs,
  type CloudflareRouteStreamWorkerOptionsFor,
  type CloudflareRouteUnaryWorkerOptionsArgs,
  type CloudflareRouteUnaryWorkerOptionsFor,
  type CloudflareStreamRouteWorkerOptionsArgs,
  type CloudflareStreamRouteWorkerOptionsFor,
  type CloudflareUnaryRouteWorkerOptionsArgs,
  type CloudflareUnaryRouteWorkerOptionsFor,
  type CloudflareWorkerOptionsArgs,
  type CloudflareWorkerOptionsFor,
  type CloudflareWorker,
  type CompiledAuthResult as RootCompiledAuthResult,
  type CompiledAuthResultLike as RootCompiledAuthResultLike,
  type CompiledBodyResult as RootCompiledBodyResult,
  type CompiledBodyResultFor as RootCompiledBodyResultFor,
  type CompiledCachedProcedureHeaders as RootCompiledCachedProcedureHeaders,
  type CompiledCachedProcedureSuccess as RootCompiledCachedProcedureSuccess,
  type CompiledDispatch as RootCompiledDispatch,
  type CompiledExecutionState as RootCompiledExecutionState,
  type CompiledFixedDispatch as RootCompiledFixedDispatch,
  type CompiledFixedUnaryDispatch as RootCompiledFixedUnaryDispatch,
  type CompiledProcedureCacheHeaderValues as RootCompiledProcedureCacheHeaderValues,
  type CompiledRpcBodyResultHandler as RootCompiledRpcBodyResultHandler,
  type CompiledRpcBodyResultHandlerFor as RootCompiledRpcBodyResultHandlerFor,
  type CompiledRpcBodyResultHandlerForConfig as RootCompiledRpcBodyResultHandlerForConfig,
  type CompiledRpcRouteStreamBodyResultHandlerFor as RootCompiledRpcRouteStreamBodyResultHandlerFor,
  type CompiledRpcRouteStreamTransportBodyResultHandlerFor as RootCompiledRpcRouteStreamTransportBodyResultHandlerFor,
  type CompiledRpcRouteUnaryBodyResultHandlerFor as RootCompiledRpcRouteUnaryBodyResultHandlerFor,
  type CompiledRpcRouteUnaryTransportBodyResultHandlerFor as RootCompiledRpcRouteUnaryTransportBodyResultHandlerFor,
  type CompiledRpcStreamRouteBodyResultHandlerFor as RootCompiledRpcStreamRouteBodyResultHandlerFor,
  type CompiledRpcStreamRouteTransportBodyResultHandlerFor as RootCompiledRpcStreamRouteTransportBodyResultHandlerFor,
  type CompiledRpcRequestHandler as RootCompiledRpcRequestHandler,
  type CompiledRpcRequestHandlerForConfig as RootCompiledRpcRequestHandlerForConfig,
  type CompiledRpcTransportBodyResultHandler as RootCompiledRpcTransportBodyResultHandler,
  type CompiledRpcTransportBodyResultHandlerFor as RootCompiledRpcTransportBodyResultHandlerFor,
  type CompiledRpcTransportBodyResultHandlerForConfig as RootCompiledRpcTransportBodyResultHandlerForConfig,
  type CompiledRpcUnaryRouteBodyResultHandlerFor as RootCompiledRpcUnaryRouteBodyResultHandlerFor,
  type CompiledRpcUnaryRouteTransportBodyResultHandlerFor as RootCompiledRpcUnaryRouteTransportBodyResultHandlerFor,
  type CompiledRuntime as RootCompiledRuntime,
  type CompiledRuntimeState as RootCompiledRuntimeState,
  type CompiledSerializedEnvelope as RootCompiledSerializedEnvelope,
  type CompiledRouteStreamBodyResultFor as RootCompiledRouteStreamBodyResultFor,
  type CompiledRouteStreamTransportBodyResultFor as RootCompiledRouteStreamTransportBodyResultFor,
  type CompiledRouteUnaryBodyResultFor as RootCompiledRouteUnaryBodyResultFor,
  type CompiledRouteUnaryTransportBodyResultFor as RootCompiledRouteUnaryTransportBodyResultFor,
  type CompiledStreamRouteBodyResultFor as RootCompiledStreamRouteBodyResultFor,
  type CompiledStreamRouteTransportBodyResultFor as RootCompiledStreamRouteTransportBodyResultFor,
  type CompiledTransportBodyResultFor as RootCompiledTransportBodyResultFor,
  type CompiledUnaryRouteBodyResultFor as RootCompiledUnaryRouteBodyResultFor,
  type CompiledUnaryRouteTransportBodyResultFor as RootCompiledUnaryRouteTransportBodyResultFor,
  type DenoCompiledTransportBodyResult as RootDenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor as RootDenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler as RootDenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor as RootDenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledRouteStreamTransportBodyResultFor as RootDenoCompiledRouteStreamTransportBodyResultFor,
  type DenoCompiledRouteStreamTransportBodyResultHandlerFor as RootDenoCompiledRouteStreamTransportBodyResultHandlerFor,
  type DenoCompiledRouteUnaryTransportBodyResultFor as RootDenoCompiledRouteUnaryTransportBodyResultFor,
  type DenoCompiledRouteUnaryTransportBodyResultHandlerFor as RootDenoCompiledRouteUnaryTransportBodyResultHandlerFor,
  type DenoCompiledStreamRouteTransportBodyResultFor as RootDenoCompiledStreamRouteTransportBodyResultFor,
  type DenoCompiledStreamRouteTransportBodyResultHandlerFor as RootDenoCompiledStreamRouteTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler as RootDenoCompiledTransportRequestHandler,
  type DenoCompiledUnaryRouteTransportBodyResultFor as RootDenoCompiledUnaryRouteTransportBodyResultFor,
  type DenoCompiledUnaryRouteTransportBodyResultHandlerFor as RootDenoCompiledUnaryRouteTransportBodyResultHandlerFor,
  type DenoFetchOptionsArgs,
  type DenoFetchOptionsFor,
  type DenoFetchHandler,
  type DenoRpcRequestHandlerOptionsArgs,
  type DenoRpcRequestHandlerOptionsFor,
  type DenoRpcRequestHandler,
  type DenoRouteStreamFetchOptionsArgs,
  type DenoRouteStreamFetchOptionsFor,
  type DenoRouteStreamRpcRequestHandlerOptionsArgs,
  type DenoRouteStreamRpcRequestHandlerOptionsFor,
  type DenoRouteStreamServeOptionsArgs,
  type DenoRouteStreamServeOptionsFor,
  type DenoRouteStreamTransportBodyResultFor,
  type DenoRouteStreamTransportBodyResultHandlerFor,
  type DenoRouteUnaryFetchOptionsArgs,
  type DenoRouteUnaryFetchOptionsFor,
  type DenoRouteUnaryRpcRequestHandlerOptionsArgs,
  type DenoRouteUnaryRpcRequestHandlerOptionsFor,
  type DenoRouteUnaryServeOptionsArgs,
  type DenoRouteUnaryServeOptionsFor,
  type DenoRouteUnaryTransportBodyResultFor,
  type DenoRouteUnaryTransportBodyResultHandlerFor,
  type DenoStreamRouteFetchOptionsArgs,
  type DenoStreamRouteFetchOptionsFor,
  type DenoStreamRouteRpcRequestHandlerOptionsArgs,
  type DenoStreamRouteRpcRequestHandlerOptionsFor,
  type DenoStreamRouteServeOptionsArgs,
  type DenoStreamRouteServeOptionsFor,
  type DenoServeOptionsArgs,
  type DenoServeOptionsFor,
  type DenoServer,
  type DenoServeOptions,
  type DenoTransportBodyResult,
  type DenoTransportBodyResultFor,
  type DenoTransportBodyResultHandler,
  type DenoTransportBodyResultHandlerFor,
  type DenoStreamRouteTransportBodyResultFor,
  type DenoStreamRouteTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler,
  type DenoUnaryRouteFetchOptionsArgs,
  type DenoUnaryRouteFetchOptionsFor,
  type DenoUnaryRouteRpcRequestHandlerOptionsArgs,
  type DenoUnaryRouteRpcRequestHandlerOptionsFor,
  type DenoUnaryRouteServeOptionsArgs,
  type DenoUnaryRouteServeOptionsFor,
  type DenoUnaryRouteTransportBodyResultFor,
  type DenoUnaryRouteTransportBodyResultHandlerFor,
  type StandaloneDenoRpcRequestHandlerOptionsArgs as RootStandaloneDenoRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRpcRequestHandlerOptionsFor as RootStandaloneDenoRpcRequestHandlerOptionsFor,
  type StandaloneDenoRpcRequestHandler as RootStandaloneDenoRpcRequestHandler,
  type StandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs as RootStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRouteStreamRpcRequestHandlerOptionsFor as RootStandaloneDenoRouteStreamRpcRequestHandlerOptionsFor,
  type StandaloneDenoRouteStreamServeOptionsArgs as RootStandaloneDenoRouteStreamServeOptionsArgs,
  type StandaloneDenoRouteStreamServeOptionsFor as RootStandaloneDenoRouteStreamServeOptionsFor,
  type StandaloneDenoRouteStreamTransportBodyResultFor as RootStandaloneDenoRouteStreamTransportBodyResultFor,
  type StandaloneDenoRouteStreamTransportBodyResultHandlerFor as RootStandaloneDenoRouteStreamTransportBodyResultHandlerFor,
  type StandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs as RootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor as RootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor,
  type StandaloneDenoRouteUnaryServeOptionsArgs as RootStandaloneDenoRouteUnaryServeOptionsArgs,
  type StandaloneDenoRouteUnaryServeOptionsFor as RootStandaloneDenoRouteUnaryServeOptionsFor,
  type StandaloneDenoRouteUnaryTransportBodyResultFor as RootStandaloneDenoRouteUnaryTransportBodyResultFor,
  type StandaloneDenoRouteUnaryTransportBodyResultHandlerFor as RootStandaloneDenoRouteUnaryTransportBodyResultHandlerFor,
  type StandaloneDenoServeOptionsArgs as RootStandaloneDenoServeOptionsArgs,
  type StandaloneDenoServeOptionsFor as RootStandaloneDenoServeOptionsFor,
  type StandaloneDenoServeOptions as RootStandaloneDenoServeOptions,
  type StandaloneDenoServer as RootStandaloneDenoServer,
  type StandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs as RootStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs,
  type StandaloneDenoStreamRouteRpcRequestHandlerOptionsFor as RootStandaloneDenoStreamRouteRpcRequestHandlerOptionsFor,
  type StandaloneDenoStreamRouteServeOptionsArgs as RootStandaloneDenoStreamRouteServeOptionsArgs,
  type StandaloneDenoStreamRouteServeOptionsFor as RootStandaloneDenoStreamRouteServeOptionsFor,
  type StandaloneDenoStreamRouteTransportBodyResultFor as RootStandaloneDenoStreamRouteTransportBodyResultFor,
  type StandaloneDenoStreamRouteTransportBodyResultHandlerFor as RootStandaloneDenoStreamRouteTransportBodyResultHandlerFor,
  type StandaloneDenoTransportBodyResult as RootStandaloneDenoTransportBodyResult,
  type StandaloneDenoTransportBodyResultFor as RootStandaloneDenoTransportBodyResultFor,
  type StandaloneDenoTransportBodyResultHandler as RootStandaloneDenoTransportBodyResultHandler,
  type StandaloneDenoTransportBodyResultHandlerFor as RootStandaloneDenoTransportBodyResultHandlerFor,
  type StandaloneDenoTransportRequestHandler as RootStandaloneDenoTransportRequestHandler,
  type StandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs as RootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs,
  type StandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor as RootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor,
  type StandaloneDenoUnaryRouteServeOptionsArgs as RootStandaloneDenoUnaryRouteServeOptionsArgs,
  type StandaloneDenoUnaryRouteServeOptionsFor as RootStandaloneDenoUnaryRouteServeOptionsFor,
  type StandaloneDenoUnaryRouteTransportBodyResultFor as RootStandaloneDenoUnaryRouteTransportBodyResultFor,
  type StandaloneDenoUnaryRouteTransportBodyResultHandlerFor as RootStandaloneDenoUnaryRouteTransportBodyResultHandlerFor,
  type DefineConfigFor,
  type DefineRouteStreamConfigFor,
  type DefineRouteUnaryConfigFor,
  type DefineHandlerOptions,
  type DefineRouteStreamHandlerOptions,
  type DefineRouteUnaryHandlerOptions,
  type DefineStreamRouteConfigFor,
  type DefineStreamRouteHandlerOptions,
  type DefineUnaryRouteConfigFor,
  type DefineUnaryRouteHandlerOptions,
  type HandlerHookContext,
  type HandlerHookContextFor,
  type HandlerHooks,
  type HandlerHooksFor,
  type HandlerOptionServices,
  type HandlerOptionsBody,
  type HandlerOptionsArgs,
  type HandlerOptionsArgsFor,
  type HandlerOptionsFor,
  type HandlerOptionsManifest,
  type HandlerOptionsRequest,
  type HandlerOptionsWithPreflightArgs,
  type HandlerOptionsWithTrailingArgs,
  type HandlerOptions,
  type JoorMiddleware,
  type JoorMiddlewareFor,
  type RateLimitIdentityResolver as RootRateLimitIdentityResolver,
  type RateLimitRuntimeOptions as RootRateLimitRuntimeOptions,
  type JoorRouteStreamHandlerOptionsArgs,
  type JoorRouteStreamHandlerOptionsFor,
  type JoorRouteUnaryHandlerOptionsArgs,
  type JoorRouteUnaryHandlerOptionsFor,
  type JoorStreamRouteHandlerOptionsArgs,
  type JoorStreamRouteHandlerOptionsFor,
  type JoorUnaryRouteHandlerOptionsArgs,
  type JoorUnaryRouteHandlerOptionsFor,
  type RpcManifestStreamRouteHandlerHookContextFor,
  type RpcManifestStreamRouteHandlerHooksFor,
  type RpcManifestStreamRouteHandlerOptionsArgs,
  type RpcManifestStreamRouteHandlerOptionsFor,
  type RpcManifestStreamRouteMiddlewareFor,
  type RpcManifestUnaryRouteHandlerHookContextFor,
  type RpcManifestUnaryRouteHandlerHooksFor,
  type RpcManifestUnaryRouteHandlerOptionsArgs,
  type RpcManifestUnaryRouteHandlerOptionsFor,
  type RpcManifestUnaryRouteMiddlewareFor,
  type JoorConfig,
  type JoorConfigFor,
  type JoorConfigContext,
  type JoorConfigRequest,
  type JoorRouteStreamConfigFor,
  type JoorRouteUnaryConfigFor,
  type JoorRouteMap,
  type JoorStreamRouteConfigFor,
  type JoorUnaryRouteConfigFor,
  type JoorContext,
  type PluginServices,
  type Infer,
  type HeaderObjectSchema,
  type HeaderValueSchema,
  type JsonObject,
  type JsonPrimitive,
  type JoorFetchHandler,
  type JoorHandlerOptionsArgs,
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
  type JoorManifestRouteProtocolBatchRequest,
  type JoorManifestStreamRouteClientArgs,
  type JoorManifestStreamRouteClientHeaders,
  type JoorManifestStreamRouteBody,
  type JoorManifestStreamRouteBodyHandler,
  type JoorManifestStreamRouteBodyResult,
  type JoorManifestStreamRouteBodyResultFor,
  type JoorManifestStreamRouteBodyResultHandler,
  type JoorManifestStreamRouteTransportBodyResultHandler,
  type JoorManifestStreamRouteError,
  type JoorManifestStreamRouteErrorCode,
  type JoorManifestStreamRouteErrorDetails,
  type JoorManifestStreamRouteEvent,
  type JoorManifestStreamRouteHasHeaders,
  type JoorManifestStreamRouteHasResponseHeaders,
  type JoorManifestStreamRouteHeaders,
  type JoorManifestStreamRouteInput,
  type JoorManifestStreamRouteOutput,
  type JoorManifestStreamRouteProcedure,
  type JoorManifestStreamRouteRequest,
  type JoorManifestStreamRouteRequestUnion,
  type JoorManifestStreamRouteResponseHeaders,
  type JoorManifestStreamRouteRequestOptions,
  type JoorManifestRouteProtocolRequest,
  type JoorManifestRouteProtocolRequestUnion,
  type JoorManifestProtocolRequest,
  type JoorManifestProtocolRequestUnion,
  type JoorManifestRouteRequest,
  type JoorManifestRouteRequestOptions,
  type JoorManifestRouteRequestUnion,
  type JoorManifestRouteResponseHeaders,
  type JoorManifestRouteRequiresHeaders,
  type JoorManifestRouteRequiresResponseHeaders,
  type JoorManifestStreamRouteRequiresHeaders,
  type JoorManifestStreamRouteRequiresResponseHeaders,
  type JoorManifestRequiredRuntimeRequest,
  type JoorManifestRequiredServices,
  type JoorManifestRouteRuntimeRequest,
  type JoorManifestRouteServices,
  type JoorManifestRouteStreamBody,
  type JoorManifestRouteStreamBodyResult,
  type JoorManifestRouteStreamBodyResultFor,
  type JoorManifestRouteStreamEvent,
  type JoorManifestRouteStreamProtocolRequest,
  type JoorManifestRouteStreamProtocolRequestUnion,
  type JoorManifestStreamProtocolRequest,
  type JoorManifestStreamProtocolRequestUnion,
  type JoorManifestRouteStreamRequest,
  type JoorManifestRouteStreamRequestUnion,
  type JoorManifestRouteStreamTransportClient,
  type JoorManifestRouteUnaryBody,
  type JoorManifestRouteUnaryBodyResult,
  type JoorManifestRouteUnaryBodyResultFor,
  type JoorManifestRouteUnaryProtocolBatchRequest,
  type JoorManifestRouteUnaryProtocolRequest,
  type JoorManifestRouteUnaryProtocolRequestUnion,
  type JoorManifestUnaryProtocolRequest,
  type JoorManifestUnaryProtocolRequestUnion,
  type JoorManifestRouteUnaryTransportClient,
  type JoorManifestRoutes,
  type JoorManifestStreamRouteProtocolRequest,
  type JoorManifestStreamRouteProtocolRequestUnion,
  type JoorManifestStreamRouteId,
  type JoorManifestStreamRouteTransportClient,
  type JoorManifestTransportClient,
  type JoorManifestUnaryRouteClientArgs,
  type JoorManifestUnaryRouteClientHeaders,
  type JoorManifestUnaryRouteBody,
  type JoorManifestUnaryRouteBodyHandler,
  type JoorManifestUnaryRouteBodyResult,
  type JoorManifestUnaryRouteBodyResultFor,
  type JoorManifestUnaryRouteBodyResultHandler,
  type JoorManifestUnaryRouteEnvelope,
  type JoorManifestUnaryRouteEnvelopeUnion,
  type JoorManifestUnaryRouteErrorCode,
  type JoorManifestUnaryRouteErrorDetails,
  type JoorManifestUnaryRouteHasHeaders,
  type JoorManifestUnaryRouteHasResponseHeaders,
  type JoorManifestUnaryRouteHeaders,
  type JoorManifestUnaryRouteInput,
  type JoorManifestUnaryRouteOutput,
  type JoorManifestUnaryRouteBatchRequest,
  type JoorManifestUnaryRouteBatchResults,
  type JoorManifestUnaryRouteProcedure,
  type JoorManifestUnaryRouteProtocolBatchRequest,
  type JoorManifestUnaryRouteProtocolRequest,
  type JoorManifestUnaryRouteProtocolRequestUnion,
  type JoorManifestUnaryRouteResponseHeaders,
  type JoorManifestUnaryRouteRequest,
  type JoorManifestUnaryRouteRequestUnion,
  type JoorManifestUnaryRouteResult,
  type JoorManifestUnaryRouteResultUnion,
  type JoorManifestUnaryRouteRequiresHeaders,
  type JoorManifestUnaryRouteRequiresResponseHeaders,
  type JoorManifestUnaryRouteRequestOptions,
  type JoorManifestUnaryRouteTransportBodyResultHandler,
  type JoorManifestUnaryRouteTransportClient,
  type JoorManifestUnaryRouteId,
  type JoorManifestProtocolBatchRequest,
  type LegacyBatchRequest,
  type LegacyRpcTransportClient,
  type ListenOptionsArgs,
  type ListenOptionsFor,
  type ListenOptions,
  type NodeListenOptions,
  type NodeListenOptionsArgs,
  type NodeListenOptionsFor,
  type NetlifyEdgeFetchHandler,
  type NetlifyEdgeResult,
  type NetlifyFetchHandler,
  type NetlifyFetchOptionsArgs,
  type NetlifyRouteStreamFetchOptionsArgs,
  type NetlifyRouteStreamFetchOptionsFor,
  type NetlifyRouteUnaryFetchOptionsArgs,
  type NetlifyRouteUnaryFetchOptionsFor,
  type NetlifyStreamRouteFetchOptionsArgs,
  type NetlifyStreamRouteFetchOptionsFor,
  type NetlifyUnaryRouteFetchOptionsArgs,
  type NetlifyUnaryRouteFetchOptionsFor,
  type NextHandler,
  type NextHandlerOptionsArgs,
  type NextHandlerOptionsFor,
  type NextRouteStreamHandlerOptionsArgs,
  type NextRouteStreamHandlerOptionsFor,
  type NextRouteStreamHandlersOptionsArgs,
  type NextRouteStreamHandlersOptionsFor,
  type NextRouteUnaryHandlerOptionsArgs,
  type NextRouteUnaryHandlerOptionsFor,
  type NextRouteUnaryHandlersOptionsArgs,
  type NextRouteUnaryHandlersOptionsFor,
  type NextRouteContext,
  type NextStreamRouteHandlerOptionsArgs,
  type NextStreamRouteHandlerOptionsFor,
  type NextStreamRouteHandlersOptionsArgs,
  type NextStreamRouteHandlersOptionsFor,
  type NextRouteHandler,
  type NextRouteHandlers,
  type NextRouteHandlersOptionsArgs,
  type NextRouteHandlersOptionsFor,
  type NextRouteParamValue,
  type NextRouteParams,
  type NextUnaryRouteHandlerOptionsArgs,
  type NextUnaryRouteHandlerOptionsFor,
  type NextUnaryRouteHandlersOptionsArgs,
  type NextUnaryRouteHandlersOptionsFor,
  type NodeRpcRequestHandler,
  type NodeRpcRequestHandlerOptionsArgs,
  type NodeRpcRequestHandlerOptionsFor,
  type NodeServer,
  type NodeTransportRequestHandler,
  type NodeRouteStreamListenOptionsArgs,
  type NodeRouteStreamListenOptionsFor,
  type NodeRouteStreamRpcRequestHandlerOptionsFor,
  type NodeRouteStreamRpcRequestHandlerOptionsArgs,
  type NodeRouteStreamTransportBodyResultFor,
  type NodeRouteStreamTransportBodyResultHandlerFor,
  type NodeRouteUnaryListenOptionsArgs,
  type NodeRouteUnaryListenOptionsFor,
  type NodeRouteUnaryRpcRequestHandlerOptionsArgs,
  type NodeRouteUnaryTransportBodyResultFor,
  type NodeRouteUnaryTransportBodyResultHandlerFor,
  type NodeRouteUnaryRpcRequestHandlerOptionsFor,
  type NodeStreamRouteListenOptionsArgs,
  type NodeStreamRouteListenOptionsFor,
  type NodeStreamRouteRpcRequestHandlerOptionsFor,
  type NodeStreamRouteRpcRequestHandlerOptionsArgs,
  type NodeTransportBodyResult,
  type NodeTransportBodyResultFor,
  type NodeTransportBodyResultHandler,
  type NodeTransportBodyResultHandlerFor,
  type NodeStreamRouteTransportBodyResultFor,
  type NodeStreamRouteTransportBodyResultHandlerFor,
  type NodeUnaryRouteListenOptionsArgs,
  type NodeUnaryRouteListenOptionsFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsArgs,
  type NodeUnaryRouteTransportBodyResultFor,
  type NodeUnaryRouteTransportBodyResultHandlerFor,
  type RouteStreamListenOptionsArgs,
  type RouteStreamListenOptionsFor,
  type RouteUnaryListenOptionsArgs,
  type RouteUnaryListenOptionsFor,
  type StreamRouteListenOptionsArgs,
  type StreamRouteListenOptionsFor,
  type UnaryRouteListenOptionsArgs,
  type UnaryRouteListenOptionsFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsFor,
  type PendingRpcRequest,
  type ContextlessProcedureHandler,
  type ContextlessUnaryProcedureConfig,
  type DefineProcedure,
  type ErrorCode,
  type ErrorDetails,
  type ErrorSchemas,
  type MaybePromise,
  type Procedure,
  type ProcedureError,
  type ProcedureErrorCode,
  type ProcedureErrorDetails,
  type ProcedureFailure,
  type ProcedureHasHeaders,
  type ProcedureHasResponseHeaders,
  type ProcedureHeaders,
  type ProcedureInput,
  type ProcedureAuth,
  type ProcedureOutput,
  type ProcedureRequest,
  type ProcedureResponseHeaderValues,
  type ProcedureResponseHeaders,
  type ProcedureRequiresHeaders,
  type ProcedureRequiresResponseHeaders,
  type ProcedureMeta,
  type ProcedureRuntime,
  type ProcedureRuntimeValue,
  type ProcedureServices,
  type ProcedureSuccess,
  type ProcedureTypes,
  type StreamProcedureConfig,
  type UnaryProcedureConfig,
  type CorsHeaderOptions,
  type SerializedJsonEnvelope,
  type RpcEnvelope,
  type RpcBatchRequest,
  type RpcBodyHandler,
  type RpcBodyResultHandler,
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
  type RpcManifestProtocolBatchRequest,
  type RpcManifestRouteBatchRequest,
  type RpcManifestRouteBatchRequestUnion,
  type RpcManifestRouteClientArgs,
  type RpcManifestRouteClientHeaders,
  type RpcManifestRouteError,
  type RpcManifestRouteErrorCode,
  type RpcManifestRouteErrorDetails,
  type RpcManifestRouteHasHeaders,
  type RpcManifestRouteHasResponseHeaders,
  type RpcManifestRouteHeaders,
  type RpcManifestRouteId,
  type RpcManifestRouteInput,
  type RpcManifestRouteOutput,
  type RpcManifestRouteProcedure,
  type RpcManifestRouteProtocolBatchRequest,
  type RpcManifestStreamRouteClientArgs,
  type RpcManifestStreamRouteClientHeaders,
  type RpcManifestStreamRouteBody,
  type RpcManifestStreamRouteBodyHandler,
  type RpcManifestStreamRouteBodyResult,
  type RpcManifestStreamRouteBodyResultFor,
  type RpcManifestStreamRouteBodyResultHandler,
  type RpcManifestStreamRouteTransportBodyResultHandler,
  type RpcManifestStreamRouteError,
  type RpcManifestStreamRouteErrorCode,
  type RpcManifestStreamRouteErrorDetails,
  type RpcManifestStreamRouteEvent,
  type RpcManifestStreamRouteHasHeaders,
  type RpcManifestStreamRouteHasResponseHeaders,
  type RpcManifestStreamRouteHeaders,
  type RpcManifestStreamRouteInput,
  type RpcManifestStreamRouteOutput,
  type RpcManifestStreamRouteProcedure,
  type RpcManifestStreamRouteResponseHeaders,
  type RpcManifestStreamRouteRequiresHeaders,
  type RpcManifestStreamRouteRequiresResponseHeaders,
  type RpcManifestStreamRouteRequestOptions,
  type RpcManifestRouteProtocolRequest,
  type RpcManifestRouteProtocolRequestUnion,
  type RpcManifestProtocolRequest,
  type RpcManifestProtocolRequestUnion,
  type RpcManifestRouteRequest,
  type RpcManifestRouteRequestOptions,
  type RpcManifestRouteRequestUnion,
  type RpcManifestRouteResponseHeaders,
  type RpcManifestRouteRequiresHeaders,
  type RpcManifestRouteRequiresResponseHeaders,
  type RpcManifestRequiredRuntimeRequest,
  type RpcManifestRequiredServices,
  type RpcManifestRouteRuntimeRequest,
  type RpcManifestRouteServices,
  type RpcManifestRoutes,
  type RpcManifestRouteStreamBody,
  type RpcManifestRouteStreamBodyHandler,
  type RpcManifestRouteStreamBodyResult,
  type RpcManifestRouteStreamBodyResultFor,
  type RpcManifestRouteStreamBodyResultHandler,
  type RpcManifestRouteStreamEvent,
  type RpcManifestRouteStreamProtocolRequest,
  type RpcManifestRouteStreamProtocolRequestUnion,
  type RpcManifestStreamProtocolRequest,
  type RpcManifestStreamProtocolRequestUnion,
  type RpcManifestRouteStreamRequest,
  type RpcManifestRouteStreamRequestUnion,
  type RpcManifestRouteUnaryBody,
  type RpcManifestRouteUnaryBodyHandler,
  type RpcManifestRouteUnaryBodyResult,
  type RpcManifestRouteUnaryBodyResultFor,
  type RpcManifestRouteUnaryBodyResultHandler,
  type RpcManifestRouteUnaryBatchRequestUnion,
  type RpcManifestRouteUnaryProtocolBatchRequest,
  type RpcManifestRouteUnaryProtocolRequest,
  type RpcManifestRouteUnaryProtocolRequestUnion,
  type RpcManifestUnaryProtocolRequest,
  type RpcManifestUnaryProtocolRequestUnion,
  type RpcManifestStreamRouteProtocolRequest,
  type RpcManifestStreamRouteProtocolRequestUnion,
  type RpcManifestStreamRouteRequest,
  type RpcManifestStreamRouteRequestUnion,
  type RpcManifestStreamRouteId,
  type RpcManifestUnaryRouteClientArgs,
  type RpcManifestUnaryRouteClientHeaders,
  type RpcManifestUnaryRouteBody,
  type RpcManifestUnaryRouteBodyHandler,
  type RpcManifestUnaryRouteBodyResult,
  type RpcManifestUnaryRouteBodyResultFor,
  type RpcManifestUnaryRouteBodyResultHandler,
  type RpcManifestUnaryRouteEnvelope,
  type RpcManifestUnaryRouteEnvelopeUnion,
  type RpcManifestUnaryRouteErrorCode,
  type RpcManifestUnaryRouteErrorDetails,
  type RpcManifestUnaryRouteHasHeaders,
  type RpcManifestUnaryRouteHasResponseHeaders,
  type RpcManifestUnaryRouteHeaders,
  type RpcManifestUnaryRouteInput,
  type RpcManifestUnaryRouteOutput,
  type RpcManifestUnaryRouteBatchRequest,
  type RpcManifestUnaryRouteBatchRequestUnion,
  type RpcManifestUnaryRouteBatchResults,
  type RpcManifestUnaryRouteProcedure,
  type RpcManifestUnaryRouteProtocolBatchRequest,
  type RpcManifestUnaryRouteProtocolRequest,
  type RpcManifestUnaryRouteProtocolRequestUnion,
  type RpcManifestUnaryRouteResponseHeaders,
  type RpcManifestUnaryRouteRequest,
  type RpcManifestUnaryRouteRequestUnion,
  type RpcManifestUnaryRouteResult,
  type RpcManifestUnaryRouteResultUnion,
  type RpcManifestUnaryRouteRequiresHeaders,
  type RpcManifestUnaryRouteRequiresResponseHeaders,
  type RpcManifestUnaryRouteRequestOptions,
  type RpcManifestUnaryRouteTransportBodyResultHandler,
  type RpcManifestUnaryRouteId,
  type RpcProtocolEnvelope,
  type RpcProtocolError,
  type RpcRequestHandler,
  type RpcRequest,
  type RpcResponse,
  type RpcResponseHeaderValues,
  type RpcRouteMap,
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
  type TransportBodyResult,
  type TransportBodyResultFor,
  type RpcRouteHasHeaders,
  type RpcRouteHasResponseHeaders,
  type RpcRouteRequest,
  type RpcRouteRequestUnion,
  type RpcRouteResponseHeaders,
  type RpcRouteRequiresHeaders,
  type RpcRouteRequiresResponseHeaders,
  type RpcProtocolBatchRequest,
  type RpcRouteBatchRequest,
  type RpcRouteBatchRequestUnion,
  type RpcRouteProtocolBatchRequest,
  type RpcRouteProtocolRequest,
  type RpcRouteProtocolRequestUnion,
  type RpcProtocolRequest,
  type RpcProtocolRequestOptions,
  type RpcProtocolRequestUnion,
  type RpcRouteStreamProtocolRequest,
  type RpcRouteStreamProtocolRequestUnion,
  type RpcStreamProtocolRequest,
  type RpcStreamProtocolRequestUnion,
  type RpcRouteStreamRequest,
  type RpcRouteStreamRequestUnion,
  type RpcRouteUnaryProtocolRequest,
  type RpcRouteUnaryProtocolBatchRequest,
  type RpcRouteUnaryProtocolRequestUnion,
  type RpcUnaryProtocolRequest,
  type RpcUnaryProtocolRequestUnion,
  type RouteRpcTransportClient,
  type RpcManifestClientOptions,
  type RpcManifestRouteStreamTransportClient,
  type RpcManifestRouteUnaryTransportClient,
  type RpcManifestStreamRouteTransportClient,
  type RpcManifestTransportClient,
  type RpcManifestUnaryRouteTransportClient,
  type RpcSuccess,
  type RpcStreamProcedure,
  type RpcStreamRouteClientArgs,
  type RpcStreamRouteClientHeaders,
  type RpcStreamRouteBody,
  type RpcStreamRouteBodyResult,
  type RpcStreamRouteBodyResultFor,
  type RpcStreamRouteErrorCode,
  type RpcStreamRouteErrorDetails,
  type RpcStreamRouteEvent,
  type RpcStreamRouteHasHeaders,
  type RpcStreamRouteHasResponseHeaders,
  type RpcStreamRouteHeaders,
  type RpcStreamRouteInput,
  type RpcStreamRouteOutput,
  type RpcStreamRouteProtocolRequest,
  type RpcStreamRouteProtocolRequestUnion,
  type RpcStreamRouteRequest,
  type RpcStreamRouteRequestUnion,
  type RpcStreamRouteProcedure,
  type RpcStreamRouteResponseHeaders,
  type RpcStreamRouteRequiresHeaders,
  type RpcStreamRouteRequiresResponseHeaders,
  type RpcStreamRouteRequestOptions,
  type RpcRouteClientArgs,
  type RpcRouteClientHeaders,
  type RpcRouteRequestOptions,
  type RpcRouteStreamTransportClient,
  type RpcRouteUnaryTransportClient,
  type RpcStreamRouteId,
  type RpcStreamRouteTransportClient,
  type RpcUnaryProcedure,
  type RpcUnaryRouteClientArgs,
  type RpcUnaryRouteClientHeaders,
  type RpcUnaryRouteBody,
  type RpcUnaryRouteBodyResult,
  type RpcUnaryRouteBodyResultFor,
  type RpcUnaryRouteEnvelope,
  type RpcUnaryRouteEnvelopeUnion,
  type RpcUnaryRouteErrorCode,
  type RpcUnaryRouteErrorDetails,
  type RpcUnaryRouteHasHeaders,
  type RpcUnaryRouteHasResponseHeaders,
  type RpcUnaryRouteHeaders,
  type RpcUnaryRouteInput,
  type RpcUnaryRouteOutput,
  type RpcUnaryRouteBatchRequest,
  type RpcRouteUnaryBatchRequestUnion,
  type RpcUnaryRouteBatchRequestUnion,
  type RpcUnaryRouteBatchResults,
  type RpcUnaryRouteProcedure,
  type RpcUnaryRouteProtocolBatchRequest,
  type RpcUnaryRouteProtocolRequest,
  type RpcUnaryRouteProtocolRequestUnion,
  type RpcUnaryRouteResponseHeaders,
  type RpcUnaryRouteRequest,
  type RpcUnaryRouteRequestUnion,
  type RpcUnaryRouteResult,
  type RpcUnaryRouteResultUnion,
  type RpcUnaryRouteRequiresHeaders,
  type RpcUnaryRouteRequiresResponseHeaders,
  type RpcUnaryRouteRequestOptions,
  type RpcUnaryRouteTransportClient,
  type RpcUnaryRouteId,
  type HeaderSchemaShape,
  type Schema,
  type SchemaMeta,
  type SchemaShape,
  type StringSchema,
  type NumberSchema,
  type ValidationIssue,
  type ValidationResult,
  type OpenApiSchema,
  type JsonValue,
  type NetlifyFetchOptionsArgs as RootSubpathNetlifyFetchOptionsArgs,
  type NetlifyFetchOptionsFor,
  type VercelFetchHandler,
  type VercelFetchOptionsArgs,
  type VercelFetchOptionsFor,
  type VercelFunction,
  type VercelRouteStreamFetchOptionsArgs,
  type VercelRouteStreamFetchOptionsFor,
  type VercelRouteUnaryFetchOptionsArgs,
  type VercelRouteUnaryFetchOptionsFor,
  type VercelStreamRouteFetchOptionsArgs,
  type VercelStreamRouteFetchOptionsFor,
  type VercelUnaryRouteFetchOptionsArgs,
  type VercelUnaryRouteFetchOptionsFor,
} from '../src/index.js';
import {
  createAuthPolicy as createAuthPolicySubpath,
  type AuthPolicyAuth as AuthSubpathPolicyAuth,
  type AuthPolicyHeaders as AuthSubpathPolicyHeaders,
  type AuthPolicyRequest as AuthSubpathPolicyRequest,
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
  type AuthPolicyAuth as ContextSubpathAuthPolicyAuth,
  type AuthPolicyHeaders as ContextSubpathAuthPolicyHeaders,
  type AuthPolicyRequest as ContextSubpathAuthPolicyRequest,
  type AuthPolicyResult as ContextSubpathAuthPolicyResult,
  type AuthPolicyResultLike as ContextSubpathAuthPolicyResultLike,
  type AuthPolicyServices as ContextSubpathAuthPolicyServices,
  type DefineConfigFor as ContextSubpathDefineConfigFor,
  type DefineStreamRouteConfigFor as ContextSubpathDefineStreamRouteConfigFor,
  type DefineUnaryRouteConfigFor as ContextSubpathDefineUnaryRouteConfigFor,
  type HandlerOptionsBody as ContextSubpathHandlerOptionsBody,
  type HandlerOptionsManifest as ContextSubpathHandlerOptionsManifest,
  type HandlerOptionsRequest as ContextSubpathHandlerOptionsRequest,
  type JoorConfig as ContextSubpathConfig,
  type JoorConfigFor as ContextSubpathConfigFor,
  type JoorConfigContext as ContextSubpathConfigContext,
  type JoorConfigRequest as ContextSubpathConfigRequest,
  type JoorStreamRouteConfigFor as ContextSubpathStreamRouteConfigFor,
  type JoorUnaryRouteConfigFor as ContextSubpathUnaryRouteConfigFor,
  type JoorContext as ContextSubpathJoorContext,
  type PluginServices as ContextSubpathPluginServices,
} from '../src/context/index.js';
import {
  defineConfigFor as defineConfigSubpathFor,
  type DefineConfigFor as ConfigSubpathDefineConfigFor,
  type DefineStreamRouteConfigFor as ConfigSubpathDefineStreamRouteConfigFor,
  type DefineUnaryRouteConfigFor as ConfigSubpathDefineUnaryRouteConfigFor,
  type HandlerOptionsBody as ConfigSubpathHandlerOptionsBody,
  type HandlerOptionsManifest as ConfigSubpathHandlerOptionsManifest,
  type HandlerOptionsRequest as ConfigSubpathHandlerOptionsRequest,
  type JoorConfigFor as ConfigSubpathConfigFor,
  type JoorConfigContext as ConfigSubpathConfigContext,
  type JoorConfigRequest as ConfigSubpathConfigRequest,
  type JoorStreamRouteConfigFor as ConfigSubpathStreamRouteConfigFor,
  type JoorUnaryRouteConfigFor as ConfigSubpathUnaryRouteConfigFor,
} from '../src/config.js';
import {
  defineConfigFor as definePackageConfigSubpathFor,
  type DefineConfigFor as PackageConfigSubpathDefineConfigFor,
  type DefineStreamRouteConfigFor as PackageConfigSubpathDefineStreamRouteConfigFor,
  type DefineUnaryRouteConfigFor as PackageConfigSubpathDefineUnaryRouteConfigFor,
  type HandlerOptionsBody as PackageConfigSubpathHandlerOptionsBody,
  type HandlerOptionsManifest as PackageConfigSubpathHandlerOptionsManifest,
  type HandlerOptionsRequest as PackageConfigSubpathHandlerOptionsRequest,
  type JoorConfigFor as PackageConfigSubpathConfigFor,
  type JoorConfigContext as PackageConfigSubpathConfigContext,
  type JoorConfigRequest as PackageConfigSubpathConfigRequest,
  type JoorStreamRouteConfigFor as PackageConfigSubpathStreamRouteConfigFor,
  type JoorUnaryRouteConfigFor as PackageConfigSubpathUnaryRouteConfigFor,
} from 'joor/config';
import {
  build as buildCompilerSubpath,
  createAiDocs as createCompilerSubpathAiDocs,
  createOpenApiDocument as createCompilerSubpathOpenApiDocument,
  type BuildOptions as CompilerSubpathBuildOptions,
  type CompilerManifest as CompilerSubpathManifest,
  type CompiledProcedureGenerationOptions as CompilerSubpathCompiledProcedureGenerationOptions,
  type CompiledProcedureMode as CompilerSubpathCompiledProcedureMode,
  type EmitOptions as CompilerSubpathEmitOptions,
  type LoadedProcedure as CompilerSubpathLoadedProcedure,
  type ProcedureFile as CompilerSubpathProcedureFile,
} from '../src/compiler/index.js';
import {
  createRpcBodyHandler as createRpcSubpathBodyHandler,
  createRpcBodyHandlerFor as createRpcSubpathBodyHandlerFor,
  createRpcBodyResultHandler as createRpcSubpathBodyResultHandler,
  createRpcBodyResultHandlerFor as createRpcSubpathBodyResultHandlerFor,
  createRpcHandler as createRpcSubpathHandler,
  createRpcHandlerFor as createRpcSubpathHandlerFor,
  createRpcTransportBodyResultHandler as createRpcSubpathTransportBodyResultHandler,
  createManifestRouteProtocolRequest as createRpcSubpathManifestRouteProtocolRequest,
  createManifestRouteRequest as createRpcSubpathManifestRouteRequest,
  createManifestRouteStreamProtocolRequest as createRpcSubpathManifestRouteStreamProtocolRequest,
  createManifestRouteStreamRequest as createRpcSubpathManifestRouteStreamRequest,
  createManifestRouteUnaryProtocolRequest as createRpcSubpathManifestRouteUnaryProtocolRequest,
  createManifestStreamRouteProtocolRequest as createRpcSubpathManifestStreamRouteProtocolRequest,
  createManifestStreamRouteRequest as createRpcSubpathManifestStreamRouteRequest,
  createManifestUnaryRouteProtocolRequest as createRpcSubpathManifestUnaryRouteProtocolRequest,
  createManifestRouteUnaryRequest as createRpcSubpathManifestRouteUnaryRequest,
  createManifestUnaryRouteRequest as createRpcSubpathManifestUnaryRouteRequest,
  createRouteProtocolRequest as createRpcSubpathRouteProtocolRequest,
  createRouteRequest as createRpcSubpathRouteRequest,
  createRouteStreamProtocolRequest as createRpcSubpathRouteStreamProtocolRequest,
  createRouteStreamRequest as createRpcSubpathRouteStreamRequest,
  createRouteUnaryProtocolRequest as createRpcSubpathRouteUnaryProtocolRequest,
  createRouteUnaryRequest as createRpcSubpathRouteUnaryRequest,
  createStreamRouteProtocolRequest as createRpcSubpathStreamRouteProtocolRequest,
  createStreamRouteRequest as createRpcSubpathStreamRouteRequest,
  createUnaryRouteProtocolRequest as createRpcSubpathUnaryRouteProtocolRequest,
  createUnaryRouteRequest as createRpcSubpathUnaryRouteRequest,
  defineHandlerOptions as defineRpcSubpathHandlerOptions,
  type BatchResults as RpcSubpathBatchResults,
  type ClientBatchRequest as RpcSubpathClientBatchRequest,
  type ClientFetch as RpcSubpathClientFetch,
  type ClientOptions as RpcSubpathClientOptions,
  type ClientProtocolBatchRequest as RpcSubpathClientProtocolBatchRequest,
  type ClientRequestFactory as RpcSubpathClientRequestFactory,
  type ClientRequestFactoryArgs as RpcSubpathClientRequestFactoryArgs,
  type ClientProcedureHeaders as RpcSubpathClientProcedureHeaders,
  type LegacyBatchRequest as RpcSubpathLegacyBatchRequest,
  type HandlerHookContext as RpcSubpathHandlerHookContext,
  type HandlerHookContextFor as RpcSubpathHandlerHookContextFor,
  type HandlerHooksFor as RpcSubpathHandlerHooksFor,
  type DefineHandlerOptions as RpcSubpathDefineHandlerOptions,
  type DefineRouteStreamHandlerOptions as RpcSubpathDefineRouteStreamHandlerOptions,
  type DefineRouteUnaryHandlerOptions as RpcSubpathDefineRouteUnaryHandlerOptions,
  type DefineStreamRouteHandlerOptions as RpcSubpathDefineStreamRouteHandlerOptions,
  type DefineUnaryRouteHandlerOptions as RpcSubpathDefineUnaryRouteHandlerOptions,
  type HandlerOptionsBody as RpcSubpathHandlerOptionsBody,
  type HandlerOptionsArgs as RpcSubpathHandlerOptionsArgs,
  type HandlerOptionsArgsFor as RpcSubpathHandlerOptionsArgsFor,
  type HandlerOptionsManifest as RpcSubpathHandlerOptionsManifest,
  type HandlerOptionsRequest as RpcSubpathHandlerOptionsRequest,
  type HandlerOptionsWithPreflightArgs as RpcSubpathHandlerOptionsWithPreflightArgs,
  type HandlerOptionsWithTrailingArgs as RpcSubpathHandlerOptionsWithTrailingArgs,
  type JoorMiddlewareFor as RpcSubpathJoorMiddlewareFor,
  type RateLimitIdentityResolver as RpcSubpathRateLimitIdentityResolver,
  type RateLimitRuntimeOptions as RpcSubpathRateLimitRuntimeOptions,
  type RpcManifestStreamRouteHandlerHookContextFor as RpcSubpathManifestStreamRouteHandlerHookContextFor,
  type RpcManifestStreamRouteHandlerHooksFor as RpcSubpathManifestStreamRouteHandlerHooksFor,
  type RpcManifestStreamRouteHandlerOptionsArgs as RpcSubpathManifestStreamRouteHandlerOptionsArgs,
  type RpcManifestStreamRouteHandlerOptionsFor as RpcSubpathManifestStreamRouteHandlerOptionsFor,
  type RpcManifestStreamRouteMiddlewareFor as RpcSubpathManifestStreamRouteMiddlewareFor,
  type RpcManifestUnaryRouteHandlerHookContextFor as RpcSubpathManifestUnaryRouteHandlerHookContextFor,
  type RpcManifestUnaryRouteHandlerHooksFor as RpcSubpathManifestUnaryRouteHandlerHooksFor,
  type RpcManifestUnaryRouteHandlerOptionsArgs as RpcSubpathManifestUnaryRouteHandlerOptionsArgs,
  type RpcManifestUnaryRouteHandlerOptionsFor as RpcSubpathManifestUnaryRouteHandlerOptionsFor,
  type RpcManifestUnaryRouteMiddlewareFor as RpcSubpathManifestUnaryRouteMiddlewareFor,
  type RpcManifestClientOptions as RpcSubpathManifestClientOptions,
  type RpcManifestTransportClient as RpcSubpathManifestTransportClient,
  type RpcManifestBody as RpcSubpathManifestBody,
  type RpcManifestBodyResultFor as RpcSubpathManifestBodyResultFor,
  type RpcManifestRouteInput as RpcSubpathManifestRouteInput,
  type RpcManifestRouteOutput as RpcSubpathManifestRouteOutput,
  type RpcManifestStreamRouteClientArgs as RpcSubpathManifestStreamRouteClientArgs,
  type RpcManifestStreamRouteBodyHandler as RpcSubpathManifestStreamRouteBodyHandler,
  type RpcManifestStreamRouteBodyResultHandler as RpcSubpathManifestStreamRouteBodyResultHandler,
  type RpcManifestStreamRouteTransportBodyResultHandler as RpcSubpathManifestStreamRouteTransportBodyResultHandler,
  type RpcManifestStreamRouteProcedure as RpcSubpathManifestStreamRouteProcedure,
  type RpcManifestStreamRouteOutput as RpcSubpathManifestStreamRouteOutput,
  type RpcManifestStreamRouteResponseHeaders as RpcSubpathManifestStreamRouteResponseHeaders,
  type RpcManifestStreamRouteRequestOptions as RpcSubpathManifestStreamRouteRequestOptions,
  type RpcManifestStreamRouteRequest as RpcSubpathManifestStreamRouteRequest,
  type RpcManifestUnaryRouteClientArgs as RpcSubpathManifestUnaryRouteClientArgs,
  type RpcManifestUnaryRouteBodyHandler as RpcSubpathManifestUnaryRouteBodyHandler,
  type RpcManifestUnaryRouteBodyResultHandler as RpcSubpathManifestUnaryRouteBodyResultHandler,
  type RpcManifestUnaryRouteTransportBodyResultHandler as RpcSubpathManifestUnaryRouteTransportBodyResultHandler,
  type RpcManifestUnaryRouteProcedure as RpcSubpathManifestUnaryRouteProcedure,
  type RpcManifestUnaryRouteRequestOptions as RpcSubpathManifestUnaryRouteRequestOptions,
  type RpcManifestRouteClientArgs as RpcSubpathManifestRouteClientArgs,
  type RpcManifestRouteClientHeaders as RpcSubpathManifestRouteClientHeaders,
  type RpcManifestRouteProtocolBatchRequest as RpcSubpathManifestRouteProtocolBatchRequest,
  type RpcManifestRouteRequest as RpcSubpathManifestRouteRequest,
  type RpcManifestRouteRequestOptions as RpcSubpathManifestRouteRequestOptions,
  type RpcManifestRouteRequestUnion as RpcSubpathManifestRouteRequestUnion,
  type RpcManifestRouteStreamEvent as RpcSubpathManifestRouteStreamEvent,
  type RpcManifestRouteStreamRequest as RpcSubpathManifestRouteStreamRequest,
  type RpcManifestRouteResultUnion as RpcSubpathManifestRouteResultUnion,
  type RpcBodyHandler as RpcSubpathBodyHandler,
  type RpcBodyResultHandler as RpcSubpathBodyResultHandler,
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
  type RpcStreamRouteClientArgs as RpcSubpathStreamRouteClientArgs,
  type RpcStreamRouteProcedure as RpcSubpathStreamRouteProcedure,
  type RpcStreamRouteOutput as RpcSubpathStreamRouteOutput,
  type RpcStreamRouteResponseHeaders as RpcSubpathStreamRouteResponseHeaders,
  type RpcStreamRouteRequestOptions as RpcSubpathStreamRouteRequestOptions,
  type RpcStreamRouteRequest as RpcSubpathStreamRouteRequest,
  type RpcRouteRequestOptions as RpcSubpathRouteRequestOptions,
  type RpcRouteRequiresHeaders as RpcSubpathRouteRequiresHeaders,
  type RpcRouteRequiresResponseHeaders as RpcSubpathRouteRequiresResponseHeaders,
  type RpcRouteProtocolBatchRequest as RpcSubpathRouteProtocolBatchRequest,
  type RpcRouteProtocolRequest as RpcSubpathRouteProtocolRequest,
  type RpcProtocolRequest as RpcSubpathProtocolRequest,
  type RpcProtocolRequestOptions as RpcSubpathProtocolRequestOptions,
  type RpcProtocolRequestUnion as RpcSubpathProtocolRequestUnion,
  type RpcStreamProtocolRequest as RpcSubpathStreamProtocolRequest,
  type RpcStreamProtocolRequestUnion as RpcSubpathStreamProtocolRequestUnion,
  type RpcUnaryProtocolRequest as RpcSubpathUnaryProtocolRequest,
  type RpcUnaryProtocolRequestUnion as RpcSubpathUnaryProtocolRequestUnion,
  type RpcRouteStreamRequest as RpcSubpathRouteStreamRequest,
  type RpcUnaryRouteClientArgs as RpcSubpathUnaryRouteClientArgs,
  type RpcUnaryRouteProcedure as RpcSubpathUnaryRouteProcedure,
  type RpcUnaryRouteRequestOptions as RpcSubpathUnaryRouteRequestOptions,
} from '../src/rpc/index.js';
import type { StreamEvent as RpcSseEvent } from '../src/rpc/stream.js';
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
  type JoorManifestRouteOutput as JoorSubpathManifestRouteOutput,
  type JoorManifestStreamRouteClientArgs as JoorSubpathManifestStreamRouteClientArgs,
  type JoorManifestStreamRouteBodyHandler as JoorSubpathManifestStreamRouteBodyHandler,
  type JoorManifestStreamRouteBodyResultHandler as JoorSubpathManifestStreamRouteBodyResultHandler,
  type JoorManifestStreamRouteTransportBodyResultHandler as JoorSubpathManifestStreamRouteTransportBodyResultHandler,
  type JoorManifestStreamRouteProcedure as JoorSubpathManifestStreamRouteProcedure,
  type JoorManifestStreamRouteOutput as JoorSubpathManifestStreamRouteOutput,
  type JoorManifestStreamRouteResponseHeaders as JoorSubpathManifestStreamRouteResponseHeaders,
  type JoorManifestStreamRouteRequestOptions as JoorSubpathManifestStreamRouteRequestOptions,
  type JoorManifestStreamRouteRequest as JoorSubpathManifestStreamRouteRequest,
  type JoorManifestUnaryRouteClientArgs as JoorSubpathManifestUnaryRouteClientArgs,
  type JoorManifestUnaryRouteBodyHandler as JoorSubpathManifestUnaryRouteBodyHandler,
  type JoorManifestUnaryRouteBodyResultHandler as JoorSubpathManifestUnaryRouteBodyResultHandler,
  type JoorManifestUnaryRouteTransportBodyResultHandler as JoorSubpathManifestUnaryRouteTransportBodyResultHandler,
  type JoorManifestUnaryRouteProcedure as JoorSubpathManifestUnaryRouteProcedure,
  type JoorManifestUnaryRouteRequestOptions as JoorSubpathManifestUnaryRouteRequestOptions,
  type JoorManifestRouteProtocolBatchRequest as JoorSubpathManifestRouteProtocolBatchRequest,
  type JoorManifestRouteProtocolRequest as JoorSubpathManifestRouteProtocolRequest,
  type JoorManifestProtocolRequest as JoorSubpathManifestProtocolRequest,
  type JoorManifestProtocolRequestUnion as JoorSubpathManifestProtocolRequestUnion,
  type JoorManifestStreamProtocolRequest as JoorSubpathManifestStreamProtocolRequest,
  type JoorManifestStreamProtocolRequestUnion as JoorSubpathManifestStreamProtocolRequestUnion,
  type JoorManifestUnaryProtocolRequest as JoorSubpathManifestUnaryProtocolRequest,
  type JoorManifestUnaryProtocolRequestUnion as JoorSubpathManifestUnaryProtocolRequestUnion,
  type JoorManifestRouteRequestOptions as JoorSubpathManifestRouteRequestOptions,
  type JoorManifestRequiredServices as JoorSubpathManifestRequiredServices,
  type JoorManifestRouteServices as JoorSubpathManifestRouteServices,
  type JoorManifestRouteStreamProtocolRequest as JoorSubpathManifestRouteStreamProtocolRequest,
  type JoorManifestRouteStreamRequest as JoorSubpathManifestRouteStreamRequest,
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
  createDenoRpcRequestHandlerFor as createStandaloneDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandler as createStandaloneDenoTransportRequestHandler,
  createDenoTransportRequestHandlerFor as createStandaloneDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPath as createStandaloneDenoTransportRequestHandlerWithPath,
  createDenoTransportRequestHandlerWithPathFor as createStandaloneDenoTransportRequestHandlerWithPathFor,
  serveDeno as serveStandaloneDeno,
  type DenoRpcRequestHandlerOptionsArgs as StandaloneDenoRpcRequestHandlerOptionsArgs,
  type DenoRpcRequestHandlerOptionsFor as StandaloneDenoRpcRequestHandlerOptionsFor,
  type DenoRpcRequestHandler as StandaloneDenoRpcRequestHandler,
  type DenoRouteStreamRpcRequestHandlerOptionsArgs as StandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs,
  type DenoRouteStreamRpcRequestHandlerOptionsFor as StandaloneDenoRouteStreamRpcRequestHandlerOptionsFor,
  type DenoRouteStreamServeOptionsArgs as StandaloneDenoRouteStreamServeOptionsArgs,
  type DenoRouteStreamServeOptionsFor as StandaloneDenoRouteStreamServeOptionsFor,
  type DenoRouteStreamTransportBodyResultFor as StandaloneDenoRouteStreamTransportBodyResultFor,
  type DenoRouteStreamTransportBodyResultHandlerFor as StandaloneDenoRouteStreamTransportBodyResultHandlerFor,
  type DenoRouteUnaryRpcRequestHandlerOptionsArgs as StandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs,
  type DenoRouteUnaryRpcRequestHandlerOptionsFor as StandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor,
  type DenoRouteUnaryServeOptionsArgs as StandaloneDenoRouteUnaryServeOptionsArgs,
  type DenoRouteUnaryServeOptionsFor as StandaloneDenoRouteUnaryServeOptionsFor,
  type DenoRouteUnaryTransportBodyResultFor as StandaloneDenoRouteUnaryTransportBodyResultFor,
  type DenoRouteUnaryTransportBodyResultHandlerFor as StandaloneDenoRouteUnaryTransportBodyResultHandlerFor,
  type DenoServer as StandaloneDenoServer,
  type DenoStreamRouteRpcRequestHandlerOptionsArgs as StandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs,
  type DenoStreamRouteRpcRequestHandlerOptionsFor as StandaloneDenoStreamRouteRpcRequestHandlerOptionsFor,
  type DenoStreamRouteServeOptionsArgs as StandaloneDenoStreamRouteServeOptionsArgs,
  type DenoStreamRouteServeOptionsFor as StandaloneDenoStreamRouteServeOptionsFor,
  type DenoServeOptionsArgs as StandaloneDenoServeOptionsArgs,
  type DenoServeOptionsFor as StandaloneDenoServeOptionsFor,
  type DenoServeOptions as StandaloneDenoServeOptions,
  type DenoTransportBodyResult as StandaloneDenoTransportBodyResult,
  type DenoTransportBodyResultFor as StandaloneDenoTransportBodyResultFor,
  type DenoTransportBodyResultHandler as StandaloneDenoTransportBodyResultHandler,
  type DenoTransportBodyResultHandlerFor as StandaloneDenoTransportBodyResultHandlerFor,
  type DenoStreamRouteTransportBodyResultFor as StandaloneDenoStreamRouteTransportBodyResultFor,
  type DenoStreamRouteTransportBodyResultHandlerFor as StandaloneDenoStreamRouteTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler as StandaloneDenoTransportRequestHandler,
  type DenoUnaryRouteRpcRequestHandlerOptionsArgs as StandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs,
  type DenoUnaryRouteRpcRequestHandlerOptionsFor as StandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor,
  type DenoUnaryRouteServeOptionsArgs as StandaloneDenoUnaryRouteServeOptionsArgs,
  type DenoUnaryRouteServeOptionsFor as StandaloneDenoUnaryRouteServeOptionsFor,
  type DenoUnaryRouteTransportBodyResultFor as StandaloneDenoUnaryRouteTransportBodyResultFor,
  type DenoUnaryRouteTransportBodyResultHandlerFor as StandaloneDenoUnaryRouteTransportBodyResultHandlerFor,
} from '../src/runtime/deno-transport.js';
import {
  createDenoCompiledTransportRequestHandler,
  createDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPath,
  createDenoCompiledTransportRequestHandlerWithPathFor,
  type DenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledRouteStreamTransportBodyResultFor,
  type DenoCompiledRouteStreamTransportBodyResultHandlerFor,
  type DenoCompiledRouteUnaryTransportBodyResultFor,
  type DenoCompiledRouteUnaryTransportBodyResultHandlerFor,
  type DenoCompiledStreamRouteTransportBodyResultFor,
  type DenoCompiledStreamRouteTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler,
  type DenoCompiledUnaryRouteTransportBodyResultFor,
  type DenoCompiledUnaryRouteTransportBodyResultHandlerFor,
} from '../src/runtime/deno-compiled-transport.js';
import {
  compiledCreateProcedureCacheKey,
  compiledNotFound,
  compiledRateLimitFailureStatic,
  compiledUncachedExecutionState,
  compiledAuthenticate,
  compiledAuthenticateUncached,
  createCompiledRpcBodyResultHandler,
  createCompiledRpcHandler,
  createCompiledRpcHandlerFor,
  createCompiledRpcTransportBodyResultHandler,
  createCompiledRuntimeState,
  type executeCompiledProcedure,
} from '../src/runtime/compiled.js';
import type {
  CompiledAuthResult,
  CompiledAuthResultLike,
  CompiledBodyResult,
  CompiledBodyResultFor,
  CompiledCachedProcedureHeaders,
  CompiledCachedProcedureSuccess,
  CompiledDispatch,
  CompiledExecutionState,
  CompiledFixedDispatch,
  CompiledFixedUnaryDispatch,
  CompiledProcedureCacheHeaderValues,
  CompiledRpcBodyResultHandler,
  CompiledRpcBodyResultHandlerFor,
  CompiledRpcBodyResultHandlerForConfig,
  CompiledRpcRouteStreamBodyResultHandlerFor,
  CompiledRpcRouteStreamTransportBodyResultHandlerFor,
  CompiledRpcRouteUnaryBodyResultHandlerFor,
  CompiledRpcRouteUnaryTransportBodyResultHandlerFor,
  CompiledRpcStreamRouteBodyResultHandlerFor,
  CompiledRpcStreamRouteTransportBodyResultHandlerFor,
  CompiledRpcRequestHandler,
  CompiledRpcRequestHandlerForConfig,
  CompiledRpcTransportBodyResultHandler,
  CompiledRpcTransportBodyResultHandlerFor,
  CompiledRpcTransportBodyResultHandlerForConfig,
  CompiledRpcUnaryRouteBodyResultHandlerFor,
  CompiledRpcUnaryRouteTransportBodyResultHandlerFor,
  CompiledRuntime,
  CompiledRuntimeState,
  CompiledSerializedEnvelope,
  CompiledRouteStreamBodyResultFor,
  CompiledRouteStreamTransportBodyResultFor,
  CompiledRouteUnaryBodyResultFor,
  CompiledRouteUnaryTransportBodyResultFor,
  CompiledStreamRouteBodyResultFor,
  CompiledStreamRouteTransportBodyResultFor,
  CompiledTransportBodyResultFor,
  CompiledUnaryRouteBodyResultFor,
  CompiledUnaryRouteTransportBodyResultFor,
} from '../src/runtime/compiled.js';
import {
  BodySizeLimitError as RuntimeSubpathBodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES as RUNTIME_SUBPATH_DEFAULT_MAX_BODY_BYTES,
  createAwsLambdaHandler as createRuntimeSubpathAwsLambdaHandler,
  createAwsLambdaHandlerFor as createRuntimeSubpathAwsLambdaHandlerFor,
  createAwsLambdaHttpApiHandler as createRuntimeSubpathAwsLambdaHttpApiHandler,
  createAwsLambdaHttpApiHandlerFor as createRuntimeSubpathAwsLambdaHttpApiHandlerFor,
  createAwsLambdaRestApiHandler as createRuntimeSubpathAwsLambdaRestApiHandler,
  createAwsLambdaRestApiHandlerFor as createRuntimeSubpathAwsLambdaRestApiHandlerFor,
  createBunFetchFor as createRuntimeSubpathBunFetchFor,
  createBunRpcRequestHandlerFor as createRuntimeSubpathBunRpcRequestHandlerFor,
  createBunTransportRequestHandler as createRuntimeSubpathBunTransportRequestHandler,
  createBunTransportRequestHandlerFor as createRuntimeSubpathBunTransportRequestHandlerFor,
  createBunTransportRequestHandlerWithPath as createRuntimeSubpathBunTransportRequestHandlerWithPath,
  createBunTransportRequestHandlerWithPathFor as createRuntimeSubpathBunTransportRequestHandlerWithPathFor,
  createCloudflareFetch as createRuntimeSubpathCloudflareFetch,
  createCloudflareFetchFor as createRuntimeSubpathCloudflareFetchFor,
  createCloudflareWorker as createRuntimeSubpathCloudflareWorker,
  createCloudflareWorkerFor as createRuntimeSubpathCloudflareWorkerFor,
  createDenoCompiledTransportRequestHandler as createRuntimeSubpathDenoCompiledTransportRequestHandler,
  createDenoCompiledTransportRequestHandlerFor as createRuntimeSubpathDenoCompiledTransportRequestHandlerFor,
  createDenoCompiledTransportRequestHandlerWithPathFor as createRuntimeSubpathDenoCompiledTransportRequestHandlerWithPathFor,
  createStandaloneDenoRpcRequestHandler as createRuntimeSubpathStandaloneDenoRpcRequestHandler,
  createStandaloneDenoRpcRequestHandlerFor as createRuntimeSubpathStandaloneDenoRpcRequestHandlerFor,
  createStandaloneDenoTransportRequestHandler as createRuntimeSubpathStandaloneDenoTransportRequestHandler,
  createStandaloneDenoTransportRequestHandlerFor as createRuntimeSubpathStandaloneDenoTransportRequestHandlerFor,
  createStandaloneDenoTransportRequestHandlerWithPath as createRuntimeSubpathStandaloneDenoTransportRequestHandlerWithPath,
  createStandaloneDenoTransportRequestHandlerWithPathFor as createRuntimeSubpathStandaloneDenoTransportRequestHandlerWithPathFor,
  createDenoFetchFor as createRuntimeSubpathDenoFetchFor,
  createCompiledRpcHandlerFor as createRuntimeSubpathCompiledRpcHandlerFor,
  type CompiledRpcRequestHandlerForConfig as RuntimeSubpathCompiledRpcRequestHandlerForConfig,
  createDenoRpcRequestHandlerFor as createRuntimeSubpathDenoRpcRequestHandlerFor,
  createDenoTransportRequestHandler as createRuntimeSubpathDenoTransportRequestHandler,
  createDenoTransportRequestHandlerFor as createRuntimeSubpathDenoTransportRequestHandlerFor,
  createDenoTransportRequestHandlerWithPathFor as createRuntimeSubpathDenoTransportRequestHandlerWithPathFor,
  createElysiaHandler as createRuntimeSubpathElysiaHandler,
  createElysiaHandlerFor as createRuntimeSubpathElysiaHandlerFor,
  createExpressHandler as createRuntimeSubpathExpressHandler,
  createExpressHandlerFor as createRuntimeSubpathExpressHandlerFor,
  createFastifyHandler as createRuntimeSubpathFastifyHandler,
  createFastifyHandlerFor as createRuntimeSubpathFastifyHandlerFor,
  createHonoHandler as createRuntimeSubpathHonoHandler,
  createHonoHandlerFor as createRuntimeSubpathHonoHandlerFor,
  createJoorHandler as createRuntimeSubpathJoorHandler,
  createJoorHandlerFor as createRuntimeSubpathJoorHandlerFor,
  createKoaHandler as createRuntimeSubpathKoaHandler,
  createKoaHandlerFor as createRuntimeSubpathKoaHandlerFor,
  createNetlifyEdgeFunction as createRuntimeSubpathNetlifyEdgeFunction,
  createNetlifyEdgeFunctionFor as createRuntimeSubpathNetlifyEdgeFunctionFor,
  createNetlifyFetch as createRuntimeSubpathNetlifyFetch,
  createNetlifyFetchFor as createRuntimeSubpathNetlifyFetchFor,
  createNextHandler as createRuntimeSubpathNextHandler,
  createNextHandlerFor as createRuntimeSubpathNextHandlerFor,
  createNextRouteHandlers as createRuntimeSubpathNextRouteHandlers,
  createNextRouteHandlersFor as createRuntimeSubpathNextRouteHandlersFor,
  createNodeRpcRequestHandler as createRuntimeSubpathNodeRpcRequestHandler,
  createNodeRpcRequestHandlerFor as createRuntimeSubpathNodeRpcRequestHandlerFor,
  createNodeTransportRequestHandler as createRuntimeSubpathNodeTransportRequestHandler,
  createNodeTransportRequestHandlerFor as createRuntimeSubpathNodeTransportRequestHandlerFor,
  createNodeTransportRequestHandlerWithPath as createRuntimeSubpathNodeTransportRequestHandlerWithPath,
  createNodeTransportRequestHandlerWithPathFor as createRuntimeSubpathNodeTransportRequestHandlerWithPathFor,
  createVercelFetch as createRuntimeSubpathVercelFetch,
  createVercelFetchFor as createRuntimeSubpathVercelFetchFor,
  createVercelFunction as createRuntimeSubpathVercelFunction,
  createVercelFunctionFor as createRuntimeSubpathVercelFunctionFor,
  appendJsonStringHeaders as runtimeSubpathAppendJsonStringHeaders,
  createJsonHeaderRecord as runtimeSubpathCreateJsonHeaderRecord,
  hasInvalidHeaderValue as runtimeSubpathHasInvalidHeaderValue,
  isBodySizeLimitError as isRuntimeSubpathBodySizeLimitError,
  isRpcEnvelopeArray as isRuntimeSubpathRpcEnvelopeArray,
  isSerializedJsonEnvelope as isRuntimeSubpathSerializedJsonEnvelope,
  jsonContentHeaders as runtimeSubpathJsonContentHeaders,
  jsonOkResponseInit as runtimeSubpathJsonOkResponseInit,
  normalizeMaxBodyBytes as normalizeRuntimeSubpathMaxBodyBytes,
  rpcEnvelopeToResponse as runtimeSubpathRpcEnvelopeToResponse,
  readJsonRequestBody as readRuntimeSubpathJsonRequestBody,
  readJsonRequestBodyWithLimit as readRuntimeSubpathJsonRequestBodyWithLimit,
  serializedEnvelopeToResponse as runtimeSubpathSerializedEnvelopeToResponse,
  serveStandaloneDeno as serveRuntimeSubpathStandaloneDeno,
  transportResultToResponse as runtimeSubpathTransportResultToResponse,
  type AwsLambdaHandler as RuntimeSubpathAwsLambdaHandler,
  type AwsLambdaHandlerOptionsFor as RuntimeSubpathAwsLambdaHandlerOptionsFor,
  type AwsLambdaHttpApiHandler as RuntimeSubpathAwsLambdaHttpApiHandler,
  type AwsLambdaHttpApiHandlerOptionsFor as RuntimeSubpathAwsLambdaHttpApiHandlerOptionsFor,
  type AwsLambdaHttpApiRouteStreamHandlerOptionsArgs as RuntimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsArgs,
  type AwsLambdaHttpApiRouteStreamHandlerOptionsFor as RuntimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsFor,
  type AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs as RuntimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs,
  type AwsLambdaHttpApiRouteUnaryHandlerOptionsFor as RuntimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsFor,
  type AwsLambdaHttpApiStreamRouteHandlerOptionsArgs as RuntimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsArgs,
  type AwsLambdaHttpApiStreamRouteHandlerOptionsFor as RuntimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsFor,
  type AwsLambdaHttpApiUnaryRouteHandlerOptionsArgs as RuntimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsArgs,
  type AwsLambdaHttpApiUnaryRouteHandlerOptionsFor as RuntimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsFor,
  type AwsLambdaRestApiHandler as RuntimeSubpathAwsLambdaRestApiHandler,
  type AwsLambdaRestApiHandlerOptionsFor as RuntimeSubpathAwsLambdaRestApiHandlerOptionsFor,
  type ElysiaContext as RuntimeSubpathElysiaContext,
  type ElysiaHandler as RuntimeSubpathElysiaHandler,
  type ElysiaHandlerOptionsFor as RuntimeSubpathElysiaHandlerOptionsFor,
  type ExpressHandlerOptionsFor as RuntimeSubpathExpressHandlerOptionsFor,
  type ExpressRequest as RuntimeSubpathExpressRequest,
  type ExpressRequestHandler as RuntimeSubpathExpressRequestHandler,
  type ExpressResponse as RuntimeSubpathExpressResponse,
  type FastifyHandler as RuntimeSubpathFastifyHandler,
  type FastifyHandlerOptionsFor as RuntimeSubpathFastifyHandlerOptionsFor,
  type FastifyReply as RuntimeSubpathFastifyReply,
  type FastifyRequest as RuntimeSubpathFastifyRequest,
  type HonoContext as RuntimeSubpathHonoContext,
  type HonoHandler as RuntimeSubpathHonoHandler,
  type HonoHandlerOptionsFor as RuntimeSubpathHonoHandlerOptionsFor,
  type KoaContext as RuntimeSubpathKoaContext,
  type KoaHandlerOptionsFor as RuntimeSubpathKoaHandlerOptionsFor,
  type KoaMiddleware as RuntimeSubpathKoaMiddleware,
  type KoaNext as RuntimeSubpathKoaNext,
  type BunFetchOptionsArgs as RuntimeSubpathBunFetchOptionsArgs,
  type BunFetchOptionsFor as RuntimeSubpathBunFetchOptionsFor,
  type BunFetchHandler as RuntimeSubpathBunFetchHandler,
  type BunRpcRequestHandlerOptionsArgs as RuntimeSubpathBunRpcRequestHandlerOptionsArgs,
  type BunRpcRequestHandlerOptionsFor as RuntimeSubpathBunRpcRequestHandlerOptionsFor,
  type BunRpcRequestHandler as RuntimeSubpathBunRpcRequestHandler,
  type BunRouteStreamFetchOptionsArgs as RuntimeSubpathBunRouteStreamFetchOptionsArgs,
  type BunRouteStreamFetchOptionsFor as RuntimeSubpathBunRouteStreamFetchOptionsFor,
  type BunRouteStreamRpcRequestHandlerOptionsArgs as RuntimeSubpathBunRouteStreamRpcRequestHandlerOptionsArgs,
  type BunRouteStreamRpcRequestHandlerOptionsFor as RuntimeSubpathBunRouteStreamRpcRequestHandlerOptionsFor,
  type BunRouteStreamServeOptionsArgs as RuntimeSubpathBunRouteStreamServeOptionsArgs,
  type BunRouteStreamServeOptionsFor as RuntimeSubpathBunRouteStreamServeOptionsFor,
  type BunRouteStreamTransportBodyResultFor as RuntimeSubpathBunRouteStreamTransportBodyResultFor,
  type BunRouteStreamTransportBodyResultHandlerFor as RuntimeSubpathBunRouteStreamTransportBodyResultHandlerFor,
  type BunRouteUnaryFetchOptionsArgs as RuntimeSubpathBunRouteUnaryFetchOptionsArgs,
  type BunRouteUnaryFetchOptionsFor as RuntimeSubpathBunRouteUnaryFetchOptionsFor,
  type BunRouteUnaryRpcRequestHandlerOptionsArgs as RuntimeSubpathBunRouteUnaryRpcRequestHandlerOptionsArgs,
  type BunRouteUnaryRpcRequestHandlerOptionsFor as RuntimeSubpathBunRouteUnaryRpcRequestHandlerOptionsFor,
  type BunRouteUnaryServeOptionsArgs as RuntimeSubpathBunRouteUnaryServeOptionsArgs,
  type BunRouteUnaryServeOptionsFor as RuntimeSubpathBunRouteUnaryServeOptionsFor,
  type BunRouteUnaryTransportBodyResultFor as RuntimeSubpathBunRouteUnaryTransportBodyResultFor,
  type BunRouteUnaryTransportBodyResultHandlerFor as RuntimeSubpathBunRouteUnaryTransportBodyResultHandlerFor,
  type BunStreamRouteFetchOptionsArgs as RuntimeSubpathBunStreamRouteFetchOptionsArgs,
  type BunStreamRouteFetchOptionsFor as RuntimeSubpathBunStreamRouteFetchOptionsFor,
  type BunStreamRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathBunStreamRouteRpcRequestHandlerOptionsArgs,
  type BunStreamRouteRpcRequestHandlerOptionsFor as RuntimeSubpathBunStreamRouteRpcRequestHandlerOptionsFor,
  type BunStreamRouteServeOptionsArgs as RuntimeSubpathBunStreamRouteServeOptionsArgs,
  type BunStreamRouteServeOptionsFor as RuntimeSubpathBunStreamRouteServeOptionsFor,
  type BunServeOptionsArgs as RuntimeSubpathBunServeOptionsArgs,
  type BunTransportBodyResultFor as RuntimeSubpathBunTransportBodyResultFor,
  type BunTransportBodyResultHandler as RuntimeSubpathBunTransportBodyResultHandler,
  type BunTransportBodyResultHandlerFor as RuntimeSubpathBunTransportBodyResultHandlerFor,
  type BunStreamRouteTransportBodyResultFor as RuntimeSubpathBunStreamRouteTransportBodyResultFor,
  type BunStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathBunStreamRouteTransportBodyResultHandlerFor,
  type BunTransportRequestHandler as RuntimeSubpathBunTransportRequestHandler,
  type BunUnaryRouteFetchOptionsArgs as RuntimeSubpathBunUnaryRouteFetchOptionsArgs,
  type BunUnaryRouteFetchOptionsFor as RuntimeSubpathBunUnaryRouteFetchOptionsFor,
  type BunUnaryRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathBunUnaryRouteRpcRequestHandlerOptionsArgs,
  type BunUnaryRouteRpcRequestHandlerOptionsFor as RuntimeSubpathBunUnaryRouteRpcRequestHandlerOptionsFor,
  type BunUnaryRouteServeOptionsArgs as RuntimeSubpathBunUnaryRouteServeOptionsArgs,
  type BunUnaryRouteServeOptionsFor as RuntimeSubpathBunUnaryRouteServeOptionsFor,
  type BunUnaryRouteTransportBodyResultFor as RuntimeSubpathBunUnaryRouteTransportBodyResultFor,
  type BunUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathBunUnaryRouteTransportBodyResultHandlerFor,
  type CloudflareFetchHandler as RuntimeSubpathCloudflareFetchHandler,
  type CloudflareFetchOptionsArgs as RuntimeSubpathCloudflareFetchOptionsArgs,
  type CloudflareFetchOptionsFor as RuntimeSubpathCloudflareFetchOptionsFor,
  type CloudflareRouteStreamFetchOptionsArgs as RuntimeSubpathCloudflareRouteStreamFetchOptionsArgs,
  type CloudflareRouteStreamFetchOptionsFor as RuntimeSubpathCloudflareRouteStreamFetchOptionsFor,
  type CloudflareRouteUnaryFetchOptionsArgs as RuntimeSubpathCloudflareRouteUnaryFetchOptionsArgs,
  type CloudflareRouteUnaryFetchOptionsFor as RuntimeSubpathCloudflareRouteUnaryFetchOptionsFor,
  type CloudflareStreamRouteFetchOptionsArgs as RuntimeSubpathCloudflareStreamRouteFetchOptionsArgs,
  type CloudflareStreamRouteFetchOptionsFor as RuntimeSubpathCloudflareStreamRouteFetchOptionsFor,
  type CloudflareUnaryRouteFetchOptionsArgs as RuntimeSubpathCloudflareUnaryRouteFetchOptionsArgs,
  type CloudflareUnaryRouteFetchOptionsFor as RuntimeSubpathCloudflareUnaryRouteFetchOptionsFor,
  type CloudflareRouteStreamWorkerOptionsArgs as RuntimeSubpathCloudflareRouteStreamWorkerOptionsArgs,
  type CloudflareRouteStreamWorkerOptionsFor as RuntimeSubpathCloudflareRouteStreamWorkerOptionsFor,
  type CloudflareRouteUnaryWorkerOptionsArgs as RuntimeSubpathCloudflareRouteUnaryWorkerOptionsArgs,
  type CloudflareRouteUnaryWorkerOptionsFor as RuntimeSubpathCloudflareRouteUnaryWorkerOptionsFor,
  type CloudflareStreamRouteWorkerOptionsArgs as RuntimeSubpathCloudflareStreamRouteWorkerOptionsArgs,
  type CloudflareStreamRouteWorkerOptionsFor as RuntimeSubpathCloudflareStreamRouteWorkerOptionsFor,
  type CloudflareUnaryRouteWorkerOptionsArgs as RuntimeSubpathCloudflareUnaryRouteWorkerOptionsArgs,
  type CloudflareUnaryRouteWorkerOptionsFor as RuntimeSubpathCloudflareUnaryRouteWorkerOptionsFor,
  type CloudflareWorkerFetchHandler as RuntimeSubpathCloudflareWorkerFetchHandler,
  type CloudflareWorker as RuntimeSubpathCloudflareWorker,
  type CloudflareWorkerOptionsArgs as RuntimeSubpathCloudflareWorkerOptionsArgs,
  type CompiledRpcRequestHandler as RuntimeSubpathCompiledRpcRequestHandler,
  type DenoCompiledTransportBodyResult as RuntimeSubpathDenoCompiledTransportBodyResult,
  type DenoCompiledTransportBodyResultFor as RuntimeSubpathDenoCompiledTransportBodyResultFor,
  type DenoCompiledTransportBodyResultHandler as RuntimeSubpathDenoCompiledTransportBodyResultHandler,
  type DenoCompiledTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledTransportBodyResultHandlerFor,
  type DenoCompiledRouteStreamTransportBodyResultFor as RuntimeSubpathDenoCompiledRouteStreamTransportBodyResultFor,
  type DenoCompiledRouteStreamTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledRouteStreamTransportBodyResultHandlerFor,
  type DenoCompiledRouteUnaryTransportBodyResultFor as RuntimeSubpathDenoCompiledRouteUnaryTransportBodyResultFor,
  type DenoCompiledRouteUnaryTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledRouteUnaryTransportBodyResultHandlerFor,
  type DenoCompiledStreamRouteTransportBodyResultFor as RuntimeSubpathDenoCompiledStreamRouteTransportBodyResultFor,
  type DenoCompiledStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledStreamRouteTransportBodyResultHandlerFor,
  type DenoCompiledTransportRequestHandler as RuntimeSubpathDenoCompiledTransportRequestHandler,
  type DenoCompiledUnaryRouteTransportBodyResultFor as RuntimeSubpathDenoCompiledUnaryRouteTransportBodyResultFor,
  type DenoCompiledUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathDenoCompiledUnaryRouteTransportBodyResultHandlerFor,
  type DenoFetchOptionsArgs as RuntimeSubpathDenoFetchOptionsArgs,
  type DenoFetchOptionsFor as RuntimeSubpathDenoFetchOptionsFor,
  type DenoFetchHandler as RuntimeSubpathDenoFetchHandler,
  type DenoRpcRequestHandlerOptionsArgs as RuntimeSubpathDenoRpcRequestHandlerOptionsArgs,
  type DenoRpcRequestHandlerOptionsFor as RuntimeSubpathDenoRpcRequestHandlerOptionsFor,
  type DenoRpcRequestHandler as RuntimeSubpathDenoRpcRequestHandler,
  type DenoRouteStreamFetchOptionsArgs as RuntimeSubpathDenoRouteStreamFetchOptionsArgs,
  type DenoRouteStreamFetchOptionsFor as RuntimeSubpathDenoRouteStreamFetchOptionsFor,
  type DenoRouteStreamRpcRequestHandlerOptionsArgs as RuntimeSubpathDenoRouteStreamRpcRequestHandlerOptionsArgs,
  type DenoRouteStreamRpcRequestHandlerOptionsFor as RuntimeSubpathDenoRouteStreamRpcRequestHandlerOptionsFor,
  type DenoRouteStreamServeOptionsArgs as RuntimeSubpathDenoRouteStreamServeOptionsArgs,
  type DenoRouteStreamServeOptionsFor as RuntimeSubpathDenoRouteStreamServeOptionsFor,
  type DenoRouteStreamTransportBodyResultFor as RuntimeSubpathDenoRouteStreamTransportBodyResultFor,
  type DenoRouteStreamTransportBodyResultHandlerFor as RuntimeSubpathDenoRouteStreamTransportBodyResultHandlerFor,
  type DenoRouteUnaryFetchOptionsArgs as RuntimeSubpathDenoRouteUnaryFetchOptionsArgs,
  type DenoRouteUnaryFetchOptionsFor as RuntimeSubpathDenoRouteUnaryFetchOptionsFor,
  type DenoRouteUnaryRpcRequestHandlerOptionsArgs as RuntimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsArgs,
  type DenoRouteUnaryRpcRequestHandlerOptionsFor as RuntimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsFor,
  type DenoRouteUnaryServeOptionsArgs as RuntimeSubpathDenoRouteUnaryServeOptionsArgs,
  type DenoRouteUnaryServeOptionsFor as RuntimeSubpathDenoRouteUnaryServeOptionsFor,
  type DenoRouteUnaryTransportBodyResultFor as RuntimeSubpathDenoRouteUnaryTransportBodyResultFor,
  type DenoRouteUnaryTransportBodyResultHandlerFor as RuntimeSubpathDenoRouteUnaryTransportBodyResultHandlerFor,
  type DenoStreamRouteFetchOptionsArgs as RuntimeSubpathDenoStreamRouteFetchOptionsArgs,
  type DenoStreamRouteFetchOptionsFor as RuntimeSubpathDenoStreamRouteFetchOptionsFor,
  type DenoStreamRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs,
  type DenoStreamRouteRpcRequestHandlerOptionsFor as RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsFor,
  type DenoStreamRouteServeOptionsArgs as RuntimeSubpathDenoStreamRouteServeOptionsArgs,
  type DenoStreamRouteServeOptionsFor as RuntimeSubpathDenoStreamRouteServeOptionsFor,
  type DenoServeOptionsArgs as RuntimeSubpathDenoServeOptionsArgs,
  type DenoTransportBodyResult as RuntimeSubpathDenoTransportBodyResult,
  type DenoTransportBodyResultFor as RuntimeSubpathDenoTransportBodyResultFor,
  type DenoTransportBodyResultHandlerFor as RuntimeSubpathDenoTransportBodyResultHandlerFor,
  type DenoStreamRouteTransportBodyResultFor as RuntimeSubpathDenoStreamRouteTransportBodyResultFor,
  type DenoStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathDenoStreamRouteTransportBodyResultHandlerFor,
  type DenoTransportRequestHandler as RuntimeSubpathDenoTransportRequestHandler,
  type DenoUnaryRouteFetchOptionsArgs as RuntimeSubpathDenoUnaryRouteFetchOptionsArgs,
  type DenoUnaryRouteFetchOptionsFor as RuntimeSubpathDenoUnaryRouteFetchOptionsFor,
  type DenoUnaryRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs,
  type DenoUnaryRouteRpcRequestHandlerOptionsFor as RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsFor,
  type DenoUnaryRouteServeOptionsArgs as RuntimeSubpathDenoUnaryRouteServeOptionsArgs,
  type DenoUnaryRouteServeOptionsFor as RuntimeSubpathDenoUnaryRouteServeOptionsFor,
  type DenoUnaryRouteTransportBodyResultFor as RuntimeSubpathDenoUnaryRouteTransportBodyResultFor,
  type DenoUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathDenoUnaryRouteTransportBodyResultHandlerFor,
  type StandaloneDenoRpcRequestHandlerOptionsArgs as RuntimeSubpathStandaloneDenoRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRpcRequestHandlerOptionsFor as RuntimeSubpathStandaloneDenoRpcRequestHandlerOptionsFor,
  type StandaloneDenoRpcRequestHandler as RuntimeSubpathStandaloneDenoRpcRequestHandler,
  type StandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs as RuntimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRouteStreamRpcRequestHandlerOptionsFor as RuntimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsFor,
  type StandaloneDenoRouteStreamServeOptionsArgs as RuntimeSubpathStandaloneDenoRouteStreamServeOptionsArgs,
  type StandaloneDenoRouteStreamServeOptionsFor as RuntimeSubpathStandaloneDenoRouteStreamServeOptionsFor,
  type StandaloneDenoRouteStreamTransportBodyResultFor as RuntimeSubpathStandaloneDenoRouteStreamTransportBodyResultFor,
  type StandaloneDenoRouteStreamTransportBodyResultHandlerFor as RuntimeSubpathStandaloneDenoRouteStreamTransportBodyResultHandlerFor,
  type StandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs as RuntimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs,
  type StandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor as RuntimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor,
  type StandaloneDenoRouteUnaryServeOptionsArgs as RuntimeSubpathStandaloneDenoRouteUnaryServeOptionsArgs,
  type StandaloneDenoRouteUnaryServeOptionsFor as RuntimeSubpathStandaloneDenoRouteUnaryServeOptionsFor,
  type StandaloneDenoRouteUnaryTransportBodyResultFor as RuntimeSubpathStandaloneDenoRouteUnaryTransportBodyResultFor,
  type StandaloneDenoRouteUnaryTransportBodyResultHandlerFor as RuntimeSubpathStandaloneDenoRouteUnaryTransportBodyResultHandlerFor,
  type StandaloneDenoServeOptionsArgs as RuntimeSubpathStandaloneDenoServeOptionsArgs,
  type StandaloneDenoServeOptionsFor as RuntimeSubpathStandaloneDenoServeOptionsFor,
  type StandaloneDenoServeOptions as RuntimeSubpathStandaloneDenoServeOptions,
  type StandaloneDenoServer as RuntimeSubpathStandaloneDenoServer,
  type StandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs,
  type StandaloneDenoStreamRouteRpcRequestHandlerOptionsFor as RuntimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsFor,
  type StandaloneDenoStreamRouteServeOptionsArgs as RuntimeSubpathStandaloneDenoStreamRouteServeOptionsArgs,
  type StandaloneDenoStreamRouteServeOptionsFor as RuntimeSubpathStandaloneDenoStreamRouteServeOptionsFor,
  type StandaloneDenoStreamRouteTransportBodyResultFor as RuntimeSubpathStandaloneDenoStreamRouteTransportBodyResultFor,
  type StandaloneDenoStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathStandaloneDenoStreamRouteTransportBodyResultHandlerFor,
  type StandaloneDenoTransportBodyResult as RuntimeSubpathStandaloneDenoTransportBodyResult,
  type StandaloneDenoTransportBodyResultFor as RuntimeSubpathStandaloneDenoTransportBodyResultFor,
  type StandaloneDenoTransportBodyResultHandler as RuntimeSubpathStandaloneDenoTransportBodyResultHandler,
  type StandaloneDenoTransportBodyResultHandlerFor as RuntimeSubpathStandaloneDenoTransportBodyResultHandlerFor,
  type StandaloneDenoTransportRequestHandler as RuntimeSubpathStandaloneDenoTransportRequestHandler,
  type StandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs,
  type StandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor as RuntimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor,
  type StandaloneDenoUnaryRouteServeOptionsArgs as RuntimeSubpathStandaloneDenoUnaryRouteServeOptionsArgs,
  type StandaloneDenoUnaryRouteServeOptionsFor as RuntimeSubpathStandaloneDenoUnaryRouteServeOptionsFor,
  type StandaloneDenoUnaryRouteTransportBodyResultFor as RuntimeSubpathStandaloneDenoUnaryRouteTransportBodyResultFor,
  type StandaloneDenoUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathStandaloneDenoUnaryRouteTransportBodyResultHandlerFor,
  type JoorFetchHandler as RuntimeSubpathJoorFetchHandler,
  type JoorHandlerOptionsArgs as RuntimeSubpathJoorHandlerOptionsArgs,
  type JoorHandlerOptionsFor as RuntimeSubpathJoorHandlerOptionsFor,
  type JoorRouteStreamHandlerOptionsArgs as RuntimeSubpathJoorRouteStreamHandlerOptionsArgs,
  type JoorRouteStreamHandlerOptionsFor as RuntimeSubpathJoorRouteStreamHandlerOptionsFor,
  type JoorRouteUnaryHandlerOptionsArgs as RuntimeSubpathJoorRouteUnaryHandlerOptionsArgs,
  type JoorRouteUnaryHandlerOptionsFor as RuntimeSubpathJoorRouteUnaryHandlerOptionsFor,
  type JoorStreamRouteHandlerOptionsArgs as RuntimeSubpathJoorStreamRouteHandlerOptionsArgs,
  type JoorStreamRouteHandlerOptionsFor as RuntimeSubpathJoorStreamRouteHandlerOptionsFor,
  type JoorUnaryRouteHandlerOptionsArgs as RuntimeSubpathJoorUnaryRouteHandlerOptionsArgs,
  type JoorUnaryRouteHandlerOptionsFor as RuntimeSubpathJoorUnaryRouteHandlerOptionsFor,
  type NetlifyEdgeFetchHandler as RuntimeSubpathNetlifyEdgeFetchHandler,
  type NetlifyEdgeResult as RuntimeSubpathNetlifyEdgeResult,
  type NetlifyFetchHandler as RuntimeSubpathNetlifyFetchHandler,
  type NetlifyFetchOptionsArgs as RuntimeSubpathNetlifyFetchOptionsArgs,
  type NetlifyFetchOptionsFor as RuntimeSubpathNetlifyFetchOptionsFor,
  type NetlifyRouteStreamFetchOptionsArgs as RuntimeSubpathNetlifyRouteStreamFetchOptionsArgs,
  type NetlifyRouteStreamFetchOptionsFor as RuntimeSubpathNetlifyRouteStreamFetchOptionsFor,
  type NetlifyRouteUnaryFetchOptionsArgs as RuntimeSubpathNetlifyRouteUnaryFetchOptionsArgs,
  type NetlifyRouteUnaryFetchOptionsFor as RuntimeSubpathNetlifyRouteUnaryFetchOptionsFor,
  type NetlifyStreamRouteFetchOptionsArgs as RuntimeSubpathNetlifyStreamRouteFetchOptionsArgs,
  type NetlifyStreamRouteFetchOptionsFor as RuntimeSubpathNetlifyStreamRouteFetchOptionsFor,
  type NetlifyUnaryRouteFetchOptionsArgs as RuntimeSubpathNetlifyUnaryRouteFetchOptionsArgs,
  type NetlifyUnaryRouteFetchOptionsFor as RuntimeSubpathNetlifyUnaryRouteFetchOptionsFor,
  type NextHandler as RuntimeSubpathNextHandler,
  type NextHandlerOptionsArgs as RuntimeSubpathNextHandlerOptionsArgs,
  type NextHandlerOptionsFor as RuntimeSubpathNextHandlerOptionsFor,
  type NextRouteStreamHandlerOptionsArgs as RuntimeSubpathNextRouteStreamHandlerOptionsArgs,
  type NextRouteStreamHandlerOptionsFor as RuntimeSubpathNextRouteStreamHandlerOptionsFor,
  type NextRouteStreamHandlersOptionsArgs as RuntimeSubpathNextRouteStreamHandlersOptionsArgs,
  type NextRouteStreamHandlersOptionsFor as RuntimeSubpathNextRouteStreamHandlersOptionsFor,
  type NextStreamRouteHandlerOptionsArgs as RuntimeSubpathNextStreamRouteHandlerOptionsArgs,
  type NextStreamRouteHandlerOptionsFor as RuntimeSubpathNextStreamRouteHandlerOptionsFor,
  type NextStreamRouteHandlersOptionsArgs as RuntimeSubpathNextStreamRouteHandlersOptionsArgs,
  type NextStreamRouteHandlersOptionsFor as RuntimeSubpathNextStreamRouteHandlersOptionsFor,
  type NextRouteContext as RuntimeSubpathNextRouteContext,
  type NextRouteHandler as RuntimeSubpathNextRouteHandler,
  type NextRouteHandlers as RuntimeSubpathNextRouteHandlers,
  type NextRouteHandlersOptionsArgs as RuntimeSubpathNextRouteHandlersOptionsArgs,
  type NextRouteHandlersOptionsFor as RuntimeSubpathNextRouteHandlersOptionsFor,
  type NextRouteParamValue as RuntimeSubpathNextRouteParamValue,
  type NextRouteParams as RuntimeSubpathNextRouteParams,
  type NextRouteUnaryHandlerOptionsArgs as RuntimeSubpathNextRouteUnaryHandlerOptionsArgs,
  type NextRouteUnaryHandlerOptionsFor as RuntimeSubpathNextRouteUnaryHandlerOptionsFor,
  type NextRouteUnaryHandlersOptionsArgs as RuntimeSubpathNextRouteUnaryHandlersOptionsArgs,
  type NextRouteUnaryHandlersOptionsFor as RuntimeSubpathNextRouteUnaryHandlersOptionsFor,
  type NextUnaryRouteHandlerOptionsArgs as RuntimeSubpathNextUnaryRouteHandlerOptionsArgs,
  type NextUnaryRouteHandlerOptionsFor as RuntimeSubpathNextUnaryRouteHandlerOptionsFor,
  type NextUnaryRouteHandlersOptionsArgs as RuntimeSubpathNextUnaryRouteHandlersOptionsArgs,
  type NextUnaryRouteHandlersOptionsFor as RuntimeSubpathNextUnaryRouteHandlersOptionsFor,
  type NodeTransportBodyResultHandler as RuntimeSubpathNodeTransportBodyResultHandler,
  type NodeTransportBodyResultFor as RuntimeSubpathNodeTransportBodyResultFor,
  type NodeTransportBodyResultHandlerFor as RuntimeSubpathNodeTransportBodyResultHandlerFor,
  type NodeRpcRequestHandler as RuntimeSubpathNodeRpcRequestHandler,
  type NodeTransportRequestHandler as RuntimeSubpathNodeTransportRequestHandler,
  type NodeRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeRpcRequestHandlerOptionsArgs,
  type NodeRpcRequestHandlerOptionsFor as RuntimeSubpathNodeRpcRequestHandlerOptionsFor,
  type NodeRouteStreamRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeRouteStreamRpcRequestHandlerOptionsArgs,
  type NodeRouteStreamRpcRequestHandlerOptionsFor as RuntimeSubpathNodeRouteStreamRpcRequestHandlerOptionsFor,
  type NodeRouteStreamTransportBodyResultFor as RuntimeSubpathNodeRouteStreamTransportBodyResultFor,
  type NodeRouteStreamTransportBodyResultHandlerFor as RuntimeSubpathNodeRouteStreamTransportBodyResultHandlerFor,
  type NodeRouteUnaryRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsArgs,
  type NodeRouteUnaryRpcRequestHandlerOptionsFor as RuntimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsFor,
  type NodeRouteUnaryTransportBodyResultFor as RuntimeSubpathNodeRouteUnaryTransportBodyResultFor,
  type NodeRouteUnaryTransportBodyResultHandlerFor as RuntimeSubpathNodeRouteUnaryTransportBodyResultHandlerFor,
  type NodeStreamRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs,
  type NodeStreamRouteRpcRequestHandlerOptionsFor as RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsFor,
  type NodeStreamRouteTransportBodyResultFor as RuntimeSubpathNodeStreamRouteTransportBodyResultFor,
  type NodeStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathNodeStreamRouteTransportBodyResultHandlerFor,
  type ListenOptionsArgs as RuntimeSubpathListenOptionsArgs,
  type NodeListenOptions as RuntimeSubpathNodeListenOptions,
  type NodeListenOptionsArgs as RuntimeSubpathNodeListenOptionsArgs,
  type NodeListenOptionsFor as RuntimeSubpathNodeListenOptionsFor,
  type NodeRouteStreamListenOptionsArgs as RuntimeSubpathNodeRouteStreamListenOptionsArgs,
  type NodeRouteStreamListenOptionsFor as RuntimeSubpathNodeRouteStreamListenOptionsFor,
  type NodeRouteUnaryListenOptionsArgs as RuntimeSubpathNodeRouteUnaryListenOptionsArgs,
  type NodeRouteUnaryListenOptionsFor as RuntimeSubpathNodeRouteUnaryListenOptionsFor,
  type NodeStreamRouteListenOptionsArgs as RuntimeSubpathNodeStreamRouteListenOptionsArgs,
  type NodeStreamRouteListenOptionsFor as RuntimeSubpathNodeStreamRouteListenOptionsFor,
  type NodeUnaryRouteListenOptionsArgs as RuntimeSubpathNodeUnaryRouteListenOptionsArgs,
  type NodeUnaryRouteListenOptionsFor as RuntimeSubpathNodeUnaryRouteListenOptionsFor,
  type RouteStreamListenOptionsArgs as RuntimeSubpathRouteStreamListenOptionsArgs,
  type RouteStreamListenOptionsFor as RuntimeSubpathRouteStreamListenOptionsFor,
  type RouteUnaryListenOptionsArgs as RuntimeSubpathRouteUnaryListenOptionsArgs,
  type RouteUnaryListenOptionsFor as RuntimeSubpathRouteUnaryListenOptionsFor,
  type StreamRouteListenOptionsArgs as RuntimeSubpathStreamRouteListenOptionsArgs,
  type StreamRouteListenOptionsFor as RuntimeSubpathStreamRouteListenOptionsFor,
  type UnaryRouteListenOptionsArgs as RuntimeSubpathUnaryRouteListenOptionsArgs,
  type UnaryRouteListenOptionsFor as RuntimeSubpathUnaryRouteListenOptionsFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs,
  type NodeUnaryRouteRpcRequestHandlerOptionsFor as RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsFor,
  type NodeUnaryRouteTransportBodyResultFor as RuntimeSubpathNodeUnaryRouteTransportBodyResultFor,
  type NodeUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathNodeUnaryRouteTransportBodyResultHandlerFor,
  type CorsHeaderOptions as RuntimeSubpathCorsHeaderOptions,
  type SerializedJsonEnvelope as RuntimeSubpathSerializedJsonEnvelope,
  type TransportBodyResult as RuntimeSubpathTransportBodyResult,
  type TransportBodyResultFor as RuntimeSubpathTransportBodyResultFor,
  type VercelFetchHandler as RuntimeSubpathVercelFetchHandler,
  type VercelFetchOptionsArgs as RuntimeSubpathVercelFetchOptionsArgs,
  type VercelFetchOptionsFor as RuntimeSubpathVercelFetchOptionsFor,
  type VercelFunction as RuntimeSubpathVercelFunction,
  type VercelRouteStreamFetchOptionsArgs as RuntimeSubpathVercelRouteStreamFetchOptionsArgs,
  type VercelRouteStreamFetchOptionsFor as RuntimeSubpathVercelRouteStreamFetchOptionsFor,
  type VercelRouteUnaryFetchOptionsArgs as RuntimeSubpathVercelRouteUnaryFetchOptionsArgs,
  type VercelRouteUnaryFetchOptionsFor as RuntimeSubpathVercelRouteUnaryFetchOptionsFor,
  type VercelStreamRouteFetchOptionsArgs as RuntimeSubpathVercelStreamRouteFetchOptionsArgs,
  type VercelStreamRouteFetchOptionsFor as RuntimeSubpathVercelStreamRouteFetchOptionsFor,
  type VercelUnaryRouteFetchOptionsArgs as RuntimeSubpathVercelUnaryRouteFetchOptionsArgs,
  type VercelUnaryRouteFetchOptionsFor as RuntimeSubpathVercelUnaryRouteFetchOptionsFor,
  type CloudflareWorkerOptionsFor as RuntimeSubpathCloudflareWorkerOptionsFor,
} from '../src/runtime/index.js';
import {
  BodySizeLimitError as RuntimeBodySubpathBodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES as RUNTIME_BODY_SUBPATH_DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError as isRuntimeBodySubpathBodySizeLimitError,
  normalizeMaxBodyBytes as normalizeRuntimeBodySubpathMaxBodyBytes,
  readJsonRequestBody as readRuntimeBodySubpathJsonRequestBody,
  readJsonRequestBodyWithLimit as readRuntimeBodySubpathJsonRequestBodyWithLimit,
} from '../src/runtime/body.js';
import {
  appendJsonStringHeaders as runtimeResponseSubpathAppendJsonStringHeaders,
  createJsonHeaderRecord as runtimeResponseSubpathCreateJsonHeaderRecord,
  hasInvalidHeaderValue as runtimeResponseSubpathHasInvalidHeaderValue,
  isSerializedJsonEnvelope as isRuntimeResponseSubpathSerializedJsonEnvelope,
  jsonContentHeaders as runtimeResponseSubpathJsonContentHeaders,
  jsonOkResponseInit as runtimeResponseSubpathJsonOkResponseInit,
  rpcEnvelopeToResponse as runtimeResponseSubpathRpcEnvelopeToResponse,
  serializedEnvelopeToResponse as runtimeResponseSubpathSerializedEnvelopeToResponse,
  transportResultToResponse as runtimeResponseSubpathTransportResultToResponse,
  type CorsHeaderOptions as RuntimeResponseSubpathCorsHeaderOptions,
  type SerializedJsonEnvelope as RuntimeResponseSubpathSerializedJsonEnvelope,
  type TransportBodyResult as RuntimeResponseSubpathTransportBodyResult,
  type TransportBodyResultFor as RuntimeResponseSubpathTransportBodyResultFor,
} from '../src/runtime/response.js';

const typedStringMeta = t.string().example('Ada').default('Grace');
typedStringMeta.meta.example?.toString();
// @ts-expect-error string schema metadata examples must be strings.
t.string().example(1);
// @ts-expect-error string schema metadata defaults must be strings.
t.string().default(false);
t.number().example(42).default(7);
// @ts-expect-error number schema metadata examples must be numbers.
t.number().example('42');
t.boolean().example(true).default(false);
// @ts-expect-error boolean schema metadata defaults must be booleans.
t.boolean().default('false');
t.literal('ready').example('ready').default('ready');
// @ts-expect-error literal schema metadata must match the literal value.
t.literal('ready').example('waiting');
t.enum(['draft', 'published'] as const).example('draft').default('published');
// @ts-expect-error enum metadata examples must be one of the enum values.
t.enum(['draft', 'published'] as const).example('archived');
t.array(t.string()).example(['a']).default(['b']);
// @ts-expect-error array metadata examples must match the item schema.
t.array(t.string()).example([1]);
t.object({ id: t.string(), active: t.boolean().optional() }).example({
  id: '1',
});
// @ts-expect-error object metadata examples must match the object schema.
t.object({ id: t.string() }).example({ id: 1 });
t.union([t.string(), t.number()] as const).default('id');
// @ts-expect-error union metadata defaults must match one of the variants.
t.union([t.string(), t.number()] as const).default(false);
t.record(t.number()).example({ a: 1 }).default({ b: 2 });
// @ts-expect-error record metadata examples must match the value schema.
t.record(t.number()).example({ a: '1' });

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
// @ts-expect-error plugin names are readonly.
usersPlugin.name = 'accounts';
// @ts-expect-error plugin setup functions are readonly.
usersPlugin.setup = () => ({});

const config = defineConfig({ plugins: [usersPlugin] as const });
// @ts-expect-error configs expose readonly plugin lists.
config.plugins = [] as const;
type Services = JoorConfigContext<typeof config>;
type ConfigRequest = JoorConfigRequest<typeof config>;
const configRequest: ConfigRequest = new Request('https://example.com/rpc');
configRequest.url.toUpperCase();
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

interface ProcedureAppRequest extends Request {
  readonly requestId: string;
}

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
const requestTypedProcedure = defineProcedure.withContext<
  Services,
  ProcedureAppRequest
>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  handler(ctx, input) {
    ctx.request.requestId.toUpperCase();
    ctx.services.users.findById(input.id);
    return { id: input.id };
  },
});
const requestTypedProcedureRequest: ProcedureRequest<typeof requestTypedProcedure> =
  Object.assign(new Request('https://example.com/rpc'), {
    requestId: 'req_1',
  }) as ProcedureAppRequest;
requestTypedProcedureRequest.requestId.toUpperCase();
// @ts-expect-error request-typed procedures are not assignable to plain request procedures.
const _wrongRequestTypedProcedure: Procedure<
  typeof requestTypedProcedure.input,
  NonNullable<typeof requestTypedProcedure.output>,
  typeof requestTypedProcedure.errors,
  undefined,
  undefined,
  undefined,
  Record<string, never>,
  Services,
  Request
> = requestTypedProcedure;
const defaultProcedureRequest: ProcedureRequest<typeof procedure> = new Request(
  'https://example.com/rpc'
);
defaultProcedureRequest.url.toUpperCase();
const requestTypedManifest = defineManifest({
  procedures: {
    'request.get': requestTypedProcedure,
  },
});
const requestTypedManifestRequiredRequest: RpcManifestRequiredRuntimeRequest<
  typeof requestTypedManifest
> = requestTypedProcedureRequest;
requestTypedManifestRequiredRequest.requestId.toUpperCase();
const requestTypedJoorManifestRequiredRequest: JoorManifestRequiredRuntimeRequest<
  typeof requestTypedManifest
> = requestTypedManifestRequiredRequest;
requestTypedJoorManifestRequiredRequest.requestId.toUpperCase();
const requestTypedManifestRouteRequest: RpcManifestRouteRuntimeRequest<
  typeof requestTypedManifest,
  'request.get'
> = requestTypedProcedureRequest;
const requestTypedJoorManifestRouteRequest: JoorManifestRouteRuntimeRequest<
  typeof requestTypedManifest,
  'request.get'
> = requestTypedManifestRouteRequest;
requestTypedJoorManifestRouteRequest.requestId.toUpperCase();
const requestTypedManifestHandlerOptions: HandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  ProcedureAppRequest
> = {
  plugins: [usersPlugin] as const,
};
requestTypedManifestHandlerOptions.plugins?.[0]?.name.toUpperCase();
const requestTypedManifestDefaultHandlerOptions: HandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestDefaultHandlerRequest: HandlerOptionsRequest<
  typeof requestTypedManifestDefaultHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestDefaultHandlerRequest.requestId.toUpperCase();
// @ts-expect-error manifests still reject explicit handler request types that are too broad.
const _wrongRequestTypedManifestHandlerOptions: HandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestDefaultHooks: HandlerHooksFor<
  typeof requestTypedManifest
> = {
  beforeRequest(request) {
    request.requestId.toUpperCase();
    return undefined;
  },
};
requestTypedManifestDefaultHooks.beforeRequest?.(requestTypedProcedureRequest, {
  services: {},
});
requestTypedManifestDefaultHooks.beforeRequest?.(
  // @ts-expect-error manifest-aware hooks default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { services: {} }
);
const requestTypedManifestDefaultMiddleware: JoorMiddlewareFor<
  typeof requestTypedManifest
> = {
  name: 'request-typed',
  beforeRequest(request) {
    request.requestId.toUpperCase();
    return undefined;
  },
};
requestTypedManifestDefaultMiddleware.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: {} }
);
requestTypedManifestDefaultMiddleware.beforeRequest?.(
  // @ts-expect-error manifest-aware middleware defaults to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { services: {} }
);
const requestTypedManifestDefaultBodyHandler: RpcBodyHandler<
  typeof requestTypedManifest
> = (request, _body) => new Response(request.requestId);
requestTypedManifestDefaultBodyHandler(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestDefaultBodyHandler(
  // @ts-expect-error manifest body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultBodyResultHandler: RpcBodyResultHandler<
  typeof requestTypedManifest
> = (request, body) =>
  new Response(request.requestId) as RpcManifestBodyResultFor<
    typeof requestTypedManifest,
    typeof body
  >;
requestTypedManifestDefaultBodyResultHandler(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestDefaultBodyResultHandler(
  // @ts-expect-error manifest body result handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultConfig: JoorConfigFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestDefaultConfigRequest: JoorConfigRequest<
  typeof requestTypedManifestDefaultConfig
> = requestTypedProcedureRequest;
requestTypedManifestDefaultConfigRequest.requestId.toUpperCase();
const requestTypedManifestDefinedConfig = defineConfigFor(
  requestTypedManifest
)<readonly [typeof usersPlugin]>({
  plugins: [usersPlugin] as const,
});
const requestTypedManifestDefinedConfigRequest: JoorConfigRequest<
  typeof requestTypedManifestDefinedConfig
> = requestTypedProcedureRequest;
requestTypedManifestDefinedConfigRequest.requestId.toUpperCase();
// @ts-expect-error manifests still reject explicit config request types that are too broad.
const _wrongRequestTypedManifestConfig: JoorConfigFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestDefinedHandlerOptions = defineHandlerOptions(
  requestTypedManifest
)<readonly [typeof usersPlugin]>({
  plugins: [usersPlugin] as const,
});
const requestTypedManifestDefinedHandlerRequest: HandlerOptionsRequest<
  typeof requestTypedManifestDefinedHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestDefinedHandlerRequest.requestId.toUpperCase();
const requestTypedManifestJoorHandlerOptions: JoorHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestJoorHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestJoorHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestJoorHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
requestTypedManifestRuntimeSubpathJoorHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestJoorHandler = createJoorHandler(
  requestTypedManifest,
  requestTypedManifestJoorHandlerOptions
);
requestTypedManifestJoorHandler(requestTypedProcedureRequest);
requestTypedManifestJoorHandler(
  // @ts-expect-error fetch handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultJoorHandlerFor = createJoorHandlerFor()(
  requestTypedManifest,
  requestTypedManifestJoorHandlerOptions
);
requestTypedManifestDefaultJoorHandlerFor(requestTypedProcedureRequest);
requestTypedManifestDefaultJoorHandlerFor(
  // @ts-expect-error curried fetch handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultRuntimeSubpathJoorHandlerFor =
  createRuntimeSubpathJoorHandlerFor()(
    requestTypedManifest,
    requestTypedManifestJoorHandlerOptions
  );
requestTypedManifestDefaultRuntimeSubpathJoorHandlerFor(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultRuntimeSubpathJoorHandlerFor(
  // @ts-expect-error runtime subpath curried fetch handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
// @ts-expect-error runtime fetch option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestJoorHandlerOptions: JoorHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestRpcHandler = createRpcHandler(
  requestTypedManifest,
  requestTypedManifestDefaultHandlerOptions
);
requestTypedManifestRpcHandler(requestTypedProcedureRequest);
requestTypedManifestRpcHandler(
  // @ts-expect-error RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultRpcHandlerFor = createRpcHandlerFor()(
  requestTypedManifest,
  requestTypedManifestDefaultHandlerOptions
);
requestTypedManifestDefaultRpcHandlerFor(requestTypedProcedureRequest);
requestTypedManifestDefaultRpcHandlerFor(
  // @ts-expect-error curried RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultRpcSubpathHandlerFor =
  createRpcSubpathHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDefaultHandlerOptions
  );
requestTypedManifestDefaultRpcSubpathHandlerFor(requestTypedProcedureRequest);
requestTypedManifestDefaultRpcSubpathHandlerFor(
  // @ts-expect-error RPC subpath curried handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestRpcBodyHandler = createRpcBodyHandler(
  requestTypedManifest,
  requestTypedManifestDefaultHandlerOptions
);
requestTypedManifestRpcBodyHandler(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestRpcBodyHandler(
  // @ts-expect-error RPC body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultRpcBodyHandlerFor =
  createRpcBodyHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDefaultHandlerOptions
  );
requestTypedManifestDefaultRpcBodyHandlerFor(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestDefaultRpcBodyHandlerFor(
  // @ts-expect-error curried RPC body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultRpcSubpathBodyHandlerFor =
  createRpcSubpathBodyHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDefaultHandlerOptions
  );
requestTypedManifestDefaultRpcSubpathBodyHandlerFor(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
requestTypedManifestDefaultRpcSubpathBodyHandlerFor(
  // @ts-expect-error RPC subpath curried body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestRpcBodyResultHandler = createRpcBodyResultHandler(
  requestTypedManifest,
  requestTypedManifestDefaultHandlerOptions
);
requestTypedManifestRpcBodyResultHandler(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestRpcBodyResultHandler(
  // @ts-expect-error RPC body result handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultRpcBodyResultHandlerFor =
  createRpcBodyResultHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDefaultHandlerOptions
  );
requestTypedManifestDefaultRpcBodyResultHandlerFor(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
requestTypedManifestDefaultRpcBodyResultHandlerFor(
  // @ts-expect-error curried RPC body result handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestDefaultRpcSubpathBodyResultHandlerFor =
  createRpcSubpathBodyResultHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDefaultHandlerOptions
  );
requestTypedManifestDefaultRpcSubpathBodyResultHandlerFor(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
requestTypedManifestDefaultRpcSubpathBodyResultHandlerFor(
  // @ts-expect-error RPC subpath curried body result handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestCloudflareFetchOptions: CloudflareFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestCloudflareFetchOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestCloudflareFetchOptions
> = requestTypedProcedureRequest;
requestTypedManifestCloudflareFetchOptionsRequest.requestId.toUpperCase();
const requestTypedManifestCloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestCloudflareWorkerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestCloudflareWorkerOptions
> = requestTypedProcedureRequest;
requestTypedManifestCloudflareWorkerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathCloudflareFetchOptions: RuntimeSubpathCloudflareFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestCloudflareFetchOptions;
requestTypedManifestRuntimeSubpathCloudflareFetchOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestVercelFetchOptions: VercelFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestVercelFetchOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestVercelFetchOptions
> = requestTypedProcedureRequest;
requestTypedManifestVercelFetchOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathVercelFetchOptions: RuntimeSubpathVercelFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestVercelFetchOptions;
requestTypedManifestRuntimeSubpathVercelFetchOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestNetlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestNetlifyFetchOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestNetlifyFetchOptions
> = requestTypedProcedureRequest;
requestTypedManifestNetlifyFetchOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathNetlifyFetchOptions: RuntimeSubpathNetlifyFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestNetlifyFetchOptions;
requestTypedManifestRuntimeSubpathNetlifyFetchOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestNextHandlerOptions: NextHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestNextHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestNextHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestNextHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathNextHandlerOptions: RuntimeSubpathNextHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestNextHandlerOptions;
requestTypedManifestRuntimeSubpathNextHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestHonoHandlerOptions: HonoHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestHonoHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestHonoHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestHonoHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathHonoHandlerOptions: RuntimeSubpathHonoHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestHonoHandlerOptions;
requestTypedManifestRuntimeSubpathHonoHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestElysiaHandlerOptions: ElysiaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestElysiaHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestElysiaHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestElysiaHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathElysiaHandlerOptions: RuntimeSubpathElysiaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestElysiaHandlerOptions;
requestTypedManifestRuntimeSubpathElysiaHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestCloudflareFetch = createCloudflareFetch(
  requestTypedManifest,
  requestTypedManifestCloudflareFetchOptions
);
requestTypedManifestCloudflareFetch(requestTypedProcedureRequest);
requestTypedManifestCloudflareFetch(
  // @ts-expect-error Cloudflare fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestCloudflareWorker = createCloudflareWorker(
  requestTypedManifest,
  requestTypedManifestCloudflareWorkerOptions
);
requestTypedManifestCloudflareWorker.fetch(requestTypedProcedureRequest);
requestTypedManifestCloudflareWorker.fetch(
  // @ts-expect-error Cloudflare workers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestVercelFetch = createVercelFetch(
  requestTypedManifest,
  requestTypedManifestVercelFetchOptions
);
requestTypedManifestVercelFetch(requestTypedProcedureRequest);
requestTypedManifestVercelFetch(
  // @ts-expect-error Vercel fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestVercelFunction = createVercelFunction(
  requestTypedManifest,
  requestTypedManifestVercelFetchOptions
);
requestTypedManifestVercelFunction.fetch(requestTypedProcedureRequest);
requestTypedManifestVercelFunction.fetch(
  // @ts-expect-error Vercel functions default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestNetlifyFetch = createNetlifyFetch(
  requestTypedManifest,
  requestTypedManifestNetlifyFetchOptions
);
requestTypedManifestNetlifyFetch(requestTypedProcedureRequest);
requestTypedManifestNetlifyFetch(
  // @ts-expect-error Netlify fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestNetlifyEdgeFunction = createNetlifyEdgeFunction(
  requestTypedManifest,
  requestTypedManifestNetlifyFetchOptions
);
requestTypedManifestNetlifyEdgeFunction(
  requestTypedProcedureRequest,
  undefined
);
requestTypedManifestNetlifyEdgeFunction(
  // @ts-expect-error Netlify edge functions default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  undefined
);
const requestTypedManifestNextRouteHandlers = createNextRouteHandlers(
  requestTypedManifest,
  requestTypedManifestNextHandlerOptions
);
requestTypedManifestNextRouteHandlers.GET(requestTypedProcedureRequest);
requestTypedManifestNextRouteHandlers.GET(
  // @ts-expect-error Next route handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestNextHandler = createNextHandler(
  requestTypedManifest,
  requestTypedManifestNextHandlerOptions
);
requestTypedManifestNextHandler.POST(requestTypedProcedureRequest);
requestTypedManifestNextHandler.POST(
  // @ts-expect-error Next handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestHonoHandler = createHonoHandler(
  requestTypedManifest,
  requestTypedManifestHonoHandlerOptions
);
requestTypedManifestHonoHandler({
  req: { raw: requestTypedProcedureRequest },
});
requestTypedManifestHonoHandler({
  req: {
    // @ts-expect-error Hono handlers default to the manifest required request subtype.
    raw: new Request('https://example.com/rpc'),
  },
});
const requestTypedManifestElysiaHandler = createElysiaHandler(
  requestTypedManifest,
  requestTypedManifestElysiaHandlerOptions
);
requestTypedManifestElysiaHandler({
  request: requestTypedProcedureRequest,
});
requestTypedManifestElysiaHandler({
  // @ts-expect-error Elysia handlers default to the manifest required request subtype.
  request: new Request('https://example.com/rpc'),
});
const requestTypedManifestDefaultCloudflareFetchFor =
  createCloudflareFetchFor()(
    requestTypedManifest,
    requestTypedManifestCloudflareFetchOptions
  );
requestTypedManifestDefaultCloudflareFetchFor(requestTypedProcedureRequest);
requestTypedManifestDefaultCloudflareFetchFor(
  // @ts-expect-error curried Cloudflare fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultCloudflareWorkerFor =
  createCloudflareWorkerFor()(
    requestTypedManifest,
    requestTypedManifestCloudflareWorkerOptions
  );
requestTypedManifestDefaultCloudflareWorkerFor.fetch(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultCloudflareWorkerFor.fetch(
  // @ts-expect-error curried Cloudflare workers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultVercelFetchFor = createVercelFetchFor()(
  requestTypedManifest,
  requestTypedManifestVercelFetchOptions
);
requestTypedManifestDefaultVercelFetchFor(requestTypedProcedureRequest);
requestTypedManifestDefaultVercelFetchFor(
  // @ts-expect-error curried Vercel fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultVercelFunctionFor =
  createVercelFunctionFor()(
    requestTypedManifest,
    requestTypedManifestVercelFetchOptions
  );
requestTypedManifestDefaultVercelFunctionFor.fetch(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultVercelFunctionFor.fetch(
  // @ts-expect-error curried Vercel functions default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultNetlifyFetchFor = createNetlifyFetchFor()(
  requestTypedManifest,
  requestTypedManifestNetlifyFetchOptions
);
requestTypedManifestDefaultNetlifyFetchFor(requestTypedProcedureRequest);
requestTypedManifestDefaultNetlifyFetchFor(
  // @ts-expect-error curried Netlify fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultNetlifyEdgeFunctionFor =
  createNetlifyEdgeFunctionFor()(
    requestTypedManifest,
    requestTypedManifestNetlifyFetchOptions
  );
requestTypedManifestDefaultNetlifyEdgeFunctionFor(
  requestTypedProcedureRequest,
  undefined
);
requestTypedManifestDefaultNetlifyEdgeFunctionFor(
  // @ts-expect-error curried Netlify edge functions default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  undefined
);
const requestTypedManifestDefaultNextRouteHandlersFor =
  createNextRouteHandlersFor()(
    requestTypedManifest,
    requestTypedManifestNextHandlerOptions
  );
requestTypedManifestDefaultNextRouteHandlersFor.GET(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultNextRouteHandlersFor.GET(
  // @ts-expect-error curried Next route handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultNextHandlerFor = createNextHandlerFor()(
  requestTypedManifest,
  requestTypedManifestNextHandlerOptions
);
requestTypedManifestDefaultNextHandlerFor.POST(requestTypedProcedureRequest);
requestTypedManifestDefaultNextHandlerFor.POST(
  // @ts-expect-error curried Next handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultHonoHandlerFor = createHonoHandlerFor()(
  requestTypedManifest,
  requestTypedManifestHonoHandlerOptions
);
requestTypedManifestDefaultHonoHandlerFor({
  req: { raw: requestTypedProcedureRequest },
});
requestTypedManifestDefaultHonoHandlerFor({
  req: {
    // @ts-expect-error curried Hono handlers default to the manifest required request subtype.
    raw: new Request('https://example.com/rpc'),
  },
});
const requestTypedManifestDefaultElysiaHandlerFor = createElysiaHandlerFor()(
  requestTypedManifest,
  requestTypedManifestElysiaHandlerOptions
);
requestTypedManifestDefaultElysiaHandlerFor({
  request: requestTypedProcedureRequest,
});
requestTypedManifestDefaultElysiaHandlerFor({
  // @ts-expect-error curried Elysia handlers default to the manifest required request subtype.
  request: new Request('https://example.com/rpc'),
});
// @ts-expect-error Cloudflare option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestCloudflareFetchOptions: CloudflareFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
// @ts-expect-error Hono option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestHonoHandlerOptions: HonoHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestExpressHandlerOptions: ExpressHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  hostname: '127.0.0.1',
};
const requestTypedManifestExpressHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestExpressHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestExpressHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathExpressHandlerOptions: RuntimeSubpathExpressHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestExpressHandlerOptions;
requestTypedManifestRuntimeSubpathExpressHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestExpressHandlerOptionsArgs: ExpressHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestExpressHandlerOptions];
requestTypedManifestExpressHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestFastifyHandlerOptions: FastifyHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  hostname: 'app',
};
const requestTypedManifestFastifyHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestFastifyHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestFastifyHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathFastifyHandlerOptions: RuntimeSubpathFastifyHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestFastifyHandlerOptions;
requestTypedManifestRuntimeSubpathFastifyHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestFastifyHandlerOptionsArgs: FastifyHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestFastifyHandlerOptions];
requestTypedManifestFastifyHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestKoaHandlerOptions: KoaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  hostname: 'app',
};
const requestTypedManifestKoaHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestKoaHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestKoaHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathKoaHandlerOptions: RuntimeSubpathKoaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestKoaHandlerOptions;
requestTypedManifestRuntimeSubpathKoaHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestKoaHandlerOptionsArgs: KoaHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestKoaHandlerOptions];
requestTypedManifestKoaHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
// @ts-expect-error Express option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestExpressHandlerOptions: ExpressHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
// @ts-expect-error Fastify option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestFastifyHandlerOptions: FastifyHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
// @ts-expect-error Koa option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestKoaHandlerOptions: KoaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestBunFetchOptions: BunFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestBunFetchOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestBunFetchOptions
> = requestTypedProcedureRequest;
requestTypedManifestBunFetchOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathBunFetchOptions: RuntimeSubpathBunFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestBunFetchOptions;
requestTypedManifestRuntimeSubpathBunFetchOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestBunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestBunRpcRequestHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestBunRpcRequestHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestBunRpcRequestHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathBunRpcRequestHandlerOptions: RuntimeSubpathBunRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestBunRpcRequestHandlerOptions;
requestTypedManifestRuntimeSubpathBunRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestBunServeOptions: BunServeOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  port: 3000,
};
const requestTypedManifestBunServeOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestBunServeOptions
> = requestTypedProcedureRequest;
requestTypedManifestBunServeOptionsRequest.requestId.toUpperCase();
const requestTypedManifestBunFetch = createBunFetch(
  requestTypedManifest,
  requestTypedManifestBunFetchOptions
);
requestTypedManifestBunFetch(requestTypedProcedureRequest);
requestTypedManifestBunFetch(
  // @ts-expect-error Bun fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultBunFetchFor = createBunFetchFor()(
  requestTypedManifest,
  requestTypedManifestBunFetchOptions
);
requestTypedManifestDefaultBunFetchFor(requestTypedProcedureRequest);
requestTypedManifestDefaultBunFetchFor(
  // @ts-expect-error curried Bun fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestBunRpcRequestHandler = createBunRpcRequestHandler(
  requestTypedManifest,
  requestTypedManifestBunRpcRequestHandlerOptions
);
requestTypedManifestBunRpcRequestHandler(requestTypedProcedureRequest);
requestTypedManifestBunRpcRequestHandler(
  // @ts-expect-error Bun RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultBunRpcRequestHandlerFor =
  createBunRpcRequestHandlerFor()(
    requestTypedManifest,
    requestTypedManifestBunRpcRequestHandlerOptions
  );
requestTypedManifestDefaultBunRpcRequestHandlerFor(requestTypedProcedureRequest);
requestTypedManifestDefaultBunRpcRequestHandlerFor(
  // @ts-expect-error curried Bun RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDenoFetchOptions: DenoFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestDenoFetchOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestDenoFetchOptions
> = requestTypedProcedureRequest;
requestTypedManifestDenoFetchOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathDenoFetchOptions: RuntimeSubpathDenoFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestDenoFetchOptions;
requestTypedManifestRuntimeSubpathDenoFetchOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestDenoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestDenoRpcRequestHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestDenoRpcRequestHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestDenoRpcRequestHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathDenoRpcRequestHandlerOptions: RuntimeSubpathDenoRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestDenoRpcRequestHandlerOptions;
requestTypedManifestRuntimeSubpathDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestDenoServeOptions: DenoServeOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  port: 3000,
};
const requestTypedManifestDenoServeOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestDenoServeOptions
> = requestTypedProcedureRequest;
requestTypedManifestDenoServeOptionsRequest.requestId.toUpperCase();
const requestTypedManifestDenoFetch = createDenoFetch(
  requestTypedManifest,
  requestTypedManifestDenoFetchOptions
);
requestTypedManifestDenoFetch(requestTypedProcedureRequest);
requestTypedManifestDenoFetch(
  // @ts-expect-error Deno fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultDenoFetchFor = createDenoFetchFor()(
  requestTypedManifest,
  requestTypedManifestDenoFetchOptions
);
requestTypedManifestDefaultDenoFetchFor(requestTypedProcedureRequest);
requestTypedManifestDefaultDenoFetchFor(
  // @ts-expect-error curried Deno fetch defaults to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDenoRpcRequestHandler = createDenoRpcRequestHandler(
  requestTypedManifest,
  requestTypedManifestDenoRpcRequestHandlerOptions
);
requestTypedManifestDenoRpcRequestHandler(requestTypedProcedureRequest);
requestTypedManifestDenoRpcRequestHandler(
  // @ts-expect-error Deno RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultDenoRpcRequestHandlerFor =
  createDenoRpcRequestHandlerFor()(
    requestTypedManifest,
    requestTypedManifestDenoRpcRequestHandlerOptions
  );
requestTypedManifestDefaultDenoRpcRequestHandlerFor(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultDenoRpcRequestHandlerFor(
  // @ts-expect-error curried Deno RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
// @ts-expect-error Bun option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestBunFetchOptions: BunFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
// @ts-expect-error Deno option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestDenoFetchOptions: DenoFetchOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestNodeRpcRequestHandlerOptions: NodeRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestNodeRpcRequestHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestNodeRpcRequestHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestNodeRpcRequestHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathNodeRpcRequestHandlerOptions: RuntimeSubpathNodeRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestNodeRpcRequestHandlerOptions;
requestTypedManifestRuntimeSubpathNodeRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestNodeListenOptions: NodeListenOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  port: 3000,
};
const requestTypedManifestNodeListenOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestNodeListenOptions
> = requestTypedProcedureRequest;
requestTypedManifestNodeListenOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathNodeListenOptions: RuntimeSubpathNodeListenOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestNodeListenOptions;
requestTypedManifestRuntimeSubpathNodeListenOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestNodeRpcRequestHandlerOptionsArgs: NodeRpcRequestHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestNodeRpcRequestHandlerOptions, '127.0.0.1'];
requestTypedManifestNodeRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
// @ts-expect-error Node option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestNodeRpcRequestHandlerOptions: NodeRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestAwsLambdaHandlerOptions: AwsLambdaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestAwsLambdaHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestAwsLambdaHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestAwsLambdaHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathAwsLambdaHandlerOptions: RuntimeSubpathAwsLambdaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestAwsLambdaHandlerOptions;
requestTypedManifestRuntimeSubpathAwsLambdaHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestAwsLambdaHttpApiHandlerOptions: AwsLambdaHttpApiHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestAwsLambdaHandlerOptions;
const requestTypedManifestAwsLambdaHttpApiHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestAwsLambdaHttpApiHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestAwsLambdaHttpApiHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathAwsLambdaHttpApiHandlerOptions: RuntimeSubpathAwsLambdaHttpApiHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestAwsLambdaHttpApiHandlerOptions;
requestTypedManifestRuntimeSubpathAwsLambdaHttpApiHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestAwsLambdaRestApiHandlerOptions: AwsLambdaRestApiHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestAwsLambdaHandlerOptions;
const requestTypedManifestAwsLambdaRestApiHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestAwsLambdaRestApiHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestAwsLambdaRestApiHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathAwsLambdaRestApiHandlerOptions: RuntimeSubpathAwsLambdaRestApiHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestAwsLambdaRestApiHandlerOptions;
requestTypedManifestRuntimeSubpathAwsLambdaRestApiHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestAwsLambdaHandlerOptionsArgs: AwsLambdaHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestAwsLambdaHandlerOptions];
requestTypedManifestAwsLambdaHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestAwsLambdaRestApiHandlerOptionsArgs: AwsLambdaRestApiHandlerOptionsArgs<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = [requestTypedManifestAwsLambdaRestApiHandlerOptions];
requestTypedManifestAwsLambdaRestApiHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
// @ts-expect-error AWS Lambda option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestAwsLambdaHandlerOptions: AwsLambdaHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
// @ts-expect-error AWS REST API option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestAwsLambdaRestApiHandlerOptions: AwsLambdaRestApiHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestStandaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestJoorHandlerOptions;
const requestTypedManifestStandaloneDenoRpcRequestHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestStandaloneDenoRpcRequestHandlerOptions
> = requestTypedProcedureRequest;
requestTypedManifestStandaloneDenoRpcRequestHandlerOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathStandaloneDenoRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestStandaloneDenoRpcRequestHandlerOptions;
requestTypedManifestRuntimeSubpathStandaloneDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  port: 3000,
};
const requestTypedManifestStandaloneDenoServeOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedManifestStandaloneDenoServeOptions
> = requestTypedProcedureRequest;
requestTypedManifestStandaloneDenoServeOptionsRequest.requestId.toUpperCase();
const requestTypedManifestRuntimeSubpathStandaloneDenoServeOptions: RuntimeSubpathStandaloneDenoServeOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin]
> = requestTypedManifestStandaloneDenoServeOptions;
requestTypedManifestRuntimeSubpathStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  requestTypedProcedureRequest,
  { services: { users: { findById: (id) => ({ id, name: 'Ada' }) } } }
);
const requestTypedManifestStandaloneDenoRpcRequestHandler = createRootStandaloneDenoRpcRequestHandler(
  requestTypedManifest,
  requestTypedManifestStandaloneDenoRpcRequestHandlerOptions
);
requestTypedManifestStandaloneDenoRpcRequestHandler(
  requestTypedProcedureRequest
);
requestTypedManifestStandaloneDenoRpcRequestHandler(
  // @ts-expect-error Standalone Deno RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
const requestTypedManifestDefaultStandaloneDenoRpcRequestHandlerFor =
  createRootStandaloneDenoRpcRequestHandlerFor()(
    requestTypedManifest,
    requestTypedManifestStandaloneDenoRpcRequestHandlerOptions
  );
requestTypedManifestDefaultStandaloneDenoRpcRequestHandlerFor(
  requestTypedProcedureRequest
);
requestTypedManifestDefaultStandaloneDenoRpcRequestHandlerFor(
  // @ts-expect-error curried standalone Deno RPC handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc')
);
// @ts-expect-error Standalone Deno option aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestStandaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof requestTypedManifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof requestTypedManifest>,
  Request
> = {
  plugins: [usersPlugin] as const,
};
const requestTypedManifestCompiledBodyHandler: CompiledRpcBodyResultHandlerFor<
  typeof requestTypedManifest
> = (request, body) => {
  request.requestId.toUpperCase();
  return new Response() as unknown as CompiledTransportBodyResultFor<
    typeof requestTypedManifest,
    typeof body
  >;
};
requestTypedManifestCompiledBodyHandler(requestTypedProcedureRequest, {
  id: 'request.get',
  input: { id: '1' },
});
requestTypedManifestCompiledBodyHandler(
  // @ts-expect-error compiled body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestCompiledRouteUnaryBodyHandler: CompiledRpcRouteUnaryBodyResultHandlerFor<
  typeof requestTypedManifest
> = (request, body) => {
  request.requestId.toUpperCase();
  return new Response() as unknown as CompiledRouteUnaryBodyResultFor<
    typeof requestTypedManifest,
    typeof body
  >;
};
requestTypedManifestCompiledRouteUnaryBodyHandler(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
requestTypedManifestCompiledRouteUnaryBodyHandler(
  // @ts-expect-error compiled unary body handlers default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const requestTypedManifestCompiledUnaryRouteBodyHandler: CompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof requestTypedManifest
> = requestTypedManifestCompiledRouteUnaryBodyHandler;
requestTypedManifestCompiledUnaryRouteBodyHandler(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
requestTypedManifestCompiledUnaryRouteBodyHandler(
  // @ts-expect-error compiled unary-route body aliases default to the manifest required request subtype.
  new Request('https://example.com/rpc'),
  { id: 'request.get', input: { id: '1' } }
);
const rootRequestTypedManifestCompiledBodyHandler: RootCompiledRpcBodyResultHandlerFor<
  typeof requestTypedManifest
> = requestTypedManifestCompiledBodyHandler;
rootRequestTypedManifestCompiledBodyHandler(
  requestTypedProcedureRequest,
  { id: 'request.get', input: { id: '1' } }
);
// @ts-expect-error compiled body handler aliases reject explicit request types that are too broad.
const _wrongRequestTypedManifestCompiledBodyHandler: CompiledRpcBodyResultHandlerFor<
  typeof requestTypedManifest,
  Request
> = requestTypedManifestCompiledBodyHandler;
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
const requestTypedContext = {
  __requestType: (request: ProcedureAppRequest) => request,
  request: requestTypedProcedureRequest,
  traceId: 'trace_1',
  signal: requestTypedProcedureRequest.signal,
  headers: {},
  rawHeaders: requestTypedProcedureRequest.headers,
  services: {},
  auth: {},
  ok<TData extends JsonValue>(data: TData) {
    return { kind: 'success' as const, data };
  },
  error<TCode extends string>(code: TCode, details: JsonValue) {
    return {
      kind: 'error' as const,
      error: { code, details, status: 400, message: code },
    };
  },
} satisfies JoorContext<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, JsonValue>,
  ProcedureAppRequest
>;
const annotatedRequestTypedContext: JoorContext<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, JsonValue>,
  ProcedureAppRequest
> = requestTypedContext;
// @ts-expect-error request-typed contexts are not assignable to plain request contexts.
const _wrongRequestTypedContext: JoorContext<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, JsonValue>,
  Request
> = annotatedRequestTypedContext;

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
// @ts-expect-error auth policy names are readonly.
authPolicy.name = 'other-session';
const requestTypedAuthPolicy = createAuthPolicy<
  Services,
  Record<string, never>,
  { userId: string },
  ProcedureAppRequest
>({
  name: 'request-session',
  authenticate(ctx) {
    ctx.request.requestId.toUpperCase();
    ctx.services.users.findById('1');
    return { userId: ctx.request.requestId };
  },
});
const requestTypedAuthPolicyRequest: AuthPolicyRequest<
  typeof requestTypedAuthPolicy
> = requestTypedProcedureRequest;
requestTypedAuthPolicyRequest.requestId.toUpperCase();
// @ts-expect-error request-typed auth policies are not assignable to plain request policies.
const _wrongRequestTypedAuthPolicy: AuthPolicy<
  Services,
  Record<string, never>,
  { userId: string },
  Request
> = requestTypedAuthPolicy;
type RequestTypedAuthPolicyServices = AuthPolicyServices<
  typeof requestTypedAuthPolicy
>;
const requestTypedAuthPolicyServices: RequestTypedAuthPolicyServices = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
  },
};
requestTypedAuthPolicyServices.users.findById('1').name.toUpperCase();
const requestTypedAuthPolicyHeaders: AuthPolicyHeaders<
  typeof requestTypedAuthPolicy
> = {};
requestTypedAuthPolicyHeaders.valueOf();
const requestTypedAuthPolicyAuth: AuthPolicyAuth<
  typeof requestTypedAuthPolicy
> = { userId: '1' };
requestTypedAuthPolicyAuth.userId.toUpperCase();
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
// @ts-expect-error auth policy header values are readonly.
authPolicyHeaderValues.authorization = 'Bearer other';
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
const requestTypedAuthSubpathPolicy =
  createAuthPolicySubpath.withContext<Services, ProcedureAppRequest>()<
    { authorization: string },
    { userId: string }
  >({
    name: 'subpath-request-session',
    authenticate(ctx) {
      ctx.request.requestId.toUpperCase();
      ctx.headers.authorization.toUpperCase();
      return { userId: ctx.request.requestId };
    },
  });
const authSubpathRequest: AuthSubpathPolicyRequest<
  typeof requestTypedAuthSubpathPolicy
> = requestTypedProcedureRequest;
authSubpathRequest.requestId.toUpperCase();
const authSubpathRequestServices: AuthSubpathPolicyServices<
  typeof requestTypedAuthSubpathPolicy
> = authPolicyServicesFromRoot;
authSubpathRequestServices.users.findById('1').name.toUpperCase();
const authSubpathRequestHeaders: AuthSubpathPolicyHeaders<
  typeof requestTypedAuthSubpathPolicy
> = { authorization: 'Bearer token' };
authSubpathRequestHeaders.authorization.toUpperCase();
const authSubpathRequestAuth: AuthSubpathPolicyAuth<
  typeof requestTypedAuthSubpathPolicy
> = { userId: '1' };
authSubpathRequestAuth.userId.toUpperCase();

defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  // @ts-expect-error procedures must declare a request type compatible with request-typed auth policies.
  auth: requestTypedAuthPolicy,
  handler(_ctx: unknown, input: { id: string }) {
    return { id: input.id };
  },
});
const requestTypedRichProcedure = defineProcedure.withContext<
  Services,
  ProcedureAppRequest
>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.string(),
  }),
  output: t.object({ id: t.string(), userId: t.string() }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  auth: requestTypedAuthSubpathPolicy,
  handler(ctx, input) {
    ctx.request.requestId.toUpperCase();
    ctx.auth.userId.toUpperCase();
    ctx.headers.authorization.toUpperCase();
    ctx.services.users.findById(input.id).name.toUpperCase();
    return ctx.ok(
      { id: input.id, userId: ctx.auth.userId },
      { 'cache-control': 'private' }
    );
  },
});
const requestTypedRichProcedureInput: ProcedureInput<
  typeof requestTypedRichProcedure
> = { id: '1' };
requestTypedRichProcedureInput.id.toUpperCase();
const requestTypedRichProcedureOutput: ProcedureOutput<
  typeof requestTypedRichProcedure
> = { id: '1', userId: 'req_1' };
requestTypedRichProcedureOutput.userId.toUpperCase();
const requestTypedRichProcedureHeaders: ProcedureHeaders<
  typeof requestTypedRichProcedure
> = { authorization: 'Bearer token' };
requestTypedRichProcedureHeaders.authorization.toUpperCase();
const requestTypedRichProcedureResponseHeaders: ProcedureResponseHeaders<
  typeof requestTypedRichProcedure
> = { 'cache-control': 'private' };
requestTypedRichProcedureResponseHeaders['cache-control'].toUpperCase();
const requestTypedRichProcedureAuth: ProcedureAuth<
  typeof requestTypedRichProcedure
> = { userId: 'req_1' };
requestTypedRichProcedureAuth.userId.toUpperCase();
const requestTypedRichProcedureErrorDetails: ProcedureErrorDetails<
  typeof requestTypedRichProcedure,
  'NOT_FOUND'
> = { message: 'Missing user' };
requestTypedRichProcedureErrorDetails.message.toUpperCase();
const requestTypedRichProcedureErrorCode: ProcedureErrorCode<
  typeof requestTypedRichProcedure
> = 'NOT_FOUND';
requestTypedRichProcedureErrorCode.toUpperCase();
const requestTypedRichProcedureServices: ProcedureServices<
  typeof requestTypedRichProcedure
> = authPolicyServicesFromRoot;
requestTypedRichProcedureServices.users.findById('1').name.toUpperCase();
const requestTypedRichProcedureRequest: ProcedureRequest<
  typeof requestTypedRichProcedure
> = requestTypedProcedureRequest;
requestTypedRichProcedureRequest.requestId.toUpperCase();
const requestTypedRichProcedureHasHeaders: ProcedureHasHeaders<
  typeof requestTypedRichProcedure
> = true;
requestTypedRichProcedureHasHeaders.valueOf();
const requestTypedRichProcedureRequiresHeaders: ProcedureRequiresHeaders<
  typeof requestTypedRichProcedure
> = true;
requestTypedRichProcedureRequiresHeaders.valueOf();
const requestTypedRichProcedureHasResponseHeaders: ProcedureHasResponseHeaders<
  typeof requestTypedRichProcedure
> = true;
requestTypedRichProcedureHasResponseHeaders.valueOf();
const requestTypedRichProcedureRequiresResponseHeaders: ProcedureRequiresResponseHeaders<
  typeof requestTypedRichProcedure
> = true;
requestTypedRichProcedureRequiresResponseHeaders.valueOf();

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
const asyncStreamFactoryProcedure = defineProcedure({
  input: t.object({ userId: t.string() }),
  stream: t.object({
    type: t.literal('user.updated'),
    userId: t.string(),
  }),
  async handler(_ctx, input) {
    return (async function* () {
      yield { type: 'user.updated' as const, userId: input.userId };
    })();
  },
});
asyncStreamFactoryProcedure.stream;
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
const compiledRouteRequest: RpcRequest<'users.get', { id: string }> = {
  id: 'users.get',
  input: { id: '1' },
  traceId: 'trace-1',
};
const compiledNotFoundResult = compiledNotFound(
  compiledRouteRequest,
  {} as Parameters<typeof compiledNotFound>[1]
);
const compiledNotFoundId: 'users.get' = compiledNotFoundResult.id;
compiledNotFoundId.toUpperCase();
// @ts-expect-error compiled framework failures preserve the route id literal.
const _wrongCompiledNotFoundId: 'users.list' = compiledNotFoundResult.id;
const compiledRateLimitResult = compiledRateLimitFailureStatic(
  'users.get',
  1,
  '1m',
  60_000,
  compiledRouteRequest,
  {} as Parameters<typeof compiledRateLimitFailureStatic>[5],
  'trace-1',
  {} as Parameters<typeof compiledRateLimitFailureStatic>[7]
);
const compiledRateLimitId: 'users.get' = (
  {} as NonNullable<typeof compiledRateLimitResult>
).id;
compiledRateLimitId.toUpperCase();
// @ts-expect-error compiled static rate-limit failures preserve the route id literal.
const _wrongCompiledRateLimitId: 'users.list' = (
  {} as NonNullable<typeof compiledRateLimitResult>
).id;
type CompiledExecuteProcedureResult = Awaited<
  ReturnType<typeof executeCompiledProcedure<typeof procedure, 'users.get'>>
>;
const compiledExecuteProcedureEnvelope = {} as Exclude<
  CompiledExecuteProcedureResult,
  Response
>;
const compiledExecuteProcedureId: 'users.get' =
  compiledExecuteProcedureEnvelope.id;
compiledExecuteProcedureId.toUpperCase();
// @ts-expect-error compiled execution results preserve the route id literal.
const _wrongCompiledExecuteProcedureId: 'users.list' =
  compiledExecuteProcedureEnvelope.id;

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
const typedRpcBodyResult: RpcBodyResult<typeof procedureEnvelope> =
  procedureEnvelope;
if (!(typedRpcBodyResult instanceof Response)) {
  const typedRpcBodyResultId: 'users.get' = typedRpcBodyResult.id;
  typedRpcBodyResultId.toUpperCase();
  // @ts-expect-error typed RPC body results preserve the route id literal.
  const _wrongTypedRpcBodyResultId: 'users.list' = typedRpcBodyResult.id;
}
const typedTransportBodyResult: TransportBodyResult<typeof procedureEnvelope> =
  procedureEnvelope;
if (
  !(typedTransportBodyResult instanceof Response) &&
  !isSerializedJsonEnvelope(typedTransportBodyResult) &&
  !Array.isArray(typedTransportBodyResult)
) {
  const typedTransportBodyResultId: 'users.get' = typedTransportBodyResult.id;
  typedTransportBodyResultId.toUpperCase();
  // @ts-expect-error typed transport body results preserve the route id literal.
  const _wrongTypedTransportBodyResultId: 'users.list' =
    typedTransportBodyResult.id;
}
const typedCompiledBodyResult: CompiledBodyResult<typeof procedureEnvelope> =
  procedureEnvelope;
const typedRootCompiledBodyResult: RootCompiledBodyResult<
  typeof procedureEnvelope
> = typedCompiledBodyResult;
if (
  !(typedRootCompiledBodyResult instanceof Response) &&
  !isSerializedJsonEnvelope(typedRootCompiledBodyResult) &&
  !Array.isArray(typedRootCompiledBodyResult)
) {
  const typedCompiledBodyResultId: 'users.get' = typedRootCompiledBodyResult.id;
  typedCompiledBodyResultId.toUpperCase();
  // @ts-expect-error typed compiled body results preserve the route id literal.
  const _wrongTypedCompiledBodyResultId: 'users.list' =
    typedRootCompiledBodyResult.id;
}
type RuntimeBodyResultRouteId<T> =
  Exclude<
    T,
    Response | SerializedJsonEnvelope | readonly RpcEnvelope[]
  > extends { id: infer TId }
    ? TId
    : never;
const getTypedTransportEnvelopeId = <TEnvelope extends RpcEnvelope>(
  result: TransportBodyResult<TEnvelope>
): TEnvelope['id'] | undefined => {
  if (result instanceof Response) return undefined;
  if (isSerializedJsonEnvelope(result)) return undefined;
  if (isRpcEnvelopeArray(result)) return undefined;
  return result.id;
};
const typedTransportEnvelopeId = getTypedTransportEnvelopeId(
  typedTransportBodyResult
);
const exactTypedTransportEnvelopeId: 'users.get' | undefined =
  typedTransportEnvelopeId;
exactTypedTransportEnvelopeId?.toUpperCase();
// @ts-expect-error serialized-envelope narrowing preserves generic envelope route ids.
const _wrongTypedTransportEnvelopeId: 'users.list' | undefined =
  typedTransportEnvelopeId;
const typedTransportEnvelopeArray: TransportBodyResult<
  typeof procedureEnvelope
> = [procedureEnvelope];
if (isRuntimeSubpathRpcEnvelopeArray(typedTransportEnvelopeArray)) {
  const typedTransportEnvelopeArrayItem = typedTransportEnvelopeArray[0];
  if (typedTransportEnvelopeArrayItem !== undefined) {
    const typedTransportEnvelopeArrayId: 'users.get' =
      typedTransportEnvelopeArrayItem.id;
    typedTransportEnvelopeArrayId.toUpperCase();
    // @ts-expect-error transport result array narrowing preserves route id literals.
    const _wrongTypedTransportEnvelopeArrayId: 'users.list' =
      typedTransportEnvelopeArrayItem.id;
  }
}
const typedBunTransportBodyResultId: RuntimeBodyResultRouteId<
  BunTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedBunTransportBodyResultId.toUpperCase();
// @ts-expect-error Bun transport body result aliases preserve the route id literal.
const _wrongTypedBunTransportBodyResultId: RuntimeBodyResultRouteId<
  BunTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedDenoTransportBodyResultId: RuntimeBodyResultRouteId<
  DenoTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedDenoTransportBodyResultId.toUpperCase();
// @ts-expect-error Deno transport body result aliases preserve the route id literal.
const _wrongTypedDenoTransportBodyResultId: RuntimeBodyResultRouteId<
  DenoTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedStandaloneDenoTransportBodyResultId: RuntimeBodyResultRouteId<
  StandaloneDenoTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedStandaloneDenoTransportBodyResultId.toUpperCase();
// @ts-expect-error standalone Deno transport body result aliases preserve the route id literal.
const _wrongTypedStandaloneDenoTransportBodyResultId: RuntimeBodyResultRouteId<
  StandaloneDenoTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedNodeTransportBodyResultId: RuntimeBodyResultRouteId<
  NodeTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedNodeTransportBodyResultId.toUpperCase();
// @ts-expect-error Node transport body result aliases preserve the route id literal.
const _wrongTypedNodeTransportBodyResultId: RuntimeBodyResultRouteId<
  NodeTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  DenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedDenoCompiledTransportBodyResultId.toUpperCase();
// @ts-expect-error Deno compiled transport body result aliases preserve the route id literal.
const _wrongTypedDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  DenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedRootDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  RootDenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedRootDenoCompiledTransportBodyResultId.toUpperCase();
// @ts-expect-error root Deno compiled transport body result aliases preserve the route id literal.
const _wrongTypedRootDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  RootDenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const typedRuntimeSubpathDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  RuntimeSubpathDenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.get';
typedRuntimeSubpathDenoCompiledTransportBodyResultId.toUpperCase();
// @ts-expect-error runtime subpath Deno compiled transport body result aliases preserve the route id literal.
const _wrongTypedRuntimeSubpathDenoCompiledTransportBodyResultId: RuntimeBodyResultRouteId<
  RuntimeSubpathDenoCompiledTransportBodyResult<typeof procedureEnvelope>
> = 'users.list';
const rpcSseErrorEvent: RpcSseEvent<{ userId: string }, 'users.get'> = {
  event: 'error',
  data: {
    ok: false,
    id: 'users.get',
    traceId: 'trace-1',
    error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
  },
};
const rpcSseErrorId: 'users.get' = rpcSseErrorEvent.data.id;
rpcSseErrorId.toUpperCase();
// @ts-expect-error SSE event discriminants are readonly.
rpcSseErrorEvent.event = 'data';
// @ts-expect-error SSE event payload slots are readonly.
rpcSseErrorEvent.data = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-2',
  error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
};
// @ts-expect-error SSE error events preserve the route id literal.
const _wrongRpcSseErrorId: 'users.list' = rpcSseErrorEvent.data.id;
const rpcSseDoneEvent: RpcSseEvent = { event: 'done', data: {} };
rpcSseDoneEvent.data.valueOf();
// @ts-expect-error SSE done payloads are readonly.
rpcSseDoneEvent.data.extra = 'nope';
const rootEncodedSse = encodeSse('error', rpcSseErrorEvent.data);
rootEncodedSse.byteLength.toFixed();
const rootSseResponse = createSseResponse(
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(rootEncodedSse);
      controller.close();
    },
  })
);
rootSseResponse.headers.get('content-type')?.toUpperCase();
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
// @ts-expect-error procedure response header values are readonly.
procedureResponseHeaderValues['cache-control'] = 'public';
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
// @ts-expect-error procedure success discriminants are readonly.
requiredProcedureSuccess.kind = 'error';
// @ts-expect-error procedure success data is readonly.
requiredProcedureSuccess.data = { id: '2', name: 'Ada' };
// @ts-expect-error procedure success headers are readonly.
requiredProcedureSuccess.headers = { 'cache-control': 'public' };
// @ts-expect-error procedure success header values are readonly.
requiredProcedureSuccess.headers['cache-control'] = 'public';
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
// @ts-expect-error procedure RPC envelope ids are readonly.
subpathProcedureEnvelope.id = 'users.authenticated';
// @ts-expect-error procedure RPC envelope data is readonly.
subpathProcedureEnvelope.data = { id: '2', name: 'Ada' };
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
// @ts-expect-error procedure RPC envelope headers are readonly.
subpathProcedureEnvelopeWithHeaders.headers = { 'cache-control': 'public' };
const subpathProcedureFailure = procedureFailureSubpath(
  'NOT_FOUND',
  subpathProcedureErrorDetails
);
if (subpathProcedureFailure.kind === 'error') {
  subpathProcedureFailure.error.details.message.toUpperCase();
}
const rootProcedureSuccess = rootProcedureOk(
  { id: '1', name: 'Ada' },
  { 'cache-control': 'private' }
);
const rootProcedureSuccessDataName: string = rootProcedureSuccess.data.name;
rootProcedureSuccessDataName.toUpperCase();
rootProcedureSuccess.headers?.['cache-control']?.toUpperCase();
const rootProcedureFailureResult = rootProcedureFailure(
  'NOT_FOUND',
  subpathProcedureErrorDetails,
  rootErrorStatus('NOT_FOUND')
);
if (rootProcedureFailureResult.kind === 'error') {
  const rootProcedureFailureCode: 'NOT_FOUND' =
    rootProcedureFailureResult.error.code;
  rootProcedureFailureCode.toUpperCase();
  rootProcedureFailureResult.error.details.message.toUpperCase();
  // @ts-expect-error procedure failure errors are readonly.
  rootProcedureFailureResult.error = {
    code: 'NOT_FOUND',
    message: 'Missing',
    status: 404,
    details: { message: 'Missing' },
  };
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
// @ts-expect-error schema metadata is readonly.
rootSchemaMeta.description = 'Other payload';
const rootValidationIssue: ValidationIssue = {
  path: 'input.id',
  message: 'Expected string',
};
rootValidationIssue.message.toUpperCase();
// @ts-expect-error validation issues are readonly.
rootValidationIssue.message = 'Expected uuid';
const rootValidationResult: ValidationResult<string> = validate(
  rootStringSchema,
  undefined
);
if (rootValidationResult.ok) {
  rootValidationResult.value.toUpperCase();
  // @ts-expect-error validation success values are readonly.
  rootValidationResult.value = 'other';
} else {
  rootValidationResult.issues[0]?.message.toUpperCase();
  // @ts-expect-error validation result issue lists are readonly.
  rootValidationResult.issues.push(rootValidationIssue);
}
const schemaSubpathValidationResult: SchemaSubpathValidationResult<string> =
  validateSchemaSubpath(rootStringSchema, undefined);
if (!schemaSubpathValidationResult.ok) {
  schemaSubpathValidationResult.issues[0]?.path.toUpperCase();
  // @ts-expect-error validation result issue lists are readonly across subpath exports.
  schemaSubpathValidationResult.issues[0] = rootValidationIssue;
}
const rootHeaderValueSchema: HeaderValueSchema = t.string().optional();
rootHeaderValueSchema.kind.toUpperCase();
const rootProcedureHeaderSchema = t.object({
  authorization: t.string().optional(),
  'x-route-mode': t.enum(['read', 'write']),
});
const rootSchemaShape: SchemaShape = { id: t.string() };
rootSchemaShape['id']?.kind.toUpperCase();
// @ts-expect-error schema shapes expose readonly fields.
rootSchemaShape.id = t.number();
const rootHeaderSchemaShape: HeaderSchemaShape = {
  'x-mode': t.enum(['read', 'write']),
};
rootHeaderSchemaShape['x-mode']?.kind.toUpperCase();
// @ts-expect-error header schema shapes expose readonly fields.
rootHeaderSchemaShape['x-mode'] = t.string();
const rootHeaderSchema: HeaderObjectSchema = rootProcedureHeaderSchema;
const authorizationHeaderSchema = rootHeaderSchema.shape['authorization'];
authorizationHeaderSchema?.kind.toUpperCase();
const rootConfigInputSchema = t.object({ id: t.string() });
const rootConfigOutputSchema = t.object({ ok: t.boolean() });
const rootConfigStreamSchema = t.object({ ok: t.boolean() });
const rootMaybePromise: MaybePromise<string> = Promise.resolve('ok');
rootMaybePromise.valueOf();
const rootProcedureMeta: ProcedureMeta = {
  kind: 'query',
  cache: { ttl: '1m', key: ['id'] },
};
rootProcedureMeta.kind?.toUpperCase();
// @ts-expect-error procedure meta kind is readonly.
rootProcedureMeta.kind = 'mutation';
// @ts-expect-error procedure cache metadata is readonly.
rootProcedureMeta.cache.ttl = '2m';
const rootProcedureErrors = {
  NOT_FOUND: t.object({ message: t.string() }),
} satisfies ErrorSchemas;
const rootProcedureErrorSchemas: ErrorSchemas = rootProcedureErrors;
rootProcedureErrorSchemas['NOT_FOUND']?.kind.toUpperCase();
// @ts-expect-error procedure error schema maps expose readonly entries.
rootProcedureErrorSchemas.NOT_FOUND = rootUserSchema;
const rootProcedureErrorCode: ErrorCode<typeof rootProcedureErrors> =
  'NOT_FOUND';
rootProcedureErrorCode.toUpperCase();
const rootProcedureErrorDetails: ErrorDetails<typeof rootProcedureErrors> = {
  NOT_FOUND: { message: 'Missing' },
};
rootProcedureErrorDetails.NOT_FOUND.message.toUpperCase();
// @ts-expect-error procedure error detail maps are readonly.
rootProcedureErrorDetails.NOT_FOUND = { message: 'Other' };
const rootContextlessHandler: ContextlessProcedureHandler = () => ({
  ok: true,
});
const rootRuntimeValue: ProcedureRuntimeValue = rootContextlessHandler({});
const rootRuntimeValueIsPromise = rootRuntimeValue instanceof Promise;
rootRuntimeValueIsPromise.valueOf();
const rootDefineProcedure: DefineProcedure = defineProcedure;
rootDefineProcedure.withContext<Services>();
const rootContextlessProcedureConfig: ContextlessUnaryProcedureConfig<
  typeof rootConfigInputSchema,
  typeof rootConfigOutputSchema,
  typeof rootProcedureErrors
> = {
  context: false,
  input: rootConfigInputSchema,
  output: rootConfigOutputSchema,
  errors: rootProcedureErrors,
  handler(input) {
    input.id.toUpperCase();
    return { ok: true };
  },
};
rootContextlessProcedureConfig.input.kind.toUpperCase();
// @ts-expect-error contextless procedure configs expose readonly schemas.
rootContextlessProcedureConfig.input = rootConfigInputSchema;
const rootUnaryProcedureConfig: UnaryProcedureConfig<
  typeof rootConfigInputSchema,
  typeof rootConfigOutputSchema,
  typeof rootProcedureErrors,
  Services,
  typeof rootProcedureHeaderSchema,
  typeof rootProcedureHeaderSchema,
  Record<string, never>
> = {
  input: rootConfigInputSchema,
  headers: rootProcedureHeaderSchema,
  responseHeaders: rootProcedureHeaderSchema,
  output: rootConfigOutputSchema,
  errors: rootProcedureErrors,
  handler(ctx, input) {
    ctx.services.users.findById(input.id).name.toUpperCase();
    ctx.headers['x-route-mode'].toUpperCase();
    return ctx.ok({ ok: true }, { 'x-route-mode': 'read' });
  },
};
rootUnaryProcedureConfig.output.kind.toUpperCase();
// @ts-expect-error unary procedure configs expose readonly output schemas.
rootUnaryProcedureConfig.output = rootConfigOutputSchema;
const rootStreamProcedureConfig: StreamProcedureConfig<
  typeof rootConfigInputSchema,
  typeof rootConfigStreamSchema,
  typeof rootProcedureErrors,
  Services,
  typeof rootProcedureHeaderSchema,
  Record<string, never>
> = {
  input: rootConfigInputSchema,
  headers: rootProcedureHeaderSchema,
  stream: rootConfigStreamSchema,
  errors: rootProcedureErrors,
  async handler(ctx, input) {
    return (async function* () {
      yield {
        ok:
          ctx.services.users.findById(input.id).id === input.id &&
          ctx.headers['x-route-mode'] === 'read',
      };
    })();
  },
};
rootStreamProcedureConfig.stream.kind.toUpperCase();
// @ts-expect-error stream procedure configs expose readonly stream schemas.
rootStreamProcedureConfig.stream = rootConfigStreamSchema;
const rootProcedureTypes: ProcedureTypes<
  { id: string },
  { ok: boolean },
  never,
  'NOT_FOUND',
  { 'x-route-mode': 'read' | 'write' },
  Record<string, never>,
  Record<string, never>,
  Services,
  { NOT_FOUND: { message: string } }
> = {
  input: { id: '1' },
  output: { ok: true },
  stream: undefined as never,
  errors: 'NOT_FOUND',
  headers: { 'x-route-mode': 'read' },
  responseHeaders: {},
  auth: {},
  services: rootPluginServices,
  errorDetails: { NOT_FOUND: { message: 'Missing' } },
};
rootProcedureTypes.services.users.findById(rootProcedureTypes.input.id);
// @ts-expect-error procedure type carriers are readonly.
rootProcedureTypes.input = { id: '2' };
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
// @ts-expect-error procedure runtime schemas are readonly.
rootProcedureRuntimeWithHeaders.input = rootUserSchema;
// @ts-expect-error procedure runtime error schemas are readonly.
rootProcedureRuntimeWithHeaders.errors.NOT_FOUND = rootUserSchema;
// @ts-expect-error procedure runtime handlers are readonly.
rootProcedureRuntimeWithHeaders.handler = () => ({});
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
  // @ts-expect-error JSON object entries are readonly.
  rootJsonObject['email'] = 'other@example.com';
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
// @ts-expect-error generated OpenAPI schemas expose readonly top-level entries.
rootOpenApiSchema['type'] = 'object';

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
  // @ts-expect-error JSON object entries are readonly across subpath exports.
  schemaSubpathObject['id'] = '2';
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
// @ts-expect-error generated OpenAPI schemas expose readonly entries across subpath exports.
schemaSubpathJsonSchema['type'] = 'object';
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
const contextSubpathRequestTypedPolicy =
  createContextSubpathAuthPolicy.withContext<
    ContextSubpathConfigServices,
    ProcedureAppRequest
  >()<{ authorization: string }, { userId: string }>({
    name: 'request-session',
    authenticate(ctx) {
      ctx.request.requestId.toUpperCase();
      ctx.services.audit.record(ctx.headers.authorization);
      return { userId: ctx.request.requestId };
    },
  });
contextSubpathTypedPolicy.name.toUpperCase();
const contextSubpathAuthPolicyRequest: ContextSubpathAuthPolicyRequest<
  typeof contextSubpathTypedPolicy
> = new Request('https://example.com/rpc');
contextSubpathAuthPolicyRequest.url.toUpperCase();
const contextSubpathRequestTypedPolicyRequest: ContextSubpathAuthPolicyRequest<
  typeof contextSubpathRequestTypedPolicy
> = requestTypedProcedureRequest;
contextSubpathRequestTypedPolicyRequest.requestId.toUpperCase();
const contextSubpathRequestTypedPolicyServices: ContextSubpathAuthPolicyServices<
  typeof contextSubpathRequestTypedPolicy
> = contextSubpathServices;
contextSubpathRequestTypedPolicyServices.audit.record('auth');
const contextSubpathRequestTypedPolicyHeaders: ContextSubpathAuthPolicyHeaders<
  typeof contextSubpathRequestTypedPolicy
> = { authorization: 'Bearer token' };
contextSubpathRequestTypedPolicyHeaders.authorization.toUpperCase();
const contextSubpathRequestTypedPolicyAuth: ContextSubpathAuthPolicyAuth<
  typeof contextSubpathRequestTypedPolicy
> = { userId: '1' };
contextSubpathRequestTypedPolicyAuth.userId.toUpperCase();
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
// @ts-expect-error legacy client call commands are readonly.
client.call = async () => procedureEnvelope;
const clientRequestInit: ClientRequestInit = {
  cache: 'no-store',
  credentials: 'include',
};
const _wrongClientRequestInit: ClientRequestInit = {
  cache: 'reload',
  // @ts-expect-error client request init cannot override the RPC HTTP method.
  method: 'GET',
};
_wrongClientRequestInit.cache?.toUpperCase();
const clientBatchOptions: ClientBatchOptions = {
  headers: { 'x-batch': '1' },
  request: clientRequestInit,
};
// @ts-expect-error client batch headers are readonly.
clientBatchOptions.headers = { 'x-batch': '2' };
const clientRequestOptions: ClientRequestOptions<typeof procedure> = {
  headers: { 'x-tenant-id': 'tenant-1' },
  request: clientRequestInit,
};
clientRequestOptions.headers['x-tenant-id'].toUpperCase();
// @ts-expect-error client request option headers are readonly.
clientRequestOptions.headers = { 'x-tenant-id': 'tenant-2' };
// @ts-expect-error typed client request header fields are readonly.
clientRequestOptions.headers['x-tenant-id'] = 'tenant-2';
client.call<typeof procedure>('users.get', { id: '1' }, clientRequestOptions);
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
const routeMap: RpcRouteMap = {
  'users.get': procedure,
  'users.authenticated': authenticatedProcedure,
  'users.watch': streamProcedure,
};
routeMap['users.get']?.input.kind.toUpperCase();
// @ts-expect-error RPC route maps expose readonly route entries.
routeMap['users.get'] = procedure;
const joorRouteMap: JoorRouteMap = routeMap;
joorRouteMap['users.watch']?.stream?.kind.toUpperCase();
// @ts-expect-error Joor route maps expose readonly route entries.
joorRouteMap['users.watch'] = streamProcedure;
const routeUnaryProcedure: RpcUnaryRouteProcedure<Routes, 'users.get'> =
  procedure;
const defaultRouteUnaryProcedure: RpcUnaryRouteProcedure<Routes> =
  routeUnaryProcedure;
routeUnaryProcedure.output;
defaultRouteUnaryProcedure.input;
const rpcSubpathRouteUnaryProcedure: RpcSubpathUnaryRouteProcedure<
  Routes,
  'users.get'
> = routeUnaryProcedure;
rpcSubpathRouteUnaryProcedure.output;
const routeStreamProcedure: RpcStreamRouteProcedure<Routes, 'users.watch'> =
  streamProcedure;
const defaultRouteStreamProcedure: RpcStreamRouteProcedure<Routes> =
  routeStreamProcedure;
routeStreamProcedure.stream;
defaultRouteStreamProcedure.stream;
const rpcSubpathRouteStreamProcedure: RpcSubpathStreamRouteProcedure<
  Routes,
  'users.watch'
> = routeStreamProcedure;
rpcSubpathRouteStreamProcedure.stream;
const routeUnaryInput: RpcUnaryRouteInput<Routes, 'users.get'> = { id: '1' };
const defaultRouteUnaryInput: RpcUnaryRouteInput<Routes> = routeUnaryInput;
routeUnaryInput.id.toUpperCase();
defaultRouteUnaryInput.id.toUpperCase();
const routeStreamInput: RpcStreamRouteInput<Routes, 'users.watch'> = {
  userId: '1',
};
const defaultRouteStreamInput: RpcStreamRouteInput<Routes> = routeStreamInput;
routeStreamInput.userId.toUpperCase();
defaultRouteStreamInput.userId.toUpperCase();
type RouteStreamOutputIsNever = [
  RpcStreamRouteOutput<Routes, 'users.watch'>,
] extends [never]
  ? true
  : false;
const routeStreamOutputIsNever: RouteStreamOutputIsNever = true;
routeStreamOutputIsNever.valueOf();
type RpcSubpathStreamRouteOutputIsNever = [
  RpcSubpathStreamRouteOutput<Routes, 'users.watch'>,
] extends [never]
  ? true
  : false;
const rpcSubpathStreamRouteOutputIsNever: RpcSubpathStreamRouteOutputIsNever = true;
rpcSubpathStreamRouteOutputIsNever.valueOf();
const routeStreamEvent: RpcStreamRouteEvent<Routes, 'users.watch'> = {
  type: 'user.updated',
  userId: '1',
};
routeStreamEvent.userId.toUpperCase();
const defaultRouteStreamEvent: RpcStreamRouteEvent<Routes> = routeStreamEvent;
defaultRouteStreamEvent.userId.toUpperCase();
const routeUnaryOutput: RpcUnaryRouteOutput<Routes, 'users.get'> = {
  id: '1',
  name: 'Ada',
};
const defaultRouteUnaryOutput: RpcUnaryRouteOutput<Routes> = routeUnaryOutput;
routeUnaryOutput.name.toUpperCase();
defaultRouteUnaryOutput.name.toUpperCase();
const routeUnaryHeaders: RpcUnaryRouteHeaders<Routes, 'users.get'> = {
  'x-tenant-id': 'tenant-1',
};
const defaultRouteUnaryHeaders: RpcUnaryRouteHeaders<Routes> =
  routeUnaryHeaders;
routeUnaryHeaders['x-tenant-id'].toUpperCase();
defaultRouteUnaryHeaders['x-tenant-id']?.toUpperCase();
const routeStreamHeaders: RpcStreamRouteHeaders<Routes, 'users.watch'> = {};
const defaultRouteStreamHeaders: RpcStreamRouteHeaders<Routes> =
  routeStreamHeaders;
routeStreamHeaders.valueOf();
defaultRouteStreamHeaders.valueOf();
const routeUnaryClientHeaders: RpcUnaryRouteClientHeaders<Routes, 'users.get'> =
  { 'x-tenant-id': 'tenant-1', authorization: undefined };
const defaultRouteUnaryClientHeaders: RpcUnaryRouteClientHeaders<Routes> =
  routeUnaryClientHeaders;
routeUnaryClientHeaders.authorization?.toUpperCase();
defaultRouteUnaryClientHeaders['x-tenant-id']?.toUpperCase();
const routeStreamClientHeaders: RpcStreamRouteClientHeaders<
  Routes,
  'users.watch'
> = {};
routeStreamClientHeaders.valueOf();
const routeStreamResponseHeaders: RpcStreamRouteResponseHeaders<
  Routes,
  'users.watch'
> = {};
const rpcSubpathStreamRouteResponseHeaders: RpcSubpathStreamRouteResponseHeaders<
  Routes,
  'users.watch'
> = routeStreamResponseHeaders;
rpcSubpathStreamRouteResponseHeaders.valueOf();
const routeUnaryResponseHeaders: RpcUnaryRouteResponseHeaders<
  Routes,
  'users.get'
> = { 'cache-control': 'private' };
const defaultRouteUnaryResponseHeaders: RpcUnaryRouteResponseHeaders<Routes> =
  routeUnaryResponseHeaders;
routeUnaryResponseHeaders['cache-control'].toUpperCase();
defaultRouteUnaryResponseHeaders['cache-control'].toUpperCase();
const routeUnaryHasHeaders: RpcUnaryRouteHasHeaders<Routes, 'users.get'> = true;
const defaultRouteUnaryHasHeaders: RpcUnaryRouteHasHeaders<Routes> =
  routeUnaryHasHeaders;
routeUnaryHasHeaders.valueOf();
defaultRouteUnaryHasHeaders.valueOf();
const routeStreamHasHeaders: RpcStreamRouteHasHeaders<Routes, 'users.watch'> =
  false;
routeStreamHasHeaders.valueOf();
const routeUnaryRequiresHeaders: RpcUnaryRouteRequiresHeaders<
  Routes,
  'users.get'
> = true;
routeUnaryRequiresHeaders.valueOf();
const routeStreamRequiresHeaders: RpcStreamRouteRequiresHeaders<
  Routes,
  'users.watch'
> = false;
routeStreamRequiresHeaders.valueOf();
const routeUnaryHasResponseHeaders: RpcUnaryRouteHasResponseHeaders<
  Routes,
  'users.get'
> = true;
routeUnaryHasResponseHeaders.valueOf();
const routeUnaryRequiresResponseHeaders: RpcUnaryRouteRequiresResponseHeaders<
  Routes,
  'users.get'
> = true;
const defaultRouteUnaryRequiresResponseHeaders: RpcUnaryRouteRequiresResponseHeaders<Routes> = false;
routeUnaryRequiresResponseHeaders.valueOf();
defaultRouteUnaryRequiresResponseHeaders.valueOf();
const routeStreamHasResponseHeaders: RpcStreamRouteHasResponseHeaders<
  Routes,
  'users.watch'
> = false;
routeStreamHasResponseHeaders.valueOf();
const routeStreamRequiresResponseHeaders: RpcStreamRouteRequiresResponseHeaders<
  Routes,
  'users.watch'
> = false;
routeStreamRequiresResponseHeaders.valueOf();
const routeUnaryErrorCode: RpcUnaryRouteErrorCode<Routes, 'users.get'> =
  'NOT_FOUND';
const defaultRouteUnaryErrorCode: RpcUnaryRouteErrorCode<Routes> =
  routeUnaryErrorCode;
routeUnaryErrorCode.toUpperCase();
defaultRouteUnaryErrorCode.toUpperCase();
const routeUnaryErrorDetails: RpcUnaryRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
const defaultRouteUnaryErrorDetails: RpcUnaryRouteErrorDetails<Routes> =
  routeUnaryErrorDetails;
routeUnaryErrorDetails.message.toUpperCase();
defaultRouteUnaryErrorDetails.valueOf();
const routeStreamErrorCode: RpcStreamRouteErrorCode<Routes, 'users.watch'> =
  'VALIDATION_ERROR';
const defaultRouteStreamErrorCode: RpcStreamRouteErrorCode<Routes> =
  routeStreamErrorCode;
routeStreamErrorCode.toUpperCase();
defaultRouteStreamErrorCode.toUpperCase();
const routeStreamErrorDetails: RpcStreamRouteErrorDetails<
  Routes,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
const defaultRouteStreamErrorDetails: RpcStreamRouteErrorDetails<Routes> =
  routeStreamErrorDetails;
routeStreamErrorDetails.valueOf();
defaultRouteStreamErrorDetails.valueOf();
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
const defaultRouteRequiresResponseHeaders: RpcRouteRequiresResponseHeaders<Routes> = false;
routeRequiresResponseHeaders.valueOf();
defaultRouteRequiresResponseHeaders.valueOf();
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
const routeError: RpcRouteError<Routes> = {
  code: 'NOT_FOUND',
  message: 'Missing',
  status: 404,
  details: { message: 'Missing' },
};
routeError.code.toUpperCase();
const defaultRouteErrorCode: RpcRouteErrorCode<Routes> = routeUnaryErrorCode;
defaultRouteErrorCode.toUpperCase();
const defaultRouteErrorDetails: RpcRouteErrorDetails<Routes> =
  routeUnaryErrorDetails;
defaultRouteErrorDetails.valueOf();
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
const routeFrameworkErrorCode: RpcRouteErrorCode<Routes, 'users.get'> =
  'VALIDATION_ERROR';
routeFrameworkErrorCode.toUpperCase();
const routeErrorDetails: RpcRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
routeErrorDetails.message.toUpperCase();
const routeFrameworkErrorDetails: RpcRouteErrorDetails<
  Routes,
  'users.get',
  'VALIDATION_ERROR'
> = { issue: 'input' };
if (isJsonObject(routeFrameworkErrorDetails)) {
  routeFrameworkErrorDetails['issue'];
}
const subpathRouteErrorCode: RpcSubpathRouteErrorCode<Routes, 'users.get'> =
  'NOT_FOUND';
subpathRouteErrorCode.toUpperCase();
const subpathRouteFrameworkErrorCode: RpcSubpathRouteErrorCode<
  Routes,
  'users.get'
> = routeFrameworkErrorCode;
subpathRouteFrameworkErrorCode.toUpperCase();
const subpathRouteErrorDetails: RpcSubpathRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = routeErrorDetails;
subpathRouteErrorDetails.message.toUpperCase();
const subpathRouteFrameworkErrorDetails: RpcSubpathRouteErrorDetails<
  Routes,
  'users.get',
  'VALIDATION_ERROR'
> = routeFrameworkErrorDetails;
if (isJsonObject(subpathRouteFrameworkErrorDetails)) {
  subpathRouteFrameworkErrorDetails['issue'];
}
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
const defaultJoorManifestRouteServices: JoorManifestRouteServices<
  typeof manifest
> = joorManifestRouteServices;
joorManifestRouteServices.users.findById('1');
defaultJoorManifestRouteServices.users.findById('1');
const manifestRequiredServices: RpcManifestRequiredServices<typeof manifest> =
  procedureServices;
manifestRequiredServices.users.findById('1').id.toUpperCase();
const manifestRouteServices: RpcManifestRouteServices<
  typeof manifest,
  'users.get'
> = procedureServices;
const defaultManifestRouteServices: RpcManifestRouteServices<typeof manifest> =
  manifestRouteServices;
manifestRouteServices.users.findById('1');
defaultManifestRouteServices.users.findById('1');
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
const manifestAwareConfigManifest: HandlerOptionsManifest<
  typeof manifestAwareConfig
> = manifest;
const rootManifestAwareConfigManifest: HandlerOptionsManifest<
  typeof manifestAwareConfig
> = manifestAwareConfigManifest;
const rpcSubpathManifestAwareConfigManifest: RpcSubpathHandlerOptionsManifest<
  typeof manifestAwareConfig
> = rootManifestAwareConfigManifest;
const contextSubpathManifestAwareConfigManifest: ContextSubpathHandlerOptionsManifest<
  typeof manifestAwareConfig
> = rpcSubpathManifestAwareConfigManifest;
const configSubpathManifestAwareConfigManifest: ConfigSubpathHandlerOptionsManifest<
  typeof manifestAwareConfig
> = contextSubpathManifestAwareConfigManifest;
const packageConfigSubpathManifestAwareConfigManifest: PackageConfigSubpathHandlerOptionsManifest<
  typeof manifestAwareConfig
> = configSubpathManifestAwareConfigManifest;
packageConfigSubpathManifestAwareConfigManifest.procedures[
  'users.get'
].valueOf();
const manifestAwareConfigBody: HandlerOptionsBody<typeof manifestAwareConfig> =
  { id: 'users.get', input: { id: '1' } };
const rootManifestAwareConfigBody: HandlerOptionsBody<
  typeof manifestAwareConfig
> = manifestAwareConfigBody;
const rpcSubpathManifestAwareConfigBody: RpcSubpathHandlerOptionsBody<
  typeof manifestAwareConfig
> = rootManifestAwareConfigBody;
const contextSubpathManifestAwareConfigBody: ContextSubpathHandlerOptionsBody<
  typeof manifestAwareConfig
> = rpcSubpathManifestAwareConfigBody;
const configSubpathManifestAwareConfigBody: ConfigSubpathHandlerOptionsBody<
  typeof manifestAwareConfig
> = contextSubpathManifestAwareConfigBody;
const packageConfigSubpathManifestAwareConfigBody: PackageConfigSubpathHandlerOptionsBody<
  typeof manifestAwareConfig
> = configSubpathManifestAwareConfigBody;
const manifestAwareConfigRequest: HandlerOptionsRequest<
  typeof manifestAwareConfig
> = new Request('https://example.com/rpc');
const rpcSubpathManifestAwareConfigRequest: RpcSubpathHandlerOptionsRequest<
  typeof manifestAwareConfig
> = manifestAwareConfigRequest;
const contextSubpathManifestAwareConfigRequest: ContextSubpathHandlerOptionsRequest<
  typeof manifestAwareConfig
> = rpcSubpathManifestAwareConfigRequest;
const configSubpathManifestAwareConfigRequest: ConfigSubpathHandlerOptionsRequest<
  typeof manifestAwareConfig
> = contextSubpathManifestAwareConfigRequest;
const packageConfigSubpathManifestAwareConfigRequest: PackageConfigSubpathHandlerOptionsRequest<
  typeof manifestAwareConfig
> = configSubpathManifestAwareConfigRequest;
packageConfigSubpathManifestAwareConfigRequest.url.toUpperCase();
if (
  !Array.isArray(packageConfigSubpathManifestAwareConfigBody) &&
  packageConfigSubpathManifestAwareConfigBody.id === 'users.get'
) {
  packageConfigSubpathManifestAwareConfigBody.input.id.toUpperCase();
  // @ts-expect-error manifest-aware config body metadata keeps route input exact.
  packageConfigSubpathManifestAwareConfigBody.input.ok;
}
const manifestRouteUnaryConfigShape: JoorRouteUnaryConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      if (context.body !== undefined && 'id' in context.body) {
        context.body.input.valueOf();
      }
      return undefined;
    },
  },
};
const manifestUnaryRouteConfigShape: JoorUnaryRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestRouteUnaryConfigShape;
const manifestRouteStreamConfigShape: JoorRouteStreamConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(_request, context) {
      context.body?.input.userId.toUpperCase();
      return undefined;
    },
  },
};
const manifestStreamRouteConfigShape: JoorStreamRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestRouteStreamConfigShape;
const manifestRouteUnaryConfigFactory: DefineRouteUnaryConfigFor<
  typeof manifest
> = defineConfigFor(manifest);
const manifestUnaryRouteConfigFactory: DefineUnaryRouteConfigFor<
  typeof manifest
> = manifestRouteUnaryConfigFactory;
const manifestRouteStreamConfigFactory: DefineRouteStreamConfigFor<
  typeof manifest
> = defineConfigFor(manifest);
const manifestStreamRouteConfigFactory: DefineStreamRouteConfigFor<
  typeof manifest
> = manifestRouteStreamConfigFactory;
manifestRouteUnaryConfigFactory(manifestRouteUnaryConfigShape);
manifestRouteStreamConfigFactory(manifestRouteStreamConfigShape);
manifestUnaryRouteConfigFactory(manifestUnaryRouteConfigShape);
manifestStreamRouteConfigFactory(manifestStreamRouteConfigShape);
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
const contextSubpathUnaryRouteConfigShape: ContextSubpathUnaryRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteConfigShape;
const contextSubpathStreamRouteConfigShape: ContextSubpathStreamRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteConfigShape;
const contextSubpathManifestAwareConfigFactory: ContextSubpathDefineConfigFor<
  typeof manifest
> = defineContextSubpathConfigFor(manifest);
const contextSubpathUnaryRouteConfigFactory: ContextSubpathDefineUnaryRouteConfigFor<
  typeof manifest
> = defineContextSubpathConfigFor(manifest);
const contextSubpathStreamRouteConfigFactory: ContextSubpathDefineStreamRouteConfigFor<
  typeof manifest
> = defineContextSubpathConfigFor(manifest);
contextSubpathManifestAwareConfigFactory({ plugins: [usersPlugin] as const });
contextSubpathUnaryRouteConfigFactory(contextSubpathUnaryRouteConfigShape);
contextSubpathStreamRouteConfigFactory(contextSubpathStreamRouteConfigShape);
const configSubpathManifestAwareConfig = defineConfigSubpathFor(manifest)({
  plugins: [usersPlugin] as const,
});
const configSubpathManifestAwareConfigShape: ConfigSubpathConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = configSubpathManifestAwareConfig;
configSubpathManifestAwareConfigShape.plugins?.[0]?.setup;
const configSubpathUnaryRouteConfigShape: ConfigSubpathUnaryRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteConfigShape;
const configSubpathStreamRouteConfigShape: ConfigSubpathStreamRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteConfigShape;
const configSubpathManifestAwareConfigFactory: ConfigSubpathDefineConfigFor<
  typeof manifest
> = defineConfigSubpathFor(manifest);
const configSubpathUnaryRouteConfigFactory: ConfigSubpathDefineUnaryRouteConfigFor<
  typeof manifest
> = defineConfigSubpathFor(manifest);
const configSubpathStreamRouteConfigFactory: ConfigSubpathDefineStreamRouteConfigFor<
  typeof manifest
> = defineConfigSubpathFor(manifest);
configSubpathManifestAwareConfigFactory({ plugins: [usersPlugin] as const });
configSubpathUnaryRouteConfigFactory(configSubpathUnaryRouteConfigShape);
configSubpathStreamRouteConfigFactory(configSubpathStreamRouteConfigShape);
type ConfigSubpathServices = ConfigSubpathConfigContext<
  typeof configSubpathManifestAwareConfig
>;
const configSubpathServices: ConfigSubpathServices = procedureServices;
configSubpathServices.users.findById('1').name.toUpperCase();
defineConfigSubpathFor(manifest)({
  // @ts-expect-error config subpath manifest-aware configs reject missing service plugins.
  plugins: [] as const,
});
const packageConfigSubpathManifestAwareConfig =
  definePackageConfigSubpathFor(manifest)({
    plugins: [usersPlugin] as const,
  });
const packageConfigSubpathManifestAwareConfigShape: PackageConfigSubpathConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = packageConfigSubpathManifestAwareConfig;
packageConfigSubpathManifestAwareConfigShape.plugins?.[0]?.setup;
const packageConfigSubpathUnaryRouteConfigShape: PackageConfigSubpathUnaryRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteConfigShape;
const packageConfigSubpathStreamRouteConfigShape: PackageConfigSubpathStreamRouteConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteConfigShape;
const packageConfigSubpathManifestAwareConfigFactory: PackageConfigSubpathDefineConfigFor<
  typeof manifest
> = definePackageConfigSubpathFor(manifest);
const packageConfigSubpathUnaryRouteConfigFactory: PackageConfigSubpathDefineUnaryRouteConfigFor<
  typeof manifest
> = definePackageConfigSubpathFor(manifest);
const packageConfigSubpathStreamRouteConfigFactory: PackageConfigSubpathDefineStreamRouteConfigFor<
  typeof manifest
> = definePackageConfigSubpathFor(manifest);
packageConfigSubpathManifestAwareConfigFactory({
  plugins: [usersPlugin] as const,
});
packageConfigSubpathUnaryRouteConfigFactory(
  packageConfigSubpathUnaryRouteConfigShape
);
packageConfigSubpathStreamRouteConfigFactory(
  packageConfigSubpathStreamRouteConfigShape
);
type PackageConfigSubpathServices = PackageConfigSubpathConfigContext<
  typeof packageConfigSubpathManifestAwareConfig
>;
const packageConfigSubpathServices: PackageConfigSubpathServices =
  procedureServices;
packageConfigSubpathServices.users.findById('1').name.toUpperCase();
definePackageConfigSubpathFor(manifest)({
  // @ts-expect-error package config subpath manifest-aware configs reject missing service plugins.
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
// @ts-expect-error compiler build options are readonly.
compilerSubpathBuildOptions.outDir = './dist';
const compilerSubpathEmitOptions: CompilerSubpathEmitOptions = {
  outDir: '/tmp/joor-app/.joor',
  config,
  configPath: '/tmp/joor-app/joor.config.ts',
};
compilerSubpathEmitOptions.configPath?.toUpperCase();
// @ts-expect-error compiler emit options are readonly.
compilerSubpathEmitOptions.outDir = '/tmp/other/.joor';
const compilerSubpathProcedureFile: CompilerSubpathProcedureFile = {
  path: '/tmp/joor-app/rpc/users/get.rpc.ts',
  id: 'users.get',
};
compilerSubpathProcedureFile.id.toUpperCase();
// @ts-expect-error compiler procedure file paths are readonly.
compilerSubpathProcedureFile.path = '/tmp/other.rpc.ts';
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
// @ts-expect-error compiler generation validation flags are readonly.
compilerSubpathGenerationOptions.validateInput = false;
// @ts-expect-error compiler generation mode lists are readonly.
compilerSubpathGenerationOptions.modes?.push('body');
const compilerSubpathLoadedProcedure: CompilerSubpathLoadedProcedure = {
  id: 'users.get',
  importPath: '/tmp/joor-app/rpc/users/get.rpc.ts',
  exportName: 'users_get',
  procedure,
};
compilerSubpathLoadedProcedure.exportName.toUpperCase();
// @ts-expect-error compiler loaded procedure ids are readonly.
compilerSubpathLoadedProcedure.id = 'users.list';
const compilerSubpathManifest: CompilerSubpathManifest = {
  procedures: [compilerSubpathLoadedProcedure],
};
// @ts-expect-error compiler manifests expose readonly procedure lists.
compilerSubpathManifest.procedures = [];
// @ts-expect-error compiler manifest procedure lists are readonly arrays.
compilerSubpathManifest.procedures[0] = compilerSubpathLoadedProcedure;
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
const rootManifestRouteUnaryClientShape: RpcManifestRouteUnaryTransportClient<
  typeof manifest
> = rootManifestClient;
rootManifestRouteUnaryClientShape.call('users.authenticated', { ok: true });
rootManifestRouteUnaryClientShape.batch([
  rootManifestRouteUnaryClientShape.request('users.authenticated', {
    ok: true,
  }),
] as const);
const rootManifestUnaryClientShape: RpcManifestUnaryRouteTransportClient<
  typeof manifest
> = rootManifestRouteUnaryClientShape;
rootManifestUnaryClientShape.call('users.authenticated', { ok: true });
rootManifestUnaryClientShape.batch([
  rootManifestUnaryClientShape.request('users.authenticated', { ok: true }),
] as const);
const rootManifestRouteStreamClientShape: RpcManifestRouteStreamTransportClient<
  typeof manifest
> = rootManifestClient;
rootManifestRouteStreamClientShape.stream('users.watch', { userId: '1' });
const rootManifestStreamClientShape: RpcManifestStreamRouteTransportClient<
  typeof manifest
> = rootManifestRouteStreamClientShape;
rootManifestStreamClientShape.stream('users.watch', { userId: '1' });
const rpcSubpathManifestClientShape: RpcSubpathManifestTransportClient<
  typeof manifest
> = rootManifestClient;
rpcSubpathManifestClientShape.call('users.authenticated', { ok: true });
const joorManifestClientShape: JoorManifestTransportClient<typeof manifest> =
  rootManifestClient;
const joorManifestRouteUnaryClientShape: JoorManifestRouteUnaryTransportClient<
  typeof manifest
> = joorManifestClientShape;
joorManifestRouteUnaryClientShape.call('users.authenticated', { ok: true });
const joorManifestUnaryClientShape: JoorManifestUnaryRouteTransportClient<
  typeof manifest
> = joorManifestRouteUnaryClientShape;
joorManifestUnaryClientShape.call('users.authenticated', { ok: true });
const joorManifestRouteStreamClientShape: JoorManifestRouteStreamTransportClient<
  typeof manifest
> = joorManifestClientShape;
joorManifestRouteStreamClientShape.stream('users.watch', { userId: '1' });
const joorManifestStreamClientShape: JoorManifestStreamRouteTransportClient<
  typeof manifest
> = joorManifestRouteStreamClientShape;
joorManifestStreamClientShape.stream('users.watch', { userId: '1' });
const joorSubpathManifestClientShape: JoorSubpathManifestTransportClient<
  typeof manifestFromSubpath
> = joorManifestClientShape;
joorManifestClientShape.call('users.authenticated', { ok: true });
joorSubpathManifestClientShape.call('users.authenticated', { ok: true });
const clientFetch: ClientFetch = async (request) => new Response(request.url);
const rpcSubpathClientFetch: RpcSubpathClientFetch = clientFetch;
const syncClientFetch: ClientFetch = (request) => new Response(request.url);
const syncRpcSubpathClientFetch: RpcSubpathClientFetch = syncClientFetch;
clientFetch(new Request('https://example.com/rpc'));
rpcSubpathClientFetch(new Request('https://example.com/rpc'));
syncClientFetch(new Request('https://example.com/rpc'));
syncRpcSubpathClientFetch(new Request('https://example.com/rpc'));
interface ClientAppRequest extends Request {
  readonly requestId: string;
}
const clientRequestFactoryArgs: ClientRequestFactoryArgs = {
  url: '/rpc',
  body: { id: 'users.get', input: { id: '1' } },
  headers: new Headers(),
};
// @ts-expect-error client request factory URLs are readonly.
clientRequestFactoryArgs.url = '/v2/rpc';
// @ts-expect-error client request factory bodies are readonly.
clientRequestFactoryArgs.body = { id: 'users.list' };
const rpcSubpathClientRequestFactoryArgs: RpcSubpathClientRequestFactoryArgs =
  clientRequestFactoryArgs;
// @ts-expect-error client request factory headers are readonly across subpath exports.
rpcSubpathClientRequestFactoryArgs.headers = new Headers();
const typedClientRequestFactory: ClientRequestFactory<ClientAppRequest> = ({
  url,
  body,
  headers,
  baseRequest,
  request,
}) =>
  Object.assign(
    new Request(url, {
      ...baseRequest,
      ...request,
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
    { requestId: 'req_1' }
  ) as ClientAppRequest;
const rpcSubpathTypedClientRequestFactory: RpcSubpathClientRequestFactory<ClientAppRequest> =
  typedClientRequestFactory;
const clientAppRequest = typedClientRequestFactory(clientRequestFactoryArgs);
const rpcSubpathClientAppRequest = rpcSubpathTypedClientRequestFactory(
  rpcSubpathClientRequestFactoryArgs
);
const typedClientFetch: ClientFetch<ClientAppRequest> = async (request) =>
  new Response(request.requestId);
const rpcSubpathTypedClientFetch: RpcSubpathClientFetch<ClientAppRequest> =
  typedClientFetch;
typedClientFetch(clientAppRequest);
rpcSubpathTypedClientFetch(rpcSubpathClientAppRequest);
const typedClientOptions: ClientOptions<undefined, ClientAppRequest> = {
  url: '/rpc',
  fetch: typedClientFetch,
  createRequest: typedClientRequestFactory,
};
// @ts-expect-error client option URLs are readonly.
typedClientOptions.url = '/v2/rpc';
// @ts-expect-error typed client request factories are readonly.
typedClientOptions.createRequest = typedClientRequestFactory;
const rpcSubpathTypedClientOptions: RpcSubpathClientOptions<
  undefined,
  ClientAppRequest
> = typedClientOptions;
createClient<never, ClientAppRequest>(typedClientOptions);
createClient<never, ClientAppRequest>(rpcSubpathTypedClientOptions);
const typedManifestClientOptions: RpcManifestClientOptions<
  typeof manifest,
  ClientAppRequest
> = {
  url: '/rpc',
  fetch: typedClientFetch,
  createRequest: typedClientRequestFactory,
};
const typedJoorManifestClientOptions: JoorManifestClientOptions<
  typeof manifest,
  ClientAppRequest
> = typedManifestClientOptions;
const typedRpcSubpathManifestClientOptions: RpcSubpathManifestClientOptions<
  typeof manifest,
  ClientAppRequest
> = typedManifestClientOptions;
const typedJoorSubpathManifestClientOptions: JoorSubpathManifestClientOptions<
  typeof manifestFromSubpath,
  ClientAppRequest
> = typedJoorManifestClientOptions;
createRootManifestClient(manifest, typedManifestClientOptions);
createRootManifestClient(manifest, typedRpcSubpathManifestClientOptions);
createRootManifestClient(manifest, typedJoorManifestClientOptions);
createRootManifestClient(
  manifestFromSubpath,
  typedJoorSubpathManifestClientOptions
);
const requestTypedManifestClientOptions: RpcManifestClientOptions<
  typeof requestTypedManifest
> = {
  url: '/rpc',
  fetch: typedClientFetch,
  createRequest: typedClientRequestFactory,
};
const requestTypedJoorManifestClientOptions: JoorManifestClientOptions<
  typeof requestTypedManifest
> = requestTypedManifestClientOptions;
const requestTypedRpcSubpathManifestClientOptions: RpcSubpathManifestClientOptions<
  typeof requestTypedManifest
> = requestTypedManifestClientOptions;
createRootManifestClient(requestTypedManifest, requestTypedManifestClientOptions);
createRootManifestClient(
  requestTypedManifest,
  requestTypedJoorManifestClientOptions
);
createRootManifestClient(
  requestTypedManifest,
  requestTypedRpcSubpathManifestClientOptions
);
createClient({
  url: '/rpc',
  manifest: requestTypedManifest,
  fetch: typedClientFetch,
  createRequest: typedClientRequestFactory,
});
// @ts-expect-error request-typed manifest client options require a matching request factory by default.
const _missingRequestTypedManifestClientOptions: RpcManifestClientOptions<
  typeof requestTypedManifest
> = {
  url: '/rpc',
  fetch: typedClientFetch,
};
// @ts-expect-error request-typed manifest clients require a matching request factory by default.
createClient({
  url: '/rpc',
  manifest: requestTypedManifest,
  fetch: typedClientFetch,
});
// @ts-expect-error typed client request options require a matching request factory.
const _missingTypedClientRequestFactory: ClientOptions<
  undefined,
  ClientAppRequest
> = {
  url: '/rpc',
  fetch: typedClientFetch,
};
// @ts-expect-error typed client fetches require the configured request subtype.
typedClientFetch(new Request('https://example.com/rpc'));
const procedureClientHeaders: ClientProcedureHeaders<typeof procedure> = {
  authorization: undefined,
  'x-tenant-id': 'tenant-1',
};
// @ts-expect-error typed procedure client headers are readonly.
procedureClientHeaders['x-tenant-id'] = 'tenant-2';
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
// @ts-expect-error manifest client headers are readonly.
manifestClientOptions.headers = { authorization: 'Bearer token' };
// @ts-expect-error manifest client header maps are readonly.
manifestClientOptions.headers.authorization = 'Bearer other';
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
const legacyProtocolBatchRequest = {
  id: 'users.untyped',
  input: { id: '1' },
  traceId: 'trace-1',
} as const satisfies ClientProtocolBatchRequest;
const legacyClientBatchRequest: ClientBatchRequest = legacyProtocolBatchRequest;
const legacyClientBatchRequestAlias: LegacyBatchRequest =
  legacyClientBatchRequest;
const rpcSubpathLegacyProtocolBatchRequest: RpcSubpathClientProtocolBatchRequest =
  legacyProtocolBatchRequest;
const rpcSubpathLegacyClientBatchRequest: RpcSubpathClientBatchRequest =
  legacyClientBatchRequestAlias;
const rpcSubpathLegacyBatchRequestAlias: RpcSubpathLegacyBatchRequest =
  rpcSubpathLegacyClientBatchRequest;
legacyProtocolBatchRequest.traceId?.toUpperCase();
legacyClientBatchRequestAlias.id.toUpperCase();
rpcSubpathLegacyProtocolBatchRequest.traceId?.toUpperCase();
rpcSubpathLegacyBatchRequestAlias.id.toUpperCase();
const _wrongLegacyProtocolBatchRequest: ClientProtocolBatchRequest = {
  id: 'users.untyped',
  input: { id: '1' },
  // @ts-expect-error protocol batch request aliases do not carry pending-request headers.
  headers: { authorization: 'Bearer token' },
};
_wrongLegacyProtocolBatchRequest.id.toUpperCase();
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
legacyClient.batch([legacyProtocolBatchRequest] as const).then((results) => {
  const first = results[0];
  const firstId: 'users.untyped' = first.id;
  firstId.toUpperCase();
  if (first.ok && first.data !== null) {
    first.data.valueOf();
  }
});
legacyClient.batch(
  [{ id: 'users.untyped', input: { id: '1' } }] as const,
  clientBatchOptions
);
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
const defaultUntypedLegacyBatchResults: BatchResults =
  untypedLegacyBatchResults;
if (untypedLegacyBatchResults[0].ok) {
  untypedLegacyBatchResults[0].headers?.['cache-control']?.toUpperCase();
}
const defaultUntypedLegacyBatchResult = defaultUntypedLegacyBatchResults[0];
if (defaultUntypedLegacyBatchResult?.ok) {
  defaultUntypedLegacyBatchResult.id.toUpperCase();
  defaultUntypedLegacyBatchResult.headers?.['cache-control']?.toUpperCase();
}
const subpathUntypedLegacyBatchResults: RpcSubpathBatchResults<
  readonly [typeof legacyUntypedRequest]
> = untypedLegacyBatchResults;
const defaultSubpathUntypedLegacyBatchResults: RpcSubpathBatchResults =
  subpathUntypedLegacyBatchResults;
if (subpathUntypedLegacyBatchResults[0].ok) {
  subpathUntypedLegacyBatchResults[0].headers?.['cache-control']?.toUpperCase();
}
const defaultSubpathUntypedLegacyBatchResult =
  defaultSubpathUntypedLegacyBatchResults[0];
if (defaultSubpathUntypedLegacyBatchResult?.ok) {
  defaultSubpathUntypedLegacyBatchResult.id.toUpperCase();
  defaultSubpathUntypedLegacyBatchResult.headers?.[
    'cache-control'
  ]?.toUpperCase();
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
const manifestRouteInput: JoorManifestRouteInput<typeof manifest, 'users.get'> =
  { id: '1' };
const defaultManifestRouteInput: JoorManifestRouteInput<typeof manifest> =
  manifestRouteInput;
manifestRouteInput.id.toUpperCase();
if ('id' in defaultManifestRouteInput) {
  defaultManifestRouteInput.id.toUpperCase();
}
const manifestRouteProcedure: JoorManifestRouteProcedure<
  typeof manifest,
  'users.get'
> = procedure;
const defaultManifestRouteProcedure: JoorManifestRouteProcedure<
  typeof manifest
> = manifestRouteProcedure;
manifestRouteProcedure.output;
defaultManifestRouteProcedure.input;
const manifestUnaryRouteProcedure: JoorManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = manifestRouteProcedure;
const defaultManifestUnaryRouteProcedure: JoorManifestUnaryRouteProcedure<
  typeof manifest
> = manifestUnaryRouteProcedure;
manifestUnaryRouteProcedure.output;
defaultManifestUnaryRouteProcedure.input;
const manifestStreamRouteProcedure: JoorManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = streamProcedure;
const defaultManifestStreamRouteProcedure: JoorManifestStreamRouteProcedure<
  typeof manifest
> = manifestStreamRouteProcedure;
manifestStreamRouteProcedure.stream;
defaultManifestStreamRouteProcedure.stream;
const manifestSubpathUnaryRouteProcedure: JoorSubpathManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = manifestUnaryRouteProcedure;
manifestSubpathUnaryRouteProcedure.output;
const manifestSubpathStreamRouteProcedure: JoorSubpathManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = manifestStreamRouteProcedure;
manifestSubpathStreamRouteProcedure.stream;
const manifestUnaryRouteInput: JoorManifestUnaryRouteInput<
  typeof manifest,
  'users.get'
> = { id: '1' };
const defaultManifestUnaryRouteInput: JoorManifestUnaryRouteInput<
  typeof manifest
> = manifestUnaryRouteInput;
manifestUnaryRouteInput.id.toUpperCase();
defaultManifestUnaryRouteInput.id.toUpperCase();
const manifestStreamRouteInput: JoorManifestStreamRouteInput<
  typeof manifest,
  'users.watch'
> = { userId: '1' };
const defaultManifestStreamRouteInput: JoorManifestStreamRouteInput<
  typeof manifest
> = manifestStreamRouteInput;
manifestStreamRouteInput.userId.toUpperCase();
defaultManifestStreamRouteInput.userId.toUpperCase();
type ManifestStreamRouteOutputIsNever = [
  JoorManifestStreamRouteOutput<typeof manifest, 'users.watch'>,
] extends [never]
  ? true
  : false;
const manifestStreamRouteOutputIsNever: ManifestStreamRouteOutputIsNever = true;
manifestStreamRouteOutputIsNever.valueOf();
type ManifestSubpathStreamRouteOutputIsNever = [
  JoorSubpathManifestStreamRouteOutput<
    typeof manifestFromSubpath,
    'users.watch'
  >,
] extends [never]
  ? true
  : false;
const manifestSubpathStreamRouteOutputIsNever: ManifestSubpathStreamRouteOutputIsNever = true;
manifestSubpathStreamRouteOutputIsNever.valueOf();
const manifestUnaryRouteOutput: JoorManifestUnaryRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
const defaultManifestUnaryRouteOutput: JoorManifestUnaryRouteOutput<
  typeof manifest
> = manifestUnaryRouteOutput;
manifestUnaryRouteOutput.name.toUpperCase();
defaultManifestUnaryRouteOutput.name.toUpperCase();
const manifestUnaryRouteHeaders: JoorManifestUnaryRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
const defaultManifestUnaryRouteHeaders: JoorManifestUnaryRouteHeaders<
  typeof manifest
> = manifestUnaryRouteHeaders;
manifestUnaryRouteHeaders['x-tenant-id'].toUpperCase();
defaultManifestUnaryRouteHeaders['x-tenant-id']?.toUpperCase();
const manifestStreamRouteHeaders: JoorManifestStreamRouteHeaders<
  typeof manifest,
  'users.watch'
> = {};
manifestStreamRouteHeaders.valueOf();
const manifestUnaryRouteClientHeaders: JoorManifestUnaryRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1', authorization: undefined };
const defaultManifestUnaryRouteClientHeaders: JoorManifestUnaryRouteClientHeaders<
  typeof manifest
> = manifestUnaryRouteClientHeaders;
manifestUnaryRouteClientHeaders.authorization?.toUpperCase();
defaultManifestUnaryRouteClientHeaders['x-tenant-id']?.toUpperCase();
const manifestStreamRouteClientHeaders: JoorManifestStreamRouteClientHeaders<
  typeof manifest,
  'users.watch'
> = {};
manifestStreamRouteClientHeaders.valueOf();
const manifestUnaryRouteResponseHeaders: JoorManifestUnaryRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
const defaultManifestUnaryRouteResponseHeaders: JoorManifestUnaryRouteResponseHeaders<
  typeof manifest
> = manifestUnaryRouteResponseHeaders;
manifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
defaultManifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
const manifestStreamRouteResponseHeaders: JoorManifestStreamRouteResponseHeaders<
  typeof manifest,
  'users.watch'
> = {};
const manifestSubpathStreamRouteResponseHeaders: JoorSubpathManifestStreamRouteResponseHeaders<
  typeof manifestFromSubpath,
  'users.watch'
> = manifestStreamRouteResponseHeaders;
manifestSubpathStreamRouteResponseHeaders.valueOf();
const manifestStreamRouteEvent: JoorManifestStreamRouteEvent<
  typeof manifest,
  'users.watch'
> = { type: 'user.updated', userId: '1' };
manifestStreamRouteEvent.userId.toUpperCase();
const defaultManifestStreamRouteEvent: JoorManifestStreamRouteEvent<
  typeof manifest
> = manifestStreamRouteEvent;
defaultManifestStreamRouteEvent.userId.toUpperCase();
type ManifestRouteStreamOutputIsNever = [
  JoorManifestRouteOutput<typeof manifest, 'users.watch'>,
] extends [never]
  ? true
  : false;
const manifestRouteStreamOutputIsNever: ManifestRouteStreamOutputIsNever = true;
manifestRouteStreamOutputIsNever.valueOf();
type ManifestSubpathRouteStreamOutputIsNever = [
  JoorSubpathManifestRouteOutput<typeof manifestFromSubpath, 'users.watch'>,
] extends [never]
  ? true
  : false;
const manifestSubpathRouteStreamOutputIsNever: ManifestSubpathRouteStreamOutputIsNever = true;
manifestSubpathRouteStreamOutputIsNever.valueOf();
const manifestUnaryRouteHasHeaders: JoorManifestUnaryRouteHasHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestUnaryRouteHasHeaders.valueOf();
const manifestStreamRouteHasHeaders: JoorManifestStreamRouteHasHeaders<
  typeof manifest,
  'users.watch'
> = false;
manifestStreamRouteHasHeaders.valueOf();
const manifestUnaryRouteRequiresHeaders: JoorManifestUnaryRouteRequiresHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestUnaryRouteRequiresHeaders.valueOf();
const manifestStreamRouteRequiresHeaders: JoorManifestStreamRouteRequiresHeaders<
  typeof manifest,
  'users.watch'
> = false;
manifestStreamRouteRequiresHeaders.valueOf();
const manifestUnaryRouteHasResponseHeaders: JoorManifestUnaryRouteHasResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestUnaryRouteHasResponseHeaders.valueOf();
const manifestUnaryRouteRequiresResponseHeaders: JoorManifestUnaryRouteRequiresResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
const defaultManifestUnaryRouteRequiresResponseHeaders: JoorManifestUnaryRouteRequiresResponseHeaders<
  typeof manifest
> = false;
manifestUnaryRouteRequiresResponseHeaders.valueOf();
defaultManifestUnaryRouteRequiresResponseHeaders.valueOf();
const manifestStreamRouteHasResponseHeaders: JoorManifestStreamRouteHasResponseHeaders<
  typeof manifest,
  'users.watch'
> = false;
manifestStreamRouteHasResponseHeaders.valueOf();
const manifestStreamRouteRequiresResponseHeaders: JoorManifestStreamRouteRequiresResponseHeaders<
  typeof manifest,
  'users.watch'
> = false;
manifestStreamRouteRequiresResponseHeaders.valueOf();
const manifestStreamRouteError: JoorManifestStreamRouteError<
  typeof manifest,
  'users.watch'
> = {
  code: 'VALIDATION_ERROR',
  message: 'Invalid input',
  status: 400,
  details: { issue: 'input' },
};
const defaultManifestStreamRouteError: JoorManifestStreamRouteError<
  typeof manifest
> = manifestStreamRouteError;
manifestStreamRouteError.code.toUpperCase();
defaultManifestStreamRouteError.code.toUpperCase();
const manifestUnaryRouteErrorCode: JoorManifestUnaryRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
const defaultManifestUnaryRouteErrorCode: JoorManifestUnaryRouteErrorCode<
  typeof manifest
> = manifestUnaryRouteErrorCode;
manifestUnaryRouteErrorCode.toUpperCase();
defaultManifestUnaryRouteErrorCode.toUpperCase();
const manifestUnaryRouteErrorDetails: JoorManifestUnaryRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
const defaultManifestUnaryRouteErrorDetails: JoorManifestUnaryRouteErrorDetails<
  typeof manifest
> = manifestUnaryRouteErrorDetails;
manifestUnaryRouteErrorDetails.message.toUpperCase();
defaultManifestUnaryRouteErrorDetails.valueOf();
const manifestStreamRouteErrorCode: JoorManifestStreamRouteErrorCode<
  typeof manifest,
  'users.watch'
> = 'VALIDATION_ERROR';
const defaultManifestStreamRouteErrorCode: JoorManifestStreamRouteErrorCode<
  typeof manifest
> = manifestStreamRouteErrorCode;
manifestStreamRouteErrorCode.toUpperCase();
defaultManifestStreamRouteErrorCode.toUpperCase();
const manifestStreamRouteErrorDetails: JoorManifestStreamRouteErrorDetails<
  typeof manifest,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
const defaultManifestStreamRouteErrorDetails: JoorManifestStreamRouteErrorDetails<
  typeof manifest
> = manifestStreamRouteErrorDetails;
manifestStreamRouteErrorDetails.valueOf();
defaultManifestStreamRouteErrorDetails.valueOf();
const manifestRouteOutput: JoorManifestRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
manifestRouteOutput.name.toUpperCase();
const manifestRouteHeaders: JoorManifestRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
const defaultManifestRouteHeaders: JoorManifestRouteHeaders<typeof manifest> =
  manifestRouteHeaders;
manifestRouteHeaders['x-tenant-id'].toUpperCase();
defaultManifestRouteHeaders['x-tenant-id']?.toUpperCase();
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
const manifestRouteStreamResponseHeaders: JoorManifestRouteResponseHeaders<
  typeof manifest,
  'users.watch'
> = manifestStreamRouteResponseHeaders;
manifestRouteStreamResponseHeaders.valueOf();
const manifestRouteHasResponseHeaders: JoorManifestRouteHasResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
manifestRouteHasResponseHeaders.valueOf();
const manifestRouteRequiresResponseHeaders: JoorManifestRouteRequiresResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
const defaultManifestRouteRequiresResponseHeaders: JoorManifestRouteRequiresResponseHeaders<
  typeof manifest
> = false;
manifestRouteRequiresResponseHeaders.valueOf();
defaultManifestRouteRequiresResponseHeaders.valueOf();
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
const defaultManifestRouteError: JoorManifestRouteError<typeof manifest> =
  manifestRouteError;
manifestRouteError.code.toUpperCase();
defaultManifestRouteError.code.toUpperCase();
const manifestRouteErrorCode: JoorManifestRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
const defaultManifestRouteErrorCode: JoorManifestRouteErrorCode<
  typeof manifest
> = manifestRouteErrorCode;
manifestRouteErrorCode.toUpperCase();
defaultManifestRouteErrorCode.toUpperCase();
const manifestRouteFrameworkErrorCode: JoorManifestRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'VALIDATION_ERROR';
manifestRouteFrameworkErrorCode.toUpperCase();
const manifestRouteErrorDetails: JoorManifestRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
const defaultManifestRouteErrorDetails: JoorManifestRouteErrorDetails<
  typeof manifest
> = manifestRouteErrorDetails;
manifestRouteErrorDetails.message.toUpperCase();
defaultManifestRouteErrorDetails.valueOf();
const manifestRouteFrameworkErrorDetails: JoorManifestRouteErrorDetails<
  typeof manifest,
  'users.get',
  'VALIDATION_ERROR'
> = { issue: 'input' };
if (isJsonObject(manifestRouteFrameworkErrorDetails)) {
  manifestRouteFrameworkErrorDetails['issue'];
}
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
const defaultManifestRouteEnvelope: JoorManifestRouteEnvelope<typeof manifest> =
  manifestRouteEnvelope;
manifestRouteEnvelope.id.toUpperCase();
// @ts-expect-error route envelope ids are readonly.
manifestRouteEnvelope.id = 'users.authenticated';
// @ts-expect-error route envelope data is readonly.
manifestRouteEnvelope.data = { id: '2', name: 'Ada' };
// @ts-expect-error route envelope headers are readonly.
manifestRouteEnvelope.headers = { 'cache-control': 'public' };
if (
  defaultManifestRouteEnvelope.id === 'users.get' &&
  defaultManifestRouteEnvelope.ok
) {
  defaultManifestRouteEnvelope.data.name.toUpperCase();
  defaultManifestRouteEnvelope.headers['cache-control'].toUpperCase();
}
const manifestUnaryRouteEnvelope: JoorManifestUnaryRouteEnvelope<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
const defaultManifestUnaryRouteEnvelope: JoorManifestUnaryRouteEnvelope<
  typeof manifest
> = manifestUnaryRouteEnvelope;
manifestUnaryRouteEnvelope.id.toUpperCase();
defaultManifestUnaryRouteEnvelope.id.toUpperCase();
const manifestRouteEnvelopeUnion: JoorManifestRouteEnvelopeUnion<
  typeof manifest
> = manifestRouteEnvelope;
manifestRouteEnvelopeUnion.id.toUpperCase();
const manifestUnaryRouteEnvelopeUnion: JoorManifestUnaryRouteEnvelopeUnion<
  typeof manifest
> = manifestUnaryRouteEnvelope;
manifestUnaryRouteEnvelopeUnion.id.toUpperCase();
const manifestRouteResult: JoorManifestRouteResult<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
const defaultManifestRouteResult: JoorManifestRouteResult<typeof manifest> =
  manifestRouteResult;
const manifestUnaryRouteResult: JoorManifestUnaryRouteResult<
  typeof manifest,
  'users.get'
> = manifestRouteResult;
const defaultManifestUnaryRouteResult: JoorManifestUnaryRouteResult<
  typeof manifest
> = manifestUnaryRouteResult;
manifestUnaryRouteResult.id.toUpperCase();
defaultManifestRouteResult.id.toUpperCase();
defaultManifestUnaryRouteResult.id.toUpperCase();
const manifestRouteResultUnion: JoorManifestRouteResultUnion<typeof manifest> =
  manifestRouteResult;
manifestRouteResultUnion.id.toUpperCase();
const manifestUnaryRouteResultUnion: JoorManifestUnaryRouteResultUnion<
  typeof manifest
> = manifestUnaryRouteResult;
manifestUnaryRouteResultUnion.id.toUpperCase();
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
const defaultManifestRouteRequest: JoorManifestRouteRequest<typeof manifest> =
  manifestRouteRequest;
manifestRouteRequest.headers['x-tenant-id'].toUpperCase();
if (defaultManifestRouteRequest.id === 'users.get') {
  defaultManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
  defaultManifestRouteRequest.input.id.toUpperCase();
}
const manifestUnaryRouteRequest: JoorManifestUnaryRouteRequest<
  typeof manifest,
  'users.get'
> = manifestRouteRequest;
const defaultManifestUnaryRouteRequest: JoorManifestUnaryRouteRequest<
  typeof manifest
> = manifestUnaryRouteRequest;
manifestUnaryRouteRequest.input.id.toUpperCase();
defaultManifestUnaryRouteRequest.id.toUpperCase();
// @ts-expect-error default manifest route requests preserve route-specific required headers.
const _missingDefaultManifestRouteRequestHeaders: JoorManifestRouteRequest<
  typeof manifest
> = { id: 'users.get', input: { id: '1' } };
_missingDefaultManifestRouteRequestHeaders.id.toUpperCase();
const manifestRouteRequestOptions: JoorManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = { headers: { authorization: undefined, 'x-tenant-id': 'tenant-1' } };
const defaultManifestRouteRequestOptions: JoorManifestRouteRequestOptions<
  typeof manifest
> = manifestRouteRequestOptions;
const manifestUnaryRouteRequestOptions: JoorManifestUnaryRouteRequestOptions<
  typeof manifest,
  'users.get'
> = manifestRouteRequestOptions;
const defaultManifestUnaryRouteRequestOptions: JoorManifestUnaryRouteRequestOptions<
  typeof manifest
> = manifestUnaryRouteRequestOptions;
const manifestStreamRouteRequestOptions: JoorManifestStreamRouteRequestOptions<
  typeof manifest,
  'users.watch'
> = {};
const defaultManifestStreamRouteRequestOptions: JoorManifestStreamRouteRequestOptions<
  typeof manifest
> = manifestStreamRouteRequestOptions;
manifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultManifestRouteRequestOptions.headers?.['x-tenant-id']?.toUpperCase();
manifestUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultManifestUnaryRouteRequestOptions.headers?.['x-tenant-id']?.toUpperCase();
defaultManifestStreamRouteRequestOptions.valueOf();
const manifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }, manifestRouteRequestOptions];
const defaultManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest
> = manifestRouteClientArgs;
// @ts-expect-error manifest route client args are readonly tuples.
manifestRouteClientArgs[0] = { id: '2' };
const manifestUnaryRouteClientArgs: JoorManifestUnaryRouteClientArgs<
  typeof manifest,
  'users.get'
> = manifestRouteClientArgs;
const defaultManifestUnaryRouteClientArgs: JoorManifestUnaryRouteClientArgs<
  typeof manifest
> = manifestUnaryRouteClientArgs;
const manifestStreamRouteClientArgs: JoorManifestStreamRouteClientArgs<
  typeof manifest,
  'users.watch'
> = [{ userId: '1' }, manifestStreamRouteRequestOptions];
const defaultManifestStreamRouteClientArgs: JoorManifestStreamRouteClientArgs<
  typeof manifest
> = manifestStreamRouteClientArgs;
manifestRouteClientArgs[0].id.toUpperCase();
defaultManifestRouteClientArgs[0].id.toUpperCase();
manifestUnaryRouteClientArgs[0].id.toUpperCase();
defaultManifestUnaryRouteClientArgs[0].id.toUpperCase();
manifestStreamRouteClientArgs[0].userId.toUpperCase();
defaultManifestStreamRouteClientArgs[0].userId.toUpperCase();
const optionalManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.authenticated'
> = [{ ok: true }];
optionalManifestRouteClientArgs[0].ok.valueOf();
const defaultOptionalManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest
> = optionalManifestRouteClientArgs;
defaultOptionalManifestRouteClientArgs[0].ok.valueOf();
const _missingDefaultManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest
> =
  // @ts-expect-error default manifest route client args preserve route-specific required headers.
  [{ id: '1' }];
_missingDefaultManifestRouteClientArgs[0].valueOf();
const manifestSubpathRouteRequestOptions: JoorSubpathManifestRouteRequestOptions<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteRequestOptions;
const manifestSubpathUnaryRouteRequestOptions: JoorSubpathManifestUnaryRouteRequestOptions<
  typeof manifestFromSubpath,
  'users.get'
> = manifestUnaryRouteRequestOptions;
const manifestSubpathStreamRouteRequestOptions: JoorSubpathManifestStreamRouteRequestOptions<
  typeof manifestFromSubpath,
  'users.watch'
> = manifestStreamRouteRequestOptions;
const manifestSubpathRouteClientArgs: JoorSubpathManifestRouteClientArgs<
  typeof manifestFromSubpath,
  'users.get'
> = manifestRouteClientArgs;
const manifestSubpathUnaryRouteClientArgs: JoorSubpathManifestUnaryRouteClientArgs<
  typeof manifestFromSubpath,
  'users.get'
> = manifestUnaryRouteClientArgs;
const manifestSubpathStreamRouteClientArgs: JoorSubpathManifestStreamRouteClientArgs<
  typeof manifestFromSubpath,
  'users.watch'
> = manifestStreamRouteClientArgs;
manifestSubpathRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
manifestSubpathUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
manifestSubpathStreamRouteRequestOptions.valueOf();
manifestSubpathRouteClientArgs[0].id.toUpperCase();
manifestSubpathUnaryRouteClientArgs[0].id.toUpperCase();
manifestSubpathStreamRouteClientArgs[0].userId.toUpperCase();
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
const manifestUnaryRouteRequestUnion: JoorManifestUnaryRouteRequestUnion<
  typeof manifest
> = manifestUnaryRouteRequest;
manifestUnaryRouteRequestUnion.id.toUpperCase();
const manifestRouteBatchResults: JoorManifestRouteBatchResults<
  typeof manifest,
  [typeof manifestRouteRequest]
> = [manifestRouteEnvelope];
// @ts-expect-error manifest route batch results are readonly tuples.
manifestRouteBatchResults[0] = manifestRouteEnvelope;
const manifestUnaryRouteBatchResults: JoorManifestUnaryRouteBatchResults<
  typeof manifest,
  [typeof manifestUnaryRouteRequest]
> = manifestRouteBatchResults;
const defaultManifestRouteBatchResults: JoorManifestRouteBatchResults<
  typeof manifest
> = manifestRouteBatchResults;
const defaultManifestUnaryRouteBatchResults: JoorManifestUnaryRouteBatchResults<
  typeof manifest
> = manifestUnaryRouteBatchResults;
manifestRouteBatchResults[0].id.toUpperCase();
manifestUnaryRouteBatchResults[0].id.toUpperCase();
const defaultManifestRouteBatchResult = defaultManifestRouteBatchResults[0];
if (defaultManifestRouteBatchResult) {
  defaultManifestRouteBatchResult.id.toUpperCase();
}
const defaultManifestUnaryRouteBatchResult =
  defaultManifestUnaryRouteBatchResults[0];
if (defaultManifestUnaryRouteBatchResult) {
  defaultManifestUnaryRouteBatchResult.id.toUpperCase();
}
const manifestStreamEvent: JoorManifestRouteStreamEvent<
  typeof manifest,
  'users.watch'
> = { type: 'user.updated', userId: '1' };
manifestStreamEvent.userId.toUpperCase();
const defaultManifestRouteStreamEvent: JoorManifestRouteStreamEvent<
  typeof manifest
> = manifestStreamEvent;
defaultManifestRouteStreamEvent.userId.toUpperCase();
const manifestProtocolRequest: JoorManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = { id: 'users.get', input: { id: '1' } };
// @ts-expect-error protocol request route ids are readonly.
manifestProtocolRequest.id = 'users.authenticated';
// @ts-expect-error protocol request inputs are readonly.
manifestProtocolRequest.input = { id: '2' };
const defaultManifestProtocolRequest: JoorManifestRouteProtocolRequest<
  typeof manifest
> = manifestProtocolRequest;
const manifestProtocolRequestAlias: JoorManifestProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestProtocolRequest;
const defaultManifestProtocolRequestAlias: JoorManifestProtocolRequest<
  typeof manifest
> = manifestProtocolRequestAlias;
manifestProtocolRequest.input.id.toUpperCase();
if (defaultManifestProtocolRequest.id === 'users.get') {
  defaultManifestProtocolRequest.input.id.toUpperCase();
}
if (defaultManifestProtocolRequestAlias.id === 'users.get') {
  defaultManifestProtocolRequestAlias.input.id.toUpperCase();
}
// @ts-expect-error default manifest protocol requests preserve id/input correlation.
const _wrongDefaultManifestProtocolRequest: JoorManifestRouteProtocolRequest<
  typeof manifest
> = { id: 'users.get', input: { userId: '1' } };
_wrongDefaultManifestProtocolRequest.id.toUpperCase();
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
const manifestProtocolRequestUnionAlias: JoorManifestProtocolRequestUnion<
  typeof manifest
> = manifestProtocolRequestUnion;
manifestProtocolRequestUnion.id.toUpperCase();
manifestProtocolRequestUnionAlias.id.toUpperCase();
const manifestRouteBody: JoorManifestRouteBody<typeof manifest> =
  manifestProtocolRequest;
manifestRouteBody.id.toUpperCase();
// @ts-expect-error route request body ids are readonly.
manifestRouteBody.id = 'users.authenticated';
const manifestUnaryProtocolRequest: JoorManifestRouteUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestProtocolRequest;
const defaultManifestUnaryProtocolRequest: JoorManifestRouteUnaryProtocolRequest<
  typeof manifest
> = manifestUnaryProtocolRequest;
const manifestUnaryProtocolRequestAlias: JoorManifestUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestUnaryProtocolRequest;
manifestUnaryProtocolRequest.input.id.toUpperCase();
defaultManifestUnaryProtocolRequest.id.toUpperCase();
manifestUnaryProtocolRequestAlias.input.id.toUpperCase();
const manifestUnaryRouteProtocolRequest: JoorManifestUnaryRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestUnaryProtocolRequest;
manifestUnaryRouteProtocolRequest.input.id.toUpperCase();
const manifestRouteUnaryBody =
  manifestUnaryProtocolRequest satisfies JoorManifestRouteUnaryBody<
    typeof manifest
  >;
const manifestUnaryRouteBody =
  manifestUnaryRouteProtocolRequest satisfies JoorManifestUnaryRouteBody<
    typeof manifest
  >;
manifestRouteUnaryBody.input.id.toUpperCase();
manifestUnaryRouteBody.input.id.toUpperCase();
const manifestUnaryProtocolRequestUnion: JoorManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = manifestUnaryProtocolRequest;
const manifestUnaryProtocolRequestUnionAlias: JoorManifestUnaryProtocolRequestUnion<
  typeof manifest
> = manifestUnaryProtocolRequestUnion;
manifestUnaryProtocolRequestUnion.id.toUpperCase();
manifestUnaryProtocolRequestUnionAlias.id.toUpperCase();
const manifestUnaryRouteProtocolRequestUnion: JoorManifestUnaryRouteProtocolRequestUnion<
  typeof manifest
> = manifestUnaryRouteProtocolRequest;
manifestUnaryRouteProtocolRequestUnion.id.toUpperCase();
const manifestStreamProtocolRequest: JoorManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
const defaultManifestStreamProtocolRequest: JoorManifestRouteStreamProtocolRequest<
  typeof manifest
> = manifestStreamProtocolRequest;
const manifestStreamProtocolRequestAlias: JoorManifestStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamProtocolRequest;
manifestStreamProtocolRequest.input.userId.toUpperCase();
defaultManifestStreamProtocolRequest.input.userId.toUpperCase();
manifestStreamProtocolRequestAlias.input.userId.toUpperCase();
const manifestStreamRouteProtocolRequest: JoorManifestStreamRouteProtocolRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamProtocolRequest;
const manifestStreamRequest: JoorManifestRouteStreamRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamProtocolRequest;
const defaultManifestStreamRequest: JoorManifestRouteStreamRequest<
  typeof manifest
> = manifestStreamRequest;
const manifestStreamRouteRequest: JoorManifestStreamRouteRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamRequest;
const builtManifestStreamRequest = createManifestRouteStreamRequest(
  manifest,
  'users.watch',
  { userId: '1' }
);
const builtManifestStreamRouteRequest = createManifestStreamRouteRequest(
  manifest,
  'users.watch',
  { userId: '1' }
);
const builtRpcSubpathManifestStreamRequest =
  createRpcSubpathManifestRouteStreamRequest(manifest, 'users.watch', {
    userId: '1',
  });
const builtRpcSubpathManifestStreamRouteRequest =
  createRpcSubpathManifestStreamRouteRequest(manifest, 'users.watch', {
    userId: '1',
  });
const manifestSubpathStreamRequest: JoorSubpathManifestRouteStreamRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamRequest;
const manifestSubpathProtocolRequestAlias: JoorSubpathManifestProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestProtocolRequest;
const manifestSubpathUnaryProtocolRequest: JoorSubpathManifestUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestUnaryProtocolRequest;
const manifestSubpathStreamProtocolRequest: JoorSubpathManifestStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamProtocolRequest;
const manifestSubpathStreamRouteRequest: JoorSubpathManifestStreamRouteRequest<
  typeof manifest,
  'users.watch'
> = manifestSubpathStreamRequest;
manifestSubpathProtocolRequestAlias.input.id.toUpperCase();
manifestSubpathUnaryProtocolRequest.input.id.toUpperCase();
manifestSubpathStreamProtocolRequest.input.userId.toUpperCase();
manifestStreamRouteProtocolRequest.input.userId.toUpperCase();
manifestStreamRequest.input.userId.toUpperCase();
defaultManifestStreamRequest.input.userId.toUpperCase();
manifestStreamRouteRequest.input.userId.toUpperCase();
builtManifestStreamRequest.input.userId.toUpperCase();
builtManifestStreamRouteRequest.input.userId.toUpperCase();
builtRpcSubpathManifestStreamRequest.input.userId.toUpperCase();
builtRpcSubpathManifestStreamRouteRequest.input.userId.toUpperCase();
manifestSubpathStreamRouteRequest.input.userId.toUpperCase();
const manifestRouteStreamBody =
  manifestStreamProtocolRequest satisfies JoorManifestRouteStreamBody<
    typeof manifest
  >;
const manifestStreamRouteBody =
  manifestStreamRouteProtocolRequest satisfies JoorManifestStreamRouteBody<
    typeof manifest
  >;
manifestRouteStreamBody.input.userId.toUpperCase();
manifestStreamRouteBody.input.userId.toUpperCase();
const manifestStreamProtocolRequestUnion: JoorManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = manifestStreamProtocolRequest;
const manifestStreamProtocolRequestUnionAlias: JoorManifestStreamProtocolRequestUnion<
  typeof manifest
> = manifestStreamProtocolRequestUnion;
manifestStreamProtocolRequestUnion.input.userId.toUpperCase();
manifestStreamProtocolRequestUnionAlias.input.userId.toUpperCase();
const manifestSubpathProtocolRequestUnion: JoorSubpathManifestProtocolRequestUnion<
  typeof manifest
> = manifestProtocolRequestUnion;
const manifestSubpathUnaryProtocolRequestUnion: JoorSubpathManifestUnaryProtocolRequestUnion<
  typeof manifest
> = manifestUnaryProtocolRequestUnion;
const manifestSubpathStreamProtocolRequestUnion: JoorSubpathManifestStreamProtocolRequestUnion<
  typeof manifest
> = manifestStreamProtocolRequestUnion;
manifestSubpathProtocolRequestUnion.id.toUpperCase();
manifestSubpathUnaryProtocolRequestUnion.id.toUpperCase();
manifestSubpathStreamProtocolRequestUnion.input.userId.toUpperCase();
const manifestStreamRouteProtocolRequestUnion: JoorManifestStreamRouteProtocolRequestUnion<
  typeof manifest
> = manifestStreamRouteProtocolRequest;
manifestStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const manifestStreamRequestUnion: JoorManifestRouteStreamRequestUnion<
  typeof manifest
> = manifestStreamRequest;
const manifestStreamRouteRequestUnion: JoorManifestStreamRouteRequestUnion<
  typeof manifest
> = manifestStreamRouteRequest;
manifestStreamRequestUnion.input.userId.toUpperCase();
manifestStreamRouteRequestUnion.input.userId.toUpperCase();
const manifestBatchRequest: JoorManifestRouteBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = [manifestUnaryProtocolRequest];
const manifestBatchRequestWithPending: JoorManifestRouteBatchRequest<
  typeof manifest,
  [typeof manifestRouteRequest]
> = [manifestRouteRequest];
const defaultManifestBatchRequest: JoorManifestRouteBatchRequest<
  typeof manifest
> = manifestBatchRequest;
const manifestProtocolBatchRequest: JoorManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = [manifestUnaryProtocolRequest];
const manifestProtocolBatchRequestAlias: JoorManifestProtocolBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = manifestProtocolBatchRequest;
const manifestSubpathProtocolBatchRequest: JoorSubpathManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = manifestProtocolBatchRequestAlias;
manifestBatchRequest[0].input.id.toUpperCase();
manifestBatchRequestWithPending[0].headers['x-tenant-id'].toUpperCase();
manifestProtocolBatchRequest[0].traceId?.toUpperCase();
manifestSubpathProtocolBatchRequest[0].id.toUpperCase();
const defaultManifestBatchRequestFirst = defaultManifestBatchRequest[0];
if (defaultManifestBatchRequestFirst) {
  defaultManifestBatchRequestFirst.id.toUpperCase();
}
const manifestUnaryRouteBatchRequest: JoorManifestUnaryRouteBatchRequest<
  typeof manifest,
  [typeof manifestUnaryRouteProtocolRequest]
> = [manifestUnaryRouteProtocolRequest];
const defaultManifestUnaryRouteBatchRequest: JoorManifestUnaryRouteBatchRequest<
  typeof manifest
> = manifestUnaryRouteBatchRequest;
const manifestRouteUnaryProtocolBatchRequest: JoorManifestRouteUnaryProtocolBatchRequest<
  typeof manifest,
  [typeof manifestUnaryRouteProtocolRequest]
> = [manifestUnaryRouteProtocolRequest];
const manifestUnaryRouteProtocolBatchRequest: JoorManifestUnaryRouteProtocolBatchRequest<
  typeof manifest,
  [typeof manifestUnaryRouteProtocolRequest]
> = manifestRouteUnaryProtocolBatchRequest;
manifestUnaryRouteBatchRequest[0].input.id.toUpperCase();
manifestUnaryRouteProtocolBatchRequest[0].input.id.toUpperCase();
const defaultManifestUnaryRouteBatchRequestFirst =
  defaultManifestUnaryRouteBatchRequest[0];
if (defaultManifestUnaryRouteBatchRequestFirst) {
  defaultManifestUnaryRouteBatchRequestFirst.id.toUpperCase();
}
const readonlyManifestBatchRequest = [manifestUnaryProtocolRequest] as const;
const manifestReadonlyBatchBody: JoorManifestRouteBody<typeof manifest> =
  readonlyManifestBatchRequest;
manifestReadonlyBatchBody.length.toFixed();
const manifestBatchBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof readonlyManifestBatchRequest
> = [manifestRouteEnvelope];
const manifestRouteUnaryBodyResult: JoorManifestRouteUnaryBodyResult<
  typeof manifest
> = manifestBatchBodyResultFor;
const manifestUnaryRouteBodyResult: JoorManifestUnaryRouteBodyResult<
  typeof manifest
> = manifestRouteUnaryBodyResult;
if (!(manifestBatchBodyResultFor instanceof Response)) {
  const first = manifestBatchBodyResultFor[0];
  if (first.ok) first.data.name.toUpperCase();
}
const manifestRouteBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof manifestProtocolRequest
> = manifestRouteEnvelope;
const manifestRouteUnaryBodyResultFor: JoorManifestRouteUnaryBodyResultFor<
  typeof manifest,
  typeof manifestRouteUnaryBody
> = manifestRouteEnvelope;
const manifestUnaryRouteBodyResultFor: JoorManifestUnaryRouteBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = manifestRouteUnaryBodyResultFor;
const manifestRouteStreamBodyResult: JoorManifestRouteStreamBodyResult<
  typeof manifest
> = new Response();
const manifestStreamRouteBodyResult: JoorManifestStreamRouteBodyResult<
  typeof manifest
> = manifestRouteStreamBodyResult;
const manifestRouteStreamBodyResultFor: JoorManifestRouteStreamBodyResultFor<
  typeof manifest,
  typeof manifestRouteStreamBody
> = manifestRouteStreamBodyResult;
const manifestStreamRouteBodyResultFor: JoorManifestStreamRouteBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = manifestStreamRouteBodyResult;
// @ts-expect-error route-unary body result helpers reject stream bodies.
const _wrongManifestRouteUnaryBodyResultFor: JoorManifestRouteUnaryBodyResultFor<
  typeof manifest,
  // @ts-expect-error route-unary body result helpers reject stream bodies.
  typeof manifestRouteStreamBody
> = manifestRouteEnvelope;
const _wrongManifestRouteStreamBodyResultFor: JoorManifestRouteStreamBodyResultFor<
  typeof manifest,
  // @ts-expect-error route-stream body result helpers reject unary bodies.
  typeof manifestRouteUnaryBody
> = manifestRouteStreamBodyResult;
manifestRouteUnaryBodyResult.valueOf();
manifestUnaryRouteBodyResult.valueOf();
manifestRouteStreamBodyResultFor.headers.get('content-type');
manifestStreamRouteBodyResultFor.headers.get('content-type');
if (!(manifestRouteBodyResultFor instanceof Response)) {
  if (manifestRouteBodyResultFor.ok)
    manifestRouteBodyResultFor.data.name.toUpperCase();
}
if (!(manifestUnaryRouteBodyResultFor instanceof Response)) {
  if (manifestUnaryRouteBodyResultFor.ok)
    manifestUnaryRouteBodyResultFor.data.name.toUpperCase();
}
if (!(manifestRouteUnaryBodyResultFor instanceof Response)) {
  if (manifestRouteUnaryBodyResultFor.ok)
    manifestRouteUnaryBodyResultFor.data.name.toUpperCase();
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
  // @ts-expect-error manifest client batches reject stream request bodies.
  [typeof manifestStreamProtocolRequest]
> = [manifestStreamProtocolRequest];

// @ts-expect-error manifest protocol batches reject pending client requests.
const _wrongManifestProtocolBatchRequest: JoorManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof manifestRouteRequest]
> = [manifestRouteRequest];

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
// @ts-expect-error public manifests expose readonly procedure maps.
publicManifest.procedures = {};
// @ts-expect-error public manifest procedure maps expose readonly entries.
publicManifest.procedures['users.get'] = procedure;
const typedPublicManifest: RpcManifest<ManifestRoutes> = manifest;
typedPublicManifest.procedures['users.get'].output;
type PublicManifestRoutes = RpcManifestRoutes<typeof manifest>;
const publicManifestRouteId: RpcManifestRouteId<typeof manifest> = 'users.get';
publicManifestRouteId.toUpperCase();
const publicManifestRouteProcedure: RpcManifestRouteProcedure<
  typeof manifest,
  'users.get'
> = procedure;
const defaultPublicManifestRouteProcedure: RpcManifestRouteProcedure<
  typeof manifest
> = publicManifestRouteProcedure;
publicManifestRouteProcedure.output;
defaultPublicManifestRouteProcedure.input;
const publicManifestUnaryRouteProcedure: RpcManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = publicManifestRouteProcedure;
const defaultPublicManifestUnaryRouteProcedure: RpcManifestUnaryRouteProcedure<
  typeof manifest
> = publicManifestUnaryRouteProcedure;
publicManifestUnaryRouteProcedure.output;
defaultPublicManifestUnaryRouteProcedure.input;
const publicManifestStreamRouteProcedure: RpcManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = streamProcedure;
const defaultPublicManifestStreamRouteProcedure: RpcManifestStreamRouteProcedure<
  typeof manifest
> = publicManifestStreamRouteProcedure;
publicManifestStreamRouteProcedure.stream;
defaultPublicManifestStreamRouteProcedure.stream;
const rpcSubpathManifestUnaryRouteProcedure: RpcSubpathManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = publicManifestUnaryRouteProcedure;
rpcSubpathManifestUnaryRouteProcedure.output;
const rpcSubpathManifestStreamRouteProcedure: RpcSubpathManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRouteProcedure;
rpcSubpathManifestStreamRouteProcedure.stream;
const publicManifestUnaryRouteInput: RpcManifestUnaryRouteInput<
  typeof manifest,
  'users.get'
> = { id: '1' };
const defaultPublicManifestUnaryRouteInput: RpcManifestUnaryRouteInput<
  typeof manifest
> = publicManifestUnaryRouteInput;
publicManifestUnaryRouteInput.id.toUpperCase();
defaultPublicManifestUnaryRouteInput.id.toUpperCase();
const publicManifestStreamRouteInput: RpcManifestStreamRouteInput<
  typeof manifest,
  'users.watch'
> = { userId: '1' };
const defaultPublicManifestStreamRouteInput: RpcManifestStreamRouteInput<
  typeof manifest
> = publicManifestStreamRouteInput;
publicManifestStreamRouteInput.userId.toUpperCase();
defaultPublicManifestStreamRouteInput.userId.toUpperCase();
type PublicManifestStreamRouteOutputIsNever = [
  RpcManifestStreamRouteOutput<typeof manifest, 'users.watch'>,
] extends [never]
  ? true
  : false;
const publicManifestStreamRouteOutputIsNever: PublicManifestStreamRouteOutputIsNever = true;
publicManifestStreamRouteOutputIsNever.valueOf();
type RpcSubpathManifestStreamRouteOutputIsNever = [
  RpcSubpathManifestStreamRouteOutput<typeof manifest, 'users.watch'>,
] extends [never]
  ? true
  : false;
const rpcSubpathManifestStreamRouteOutputIsNever: RpcSubpathManifestStreamRouteOutputIsNever = true;
rpcSubpathManifestStreamRouteOutputIsNever.valueOf();
const publicManifestUnaryRouteOutput: RpcManifestUnaryRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
const defaultPublicManifestUnaryRouteOutput: RpcManifestUnaryRouteOutput<
  typeof manifest
> = publicManifestUnaryRouteOutput;
publicManifestUnaryRouteOutput.name.toUpperCase();
defaultPublicManifestUnaryRouteOutput.name.toUpperCase();
const publicManifestUnaryRouteHeaders: RpcManifestUnaryRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
const defaultPublicManifestUnaryRouteHeaders: RpcManifestUnaryRouteHeaders<
  typeof manifest
> = publicManifestUnaryRouteHeaders;
publicManifestUnaryRouteHeaders['x-tenant-id'].toUpperCase();
defaultPublicManifestUnaryRouteHeaders['x-tenant-id']?.toUpperCase();
const publicManifestStreamRouteHeaders: RpcManifestStreamRouteHeaders<
  typeof manifest,
  'users.watch'
> = {};
publicManifestStreamRouteHeaders.valueOf();
const publicManifestUnaryRouteClientHeaders: RpcManifestUnaryRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1', authorization: undefined };
publicManifestUnaryRouteClientHeaders.authorization?.toUpperCase();
const publicManifestStreamRouteClientHeaders: RpcManifestStreamRouteClientHeaders<
  typeof manifest,
  'users.watch'
> = {};
publicManifestStreamRouteClientHeaders.valueOf();
const publicManifestUnaryRouteResponseHeaders: RpcManifestUnaryRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
const defaultPublicManifestUnaryRouteResponseHeaders: RpcManifestUnaryRouteResponseHeaders<
  typeof manifest
> = publicManifestUnaryRouteResponseHeaders;
publicManifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
defaultPublicManifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
const publicManifestStreamRouteResponseHeaders: RpcManifestStreamRouteResponseHeaders<
  typeof manifest,
  'users.watch'
> = {};
const rpcSubpathManifestStreamRouteResponseHeaders: RpcSubpathManifestStreamRouteResponseHeaders<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRouteResponseHeaders;
rpcSubpathManifestStreamRouteResponseHeaders.valueOf();
const publicManifestStreamRouteEvent: RpcManifestStreamRouteEvent<
  typeof manifest,
  'users.watch'
> = { type: 'user.updated', userId: '1' };
publicManifestStreamRouteEvent.userId.toUpperCase();
const defaultPublicManifestStreamRouteEvent: RpcManifestStreamRouteEvent<
  typeof manifest
> = publicManifestStreamRouteEvent;
defaultPublicManifestStreamRouteEvent.userId.toUpperCase();
const publicManifestUnaryRouteHasHeaders: RpcManifestUnaryRouteHasHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestUnaryRouteHasHeaders.valueOf();
const publicManifestUnaryRouteRequiresHeaders: RpcManifestUnaryRouteRequiresHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestUnaryRouteRequiresHeaders.valueOf();
const publicManifestStreamRouteHasHeaders: RpcManifestStreamRouteHasHeaders<
  typeof manifest,
  'users.watch'
> = false;
publicManifestStreamRouteHasHeaders.valueOf();
const publicManifestStreamRouteRequiresHeaders: RpcManifestStreamRouteRequiresHeaders<
  typeof manifest,
  'users.watch'
> = false;
publicManifestStreamRouteRequiresHeaders.valueOf();
const publicManifestUnaryRouteHasResponseHeaders: RpcManifestUnaryRouteHasResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestUnaryRouteHasResponseHeaders.valueOf();
const publicManifestUnaryRouteRequiresResponseHeaders: RpcManifestUnaryRouteRequiresResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
const defaultPublicManifestUnaryRouteRequiresResponseHeaders: RpcManifestUnaryRouteRequiresResponseHeaders<
  typeof manifest
> = false;
publicManifestUnaryRouteRequiresResponseHeaders.valueOf();
defaultPublicManifestUnaryRouteRequiresResponseHeaders.valueOf();
const publicManifestStreamRouteHasResponseHeaders: RpcManifestStreamRouteHasResponseHeaders<
  typeof manifest,
  'users.watch'
> = false;
publicManifestStreamRouteHasResponseHeaders.valueOf();
const publicManifestStreamRouteRequiresResponseHeaders: RpcManifestStreamRouteRequiresResponseHeaders<
  typeof manifest,
  'users.watch'
> = false;
publicManifestStreamRouteRequiresResponseHeaders.valueOf();
const publicManifestStreamRouteError: RpcManifestStreamRouteError<
  typeof manifest,
  'users.watch'
> = manifestStreamRouteError;
const defaultPublicManifestStreamRouteError: RpcManifestStreamRouteError<
  typeof manifest
> = publicManifestStreamRouteError;
publicManifestStreamRouteError.code.toUpperCase();
defaultPublicManifestStreamRouteError.code.toUpperCase();
const publicManifestUnaryRouteErrorCode: RpcManifestUnaryRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
const defaultPublicManifestUnaryRouteErrorCode: RpcManifestUnaryRouteErrorCode<
  typeof manifest
> = publicManifestUnaryRouteErrorCode;
publicManifestUnaryRouteErrorCode.toUpperCase();
defaultPublicManifestUnaryRouteErrorCode.toUpperCase();
const publicManifestUnaryRouteErrorDetails: RpcManifestUnaryRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
const defaultPublicManifestUnaryRouteErrorDetails: RpcManifestUnaryRouteErrorDetails<
  typeof manifest
> = publicManifestUnaryRouteErrorDetails;
publicManifestUnaryRouteErrorDetails.message.toUpperCase();
defaultPublicManifestUnaryRouteErrorDetails.valueOf();
const publicManifestStreamRouteErrorCode: RpcManifestStreamRouteErrorCode<
  typeof manifest,
  'users.watch'
> = 'VALIDATION_ERROR';
const defaultPublicManifestStreamRouteErrorCode: RpcManifestStreamRouteErrorCode<
  typeof manifest
> = publicManifestStreamRouteErrorCode;
publicManifestStreamRouteErrorCode.toUpperCase();
defaultPublicManifestStreamRouteErrorCode.toUpperCase();
const publicManifestStreamRouteErrorDetails: RpcManifestStreamRouteErrorDetails<
  typeof manifest,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
const defaultPublicManifestStreamRouteErrorDetails: RpcManifestStreamRouteErrorDetails<
  typeof manifest
> = publicManifestStreamRouteErrorDetails;
publicManifestStreamRouteErrorDetails.valueOf();
defaultPublicManifestStreamRouteErrorDetails.valueOf();
const publicManifestRouteInput: RpcManifestRouteInput<
  typeof manifest,
  'users.get'
> = { id: '1' };
const defaultPublicManifestRouteInput: RpcManifestRouteInput<typeof manifest> =
  publicManifestRouteInput;
publicManifestRouteInput.id.toUpperCase();
if ('id' in defaultPublicManifestRouteInput) {
  defaultPublicManifestRouteInput.id.toUpperCase();
}
const rpcSubpathManifestRouteInput: RpcSubpathManifestRouteInput<
  typeof manifest,
  'users.get'
> = publicManifestRouteInput;
rpcSubpathManifestRouteInput.id.toUpperCase();
const publicManifestRouteOutput: RpcManifestRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
const defaultPublicManifestRouteOutput: RpcManifestRouteOutput<
  typeof manifest
> = publicManifestRouteOutput;
publicManifestRouteOutput.name.toUpperCase();
defaultPublicManifestRouteOutput.name.toUpperCase();
type PublicManifestRouteStreamOutputIsNever = [
  RpcManifestRouteOutput<typeof manifest, 'users.watch'>,
] extends [never]
  ? true
  : false;
const publicManifestRouteStreamOutputIsNever: PublicManifestRouteStreamOutputIsNever = true;
publicManifestRouteStreamOutputIsNever.valueOf();
const rpcSubpathManifestRouteOutput: RpcSubpathManifestRouteOutput<
  typeof manifest,
  'users.get'
> = publicManifestRouteOutput;
rpcSubpathManifestRouteOutput.name.toUpperCase();
const publicManifestRouteHeaders: RpcManifestRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
const defaultPublicManifestRouteHeaders: RpcManifestRouteHeaders<
  typeof manifest
> = publicManifestRouteHeaders;
publicManifestRouteHeaders['x-tenant-id'].toUpperCase();
defaultPublicManifestRouteHeaders['x-tenant-id']?.toUpperCase();
const publicManifestRouteClientHeaders: RpcManifestRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1', authorization: undefined };
// @ts-expect-error public manifest client headers are readonly.
publicManifestRouteClientHeaders['x-tenant-id'] = 'tenant-2';
const defaultPublicManifestRouteClientHeaders: RpcManifestRouteClientHeaders<
  typeof manifest
> = publicManifestRouteClientHeaders;
publicManifestRouteClientHeaders.authorization?.toUpperCase();
defaultPublicManifestRouteClientHeaders['x-tenant-id']?.toUpperCase();
const rpcSubpathManifestRouteClientHeaders: RpcSubpathManifestRouteClientHeaders<
  typeof manifest,
  'users.get'
> = publicManifestRouteClientHeaders;
rpcSubpathManifestRouteClientHeaders['x-tenant-id'].toUpperCase();
const publicManifestRouteHasHeaders: RpcManifestRouteHasHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestRouteHasHeaders.valueOf();
const publicManifestRouteRequiresHeaders: RpcManifestRouteRequiresHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestRouteRequiresHeaders.valueOf();
const publicManifestRouteRequestOptions: RpcManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = { headers: publicManifestRouteClientHeaders };
// @ts-expect-error public manifest route request options are readonly.
publicManifestRouteRequestOptions.headers = publicManifestRouteClientHeaders;
const defaultPublicManifestRouteRequestOptions: RpcManifestRouteRequestOptions<
  typeof manifest
> = publicManifestRouteRequestOptions;
const publicManifestUnaryRouteRequestOptions: RpcManifestUnaryRouteRequestOptions<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequestOptions;
const defaultPublicManifestUnaryRouteRequestOptions: RpcManifestUnaryRouteRequestOptions<
  typeof manifest
> = publicManifestUnaryRouteRequestOptions;
const publicManifestStreamRouteRequestOptions: RpcManifestStreamRouteRequestOptions<
  typeof manifest,
  'users.watch'
> = {};
const defaultPublicManifestStreamRouteRequestOptions: RpcManifestStreamRouteRequestOptions<
  typeof manifest
> = publicManifestStreamRouteRequestOptions;
publicManifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultPublicManifestRouteRequestOptions.headers?.[
  'x-tenant-id'
]?.toUpperCase();
publicManifestUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultPublicManifestUnaryRouteRequestOptions.headers?.[
  'x-tenant-id'
]?.toUpperCase();
defaultPublicManifestStreamRouteRequestOptions.valueOf();
const rpcSubpathManifestRouteRequestOptions: RpcSubpathManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequestOptions;
const rpcSubpathManifestUnaryRouteRequestOptions: RpcSubpathManifestUnaryRouteRequestOptions<
  typeof manifest,
  'users.get'
> = publicManifestUnaryRouteRequestOptions;
const rpcSubpathManifestStreamRouteRequestOptions: RpcSubpathManifestStreamRouteRequestOptions<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRouteRequestOptions;
rpcSubpathManifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathManifestUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathManifestStreamRouteRequestOptions.valueOf();
const publicManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }, publicManifestRouteRequestOptions];
// @ts-expect-error public manifest route client args are readonly tuples.
publicManifestRouteClientArgs[0] = { id: '2' };
const defaultPublicManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest
> = publicManifestRouteClientArgs;
const publicManifestUnaryRouteClientArgs: RpcManifestUnaryRouteClientArgs<
  typeof manifest,
  'users.get'
> = publicManifestRouteClientArgs;
const defaultPublicManifestUnaryRouteClientArgs: RpcManifestUnaryRouteClientArgs<
  typeof manifest
> = publicManifestUnaryRouteClientArgs;
const publicManifestStreamRouteClientArgs: RpcManifestStreamRouteClientArgs<
  typeof manifest,
  'users.watch'
> = [{ userId: '1' }, publicManifestStreamRouteRequestOptions];
const defaultPublicManifestStreamRouteClientArgs: RpcManifestStreamRouteClientArgs<
  typeof manifest
> = publicManifestStreamRouteClientArgs;
publicManifestRouteClientArgs[0].id.toUpperCase();
defaultPublicManifestRouteClientArgs[0].id.toUpperCase();
publicManifestUnaryRouteClientArgs[0].id.toUpperCase();
defaultPublicManifestUnaryRouteClientArgs[0].id.toUpperCase();
publicManifestStreamRouteClientArgs[0].userId.toUpperCase();
defaultPublicManifestStreamRouteClientArgs[0].userId.toUpperCase();
const rpcSubpathManifestRouteClientArgs: RpcSubpathManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = publicManifestRouteClientArgs;
const rpcSubpathManifestUnaryRouteClientArgs: RpcSubpathManifestUnaryRouteClientArgs<
  typeof manifest,
  'users.get'
> = publicManifestUnaryRouteClientArgs;
const rpcSubpathManifestStreamRouteClientArgs: RpcSubpathManifestStreamRouteClientArgs<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRouteClientArgs;
rpcSubpathManifestRouteClientArgs[0].id.toUpperCase();
rpcSubpathManifestUnaryRouteClientArgs[0].id.toUpperCase();
rpcSubpathManifestStreamRouteClientArgs[0].userId.toUpperCase();
const publicOptionalManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest,
  'users.authenticated'
> = [{ ok: true }];
publicOptionalManifestRouteClientArgs[0].ok.valueOf();
const defaultPublicOptionalManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest
> = publicOptionalManifestRouteClientArgs;
defaultPublicOptionalManifestRouteClientArgs[0].ok.valueOf();
// @ts-expect-error required public manifest route headers need options.
const _missingPublicManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }];
_missingPublicManifestRouteClientArgs[0].id.toUpperCase();
const _missingDefaultPublicManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest
> =
  // @ts-expect-error default public manifest route client args preserve route-specific required headers.
  [{ id: '1' }];
_missingDefaultPublicManifestRouteClientArgs[0].valueOf();
const _wrongPublicManifestRouteRequestOptions: RpcManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = {
  headers: {
    // @ts-expect-error public manifest route header values must match the route schema.
    'x-tenant-id': 1,
  },
};
_wrongPublicManifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
const publicManifestRouteResponseHeaders: RpcManifestRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
publicManifestRouteResponseHeaders['cache-control'].toUpperCase();
const publicManifestRouteStreamResponseHeaders: RpcManifestRouteResponseHeaders<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRouteResponseHeaders;
publicManifestRouteStreamResponseHeaders.valueOf();
const publicManifestRouteHasResponseHeaders: RpcManifestRouteHasResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
publicManifestRouteHasResponseHeaders.valueOf();
const publicManifestRouteRequiresResponseHeaders: RpcManifestRouteRequiresResponseHeaders<
  typeof manifest,
  'users.get'
> = true;
const defaultPublicManifestRouteRequiresResponseHeaders: RpcManifestRouteRequiresResponseHeaders<
  typeof manifest
> = false;
publicManifestRouteRequiresResponseHeaders.valueOf();
defaultPublicManifestRouteRequiresResponseHeaders.valueOf();
const publicManifestRouteError: RpcManifestRouteError<
  typeof manifest,
  'users.get'
> = {
  code: 'NOT_FOUND',
  message: 'Missing',
  status: 404,
  details: { message: 'Missing' },
};
const defaultPublicManifestRouteError: RpcManifestRouteError<typeof manifest> =
  publicManifestRouteError;
publicManifestRouteError.code.toUpperCase();
defaultPublicManifestRouteError.code.toUpperCase();
const publicManifestRouteErrorCode: RpcManifestRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
const defaultPublicManifestRouteErrorCode: RpcManifestRouteErrorCode<
  typeof manifest
> = publicManifestRouteErrorCode;
publicManifestRouteErrorCode.toUpperCase();
defaultPublicManifestRouteErrorCode.toUpperCase();
const publicManifestRouteErrorDetails: RpcManifestRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
const defaultPublicManifestRouteErrorDetails: RpcManifestRouteErrorDetails<
  typeof manifest
> = publicManifestRouteErrorDetails;
publicManifestRouteErrorDetails.message.toUpperCase();
defaultPublicManifestRouteErrorDetails.valueOf();
const publicManifestUnaryRouteId: RpcManifestUnaryRouteId<typeof manifest> =
  'users.authenticated';
publicManifestUnaryRouteId.toUpperCase();
const publicManifestStreamRouteId: RpcManifestStreamRouteId<typeof manifest> =
  'users.watch';
publicManifestStreamRouteId.toUpperCase();
const publicManifestRouteStreamEvent: RpcManifestRouteStreamEvent<
  typeof manifest,
  'users.watch'
> = { type: 'user.updated', userId: '1' };
publicManifestRouteStreamEvent.userId.toUpperCase();
const defaultPublicManifestRouteStreamEvent: RpcManifestRouteStreamEvent<
  typeof manifest
> = publicManifestRouteStreamEvent;
defaultPublicManifestRouteStreamEvent.userId.toUpperCase();
const rpcSubpathManifestRouteStreamEvent: RpcSubpathManifestRouteStreamEvent<
  typeof manifest,
  'users.watch'
> = publicManifestRouteStreamEvent;
rpcSubpathManifestRouteStreamEvent.userId.toUpperCase();
const publicManifestProtocolRequest: RpcManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = { id: 'users.get', input: { id: '1' } };
// @ts-expect-error public manifest protocol request ids are readonly.
publicManifestProtocolRequest.id = 'users.authenticated';
const defaultPublicManifestProtocolRequest: RpcManifestRouteProtocolRequest<
  typeof manifest
> = publicManifestProtocolRequest;
const publicManifestProtocolRequestAlias: RpcManifestProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestProtocolRequest;
publicManifestProtocolRequest.input.id.toUpperCase();
if (defaultPublicManifestProtocolRequest.id === 'users.get') {
  defaultPublicManifestProtocolRequest.input.id.toUpperCase();
}
publicManifestProtocolRequestAlias.input.id.toUpperCase();
// @ts-expect-error default public manifest protocol requests preserve id/input correlation.
const _wrongDefaultPublicManifestProtocolRequest: RpcManifestRouteProtocolRequest<
  typeof manifest
> = { id: 'users.get', input: { userId: '1' } };
_wrongDefaultPublicManifestProtocolRequest.id.toUpperCase();
const publicManifestProtocolRequestUnion: RpcManifestRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestProtocolRequest;
const publicManifestProtocolRequestUnionAlias: RpcManifestProtocolRequestUnion<
  typeof manifest
> = publicManifestProtocolRequestUnion;
publicManifestProtocolRequestUnion.id.toUpperCase();
publicManifestProtocolRequestUnionAlias.id.toUpperCase();
const publicManifestRouteRequest: RpcManifestRouteRequest<
  typeof manifest,
  'users.get'
> = manifestRouteRequest;
// @ts-expect-error public manifest route request ids are readonly.
publicManifestRouteRequest.id = 'users.authenticated';
// @ts-expect-error public manifest route request headers are readonly.
publicManifestRouteRequest.headers = publicManifestRouteClientHeaders;
const defaultPublicManifestRouteRequest: RpcManifestRouteRequest<
  typeof manifest
> = publicManifestRouteRequest;
publicManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
if (defaultPublicManifestRouteRequest.id === 'users.get') {
  defaultPublicManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
  defaultPublicManifestRouteRequest.input.id.toUpperCase();
}
const publicManifestUnaryRouteRequest: RpcManifestUnaryRouteRequest<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequest;
const defaultPublicManifestUnaryRouteRequest: RpcManifestUnaryRouteRequest<
  typeof manifest
> = publicManifestUnaryRouteRequest;
publicManifestUnaryRouteRequest.input.id.toUpperCase();
defaultPublicManifestUnaryRouteRequest.id.toUpperCase();
// @ts-expect-error default public manifest route requests preserve route-specific required headers.
const _missingDefaultPublicManifestRouteRequestHeaders: RpcManifestRouteRequest<
  typeof manifest
> = { id: 'users.get', input: { id: '1' } };
_missingDefaultPublicManifestRouteRequestHeaders.id.toUpperCase();
const publicManifestRouteRequestUnion: RpcManifestRouteRequestUnion<
  typeof manifest
> = publicManifestRouteRequest;
publicManifestRouteRequestUnion.id.toUpperCase();
const publicManifestUnaryRouteRequestUnion: RpcManifestUnaryRouteRequestUnion<
  typeof manifest
> = publicManifestUnaryRouteRequest;
publicManifestUnaryRouteRequestUnion.id.toUpperCase();
const rpcSubpathManifestRouteRequest: RpcSubpathManifestRouteRequest<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequest;
const rpcSubpathManifestRouteRequestUnion: RpcSubpathManifestRouteRequestUnion<
  typeof manifest
> = rpcSubpathManifestRouteRequest;
rpcSubpathManifestRouteRequestUnion.id.toUpperCase();
const publicManifestUnaryProtocolRequest: RpcManifestRouteUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestProtocolRequest;
const defaultPublicManifestUnaryProtocolRequest: RpcManifestRouteUnaryProtocolRequest<
  typeof manifest
> = publicManifestUnaryProtocolRequest;
const publicManifestUnaryProtocolRequestAlias: RpcManifestUnaryProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestUnaryProtocolRequest;
publicManifestUnaryProtocolRequest.input.id.toUpperCase();
defaultPublicManifestUnaryProtocolRequest.id.toUpperCase();
publicManifestUnaryProtocolRequestAlias.input.id.toUpperCase();
const publicManifestUnaryRouteProtocolRequest: RpcManifestUnaryRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestUnaryProtocolRequest;
publicManifestUnaryRouteProtocolRequest.input.id.toUpperCase();
const publicManifestUnaryProtocolRequestUnion: RpcManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryProtocolRequest;
const publicManifestUnaryProtocolRequestUnionAlias: RpcManifestUnaryProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryProtocolRequestUnion;
publicManifestUnaryProtocolRequestUnion.id.toUpperCase();
publicManifestUnaryProtocolRequestUnionAlias.id.toUpperCase();
const publicManifestUnaryRouteProtocolRequestUnion: RpcManifestUnaryRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryRouteProtocolRequest;
publicManifestUnaryRouteProtocolRequestUnion.id.toUpperCase();
const publicManifestStreamProtocolRequest: RpcManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
const defaultPublicManifestStreamProtocolRequest: RpcManifestRouteStreamProtocolRequest<
  typeof manifest
> = publicManifestStreamProtocolRequest;
const publicManifestStreamProtocolRequestAlias: RpcManifestStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamProtocolRequest;
publicManifestStreamProtocolRequest.input.userId.toUpperCase();
defaultPublicManifestStreamProtocolRequest.input.userId.toUpperCase();
publicManifestStreamProtocolRequestAlias.input.userId.toUpperCase();
const publicManifestStreamRouteProtocolRequest: RpcManifestStreamRouteProtocolRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamProtocolRequest;
const publicManifestStreamRequest: RpcManifestRouteStreamRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamProtocolRequest;
const defaultPublicManifestStreamRequest: RpcManifestRouteStreamRequest<
  typeof manifest
> = publicManifestStreamRequest;
const publicManifestStreamRouteRequest: RpcManifestStreamRouteRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRequest;
const publicManifestSubpathStreamRequest: RpcSubpathManifestRouteStreamRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamRequest;
const publicManifestSubpathStreamRouteRequest: RpcSubpathManifestStreamRouteRequest<
  typeof manifest,
  'users.watch'
> = publicManifestSubpathStreamRequest;
publicManifestStreamRouteProtocolRequest.input.userId.toUpperCase();
publicManifestStreamRequest.input.userId.toUpperCase();
defaultPublicManifestStreamRequest.input.userId.toUpperCase();
publicManifestStreamRouteRequest.input.userId.toUpperCase();
publicManifestSubpathStreamRouteRequest.input.userId.toUpperCase();
const publicManifestStreamProtocolRequestUnion: RpcManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamProtocolRequest;
const publicManifestStreamProtocolRequestUnionAlias: RpcManifestStreamProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamProtocolRequestUnion;
publicManifestStreamProtocolRequestUnion.input.userId.toUpperCase();
publicManifestStreamProtocolRequestUnionAlias.input.userId.toUpperCase();
const publicManifestStreamRouteProtocolRequestUnion: RpcManifestStreamRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamRouteProtocolRequest;
publicManifestStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const publicManifestStreamRequestUnion: RpcManifestRouteStreamRequestUnion<
  typeof manifest
> = publicManifestStreamRequest;
const publicManifestStreamRouteRequestUnion: RpcManifestStreamRouteRequestUnion<
  typeof manifest
> = publicManifestStreamRouteRequest;
publicManifestStreamRequestUnion.input.userId.toUpperCase();
publicManifestStreamRouteRequestUnion.input.userId.toUpperCase();
const publicManifestBody: RpcManifestBody<typeof manifest> =
  publicManifestProtocolRequest;
const publicManifestRouteUnaryBody =
  publicManifestUnaryProtocolRequest satisfies RpcManifestRouteUnaryBody<
    typeof manifest
  >;
const publicManifestUnaryRouteBody =
  publicManifestUnaryRouteProtocolRequest satisfies RpcManifestUnaryRouteBody<
    typeof manifest
  >;
publicManifestRouteUnaryBody.input.id.toUpperCase();
publicManifestUnaryRouteBody.input.id.toUpperCase();
const publicManifestRouteStreamBody =
  publicManifestStreamProtocolRequest satisfies RpcManifestRouteStreamBody<
    typeof manifest
  >;
const publicManifestStreamRouteBody =
  publicManifestStreamRouteProtocolRequest satisfies RpcManifestStreamRouteBody<
    typeof manifest
  >;
publicManifestRouteStreamBody.input.userId.toUpperCase();
publicManifestStreamRouteBody.input.userId.toUpperCase();
const publicManifestRouteUnaryBodyResult: RpcManifestRouteUnaryBodyResult<
  typeof manifest
> = manifestRouteEnvelope;
const publicManifestUnaryRouteBodyResult: RpcManifestUnaryRouteBodyResult<
  typeof manifest
> = publicManifestRouteUnaryBodyResult;
const publicManifestRouteUnaryBodyResultFor: RpcManifestRouteUnaryBodyResultFor<
  typeof manifest,
  typeof publicManifestRouteUnaryBody
> = manifestRouteEnvelope;
const publicManifestUnaryRouteBodyResultFor: RpcManifestUnaryRouteBodyResultFor<
  typeof manifest,
  typeof publicManifestUnaryRouteBody
> = publicManifestRouteUnaryBodyResultFor;
const publicManifestRouteStreamBodyResult: RpcManifestRouteStreamBodyResult<
  typeof manifest
> = new Response();
const publicManifestStreamRouteBodyResult: RpcManifestStreamRouteBodyResult<
  typeof manifest
> = publicManifestRouteStreamBodyResult;
const publicManifestRouteStreamBodyResultFor: RpcManifestRouteStreamBodyResultFor<
  typeof manifest,
  typeof publicManifestRouteStreamBody
> = publicManifestRouteStreamBodyResult;
const publicManifestStreamRouteBodyResultFor: RpcManifestStreamRouteBodyResultFor<
  typeof manifest,
  typeof publicManifestStreamRouteBody
> = publicManifestStreamRouteBodyResult;
// @ts-expect-error RpcManifest route-unary body result helpers reject stream bodies.
const _wrongPublicManifestRouteUnaryBodyResultFor: RpcManifestRouteUnaryBodyResultFor<
  typeof manifest,
  // @ts-expect-error RpcManifest route-unary body result helpers reject stream bodies.
  typeof publicManifestRouteStreamBody
> = manifestRouteEnvelope;
const _wrongPublicManifestRouteStreamBodyResultFor: RpcManifestRouteStreamBodyResultFor<
  typeof manifest,
  // @ts-expect-error RpcManifest route-stream body result helpers reject unary bodies.
  typeof publicManifestRouteUnaryBody
> = publicManifestRouteStreamBodyResult;
publicManifestRouteUnaryBodyResult.valueOf();
publicManifestUnaryRouteBodyResult.valueOf();
publicManifestRouteStreamBodyResultFor.headers.get('content-type');
publicManifestStreamRouteBodyResultFor.headers.get('content-type');
if (!(publicManifestRouteUnaryBodyResultFor instanceof Response)) {
  if (publicManifestRouteUnaryBodyResultFor.ok)
    publicManifestRouteUnaryBodyResultFor.data.name.toUpperCase();
}
if (!(publicManifestUnaryRouteBodyResultFor instanceof Response)) {
  if (publicManifestUnaryRouteBodyResultFor.ok)
    publicManifestUnaryRouteBodyResultFor.data.name.toUpperCase();
}
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
// @ts-expect-error public manifest route batches are readonly tuples.
publicManifestBatchRequest[0] = publicManifestUnaryProtocolRequest;
const publicManifestBatchRequestWithPending: RpcManifestRouteBatchRequest<
  typeof manifest,
  [typeof publicManifestRouteRequest]
> = [publicManifestRouteRequest];
const publicManifestRouteBatchRequestUnion: RpcManifestRouteBatchRequestUnion<
  typeof manifest
> = publicManifestRouteRequest;
const defaultPublicManifestBatchRequest: RpcManifestRouteBatchRequest<
  typeof manifest
> = publicManifestBatchRequest;
const publicManifestRouteProtocolBatchRequest: RpcManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryProtocolRequest]
> = [publicManifestUnaryProtocolRequest];
// @ts-expect-error public manifest protocol batches are readonly tuples.
publicManifestRouteProtocolBatchRequest[0] =
  publicManifestUnaryProtocolRequest;
const publicManifestProtocolBatchRequest: RpcManifestProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryProtocolRequest]
> = publicManifestRouteProtocolBatchRequest;
const rpcSubpathManifestRouteProtocolBatchRequest: RpcSubpathManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryProtocolRequest]
> = publicManifestProtocolBatchRequest;
const publicManifestUnaryRouteBatchRequest: RpcManifestUnaryRouteBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryRouteProtocolRequest]
> = [publicManifestUnaryRouteProtocolRequest];
const defaultPublicManifestUnaryRouteBatchRequest: RpcManifestUnaryRouteBatchRequest<
  typeof manifest
> = publicManifestUnaryRouteBatchRequest;
const publicManifestRouteUnaryBatchRequestUnion: RpcManifestRouteUnaryBatchRequestUnion<
  typeof manifest
> = publicManifestRouteBatchRequestUnion;
const publicManifestUnaryRouteBatchRequestUnion: RpcManifestUnaryRouteBatchRequestUnion<
  typeof manifest
> = publicManifestRouteUnaryBatchRequestUnion;
const publicManifestRouteUnaryProtocolBatchRequest: RpcManifestRouteUnaryProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryRouteProtocolRequest]
> = [publicManifestUnaryRouteProtocolRequest];
const publicManifestUnaryRouteProtocolBatchRequest: RpcManifestUnaryRouteProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryRouteProtocolRequest]
> = publicManifestRouteUnaryProtocolBatchRequest;
const defaultPublicManifestBatchRequestFirst =
  defaultPublicManifestBatchRequest[0];
if (defaultPublicManifestBatchRequestFirst) {
  defaultPublicManifestBatchRequestFirst.id.toUpperCase();
}
publicManifestBatchRequestWithPending[0].headers['x-tenant-id'].toUpperCase();
publicManifestUnaryRouteBatchRequestUnion.id.toUpperCase();
rpcSubpathManifestRouteProtocolBatchRequest[0].input.id.toUpperCase();
publicManifestUnaryRouteBatchRequest[0].input.id.toUpperCase();
publicManifestUnaryRouteProtocolBatchRequest[0].input.id.toUpperCase();
const defaultPublicManifestUnaryRouteBatchRequestFirst =
  defaultPublicManifestUnaryRouteBatchRequest[0];
if (defaultPublicManifestUnaryRouteBatchRequestFirst) {
  defaultPublicManifestUnaryRouteBatchRequestFirst.id.toUpperCase();
}
const publicManifestBatchResults: RpcManifestRouteBatchResults<
  typeof manifest,
  readonly [typeof publicManifestRouteRequest]
> = [manifestRouteEnvelope];
// @ts-expect-error public manifest route batch results are readonly tuples.
publicManifestBatchResults[0] = manifestRouteEnvelope;
const publicManifestUnaryRouteBatchResults: RpcManifestUnaryRouteBatchResults<
  typeof manifest,
  readonly [typeof publicManifestUnaryRouteRequest]
> = publicManifestBatchResults;
const defaultPublicManifestBatchResults: RpcManifestRouteBatchResults<
  typeof manifest
> = publicManifestBatchResults;
const defaultPublicManifestUnaryBatchResults: RpcManifestUnaryRouteBatchResults<
  typeof manifest
> = publicManifestUnaryRouteBatchResults;
publicManifestUnaryRouteBatchResults[0].id.toUpperCase();
const defaultPublicManifestBatchResult = defaultPublicManifestBatchResults[0];
if (defaultPublicManifestBatchResult) {
  defaultPublicManifestBatchResult.id.toUpperCase();
}
const defaultPublicManifestUnaryBatchResult =
  defaultPublicManifestUnaryBatchResults[0];
if (defaultPublicManifestUnaryBatchResult) {
  defaultPublicManifestUnaryBatchResult.id.toUpperCase();
}
const publicManifestEnvelopeUnion: RpcManifestRouteEnvelopeUnion<
  typeof manifest
> = manifestRouteEnvelope;
const publicManifestUnaryEnvelope: RpcManifestUnaryRouteEnvelope<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
const defaultPublicManifestUnaryEnvelope: RpcManifestUnaryRouteEnvelope<
  typeof manifest
> = publicManifestUnaryEnvelope;
publicManifestUnaryEnvelope.id.toUpperCase();
defaultPublicManifestUnaryEnvelope.id.toUpperCase();
const publicManifestUnaryEnvelopeUnion: RpcManifestUnaryRouteEnvelopeUnion<
  typeof manifest
> = publicManifestUnaryEnvelope;
publicManifestUnaryEnvelopeUnion.id.toUpperCase();
const publicManifestResultUnion: RpcManifestRouteResultUnion<typeof manifest> =
  publicManifestEnvelopeUnion;
const publicManifestUnaryResult: RpcManifestUnaryRouteResult<
  typeof manifest,
  'users.get'
> = publicManifestUnaryEnvelope;
const defaultPublicManifestUnaryResult: RpcManifestUnaryRouteResult<
  typeof manifest
> = publicManifestUnaryResult;
publicManifestUnaryResult.id.toUpperCase();
defaultPublicManifestUnaryResult.id.toUpperCase();
const publicManifestUnaryResultUnion: RpcManifestUnaryRouteResultUnion<
  typeof manifest
> = publicManifestUnaryResult;
publicManifestUnaryResultUnion.id.toUpperCase();
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
  // @ts-expect-error RpcManifest client batches reject stream request bodies.
  [typeof publicManifestStreamProtocolRequest]
> = [publicManifestStreamProtocolRequest];

// @ts-expect-error RpcManifest protocol batches reject pending client requests.
const _wrongPublicManifestProtocolBatchRequest: RpcManifestRouteProtocolBatchRequest<
  typeof manifest,
  [typeof publicManifestRouteRequest]
> = [publicManifestRouteRequest];

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

const rootFetchRequestSource: ContextRequestSource = createFetchRequestSource(
  new Request('https://example.com/rpc', {
    headers: { 'x-tenant-id': 'tenant_1' },
    method: 'POST',
  })
);
rootFetchRequestSource.getHeader('x-tenant-id')?.toUpperCase();
// @ts-expect-error request sources expose readonly URLs.
rootFetchRequestSource.url = 'https://example.com/other';
// @ts-expect-error request source header readers are readonly.
rootFetchRequestSource.getHeader = () => null;
// @ts-expect-error request source header factories are readonly.
rootFetchRequestSource.toHeaders = () => new Headers();
// @ts-expect-error request source request factories are readonly.
rootFetchRequestSource.toRequest = () => new Request('https://example.com/rpc');
const rootRuntimeContext = createRuntimeContext<
  RootPluginServices,
  { 'x-tenant-id': string },
  { 'cache-control': string },
  { userId: string }
>(
  rootFetchRequestSource,
  'trace-root',
  rootPluginServices,
  { 'x-tenant-id': 'tenant_1' },
  { userId: 'user_1' }
);
rootRuntimeContext.services.users.findById('1').name.toUpperCase();
rootRuntimeContext.headers['x-tenant-id'].toUpperCase();
rootRuntimeContext.auth.userId.toUpperCase();
// @ts-expect-error runtime contexts expose readonly services.
rootRuntimeContext.services = rootPluginServices;
// @ts-expect-error runtime context success helpers are readonly.
rootRuntimeContext.ok = (data) => ({ kind: 'success', data });
// @ts-expect-error runtime context error helpers are readonly.
rootRuntimeContext.error = (code, details) => ({
  kind: 'error',
  error: { code, details, status: 400, message: code },
});
rootRuntimeContext
  .ok({ id: '1' }, { 'cache-control': 'private' })
  .headers['cache-control'].toUpperCase();

const handlerOptions: HandlerOptions<readonly [typeof usersPlugin]> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
};
// @ts-expect-error handler options expose readonly path settings.
handlerOptions.path = '/other';
const corsHandlerOptions: HandlerOptions = {
  cors: {
    origin: 'https://example.com',
    headers: ['content-type'],
    methods: ['POST'],
  },
};
// @ts-expect-error handler option CORS settings are readonly.
corsHandlerOptions.cors = false;
// @ts-expect-error handler option CORS header lists are readonly.
corsHandlerOptions.cors?.headers?.push('authorization');
const handlerOptionServices: HandlerOptionServices<typeof handlerOptions> =
  procedureServices;
handlerOptionServices.users.findById('1').name.toUpperCase();
const handlerHookContext: HandlerHookContext<RootPluginServices> = {
  services: rootPluginServices,
  body: manifestRouteRequest,
};
handlerHookContext.services.users.findById('1').name.toUpperCase();
// @ts-expect-error handler hook contexts expose readonly services.
handlerHookContext.services = rootPluginServices;
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
const exactManifestHandlerHookContext: HandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  services: rootPluginServices,
  body: manifestRouteRequest,
};
exactManifestHandlerHookContext.body?.input.id.toUpperCase();
const rpcSubpathExactManifestHandlerHookContext: RpcSubpathHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactManifestHandlerHookContext;
rpcSubpathExactManifestHandlerHookContext.body?.input.id.toUpperCase();
const manifestUnaryRouteHandlerHookContext: RpcManifestUnaryRouteHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  services: rootPluginServices,
  body: manifestUnaryRouteBody,
};
const manifestStreamRouteHandlerHookContext: RpcManifestStreamRouteHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  services: rootPluginServices,
  body: manifestStreamRouteBody,
};
const rpcSubpathManifestUnaryRouteHandlerHookContext: RpcSubpathManifestUnaryRouteHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerHookContext;
const rpcSubpathManifestStreamRouteHandlerHookContext: RpcSubpathManifestStreamRouteHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerHookContext;
if (
  manifestUnaryRouteHandlerHookContext.body !== undefined &&
  'id' in manifestUnaryRouteHandlerHookContext.body
) {
  manifestUnaryRouteHandlerHookContext.body.input.valueOf();
}
manifestStreamRouteHandlerHookContext.body?.input.userId.toUpperCase();
rpcSubpathManifestUnaryRouteHandlerHookContext.services.users
  .findById('1')
  .name.toUpperCase();
rpcSubpathManifestStreamRouteHandlerHookContext.body?.input.userId.toUpperCase();
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
const _wrongManifestUnaryRouteHandlerHookContext: RpcManifestUnaryRouteHandlerHookContextFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  services: rootPluginServices,
  // @ts-expect-error unary route hook contexts reject stream route bodies.
  body: manifestStreamRouteBody,
};
_wrongManifestUnaryRouteHandlerHookContext.services.users
  .findById('1')
  .name.toUpperCase();
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
interface HookAppRequest extends Request {
  readonly requestId: string;
}
const hookAppRequest = Object.assign(
  new Request('https://example.com/rpc'),
  { requestId: 'req_1' }
) as HookAppRequest;
const typedRequestHandlerHooks: HandlerHooks<
  RootPluginServices,
  typeof manifestRouteRequest,
  HookAppRequest
> = {
  beforeRequest(request, context) {
    request.requestId.toUpperCase();
    context.body?.input.id.toUpperCase();
    return undefined;
  },
  afterResponse(response, request, context) {
    request.requestId.toUpperCase();
    context.body?.input.id.toUpperCase();
    return response;
  },
};
typedRequestHandlerHooks.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
typedRequestHandlerHooks.beforeRequest?.(
  // @ts-expect-error typed handler hooks preserve custom request types.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const requestTypedConfig = defineConfig<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
>({
  plugins: [usersPlugin] as const,
  hooks: typedRequestHandlerHooks,
});
const requestTypedConfigWithoutHooks = defineConfig<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
>({
  plugins: [usersPlugin] as const,
});
requestTypedConfig.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedConfig.hooks?.beforeRequest?.(
  // @ts-expect-error typed configs preserve custom request types.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const requestTypedConfigRequest: HandlerOptionsRequest<
  typeof requestTypedConfig
> = hookAppRequest;
requestTypedConfigRequest.requestId.toUpperCase();
const requestTypedJoorConfigRequest: JoorConfigRequest<
  typeof requestTypedConfig
> = hookAppRequest;
const requestTypedConfigWithoutHooksRequest: JoorConfigRequest<
  typeof requestTypedConfigWithoutHooks
> = hookAppRequest;
requestTypedConfigWithoutHooksRequest.requestId.toUpperCase();
const requestTypedConfigBody: HandlerOptionsBody<typeof requestTypedConfig> =
  manifestRouteRequest;
requestTypedConfigBody.id.toUpperCase();
const requestTypedConfigBodyFromRpcSubpath: RpcSubpathHandlerOptionsBody<
  typeof requestTypedConfig
> = requestTypedConfigBody;
requestTypedConfigBodyFromRpcSubpath.id.toUpperCase();
const requestTypedConfigServices: HandlerOptionServices<
  typeof requestTypedConfig
> = rootPluginServices;
requestTypedConfigServices.users.findById('1').name.toUpperCase();
const contextSubpathRequestTypedJoorConfigRequest: ContextSubpathConfigRequest<
  typeof requestTypedConfig
> = requestTypedJoorConfigRequest;
const configSubpathRequestTypedJoorConfigRequest: ConfigSubpathConfigRequest<
  typeof requestTypedConfig
> = contextSubpathRequestTypedJoorConfigRequest;
const packageConfigSubpathRequestTypedJoorConfigRequest: PackageConfigSubpathConfigRequest<
  typeof requestTypedConfig
> = configSubpathRequestTypedJoorConfigRequest;
packageConfigSubpathRequestTypedJoorConfigRequest.requestId.toUpperCase();
const rpcSubpathRequestTypedConfigRequest: RpcSubpathHandlerOptionsRequest<
  typeof requestTypedConfig
> = requestTypedConfigRequest;
const contextSubpathRequestTypedConfigRequest: ContextSubpathHandlerOptionsRequest<
  typeof requestTypedConfig
> = rpcSubpathRequestTypedConfigRequest;
const configSubpathRequestTypedConfigRequest: ConfigSubpathHandlerOptionsRequest<
  typeof requestTypedConfig
> = contextSubpathRequestTypedConfigRequest;
const packageConfigSubpathRequestTypedConfigRequest: PackageConfigSubpathHandlerOptionsRequest<
  typeof requestTypedConfig
> = configSubpathRequestTypedConfigRequest;
packageConfigSubpathRequestTypedConfigRequest.requestId.toUpperCase();
// @ts-expect-error request-typed configs preserve custom request extraction.
const _wrongRequestTypedConfigRequest: HandlerOptionsRequest<
  typeof requestTypedConfig
> = new Request('https://example.com/rpc');
// @ts-expect-error request-typed config aliases preserve custom request extraction.
const _wrongRequestTypedJoorConfigRequest: JoorConfigRequest<
  typeof requestTypedConfig
> = new Request('https://example.com/rpc');
const serviceAwareMiddleware: JoorMiddleware<RootPluginServices> = {
  name: 'audit',
  beforeRequest(_request, context) {
    context.services.users.findById('1').name.toUpperCase();
    return undefined;
  },
};
// @ts-expect-error middleware names are readonly.
serviceAwareMiddleware.name = 'mutated';
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
const exactManifestAwareHandlerHooks: HandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  beforeRequest(_request, context) {
    context.body?.input.id.toUpperCase();
    // @ts-expect-error exact manifest-aware hooks keep request bodies route-specific.
    context.body?.input.ok;
    return undefined;
  },
};
const rpcSubpathExactManifestAwareHandlerHooks: RpcSubpathHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactManifestAwareHandlerHooks;
rpcSubpathExactManifestAwareHandlerHooks.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const manifestUnaryRouteHandlerHooks: RpcManifestUnaryRouteHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  beforeRequest(_request, context) {
    if (context.body !== undefined && 'id' in context.body) {
      context.body.input.valueOf();
    }
    return undefined;
  },
};
const manifestStreamRouteHandlerHooks: RpcManifestStreamRouteHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  beforeRequest(_request, context) {
    context.body?.input.userId.toUpperCase();
    return undefined;
  },
};
const rpcSubpathManifestUnaryRouteHandlerHooks: RpcSubpathManifestUnaryRouteHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerHooks;
const rpcSubpathManifestStreamRouteHandlerHooks: RpcSubpathManifestStreamRouteHandlerHooksFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerHooks;
rpcSubpathManifestUnaryRouteHandlerHooks.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
rpcSubpathManifestStreamRouteHandlerHooks.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
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
const exactManifestAwareMiddleware: JoorMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  name: 'route-get-audit',
  afterResponse(response, _request, context) {
    context.body?.input.id.toUpperCase();
    // @ts-expect-error exact manifest-aware middleware rejects other route inputs.
    context.body?.input.ok;
    return response;
  },
};
const rpcSubpathExactManifestAwareMiddleware: RpcSubpathJoorMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactManifestAwareMiddleware;
rpcSubpathExactManifestAwareMiddleware.name.toUpperCase();
const typedRequestMiddleware: JoorMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = {
  name: 'typed-request-audit',
  beforeRequest(request, context) {
    request.requestId.toUpperCase();
    context.body?.input.id.toUpperCase();
    return undefined;
  },
};
typedRequestMiddleware.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const manifestUnaryRouteMiddleware: RpcManifestUnaryRouteMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  name: 'unary-audit',
  beforeRequest(_request, context) {
    if (context.body !== undefined && 'id' in context.body) {
      context.body.id.toUpperCase();
    }
    return undefined;
  },
};
const manifestStreamRouteMiddleware: RpcManifestStreamRouteMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  name: 'stream-audit',
  beforeRequest(_request, context) {
    context.body?.input.userId.toUpperCase();
    return undefined;
  },
};
const rpcSubpathManifestUnaryRouteMiddleware: RpcSubpathManifestUnaryRouteMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteMiddleware;
const rpcSubpathManifestStreamRouteMiddleware: RpcSubpathManifestStreamRouteMiddlewareFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteMiddleware;
rpcSubpathManifestUnaryRouteMiddleware.name.toUpperCase();
rpcSubpathManifestStreamRouteMiddleware.name.toUpperCase();
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
const typedRequestHandlerOptions: HandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: typedRequestHandlerHooks,
  middleware: [typedRequestMiddleware],
  rateLimit: {
    identity(request) {
      return request.requestId;
    },
  },
  onError(_error, request) {
    request.requestId.toUpperCase();
  },
};
typedRequestHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
// @ts-expect-error handler option error hooks are readonly.
typedRequestHandlerOptions.onError = () => undefined;
const typedHookJoorHandler =
  createJoorHandlerFor<HookAppRequest>()(manifest, typedRequestHandlerOptions);
typedHookJoorHandler(hookAppRequest);
// @ts-expect-error typed fetch handlers preserve hook request types through options.
typedHookJoorHandler(new Request('https://example.com/rpc'));
const exactServiceAwareHandlerOptions: HandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: exactManifestAwareHandlerHooks,
  middleware: [exactManifestAwareMiddleware],
};
exactServiceAwareHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const manifestUnaryRouteHandlerOptions: RpcManifestUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: manifestUnaryRouteHandlerHooks,
  middleware: [manifestUnaryRouteMiddleware],
};
const manifestStreamRouteHandlerOptions: RpcManifestStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: manifestStreamRouteHandlerHooks,
  middleware: [manifestStreamRouteMiddleware],
};
const rpcSubpathManifestUnaryRouteHandlerOptions: RpcSubpathManifestUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const rpcSubpathManifestStreamRouteHandlerOptions: RpcSubpathManifestStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
rpcSubpathManifestUnaryRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
rpcSubpathManifestStreamRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
const exactHandlerOptionsArgsFor: HandlerOptionsArgsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = [exactServiceAwareHandlerOptions];
// @ts-expect-error handler option args are readonly tuples.
exactHandlerOptionsArgsFor[0] = exactServiceAwareHandlerOptions;
exactHandlerOptionsArgsFor[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const rpcSubpathExactHandlerOptionsArgsFor: RpcSubpathHandlerOptionsArgsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactHandlerOptionsArgsFor;
const exactHandlerOptionsArgs: HandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = rpcSubpathExactHandlerOptionsArgsFor;
const manifestUnaryRouteHandlerOptionsArgs: RpcManifestUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [manifestUnaryRouteHandlerOptions];
const manifestStreamRouteHandlerOptionsArgs: RpcManifestStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [manifestStreamRouteHandlerOptions];
const rpcSubpathManifestUnaryRouteHandlerOptionsArgs: RpcSubpathManifestUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptionsArgs;
const rpcSubpathManifestStreamRouteHandlerOptionsArgs: RpcSubpathManifestStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptionsArgs;
rpcSubpathManifestUnaryRouteHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
rpcSubpathManifestStreamRouteHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
const rpcSubpathExactHandlerOptionsArgs: RpcSubpathHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactHandlerOptionsArgs;
const exactHandlerOptionsWithTrailingArgs: HandlerOptionsWithTrailingArgs<
  typeof manifest,
  [preflight?: boolean],
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = [exactServiceAwareHandlerOptions, true];
// @ts-expect-error handler option trailing args are readonly tuples.
exactHandlerOptionsWithTrailingArgs[1] = false;
const rpcSubpathExactHandlerOptionsWithTrailingArgs: RpcSubpathHandlerOptionsWithTrailingArgs<
  typeof manifest,
  [preflight?: boolean],
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactHandlerOptionsWithTrailingArgs;
const exactHandlerOptionsWithPreflightArgs: HandlerOptionsWithPreflightArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = rpcSubpathExactHandlerOptionsWithTrailingArgs;
const rpcSubpathExactHandlerOptionsWithPreflightArgs: RpcSubpathHandlerOptionsWithPreflightArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactHandlerOptionsWithPreflightArgs;
rpcSubpathExactHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
rpcSubpathExactHandlerOptionsWithPreflightArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const exactDefinedHandlerOptions = defineHandlerOptions(manifest)<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
>({
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: exactManifestAwareHandlerHooks,
});
exactDefinedHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const requestTypedDefinedHandlerOptions = defineHandlerOptions(manifest)<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
>(typedRequestHandlerOptions);
requestTypedDefinedHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const definedHandlerOptionsFactory: DefineHandlerOptions<typeof manifest> =
  defineHandlerOptions(manifest);
const definedRouteUnaryHandlerOptionsFactory: DefineRouteUnaryHandlerOptions<
  typeof manifest
> = defineHandlerOptions(manifest);
const definedRouteStreamHandlerOptionsFactory: DefineRouteStreamHandlerOptions<
  typeof manifest
> = defineHandlerOptions(manifest);
const definedUnaryRouteHandlerOptionsFactory: DefineUnaryRouteHandlerOptions<
  typeof manifest
> = definedRouteUnaryHandlerOptionsFactory;
const definedStreamRouteHandlerOptionsFactory: DefineStreamRouteHandlerOptions<
  typeof manifest
> = definedRouteStreamHandlerOptionsFactory;
const definedRouteUnaryHandlerOptions = definedRouteUnaryHandlerOptionsFactory(
  manifestUnaryRouteHandlerOptions
);
const requestTypedDefinedRouteUnaryHandlerOptions =
  definedRouteUnaryHandlerOptionsFactory<
    readonly [typeof usersPlugin],
    typeof manifestRouteRequest,
    HookAppRequest
  >(typedRequestHandlerOptions);
const definedRouteStreamHandlerOptions =
  definedRouteStreamHandlerOptionsFactory(manifestStreamRouteHandlerOptions);
const definedUnaryRouteHandlerOptions = definedUnaryRouteHandlerOptionsFactory(
  definedRouteUnaryHandlerOptions
);
const definedStreamRouteHandlerOptions =
  definedStreamRouteHandlerOptionsFactory(definedRouteStreamHandlerOptions);
definedHandlerOptionsFactory({ plugins: [usersPlugin] as const });
definedRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedDefinedRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
definedRouteStreamHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
definedUnaryRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
definedStreamRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
const exactManifestAwareConfigShape: JoorConfigFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = {
  plugins: [usersPlugin] as const,
  hooks: typedRequestHandlerHooks,
};
const exactManifestAwareConfig = defineConfigFor(manifest)<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
>(exactManifestAwareConfigShape);
exactManifestAwareConfig.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
exactManifestAwareConfig.hooks?.beforeRequest?.(
  // @ts-expect-error typed configs preserve custom hook request types.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
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
const rpcSubpathDefinedHandlerOptionsFactory: RpcSubpathDefineHandlerOptions<
  typeof manifest
> = defineRpcSubpathHandlerOptions(manifest);
const rpcSubpathDefinedRouteUnaryHandlerOptionsFactory: RpcSubpathDefineRouteUnaryHandlerOptions<
  typeof manifest
> = defineRpcSubpathHandlerOptions(manifest);
const rpcSubpathDefinedRouteStreamHandlerOptionsFactory: RpcSubpathDefineRouteStreamHandlerOptions<
  typeof manifest
> = defineRpcSubpathHandlerOptions(manifest);
const rpcSubpathDefinedUnaryRouteHandlerOptionsFactory: RpcSubpathDefineUnaryRouteHandlerOptions<
  typeof manifest
> = rpcSubpathDefinedRouteUnaryHandlerOptionsFactory;
const rpcSubpathDefinedStreamRouteHandlerOptionsFactory: RpcSubpathDefineStreamRouteHandlerOptions<
  typeof manifest
> = rpcSubpathDefinedRouteStreamHandlerOptionsFactory;
rpcSubpathDefinedHandlerOptionsFactory({ plugins: [usersPlugin] as const });
rpcSubpathDefinedRouteUnaryHandlerOptionsFactory(
  rpcSubpathManifestUnaryRouteHandlerOptions
).hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
rpcSubpathDefinedUnaryRouteHandlerOptionsFactory(
  rpcSubpathManifestUnaryRouteHandlerOptions
).hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
rpcSubpathDefinedRouteStreamHandlerOptionsFactory(
  rpcSubpathManifestStreamRouteHandlerOptions
).hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
rpcSubpathDefinedStreamRouteHandlerOptionsFactory(
  rpcSubpathManifestStreamRouteHandlerOptions
).hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const syncRpcHandler: RpcRequestHandler = () => new Response();
const rpcSubpathHandler = createRpcSubpathHandler(manifest, handlerOptions);
const typedRpcSubpathHandler: RpcSubpathRequestHandler = rpcSubpathHandler;
const syncRpcSubpathHandler: RpcSubpathRequestHandler = syncRpcHandler;
const createTypedRpcHandler = createRpcHandlerFor<AppFetchRequest>();
const typedAppRpcHandler: RpcRequestHandler<AppFetchRequest> =
  createTypedRpcHandler(manifest, handlerOptions);
const lowLevelRequestTypedHandlerOptions: HandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  RpcManifestBody<typeof manifest>,
  HookAppRequest
> = {
  path: '/rpc',
  plugins: [usersPlugin] as const,
  hooks: {
    beforeRequest(request, context) {
      request.requestId.toUpperCase();
      if (context.body !== undefined && !('length' in context.body)) {
        context.body.id.toUpperCase();
      }
      return undefined;
    },
  },
};
const createHookTypedRpcHandler = createRpcHandlerFor<HookAppRequest>();
const hookTypedRpcHandler: RpcRequestHandler<HookAppRequest> =
  createHookTypedRpcHandler(manifest, lowLevelRequestTypedHandlerOptions);
const createDefaultRpcHandler = createRpcHandlerFor();
const defaultRpcHandler: RpcRequestHandler = createDefaultRpcHandler(
  manifest,
  handlerOptions
);
const createTypedRpcSubpathHandler =
  createRpcSubpathHandlerFor<AppFetchRequest>();
const typedAppRpcSubpathHandler: RpcSubpathRequestHandler<AppFetchRequest> =
  createTypedRpcSubpathHandler(manifest, handlerOptions);
rpcHandler(new Request('https://example.com/rpc'));
typedRpcHandler(new Request('https://example.com/rpc'));
syncRpcHandler(new Request('https://example.com/rpc'));
typedRpcSubpathHandler(new Request('https://example.com/rpc'));
syncRpcSubpathHandler(new Request('https://example.com/rpc'));
defaultRpcHandler(new Request('https://example.com/rpc'));
hookTypedRpcHandler(hookAppRequest);
// @ts-expect-error low-level typed RPC handlers preserve custom hook request types.
hookTypedRpcHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching handler plugins.
createRpcHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed handler plugins.
createTypedRpcHandler(manifest);
const rpcBodyHandler = createRpcBodyHandler(manifest, handlerOptions);
const typedRpcBodyHandler: RpcBodyHandler<typeof manifest> = rpcBodyHandler;
const syncRpcBodyHandler: RpcBodyHandler<typeof manifest> = () =>
  new Response();
const rpcSubpathBodyHandler = createRpcSubpathBodyHandler(
  manifest,
  handlerOptions
);
const typedRpcSubpathBodyHandler: RpcSubpathBodyHandler<typeof manifest> =
  rpcSubpathBodyHandler;
const syncRpcSubpathBodyHandler: RpcSubpathBodyHandler<typeof manifest> =
  syncRpcBodyHandler;
const createTypedRpcBodyHandler =
  createRpcBodyHandlerFor<AppFetchRequest>();
const typedAppRpcBodyHandler: RpcBodyHandler<
  typeof manifest,
  AppFetchRequest
> = createTypedRpcBodyHandler(manifest, handlerOptions);
const createDefaultRpcBodyHandler = createRpcBodyHandlerFor();
const defaultRpcBodyHandler: RpcBodyHandler<typeof manifest> =
  createDefaultRpcBodyHandler(manifest, handlerOptions);
const createHookTypedRpcBodyHandler =
  createRpcBodyHandlerFor<HookAppRequest>();
const hookTypedRpcBodyHandler: RpcBodyHandler<typeof manifest, HookAppRequest> =
  createHookTypedRpcBodyHandler(
    manifest,
    lowLevelRequestTypedHandlerOptions
  );
const createTypedRpcSubpathBodyHandler =
  createRpcSubpathBodyHandlerFor<AppFetchRequest>();
const typedAppRpcSubpathBodyHandler: RpcSubpathBodyHandler<
  typeof manifest,
  AppFetchRequest
> = createTypedRpcSubpathBodyHandler(manifest, handlerOptions);
// @ts-expect-error service-dependent manifests require matching body handler plugins.
createRpcBodyHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed body handler plugins.
createTypedRpcBodyHandler(manifest);
rpcBodyHandler(new Request('https://example.com/rpc'), {
  id: 'users.get',
  input: { id: '1' },
});
typedRpcBodyHandler(new Request('https://example.com/rpc'), manifestRouteBody);
defaultRpcBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteBody
);
syncRpcBodyHandler(new Request('https://example.com/rpc'), manifestRouteBody);
typedRpcSubpathBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteBody
);
syncRpcSubpathBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteBody
);
hookTypedRpcBodyHandler(hookAppRequest, manifestRouteBody);
hookTypedRpcBodyHandler(
  // @ts-expect-error low-level typed body handlers preserve custom hook request types.
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
const createTypedRpcBodyResultHandler =
  createRpcBodyResultHandlerFor<AppFetchRequest>();
const typedAppRpcBodyResultHandler: RpcBodyResultHandler<
  typeof manifest,
  AppFetchRequest
> = createTypedRpcBodyResultHandler(manifest, handlerOptions);
const createDefaultRpcBodyResultHandler = createRpcBodyResultHandlerFor();
const defaultRpcBodyResultHandler: RpcBodyResultHandler<typeof manifest> =
  createDefaultRpcBodyResultHandler(manifest, handlerOptions);
const createHookTypedRpcBodyResultHandler =
  createRpcBodyResultHandlerFor<HookAppRequest>();
const hookTypedRpcBodyResultHandler: RpcBodyResultHandler<
  typeof manifest,
  HookAppRequest
> = createHookTypedRpcBodyResultHandler(
  manifest,
  lowLevelRequestTypedHandlerOptions
);
const createTypedRpcSubpathBodyResultHandler =
  createRpcSubpathBodyResultHandlerFor<AppFetchRequest>();
const typedAppRpcSubpathBodyResultHandler: RpcSubpathBodyResultHandler<
  typeof manifest,
  AppFetchRequest
> = createTypedRpcSubpathBodyResultHandler(manifest, handlerOptions);
// @ts-expect-error service-dependent manifests require matching body result handler plugins.
createRpcBodyResultHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed body result handler plugins.
createTypedRpcBodyResultHandler(manifest);
Promise.resolve(
  rpcBodyResultHandler(new Request('https://example.com/rpc'), {
    id: 'users.get',
    input: { id: '1' },
  })
).then((result) => {
  const typedResult: JoorManifestRouteBodyResult<typeof manifest> = result;
  if (!(typedResult instanceof Response) && !Array.isArray(typedResult)) {
    typedResult.id.toUpperCase();
    if (typedResult.ok && typedResult.id === 'users.get') {
      typedResult.data.name.toUpperCase();
    }
  }
});
Promise.resolve(hookTypedRpcBodyResultHandler(hookAppRequest, manifestRouteBody));
Promise.resolve(
  defaultRpcBodyResultHandler(
    new Request('https://example.com/rpc'),
    manifestRouteBody
  )
);
hookTypedRpcBodyResultHandler(
  // @ts-expect-error low-level typed body result handlers preserve custom hook request types.
  new Request('https://example.com/rpc'),
  manifestRouteBody
);
Promise.resolve(
  rpcBodyResultHandler(
    new Request('https://example.com/rpc'),
    manifestProtocolRequest
  )
).then((result) => {
  const exactResult: JoorManifestRouteBodyResultFor<
    typeof manifest,
    typeof manifestProtocolRequest
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
Promise.resolve(
  rpcBodyResultHandler(
    new Request('https://example.com/rpc'),
    readonlyManifestBatchRequest
  )
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
Promise.resolve(
  rpcTransportResultHandler(createFetchRequestSourceForTypes(), {
    id: 'users.get',
    input: { id: '1' },
  })
).then((result) => {
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

const publicManifestRouteUnaryBodyHandler: RpcManifestRouteUnaryBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncPublicManifestRouteUnaryBodyHandler: RpcManifestRouteUnaryBodyHandler<
  typeof manifest
> = () => new Response();
const publicManifestRouteStreamBodyHandler: RpcManifestRouteStreamBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncPublicManifestRouteStreamBodyHandler: RpcManifestRouteStreamBodyHandler<
  typeof manifest
> = () => new Response();
const publicManifestRouteUnaryBodyResultHandler: RpcManifestRouteUnaryBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const publicManifestRouteStreamBodyResultHandler: RpcManifestRouteStreamBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const syncPublicManifestRouteUnaryBodyResultHandler: RpcManifestRouteUnaryBodyResultHandler<
  typeof manifest
> = <const TBody extends JoorManifestRouteUnaryBody<typeof manifest>>(
  _request: Request,
  _body: TBody
) =>
  new Response() as RpcManifestRouteUnaryBodyResultFor<
    typeof manifest,
    TBody
  >;
const syncPublicManifestRouteStreamBodyResultHandler: RpcManifestRouteStreamBodyResultHandler<
  typeof manifest
> = <const TBody extends JoorManifestRouteStreamBody<typeof manifest>>(
  _request: Request,
  _body: TBody
) =>
  new Response() as RpcManifestRouteStreamBodyResultFor<
    typeof manifest,
    TBody
  >;
const publicManifestUnaryRouteBodyHandler: RpcManifestUnaryRouteBodyHandler<
  typeof manifest
> = publicManifestRouteUnaryBodyHandler;
const syncPublicManifestUnaryRouteBodyHandler: RpcManifestUnaryRouteBodyHandler<
  typeof manifest
> = syncPublicManifestRouteUnaryBodyHandler;
const publicManifestStreamRouteBodyHandler: RpcManifestStreamRouteBodyHandler<
  typeof manifest
> = publicManifestRouteStreamBodyHandler;
const syncPublicManifestStreamRouteBodyHandler: RpcManifestStreamRouteBodyHandler<
  typeof manifest
> = syncPublicManifestRouteStreamBodyHandler;
const publicManifestUnaryRouteBodyResultHandler: RpcManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = publicManifestRouteUnaryBodyResultHandler;
const publicManifestStreamRouteBodyResultHandler: RpcManifestStreamRouteBodyResultHandler<
  typeof manifest
> = publicManifestRouteStreamBodyResultHandler;
const publicManifestUnaryRouteTransportBodyResultHandler: RpcManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const publicManifestStreamRouteTransportBodyResultHandler: RpcManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const syncPublicManifestUnaryRouteTransportBodyResultHandler: RpcManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = <const TBody extends JoorManifestRouteUnaryBody<typeof manifest>>(
  _request: ContextRequestSource,
  _body: TBody
) =>
  new Response() as RpcManifestRouteUnaryBodyResultFor<
    typeof manifest,
    TBody
  >;
const syncPublicManifestStreamRouteTransportBodyResultHandler: RpcManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = <const TBody extends JoorManifestRouteStreamBody<typeof manifest>>(
  _request: ContextRequestSource,
  _body: TBody
) =>
  new Response() as RpcManifestRouteStreamBodyResultFor<
    typeof manifest,
    TBody
  >;
const publicJoorManifestUnaryRouteBodyHandler: JoorManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncPublicJoorManifestUnaryRouteBodyHandler: JoorManifestUnaryRouteBodyHandler<
  typeof manifest
> = syncPublicManifestUnaryRouteBodyHandler;
const publicJoorManifestStreamRouteBodyHandler: JoorManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncPublicJoorManifestStreamRouteBodyHandler: JoorManifestStreamRouteBodyHandler<
  typeof manifest
> = syncPublicManifestStreamRouteBodyHandler;
const publicJoorManifestUnaryRouteBodyResultHandler: JoorManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const publicJoorManifestStreamRouteBodyResultHandler: JoorManifestStreamRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const publicJoorManifestUnaryRouteTransportBodyResultHandler: JoorManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const publicJoorManifestStreamRouteTransportBodyResultHandler: JoorManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const syncPublicJoorManifestUnaryRouteBodyResultHandler: JoorManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = syncPublicManifestRouteUnaryBodyResultHandler;
const syncPublicJoorManifestStreamRouteBodyResultHandler: JoorManifestStreamRouteBodyResultHandler<
  typeof manifest
> = syncPublicManifestRouteStreamBodyResultHandler;
const requestTypedJoorManifestUnaryRouteBodyHandler: JoorManifestUnaryRouteBodyHandler<
  typeof manifest,
  HookAppRequest
> = <const TBody extends JoorManifestRouteUnaryBody<typeof manifest>>(
  request: HookAppRequest,
  _body: TBody
) => new Response(request.requestId);
requestTypedJoorManifestUnaryRouteBodyHandler(
  hookAppRequest,
  manifestRouteRequest
);
requestTypedJoorManifestUnaryRouteBodyHandler(
  // @ts-expect-error manifest body handlers preserve custom request types.
  new Request('https://example.com/rpc'),
  manifestRouteRequest
);
const requestTypedJoorManifestStreamRouteBodyHandler: JoorManifestStreamRouteBodyHandler<
  typeof manifest,
  HookAppRequest
> = <const TBody extends JoorManifestRouteStreamBody<typeof manifest>>(
  request: HookAppRequest,
  _body: TBody
) => new Response(request.requestId);
requestTypedJoorManifestStreamRouteBodyHandler(
  hookAppRequest,
  manifestRouteStreamBody
);
requestTypedJoorManifestStreamRouteBodyHandler(
  // @ts-expect-error manifest stream body handlers preserve custom request types.
  new Request('https://example.com/rpc'),
  manifestRouteStreamBody
);
const requestTypedJoorManifestUnaryRouteBodyResultHandler: JoorManifestUnaryRouteBodyResultHandler<
  typeof manifest,
  HookAppRequest
> = <const TBody extends JoorManifestRouteUnaryBody<typeof manifest>>(
  request: HookAppRequest,
  _body: TBody
) =>
  new Response(request.requestId) as RpcManifestRouteUnaryBodyResultFor<
    typeof manifest,
    TBody
  >;
requestTypedJoorManifestUnaryRouteBodyResultHandler(
  hookAppRequest,
  manifestRouteRequest
);
requestTypedJoorManifestUnaryRouteBodyResultHandler(
  // @ts-expect-error manifest body result handlers preserve custom request types.
  new Request('https://example.com/rpc'),
  manifestRouteRequest
);
const requestTypedJoorManifestStreamRouteBodyResultHandler: JoorManifestStreamRouteBodyResultHandler<
  typeof manifest,
  HookAppRequest
> = <const TBody extends JoorManifestRouteStreamBody<typeof manifest>>(
  request: HookAppRequest,
  _body: TBody
) =>
  new Response(request.requestId) as RpcManifestRouteStreamBodyResultFor<
    typeof manifest,
    TBody
  >;
requestTypedJoorManifestStreamRouteBodyResultHandler(
  hookAppRequest,
  manifestRouteStreamBody
);
requestTypedJoorManifestStreamRouteBodyResultHandler(
  // @ts-expect-error manifest stream body result handlers preserve custom request types.
  new Request('https://example.com/rpc'),
  manifestRouteStreamBody
);
const syncPublicJoorManifestUnaryRouteTransportBodyResultHandler: JoorManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = syncPublicManifestUnaryRouteTransportBodyResultHandler;
const syncPublicJoorManifestStreamRouteTransportBodyResultHandler: JoorManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = syncPublicManifestStreamRouteTransportBodyResultHandler;
const rpcSubpathManifestUnaryRouteBodyHandler: RpcSubpathManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncRpcSubpathManifestUnaryRouteBodyHandler: RpcSubpathManifestUnaryRouteBodyHandler<
  typeof manifest
> = syncPublicManifestUnaryRouteBodyHandler;
const rpcSubpathManifestStreamRouteBodyHandler: RpcSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncRpcSubpathManifestStreamRouteBodyHandler: RpcSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = syncPublicManifestStreamRouteBodyHandler;
const rpcSubpathManifestUnaryRouteBodyResultHandler: RpcSubpathManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const rpcSubpathManifestStreamRouteBodyResultHandler: RpcSubpathManifestStreamRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const rpcSubpathManifestUnaryRouteTransportBodyResultHandler: RpcSubpathManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const rpcSubpathManifestStreamRouteTransportBodyResultHandler: RpcSubpathManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const joorSubpathManifestUnaryRouteBodyHandler: JoorSubpathManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncJoorSubpathManifestUnaryRouteBodyHandler: JoorSubpathManifestUnaryRouteBodyHandler<
  typeof manifest
> = syncPublicJoorManifestUnaryRouteBodyHandler;
const joorSubpathManifestStreamRouteBodyHandler: JoorSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const syncJoorSubpathManifestStreamRouteBodyHandler: JoorSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = syncPublicJoorManifestStreamRouteBodyHandler;
const joorSubpathManifestUnaryRouteBodyResultHandler: JoorSubpathManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const joorSubpathManifestStreamRouteBodyResultHandler: JoorSubpathManifestStreamRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const joorSubpathManifestUnaryRouteTransportBodyResultHandler: JoorSubpathManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const joorSubpathManifestStreamRouteTransportBodyResultHandler: JoorSubpathManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;

publicManifestRouteUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  publicManifestRouteUnaryBody
);
syncPublicManifestRouteUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  publicManifestRouteUnaryBody
);
publicManifestRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  publicManifestRouteStreamBody
);
syncPublicManifestRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  publicManifestRouteStreamBody
);
publicManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncPublicManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncPublicManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
publicManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  // @ts-expect-error unary route body handlers reject stream route bodies.
  manifestStreamRouteBody
);
publicManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  // @ts-expect-error stream route body handlers reject unary route bodies.
  manifestUnaryRouteBody
);
Promise.resolve(
  publicManifestRouteUnaryBodyResultHandler(
    new Request('https://example.com/rpc'),
    publicManifestRouteUnaryBody
  )
).then((result) => {
  const exactResult: RpcManifestRouteUnaryBodyResultFor<
    typeof manifest,
    typeof publicManifestRouteUnaryBody
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
Promise.resolve(
  publicManifestRouteStreamBodyResultHandler(
    new Request('https://example.com/rpc'),
    publicManifestRouteStreamBody
  )
).then((result) => result.headers.get('content-type'));
Promise.resolve(
  publicManifestUnaryRouteBodyResultHandler(
    new Request('https://example.com/rpc'),
    manifestUnaryRouteBody
  )
).then((result) => {
  const exactResult: RpcManifestUnaryRouteBodyResultFor<
    typeof manifest,
    typeof manifestUnaryRouteBody
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
Promise.resolve(
  publicManifestStreamRouteBodyResultHandler(
    new Request('https://example.com/rpc'),
    manifestStreamRouteBody
  )
).then((result) => result.headers.get('content-type'));
Promise.resolve(
  publicManifestUnaryRouteTransportBodyResultHandler(
    createFetchRequestSourceForTypes(),
    manifestUnaryRouteBody
  )
).then((result) => {
  const exactResult: JoorManifestUnaryRouteBodyResultFor<
    typeof manifest,
    typeof manifestUnaryRouteBody
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
Promise.resolve(
  publicManifestStreamRouteTransportBodyResultHandler(
    createFetchRequestSourceForTypes(),
    manifestStreamRouteBody
  )
).then((result) => result.headers.get('content-type'));
publicJoorManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncPublicJoorManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncPublicJoorManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
publicJoorManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncPublicJoorManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncPublicJoorManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
publicJoorManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncPublicJoorManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncPublicJoorManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
rpcSubpathManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncRpcSubpathManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
rpcSubpathManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncRpcSubpathManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
rpcSubpathManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
rpcSubpathManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
rpcSubpathManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
rpcSubpathManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
joorSubpathManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncJoorSubpathManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
joorSubpathManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncJoorSubpathManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
joorSubpathManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
joorSubpathManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
joorSubpathManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
joorSubpathManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);

// @ts-expect-error low-level runtime handlers only accept typed procedure manifests.
createRpcBodyResultHandler({ procedures: { broken: { input: t.string() } } });

const fetchHandler = createJoorHandler(manifest, handlerOptions);
const typedFetchHandler: JoorFetchHandler = fetchHandler;
const syncTypedFetchHandler: JoorFetchHandler = () => new Response();
const runtimeSubpathTypedFetchHandler: RuntimeSubpathJoorFetchHandler =
  typedFetchHandler;
const runtimeSubpathSyncTypedFetchHandler: RuntimeSubpathJoorFetchHandler =
  syncTypedFetchHandler;
interface AppFetchRequest extends Request {
  readonly requestId: string;
}
const createTypedJoorHandler = createJoorHandlerFor<AppFetchRequest>();
const typedJoorHandler: JoorFetchHandler<AppFetchRequest> =
  createTypedJoorHandler(manifest, handlerOptions);
const createDefaultJoorHandler = createJoorHandlerFor();
const defaultJoorHandler: JoorFetchHandler = createDefaultJoorHandler(
  manifest,
  handlerOptions
);
const directHookTypedJoorHandler: JoorFetchHandler<HookAppRequest> =
  createJoorHandler(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedJoorHandler =
  createRuntimeSubpathJoorHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedJoorHandler: RuntimeSubpathJoorFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedJoorHandler(manifest, handlerOptions);
const appFetchRequest = Object.assign(new Request('https://example.com/rpc'), {
  requestId: 'req_1',
}) as AppFetchRequest;
appFetchRequest.requestId.toUpperCase();
typedAppRpcHandler(appFetchRequest);
typedAppRpcSubpathHandler(appFetchRequest);
typedAppRpcBodyHandler(appFetchRequest, manifestRouteBody);
typedAppRpcSubpathBodyHandler(appFetchRequest, manifestRouteBody);
typedAppRpcBodyResultHandler(appFetchRequest, manifestRouteBody);
typedAppRpcSubpathBodyResultHandler(appFetchRequest, manifestRouteBody);
fetchHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedFetchHandler(new Request('https://example.com/rpc'));
runtimeSubpathSyncTypedFetchHandler(new Request('https://example.com/rpc'));
defaultJoorHandler(new Request('https://example.com/rpc'));
typedJoorHandler(appFetchRequest);
runtimeSubpathTypedJoorHandler(appFetchRequest);
directHookTypedJoorHandler(hookAppRequest);
// @ts-expect-error direct typed fetch factories infer custom hook request types.
directHookTypedJoorHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching fetch handler plugins.
createJoorHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed fetch handler plugins.
createTypedJoorHandler(manifest);

// @ts-expect-error runtime adapters only accept typed procedure manifests.
createJoorHandler({ procedures: { broken: { input: t.string() } } });

const bunFetch = createBunFetch(manifest, handlerOptions);
const typedBunFetch: BunFetchHandler = bunFetch;
const syncTypedBunFetch: BunFetchHandler = () => new Response();
const runtimeSubpathTypedBunFetch: RuntimeSubpathBunFetchHandler =
  typedBunFetch;
const runtimeSubpathSyncTypedBunFetch: RuntimeSubpathBunFetchHandler =
  syncTypedBunFetch;
const createTypedBunFetch = createBunFetchFor<AppFetchRequest>();
const typedAppBunFetch: BunFetchHandler<AppFetchRequest> =
  createTypedBunFetch(manifest, handlerOptions);
const createDefaultBunFetch = createBunFetchFor();
const defaultBunFetch: BunFetchHandler = createDefaultBunFetch(
  manifest,
  handlerOptions
);
const directHookTypedBunFetch: BunFetchHandler<HookAppRequest> =
  createBunFetch(manifest, typedRequestHandlerOptions);
const hookTypedBunFetch =
  createBunFetchFor<HookAppRequest>()(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedBunFetch =
  createRuntimeSubpathBunFetchFor<AppFetchRequest>();
const runtimeSubpathTypedAppBunFetch: RuntimeSubpathBunFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedBunFetch(manifest, handlerOptions);
bunFetch(new Request('https://example.com/rpc'));
runtimeSubpathTypedBunFetch(new Request('https://example.com/rpc'));
runtimeSubpathSyncTypedBunFetch(new Request('https://example.com/rpc'));
defaultBunFetch(new Request('https://example.com/rpc'));
typedAppBunFetch(appFetchRequest);
runtimeSubpathTypedAppBunFetch(appFetchRequest);
directHookTypedBunFetch(hookAppRequest);
hookTypedBunFetch(hookAppRequest);
// @ts-expect-error direct typed Bun fetch factories infer custom hook request types.
directHookTypedBunFetch(new Request('https://example.com/rpc'));
// @ts-expect-error typed Bun fetch factories preserve hook request types.
hookTypedBunFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Bun adapter plugins.
createBunFetch(manifest);
// @ts-expect-error service-dependent manifests require matching typed Bun fetch plugins.
createTypedBunFetch(manifest);
const bunRpcHandler: BunRpcRequestHandler = createBunRpcRequestHandler(
  manifest,
  handlerOptions
);
const runtimeSubpathBunRpcHandler: RuntimeSubpathBunRpcRequestHandler =
  bunRpcHandler;
const createTypedBunRpcHandler =
  createBunRpcRequestHandlerFor<AppFetchRequest>();
const typedBunRpcHandler: BunRpcRequestHandler<AppFetchRequest> =
  createTypedBunRpcHandler(manifest, handlerOptions);
const directHookTypedBunRpcHandler: BunRpcRequestHandler<HookAppRequest> =
  createBunRpcRequestHandler(manifest, typedRequestHandlerOptions);
const hookTypedBunRpcHandler =
  createBunRpcRequestHandlerFor<HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const createRuntimeSubpathTypedBunRpcHandler =
  createRuntimeSubpathBunRpcRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedBunRpcHandler: RuntimeSubpathBunRpcRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedBunRpcHandler(manifest, handlerOptions);
runtimeSubpathBunRpcHandler(new Request('https://example.com/rpc'));
typedBunRpcHandler(appFetchRequest);
runtimeSubpathTypedBunRpcHandler(appFetchRequest);
directHookTypedBunRpcHandler(hookAppRequest);
hookTypedBunRpcHandler(hookAppRequest);
// @ts-expect-error direct typed Bun RPC factories infer custom hook request types.
directHookTypedBunRpcHandler(new Request('https://example.com/rpc'));
// @ts-expect-error typed Bun RPC factories preserve hook request types.
hookTypedBunRpcHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching typed Bun RPC plugins.
createTypedBunRpcHandler(manifest);
const bunFetchOptions: BunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunRouteUnaryFetchOptions: BunRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunRouteStreamFetchOptions: BunRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const bunUnaryRouteFetchOptions: BunUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryFetchOptions;
const bunStreamRouteFetchOptions: BunStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamFetchOptions;
const bunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunRouteUnaryRpcRequestHandlerOptions: BunRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunRouteStreamRpcRequestHandlerOptions: BunRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const bunUnaryRouteRpcRequestHandlerOptions: BunUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryRpcRequestHandlerOptions;
const bunStreamRouteRpcRequestHandlerOptions: BunStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamRpcRequestHandlerOptions;
const bunFetchOptionsArgs: BunFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunFetchOptions];
const bunRouteUnaryFetchOptionsArgs: BunRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryFetchOptions];
const bunRouteStreamFetchOptionsArgs: BunRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamFetchOptions];
const bunUnaryRouteFetchOptionsArgs: BunUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryFetchOptions];
const bunStreamRouteFetchOptionsArgs: BunStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamFetchOptions];
const bunRpcRequestHandlerOptionsArgs: BunRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRpcRequestHandlerOptions];
const bunRouteUnaryRpcRequestHandlerOptionsArgs: BunRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryRpcRequestHandlerOptions];
const bunRouteStreamRpcRequestHandlerOptionsArgs: BunRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamRpcRequestHandlerOptions];
const bunUnaryRouteRpcRequestHandlerOptionsArgs: BunUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryRpcRequestHandlerOptions];
const bunStreamRouteRpcRequestHandlerOptionsArgs: BunStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamRpcRequestHandlerOptions];
const typedBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunRouteUnaryServeOptions: BunRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunRouteStreamServeOptions: BunRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const bunUnaryRouteServeOptions: BunUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryServeOptions;
const bunStreamRouteServeOptions: BunStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamServeOptions;
const runtimeSubpathBunRouteUnaryServeOptions: RuntimeSubpathBunRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryServeOptions;
const runtimeSubpathBunRouteStreamServeOptions: RuntimeSubpathBunRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamServeOptions;
const runtimeSubpathBunUnaryRouteServeOptions: RuntimeSubpathBunUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteServeOptions;
const runtimeSubpathBunStreamRouteServeOptions: RuntimeSubpathBunStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteServeOptions;
const runtimeSubpathBunFetchOptions: RuntimeSubpathBunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunFetchOptions;
const runtimeSubpathBunRouteUnaryFetchOptions: RuntimeSubpathBunRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryFetchOptions;
const runtimeSubpathBunRouteStreamFetchOptions: RuntimeSubpathBunRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamFetchOptions;
const runtimeSubpathBunUnaryRouteFetchOptions: RuntimeSubpathBunUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteFetchOptions;
const runtimeSubpathBunStreamRouteFetchOptions: RuntimeSubpathBunStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteFetchOptions;
const runtimeSubpathBunRpcRequestHandlerOptions: RuntimeSubpathBunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRpcRequestHandlerOptions;
const runtimeSubpathBunRouteUnaryRpcRequestHandlerOptions: RuntimeSubpathBunRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryRpcRequestHandlerOptions;
const runtimeSubpathBunRouteStreamRpcRequestHandlerOptions: RuntimeSubpathBunRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamRpcRequestHandlerOptions;
const runtimeSubpathBunUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathBunUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathBunStreamRouteRpcRequestHandlerOptions: RuntimeSubpathBunStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteRpcRequestHandlerOptions;
const bunServeOptionsArgs: BunServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedBunServeOptions];
const bunRouteUnaryServeOptionsArgs: BunRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryServeOptions];
const bunRouteStreamServeOptionsArgs: BunRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamServeOptions];
const bunUnaryRouteServeOptionsArgs: BunUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteUnaryServeOptions];
const bunStreamRouteServeOptionsArgs: BunStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRouteStreamServeOptions];
const runtimeSubpathBunFetchOptionsArgs: RuntimeSubpathBunFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunFetchOptionsArgs;
const runtimeSubpathBunRouteUnaryFetchOptionsArgs: RuntimeSubpathBunRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryFetchOptionsArgs;
const runtimeSubpathBunRouteStreamFetchOptionsArgs: RuntimeSubpathBunRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamFetchOptionsArgs;
const runtimeSubpathBunUnaryRouteFetchOptionsArgs: RuntimeSubpathBunUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteFetchOptionsArgs;
const runtimeSubpathBunStreamRouteFetchOptionsArgs: RuntimeSubpathBunStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteFetchOptionsArgs;
const runtimeSubpathBunRpcRequestHandlerOptionsArgs: RuntimeSubpathBunRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRpcRequestHandlerOptionsArgs;
const runtimeSubpathBunRouteUnaryRpcRequestHandlerOptionsArgs: RuntimeSubpathBunRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryRpcRequestHandlerOptionsArgs;
const runtimeSubpathBunRouteStreamRpcRequestHandlerOptionsArgs: RuntimeSubpathBunRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamRpcRequestHandlerOptionsArgs;
const runtimeSubpathBunUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathBunUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathBunStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathBunStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathBunServeOptionsArgs: RuntimeSubpathBunServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunServeOptionsArgs;
const runtimeSubpathBunRouteUnaryServeOptionsArgs: RuntimeSubpathBunRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteUnaryServeOptionsArgs;
const runtimeSubpathBunRouteStreamServeOptionsArgs: RuntimeSubpathBunRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunRouteStreamServeOptionsArgs;
const runtimeSubpathBunUnaryRouteServeOptionsArgs: RuntimeSubpathBunUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunUnaryRouteServeOptionsArgs;
const runtimeSubpathBunStreamRouteServeOptionsArgs: RuntimeSubpathBunStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunStreamRouteServeOptionsArgs;
runtimeSubpathBunFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathBunUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathBunUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunServeOptionsArgs[0]?.port?.toFixed();
runtimeSubpathBunUnaryRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunRouteUnaryRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunRouteStreamRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathBunFetchOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathBunRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
const exactBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const exactBunServeOptionsBody: HandlerOptionsBody<
  typeof exactBunServeOptions
> = manifestRouteRequest;
exactBunServeOptionsBody.input.id.toUpperCase();
const exactBunFetchOptions: BunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedBunFetchOptions: BunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const exactBunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedBunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
exactBunServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactBunServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Bun serve options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
exactBunFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactBunRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedBunFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedBunRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedBunServeOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedBunServeOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Bun serve options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const bunServer: BunServer = serveBun(manifest, typedBunServeOptions);
serveBun(manifest, requestTypedBunServeOptions);
bunServer.stop();
bunServer.ref?.();
// @ts-expect-error Bun server control methods are readonly.
bunServer.stop = () => undefined;
// @ts-expect-error service-dependent manifests require matching Bun serve plugins.
serveBun(manifest);
const denoFetch = createDenoFetch(manifest, handlerOptions);
const typedDenoFetch: DenoFetchHandler = denoFetch;
const runtimeSubpathTypedDenoFetch: RuntimeSubpathDenoFetchHandler =
  typedDenoFetch;
const createTypedDenoFetch = createDenoFetchFor<AppFetchRequest>();
const typedAppDenoFetch: DenoFetchHandler<AppFetchRequest> =
  createTypedDenoFetch(manifest, handlerOptions);
const createDefaultDenoFetch = createDenoFetchFor();
const defaultDenoFetch: DenoFetchHandler = createDefaultDenoFetch(
  manifest,
  handlerOptions
);
const directHookTypedDenoFetch: DenoFetchHandler<HookAppRequest> =
  createDenoFetch(manifest, typedRequestHandlerOptions);
const hookTypedDenoFetch =
  createDenoFetchFor<HookAppRequest>()(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedDenoFetch =
  createRuntimeSubpathDenoFetchFor<AppFetchRequest>();
const runtimeSubpathTypedAppDenoFetch: RuntimeSubpathDenoFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoFetch(manifest, handlerOptions);
denoFetch(new Request('https://example.com/rpc'));
runtimeSubpathTypedDenoFetch(new Request('https://example.com/rpc'));
defaultDenoFetch(new Request('https://example.com/rpc'));
typedAppDenoFetch(appFetchRequest);
runtimeSubpathTypedAppDenoFetch(appFetchRequest);
directHookTypedDenoFetch(hookAppRequest);
hookTypedDenoFetch(hookAppRequest);
// @ts-expect-error direct typed Deno fetch factories infer custom hook request types.
directHookTypedDenoFetch(new Request('https://example.com/rpc'));
// @ts-expect-error typed Deno fetch factories preserve hook request types.
hookTypedDenoFetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno adapter plugins.
createDenoFetch(manifest);
// @ts-expect-error service-dependent manifests require matching typed Deno fetch plugins.
createTypedDenoFetch(manifest);
const typedDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoFetchOptions: DenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoRouteUnaryFetchOptions: DenoRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoRouteStreamFetchOptions: DenoRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const denoUnaryRouteFetchOptions: DenoUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryFetchOptions;
const denoStreamRouteFetchOptions: DenoStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamFetchOptions;
const denoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoRouteUnaryRpcRequestHandlerOptions: DenoRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoRouteStreamRpcRequestHandlerOptions: DenoRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const denoUnaryRouteRpcRequestHandlerOptions: DenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryRpcRequestHandlerOptions;
const denoStreamRouteRpcRequestHandlerOptions: DenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamRpcRequestHandlerOptions;
const denoFetchOptionsArgs: DenoFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoFetchOptions];
const denoRouteUnaryFetchOptionsArgs: DenoRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteFetchOptions];
const denoRouteStreamFetchOptionsArgs: DenoRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteFetchOptions];
const denoUnaryRouteFetchOptionsArgs: DenoUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteUnaryFetchOptions];
const denoStreamRouteFetchOptionsArgs: DenoStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteStreamFetchOptions];
const denoRpcRequestHandlerOptionsArgs: DenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRpcRequestHandlerOptions];
const denoRouteUnaryRpcRequestHandlerOptionsArgs: DenoRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteRpcRequestHandlerOptions];
const denoRouteStreamRpcRequestHandlerOptionsArgs: DenoRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteRpcRequestHandlerOptions];
const denoUnaryRouteRpcRequestHandlerOptionsArgs: DenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteUnaryRpcRequestHandlerOptions];
const denoStreamRouteRpcRequestHandlerOptionsArgs: DenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteStreamRpcRequestHandlerOptions];
const denoRouteUnaryServeOptions: DenoRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoRouteStreamServeOptions: DenoRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const denoUnaryRouteServeOptions: DenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryServeOptions;
const denoStreamRouteServeOptions: DenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamServeOptions;
const runtimeSubpathDenoRouteUnaryServeOptions: RuntimeSubpathDenoRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteServeOptions;
const runtimeSubpathDenoRouteStreamServeOptions: RuntimeSubpathDenoRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteServeOptions;
const runtimeSubpathDenoUnaryRouteServeOptions: RuntimeSubpathDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryServeOptions;
const runtimeSubpathDenoStreamRouteServeOptions: RuntimeSubpathDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamServeOptions;
const runtimeSubpathDenoFetchOptions: RuntimeSubpathDenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoFetchOptions;
const runtimeSubpathDenoRouteUnaryFetchOptions: RuntimeSubpathDenoRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteFetchOptions;
const runtimeSubpathDenoRouteStreamFetchOptions: RuntimeSubpathDenoRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteFetchOptions;
const runtimeSubpathDenoUnaryRouteFetchOptions: RuntimeSubpathDenoUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryFetchOptions;
const runtimeSubpathDenoStreamRouteFetchOptions: RuntimeSubpathDenoStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamFetchOptions;
const runtimeSubpathDenoRpcRequestHandlerOptions: RuntimeSubpathDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRpcRequestHandlerOptions;
const runtimeSubpathDenoRouteUnaryRpcRequestHandlerOptions: RuntimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathDenoRouteStreamRpcRequestHandlerOptions: RuntimeSubpathDenoRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteRpcRequestHandlerOptions;
const runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryRpcRequestHandlerOptions;
const runtimeSubpathDenoStreamRouteRpcRequestHandlerOptions: RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamRpcRequestHandlerOptions;
const denoServeOptionsArgs: DenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedDenoServeOptions];
const denoRouteUnaryServeOptionsArgs: DenoRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteServeOptions];
const denoRouteStreamServeOptionsArgs: DenoRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteServeOptions];
const denoUnaryRouteServeOptionsArgs: DenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteUnaryServeOptions];
const denoStreamRouteServeOptionsArgs: DenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRouteStreamServeOptions];
const runtimeSubpathDenoFetchOptionsArgs: RuntimeSubpathDenoFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoFetchOptionsArgs;
const runtimeSubpathDenoRouteUnaryFetchOptionsArgs: RuntimeSubpathDenoRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteFetchOptionsArgs;
const runtimeSubpathDenoRouteStreamFetchOptionsArgs: RuntimeSubpathDenoRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteFetchOptionsArgs;
const runtimeSubpathDenoUnaryRouteFetchOptionsArgs: RuntimeSubpathDenoUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryFetchOptionsArgs;
const runtimeSubpathDenoStreamRouteFetchOptionsArgs: RuntimeSubpathDenoStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamFetchOptionsArgs;
const runtimeSubpathDenoRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoRouteStreamRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoServeOptionsArgs: RuntimeSubpathDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoServeOptionsArgs;
const runtimeSubpathDenoRouteUnaryServeOptionsArgs: RuntimeSubpathDenoRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteServeOptionsArgs;
const runtimeSubpathDenoRouteStreamServeOptionsArgs: RuntimeSubpathDenoRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteServeOptionsArgs;
const runtimeSubpathDenoUnaryRouteServeOptionsArgs: RuntimeSubpathDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteUnaryServeOptionsArgs;
const runtimeSubpathDenoStreamRouteServeOptionsArgs: RuntimeSubpathDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRouteStreamServeOptionsArgs;
runtimeSubpathDenoFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathDenoUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoServeOptionsArgs[0]?.hostname?.toUpperCase();
runtimeSubpathDenoUnaryRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoRouteUnaryRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoRouteStreamRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathDenoFetchOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathDenoRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
const exactDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunServeOptions;
const exactDenoServeOptionsBody: HandlerOptionsBody<
  typeof exactDenoServeOptions
> = manifestRouteRequest;
exactDenoServeOptionsBody.input.id.toUpperCase();
const exactDenoFetchOptions: DenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunFetchOptions;
const requestTypedDenoFetchOptions: DenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedBunFetchOptions;
const exactDenoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunRpcRequestHandlerOptions;
const requestTypedDenoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedBunRpcRequestHandlerOptions;
const requestTypedDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedBunServeOptions;
exactDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Deno serve options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
exactDenoFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedDenoFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedDenoServeOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedDenoServeOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Deno serve options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const denoServer: DenoServer = serveDeno(manifest, typedDenoServeOptions);
serveDeno(manifest, requestTypedDenoServeOptions);
denoServer.shutdown().then(() => undefined);
denoServer.finished.then(() => undefined);
// @ts-expect-error Deno server shutdown methods are readonly.
denoServer.shutdown = async () => undefined;
// @ts-expect-error service-dependent manifests require matching Deno serve plugins.
serveDeno(manifest);

// @ts-expect-error Deno adapters only accept typed procedure manifests.
createDenoFetch({ procedures: { broken: { input: t.string() } } });

const denoHandler = createDenoRpcRequestHandler(manifest, handlerOptions);
const typedDenoHandler: DenoRpcRequestHandler = denoHandler;
const runtimeSubpathTypedDenoHandler: RuntimeSubpathDenoRpcRequestHandler =
  typedDenoHandler;
const createTypedDenoHandler =
  createDenoRpcRequestHandlerFor<AppFetchRequest>();
const typedAppDenoHandler: DenoRpcRequestHandler<AppFetchRequest> =
  createTypedDenoHandler(manifest, handlerOptions);
const directHookTypedDenoHandler: DenoRpcRequestHandler<HookAppRequest> =
  createDenoRpcRequestHandler(manifest, typedRequestHandlerOptions);
const hookTypedDenoHandler =
  createDenoRpcRequestHandlerFor<HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const createRuntimeSubpathTypedDenoHandler =
  createRuntimeSubpathDenoRpcRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedAppDenoHandler: RuntimeSubpathDenoRpcRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoHandler(manifest, handlerOptions);
denoHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedDenoHandler(new Request('https://example.com/rpc'));
typedAppDenoHandler(appFetchRequest);
runtimeSubpathTypedAppDenoHandler(appFetchRequest);
directHookTypedDenoHandler(hookAppRequest);
hookTypedDenoHandler(hookAppRequest);
// @ts-expect-error direct typed Deno RPC factories infer custom hook request types.
directHookTypedDenoHandler(new Request('https://example.com/rpc'));
// @ts-expect-error typed Deno RPC factories preserve hook request types.
hookTypedDenoHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Deno RPC adapter plugins.
createDenoRpcRequestHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Deno RPC adapter plugins.
createTypedDenoHandler(manifest);
const standaloneDenoHandler = createStandaloneDenoRpcRequestHandler(
  manifest,
  handlerOptions
);
const typedStandaloneDenoHandler: StandaloneDenoRpcRequestHandler =
  standaloneDenoHandler;
const rootStandaloneDenoHandler: RootStandaloneDenoRpcRequestHandler =
  createRootStandaloneDenoRpcRequestHandler(manifest, handlerOptions);
const runtimeSubpathStandaloneDenoHandler: RuntimeSubpathStandaloneDenoRpcRequestHandler =
  createRuntimeSubpathStandaloneDenoRpcRequestHandler(manifest, handlerOptions);
const createTypedStandaloneDenoHandler =
  createStandaloneDenoRpcRequestHandlerFor<AppFetchRequest>();
const typedAppStandaloneDenoHandler: StandaloneDenoRpcRequestHandler<AppFetchRequest> =
  createTypedStandaloneDenoHandler(manifest, handlerOptions);
const hookTypedStandaloneDenoHandler =
  createStandaloneDenoRpcRequestHandlerFor<HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const createRootTypedStandaloneDenoHandler =
  createRootStandaloneDenoRpcRequestHandlerFor<AppFetchRequest>();
const rootTypedAppStandaloneDenoHandler: RootStandaloneDenoRpcRequestHandler<AppFetchRequest> =
  createRootTypedStandaloneDenoHandler(manifest, handlerOptions);
const createRuntimeSubpathTypedStandaloneDenoHandler =
  createRuntimeSubpathStandaloneDenoRpcRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedAppStandaloneDenoHandler: RuntimeSubpathStandaloneDenoRpcRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedStandaloneDenoHandler(manifest, handlerOptions);
standaloneDenoHandler(new Request('https://example.com/rpc'));
typedStandaloneDenoHandler(new Request('https://example.com/rpc'));
rootStandaloneDenoHandler(new Request('https://example.com/rpc'));
runtimeSubpathStandaloneDenoHandler(new Request('https://example.com/rpc'));
typedAppStandaloneDenoHandler(appFetchRequest);
rootTypedAppStandaloneDenoHandler(appFetchRequest);
runtimeSubpathTypedAppStandaloneDenoHandler(appFetchRequest);
hookTypedStandaloneDenoHandler(hookAppRequest);
// @ts-expect-error typed standalone Deno RPC factories preserve hook request types.
hookTypedStandaloneDenoHandler(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching typed standalone Deno RPC plugins.
createTypedStandaloneDenoHandler(manifest);
const typedStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const standaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const standaloneDenoRouteUnaryRpcRequestHandlerOptions: StandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const standaloneDenoRouteStreamRpcRequestHandlerOptions: StandaloneDenoRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const standaloneDenoUnaryRouteRpcRequestHandlerOptions: StandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryRpcRequestHandlerOptions;
const standaloneDenoStreamRouteRpcRequestHandlerOptions: StandaloneDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamRpcRequestHandlerOptions;
const standaloneDenoRpcRequestHandlerOptionsArgs: StandaloneDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRpcRequestHandlerOptions];
const standaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs: StandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoUnaryRouteRpcRequestHandlerOptions];
const standaloneDenoRouteStreamRpcRequestHandlerOptionsArgs: StandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoStreamRouteRpcRequestHandlerOptions];
const standaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs: StandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRouteUnaryRpcRequestHandlerOptions];
const standaloneDenoStreamRouteRpcRequestHandlerOptionsArgs: StandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRouteStreamRpcRequestHandlerOptions];
const rootStandaloneDenoRpcRequestHandlerOptions: RootStandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRpcRequestHandlerOptions;
const rootStandaloneDenoRouteUnaryRpcRequestHandlerOptions: RootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryRpcRequestHandlerOptions;
const rootStandaloneDenoRouteStreamRpcRequestHandlerOptions: RootStandaloneDenoRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamRpcRequestHandlerOptions;
const rootStandaloneDenoUnaryRouteRpcRequestHandlerOptions: RootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoUnaryRouteRpcRequestHandlerOptions;
const rootStandaloneDenoStreamRouteRpcRequestHandlerOptions: RootStandaloneDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoStreamRouteRpcRequestHandlerOptions;
const rootStandaloneDenoRpcRequestHandlerOptionsArgs: RootStandaloneDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRpcRequestHandlerOptionsArgs;
const rootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs: RootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs;
const rootStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs: RootStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamRpcRequestHandlerOptionsArgs;
const rootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs: RootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs;
const rootStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs: RootStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoStreamRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathStandaloneDenoRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRpcRequestHandlerOptions;
const runtimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteUnaryRpcRequestHandlerOptions;
const runtimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteStreamRpcRequestHandlerOptions;
const runtimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptions: RuntimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoStreamRouteRpcRequestHandlerOptions;
const runtimeSubpathStandaloneDenoRpcRequestHandlerOptionsArgs: RuntimeSubpathStandaloneDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRpcRequestHandlerOptionsArgs;
const runtimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs: RuntimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs;
const runtimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs: RuntimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs;
const runtimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs;
const standaloneDenoRouteUnaryServeOptions: StandaloneDenoRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const standaloneDenoRouteStreamServeOptions: StandaloneDenoRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const standaloneDenoUnaryRouteServeOptions: StandaloneDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryServeOptions;
const standaloneDenoStreamRouteServeOptions: StandaloneDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamServeOptions;
const standaloneDenoServeOptionsArgs: StandaloneDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedStandaloneDenoServeOptions];
const standaloneDenoRouteUnaryServeOptionsArgs: StandaloneDenoRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoUnaryRouteServeOptions];
const standaloneDenoRouteStreamServeOptionsArgs: StandaloneDenoRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoStreamRouteServeOptions];
const standaloneDenoUnaryRouteServeOptionsArgs: StandaloneDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRouteUnaryServeOptions];
const standaloneDenoStreamRouteServeOptionsArgs: StandaloneDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRouteStreamServeOptions];
const rootStandaloneDenoServeOptions: RootStandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = typedStandaloneDenoServeOptions;
const rootStandaloneDenoRouteUnaryServeOptions: RootStandaloneDenoRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryServeOptions;
const rootStandaloneDenoRouteStreamServeOptions: RootStandaloneDenoRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamServeOptions;
const rootStandaloneDenoUnaryRouteServeOptions: RootStandaloneDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoUnaryRouteServeOptions;
const rootStandaloneDenoStreamRouteServeOptions: RootStandaloneDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoStreamRouteServeOptions;
const rootStandaloneDenoServeOptionsArgs: RootStandaloneDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoServeOptionsArgs;
const rootStandaloneDenoRouteUnaryServeOptionsArgs: RootStandaloneDenoRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteUnaryServeOptionsArgs;
const rootStandaloneDenoRouteStreamServeOptionsArgs: RootStandaloneDenoRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoRouteStreamServeOptionsArgs;
const rootStandaloneDenoUnaryRouteServeOptionsArgs: RootStandaloneDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoUnaryRouteServeOptionsArgs;
const rootStandaloneDenoStreamRouteServeOptionsArgs: RootStandaloneDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = standaloneDenoStreamRouteServeOptionsArgs;
const runtimeSubpathStandaloneDenoServeOptions: RuntimeSubpathStandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoServeOptions;
const runtimeSubpathStandaloneDenoRouteUnaryServeOptions: RuntimeSubpathStandaloneDenoRouteUnaryServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteUnaryServeOptions;
const runtimeSubpathStandaloneDenoRouteStreamServeOptions: RuntimeSubpathStandaloneDenoRouteStreamServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteStreamServeOptions;
const runtimeSubpathStandaloneDenoUnaryRouteServeOptions: RuntimeSubpathStandaloneDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoUnaryRouteServeOptions;
const runtimeSubpathStandaloneDenoStreamRouteServeOptions: RuntimeSubpathStandaloneDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoStreamRouteServeOptions;
const runtimeSubpathStandaloneDenoServeOptionsArgs: RuntimeSubpathStandaloneDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoServeOptionsArgs;
const runtimeSubpathStandaloneDenoRouteUnaryServeOptionsArgs: RuntimeSubpathStandaloneDenoRouteUnaryServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteUnaryServeOptionsArgs;
const runtimeSubpathStandaloneDenoRouteStreamServeOptionsArgs: RuntimeSubpathStandaloneDenoRouteStreamServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoRouteStreamServeOptionsArgs;
const runtimeSubpathStandaloneDenoUnaryRouteServeOptionsArgs: RuntimeSubpathStandaloneDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoUnaryRouteServeOptionsArgs;
const runtimeSubpathStandaloneDenoStreamRouteServeOptionsArgs: RuntimeSubpathStandaloneDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootStandaloneDenoStreamRouteServeOptionsArgs;
standaloneDenoRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
standaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoRouteStreamRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoServeOptionsArgs[0]?.port?.toFixed();
standaloneDenoUnaryRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoRouteUnaryServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoRouteStreamServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoRouteUnaryServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoRouteStreamServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoServeOptionsArgs[0]?.port?.toFixed();
runtimeSubpathStandaloneDenoRouteUnaryServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRouteStreamServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoStreamRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRouteUnaryServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRouteStreamServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoUnaryRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoStreamRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
standaloneDenoRouteUnaryRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoRouteStreamRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathStandaloneDenoRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoRouteStreamRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
const exactStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactDenoServeOptions;
const exactStandaloneDenoServeOptionsBody: HandlerOptionsBody<
  typeof exactStandaloneDenoServeOptions
> = manifestRouteRequest;
exactStandaloneDenoServeOptionsBody.input.id.toUpperCase();
const requestTypedStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedBunServeOptions;
const exactStandaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactDenoRpcRequestHandlerOptions;
const requestTypedStandaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedDenoRpcRequestHandlerOptions;
exactStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact standalone Deno serve options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
exactStandaloneDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed standalone Deno serve options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedStandaloneDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const standaloneDenoServer: StandaloneDenoServer = serveStandaloneDeno(
  manifest,
  typedStandaloneDenoServeOptions
);
serveStandaloneDeno(manifest, requestTypedStandaloneDenoServeOptions);
const rootStandaloneDenoServer: RootStandaloneDenoServer =
  serveRootStandaloneDeno(manifest, rootStandaloneDenoServeOptions);
serveRootStandaloneDeno(manifest, requestTypedStandaloneDenoServeOptions);
const runtimeSubpathStandaloneDenoServer: RuntimeSubpathStandaloneDenoServer =
  serveRuntimeSubpathStandaloneDeno(
    manifest,
    runtimeSubpathStandaloneDenoServeOptions
  );
serveRuntimeSubpathStandaloneDeno(
  manifest,
  requestTypedStandaloneDenoServeOptions
);
standaloneDenoServer.shutdown().then(() => undefined);
rootStandaloneDenoServer.finished.then(() => undefined);
runtimeSubpathStandaloneDenoServer.finished.then(() => undefined);
// @ts-expect-error standalone Deno server shutdown methods are readonly.
standaloneDenoServer.shutdown = async () => undefined;
// @ts-expect-error standalone Deno server shutdown methods are readonly across root exports.
rootStandaloneDenoServer.shutdown = async () => undefined;
// @ts-expect-error standalone Deno server shutdown methods are readonly across runtime subpath exports.
runtimeSubpathStandaloneDenoServer.shutdown = async () => undefined;
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
const exactDenoTransportResultFor: DenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = manifestRouteBodyResult;
const denoRouteUnaryTransportResultFor: DenoRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = manifestRouteBodyResult;
const denoRouteStreamTransportResultFor: DenoRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = new Response();
const denoUnaryRouteTransportResultFor: DenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoRouteUnaryTransportResultFor;
const denoStreamRouteTransportResultFor: DenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoRouteStreamTransportResultFor;
if (
  !(denoTransportResultFor instanceof Response) &&
  !Array.isArray(denoTransportResultFor) &&
  'ok' in denoTransportResultFor &&
  denoTransportResultFor.ok
) {
  denoTransportResultFor.data.name.toUpperCase();
}
if (
  !(exactDenoTransportResultFor instanceof Response) &&
  'ok' in exactDenoTransportResultFor &&
  exactDenoTransportResultFor.ok
) {
  exactDenoTransportResultFor.data.name.toUpperCase();
}
const denoTransportHandler: DenoTransportBodyResultHandler = async () =>
  denoTransportResult;
const syncDenoTransportHandler: DenoTransportBodyResultHandler = () =>
  denoTransportResult;
const denoTransportRequestHandler: DenoTransportRequestHandler =
  createDenoTransportRequestHandler(denoTransportHandler);
const denoTransportRequestHandlerWithPath: DenoTransportRequestHandler =
  createDenoTransportRequestHandlerWithPath(denoTransportHandler, '/rpc');
const createTypedDenoTransportRequestHandler =
  createDenoTransportRequestHandlerFor<AppFetchRequest>();
const typedDenoTransportRequestHandler: DenoTransportRequestHandler<AppFetchRequest> =
  createTypedDenoTransportRequestHandler(denoTransportHandler);
const createTypedDenoTransportRequestHandlerWithPath =
  createDenoTransportRequestHandlerWithPathFor<AppFetchRequest>();
const typedDenoTransportRequestHandlerWithPath: DenoTransportRequestHandler<AppFetchRequest> =
  createTypedDenoTransportRequestHandlerWithPath(denoTransportHandler, '/rpc');
createDenoTransportRequestHandler(syncDenoTransportHandler);
createDenoTransportRequestHandlerWithPath(syncDenoTransportHandler, '/rpc');
const runtimeSubpathDenoTransportRequestHandler: RuntimeSubpathDenoTransportRequestHandler =
  denoTransportRequestHandler;
const createRuntimeSubpathTypedDenoTransportRequestHandler =
  createRuntimeSubpathDenoTransportRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedDenoTransportRequestHandler: RuntimeSubpathDenoTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoTransportRequestHandler(denoTransportHandler);
const createRuntimeSubpathTypedDenoTransportRequestHandlerWithPath =
  createRuntimeSubpathDenoTransportRequestHandlerWithPathFor<AppFetchRequest>();
const runtimeSubpathTypedDenoTransportRequestHandlerWithPath: RuntimeSubpathDenoTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoTransportRequestHandlerWithPath(
    denoTransportHandler,
    '/rpc'
  );
denoTransportRequestHandler(new Request('https://example.com/rpc'));
denoTransportRequestHandlerWithPath(new Request('https://example.com/rpc'));
runtimeSubpathDenoTransportRequestHandler(
  new Request('https://example.com/rpc')
);
typedDenoTransportRequestHandler(appFetchRequest);
typedDenoTransportRequestHandlerWithPath(appFetchRequest);
runtimeSubpathTypedDenoTransportRequestHandler(appFetchRequest);
runtimeSubpathTypedDenoTransportRequestHandlerWithPath(appFetchRequest);
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
const syncManifestDenoTransportHandler: DenoTransportBodyResultHandlerFor<
  typeof manifest
> = (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
  }
  return {
    body: '{"ok":true}',
    headers: { 'cache-control': 'private' },
    responseHeaders: { 'cache-control': 'private' },
  };
};
const manifestDenoRouteUnaryTransportHandler: DenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const syncManifestDenoRouteUnaryTransportHandler: DenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoTransportHandler;
const manifestDenoRouteStreamTransportHandler: DenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const syncManifestDenoRouteStreamTransportHandler: DenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoTransportHandler;
const manifestDenoUnaryRouteTransportHandler: DenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoRouteUnaryTransportHandler;
const manifestDenoStreamRouteTransportHandler: DenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoRouteStreamTransportHandler;
createDenoTransportRequestHandler(manifestDenoTransportHandler);
createDenoTransportRequestHandler(syncManifestDenoTransportHandler);
Promise.resolve(
  manifestDenoTransportHandler(createFetchRequestSourceForTypes(), manifestRouteRequest)
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
manifestDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncManifestDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error Deno unary route transport handlers reject stream bodies.
  manifestStreamRouteBody
);
manifestDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error Deno stream route transport handlers reject unary bodies.
  manifestUnaryRouteBody
);
// @ts-expect-error typed Deno transport handlers validate body input by route id.
routeTypedDenoTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
const _bunTransportResult: BunTransportBodyResult = denoTransportResult;
const bunTransportResultFor: BunTransportBodyResultFor<typeof manifest> =
  denoTransportResultFor;
const exactBunTransportResultFor: BunTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactDenoTransportResultFor;
const bunRouteUnaryTransportResultFor: BunRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoRouteUnaryTransportResultFor;
const bunRouteStreamTransportResultFor: BunRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoRouteStreamTransportResultFor;
const bunUnaryRouteTransportResultFor: BunUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoUnaryRouteTransportResultFor;
const bunStreamRouteTransportResultFor: BunStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoStreamRouteTransportResultFor;
const rootDenoCompiledTransportResultFor: RootDenoCompiledTransportBodyResultFor<
  typeof manifest
> = bunTransportResultFor;
const exactRootDenoCompiledTransportResultFor: RootDenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactBunTransportResultFor;
const routeTypedBunTransportHandler: BunTransportBodyResultHandler<
  JoorManifestRouteBody<typeof manifest>,
  JoorManifestRouteBodyResult<typeof manifest>
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.authenticated') {
    body.input.ok.valueOf();
  }
  return manifestRouteBodyResult;
};
const syncBunTransportHandler: BunTransportBodyResultHandler = () =>
  denoTransportResult;
const bunTransportRequestHandler: BunTransportRequestHandler =
  createBunTransportRequestHandler(routeTypedBunTransportHandler);
const bunTransportRequestHandlerWithPath: BunTransportRequestHandler =
  createBunTransportRequestHandlerWithPath(
    routeTypedBunTransportHandler,
    '/rpc'
  );
const createTypedBunTransportRequestHandler =
  createBunTransportRequestHandlerFor<AppFetchRequest>();
const typedBunTransportRequestHandler: BunTransportRequestHandler<AppFetchRequest> =
  createTypedBunTransportRequestHandler(routeTypedBunTransportHandler);
const createTypedBunTransportRequestHandlerWithPath =
  createBunTransportRequestHandlerWithPathFor<AppFetchRequest>();
const typedBunTransportRequestHandlerWithPath: BunTransportRequestHandler<AppFetchRequest> =
  createTypedBunTransportRequestHandlerWithPath(
    routeTypedBunTransportHandler,
    '/rpc'
  );
createBunTransportRequestHandler(syncBunTransportHandler);
createBunTransportRequestHandlerWithPath(syncBunTransportHandler, '/rpc');
const runtimeSubpathBunTransportRequestHandler: RuntimeSubpathBunTransportRequestHandler =
  bunTransportRequestHandler;
const createRuntimeSubpathTypedBunTransportRequestHandler =
  createRuntimeSubpathBunTransportRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedBunTransportRequestHandler: RuntimeSubpathBunTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedBunTransportRequestHandler(
    routeTypedBunTransportHandler
  );
const createRuntimeSubpathTypedBunTransportRequestHandlerWithPath =
  createRuntimeSubpathBunTransportRequestHandlerWithPathFor<AppFetchRequest>();
const runtimeSubpathTypedBunTransportRequestHandlerWithPath: RuntimeSubpathBunTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedBunTransportRequestHandlerWithPath(
    routeTypedBunTransportHandler,
    '/rpc'
  );
bunTransportRequestHandler(new Request('https://example.com/rpc'));
bunTransportRequestHandlerWithPath(new Request('https://example.com/rpc'));
runtimeSubpathBunTransportRequestHandler(
  new Request('https://example.com/rpc')
);
typedBunTransportRequestHandler(appFetchRequest);
typedBunTransportRequestHandlerWithPath(appFetchRequest);
runtimeSubpathTypedBunTransportRequestHandler(appFetchRequest);
runtimeSubpathTypedBunTransportRequestHandlerWithPath(appFetchRequest);
const manifestBunTransportHandler: BunTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const syncManifestBunTransportHandler: BunTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoTransportHandler;
const manifestBunRouteUnaryTransportHandler: BunRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunTransportHandler;
const syncManifestBunRouteUnaryTransportHandler: BunRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestBunTransportHandler;
const manifestBunRouteStreamTransportHandler: BunRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunTransportHandler;
const syncManifestBunRouteStreamTransportHandler: BunRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestBunTransportHandler;
const manifestBunUnaryRouteTransportHandler: BunUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunRouteUnaryTransportHandler;
const manifestBunStreamRouteTransportHandler: BunStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunRouteStreamTransportHandler;
createBunTransportRequestHandler(manifestBunTransportHandler);
createBunTransportRequestHandler(syncManifestBunTransportHandler);
manifestBunUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestBunStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestBunRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncManifestBunRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestBunRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestBunRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
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
const exactStandaloneDenoTransportResultFor: StandaloneDenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRootDenoCompiledTransportResultFor;
const standaloneDenoRouteUnaryTransportResultFor: StandaloneDenoRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = bunUnaryRouteTransportResultFor;
const standaloneDenoRouteStreamTransportResultFor: StandaloneDenoRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = bunStreamRouteTransportResultFor;
const standaloneDenoUnaryRouteTransportResultFor: StandaloneDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = bunRouteUnaryTransportResultFor;
const standaloneDenoStreamRouteTransportResultFor: StandaloneDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = bunRouteStreamTransportResultFor;
const rootStandaloneDenoTransportResult: RootStandaloneDenoTransportBodyResult =
  standaloneDenoTransportResult;
const runtimeSubpathStandaloneDenoTransportResult: RuntimeSubpathStandaloneDenoTransportBodyResult =
  rootStandaloneDenoTransportResult;
const rootStandaloneDenoTransportResultFor: RootStandaloneDenoTransportBodyResultFor<
  typeof manifest
> = standaloneDenoTransportResultFor;
const exactRootStandaloneDenoTransportResultFor: RootStandaloneDenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactStandaloneDenoTransportResultFor;
const rootStandaloneDenoRouteUnaryTransportResultFor: RootStandaloneDenoRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = standaloneDenoRouteUnaryTransportResultFor;
const rootStandaloneDenoRouteStreamTransportResultFor: RootStandaloneDenoRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = standaloneDenoRouteStreamTransportResultFor;
const rootStandaloneDenoUnaryRouteTransportResultFor: RootStandaloneDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = standaloneDenoUnaryRouteTransportResultFor;
const rootStandaloneDenoStreamRouteTransportResultFor: RootStandaloneDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = standaloneDenoStreamRouteTransportResultFor;
const runtimeSubpathStandaloneDenoTransportResultFor: RuntimeSubpathStandaloneDenoTransportBodyResultFor<
  typeof manifest
> = rootStandaloneDenoTransportResultFor;
const exactRuntimeSubpathStandaloneDenoTransportResultFor: RuntimeSubpathStandaloneDenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRootStandaloneDenoTransportResultFor;
const runtimeSubpathStandaloneDenoRouteUnaryTransportResultFor: RuntimeSubpathStandaloneDenoRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = rootStandaloneDenoRouteUnaryTransportResultFor;
const runtimeSubpathStandaloneDenoRouteStreamTransportResultFor: RuntimeSubpathStandaloneDenoRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = rootStandaloneDenoRouteStreamTransportResultFor;
const runtimeSubpathStandaloneDenoUnaryRouteTransportResultFor: RuntimeSubpathStandaloneDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = rootStandaloneDenoUnaryRouteTransportResultFor;
const runtimeSubpathStandaloneDenoStreamRouteTransportResultFor: RuntimeSubpathStandaloneDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = rootStandaloneDenoStreamRouteTransportResultFor;
runtimeSubpathStandaloneDenoTransportResult.id.toUpperCase();
runtimeSubpathStandaloneDenoTransportResultFor.valueOf();
exactRuntimeSubpathStandaloneDenoTransportResultFor.valueOf();
runtimeSubpathStandaloneDenoRouteUnaryTransportResultFor.valueOf();
runtimeSubpathStandaloneDenoRouteStreamTransportResultFor.valueOf();
runtimeSubpathStandaloneDenoUnaryRouteTransportResultFor.valueOf();
runtimeSubpathStandaloneDenoStreamRouteTransportResultFor.valueOf();
const denoCompiledTransportResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest
> = standaloneDenoTransportResultFor;
const exactDenoCompiledTransportResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactStandaloneDenoTransportResultFor;
const denoCompiledRouteUnaryTransportResultFor: DenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = standaloneDenoUnaryRouteTransportResultFor;
const denoCompiledRouteStreamTransportResultFor: DenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = standaloneDenoStreamRouteTransportResultFor;
const denoCompiledUnaryRouteTransportResultFor: DenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = standaloneDenoRouteUnaryTransportResultFor;
const denoCompiledStreamRouteTransportResultFor: DenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = standaloneDenoRouteStreamTransportResultFor;
const rootDenoCompiledRouteUnaryTransportResultFor: RootDenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledUnaryRouteTransportResultFor;
const rootDenoCompiledRouteStreamTransportResultFor: RootDenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledStreamRouteTransportResultFor;
const rootDenoCompiledUnaryRouteTransportResultFor: RootDenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledRouteUnaryTransportResultFor;
const rootDenoCompiledStreamRouteTransportResultFor: RootDenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledRouteStreamTransportResultFor;
rootDenoCompiledUnaryRouteTransportResultFor.valueOf();
rootDenoCompiledStreamRouteTransportResultFor.valueOf();
rootDenoCompiledRouteUnaryTransportResultFor.valueOf();
rootDenoCompiledRouteStreamTransportResultFor.valueOf();
const standaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandler =
  async () => standaloneDenoTransportResult;
const syncStandaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandler =
  () => standaloneDenoTransportResult;
const standaloneDenoTransportRequestHandler: StandaloneDenoTransportRequestHandler =
  createStandaloneDenoTransportRequestHandler(standaloneDenoTransportHandler);
const rootStandaloneDenoTransportHandler: RootStandaloneDenoTransportBodyResultHandler =
  standaloneDenoTransportHandler;
const rootStandaloneDenoTransportRequestHandler: RootStandaloneDenoTransportRequestHandler =
  createRootStandaloneDenoTransportRequestHandler(
    rootStandaloneDenoTransportHandler
  );
const runtimeSubpathStandaloneDenoTransportHandler: RuntimeSubpathStandaloneDenoTransportBodyResultHandler =
  rootStandaloneDenoTransportHandler;
const runtimeSubpathStandaloneDenoTransportRequestHandler: RuntimeSubpathStandaloneDenoTransportRequestHandler =
  createRuntimeSubpathStandaloneDenoTransportRequestHandler(
    runtimeSubpathStandaloneDenoTransportHandler
  );
const createTypedStandaloneDenoTransportRequestHandler =
  createStandaloneDenoTransportRequestHandlerFor<AppFetchRequest>();
const typedStandaloneDenoTransportRequestHandler: StandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createTypedStandaloneDenoTransportRequestHandler(standaloneDenoTransportHandler);
const createTypedStandaloneDenoTransportRequestHandlerWithPath =
  createStandaloneDenoTransportRequestHandlerWithPathFor<AppFetchRequest>();
const typedStandaloneDenoTransportRequestHandlerWithPath: StandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createTypedStandaloneDenoTransportRequestHandlerWithPath(
    standaloneDenoTransportHandler,
    '/rpc'
  );
const createRootTypedStandaloneDenoTransportRequestHandler =
  createRootStandaloneDenoTransportRequestHandlerFor<AppFetchRequest>();
const rootTypedStandaloneDenoTransportRequestHandler: RootStandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createRootTypedStandaloneDenoTransportRequestHandler(
    rootStandaloneDenoTransportHandler
  );
const createRootTypedStandaloneDenoTransportRequestHandlerWithPath =
  createRootStandaloneDenoTransportRequestHandlerWithPathFor<AppFetchRequest>();
const rootTypedStandaloneDenoTransportRequestHandlerWithPath: RootStandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createRootTypedStandaloneDenoTransportRequestHandlerWithPath(
    rootStandaloneDenoTransportHandler,
    '/rpc'
  );
const createRuntimeSubpathTypedStandaloneDenoTransportRequestHandler =
  createRuntimeSubpathStandaloneDenoTransportRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedStandaloneDenoTransportRequestHandler: RuntimeSubpathStandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedStandaloneDenoTransportRequestHandler(
    runtimeSubpathStandaloneDenoTransportHandler
  );
const createRuntimeSubpathTypedStandaloneDenoTransportRequestHandlerWithPath =
  createRuntimeSubpathStandaloneDenoTransportRequestHandlerWithPathFor<AppFetchRequest>();
const runtimeSubpathTypedStandaloneDenoTransportRequestHandlerWithPath: RuntimeSubpathStandaloneDenoTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedStandaloneDenoTransportRequestHandlerWithPath(
    runtimeSubpathStandaloneDenoTransportHandler,
    '/rpc'
  );
standaloneDenoTransportRequestHandler(new Request('https://example.com/rpc'));
rootStandaloneDenoTransportRequestHandler(
  new Request('https://example.com/rpc')
);
runtimeSubpathStandaloneDenoTransportRequestHandler(
  new Request('https://example.com/rpc')
);
typedStandaloneDenoTransportRequestHandler(appFetchRequest);
typedStandaloneDenoTransportRequestHandlerWithPath(appFetchRequest);
rootTypedStandaloneDenoTransportRequestHandler(appFetchRequest);
rootTypedStandaloneDenoTransportRequestHandlerWithPath(appFetchRequest);
runtimeSubpathTypedStandaloneDenoTransportRequestHandler(appFetchRequest);
runtimeSubpathTypedStandaloneDenoTransportRequestHandlerWithPath(
  appFetchRequest
);
createStandaloneDenoTransportRequestHandler(standaloneDenoTransportHandler);
createStandaloneDenoTransportRequestHandlerWithPath(
  standaloneDenoTransportHandler,
  '/rpc'
);
createStandaloneDenoTransportRequestHandler(syncStandaloneDenoTransportHandler);
createStandaloneDenoTransportRequestHandlerWithPath(
  syncStandaloneDenoTransportHandler,
  '/rpc'
);
createRootStandaloneDenoTransportRequestHandlerWithPath(
  rootStandaloneDenoTransportHandler,
  '/rpc'
);
createRuntimeSubpathStandaloneDenoTransportRequestHandlerWithPath(
  runtimeSubpathStandaloneDenoTransportHandler,
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
const syncManifestStandaloneDenoTransportHandler: StandaloneDenoTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoTransportHandler;
const manifestStandaloneDenoRouteUnaryTransportHandler: StandaloneDenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const syncManifestStandaloneDenoRouteUnaryTransportHandler: StandaloneDenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestStandaloneDenoTransportHandler;
const manifestStandaloneDenoRouteStreamTransportHandler: StandaloneDenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const syncManifestStandaloneDenoRouteStreamTransportHandler: StandaloneDenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestStandaloneDenoTransportHandler;
const manifestStandaloneDenoUnaryRouteTransportHandler: StandaloneDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoRouteUnaryTransportHandler;
const manifestStandaloneDenoStreamRouteTransportHandler: StandaloneDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoRouteStreamTransportHandler;
const rootManifestStandaloneDenoTransportHandler: RootStandaloneDenoTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const rootManifestStandaloneDenoRouteUnaryTransportHandler: RootStandaloneDenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestStandaloneDenoTransportHandler;
const rootManifestStandaloneDenoRouteStreamTransportHandler: RootStandaloneDenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestStandaloneDenoTransportHandler;
const rootManifestStandaloneDenoUnaryRouteTransportHandler: RootStandaloneDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestStandaloneDenoRouteUnaryTransportHandler;
const rootManifestStandaloneDenoStreamRouteTransportHandler: RootStandaloneDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestStandaloneDenoRouteStreamTransportHandler;
const runtimeSubpathManifestStandaloneDenoTransportHandler: RuntimeSubpathStandaloneDenoTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestStandaloneDenoTransportHandler;
const runtimeSubpathManifestStandaloneDenoRouteUnaryTransportHandler: RuntimeSubpathStandaloneDenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestStandaloneDenoTransportHandler;
const runtimeSubpathManifestStandaloneDenoRouteStreamTransportHandler: RuntimeSubpathStandaloneDenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestStandaloneDenoTransportHandler;
const runtimeSubpathManifestStandaloneDenoUnaryRouteTransportHandler: RuntimeSubpathStandaloneDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestStandaloneDenoRouteUnaryTransportHandler;
const runtimeSubpathManifestStandaloneDenoStreamRouteTransportHandler: RuntimeSubpathStandaloneDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestStandaloneDenoRouteStreamTransportHandler;
createStandaloneDenoTransportRequestHandler(
  manifestStandaloneDenoTransportHandler
);
createRootStandaloneDenoTransportRequestHandler(
  rootManifestStandaloneDenoTransportHandler
);
createRuntimeSubpathStandaloneDenoTransportRequestHandler(
  runtimeSubpathManifestStandaloneDenoTransportHandler
);
rootManifestStandaloneDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
rootManifestStandaloneDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestStandaloneDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestStandaloneDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestStandaloneDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncManifestStandaloneDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestStandaloneDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestStandaloneDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestStandaloneDenoTransportHandler(createFetchRequestSourceForTypes(), [
  // @ts-expect-error manifest-aware standalone Deno handlers reject stream requests in batches.
  { id: 'users.watch', input: { userId: '1' } },
]);
runtimeSubpathManifestStandaloneDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestStandaloneDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestStandaloneDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestStandaloneDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
const maxBodyBytes: number = DEFAULT_MAX_BODY_BYTES;
const runtimeSubpathMaxBodyBytes: number =
  RUNTIME_SUBPATH_DEFAULT_MAX_BODY_BYTES;
const runtimeBodySubpathMaxBodyBytes: number =
  RUNTIME_BODY_SUBPATH_DEFAULT_MAX_BODY_BYTES;
const bodyLimitError = new BodySizeLimitError(1024);
const runtimeSubpathBodyLimitError = new RuntimeSubpathBodySizeLimitError(1024);
const runtimeBodySubpathBodyLimitError =
  new RuntimeBodySubpathBodySizeLimitError(1024);
const normalizedMaxBodyBytes: number = normalizeMaxBodyBytes(maxBodyBytes);
const normalizedRuntimeSubpathMaxBodyBytes: number =
  normalizeRuntimeSubpathMaxBodyBytes(runtimeSubpathMaxBodyBytes);
const normalizedRuntimeBodySubpathMaxBodyBytes: number =
  normalizeRuntimeBodySubpathMaxBodyBytes(runtimeBodySubpathMaxBodyBytes);
if (isBodySizeLimitError(bodyLimitError)) {
  bodyLimitError.limit.toFixed();
}
if (isRuntimeSubpathBodySizeLimitError(runtimeSubpathBodyLimitError)) {
  runtimeSubpathBodyLimitError.limit.toFixed();
}
if (isRuntimeBodySubpathBodySizeLimitError(runtimeBodySubpathBodyLimitError)) {
  runtimeBodySubpathBodyLimitError.limit.toFixed();
}
readJsonRequestBody(new Request('https://example.com/rpc'));
readJsonRequestBodyWithLimit(new Request('https://example.com/rpc'), 1024);
readRuntimeSubpathJsonRequestBody(new Request('https://example.com/rpc'));
readRuntimeSubpathJsonRequestBodyWithLimit(
  new Request('https://example.com/rpc'),
  1024
);
readRuntimeBodySubpathJsonRequestBody(new Request('https://example.com/rpc'));
readRuntimeBodySubpathJsonRequestBodyWithLimit(
  new Request('https://example.com/rpc'),
  1024
);
normalizedMaxBodyBytes.toFixed();
normalizedRuntimeSubpathMaxBodyBytes.toFixed();
normalizedRuntimeBodySubpathMaxBodyBytes.toFixed();
const compiledSerializedEnvelope: CompiledSerializedEnvelope = {
  body: '{"ok":true}',
  headers: { 'cache-control': 'private' },
  responseHeaders: { 'cache-control': 'private' },
};
compiledSerializedEnvelope.headers?.['cache-control']?.toUpperCase();
// @ts-expect-error serialized envelope bodies are readonly.
compiledSerializedEnvelope.body = '{"ok":false}';
// @ts-expect-error serialized envelope header maps are readonly.
compiledSerializedEnvelope.headers = { 'cache-control': 'public' };
if (compiledSerializedEnvelope.headers !== undefined) {
  // @ts-expect-error serialized envelope header values are readonly.
  compiledSerializedEnvelope.headers['cache-control'] = 'public';
}
if (compiledSerializedEnvelope.responseHeaders !== undefined) {
  // @ts-expect-error serialized envelope response header values are readonly.
  compiledSerializedEnvelope.responseHeaders['cache-control'] = 'public';
}
const serializedJsonEnvelope: SerializedJsonEnvelope =
  compiledSerializedEnvelope;
const runtimeSubpathSerializedJsonEnvelope: RuntimeSubpathSerializedJsonEnvelope =
  serializedJsonEnvelope;
const runtimeResponseSubpathSerializedJsonEnvelope: RuntimeResponseSubpathSerializedJsonEnvelope =
  runtimeSubpathSerializedJsonEnvelope;
const corsHeaderOptions: CorsHeaderOptions = {
  origin: 'https://example.com',
  headers: ['content-type'],
  methods: ['POST'],
};
const runtimeSubpathCorsHeaderOptions: RuntimeSubpathCorsHeaderOptions =
  corsHeaderOptions;
const runtimeResponseSubpathCorsHeaderOptions: RuntimeResponseSubpathCorsHeaderOptions =
  runtimeSubpathCorsHeaderOptions;
runtimeResponseSubpathCorsHeaderOptions.origin?.toUpperCase();
// @ts-expect-error CORS origins are readonly.
corsHeaderOptions.origin = 'https://example.org';
if (corsHeaderOptions.headers !== undefined) {
  // @ts-expect-error CORS header lists are readonly.
  corsHeaderOptions.headers.push('authorization');
}
if (runtimeResponseSubpathCorsHeaderOptions.methods !== undefined) {
  // @ts-expect-error CORS method lists are readonly across subpath exports.
  runtimeResponseSubpathCorsHeaderOptions.methods[0] = 'OPTIONS';
}
const transportBodyResult: TransportBodyResult = serializedJsonEnvelope;
const runtimeSubpathTransportBodyResult: RuntimeSubpathTransportBodyResult =
  transportBodyResult;
const runtimeResponseSubpathTransportBodyResult: RuntimeResponseSubpathTransportBodyResult =
  runtimeSubpathTransportBodyResult;
const transportBodyResultFor: TransportBodyResultFor<typeof manifest> =
  manifestRouteBodyResult;
const exactTransportBodyResultFor: TransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = manifestRouteBodyResult;
const runtimeSubpathTransportBodyResultFor: RuntimeSubpathTransportBodyResultFor<
  typeof manifest
> = transportBodyResultFor;
const runtimeSubpathExactTransportBodyResultFor: RuntimeSubpathTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactTransportBodyResultFor;
const runtimeResponseSubpathTransportBodyResultFor: RuntimeResponseSubpathTransportBodyResultFor<
  typeof manifest
> = transportBodyResultFor;
const runtimeResponseSubpathExactTransportBodyResultFor: RuntimeResponseSubpathTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactTransportBodyResultFor;
if (isSerializedJsonEnvelope(transportBodyResult)) {
  transportBodyResult.body.toUpperCase();
}
if (
  !(runtimeSubpathTransportBodyResultFor instanceof Response) &&
  !Array.isArray(runtimeSubpathTransportBodyResultFor) &&
  'ok' in runtimeSubpathTransportBodyResultFor &&
  runtimeSubpathTransportBodyResultFor.ok
) {
  runtimeSubpathTransportBodyResultFor.data.name.toUpperCase();
}
if (
  !(runtimeSubpathExactTransportBodyResultFor instanceof Response) &&
  'ok' in runtimeSubpathExactTransportBodyResultFor &&
  runtimeSubpathExactTransportBodyResultFor.ok
) {
  runtimeSubpathExactTransportBodyResultFor.data.name.toUpperCase();
}
if (isRuntimeSubpathSerializedJsonEnvelope(runtimeSubpathTransportBodyResult)) {
  runtimeSubpathTransportBodyResult.body.toUpperCase();
}
if (
  isRuntimeResponseSubpathSerializedJsonEnvelope(
    runtimeResponseSubpathTransportBodyResult
  )
) {
  runtimeResponseSubpathTransportBodyResult.body.toUpperCase();
}
if (
  !(runtimeResponseSubpathTransportBodyResultFor instanceof Response) &&
  !Array.isArray(runtimeResponseSubpathTransportBodyResultFor) &&
  'ok' in runtimeResponseSubpathTransportBodyResultFor &&
  runtimeResponseSubpathTransportBodyResultFor.ok
) {
  runtimeResponseSubpathTransportBodyResultFor.data.name.toUpperCase();
}
if (
  !(runtimeResponseSubpathExactTransportBodyResultFor instanceof Response) &&
  'ok' in runtimeResponseSubpathExactTransportBodyResultFor &&
  runtimeResponseSubpathExactTransportBodyResultFor.ok
) {
  runtimeResponseSubpathExactTransportBodyResultFor.data.name.toUpperCase();
}
const jsonHeaderRecord = createJsonHeaderRecord({
  'cache-control': 'private',
});
const readonlyJsonHeaderSource: Readonly<Record<string, string>> = {
  'cache-control': 'private',
};
createJsonHeaderRecord(readonlyJsonHeaderSource);
const runtimeSubpathJsonHeaderRecord = runtimeSubpathCreateJsonHeaderRecord({
  etag: '"v1"',
});
const runtimeResponseSubpathJsonHeaderRecord =
  runtimeResponseSubpathCreateJsonHeaderRecord({
    'x-ignored': 'value',
  });
appendJsonStringHeaders(jsonHeaderRecord, { etag: '"v2"' });
appendJsonStringHeaders(jsonHeaderRecord, readonlyJsonHeaderSource);
runtimeSubpathAppendJsonStringHeaders(runtimeSubpathJsonHeaderRecord, {
  'cache-control': 'private',
});
runtimeResponseSubpathAppendJsonStringHeaders(
  runtimeResponseSubpathJsonHeaderRecord,
  { etag: '"v3"' }
);
jsonHeaderRecord['content-type']?.toUpperCase();
runtimeSubpathJsonHeaderRecord['etag']?.toUpperCase();
runtimeResponseSubpathJsonHeaderRecord['x-ignored']?.toUpperCase();
hasInvalidHeaderValue('ok').valueOf();
runtimeSubpathHasInvalidHeaderValue('ok').valueOf();
runtimeResponseSubpathHasInvalidHeaderValue('ok').valueOf();
jsonContentHeaders['content-type'].toUpperCase();
runtimeSubpathJsonContentHeaders['content-type'].toUpperCase();
runtimeResponseSubpathJsonContentHeaders['content-type'].toUpperCase();
jsonOkResponseInit.headers?.valueOf();
runtimeSubpathJsonOkResponseInit.headers?.valueOf();
runtimeResponseSubpathJsonOkResponseInit.headers?.valueOf();
// @ts-expect-error JSON response init status is readonly.
jsonOkResponseInit.status = 201;
// @ts-expect-error runtime JSON response init headers are readonly.
runtimeSubpathJsonOkResponseInit.headers = {};
// @ts-expect-error runtime/response JSON response init status is readonly.
runtimeResponseSubpathJsonOkResponseInit.status = 201;
rpcEnvelopeToResponse(manifestRouteEnvelope).headers.get('content-type');
rpcEnvelopeToResponse(manifestRouteEnvelope, readonlyJsonHeaderSource).headers.get(
  'content-type'
);
runtimeSubpathRpcEnvelopeToResponse(manifestRouteEnvelope).headers.get(
  'content-type'
);
runtimeResponseSubpathRpcEnvelopeToResponse(manifestRouteEnvelope).headers.get(
  'content-type'
);
serializedEnvelopeToResponse(serializedJsonEnvelope).headers.get(
  'content-type'
);
runtimeSubpathSerializedEnvelopeToResponse(
  runtimeSubpathSerializedJsonEnvelope
).headers.get('content-type');
runtimeResponseSubpathSerializedEnvelopeToResponse(
  runtimeResponseSubpathSerializedJsonEnvelope
).headers.get('content-type');
transportResultToResponse(manifestRouteEnvelope).headers.get('content-type');
transportResultToResponse(
  manifestRouteEnvelope,
  readonlyJsonHeaderSource
).headers.get('content-type');
runtimeSubpathTransportResultToResponse(
  runtimeSubpathSerializedJsonEnvelope
).headers.get('content-type');
runtimeResponseSubpathTransportResultToResponse(
  runtimeResponseSubpathSerializedJsonEnvelope
).headers.get('content-type');
const rootCompiledSerializedEnvelope: RootCompiledSerializedEnvelope =
  compiledSerializedEnvelope;
rootCompiledSerializedEnvelope.body.toUpperCase();
const compiledBodyResultFor: CompiledBodyResultFor<typeof manifest> =
  manifestRouteBodyResult;
const rootCompiledBodyResultFor: RootCompiledBodyResultFor<typeof manifest> =
  compiledBodyResultFor;
const exactCompiledBodyResultFor: CompiledBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = manifestRouteBodyResult;
const exactRootCompiledBodyResultFor: RootCompiledBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactCompiledBodyResultFor;
const compiledTransportBodyResultFor: CompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = manifestRouteBodyResult;
const rootCompiledTransportBodyResultFor: RootCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = compiledTransportBodyResultFor;
const denoCompiledTransportBodyResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = rootCompiledTransportBodyResultFor;
const rootDenoCompiledTransportBodyResultFor: RootDenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = denoCompiledTransportBodyResultFor;
const runtimeSubpathDenoCompiledTransportBodyResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = rootDenoCompiledTransportBodyResultFor;
if (
  !(rootCompiledBodyResultFor instanceof Response) &&
  !Array.isArray(rootCompiledBodyResultFor) &&
  'ok' in rootCompiledBodyResultFor &&
  rootCompiledBodyResultFor.ok
) {
  rootCompiledBodyResultFor.data.name.toUpperCase();
}
if (
  !(exactRootCompiledBodyResultFor instanceof Response) &&
  'ok' in exactRootCompiledBodyResultFor &&
  exactRootCompiledBodyResultFor.ok
) {
  exactRootCompiledBodyResultFor.data.name.toUpperCase();
}
if (
  !(rootCompiledTransportBodyResultFor instanceof Response) &&
  'ok' in rootCompiledTransportBodyResultFor &&
  rootCompiledTransportBodyResultFor.ok
) {
  rootCompiledTransportBodyResultFor.data.name.toUpperCase();
}
if (
  !(runtimeSubpathDenoCompiledTransportBodyResultFor instanceof Response) &&
  'ok' in runtimeSubpathDenoCompiledTransportBodyResultFor &&
  runtimeSubpathDenoCompiledTransportBodyResultFor.ok
) {
  runtimeSubpathDenoCompiledTransportBodyResultFor.data.name.toUpperCase();
}
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
const syncCompiledTransportHandler: CompiledRpcTransportBodyResultHandler = () =>
  compiledSerializedEnvelope;
const rootSyncCompiledTransportHandler: RootCompiledRpcTransportBodyResultHandler =
  syncCompiledTransportHandler;
const syncManifestCompiledTransportHandler: CompiledRpcTransportBodyResultHandlerFor<
  typeof manifest
> = (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
  }
  return compiledSerializedEnvelope;
};
const rootManifestCompiledTransportHandler: RootCompiledRpcTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledTransportHandler;
rootSyncCompiledTransportHandler(createFetchRequestSourceForTypes(), {});
Promise.resolve(
  manifestCompiledTransportHandler(
    createFetchRequestSourceForTypes(),
    manifestRouteRequest
  )
).then((result) => {
  if (!(result instanceof Response) && 'ok' in result && result.ok) {
    result.data.name.toUpperCase();
  }
});
syncManifestCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteRequest
);
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
const syncCompiledBodyHandler: CompiledRpcBodyResultHandler = () =>
  compiledSerializedEnvelope;
const rootSyncCompiledBodyHandler: RootCompiledRpcBodyResultHandler =
  syncCompiledBodyHandler;
const syncManifestCompiledBodyHandler: CompiledRpcBodyResultHandlerFor<
  typeof manifest
> = (_request, body) => {
  if ('id' in body && body.id === 'users.authenticated') {
    body.input.ok.valueOf();
  }
  return compiledSerializedEnvelope;
};
const rootManifestCompiledBodyHandler: RootCompiledRpcBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledBodyHandler;
rootSyncCompiledBodyHandler(new Request('https://example.com/rpc'), {});
rootManifestCompiledBodyHandler(new Request('https://example.com/rpc'), [
  // @ts-expect-error manifest-aware compiled body handlers reject stream requests in batches.
  { id: 'users.watch', input: { userId: '1' } },
]);
syncManifestCompiledBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteRequest
);
const manifestCompiledRouteUnaryTransportHandler: CompiledRpcRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body) body.input.valueOf();
  return compiledSerializedEnvelope;
};
const manifestCompiledUnaryTransportHandler: CompiledRpcUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryTransportHandler;
const rootManifestCompiledUnaryTransportHandler: RootCompiledRpcUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryTransportHandler;
const rootManifestCompiledRouteUnaryTransportHandler: RootCompiledRpcRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryTransportHandler;
const manifestCompiledRouteStreamTransportHandler: CompiledRpcRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  body.input.userId.toUpperCase();
  return new Response();
};
const manifestCompiledStreamTransportHandler: CompiledRpcStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamTransportHandler;
const rootManifestCompiledStreamTransportHandler: RootCompiledRpcStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamTransportHandler;
const rootManifestCompiledRouteStreamTransportHandler: RootCompiledRpcRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamTransportHandler;
const manifestCompiledRouteUnaryBodyHandler: CompiledRpcRouteUnaryBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body) body.id.toUpperCase();
  return compiledSerializedEnvelope;
};
const manifestCompiledUnaryBodyHandler: CompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryBodyHandler;
const syncManifestCompiledUnaryBodyHandler: CompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof manifest
> = () => compiledSerializedEnvelope;
const rootManifestCompiledUnaryBodyHandler: RootCompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryBodyHandler;
const rootManifestCompiledRouteUnaryBodyHandler: RootCompiledRpcRouteUnaryBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryBodyHandler;
const manifestCompiledRouteStreamBodyHandler: CompiledRpcRouteStreamBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  body.input.userId.toUpperCase();
  return new Response();
};
const manifestCompiledStreamBodyHandler: CompiledRpcStreamRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamBodyHandler;
const syncManifestCompiledStreamBodyHandler: CompiledRpcStreamRouteBodyResultHandlerFor<
  typeof manifest
> = () => new Response();
const rootManifestCompiledStreamBodyHandler: RootCompiledRpcStreamRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamBodyHandler;
const rootManifestCompiledRouteStreamBodyHandler: RootCompiledRpcRouteStreamBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamBodyHandler;
const compiledRouteUnaryTransportResultFor: CompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteUnaryBody
> = compiledSerializedEnvelope;
const compiledRouteStreamTransportResultFor: CompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteStreamBody
> = new Response();
const compiledRouteUnaryBodyResultFor: CompiledRouteUnaryBodyResultFor<
  typeof manifest,
  typeof manifestRouteUnaryBody
> = compiledRouteUnaryTransportResultFor;
const compiledRouteStreamBodyResultFor: CompiledRouteStreamBodyResultFor<
  typeof manifest,
  typeof manifestRouteStreamBody
> = compiledRouteStreamTransportResultFor;
const compiledUnaryRouteTransportResultFor: CompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledRouteUnaryTransportResultFor;
const compiledStreamRouteTransportResultFor: CompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledRouteStreamTransportResultFor;
const compiledUnaryRouteBodyResultFor: CompiledUnaryRouteBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledRouteUnaryBodyResultFor;
const compiledStreamRouteBodyResultFor: CompiledStreamRouteBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledRouteStreamBodyResultFor;
const rootCompiledUnaryRouteTransportResultFor: RootCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledUnaryRouteTransportResultFor;
const rootCompiledStreamRouteTransportResultFor: RootCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledStreamRouteTransportResultFor;
const rootCompiledUnaryRouteBodyResultFor: RootCompiledUnaryRouteBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledUnaryRouteBodyResultFor;
const rootCompiledStreamRouteBodyResultFor: RootCompiledStreamRouteBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledStreamRouteBodyResultFor;
const rootCompiledRouteUnaryTransportResultFor: RootCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteUnaryBody
> = compiledRouteUnaryTransportResultFor;
const rootCompiledRouteStreamTransportResultFor: RootCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteStreamBody
> = compiledRouteStreamTransportResultFor;
const rootCompiledRouteUnaryBodyResultFor: RootCompiledRouteUnaryBodyResultFor<
  typeof manifest,
  typeof manifestRouteUnaryBody
> = compiledRouteUnaryBodyResultFor;
const rootCompiledRouteStreamBodyResultFor: RootCompiledRouteStreamBodyResultFor<
  typeof manifest,
  typeof manifestRouteStreamBody
> = compiledRouteStreamBodyResultFor;
rootCompiledUnaryRouteTransportResultFor.valueOf();
rootCompiledStreamRouteTransportResultFor.valueOf();
rootCompiledUnaryRouteBodyResultFor.valueOf();
rootCompiledStreamRouteBodyResultFor.valueOf();
rootCompiledRouteUnaryTransportResultFor.valueOf();
rootCompiledRouteStreamTransportResultFor.valueOf();
rootCompiledRouteUnaryBodyResultFor.valueOf();
rootCompiledRouteStreamBodyResultFor.valueOf();
manifestCompiledRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteUnaryBody
);
manifestCompiledRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteStreamBody
);
manifestCompiledUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestCompiledStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestCompiledUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error compiled unary transport handlers reject stream route bodies.
  manifestStreamRouteBody
);
manifestCompiledStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error compiled stream transport handlers reject unary route bodies.
  manifestUnaryRouteBody
);
manifestCompiledRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error compiled route-unary transport handlers reject route-stream bodies.
  manifestRouteStreamBody
);
manifestCompiledRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error compiled route-stream transport handlers reject route-unary bodies.
  manifestRouteUnaryBody
);
rootManifestCompiledUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
rootManifestCompiledStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
rootManifestCompiledRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteUnaryBody
);
rootManifestCompiledRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteStreamBody
);
manifestCompiledRouteUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteUnaryBody
);
manifestCompiledRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteStreamBody
);
manifestCompiledUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
syncManifestCompiledUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
manifestCompiledStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
syncManifestCompiledStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
rootManifestCompiledUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
rootManifestCompiledStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
rootManifestCompiledRouteUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteUnaryBody
);
rootManifestCompiledRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteStreamBody
);
const cachedProcedureHeaders: CompiledCachedProcedureHeaders = {
  'cache-control': 'private',
};
cachedProcedureHeaders['cache-control']?.toUpperCase();
// @ts-expect-error compiled cached procedure header maps are readonly.
cachedProcedureHeaders['cache-control'] = 'public';
const rootCompiledCachedProcedureHeaders: RootCompiledCachedProcedureHeaders =
  cachedProcedureHeaders;
rootCompiledCachedProcedureHeaders['cache-control']?.toUpperCase();
const procedureCacheHeaderValues: CompiledProcedureCacheHeaderValues = {
  authorization: 'Bearer token',
};
procedureCacheHeaderValues['authorization']?.toUpperCase();
// @ts-expect-error compiled procedure cache header values are readonly.
procedureCacheHeaderValues.authorization = 'Bearer other';
const rootCompiledProcedureCacheHeaderValues: RootCompiledProcedureCacheHeaderValues =
  procedureCacheHeaderValues;
rootCompiledProcedureCacheHeaderValues['authorization']?.toUpperCase();
compiledCreateProcedureCacheKey(
  'users.get',
  ['headers.authorization'],
  { id: '1' },
  procedureCacheHeaderValues,
  {}
).toUpperCase();
rootCompiledCreateProcedureCacheKey(
  'users.get',
  ['headers.authorization'],
  { id: '1' },
  rootCompiledProcedureCacheHeaderValues,
  {}
).toUpperCase();
compiledCreateProcedureCacheKey(
  'users.get',
  ['headers.authorization'],
  { id: '1' },
  {
    // @ts-expect-error procedure cache request headers must be HTTP string values.
    authorization: 1,
  },
  {}
);
const rootRateLimitIdentity: RootRateLimitIdentityResolver = (request) =>
  request.headers.get('x-user') ?? undefined;
const typedRootRateLimitIdentity: RootRateLimitIdentityResolver<HookAppRequest> =
  (request) => request.requestId;
typedRootRateLimitIdentity(hookAppRequest)?.toUpperCase();
typedRootRateLimitIdentity(
  // @ts-expect-error typed rate-limit identity resolvers preserve custom request types.
  new Request('https://example.com/rpc')
);
const rpcSubpathRateLimitIdentity: RpcSubpathRateLimitIdentityResolver =
  rootRateLimitIdentity;
const rootRateLimitOptions: RootRateLimitRuntimeOptions = {
  trustProxy: true,
  maxEntries: 100,
  identity: rpcSubpathRateLimitIdentity,
};
const rpcSubpathRateLimitOptions: RpcSubpathRateLimitRuntimeOptions =
  rootRateLimitOptions;
const compiledRuntimeRateLimit: CompiledRuntime['rateLimit'] =
  rpcSubpathRateLimitOptions;
const rootCompiledRuntimeRateLimit: RootCompiledRuntime['rateLimit'] =
  compiledRuntimeRateLimit;
rootCompiledRuntimeRateLimit.identity?.(
  new Request('https://example.com/rpc')
);
const cachedProcedureSuccess: CompiledCachedProcedureSuccess = {
  data: { ok: true },
  headers: cachedProcedureHeaders,
  expiresAt: Date.now() + 1_000,
};
cachedProcedureSuccess.headers?.['cache-control']?.toUpperCase();
// @ts-expect-error compiled cached procedure data is readonly.
cachedProcedureSuccess.data = { ok: false };
// @ts-expect-error compiled cached procedure headers are readonly.
cachedProcedureSuccess.headers = { 'cache-control': 'public' };
if (cachedProcedureSuccess.headers !== undefined) {
  // @ts-expect-error compiled cached procedure header values are readonly.
  cachedProcedureSuccess.headers['cache-control'] = 'public';
}
// @ts-expect-error compiled cached procedure expirations are readonly.
cachedProcedureSuccess.expiresAt = Date.now();
const rootCompiledCachedProcedureSuccess: RootCompiledCachedProcedureSuccess =
  cachedProcedureSuccess;
rootCompiledCachedProcedureSuccess.headers?.['cache-control']?.toUpperCase();
const _wrongCachedProcedureSuccessHeaders: CompiledCachedProcedureSuccess = {
  data: { ok: true },
  headers: {
    // @ts-expect-error cached procedure headers must be HTTP string values.
    'x-retry-count': 1,
  },
  expiresAt: Date.now() + 1_000,
};
_wrongCachedProcedureSuccessHeaders.data;
const compiledExecutionState: CompiledExecutionState =
  compiledUncachedExecutionState;
const rootCompiledExecutionState: RootCompiledExecutionState =
  compiledExecutionState;
rootCompiledExecutionState.cacheAuth.valueOf();
const compiledRuntimeState: CompiledRuntimeState = {
  path: '/rpc',
  runtime: {
    validateInput: true,
    validateHeaders: true,
    validateOutput: true,
    validateResponseHeaders: true,
    enforceRateLimit: true,
    cors: readonlyJsonHeaderSource,
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
// @ts-expect-error compiled runtime paths are readonly.
compiledRuntimeState.path = '/other';
// @ts-expect-error compiled runtime references are readonly.
compiledRuntimeState.runtime = { ...compiledRuntimeState.runtime };
// @ts-expect-error compiled service caches are readonly public views.
compiledRuntimeState.services = undefined;
// @ts-expect-error compiled runtime validation flags are readonly.
compiledRuntimeState.runtime.validateInput = false;
if (compiledRuntimeState.runtime.cors !== undefined) {
  // @ts-expect-error compiled runtime CORS headers are readonly.
  compiledRuntimeState.runtime.cors['cache-control'] = 'public';
}
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
const syncCompiledUnaryDispatch: CompiledFixedUnaryDispatch = () => undefined;
const _serviceTypedCompiledUnaryDispatch: CompiledFixedUnaryDispatch<
  Services
> = async (_body, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return undefined;
};
const _syncServiceTypedCompiledUnaryDispatch: CompiledFixedUnaryDispatch<
  Services
> = (_body, _request, services) => {
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
const _syncServiceTypedCompiledDispatch: CompiledDispatch<Services> = (
  _rpcRequest,
  _request,
  services
) => {
  services.users.findById('1').name.toUpperCase();
  return manifestRouteEnvelope;
};
const routeTypedCompiledDispatch: CompiledDispatch<
  Services,
  typeof procedureEnvelope
> = async (_rpcRequest, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return procedureEnvelope;
};
const syncRouteTypedCompiledDispatch: CompiledDispatch<
  Services,
  typeof procedureEnvelope
> = (_rpcRequest, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return procedureEnvelope;
};
Promise.resolve(
  routeTypedCompiledDispatch(
    compiledRouteRequest,
    createFetchRequestSourceForTypes(),
    procedureServices,
    {} as Parameters<typeof routeTypedCompiledDispatch>[3],
    compiledUncachedExecutionState,
    false
  )
).then((result) => {
  const typedCompiledDispatchId: 'users.get' = result.id;
  typedCompiledDispatchId.toUpperCase();
  // @ts-expect-error typed compiled dispatch results preserve the route id literal.
  const _wrongTypedCompiledDispatchId: 'users.list' = result.id;
  _wrongTypedCompiledDispatchId;
});
const routeTypedCompiledFixedDispatch: CompiledFixedDispatch<
  Services,
  typeof procedureEnvelope
> = async (_rpcRequest, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return procedureEnvelope;
};
const syncRouteTypedCompiledFixedDispatch: CompiledFixedDispatch<
  Services,
  typeof procedureEnvelope
> = (_rpcRequest, _request, services) => {
  services.users.findById('1').name.toUpperCase();
  return procedureEnvelope;
};
const rootRouteTypedCompiledFixedDispatch: RootCompiledFixedDispatch<
  Services,
  typeof procedureEnvelope
> = routeTypedCompiledFixedDispatch;
Promise.resolve(
  rootRouteTypedCompiledFixedDispatch(
    compiledRouteRequest,
    createFetchRequestSourceForTypes(),
    procedureServices,
    {} as Parameters<typeof rootRouteTypedCompiledFixedDispatch>[3],
    compiledUncachedExecutionState
  )
).then((result) => {
  const typedCompiledFixedDispatchId: 'users.get' = result.id;
  typedCompiledFixedDispatchId.toUpperCase();
  // @ts-expect-error typed fixed compiled dispatch results preserve the route id literal.
  const _wrongTypedCompiledFixedDispatchId: 'users.list' = result.id;
  _wrongTypedCompiledFixedDispatchId;
});
const _rootServiceTypedCompiledUnaryDispatch: RootCompiledFixedUnaryDispatch<Services> =
  _serviceTypedCompiledUnaryDispatch;
const _rootServiceTypedCompiledDispatch: RootCompiledDispatch<Services> =
  _serviceTypedCompiledDispatch;
syncCompiledUnaryDispatch(
  {},
  createFetchRequestSourceForTypes(),
  {},
  {} as Parameters<typeof syncCompiledUnaryDispatch>[3],
  compiledUncachedExecutionState
);
syncRouteTypedCompiledDispatch(
  compiledRouteRequest,
  createFetchRequestSourceForTypes(),
  procedureServices,
  {} as Parameters<typeof syncRouteTypedCompiledDispatch>[3],
  compiledUncachedExecutionState,
  false
);
syncRouteTypedCompiledFixedDispatch(
  compiledRouteRequest,
  createFetchRequestSourceForTypes(),
  procedureServices,
  {} as Parameters<typeof syncRouteTypedCompiledFixedDispatch>[3],
  compiledUncachedExecutionState
);
createCompiledRpcTransportBodyResultHandler(
  _serviceTypedCompiledDispatch,
  config,
  _serviceTypedCompiledUnaryDispatch,
  false,
  true,
  typedCompiledRuntimeState
);
createCompiledRpcTransportBodyResultHandler(
  _syncServiceTypedCompiledDispatch,
  config,
  _syncServiceTypedCompiledUnaryDispatch,
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
const createTypedCompiledRpcHandler =
  createCompiledRpcHandlerFor<AppFetchRequest>();
const typedAppCompiledRpcHandler: CompiledRpcRequestHandler<AppFetchRequest> =
  createTypedCompiledRpcHandler(
    _serviceTypedCompiledDispatch,
    config,
    _serviceTypedCompiledUnaryDispatch
  );
const createRootTypedCompiledRpcHandler =
  createRootCompiledRpcHandlerFor<AppFetchRequest>();
const rootTypedAppCompiledRpcHandler: RootCompiledRpcRequestHandler<AppFetchRequest> =
  createRootTypedCompiledRpcHandler(
    _rootServiceTypedCompiledDispatch,
    config,
    _rootServiceTypedCompiledUnaryDispatch
  );
const createRuntimeSubpathTypedCompiledRpcHandler =
  createRuntimeSubpathCompiledRpcHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedAppCompiledRpcHandler: RuntimeSubpathCompiledRpcRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedCompiledRpcHandler(
    _serviceTypedCompiledDispatch,
    config,
    _serviceTypedCompiledUnaryDispatch
  );
compiledRpcHandler(new Request('https://example.com/rpc'));
runtimeSubpathCompiledRpcHandler(new Request('https://example.com/rpc'));
typedAppCompiledRpcHandler(appFetchRequest);
rootTypedAppCompiledRpcHandler(appFetchRequest);
runtimeSubpathTypedAppCompiledRpcHandler(appFetchRequest);
createCompiledRpcTransportBodyResultHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
const configTypedCompiledTransportHandler: CompiledRpcTransportBodyResultHandlerForConfig<
  typeof manifestAwareConfig
> = createCompiledRpcTransportBodyResultHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
const rootConfigTypedCompiledTransportHandler: RootCompiledRpcTransportBodyResultHandlerForConfig<
  typeof manifestAwareConfig
> = createRootCompiledRpcTransportBodyResultHandler(
  _rootServiceTypedCompiledDispatch,
  manifestAwareConfig,
  _rootServiceTypedCompiledUnaryDispatch
);
configTypedCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
rootConfigTypedCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteUnaryBody
);
configTypedCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  // @ts-expect-error config-aware compiled transport handlers preserve route input.
  { id: 'users.get', input: { ok: true } }
);
createCompiledRpcHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
const requestTypedConfigWithoutHooksCompiledRpcHandler: CompiledRpcRequestHandler<HookAppRequest> =
  createCompiledRpcHandler(
    _serviceTypedCompiledDispatch,
    requestTypedConfigWithoutHooks,
    _serviceTypedCompiledUnaryDispatch
  );
requestTypedConfigWithoutHooksCompiledRpcHandler(hookAppRequest);
requestTypedConfigWithoutHooksCompiledRpcHandler(
  // @ts-expect-error config-aware compiled handlers preserve explicit request types without hooks.
  new Request('https://example.com/rpc')
);
const requestTypedConfigCompiledRpcHandler: CompiledRpcRequestHandler<HookAppRequest> =
  createCompiledRpcHandler(
    _serviceTypedCompiledDispatch,
    exactManifestAwareConfig,
    _serviceTypedCompiledUnaryDispatch
  );
const requestTypedConfigCompiledRpcHandlerForConfig: CompiledRpcRequestHandlerForConfig<
  typeof exactManifestAwareConfig
> = requestTypedConfigCompiledRpcHandler;
const rootRequestTypedConfigCompiledRpcHandlerForConfig: RootCompiledRpcRequestHandlerForConfig<
  typeof exactManifestAwareConfig
> = requestTypedConfigCompiledRpcHandlerForConfig;
const runtimeSubpathRequestTypedConfigCompiledRpcHandlerForConfig: RuntimeSubpathCompiledRpcRequestHandlerForConfig<
  typeof exactManifestAwareConfig
> = rootRequestTypedConfigCompiledRpcHandlerForConfig;
requestTypedConfigCompiledRpcHandler(hookAppRequest);
runtimeSubpathRequestTypedConfigCompiledRpcHandlerForConfig(hookAppRequest);
requestTypedConfigCompiledRpcHandler(
  // @ts-expect-error config-aware compiled handlers preserve custom request types.
  new Request('https://example.com/rpc')
);
runtimeSubpathRequestTypedConfigCompiledRpcHandlerForConfig(
  // @ts-expect-error runtime subpath config-aware compiled handlers preserve custom request types.
  new Request('https://example.com/rpc')
);
const defaultConfigTypedCompiledRpcHandler = createCompiledRpcHandlerFor()(
  _serviceTypedCompiledDispatch,
  exactManifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
defaultConfigTypedCompiledRpcHandler(hookAppRequest);
defaultConfigTypedCompiledRpcHandler(
  // @ts-expect-error default compiled handler factories infer request types from config hooks.
  new Request('https://example.com/rpc')
);
const rootDefaultConfigTypedCompiledRpcHandler =
  createRootCompiledRpcHandlerFor()(
    _rootServiceTypedCompiledDispatch,
    exactManifestAwareConfig,
    _rootServiceTypedCompiledUnaryDispatch
  );
rootDefaultConfigTypedCompiledRpcHandler(hookAppRequest);
rootDefaultConfigTypedCompiledRpcHandler(
  // @ts-expect-error root default compiled handler factories infer request types from config hooks.
  new Request('https://example.com/rpc')
);
const runtimeSubpathDefaultConfigTypedCompiledRpcHandler =
  createRuntimeSubpathCompiledRpcHandlerFor()(
    _serviceTypedCompiledDispatch,
    exactManifestAwareConfig,
    _serviceTypedCompiledUnaryDispatch
  );
runtimeSubpathDefaultConfigTypedCompiledRpcHandler(hookAppRequest);
runtimeSubpathDefaultConfigTypedCompiledRpcHandler(
  // @ts-expect-error runtime subpath default compiled handler factories infer request types from config hooks.
  new Request('https://example.com/rpc')
);
const defaultConfigTypedCompiledRpcHandlerWithoutHooks =
  createCompiledRpcHandlerFor()(
    _serviceTypedCompiledDispatch,
    requestTypedConfigWithoutHooks,
    _serviceTypedCompiledUnaryDispatch
  );
defaultConfigTypedCompiledRpcHandlerWithoutHooks(hookAppRequest);
defaultConfigTypedCompiledRpcHandlerWithoutHooks(
  // @ts-expect-error default compiled handler factories infer explicit config request types without hooks.
  new Request('https://example.com/rpc')
);
createCompiledRpcHandlerFor<HookAppRequest>()(
  _serviceTypedCompiledDispatch,
  exactManifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
createCompiledRpcHandlerFor<Request>()(
  _serviceTypedCompiledDispatch,
  // @ts-expect-error typed compiled handler factories reject requests too broad for config hooks.
  exactManifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
createCompiledRpcHandlerFor<Request>()(
  _serviceTypedCompiledDispatch,
  // @ts-expect-error typed compiled handler factories reject requests too broad for explicit config request types.
  requestTypedConfigWithoutHooks,
  _serviceTypedCompiledUnaryDispatch
);
const configTypedCompiledBodyHandler: CompiledRpcBodyResultHandlerForConfig<
  typeof manifestAwareConfig
> = createCompiledRpcBodyResultHandler(
  _serviceTypedCompiledDispatch,
  manifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
const rootConfigTypedCompiledBodyHandler: RootCompiledRpcBodyResultHandlerForConfig<
  typeof manifestAwareConfig
> = createRootCompiledRpcBodyResultHandler(
  _rootServiceTypedCompiledDispatch,
  manifestAwareConfig,
  _rootServiceTypedCompiledUnaryDispatch
);
configTypedCompiledBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
rootConfigTypedCompiledBodyHandler(
  new Request('https://example.com/rpc'),
  manifestRouteUnaryBody
);
configTypedCompiledBodyHandler(
  new Request('https://example.com/rpc'),
  // @ts-expect-error config-aware compiled body handlers preserve route input.
  { id: 'users.get', input: { ok: true } }
);
const requestTypedConfigCompiledBodyHandler: CompiledRpcBodyResultHandlerForConfig<
  typeof exactManifestAwareConfig
> = createCompiledRpcBodyResultHandler(
  _serviceTypedCompiledDispatch,
  exactManifestAwareConfig,
  _serviceTypedCompiledUnaryDispatch
);
requestTypedConfigCompiledBodyHandler(hookAppRequest, manifestRouteRequest);
requestTypedConfigCompiledBodyHandler(
  // @ts-expect-error config-aware compiled body handlers preserve custom request types.
  new Request('https://example.com/rpc'),
  manifestRouteRequest
);
const requestTypedConfigWithoutHooksCompiledBodyHandler: CompiledRpcBodyResultHandlerForConfig<
  typeof requestTypedConfigWithoutHooks
> = createCompiledRpcBodyResultHandler(
  _serviceTypedCompiledDispatch,
  requestTypedConfigWithoutHooks,
  _serviceTypedCompiledUnaryDispatch
);
requestTypedConfigWithoutHooksCompiledBodyHandler(
  hookAppRequest,
  { id: 'users.get', input: { id: '1' } }
);
requestTypedConfigWithoutHooksCompiledBodyHandler(
  // @ts-expect-error config-aware compiled body handlers preserve explicit request types without hooks.
  new Request('https://example.com/rpc'),
  { id: 'users.get', input: { id: '1' } }
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
// @ts-expect-error service-dependent typed compiled dispatches require matching config services.
createTypedCompiledRpcHandler(_serviceTypedCompiledDispatch);
// @ts-expect-error root compiled dispatches require matching config services.
createRootCompiledRpcHandler(_rootServiceTypedCompiledDispatch);
// @ts-expect-error service-dependent compiled transports require matching config services.
createCompiledRpcTransportBodyResultHandler(_serviceTypedCompiledDispatch, {});
createRootCompiledRpcTransportBodyResultHandler(
  // @ts-expect-error root compiled transports require matching config services.
  _rootServiceTypedCompiledDispatch,
  {}
);
createDenoCompiledTransportRequestHandler(
  typedCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _serviceTypedCompiledUnaryDispatch
);
const syncDenoCompiledTransportHandler: DenoCompiledTransportBodyResultHandler =
  () => standaloneDenoTransportResult;
createDenoCompiledTransportRequestHandler(
  compiledRuntimeState,
  syncDenoCompiledTransportHandler,
  compiledUnaryDispatch
);
createDenoCompiledTransportRequestHandlerWithPath(
  compiledRuntimeState,
  syncDenoCompiledTransportHandler,
  compiledUnaryDispatch,
  '/rpc'
);
const createTypedDenoCompiledTransportRequestHandler =
  createDenoCompiledTransportRequestHandlerFor<AppFetchRequest>();
const typedDenoCompiledTransportRequestHandler: DenoCompiledTransportRequestHandler<AppFetchRequest> =
  createTypedDenoCompiledTransportRequestHandler(
    compiledRuntimeState,
    syncDenoCompiledTransportHandler,
    compiledUnaryDispatch
  );
const createTypedDenoCompiledTransportRequestHandlerWithPath =
  createDenoCompiledTransportRequestHandlerWithPathFor<AppFetchRequest>();
const typedDenoCompiledTransportRequestHandlerWithPath: DenoCompiledTransportRequestHandler<AppFetchRequest> =
  createTypedDenoCompiledTransportRequestHandlerWithPath(
    compiledRuntimeState,
    syncDenoCompiledTransportHandler,
    compiledUnaryDispatch,
    '/rpc'
  );
createDenoCompiledTransportRequestHandlerWithPath(
  typedCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _serviceTypedCompiledUnaryDispatch,
  '/rpc'
);
createRootDenoCompiledTransportRequestHandler(
  rootCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _rootServiceTypedCompiledUnaryDispatch
);
createRootDenoCompiledTransportRequestHandlerWithPath(
  rootCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _rootServiceTypedCompiledUnaryDispatch,
  '/rpc'
);
const createRootTypedDenoCompiledTransportRequestHandler =
  createRootDenoCompiledTransportRequestHandlerFor<AppFetchRequest>();
const rootTypedDenoCompiledTransportRequestHandler: RootDenoCompiledTransportRequestHandler<AppFetchRequest> =
  createRootTypedDenoCompiledTransportRequestHandler(
    rootCompiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    _rootServiceTypedCompiledUnaryDispatch
  );
const createRootTypedDenoCompiledTransportRequestHandlerWithPath =
  createRootDenoCompiledTransportRequestHandlerWithPathFor<AppFetchRequest>();
const rootTypedDenoCompiledTransportRequestHandlerWithPath: RootDenoCompiledTransportRequestHandler<AppFetchRequest> =
  createRootTypedDenoCompiledTransportRequestHandlerWithPath(
    rootCompiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    _rootServiceTypedCompiledUnaryDispatch,
    '/rpc'
  );
createRuntimeSubpathDenoCompiledTransportRequestHandler(
  typedCompiledRuntimeState,
  routeTypedStandaloneDenoTransportHandler,
  _serviceTypedCompiledUnaryDispatch
);
const createRuntimeSubpathTypedDenoCompiledTransportRequestHandler =
  createRuntimeSubpathDenoCompiledTransportRequestHandlerFor<AppFetchRequest>();
const runtimeSubpathTypedDenoCompiledTransportRequestHandler: RuntimeSubpathDenoCompiledTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoCompiledTransportRequestHandler(
    typedCompiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    _serviceTypedCompiledUnaryDispatch
  );
const createRuntimeSubpathTypedDenoCompiledTransportRequestHandlerWithPath =
  createRuntimeSubpathDenoCompiledTransportRequestHandlerWithPathFor<AppFetchRequest>();
const runtimeSubpathTypedDenoCompiledTransportRequestHandlerWithPath: RuntimeSubpathDenoCompiledTransportRequestHandler<AppFetchRequest> =
  createRuntimeSubpathTypedDenoCompiledTransportRequestHandlerWithPath(
    typedCompiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    _serviceTypedCompiledUnaryDispatch,
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
const syncDenoCompiledTransportRequestHandler: DenoCompiledTransportRequestHandler =
  () => new Response();
const standaloneDenoCompiledDefaultHandler =
  createDenoCompiledTransportRequestHandler(
    compiledRuntimeState,
    routeTypedStandaloneDenoTransportHandler,
    compiledUnaryDispatch
  );
const typedStandaloneDenoCompiledDefaultHandler: DenoCompiledTransportRequestHandler =
  standaloneDenoCompiledDefaultHandler;
const rootTypedStandaloneDenoCompiledHandler: RootDenoCompiledTransportRequestHandler =
  typedStandaloneDenoCompiledHandler;
const runtimeSubpathTypedStandaloneDenoCompiledHandler: RuntimeSubpathDenoCompiledTransportRequestHandler =
  rootTypedStandaloneDenoCompiledHandler;
const rootSyncDenoCompiledTransportRequestHandler: RootDenoCompiledTransportRequestHandler =
  syncDenoCompiledTransportRequestHandler;
const runtimeSubpathSyncDenoCompiledTransportRequestHandler: RuntimeSubpathDenoCompiledTransportRequestHandler =
  rootSyncDenoCompiledTransportRequestHandler;
typedDenoCompiledTransportRequestHandler(appFetchRequest);
typedDenoCompiledTransportRequestHandlerWithPath(appFetchRequest);
rootTypedDenoCompiledTransportRequestHandler(appFetchRequest);
rootTypedDenoCompiledTransportRequestHandlerWithPath(appFetchRequest);
runtimeSubpathTypedDenoCompiledTransportRequestHandler(appFetchRequest);
runtimeSubpathTypedDenoCompiledTransportRequestHandlerWithPath(
  appFetchRequest
);
const manifestDenoCompiledTransportHandler: DenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const syncManifestDenoCompiledTransportHandler: DenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestCompiledTransportHandler;
const manifestDenoCompiledUnaryRouteTransportHandler: DenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
const syncManifestDenoCompiledUnaryRouteTransportHandler: DenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoCompiledTransportHandler;
const manifestDenoCompiledStreamRouteTransportHandler: DenoCompiledStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
const syncManifestDenoCompiledStreamRouteTransportHandler: DenoCompiledStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoCompiledTransportHandler;
const manifestDenoCompiledRouteUnaryTransportHandler: DenoCompiledRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledUnaryRouteTransportHandler;
const manifestDenoCompiledRouteStreamTransportHandler: DenoCompiledRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledStreamRouteTransportHandler;
const rootManifestDenoCompiledTransportHandler: RootDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
const rootManifestDenoCompiledUnaryRouteTransportHandler: RootDenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledUnaryRouteTransportHandler;
const rootManifestDenoCompiledStreamRouteTransportHandler: RootDenoCompiledStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledStreamRouteTransportHandler;
const rootManifestDenoCompiledRouteUnaryTransportHandler: RootDenoCompiledRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledRouteUnaryTransportHandler;
const rootManifestDenoCompiledRouteStreamTransportHandler: RootDenoCompiledRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledRouteStreamTransportHandler;
const runtimeSubpathManifestDenoCompiledTransportHandler: RuntimeSubpathDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledTransportHandler;
const runtimeSubpathManifestDenoCompiledUnaryRouteTransportHandler: RuntimeSubpathDenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledUnaryRouteTransportHandler;
const runtimeSubpathManifestDenoCompiledStreamRouteTransportHandler: RuntimeSubpathDenoCompiledStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledStreamRouteTransportHandler;
const runtimeSubpathManifestDenoCompiledRouteUnaryTransportHandler: RuntimeSubpathDenoCompiledRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledRouteUnaryTransportHandler;
const runtimeSubpathManifestDenoCompiledRouteStreamTransportHandler: RuntimeSubpathDenoCompiledRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = rootManifestDenoCompiledRouteStreamTransportHandler;
runtimeSubpathManifestDenoCompiledUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncManifestDenoCompiledUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestDenoCompiledStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestDenoCompiledStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestDenoCompiledRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestDenoCompiledRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestDenoCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteRequest
);
const exactManifestDenoCompiledTransportHandler: DenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body && body.id === 'users.get') {
    body.input.id.toUpperCase();
    // @ts-expect-error compiled Deno handlers keep route input exact.
    body.input.ok;
  }
  return compiledSerializedEnvelope;
};
const exactRootManifestDenoCompiledTransportHandler: RootDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = exactManifestDenoCompiledTransportHandler;
const exactRuntimeSubpathManifestDenoCompiledTransportHandler: RuntimeSubpathDenoCompiledTransportBodyResultHandlerFor<
  typeof manifest
> = exactRootManifestDenoCompiledTransportHandler;
Promise.resolve(
  exactRuntimeSubpathManifestDenoCompiledTransportHandler(
    createFetchRequestSourceForTypes(),
    manifestRouteRequest
  )
).then((result) => {
  if (isSerializedJsonEnvelope(result)) result.body.toUpperCase();
});
// @ts-expect-error compiled Deno handlers validate body input by route id.
exactManifestDenoCompiledTransportHandler(createFetchRequestSourceForTypes(), {
  id: 'users.get',
  input: { ok: true },
});
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
standaloneDenoCompiledDefaultHandler(new Request('https://example.com/rpc'));
typedStandaloneDenoCompiledDefaultHandler(
  new Request('https://example.com/rpc')
);
standaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
rootTypedStandaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
rootSyncDenoCompiledTransportRequestHandler(
  new Request('https://example.com/rpc')
);
runtimeSubpathTypedStandaloneDenoCompiledHandler(
  new Request('https://example.com/rpc')
);
runtimeSubpathSyncDenoCompiledTransportRequestHandler(
  new Request('https://example.com/rpc')
);
const joorHandlerOptions: JoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const exactJoorHandlerOptions: JoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedJoorHandlerOptions: JoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const runtimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorHandlerOptions;
const joorRouteUnaryHandlerOptions: JoorRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const requestTypedJoorRouteUnaryHandlerOptions: JoorRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const joorUnaryRouteHandlerOptions: JoorUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteUnaryHandlerOptions;
const joorRouteStreamHandlerOptions: JoorRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const joorStreamRouteHandlerOptions: JoorStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteStreamHandlerOptions;
const runtimeSubpathJoorUnaryRouteHandlerOptions: RuntimeSubpathJoorUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorUnaryRouteHandlerOptions;
const runtimeSubpathJoorStreamRouteHandlerOptions: RuntimeSubpathJoorStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorStreamRouteHandlerOptions;
const runtimeSubpathJoorRouteUnaryHandlerOptions: RuntimeSubpathJoorRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteUnaryHandlerOptions;
const runtimeSubpathJoorRouteStreamHandlerOptions: RuntimeSubpathJoorRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteStreamHandlerOptions;
const exactRuntimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactJoorHandlerOptions;
const requestTypedRuntimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedJoorHandlerOptions;
const requestTypedRuntimeSubpathJoorRouteUnaryHandlerOptions: RuntimeSubpathJoorRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedJoorRouteUnaryHandlerOptions;
runtimeSubpathJoorUnaryRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathJoorStreamRouteHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathJoorRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathJoorRouteStreamHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathJoorHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedRuntimeSubpathJoorHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedRuntimeSubpathJoorRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const joorHandlerOptionsArgs: JoorHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorHandlerOptions];
const joorRouteUnaryHandlerOptionsArgs: JoorRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorRouteUnaryHandlerOptions];
const requestTypedJoorRouteUnaryHandlerOptionsArgs: JoorRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedJoorRouteUnaryHandlerOptions];
const joorUnaryRouteHandlerOptionsArgs: JoorUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteUnaryHandlerOptionsArgs;
const joorRouteStreamHandlerOptionsArgs: JoorRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorRouteStreamHandlerOptions];
const joorStreamRouteHandlerOptionsArgs: JoorStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteStreamHandlerOptionsArgs;
const runtimeSubpathJoorHandlerOptionsArgs: RuntimeSubpathJoorHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorHandlerOptionsArgs;
const runtimeSubpathJoorUnaryRouteHandlerOptionsArgs: RuntimeSubpathJoorUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorUnaryRouteHandlerOptionsArgs;
const runtimeSubpathJoorStreamRouteHandlerOptionsArgs: RuntimeSubpathJoorStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorStreamRouteHandlerOptionsArgs;
const runtimeSubpathJoorRouteUnaryHandlerOptionsArgs: RuntimeSubpathJoorRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteUnaryHandlerOptionsArgs;
const requestTypedRuntimeSubpathJoorRouteUnaryHandlerOptionsArgs: RuntimeSubpathJoorRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedJoorRouteUnaryHandlerOptionsArgs;
const runtimeSubpathJoorRouteStreamHandlerOptionsArgs: RuntimeSubpathJoorRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorRouteStreamHandlerOptionsArgs;
runtimeSubpathJoorHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathJoorUnaryRouteHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathJoorStreamRouteHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathJoorRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedRuntimeSubpathJoorRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathJoorRouteStreamHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const exactNextRouteHandlersOptions: NextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedNextRouteHandlersOptions: NextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const nextHandlerOptions: NextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptions;
const nextRouteUnaryHandlersOptions: NextRouteUnaryHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const requestTypedNextRouteUnaryHandlersOptions: NextRouteUnaryHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteHandlersOptions;
const nextUnaryRouteHandlersOptions: NextUnaryRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlersOptions;
const nextRouteStreamHandlersOptions: NextRouteStreamHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const nextStreamRouteHandlersOptions: NextStreamRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlersOptions;
const nextRouteUnaryHandlerOptions: NextRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlersOptions;
const requestTypedNextRouteUnaryHandlerOptions: NextRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteUnaryHandlersOptions;
const nextUnaryHandlerOptions: NextUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlerOptions;
const nextRouteStreamHandlerOptions: NextRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlersOptions;
const nextStreamHandlerOptions: NextStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlerOptions;
const exactNextHandlerOptions: NextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactNextRouteHandlersOptions;
const runtimeSubpathNextRouteHandlersOptions: RuntimeSubpathNextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptions;
const exactRuntimeSubpathNextRouteHandlersOptions: RuntimeSubpathNextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactNextRouteHandlersOptions;
const requestTypedRuntimeSubpathNextRouteHandlersOptions: RuntimeSubpathNextRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteHandlersOptions;
exactRuntimeSubpathNextRouteHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedRuntimeSubpathNextRouteHandlersOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const runtimeSubpathNextHandlerOptions: RuntimeSubpathNextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextHandlerOptions;
const runtimeSubpathNextUnaryRouteHandlersOptions: RuntimeSubpathNextUnaryRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryRouteHandlersOptions;
const runtimeSubpathNextStreamRouteHandlersOptions: RuntimeSubpathNextStreamRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamRouteHandlersOptions;
const runtimeSubpathNextRouteUnaryHandlersOptions: RuntimeSubpathNextRouteUnaryHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlersOptions;
const runtimeSubpathNextRouteStreamHandlersOptions: RuntimeSubpathNextRouteStreamHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlersOptions;
const runtimeSubpathNextUnaryHandlerOptions: RuntimeSubpathNextUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryHandlerOptions;
const runtimeSubpathNextStreamHandlerOptions: RuntimeSubpathNextStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamHandlerOptions;
const runtimeSubpathNextRouteUnaryHandlerOptions: RuntimeSubpathNextRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlerOptions;
const requestTypedRuntimeSubpathNextRouteUnaryHandlerOptions: RuntimeSubpathNextRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteUnaryHandlerOptions;
const runtimeSubpathNextRouteStreamHandlerOptions: RuntimeSubpathNextRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlerOptions;
const exactRuntimeSubpathNextHandlerOptions: RuntimeSubpathNextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactNextHandlerOptions;
runtimeSubpathNextUnaryRouteHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextStreamRouteHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextRouteUnaryHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextRouteStreamHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextUnaryHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextStreamHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedRuntimeSubpathNextRouteUnaryHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathNextRouteStreamHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathNextHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const nextRouteHandlersOptionsArgs: NextRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteHandlersOptions];
const requestTypedNextRouteHandlersOptionsArgs: NextRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedNextRouteHandlersOptions];
const nextHandlerOptionsArgs: NextHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextHandlerOptions];
const nextRouteUnaryHandlersOptionsArgs: NextRouteUnaryHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteUnaryHandlersOptions];
const nextUnaryRouteHandlersOptionsArgs: NextUnaryRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlersOptionsArgs;
const nextRouteStreamHandlersOptionsArgs: NextRouteStreamHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteStreamHandlersOptions];
const nextStreamRouteHandlersOptionsArgs: NextStreamRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlersOptionsArgs;
const nextRouteUnaryHandlerOptionsArgs: NextRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteUnaryHandlerOptions];
const requestTypedNextRouteUnaryHandlerOptionsArgs: NextRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedNextRouteUnaryHandlerOptions];
const nextUnaryHandlerOptionsArgs: NextUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlerOptionsArgs;
const nextRouteStreamHandlerOptionsArgs: NextRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteStreamHandlerOptions];
const nextStreamHandlerOptionsArgs: NextStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlerOptionsArgs;
const runtimeSubpathNextRouteHandlersOptionsArgs: RuntimeSubpathNextRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptionsArgs;
const requestTypedRuntimeSubpathNextRouteHandlersOptionsArgs: RuntimeSubpathNextRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteHandlersOptionsArgs;
const runtimeSubpathNextHandlerOptionsArgs: RuntimeSubpathNextHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextHandlerOptionsArgs;
const runtimeSubpathNextUnaryRouteHandlersOptionsArgs: RuntimeSubpathNextUnaryRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryRouteHandlersOptionsArgs;
const runtimeSubpathNextStreamRouteHandlersOptionsArgs: RuntimeSubpathNextStreamRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamRouteHandlersOptionsArgs;
const runtimeSubpathNextRouteUnaryHandlersOptionsArgs: RuntimeSubpathNextRouteUnaryHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlersOptionsArgs;
const runtimeSubpathNextRouteStreamHandlersOptionsArgs: RuntimeSubpathNextRouteStreamHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlersOptionsArgs;
const runtimeSubpathNextUnaryHandlerOptionsArgs: RuntimeSubpathNextUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryHandlerOptionsArgs;
const runtimeSubpathNextStreamHandlerOptionsArgs: RuntimeSubpathNextStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamHandlerOptionsArgs;
const runtimeSubpathNextRouteUnaryHandlerOptionsArgs: RuntimeSubpathNextRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteUnaryHandlerOptionsArgs;
const requestTypedRuntimeSubpathNextRouteUnaryHandlerOptionsArgs: RuntimeSubpathNextRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNextRouteUnaryHandlerOptionsArgs;
const runtimeSubpathNextRouteStreamHandlerOptionsArgs: RuntimeSubpathNextRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteStreamHandlerOptionsArgs;
runtimeSubpathNextRouteHandlersOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNextHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNextUnaryRouteHandlersOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextStreamRouteHandlersOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextRouteUnaryHandlersOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextRouteStreamHandlersOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNextStreamHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNextRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedRuntimeSubpathNextRouteHandlersOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedRuntimeSubpathNextRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathNextRouteStreamHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const awsLambdaHandlerOptions: AwsLambdaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const exactAwsLambdaHandlerOptions: AwsLambdaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedAwsLambdaHandlerOptions: AwsLambdaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedAwsLambdaHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedAwsLambdaHandlerOptions
> = hookAppRequest;
requestTypedAwsLambdaHandlerOptionsRequest.requestId.toUpperCase();
const runtimeSubpathAwsLambdaHandlerOptions: RuntimeSubpathAwsLambdaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptions;
const runtimeSubpathRequestTypedAwsLambdaHandlerOptions: RuntimeSubpathAwsLambdaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptions;
const awsLambdaHttpApiHandlerOptions: AwsLambdaHttpApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptions;
const requestTypedAwsLambdaHttpApiHandlerOptions: AwsLambdaHttpApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptions;
const runtimeSubpathAwsLambdaHttpApiHandlerOptions: RuntimeSubpathAwsLambdaHttpApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiHandlerOptions;
const runtimeSubpathRequestTypedAwsLambdaHttpApiHandlerOptions: RuntimeSubpathAwsLambdaHttpApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHttpApiHandlerOptions;
const awsLambdaRestApiHandlerOptions: AwsLambdaRestApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const requestTypedAwsLambdaRestApiHandlerOptions: AwsLambdaRestApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptions;
const runtimeSubpathAwsLambdaRestApiHandlerOptions: RuntimeSubpathAwsLambdaRestApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiHandlerOptions;
const runtimeSubpathRequestTypedAwsLambdaRestApiHandlerOptions: RuntimeSubpathAwsLambdaRestApiHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaRestApiHandlerOptions;
exactAwsLambdaHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaHandlerOptions.plugins?.[0]?.name.toUpperCase();
awsLambdaHttpApiHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaHttpApiHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaRestApiHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathRequestTypedAwsLambdaHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedAwsLambdaHandlerOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Lambda options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedAwsLambdaHttpApiHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedAwsLambdaRestApiHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const awsLambdaRouteUnaryHandlerOptions: AwsLambdaRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptions;
const requestTypedAwsLambdaRouteUnaryHandlerOptions: AwsLambdaRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptions;
const awsLambdaUnaryRouteHandlerOptions: AwsLambdaUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRouteUnaryHandlerOptions;
const requestTypedAwsLambdaUnaryRouteHandlerOptions: AwsLambdaUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaRouteUnaryHandlerOptions;
awsLambdaUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
requestTypedAwsLambdaUnaryRouteHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const awsLambdaRouteStreamHandlerOptions: AwsLambdaRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptions;
const awsLambdaStreamRouteHandlerOptions: AwsLambdaStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRouteStreamHandlerOptions;
awsLambdaStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const awsLambdaHttpApiRouteUnaryHandlerOptions: AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiHandlerOptions;
const awsLambdaHttpApiUnaryRouteHandlerOptions: AwsLambdaHttpApiUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteUnaryHandlerOptions;
const awsLambdaHttpApiRouteStreamHandlerOptions: AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiHandlerOptions;
const awsLambdaHttpApiStreamRouteHandlerOptions: AwsLambdaHttpApiStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteStreamHandlerOptions;
const runtimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptions: RuntimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteUnaryHandlerOptions;
const runtimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptions: RuntimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = runtimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptions;
const runtimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptions: RuntimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteStreamHandlerOptions;
const runtimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptions: RuntimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = runtimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptions;
awsLambdaHttpApiUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
awsLambdaHttpApiStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const awsLambdaRestApiRouteUnaryHandlerOptions: AwsLambdaRestApiRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiHandlerOptions;
const awsLambdaRestApiUnaryRouteHandlerOptions: AwsLambdaRestApiUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiRouteUnaryHandlerOptions;
const awsLambdaRestApiRouteStreamHandlerOptions: AwsLambdaRestApiRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiHandlerOptions;
const awsLambdaRestApiStreamRouteHandlerOptions: AwsLambdaRestApiStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiRouteStreamHandlerOptions;
awsLambdaRestApiUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
awsLambdaRestApiStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const awsLambdaHandlerOptionsArgs: AwsLambdaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [awsLambdaHandlerOptions];
const requestTypedAwsLambdaHandlerOptionsArgs: AwsLambdaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedAwsLambdaHandlerOptions];
const awsLambdaHttpApiHandlerOptionsArgs: AwsLambdaHttpApiHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptionsArgs;
const requestTypedAwsLambdaHttpApiHandlerOptionsArgs: AwsLambdaHttpApiHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptionsArgs;
const awsLambdaHttpApiRouteUnaryHandlerOptionsArgs: AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiHandlerOptionsArgs;
const requestTypedAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs: AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHttpApiHandlerOptionsArgs;
const awsLambdaHttpApiUnaryRouteHandlerOptionsArgs: AwsLambdaHttpApiUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteUnaryHandlerOptionsArgs;
const awsLambdaHttpApiRouteStreamHandlerOptionsArgs: AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiHandlerOptionsArgs;
const awsLambdaHttpApiStreamRouteHandlerOptionsArgs: AwsLambdaHttpApiStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteStreamHandlerOptionsArgs;
const runtimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs: RuntimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteUnaryHandlerOptionsArgs;
const runtimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsArgs: RuntimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = runtimeSubpathAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs;
const runtimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsArgs: RuntimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHttpApiRouteStreamHandlerOptionsArgs;
const runtimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsArgs: RuntimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = runtimeSubpathAwsLambdaHttpApiRouteStreamHandlerOptionsArgs;
awsLambdaHttpApiUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
awsLambdaHttpApiStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const awsLambdaRouteUnaryHandlerOptionsArgs: AwsLambdaRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptionsArgs;
const requestTypedAwsLambdaRouteUnaryHandlerOptionsArgs: AwsLambdaRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaHandlerOptionsArgs;
const awsLambdaUnaryRouteHandlerOptionsArgs: AwsLambdaUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRouteUnaryHandlerOptionsArgs;
awsLambdaUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const awsLambdaRouteStreamHandlerOptionsArgs: AwsLambdaRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaHandlerOptionsArgs;
const awsLambdaStreamRouteHandlerOptionsArgs: AwsLambdaStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRouteStreamHandlerOptionsArgs;
awsLambdaStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const awsLambdaRestApiHandlerOptionsArgs: AwsLambdaRestApiHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [awsLambdaRestApiHandlerOptions];
const requestTypedAwsLambdaRestApiHandlerOptionsArgs: AwsLambdaRestApiHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedAwsLambdaRestApiHandlerOptions];
const awsLambdaRestApiRouteUnaryHandlerOptionsArgs: AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiHandlerOptionsArgs;
const requestTypedAwsLambdaRestApiRouteUnaryHandlerOptionsArgs: AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedAwsLambdaRestApiHandlerOptionsArgs;
const awsLambdaRestApiUnaryRouteHandlerOptionsArgs: AwsLambdaRestApiUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiRouteUnaryHandlerOptionsArgs;
const awsLambdaRestApiRouteStreamHandlerOptionsArgs: AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiHandlerOptionsArgs;
const awsLambdaRestApiStreamRouteHandlerOptionsArgs: AwsLambdaRestApiStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = awsLambdaRestApiRouteStreamHandlerOptionsArgs;
awsLambdaHttpApiHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
requestTypedAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedAwsLambdaHttpApiRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Lambda HTTP API args reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathAwsLambdaHttpApiUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathAwsLambdaHttpApiStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
requestTypedAwsLambdaRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
awsLambdaRestApiUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
requestTypedAwsLambdaRestApiRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
awsLambdaRestApiStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const awsLambdaHandler: AwsLambdaHandler = createAwsLambdaHandler(
  manifest,
  handlerOptions
);
createAwsLambdaHandler(manifest, requestTypedAwsLambdaHandlerOptions);
const syncAwsLambdaHandler: AwsLambdaHandler = () => ({
  statusCode: 200,
  headers: {},
  body: '',
  isBase64Encoded: false,
});
const awsLambdaHttpApiHandler: AwsLambdaHttpApiHandler =
  createAwsLambdaHttpApiHandler(manifest, handlerOptions);
createAwsLambdaHttpApiHandler(manifest, requestTypedAwsLambdaHttpApiHandlerOptions);
const syncAwsLambdaHttpApiHandler: AwsLambdaHttpApiHandler =
  syncAwsLambdaHandler;
const awsLambdaRestApiHandler: AwsLambdaRestApiHandler =
  createAwsLambdaRestApiHandler(manifest, handlerOptions);
createAwsLambdaRestApiHandler(manifest, requestTypedAwsLambdaRestApiHandlerOptions);
const syncAwsLambdaRestApiHandler: AwsLambdaRestApiHandler = () => ({
  statusCode: 200,
  headers: {},
  multiValueHeaders: {},
  body: '',
  isBase64Encoded: false,
});
const runtimeSubpathAwsLambdaHandler: RuntimeSubpathAwsLambdaHandler =
  createRuntimeSubpathAwsLambdaHandler(manifest, handlerOptions);
const runtimeSubpathSyncAwsLambdaHandler: RuntimeSubpathAwsLambdaHandler =
  syncAwsLambdaHandler;
const runtimeSubpathAwsLambdaHttpApiHandler: RuntimeSubpathAwsLambdaHttpApiHandler =
  createRuntimeSubpathAwsLambdaHttpApiHandler(manifest, handlerOptions);
const runtimeSubpathSyncAwsLambdaHttpApiHandler: RuntimeSubpathAwsLambdaHttpApiHandler =
  syncAwsLambdaHttpApiHandler;
const runtimeSubpathAwsLambdaRestApiHandler: RuntimeSubpathAwsLambdaRestApiHandler =
  createRuntimeSubpathAwsLambdaRestApiHandler(manifest, handlerOptions);
const runtimeSubpathSyncAwsLambdaRestApiHandler: RuntimeSubpathAwsLambdaRestApiHandler =
  syncAwsLambdaRestApiHandler;
const awsLambdaEvent: AwsLambdaHttpEventV2 = {
  rawPath: '/rpc',
  headers: { 'content-type': 'application/json' },
  body: '{}',
  requestContext: { http: { method: 'POST' } },
};
// @ts-expect-error AWS Lambda HTTP API events expose readonly paths.
awsLambdaEvent.rawPath = '/other';
if (awsLambdaEvent.headers !== undefined) {
  // @ts-expect-error AWS Lambda HTTP API event headers are readonly.
  awsLambdaEvent.headers['content-type'] = 'text/plain';
}
// @ts-expect-error AWS Lambda HTTP API event cookies are readonly.
awsLambdaEvent.cookies?.push('b=2');
const awsLambdaRestApiEvent: AwsLambdaRestApiEventV1 = {
  path: '/rpc',
  httpMethod: 'POST',
  multiValueHeaders: { cookie: ['a=1', undefined] },
  multiValueQueryStringParameters: { tag: ['one', 'two'] },
  body: '{}',
};
// @ts-expect-error AWS Lambda REST events expose readonly paths.
awsLambdaRestApiEvent.path = '/other';
if (awsLambdaRestApiEvent.multiValueHeaders !== undefined) {
  // @ts-expect-error AWS Lambda REST multi-value headers are readonly.
  awsLambdaRestApiEvent.multiValueHeaders.cookie = ['b=2'];
  // @ts-expect-error AWS Lambda REST multi-value header lists are readonly.
  awsLambdaRestApiEvent.multiValueHeaders.cookie?.push('b=2');
}
interface AwsLambdaHttpApiEventForTypes extends AwsLambdaHttpEventV2 {
  requestContext?: NonNullable<AwsLambdaHttpEventV2['requestContext']> & {
    authorizer?: {
      jwt?: {
        claims: {
          sub: string;
        };
      };
    };
  };
}
interface AwsLambdaRestApiEventForTypes extends AwsLambdaRestApiEventV1 {
  requestContext?: NonNullable<AwsLambdaRestApiEventV1['requestContext']> & {
    authorizer?: {
      principalId: string;
    };
  };
}
const createTypedAwsLambdaHandler =
  createAwsLambdaHandlerFor<AwsLambdaHttpApiEventForTypes>();
const typedAwsLambdaHandler: AwsLambdaHandler<AwsLambdaHttpApiEventForTypes> =
  createTypedAwsLambdaHandler(manifest, handlerOptions);
const createTypedAwsLambdaHttpApiHandler =
  createAwsLambdaHttpApiHandlerFor<AwsLambdaHttpApiEventForTypes>();
const typedAwsLambdaHttpApiHandler: AwsLambdaHttpApiHandler<AwsLambdaHttpApiEventForTypes> =
  createTypedAwsLambdaHttpApiHandler(manifest, handlerOptions);
const createTypedAwsLambdaRestApiHandler =
  createAwsLambdaRestApiHandlerFor<AwsLambdaRestApiEventForTypes>();
const typedAwsLambdaRestApiHandler: AwsLambdaRestApiHandler<AwsLambdaRestApiEventForTypes> =
  createTypedAwsLambdaRestApiHandler(manifest, handlerOptions);
const createRuntimeSubpathTypedAwsLambdaHandler =
  createRuntimeSubpathAwsLambdaHandlerFor<AwsLambdaHttpApiEventForTypes>();
const runtimeSubpathTypedAwsLambdaHandler: RuntimeSubpathAwsLambdaHandler<AwsLambdaHttpApiEventForTypes> =
  createRuntimeSubpathTypedAwsLambdaHandler(manifest, handlerOptions);
const createRuntimeSubpathTypedAwsLambdaHttpApiHandler =
  createRuntimeSubpathAwsLambdaHttpApiHandlerFor<AwsLambdaHttpApiEventForTypes>();
const runtimeSubpathTypedAwsLambdaHttpApiHandler: RuntimeSubpathAwsLambdaHttpApiHandler<AwsLambdaHttpApiEventForTypes> =
  createRuntimeSubpathTypedAwsLambdaHttpApiHandler(manifest, handlerOptions);
const createRuntimeSubpathTypedAwsLambdaRestApiHandler =
  createRuntimeSubpathAwsLambdaRestApiHandlerFor<AwsLambdaRestApiEventForTypes>();
const runtimeSubpathTypedAwsLambdaRestApiHandler: RuntimeSubpathAwsLambdaRestApiHandler<AwsLambdaRestApiEventForTypes> =
  createRuntimeSubpathTypedAwsLambdaRestApiHandler(manifest, handlerOptions);
const typedAwsLambdaEvent: AwsLambdaHttpApiEventForTypes = {
  ...awsLambdaEvent,
  requestContext: {
    ...awsLambdaEvent.requestContext,
    authorizer: { jwt: { claims: { sub: 'user_1' } } },
  },
};
const typedAwsLambdaRestApiEvent: AwsLambdaRestApiEventForTypes = {
  ...awsLambdaRestApiEvent,
  requestContext: {
    ...awsLambdaRestApiEvent.requestContext,
    authorizer: { principalId: 'user_1' },
  },
};
typedAwsLambdaEvent.requestContext?.authorizer?.jwt?.claims.sub.toUpperCase();
typedAwsLambdaRestApiEvent.requestContext?.authorizer?.principalId.toUpperCase();
Promise.resolve(awsLambdaHandler(awsLambdaEvent)).then((response) => {
  const typedResponse: AwsLambdaHttpResponseV2 = response;
  typedResponse.statusCode.toFixed();
  // @ts-expect-error AWS Lambda HTTP responses expose readonly status codes.
  typedResponse.statusCode = 201;
  if (typedResponse.headers !== undefined) {
    // @ts-expect-error AWS Lambda HTTP response headers are readonly.
    typedResponse.headers['content-type'] = 'text/plain';
  }
});
awsLambdaHttpApiHandler(awsLambdaEvent);
syncAwsLambdaHttpApiHandler(awsLambdaEvent);
typedAwsLambdaHandler(typedAwsLambdaEvent);
typedAwsLambdaHttpApiHandler(typedAwsLambdaEvent);
runtimeSubpathTypedAwsLambdaHandler(typedAwsLambdaEvent);
runtimeSubpathTypedAwsLambdaHttpApiHandler(typedAwsLambdaEvent);
Promise.resolve(awsLambdaRestApiHandler(awsLambdaRestApiEvent)).then(
  (response) => {
    const typedResponse: AwsLambdaRestApiResponseV1 = response;
    typedResponse.statusCode.toFixed();
    // @ts-expect-error AWS Lambda REST responses expose readonly status codes.
    typedResponse.statusCode = 201;
    if (typedResponse.multiValueHeaders !== undefined) {
      // @ts-expect-error AWS Lambda REST multi-value response headers are readonly.
      typedResponse.multiValueHeaders['set-cookie'] = ['b=2'];
    }
  }
);
syncAwsLambdaRestApiHandler(awsLambdaRestApiEvent);
typedAwsLambdaRestApiHandler(typedAwsLambdaRestApiEvent);
runtimeSubpathTypedAwsLambdaRestApiHandler(typedAwsLambdaRestApiEvent);
runtimeSubpathAwsLambdaHandler(awsLambdaEvent);
runtimeSubpathSyncAwsLambdaHandler(awsLambdaEvent);
runtimeSubpathAwsLambdaHttpApiHandler(awsLambdaEvent);
runtimeSubpathSyncAwsLambdaHttpApiHandler(awsLambdaEvent);
runtimeSubpathAwsLambdaRestApiHandler(awsLambdaRestApiEvent);
runtimeSubpathSyncAwsLambdaRestApiHandler(awsLambdaRestApiEvent);
// @ts-expect-error service-dependent manifests require matching AWS Lambda adapter plugins.
createAwsLambdaHandler(manifest);
// @ts-expect-error service-dependent manifests require matching AWS Lambda REST API adapter plugins.
createAwsLambdaRestApiHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed AWS Lambda adapter plugins.
createTypedAwsLambdaHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed AWS Lambda HTTP API adapter plugins.
createTypedAwsLambdaHttpApiHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed AWS Lambda REST API adapter plugins.
createTypedAwsLambdaRestApiHandler(manifest);
const nextRouteHandler: NextRouteHandler = nextHandlers.POST;
const runtimeSubpathNextRouteHandler: RuntimeSubpathNextRouteHandler =
  nextRouteHandler;
type NextDynamicRouteParamsForTypes = {
  team: string;
  slug?: string[];
};
const nextRouteParamValue: NextRouteParamValue = 'team';
const runtimeSubpathNextRouteParamValue: RuntimeSubpathNextRouteParamValue =
  nextRouteParamValue;
const nextRouteParamSegments: NextRouteParamValue = ['rpc'] as const;
if (
  nextRouteParamSegments !== undefined &&
  typeof nextRouteParamSegments !== 'string'
) {
  // @ts-expect-error Next route param segment arrays are readonly.
  nextRouteParamSegments.push('v2');
}
const nextRouteParams: NextRouteParams = {
  team: nextRouteParamValue,
  slug: ['rpc'],
};
// @ts-expect-error Next route params expose readonly entries.
nextRouteParams['team'] = 'other';
const runtimeSubpathNextRouteParams: RuntimeSubpathNextRouteParams =
  nextRouteParams;
const runtimeSubpathNextRouteSlug = runtimeSubpathNextRouteParams['slug'];
// @ts-expect-error runtime subpath Next route params expose readonly entries.
runtimeSubpathNextRouteParams['slug'] = ['v2'];
const nextDynamicRouteHandler: NextRouteHandler<
  NextRouteContext<NextDynamicRouteParamsForTypes>
> = async (request, context) => {
  const params = await context.params;
  return new Response(`${params.team}:${params.slug?.join('/')}:${request.url}`);
};
const runtimeSubpathNextDynamicRouteHandler: RuntimeSubpathNextRouteHandler<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>
> = nextDynamicRouteHandler;
const nextDynamicHandlers: NextRouteHandlers<
  NextRouteContext<NextDynamicRouteParamsForTypes>
> = {
  GET: nextDynamicRouteHandler,
  POST: nextDynamicRouteHandler,
  OPTIONS: nextDynamicRouteHandler,
};
// @ts-expect-error Next route handler tables expose readonly methods.
nextDynamicHandlers.GET = nextDynamicRouteHandler;
const nextRequestRouteHandler: NextRouteHandler<never, AppFetchRequest> = (
  request
) => new Response(request.requestId);
const runtimeSubpathNextRequestRouteHandler: RuntimeSubpathNextRouteHandler<
  never,
  AppFetchRequest
> = nextRequestRouteHandler;
const nextDynamicRequestRouteHandler: NextRouteHandler<
  NextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = async (request, context) => {
  const params = await context.params;
  return new Response(`${request.requestId}:${params.team}`);
};
const runtimeSubpathNextDynamicRequestRouteHandler: RuntimeSubpathNextRouteHandler<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = nextDynamicRequestRouteHandler;
const runtimeSubpathNextDynamicRouteContext: RuntimeSubpathNextRouteContext<
  NextDynamicRouteParamsForTypes
> = {
  params: Promise.resolve({
    team: `${runtimeSubpathNextRouteParamValue}`,
    ...(Array.isArray(runtimeSubpathNextRouteSlug)
      ? { slug: runtimeSubpathNextRouteSlug }
    : {}),
  }),
};
// @ts-expect-error Next route context params are readonly.
runtimeSubpathNextDynamicRouteContext.params = Promise.resolve({ team: 'red' });
// @ts-expect-error typed Next route contexts are not assignable to plain route contexts.
const _wrongNextDynamicRouteContext: NextRouteContext =
  runtimeSubpathNextDynamicRouteContext;
const createTypedNextRouteHandlers = createNextRouteHandlersFor<
  NextRouteContext<NextDynamicRouteParamsForTypes>
>();
const nextTypedHandlers: NextRouteHandlers<
  NextRouteContext<NextDynamicRouteParamsForTypes>
> = createTypedNextRouteHandlers(manifest, handlerOptions);
const createRequestTypedNextRouteHandlers = createNextRouteHandlersFor<
  never,
  AppFetchRequest
>();
const nextRequestTypedHandlers: NextRouteHandlers<never, AppFetchRequest> =
  createRequestTypedNextRouteHandlers(manifest, handlerOptions);
const hookTypedNextRouteHandlers = createNextRouteHandlersFor<
  never,
  HookAppRequest
>()(manifest, typedRequestHandlerOptions);
const directHookTypedNextRouteHandlers: NextRouteHandlers<
  never,
  HookAppRequest
> = createNextRouteHandlers(manifest, typedRequestHandlerOptions);
const createContextRequestTypedNextRouteHandlers = createNextRouteHandlersFor<
  NextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
>();
const nextContextRequestTypedHandlers: NextRouteHandlers<
  NextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = createContextRequestTypedNextRouteHandlers(manifest, handlerOptions);
const createTypedNextHandler = createNextHandlerFor<
  NextRouteContext<NextDynamicRouteParamsForTypes>
>();
const nextTypedHandler: NextHandler<
  NextRouteContext<NextDynamicRouteParamsForTypes>
> = createTypedNextHandler(manifest, handlerOptions);
const createRequestTypedNextHandler = createNextHandlerFor<
  never,
  AppFetchRequest
>();
const nextRequestTypedHandler: NextHandler<never, AppFetchRequest> =
  createRequestTypedNextHandler(manifest, handlerOptions);
const hookTypedNextHandler =
  createNextHandlerFor<never, HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const directHookTypedNextHandler: NextHandler<never, HookAppRequest> =
  createNextHandler(manifest, typedRequestHandlerOptions);
const createContextRequestTypedNextHandler = createNextHandlerFor<
  NextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
>();
const nextContextRequestTypedHandler: NextHandler<
  NextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = createContextRequestTypedNextHandler(manifest, handlerOptions);
const createRuntimeSubpathTypedNextRouteHandlers =
  createRuntimeSubpathNextRouteHandlersFor<
    RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>
  >();
const runtimeSubpathTypedNextHandlers: RuntimeSubpathNextRouteHandlers<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>
> = createRuntimeSubpathTypedNextRouteHandlers(manifest, handlerOptions);
const createRuntimeSubpathRequestTypedNextRouteHandlers =
  createRuntimeSubpathNextRouteHandlersFor<never, AppFetchRequest>();
const runtimeSubpathRequestTypedNextHandlers: RuntimeSubpathNextRouteHandlers<
  never,
  AppFetchRequest
> = createRuntimeSubpathRequestTypedNextRouteHandlers(
  manifest,
  handlerOptions
);
const createRuntimeSubpathContextRequestTypedNextRouteHandlers =
  createRuntimeSubpathNextRouteHandlersFor<
    RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>,
    AppFetchRequest
  >();
const runtimeSubpathContextRequestTypedNextHandlers: RuntimeSubpathNextRouteHandlers<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = createRuntimeSubpathContextRequestTypedNextRouteHandlers(
  manifest,
  handlerOptions
);
const createRuntimeSubpathTypedNextHandler =
  createRuntimeSubpathNextHandlerFor<
    RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>
  >();
const runtimeSubpathTypedNextHandler: RuntimeSubpathNextHandler<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>
> = createRuntimeSubpathTypedNextHandler(manifest, handlerOptions);
const createRuntimeSubpathRequestTypedNextHandler =
  createRuntimeSubpathNextHandlerFor<never, AppFetchRequest>();
const runtimeSubpathRequestTypedNextHandler: RuntimeSubpathNextHandler<
  never,
  AppFetchRequest
> = createRuntimeSubpathRequestTypedNextHandler(manifest, handlerOptions);
const createRuntimeSubpathContextRequestTypedNextHandler =
  createRuntimeSubpathNextHandlerFor<
    RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>,
    AppFetchRequest
  >();
const runtimeSubpathContextRequestTypedNextHandler: RuntimeSubpathNextHandler<
  RuntimeSubpathNextRouteContext<NextDynamicRouteParamsForTypes>,
  AppFetchRequest
> = createRuntimeSubpathContextRequestTypedNextHandler(manifest, handlerOptions);
nextHandler.POST(new Request('https://example.com/rpc'));
runtimeSubpathNextHandler.POST(new Request('https://example.com/rpc'));
nextHandlers.POST(new Request('https://example.com/rpc'));
runtimeSubpathNextRouteHandler(new Request('https://example.com/rpc'));
nextRequestRouteHandler(appFetchRequest);
runtimeSubpathNextRequestRouteHandler(appFetchRequest);
runtimeSubpathNextDynamicRouteHandler(
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
nextDynamicRequestRouteHandler(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
runtimeSubpathNextDynamicRequestRouteHandler(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
nextDynamicHandlers.GET(new Request('https://example.com/rpc'), {
  params: Promise.resolve({
    team: 'core',
  }),
});
nextRequestTypedHandlers.GET(appFetchRequest);
nextRequestTypedHandler.POST(appFetchRequest);
hookTypedNextRouteHandlers.GET(hookAppRequest);
hookTypedNextHandler.POST(hookAppRequest);
directHookTypedNextRouteHandlers.GET(hookAppRequest);
directHookTypedNextHandler.POST(hookAppRequest);
nextContextRequestTypedHandlers.GET(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
nextContextRequestTypedHandler.POST(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
nextTypedHandlers.GET(
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
nextTypedHandler.POST(
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
runtimeSubpathTypedNextHandlers.OPTIONS(
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
runtimeSubpathTypedNextHandler.GET(
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
runtimeSubpathRequestTypedNextHandlers.GET(appFetchRequest);
runtimeSubpathRequestTypedNextHandler.POST(appFetchRequest);
runtimeSubpathContextRequestTypedNextHandlers.GET(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
runtimeSubpathContextRequestTypedNextHandler.POST(
  appFetchRequest,
  runtimeSubpathNextDynamicRouteContext
);
// @ts-expect-error typed Next handlers require the configured request subtype.
nextRequestTypedHandlers.GET(new Request('https://example.com/rpc'));
// @ts-expect-error hook-typed Next handlers require the configured request subtype.
hookTypedNextRouteHandlers.GET(new Request('https://example.com/rpc'));
// @ts-expect-error hook-typed Next handler aliases require the configured request subtype.
hookTypedNextHandler.POST(new Request('https://example.com/rpc'));
// @ts-expect-error direct typed Next route handlers infer custom hook request types.
directHookTypedNextRouteHandlers.GET(new Request('https://example.com/rpc'));
// @ts-expect-error direct typed Next handler aliases infer custom hook request types.
directHookTypedNextHandler.POST(new Request('https://example.com/rpc'));
nextContextRequestTypedHandlers.GET(
  // @ts-expect-error context-aware typed Next handlers require the configured request subtype.
  new Request('https://example.com/rpc'),
  runtimeSubpathNextDynamicRouteContext
);
// @ts-expect-error service-dependent manifests require matching Next adapter plugins.
createNextRouteHandlers(manifest);
const cloudflareWorker: CloudflareWorker = createCloudflareWorker(
  manifest,
  handlerOptions
);
cloudflareWorker.fetch(new Request('https://example.com/rpc'));
const cloudflareFetch: CloudflareFetchHandler = cloudflareWorker.fetch;
const directCloudflareFetch: CloudflareFetchHandler = createCloudflareFetch(
  manifest,
  handlerOptions
);
const runtimeSubpathDirectCloudflareFetch: RuntimeSubpathCloudflareFetchHandler =
  createRuntimeSubpathCloudflareFetch(manifest, handlerOptions);
const runtimeSubpathCloudflareFetch: RuntimeSubpathCloudflareFetchHandler =
  cloudflareFetch;
const createTypedCloudflareFetch =
  createCloudflareFetchFor<AppFetchRequest>();
const typedCloudflareFetch: CloudflareFetchHandler<AppFetchRequest> =
  createTypedCloudflareFetch(manifest, handlerOptions);
const createDefaultCloudflareFetch = createCloudflareFetchFor();
const defaultCloudflareFetch: CloudflareFetchHandler =
  createDefaultCloudflareFetch(manifest, handlerOptions);
const hookTypedCloudflareFetch =
  createCloudflareFetchFor<HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const directHookTypedCloudflareFetch: CloudflareFetchHandler<HookAppRequest> =
  createCloudflareFetch(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedCloudflareFetch =
  createRuntimeSubpathCloudflareFetchFor<AppFetchRequest>();
const runtimeSubpathTypedCloudflareFetch: RuntimeSubpathCloudflareFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedCloudflareFetch(manifest, handlerOptions);
interface CloudflareEnvForTypes {
  readonly accountId: string;
}
interface CloudflareContextForTypes {
  waitUntil(promise: Promise<unknown>): void;
}
const cloudflareWorkerFetch: CloudflareWorkerFetchHandler<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
> = (request, env, context) => {
  request.url.toUpperCase();
  request.requestId.toUpperCase();
  env.accountId.toUpperCase();
  context.waitUntil(Promise.resolve());
  return new Response();
};
const runtimeSubpathCloudflareWorkerFetch: RuntimeSubpathCloudflareWorkerFetchHandler<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
> = cloudflareWorkerFetch;
const typedCloudflareWorker: CloudflareWorker<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
> = {
  fetch: runtimeSubpathCloudflareWorkerFetch,
};
const createTypedCloudflareWorker = createCloudflareWorkerFor<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
>();
const typedCloudflareWorkerFromFactory: CloudflareWorker<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
> = createTypedCloudflareWorker(manifest, handlerOptions);
const createDefaultTypedCloudflareWorker = createCloudflareWorkerFor();
const defaultTypedCloudflareWorker: CloudflareWorker =
  createDefaultTypedCloudflareWorker(manifest, handlerOptions);
const hookTypedCloudflareWorker = createCloudflareWorkerFor<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  HookAppRequest
>()(manifest, typedRequestHandlerOptions);
const directHookTypedCloudflareWorker: CloudflareWorker<
  never,
  never,
  HookAppRequest
> = createCloudflareWorker(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedCloudflareWorker =
  createRuntimeSubpathCloudflareWorkerFor<
    CloudflareEnvForTypes,
    CloudflareContextForTypes,
    AppFetchRequest
  >();
const runtimeSubpathTypedCloudflareWorker: RuntimeSubpathCloudflareWorker<
  CloudflareEnvForTypes,
  CloudflareContextForTypes,
  AppFetchRequest
> = createRuntimeSubpathTypedCloudflareWorker(manifest, handlerOptions);
typedCloudflareWorker.fetch(
  appFetchRequest,
  { accountId: 'acct_1' },
  {
    waitUntil(promise) {
      promise.then(Boolean);
    },
  }
);
defaultTypedCloudflareWorker.fetch(new Request('https://example.com/rpc'));
hookTypedCloudflareFetch(hookAppRequest);
directHookTypedCloudflareFetch(hookAppRequest);
hookTypedCloudflareWorker.fetch(
  hookAppRequest,
  { accountId: 'acct_1' },
  {
    waitUntil(promise) {
      promise.then(Boolean);
    },
  }
);
directHookTypedCloudflareWorker.fetch(hookAppRequest);
typedCloudflareWorkerFromFactory.fetch(
  appFetchRequest,
  { accountId: 'acct_1' },
  {
    waitUntil(promise) {
      promise.then(Boolean);
    },
  }
);
runtimeSubpathTypedCloudflareWorker.fetch(
  appFetchRequest,
  { accountId: 'acct_1' },
  {
    waitUntil(promise) {
      promise.then(Boolean);
    },
  }
);
// @ts-expect-error Cloudflare worker fetch handlers are readonly.
typedCloudflareWorker.fetch = runtimeSubpathCloudflareWorkerFetch;
// @ts-expect-error Cloudflare worker fetch handlers are readonly across subpath exports.
runtimeSubpathTypedCloudflareWorker.fetch = runtimeSubpathCloudflareWorkerFetch;
// @ts-expect-error typed Cloudflare workers are not assignable to plain fetch-only workers.
const _wrongCloudflareWorker: CloudflareWorker = typedCloudflareWorker;
const cloudflareFetchOptions: CloudflareFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const exactCloudflareFetchOptions: CloudflareFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedCloudflareFetchOptions: CloudflareFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedCloudflareRouteUnaryFetchOptions: CloudflareRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedCloudflareFetchOptions;
const runtimeSubpathCloudflareFetchOptions: RuntimeSubpathCloudflareFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareFetchOptions;
const cloudflareRouteUnaryFetchOptions: CloudflareRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const cloudflareUnaryRouteFetchOptions: CloudflareUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryFetchOptions;
const cloudflareRouteStreamFetchOptions: CloudflareRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const cloudflareStreamRouteFetchOptions: CloudflareStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamFetchOptions;
const runtimeSubpathCloudflareUnaryRouteFetchOptions: RuntimeSubpathCloudflareUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareUnaryRouteFetchOptions;
const runtimeSubpathCloudflareStreamRouteFetchOptions: RuntimeSubpathCloudflareStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareStreamRouteFetchOptions;
const runtimeSubpathCloudflareRouteUnaryFetchOptions: RuntimeSubpathCloudflareRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryFetchOptions;
const runtimeSubpathCloudflareRouteStreamFetchOptions: RuntimeSubpathCloudflareRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamFetchOptions;
const exactRuntimeSubpathCloudflareFetchOptions: RuntimeSubpathCloudflareFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactCloudflareFetchOptions;
const cloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const exactCloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedCloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedCloudflareFetchOptions;
const requestTypedCloudflareRouteUnaryWorkerOptions: CloudflareRouteUnaryWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedCloudflareWorkerOptions;
const runtimeSubpathCloudflareWorkerOptions: RuntimeSubpathCloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareWorkerOptions;
const cloudflareRouteUnaryWorkerOptions: CloudflareRouteUnaryWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const cloudflareUnaryRouteWorkerOptions: CloudflareUnaryRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryWorkerOptions;
const cloudflareRouteStreamWorkerOptions: CloudflareRouteStreamWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const cloudflareStreamRouteWorkerOptions: CloudflareStreamRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamWorkerOptions;
const runtimeSubpathCloudflareUnaryRouteWorkerOptions: RuntimeSubpathCloudflareUnaryRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareUnaryRouteWorkerOptions;
const runtimeSubpathCloudflareStreamRouteWorkerOptions: RuntimeSubpathCloudflareStreamRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareStreamRouteWorkerOptions;
const runtimeSubpathCloudflareRouteUnaryWorkerOptions: RuntimeSubpathCloudflareRouteUnaryWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryWorkerOptions;
const runtimeSubpathCloudflareRouteStreamWorkerOptions: RuntimeSubpathCloudflareRouteStreamWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamWorkerOptions;
const exactRuntimeSubpathCloudflareWorkerOptions: RuntimeSubpathCloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactCloudflareWorkerOptions;
runtimeSubpathCloudflareUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareStreamRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteStreamFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathCloudflareFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedCloudflareFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedCloudflareRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathCloudflareUnaryRouteWorkerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareStreamRouteWorkerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteUnaryWorkerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteStreamWorkerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathCloudflareWorkerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedCloudflareWorkerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedCloudflareRouteUnaryWorkerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const cloudflareWorkerOptionsArgs: CloudflareWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareWorkerOptions];
const cloudflareFetchOptionsArgs: CloudflareFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareFetchOptions];
const cloudflareRouteUnaryFetchOptionsArgs: CloudflareRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteUnaryFetchOptions];
const requestTypedCloudflareRouteUnaryFetchOptionsArgs: CloudflareRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedCloudflareRouteUnaryFetchOptions];
const cloudflareUnaryRouteFetchOptionsArgs: CloudflareUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryFetchOptionsArgs;
const cloudflareRouteStreamFetchOptionsArgs: CloudflareRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteStreamFetchOptions];
const cloudflareStreamRouteFetchOptionsArgs: CloudflareStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamFetchOptionsArgs;
const cloudflareRouteUnaryWorkerOptionsArgs: CloudflareRouteUnaryWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteUnaryWorkerOptions];
const requestTypedCloudflareRouteUnaryWorkerOptionsArgs: CloudflareRouteUnaryWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedCloudflareRouteUnaryWorkerOptions];
const cloudflareUnaryRouteWorkerOptionsArgs: CloudflareUnaryRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryWorkerOptionsArgs;
const cloudflareRouteStreamWorkerOptionsArgs: CloudflareRouteStreamWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteStreamWorkerOptions];
const cloudflareStreamRouteWorkerOptionsArgs: CloudflareStreamRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamWorkerOptionsArgs;
const runtimeSubpathCloudflareWorkerOptionsArgs: RuntimeSubpathCloudflareWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareWorkerOptionsArgs;
const runtimeSubpathCloudflareFetchOptionsArgs: RuntimeSubpathCloudflareFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareFetchOptionsArgs;
const runtimeSubpathCloudflareUnaryRouteFetchOptionsArgs: RuntimeSubpathCloudflareUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareUnaryRouteFetchOptionsArgs;
const runtimeSubpathCloudflareStreamRouteFetchOptionsArgs: RuntimeSubpathCloudflareStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareStreamRouteFetchOptionsArgs;
const runtimeSubpathCloudflareRouteUnaryFetchOptionsArgs: RuntimeSubpathCloudflareRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryFetchOptionsArgs;
const runtimeSubpathCloudflareRouteStreamFetchOptionsArgs: RuntimeSubpathCloudflareRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamFetchOptionsArgs;
const runtimeSubpathCloudflareUnaryRouteWorkerOptionsArgs: RuntimeSubpathCloudflareUnaryRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareUnaryRouteWorkerOptionsArgs;
const runtimeSubpathCloudflareStreamRouteWorkerOptionsArgs: RuntimeSubpathCloudflareStreamRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareStreamRouteWorkerOptionsArgs;
const runtimeSubpathCloudflareRouteUnaryWorkerOptionsArgs: RuntimeSubpathCloudflareRouteUnaryWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteUnaryWorkerOptionsArgs;
const runtimeSubpathCloudflareRouteStreamWorkerOptionsArgs: RuntimeSubpathCloudflareRouteStreamWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareRouteStreamWorkerOptionsArgs;
runtimeSubpathCloudflareFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathCloudflareUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedCloudflareRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathCloudflareRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathCloudflareWorkerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathCloudflareUnaryRouteWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathCloudflareStreamRouteWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathCloudflareRouteUnaryWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedCloudflareRouteUnaryWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathCloudflareRouteStreamWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
createCloudflareWorker(manifest, cloudflareWorkerOptions);
createRuntimeSubpathCloudflareWorker(
  manifest,
  runtimeSubpathCloudflareWorkerOptions
);
createCloudflareFetch(manifest, cloudflareFetchOptions);
createRuntimeSubpathCloudflareFetch(
  manifest,
  runtimeSubpathCloudflareFetchOptions
);
cloudflareWorker.fetch(new Request('https://example.com/rpc'));
directCloudflareFetch(new Request('https://example.com/rpc'));
runtimeSubpathDirectCloudflareFetch(new Request('https://example.com/rpc'));
runtimeSubpathCloudflareFetch(new Request('https://example.com/rpc'));
defaultCloudflareFetch(new Request('https://example.com/rpc'));
typedCloudflareFetch(appFetchRequest);
runtimeSubpathTypedCloudflareFetch(appFetchRequest);
hookTypedCloudflareFetch(hookAppRequest);
// @ts-expect-error direct typed Cloudflare fetch factories infer custom hook request types.
directHookTypedCloudflareFetch(new Request('https://example.com/rpc'));
// @ts-expect-error direct typed Cloudflare workers infer custom hook request types.
directHookTypedCloudflareWorker.fetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Cloudflare fetch plugins.
createCloudflareFetch(manifest);
// @ts-expect-error service-dependent manifests require matching typed Cloudflare fetch plugins.
createTypedCloudflareFetch(manifest);
// @ts-expect-error service-dependent manifests require matching Cloudflare adapter plugins.
createCloudflareWorker(manifest);
// @ts-expect-error service-dependent manifests require matching typed Cloudflare adapter plugins.
createTypedCloudflareWorker(manifest);
const netlifyFetch = createNetlifyFetch(manifest, handlerOptions);
const typedNetlifyFetch: NetlifyFetchHandler = netlifyFetch;
const runtimeSubpathNetlifyFetch: RuntimeSubpathNetlifyFetchHandler =
  typedNetlifyFetch;
const createTypedNetlifyFetch = createNetlifyFetchFor<AppFetchRequest>();
const typedAppNetlifyFetch: NetlifyFetchHandler<AppFetchRequest> =
  createTypedNetlifyFetch(manifest, handlerOptions);
const createDefaultNetlifyFetch = createNetlifyFetchFor();
const defaultNetlifyFetch: NetlifyFetchHandler = createDefaultNetlifyFetch(
  manifest,
  handlerOptions
);
const hookTypedNetlifyFetch =
  createNetlifyFetchFor<HookAppRequest>()(manifest, typedRequestHandlerOptions);
const directHookTypedNetlifyFetch: NetlifyFetchHandler<HookAppRequest> =
  createNetlifyFetch(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedNetlifyFetch =
  createRuntimeSubpathNetlifyFetchFor<AppFetchRequest>();
const runtimeSubpathTypedAppNetlifyFetch: RuntimeSubpathNetlifyFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedNetlifyFetch(manifest, handlerOptions);
interface NetlifyContextForTypes {
  cookies: {
    get(name: string): string | undefined;
  };
  geo: {
    city?: string;
  };
}
const netlifyEdgeFetch: NetlifyEdgeFetchHandler<NetlifyContextForTypes> = (
  request,
  context
) =>
  new Response(
    JSON.stringify({
      cookie: context.cookies.get('session'),
      city: context.geo.city,
      url: request.url,
    })
  );
const runtimeSubpathNetlifyEdgeFetch: RuntimeSubpathNetlifyEdgeFetchHandler<
  NetlifyContextForTypes
> = netlifyEdgeFetch;
const netlifyEdgeFunction: NetlifyEdgeFetchHandler =
  createNetlifyEdgeFunction(manifest, handlerOptions);
const runtimeSubpathNetlifyEdgeFunction: RuntimeSubpathNetlifyEdgeFetchHandler =
  createRuntimeSubpathNetlifyEdgeFunction(manifest, handlerOptions);
const createTypedNetlifyEdgeFunction =
  createNetlifyEdgeFunctionFor<NetlifyContextForTypes, AppFetchRequest>();
const typedNetlifyEdgeFunction: NetlifyEdgeFetchHandler<
  NetlifyContextForTypes,
  AppFetchRequest
> = createTypedNetlifyEdgeFunction(manifest, handlerOptions);
const createDefaultNetlifyEdgeFunction = createNetlifyEdgeFunctionFor();
const defaultNetlifyEdgeFunction: NetlifyEdgeFetchHandler =
  createDefaultNetlifyEdgeFunction(manifest, handlerOptions);
const hookTypedNetlifyEdgeFunction = createNetlifyEdgeFunctionFor<
  NetlifyContextForTypes,
  HookAppRequest
>()(manifest, typedRequestHandlerOptions);
const directHookTypedNetlifyEdgeFunction: NetlifyEdgeFetchHandler<
  NetlifyContextForTypes,
  HookAppRequest
> = createNetlifyEdgeFunction(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedNetlifyEdgeFunction =
  createRuntimeSubpathNetlifyEdgeFunctionFor<
    NetlifyContextForTypes,
    AppFetchRequest
  >();
const runtimeSubpathTypedNetlifyEdgeFunction: RuntimeSubpathNetlifyEdgeFetchHandler<
  NetlifyContextForTypes,
  AppFetchRequest
> = createRuntimeSubpathTypedNetlifyEdgeFunction(manifest, handlerOptions);
const netlifyEdgeUrlResult: NetlifyEdgeResult = new URL(
  '/rewritten',
  'https://example.com'
);
const runtimeSubpathNetlifyEdgeBypassResult: RuntimeSubpathNetlifyEdgeResult =
  undefined;
runtimeSubpathNetlifyEdgeFetch(new Request('https://example.com/rpc'), {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
const netlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const netlifyRouteUnaryFetchOptions: NetlifyRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const netlifyUnaryRouteFetchOptions: NetlifyUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteUnaryFetchOptions;
const netlifyRouteStreamFetchOptions: NetlifyRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const netlifyStreamRouteFetchOptions: NetlifyStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteStreamFetchOptions;
const exactNetlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedNetlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedNetlifyRouteUnaryFetchOptions: NetlifyRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNetlifyFetchOptions;
const runtimeSubpathNetlifyFetchOptions: RuntimeSubpathNetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyFetchOptions;
const runtimeSubpathNetlifyUnaryRouteFetchOptions: RuntimeSubpathNetlifyUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyUnaryRouteFetchOptions;
const runtimeSubpathNetlifyStreamRouteFetchOptions: RuntimeSubpathNetlifyStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyStreamRouteFetchOptions;
const runtimeSubpathNetlifyRouteUnaryFetchOptions: RuntimeSubpathNetlifyRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteUnaryFetchOptions;
const runtimeSubpathNetlifyRouteStreamFetchOptions: RuntimeSubpathNetlifyRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteStreamFetchOptions;
const exactRuntimeSubpathNetlifyFetchOptions: RuntimeSubpathNetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactNetlifyFetchOptions;
runtimeSubpathNetlifyUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNetlifyStreamRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNetlifyRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNetlifyRouteStreamFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathNetlifyFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedNetlifyFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedNetlifyRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const netlifyFetchOptionsArgs: NetlifyFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyFetchOptions];
const rootSubpathNetlifyFetchOptionsArgs: RootSubpathNetlifyFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyFetchOptionsArgs;
const netlifyRouteUnaryFetchOptionsArgs: NetlifyRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyRouteUnaryFetchOptions];
const requestTypedNetlifyRouteUnaryFetchOptionsArgs: NetlifyRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedNetlifyRouteUnaryFetchOptions];
const netlifyUnaryRouteFetchOptionsArgs: NetlifyUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteUnaryFetchOptionsArgs;
const netlifyRouteStreamFetchOptionsArgs: NetlifyRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyRouteStreamFetchOptions];
const netlifyStreamRouteFetchOptionsArgs: NetlifyStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteStreamFetchOptionsArgs;
const runtimeSubpathNetlifyFetchOptionsArgs: RuntimeSubpathNetlifyFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = rootSubpathNetlifyFetchOptionsArgs;
const runtimeSubpathNetlifyUnaryRouteFetchOptionsArgs: RuntimeSubpathNetlifyUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyUnaryRouteFetchOptionsArgs;
const runtimeSubpathNetlifyStreamRouteFetchOptionsArgs: RuntimeSubpathNetlifyStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyStreamRouteFetchOptionsArgs;
const runtimeSubpathNetlifyRouteUnaryFetchOptionsArgs: RuntimeSubpathNetlifyRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteUnaryFetchOptionsArgs;
const runtimeSubpathNetlifyRouteStreamFetchOptionsArgs: RuntimeSubpathNetlifyRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyRouteStreamFetchOptionsArgs;
runtimeSubpathNetlifyFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNetlifyUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNetlifyStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNetlifyRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedNetlifyRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathNetlifyRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
createNetlifyFetch(manifest, netlifyFetchOptions);
createNetlifyEdgeFunction(manifest, netlifyFetchOptions);
createRuntimeSubpathNetlifyFetch(manifest, runtimeSubpathNetlifyFetchOptions);
createRuntimeSubpathNetlifyEdgeFunction(
  manifest,
  runtimeSubpathNetlifyFetchOptions
);
netlifyFetch(new Request('https://example.com/rpc'));
runtimeSubpathNetlifyFetch(new Request('https://example.com/rpc'));
defaultNetlifyFetch(new Request('https://example.com/rpc'));
typedAppNetlifyFetch(appFetchRequest);
runtimeSubpathTypedAppNetlifyFetch(appFetchRequest);
hookTypedNetlifyFetch(hookAppRequest);
directHookTypedNetlifyFetch(hookAppRequest);
netlifyEdgeFunction(new Request('https://example.com/rpc'), {});
runtimeSubpathNetlifyEdgeFunction(new Request('https://example.com/rpc'), {});
defaultNetlifyEdgeFunction(new Request('https://example.com/rpc'), {});
typedNetlifyEdgeFunction(appFetchRequest, {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
hookTypedNetlifyEdgeFunction(hookAppRequest, {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
directHookTypedNetlifyEdgeFunction(hookAppRequest, {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
runtimeSubpathTypedNetlifyEdgeFunction(appFetchRequest, {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
new Response(`${netlifyEdgeUrlResult.pathname}:${runtimeSubpathNetlifyEdgeBypassResult}`);
// @ts-expect-error direct typed Netlify fetch factories infer custom hook request types.
directHookTypedNetlifyFetch(new Request('https://example.com/rpc'));
// @ts-expect-error direct typed Netlify edge factories infer custom hook request types.
directHookTypedNetlifyEdgeFunction(new Request('https://example.com/rpc'), {
  cookies: {
    get: (name) => name,
  },
  geo: {
    city: 'San Francisco',
  },
});
// @ts-expect-error service-dependent manifests require matching Netlify adapter plugins.
createNetlifyFetch(manifest);
// @ts-expect-error service-dependent manifests require matching typed Netlify fetch plugins.
createTypedNetlifyFetch(manifest);
// @ts-expect-error service-dependent manifests require matching Netlify edge plugins.
createNetlifyEdgeFunction(manifest);
// @ts-expect-error service-dependent manifests require matching typed Netlify edge plugins.
createTypedNetlifyEdgeFunction(manifest);
const vercelFetch = createVercelFetch(manifest, handlerOptions);
const typedVercelFetch: VercelFetchHandler = vercelFetch;
const runtimeSubpathVercelFetch: RuntimeSubpathVercelFetchHandler =
  typedVercelFetch;
const createTypedVercelFetch = createVercelFetchFor<AppFetchRequest>();
const typedAppVercelFetch: VercelFetchHandler<AppFetchRequest> =
  createTypedVercelFetch(manifest, handlerOptions);
const createDefaultVercelFetch = createVercelFetchFor();
const defaultVercelFetch: VercelFetchHandler = createDefaultVercelFetch(
  manifest,
  handlerOptions
);
const hookTypedVercelFetch =
  createVercelFetchFor<HookAppRequest>()(manifest, typedRequestHandlerOptions);
const directHookTypedVercelFetch: VercelFetchHandler<HookAppRequest> =
  createVercelFetch(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedVercelFetch =
  createRuntimeSubpathVercelFetchFor<AppFetchRequest>();
const runtimeSubpathTypedAppVercelFetch: RuntimeSubpathVercelFetchHandler<AppFetchRequest> =
  createRuntimeSubpathTypedVercelFetch(manifest, handlerOptions);
const vercelFunction: VercelFunction = createVercelFunction(
  manifest,
  handlerOptions
);
const runtimeSubpathVercelFunction: RuntimeSubpathVercelFunction =
  createRuntimeSubpathVercelFunction(manifest, handlerOptions);
const createTypedVercelFunction = createVercelFunctionFor<AppFetchRequest>();
const typedVercelFunction: VercelFunction<AppFetchRequest> =
  createTypedVercelFunction(manifest, handlerOptions);
const createDefaultVercelFunction = createVercelFunctionFor();
const defaultVercelFunction: VercelFunction = createDefaultVercelFunction(
  manifest,
  handlerOptions
);
const hookTypedVercelFunction =
  createVercelFunctionFor<HookAppRequest>()(
    manifest,
    typedRequestHandlerOptions
  );
const directHookTypedVercelFunction: VercelFunction<HookAppRequest> =
  createVercelFunction(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedVercelFunction =
  createRuntimeSubpathVercelFunctionFor<AppFetchRequest>();
const runtimeSubpathTypedVercelFunction: RuntimeSubpathVercelFunction<AppFetchRequest> =
  createRuntimeSubpathTypedVercelFunction(manifest, handlerOptions);
const vercelFetchOptions: VercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const vercelRouteUnaryFetchOptions: VercelRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const vercelUnaryRouteFetchOptions: VercelUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteUnaryFetchOptions;
const vercelRouteStreamFetchOptions: VercelRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const vercelStreamRouteFetchOptions: VercelStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteStreamFetchOptions;
const exactVercelFetchOptions: VercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const requestTypedVercelFetchOptions: VercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedVercelRouteUnaryFetchOptions: VercelRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedVercelFetchOptions;
const runtimeSubpathVercelFetchOptions: RuntimeSubpathVercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelFetchOptions;
const runtimeSubpathVercelUnaryRouteFetchOptions: RuntimeSubpathVercelUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelUnaryRouteFetchOptions;
const runtimeSubpathVercelStreamRouteFetchOptions: RuntimeSubpathVercelStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelStreamRouteFetchOptions;
const runtimeSubpathVercelRouteUnaryFetchOptions: RuntimeSubpathVercelRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteUnaryFetchOptions;
const runtimeSubpathVercelRouteStreamFetchOptions: RuntimeSubpathVercelRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteStreamFetchOptions;
const exactRuntimeSubpathVercelFetchOptions: RuntimeSubpathVercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactVercelFetchOptions;
runtimeSubpathVercelUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathVercelStreamRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathVercelRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathVercelRouteStreamFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
exactRuntimeSubpathVercelFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedVercelFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedVercelRouteUnaryFetchOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
const vercelFetchOptionsArgs: VercelFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelFetchOptions];
const vercelRouteUnaryFetchOptionsArgs: VercelRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelRouteUnaryFetchOptions];
const requestTypedVercelRouteUnaryFetchOptionsArgs: VercelRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedVercelRouteUnaryFetchOptions];
const vercelUnaryRouteFetchOptionsArgs: VercelUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteUnaryFetchOptionsArgs;
const vercelRouteStreamFetchOptionsArgs: VercelRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelRouteStreamFetchOptions];
const vercelStreamRouteFetchOptionsArgs: VercelStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteStreamFetchOptionsArgs;
const runtimeSubpathVercelFetchOptionsArgs: RuntimeSubpathVercelFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelFetchOptionsArgs;
const runtimeSubpathVercelUnaryRouteFetchOptionsArgs: RuntimeSubpathVercelUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelUnaryRouteFetchOptionsArgs;
const runtimeSubpathVercelStreamRouteFetchOptionsArgs: RuntimeSubpathVercelStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelStreamRouteFetchOptionsArgs;
const runtimeSubpathVercelRouteUnaryFetchOptionsArgs: RuntimeSubpathVercelRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteUnaryFetchOptionsArgs;
const runtimeSubpathVercelRouteStreamFetchOptionsArgs: RuntimeSubpathVercelRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelRouteStreamFetchOptionsArgs;
runtimeSubpathVercelFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathVercelUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathVercelStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathVercelRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
requestTypedVercelRouteUnaryFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathVercelRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
createVercelFetch(manifest, vercelFetchOptions);
createVercelFunction(manifest, vercelFetchOptions);
createRuntimeSubpathVercelFetch(manifest, runtimeSubpathVercelFetchOptions);
createRuntimeSubpathVercelFunction(
  manifest,
  runtimeSubpathVercelFetchOptions
);
vercelFetch(new Request('https://example.com/rpc'));
runtimeSubpathVercelFetch(new Request('https://example.com/rpc'));
defaultVercelFetch(new Request('https://example.com/rpc'));
typedAppVercelFetch(appFetchRequest);
runtimeSubpathTypedAppVercelFetch(appFetchRequest);
hookTypedVercelFetch(hookAppRequest);
directHookTypedVercelFetch(hookAppRequest);
vercelFunction.fetch(new Request('https://example.com/rpc'));
runtimeSubpathVercelFunction.fetch(new Request('https://example.com/rpc'));
defaultVercelFunction.fetch(new Request('https://example.com/rpc'));
typedVercelFunction.fetch(appFetchRequest);
runtimeSubpathTypedVercelFunction.fetch(appFetchRequest);
hookTypedVercelFunction.fetch(hookAppRequest);
directHookTypedVercelFunction.fetch(hookAppRequest);
// @ts-expect-error Vercel function fetch handlers are readonly.
vercelFunction.fetch = vercelFetch;
// @ts-expect-error Vercel function fetch handlers are readonly across subpath exports.
runtimeSubpathVercelFunction.fetch = runtimeSubpathVercelFetch;
// @ts-expect-error request-typed Vercel functions are not assignable to plain functions.
const _wrongVercelFunction: VercelFunction = hookTypedVercelFunction;
// @ts-expect-error direct typed Vercel fetch factories infer custom hook request types.
directHookTypedVercelFetch(new Request('https://example.com/rpc'));
// @ts-expect-error direct typed Vercel functions infer custom hook request types.
directHookTypedVercelFunction.fetch(new Request('https://example.com/rpc'));
// @ts-expect-error service-dependent manifests require matching Vercel adapter plugins.
createVercelFetch(manifest);
// @ts-expect-error service-dependent manifests require matching typed Vercel fetch plugins.
createTypedVercelFetch(manifest);
// @ts-expect-error service-dependent manifests require matching Vercel function plugins.
createVercelFunction(manifest);
// @ts-expect-error service-dependent manifests require matching typed Vercel function plugins.
createTypedVercelFunction(manifest);
const expressHandlerOptions: ExpressHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = {
  ...handlerOptions,
  hostname: '127.0.0.1',
  useOriginalUrl: true,
};
const expressHandlerOptionsBase: ExpressHandlerOptions<
  readonly [typeof usersPlugin]
> = expressHandlerOptions;
const exactExpressHandlerOptions: ExpressHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  ...exactServiceAwareHandlerOptions,
  hostname: '127.0.0.1',
};
const exactExpressHandlerOptionsBody: HandlerOptionsBody<
  typeof exactExpressHandlerOptions
> = manifestRouteRequest;
exactExpressHandlerOptionsBody.input.id.toUpperCase();
const runtimeSubpathExpressHandlerOptions: RuntimeSubpathExpressHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressHandlerOptions;
const expressRouteUnaryHandlerOptions: ExpressRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressHandlerOptions;
const expressUnaryRouteHandlerOptions: ExpressUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressRouteUnaryHandlerOptions;
const expressRouteStreamHandlerOptions: ExpressRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressHandlerOptions;
const expressStreamRouteHandlerOptions: ExpressStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressRouteStreamHandlerOptions;
expressHandlerOptionsBase.plugins?.[0]?.name.toUpperCase();
// @ts-expect-error Express adapter hostnames are readonly.
expressHandlerOptionsBase.hostname = 'localhost';
// @ts-expect-error Express adapter URL mode is readonly.
expressHandlerOptionsBase.useOriginalUrl = false;
runtimeSubpathExpressHandlerOptions.plugins?.[0]?.name.toUpperCase();
exactExpressHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactExpressHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Express options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
const requestTypedExpressHandlerOptions: ExpressHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = { ...typedRequestHandlerOptions, hostname: '127.0.0.1' };
const requestTypedExpressHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedExpressHandlerOptions
> = hookAppRequest;
requestTypedExpressHandlerOptionsRequest.requestId.toUpperCase();
const runtimeSubpathRequestTypedExpressHandlerOptions: RuntimeSubpathExpressHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedExpressHandlerOptions;
requestTypedExpressHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedExpressHandlerOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Express options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedExpressHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
expressUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
expressStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const expressHandlerOptionsArgs: ExpressHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [expressHandlerOptions];
// @ts-expect-error adapter handler option args are readonly tuples.
expressHandlerOptionsArgs[0] = expressHandlerOptions;
const exactExpressHandlerOptionsArgs: ExpressHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = [exactExpressHandlerOptions];
const requestTypedExpressHandlerOptionsArgs: ExpressHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedExpressHandlerOptions];
const expressRouteUnaryHandlerOptionsArgs: ExpressRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressHandlerOptionsArgs;
const requestTypedExpressRouteUnaryHandlerOptionsArgs: ExpressRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedExpressHandlerOptionsArgs;
const expressUnaryRouteHandlerOptionsArgs: ExpressUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressRouteUnaryHandlerOptionsArgs;
const expressRouteStreamHandlerOptionsArgs: ExpressRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressHandlerOptionsArgs;
const expressStreamRouteHandlerOptionsArgs: ExpressStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = expressRouteStreamHandlerOptionsArgs;
expressUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
exactExpressHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedExpressRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
expressStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const expressHandler: ExpressRequestHandler = createExpressHandler(
  manifest,
  expressHandlerOptions
);
createExpressHandler(manifest, requestTypedExpressHandlerOptions);
const runtimeSubpathExpressHandler: RuntimeSubpathExpressRequestHandler =
  createRuntimeSubpathExpressHandler(
    manifest,
    runtimeSubpathExpressHandlerOptions
  );
const expressNext: ExpressNextFunction = (_error?: unknown) => undefined;
expressHandler.valueOf();
runtimeSubpathExpressHandler.valueOf();
expressNext();
const expressRequest = {} as ExpressRequest;
const expressResponse = {} as ExpressResponse;
expressRequest.originalUrl = '/rpc';
expressResponse.statusCode.toFixed();
interface ExpressAppRequest extends ExpressRequest {
  user: {
    id: string;
  };
}
interface ExpressAppResponse extends ExpressResponse<ExpressAppRequest> {
  locals: {
    requestId: string;
  };
}
interface ExpressMismatchedResponse extends ExpressResponse {
  locals: {
    requestId: string;
  };
}
interface ExpressAppNext extends ExpressNextFunction {
  traceId?: string;
}
const createTypedExpressHandler = createExpressHandlerFor<
  ExpressAppRequest,
  ExpressAppResponse,
  ExpressAppNext
>();
const typedExpressHandler: ExpressRequestHandler<
  ExpressAppRequest,
  ExpressAppResponse,
  ExpressAppNext
> = createTypedExpressHandler(manifest, expressHandlerOptions);
const createRuntimeSubpathTypedExpressHandler =
  createRuntimeSubpathExpressHandlerFor<
    RuntimeSubpathExpressRequest & ExpressAppRequest,
    RuntimeSubpathExpressResponse<ExpressAppRequest> & ExpressAppResponse,
    ExpressAppNext
  >();
const runtimeSubpathTypedExpressHandler: RuntimeSubpathExpressRequestHandler<
  RuntimeSubpathExpressRequest & ExpressAppRequest,
  RuntimeSubpathExpressResponse<ExpressAppRequest> & ExpressAppResponse,
  ExpressAppNext
> = createRuntimeSubpathTypedExpressHandler(
  manifest,
  runtimeSubpathExpressHandlerOptions
);
const expressAppRequest = {} as ExpressAppRequest;
const expressAppResponse = {} as ExpressAppResponse;
expressAppRequest.user.id.toUpperCase();
expressAppResponse.locals.requestId.toUpperCase();
// @ts-expect-error request-typed Express responses are not assignable to plain responses.
const _wrongExpressAppResponse: ExpressResponse = expressAppResponse;
typedExpressHandler(expressAppRequest, expressAppResponse, expressNext);
runtimeSubpathTypedExpressHandler(
  expressAppRequest,
  expressAppResponse,
  expressNext
);
// @ts-expect-error typed Express handlers preserve the response's request type.
createExpressHandlerFor<ExpressAppRequest, ExpressMismatchedResponse>();
// @ts-expect-error service-dependent manifests require matching Express adapter plugins.
createExpressHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Express adapter plugins.
createTypedExpressHandler(manifest);
const elysiaHandlerOptions: ElysiaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathElysiaHandlerOptions: RuntimeSubpathElysiaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaHandlerOptions;
const requestTypedElysiaHandlerOptions: ElysiaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const runtimeSubpathRequestTypedElysiaHandlerOptions: RuntimeSubpathElysiaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedElysiaHandlerOptions;
const elysiaRouteUnaryHandlerOptions: ElysiaRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaHandlerOptions;
const elysiaUnaryRouteHandlerOptions: ElysiaUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaRouteUnaryHandlerOptions;
const elysiaRouteStreamHandlerOptions: ElysiaRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaHandlerOptions;
const elysiaStreamRouteHandlerOptions: ElysiaStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaRouteStreamHandlerOptions;
runtimeSubpathElysiaHandlerOptions.plugins?.[0]?.name.toUpperCase();
requestTypedElysiaHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedElysiaHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
elysiaUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
elysiaStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const elysiaHandlerOptionsArgs: ElysiaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [elysiaHandlerOptions];
const elysiaRouteUnaryHandlerOptionsArgs: ElysiaRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaHandlerOptionsArgs;
const elysiaUnaryRouteHandlerOptionsArgs: ElysiaUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaRouteUnaryHandlerOptionsArgs;
const elysiaRouteStreamHandlerOptionsArgs: ElysiaRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaHandlerOptionsArgs;
const elysiaStreamRouteHandlerOptionsArgs: ElysiaStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = elysiaRouteStreamHandlerOptionsArgs;
elysiaUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
elysiaStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const elysiaHandler: ElysiaHandler = createElysiaHandler(
  manifest,
  elysiaHandlerOptions
);
const syncElysiaHandler: ElysiaHandler = () => new Response();
const runtimeSubpathElysiaHandler: RuntimeSubpathElysiaHandler =
  createRuntimeSubpathElysiaHandler(
    manifest,
    runtimeSubpathElysiaHandlerOptions
  );
const runtimeSubpathSyncElysiaHandler: RuntimeSubpathElysiaHandler =
  syncElysiaHandler;
const elysiaContext: ElysiaContext = {
  request: new Request('https://example.com/rpc'),
};
interface ElysiaAppContext extends ElysiaContext {
  store: {
    requestId: string;
  };
}
interface ElysiaHookContext extends ElysiaContext<HookAppRequest> {
  store: {
    requestId: string;
  };
}
const createTypedElysiaHandler = createElysiaHandlerFor<ElysiaAppContext>();
const typedElysiaHandler: ElysiaHandler<ElysiaAppContext> =
  createTypedElysiaHandler(manifest, elysiaHandlerOptions);
const hookTypedElysiaHandler =
  createElysiaHandlerFor<ElysiaHookContext>()(
    manifest,
    typedRequestHandlerOptions
  );
const directHookTypedElysiaHandler: ElysiaHandler<
  ElysiaContext<HookAppRequest>
> = createElysiaHandler(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedElysiaHandler =
  createRuntimeSubpathElysiaHandlerFor<
    RuntimeSubpathElysiaContext & ElysiaAppContext
  >();
const runtimeSubpathTypedElysiaHandler: RuntimeSubpathElysiaHandler<
  RuntimeSubpathElysiaContext & ElysiaAppContext
> = createRuntimeSubpathTypedElysiaHandler(
  manifest,
  runtimeSubpathElysiaHandlerOptions
);
const elysiaAppContext: ElysiaAppContext = {
  request: new Request('https://example.com/rpc'),
  store: { requestId: 'req_1' },
};
const elysiaHookContext: ElysiaHookContext = {
  __requestType: (request: HookAppRequest) => request,
  request: hookAppRequest,
  store: { requestId: 'req_1' },
};
// @ts-expect-error Elysia context requests are readonly.
elysiaContext.request = new Request('https://example.com/other');
// @ts-expect-error request-typed Elysia context markers are readonly.
elysiaHookContext.__requestType = (request: HookAppRequest) => request;
// @ts-expect-error request-typed Elysia contexts are not assignable to plain request contexts.
const _wrongElysiaHookContext: ElysiaContext<Request> = elysiaHookContext;
elysiaHandler(elysiaContext);
runtimeSubpathElysiaHandler(elysiaContext);
runtimeSubpathSyncElysiaHandler(elysiaContext);
typedElysiaHandler(elysiaAppContext);
runtimeSubpathTypedElysiaHandler(elysiaAppContext);
hookTypedElysiaHandler(elysiaHookContext);
directHookTypedElysiaHandler(elysiaHookContext);
// @ts-expect-error direct typed Elysia handlers infer custom hook request context types.
directHookTypedElysiaHandler(elysiaContext);
// @ts-expect-error typed Elysia handlers preserve hook request context types.
hookTypedElysiaHandler(elysiaContext);
// @ts-expect-error service-dependent manifests require matching Elysia adapter plugins.
createElysiaHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Elysia adapter plugins.
createTypedElysiaHandler(manifest);
const fastifyHandlerOptionsBase: FastifyHandlerOptions = { hostname: 'app' };
// @ts-expect-error Fastify adapter URL mode is readonly.
fastifyHandlerOptionsBase.useOriginalUrl = false;
// @ts-expect-error Fastify adapter hostnames are readonly.
fastifyHandlerOptionsBase.hostname = 'localhost';
const fastifyHandlerOptions: FastifyHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = { ...handlerOptions, hostname: 'app' };
const exactFastifyHandlerOptions: FastifyHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  ...exactServiceAwareHandlerOptions,
  hostname: 'app',
};
const exactFastifyHandlerOptionsBody: HandlerOptionsBody<
  typeof exactFastifyHandlerOptions
> = manifestRouteRequest;
exactFastifyHandlerOptionsBody.input.id.toUpperCase();
const runtimeSubpathFastifyHandlerOptions: RuntimeSubpathFastifyHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyHandlerOptions;
const fastifyRouteUnaryHandlerOptions: FastifyRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyHandlerOptions;
const fastifyUnaryRouteHandlerOptions: FastifyUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyRouteUnaryHandlerOptions;
const fastifyRouteStreamHandlerOptions: FastifyRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyHandlerOptions;
const fastifyStreamRouteHandlerOptions: FastifyStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyRouteStreamHandlerOptions;
runtimeSubpathFastifyHandlerOptions.plugins?.[0]?.name.toUpperCase();
exactFastifyHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactFastifyHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Fastify options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
const requestTypedFastifyHandlerOptions: FastifyHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = { ...typedRequestHandlerOptions, hostname: 'app' };
const requestTypedFastifyHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedFastifyHandlerOptions
> = hookAppRequest;
requestTypedFastifyHandlerOptionsRequest.requestId.toUpperCase();
const runtimeSubpathRequestTypedFastifyHandlerOptions: RuntimeSubpathFastifyHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedFastifyHandlerOptions;
requestTypedFastifyHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedFastifyHandlerOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Fastify options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedFastifyHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
fastifyUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
fastifyStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const fastifyHandlerOptionsArgs: FastifyHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [fastifyHandlerOptions];
const exactFastifyHandlerOptionsArgs: FastifyHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = [exactFastifyHandlerOptions];
const requestTypedFastifyHandlerOptionsArgs: FastifyHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedFastifyHandlerOptions];
const fastifyRouteUnaryHandlerOptionsArgs: FastifyRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyHandlerOptionsArgs;
const requestTypedFastifyRouteUnaryHandlerOptionsArgs: FastifyRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedFastifyHandlerOptionsArgs;
const fastifyUnaryRouteHandlerOptionsArgs: FastifyUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyRouteUnaryHandlerOptionsArgs;
const fastifyRouteStreamHandlerOptionsArgs: FastifyRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyHandlerOptionsArgs;
const fastifyStreamRouteHandlerOptionsArgs: FastifyStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = fastifyRouteStreamHandlerOptionsArgs;
fastifyUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
exactFastifyHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedFastifyRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
fastifyStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const fastifyHandler: FastifyHandler = createFastifyHandler(
  manifest,
  fastifyHandlerOptions
);
createFastifyHandler(manifest, requestTypedFastifyHandlerOptions);
const syncFastifyHandler: FastifyHandler = () => undefined;
const runtimeSubpathFastifyHandler: RuntimeSubpathFastifyHandler =
  createRuntimeSubpathFastifyHandler(
    manifest,
    runtimeSubpathFastifyHandlerOptions
  );
const runtimeSubpathSyncFastifyHandler: RuntimeSubpathFastifyHandler =
  syncFastifyHandler;
const fastifyRequest = {} as FastifyRequest;
const fastifyReply = {} as FastifyReply;
fastifyRequest.body;
fastifyRequest.originalUrl = '/rpc';
fastifyReply.raw.statusCode.toFixed();
interface FastifyAppBody {
  id: string;
}
interface FastifyAppIncoming extends IncomingMessage {
  requestId: string;
}
interface FastifyAppRequest
  extends FastifyRequest<FastifyAppBody, FastifyAppIncoming> {
  params: {
    id: string;
  };
}
interface FastifyAppReply extends FastifyReply<FastifyAppIncoming> {
  locals: {
    requestId: string;
  };
}
interface FastifyMismatchedReply extends FastifyReply {
  locals: {
    requestId: string;
  };
}
const createTypedFastifyHandler = createFastifyHandlerFor<
  FastifyAppRequest,
  FastifyAppReply
>();
const typedFastifyHandler: FastifyHandler<
  FastifyAppRequest,
  FastifyAppReply
> = createTypedFastifyHandler(manifest, fastifyHandlerOptions);
const createRuntimeSubpathTypedFastifyHandler =
  createRuntimeSubpathFastifyHandlerFor<
    RuntimeSubpathFastifyRequest<FastifyAppBody, FastifyAppIncoming> &
      FastifyAppRequest,
    RuntimeSubpathFastifyReply<FastifyAppIncoming> & FastifyAppReply
  >();
const runtimeSubpathTypedFastifyHandler: RuntimeSubpathFastifyHandler<
  RuntimeSubpathFastifyRequest<FastifyAppBody, FastifyAppIncoming> &
    FastifyAppRequest,
  RuntimeSubpathFastifyReply<FastifyAppIncoming> & FastifyAppReply
> = createRuntimeSubpathTypedFastifyHandler(
  manifest,
  runtimeSubpathFastifyHandlerOptions
);
const fastifyAppRequest = {} as FastifyAppRequest;
const fastifyAppReply = {} as FastifyAppReply;
fastifyAppRequest.body?.id.toUpperCase();
fastifyAppRequest.raw?.requestId.toUpperCase();
fastifyAppRequest.params.id.toUpperCase();
fastifyAppReply.locals.requestId.toUpperCase();
// @ts-expect-error typed Fastify requests are not assignable to plain requests.
const _wrongFastifyAppRequest: FastifyRequest = fastifyAppRequest;
// @ts-expect-error typed Fastify replies are not assignable to plain replies.
const _wrongFastifyAppReply: FastifyReply = fastifyAppReply;
fastifyHandler(fastifyRequest, fastifyReply);
syncFastifyHandler(fastifyRequest, fastifyReply);
runtimeSubpathFastifyHandler(fastifyRequest, fastifyReply);
runtimeSubpathSyncFastifyHandler(fastifyRequest, fastifyReply);
typedFastifyHandler(fastifyAppRequest, fastifyAppReply);
runtimeSubpathTypedFastifyHandler(fastifyAppRequest, fastifyAppReply);
// @ts-expect-error typed Fastify handlers preserve the reply's incoming message type.
createFastifyHandlerFor<FastifyAppRequest, FastifyMismatchedReply>();
// @ts-expect-error service-dependent manifests require matching Fastify adapter plugins.
createFastifyHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Fastify adapter plugins.
createTypedFastifyHandler(manifest);
const koaHandlerOptionsBase: KoaHandlerOptions = { hostname: 'app' };
// @ts-expect-error Koa adapter URL mode is readonly.
koaHandlerOptionsBase.useOriginalUrl = false;
// @ts-expect-error Koa adapter hostnames are readonly.
koaHandlerOptionsBase.hostname = 'localhost';
const koaHandlerOptions: KoaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = { ...handlerOptions, hostname: 'app' };
const exactKoaHandlerOptions: KoaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = {
  ...exactServiceAwareHandlerOptions,
  hostname: 'app',
};
const exactKoaHandlerOptionsBody: HandlerOptionsBody<
  typeof exactKoaHandlerOptions
> = manifestRouteRequest;
exactKoaHandlerOptionsBody.input.id.toUpperCase();
const runtimeSubpathKoaHandlerOptions: RuntimeSubpathKoaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaHandlerOptions;
const koaRouteUnaryHandlerOptions: KoaRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaHandlerOptions;
const koaUnaryRouteHandlerOptions: KoaUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaRouteUnaryHandlerOptions;
const koaRouteStreamHandlerOptions: KoaRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaHandlerOptions;
const koaStreamRouteHandlerOptions: KoaStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaRouteStreamHandlerOptions;
runtimeSubpathKoaHandlerOptions.plugins?.[0]?.name.toUpperCase();
exactKoaHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactKoaHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Koa options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
const requestTypedKoaHandlerOptions: KoaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = { ...typedRequestHandlerOptions, hostname: 'app' };
const requestTypedKoaHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedKoaHandlerOptions
> = hookAppRequest;
requestTypedKoaHandlerOptionsRequest.requestId.toUpperCase();
const runtimeSubpathRequestTypedKoaHandlerOptions: RuntimeSubpathKoaHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedKoaHandlerOptions;
requestTypedKoaHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedKoaHandlerOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Koa options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedKoaHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
koaUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
koaStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const koaHandlerOptionsArgs: KoaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [koaHandlerOptions];
const exactKoaHandlerOptionsArgs: KoaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = [exactKoaHandlerOptions];
const requestTypedKoaHandlerOptionsArgs: KoaHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedKoaHandlerOptions];
const koaRouteUnaryHandlerOptionsArgs: KoaRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaHandlerOptionsArgs;
const requestTypedKoaRouteUnaryHandlerOptionsArgs: KoaRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedKoaHandlerOptionsArgs;
const koaUnaryRouteHandlerOptionsArgs: KoaUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaRouteUnaryHandlerOptionsArgs;
const koaRouteStreamHandlerOptionsArgs: KoaRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaHandlerOptionsArgs;
const koaStreamRouteHandlerOptionsArgs: KoaStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = koaRouteStreamHandlerOptionsArgs;
koaUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
exactKoaHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedKoaRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
koaStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const koaMiddleware: KoaMiddleware = createKoaHandler(
  manifest,
  koaHandlerOptions
);
createKoaHandler(manifest, requestTypedKoaHandlerOptions);
const syncKoaMiddleware: KoaMiddleware = () => undefined;
const runtimeSubpathKoaMiddleware: RuntimeSubpathKoaMiddleware =
  createRuntimeSubpathKoaHandler(manifest, runtimeSubpathKoaHandlerOptions);
const runtimeSubpathSyncKoaMiddleware: RuntimeSubpathKoaMiddleware =
  syncKoaMiddleware;
const koaContext = {} as KoaContext;
koaContext.originalUrl = '/rpc';
koaContext.respond = false;
const koaNext: KoaNext = async () => undefined;
const syncKoaNext: KoaNext = () => undefined;
interface KoaAppRequest extends IncomingMessage {
  userId: string;
}
interface KoaAppResponse extends ServerResponse<KoaAppRequest> {
  locals: {
    requestId: string;
  };
}
interface KoaMismatchedResponse extends ServerResponse<IncomingMessage> {
  locals: {
    requestId: string;
  };
}
interface KoaAppContext extends KoaContext<KoaAppRequest, KoaAppResponse> {
  state: {
    userId: string;
  };
}
type KoaAppNext = () => Promise<'ok'>;
const createTypedKoaHandler = createKoaHandlerFor<
  KoaAppContext,
  KoaAppNext
>();
const typedKoaMiddleware: KoaMiddleware<KoaAppContext, KoaAppNext> =
  createTypedKoaHandler(manifest, koaHandlerOptions);
const createRuntimeSubpathTypedKoaHandler =
  createRuntimeSubpathKoaHandlerFor<
    RuntimeSubpathKoaContext<KoaAppRequest, KoaAppResponse> & KoaAppContext,
    RuntimeSubpathKoaNext & KoaAppNext
  >();
const runtimeSubpathTypedKoaMiddleware: RuntimeSubpathKoaMiddleware<
  RuntimeSubpathKoaContext<KoaAppRequest, KoaAppResponse> & KoaAppContext,
  RuntimeSubpathKoaNext & KoaAppNext
> = createRuntimeSubpathTypedKoaHandler(
  manifest,
  runtimeSubpathKoaHandlerOptions
);
const koaAppContext = {} as KoaAppContext;
const koaAppNext: KoaAppNext = async () => 'ok';
koaAppContext.state.userId.toUpperCase();
koaAppContext.req.userId.toUpperCase();
koaAppContext.res.locals.requestId.toUpperCase();
// @ts-expect-error request-typed Koa contexts are not assignable to plain request contexts.
const _wrongKoaAppContext: KoaContext = koaAppContext;
koaMiddleware(koaContext, koaNext);
syncKoaMiddleware(koaContext, syncKoaNext);
runtimeSubpathKoaMiddleware(koaContext, koaNext);
runtimeSubpathSyncKoaMiddleware(koaContext, syncKoaNext);
typedKoaMiddleware(koaAppContext, koaAppNext);
runtimeSubpathTypedKoaMiddleware(koaAppContext, koaAppNext);
const _koaMismatchedContext =
  // @ts-expect-error typed Koa contexts preserve the response's request type.
  {} as KoaContext<KoaAppRequest, KoaMismatchedResponse>;
// @ts-expect-error service-dependent manifests require matching Koa adapter plugins.
createKoaHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Koa adapter plugins.
createTypedKoaHandler(manifest);
const honoHandlerOptions: HonoHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const runtimeSubpathHonoHandlerOptions: RuntimeSubpathHonoHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoHandlerOptions;
const requestTypedHonoHandlerOptions: HonoHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const runtimeSubpathRequestTypedHonoHandlerOptions: RuntimeSubpathHonoHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedHonoHandlerOptions;
const honoRouteUnaryHandlerOptions: HonoRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoHandlerOptions;
const honoUnaryRouteHandlerOptions: HonoUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoRouteUnaryHandlerOptions;
const honoRouteStreamHandlerOptions: HonoRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoHandlerOptions;
const honoStreamRouteHandlerOptions: HonoStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoRouteStreamHandlerOptions;
runtimeSubpathHonoHandlerOptions.plugins?.[0]?.name.toUpperCase();
requestTypedHonoHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedHonoHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
honoUnaryRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
honoStreamRouteHandlerOptions.plugins?.[0]?.name.toUpperCase();
const honoHandlerOptionsArgs: HonoHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [honoHandlerOptions];
const honoRouteUnaryHandlerOptionsArgs: HonoRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoHandlerOptionsArgs;
const honoUnaryRouteHandlerOptionsArgs: HonoUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoRouteUnaryHandlerOptionsArgs;
const honoRouteStreamHandlerOptionsArgs: HonoRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoHandlerOptionsArgs;
const honoStreamRouteHandlerOptionsArgs: HonoStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = honoRouteStreamHandlerOptionsArgs;
honoUnaryRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
honoStreamRouteHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
const honoHandler: HonoHandler = createHonoHandler(
  manifest,
  honoHandlerOptions
);
const syncHonoHandler: HonoHandler = () => new Response();
const runtimeSubpathHonoHandler: RuntimeSubpathHonoHandler =
  createRuntimeSubpathHonoHandler(manifest, runtimeSubpathHonoHandlerOptions);
const runtimeSubpathSyncHonoHandler: RuntimeSubpathHonoHandler =
  syncHonoHandler;
const honoContext: HonoContext = {
  req: { raw: new Request('https://example.com/rpc') },
};
interface HonoAppContext extends HonoContext {
  env: {
    requestId: string;
  };
  get(name: 'requestId'): string;
}
interface HonoHookContext extends HonoContext<HookAppRequest> {
  env: {
    requestId: string;
  };
  get(name: 'requestId'): string;
}
const createTypedHonoHandler = createHonoHandlerFor<HonoAppContext>();
const typedHonoHandler: HonoHandler<HonoAppContext> = createTypedHonoHandler(
  manifest,
  honoHandlerOptions
);
const hookTypedHonoHandler =
  createHonoHandlerFor<HonoHookContext>()(manifest, typedRequestHandlerOptions);
const directHookTypedHonoHandler: HonoHandler<HonoContext<HookAppRequest>> =
  createHonoHandler(manifest, typedRequestHandlerOptions);
const createRuntimeSubpathTypedHonoHandler =
  createRuntimeSubpathHonoHandlerFor<
    RuntimeSubpathHonoContext & HonoAppContext
  >();
const runtimeSubpathTypedHonoHandler: RuntimeSubpathHonoHandler<
  RuntimeSubpathHonoContext & HonoAppContext
> = createRuntimeSubpathTypedHonoHandler(
  manifest,
  runtimeSubpathHonoHandlerOptions
);
const honoAppContext: HonoAppContext = {
  req: { raw: new Request('https://example.com/rpc') },
  env: { requestId: 'req_1' },
  get: (name) => name,
};
const honoHookContext: HonoHookContext = {
  __requestType: (request: HookAppRequest) => request,
  req: { raw: hookAppRequest },
  env: { requestId: 'req_1' },
  get: (name) => name,
};
// @ts-expect-error Hono request containers are readonly.
honoContext.req = { raw: new Request('https://example.com/other') };
// @ts-expect-error Hono raw requests are readonly.
honoHookContext.req.raw = hookAppRequest;
// @ts-expect-error request-typed Hono context markers are readonly.
honoHookContext.__requestType = (request: HookAppRequest) => request;
// @ts-expect-error request-typed Hono contexts are not assignable to plain request contexts.
const _wrongHonoHookContext: HonoContext<Request> = honoHookContext;
honoHandler(honoContext);
runtimeSubpathHonoHandler(honoContext);
runtimeSubpathSyncHonoHandler(honoContext);
typedHonoHandler(honoAppContext);
runtimeSubpathTypedHonoHandler(honoAppContext);
hookTypedHonoHandler(honoHookContext);
directHookTypedHonoHandler(honoHookContext);
// @ts-expect-error direct typed Hono handlers infer custom hook request context types.
directHookTypedHonoHandler(honoContext);
// @ts-expect-error typed Hono handlers preserve hook request context types.
hookTypedHonoHandler(honoContext);
// @ts-expect-error service-dependent manifests require matching Hono adapter plugins.
createHonoHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Hono adapter plugins.
createTypedHonoHandler(manifest);
const _nodeHandler = createNodeRpcRequestHandler(manifest, handlerOptions);
_nodeHandler;
const runtimeSubpathNodeRpcRequestHandler =
  createRuntimeSubpathNodeRpcRequestHandler(manifest, handlerOptions);
runtimeSubpathNodeRpcRequestHandler.length.toFixed();
const syncNodeRpcRequestHandler: NodeRpcRequestHandler = () => undefined;
const syncNodeTransportRequestHandler: NodeTransportRequestHandler =
  syncNodeRpcRequestHandler;
interface NodeAppRequest extends IncomingMessage {
  user: {
    id: string;
  };
}
interface NodeAppResponse extends ServerResponse<NodeAppRequest> {
  locals: {
    requestId: string;
  };
}
interface NodeMismatchedResponse extends ServerResponse<IncomingMessage> {
  locals: {
    requestId: string;
  };
}
const createTypedNodeRpcRequestHandler = createNodeRpcRequestHandlerFor<
  NodeAppRequest,
  NodeAppResponse
>();
const typedNodeRpcRequestHandler: NodeRpcRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createTypedNodeRpcRequestHandler(manifest, handlerOptions, '127.0.0.1');
const createRuntimeSubpathTypedNodeRpcRequestHandler =
  createRuntimeSubpathNodeRpcRequestHandlerFor<
    NodeAppRequest,
    NodeAppResponse
  >();
const runtimeSubpathTypedNodeRpcRequestHandler: RuntimeSubpathNodeRpcRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createRuntimeSubpathTypedNodeRpcRequestHandler(
  manifest,
  handlerOptions,
  '127.0.0.1'
);
const nodeAppRequest = {} as NodeAppRequest;
const nodeAppResponse = {} as NodeAppResponse;
nodeAppRequest.user.id.toUpperCase();
nodeAppResponse.locals.requestId.toUpperCase();
syncNodeRpcRequestHandler(
  {} as Parameters<NodeRpcRequestHandler>[0],
  {} as Parameters<NodeRpcRequestHandler>[1]
);
syncNodeTransportRequestHandler(
  {} as Parameters<NodeTransportRequestHandler>[0],
  {} as Parameters<NodeTransportRequestHandler>[1]
);
typedNodeRpcRequestHandler(nodeAppRequest, nodeAppResponse);
runtimeSubpathTypedNodeRpcRequestHandler(nodeAppRequest, nodeAppResponse);
// @ts-expect-error typed Node handlers preserve the response's incoming message type.
createNodeRpcRequestHandlerFor<NodeAppRequest, NodeMismatchedResponse>();
// @ts-expect-error service-dependent manifests require matching Node adapter plugins.
createNodeRpcRequestHandler(manifest);
// @ts-expect-error service-dependent manifests require matching typed Node adapter plugins.
createTypedNodeRpcRequestHandler(manifest);
const typedListenOptions: ListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const nodeListenOptionsBase: NodeListenOptions<readonly [typeof usersPlugin]> =
  typedListenOptions;
nodeListenOptionsBase.plugins?.[0]?.name.toUpperCase();
const nodeListenOptions: NodeListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = typedListenOptions;
const routeUnaryListenOptions: RouteUnaryListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const nodeRouteUnaryListenOptions: NodeRouteUnaryListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeUnaryListenOptions;
const unaryRouteListenOptions: UnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeUnaryListenOptions;
const nodeUnaryRouteListenOptions: NodeUnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryListenOptions;
const routeStreamListenOptions: RouteStreamListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const nodeRouteStreamListenOptions: NodeRouteStreamListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeStreamListenOptions;
const streamRouteListenOptions: StreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeStreamListenOptions;
const nodeStreamRouteListenOptions: NodeStreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamListenOptions;
const nodeRpcRequestHandlerOptions: NodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const requestTypedNodeRpcRequestHandlerOptions: NodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = typedRequestHandlerOptions;
const requestTypedNodeRpcRequestHandlerOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedNodeRpcRequestHandlerOptions
> = hookAppRequest;
requestTypedNodeRpcRequestHandlerOptionsRequest.requestId.toUpperCase();
const nodeRouteUnaryRpcRequestHandlerOptions: NodeRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const requestTypedNodeRouteUnaryRpcRequestHandlerOptions: NodeRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNodeRpcRequestHandlerOptions;
const nodeUnaryRouteRpcRequestHandlerOptions: NodeUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryRpcRequestHandlerOptions;
const nodeRouteStreamRpcRequestHandlerOptions: NodeRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const nodeStreamRouteRpcRequestHandlerOptions: NodeStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamRpcRequestHandlerOptions;
const runtimeSubpathUnaryRouteListenOptions: RuntimeSubpathUnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = unaryRouteListenOptions;
const runtimeSubpathStreamRouteListenOptions: RuntimeSubpathStreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = streamRouteListenOptions;
const runtimeSubpathRouteUnaryListenOptions: RuntimeSubpathRouteUnaryListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeUnaryListenOptions;
const runtimeSubpathRouteStreamListenOptions: RuntimeSubpathRouteStreamListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeStreamListenOptions;
const runtimeSubpathNodeListenOptionsBase: RuntimeSubpathNodeListenOptions<
  readonly [typeof usersPlugin]
> = nodeListenOptionsBase;
const runtimeSubpathNodeListenOptions: RuntimeSubpathNodeListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeListenOptions;
const runtimeSubpathNodeUnaryRouteListenOptions: RuntimeSubpathNodeUnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteListenOptions;
const runtimeSubpathNodeStreamRouteListenOptions: RuntimeSubpathNodeStreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteListenOptions;
const runtimeSubpathNodeRouteUnaryListenOptions: RuntimeSubpathNodeRouteUnaryListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryListenOptions;
const runtimeSubpathNodeRouteStreamListenOptions: RuntimeSubpathNodeRouteStreamListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamListenOptions;
const runtimeSubpathNodeRpcRequestHandlerOptions: RuntimeSubpathNodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRpcRequestHandlerOptions;
const runtimeSubpathRequestTypedNodeRpcRequestHandlerOptions: RuntimeSubpathNodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNodeRpcRequestHandlerOptions;
const runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathNodeStreamRouteRpcRequestHandlerOptions: RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteRpcRequestHandlerOptions;
const runtimeSubpathNodeRouteUnaryRpcRequestHandlerOptions: RuntimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryRpcRequestHandlerOptions;
const runtimeSubpathNodeRouteStreamRpcRequestHandlerOptions: RuntimeSubpathNodeRouteStreamRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamRpcRequestHandlerOptions;
const nodeRpcRequestHandlerOptionsArgs: NodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRpcRequestHandlerOptions, '127.0.0.1'];
// @ts-expect-error node handler option trailing args are readonly tuples.
nodeRpcRequestHandlerOptionsArgs[1] = 'localhost';
const requestTypedNodeRpcRequestHandlerOptionsArgs: NodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedNodeRpcRequestHandlerOptions, '127.0.0.1'];
const nodeRouteUnaryRpcRequestHandlerOptionsArgs: NodeRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRouteUnaryRpcRequestHandlerOptions];
const requestTypedNodeRouteUnaryRpcRequestHandlerOptionsArgs: NodeRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = [requestTypedNodeRouteUnaryRpcRequestHandlerOptions];
const nodeUnaryRouteRpcRequestHandlerOptionsArgs: NodeUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryRpcRequestHandlerOptionsArgs;
const nodeRouteStreamRpcRequestHandlerOptionsArgs: NodeRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRouteStreamRpcRequestHandlerOptions, 'localhost'];
const nodeStreamRouteRpcRequestHandlerOptionsArgs: NodeStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamRpcRequestHandlerOptionsArgs;
const listenOptionsArgs: ListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedListenOptions];
const nodeListenOptionsArgs: NodeListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeListenOptions];
const routeUnaryListenOptionsArgs: RouteUnaryListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [routeUnaryListenOptions];
const nodeRouteUnaryListenOptionsArgs: NodeRouteUnaryListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRouteUnaryListenOptions];
const unaryRouteListenOptionsArgs: UnaryRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeUnaryListenOptionsArgs;
const nodeUnaryRouteListenOptionsArgs: NodeUnaryRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryListenOptionsArgs;
const routeStreamListenOptionsArgs: RouteStreamListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [routeStreamListenOptions];
const nodeRouteStreamListenOptionsArgs: NodeRouteStreamListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRouteStreamListenOptions];
const streamRouteListenOptionsArgs: StreamRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeStreamListenOptionsArgs;
const nodeStreamRouteListenOptionsArgs: NodeStreamRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamListenOptionsArgs;
const runtimeSubpathNodeRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRpcRequestHandlerOptionsArgs;
const runtimeSubpathRequestTypedNodeRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedNodeRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeRouteStreamRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeRouteStreamRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamRpcRequestHandlerOptionsArgs;
const runtimeSubpathListenOptionsArgs: RuntimeSubpathListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = listenOptionsArgs;
const runtimeSubpathUnaryRouteListenOptionsArgs: RuntimeSubpathUnaryRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = unaryRouteListenOptionsArgs;
const runtimeSubpathStreamRouteListenOptionsArgs: RuntimeSubpathStreamRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = streamRouteListenOptionsArgs;
const runtimeSubpathRouteUnaryListenOptionsArgs: RuntimeSubpathRouteUnaryListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeUnaryListenOptionsArgs;
const runtimeSubpathRouteStreamListenOptionsArgs: RuntimeSubpathRouteStreamListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = routeStreamListenOptionsArgs;
const runtimeSubpathNodeListenOptionsArgs: RuntimeSubpathNodeListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeListenOptionsArgs;
const runtimeSubpathNodeUnaryRouteListenOptionsArgs: RuntimeSubpathNodeUnaryRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteListenOptionsArgs;
const runtimeSubpathNodeStreamRouteListenOptionsArgs: RuntimeSubpathNodeStreamRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteListenOptionsArgs;
const runtimeSubpathNodeRouteUnaryListenOptionsArgs: RuntimeSubpathNodeRouteUnaryListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteUnaryListenOptionsArgs;
const runtimeSubpathNodeRouteStreamListenOptionsArgs: RuntimeSubpathNodeRouteStreamListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRouteStreamListenOptionsArgs;
runtimeSubpathNodeRpcRequestHandlerOptionsArgs[1]?.toUpperCase();
runtimeSubpathNodeListenOptionsArgs[0]?.hostname?.toUpperCase();
runtimeSubpathNodeUnaryRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeRouteUnaryListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeRouteStreamListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeRouteStreamRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathRequestTypedNodeRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedNodeRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Node handler option args reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
requestTypedNodeRouteUnaryRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeRouteUnaryRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeRouteStreamRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathRequestTypedNodeRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
runtimeSubpathRequestTypedNodeRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Node handler options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
runtimeSubpathNodeRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNodeListenOptionsBase.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNodeListenOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathNodeUnaryRouteListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeRouteUnaryListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeRouteStreamListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathListenOptionsArgs[0]?.hostname?.toUpperCase();
runtimeSubpathUnaryRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStreamRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathRouteUnaryListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathRouteStreamListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathUnaryRouteListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStreamRouteListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathRouteUnaryListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathRouteStreamListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
const exactListenOptions: ListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const exactListenOptionsBody: HandlerOptionsBody<typeof exactListenOptions> =
  manifestRouteRequest;
exactListenOptionsBody.input.id.toUpperCase();
const requestTypedListenOptions: ListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = { ...typedRequestHandlerOptions, port: 3030 };
const requestTypedNodeListenOptions: NodeListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest,
  HookAppRequest
> = requestTypedListenOptions;
const requestTypedListenOptionsRequest: HandlerOptionsRequest<
  typeof requestTypedListenOptions
> = hookAppRequest;
requestTypedListenOptionsRequest.requestId.toUpperCase();
exactListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  // @ts-expect-error exact Node listen options preserve route-specific hook bodies.
  manifestStreamRouteHandlerHookContext
);
requestTypedNodeListenOptions.hooks?.beforeRequest?.(
  hookAppRequest,
  exactManifestHandlerHookContext
);
requestTypedNodeListenOptions.hooks?.beforeRequest?.(
  // @ts-expect-error request-typed Node listen options reject broader requests.
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
const nodeServer: NodeServer = listen(manifest, typedListenOptions);
listen(manifest, requestTypedListenOptions);
nodeServer.close();
nodeServer.address();
nodeServer.ref().unref();
// @ts-expect-error Node server close methods are readonly.
nodeServer.close = () => nodeServer;
// @ts-expect-error service-dependent manifests require matching Node listen plugins.
listen(manifest);
const transportResult: RpcBodyResult = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: {},
};
const nodeTransportRequestHandler: NodeTransportRequestHandler =
  createNodeTransportRequestHandler(async () => transportResult);
const createTypedNodeTransportRequestHandler =
  createNodeTransportRequestHandlerFor<NodeAppRequest, NodeAppResponse>();
const typedNodeTransportRequestHandler: NodeTransportRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createTypedNodeTransportRequestHandler(async () => transportResult);
const createTypedNodeTransportRequestHandlerWithPath =
  createNodeTransportRequestHandlerWithPathFor<
    NodeAppRequest,
    NodeAppResponse
  >();
const typedNodeTransportRequestHandlerWithPath: NodeTransportRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createTypedNodeTransportRequestHandlerWithPath(
  async () => transportResult,
  '/rpc'
);
const syncNodeTransportHandler: NodeTransportBodyResultHandler = () =>
  transportResult;
createNodeTransportRequestHandler(syncNodeTransportHandler);
createNodeTransportRequestHandlerWithPath(syncNodeTransportHandler, '/rpc');
typedNodeTransportRequestHandler(nodeAppRequest, nodeAppResponse);
typedNodeTransportRequestHandlerWithPath(nodeAppRequest, nodeAppResponse);
// @ts-expect-error typed Node transport handlers preserve the response's incoming message type.
createNodeTransportRequestHandlerFor<NodeAppRequest, NodeMismatchedResponse>();
createNodeTransportRequestHandlerWithPathFor<
  NodeAppRequest,
  // @ts-expect-error typed Node transport handlers preserve the response's incoming message type.
  NodeMismatchedResponse
>();
const runtimeSubpathNodeTransportRequestHandler: RuntimeSubpathNodeTransportRequestHandler =
  nodeTransportRequestHandler;
const createRuntimeSubpathTypedNodeTransportRequestHandler =
  createRuntimeSubpathNodeTransportRequestHandlerFor<
    NodeAppRequest,
    NodeAppResponse
  >();
const runtimeSubpathTypedNodeTransportRequestHandler: RuntimeSubpathNodeTransportRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createRuntimeSubpathTypedNodeTransportRequestHandler(
  async () => transportResult
);
const createRuntimeSubpathTypedNodeTransportRequestHandlerWithPath =
  createRuntimeSubpathNodeTransportRequestHandlerWithPathFor<
    NodeAppRequest,
    NodeAppResponse
  >();
const runtimeSubpathTypedNodeTransportRequestHandlerWithPath: RuntimeSubpathNodeTransportRequestHandler<
  NodeAppRequest,
  NodeAppResponse
> = createRuntimeSubpathTypedNodeTransportRequestHandlerWithPath(
  async () => transportResult,
  '/rpc'
);
runtimeSubpathNodeTransportRequestHandler.length.toFixed();
runtimeSubpathTypedNodeTransportRequestHandler(
  nodeAppRequest,
  nodeAppResponse
);
runtimeSubpathTypedNodeTransportRequestHandlerWithPath(
  nodeAppRequest,
  nodeAppResponse
);
const _nodeTransportResult: NodeTransportBodyResult = transportResult;
const nodeTransportResultFor: NodeTransportBodyResultFor<typeof manifest> =
  denoCompiledTransportResultFor;
const exactNodeTransportResultFor: NodeTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactDenoCompiledTransportResultFor;
const nodeRouteUnaryTransportResultFor: NodeRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledUnaryRouteTransportResultFor;
const nodeUnaryRouteTransportResultFor: NodeUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = nodeRouteUnaryTransportResultFor;
const nodeRouteStreamTransportResultFor: NodeRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledStreamRouteTransportResultFor;
const nodeStreamRouteTransportResultFor: NodeStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = nodeRouteStreamTransportResultFor;
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
createNodeTransportRequestHandlerWithPath(
  routeTypedNodeTransportHandler,
  '/rpc'
);
const manifestNodeTransportHandler: NodeTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const syncManifestNodeTransportHandler: NodeTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestDenoTransportHandler;
const manifestNodeRouteUnaryTransportHandler: NodeRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeTransportHandler;
const syncManifestNodeRouteUnaryTransportHandler: NodeRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestNodeTransportHandler;
const manifestNodeUnaryRouteTransportHandler: NodeUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeRouteUnaryTransportHandler;
const manifestNodeRouteStreamTransportHandler: NodeRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeTransportHandler;
const syncManifestNodeRouteStreamTransportHandler: NodeRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = syncManifestNodeTransportHandler;
const manifestNodeStreamRouteTransportHandler: NodeStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeRouteStreamTransportHandler;
createNodeTransportRequestHandler(manifestNodeTransportHandler);
createNodeTransportRequestHandler(syncManifestNodeTransportHandler);
manifestNodeUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestNodeStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestNodeRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
syncManifestNodeRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestNodeRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
syncManifestNodeRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
Promise.resolve(
  manifestNodeTransportHandler(createFetchRequestSourceForTypes(), {
    id: 'users.authenticated',
    input: { ok: true },
  })
).then((result) => {
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
const exactRuntimeSubpathBunTransportResultFor: RuntimeSubpathBunTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactNodeTransportResultFor;
const runtimeSubpathBunRouteUnaryTransportResultFor: RuntimeSubpathBunRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = nodeRouteUnaryTransportResultFor;
const runtimeSubpathBunRouteStreamTransportResultFor: RuntimeSubpathBunRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = nodeRouteStreamTransportResultFor;
const runtimeSubpathBunUnaryRouteTransportResultFor: RuntimeSubpathBunUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = nodeUnaryRouteTransportResultFor;
const runtimeSubpathBunStreamRouteTransportResultFor: RuntimeSubpathBunStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = nodeStreamRouteTransportResultFor;
const runtimeSubpathDenoTransportResultFor: RuntimeSubpathDenoTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathBunTransportResultFor;
const exactRuntimeSubpathDenoTransportResultFor: RuntimeSubpathDenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRuntimeSubpathBunTransportResultFor;
const runtimeSubpathDenoRouteUnaryTransportResultFor: RuntimeSubpathDenoRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathBunUnaryRouteTransportResultFor;
const runtimeSubpathDenoRouteStreamTransportResultFor: RuntimeSubpathDenoRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathBunStreamRouteTransportResultFor;
const runtimeSubpathDenoUnaryRouteTransportResultFor: RuntimeSubpathDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathBunRouteUnaryTransportResultFor;
const runtimeSubpathDenoStreamRouteTransportResultFor: RuntimeSubpathDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathBunRouteStreamTransportResultFor;
const runtimeSubpathDenoCompiledTransportResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathDenoTransportResultFor;
const exactRuntimeSubpathDenoCompiledTransportResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRuntimeSubpathDenoTransportResultFor;
const runtimeSubpathDenoCompiledRouteUnaryTransportResultFor: RuntimeSubpathDenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoUnaryRouteTransportResultFor;
const runtimeSubpathDenoCompiledRouteStreamTransportResultFor: RuntimeSubpathDenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoStreamRouteTransportResultFor;
const runtimeSubpathDenoCompiledUnaryRouteTransportResultFor: RuntimeSubpathDenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoCompiledRouteUnaryTransportResultFor;
const runtimeSubpathDenoCompiledStreamRouteTransportResultFor: RuntimeSubpathDenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoCompiledRouteStreamTransportResultFor;
const runtimeSubpathNodeTransportResultFor: RuntimeSubpathNodeTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathDenoCompiledTransportResultFor;
const exactRuntimeSubpathNodeTransportResultFor: RuntimeSubpathNodeTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRuntimeSubpathDenoCompiledTransportResultFor;
const runtimeSubpathNodeUnaryRouteTransportResultFor: RuntimeSubpathNodeUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoCompiledUnaryRouteTransportResultFor;
const runtimeSubpathNodeStreamRouteTransportResultFor: RuntimeSubpathNodeStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoCompiledStreamRouteTransportResultFor;
const runtimeSubpathNodeRouteUnaryTransportResultFor: RuntimeSubpathNodeRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoRouteUnaryTransportResultFor;
const runtimeSubpathNodeRouteStreamTransportResultFor: RuntimeSubpathNodeRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoRouteStreamTransportResultFor;
if (
  !(runtimeSubpathNodeTransportResultFor instanceof Response) &&
  !Array.isArray(runtimeSubpathNodeTransportResultFor) &&
  'ok' in runtimeSubpathNodeTransportResultFor &&
  runtimeSubpathNodeTransportResultFor.ok
) {
  runtimeSubpathNodeTransportResultFor.data.id.toUpperCase();
}
if (
  !(exactRuntimeSubpathNodeTransportResultFor instanceof Response) &&
  'ok' in exactRuntimeSubpathNodeTransportResultFor &&
  exactRuntimeSubpathNodeTransportResultFor.ok
) {
  exactRuntimeSubpathNodeTransportResultFor.data.name.toUpperCase();
}
runtimeSubpathNodeUnaryRouteTransportResultFor.valueOf();
runtimeSubpathNodeStreamRouteTransportResultFor.valueOf();
runtimeSubpathNodeRouteUnaryTransportResultFor.valueOf();
runtimeSubpathNodeRouteStreamTransportResultFor.valueOf();
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
createRuntimeSubpathBunTransportRequestHandlerWithPath(
  runtimeSubpathBunTransportHandler,
  '/rpc'
);
createRuntimeSubpathDenoTransportRequestHandler(
  runtimeSubpathBunTransportHandler
);
const runtimeSubpathManifestBunTransportHandler: RuntimeSubpathBunTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const runtimeSubpathManifestBunRouteUnaryTransportHandler: RuntimeSubpathBunRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestBunRouteStreamTransportHandler: RuntimeSubpathBunRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestBunUnaryRouteTransportHandler: RuntimeSubpathBunUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunRouteUnaryTransportHandler;
const runtimeSubpathManifestBunStreamRouteTransportHandler: RuntimeSubpathBunStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunRouteStreamTransportHandler;
const runtimeSubpathManifestDenoTransportHandler: RuntimeSubpathDenoTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestDenoRouteUnaryTransportHandler: RuntimeSubpathDenoRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoTransportHandler;
const runtimeSubpathManifestDenoRouteStreamTransportHandler: RuntimeSubpathDenoRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoTransportHandler;
const runtimeSubpathManifestDenoUnaryRouteTransportHandler: RuntimeSubpathDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoRouteUnaryTransportHandler;
const runtimeSubpathManifestDenoStreamRouteTransportHandler: RuntimeSubpathDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoRouteStreamTransportHandler;
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
createRuntimeSubpathNodeTransportRequestHandlerWithPath(
  runtimeSubpathNodeTransportHandler,
  '/rpc'
);
const runtimeSubpathManifestNodeTransportHandler: RuntimeSubpathNodeTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestNodeUnaryRouteTransportHandler: RuntimeSubpathNodeUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeTransportHandler;
const runtimeSubpathManifestNodeStreamRouteTransportHandler: RuntimeSubpathNodeStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeTransportHandler;
const runtimeSubpathManifestNodeRouteUnaryTransportHandler: RuntimeSubpathNodeRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeUnaryRouteTransportHandler;
const runtimeSubpathManifestNodeRouteStreamTransportHandler: RuntimeSubpathNodeRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeStreamRouteTransportHandler;
createRuntimeSubpathNodeTransportRequestHandler(
  runtimeSubpathManifestNodeTransportHandler
);
runtimeSubpathManifestBunUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestBunStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestBunRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestBunRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestDenoRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestDenoRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestNodeUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestNodeStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
runtimeSubpathManifestNodeRouteUnaryTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestNodeRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
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
// @ts-expect-error Bun serve ports are readonly.
bunOptions.port = 3001;
const denoOptions: DenoServeOptions = { hostname: '127.0.0.1' };
denoOptions.hostname?.toUpperCase();
// @ts-expect-error Deno serve hostnames are readonly.
denoOptions.hostname = 'localhost';
const standaloneDenoOptions: StandaloneDenoServeOptions = { port: 3001 };
standaloneDenoOptions.port?.toFixed();
// @ts-expect-error standalone Deno serve ports are readonly.
standaloneDenoOptions.port = 3002;
const rootStandaloneDenoOptions: RootStandaloneDenoServeOptions =
  standaloneDenoOptions;
const runtimeSubpathStandaloneDenoOptions: RuntimeSubpathStandaloneDenoServeOptions =
  rootStandaloneDenoOptions;
runtimeSubpathStandaloneDenoOptions.port?.toFixed();
// @ts-expect-error standalone Deno serve ports are readonly across subpath exports.
runtimeSubpathStandaloneDenoOptions.port = 3003;
const listenOptions: ListenOptions = { hostname: '127.0.0.1' };
listenOptions.hostname?.toUpperCase();
// @ts-expect-error Node listen hostnames are readonly.
listenOptions.hostname = 'localhost';

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
// @ts-expect-error protocol batches are readonly tuples.
protocolBatch[0] = protocolRequest;
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
// @ts-expect-error protocol success ids are readonly.
protocolSuccess.id = 'users.authenticated';
// @ts-expect-error protocol success data is readonly.
protocolSuccess.data = { id: '2' };
// @ts-expect-error protocol success headers are readonly.
protocolSuccess.headers = { 'cache-control': 'public' };
// @ts-expect-error protocol success header values are readonly.
protocolSuccess.headers['cache-control'] = 'public';
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
// @ts-expect-error protocol response header values are readonly.
rpcResponseHeaderValues['cache-control'] = 'public';
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
// @ts-expect-error protocol failure ids are readonly.
protocolFailure.id = 'users.authenticated';
// @ts-expect-error protocol failure errors are readonly.
protocolFailure.error = protocolError;
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
const defaultRouteProtocolRequest: RpcRouteProtocolRequest<Routes> =
  routeProtocolRequest;
const protocolRequestAlias: RpcProtocolRequest<Routes, 'users.get'> =
  routeProtocolRequest;
const defaultProtocolRequestAlias: RpcProtocolRequest<Routes> =
  protocolRequestAlias;
routeProtocolRequest.input.id.toUpperCase();
if (defaultRouteProtocolRequest.id === 'users.get') {
  defaultRouteProtocolRequest.input.id.toUpperCase();
}
if (defaultProtocolRequestAlias.id === 'users.get') {
  defaultProtocolRequestAlias.input.id.toUpperCase();
}
// @ts-expect-error default route protocol requests preserve id/input correlation.
const _wrongDefaultRouteProtocolRequest: RpcRouteProtocolRequest<Routes> = {
  id: 'users.get',
  input: { userId: '1' },
};
_wrongDefaultRouteProtocolRequest.id.toUpperCase();
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
const protocolRequestUnionAlias: RpcProtocolRequestUnion<Routes> =
  routeProtocolRequestUnion;
routeProtocolRequestUnion.id.toUpperCase();
protocolRequestUnionAlias.id.toUpperCase();
const routeBody: RpcRouteBody<Routes> = streamProtocolRequest;
routeBody.id.toUpperCase();
const streamOnlyProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = streamProtocolRequest;
const defaultStreamOnlyProtocolRequest: RpcRouteStreamProtocolRequest<Routes> =
  streamOnlyProtocolRequest;
const streamProtocolRequestAlias: RpcStreamProtocolRequest<
  Routes,
  'users.watch'
> = streamOnlyProtocolRequest;
streamOnlyProtocolRequest.input.userId.toUpperCase();
defaultStreamOnlyProtocolRequest.input.userId.toUpperCase();
streamProtocolRequestAlias.input.userId.toUpperCase();
const streamRouteProtocolRequestAlias: RpcStreamRouteProtocolRequest<
  Routes,
  'users.watch'
> = streamOnlyProtocolRequest;
const streamOnlyRequest: RpcRouteStreamRequest<Routes, 'users.watch'> =
  streamOnlyProtocolRequest;
const defaultStreamOnlyRequest: RpcRouteStreamRequest<Routes> =
  streamOnlyRequest;
const streamRouteRequestAlias: RpcStreamRouteRequest<Routes, 'users.watch'> =
  streamOnlyRequest;
const builtStreamOnlyRequest = createRouteStreamRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
const builtStreamRouteRequestAlias = createStreamRouteRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
const rpcSubpathBuiltStreamRequest = createRpcSubpathRouteStreamRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
const rpcSubpathBuiltStreamRouteRequest = createRpcSubpathStreamRouteRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
streamRouteProtocolRequestAlias.input.userId.toUpperCase();
streamOnlyRequest.input.userId.toUpperCase();
defaultStreamOnlyRequest.input.userId.toUpperCase();
streamRouteRequestAlias.input.userId.toUpperCase();
builtStreamOnlyRequest.input.userId.toUpperCase();
builtStreamRouteRequestAlias.input.userId.toUpperCase();
rpcSubpathBuiltStreamRequest.input.userId.toUpperCase();
rpcSubpathBuiltStreamRouteRequest.input.userId.toUpperCase();
// @ts-expect-error standalone stream route requests reject unary route ids.
createRouteStreamRequest<Routes, 'users.get'>('users.get', { id: '1' });
const streamRouteBodyAlias: RpcStreamRouteBody<Routes> =
  streamRouteProtocolRequestAlias;
streamRouteBodyAlias.input.userId.toUpperCase();
const streamProtocolRequestUnion: RpcRouteStreamProtocolRequestUnion<Routes> =
  streamOnlyProtocolRequest;
const streamProtocolRequestUnionAlias: RpcStreamProtocolRequestUnion<Routes> =
  streamProtocolRequestUnion;
streamProtocolRequestUnion.input.userId.toUpperCase();
streamProtocolRequestUnionAlias.input.userId.toUpperCase();
const streamRouteProtocolRequestUnionAlias: RpcStreamRouteProtocolRequestUnion<Routes> =
  streamRouteProtocolRequestAlias;
streamRouteProtocolRequestUnionAlias.input.userId.toUpperCase();
const streamRequestUnion: RpcRouteStreamRequestUnion<Routes> =
  streamOnlyRequest;
const streamRouteRequestUnionAlias: RpcStreamRouteRequestUnion<Routes> =
  streamRouteRequestAlias;
streamRequestUnion.input.userId.toUpperCase();
streamRouteRequestUnionAlias.input.userId.toUpperCase();
const rpcSubpathStreamRequest: RpcSubpathRouteStreamRequest<
  Routes,
  'users.watch'
> = streamOnlyRequest;
const rpcSubpathProtocolRequest: RpcSubpathProtocolRequest<
  Routes,
  'users.get'
> = routeProtocolRequest;
const rpcSubpathProtocolRequestUnion: RpcSubpathProtocolRequestUnion<Routes> =
  protocolRequestUnionAlias;
const rpcSubpathStreamProtocolRequest: RpcSubpathStreamProtocolRequest<
  Routes,
  'users.watch'
> = streamProtocolRequestAlias;
const rpcSubpathStreamProtocolRequestUnion: RpcSubpathStreamProtocolRequestUnion<Routes> =
  streamProtocolRequestUnionAlias;
const rpcSubpathStreamRouteRequest: RpcSubpathStreamRouteRequest<
  Routes,
  'users.watch'
> = rpcSubpathStreamRequest;
rpcSubpathProtocolRequest.input.id.toUpperCase();
rpcSubpathProtocolRequestUnion.id.toUpperCase();
rpcSubpathStreamProtocolRequest.input.userId.toUpperCase();
rpcSubpathStreamProtocolRequestUnion.input.userId.toUpperCase();
rpcSubpathStreamRouteRequest.input.userId.toUpperCase();
const unaryProtocolRequest: RpcRouteUnaryProtocolRequest<Routes, 'users.get'> =
  routeProtocolRequest;
const defaultUnaryProtocolRequest: RpcRouteUnaryProtocolRequest<Routes> =
  unaryProtocolRequest;
const unaryProtocolRequestAlias: RpcUnaryProtocolRequest<Routes, 'users.get'> =
  unaryProtocolRequest;
unaryProtocolRequest.input.id.toUpperCase();
defaultUnaryProtocolRequest.id.toUpperCase();
unaryProtocolRequestAlias.input.id.toUpperCase();
const unaryRouteProtocolRequestAlias: RpcUnaryRouteProtocolRequest<
  Routes,
  'users.get'
> = unaryProtocolRequest;
const defaultUnaryRouteProtocolRequestAlias: RpcUnaryRouteProtocolRequest<Routes> =
  unaryRouteProtocolRequestAlias;
unaryRouteProtocolRequestAlias.input.id.toUpperCase();
defaultUnaryRouteProtocolRequestAlias.id.toUpperCase();
const unaryRouteBodyAlias: RpcUnaryRouteBody<Routes> =
  unaryRouteProtocolRequestAlias;
unaryRouteBodyAlias.input.id.toUpperCase();
const unaryProtocolRequestUnion: RpcRouteUnaryProtocolRequestUnion<Routes> =
  unaryProtocolRequest;
const unaryProtocolRequestUnionAlias: RpcUnaryProtocolRequestUnion<Routes> =
  unaryProtocolRequestUnion;
unaryProtocolRequestUnion.id.toUpperCase();
unaryProtocolRequestUnionAlias.id.toUpperCase();
const rpcSubpathUnaryProtocolRequest: RpcSubpathUnaryProtocolRequest<
  Routes,
  'users.get'
> = unaryProtocolRequestAlias;
const rpcSubpathUnaryProtocolRequestUnion: RpcSubpathUnaryProtocolRequestUnion<Routes> =
  unaryProtocolRequestUnionAlias;
rpcSubpathUnaryProtocolRequest.input.id.toUpperCase();
rpcSubpathUnaryProtocolRequestUnion.id.toUpperCase();
const unaryRouteProtocolRequestUnionAlias: RpcUnaryRouteProtocolRequestUnion<Routes> =
  unaryRouteProtocolRequestAlias;
unaryRouteProtocolRequestUnionAlias.id.toUpperCase();
const routePendingBatchRequest: RpcRouteRequest<Routes, 'users.get'> = {
  id: 'users.get',
  input: { id: '1' },
  headers: { 'x-tenant-id': 'tenant-1' },
};
// @ts-expect-error pending route request ids are readonly.
routePendingBatchRequest.id = 'users.authenticated';
// @ts-expect-error pending route request headers are readonly.
routePendingBatchRequest.headers = { 'x-tenant-id': 'tenant-2' };
const routeBatchRequest: RpcRouteBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = [routeProtocolRequest];
// @ts-expect-error route batches are readonly tuples.
routeBatchRequest[0] = routeProtocolRequest;
const routeBatchRequestWithPending: RpcRouteBatchRequest<
  Routes,
  [typeof routePendingBatchRequest]
> = [routePendingBatchRequest];
const defaultRouteBatchRequest: RpcRouteBatchRequest<Routes> =
  routeBatchRequest;
const routeBatchRequestUnion: RpcRouteBatchRequestUnion<Routes> =
  routePendingBatchRequest;
const routeProtocolBatchRequest: RpcRouteProtocolBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = [routeProtocolRequest];
// @ts-expect-error protocol route batches are readonly tuples.
routeProtocolBatchRequest[0] = routeProtocolRequest;
const protocolBatchRequestAlias: RpcProtocolBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = routeProtocolBatchRequest;
const rpcSubpathRouteProtocolBatchRequest: RpcSubpathRouteProtocolBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = protocolBatchRequestAlias;
routeBatchRequest[0].input.id.toUpperCase();
routeBatchRequestWithPending[0].headers['x-tenant-id'].toUpperCase();
routeBatchRequestUnion.id.toUpperCase();
rpcSubpathRouteProtocolBatchRequest[0].input.id.toUpperCase();
const defaultRouteBatchRequestFirst = defaultRouteBatchRequest[0];
if (defaultRouteBatchRequestFirst) {
  defaultRouteBatchRequestFirst.id.toUpperCase();
}
const unaryRouteBatchRequestAlias: RpcUnaryRouteBatchRequest<
  Routes,
  [typeof unaryRouteProtocolRequestAlias]
> = [unaryRouteProtocolRequestAlias];
const routeUnaryBatchRequestUnion: RpcRouteUnaryBatchRequestUnion<Routes> =
  routeBatchRequestUnion;
const unaryRouteBatchRequestUnion: RpcUnaryRouteBatchRequestUnion<Routes> =
  routeUnaryBatchRequestUnion;
const defaultUnaryRouteBatchRequestAlias: RpcUnaryRouteBatchRequest<Routes> =
  unaryRouteBatchRequestAlias;
const routeUnaryProtocolBatchRequest: RpcRouteUnaryProtocolBatchRequest<
  Routes,
  [typeof unaryRouteProtocolRequestAlias]
> = [unaryRouteProtocolRequestAlias];
const unaryRouteProtocolBatchRequest: RpcUnaryRouteProtocolBatchRequest<
  Routes,
  [typeof unaryRouteProtocolRequestAlias]
> = routeUnaryProtocolBatchRequest;
unaryRouteBatchRequestAlias[0].input.id.toUpperCase();
unaryRouteBatchRequestUnion.id.toUpperCase();
unaryRouteProtocolBatchRequest[0].input.id.toUpperCase();
const defaultUnaryRouteBatchRequestAliasFirst =
  defaultUnaryRouteBatchRequestAlias[0];
if (defaultUnaryRouteBatchRequestAliasFirst) {
  defaultUnaryRouteBatchRequestAliasFirst.id.toUpperCase();
}
const routeBatchBody: RpcRouteBody<Routes> = routeBatchRequest;
routeBatchBody.length.toFixed();
const unaryRouteBatchBodyAlias: RpcUnaryRouteBody<Routes> =
  unaryRouteBatchRequestAlias;
unaryRouteBatchBodyAlias.length.toFixed();
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
  // @ts-expect-error route client batches reject stream request bodies.
  [typeof streamProtocolRequest]
> = [streamProtocolRequest];

// @ts-expect-error route protocol batches reject pending client requests.
const _wrongRouteProtocolBatchRequest: RpcRouteProtocolBatchRequest<
  Routes,
  [typeof routePendingBatchRequest]
> = [routePendingBatchRequest];

const _wrongRouteBody: RpcRouteBody<Routes> = [
  // @ts-expect-error route bodies reject stream request batches.
  { id: 'users.watch', input: { userId: '1' } },
];

const routeClient = createClient<Routes>({ url: '/rpc' });
const routeClientShape: RouteRpcTransportClient<Routes> = routeClient;
const routeUnaryClientShape: RpcRouteUnaryTransportClient<Routes> = routeClient;
const unaryRouteClientShape: RpcUnaryRouteTransportClient<Routes> =
  routeUnaryClientShape;
unaryRouteClientShape.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
unaryRouteClientShape.batch([
  unaryRouteClientShape.request(
    'users.get',
    { id: '1' },
    { headers: { 'x-tenant-id': 'tenant-1' } }
  ),
] as const);
// @ts-expect-error route unary client commands are readonly.
unaryRouteClientShape.call = routeClient.call;
const routeStreamClientShape: RpcRouteStreamTransportClient<Routes> =
  routeClient;
const streamRouteClientShape: RpcStreamRouteTransportClient<Routes> =
  routeStreamClientShape;
streamRouteClientShape.stream('users.watch', { userId: '1' });
// @ts-expect-error route stream client commands are readonly.
streamRouteClientShape.stream = routeClient.stream;
const routeRequestOptions: RpcRouteRequestOptions<Routes, 'users.get'> = {
  headers: { authorization: undefined, 'x-tenant-id': 'tenant-1' },
};
// @ts-expect-error route request option headers are readonly.
routeRequestOptions.headers = {
  authorization: undefined,
  'x-tenant-id': 'tenant-2',
};
// @ts-expect-error route request header fields are readonly.
routeRequestOptions.headers['x-tenant-id'] = 'tenant-2';
const defaultRouteRequestOptions: RpcRouteRequestOptions<Routes> =
  routeRequestOptions;
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
const unaryRouteRequestOptions: RpcUnaryRouteRequestOptions<
  Routes,
  'users.get'
> = routeRequestOptions;
const defaultUnaryRouteRequestOptions: RpcUnaryRouteRequestOptions<Routes> =
  unaryRouteRequestOptions;
const rpcSubpathUnaryRouteRequestOptions: RpcSubpathUnaryRouteRequestOptions<
  Routes,
  'users.get'
> = unaryRouteRequestOptions;
const streamRouteRequestOptions: RpcStreamRouteRequestOptions<
  Routes,
  'users.watch'
> = {};
const defaultStreamRouteRequestOptions: RpcStreamRouteRequestOptions<Routes> =
  streamRouteRequestOptions;
const rpcSubpathStreamRouteRequestOptions: RpcSubpathStreamRouteRequestOptions<
  Routes,
  'users.watch'
> = streamRouteRequestOptions;
routeRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultRouteRequestOptions.headers?.['x-tenant-id']?.toUpperCase();
rpcSubpathRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultUnaryRouteRequestOptions.headers?.['x-tenant-id']?.toUpperCase();
rpcSubpathStreamRouteRequestOptions.valueOf();
defaultStreamRouteRequestOptions.valueOf();
const routeClientArgs: RpcRouteClientArgs<Routes, 'users.get'> = [
  { id: '1' },
  routeRequestOptions,
];
const defaultRouteClientArgs: RpcRouteClientArgs<Routes> = routeClientArgs;
// @ts-expect-error route client args are readonly tuples.
routeClientArgs[0] = { id: '2' };
const unaryRouteClientArgs: RpcUnaryRouteClientArgs<Routes, 'users.get'> =
  routeClientArgs;
const defaultUnaryRouteClientArgs: RpcUnaryRouteClientArgs<Routes> =
  unaryRouteClientArgs;
const rpcSubpathRouteClientArgs: RpcSubpathRouteClientArgs<
  Routes,
  'users.get'
> = routeClientArgs;
const rpcSubpathUnaryRouteClientArgs: RpcSubpathUnaryRouteClientArgs<
  Routes,
  'users.get'
> = unaryRouteClientArgs;
routeClient.call('users.get', ...routeClientArgs);
routeClient.call('users.get', ...rpcSubpathRouteClientArgs);
routeClient.call('users.get', ...rpcSubpathUnaryRouteClientArgs);
routeClient.call('users.get', ...defaultUnaryRouteClientArgs);
const streamRouteClientArgs: RpcStreamRouteClientArgs<Routes, 'users.watch'> = [
  { userId: '1' },
  streamRouteRequestOptions,
];
const defaultStreamRouteClientArgs: RpcStreamRouteClientArgs<Routes> =
  streamRouteClientArgs;
// @ts-expect-error stream route client args are readonly tuples.
streamRouteClientArgs[0] = { userId: '2' };
const rpcSubpathStreamRouteClientArgs: RpcSubpathStreamRouteClientArgs<
  Routes,
  'users.watch'
> = streamRouteClientArgs;
routeClient.stream('users.watch', ...rpcSubpathStreamRouteClientArgs);
routeClient.stream('users.watch', ...defaultStreamRouteClientArgs);
const noHeaderRouteClientArgs: RpcRouteClientArgs<
  Routes,
  'users.authenticated'
> = [{ ok: true }];
const defaultNoHeaderRouteClientArgs: RpcRouteClientArgs<Routes> =
  noHeaderRouteClientArgs;
routeClient.call('users.authenticated', ...noHeaderRouteClientArgs);
routeClient.call('users.authenticated', ...defaultNoHeaderRouteClientArgs);
defaultRouteClientArgs[0].id.toUpperCase();
const _missingDefaultRouteClientArgs: RpcRouteClientArgs<Routes> = [
  // @ts-expect-error default route client args preserve route-specific required headers.
  { id: '1' },
];
_missingDefaultRouteClientArgs[0].valueOf();
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
const standaloneRouteRequest = createRouteRequest<Routes, 'users.get'>(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const standaloneRouteUnaryRequest = createRouteUnaryRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const standaloneUnaryRouteRequest = createUnaryRouteRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const rpcSubpathRouteRequest = createRpcSubpathRouteRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const rpcSubpathRouteUnaryRequest = createRpcSubpathRouteUnaryRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const rpcSubpathUnaryRouteRequest = createRpcSubpathUnaryRouteRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } });
const standaloneManifestRouteRequest = createManifestRouteRequest(
  manifest,
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const standaloneManifestRouteUnaryRequest = createManifestRouteUnaryRequest(
  manifest,
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const standaloneManifestUnaryRouteRequest = createManifestUnaryRouteRequest(
  manifest,
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const standaloneRpcSubpathManifestRouteRequest =
  createRpcSubpathManifestRouteRequest(
    manifest,
    'users.get',
    { id: '1' },
    { headers: { 'x-tenant-id': 'tenant-1' } }
  );
const rpcSubpathManifestRouteUnaryRequest =
  createRpcSubpathManifestRouteUnaryRequest(
    manifest,
    'users.get',
    { id: '1' },
    { headers: { 'x-tenant-id': 'tenant-1' } }
  );
const rpcSubpathManifestUnaryRouteRequest =
  createRpcSubpathManifestUnaryRouteRequest(
    manifest,
    'users.get',
    { id: '1' },
    { headers: { 'x-tenant-id': 'tenant-1' } }
  );
const protocolRequestOptions: RpcProtocolRequestOptions = {
  traceId: 'trace-1',
};
const rpcSubpathProtocolRequestOptions: RpcSubpathProtocolRequestOptions =
  protocolRequestOptions;
rpcSubpathProtocolRequestOptions.traceId?.toUpperCase();
// @ts-expect-error protocol request trace ids are readonly.
protocolRequestOptions.traceId = 'trace-2';
// @ts-expect-error protocol request trace ids are readonly across subpath exports.
rpcSubpathProtocolRequestOptions.traceId = 'trace-3';
const standaloneRouteProtocolRequest = createRouteProtocolRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' }, protocolRequestOptions);
const standaloneRouteUnaryProtocolRequest = createRouteUnaryProtocolRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' });
const standaloneUnaryRouteProtocolRequest = createUnaryRouteProtocolRequest<
  Routes,
  'users.get'
>('users.get', { id: '1' });
const standaloneRouteStreamProtocolRequest = createRouteStreamProtocolRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
const standaloneStreamRouteProtocolRequest = createStreamRouteProtocolRequest<
  Routes,
  'users.watch'
>('users.watch', { userId: '1' });
const rpcSubpathRouteProtocolBuilderRequest =
  createRpcSubpathRouteProtocolRequest<Routes, 'users.get'>(
    'users.get',
    { id: '1' },
    rpcSubpathProtocolRequestOptions
  );
const rpcSubpathRouteUnaryProtocolBuilderRequest =
  createRpcSubpathRouteUnaryProtocolRequest<Routes, 'users.get'>('users.get', {
    id: '1',
  });
const rpcSubpathUnaryRouteProtocolBuilderRequest =
  createRpcSubpathUnaryRouteProtocolRequest<Routes, 'users.get'>('users.get', {
    id: '1',
  });
const rpcSubpathRouteStreamProtocolBuilderRequest =
  createRpcSubpathRouteStreamProtocolRequest<Routes, 'users.watch'>(
    'users.watch',
    { userId: '1' }
  );
const rpcSubpathStreamRouteProtocolBuilderRequest =
  createRpcSubpathStreamRouteProtocolRequest<Routes, 'users.watch'>(
    'users.watch',
    { userId: '1' }
  );
const manifestRouteProtocolRequest = createManifestRouteProtocolRequest(
  manifest,
  'users.get',
  { id: '1' },
  { traceId: 'trace-2' }
);
const manifestRouteUnaryProtocolRequest =
  createManifestRouteUnaryProtocolRequest(manifest, 'users.get', { id: '1' });
const builtManifestUnaryRouteProtocolRequest =
  createManifestUnaryRouteProtocolRequest(manifest, 'users.get', { id: '1' });
const manifestRouteStreamProtocolRequest =
  createManifestRouteStreamProtocolRequest(manifest, 'users.watch', {
    userId: '1',
  });
const builtManifestStreamRouteProtocolRequest =
  createManifestStreamRouteProtocolRequest(manifest, 'users.watch', {
    userId: '1',
  });
const rpcSubpathManifestRouteProtocolRequest =
  createRpcSubpathManifestRouteProtocolRequest(
    manifest,
    'users.get',
    { id: '1' },
    { traceId: 'trace-3' }
  );
const rpcSubpathManifestRouteUnaryProtocolRequest =
  createRpcSubpathManifestRouteUnaryProtocolRequest(manifest, 'users.get', {
    id: '1',
  });
const rpcSubpathManifestUnaryRouteProtocolRequest =
  createRpcSubpathManifestUnaryRouteProtocolRequest(manifest, 'users.get', {
    id: '1',
  });
const rpcSubpathManifestRouteStreamProtocolRequest =
  createRpcSubpathManifestRouteStreamProtocolRequest(manifest, 'users.watch', {
    userId: '1',
  });
const rpcSubpathManifestStreamRouteProtocolRequest =
  createRpcSubpathManifestStreamRouteProtocolRequest(manifest, 'users.watch', {
    userId: '1',
  });
const typedStandaloneRouteProtocolRequest: RpcRouteProtocolRequest<
  Routes,
  'users.get'
> = standaloneRouteProtocolRequest;
const typedStandaloneRouteUnaryProtocolRequest: RpcRouteUnaryProtocolRequest<
  Routes,
  'users.get'
> = standaloneRouteUnaryProtocolRequest;
const typedStandaloneUnaryRouteProtocolRequest: RpcUnaryProtocolRequest<
  Routes,
  'users.get'
> = standaloneUnaryRouteProtocolRequest;
const typedStandaloneRouteStreamProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = standaloneRouteStreamProtocolRequest;
// @ts-expect-error stream protocol requests are not unary protocol request unions.
const _wrongStandaloneStreamAsUnaryProtocol: RpcRouteUnaryProtocolRequestUnion<Routes> =
  standaloneRouteStreamProtocolRequest;
_wrongStandaloneStreamAsUnaryProtocol.valueOf();
const typedStandaloneStreamRouteProtocolRequest: RpcStreamProtocolRequest<
  Routes,
  'users.watch'
> = standaloneStreamRouteProtocolRequest;
const typedRpcSubpathRouteProtocolBuilderRequest: RpcRouteProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathRouteProtocolBuilderRequest;
const typedRpcSubpathRouteUnaryProtocolBuilderRequest: RpcRouteUnaryProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathRouteUnaryProtocolBuilderRequest;
const typedRpcSubpathUnaryRouteProtocolBuilderRequest: RpcUnaryProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathUnaryRouteProtocolBuilderRequest;
const typedRpcSubpathRouteStreamProtocolBuilderRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = rpcSubpathRouteStreamProtocolBuilderRequest;
const typedRpcSubpathStreamRouteProtocolBuilderRequest: RpcStreamProtocolRequest<
  Routes,
  'users.watch'
> = rpcSubpathStreamRouteProtocolBuilderRequest;
const typedManifestRouteProtocolRequest: RpcRouteProtocolRequest<
  Routes,
  'users.get'
> = manifestRouteProtocolRequest;
const typedManifestRouteUnaryProtocolRequest: RpcRouteUnaryProtocolRequest<
  Routes,
  'users.get'
> = manifestRouteUnaryProtocolRequest;
const typedManifestUnaryRouteProtocolRequest: RpcUnaryProtocolRequest<
  Routes,
  'users.get'
> = builtManifestUnaryRouteProtocolRequest;
const typedManifestRouteStreamProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = manifestRouteStreamProtocolRequest;
const typedManifestStreamRouteProtocolRequest: RpcStreamProtocolRequest<
  Routes,
  'users.watch'
> = builtManifestStreamRouteProtocolRequest;
const typedRpcSubpathManifestRouteProtocolRequest: RpcRouteProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathManifestRouteProtocolRequest;
const typedRpcSubpathManifestRouteUnaryProtocolRequest: RpcRouteUnaryProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathManifestRouteUnaryProtocolRequest;
const typedRpcSubpathManifestUnaryRouteProtocolRequest: RpcUnaryProtocolRequest<
  Routes,
  'users.get'
> = rpcSubpathManifestUnaryRouteProtocolRequest;
const typedRpcSubpathManifestRouteStreamProtocolRequest: RpcRouteStreamProtocolRequest<
  Routes,
  'users.watch'
> = rpcSubpathManifestRouteStreamProtocolRequest;
const typedRpcSubpathManifestStreamRouteProtocolRequest: RpcStreamProtocolRequest<
  Routes,
  'users.watch'
> = rpcSubpathManifestStreamRouteProtocolRequest;
typedStandaloneRouteProtocolRequest.input.id.toUpperCase();
typedStandaloneRouteProtocolRequest.traceId?.toUpperCase();
typedStandaloneRouteUnaryProtocolRequest.input.id.toUpperCase();
typedStandaloneUnaryRouteProtocolRequest.input.id.toUpperCase();
typedStandaloneRouteStreamProtocolRequest.input.userId.toUpperCase();
typedStandaloneStreamRouteProtocolRequest.input.userId.toUpperCase();
typedRpcSubpathRouteProtocolBuilderRequest.input.id.toUpperCase();
typedRpcSubpathRouteUnaryProtocolBuilderRequest.input.id.toUpperCase();
typedRpcSubpathUnaryRouteProtocolBuilderRequest.input.id.toUpperCase();
typedRpcSubpathRouteStreamProtocolBuilderRequest.input.userId.toUpperCase();
typedRpcSubpathStreamRouteProtocolBuilderRequest.input.userId.toUpperCase();
typedManifestRouteProtocolRequest.traceId?.toUpperCase();
typedManifestRouteUnaryProtocolRequest.input.id.toUpperCase();
typedManifestUnaryRouteProtocolRequest.input.id.toUpperCase();
typedManifestRouteStreamProtocolRequest.input.userId.toUpperCase();
typedManifestStreamRouteProtocolRequest.input.userId.toUpperCase();
typedRpcSubpathManifestRouteProtocolRequest.traceId?.toUpperCase();
typedRpcSubpathManifestRouteUnaryProtocolRequest.input.id.toUpperCase();
typedRpcSubpathManifestUnaryRouteProtocolRequest.input.id.toUpperCase();
typedRpcSubpathManifestRouteStreamProtocolRequest.input.userId.toUpperCase();
typedRpcSubpathManifestStreamRouteProtocolRequest.input.userId.toUpperCase();
const _wrongProtocolRequestOptions: RpcProtocolRequestOptions = {
  // @ts-expect-error trace ids must be strings.
  traceId: 1,
};
_wrongProtocolRequestOptions.valueOf();
createRouteProtocolRequest<Routes, 'users.get'>(
  'users.get',
  // @ts-expect-error standalone protocol request builders validate input by id.
  { userId: '1' }
);
createRouteUnaryProtocolRequest<Routes>(
  // @ts-expect-error unary protocol request builders reject stream route ids.
  'users.watch',
  { userId: '1' }
);
createRouteStreamProtocolRequest<Routes>(
  // @ts-expect-error stream protocol request builders reject unary route ids.
  'users.get',
  { id: '1' }
);
createManifestRouteProtocolRequest(
  manifest,
  // @ts-expect-error manifest protocol request builders reject unknown route ids.
  'users.missing',
  { id: '1' }
);
const typedRouteRequest: RpcRouteRequest<Routes, 'users.get'> = routeRequest;
const typedStandaloneRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneRouteRequest;
const typedStandaloneRouteUnaryRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneRouteUnaryRequest;
const typedStandaloneUnaryRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneUnaryRouteRequest;
const typedRpcSubpathRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  rpcSubpathRouteRequest;
const typedRpcSubpathRouteUnaryRequest: RpcRouteRequest<Routes, 'users.get'> =
  rpcSubpathRouteUnaryRequest;
const typedRpcSubpathUnaryRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  rpcSubpathUnaryRouteRequest;
const typedManifestRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneManifestRouteRequest;
const typedManifestRouteUnaryRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneManifestRouteUnaryRequest;
const typedManifestUnaryRouteRequest: RpcRouteRequest<Routes, 'users.get'> =
  standaloneManifestUnaryRouteRequest;
const typedRpcSubpathManifestRouteRequest: RpcRouteRequest<
  Routes,
  'users.get'
> = standaloneRpcSubpathManifestRouteRequest;
const typedRpcSubpathManifestRouteUnaryRequest: RpcRouteRequest<
  Routes,
  'users.get'
> = rpcSubpathManifestRouteUnaryRequest;
const typedRpcSubpathManifestUnaryRouteRequest: RpcRouteRequest<
  Routes,
  'users.get'
> = rpcSubpathManifestUnaryRouteRequest;
const defaultTypedRouteRequest: RpcRouteRequest<Routes> = typedRouteRequest;
typedRouteRequest.input.id.toUpperCase();
typedRouteRequest.headers['x-tenant-id'].toUpperCase();
typedStandaloneRouteRequest.headers['x-tenant-id'].toUpperCase();
typedStandaloneRouteUnaryRequest.headers['x-tenant-id'].toUpperCase();
typedStandaloneUnaryRouteRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathRouteRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathRouteUnaryRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathUnaryRouteRequest.headers['x-tenant-id'].toUpperCase();
typedManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
typedManifestRouteUnaryRequest.headers['x-tenant-id'].toUpperCase();
typedManifestUnaryRouteRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathManifestRouteUnaryRequest.headers['x-tenant-id'].toUpperCase();
typedRpcSubpathManifestUnaryRouteRequest.headers['x-tenant-id'].toUpperCase();
if (defaultTypedRouteRequest.id === 'users.get') {
  defaultTypedRouteRequest.input.id.toUpperCase();
  defaultTypedRouteRequest.headers['x-tenant-id'].toUpperCase();
}
// @ts-expect-error standalone route request builders require declared headers.
createRouteRequest<Routes, 'users.get'>('users.get', { id: '1' });
createRouteRequest<Routes, 'users.get'>(
  'users.get',
  { id: '1' },
  {
    headers: {
      // @ts-expect-error standalone route request builders validate header values.
      'x-tenant-id': 1,
    },
  }
);
// @ts-expect-error standalone route request builders reject stream route ids.
createRouteRequest<Routes, 'users.watch'>('users.watch', { userId: '1' });
createManifestRouteRequest(
  manifest,
  // @ts-expect-error manifest route request builders reject unknown route ids.
  'users.missing',
  { id: '1' }
);
const typedUnaryRouteRequest: RpcUnaryRouteRequest<Routes, 'users.get'> =
  typedRouteRequest;
const defaultTypedUnaryRouteRequest: RpcUnaryRouteRequest<Routes> =
  typedUnaryRouteRequest;
typedUnaryRouteRequest.input.id.toUpperCase();
defaultTypedUnaryRouteRequest.id.toUpperCase();
// @ts-expect-error default route requests preserve route-specific required headers.
const _missingDefaultRouteRequestHeaders: RpcRouteRequest<Routes> = {
  id: 'users.get',
  input: { id: '1' },
};
_missingDefaultRouteRequestHeaders.id.toUpperCase();
const routeRequestId: 'users.get' = routeRequest.id;
routeRequestId.toUpperCase();

const unionRouteRequest: RpcRouteRequestUnion<Routes> = routeRequest;
unionRouteRequest.id.toUpperCase();
const unaryRouteRequestUnion: RpcUnaryRouteRequestUnion<Routes> =
  typedUnaryRouteRequest;
unaryRouteRequestUnion.id.toUpperCase();

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

routeClient
  .batch([
    standaloneRouteUnaryProtocolRequest,
    standaloneUnaryRouteProtocolRequest,
    createRouteUnaryProtocolRequest<Routes, 'users.authenticated'>(
      'users.authenticated',
      { ok: true }
    ),
  ] as const)
  .then((results) => {
    const firstProtocolBatchRouteId: 'users.get' = results[0].id;
    const secondProtocolBatchRouteId: 'users.get' = results[1].id;
    const thirdProtocolBatchRouteId: 'users.authenticated' = results[2].id;
    firstProtocolBatchRouteId.toUpperCase();
    secondProtocolBatchRouteId.toUpperCase();
    thirdProtocolBatchRouteId.toUpperCase();
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

const routeEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
};
const defaultRouteEnvelope: RpcRouteEnvelope<Routes> = routeEnvelope;
routeEnvelope.id.toUpperCase();
if (defaultRouteEnvelope.id === 'users.get' && defaultRouteEnvelope.ok) {
  defaultRouteEnvelope.data.name.toUpperCase();
  defaultRouteEnvelope.headers['cache-control'].toUpperCase();
}
const routeUnaryEnvelope: RpcUnaryRouteEnvelope<Routes, 'users.get'> =
  routeEnvelope;
const defaultRouteUnaryEnvelope: RpcUnaryRouteEnvelope<Routes> =
  routeUnaryEnvelope;
routeUnaryEnvelope.id.toUpperCase();
defaultRouteUnaryEnvelope.id.toUpperCase();
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
const unaryRouteEnvelopeUnion: RpcUnaryRouteEnvelopeUnion<Routes> =
  routeUnaryEnvelope;
unaryRouteEnvelopeUnion.id.toUpperCase();
const routeResult: RpcRouteResult<Routes, 'users.get'> = routeEnvelope;
const defaultRouteResult: RpcRouteResult<Routes> = routeResult;
const routeUnaryResult: RpcUnaryRouteResult<Routes, 'users.get'> = routeResult;
const defaultRouteUnaryResult: RpcUnaryRouteResult<Routes> = routeUnaryResult;
const routeResultUnion: RpcRouteResultUnion<Routes> = routeResult;
const unaryRouteResultUnion: RpcUnaryRouteResultUnion<Routes> =
  routeUnaryResult;
unaryRouteResultUnion.id.toUpperCase();
defaultRouteResult.id.toUpperCase();
defaultRouteUnaryResult.id.toUpperCase();
const rpcSubpathRouteResult: RpcSubpathRouteResult<Routes, 'users.get'> =
  routeResult;
const rpcSubpathRouteResultUnion: RpcSubpathRouteResultUnion<Routes> =
  routeResultUnion;
rpcSubpathRouteResult.id.toUpperCase();
routeUnaryResult.id.toUpperCase();
rpcSubpathRouteResultUnion.id.toUpperCase();
const routeBodyResult: RpcRouteBodyResult<Routes> = routeEnvelopeUnion;
const unaryRouteBodyResult: RpcUnaryRouteBodyResult<Routes> = routeBodyResult;
const streamRouteBodyResult: RpcStreamRouteBodyResult<Routes> = new Response();
const unaryRouteBatchResults: RpcUnaryRouteBatchResults<
  Routes,
  [typeof typedUnaryRouteRequest]
> = [routeEnvelope];
// @ts-expect-error route batch results are readonly tuples.
unaryRouteBatchResults[0] = routeEnvelope;
const defaultRouteBatchResults: RpcUnaryRouteBatchResults<Routes> =
  unaryRouteBatchResults;
unaryRouteBatchResults[0].id.toUpperCase();
const defaultRouteBatchResult = defaultRouteBatchResults[0];
if (defaultRouteBatchResult) {
  defaultRouteBatchResult.id.toUpperCase();
}
const routeBodyResultFor: RpcRouteBodyResultFor<
  Routes,
  typeof routeProtocolRequest
> = routeEnvelopeUnion;
const unaryRouteBodyResultFor: RpcUnaryRouteBodyResultFor<
  Routes,
  typeof unaryRouteBodyAlias
> = routeEnvelopeUnion;
const streamRouteBodyResultFor: RpcStreamRouteBodyResultFor<
  Routes,
  typeof streamRouteBodyAlias
> = streamRouteBodyResult;
// @ts-expect-error route-unary body result helpers reject route-stream bodies.
const _wrongRouteUnaryBodyResultFor: RpcRouteUnaryBodyResultFor<
  Routes,
  typeof streamRouteBodyAlias
> = routeEnvelopeUnion;
// @ts-expect-error route-stream body result helpers reject route-unary bodies.
const _wrongRouteStreamBodyResultFor: RpcRouteStreamBodyResultFor<
  Routes,
  typeof unaryRouteBodyAlias
> = streamRouteBodyResult;
unaryRouteBodyResult.valueOf();
streamRouteBodyResultFor.headers.get('content-type');
if (!(routeBodyResultFor instanceof Response)) {
  routeBodyResultFor.data.name.toUpperCase();
}
if (!(unaryRouteBodyResultFor instanceof Response)) {
  unaryRouteBodyResultFor.data.name.toUpperCase();
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
