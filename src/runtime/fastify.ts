import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from 'node:http';
import type { ContextRequestSource } from '../context/context.js';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type { JsonValue } from '../schema/json.js';
import type { RpcEnvelope } from '../rpc/protocol.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import {
  createRpcRequestPreflight,
  createRpcTransportBodyResultHandler,
} from '../rpc/dispatcher.js';
import {
  BodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES,
  normalizeMaxBodyBytes,
} from './body.js';
import {
  appendJsonStringHeaders,
  createCorsHeaderRecord,
  createJsonHeaderRecord,
  isSerializedJsonEnvelope,
  type SerializedJsonEnvelope,
  type TransportBodyResult,
} from './response.js';

export interface FastifyRequest<
  TBody = unknown,
  TIncoming extends IncomingMessage = IncomingMessage,
> {
  readonly __types?: (
    body: TBody,
    incoming: TIncoming
  ) => readonly [TBody, TIncoming];
  body?: TBody;
  headers: IncomingHttpHeaders;
  hostname?: string;
  ip?: string;
  method: string;
  originalUrl?: string;
  protocol?: string;
  raw?: TIncoming;
  url: string;
}

export interface FastifyReply<
  TIncoming extends IncomingMessage = IncomingMessage,
> {
  readonly __incomingType?: (incoming: TIncoming) => TIncoming;
  raw: ServerResponse<TIncoming>;
  hijack?(): void;
}

type FastifyRequestLike = {
  body?: unknown;
  headers: IncomingHttpHeaders;
  hostname?: string;
  ip?: string;
  method: string;
  originalUrl?: string;
  protocol?: string;
  raw?: IncomingMessage;
  url: string;
};

type FastifyRequestIncoming<TRequest extends FastifyRequestLike> =
  TRequest extends FastifyRequest<infer _TBody, infer TIncoming>
    ? TIncoming
    : IncomingMessage;

type FastifyReplyLike<TIncoming extends IncomingMessage = IncomingMessage> = {
  readonly __incomingType?: (incoming: TIncoming) => TIncoming;
  raw: ServerResponse<TIncoming>;
  hijack?(): void;
};

export type FastifyHandler<
  TRequest extends FastifyRequestLike = FastifyRequest,
  TReply extends FastifyReplyLike<FastifyRequestIncoming<TRequest>> =
    FastifyReply<FastifyRequestIncoming<TRequest>>,
> = (
  request: TRequest,
  reply: TReply
) => void | Promise<void>;

export interface FastifyHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly hostname?: string;
  readonly useOriginalUrl?: boolean;
}

export type FastifyHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyHandlerOptions<TPlugins, TBody, TRequest> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type FastifyRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type FastifyUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type FastifyRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type FastifyStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type FastifyHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  FastifyHandlerOptions<TPlugins, TBody, TRequest>,
  TBody,
  FastifyHandlerOptions<TPlugins, TBody, TRequest> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type FastifyRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type FastifyUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type FastifyRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type FastifyStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = FastifyRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

const neverAbortedSignal = new AbortController().signal;

const getRequestHeader = (
  request: FastifyRequest,
  name: string
): string | null => {
  const value = request.headers[name.toLowerCase()];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return null;
};

const headersFromFastifyRequest = (request: FastifyRequest): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    }
  }
  return headers;
};

class FastifyRequestSource implements ContextRequestSource {
  readonly method: string;
  readonly url: string;
  readonly signal = neverAbortedSignal;
  readonly remoteAddress: string | undefined;
  private headers?: Headers;
  private request?: Request;

  constructor(
    private readonly fastifyRequest: FastifyRequest,
    private readonly body: JsonValue,
    hostname: string,
    useOriginalUrl: boolean
  ) {
    this.method = fastifyRequest.method;
    const host = getRequestHeader(fastifyRequest, 'host') ?? hostname;
    const path =
      useOriginalUrl && fastifyRequest.originalUrl !== undefined
        ? fastifyRequest.originalUrl
        : fastifyRequest.url;
    this.url = `${fastifyRequest.protocol ?? 'http'}://${host}${path}`;
    this.remoteAddress =
      fastifyRequest.ip ?? fastifyRequest.raw?.socket.remoteAddress;
  }

  getHeader(name: string): string | null {
    return getRequestHeader(this.fastifyRequest, name);
  }

  toHeaders(): Headers {
    this.headers ??= headersFromFastifyRequest(this.fastifyRequest);
    return this.headers;
  }

  toRequest(): Request {
    const headers = this.toHeaders();
    const method = this.method.toUpperCase();
    this.request ??= new Request(this.url, {
      headers,
      method,
      ...(method === 'GET' || method === 'HEAD'
        ? {}
        : { body: JSON.stringify(this.body) }),
    });
    return this.request;
  }
}

const isRpcEnvelopeArray = <TEnvelope extends RpcEnvelope>(
  result: TEnvelope | readonly TEnvelope[] | Response | SerializedJsonEnvelope
): result is readonly TEnvelope[] => Array.isArray(result);

