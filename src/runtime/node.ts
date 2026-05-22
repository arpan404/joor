import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ContextRequestSource } from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifestBody,
  RpcRequestPreflight,
} from '../rpc/dispatcher.js';
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
  createJsonHeaderRecord,
  isSerializedJsonEnvelope,
  type SerializedJsonEnvelope,
} from './response.js';

export interface ListenOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type NodeRpcRequestHandler = (
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
) => Promise<void>;

export type NodeTransportBodyResult = RpcBodyResult | SerializedJsonEnvelope;
export type NodeTransportBodyResultHandler<TBody = JsonValue> = (
  request: ContextRequestSource,
  body: TBody
) => Promise<NodeTransportBodyResult>;

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

const writeResult = async (
  outgoing: ServerResponse<IncomingMessage>,
  result: NodeTransportBodyResult
): Promise<void> => {
  if (isSerializedJsonEnvelope(result)) {
    outgoing.writeHead(200, createJsonHeaderRecord(result.headers));
    outgoing.end(result.body);
    return;
  }
  if (result instanceof Response) {
    outgoing.writeHead(result.status, Object.fromEntries(result.headers));
    if (result.body === null) {
      outgoing.end();
      return;
    }
    await writeWebResponseBody(outgoing, result.body);
    return;
  }
  const headers = createJsonHeaderRecord();
  if (!Array.isArray(result) && result.ok && result.headers !== undefined) {
    appendJsonStringHeaders(headers, result.headers);
  }
  outgoing.writeHead(200, headers);
  outgoing.end(JSON.stringify(result));
};

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

export const createNodeTransportRequestHandler = <TBody = JsonValue>(
  handler: NodeTransportBodyResultHandler<TBody>,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): NodeRpcRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  const requestPreflight =
    preflight === false
      ? undefined
      : (preflight ?? createRpcRequestPreflight());
  return async (incoming, outgoing) => {
    const request = requestSourceFromIncoming(incoming, hostname);
    const early = requestPreflight?.(request);
    if (early !== undefined) {
      await writeResult(outgoing, early);
      return;
    }
    let json: JsonValue;
    try {
      const body = await readIncomingBody(incoming, bodyLimit);
      json = body.length === 0 ? {} : parseJson(body.toString('utf8'));
    } catch (error) {
      const payloadTooLarge =
        error instanceof Error && isBodySizeLimitError(error);
      outgoing.writeHead(payloadTooLarge ? 413 : 400, createJsonHeaderRecord());
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
    await writeResult(outgoing, await handler(request, json as TBody));
  };
};

export const listen = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: ListenOptions = {}
): void => {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createNodeRpcRequestHandler(manifest, options, hostname);
  const server = createServer(handler);
  server.listen(port, hostname);
};

export const createNodeRpcRequestHandler = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0'
): NodeRpcRequestHandler => {
  const handler = createRpcTransportBodyResultHandler(manifest, options, false);
  return createNodeTransportRequestHandler(
    (request, body) => handler(request, body as RpcManifestBody<TManifest>),
    hostname,
    options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    createRpcRequestPreflight(options)
  );
};
