import {
  createContext,
  requestSourceFromRequest,
  type ContextRequestSource,
} from '../context/context.js';
import { resolvePluginServices, type JoorPlugin } from '../context/plugin.js';
import type {
  MaybePromise,
  ProcedureRuntime,
  ProcedureRuntimeValue,
} from '../procedure/types.js';
import {
  isJsonObject,
  parseJson,
  type JsonObject,
  type JsonValue,
} from '../schema/json.js';
import { validate } from '../schema/validate.js';
import { createSseResponse, encodeSse } from './stream.js';
import {
  authenticateOnce,
  createExecutionState,
  createProcedureCacheKey,
  parseDurationMs,
  readCachedProcedureSuccess,
  type CachedProcedureSuccess,
  type ExecutionState,
  writeCachedProcedureSuccess,
} from '../runtime/optimization.js';
import {
  validationDetails,
  type RpcEnvelope,
  type RpcFailure,
  type RpcRequest,
} from './protocol.js';

export interface RpcManifest {
  procedures: Record<string, ProcedureRuntime>;
}

export type RpcBodyResult = RpcEnvelope | RpcEnvelope[] | Response;

interface PreparedProcedure {
  procedure: ProcedureRuntime;
  headers?: ProcedureRuntime['headers'];
  responseHeaders?: ProcedureRuntime['responseHeaders'];
  auth?: ProcedureRuntime['auth'];
  output?: ProcedureRuntime['output'];
  headerKeys?: string[];
  rateLimit?: {
    limit: number;
    window: string;
    windowMs: number;
  };
}

interface RuntimeOptions {
  cors: HeadersInit;
  enforceRateLimit: boolean;
  validateHeaders: boolean;
  validateInput: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
  rpcPath: string;
}

export interface HandlerOptions {
  plugins?: readonly JoorPlugin<object>[];
  middleware?: readonly JoorMiddleware[];
  hooks?: HandlerHooks;
  path?: string;
  cors?: {
    origin?: string;
    headers?: string[];
    methods?: string[];
  };
  maxBodyBytes?: number;
  validateInput?: boolean;
  validateHeaders?: boolean;
  validateOutput?: boolean;
  validateResponseHeaders?: boolean;
  enforceRateLimit?: boolean;
  onError?(error: Error, request: Request): void;
}

export interface HandlerHooks {
  beforeRequest?(request: Request): MaybePromise<Response | undefined>;
  afterResponse?(
    response: Response,
    request: Request
  ): MaybePromise<Response | undefined>;
}

export interface JoorMiddleware extends HandlerHooks {
  name: string;
}

const jsonHeaders = { 'content-type': 'application/json' };
const defaultMaxBodyBytes = 1024 * 1024;
const rateLimitWindows = new Map<string, { count: number; resetAt: number }>();
const procedureSuccessCache = new Map<string, CachedProcedureSuccess>();
let traceCounter = 0;

const corsHeaders = (options: HandlerOptions): HeadersInit => {
  if (options.cors === undefined) return {};
  return {
    'access-control-allow-origin': options.cors.origin ?? '*',
    'access-control-allow-methods': (
      options.cors.methods ?? ['POST', 'OPTIONS']
    ).join(', '),
    'access-control-allow-headers': (
      options.cors.headers ?? ['content-type', 'accept', 'x-request-id']
    ).join(', '),
  };
};

const traceId = (request: ContextRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return `trace-${traceCounter}`;
};

const rpcFailure = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number,
  details?: JsonValue
): RpcFailure => ({
  ok: false,
  id,
  traceId: trace,
  error:
    details === undefined
      ? { code, message, status }
      : { code, message, status, details },
});

const toResponse = (
  payload: RpcEnvelope | RpcEnvelope[],
  options: HandlerOptions = {}
): Response => {
  const headers = new Headers({ ...jsonHeaders, ...corsHeaders(options) });
  if (!Array.isArray(payload) && payload.ok && payload.headers !== undefined) {
    for (const [key, value] of Object.entries(payload.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
  }
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers,
  });
};

const isRpcRequest = (value: JsonValue): value is JsonObject & RpcRequest =>
  isJsonObject(value) &&
  typeof value['id'] === 'string' &&
  (value['traceId'] === undefined || typeof value['traceId'] === 'string');

const isAsyncIterable = (
  value: ProcedureRuntimeValue
): value is AsyncIterable<JsonValue> => Symbol.asyncIterator in Object(value);

