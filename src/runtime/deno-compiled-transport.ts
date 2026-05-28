import {
  createFetchRequestSource,
  type ContextRequestSource,
} from '../context/context.js';
import type { JoorManifest } from '../manifest.js';
import type {
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
  RpcRequestPreflight,
} from '../rpc/dispatcher.js';
import { createRpcRequestPreflight } from '../rpc/dispatcher.js';
import type { RpcEnvelope } from '../rpc/protocol.js';
import { isJsonObject, type JsonValue } from '../schema/json.js';
import {
  compiledUncachedExecutionState,
  type CompiledBodyResult,
  type CompiledFixedUnaryDispatch,
  type CompiledRuntimeState,
  type CompiledRouteStreamTransportBodyResultFor,
  type CompiledRouteUnaryTransportBodyResultFor,
  type CompiledTransportBodyResultFor,
} from './compiled.js';
import {
  DEFAULT_MAX_BODY_BYTES,
  isBodySizeLimitError,
  normalizeMaxBodyBytes,
  readJsonRequestBodyWithLimit,
} from './body.js';
import type { JoorFetchHandler } from './fetch.js';
import { jsonContentHeaders, transportResultToResponse } from './response.js';

export type DenoCompiledTransportRequestHandler<
  TRequest extends Request = Request,
> = JoorFetchHandler<TRequest>;
export type DenoCompiledRouteUnaryTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledTransportRequestHandler<TRequest>;
export type DenoCompiledUnaryRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledRouteUnaryTransportRequestHandler<TRequest>;
export type DenoCompiledUnaryTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledRouteUnaryTransportRequestHandler<TRequest>;
export type DenoCompiledRouteStreamTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledTransportRequestHandler<TRequest>;
export type DenoCompiledStreamRouteTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledRouteStreamTransportRequestHandler<TRequest>;
export type DenoCompiledStreamTransportRequestHandler<
  TRequest extends Request = Request,
> = DenoCompiledRouteStreamTransportRequestHandler<TRequest>;

export type DenoCompiledTransportBodyResult<
  TEnvelope extends RpcEnvelope = RpcEnvelope,
> = CompiledBodyResult<TEnvelope>;
type MaybePromise<TValue> = TValue | Promise<TValue>;

export type DenoCompiledTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = CompiledTransportBodyResultFor<TManifest, TBody>;
export type DenoCompiledRouteUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = CompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledUnaryRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = DenoCompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledUnaryTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = DenoCompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledRouteStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = CompiledRouteStreamTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledStreamRouteTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = DenoCompiledRouteStreamTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledStreamTransportBodyResultFor<
  TManifest extends JoorManifest,
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = DenoCompiledRouteStreamTransportBodyResultFor<TManifest, TBody>;

export type DenoCompiledTransportBodyResultHandler<
  TBody = JsonValue,
  TResult extends DenoCompiledTransportBodyResult =
    DenoCompiledTransportBodyResult,
