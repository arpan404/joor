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
  isSerializedJsonEnvelope,
  listen,
  parseJson,
  serveBun,
  serveDeno,
  t,
  toJsonSchema,
  transportResultToResponse,
  validate,
  type ArrayChain,
  type BatchResults,
  type BunFetchOptionsArgs,
  type BunFetchOptionsFor,
  type BunFetchHandler,
  type BunRpcRequestHandlerOptionsArgs,
  type BunRpcRequestHandlerOptionsFor,
  type BunRpcRequestHandler,
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
  type ClientFetch,
  type ClientHeaderValues,
  type ClientOptions,
  type ClientProcedureHeaders,
  type CloudflareFetchHandler,
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
  type CompiledBodyResultFor as RootCompiledBodyResultFor,
  type CompiledDispatch as RootCompiledDispatch,
  type CompiledFixedUnaryDispatch as RootCompiledFixedUnaryDispatch,
  type CompiledRpcBodyResultHandlerFor as RootCompiledRpcBodyResultHandlerFor,
  type CompiledRpcRouteStreamBodyResultHandlerFor as RootCompiledRpcRouteStreamBodyResultHandlerFor,
  type CompiledRpcRouteStreamTransportBodyResultHandlerFor as RootCompiledRpcRouteStreamTransportBodyResultHandlerFor,
  type CompiledRpcRouteUnaryBodyResultHandlerFor as RootCompiledRpcRouteUnaryBodyResultHandlerFor,
  type CompiledRpcRouteUnaryTransportBodyResultHandlerFor as RootCompiledRpcRouteUnaryTransportBodyResultHandlerFor,
  type CompiledRpcStreamRouteBodyResultHandlerFor as RootCompiledRpcStreamRouteBodyResultHandlerFor,
  type CompiledRpcStreamRouteTransportBodyResultHandlerFor as RootCompiledRpcStreamRouteTransportBodyResultHandlerFor,
  type CompiledRpcRequestHandler as RootCompiledRpcRequestHandler,
  type CompiledRpcTransportBodyResultHandlerFor as RootCompiledRpcTransportBodyResultHandlerFor,
  type CompiledRpcUnaryRouteBodyResultHandlerFor as RootCompiledRpcUnaryRouteBodyResultHandlerFor,
  type CompiledRpcUnaryRouteTransportBodyResultHandlerFor as RootCompiledRpcUnaryRouteTransportBodyResultHandlerFor,
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
  type DefineConfigFor,
  type DefineHandlerOptions,
  type DefineStreamRouteConfigFor,
  type DefineStreamRouteHandlerOptions,
  type DefineUnaryRouteConfigFor,
  type DefineUnaryRouteHandlerOptions,
  type HandlerHookContext,
  type HandlerHookContextFor,
  type HandlerHooks,
  type HandlerHooksFor,
  type HandlerOptionServices,
  type HandlerOptionsArgs,
  type HandlerOptionsArgsFor,
  type HandlerOptionsFor,
  type HandlerOptionsWithPreflightArgs,
  type HandlerOptionsWithTrailingArgs,
  type HandlerOptions,
  type JoorMiddleware,
  type JoorMiddlewareFor,
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
  type JoorManifestStreamRouteResponseHeaders,
  type JoorManifestStreamRouteRequestOptions,
  type JoorManifestRouteProtocolRequest,
  type JoorManifestRouteProtocolRequestUnion,
  type JoorManifestRouteRequest,
  type JoorManifestRouteRequestOptions,
  type JoorManifestRouteRequestUnion,
  type JoorManifestRouteResponseHeaders,
  type JoorManifestRouteRequiresHeaders,
  type JoorManifestRouteRequiresResponseHeaders,
  type JoorManifestStreamRouteRequiresHeaders,
  type JoorManifestStreamRouteRequiresResponseHeaders,
  type JoorManifestRequiredServices,
  type JoorManifestRouteServices,
  type JoorManifestRouteStreamEvent,
  type JoorManifestRouteStreamProtocolRequest,
  type JoorManifestRouteStreamProtocolRequestUnion,
  type JoorManifestRouteUnaryProtocolRequest,
  type JoorManifestRouteUnaryProtocolRequestUnion,
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
  type LegacyRpcTransportClient,
  type ListenOptionsArgs,
  type ListenOptionsFor,
  type ListenOptions,
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
  type NextStreamRouteHandlerOptionsArgs,
  type NextStreamRouteHandlerOptionsFor,
  type NextStreamRouteHandlersOptionsArgs,
  type NextStreamRouteHandlersOptionsFor,
  type NextRouteHandler,
  type NextRouteHandlers,
  type NextRouteHandlersOptionsArgs,
  type NextRouteHandlersOptionsFor,
  type NextUnaryRouteHandlerOptionsArgs,
  type NextUnaryRouteHandlerOptionsFor,
  type NextUnaryRouteHandlersOptionsArgs,
  type NextUnaryRouteHandlersOptionsFor,
  type NodeRpcRequestHandlerOptionsArgs,
  type NodeRpcRequestHandlerOptionsFor,
  type NodeServer,
  type NodeStreamRouteRpcRequestHandlerOptionsFor,
  type NodeStreamRouteRpcRequestHandlerOptionsArgs,
  type NodeTransportBodyResult,
  type NodeTransportBodyResultFor,
  type NodeTransportBodyResultHandler,
  type NodeTransportBodyResultHandlerFor,
  type NodeStreamRouteTransportBodyResultFor,
  type NodeStreamRouteTransportBodyResultHandlerFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsArgs,
  type NodeUnaryRouteTransportBodyResultFor,
  type NodeUnaryRouteTransportBodyResultHandlerFor,
  type StreamRouteListenOptionsArgs,
  type StreamRouteListenOptionsFor,
  type UnaryRouteListenOptionsArgs,
  type UnaryRouteListenOptionsFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsFor,
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
  type SerializedJsonEnvelope,
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
  type RpcManifestRouteRequest,
  type RpcManifestRouteRequestOptions,
  type RpcManifestRouteRequestUnion,
  type RpcManifestRouteResponseHeaders,
  type RpcManifestRouteRequiresHeaders,
  type RpcManifestRouteRequiresResponseHeaders,
  type RpcManifestRequiredServices,
  type RpcManifestRouteServices,
  type RpcManifestRoutes,
  type RpcManifestRouteStreamEvent,
  type RpcManifestRouteStreamProtocolRequest,
  type RpcManifestRouteStreamProtocolRequestUnion,
  type RpcManifestRouteUnaryProtocolRequest,
  type RpcManifestRouteUnaryProtocolRequestUnion,
  type RpcManifestStreamRouteProtocolRequest,
  type RpcManifestStreamRouteProtocolRequestUnion,
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
  type RpcManifestUnaryRouteBatchResults,
  type RpcManifestUnaryRouteProcedure,
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
  type RpcRouteBatchRequest,
  type RpcRouteProtocolRequest,
  type RpcRouteProtocolRequestUnion,
  type RpcRouteStreamProtocolRequest,
  type RpcRouteStreamProtocolRequestUnion,
  type RpcRouteUnaryProtocolRequest,
  type RpcRouteUnaryProtocolRequestUnion,
  type RouteRpcTransportClient,
  type RpcManifestClientOptions,
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
  type RpcStreamRouteProcedure,
  type RpcStreamRouteResponseHeaders,
  type RpcStreamRouteRequiresHeaders,
  type RpcStreamRouteRequiresResponseHeaders,
  type RpcStreamRouteRequestOptions,
  type RpcRouteClientArgs,
  type RpcRouteClientHeaders,
  type RpcRouteRequestOptions,
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
  type RpcUnaryRouteBatchResults,
  type RpcUnaryRouteProcedure,
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
  type Schema,
  type SchemaMeta,
  type StringSchema,
  type NumberSchema,
  type ValidationResult,
  type OpenApiSchema,
  type JsonValue,
  type NetlifyFetchOptionsArgs as RootSubpathNetlifyFetchOptionsArgs,
  type NetlifyFetchOptionsFor,
  type VercelFetchHandler,
  type VercelFetchOptionsArgs,
  type VercelFetchOptionsFor,
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
  type DefineStreamRouteConfigFor as ContextSubpathDefineStreamRouteConfigFor,
  type DefineUnaryRouteConfigFor as ContextSubpathDefineUnaryRouteConfigFor,
  type JoorConfig as ContextSubpathConfig,
  type JoorConfigFor as ContextSubpathConfigFor,
  type JoorConfigContext as ContextSubpathConfigContext,
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
  type JoorConfigFor as ConfigSubpathConfigFor,
  type JoorConfigContext as ConfigSubpathConfigContext,
  type JoorStreamRouteConfigFor as ConfigSubpathStreamRouteConfigFor,
  type JoorUnaryRouteConfigFor as ConfigSubpathUnaryRouteConfigFor,
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
  type DefineHandlerOptions as RpcSubpathDefineHandlerOptions,
  type DefineStreamRouteHandlerOptions as RpcSubpathDefineStreamRouteHandlerOptions,
  type DefineUnaryRouteHandlerOptions as RpcSubpathDefineUnaryRouteHandlerOptions,
  type HandlerOptionsArgs as RpcSubpathHandlerOptionsArgs,
  type HandlerOptionsArgsFor as RpcSubpathHandlerOptionsArgsFor,
  type HandlerOptionsWithPreflightArgs as RpcSubpathHandlerOptionsWithPreflightArgs,
  type HandlerOptionsWithTrailingArgs as RpcSubpathHandlerOptionsWithTrailingArgs,
  type JoorMiddlewareFor as RpcSubpathJoorMiddlewareFor,
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
  type RpcManifestUnaryRouteClientArgs as RpcSubpathManifestUnaryRouteClientArgs,
  type RpcManifestUnaryRouteBodyHandler as RpcSubpathManifestUnaryRouteBodyHandler,
  type RpcManifestUnaryRouteBodyResultHandler as RpcSubpathManifestUnaryRouteBodyResultHandler,
  type RpcManifestUnaryRouteTransportBodyResultHandler as RpcSubpathManifestUnaryRouteTransportBodyResultHandler,
  type RpcManifestUnaryRouteProcedure as RpcSubpathManifestUnaryRouteProcedure,
  type RpcManifestUnaryRouteRequestOptions as RpcSubpathManifestUnaryRouteRequestOptions,
  type RpcManifestRouteClientArgs as RpcSubpathManifestRouteClientArgs,
  type RpcManifestRouteClientHeaders as RpcSubpathManifestRouteClientHeaders,
  type RpcManifestRouteRequest as RpcSubpathManifestRouteRequest,
  type RpcManifestRouteRequestOptions as RpcSubpathManifestRouteRequestOptions,
  type RpcManifestRouteRequestUnion as RpcSubpathManifestRouteRequestUnion,
  type RpcManifestRouteStreamEvent as RpcSubpathManifestRouteStreamEvent,
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
  type RpcStreamRouteClientArgs as RpcSubpathStreamRouteClientArgs,
  type RpcStreamRouteProcedure as RpcSubpathStreamRouteProcedure,
  type RpcStreamRouteOutput as RpcSubpathStreamRouteOutput,
  type RpcStreamRouteResponseHeaders as RpcSubpathStreamRouteResponseHeaders,
  type RpcStreamRouteRequestOptions as RpcSubpathStreamRouteRequestOptions,
  type RpcRouteRequestOptions as RpcSubpathRouteRequestOptions,
  type RpcRouteRequiresHeaders as RpcSubpathRouteRequiresHeaders,
  type RpcRouteRequiresResponseHeaders as RpcSubpathRouteRequiresResponseHeaders,
  type RpcRouteProtocolRequest as RpcSubpathRouteProtocolRequest,
  type RpcUnaryRouteClientArgs as RpcSubpathUnaryRouteClientArgs,
  type RpcUnaryRouteProcedure as RpcSubpathUnaryRouteProcedure,
  type RpcUnaryRouteRequestOptions as RpcSubpathUnaryRouteRequestOptions,
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
  type JoorManifestRouteOutput as JoorSubpathManifestRouteOutput,
  type JoorManifestStreamRouteClientArgs as JoorSubpathManifestStreamRouteClientArgs,
  type JoorManifestStreamRouteBodyHandler as JoorSubpathManifestStreamRouteBodyHandler,
  type JoorManifestStreamRouteBodyResultHandler as JoorSubpathManifestStreamRouteBodyResultHandler,
  type JoorManifestStreamRouteTransportBodyResultHandler as JoorSubpathManifestStreamRouteTransportBodyResultHandler,
  type JoorManifestStreamRouteProcedure as JoorSubpathManifestStreamRouteProcedure,
  type JoorManifestStreamRouteOutput as JoorSubpathManifestStreamRouteOutput,
  type JoorManifestStreamRouteResponseHeaders as JoorSubpathManifestStreamRouteResponseHeaders,
  type JoorManifestStreamRouteRequestOptions as JoorSubpathManifestStreamRouteRequestOptions,
  type JoorManifestUnaryRouteClientArgs as JoorSubpathManifestUnaryRouteClientArgs,
  type JoorManifestUnaryRouteBodyHandler as JoorSubpathManifestUnaryRouteBodyHandler,
  type JoorManifestUnaryRouteBodyResultHandler as JoorSubpathManifestUnaryRouteBodyResultHandler,
  type JoorManifestUnaryRouteTransportBodyResultHandler as JoorSubpathManifestUnaryRouteTransportBodyResultHandler,
  type JoorManifestUnaryRouteProcedure as JoorSubpathManifestUnaryRouteProcedure,
  type JoorManifestUnaryRouteRequestOptions as JoorSubpathManifestUnaryRouteRequestOptions,
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
  type DenoRpcRequestHandlerOptionsArgs as StandaloneDenoRpcRequestHandlerOptionsArgs,
  type DenoRpcRequestHandlerOptionsFor as StandaloneDenoRpcRequestHandlerOptionsFor,
  type DenoRpcRequestHandler as StandaloneDenoRpcRequestHandler,
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
  createDenoCompiledTransportRequestHandlerWithPath,
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
  CompiledBodyResultFor,
  CompiledDispatch,
  CompiledFixedUnaryDispatch,
  CompiledRpcBodyResultHandlerFor,
  CompiledRpcRouteStreamBodyResultHandlerFor,
  CompiledRpcRouteStreamTransportBodyResultHandlerFor,
  CompiledRpcRouteUnaryBodyResultHandlerFor,
  CompiledRpcRouteUnaryTransportBodyResultHandlerFor,
  CompiledRpcStreamRouteBodyResultHandlerFor,
  CompiledRpcStreamRouteTransportBodyResultHandlerFor,
  CompiledRpcRequestHandler,
  CompiledRpcTransportBodyResultHandlerFor,
  CompiledRpcUnaryRouteBodyResultHandlerFor,
  CompiledRpcUnaryRouteTransportBodyResultHandlerFor,
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
  createBunTransportRequestHandler as createRuntimeSubpathBunTransportRequestHandler,
  createCloudflareWorker as createRuntimeSubpathCloudflareWorker,
  createDenoTransportRequestHandler as createRuntimeSubpathDenoTransportRequestHandler,
  createJoorHandler as createRuntimeSubpathJoorHandler,
  createNetlifyFetch as createRuntimeSubpathNetlifyFetch,
  createNextHandler as createRuntimeSubpathNextHandler,
  createNextRouteHandlers as createRuntimeSubpathNextRouteHandlers,
  createNodeTransportRequestHandler as createRuntimeSubpathNodeTransportRequestHandler,
  createVercelFetch as createRuntimeSubpathVercelFetch,
  isSerializedJsonEnvelope as isRuntimeSubpathSerializedJsonEnvelope,
  transportResultToResponse as runtimeSubpathTransportResultToResponse,
  type BunFetchOptionsArgs as RuntimeSubpathBunFetchOptionsArgs,
  type BunFetchOptionsFor as RuntimeSubpathBunFetchOptionsFor,
  type BunFetchHandler as RuntimeSubpathBunFetchHandler,
  type BunRpcRequestHandlerOptionsArgs as RuntimeSubpathBunRpcRequestHandlerOptionsArgs,
  type BunRpcRequestHandlerOptionsFor as RuntimeSubpathBunRpcRequestHandlerOptionsFor,
  type BunRpcRequestHandler as RuntimeSubpathBunRpcRequestHandler,
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
  type CloudflareRouteStreamWorkerOptionsArgs as RuntimeSubpathCloudflareRouteStreamWorkerOptionsArgs,
  type CloudflareRouteStreamWorkerOptionsFor as RuntimeSubpathCloudflareRouteStreamWorkerOptionsFor,
  type CloudflareRouteUnaryWorkerOptionsArgs as RuntimeSubpathCloudflareRouteUnaryWorkerOptionsArgs,
  type CloudflareRouteUnaryWorkerOptionsFor as RuntimeSubpathCloudflareRouteUnaryWorkerOptionsFor,
  type CloudflareStreamRouteWorkerOptionsArgs as RuntimeSubpathCloudflareStreamRouteWorkerOptionsArgs,
  type CloudflareStreamRouteWorkerOptionsFor as RuntimeSubpathCloudflareStreamRouteWorkerOptionsFor,
  type CloudflareUnaryRouteWorkerOptionsArgs as RuntimeSubpathCloudflareUnaryRouteWorkerOptionsArgs,
  type CloudflareUnaryRouteWorkerOptionsFor as RuntimeSubpathCloudflareUnaryRouteWorkerOptionsFor,
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
  type NextRouteHandler as RuntimeSubpathNextRouteHandler,
  type NextRouteHandlers as RuntimeSubpathNextRouteHandlers,
  type NextRouteHandlersOptionsArgs as RuntimeSubpathNextRouteHandlersOptionsArgs,
  type NextRouteHandlersOptionsFor as RuntimeSubpathNextRouteHandlersOptionsFor,
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
  type NodeRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeRpcRequestHandlerOptionsArgs,
  type NodeRpcRequestHandlerOptionsFor as RuntimeSubpathNodeRpcRequestHandlerOptionsFor,
  type NodeStreamRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs,
  type NodeStreamRouteRpcRequestHandlerOptionsFor as RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsFor,
  type NodeStreamRouteTransportBodyResultFor as RuntimeSubpathNodeStreamRouteTransportBodyResultFor,
  type NodeStreamRouteTransportBodyResultHandlerFor as RuntimeSubpathNodeStreamRouteTransportBodyResultHandlerFor,
  type ListenOptionsArgs as RuntimeSubpathListenOptionsArgs,
  type StreamRouteListenOptionsArgs as RuntimeSubpathStreamRouteListenOptionsArgs,
  type StreamRouteListenOptionsFor as RuntimeSubpathStreamRouteListenOptionsFor,
  type UnaryRouteListenOptionsArgs as RuntimeSubpathUnaryRouteListenOptionsArgs,
  type UnaryRouteListenOptionsFor as RuntimeSubpathUnaryRouteListenOptionsFor,
  type NodeUnaryRouteRpcRequestHandlerOptionsArgs as RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs,
  type NodeUnaryRouteRpcRequestHandlerOptionsFor as RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsFor,
  type NodeUnaryRouteTransportBodyResultFor as RuntimeSubpathNodeUnaryRouteTransportBodyResultFor,
  type NodeUnaryRouteTransportBodyResultHandlerFor as RuntimeSubpathNodeUnaryRouteTransportBodyResultHandlerFor,
  type SerializedJsonEnvelope as RuntimeSubpathSerializedJsonEnvelope,
  type TransportBodyResult as RuntimeSubpathTransportBodyResult,
  type TransportBodyResultFor as RuntimeSubpathTransportBodyResultFor,
  type VercelFetchHandler as RuntimeSubpathVercelFetchHandler,
  type VercelFetchOptionsArgs as RuntimeSubpathVercelFetchOptionsArgs,
  type VercelFetchOptionsFor as RuntimeSubpathVercelFetchOptionsFor,
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
const routeUnaryProcedure: RpcUnaryRouteProcedure<Routes, 'users.get'> =
  procedure;
