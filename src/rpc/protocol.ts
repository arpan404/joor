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
  TRequests extends readonly RpcRequest[] = RpcRequest[],
> = TRequests;

export interface RpcSuccess<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
> extends JsonObject {
  ok: true;
  id: TId;
  data: TData;
  headers?: THeaders;
  traceId: string;
}

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
  | RpcEnvelope<TData, TId, THeaders, TError>[];

export const validationDetails = (issues: ValidationIssue[]): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