const headersToJsonObject = (
  request: ContextRequestSource,
  prepared: PreparedProcedure
): JsonObject => {
  const output: JsonObject = {};
  if (prepared.headerKeys !== undefined) {
    for (const key of prepared.headerKeys) {
      const value = request.getHeader(key);
      if (value !== null) output[key] = value;
    }
    return output;
  }
  for (const [key, value] of request.toHeaders())
    output[key.toLowerCase()] = value;
  return output;
};

const isProcedureFailure = (
  value: object
): value is { kind: 'error'; error: RpcFailure['error'] } =>
  'kind' in value && value.kind === 'error' && 'error' in value;

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

const prepareProcedures = (
  manifest: RpcManifest
): Record<string, PreparedProcedure> => {
  const procedures: Record<string, PreparedProcedure> = Object.create(
    null
  ) as Record<string, PreparedProcedure>;
  for (const [id, procedure] of Object.entries(manifest.procedures)) {
    const headerKeys =
      procedure.headers?.kind === 'object'
        ? Object.keys(procedure.headers.shape)
        : undefined;
    const limit = procedure.meta.rateLimit;
    procedures[id] = {
      procedure,
      ...(procedure.headers === undefined
        ? {}
        : { headers: procedure.headers }),
      ...(procedure.responseHeaders === undefined
        ? {}
        : { responseHeaders: procedure.responseHeaders }),
      ...(procedure.auth === undefined ? {} : { auth: procedure.auth }),
      ...(procedure.output === undefined ? {} : { output: procedure.output }),
      ...(headerKeys === undefined ? {} : { headerKeys }),
      ...(limit === undefined
        ? {}
        : {
            rateLimit: {
              limit: limit.limit,
              window: limit.window,
              windowMs: parseDurationMs(limit.window),
            },
          }),
    };
  }
  return procedures;
};

const rateLimitFailure = (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  trace: string,
  runtime: RuntimeOptions
): RpcFailure | undefined => {
  if (!runtime.enforceRateLimit) return undefined;
  const limit = prepared.rateLimit;
  if (limit === undefined) return undefined;
  const identity =
    request.getHeader('x-forwarded-for') ??
    request.getHeader('cf-connecting-ip') ??
    'anonymous';
  const key = `${rpcRequest.id}:${identity}`;
  const now = Date.now();
  const existing = rateLimitWindows.get(key);
  if (existing === undefined || existing.resetAt <= now) {
    rateLimitWindows.set(key, {
      count: 1,
      resetAt: now + limit.windowMs,
    });
    return undefined;
  }
  if (existing.count >= limit.limit) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'RATE_LIMITED',
      'Rate limit exceeded',
      429,
      { limit: limit.limit, window: limit.window }
    );
  }
  existing.count += 1;
  return undefined;
};

const parseRequestBody = async (
  request: Request,
  maxBodyBytes: number
): Promise<JsonValue> => {
  const body = await request.text();
  if (body.length > maxBodyBytes) {
    throw new Error('Request body exceeds maxBodyBytes');
  }
  if (body.length === 0) return {};
  return parseJson(body);
};