routeUnaryProcedure.output;
const rpcSubpathRouteUnaryProcedure: RpcSubpathUnaryRouteProcedure<
  Routes,
  'users.get'
> = routeUnaryProcedure;
rpcSubpathRouteUnaryProcedure.output;
const routeStreamProcedure: RpcStreamRouteProcedure<Routes, 'users.watch'> =
  streamProcedure;
routeStreamProcedure.stream;
const rpcSubpathRouteStreamProcedure: RpcSubpathStreamRouteProcedure<
  Routes,
  'users.watch'
> = routeStreamProcedure;
rpcSubpathRouteStreamProcedure.stream;
const routeUnaryInput: RpcUnaryRouteInput<Routes, 'users.get'> = { id: '1' };
routeUnaryInput.id.toUpperCase();
const routeStreamInput: RpcStreamRouteInput<Routes, 'users.watch'> = {
  userId: '1',
};
routeStreamInput.userId.toUpperCase();
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
const routeUnaryOutput: RpcUnaryRouteOutput<Routes, 'users.get'> = {
  id: '1',
  name: 'Ada',
};
routeUnaryOutput.name.toUpperCase();
const routeUnaryHeaders: RpcUnaryRouteHeaders<Routes, 'users.get'> = {
  'x-tenant-id': 'tenant-1',
};
routeUnaryHeaders['x-tenant-id'].toUpperCase();
const routeStreamHeaders: RpcStreamRouteHeaders<Routes, 'users.watch'> = {};
routeStreamHeaders.valueOf();
const routeUnaryClientHeaders: RpcUnaryRouteClientHeaders<Routes, 'users.get'> =
  { 'x-tenant-id': 'tenant-1', authorization: undefined };
