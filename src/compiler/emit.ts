import { mkdir, writeFile } from 'node:fs/promises';
import { relative, dirname } from 'node:path';
import type { JoorConfig } from '../config.js';
import type { CompilerManifest } from './manifest.js';
import { createAiDocs } from './ai-docs.js';
import {
  emitCompiledProcedureSource,
  type CompiledProcedureGenerationOptions,
} from './codegen.js';
import { createOpenApiDocument } from './openapi.js';

export interface EmitOptions {
  outDir: string;
  config?: JoorConfig;
  configPath?: string;
}

const toImportPath = (fromFile: string, targetFile: string): string => {
  const rel = relative(dirname(fromFile), targetFile).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
};

const writeJson = async (path: string, value: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
};

const emitManifest = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  const manifestFile = `${outDir}/manifest.ts`;
  const imports = manifest.procedures
    .map((entry) => {
      const importPath = toImportPath(manifestFile, entry.importPath);
      return `import ${entry.exportName} from '${importPath}';`;
    })
    .join('\n');
  const entries = manifest.procedures
    .map(
      (entry) =>
        `    ${JSON.stringify(entry.id)}: { ...${entry.exportName}, id: ${JSON.stringify(entry.id)} },`
    )
    .join('\n');
  const source = `${imports}

export const manifest = {
  procedures: {
${entries}
  },
} as const;
`;
  await writeFile(manifestFile, source);
};

const emitDispatcher = async (
  manifest: CompilerManifest,
  outDir: string,
  config: JoorConfig | undefined,
  configPath?: string
): Promise<void> => {
  const dispatcherFile = `${outDir}/dispatcher.ts`;
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(dispatcherFile, configPath)}';\n`;
  const configValue = configPath === undefined ? '{}' : 'config';
  const imports = manifest.procedures
    .map((entry) => {
      const importPath = toImportPath(dispatcherFile, entry.importPath);
      return `import ${entry.exportName} from '${importPath}';`;
    })
    .join('\n');
  const generationOptions: CompiledProcedureGenerationOptions = {
    enforceRateLimit: config?.enforceRateLimit ?? true,
    validateHeaders: config?.validateHeaders ?? true,
    validateInput: config?.validateInput ?? true,
    validateOutput: config?.validateOutput ?? true,
    validateResponseHeaders: config?.validateResponseHeaders ?? true,
  };
  const compiledEntries = manifest.procedures.filter(
    (entry) => entry.procedure.output !== undefined
  );
  const hasCompiledProcedures = compiledEntries.length > 0;
  const hasGenericFallback = manifest.procedures.some(
    (entry) => entry.procedure.output === undefined
  );
  const usesAuth = compiledEntries.some(
    (entry) => entry.procedure.auth !== undefined
  );
  const usesCache = compiledEntries.some(
    (entry) =>
      entry.procedure.meta.kind === 'query' &&
      entry.procedure.meta.cache !== undefined
  );
  const usesRateLimit =
    generationOptions.enforceRateLimit &&
    compiledEntries.some(
      (entry) => entry.procedure.meta.rateLimit !== undefined
    );
  const usesValidationDetails = compiledEntries.some(
    (entry) =>
      generationOptions.validateInput ||
      generationOptions.validateOutput ||
      (generationOptions.validateHeaders &&
        entry.procedure.headers !== undefined) ||
      (generationOptions.validateResponseHeaders &&
        entry.procedure.responseHeaders !== undefined)
  );
  const compiledImports = [
    'compiledNotFound',
    ...(usesAuth ? ['compiledAuthenticate'] : []),
    ...(hasCompiledProcedures
      ? [
          'compiledCreateContext',
          'compiledCreateJsonHeaderRecord',
          'compiledEmptyObject',
          'compiledJsonOkResponseInit',
          'compiledTraceId',
        ]
      : []),
    'createCompiledRpcHandler',
    'createCompiledRuntimeState',
    'createCompiledRpcTransportBodyResultHandler',
    ...(usesRateLimit ? ['compiledRateLimitFailureStatic'] : []),
    ...(usesValidationDetails ? ['compiledValidationDetails'] : []),
    ...(usesCache ? ['compiledReadCache', 'compiledWriteCache'] : []),
    'type CompiledUnaryDispatch',
    ...(hasGenericFallback ? ['executeCompiledProcedure'] : []),
    'type CompiledDispatch',
  ];
  const joorTypeImport = hasCompiledProcedures
    ? "import type { JsonValue, RpcError } from 'joor';\n"
    : '';
  const executors = manifest.procedures
    .map((entry) => emitCompiledProcedureSource(entry, generationOptions))
    .filter(Boolean)
    .join('\n\n');
  const cases = manifest.procedures
    .map((entry) =>
      entry.procedure.output === undefined
        ? `    case ${JSON.stringify(entry.id)}:
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services, runtime, state, serialize);`
        : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute(rpcRequest, request, services, runtime, state, serialize);`
    )
    .join('\n');
  const unaryCases = manifest.procedures
    .map((entry) =>
      entry.procedure.output === undefined
        ? `    case ${JSON.stringify(entry.id)}:
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services, runtime, state, serialize);`
        : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute(rpcRequest, request, services, runtime, state, serialize);`
    )
    .join('\n');
  await writeFile(
    dispatcherFile,
    `import {
  ${compiledImports.join(',\n  ')},
} from 'joor/runtime/compiled';
${joorTypeImport}${configImport}${imports}

${executors}

const dispatch: CompiledDispatch = (
  rpcRequest,
  request,
  services,
  runtime,
  state,
  serialize
) => {
  switch (rpcRequest.id) {
${cases}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
  }
};

const unaryDispatch: CompiledUnaryDispatch = (
  body,
  request,
  services,
  runtime,
  state,
  serialize
) => {
  const traceIdValue = body['traceId'];
  if (
    typeof body['id'] !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return Promise.resolve(undefined);
  }
  const rpcRequest = body;
  switch (rpcRequest.id) {
${unaryCases}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
  }
};

export const nativeRuntime = createCompiledRuntimeState(${configValue});
export const nativeUnaryDispatch = unaryDispatch;
export const transport = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  unaryDispatch,
  true,
  true,
  nativeRuntime
);
export const nativeTransport = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  unaryDispatch,
  false,
  true,
  nativeRuntime
);
export const nativeResponseTransport = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  unaryDispatch,
  false,
  'response',
  nativeRuntime
);
export const fetch = createCompiledRpcHandler(dispatch, ${configValue}, unaryDispatch);
`
  );
};

