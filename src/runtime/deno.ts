import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcBodyResultHandler } from '../rpc/dispatcher.js';
import {
  requestSourceFromRequest,
  type ContextRequestSource,
} from '../context/context.js';
import type { JsonObject, JsonValue } from '../schema/json.js';
import { readJsonRequestBody } from './body.js';
import type { CompiledSerializedEnvelope } from './compiled.js';
import { createJoorHandler } from './fetch.js';

export interface DenoServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type DenoTransportBodyResult =
  | RpcBodyResult
  | CompiledSerializedEnvelope;

export type DenoTransportBodyResultHandler = (
  request: ContextRequestSource,
  body: JsonValue
) => Promise<DenoTransportBodyResult>;

const jsonHeaders = Object.freeze({
  'content-type': 'application/json',
});

const jsonResponseInit: ResponseInit = {
  status: 200,
  headers: jsonHeaders,
};

export const createDenoFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

const isCompiledSerializedEnvelope = (
  result: DenoTransportBodyResult
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

const writeResult = (result: DenoTransportBodyResult): Response => {
  if (isCompiledSerializedEnvelope(result)) {
    if (result.headers === undefined) {
      return new Response(result.body, jsonResponseInit);
    }
    const headers: Record<string, string> = { ...jsonHeaders };
    appendStringHeaders(headers, result.headers);
    return new Response(result.body, { status: 200, headers });
  }
  if (result instanceof Response) return result;
  if (Array.isArray(result)) {
    return new Response(JSON.stringify(result), jsonResponseInit);
  }
  if (!result.ok || result.headers === undefined) {
    return new Response(JSON.stringify(result), jsonResponseInit);
  }
  const headers: Record<string, string> = { ...jsonHeaders };
  appendStringHeaders(headers, result.headers);
  return new Response(JSON.stringify(result), { status: 200, headers });
};

export const createDenoTransportRequestHandler = (
  handler: DenoTransportBodyResultHandler
): ((request: Request) => Promise<Response>) => {
  return async (request: Request): Promise<Response> => {
    let body: JsonValue;
    try {
      body = await readJsonRequestBody(request);
    } catch {
      body = {};
    }
    return writeResult(await handler(requestSourceFromRequest(request), body));
  };
};

export const createDenoRpcRequestHandler = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) => {
  const handler = createRpcBodyResultHandler(manifest, options);
  return createDenoTransportRequestHandler((request, body) =>
    handler(request.toRequest(), body)
  );
};

export const serveDeno = (
  manifest: RpcManifest,
  options: DenoServeOptions = {}
): void => {
  const fetch = createDenoRpcRequestHandler(manifest, options);
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(options: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: fetch,
  });
};