routeUnaryClientHeaders.authorization?.toUpperCase();
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
routeUnaryResponseHeaders['cache-control'].toUpperCase();
const routeUnaryHasHeaders: RpcUnaryRouteHasHeaders<Routes, 'users.get'> = true;
routeUnaryHasHeaders.valueOf();
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
routeUnaryRequiresResponseHeaders.valueOf();
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
routeUnaryErrorCode.toUpperCase();
const routeUnaryErrorDetails: RpcUnaryRouteErrorDetails<
  Routes,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
routeUnaryErrorDetails.message.toUpperCase();
const routeStreamErrorCode: RpcStreamRouteErrorCode<Routes, 'users.watch'> =
  'VALIDATION_ERROR';
routeStreamErrorCode.toUpperCase();
const routeStreamErrorDetails: RpcStreamRouteErrorDetails<
  Routes,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
routeStreamErrorDetails.valueOf();
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
const manifestUnaryRouteConfigShape: JoorUnaryRouteConfigFor<
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
const manifestStreamRouteConfigShape: JoorStreamRouteConfigFor<
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
const manifestUnaryRouteConfigFactory: DefineUnaryRouteConfigFor<
  typeof manifest
> = defineConfigFor(manifest);
const manifestStreamRouteConfigFactory: DefineStreamRouteConfigFor<
  typeof manifest
> = defineConfigFor(manifest);
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
const rootManifestUnaryClientShape: RpcManifestUnaryRouteTransportClient<
  typeof manifest
> = rootManifestClient;
rootManifestUnaryClientShape.call('users.authenticated', { ok: true });
rootManifestUnaryClientShape.batch([
  rootManifestUnaryClientShape.request('users.authenticated', { ok: true }),
] as const);
const rootManifestStreamClientShape: RpcManifestStreamRouteTransportClient<
  typeof manifest
> = rootManifestClient;
rootManifestStreamClientShape.stream('users.watch', { userId: '1' });
const rpcSubpathManifestClientShape: RpcSubpathManifestTransportClient<
  typeof manifest
> = rootManifestClient;
rpcSubpathManifestClientShape.call('users.authenticated', { ok: true });
const joorManifestClientShape: JoorManifestTransportClient<typeof manifest> =
  rootManifestClient;
const joorManifestUnaryClientShape: JoorManifestUnaryRouteTransportClient<
  typeof manifest
> = joorManifestClientShape;
joorManifestUnaryClientShape.call('users.authenticated', { ok: true });
const joorManifestStreamClientShape: JoorManifestStreamRouteTransportClient<
  typeof manifest
> = joorManifestClientShape;
joorManifestStreamClientShape.stream('users.watch', { userId: '1' });
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
const manifestRouteInput: JoorManifestRouteInput<typeof manifest, 'users.get'> =
  { id: '1' };
manifestRouteInput.id.toUpperCase();
const manifestRouteProcedure: JoorManifestRouteProcedure<
  typeof manifest,
  'users.get'
> = procedure;
manifestRouteProcedure.output;
const manifestUnaryRouteProcedure: JoorManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = manifestRouteProcedure;
manifestUnaryRouteProcedure.output;
const manifestStreamRouteProcedure: JoorManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = streamProcedure;
manifestStreamRouteProcedure.stream;
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
manifestUnaryRouteInput.id.toUpperCase();
const manifestStreamRouteInput: JoorManifestStreamRouteInput<
  typeof manifest,
  'users.watch'
> = { userId: '1' };
manifestStreamRouteInput.userId.toUpperCase();
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
manifestUnaryRouteOutput.name.toUpperCase();
const manifestUnaryRouteHeaders: JoorManifestUnaryRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
manifestUnaryRouteHeaders['x-tenant-id'].toUpperCase();
const manifestStreamRouteHeaders: JoorManifestStreamRouteHeaders<
  typeof manifest,
  'users.watch'
> = {};
manifestStreamRouteHeaders.valueOf();
const manifestUnaryRouteClientHeaders: JoorManifestUnaryRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1', authorization: undefined };
manifestUnaryRouteClientHeaders.authorization?.toUpperCase();
const manifestStreamRouteClientHeaders: JoorManifestStreamRouteClientHeaders<
  typeof manifest,
  'users.watch'
> = {};
manifestStreamRouteClientHeaders.valueOf();
const manifestUnaryRouteResponseHeaders: JoorManifestUnaryRouteResponseHeaders<
  typeof manifest,
  'users.get'
> = { 'cache-control': 'private' };
manifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
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
manifestUnaryRouteRequiresResponseHeaders.valueOf();
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
manifestStreamRouteError.code.toUpperCase();
const manifestUnaryRouteErrorCode: JoorManifestUnaryRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
manifestUnaryRouteErrorCode.toUpperCase();
const manifestUnaryRouteErrorDetails: JoorManifestUnaryRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
manifestUnaryRouteErrorDetails.message.toUpperCase();
const manifestStreamRouteErrorCode: JoorManifestStreamRouteErrorCode<
  typeof manifest,
  'users.watch'
> = 'VALIDATION_ERROR';
manifestStreamRouteErrorCode.toUpperCase();
const manifestStreamRouteErrorDetails: JoorManifestStreamRouteErrorDetails<
  typeof manifest,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
manifestStreamRouteErrorDetails.valueOf();
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
manifestRouteErrorDetails.message.toUpperCase();
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
manifestRouteEnvelope.id.toUpperCase();
const manifestUnaryRouteEnvelope: JoorManifestUnaryRouteEnvelope<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
manifestUnaryRouteEnvelope.id.toUpperCase();
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
const manifestUnaryRouteResult: JoorManifestUnaryRouteResult<
  typeof manifest,
  'users.get'
> = manifestRouteResult;
manifestUnaryRouteResult.id.toUpperCase();
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
manifestRouteRequest.headers['x-tenant-id'].toUpperCase();
const manifestUnaryRouteRequest: JoorManifestUnaryRouteRequest<
  typeof manifest,
  'users.get'
> = manifestRouteRequest;
manifestUnaryRouteRequest.input.id.toUpperCase();
const manifestRouteRequestOptions: JoorManifestRouteRequestOptions<
  typeof manifest,
  'users.get'
> = { headers: { authorization: undefined, 'x-tenant-id': 'tenant-1' } };
const manifestUnaryRouteRequestOptions: JoorManifestUnaryRouteRequestOptions<
  typeof manifest,
  'users.get'
> = manifestRouteRequestOptions;
const manifestStreamRouteRequestOptions: JoorManifestStreamRouteRequestOptions<
  typeof manifest,
  'users.watch'
> = {};
manifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
manifestUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
const manifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }, manifestRouteRequestOptions];
const manifestUnaryRouteClientArgs: JoorManifestUnaryRouteClientArgs<
  typeof manifest,
  'users.get'
> = manifestRouteClientArgs;
const manifestStreamRouteClientArgs: JoorManifestStreamRouteClientArgs<
  typeof manifest,
  'users.watch'
> = [{ userId: '1' }, manifestStreamRouteRequestOptions];
manifestRouteClientArgs[0].id.toUpperCase();
manifestUnaryRouteClientArgs[0].id.toUpperCase();
manifestStreamRouteClientArgs[0].userId.toUpperCase();
const optionalManifestRouteClientArgs: JoorManifestRouteClientArgs<
  typeof manifest,
  'users.authenticated'
> = [{ ok: true }];
optionalManifestRouteClientArgs[0].ok.valueOf();
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
const manifestUnaryRouteBatchResults: JoorManifestUnaryRouteBatchResults<
  typeof manifest,
  [typeof manifestUnaryRouteRequest]
> = manifestRouteBatchResults;
manifestRouteBatchResults[0].id.toUpperCase();
manifestUnaryRouteBatchResults[0].id.toUpperCase();
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
const manifestUnaryRouteProtocolRequest: JoorManifestUnaryRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = manifestUnaryProtocolRequest;
manifestUnaryRouteProtocolRequest.input.id.toUpperCase();
const manifestUnaryRouteBody: JoorManifestUnaryRouteBody<typeof manifest> =
  manifestUnaryRouteProtocolRequest;
manifestUnaryRouteBody.input.id.toUpperCase();
const manifestUnaryProtocolRequestUnion: JoorManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = manifestUnaryProtocolRequest;
manifestUnaryProtocolRequestUnion.id.toUpperCase();
const manifestUnaryRouteProtocolRequestUnion: JoorManifestUnaryRouteProtocolRequestUnion<
  typeof manifest
> = manifestUnaryRouteProtocolRequest;
manifestUnaryRouteProtocolRequestUnion.id.toUpperCase();
const manifestStreamProtocolRequest: JoorManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
manifestStreamProtocolRequest.input.userId.toUpperCase();
const manifestStreamRouteProtocolRequest: JoorManifestStreamRouteProtocolRequest<
  typeof manifest,
  'users.watch'
