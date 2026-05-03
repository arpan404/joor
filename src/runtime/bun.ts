import {
  requestSourceFromRequest,
  type ContextRequestSource,
} from '../context/context.js';
import type {
  HandlerOptions,
  RpcBodyResult,
  RpcManifest,
} from '../rpc/dispatcher.js';
import { createRpcBodyResultHandler } from '../rpc/dispatcher.js';
import type { JsonObject, JsonValue } from '../schema/json.js';
import { readJsonRequestBody } from './body.js';
import type { CompiledSerializedEnvelope } from './compiled.js';
import { createJoorHandler } from './fetch.js';

export interface BunServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export type BunTransportBodyResult = RpcBodyResult | CompiledSerializedEnvelope;
export type BunTransportBodyResultHandler = (
  request: ContextRequestSource,
  body: JsonValue
) => Promise<BunTransportBodyResult>;

const jsonHeaders = Object.freeze({
  'content-type': 'application/json',
});

const jsonResponseInit: ResponseInit = {
  status: 200,
  headers: jsonHeaders,
};

export const createBunFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

const isCompiledSerializedEnvelope = (
  result: BunTransportBodyResult
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

const writeResult = (result: BunTransportBodyResult): Response => {
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

export const createBunTransportRequestHandler = (
  handler: BunTransportBodyResultHandler
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

export const createBunRpcRequestHandler = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) => {
  const handler = createRpcBodyResultHandler(manifest, options);
  return createBunTransportRequestHandler((request, body) =>
    handler(request.toRequest(), body)
  );
};

export const serveBun = (
  manifest: RpcManifest,
  options: BunServeOptions = {}
): void => {
  const fetch = createBunRpcRequestHandler(manifest, options);
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(options: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch,
  });
};