const emitRuntimeTargets = async (
  outDir: string,
  config?: JoorConfig
): Promise<void> => {
  const configuredPath = JSON.stringify(config?.path ?? '/rpc');
  const configuredMaxBodyBytes =
    typeof config?.maxBodyBytes === 'number' &&
    Number.isFinite(config.maxBodyBytes) &&
    config.maxBodyBytes >= 0
      ? Math.floor(config.maxBodyBytes)
      : 1024 * 1024;

  const fetchFile = `${outDir}/fetch.ts`;
  await writeFile(
    fetchFile,
    `import { fetch } from './dispatcher.js';

export { fetch };
export default fetch;
`
  );

  const nodeFile = `${outDir}/node.ts`;
  await writeFile(
    nodeFile,
    `import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JsonValue } from 'joor';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from './dispatcher.js';

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
  responseHeaders?: Record<string, string>;
}

interface RequestSource {
  url: string;
  method: string;
  signal: AbortSignal;
  remoteAddress: string | undefined;
  getHeader(name: string): string | null;
  toHeaders(): Headers;
  toRequest(): Request;
}

type NativeTransportResult = Awaited<ReturnType<typeof nativeTransport>>;

const configuredPath = ${configuredPath};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const neverAbortedSignal = new AbortController().signal;
const headerNamePattern = /^[A-Za-z0-9!#$%&'*+.^_|~-]+$/;
const blockedResponseHeaders = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
let traceCounter = 0;

class BodySizeLimitError extends Error {}

const normalizeMaxBodyBytes = (value?: number): number =>
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : defaultMaxBodyBytes;

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const isJsonObject = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSerializedEnvelope = (
  result: NativeTransportResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  typeof result === 'object' &&
  result !== null &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\\0') || value.includes('\\r') || value.includes('\\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target['cache-control'] = cacheControl;
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target[key] = value;
    }
  }
};

const createJsonHeaderRecord = (source?: JsonObject): Record<string, string> => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

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

class IncomingRequestSource implements RequestSource {
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
    this.url =
      'http://' + (incoming.headers.host ?? hostname) + (incoming.url ?? '/rpc');
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
    this.request ??= new Request(this.url, {
      headers: this.toHeaders(),
      method: this.method,
    });
    return this.request;
  }
}

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

const traceId = (request: RequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const failureBody = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  JSON.stringify({
    ok: false,
    id,
    traceId: trace,
    error: { code, message, status },
  });

const preflight = (
  request: RequestSource,
  path: string
): NativeTransportResult | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  const contentType = request.getHeader('content-type') ?? '';
  if (!isJsonContentType(contentType)) {
    return {
      body: failureBody(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      ),
    };
  }
  return undefined;
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
      throw new BodySizeLimitError();
    }
  }
  let first: Buffer | undefined;
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of incoming) {
    const buffer = chunkToBuffer(chunk);
    total += buffer.byteLength;
    if (total > limit) {
      throw new BodySizeLimitError();
    }
    if (first === undefined) first = buffer;
    else chunks.push(buffer);
  }
  if (first === undefined) return Buffer.alloc(0);
  if (chunks.length === 0) return first;
  chunks.unshift(first);
  return Buffer.concat(chunks, total);
};

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
  result: NativeTransportResult
): Promise<void> => {
  if (isSerializedEnvelope(result)) {
    outgoing.writeHead(
      200,
      result.responseHeaders ?? createJsonHeaderRecord(result.headers)
    );
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
  if (isJsonObject(result) && result['ok'] === true) {
    const responseHeaders = result['headers'];
    if (isJsonObject(responseHeaders)) {
      appendJsonStringHeaders(headers, responseHeaders);
    }
  }
  outgoing.writeHead(200, headers);
  outgoing.end(JSON.stringify(result));
};

const writeBodyReadFailure = (
  outgoing: ServerResponse<IncomingMessage>,
  request: RequestSource,
  error: object
): void => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  outgoing.writeHead(status, jsonHeaders);
  outgoing.end(
    failureBody(
      '',
      request.getHeader('x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    )
  );
};

export interface NodeNativeOptions {
  hostname?: string;
  maxBodyBytes?: number;
}

export interface NodeListenOptions extends NodeNativeOptions {
  port?: number;
}

export const createHandler = (options: NodeNativeOptions = {}) => {
  const hostname = options.hostname ?? '0.0.0.0';
  const path = configuredPath;
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  return async (
    incoming: IncomingMessage,
    outgoing: ServerResponse<IncomingMessage>
  ): Promise<void> => {
    const request = new IncomingRequestSource(incoming, hostname);
    const early = preflight(request, path);
    if (early !== undefined) {
      await writeResult(outgoing, early);
      return;
    }
    let body: JsonValue;
    try {
      const buffer = await readIncomingBody(incoming, bodyLimit);
      body = buffer.length === 0 ? {} : parseJson(buffer.toString('utf8'));
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      writeBodyReadFailure(outgoing, request, error);
      return;
    }
    const services =
      nativeRuntime.getServices() ?? (await nativeRuntime.resolveServices());
    if (isJsonObject(body)) {
      const result = await nativeUnaryDispatch(
        body,
        request,
        services,
        nativeRuntime.runtime,
        compiledUncachedExecutionState,
        true
      );
      if (result !== undefined) {
        await writeResult(outgoing, result);
        return;
      }
    }
    await writeResult(outgoing, await nativeTransport(request, body));
  };
};

export const handler: (
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
) => Promise<void> = createHandler();

export const listen = (options: NodeListenOptions = {}) => {
  const hostname = options.hostname ?? '0.0.0.0';
  const server = createServer(createHandler(options));
  server.listen(options.port ?? 3000, hostname);
  return server;
};
`
  );

  const bunFile = `${outDir}/bun.ts`;
  await writeFile(
    bunFile,
    `import type { JsonValue } from 'joor';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from './dispatcher.js';

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
  responseHeaders?: Record<string, string>;
}

type NativeTransportResult = Awaited<ReturnType<typeof nativeTransport>>;

const configuredPath = ${configuredPath};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const jsonOkResponseInit: ResponseInit = { status: 200, headers: jsonHeaders };
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const headerNamePattern = /^[A-Za-z0-9!#$%&'*+.^_|~-]+$/;
const blockedResponseHeaders = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
let traceCounter = 0;

class BodySizeLimitError extends Error {}

class FetchRequestSource {
  readonly url: string;
  readonly method: string;
  readonly signal: AbortSignal;
  readonly remoteAddress = undefined;

  constructor(private readonly request: Request) {
    this.url = request.url;
    this.method = request.method;
    this.signal = request.signal;
  }

  getHeader(name: string): string | null {
    return this.request.headers.get(name);
  }

  toHeaders(): Headers {
    return this.request.headers;
  }

  toRequest(): Request {
    return this.request;
  }
}

const normalizeMaxBodyBytes = (value?: number): number =>
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : defaultMaxBodyBytes;

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const isJsonObject = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSerializedEnvelope = (
  result: NativeTransportResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  typeof result === 'object' &&
  result !== null &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\\0') || value.includes('\\r') || value.includes('\\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target['cache-control'] = cacheControl;
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target[key] = value;
    }
  }
};

const createJsonHeaderRecord = (source?: JsonObject): Record<string, string> => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

const appendJsonHeaders = (target: Headers, source: JsonObject): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target.set('cache-control', cacheControl);
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target.set(key, value);
    }
  }
};

const transportResultToResponse = (result: NativeTransportResult): Response => {
  if (isSerializedEnvelope(result)) {
    return result.responseHeaders !== undefined
      ? new Response(result.body, {
          status: 200,
          headers: result.responseHeaders,
        })
      : result.headers === undefined
        ? new Response(result.body, jsonOkResponseInit)
        : new Response(result.body, {
            status: 200,
            headers: createJsonHeaderRecord(result.headers),
          });
  }
  if (result instanceof Response) return result;
  if (!isJsonObject(result) || result['ok'] !== true) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const responseHeaders = result['headers'];
  if (!isJsonObject(responseHeaders)) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const headers = new Headers(jsonHeaders);
  appendJsonHeaders(headers, responseHeaders);
  return new Response(JSON.stringify(result), { status: 200, headers });
};

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
};

const assertTextWithinLimit = (text: string, maxBodyBytes: number): void => {
  if (text.length > maxBodyBytes) {
    throw new BodySizeLimitError();
  }
  if (text.length * 4 <= maxBodyBytes) return;
  if (encoder.encode(text).byteLength <= maxBodyBytes) return;
  throw new BodySizeLimitError();
};

const readStreamText = async (
  request: Request,
  maxBodyBytes: number
): Promise<string> => {
  const body = request.body;
  if (body === null) return '';
  const reader = body.getReader();
  let firstChunk: Uint8Array | undefined;
  let chunks: Uint8Array[] | undefined;
  let total = 0;
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    total += read.value.byteLength;
    if (total > maxBodyBytes) {
      try {
        await reader.cancel();
      } catch {}
      throw new BodySizeLimitError();
    }
    if (firstChunk === undefined) firstChunk = read.value;
    else {
      chunks ??= [];
      chunks.push(read.value);
    }
  }
  if (firstChunk === undefined) return '';
  if (chunks === undefined) return decoder.decode(firstChunk);
  chunks.unshift(firstChunk);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return decoder.decode(merged);
};

const readJsonBody = async (
  request: Request,
  limit: number
): Promise<JsonValue> => {
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > limit) throw new BodySizeLimitError();
    const text = await request.text();
    assertTextWithinLimit(text, limit);
    return text.length === 0 ? {} : parseJson(text);
  }
  const text = await readStreamText(request, limit);
  return text.length === 0 ? {} : parseJson(text);
};

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

const traceId = (request: FetchRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const failureBody = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  JSON.stringify({
    ok: false,
    id,
    traceId: trace,
    error: { code, message, status },
  });

const preflight = (
  request: FetchRequestSource,
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
    return new Response(
      failureBody(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      ),
      jsonOkResponseInit
    );
  }
  return undefined;
};

const bodyReadFailure = (request: Request, error: object): Response => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  return new Response(
    failureBody(
      '',
      request.headers.get('x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    ),
    { status, headers: jsonHeaders }
  );
};

export interface BunNativeOptions {
  hostname?: string;
  maxBodyBytes?: number;
  port?: number;
}

export const createFetch = (options: BunNativeOptions = {}) => {
  const path = configuredPath;
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  return async (request: Request): Promise<Response> => {
    const source = new FetchRequestSource(request);
    const early = preflight(source, path);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonBody(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
    const services =
      nativeRuntime.getServices() ?? (await nativeRuntime.resolveServices());
    if (isJsonObject(body)) {
      const result = await nativeUnaryDispatch(
        body,
        source,
        services,
        nativeRuntime.runtime,
        compiledUncachedExecutionState,
        true
      );
      if (result !== undefined) return transportResultToResponse(result);
    }
    return transportResultToResponse(await nativeTransport(source, body));
  };
};

export const fetch = createFetch();

export const serve = (options: BunNativeOptions = {}) => {
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(config: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  return bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch: createFetch(options),
  });
};
`
  );

  const denoFile = `${outDir}/deno.ts`;
  await writeFile(
    denoFile,
    `import type { JsonValue } from 'joor';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeResponseTransport, nativeRuntime, nativeUnaryDispatch } from './dispatcher.ts';

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
  responseHeaders?: Record<string, string>;
}

type NativeTransportResult = Awaited<ReturnType<typeof nativeResponseTransport>>;

const configuredPath = ${configuredPath};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const jsonOkResponseInit: ResponseInit = { status: 200, headers: jsonHeaders };
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const headerNamePattern = /^[A-Za-z0-9!#$%&'*+.^_|~-]+$/;
const blockedResponseHeaders = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
let traceCounter = 0;

class BodySizeLimitError extends Error {}

class FetchRequestSource {
  readonly url: string;
  readonly method: string;
  readonly signal: AbortSignal;
  readonly remoteAddress = undefined;

  constructor(private readonly request: Request) {
    this.url = request.url;
    this.method = request.method;
    this.signal = request.signal;
  }

  getHeader(name: string): string | null {
    return this.request.headers.get(name);
  }

  toHeaders(): Headers {
    return this.request.headers;
  }

  toRequest(): Request {
    return this.request;
  }
}

const normalizeMaxBodyBytes = (value?: number): number =>
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : defaultMaxBodyBytes;

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const isJsonObject = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSerializedEnvelope = (
  result: NativeTransportResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  typeof result === 'object' &&
  result !== null &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\\0') || value.includes('\\r') || value.includes('\\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target['cache-control'] = cacheControl;
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target[key] = value;
    }
  }
};

const createJsonHeaderRecord = (source?: JsonObject): Record<string, string> => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

const appendJsonHeaders = (target: Headers, source: JsonObject): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target.set('cache-control', cacheControl);
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target.set(key, value);
    }
  }
};

const transportResultToResponse = (result: NativeTransportResult): Response => {
  if (result instanceof Response) return result;
  if (isSerializedEnvelope(result)) {
    return result.responseHeaders !== undefined
      ? new Response(result.body, {
          status: 200,
          headers: result.responseHeaders,
        })
      : result.headers === undefined
        ? new Response(result.body, jsonOkResponseInit)
        : new Response(result.body, {
            status: 200,
            headers: createJsonHeaderRecord(result.headers),
          });
  }
  if (!isJsonObject(result) || result['ok'] !== true) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const responseHeaders = result['headers'];
  if (!isJsonObject(responseHeaders)) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const headers = new Headers(jsonHeaders);
  appendJsonHeaders(headers, responseHeaders);
  return new Response(JSON.stringify(result), { status: 200, headers });
};

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
};

const assertTextWithinLimit = (text: string, maxBodyBytes: number): void => {
  if (text.length > maxBodyBytes) {
    throw new BodySizeLimitError();
  }
  if (text.length * 4 <= maxBodyBytes) return;
  if (encoder.encode(text).byteLength <= maxBodyBytes) return;
  throw new BodySizeLimitError();
};

const readStreamText = async (
  request: Request,
  maxBodyBytes: number
): Promise<string> => {
  const body = request.body;
  if (body === null) return '';
  const reader = body.getReader();
  let firstChunk: Uint8Array | undefined;
  let chunks: Uint8Array[] | undefined;
  let total = 0;
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    total += read.value.byteLength;
    if (total > maxBodyBytes) {
      try {
        await reader.cancel();
      } catch {}
      throw new BodySizeLimitError();
    }
    if (firstChunk === undefined) firstChunk = read.value;
    else {
      chunks ??= [];
      chunks.push(read.value);
    }
  }
  if (firstChunk === undefined) return '';
  if (chunks === undefined) return decoder.decode(firstChunk);
  chunks.unshift(firstChunk);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return decoder.decode(merged);
};

const readJsonBody = async (
  request: Request,
  limit: number
): Promise<JsonValue> => {
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > limit) throw new BodySizeLimitError();
    const text = await request.text();
    assertTextWithinLimit(text, limit);
    return text.length === 0 ? {} : parseJson(text);
  }
  const text = await readStreamText(request, limit);
  return text.length === 0 ? {} : parseJson(text);
};

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

const traceId = (request: FetchRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const failureBody = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  JSON.stringify({
    ok: false,
    id,
    traceId: trace,
    error: { code, message, status },
  });

const preflight = (
  request: FetchRequestSource,
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
    return new Response(
      failureBody(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      ),
      jsonOkResponseInit
    );
  }
  return undefined;
};

const bodyReadFailure = (request: Request, error: object): Response => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  return new Response(
    failureBody(
      '',
      request.headers.get('x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    ),
    { status, headers: jsonHeaders }
  );
};

export interface DenoNativeOptions {
  hostname?: string;
  maxBodyBytes?: number;
  port?: number;
}

export const createFetch = (options: DenoNativeOptions = {}) => {
  const path = configuredPath;
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  return async (request: Request): Promise<Response> => {
    const source = new FetchRequestSource(request);
    const early = preflight(source, path);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonBody(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
    const services =
      nativeRuntime.getServices() ?? (await nativeRuntime.resolveServices());
    if (isJsonObject(body)) {
      const result = await nativeUnaryDispatch(
        body,
        source,
        services,
        nativeRuntime.runtime,
        compiledUncachedExecutionState,
        'response'
      );
      if (result !== undefined) return transportResultToResponse(result);
    }
    return transportResultToResponse(await nativeResponseTransport(source, body));
  };
};

export const fetch = createFetch();

export const serve = (options: DenoNativeOptions = {}) => {
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(config: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  return denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: createFetch(options),
  });
};
`
  );
};