> = manifestStreamProtocolRequest;
manifestStreamRouteProtocolRequest.input.userId.toUpperCase();
const manifestStreamRouteBody: JoorManifestStreamRouteBody<typeof manifest> =
  manifestStreamRouteProtocolRequest;
manifestStreamRouteBody.input.userId.toUpperCase();
const manifestStreamProtocolRequestUnion: JoorManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = manifestStreamProtocolRequest;
manifestStreamProtocolRequestUnion.input.userId.toUpperCase();
const manifestStreamRouteProtocolRequestUnion: JoorManifestStreamRouteProtocolRequestUnion<
  typeof manifest
> = manifestStreamRouteProtocolRequest;
manifestStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const manifestBatchRequest: JoorManifestRouteBatchRequest<
  typeof manifest,
  [typeof manifestUnaryProtocolRequest]
> = [manifestUnaryProtocolRequest];
manifestBatchRequest[0].input.id.toUpperCase();
const manifestUnaryRouteBatchRequest: JoorManifestUnaryRouteBatchRequest<
  typeof manifest,
  [typeof manifestUnaryRouteProtocolRequest]
> = [manifestUnaryRouteProtocolRequest];
manifestUnaryRouteBatchRequest[0].input.id.toUpperCase();
const readonlyManifestBatchRequest = [manifestUnaryProtocolRequest] as const;
const manifestReadonlyBatchBody: JoorManifestRouteBody<typeof manifest> =
  readonlyManifestBatchRequest;
manifestReadonlyBatchBody.length.toFixed();
const manifestBatchBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof readonlyManifestBatchRequest
> = [manifestRouteEnvelope];
const manifestUnaryRouteBodyResult: JoorManifestUnaryRouteBodyResult<
  typeof manifest
> = manifestBatchBodyResultFor;
if (!(manifestBatchBodyResultFor instanceof Response)) {
  const first = manifestBatchBodyResultFor[0];
  if (first.ok) first.data.name.toUpperCase();
}
const manifestRouteBodyResultFor: JoorManifestRouteBodyResultFor<
  typeof manifest,
  typeof manifestProtocolRequest
> = manifestRouteEnvelope;
const manifestUnaryRouteBodyResultFor: JoorManifestUnaryRouteBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = manifestRouteEnvelope;
const manifestStreamRouteBodyResult: JoorManifestStreamRouteBodyResult<
  typeof manifest
