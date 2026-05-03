import type { JsonValue } from '../schema/json.js';
import {
  failure,
  ok,
  type ProcedureFailure,
  type ProcedureSuccess,
} from '../procedure/result.js';
import { errorStatus } from '../procedure/errors.js';

export interface JoorContext<TServices extends object = Record<string, never>> {
  request: Request;
  traceId: string;
  signal: AbortSignal;
  headers: Headers;
  services: TServices;
  ok<TData extends JsonValue>(data: TData): ProcedureSuccess<TData>;
  error<TCode extends string, TDetails extends JsonValue>(
    code: TCode,
    details: TDetails
  ): ProcedureFailure<TCode>;
}

export interface CreateContextOptions<TServices extends object> {
  request: Request;
  traceId: string;
  services: TServices;
}

export const createContext = <TServices extends object>(
  options: CreateContextOptions<TServices>
): JoorContext<TServices> => ({
  request: options.request,
  traceId: options.traceId,
  signal: options.request.signal,
  headers: options.request.headers,
  services: options.services,
  ok,
  error(code, details) {
    return failure(code, details, errorStatus(code), code);
  },
});
