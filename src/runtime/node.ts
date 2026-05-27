import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ContextRequestSource } from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgsFor,
  HandlerOptionsFor,
  HandlerOptionsWithTrailingArgs,
  RpcBodyResult,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamHandlerOptionsArgsFor,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamHandlerOptionsWithTrailingArgs,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryHandlerOptionsArgsFor,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
  RpcRequestPreflight,
  RpcTransportBodyResultHandler,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
import type { RpcEnvelope } from '../rpc/protocol.js';
import {
  createRpcRequestPreflight,
  createRpcTransportBodyResultHandler,
} from '../rpc/dispatcher.js';
import { parseJson, type JsonValue } from '../schema/json.js';
import {
  BodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
} from './body.js';
import {
  appendJsonStringHeaders,
  createCorsHeaderRecord,
  createJsonHeaderRecord,
  isSerializedJsonEnvelope,
  type RouteStreamTransportBodyResultFor,
  type RouteUnaryTransportBodyResultFor,
  type SerializedJsonEnvelope,
  type TransportBodyResultFor,
} from './response.js';

export interface ListenOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> extends HandlerOptions<TPlugins, TBody, TRequest> {
  readonly port?: number;
  readonly hostname?: string;
}

export type NodeListenOptions<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> = ListenOptions<TPlugins, TBody, TRequest>;

export interface NodeServer {
  readonly listening: boolean;
  readonly address: () => AddressInfo | string | null;
  readonly close: (callback?: (error?: Error) => void) => this;
  readonly ref: () => this;
  readonly unref: () => this;
}

export type ListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = ListenOptions<TPlugins, TBody, TRequest> &
  HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = ListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type RouteUnaryListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = ListenOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeRouteUnaryListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RouteUnaryListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type UnaryRouteListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RouteUnaryListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeUnaryRouteListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NodeRouteUnaryListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type RouteStreamListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = ListenOptions<TPlugins, TBody, TRequest> &
  RpcManifestRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeRouteStreamListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RouteStreamListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type StreamRouteListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RouteStreamListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeStreamRouteListenOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NodeRouteStreamListenOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type ListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ListenOptions<TPlugins, TBody, TRequest>,
  TBody,
  ListenOptions<TPlugins, TBody, TRequest> &
    HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>,
  TRequest
>;

export type NodeListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = ListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type RouteUnaryListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ListenOptions<TPlugins, TBody, TRequest>,
  TBody,
  ListenOptions<TPlugins, TBody, TRequest>,
  TRequest
>;

export type NodeRouteUnaryListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RouteUnaryListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type UnaryRouteListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RouteUnaryListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NodeUnaryRouteListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NodeRouteUnaryListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type RouteStreamListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgsFor<
  TManifest,
  TPlugins,
  ListenOptions<TPlugins, TBody, TRequest>,
  TBody,
  ListenOptions<TPlugins, TBody, TRequest>,
  TRequest
>;

export type NodeRouteStreamListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RouteStreamListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type StreamRouteListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RouteStreamListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NodeStreamRouteListenOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NodeRouteStreamListenOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type NodeRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type NodeRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeUnaryRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NodeRouteUnaryRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeRouteStreamRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeStreamRouteRpcRequestHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NodeRouteStreamRpcRequestHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsWithTrailingArgs<
  TManifest,
  [hostname?: string],
  TPlugins,
  TBody,
  TRequest
>;

export type NodeRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<
  TManifest,
  [hostname?: string],
  TPlugins,
  TBody,
  TRequest
>;

export type NodeUnaryRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = NodeRouteUnaryRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<
  TManifest,
  [hostname?: string],
  TPlugins,
  TBody,
  TRequest
>;

export type NodeStreamRouteRpcRequestHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = NodeRouteStreamRpcRequestHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type NodeRpcRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = (incoming: TIncoming, outgoing: TOutgoing) => void | Promise<void>;

export type NodeTransportRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = NodeRpcRequestHandler<TIncoming, TOutgoing>;
export type NodeRouteUnaryTransportRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = NodeTransportRequestHandler<TIncoming, TOutgoing>;
export type NodeUnaryRouteTransportRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = NodeRouteUnaryTransportRequestHandler<TIncoming, TOutgoing>;
export type NodeRouteStreamTransportRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = NodeTransportRequestHandler<TIncoming, TOutgoing>;
export type NodeStreamRouteTransportRequestHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = NodeRouteStreamTransportRequestHandler<TIncoming, TOutgoing>;

