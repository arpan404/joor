import {
  authenticateOnce,
  authenticateUncached,
  createExecutionState,
  type AuthResult,
  type AuthResultLike,
  type ExecutionState,
  uncachedExecutionState,
} from './internal/auth-execution.js';
import {
  createProcedureCacheKey,
  DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
  readCachedProcedureSuccess,
  type CachedProcedureHeaders,
  type CachedProcedureSuccess,
  type ProcedureCacheHeaderValues,
  writeCachedProcedureSuccess,
} from './internal/procedure-cache.js';
import {
  createRateLimitKey,
  DEFAULT_RATE_LIMIT_MAX_ENTRIES,
  reserveRateLimitSlot,
  type RateLimitRuntimeOptions,
  type RateLimitWindow,
} from './internal/rate-limit.js';
import {
  createFetchRequestSource,
  createRuntimeContext,
  emptyContextObject,
  type JoorContext,
  type ContextRequestSource,
} from '../context/context.js';
import { resolvePluginServices } from '../context/plugin.js';
import type { JoorConfig, JoorConfigContext } from '../config.js';
import type { JoorManifest } from '../manifest.js';
import type {
  ProcedureRuntime,
  ProcedureRuntimeValue,
  ProcedureServices,
} from '../procedure/types.js';
import type { ProcedureResult } from '../procedure/result.js';
import type {
  HandlerHookContext,
  HandlerHooks,
  JoorMiddleware,
  RpcBodyResult,
  RpcManifestBody,
  RpcManifestBodyResultFor,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from './body.js';
import type { JoorFetchHandler } from './fetch.js';
import {
  createJsonHeaderRecord,
  hasInvalidHeaderValue,
  isSerializedJsonEnvelope,
  jsonContentHeaders,
  jsonOkResponseInit,
  rpcEnvelopeToResponse,
  serializedEnvelopeToResponse,
  transportResultToResponse,
  type SerializedJsonEnvelope,
} from './response.js';
import {
  isJsonObject,
  parseJson,
  type JsonObject,
  type JsonValue,
} from '../schema/json.js';
import { validate } from '../schema/validate.js';
import {
  validationDetails,
  type RpcEnvelope,
  type RpcFailure,
  type RpcRequest,
} from '../rpc/protocol.js';
import { createSseResponse, encodeSse } from '../rpc/stream.js';
import { parseDurationMs } from '../internal/duration.js';

export interface CompiledRuntime {
  validateInput: boolean;
  validateHeaders: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
  enforceRateLimit: boolean;
  cacheMaxEntries: number;
  maxBodyBytes: number;
  rateLimit: RateLimitRuntimeOptions;
}

export interface CompiledRuntimeState<TServices extends object = object> {
  path: string;
  runtime: CompiledRuntime;
  services: TServices | undefined;
  getServices(): TServices | undefined;
  resolveServices(): Promise<TServices>;
}

export interface CompiledSerializedEnvelope extends SerializedJsonEnvelope {}

export type CompiledAuthResult = AuthResult;
export type CompiledAuthResultLike = AuthResultLike;
export type CompiledSerializationMode = false | true | 'response';
export type CompiledBodyResult<TEnvelope extends RpcEnvelope = RpcEnvelope> =
  | RpcBodyResult<TEnvelope>
  | CompiledSerializedEnvelope;
export type CompiledTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = RpcManifestBodyResultFor<TManifest, TBody> | CompiledSerializedEnvelope;
export type CompiledBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = CompiledTransportBodyResultFor<TManifest, TBody>;
export type CompiledRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CompiledTransportBodyResultFor<TManifest, TBody>;
export type CompiledUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type CompiledRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  _TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = Response | CompiledSerializedEnvelope;
export type CompiledStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CompiledRouteStreamTransportBodyResultFor<TManifest, TBody>;
export type CompiledRouteUnaryBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type CompiledUnaryRouteBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CompiledRouteUnaryBodyResultFor<TManifest, TBody>;
export type CompiledRouteStreamBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CompiledRouteStreamTransportBodyResultFor<TManifest, TBody>;
export type CompiledStreamRouteBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CompiledRouteStreamBodyResultFor<TManifest, TBody>;
export type CompiledRpcRequestHandler = JoorFetchHandler;

export type CompiledRpcTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends CompiledBodyResult = CompiledBodyResult,
> = (request: ContextRequestSource, body: TBody) => Promise<TResult>;

export type CompiledRpcTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<CompiledTransportBodyResultFor<TManifest, TBody>>;

export type CompiledRpcRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<CompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>>;

export type CompiledRpcUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = CompiledRpcRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type CompiledRpcRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<CompiledRouteStreamTransportBodyResultFor<TManifest, TBody>>;

export type CompiledRpcStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = CompiledRpcRouteStreamTransportBodyResultHandlerFor<TManifest>;

export type CompiledRpcBodyResultHandler<
  TBody = JsonValue,
  TResult extends CompiledBodyResult = CompiledBodyResult,
> = (request: Request, body: TBody) => Promise<TResult>;

export type CompiledRpcBodyResultHandlerFor<TManifest extends JoorManifest> = <
  const TBody extends RpcManifestBody<TManifest>,
>(
  request: Request,
  body: TBody
) => Promise<CompiledTransportBodyResultFor<TManifest, TBody>>;

export type CompiledRpcRouteUnaryBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: Request,
  body: TBody
) => Promise<CompiledRouteUnaryBodyResultFor<TManifest, TBody>>;

export type CompiledRpcUnaryRouteBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = CompiledRpcRouteUnaryBodyResultHandlerFor<TManifest>;

export type CompiledRpcRouteStreamBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: Request,
  body: TBody
) => Promise<CompiledRouteStreamBodyResultFor<TManifest, TBody>>;

export type CompiledRpcStreamRouteBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = CompiledRpcRouteStreamBodyResultHandlerFor<TManifest>;

type CompiledHookBody<TConfig> = TConfig extends {
  hooks?: HandlerHooks<infer _TServices extends object, infer TBody>;
}
  ? TBody
  : TConfig extends {
        middleware?: readonly JoorMiddleware<
          infer _TServices extends object,
          infer TBody
        >[];
      }
    ? TBody
    : JsonValue;

export type CompiledUnaryDispatch<TServices extends object = object> = (
  body: JsonObject,
  request: ContextRequestSource,
  services: TServices,
  runtime: CompiledRuntime,
  state: ExecutionState,
  serialize: CompiledSerializationMode
) => Promise<CompiledBodyResult | undefined>;

export type CompiledFixedUnaryDispatch<
  TServices extends object = object,
  TResult extends CompiledBodyResult = CompiledBodyResult,
> = (
  body: JsonObject,
  request: ContextRequestSource,
  services: TServices,
  runtime: CompiledRuntime,
  state: ExecutionState
) => Promise<TResult | undefined>;

export type CompiledDispatch<TServices extends object = object> = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: TServices,
  runtime: CompiledRuntime,
  state: ExecutionState,
  serialize: CompiledSerializationMode
) => Promise<RpcEnvelope | Response | CompiledSerializedEnvelope>;

export type CompiledFixedDispatch<TServices extends object = object> = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: TServices,
  runtime: CompiledRuntime,
  state: ExecutionState
) => Promise<RpcEnvelope | Response | CompiledSerializedEnvelope>;

const rateLimitWindows = new Map<string, RateLimitWindow>();
const compiledProcedureSuccessCache = new Map<string, CachedProcedureSuccess>();
let traceCounter = 0;

const traceId = (request: ContextRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return `trace-${traceCounter}`;
};

const isRpcRequest = (value: JsonValue): value is JsonObject & RpcRequest =>
  isJsonObject(value) &&
  typeof value['id'] === 'string' &&
  (value['traceId'] === undefined || typeof value['traceId'] === 'string');

const matchesPath = (url: string, path: string): boolean => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return path === '/';
  if (!url.startsWith(path, pathStart)) return false;
  const next = url[pathStart + path.length];
  return next === undefined || next === '?' || next === '#';
};

const isJsonContentType = (value: string): boolean => {
  if (value === 'application/json') return true;
  const semicolonIndex = value.indexOf(';');
  const type = semicolonIndex === -1 ? value : value.slice(0, semicolonIndex);
  const normalized = type.trim().toLowerCase();
  return normalized === 'application/json' || normalized.endsWith('+json');
};

