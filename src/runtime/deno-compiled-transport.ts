import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  RpcManifestBody,
  RpcManifestStreamRouteBody,
  RpcManifestUnaryRouteBody,
} from '../rpc/dispatcher.js';
import { isJsonObject, type JsonValue } from '../schema/json.js';
import {
  compiledUncachedExecutionState,
  type CompiledBodyResult,
  type CompiledFixedUnaryDispatch,
  type CompiledRpcTransportBodyResultHandler,
  type CompiledRuntimeState,
  type CompiledStreamRouteTransportBodyResultFor,
  type CompiledTransportBodyResultFor,
  type CompiledUnaryRouteTransportBodyResultFor,
} from './compiled.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from './body.js';
import { jsonContentHeaders, transportResultToResponse } from './response.js';

export type DenoCompiledTransportRequestHandler = (
  request: Request
) => Promise<Response>;

export type DenoCompiledTransportBodyResult = CompiledBodyResult;

export type DenoCompiledTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = CompiledTransportBodyResultFor<TManifest, TBody>;
export type DenoCompiledUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = CompiledUnaryRouteTransportBodyResultFor<TManifest, TBody>;
export type DenoCompiledStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = CompiledStreamRouteTransportBodyResultFor<TManifest, TBody>;
export type DenoCompiledRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestUnaryRouteBody<TManifest> =
    RpcManifestUnaryRouteBody<TManifest>,
> = DenoCompiledUnaryRouteTransportBodyResultFor<TManifest, TBody>;
export type DenoCompiledRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestStreamRouteBody<TManifest> =
    RpcManifestStreamRouteBody<TManifest>,
> = DenoCompiledStreamRouteTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends DenoCompiledTransportBodyResult =
    DenoCompiledTransportBodyResult,
> = CompiledRpcTransportBodyResultHandler<TBody, TResult>;

export type DenoCompiledTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<DenoCompiledTransportBodyResultFor<TManifest, TBody>>;

export type DenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestUnaryRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<DenoCompiledUnaryRouteTransportBodyResultFor<TManifest, TBody>>;

export type DenoCompiledStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestStreamRouteBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => Promise<DenoCompiledStreamRouteTransportBodyResultFor<TManifest, TBody>>;

export type DenoCompiledRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledUnaryRouteTransportBodyResultHandlerFor<TManifest>;

export type DenoCompiledRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledStreamRouteTransportBodyResultHandlerFor<TManifest>;

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

const bodyReadFailure = (request: Request, error: object): Response => {
  const payloadTooLarge = isBodySizeLimitError(error);
  const status = payloadTooLarge ? 413 : 400;
  return new Response(
    JSON.stringify({
      ok: false,
      id: '',
      traceId: request.headers.get('x-request-id') ?? 'trace-body-error',
      error: {
        code: payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
        message: payloadTooLarge
          ? 'Request body too large'
          : 'Invalid JSON body',
        status,
      },
    }),
    { status, headers: jsonContentHeaders }
  );
};

const requestPathPreflight = (
  request: Request,
  path: string
): Response | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  const contentType = request.headers.get('content-type') ?? '';
  if (!isJsonContentType(contentType)) {
    const headerTrace = request.headers.get('x-request-id');
    return new Response(
      JSON.stringify({
        ok: false,
        id: '',
        traceId: headerTrace ?? 'trace-body-error',
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Content-Type must be application/json',
          status: 415,
        },
      }),
      { status: 415, headers: jsonContentHeaders }
    );
  }
  return undefined;
};

export const createDenoCompiledTransportRequestHandlerWithPath = <
  TServices extends object = object,
  TBody = JsonValue,
  TResult extends DenoCompiledTransportBodyResult =
    DenoCompiledTransportBodyResult,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledTransportBodyResultHandler<TBody, TResult>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoCompiledTransportRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  return async (request: Request): Promise<Response> => {
    const early = requestPathPreflight(request, path);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
    const source: ContextRequestSource = createFetchRequestSource(request);
    const services =
      runtimeState.services ?? (await runtimeState.resolveServices());
    if (isJsonObject(body)) {
      const unary = await unaryDispatch(
        body,
        source,
        services,
        runtimeState.runtime,
        compiledUncachedExecutionState
      );
      if (unary !== undefined) return transportResultToResponse(unary);
    }
    return transportResultToResponse(await handler(source, body as TBody));
  };
};
