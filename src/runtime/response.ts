import type { RpcEnvelope } from '../rpc/protocol.js';
import type { JsonObject } from '../schema/json.js';

export interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
}

export type TransportBodyResult =
  | RpcEnvelope
  | RpcEnvelope[]
  | Response
  | SerializedJsonEnvelope;

export const jsonContentHeaders = Object.freeze({
  'content-type': 'application/json',
});

export const jsonOkResponseInit: ResponseInit = {
  status: 200,
  headers: jsonContentHeaders,
};

const headerNamePattern = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
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

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\0') || value.includes('\r') || value.includes('\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

export const isSerializedJsonEnvelope = (
  result: TransportBodyResult
): result is SerializedJsonEnvelope =>
  !Array.isArray(result) && 'body' in result && typeof result.body === 'string';

export const appendJsonStringHeaders = (
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

const appendHeaders = (
  target: Headers,
  source: Record<string, string>
): void => {
  for (const key in source) {
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (value !== undefined && isSafeResponseHeader(key, value)) {
      target.set(key, value);
    }
  }
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

export const createJsonHeaderRecord = (
  source?: JsonObject
): Record<string, string> => {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

export const serializedEnvelopeToResponse = (
  result: SerializedJsonEnvelope
): Response =>
  result.headers === undefined
    ? new Response(result.body, jsonOkResponseInit)
    : new Response(result.body, {
        status: 200,
        headers: createJsonHeaderRecord(result.headers),
      });

export const rpcEnvelopeToResponse = (
  result: RpcEnvelope | RpcEnvelope[],
  extraHeaders?: Record<string, string>
): Response => {
  if (
    extraHeaders === undefined &&
    (Array.isArray(result) || !result.ok || result.headers === undefined)
  ) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const headers = new Headers(jsonContentHeaders);
  if (extraHeaders !== undefined) appendHeaders(headers, extraHeaders);
  if (!Array.isArray(result) && result.ok && result.headers !== undefined) {
    appendJsonHeaders(headers, result.headers);
  }
  return new Response(JSON.stringify(result), { status: 200, headers });
};

export const transportResultToResponse = (
  result: TransportBodyResult
): Response => {
  if (isSerializedJsonEnvelope(result))
    return serializedEnvelopeToResponse(result);
  if (result instanceof Response) return result;
  return rpcEnvelopeToResponse(result);
};