> = new Response();
const manifestStreamRouteBodyResultFor: JoorManifestStreamRouteBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = manifestStreamRouteBodyResult;
manifestUnaryRouteBodyResult.valueOf();
manifestStreamRouteBodyResultFor.headers.get('content-type');
if (!(manifestRouteBodyResultFor instanceof Response)) {
  if (manifestRouteBodyResultFor.ok)
    manifestRouteBodyResultFor.data.name.toUpperCase();
}
if (!(manifestUnaryRouteBodyResultFor instanceof Response)) {
  if (manifestUnaryRouteBodyResultFor.ok)
    manifestUnaryRouteBodyResultFor.data.name.toUpperCase();
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
const publicManifestRouteProcedure: RpcManifestRouteProcedure<
  typeof manifest,
  'users.get'
> = procedure;
publicManifestRouteProcedure.output;
const publicManifestUnaryRouteProcedure: RpcManifestUnaryRouteProcedure<
  typeof manifest,
  'users.get'
> = publicManifestRouteProcedure;
publicManifestUnaryRouteProcedure.output;
const publicManifestStreamRouteProcedure: RpcManifestStreamRouteProcedure<
  typeof manifest,
  'users.watch'
> = streamProcedure;
publicManifestStreamRouteProcedure.stream;
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
publicManifestUnaryRouteInput.id.toUpperCase();
const publicManifestStreamRouteInput: RpcManifestStreamRouteInput<
  typeof manifest,
  'users.watch'
> = { userId: '1' };
publicManifestStreamRouteInput.userId.toUpperCase();
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
publicManifestUnaryRouteOutput.name.toUpperCase();
const publicManifestUnaryRouteHeaders: RpcManifestUnaryRouteHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1' };
publicManifestUnaryRouteHeaders['x-tenant-id'].toUpperCase();
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
publicManifestUnaryRouteResponseHeaders['cache-control'].toUpperCase();
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
publicManifestUnaryRouteRequiresResponseHeaders.valueOf();
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
publicManifestStreamRouteError.code.toUpperCase();
const publicManifestUnaryRouteErrorCode: RpcManifestUnaryRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
publicManifestUnaryRouteErrorCode.toUpperCase();
const publicManifestUnaryRouteErrorDetails: RpcManifestUnaryRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
publicManifestUnaryRouteErrorDetails.message.toUpperCase();
const publicManifestStreamRouteErrorCode: RpcManifestStreamRouteErrorCode<
  typeof manifest,
  'users.watch'
> = 'VALIDATION_ERROR';
publicManifestStreamRouteErrorCode.toUpperCase();
const publicManifestStreamRouteErrorDetails: RpcManifestStreamRouteErrorDetails<
  typeof manifest,
  'users.watch',
  'VALIDATION_ERROR'
> = { issue: 'input' };
publicManifestStreamRouteErrorDetails.valueOf();
const publicManifestRouteInput: RpcManifestRouteInput<
  typeof manifest,
  'users.get'
> = { id: '1' };
publicManifestRouteInput.id.toUpperCase();
const rpcSubpathManifestRouteInput: RpcSubpathManifestRouteInput<
  typeof manifest,
  'users.get'
> = publicManifestRouteInput;
rpcSubpathManifestRouteInput.id.toUpperCase();
const publicManifestRouteOutput: RpcManifestRouteOutput<
  typeof manifest,
  'users.get'
> = { id: '1', name: 'Ada' };
publicManifestRouteOutput.name.toUpperCase();
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
publicManifestRouteHeaders['x-tenant-id'].toUpperCase();
const publicManifestRouteClientHeaders: RpcManifestRouteClientHeaders<
  typeof manifest,
  'users.get'
> = { 'x-tenant-id': 'tenant-1', authorization: undefined };
publicManifestRouteClientHeaders.authorization?.toUpperCase();
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
const publicManifestUnaryRouteRequestOptions: RpcManifestUnaryRouteRequestOptions<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequestOptions;
const publicManifestStreamRouteRequestOptions: RpcManifestStreamRouteRequestOptions<
  typeof manifest,
  'users.watch'
> = {};
publicManifestRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
publicManifestUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
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
const publicManifestUnaryRouteClientArgs: RpcManifestUnaryRouteClientArgs<
  typeof manifest,
  'users.get'
> = publicManifestRouteClientArgs;
const publicManifestStreamRouteClientArgs: RpcManifestStreamRouteClientArgs<
  typeof manifest,
  'users.watch'
> = [{ userId: '1' }, publicManifestStreamRouteRequestOptions];
publicManifestRouteClientArgs[0].id.toUpperCase();
publicManifestUnaryRouteClientArgs[0].id.toUpperCase();
publicManifestStreamRouteClientArgs[0].userId.toUpperCase();
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
// @ts-expect-error required public manifest route headers need options.
const _missingPublicManifestRouteClientArgs: RpcManifestRouteClientArgs<
  typeof manifest,
  'users.get'
> = [{ id: '1' }];
_missingPublicManifestRouteClientArgs[0].id.toUpperCase();
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
publicManifestRouteRequiresResponseHeaders.valueOf();
const publicManifestRouteError: RpcManifestRouteError<
  typeof manifest,
  'users.get'
> = {
  code: 'NOT_FOUND',
  message: 'Missing',
  status: 404,
  details: { message: 'Missing' },
};
publicManifestRouteError.code.toUpperCase();
const publicManifestRouteErrorCode: RpcManifestRouteErrorCode<
  typeof manifest,
  'users.get'
> = 'NOT_FOUND';
publicManifestRouteErrorCode.toUpperCase();
const publicManifestRouteErrorDetails: RpcManifestRouteErrorDetails<
  typeof manifest,
  'users.get',
  'NOT_FOUND'
> = { message: 'Missing' };
publicManifestRouteErrorDetails.message.toUpperCase();
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
const rpcSubpathManifestRouteStreamEvent: RpcSubpathManifestRouteStreamEvent<
  typeof manifest,
  'users.watch'
> = publicManifestRouteStreamEvent;
rpcSubpathManifestRouteStreamEvent.userId.toUpperCase();
const publicManifestProtocolRequest: RpcManifestRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = { id: 'users.get', input: { id: '1' } };
publicManifestProtocolRequest.input.id.toUpperCase();
const publicManifestProtocolRequestUnion: RpcManifestRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestProtocolRequest;
publicManifestProtocolRequestUnion.id.toUpperCase();
const publicManifestRouteRequest: RpcManifestRouteRequest<
  typeof manifest,
  'users.get'
> = manifestRouteRequest;
publicManifestRouteRequest.headers['x-tenant-id'].toUpperCase();
const publicManifestUnaryRouteRequest: RpcManifestUnaryRouteRequest<
  typeof manifest,
  'users.get'
> = publicManifestRouteRequest;
publicManifestUnaryRouteRequest.input.id.toUpperCase();
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
publicManifestUnaryProtocolRequest.input.id.toUpperCase();
const publicManifestUnaryRouteProtocolRequest: RpcManifestUnaryRouteProtocolRequest<
  typeof manifest,
  'users.get'
> = publicManifestUnaryProtocolRequest;
publicManifestUnaryRouteProtocolRequest.input.id.toUpperCase();
const publicManifestUnaryProtocolRequestUnion: RpcManifestRouteUnaryProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryProtocolRequest;
publicManifestUnaryProtocolRequestUnion.id.toUpperCase();
const publicManifestUnaryRouteProtocolRequestUnion: RpcManifestUnaryRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestUnaryRouteProtocolRequest;
publicManifestUnaryRouteProtocolRequestUnion.id.toUpperCase();
const publicManifestStreamProtocolRequest: RpcManifestRouteStreamProtocolRequest<
  typeof manifest,
  'users.watch'
> = { id: 'users.watch', input: { userId: '1' } };
publicManifestStreamProtocolRequest.input.userId.toUpperCase();
const publicManifestStreamRouteProtocolRequest: RpcManifestStreamRouteProtocolRequest<
  typeof manifest,
  'users.watch'
> = publicManifestStreamProtocolRequest;
publicManifestStreamRouteProtocolRequest.input.userId.toUpperCase();
const publicManifestStreamProtocolRequestUnion: RpcManifestRouteStreamProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamProtocolRequest;
publicManifestStreamProtocolRequestUnion.input.userId.toUpperCase();
const publicManifestStreamRouteProtocolRequestUnion: RpcManifestStreamRouteProtocolRequestUnion<
  typeof manifest
> = publicManifestStreamRouteProtocolRequest;
publicManifestStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const publicManifestBody: RpcManifestBody<typeof manifest> =
  publicManifestProtocolRequest;
const publicManifestUnaryRouteBody: RpcManifestUnaryRouteBody<typeof manifest> =
  publicManifestUnaryRouteProtocolRequest;
publicManifestUnaryRouteBody.input.id.toUpperCase();
const publicManifestStreamRouteBody: RpcManifestStreamRouteBody<
  typeof manifest
> = publicManifestStreamRouteProtocolRequest;
publicManifestStreamRouteBody.input.userId.toUpperCase();
const publicManifestUnaryRouteBodyResult: RpcManifestUnaryRouteBodyResult<
  typeof manifest
> = manifestRouteEnvelope;
const publicManifestUnaryRouteBodyResultFor: RpcManifestUnaryRouteBodyResultFor<
  typeof manifest,
  typeof publicManifestUnaryRouteBody
> = manifestRouteEnvelope;
const publicManifestStreamRouteBodyResult: RpcManifestStreamRouteBodyResult<
  typeof manifest
> = new Response();
const publicManifestStreamRouteBodyResultFor: RpcManifestStreamRouteBodyResultFor<
  typeof manifest,
  typeof publicManifestStreamRouteBody
> = publicManifestStreamRouteBodyResult;
publicManifestUnaryRouteBodyResult.valueOf();
publicManifestStreamRouteBodyResultFor.headers.get('content-type');
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
const publicManifestUnaryRouteBatchRequest: RpcManifestUnaryRouteBatchRequest<
  typeof manifest,
  [typeof publicManifestUnaryRouteProtocolRequest]
> = [publicManifestUnaryRouteProtocolRequest];
publicManifestUnaryRouteBatchRequest[0].input.id.toUpperCase();
const publicManifestBatchResults: RpcManifestRouteBatchResults<
  typeof manifest,
  readonly [typeof publicManifestRouteRequest]
> = [manifestRouteEnvelope];
const publicManifestUnaryRouteBatchResults: RpcManifestUnaryRouteBatchResults<
  typeof manifest,
  readonly [typeof publicManifestUnaryRouteRequest]
> = publicManifestBatchResults;
publicManifestUnaryRouteBatchResults[0].id.toUpperCase();
const publicManifestEnvelopeUnion: RpcManifestRouteEnvelopeUnion<
  typeof manifest
> = manifestRouteEnvelope;
const publicManifestUnaryEnvelope: RpcManifestUnaryRouteEnvelope<
  typeof manifest,
  'users.get'
> = manifestRouteEnvelope;
publicManifestUnaryEnvelope.id.toUpperCase();
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
publicManifestUnaryResult.id.toUpperCase();
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
const definedHandlerOptionsFactory: DefineHandlerOptions<typeof manifest> =
  defineHandlerOptions(manifest);
const definedUnaryRouteHandlerOptionsFactory: DefineUnaryRouteHandlerOptions<
  typeof manifest
> = defineHandlerOptions(manifest);
const definedStreamRouteHandlerOptionsFactory: DefineStreamRouteHandlerOptions<
  typeof manifest
> = defineHandlerOptions(manifest);
const definedUnaryRouteHandlerOptions = definedUnaryRouteHandlerOptionsFactory(
  manifestUnaryRouteHandlerOptions
);
const definedStreamRouteHandlerOptions =
  definedStreamRouteHandlerOptionsFactory(manifestStreamRouteHandlerOptions);
definedHandlerOptionsFactory({ plugins: [usersPlugin] as const });
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
  typeof manifestRouteRequest
> = {
  plugins: [usersPlugin] as const,
  hooks: exactManifestAwareHandlerHooks,
};
const exactManifestAwareConfig = defineConfigFor(manifest)<
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
>(exactManifestAwareConfigShape);
exactManifestAwareConfig.hooks?.beforeRequest?.(
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
const rpcSubpathDefinedUnaryRouteHandlerOptionsFactory: RpcSubpathDefineUnaryRouteHandlerOptions<
  typeof manifest
> = defineRpcSubpathHandlerOptions(manifest);
const rpcSubpathDefinedStreamRouteHandlerOptionsFactory: RpcSubpathDefineStreamRouteHandlerOptions<
  typeof manifest
> = defineRpcSubpathHandlerOptions(manifest);
rpcSubpathDefinedHandlerOptionsFactory({ plugins: [usersPlugin] as const });
rpcSubpathDefinedUnaryRouteHandlerOptionsFactory(
  rpcSubpathManifestUnaryRouteHandlerOptions
).hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
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

const publicManifestUnaryRouteBodyHandler: RpcManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const publicManifestStreamRouteBodyHandler: RpcManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const publicManifestUnaryRouteBodyResultHandler: RpcManifestUnaryRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const publicManifestStreamRouteBodyResultHandler: RpcManifestStreamRouteBodyResultHandler<
  typeof manifest
> = rpcBodyResultHandler;
const publicManifestUnaryRouteTransportBodyResultHandler: RpcManifestUnaryRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const publicManifestStreamRouteTransportBodyResultHandler: RpcManifestStreamRouteTransportBodyResultHandler<
  typeof manifest
> = rpcTransportResultHandler;
const publicJoorManifestUnaryRouteBodyHandler: JoorManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const publicJoorManifestStreamRouteBodyHandler: JoorManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
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
const rpcSubpathManifestUnaryRouteBodyHandler: RpcSubpathManifestUnaryRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
const rpcSubpathManifestStreamRouteBodyHandler: RpcSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
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
const joorSubpathManifestStreamRouteBodyHandler: JoorSubpathManifestStreamRouteBodyHandler<
  typeof manifest
> = rpcBodyHandler;
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

publicManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicManifestStreamRouteBodyHandler(
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
publicManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
).then((result) => {
  const exactResult: RpcManifestUnaryRouteBodyResultFor<
    typeof manifest,
    typeof manifestUnaryRouteBody
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
publicManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
).then((result) => result.headers.get('content-type'));
publicManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
).then((result) => {
  const exactResult: JoorManifestUnaryRouteBodyResultFor<
    typeof manifest,
    typeof manifestUnaryRouteBody
  > = result;
  if (!(exactResult instanceof Response)) {
    if (exactResult.ok) exactResult.data.name.toUpperCase();
  }
});
publicManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
).then((result) => result.headers.get('content-type'));
publicJoorManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
publicJoorManifestUnaryRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteBodyResultHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
publicJoorManifestUnaryRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
publicJoorManifestStreamRouteTransportBodyResultHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
rpcSubpathManifestUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
rpcSubpathManifestStreamRouteBodyHandler(
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
joorSubpathManifestStreamRouteBodyHandler(
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
const bunFetchOptions: BunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunUnaryRouteFetchOptions: BunUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunStreamRouteFetchOptions: BunStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const bunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunUnaryRouteRpcRequestHandlerOptions: BunUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunStreamRouteRpcRequestHandlerOptions: BunStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const bunFetchOptionsArgs: BunFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunFetchOptions];
const bunUnaryRouteFetchOptionsArgs: BunUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunUnaryRouteFetchOptions];
const bunStreamRouteFetchOptionsArgs: BunStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunStreamRouteFetchOptions];
const bunRpcRequestHandlerOptionsArgs: BunRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunRpcRequestHandlerOptions];
const bunUnaryRouteRpcRequestHandlerOptionsArgs: BunUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunUnaryRouteRpcRequestHandlerOptions];
const bunStreamRouteRpcRequestHandlerOptionsArgs: BunStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunStreamRouteRpcRequestHandlerOptions];
const typedBunServeOptions: BunServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const bunUnaryRouteServeOptions: BunUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const bunStreamRouteServeOptions: BunStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
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
const bunUnaryRouteServeOptionsArgs: BunUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunUnaryRouteServeOptions];
const bunStreamRouteServeOptionsArgs: BunStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [bunStreamRouteServeOptions];
const runtimeSubpathBunFetchOptionsArgs: RuntimeSubpathBunFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = bunFetchOptionsArgs;
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
runtimeSubpathBunRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathBunUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
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
runtimeSubpathBunUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteServeOptions.hooks?.beforeRequest?.(
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
runtimeSubpathBunUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathBunStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
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
const exactBunFetchOptions: BunFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const exactBunRpcRequestHandlerOptions: BunRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
exactBunServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactBunFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactBunRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
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
const denoFetchOptions: DenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoUnaryRouteFetchOptions: DenoUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoStreamRouteFetchOptions: DenoStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const denoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const denoUnaryRouteRpcRequestHandlerOptions: DenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoStreamRouteRpcRequestHandlerOptions: DenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const denoFetchOptionsArgs: DenoFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoFetchOptions];
const denoUnaryRouteFetchOptionsArgs: DenoUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteFetchOptions];
const denoStreamRouteFetchOptionsArgs: DenoStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteFetchOptions];
const denoRpcRequestHandlerOptionsArgs: DenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoRpcRequestHandlerOptions];
const denoUnaryRouteRpcRequestHandlerOptionsArgs: DenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteRpcRequestHandlerOptions];
const denoStreamRouteRpcRequestHandlerOptionsArgs: DenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteRpcRequestHandlerOptions];
const denoUnaryRouteServeOptions: DenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const denoStreamRouteServeOptions: DenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const runtimeSubpathDenoUnaryRouteServeOptions: RuntimeSubpathDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteServeOptions;
const runtimeSubpathDenoStreamRouteServeOptions: RuntimeSubpathDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteServeOptions;
const runtimeSubpathDenoFetchOptions: RuntimeSubpathDenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoFetchOptions;
const runtimeSubpathDenoUnaryRouteFetchOptions: RuntimeSubpathDenoUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteFetchOptions;
const runtimeSubpathDenoStreamRouteFetchOptions: RuntimeSubpathDenoStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteFetchOptions;
const runtimeSubpathDenoRpcRequestHandlerOptions: RuntimeSubpathDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRpcRequestHandlerOptions;
const runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathDenoStreamRouteRpcRequestHandlerOptions: RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteRpcRequestHandlerOptions;
const denoServeOptionsArgs: DenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedDenoServeOptions];
const denoUnaryRouteServeOptionsArgs: DenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoUnaryRouteServeOptions];
const denoStreamRouteServeOptionsArgs: DenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [denoStreamRouteServeOptions];
const runtimeSubpathDenoFetchOptionsArgs: RuntimeSubpathDenoFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoFetchOptionsArgs;
const runtimeSubpathDenoUnaryRouteFetchOptionsArgs: RuntimeSubpathDenoUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteFetchOptionsArgs;
const runtimeSubpathDenoStreamRouteFetchOptionsArgs: RuntimeSubpathDenoStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteFetchOptionsArgs;
const runtimeSubpathDenoRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathDenoServeOptionsArgs: RuntimeSubpathDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoServeOptionsArgs;
const runtimeSubpathDenoUnaryRouteServeOptionsArgs: RuntimeSubpathDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoUnaryRouteServeOptionsArgs;
const runtimeSubpathDenoStreamRouteServeOptionsArgs: RuntimeSubpathDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = denoStreamRouteServeOptionsArgs;
runtimeSubpathDenoFetchOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
runtimeSubpathDenoUnaryRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
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
runtimeSubpathDenoServeOptionsArgs[0]?.hostname?.toUpperCase();
runtimeSubpathDenoUnaryRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteServeOptionsArgs[0]?.hooks?.beforeRequest?.(
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
runtimeSubpathDenoUnaryRouteFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathDenoStreamRouteFetchOptions.hooks?.beforeRequest?.(
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
runtimeSubpathDenoFetchOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathDenoRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
const exactDenoServeOptions: DenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunServeOptions;
const exactDenoFetchOptions: DenoFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunFetchOptions;
const exactDenoRpcRequestHandlerOptions: DenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactBunRpcRequestHandlerOptions;
exactDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactDenoFetchOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
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
const standaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const standaloneDenoUnaryRouteRpcRequestHandlerOptions: StandaloneDenoUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const standaloneDenoStreamRouteRpcRequestHandlerOptions: StandaloneDenoStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const standaloneDenoRpcRequestHandlerOptionsArgs: StandaloneDenoRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoRpcRequestHandlerOptions];
const standaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs: StandaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoUnaryRouteRpcRequestHandlerOptions];
const standaloneDenoStreamRouteRpcRequestHandlerOptionsArgs: StandaloneDenoStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoStreamRouteRpcRequestHandlerOptions];
const standaloneDenoUnaryRouteServeOptions: StandaloneDenoUnaryRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const standaloneDenoStreamRouteServeOptions: StandaloneDenoStreamRouteServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const standaloneDenoServeOptionsArgs: StandaloneDenoServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedStandaloneDenoServeOptions];
const standaloneDenoUnaryRouteServeOptionsArgs: StandaloneDenoUnaryRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoUnaryRouteServeOptions];
const standaloneDenoStreamRouteServeOptionsArgs: StandaloneDenoStreamRouteServeOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [standaloneDenoStreamRouteServeOptions];
standaloneDenoRpcRequestHandlerOptionsArgs[0]?.plugins?.[0]?.name.toUpperCase();
standaloneDenoUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
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
standaloneDenoUnaryRouteServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
standaloneDenoStreamRouteServeOptions.hooks?.beforeRequest?.(
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
const exactStandaloneDenoServeOptions: StandaloneDenoServeOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactDenoServeOptions;
const exactStandaloneDenoRpcRequestHandlerOptions: StandaloneDenoRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactDenoRpcRequestHandlerOptions;
exactStandaloneDenoServeOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
exactStandaloneDenoRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
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
const exactDenoTransportResultFor: DenoTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = manifestRouteBodyResult;
const denoUnaryRouteTransportResultFor: DenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = manifestRouteBodyResult;
const denoStreamRouteTransportResultFor: DenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = new Response();
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
const manifestDenoUnaryRouteTransportHandler: DenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
const manifestDenoStreamRouteTransportHandler: DenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoTransportHandler;
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
manifestDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestDenoStreamRouteTransportHandler(
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
const manifestBunUnaryRouteTransportHandler: BunUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunTransportHandler;
const manifestBunStreamRouteTransportHandler: BunStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestBunTransportHandler;
createBunTransportRequestHandler(manifestBunTransportHandler);
manifestBunUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestBunStreamRouteTransportHandler(
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
const standaloneDenoUnaryRouteTransportResultFor: StandaloneDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = bunUnaryRouteTransportResultFor;
const standaloneDenoStreamRouteTransportResultFor: StandaloneDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = bunStreamRouteTransportResultFor;
const denoCompiledTransportResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest
> = standaloneDenoTransportResultFor;
const exactDenoCompiledTransportResultFor: DenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactStandaloneDenoTransportResultFor;
const denoCompiledUnaryRouteTransportResultFor: DenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = standaloneDenoUnaryRouteTransportResultFor;
const denoCompiledStreamRouteTransportResultFor: DenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = standaloneDenoStreamRouteTransportResultFor;
const denoCompiledRouteUnaryTransportResultFor: DenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledUnaryRouteTransportResultFor;
const denoCompiledRouteStreamTransportResultFor: DenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledStreamRouteTransportResultFor;
const rootDenoCompiledUnaryRouteTransportResultFor: RootDenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledUnaryRouteTransportResultFor;
const rootDenoCompiledStreamRouteTransportResultFor: RootDenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledStreamRouteTransportResultFor;
const rootDenoCompiledRouteUnaryTransportResultFor: RootDenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledRouteUnaryTransportResultFor;
const rootDenoCompiledRouteStreamTransportResultFor: RootDenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledRouteStreamTransportResultFor;
rootDenoCompiledUnaryRouteTransportResultFor.valueOf();
rootDenoCompiledStreamRouteTransportResultFor.valueOf();
rootDenoCompiledRouteUnaryTransportResultFor.valueOf();
rootDenoCompiledRouteStreamTransportResultFor.valueOf();
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
const manifestStandaloneDenoUnaryRouteTransportHandler: StandaloneDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
const manifestStandaloneDenoStreamRouteTransportHandler: StandaloneDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestStandaloneDenoTransportHandler;
createStandaloneDenoTransportRequestHandler(
  manifestStandaloneDenoTransportHandler
);
manifestStandaloneDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestStandaloneDenoStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
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
const serializedJsonEnvelope: SerializedJsonEnvelope =
  compiledSerializedEnvelope;
const runtimeSubpathSerializedJsonEnvelope: RuntimeSubpathSerializedJsonEnvelope =
  serializedJsonEnvelope;
const transportBodyResult: TransportBodyResult = serializedJsonEnvelope;
const runtimeSubpathTransportBodyResult: RuntimeSubpathTransportBodyResult =
  transportBodyResult;
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
transportResultToResponse(manifestRouteEnvelope).headers.get('content-type');
runtimeSubpathTransportResultToResponse(
  runtimeSubpathSerializedJsonEnvelope
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
const manifestCompiledUnaryTransportHandler: CompiledRpcUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body) body.input.valueOf();
  return compiledSerializedEnvelope;
};
const rootManifestCompiledUnaryTransportHandler: RootCompiledRpcUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryTransportHandler;
const manifestCompiledRouteUnaryTransportHandler: CompiledRpcRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryTransportHandler;
const rootManifestCompiledRouteUnaryTransportHandler: RootCompiledRpcRouteUnaryTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryTransportHandler;
const manifestCompiledStreamTransportHandler: CompiledRpcStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  body.input.userId.toUpperCase();
  return new Response();
};
const rootManifestCompiledStreamTransportHandler: RootCompiledRpcStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamTransportHandler;
const manifestCompiledRouteStreamTransportHandler: CompiledRpcRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamTransportHandler;
const rootManifestCompiledRouteStreamTransportHandler: RootCompiledRpcRouteStreamTransportBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamTransportHandler;
const manifestCompiledUnaryBodyHandler: CompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  if ('id' in body) body.id.toUpperCase();
  return compiledSerializedEnvelope;
};
const rootManifestCompiledUnaryBodyHandler: RootCompiledRpcUnaryRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryBodyHandler;
const manifestCompiledRouteUnaryBodyHandler: CompiledRpcRouteUnaryBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledUnaryBodyHandler;
const rootManifestCompiledRouteUnaryBodyHandler: RootCompiledRpcRouteUnaryBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteUnaryBodyHandler;
const manifestCompiledStreamBodyHandler: CompiledRpcStreamRouteBodyResultHandlerFor<
  typeof manifest
