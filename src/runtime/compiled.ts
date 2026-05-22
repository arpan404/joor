import {
  authenticateOnce,
  authenticateUncached,
  createExecutionState,
  type ExecutionState,
  uncachedExecutionState,
} from './internal/auth-execution.js';
import {
  createProcedureCacheKey,
  DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES,
  readCachedProcedureSuccess,
  type CachedProcedureSuccess,
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
import type { JoorConfig } from '../config.js';
import type {
  ProcedureRuntime,
  ProcedureRuntimeValue,
} from '../procedure/types.js';
import type { ProcedureResult } from '../procedure/result.js';
import type { RpcBodyResult } from '../rpc/dispatcher.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from './body.js';
import {
  createJsonHeaderRecord,
  hasInvalidHeaderValue,
  isSerializedJsonEnvelope,
  jsonContentHeaders,
  jsonOkResponseInit,
  rpcEnvelopeToResponse,
  serializedEnvelopeToResponse,
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

export interface CompiledRuntimeState {
  path: string;
  runtime: CompiledRuntime;
  services: object | undefined;
  getServices(): object | undefined;
  resolveServices(): Promise<object>;
}

export interface CompiledSerializedEnvelope extends SerializedJsonEnvelope {}

export type CompiledSerializationMode = false | true | 'response';
export type CompiledBodyResult = RpcBodyResult | CompiledSerializedEnvelope;
export type CompiledRpcTransportBodyResultHandler<TBody = JsonValue> = (
  request: ContextRequestSource,
  body: TBody
) => Promise<CompiledBodyResult>;

export type CompiledRpcBodyResultHandler<TBody = JsonValue> = (
  request: Request,
  body: TBody
) => Promise<CompiledBodyResult>;

export type CompiledUnaryDispatch = (
  body: JsonObject,
  request: ContextRequestSource,
  services: object,
  runtime: CompiledRuntime,
  state: ExecutionState,
  serialize: CompiledSerializationMode
) => Promise<CompiledBodyResult | undefined>;

export type CompiledFixedUnaryDispatch = (
  body: JsonObject,
  request: ContextRequestSource,
  services: object,
  runtime: CompiledRuntime,
  state: ExecutionState
) => Promise<CompiledBodyResult | undefined>;

export type CompiledDispatch = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: CompiledRuntime,
  state: ExecutionState,
  serialize: CompiledSerializationMode
) => Promise<RpcEnvelope | Response | CompiledSerializedEnvelope>;

export type CompiledFixedDispatch = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
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

const failure = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number,
  details?: JsonValue
): RpcEnvelope =>
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
): JsonObject => {
  const output: JsonObject = {};
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
): ReturnType<typeof authenticateOnce> => authenticateOnce(policy, ctx, state);

export const compiledAuthenticateUncached = (
  policy: ProcedureRuntime['auth'],
  ctx: JoorContext<object, object, object, object>
): ReturnType<typeof authenticateUncached> => authenticateUncached(policy, ctx);

const rateLimitFailure = (
  id: string,
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  trace: string,
  runtime: CompiledRuntime
): RpcEnvelope | undefined => {
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

export const compiledRateLimitFailureStatic = (
  id: string,
  limit: number,
  window: string,
  windowMs: number,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  trace: string,
  runtime: CompiledRuntime
): RpcEnvelope | undefined => {
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
  headers: JsonObject,
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
  headers: JsonObject,
  auth: object,
  data: JsonValue,
  responseHeaders?: JsonObject
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

const streamResponse = async (
  id: string,
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
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

export const executeCompiledProcedure = async (
  id: string,
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: CompiledRuntime,
  state: ExecutionState,
  _serialize: CompiledSerializationMode
): Promise<RpcEnvelope | Response> => {
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
    headerResult.value as JsonObject,
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
      headerResult.value as JsonObject,
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
      headerResult.value as JsonObject,
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
    headerResult.value as JsonObject,
    authResult,
    result.data
  );
  return { ok: true, id: rpcRequest.id, traceId: trace, data: result.data };
};

export const compiledNotFound = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource
): RpcEnvelope =>
  failure(
    rpcRequest.id,
    traceId(request, rpcRequest.traceId),
    'NOT_FOUND',
    'Procedure not found',
    404
  );

export const createCompiledRuntimeState = (
  config: JoorConfig = {}
): CompiledRuntimeState => {
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
};

export const createCompiledRpcTransportBodyResultHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {},
  unaryDispatch?: CompiledUnaryDispatch,
  preflight = true,
  serializationMode: CompiledSerializationMode = true,
  runtimeState?: CompiledRuntimeState
): CompiledRpcTransportBodyResultHandler => {
  const compiled = runtimeState ?? createCompiledRuntimeState(config);
  return async (
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
};

export const createCompiledRpcBodyResultHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {},
  unaryDispatch?: CompiledUnaryDispatch
): CompiledRpcBodyResultHandler => {
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    config,
    unaryDispatch
  );
  return (request: Request, body: JsonValue): Promise<CompiledBodyResult> =>
    handleTransport(createFetchRequestSource(request), body);
};

export const createCompiledRpcHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {},
  unaryDispatch?: CompiledUnaryDispatch
): ((request: Request) => Promise<Response>) => {
  const bodyLimit = normalizeMaxBodyBytes(
    config.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    config,
    unaryDispatch,
    false,
    'response'
  );
  return async (request: Request): Promise<Response> => {
    const source = createFetchRequestSource(request);
    const early = requestPreflight(source, config.path ?? '/rpc');
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
