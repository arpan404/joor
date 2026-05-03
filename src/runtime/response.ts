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

export const isSerializedJsonEnvelope = (
  result: TransportBodyResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

export const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'string') target[key] = value;
  }
};

export const createJsonHeaderRecord = (
  source?: JsonObject
): Record<string, string> => {
  const headers: Record<string, string> = { ...jsonContentHeaders };
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
  const headers = new Headers({
    ...jsonContentHeaders,
    ...(extraHeaders ?? {}),
  });
  if (!Array.isArray(result) && result.ok && result.headers !== undefined) {
    for (const [key, value] of Object.entries(result.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
  }
  return new Response(JSON.stringify(result), { status: 200, headers });
};

export const transportResultToResponse = (
  result: TransportBodyResult
): Response => {
  if (result instanceof Response) return result;
  if (isSerializedJsonEnvelope(result))
    return serializedEnvelopeToResponse(result);
  return rpcEnvelopeToResponse(result);
};