const emitClient = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  interface ClientTree {
    procedures: string[];
    children: Map<string, ClientTree>;
  }
  const createNode = (): ClientTree => ({
    procedures: [],
    children: new Map(),
  });
  const tree = createNode();
  const entryById = new Map(
    manifest.procedures.map((entry) => [entry.id, entry])
  );
  for (const entry of manifest.procedures) {
    const parts = entry.id.split('.');
    const methodName = parts.pop();
    if (methodName === undefined) continue;
    let node = tree;
    for (const part of parts) {
      const child = node.children.get(part) ?? createNode();
      node.children.set(part, child);
      node = child;
    }
    node.procedures.push(entry.id);
  }
  const renderNode = (node: ClientTree, depth: number): string => {
    const indent = '  '.repeat(depth);
    const childIndent = '  '.repeat(depth + 1);
    const childBlocks = [...node.children.entries()]
      .map(
        ([name, child]) => `${indent}${JSON.stringify(name)}: {
${renderNode(child, depth + 1)}
${indent}},`
      )
      .join('\n');
    const procedureBlocks = node.procedures
      .map((id) => {
        const name = id.split('.').at(-1);
        if (name === undefined) return '';
        const typeRef = `typeof manifest.procedures[${JSON.stringify(id)}]`;
        const entry = entryById.get(id);
        if (entry === undefined) return '';
        const methods =
          entry.procedure.stream === undefined
            ? `${childIndent}call: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.call(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),
${childIndent}request: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.request(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),`
            : `${childIndent}stream: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.stream(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),`;
        return `${indent}${JSON.stringify(name)}: {
${methods}
${indent}},`;
      })
      .join('\n');
    return [childBlocks, procedureBlocks].filter(Boolean).join('\n');
  };
  const clientBody = renderNode(tree, 2);
  await writeFile(
    `${outDir}/client.ts`,
    `import { createClient as createTransportClient } from 'joor/client';
import type { ClientRequestOptions } from 'joor/client';
import type { ProcedureHeaders, ProcedureInput, ProcedureOutput, ProcedureResponseHeaders, RpcRouteEnvelope, RpcRouteRequest, RpcStreamRouteId, RpcUnaryRouteId, StreamEvent } from 'joor';
import { manifest } from './manifest.js';

export type Manifest = typeof manifest;
export type RouteId = keyof Manifest['procedures'] & string;
export type UnaryRouteId = RpcUnaryRouteId<Manifest['procedures']>;
export type StreamRouteId = RpcStreamRouteId<Manifest['procedures']>;
export type RouteProcedure<TId extends RouteId> = Manifest['procedures'][TId];
export type RouteInput<TId extends RouteId> = ProcedureInput<RouteProcedure<TId>>;
export type RouteOutput<TId extends UnaryRouteId> = ProcedureOutput<RouteProcedure<TId>>;
export type RouteHeaders<TId extends RouteId> = ProcedureHeaders<RouteProcedure<TId>>;
export type RouteResponseHeaders<TId extends UnaryRouteId> = ProcedureResponseHeaders<RouteProcedure<TId>>;
export type RouteRequest<TId extends UnaryRouteId> = RpcRouteRequest<Manifest['procedures'], TId>;
export type RouteResult<TId extends UnaryRouteId> = RpcRouteEnvelope<Manifest['procedures'], TId>;
export type Result<TId extends UnaryRouteId> = RouteResult<TId>;
export type Stream<TId extends StreamRouteId> = StreamEvent<RouteProcedure<TId>>;
export type ClientArgs<TProcedure> = Record<string, never> extends ProcedureHeaders<TProcedure>
  ? [input: ProcedureInput<TProcedure>, options?: ClientRequestOptions<TProcedure>]
  : [input: ProcedureInput<TProcedure>, options: ClientRequestOptions<TProcedure>];

const optionalOptions = <TProcedure>(options: ClientRequestOptions<TProcedure> | undefined) =>
  options === undefined ? [] : [options] as const;

export const createClient = (options: Parameters<typeof createTransportClient>[0]) => {
  const transport = createTransportClient<Manifest['procedures']>(options);
  return {
${clientBody}
    batch: transport.batch,
  };
};

export const client = createClient({ url: '/rpc' });
`
  );
};

const emitProcedureHelper = async (
  outDir: string,
  configPath?: string
): Promise<void> => {
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(`${outDir}/procedure.ts`, configPath)}';\n`;
  const contextType =
    configPath === undefined ? 'object' : 'JoorConfigContext<typeof config>';
  await writeFile(
    `${outDir}/procedure.ts`,
    `import { defineProcedure } from 'joor';
import type { JoorConfigContext } from 'joor';
${configImport}
export const procedure = defineProcedure.withContext<${contextType}>();
`
  );
};

export const emitArtifacts = async (
  manifest: CompilerManifest,
  options: EmitOptions
): Promise<void> => {
  await mkdir(options.outDir, { recursive: true });
  await emitManifest(manifest, options.outDir);
  await emitDispatcher(
    manifest,
    options.outDir,
    options.config,
    options.configPath
  );
  await emitRuntimeTargets(options.outDir, options.config);
  await emitClient(manifest, options.outDir);
  await emitProcedureHelper(options.outDir, options.configPath);
  await writeJson(
    `${options.outDir}/openapi.json`,
    createOpenApiDocument(manifest)
  );
  await writeJson(`${options.outDir}/ai-docs.json`, createAiDocs(manifest));
};