const requestPreflight = (
  request: ContextRequestSource,
  path: string
): Response | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  const contentType = request.getHeader('content-type') ?? '';
  if (!isJsonContentType(contentType)) {
    return rpcEnvelopeToResponse(
      failure(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      )
    );
  }
  return undefined;
};

const failure = <TId extends string>(
  id: TId,
  trace: string,
  code: string,
  message: string,
  status: number,
  details?: JsonValue
): RpcFailure<TId> =>
  details === undefined
    ? { ok: false, id, traceId: trace, error: { code, message, status } }
    : {
        ok: false,
        id,
        traceId: trace,
        error: { code, message, status, details },
      };

const headerObject = (
  request: ContextRequestSource,
  procedure: ProcedureRuntime
): ProcedureCacheHeaderValues => {
  const output: ProcedureCacheHeaderValues = {};
  if (procedure.headers?.kind !== 'object') return output;
  for (const key of Object.keys(procedure.headers.shape)) {
    const value = request.getHeader(key);
    if (value !== null) output[key] = value;
  }
  return output;
};

export const compiledTraceId = traceId;
export const compiledHeaderObject = headerObject;
export const compiledFailure = failure;
export const compiledValidationDetails = validationDetails;
export const compiledCreateContext = createRuntimeContext;
export const compiledEmptyObject = emptyContextObject;
export const compiledCreateJsonHeaderRecord = createJsonHeaderRecord;
export const compiledHasInvalidHeaderValue = hasInvalidHeaderValue;
export const compiledJsonOkResponseInit = jsonOkResponseInit;
export const compiledUncachedExecutionState = uncachedExecutionState;

const isProcedureFailure = (
  value: object
): value is {
  kind: 'error';
  error: RpcEnvelope extends infer TEnvelope
    ? TEnvelope extends { ok: false; error: infer TError }
      ? TError
      : never
    : never;
} => 'kind' in value && value.kind === 'error' && 'error' in value;

const isProcedureResult = (
  value: JsonValue | ProcedureResult<JsonValue, string>
): value is ProcedureResult<JsonValue, string> =>
  typeof value === 'object' &&
  value !== null &&
  'kind' in value &&
  (value.kind === 'success' || value.kind === 'error');

const isAsyncIterable = (
  value: ProcedureRuntimeValue
): value is AsyncIterable<JsonValue> => Symbol.asyncIterator in Object(value);

export const compiledAuthenticate = (
  policy: ProcedureRuntime['auth'],
  ctx: JoorContext<object, object, object, object>,
  state: ExecutionState
): CompiledAuthResultLike => authenticateOnce(policy, ctx, state);

export const compiledAuthenticateUncached = (
  policy: ProcedureRuntime['auth'],
  ctx: JoorContext<object, object, object, object>
): CompiledAuthResultLike => authenticateUncached(policy, ctx);

const rateLimitFailure = <TId extends string>(
  id: TId,
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  trace: string,
  runtime: CompiledRuntime
): RpcEnvelope<JsonValue, TId> | undefined => {
  if (!runtime.enforceRateLimit) return undefined;
  const limit = procedure.meta.rateLimit;
  if (limit === undefined) return undefined;
  const windowMs = parseDurationMs(limit.window);
  const allowed = reserveRateLimitSlot(
    rateLimitWindows,
    createRateLimitKey(id, request, runtime.rateLimit),
    limit.limit,
    windowMs,
    runtime.rateLimit.maxEntries
  );
  if (!allowed) {
    return failure(
      rpcRequest.id,
      trace,
      'RATE_LIMITED',
      'Rate limit exceeded',
      429,
      {
        limit: limit.limit,
        window: limit.window,
      }
    );
  }
  return undefined;
};

export const compiledRateLimitFailureStatic = <TId extends string>(
  id: TId,
  limit: number,
  window: string,
  windowMs: number,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  trace: string,
  runtime: CompiledRuntime
): RpcEnvelope<JsonValue, TId> | undefined => {
  if (!runtime.enforceRateLimit) return undefined;
  const allowed = reserveRateLimitSlot(
    rateLimitWindows,
    createRateLimitKey(id, request, runtime.rateLimit),
    limit,
    windowMs,
    runtime.rateLimit.maxEntries
  );
  if (!allowed) {
    return failure(
      rpcRequest.id,
      trace,
      'RATE_LIMITED',
      'Rate limit exceeded',
      429,
      { limit, window }
    );
  }
  return undefined;
};

