import type { JsonObject, JsonValue } from '../schema/json.js';
import type {
  ProcedureFailure,
  ProcedureSuccess,
} from '../procedure/result.js';
import { errorStatus } from '../procedure/errors.js';

export interface JoorContext<
  TServices extends object = Record<string, never>,
  THeaders extends object = Record<string, never>,
  TResponseHeaders extends object = Record<string, never>,
  TAuth extends object = Record<string, never>,
> {
  request: Request;
  traceId: string;
  signal: AbortSignal;
  headers: THeaders;
  rawHeaders: Headers;
  services: TServices;
  auth: TAuth;
  ok<TData extends JsonValue>(
    data: TData,
    headers?: TResponseHeaders
  ): ProcedureSuccess<TData>;
  error<TCode extends string, TDetails extends JsonValue>(
    code: TCode,
    details: TDetails
  ): ProcedureFailure<TCode>;
}

export interface ContextRequestSource {
  url: string;
  method: string;
  signal: AbortSignal;
  remoteAddress: string | undefined;
  getHeader(name: string): string | null;
  toHeaders(): Headers;
  toRequest(): Request;
}

export const emptyJsonObject: JsonObject = Object.freeze({});
export const emptyContextObject: object = emptyJsonObject;

class FetchRequestSource implements ContextRequestSource {
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

export const createFetchRequestSource = (
  request: Request
): ContextRequestSource => new FetchRequestSource(request);

class RuntimeJoorContext<
  TServices extends object,
  THeaders extends object,
  TResponseHeaders extends object,
  TAuth extends object,
> implements JoorContext<TServices, THeaders, TResponseHeaders, TAuth> {
  readonly traceId: string;
  readonly signal: AbortSignal;
  readonly headers: THeaders;
  readonly services: TServices;
  auth: TAuth;

  constructor(
    private readonly source: ContextRequestSource,
    traceId: string,
    services: TServices,
    headers: THeaders,
    auth: TAuth
  ) {
    this.traceId = traceId;
    this.signal = source.signal;
    this.headers = headers;
    this.services = services;
    this.auth = auth;
  }

  get request(): Request {
    return this.source.toRequest();
  }

  get rawHeaders(): Headers {
    return this.source.toHeaders();
  }

  ok<TData extends JsonValue>(
    data: TData,
    headers?: TResponseHeaders
  ): ProcedureSuccess<TData> {
    return headers === undefined
      ? { kind: 'success', data }
      : { kind: 'success', data, headers: headers as JsonObject };
  }

  error<TCode extends string, TDetails extends JsonValue>(
    code: TCode,
    details: TDetails
  ): ProcedureFailure<TCode> {
    return {
      kind: 'error',
      error: { code, details, status: errorStatus(code), message: code },
    };
  }
}

export const createRuntimeContext = <
  TServices extends object,
  THeaders extends object,
  TResponseHeaders extends object,
  TAuth extends object,
>(
  request: ContextRequestSource,
  traceId: string,
  services: TServices,
  headers: THeaders,
  auth: TAuth
): JoorContext<TServices, THeaders, TResponseHeaders, TAuth> =>
  new RuntimeJoorContext<TServices, THeaders, TResponseHeaders, TAuth>(
    request,
    traceId,
    services,
    headers,
    auth
  );
