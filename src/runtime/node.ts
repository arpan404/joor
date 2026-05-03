import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ContextRequestSource } from '../context/context.js';
import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcTransportBodyResultHandler } from '../rpc/dispatcher.js';
import { parseJson, type JsonValue } from '../schema/json.js';
import {
  BodySizeLimitError,
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
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
export type NodeTransportBodyResultHandler = (
  request: ContextRequestSource,
  body: JsonValue
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
    outgoing.end(Buffer.from(await result.arrayBuffer()));
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
  maxBodyBytes: number
): Promise<Buffer> => {
  const contentLength = incoming.headers['content-length'];
  if (typeof contentLength === 'string') {
    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > maxBodyBytes) {
      throw new BodySizeLimitError(maxBodyBytes);
    }
  }
  let first: Buffer | undefined;
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of incoming) {
    const buffer = chunkToBuffer(chunk);
    total += buffer.byteLength;
    if (total > maxBodyBytes) {
      throw new BodySizeLimitError(maxBodyBytes);
    }
    if (first === undefined) first = buffer;
    else chunks.push(buffer);
  }
  if (first === undefined) return Buffer.alloc(0);
  if (chunks.length === 0) return first;
  chunks.unshift(first);
  return Buffer.concat(chunks, total);
};

export const createNodeTransportRequestHandler = (
  handler: NodeTransportBodyResultHandler,
  hostname = '0.0.0.0',
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): NodeRpcRequestHandler => {
  return async (incoming, outgoing) => {
    const request = requestSourceFromIncoming(incoming, hostname);
    let json: JsonValue;
    try {
      const body = await readIncomingBody(incoming, maxBodyBytes);
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
    await writeResult(outgoing, await handler(request, json));
  };
};

export const listen = (
  manifest: RpcManifest,
  options: ListenOptions = {}
): void => {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createNodeRpcRequestHandler(manifest, options, hostname);
  const server = createServer(handler);
  server.listen(port, hostname);
};

export const createNodeRpcRequestHandler = (
  manifest: RpcManifest,
  options: HandlerOptions = {},
  hostname = '0.0.0.0'
): NodeRpcRequestHandler => {
  const handler = createRpcTransportBodyResultHandler(manifest, options);
  return createNodeTransportRequestHandler(
    handler,
    hostname,
    options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES
  );
};