export const compiledReadCache = (
  id: string,
  procedure: ProcedureRuntime,
  input: JsonValue,
  headers: ProcedureCacheHeaderValues,
  auth: object
): CachedProcedureSuccess | undefined => {
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  if (cacheConfig === undefined) return undefined;
  return readCachedProcedureSuccess(
    compiledProcedureSuccessCache,
    createProcedureCacheKey(id, cacheConfig.key, input, headers, auth)
  );
};

export const compiledWriteCache = (
  id: string,
  procedure: ProcedureRuntime,
  input: JsonValue,
  headers: ProcedureCacheHeaderValues,
  auth: object,
  data: JsonValue,
  responseHeaders?: CachedProcedureHeaders
): void => {
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  if (cacheConfig === undefined) return;
  writeCachedProcedureSuccess(
    compiledProcedureSuccessCache,
    createProcedureCacheKey(id, cacheConfig.key, input, headers, auth),
    parseDurationMs(cacheConfig.ttl),
    data,
    responseHeaders,
    DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES
  );
};

const streamResponse = async <
  TProcedure extends ProcedureRuntime,
  TId extends string,
>(
  id: TId,
  procedure: TProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  services: ProcedureServices<TProcedure>,
  runtime: CompiledRuntime,
  state: ExecutionState
): Promise<Response> => {
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    id,
    procedure,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return rpcEnvelopeToResponse(limited);
  const headers = headerObject(request, procedure);
  const ctx = createRuntimeContext(
    request,
    trace,
    services,
    headers,
    emptyContextObject
  );
  const authResultValue = authenticateOnce(procedure.auth, ctx, state);
  const authResult =
    authResultValue instanceof Promise
      ? await authResultValue
      : authResultValue;
  if (isProcedureFailure(authResult)) {
    return rpcEnvelopeToResponse({
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    });
  }
  const inputResult = !runtime.validateInput
    ? ({ ok: true, value: rpcRequest.input } as const)
    : validate(procedure.input, rpcRequest.input, 'input');
  if (!inputResult.ok) {
    return rpcEnvelopeToResponse(
      failure(
        rpcRequest.id,
        trace,
        'VALIDATION_ERROR',
        'Validation failed',
        400,
        validationDetails(inputResult.issues)
      )
    );
  }
  ctx.auth = authResult;
  const schema = procedure.stream;
  if (schema === undefined) {
    return rpcEnvelopeToResponse(
      failure(
        rpcRequest.id,
        trace,
        'NOT_STREAMING',
        'Procedure is not streaming',
        400
      )
    );
  }
  const iterable = procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (!(Symbol.asyncIterator in Object(iterable))) {
    return rpcEnvelopeToResponse(
      failure(
        rpcRequest.id,
        trace,
        'NOT_STREAMING',
        'Procedure is not streaming',
        400
      )
    );
  }
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of iterable as AsyncIterable<JsonValue>) {
          const eventResult = validate(schema, event, 'event');
          if (!eventResult.ok) {
            controller.enqueue(
              encodeSse(
                'error',
                failure(
                  rpcRequest.id,
                  trace,
                  'STREAM_VALIDATION_ERROR',
                  'Stream event failed validation',
                  500,
                  validationDetails(eventResult.issues)
                )
              )
            );
            break;
          }
          controller.enqueue(encodeSse('data', eventResult.value as JsonValue));
        }
        controller.enqueue(encodeSse('done', {}));
      } finally {
        controller.close();
      }
    },
  });
  return createSseResponse(stream);
};

export const executeCompiledProcedure = async <
  TProcedure extends ProcedureRuntime,
  TId extends string = string,