> = async (_request, body) => {
  body.input.userId.toUpperCase();
  return new Response();
};
const rootManifestCompiledStreamBodyHandler: RootCompiledRpcStreamRouteBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamBodyHandler;
const manifestCompiledRouteStreamBodyHandler: CompiledRpcRouteStreamBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledStreamBodyHandler;
const rootManifestCompiledRouteStreamBodyHandler: RootCompiledRpcRouteStreamBodyResultHandlerFor<
  typeof manifest
> = manifestCompiledRouteStreamBodyHandler;
const compiledUnaryRouteTransportResultFor: CompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledSerializedEnvelope;
const compiledStreamRouteTransportResultFor: CompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = new Response();
const compiledUnaryRouteBodyResultFor: CompiledUnaryRouteBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledUnaryRouteTransportResultFor;
const compiledStreamRouteBodyResultFor: CompiledStreamRouteBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledStreamRouteTransportResultFor;
const compiledRouteUnaryTransportResultFor: CompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledUnaryRouteTransportResultFor;
const compiledRouteStreamTransportResultFor: CompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledStreamRouteTransportResultFor;
const compiledRouteUnaryBodyResultFor: CompiledRouteUnaryBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledUnaryRouteBodyResultFor;
const compiledRouteStreamBodyResultFor: CompiledRouteStreamBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledStreamRouteBodyResultFor;
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
  typeof manifestUnaryRouteBody