const writeResponseChunk = (
  response: ServerResponse<IncomingMessage>,
  chunk: Uint8Array
): Promise<void> =>
  new Promise((resolve, reject) => {
    const buffer = Buffer.from(
      chunk.buffer,
      chunk.byteOffset,
      chunk.byteLength
    );
    if (response.write(buffer)) {
      resolve();
      return;
    }
    const cleanup = (): void => {
      response.off('drain', onDrain);
      response.off('error', onError);
    };
    const onDrain = (): void => {
      cleanup();
      resolve();
    };
    const onError = (error: Error): void => {
      cleanup();
      reject(error);
    };
    response.once('drain', onDrain);
    response.once('error', onError);
  });

const writeWebResponseBody = async (
  response: ServerResponse<IncomingMessage>,
  body: ReadableStream<Uint8Array>
): Promise<void> => {
  const reader = body.getReader();
  try {
    for (;;) {
      const read = await reader.read();
      if (read.done) break;
      await writeResponseChunk(response, read.value);
    }
  } finally {
    reader.releaseLock();
    response.end();
  }
};

const writeFastifyResult = async <TEnvelope extends RpcEnvelope>(
  reply: FastifyReply,
  result: TransportBodyResult<TEnvelope>,
  extraHeaders?: Record<string, string>
): Promise<void> => {
  reply.hijack?.();
  const response = reply.raw;
  if (isSerializedJsonEnvelope(result)) {
    const headers = createJsonHeaderRecord(
      result.responseHeaders ?? result.headers
    );
    if (extraHeaders !== undefined) appendJsonStringHeaders(headers, extraHeaders);
    response.writeHead(200, headers);
    response.end(result.body);
    return;
  }
  if (result instanceof Response) {
    const headers = Object.fromEntries(result.headers);
    if (extraHeaders !== undefined) appendJsonStringHeaders(headers, extraHeaders);
    response.writeHead(result.status, headers);
    if (result.body === null) {
      response.end();
      return;
    }
    await writeWebResponseBody(response, result.body);
    return;
  }
  const headers = createJsonHeaderRecord();
  if (
    !isRpcEnvelopeArray(result) &&
    result.ok &&
    result.headers !== undefined
  ) {
    appendJsonStringHeaders(headers, result.headers);
  }
  if (extraHeaders !== undefined) appendJsonStringHeaders(headers, extraHeaders);
  response.writeHead(200, headers);
  response.end(JSON.stringify(result));
};

const payloadTooLargeBody = (request: ContextRequestSource): Response =>
  new Response(
    JSON.stringify({
      ok: false,
      id: '',
      traceId: request.getHeader('x-request-id') ?? 'trace-body-error',
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body too large',
        status: 413,
      },
    }),
    { status: 413, headers: createJsonHeaderRecord() }
  );

const parsedBodyWithinLimit = (
  request: FastifyRequest,
  body: JsonValue,
  limit: number
): boolean => {
  const contentLength = getRequestHeader(request, 'content-length');
  if (contentLength !== null) {
    const parsed = Number(contentLength);
    if (Number.isInteger(parsed) && parsed > limit) return false;
  }
  return JSON.stringify(body).length <= limit;
};

const bodyFromFastifyRequest = (request: FastifyRequest): JsonValue =>
  request.body === undefined ? {} : (request.body as JsonValue);

const createFastifyHandlerWithOptions = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: FastifyHandlerOptions = {}
): FastifyHandler => {
  const handler = createRpcTransportBodyResultHandler(
    manifest,
    options as unknown as HandlerOptionsFor<TManifest, readonly JoorPlugin<object>[], RpcManifestBody<TManifest>, Request>,
    false
  );
  const preflight = createRpcRequestPreflight(options);
  const hostname = options.hostname ?? '0.0.0.0';
  const extraResponseHeaders = createCorsHeaderRecord(options.cors);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
  const useOriginalUrl = options.useOriginalUrl ?? true;
  return async (request, reply) => {
    const body = bodyFromFastifyRequest(request);
    const source = new FastifyRequestSource(
      request,
      body,
      hostname,
      useOriginalUrl
    );
    const early = preflight(source);
    if (early !== undefined) {
      await writeFastifyResult(reply, early, extraResponseHeaders);
      return;
    }
    if (!parsedBodyWithinLimit(request, body, bodyLimit)) {
      const error = new BodySizeLimitError(bodyLimit);
      options.onError?.(error, source.toRequest());
      await writeFastifyResult(
        reply,
        payloadTooLargeBody(source),
        extraResponseHeaders
      );
      return;
    }
    await writeFastifyResult(
      reply,
      (await handler(
        source,
        body as RpcManifestBody<TManifest>
      )) as TransportBodyResult,
      extraResponseHeaders
    );
  };
};

export function createFastifyHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: FastifyHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): FastifyHandler;
export function createFastifyHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: FastifyHandlerOptions = {}
): FastifyHandler {
  return createFastifyHandlerWithOptions(manifest, options);
}

export const createFastifyHandlerFor =
  <
    TRequest extends FastifyRequestLike = FastifyRequest,
    TReply extends FastifyReplyLike<FastifyRequestIncoming<TRequest>> =
      FastifyReply<FastifyRequestIncoming<TRequest>>,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    THookRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: FastifyHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      THookRequest
    >
  ): FastifyHandler<TRequest, TReply> =>
    createFastifyHandlerWithOptions(
      manifest,
      (args[0] ?? {}) as FastifyHandlerOptions
    ) as unknown as FastifyHandler<TRequest, TReply>;