>(
  id: TId,
  procedure: TProcedure,
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource,
  services: ProcedureServices<TProcedure>,
  runtime: CompiledRuntime,
  state: ExecutionState,
  _serialize: CompiledSerializationMode
): Promise<RpcEnvelope<JsonValue, TId> | Response> => {
  if (request.getHeader('accept')?.includes('text/event-stream') === true) {
    return streamResponse(
      id,
      procedure,
      rpcRequest,
      request,
      services,
      runtime,
      state
    );
  }
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    id,
    procedure,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return limited;
  const headers = headerObject(request, procedure);
  const headerResult =
    procedure.headers === undefined || !runtime.validateHeaders
      ? ({ ok: true, value: headers } as const)
      : validate(procedure.headers, headers, 'headers');
  if (!headerResult.ok) {
    return failure(
      rpcRequest.id,
      trace,
      'HEADER_VALIDATION_ERROR',
      'Header validation failed',
      400,
      validationDetails(headerResult.issues)
    );
  }
  const ctx = createRuntimeContext(
    request,
    trace,
    services,
    headerResult.value as object,
    emptyContextObject
  );
  const authResultValue = authenticateOnce(procedure.auth, ctx, state);
  const authResult =
    authResultValue instanceof Promise
      ? await authResultValue
      : authResultValue;
  if (isProcedureFailure(authResult)) {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    };
  }
  const inputResult = !runtime.validateInput
    ? ({ ok: true, value: rpcRequest.input } as const)
    : validate(procedure.input, rpcRequest.input, 'input');
  if (!inputResult.ok) {
    return failure(
      rpcRequest.id,
      trace,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      validationDetails(inputResult.issues)
    );
  }
  ctx.auth = authResult;
  const inputValue = (inputResult.value ?? {}) as JsonValue;
  const cached = compiledReadCache(
    id,
    procedure,
    inputValue,
    headerResult.value as ProcedureCacheHeaderValues,
    authResult
  );
  if (cached !== undefined) {
    return cached.headers === undefined
      ? { ok: true, id: rpcRequest.id, traceId: trace, data: cached.data }
      : {
          ok: true,
          id: rpcRequest.id,
          traceId: trace,
          data: cached.data,
          headers: cached.headers,
        };
  }
  const result = await procedure.handler(ctx, inputValue);
  if (isAsyncIterable(result)) {
    return failure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (!isProcedureResult(result)) {
    if (procedure.output !== undefined && runtime.validateOutput) {
      const outputResult = validate(procedure.output, result, 'output');
      if (!outputResult.ok) {
        return failure(
          rpcRequest.id,
          trace,
          'OUTPUT_VALIDATION_ERROR',
          'Handler returned invalid output',
          500,
          validationDetails(outputResult.issues)
        );
      }
    }
    compiledWriteCache(
      id,
      procedure,
      inputValue,
      headerResult.value as ProcedureCacheHeaderValues,
      authResult,
      result
    );
    return { ok: true, id: rpcRequest.id, traceId: trace, data: result };
  }
  if (result.kind === 'error') {
    return failure(
      rpcRequest.id,
      trace,
      result.error.code,
      result.error.message,
      result.error.status,
      result.error.details
    );
  }
  if (procedure.output !== undefined && runtime.validateOutput) {
    const outputResult = validate(procedure.output, result.data, 'output');
    if (!outputResult.ok) {
      return failure(
        rpcRequest.id,
        trace,
        'OUTPUT_VALIDATION_ERROR',
        'Handler returned invalid output',
        500,
        validationDetails(outputResult.issues)
      );
    }
  }
  if (result.headers !== undefined) {
    compiledWriteCache(
      id,
      procedure,
      inputValue,
      headerResult.value as ProcedureCacheHeaderValues,
      authResult,
      result.data,
      result.headers
    );
    return {
      ok: true,
      id: rpcRequest.id,
      traceId: trace,
      data: result.data,
      headers: result.headers,
    };
  }
  compiledWriteCache(
    id,
    procedure,
    inputValue,
    headerResult.value as ProcedureCacheHeaderValues,
    authResult,
    result.data
  );
  return { ok: true, id: rpcRequest.id, traceId: trace, data: result.data };
};

export const compiledNotFound = <TId extends string>(
  rpcRequest: RpcRequest<TId>,
  request: ContextRequestSource
): RpcEnvelope<JsonValue, TId> =>
  failure(
    rpcRequest.id,
    traceId(request, rpcRequest.traceId),
    'NOT_FOUND',
    'Procedure not found',
    404
  );

