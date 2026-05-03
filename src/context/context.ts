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
  getHeader(name: string): string | null;
  toHeaders(): Headers;
  toRequest(): Request;
}

export const requestSourceFromRequest = (
  request: Request
): ContextRequestSource => ({
  url: request.url,
  method: request.method,
  signal: request.signal,
  getHeader(name) {
    return request.headers.get(name);
  },
  toHeaders() {
    return request.headers;
  },
  toRequest() {
    return request;
  },
});

export interface CreateContextOptions<
  TServices extends object,
  THeaders extends object,
  TAuth extends object,
> {
  request: ContextRequestSource;
  traceId: string;
  services: TServices;
  headers: THeaders;
  auth: TAuth;
}

function contextOk<TData extends JsonValue, THeaders extends object>(
  data: TData,
  headers?: THeaders
): ProcedureSuccess<TData> {
  return headers === undefined
    ? { kind: 'success', data }
    : { kind: 'success', data, headers: headers as JsonObject };
}

function contextError<TCode extends string, TDetails extends JsonValue>(
  code: TCode,
  details: TDetails
): ProcedureFailure<TCode> {
  return {
    kind: 'error',
    error: { code, details, status: errorStatus(code), message: code },
  };
}

export const createContext = <
  TServices extends object,
  THeaders extends object,
  TResponseHeaders extends object,
  TAuth extends object,
>(
  options: CreateContextOptions<TServices, THeaders, TAuth>
): JoorContext<TServices, THeaders, TResponseHeaders, TAuth> => ({
  get request() {
    return options.request.toRequest();
  },
  traceId: options.traceId,
  signal: options.request.signal,
  headers: options.headers,
  get rawHeaders() {
    return options.request.toHeaders();
  },
  services: options.services,
  auth: options.auth,
  ok: contextOk,
  error: contextError,
});
