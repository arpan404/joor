import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ContextRequestSource } from '../context/context.js';
import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcTransportBodyResultHandler } from '../rpc/dispatcher.js';
import { parseJson, type JsonObject, type JsonValue } from '../schema/json.js';
import type { CompiledSerializedEnvelope } from './compiled.js';

const defaultMaxBodyBytes = 1024 * 1024;

export interface ListenOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type NodeRpcRequestHandler = (
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
) => Promise<void>;

export type NodeTransportBodyResult =
  | RpcBodyResult
  | CompiledSerializedEnvelope;
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

const requestSourceFromIncoming = (
  incoming: IncomingMessage,
  hostname: string
): ContextRequestSource => {
  const method = incoming.method ?? 'GET';
  const url = `http://${incoming.headers.host ?? hostname}${incoming.url ?? '/rpc'}`;
  let headers: Headers | undefined;
  let request: Request | undefined;
  return {
    url,
    method,
    signal: neverAbortedSignal,
    getHeader(name) {
      return getIncomingHeader(incoming, name);
    },
    toHeaders() {
      headers ??= headersFromIncoming(incoming);
      return headers;
    },
    toRequest() {
      headers ??= headersFromIncoming(incoming);
      request ??= new Request(url, { headers, method });
      return request;
    },
  };
};

const isCompiledSerializedEnvelope = (
  result: NodeTransportBodyResult
): result is CompiledSerializedEnvelope =>
  !Array.isArray(result) && 'body' in result && typeof result.body === 'string';

const appendStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'string') target[key] = value;
  }
};

const writeResult = async (
  outgoing: ServerResponse<IncomingMessage>,
  result: NodeTransportBodyResult
): Promise<void> => {
  if (isCompiledSerializedEnvelope(result)) {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };
    if (result.headers !== undefined)
      appendStringHeaders(headers, result.headers);
    outgoing.writeHead(200, headers);
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
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (!Array.isArray(result) && result.ok && result.headers !== undefined) {
    appendStringHeaders(headers, result.headers);
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
      throw new Error('Request body exceeds maxBodyBytes');
    }
  }
  let first: Buffer | undefined;
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of incoming) {
    const buffer = chunkToBuffer(chunk);
    total += buffer.byteLength;
    if (total > maxBodyBytes) {
      throw new Error('Request body exceeds maxBodyBytes');
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
  maxBodyBytes = defaultMaxBodyBytes
): NodeRpcRequestHandler => {
  return async (incoming, outgoing) => {
    const request = requestSourceFromIncoming(incoming, hostname);
    let json: JsonValue;
    try {
      const body = await readIncomingBody(incoming, maxBodyBytes);
      json = body.length === 0 ? {} : parseJson(body.toString('utf8'));
    } catch {
      json = {};
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
    options.maxBodyBytes ?? defaultMaxBodyBytes
  );
};