export type NodeTransportBodyResult<
  TEnvelope extends RpcEnvelope = RpcEnvelope,
> = RpcBodyResult<TEnvelope> | SerializedJsonEnvelope;
type MaybePromise<TValue> = TValue | Promise<TValue>;
export type NodeTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = TransportBodyResultFor<TManifest, TBody>;
export type NodeRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type NodeUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = NodeRouteUnaryTransportBodyResultFor<TManifest, TBody>;
export type NodeRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RouteStreamTransportBodyResultFor<TManifest, TBody>;
export type NodeStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = NodeRouteStreamTransportBodyResultFor<TManifest, TBody>;
export type NodeTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends NodeTransportBodyResult = NodeTransportBodyResult,
> = (request: ContextRequestSource, body: TBody) => MaybePromise<TResult>;

export type NodeTransportBodyResultHandlerFor<TManifest extends JoorManifest> =
  <const TBody extends RpcManifestBody<TManifest>>(
    request: ContextRequestSource,
    body: TBody
  ) => MaybePromise<NodeTransportBodyResultFor<TManifest, TBody>>;

export type NodeRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<NodeRouteUnaryTransportBodyResultFor<TManifest, TBody>>;

export type NodeUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = NodeRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type NodeRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<NodeRouteStreamTransportBodyResultFor<TManifest, TBody>>;

export type NodeStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = NodeRouteStreamTransportBodyResultHandlerFor<TManifest>;

const neverAbortedSignal = new AbortController().signal;

const getIncomingHeader = (
  incoming: IncomingMessage,
  name: string
): string | null => {
  const value = incoming.headers[name.toLowerCase()];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return null;
};

const headersFromIncoming = (incoming: IncomingMessage): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    }
  }
  return headers;
};

class IncomingRequestSource implements ContextRequestSource {
  readonly method: string;
  readonly url: string;
  readonly signal = neverAbortedSignal;
  readonly remoteAddress: string | undefined;
  private headers?: Headers;
  private request?: Request;

  constructor(
    private readonly incoming: IncomingMessage,
    hostname: string
  ) {
    this.method = incoming.method ?? 'GET';
    this.url = `http://${incoming.headers.host ?? hostname}${incoming.url ?? '/rpc'}`;
    this.remoteAddress = incoming.socket.remoteAddress;
  }

  getHeader(name: string): string | null {
    return getIncomingHeader(this.incoming, name);
  }

  toHeaders(): Headers {
    this.headers ??= headersFromIncoming(this.incoming);
    return this.headers;
  }

  toRequest(): Request {
    const headers = this.toHeaders();
    this.request ??= new Request(this.url, { headers, method: this.method });
    return this.request;
  }
}

const requestSourceFromIncoming = (
  incoming: IncomingMessage,
  hostname: string
): ContextRequestSource => new IncomingRequestSource(incoming, hostname);

const writeResponseChunk = (
  outgoing: ServerResponse<IncomingMessage>,
  chunk: Uint8Array
): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const buffer = Buffer.from(
      chunk.buffer,
      chunk.byteOffset,
      chunk.byteLength
    );
    if (outgoing.write(buffer)) {
      resolvePromise();
      return;
    }
    const cleanup = (): void => {
      outgoing.off('drain', onDrain);
      outgoing.off('error', onError);
    };
    const onDrain = (): void => {
      cleanup();
      resolvePromise();
    };
    const onError = (error: Error): void => {
      cleanup();
      reject(error);
    };
    outgoing.once('drain', onDrain);
    outgoing.once('error', onError);
  });

const writeWebResponseBody = async (
  outgoing: ServerResponse<IncomingMessage>,
  body: ReadableStream<Uint8Array>
): Promise<void> => {
  const reader = body.getReader();
  try {
    for (;;) {
      const read = await reader.read();
      if (read.done) break;
      await writeResponseChunk(outgoing, read.value);
    }
  } finally {
    reader.releaseLock();
    outgoing.end();
  }
};