> = compiledRouteUnaryTransportResultFor;
const rootCompiledRouteStreamTransportResultFor: RootCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledRouteStreamTransportResultFor;
const rootCompiledRouteUnaryBodyResultFor: RootCompiledRouteUnaryBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = compiledRouteUnaryBodyResultFor;
const rootCompiledRouteStreamBodyResultFor: RootCompiledRouteStreamBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = compiledRouteStreamBodyResultFor;
rootCompiledUnaryRouteTransportResultFor.valueOf();
rootCompiledStreamRouteTransportResultFor.valueOf();
rootCompiledUnaryRouteBodyResultFor.valueOf();
rootCompiledStreamRouteBodyResultFor.valueOf();
rootCompiledRouteUnaryTransportResultFor.valueOf();
rootCompiledRouteStreamTransportResultFor.valueOf();
rootCompiledRouteUnaryBodyResultFor.valueOf();
rootCompiledRouteStreamBodyResultFor.valueOf();
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
  manifestUnaryRouteBody
);
rootManifestCompiledRouteStreamTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
manifestCompiledUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteBody
);
manifestCompiledStreamBodyHandler(
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
  manifestUnaryRouteBody
);
rootManifestCompiledRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  manifestStreamRouteBody
);
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
const manifestDenoCompiledUnaryRouteTransportHandler: DenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
const manifestDenoCompiledStreamRouteTransportHandler: DenoCompiledStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestDenoCompiledTransportHandler;
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
runtimeSubpathManifestDenoCompiledStreamRouteTransportHandler(
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
exactRuntimeSubpathManifestDenoCompiledTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestRouteRequest
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
standaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
rootTypedStandaloneDenoCompiledHandler(new Request('https://example.com/rpc'));
runtimeSubpathTypedStandaloneDenoCompiledHandler(
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
const runtimeSubpathJoorHandlerOptions: RuntimeSubpathJoorHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorHandlerOptions;
const joorUnaryRouteHandlerOptions: JoorUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const joorStreamRouteHandlerOptions: JoorStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const joorRouteUnaryHandlerOptions: JoorRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorUnaryRouteHandlerOptions;
const joorRouteStreamHandlerOptions: JoorRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = joorStreamRouteHandlerOptions;
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
const joorHandlerOptionsArgs: JoorHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorHandlerOptions];
const joorUnaryRouteHandlerOptionsArgs: JoorUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorUnaryRouteHandlerOptions];
const joorStreamRouteHandlerOptionsArgs: JoorStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorStreamRouteHandlerOptions];
const joorRouteUnaryHandlerOptionsArgs: JoorRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorRouteUnaryHandlerOptions];
const joorRouteStreamHandlerOptionsArgs: JoorRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [joorRouteStreamHandlerOptions];
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
const nextHandlerOptions: NextHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptions;
const nextUnaryRouteHandlersOptions: NextUnaryRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const nextStreamRouteHandlersOptions: NextStreamRouteHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const nextRouteUnaryHandlersOptions: NextRouteUnaryHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryRouteHandlersOptions;
const nextRouteStreamHandlersOptions: NextRouteStreamHandlersOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamRouteHandlersOptions;
const nextUnaryHandlerOptions: NextUnaryRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryRouteHandlersOptions;
const nextStreamHandlerOptions: NextStreamRouteHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamRouteHandlersOptions;
const nextRouteUnaryHandlerOptions: NextRouteUnaryHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextUnaryHandlerOptions;
const nextRouteStreamHandlerOptions: NextRouteStreamHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextStreamHandlerOptions;
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
exactRuntimeSubpathNextRouteHandlersOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
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
const nextHandlerOptionsArgs: NextHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextHandlerOptions];
const nextUnaryRouteHandlersOptionsArgs: NextUnaryRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextUnaryRouteHandlersOptions];
const nextStreamRouteHandlersOptionsArgs: NextStreamRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextStreamRouteHandlersOptions];
const nextRouteUnaryHandlersOptionsArgs: NextRouteUnaryHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteUnaryHandlersOptions];
const nextRouteStreamHandlersOptionsArgs: NextRouteStreamHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteStreamHandlersOptions];
const nextUnaryHandlerOptionsArgs: NextUnaryRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextUnaryHandlerOptions];
const nextStreamHandlerOptionsArgs: NextStreamRouteHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextStreamHandlerOptions];
const nextRouteUnaryHandlerOptionsArgs: NextRouteUnaryHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteUnaryHandlerOptions];
const nextRouteStreamHandlerOptionsArgs: NextRouteStreamHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nextRouteStreamHandlerOptions];
const runtimeSubpathNextRouteHandlersOptionsArgs: RuntimeSubpathNextRouteHandlersOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nextRouteHandlersOptionsArgs;
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
const exactCloudflareWorkerOptions: CloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
const runtimeSubpathCloudflareWorkerOptions: RuntimeSubpathCloudflareWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareWorkerOptions;
const cloudflareUnaryRouteWorkerOptions: CloudflareUnaryRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const cloudflareStreamRouteWorkerOptions: CloudflareStreamRouteWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const cloudflareRouteUnaryWorkerOptions: CloudflareRouteUnaryWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareUnaryRouteWorkerOptions;
const cloudflareRouteStreamWorkerOptions: CloudflareRouteStreamWorkerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareStreamRouteWorkerOptions;
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
const cloudflareWorkerOptionsArgs: CloudflareWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareWorkerOptions];
const cloudflareUnaryRouteWorkerOptionsArgs: CloudflareUnaryRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareUnaryRouteWorkerOptions];
const cloudflareStreamRouteWorkerOptionsArgs: CloudflareStreamRouteWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareStreamRouteWorkerOptions];
const cloudflareRouteUnaryWorkerOptionsArgs: CloudflareRouteUnaryWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteUnaryWorkerOptions];
const cloudflareRouteStreamWorkerOptionsArgs: CloudflareRouteStreamWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [cloudflareRouteStreamWorkerOptions];
const runtimeSubpathCloudflareWorkerOptionsArgs: RuntimeSubpathCloudflareWorkerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = cloudflareWorkerOptionsArgs;
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
runtimeSubpathCloudflareRouteStreamWorkerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const netlifyUnaryRouteFetchOptions: NetlifyUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const netlifyStreamRouteFetchOptions: NetlifyStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const netlifyRouteUnaryFetchOptions: NetlifyRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyUnaryRouteFetchOptions;
const netlifyRouteStreamFetchOptions: NetlifyRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyStreamRouteFetchOptions;
const exactNetlifyFetchOptions: NetlifyFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
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
const netlifyFetchOptionsArgs: NetlifyFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyFetchOptions];
const rootSubpathNetlifyFetchOptionsArgs: RootSubpathNetlifyFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = netlifyFetchOptionsArgs;
const netlifyUnaryRouteFetchOptionsArgs: NetlifyUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyUnaryRouteFetchOptions];
const netlifyStreamRouteFetchOptionsArgs: NetlifyStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyStreamRouteFetchOptions];
const netlifyRouteUnaryFetchOptionsArgs: NetlifyRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyRouteUnaryFetchOptions];
const netlifyRouteStreamFetchOptionsArgs: NetlifyRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [netlifyRouteStreamFetchOptions];
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
runtimeSubpathNetlifyRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const vercelUnaryRouteFetchOptions: VercelUnaryRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const vercelStreamRouteFetchOptions: VercelStreamRouteFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const vercelRouteUnaryFetchOptions: VercelRouteUnaryFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelUnaryRouteFetchOptions;
const vercelRouteStreamFetchOptions: VercelRouteStreamFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = vercelStreamRouteFetchOptions;
const exactVercelFetchOptions: VercelFetchOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
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
const vercelFetchOptionsArgs: VercelFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelFetchOptions];
const vercelUnaryRouteFetchOptionsArgs: VercelUnaryRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelUnaryRouteFetchOptions];
const vercelStreamRouteFetchOptionsArgs: VercelStreamRouteFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelStreamRouteFetchOptions];
const vercelRouteUnaryFetchOptionsArgs: VercelRouteUnaryFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelRouteUnaryFetchOptions];
const vercelRouteStreamFetchOptionsArgs: VercelRouteStreamFetchOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [vercelRouteStreamFetchOptions];
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
runtimeSubpathVercelRouteStreamFetchOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
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
const unaryRouteListenOptions: UnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const streamRouteListenOptions: StreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const nodeRpcRequestHandlerOptions: NodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = handlerOptions;
const nodeUnaryRouteRpcRequestHandlerOptions: NodeUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestUnaryRouteHandlerOptions;
const nodeStreamRouteRpcRequestHandlerOptions: NodeStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = manifestStreamRouteHandlerOptions;
const runtimeSubpathUnaryRouteListenOptions: RuntimeSubpathUnaryRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = unaryRouteListenOptions;
const runtimeSubpathStreamRouteListenOptions: RuntimeSubpathStreamRouteListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = streamRouteListenOptions;
const runtimeSubpathNodeRpcRequestHandlerOptions: RuntimeSubpathNodeRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRpcRequestHandlerOptions;
const runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptions: RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteRpcRequestHandlerOptions;
const runtimeSubpathNodeStreamRouteRpcRequestHandlerOptions: RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteRpcRequestHandlerOptions;
const nodeRpcRequestHandlerOptionsArgs: NodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeRpcRequestHandlerOptions, '127.0.0.1'];
const nodeUnaryRouteRpcRequestHandlerOptionsArgs: NodeUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeUnaryRouteRpcRequestHandlerOptions];
const nodeStreamRouteRpcRequestHandlerOptionsArgs: NodeStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [nodeStreamRouteRpcRequestHandlerOptions, 'localhost'];
const listenOptionsArgs: ListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [typedListenOptions];
const unaryRouteListenOptionsArgs: UnaryRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [unaryRouteListenOptions];
const streamRouteListenOptionsArgs: StreamRouteListenOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = [streamRouteListenOptions];
const runtimeSubpathNodeRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeUnaryRouteRpcRequestHandlerOptionsArgs;
const runtimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs: RuntimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs<
  typeof manifest,
  readonly [typeof usersPlugin]