export function createCompiledRuntimeState(): CompiledRuntimeState<
  Record<string, never>
>;
export function createCompiledRuntimeState<const TConfig extends JoorConfig>(
  config: TConfig
): CompiledRuntimeState<JoorConfigContext<TConfig>>;
export function createCompiledRuntimeState(
  config: JoorConfig = {}
): CompiledRuntimeState {
  const servicesPromise = resolvePluginServices(config.plugins ?? []);
  let services: object | undefined;
  if (config.plugins === undefined || config.plugins.length === 0) {
    services = {};
  }
  const path = config.path ?? '/rpc';
  const runtime: CompiledRuntime = {
    validateHeaders: config.validateHeaders ?? true,
    validateInput: config.validateInput ?? true,
    validateOutput: config.validateOutput ?? true,
    validateResponseHeaders: config.validateResponseHeaders ?? true,
    enforceRateLimit: config.enforceRateLimit ?? true,
    cacheMaxEntries:
      config.cache?.maxEntries ?? DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
    maxBodyBytes: config.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    rateLimit: {
      trustProxy: config.rateLimit?.trustProxy ?? false,
      maxEntries:
        config.rateLimit?.maxEntries ?? DEFAULT_RATE_LIMIT_MAX_ENTRIES,
      ...(config.rateLimit?.identity === undefined
        ? {}
        : { identity: config.rateLimit.identity }),
    },
  };
  const state: CompiledRuntimeState = {
    path,
    runtime,
    services,
    getServices(): object | undefined {
      return state.services;
    },
    async resolveServices(): Promise<object> {
      return state.services ?? (await servicesPromise);
    },
  };
  if (services === undefined) {
    servicesPromise.then((resolved) => {
      state.services = resolved;
      return resolved;
    });
  }
  return state;
}

export const createCompiledRpcTransportBodyResultHandler = <
  const TConfig extends JoorConfig = Record<string, never>,