const writeResult = async <TEnvelope extends RpcEnvelope = RpcEnvelope>(
  outgoing: ServerResponse<IncomingMessage>,
  result: NodeTransportBodyResult<TEnvelope>,
  extraHeaders?: Record<string, string>
): Promise<void> => {
  if (isSerializedJsonEnvelope(result)) {
    const headers = createJsonHeaderRecord(
      result.responseHeaders ?? result.headers
    );
    if (extraHeaders !== undefined)
      appendJsonStringHeaders(headers, extraHeaders);
    outgoing.writeHead(200, headers);
    outgoing.end(result.body);
    return;
  }
  if (result instanceof Response) {
    const headers = Object.fromEntries(result.headers);
    if (extraHeaders !== undefined)
      appendJsonStringHeaders(headers, extraHeaders);
    outgoing.writeHead(result.status, headers);
    if (result.body === null) {
      outgoing.end();
      return;
    }
    await writeWebResponseBody(outgoing, result.body);
    return;
  }
  const headers = createJsonHeaderRecord();
  if (
    !isNodeRpcEnvelopeArray(result) &&
    result.ok &&
    result.headers !== undefined
  ) {
    appendJsonStringHeaders(headers, result.headers);
  }
  if (extraHeaders !== undefined)
    appendJsonStringHeaders(headers, extraHeaders);
  outgoing.writeHead(200, headers);
  outgoing.end(JSON.stringify(result));
};

const isNodeRpcEnvelopeArray = <TEnvelope extends RpcEnvelope>(
  result: NodeTransportBodyResult<TEnvelope>
): result is readonly TEnvelope[] => Array.isArray(result);

const chunkToBuffer = (chunk: string | Buffer): Buffer =>
  typeof chunk === 'string' ? Buffer.from(chunk) : chunk;

const readIncomingBody = async (
  incoming: IncomingMessage,
  limit: number
): Promise<Buffer> => {
  const contentLength = incoming.headers['content-length'];
  if (Array.isArray(contentLength)) {
    throw new Error('Multiple Content-Length headers');
  }
  if (typeof contentLength === 'string') {
    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  let first: Buffer | undefined;
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of incoming) {
    const buffer = chunkToBuffer(chunk);
    total += buffer.byteLength;
    if (total > limit) {
      throw new BodySizeLimitError(limit);
    }
    if (first === undefined) first = buffer;
    else chunks.push(buffer);
  }
  if (first === undefined) return Buffer.alloc(0);
  if (chunks.length === 0) return first;
  chunks.unshift(first);
  return Buffer.concat(chunks, total);
};

export const createNodeTransportRequestHandler = <
  TBody = JsonValue,
  TResult extends NodeTransportBodyResult = NodeTransportBodyResult,
>(
  handler: NodeTransportBodyResultHandler<TBody, TResult>,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): NodeRpcRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  const responseHeaders =
    extraResponseHeaders === undefined
      ? undefined
      : Object.freeze({ ...extraResponseHeaders });
  const bodyReadError = onBodyReadError;
  const requestPreflight =
    preflight === false
      ? undefined
      : (preflight ?? createRpcRequestPreflight());
  return async (incoming, outgoing) => {
    const request = requestSourceFromIncoming(incoming, hostname);
    const early = requestPreflight?.(request);
    if (early !== undefined) {
      await writeResult(outgoing, early, responseHeaders);
      return;
    }
    let json: JsonValue;
    try {
      const body = await readIncomingBody(incoming, bodyLimit);
      json = body.length === 0 ? {} : parseJson(body.toString('utf8'));
    } catch (error) {
      const payloadTooLarge =
        error instanceof Error && isBodySizeLimitError(error);
      if (error instanceof Error) bodyReadError?.(error, request.toRequest());
      const headers = createJsonHeaderRecord(responseHeaders);
      outgoing.writeHead(payloadTooLarge ? 413 : 400, headers);
      outgoing.end(
        JSON.stringify({
          ok: false,
          id: '',
          traceId: request.getHeader('x-request-id') ?? 'trace-body-error',
          error: {
            code: payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
            message: payloadTooLarge
              ? 'Request body too large'
              : 'Invalid JSON body',
            status: payloadTooLarge ? 413 : 400,
          },
        })
      );
      return;
    }
    await writeResult(
      outgoing,
      await handler(request, json as TBody),
      responseHeaders
    );
  };
};