> = (
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<TResult>;

export type DenoCompiledTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<DenoCompiledTransportBodyResultFor<TManifest, TBody>>;

export type DenoCompiledRouteUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteUnaryBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<
  DenoCompiledRouteUnaryTransportBodyResultFor<TManifest, TBody>
>;

export type DenoCompiledUnaryRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type DenoCompiledUnaryTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>;

export type DenoCompiledRouteStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = <const TBody extends RpcManifestRouteStreamBody<TManifest>>(
  request: ContextRequestSource,
  body: TBody
) => MaybePromise<
  DenoCompiledRouteStreamTransportBodyResultFor<TManifest, TBody>
>;

export type DenoCompiledStreamRouteTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>;

export type DenoCompiledStreamTransportBodyResultHandlerFor<
  TManifest extends JoorManifest,
> = DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>;

export const createDenoCompiledTransportRequestHandler = <
  TServices extends object = object,
  TBody = JsonValue,
  TResult extends DenoCompiledTransportBodyResult =
    DenoCompiledTransportBodyResult,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledTransportBodyResultHandler<TBody, TResult>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): DenoCompiledTransportRequestHandler => {
  const bodyLimit = normalizeMaxBodyBytes(maxBodyBytes);
  const requestPreflight =
    preflight === false
      ? undefined
      : (preflight ?? createRpcRequestPreflight());
  return async (request: Request): Promise<Response> => {
    const source: ContextRequestSource = createFetchRequestSource(request);
    const early = requestPreflight?.(source);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = await readJsonRequestBodyWithLimit(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
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

export const createDenoCompiledTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
    TServices extends object = object,
    TBody = JsonValue,
    TResult extends DenoCompiledTransportBodyResult =
      DenoCompiledTransportBodyResult,
  >(
    runtimeState: CompiledRuntimeState<TServices>,
    handler: DenoCompiledTransportBodyResultHandler<TBody, TResult>,
    unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false
  ): DenoCompiledTransportRequestHandler<TRequest> =>
    createDenoCompiledTransportRequestHandler(
      runtimeState,
      handler,
      unaryDispatch,
      maxBodyBytes,
      preflight
    ) as DenoCompiledTransportRequestHandler<TRequest>;

export const createRouteUnaryDenoCompiledTransportRequestHandler = <
  TManifest extends JoorManifest,
  TServices extends object = object,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): DenoCompiledRouteUnaryTransportRequestHandler =>
  createDenoCompiledTransportRequestHandler(
    runtimeState,
    handler as DenoCompiledTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      DenoCompiledRouteUnaryTransportBodyResultFor<TManifest>
    >,
    unaryDispatch,
    maxBodyBytes,
    preflight
  );

export const createUnaryRouteDenoCompiledTransportRequestHandler: typeof createRouteUnaryDenoCompiledTransportRequestHandler =
  createRouteUnaryDenoCompiledTransportRequestHandler;

export const createUnaryDenoCompiledTransportRequestHandler: typeof createRouteUnaryDenoCompiledTransportRequestHandler =
  createRouteUnaryDenoCompiledTransportRequestHandler;

export const createRouteUnaryDenoCompiledTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
    TManifest extends JoorManifest,
    TServices extends object = object,
  >(
    runtimeState: CompiledRuntimeState<TServices>,
    handler: DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false
  ): DenoCompiledRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryDenoCompiledTransportRequestHandler(
      runtimeState,
      handler,
      unaryDispatch,
      maxBodyBytes,
      preflight
    ) as DenoCompiledRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteDenoCompiledTransportRequestHandlerFor: typeof createRouteUnaryDenoCompiledTransportRequestHandlerFor =
  createRouteUnaryDenoCompiledTransportRequestHandlerFor;

export const createUnaryDenoCompiledTransportRequestHandlerFor: typeof createRouteUnaryDenoCompiledTransportRequestHandlerFor =
  createRouteUnaryDenoCompiledTransportRequestHandlerFor;

export const createRouteStreamDenoCompiledTransportRequestHandler = <
  TManifest extends JoorManifest,
  TServices extends object = object,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  preflight?: RpcRequestPreflight | false
): DenoCompiledRouteStreamTransportRequestHandler =>
  createDenoCompiledTransportRequestHandler(
    runtimeState,
    handler as DenoCompiledTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      DenoCompiledRouteStreamTransportBodyResultFor<TManifest>
    >,
    unaryDispatch,
    maxBodyBytes,
    preflight
  );

export const createStreamRouteDenoCompiledTransportRequestHandler: typeof createRouteStreamDenoCompiledTransportRequestHandler =
  createRouteStreamDenoCompiledTransportRequestHandler;

export const createStreamDenoCompiledTransportRequestHandler: typeof createRouteStreamDenoCompiledTransportRequestHandler =
  createRouteStreamDenoCompiledTransportRequestHandler;

export const createRouteStreamDenoCompiledTransportRequestHandlerFor =
  <TRequest extends Request = Request>() =>
  <
    TManifest extends JoorManifest,
    TServices extends object = object,
  >(
    runtimeState: CompiledRuntimeState<TServices>,
    handler: DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>,
    unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
    preflight?: RpcRequestPreflight | false
  ): DenoCompiledRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamDenoCompiledTransportRequestHandler(
      runtimeState,
      handler,
      unaryDispatch,
      maxBodyBytes,
      preflight
    ) as DenoCompiledRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteDenoCompiledTransportRequestHandlerFor: typeof createRouteStreamDenoCompiledTransportRequestHandlerFor =
  createRouteStreamDenoCompiledTransportRequestHandlerFor;

export const createStreamDenoCompiledTransportRequestHandlerFor: typeof createRouteStreamDenoCompiledTransportRequestHandlerFor =
  createRouteStreamDenoCompiledTransportRequestHandlerFor;

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

export const createDenoCompiledTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <
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
  ): DenoCompiledTransportRequestHandler<TRequest> =>
    createDenoCompiledTransportRequestHandlerWithPath(
      runtimeState,
      handler,
      unaryDispatch,
      path,
      maxBodyBytes
    ) as DenoCompiledTransportRequestHandler<TRequest>;

export const createRouteUnaryDenoCompiledTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
  TServices extends object = object,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoCompiledRouteUnaryTransportRequestHandler =>
  createDenoCompiledTransportRequestHandlerWithPath(
    runtimeState,
    handler as DenoCompiledTransportBodyResultHandler<
      RpcManifestRouteUnaryBody<TManifest>,
      DenoCompiledRouteUnaryTransportBodyResultFor<TManifest>
    >,
    unaryDispatch,
    path,
    maxBodyBytes
  );

export const createUnaryRouteDenoCompiledTransportRequestHandlerWithPath: typeof createRouteUnaryDenoCompiledTransportRequestHandlerWithPath =
  createRouteUnaryDenoCompiledTransportRequestHandlerWithPath;

export const createUnaryDenoCompiledTransportRequestHandlerWithPath: typeof createRouteUnaryDenoCompiledTransportRequestHandlerWithPath =
  createRouteUnaryDenoCompiledTransportRequestHandlerWithPath;

export const createRouteUnaryDenoCompiledTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <
    TManifest extends JoorManifest,
    TServices extends object = object,
  >(
    runtimeState: CompiledRuntimeState<TServices>,
    handler: DenoCompiledRouteUnaryTransportBodyResultHandlerFor<TManifest>,
    unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): DenoCompiledRouteUnaryTransportRequestHandler<TRequest> =>
    createRouteUnaryDenoCompiledTransportRequestHandlerWithPath(
      runtimeState,
      handler,
      unaryDispatch,
      path,
      maxBodyBytes
    ) as DenoCompiledRouteUnaryTransportRequestHandler<TRequest>;

export const createUnaryRouteDenoCompiledTransportRequestHandlerWithPathFor: typeof createRouteUnaryDenoCompiledTransportRequestHandlerWithPathFor =
  createRouteUnaryDenoCompiledTransportRequestHandlerWithPathFor;

export const createUnaryDenoCompiledTransportRequestHandlerWithPathFor: typeof createRouteUnaryDenoCompiledTransportRequestHandlerWithPathFor =
  createRouteUnaryDenoCompiledTransportRequestHandlerWithPathFor;

export const createRouteStreamDenoCompiledTransportRequestHandlerWithPath = <
  TManifest extends JoorManifest,
  TServices extends object = object,
>(
  runtimeState: CompiledRuntimeState<TServices>,
  handler: DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>,
  unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
  path: string,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): DenoCompiledRouteStreamTransportRequestHandler =>
  createDenoCompiledTransportRequestHandlerWithPath(
    runtimeState,
    handler as DenoCompiledTransportBodyResultHandler<
      RpcManifestRouteStreamBody<TManifest>,
      DenoCompiledRouteStreamTransportBodyResultFor<TManifest>
    >,
    unaryDispatch,
    path,
    maxBodyBytes
  );

export const createStreamRouteDenoCompiledTransportRequestHandlerWithPath: typeof createRouteStreamDenoCompiledTransportRequestHandlerWithPath =
  createRouteStreamDenoCompiledTransportRequestHandlerWithPath;

export const createStreamDenoCompiledTransportRequestHandlerWithPath: typeof createRouteStreamDenoCompiledTransportRequestHandlerWithPath =
  createRouteStreamDenoCompiledTransportRequestHandlerWithPath;

export const createRouteStreamDenoCompiledTransportRequestHandlerWithPathFor =
  <TRequest extends Request = Request>() =>
  <
    TManifest extends JoorManifest,
    TServices extends object = object,
  >(
    runtimeState: CompiledRuntimeState<TServices>,
    handler: DenoCompiledRouteStreamTransportBodyResultHandlerFor<TManifest>,
    unaryDispatch: CompiledFixedUnaryDispatch<TServices>,
    path: string,
    maxBodyBytes = DEFAULT_MAX_BODY_BYTES
  ): DenoCompiledRouteStreamTransportRequestHandler<TRequest> =>
    createRouteStreamDenoCompiledTransportRequestHandlerWithPath(
      runtimeState,
      handler,
      unaryDispatch,
      path,
      maxBodyBytes
    ) as DenoCompiledRouteStreamTransportRequestHandler<TRequest>;

export const createStreamRouteDenoCompiledTransportRequestHandlerWithPathFor: typeof createRouteStreamDenoCompiledTransportRequestHandlerWithPathFor =
  createRouteStreamDenoCompiledTransportRequestHandlerWithPathFor;

export const createStreamDenoCompiledTransportRequestHandlerWithPathFor: typeof createRouteStreamDenoCompiledTransportRequestHandlerWithPathFor =
  createRouteStreamDenoCompiledTransportRequestHandlerWithPathFor;
