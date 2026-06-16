import type { RpcEnvelope } from '../rpc/protocol.js';
import type {
  RpcManifest,
  RpcManifestBody,
  RpcManifestBodyResultFor,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamBodyResultFor,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryBodyResultFor,
  RpcManifestStreamRouteBody,
  RpcManifestUnaryRouteBody,
} from '../rpc/dispatcher.js';
import type { JsonObject } from '../schema/json.js';

export interface SerializedJsonEnvelope {
  readonly body: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly responseHeaders?: Readonly<Record<string, string>>;
}

export interface CorsHeaderOptions {
  readonly origin?: string;
  readonly headers?: readonly string[];
  readonly methods?: readonly string[];
}

export type TransportBodyResult<TEnvelope extends RpcEnvelope = RpcEnvelope> =
  | TEnvelope
  | readonly TEnvelope[]
  | Response
  | SerializedJsonEnvelope;

export type TransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = RpcManifestBodyResultFor<TManifest, TBody> | SerializedJsonEnvelope;

export type RouteUnaryTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = RpcManifestRouteUnaryBodyResultFor<TManifest, TBody> | SerializedJsonEnvelope;

export type UnaryRouteTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = RouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type UnaryTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = RouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type RouteStreamTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = RpcManifestRouteStreamBodyResultFor<TManifest, TBody> | SerializedJsonEnvelope;

export type StreamRouteTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = RouteStreamTransportBodyResultFor<TManifest, TBody>;

export type StreamTransportBodyResultFor<
  TManifest extends RpcManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = RouteStreamTransportBodyResultFor<TManifest, TBody>;

export const jsonContentHeaders = Object.freeze({
  'content-type': 'application/json',
});

export const jsonOkResponseInit: Readonly<ResponseInit> = {
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

export const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\0') || value.includes('\r') || value.includes('\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

export const isSerializedJsonEnvelope = <
  TEnvelope extends RpcEnvelope = RpcEnvelope,
>(
  result: TransportBodyResult<TEnvelope>
): result is SerializedJsonEnvelope =>
  'body' in result && typeof result.body === 'string';

export const isRpcEnvelopeArray = <TEnvelope extends RpcEnvelope>(
  result: TEnvelope | readonly TEnvelope[]
): result is readonly TEnvelope[] => Array.isArray(result);

export const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: Readonly<Record<string, string>>
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
  source: Readonly<Record<string, string>>
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
  source?: Readonly<Record<string, string>>
): Record<string, string> => {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

export const createCorsHeaderRecord = (
  cors?: CorsHeaderOptions | false
): Record<string, string> | undefined => {
  if (cors === undefined || cors === false || cors.origin === undefined) {
    return undefined;
  }
  if (hasInvalidHeaderValue(cors.origin)) return undefined;
  const methods = (cors.methods ?? ['POST', 'OPTIONS']).join(', ');
  const headers = (
    cors.headers ?? ['content-type', 'accept', 'x-request-id']
  ).join(', ');
  return {
    'access-control-allow-origin': cors.origin,
    ...(hasInvalidHeaderValue(methods)
      ? {}
      : { 'access-control-allow-methods': methods }),
    ...(hasInvalidHeaderValue(headers)
      ? {}
      : { 'access-control-allow-headers': headers }),
  };
};

export const serializedEnvelopeToResponse = (
  result: SerializedJsonEnvelope
): Response =>
  result.responseHeaders !== undefined
    ? new Response(result.body, {
        status: 200,
        headers: createJsonHeaderRecord(result.responseHeaders),
      })
    : result.headers === undefined
      ? new Response(result.body, jsonOkResponseInit)
      : new Response(result.body, {
          status: 200,
          headers: createJsonHeaderRecord(result.headers),
        });

export const rpcEnvelopeToResponse = <TEnvelope extends RpcEnvelope>(
  result: TEnvelope | readonly TEnvelope[],
  extraHeaders?: Readonly<Record<string, string>>
): Response => {
  if (
    extraHeaders === undefined &&
    (isRpcEnvelopeArray(result) || !result.ok || result.headers === undefined)
  ) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const headers = new Headers(jsonContentHeaders);
  if (extraHeaders !== undefined) appendHeaders(headers, extraHeaders);
  if (
    !isRpcEnvelopeArray(result) &&
    result.ok &&
    result.headers !== undefined
  ) {
    appendJsonHeaders(headers, result.headers);
  }
  return new Response(JSON.stringify(result), { status: 200, headers });
};

export const transportResultToResponse = <TEnvelope extends RpcEnvelope>(
  result: TransportBodyResult<TEnvelope>,
  extraHeaders?: Readonly<Record<string, string>>
): Response => {
  if (isSerializedJsonEnvelope(result))
    return result.responseHeaders === undefined && result.headers === undefined
      ? new Response(result.body, {
          status: 200,
          headers: createJsonHeaderRecord(extraHeaders),
        })
      : new Response(result.body, {
          status: 200,
          headers: createJsonHeaderRecord({
            ...(result.responseHeaders ?? result.headers),
            ...extraHeaders,
          }),
        });
  if (result instanceof Response) {
    if (extraHeaders === undefined) return result;
    const headers = new Headers(result.headers);
    appendHeaders(headers, extraHeaders);
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  }
  return rpcEnvelopeToResponse(result, extraHeaders);
};
