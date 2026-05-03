import type { JsonObject, JsonValue } from '../schema/json.js';
import {
  failure,
  ok,
  type ProcedureFailure,
  type ProcedureSuccess,
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

export interface CreateContextOptions<
  TServices extends object,
  THeaders extends object,
  TAuth extends object,
> {
  request: Request;
  traceId: string;
  services: TServices;
  headers: THeaders;
  auth: TAuth;
}

export const createContext = <
  TServices extends object,
  THeaders extends object,
  TResponseHeaders extends object,
  TAuth extends object,
>(
  options: CreateContextOptions<TServices, THeaders, TAuth>
): JoorContext<TServices, THeaders, TResponseHeaders, TAuth> => ({
  request: options.request,
  traceId: options.traceId,
  signal: options.request.signal,
  headers: options.headers,
  rawHeaders: options.request.headers,
  services: options.services,
  auth: options.auth,
  ok(data, headers) {
    return ok(data, headers as JsonObject | undefined);
  },
  error(code, details) {
    return failure(code, details, errorStatus(code), code);
  },
});