const executeUnary = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    prepared,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return limited;
  const headerValue =
    prepared.headers === undefined
      ? {}
      : headersToJsonObject(request, prepared);
  const headerResult =
    prepared.headers === undefined
      ? ({ ok: true, value: {} } as const)
      : !runtime.validateHeaders
        ? ({ ok: true, value: headerValue } as const)
        : validate(prepared.headers, headerValue, 'headers');
  if (!headerResult.ok) {
    return rpcFailure(
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
  const authResult = await authenticateOnce(prepared.auth, ctx, state);
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
    return rpcFailure(
      rpcRequest.id,
      trace,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      validationDetails(inputResult.issues)
    );
  }

  ctx.auth = authResult;
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  const cacheKey =
    cacheConfig === undefined
      ? undefined
      : createProcedureCacheKey(
          rpcRequest.id,
          cacheConfig.key,
          (inputResult.value ?? {}) as JsonValue,
          headerResult.value as JsonObject,
          authResult
        );
  if (cacheKey !== undefined) {
    const cached = readCachedProcedureSuccess(procedureSuccessCache, cacheKey);
    if (cached !== undefined) {
      return cached.headers === undefined
        ? {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
          }
        : {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
            headers: cached.headers,
          };
    }
  }
  const result = await procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (isAsyncIterable(result)) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (result.kind === 'success') {
    if (prepared.output !== undefined && runtime.validateOutput) {
      const outputResult = validate(prepared.output, result.data, 'output');
      if (!outputResult.ok) {
        return rpcFailure(
          rpcRequest.id,
          trace,
          'OUTPUT_VALIDATION_ERROR',
          'Handler returned invalid output',
          500,
          validationDetails(outputResult.issues)
        );
      }
    }
    if (
      prepared.responseHeaders !== undefined &&
      runtime.validateResponseHeaders
    ) {
      const responseHeaderResult = validate(
        prepared.responseHeaders,
        result.headers,
        'responseHeaders'
      );
      if (!responseHeaderResult.ok) {
        return rpcFailure(
          rpcRequest.id,
          trace,
          'RESPONSE_HEADER_VALIDATION_ERROR',
          'Handler returned invalid response headers',
          500,
          validationDetails(responseHeaderResult.issues)
        );
      }
      return {
        ok: true,
        id: rpcRequest.id,
        traceId: trace,
        data: result.data,
        headers: responseHeaderResult.value as JsonObject,
      };
    }
    if (result.headers !== undefined) {
      if (cacheKey !== undefined && cacheConfig !== undefined) {
        writeCachedProcedureSuccess(
          procedureSuccessCache,
          cacheKey,
          parseDurationMs(cacheConfig.ttl),
          result.data,
          result.headers
        );
      }
      return {
        ok: true,
        id: rpcRequest.id,
        traceId: trace,
        data: result.data,
        headers: result.headers,
      };
    }
    if (cacheKey !== undefined && cacheConfig !== undefined) {
      writeCachedProcedureSuccess(
        procedureSuccessCache,
        cacheKey,
        parseDurationMs(cacheConfig.ttl),
        result.data
      );
    }
    return { ok: true, id: rpcRequest.id, traceId: trace, data: result.data };
  }
  return {
    ok: false,
    id: rpcRequest.id,
    traceId: trace,
    error: result.error,
  };
};

const executeTrustedUnary = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  _runtime: RuntimeOptions,
  state: ExecutionState
): Promise<RpcEnvelope> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const headerValue =
    prepared.headers === undefined
      ? {}
      : headersToJsonObject(request, prepared);
  const ctx = createContext({
    request,
    traceId: trace,
    services,
    headers: headerValue,
    auth: {},
  });
  const authResult = await authenticateOnce(prepared.auth, ctx, state);
  if (isProcedureFailure(authResult)) {
    return {
      ok: false,
      id: rpcRequest.id,
      traceId: trace,
      error: authResult.error,
    };
  }

  ctx.auth = authResult;
  const cacheConfig =
    procedure.meta.kind === 'query' ? procedure.meta.cache : undefined;
  const cacheKey =
    cacheConfig === undefined
      ? undefined
      : createProcedureCacheKey(
          rpcRequest.id,
          cacheConfig.key,
          rpcRequest.input ?? {},
          headerValue,
          authResult
        );
  if (cacheKey !== undefined) {
    const cached = readCachedProcedureSuccess(procedureSuccessCache, cacheKey);
    if (cached !== undefined) {
      return cached.headers === undefined
        ? {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
          }
        : {
            ok: true,
            id: rpcRequest.id,
            traceId: trace,
            data: cached.data,
            headers: cached.headers,
          };
    }
  }
  const result = await procedure.handler(ctx, rpcRequest.input ?? {});
  if (!('kind' in result)) {
    return rpcFailure(
      rpcRequest.id,
      trace,
      'STREAM_REQUIRED',
      'Use streaming transport',
      400
    );
  }
  if (result.kind === 'success') {
    if (cacheKey !== undefined && cacheConfig !== undefined) {
      writeCachedProcedureSuccess(
        procedureSuccessCache,
        cacheKey,
        parseDurationMs(cacheConfig.ttl),
        result.data,
        result.headers
      );
    }
    if (result.headers !== undefined) {
      return {
        ok: true,
        id: rpcRequest.id,
        traceId: trace,
        data: result.data,
        headers: result.headers,
      };
    }
    return { ok: true, id: rpcRequest.id, traceId: trace, data: result.data };
  }
  return {
    ok: false,
    id: rpcRequest.id,
    traceId: trace,
    error: result.error,
  };
};