export const createNodeTransportRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <
    TBody = JsonValue,
    TResult extends NodeTransportBodyResult = NodeTransportBodyResult,
  >(
    handler: NodeTransportBodyResultHandler<TBody, TResult>,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): NodeTransportRequestHandler<TIncoming, TOutgoing> =>
    createNodeTransportRequestHandler(
      handler,
      hostname,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as NodeTransportRequestHandler<TIncoming, TOutgoing>;

export const createRouteUnaryNodeTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: NodeRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): NodeRouteUnaryTransportRequestHandler =>
  createNodeTransportRequestHandler(
    handler as NodeTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      NodeRouteUnaryTransportBodyResultFor<TManifest>
    >,
    hostname,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createUnaryRouteNodeTransportRequestHandler: typeof createRouteUnaryNodeTransportRequestHandler =
  createRouteUnaryNodeTransportRequestHandler;

export const createRouteUnaryNodeTransportRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <TManifest extends JoorManifest>(
    handler: NodeRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): NodeRouteUnaryTransportRequestHandler<TIncoming, TOutgoing> =>
    createRouteUnaryNodeTransportRequestHandler(
      handler,
      hostname,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as NodeRouteUnaryTransportRequestHandler<TIncoming, TOutgoing>;

export const createUnaryRouteNodeTransportRequestHandlerFor: typeof createRouteUnaryNodeTransportRequestHandlerFor =
  createRouteUnaryNodeTransportRequestHandlerFor;

export const createRouteStreamNodeTransportRequestHandler = <
  TManifest extends JoorManifest,
>(
  handler: NodeRouteStreamTransportBodyResultHandlerFor<TManifest>,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false,
  extraResponseHeaders?: Record<string, string>,
  onBodyReadError?: (error: Error, request: Request) => void
): NodeRouteStreamTransportRequestHandler =>
  createNodeTransportRequestHandler(
    handler as NodeTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      NodeRouteStreamTransportBodyResultFor<TManifest>
    >,
    hostname,
    maxBodyBytes,
    preflight,
    extraResponseHeaders,
    onBodyReadError
  );

export const createStreamRouteNodeTransportRequestHandler: typeof createRouteStreamNodeTransportRequestHandler =
  createRouteStreamNodeTransportRequestHandler;

export const createRouteStreamNodeTransportRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <TManifest extends JoorManifest>(
    handler: NodeRouteStreamTransportBodyResultHandlerFor<TManifest>,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false,
    extraResponseHeaders?: Record<string, string>,
    onBodyReadError?: (error: Error, request: Request) => void
  ): NodeRouteStreamTransportRequestHandler<TIncoming, TOutgoing> =>
    createRouteStreamNodeTransportRequestHandler(
      handler,
      hostname,
      maxBodyBytes,
      preflight,
      extraResponseHeaders,
      onBodyReadError
    ) as NodeRouteStreamTransportRequestHandler<TIncoming, TOutgoing>;

export const createStreamRouteNodeTransportRequestHandlerFor: typeof createRouteStreamNodeTransportRequestHandlerFor =
  createRouteStreamNodeTransportRequestHandlerFor;

export const createNodeTransportRequestHandlerWithPath = <
  TBody = JsonValue,
  TResult extends NodeTransportBodyResult = NodeTransportBodyResult,
>(
  handler: NodeTransportBodyResultHandler<TBody, TResult>,
  path: string,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): NodeRpcRequestHandler =>
  createNodeTransportRequestHandler(
    handler,
    hostname,
    maxBodyBytes,
    createRpcRequestPreflight({ path })
  );

export const createNodeTransportRequestHandlerWithPathFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <
    TBody = JsonValue,
    TResult extends NodeTransportBodyResult = NodeTransportBodyResult,
  >(
    handler: NodeTransportBodyResultHandler<TBody, TResult>,
    path: string,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): NodeTransportRequestHandler<TIncoming, TOutgoing> =>
    createNodeTransportRequestHandlerWithPath(
      handler,
      path,
      hostname,
      maxBodyBytes
    ) as NodeTransportRequestHandler<TIncoming, TOutgoing>;

export const createRouteUnaryNodeTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: NodeRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  path: string,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): NodeRouteUnaryTransportRequestHandler =>
  createNodeTransportRequestHandlerWithPath(
    handler as NodeTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      NodeRouteUnaryTransportBodyResultFor<TManifest>
    >,
    path,
    hostname,
    maxBodyBytes
  );

export const createUnaryRouteNodeTransportRequestHandlerWithPath: typeof createRouteUnaryNodeTransportRequestHandlerWithPath =
  createRouteUnaryNodeTransportRequestHandlerWithPath;

export const createRouteUnaryNodeTransportRequestHandlerWithPathFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <TManifest extends JoorManifest>(
    handler: NodeRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    path: string,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): NodeRouteUnaryTransportRequestHandler<TIncoming, TOutgoing> =>
    createRouteUnaryNodeTransportRequestHandlerWithPath(
      handler,
      path,
      hostname,
      maxBodyBytes
    ) as NodeRouteUnaryTransportRequestHandler<TIncoming, TOutgoing>;

export const createUnaryRouteNodeTransportRequestHandlerWithPathFor: typeof createRouteUnaryNodeTransportRequestHandlerWithPathFor =
  createRouteUnaryNodeTransportRequestHandlerWithPathFor;

export const createRouteStreamNodeTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
>(
  handler: NodeRouteStreamTransportBodyResultHandlerFor<TManifest>,
  path: string,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): NodeRouteStreamTransportRequestHandler =>
  createNodeTransportRequestHandlerWithPath(
    handler as NodeTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      NodeRouteStreamTransportBodyResultFor<TManifest>
    >,
    path,
    hostname,
    maxBodyBytes
  );

export const createStreamRouteNodeTransportRequestHandlerWithPath: typeof createRouteStreamNodeTransportRequestHandlerWithPath =
  createRouteStreamNodeTransportRequestHandlerWithPath;

export const createRouteStreamNodeTransportRequestHandlerWithPathFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <TManifest extends JoorManifest>(
    handler: NodeRouteStreamTransportBodyResultHandlerFor<TManifest>,
    path: string,
    hostname = '0.0.0.0',
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): NodeRouteStreamTransportRequestHandler<TIncoming, TOutgoing> =>
    createRouteStreamNodeTransportRequestHandlerWithPath(
      handler,
      path,
      hostname,
      maxBodyBytes
    ) as NodeRouteStreamTransportRequestHandler<TIncoming, TOutgoing>;

export const createStreamRouteNodeTransportRequestHandlerWithPathFor: typeof createRouteStreamNodeTransportRequestHandlerWithPathFor =
  createRouteStreamNodeTransportRequestHandlerWithPathFor;

export function listen<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: ListenOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): NodeServer;
export function listen<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ListenOptions = {}
): NodeServer {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createNodeRpcRequestHandler(
    manifest,
    options as unknown as ListenOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestBody<TManifest>,
      Request
    >,
    hostname
  );
  const server = createServer(handler);
  server.listen(port, hostname);
  return server;
}

