import {
  authenticateOnce,
  createExecutionState,
  createProcedureCacheKey,
  parseDurationMs,
  readCachedProcedureSuccess,
  type CachedProcedureSuccess,
  type ExecutionState,
  writeCachedProcedureSuccess,
} from './optimization.js';
import {
  createContext,
  requestSourceFromRequest,
  type JoorContext,
  type ContextRequestSource,
} from '../context/context.js';
import { resolvePluginServices } from '../context/plugin.js';
import type { JoorConfig } from '../config.js';
import type { ProcedureRuntime } from '../procedure/types.js';
import type { RpcBodyResult } from '../rpc/dispatcher.js';
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

export interface CompiledRuntime {
  validateInput: boolean;
  validateHeaders: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
  enforceRateLimit: boolean;
}

export interface CompiledSerializedEnvelope {
  body: string;
  headers?: JsonObject;
}

export type CompiledBodyResult = RpcBodyResult | CompiledSerializedEnvelope;

export type CompiledDispatch = (
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: CompiledRuntime,
  state: ExecutionState,
  serialize: boolean
) => Promise<RpcEnvelope | Response | CompiledSerializedEnvelope>;

const jsonHeaders = { 'content-type': 'application/json' };
const rateLimitWindows = new Map<string, { count: number; resetAt: number }>();
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

const pathnameFromUrl = (url: string): string => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return '/';
  const queryStart = url.indexOf('?', pathStart);
  const hashStart = url.indexOf('#', pathStart);
  if (queryStart === -1 && hashStart === -1) return url.slice(pathStart);
  if (queryStart === -1) return url.slice(pathStart, hashStart);
  if (hashStart === -1) return url.slice(pathStart, queryStart);
  return url.slice(pathStart, Math.min(queryStart, hashStart));
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

const toResponse = (payload: RpcEnvelope | RpcEnvelope[]): Response => {
  const headers = new Headers(jsonHeaders);
  if (!Array.isArray(payload) && payload.ok && payload.headers !== undefined) {
    for (const [key, value] of Object.entries(payload.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
  }
  return new Response(JSON.stringify(payload), { status: 200, headers });
};

const isSerializedEnvelope = (
  value: CompiledBodyResult
): value is CompiledSerializedEnvelope =>
  !Array.isArray(value) &&
  !(value instanceof Response) &&
  'body' in value &&
  typeof value.body === 'string';

const serializedToResponse = (
  payload: CompiledSerializedEnvelope
): Response => {
  const headers = new Headers(jsonHeaders);
  if (payload.headers !== undefined) {
    for (const [key, value] of Object.entries(payload.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
  }
  return new Response(payload.body, { status: 200, headers });
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
export const compiledCreateContext = createContext;

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

export const compiledAuthenticate = (
  policy: ProcedureRuntime['auth'],
  ctx: JoorContext<object, object, object, object>,
  state: ExecutionState
): Promise<
  | object
  | {
      kind: 'error';
      error: RpcEnvelope extends infer TEnvelope
        ? TEnvelope extends { ok: false; error: infer TError }
          ? TError
          : never
        : never;
    }
> => authenticateOnce(policy, ctx, state);

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
  const identity =
    request.getHeader('x-forwarded-for') ??
    request.getHeader('cf-connecting-ip') ??
    'anonymous';
  const key = `${id}:${identity}`;
  const now = Date.now();
  const existing = rateLimitWindows.get(key);
  const windowMs = parseDurationMs(limit.window);
  if (existing === undefined || existing.resetAt <= now) {
    rateLimitWindows.set(key, { count: 1, resetAt: now + windowMs });
    return undefined;
  }
  if (existing.count >= limit.limit) {
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
  existing.count += 1;
  return undefined;
};

export const compiledRateLimitFailure = rateLimitFailure;

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
    responseHeaders
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
  if (limited !== undefined) return toResponse(limited);
  const headers = headerObject(request, procedure);
  const ctx = createContext({
    request,
    traceId: trace,
    services,
    headers,
    auth: {},
  });
  const authResult = await authenticateOnce(procedure.auth, ctx, state);
  if (isProcedureFailure(authResult)) {
    return toResponse({
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
    return toResponse(
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
    return toResponse(
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
    return toResponse(
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
  _serialize: boolean
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
  const ctx = createContext({
    request,
    traceId: trace,
    services,
    headers: headerResult.value as object,
    auth: {},
  });
  const authResult = await authenticateOnce(procedure.auth, ctx, state);
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
  if (!('kind' in result)) {
    return failure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (result.kind === 'error') {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: result.error,
    };
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

const createCompiledRuntime = (config: JoorConfig = {}) => {
  const servicesPromise = resolvePluginServices(config.plugins ?? []);
  let services: object | undefined;
  if (config.plugins === undefined || config.plugins.length === 0) {
    services = {};
  } else {
    servicesPromise.then((resolved) => {
      services = resolved;
      return resolved;
    });
  }
  const path = config.path ?? '/rpc';
  const runtime: CompiledRuntime = {
    validateHeaders: config.validateHeaders ?? true,
    validateInput: config.validateInput ?? true,
    validateOutput: config.validateOutput ?? true,
    validateResponseHeaders: config.validateResponseHeaders ?? true,
    enforceRateLimit: config.enforceRateLimit ?? true,
  };
  return {
    path,
    runtime,
    async resolveServices(): Promise<object> {
      return services ?? (await servicesPromise);
    },
  };
};

export const createCompiledRpcTransportBodyResultHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {}
): ((
  request: ContextRequestSource,
  body: JsonValue
) => Promise<CompiledBodyResult>) => {
  const compiled = createCompiledRuntime(config);
  return async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<CompiledBodyResult> => {
    const state = createExecutionState();
    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { allow: 'POST' } });
    }
    if (pathnameFromUrl(request.url) !== compiled.path) {
      return new Response(null, { status: 404 });
    }
    if (Array.isArray(body)) {
      const resolved = await compiled.resolveServices();
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
            : isSerializedEnvelope(result)
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
      await compiled.resolveServices(),
      compiled.runtime,
      state,
      true
    );
  };
};

export const createCompiledRpcBodyResultHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {}
): ((request: Request, body: JsonValue) => Promise<CompiledBodyResult>) => {
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    config
  );
  return (request: Request, body: JsonValue): Promise<CompiledBodyResult> =>
    handleTransport(requestSourceFromRequest(request), body);
};

export const createCompiledRpcHandler = (
  dispatch: CompiledDispatch,
  config: JoorConfig = {}
): ((request: Request) => Promise<Response>) => {
  const handleTransport = createCompiledRpcTransportBodyResultHandler(
    dispatch,
    config
  );
  return async (request: Request): Promise<Response> => {
    const source = requestSourceFromRequest(request);
    let body: JsonValue;
    try {
      const text = await request.text();
      body = text.length === 0 ? {} : parseJson(text);
    } catch {
      return toResponse(
        failure('', traceId(source), 'PARSE_ERROR', 'Invalid JSON body', 400)
      );
    }
    const result = await handleTransport(source, body);
    if (result instanceof Response) return result;
    return isSerializedEnvelope(result)
      ? serializedToResponse(result)
      : toResponse(result);
  };
};