>(
  dispatch: CompiledDispatch<JoorConfigContext<TConfig>>,
  config?: TConfig,
  unaryDispatch?: CompiledUnaryDispatch<JoorConfigContext<TConfig>>,
  preflight = true,
  serializationMode: CompiledSerializationMode = true,
  runtimeState?: CompiledRuntimeState<JoorConfigContext<TConfig>>
): CompiledRpcTransportBodyResultHandler => {
  const handlerConfig = (config ?? {}) as TConfig;
  const compiled = (runtimeState ??
    createCompiledRuntimeState(handlerConfig)) as CompiledRuntimeState<
    JoorConfigContext<TConfig>
  >;
  const middleware = handlerConfig.middleware ?? [];
  const hasBeforeHooks =
    handlerConfig.hooks?.beforeRequest !== undefined ||
    middleware.some((item) => item.beforeRequest !== undefined);
  const hasAfterHooks =
    handlerConfig.hooks?.afterResponse !== undefined ||
    middleware.some((item) => item.afterResponse !== undefined);
  const createHookContext = async (
    body?: CompiledHookBody<TConfig>
  ): Promise<
    HandlerHookContext<JoorConfigContext<TConfig>, CompiledHookBody<TConfig>>
  > => ({
    services: compiled.services ?? (await compiled.resolveServices()),
    ...(body === undefined ? {} : { body }),
  });
  const runBefore = async (
    request: ContextRequestSource,
    body: CompiledHookBody<TConfig>
  ): Promise<Response | undefined> => {
    const hookRequest = request.toRequest();
    const context = await createHookContext(body);
    const hookResult = await handlerConfig.hooks?.beforeRequest?.(
      hookRequest,
      context
    );
    if (hookResult instanceof Response) return hookResult;
    for (const item of middleware) {
      const result = await item.beforeRequest?.(hookRequest, context);
      if (result instanceof Response) return result;
    }
    return undefined;
  };
  const runAfter = async (
    response: Response,
    request: ContextRequestSource,
    body: CompiledHookBody<TConfig>
  ): Promise<Response> => {
    let next = response;
    const hookRequest = request.toRequest();
    const context = await createHookContext(body);
    for (const item of middleware) {
      const result = await item.afterResponse?.(next, hookRequest, context);
      if (result instanceof Response) next = result;
    }
    const hookResult = await handlerConfig.hooks?.afterResponse?.(
      next,
      hookRequest,
      context
    );
    return hookResult instanceof Response ? hookResult : next;
  };
  const execute = async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<CompiledBodyResult> => {
    if (preflight) {
      const early = requestPreflight(request, compiled.path);
      if (early !== undefined) return early;
    }
    const resolved = compiled.services ?? (await compiled.resolveServices());
    if (unaryDispatch !== undefined && isJsonObject(body)) {
      const unary = await unaryDispatch(
        body,
        request,
        resolved,
        compiled.runtime,
        uncachedExecutionState,
        serializationMode
      );
      if (unary !== undefined) return unary;
    }
    if (Array.isArray(body)) {
      const state = createExecutionState(true);
      const responses: RpcEnvelope[] = [];
      for (const item of body) {
        if (!isRpcRequest(item)) {
          responses.push(
            failure(
              '',
              traceId(request),
              'BAD_REQUEST',
              'Invalid RPC request',
              400
            )
          );
          continue;
        }
        const result = await dispatch(
          item,
          request,
          resolved,
          compiled.runtime,
          state,
          false
        );
        responses.push(
          result instanceof Response
            ? ((await result.json()) as RpcEnvelope)
            : isSerializedJsonEnvelope(result)
              ? (parseJson(result.body) as RpcEnvelope)
              : result
        );
      }
      return responses;
    }
    if (!isRpcRequest(body)) {
      return failure(
        '',
        traceId(request),
        'BAD_REQUEST',
        'Invalid RPC request',
        400
      );
    }
    return dispatch(
      body,
      request,
      resolved,
      compiled.runtime,
      uncachedExecutionState,
      serializationMode
    );
  };
  if (!hasBeforeHooks && !hasAfterHooks) return execute;
  return async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<CompiledBodyResult> => {
    const hookBody = body as CompiledHookBody<TConfig>;
    const early = hasBeforeHooks
      ? await runBefore(request, hookBody)
      : undefined;
    if (early !== undefined)
      return hasAfterHooks ? await runAfter(early, request, hookBody) : early;
    const result = await execute(request, body);
    if (!hasAfterHooks) return result;
    return runAfter(transportResultToResponse(result), request, hookBody);
  };
};

export const createCompiledRpcBodyResultHandler = <
  const TConfig extends JoorConfig = Record<string, never>,
>(
  dispatch: CompiledDispatch<JoorConfigContext<TConfig>>,
  config?: TConfig,
  unaryDispatch?: CompiledUnaryDispatch<JoorConfigContext<TConfig>>
): CompiledRpcBodyResultHandler => {
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    config,
    unaryDispatch
  );
  return (request: Request, body: JsonValue): Promise<CompiledBodyResult> =>
    handleTransport(createFetchRequestSource(request), body);
};

export const createCompiledRpcHandler = <
  const TConfig extends JoorConfig = Record<string, never>,
>(
  dispatch: CompiledDispatch<JoorConfigContext<TConfig>>,
  config?: TConfig,
  unaryDispatch?: CompiledUnaryDispatch<JoorConfigContext<TConfig>>
): CompiledRpcRequestHandler => {
  const handlerConfig = (config ?? {}) as TConfig;
  const bodyLimit = normalizeMaxBodyBytes(
    handlerConfig.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    handlerConfig,
    unaryDispatch,
    false,
    'response'
  );
  return async (request: Request): Promise<Response> => {
    const source = createFetchRequestSource(request);
    const early = requestPreflight(source, handlerConfig.path ?? '/rpc');
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      const payloadTooLarge =
        error instanceof Error && isBodySizeLimitError(error);
      const status = payloadTooLarge ? 413 : 400;
      return new Response(
        JSON.stringify(
          failure(
            '',
            traceId(source),
            payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
            payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
            status
          )
        ),
        { status, headers: jsonContentHeaders }
      );
    }
    const result = await handleTransport(source, body);
    if (result instanceof Response) return result;
    return isSerializedJsonEnvelope(result)
      ? serializedEnvelopeToResponse(result)
      : rpcEnvelopeToResponse(result);
  };
};