type NodeRpcHandlerRouteKind = 'unary' | 'stream';

const createNodeRpcRequestHandlerWithOptions = <
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0',
  routeKind?: NodeRpcHandlerRouteKind
): NodeRpcRequestHandler => {
  const handler = (
    createRpcTransportBodyResultHandler as unknown as (
      handlerManifest: TManifest,
      handlerOptions: HandlerOptionsFor<
        TManifest,
        readonly JoorPlugin<object>[],
        TBody,
        Request
      >,
      preflight: boolean,
      handlerRouteKind?: NodeRpcHandlerRouteKind
    ) => RpcTransportBodyResultHandler<TManifest>
  )(
    manifest,
    options as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      TBody,
      Request
    >,
    false,
    routeKind
  );
  return createNodeTransportRequestHandler(
    (request, body) => handler(request, body as TBody),
    hostname,
    options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options),
    createCorsHeaderRecord(options.cors),
    options.onError
  );
};

export function createNodeRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsWithTrailingArgs<
    TManifest,
    [hostname?: string],
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): NodeRpcRequestHandler;
export function createNodeRpcRequestHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0'
): NodeRpcRequestHandler {
  return createNodeRpcRequestHandlerWithOptions(manifest, options, hostname);
}

export function createRouteUnaryNodeRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NodeRouteUnaryRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): NodeRpcRequestHandler;
export function createRouteUnaryNodeRpcRequestHandler<
  TManifest extends JoorManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0'
): NodeRpcRequestHandler {
  return createNodeRpcRequestHandlerWithOptions<
    TManifest,
    RpcManifestRouteUnaryBody<TManifest>
  >(manifest, options, hostname, 'unary');
}

