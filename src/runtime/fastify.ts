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

export interface FastifyRequest<TBody = unknown> {
  body?: TBody;
  headers: IncomingHttpHeaders;
  hostname?: string;
  ip?: string;
  method: string;
  originalUrl?: string;
  protocol?: string;
  raw?: IncomingMessage;
  url: string;
}

export interface FastifyReply {
  raw: ServerResponse<IncomingMessage>;
  hijack?(): void;
}

export type FastifyHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => void | Promise<void>;

export interface FastifyHandlerOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> extends HandlerOptions<TPlugins> {
  hostname?: string;
  useOriginalUrl?: boolean;
}

export type FastifyHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = FastifyHandlerOptions<TPlugins> &
  HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type FastifyRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = FastifyHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type FastifyUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = FastifyRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type FastifyRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = FastifyHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type FastifyStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = FastifyRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type FastifyHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  FastifyHandlerOptions<TPlugins>,
  TBody
>;

export type FastifyRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = FastifyHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type FastifyUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = FastifyRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type FastifyRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = FastifyHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type FastifyStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = FastifyRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

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

export function createFastifyHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: FastifyHandlerOptionsArgs<TManifest, TPlugins>
): FastifyHandler;
export function createFastifyHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: FastifyHandlerOptions = {}
): FastifyHandler {
  const handler = createRpcTransportBodyResultHandler(
    manifest,
    options as HandlerOptionsFor<TManifest>,
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
}
