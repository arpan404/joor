import type { JsonValue, JsonObject } from '../schema/json.js';
import type { ValidationIssue } from '../schema/types.js';

export type RpcFrameworkErrorCode =
  | 'BAD_REQUEST'
  | 'HEADER_VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'
  | 'NOT_STREAMING'
  | 'OUTPUT_VALIDATION_ERROR'
  | 'PARSE_ERROR'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'RESPONSE_HEADER_VALIDATION_ERROR'
  | 'STREAM_REQUIRED'
  | 'STREAM_VALIDATION_ERROR'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'VALIDATION_ERROR';

export type RpcError<
  TCode extends string = string,
  TDetails extends JsonValue = JsonValue,
> = {
  code: TCode;
  message: string;
  status: number;
} & (JsonValue extends TDetails
  ? { details?: TDetails }
  : { details: TDetails }) &
  JsonObject;

export interface RpcRequest<
  TId extends string = string,
  TInput extends JsonValue = JsonValue,
> extends JsonObject {
  id: TId;
  input?: TInput;
  traceId?: string;
}

export type RpcBatchRequest<
  TRequests extends readonly RpcRequest[] = readonly RpcRequest[],
> = TRequests;

type RequiredHeaderKeys<THeaders extends object> = {
  [TKey in keyof THeaders]-?: undefined extends THeaders[TKey] ? never : TKey;
}[keyof THeaders];

type RpcSuccessHeaders<THeaders extends JsonObject> = [THeaders] extends [
  Record<string, never>,
]
  ? { headers?: THeaders }
  : JsonObject extends THeaders
    ? { headers?: THeaders }
    : [RequiredHeaderKeys<THeaders>] extends [never]
      ? { headers?: THeaders }
      : { headers: THeaders };

export type RpcSuccess<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
> = JsonObject & {
  ok: true;
  id: TId;
  data: TData;
  traceId: string;
} & RpcSuccessHeaders<THeaders>;

export interface RpcFailure<
  TId extends string = string,
  TError extends RpcError = RpcError,
> extends JsonObject {
  ok: false;
  id: TId;
  error: TError;
  traceId: string;
}

export type RpcEnvelope<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
  TError extends RpcError = RpcError,
> = RpcSuccess<TData, TId, THeaders> | RpcFailure<TId, TError>;

export type RpcResponse<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
  TError extends RpcError = RpcError,
> =
  | RpcEnvelope<TData, TId, THeaders, TError>
  | readonly RpcEnvelope<TData, TId, THeaders, TError>[];

export const validationDetails = (issues: ValidationIssue[]): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