const executeStream = async (
  prepared: PreparedProcedure,
  rpcRequest: RpcRequest,
  request: ContextRequestSource,
  services: object,
  runtime: RuntimeOptions,
  state: ExecutionState
): Promise<Response> => {
  const procedure = prepared.procedure;
  const trace = traceId(request, rpcRequest.traceId);
  const limited = rateLimitFailure(
    prepared,
    rpcRequest,
    request,
    trace,
    runtime
  );
  if (limited !== undefined) return toResponse(limited);
  const headerValue =
    prepared.headers === undefined
      ? {}
      : headersToJsonObject(request, prepared);
  const headerResult =
    prepared.headers === undefined
      ? ({ ok: true, value: {} } as const)
      : !runtime.validateHeaders
        ? ({ ok: true, value: headerValue } as const)
        : validate(prepared.headers, headerValue, 'headers');
  if (!headerResult.ok) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'HEADER_VALIDATION_ERROR',
        'Header validation failed',
        400,
        validationDetails(headerResult.issues)
      )
    );
  }
  const ctx = createContext({
    request,
    traceId: trace,
    services,
    headers: headerResult.value as object,
    auth: {},
  });
  const authResult = await authenticateOnce(prepared.auth, ctx, state);
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
      rpcFailure(
        rpcRequest.id,
        trace,
        'VALIDATION_ERROR',
        'Validation failed',
        400,
        validationDetails(inputResult.issues)
      )
    );
  }
  const streamSchema = procedure.stream;
  if (streamSchema === undefined) {
    return toResponse(
      rpcFailure(
        rpcRequest.id,
        trace,
        'NOT_STREAMING',
        'Procedure is not streaming',
        400
      )
    );
  }

  ctx.auth = authResult;
  const iterable = procedure.handler(
    ctx,
    (inputResult.value ?? {}) as JsonValue
  );
  if (!isAsyncIterable(iterable)) {
    return toResponse(
      rpcFailure(
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
        for await (const event of iterable) {
          const eventResult = validate(streamSchema, event, 'event');
          if (!eventResult.ok) {
            controller.enqueue(
              encodeSse(
                'error',
                rpcFailure(
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
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Stream failed';
        controller.enqueue(
          encodeSse(
            'error',
            rpcFailure(rpcRequest.id, trace, 'INTERNAL_ERROR', message, 500)
          )
        );
      } finally {
        controller.close();
      }
    },
  });
  return createSseResponse(stream);
};

export const createRpcHandler = (
  manifest: RpcManifest,
  options: HandlerOptions = {}
): ((request: Request) => Promise<Response>) => {
  const handleParsed = createRpcBodyHandler(manifest, options);
  return async (request: Request): Promise<Response> => {
    let body: JsonValue;
    try {
      body = await parseRequestBody(
        request,
        options.maxBodyBytes ?? defaultMaxBodyBytes
      );
    } catch (error) {
      if (error instanceof Error) options.onError?.(error, request);
      return toResponse(
        rpcFailure(
          '',
          traceId(requestSourceFromRequest(request)),
          'PARSE_ERROR',
          'Invalid JSON body',
          400
        ),
        options
      );
    }
    return handleParsed(request, body);
  };
};

export const createRpcBodyHandler = (
  manifest: RpcManifest,
  options: HandlerOptions = {}
): ((request: Request, body: JsonValue) => Promise<Response>) => {
  const handleResult = createRpcBodyResultHandler(manifest, options);
  return async (request: Request, body: JsonValue): Promise<Response> => {
    const result = await handleResult(request, body);
    return result instanceof Response ? result : toResponse(result, options);
  };
};

export const createRpcBodyResultHandler = (
  manifest: RpcManifest,
  options: HandlerOptions = {}
): ((request: Request, body: JsonValue) => Promise<RpcBodyResult>) => {
  const handleTransport = createRpcTransportBodyResultHandler(
    manifest,
    options
  );
  return (request: Request, body: JsonValue): Promise<RpcBodyResult> =>
    handleTransport(requestSourceFromRequest(request), body);
};

export const createRpcTransportBodyResultHandler = (
  manifest: RpcManifest,
  options: HandlerOptions = {}
): ((
  request: ContextRequestSource,
  body: JsonValue
) => Promise<RpcBodyResult>) => {
  const procedures = prepareProcedures(manifest);
  const runtime: RuntimeOptions = {
    cors: corsHeaders(options),
    enforceRateLimit: options.enforceRateLimit ?? true,
    validateHeaders: options.validateHeaders ?? true,
    validateInput: options.validateInput ?? true,
    validateOutput: options.validateOutput ?? true,
    validateResponseHeaders: options.validateResponseHeaders ?? true,
    rpcPath: options.path ?? '/rpc',
  };
  const useTrustedUnary =
    !runtime.enforceRateLimit &&
    !runtime.validateHeaders &&
    !runtime.validateInput &&
    !runtime.validateOutput &&
    !runtime.validateResponseHeaders;
  const plugins = options.plugins ?? [];
  let services: object | undefined;
  const servicesPromise =
    plugins.length === 0
      ? Promise.resolve({})
      : resolvePluginServices(plugins).then((resolved) => {
          services = resolved;
          return resolved;
        });
  if (plugins.length === 0) services = {};
  const middleware = options.middleware ?? [];
  const hasBeforeHooks =
    options.hooks?.beforeRequest !== undefined ||
    middleware.some((item) => item.beforeRequest !== undefined);
  const hasAfterHooks =
    options.hooks?.afterResponse !== undefined ||
    middleware.some((item) => item.afterResponse !== undefined);
  const runBefore = async (
    request: ContextRequestSource
  ): Promise<Response | undefined> => {
    const hookRequest = request.toRequest();
    const hookResult = await options.hooks?.beforeRequest?.(hookRequest);
    if (hookResult instanceof Response) return hookResult;
    for (const item of middleware) {
      const result = await item.beforeRequest?.(hookRequest);
      if (result instanceof Response) return result;
    }
    return undefined;
  };
  const runAfter = async (
    response: Response,
    request: ContextRequestSource
  ): Promise<RpcBodyResult> => {
    let next = response;
    const hookRequest = request.toRequest();
    for (const item of middleware) {
      const result = await item.afterResponse?.(next, hookRequest);
      if (result instanceof Response) next = result;
    }
    const hookResult = await options.hooks?.afterResponse?.(next, hookRequest);
    return hookResult instanceof Response ? hookResult : next;
  };
  const handleRequest = async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<RpcBodyResult> => {
    if (request.method === 'OPTIONS' && options.cors !== undefined) {
      return new Response(null, { status: 204, headers: runtime.cors });
    }
    if (runtime.rpcPath !== pathnameFromUrl(request.url)) {
      return new Response(null, { status: 404, headers: runtime.cors });
    }
    if (request.method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: { allow: 'POST', ...runtime.cors },
      });
    }
    const contentType = request.getHeader('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return toResponse(
        rpcFailure(
          '',
          traceId(request),
          'UNSUPPORTED_MEDIA_TYPE',
          'Content-Type must be application/json',
          415
        ),
        options
      );
    }

    const requestServices = services ?? (await servicesPromise);
    const state = createExecutionState();
    if (Array.isArray(body)) {
      const responses: RpcEnvelope[] = [];
      for (const item of body) {
        if (!isRpcRequest(item)) {
          responses.push(
            rpcFailure(
              '',
              traceId(request),
              'BAD_REQUEST',
              'Invalid RPC request',
              400
            )
          );
          continue;
        }
        const procedure = procedures[item.id];
        if (procedure === undefined) {
          responses.push(
            rpcFailure(
              item.id,
              traceId(request, item.traceId),
              'NOT_FOUND',
              'Procedure not found',
              404
            )
          );
          continue;
        }
        responses.push(
          useTrustedUnary
            ? await executeTrustedUnary(
                procedure,
                item,
                request,
                requestServices,
                runtime,
                state
              )
            : await executeUnary(
                procedure,
                item,
                request,
                requestServices,
                runtime,
                state
              )
        );
      }
      return responses;
    }

    if (!isRpcRequest(body)) {
      return rpcFailure(
        '',
        traceId(request),
        'BAD_REQUEST',
        'Invalid RPC request',
        400
      );
    }

    const procedure = procedures[body.id];
    if (procedure === undefined) {
      return rpcFailure(
        body.id,
        traceId(request, body.traceId),
        'NOT_FOUND',
        'Procedure not found',
        404
      );
    }

    if (request.getHeader('accept')?.includes('text/event-stream') === true) {
      return executeStream(
        procedure,
        body,
        request,
        requestServices,
        runtime,
        state
      );
    }
    return useTrustedUnary
      ? executeTrustedUnary(
          procedure,
          body,
          request,
          requestServices,
          runtime,
          state
        )
      : executeUnary(procedure, body, request, requestServices, runtime, state);
  };
  if (!hasBeforeHooks && !hasAfterHooks) return handleRequest;
  return async (
    request: ContextRequestSource,
    body: JsonValue
  ): Promise<RpcBodyResult> => {
    const early = hasBeforeHooks ? await runBefore(request) : undefined;
    if (early !== undefined) {
      return hasAfterHooks ? runAfter(early, request) : early;
    }
    const result = await handleRequest(request, body);
    if (!hasAfterHooks) return result;
    if (result instanceof Response) return runAfter(result, request);
    return runAfter(toResponse(result, options), request);
  };
};
