import { createContext } from '../context/context.js';
import { resolvePluginServices, type JoorPlugin } from '../context/plugin.js';
import type {
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
  validationDetails,
  type RpcEnvelope,
  type RpcFailure,
  type RpcRequest,
} from './protocol.js';

export interface RpcManifest {
  procedures: Record<string, ProcedureRuntime>;
}

export interface HandlerOptions {
  plugins?: readonly JoorPlugin<object>[];
  path?: string;
  cors?: {
    origin?: string;
    headers?: string[];
    methods?: string[];
  };
  maxBodyBytes?: number;
  onError?(error: Error, request: Request): void;
}

const jsonHeaders = { 'content-type': 'application/json' };
const defaultMaxBodyBytes = 1024 * 1024;

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

const traceId = (request: Request, requested?: string): string =>
  requested ?? request.headers.get('x-request-id') ?? crypto.randomUUID();

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
): Response =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...jsonHeaders, ...corsHeaders(options) },
  });

const isRpcRequest = (value: JsonValue): value is JsonObject & RpcRequest =>
  isJsonObject(value) &&
  typeof value['id'] === 'string' &&
  (value['traceId'] === undefined || typeof value['traceId'] === 'string');

const isAsyncIterable = (
  value: ProcedureRuntimeValue
): value is AsyncIterable<JsonValue> => Symbol.asyncIterator in Object(value);

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
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest,
  request: Request,
  services: object
): Promise<RpcEnvelope> => {
  const trace = traceId(request, rpcRequest.traceId);
  const inputResult = validate(procedure.input, rpcRequest.input, 'input');
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

  const ctx = createContext({ request, traceId: trace, services });
  const result = await procedure.handler(ctx, inputResult.value as JsonValue);
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
    if (procedure.output !== undefined) {
      const outputResult = validate(procedure.output, result.data, 'output');
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
  procedure: ProcedureRuntime,
  rpcRequest: RpcRequest,
  request: Request,
  services: object
): Promise<Response> => {
  const trace = traceId(request, rpcRequest.traceId);
  const inputResult = validate(procedure.input, rpcRequest.input, 'input');
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

  const ctx = createContext({ request, traceId: trace, services });
  const iterable = procedure.handler(ctx, inputResult.value as JsonValue);
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
  const plugins = options.plugins ?? [];
  return async (request: Request): Promise<Response> => {
    if (request.method === 'OPTIONS' && options.cors !== undefined) {
      return new Response(null, { status: 204, headers: corsHeaders(options) });
    }
    const url = new URL(request.url);
    if ((options.path ?? '/rpc') !== url.pathname) {
      return new Response(null, { status: 404, headers: corsHeaders(options) });
    }
    if (request.method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: { allow: 'POST', ...corsHeaders(options) },
      });
    }
    const contentType = request.headers.get('content-type') ?? '';
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
          traceId(request),
          'PARSE_ERROR',
          'Invalid JSON body',
          400
        ),
        options
      );
    }

    const services = await resolvePluginServices(plugins);
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
        const procedure = manifest.procedures[item.id];
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
        responses.push(await executeUnary(procedure, item, request, services));
      }
      return toResponse(responses, options);
    }

    if (!isRpcRequest(body)) {
      return toResponse(
        rpcFailure(
          '',
          traceId(request),
          'BAD_REQUEST',
          'Invalid RPC request',
          400
        ),
        options
      );
    }

    const procedure = manifest.procedures[body.id];
    if (procedure === undefined) {
      return toResponse(
        rpcFailure(
          body.id,
          traceId(request, body.traceId),
          'NOT_FOUND',
          'Procedure not found',
          404
        ),
        options
      );
    }

    if (request.headers.get('accept')?.includes('text/event-stream') === true) {
      return executeStream(procedure, body, request, services);
    }
    return toResponse(
      await executeUnary(procedure, body, request, services),
      options
    );
  };
};