export const createUnaryRouteNodeRpcRequestHandler: typeof createRouteUnaryNodeRpcRequestHandler =
  createRouteUnaryNodeRpcRequestHandler;

export function createRouteStreamNodeRpcRequestHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: NodeRouteStreamRpcRequestHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): NodeRpcRequestHandler;
export function createRouteStreamNodeRpcRequestHandler<
  TManifest extends JoorManifest,
>(
  manifest: TManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0'
): NodeRpcRequestHandler {
  return createNodeRpcRequestHandlerWithOptions<
    TManifest,
    RpcManifestRouteStreamBody<TManifest>
  >(manifest, options, hostname, 'stream');
}

export const createStreamRouteNodeRpcRequestHandler: typeof createRouteStreamNodeRpcRequestHandler =
  createRouteStreamNodeRpcRequestHandler;

export const createNodeRpcRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: NodeRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): NodeRpcRequestHandler<TIncoming, TOutgoing> => {
    const options = (args[0] ?? {}) as HandlerOptions;
    return createNodeRpcRequestHandlerWithOptions(
      manifest,
      options,
      args[1] ?? '0.0.0.0'
    ) as NodeRpcRequestHandler<TIncoming, TOutgoing>;
  };

export const createRouteUnaryNodeRpcRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: NodeRouteUnaryRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): NodeRpcRequestHandler<TIncoming, TOutgoing> => {
    const options = (args[0] ?? {}) as HandlerOptions;
    return createNodeRpcRequestHandlerWithOptions<
      TManifest,
      RpcManifestRouteUnaryBody<TManifest>
    >(
      manifest,
      options,
      args[1] ?? '0.0.0.0',
      'unary'
    ) as NodeRpcRequestHandler<TIncoming, TOutgoing>;
  };

export const createUnaryRouteNodeRpcRequestHandlerFor: typeof createRouteUnaryNodeRpcRequestHandlerFor =
  createRouteUnaryNodeRpcRequestHandlerFor;

export const createRouteStreamNodeRpcRequestHandlerFor =
  <
    TIncoming extends IncomingMessage = IncomingMessage,
    TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
  >() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: NodeRouteStreamRpcRequestHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): NodeRpcRequestHandler<TIncoming, TOutgoing> => {
    const options = (args[0] ?? {}) as HandlerOptions;
    return createNodeRpcRequestHandlerWithOptions<
      TManifest,
      RpcManifestRouteStreamBody<TManifest>
    >(
      manifest,
      options,
      args[1] ?? '0.0.0.0',
      'stream'
    ) as NodeRpcRequestHandler<TIncoming, TOutgoing>;
  };

export const createStreamRouteNodeRpcRequestHandlerFor: typeof createRouteStreamNodeRpcRequestHandlerFor =
  createRouteStreamNodeRpcRequestHandlerFor;

export function listenRouteUnary<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RouteUnaryListenOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): NodeServer;
export function listenRouteUnary<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ListenOptions = {}
): NodeServer {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createNodeRpcRequestHandlerWithOptions<
    TManifest,
    RpcManifestRouteUnaryBody<TManifest>
  >(manifest, options, hostname, 'unary');
  const server = createServer(handler);
  server.listen(port, hostname);
  return server;
}

export const listenUnaryRoute: typeof listenRouteUnary = listenRouteUnary;
export const listenNodeRouteUnary: typeof listenRouteUnary = listenRouteUnary;
export const listenNodeUnaryRoute: typeof listenRouteUnary = listenRouteUnary;

export function listenRouteStream<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: RouteStreamListenOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): NodeServer;
export function listenRouteStream<TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ListenOptions = {}
): NodeServer {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createNodeRpcRequestHandlerWithOptions<
    TManifest,
    RpcManifestRouteStreamBody<TManifest>
  >(manifest, options, hostname, 'stream');
  const server = createServer(handler);
  server.listen(port, hostname);
  return server;
}

export const listenStreamRoute: typeof listenRouteStream = listenRouteStream;
export const listenNodeRouteStream: typeof listenRouteStream =
  listenRouteStream;
export const listenNodeStreamRoute: typeof listenRouteStream =
  listenRouteStream;
