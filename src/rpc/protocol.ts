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
  input: TInput;
  traceId?: string;
}

export type RpcBatchRequest<
  TRequests extends readonly RpcRequest[] = readonly RpcRequest[],
> = TRequests;

export type RpcResponseHeaderValues = Record<string, string>;

type KnownHeaderKeys<THeaders extends object> = {
  [TKey in keyof THeaders]: string extends TKey
    ? never
    : number extends TKey
      ? never
      : symbol extends TKey
        ? never
        : TKey;
}[keyof THeaders];

type RequiredKnownHeaderKeys<THeaders extends object> = {
  [TKey in KnownHeaderKeys<THeaders>]-?: undefined extends THeaders[TKey]
    ? never
    : TKey;
}[KnownHeaderKeys<THeaders>];

type StringResponseHeaders<THeaders extends object> = {
  [TKey in KnownHeaderKeys<THeaders>]: Exclude<
    THeaders[TKey],
    undefined
  > extends string
    ? THeaders[TKey]
    : never;
};

type RpcSuccessHeaders<THeaders extends object> = [THeaders] extends [
  Record<string, never>,
]
  ? { headers?: StringResponseHeaders<THeaders> & JsonObject }
  : [RequiredKnownHeaderKeys<THeaders>] extends [never]
    ? { headers?: StringResponseHeaders<THeaders> & JsonObject }
    : { headers: StringResponseHeaders<THeaders> & JsonObject };

export type RpcSuccess<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends object = RpcResponseHeaderValues,
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
  THeaders extends object = RpcResponseHeaderValues,
  TError extends RpcError = RpcError,
> = RpcSuccess<TData, TId, THeaders> | RpcFailure<TId, TError>;

export type RpcResponse<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends object = RpcResponseHeaderValues,
  TError extends RpcError = RpcError,
> =
  | RpcEnvelope<TData, TId, THeaders, TError>
  | readonly RpcEnvelope<TData, TId, THeaders, TError>[];

export const validationDetails = (issues: ValidationIssue[]): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