> = nodeStreamRouteRpcRequestHandlerOptionsArgs;
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
runtimeSubpathNodeRpcRequestHandlerOptionsArgs[1]?.toUpperCase();
runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteRpcRequestHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeUnaryRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathNodeStreamRouteRpcRequestHandlerOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestStreamRouteHandlerHookContext
);
runtimeSubpathNodeRpcRequestHandlerOptions.plugins?.[0]?.name.toUpperCase();
runtimeSubpathListenOptionsArgs[0]?.hostname?.toUpperCase();
runtimeSubpathUnaryRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  manifestUnaryRouteHandlerHookContext
);
runtimeSubpathStreamRouteListenOptionsArgs[0]?.hooks?.beforeRequest?.(
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
const exactListenOptions: ListenOptionsFor<
  typeof manifest,
  readonly [typeof usersPlugin],
  typeof manifestRouteRequest
> = exactServiceAwareHandlerOptions;
exactListenOptions.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  exactManifestHandlerHookContext
);
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
const exactNodeTransportResultFor: NodeTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactDenoCompiledTransportResultFor;
const nodeUnaryRouteTransportResultFor: NodeUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = denoCompiledUnaryRouteTransportResultFor;
const nodeStreamRouteTransportResultFor: NodeStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = denoCompiledStreamRouteTransportResultFor;
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
const manifestNodeUnaryRouteTransportHandler: NodeUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeTransportHandler;
const manifestNodeStreamRouteTransportHandler: NodeStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = manifestNodeTransportHandler;
createNodeTransportRequestHandler(manifestNodeTransportHandler);
manifestNodeUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
manifestNodeStreamRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestStreamRouteBody
);
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
const exactRuntimeSubpathBunTransportResultFor: RuntimeSubpathBunTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactNodeTransportResultFor;
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
const runtimeSubpathDenoUnaryRouteTransportResultFor: RuntimeSubpathDenoUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathBunUnaryRouteTransportResultFor;
const runtimeSubpathDenoStreamRouteTransportResultFor: RuntimeSubpathDenoStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathBunStreamRouteTransportResultFor;
const runtimeSubpathDenoCompiledTransportResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest
> = runtimeSubpathDenoTransportResultFor;
const exactRuntimeSubpathDenoCompiledTransportResultFor: RuntimeSubpathDenoCompiledTransportBodyResultFor<
  typeof manifest,
  typeof manifestRouteRequest
> = exactRuntimeSubpathDenoTransportResultFor;
const runtimeSubpathDenoCompiledUnaryRouteTransportResultFor: RuntimeSubpathDenoCompiledUnaryRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoUnaryRouteTransportResultFor;
const runtimeSubpathDenoCompiledStreamRouteTransportResultFor: RuntimeSubpathDenoCompiledStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoStreamRouteTransportResultFor;
const runtimeSubpathDenoCompiledRouteUnaryTransportResultFor: RuntimeSubpathDenoCompiledRouteUnaryTransportBodyResultFor<
  typeof manifest,
  typeof manifestUnaryRouteBody
> = runtimeSubpathDenoCompiledUnaryRouteTransportResultFor;
const runtimeSubpathDenoCompiledRouteStreamTransportResultFor: RuntimeSubpathDenoCompiledRouteStreamTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoCompiledStreamRouteTransportResultFor;
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
> = runtimeSubpathDenoCompiledRouteUnaryTransportResultFor;
const runtimeSubpathNodeStreamRouteTransportResultFor: RuntimeSubpathNodeStreamRouteTransportBodyResultFor<
  typeof manifest,
  typeof manifestStreamRouteBody
> = runtimeSubpathDenoCompiledRouteStreamTransportResultFor;
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
const runtimeSubpathManifestBunUnaryRouteTransportHandler: RuntimeSubpathBunUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestBunStreamRouteTransportHandler: RuntimeSubpathBunStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestDenoTransportHandler: RuntimeSubpathDenoTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestBunTransportHandler;
const runtimeSubpathManifestDenoUnaryRouteTransportHandler: RuntimeSubpathDenoUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoTransportHandler;
const runtimeSubpathManifestDenoStreamRouteTransportHandler: RuntimeSubpathDenoStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestDenoTransportHandler;
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
const runtimeSubpathManifestNodeUnaryRouteTransportHandler: RuntimeSubpathNodeUnaryRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeTransportHandler;
const runtimeSubpathManifestNodeStreamRouteTransportHandler: RuntimeSubpathNodeStreamRouteTransportBodyResultHandlerFor<
  typeof manifest
> = runtimeSubpathManifestNodeTransportHandler;
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
runtimeSubpathManifestDenoUnaryRouteTransportHandler(
  createFetchRequestSourceForTypes(),
  manifestUnaryRouteBody
);
runtimeSubpathManifestDenoStreamRouteTransportHandler(
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
const streamRouteProtocolRequestAlias: RpcStreamRouteProtocolRequest<
  Routes,
  'users.watch'
> = streamOnlyProtocolRequest;
streamRouteProtocolRequestAlias.input.userId.toUpperCase();
const streamRouteBodyAlias: RpcStreamRouteBody<Routes> =
  streamRouteProtocolRequestAlias;
streamRouteBodyAlias.input.userId.toUpperCase();
const streamProtocolRequestUnion: RpcRouteStreamProtocolRequestUnion<Routes> =
  streamOnlyProtocolRequest;
streamProtocolRequestUnion.input.userId.toUpperCase();
const streamRouteProtocolRequestUnionAlias: RpcStreamRouteProtocolRequestUnion<Routes> =
  streamRouteProtocolRequestAlias;
streamRouteProtocolRequestUnionAlias.input.userId.toUpperCase();
const unaryProtocolRequest: RpcRouteUnaryProtocolRequest<Routes, 'users.get'> =
  routeProtocolRequest;
unaryProtocolRequest.input.id.toUpperCase();
const unaryRouteProtocolRequestAlias: RpcUnaryRouteProtocolRequest<
  Routes,
  'users.get'
> = unaryProtocolRequest;
unaryRouteProtocolRequestAlias.input.id.toUpperCase();
const unaryRouteBodyAlias: RpcUnaryRouteBody<Routes> =
  unaryRouteProtocolRequestAlias;
unaryRouteBodyAlias.input.id.toUpperCase();
const unaryProtocolRequestUnion: RpcRouteUnaryProtocolRequestUnion<Routes> =
  unaryProtocolRequest;
unaryProtocolRequestUnion.id.toUpperCase();
const unaryRouteProtocolRequestUnionAlias: RpcUnaryRouteProtocolRequestUnion<Routes> =
  unaryRouteProtocolRequestAlias;
unaryRouteProtocolRequestUnionAlias.id.toUpperCase();
const routeBatchRequest: RpcRouteBatchRequest<
  Routes,
  [typeof routeProtocolRequest]
> = [routeProtocolRequest];
routeBatchRequest[0].input.id.toUpperCase();
const unaryRouteBatchRequestAlias: RpcUnaryRouteBatchRequest<
  Routes,
  [typeof unaryRouteProtocolRequestAlias]
> = [unaryRouteProtocolRequestAlias];
unaryRouteBatchRequestAlias[0].input.id.toUpperCase();
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
  // @ts-expect-error route protocol batches reject stream request bodies.
  [typeof streamProtocolRequest]
> = [streamProtocolRequest];

const _wrongRouteBody: RpcRouteBody<Routes> = [
  // @ts-expect-error route bodies reject stream request batches.
  { id: 'users.watch', input: { userId: '1' } },
];

const routeClient = createClient<Routes>({ url: '/rpc' });
const routeClientShape: RouteRpcTransportClient<Routes> = routeClient;
const unaryRouteClientShape: RpcUnaryRouteTransportClient<Routes> = routeClient;
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
const streamRouteClientShape: RpcStreamRouteTransportClient<Routes> =
  routeClient;
streamRouteClientShape.stream('users.watch', { userId: '1' });
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
const unaryRouteRequestOptions: RpcUnaryRouteRequestOptions<
  Routes,
  'users.get'
> = routeRequestOptions;
const rpcSubpathUnaryRouteRequestOptions: RpcSubpathUnaryRouteRequestOptions<
  Routes,
  'users.get'
> = unaryRouteRequestOptions;
const streamRouteRequestOptions: RpcStreamRouteRequestOptions<
  Routes,
  'users.watch'
> = {};
const rpcSubpathStreamRouteRequestOptions: RpcSubpathStreamRouteRequestOptions<
  Routes,
  'users.watch'
> = streamRouteRequestOptions;
routeRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathUnaryRouteRequestOptions.headers['x-tenant-id'].toUpperCase();
rpcSubpathStreamRouteRequestOptions.valueOf();
const routeClientArgs: RpcRouteClientArgs<Routes, 'users.get'> = [
  { id: '1' },
  routeRequestOptions,
];
const unaryRouteClientArgs: RpcUnaryRouteClientArgs<Routes, 'users.get'> =
  routeClientArgs;
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
const streamRouteClientArgs: RpcStreamRouteClientArgs<Routes, 'users.watch'> = [
  { userId: '1' },
  streamRouteRequestOptions,
];
const rpcSubpathStreamRouteClientArgs: RpcSubpathStreamRouteClientArgs<
  Routes,
  'users.watch'
> = streamRouteClientArgs;
routeClient.stream('users.watch', ...rpcSubpathStreamRouteClientArgs);
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
const typedUnaryRouteRequest: RpcUnaryRouteRequest<Routes, 'users.get'> =
  typedRouteRequest;
typedUnaryRouteRequest.input.id.toUpperCase();
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
const routeUnaryEnvelope: RpcUnaryRouteEnvelope<Routes, 'users.get'> =
  routeEnvelope;
routeUnaryEnvelope.id.toUpperCase();
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
const routeUnaryResult: RpcUnaryRouteResult<Routes, 'users.get'> = routeResult;
const routeResultUnion: RpcRouteResultUnion<Routes> = routeResult;
const unaryRouteResultUnion: RpcUnaryRouteResultUnion<Routes> =
  routeUnaryResult;
unaryRouteResultUnion.id.toUpperCase();
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
unaryRouteBatchResults[0].id.toUpperCase();
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
