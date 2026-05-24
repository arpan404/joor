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
  readonly code: TCode;
  readonly message: string;
  readonly status: number;
} & (JsonValue extends TDetails
  ? { readonly details?: TDetails }
  : { readonly details: TDetails });

export interface RpcRequest<
  TId extends string = string,
  TInput extends JsonValue = JsonValue,
> {
  readonly id: TId;
  readonly input: TInput;
  readonly traceId?: string;
}

export type RpcBatchRequest<
  TRequests extends readonly RpcRequest[] = readonly RpcRequest[],
> = Readonly<TRequests>;

export type RpcResponseHeaderValues = Readonly<Record<string, string>>;

type KnownHeaderKeys<THeaders extends object> = {
  [TKey in keyof THeaders]: string extends TKey
    ? never
    : number extends TKey
      ? never
      : symbol extends TKey
        ? never
        : TKey;
}[keyof THeaders];

type RequiredKnownHeaderKeys<THeaders extends object> = keyof {
  [TKey in KnownHeaderKeys<THeaders> as Record<never, never> extends Pick<
    THeaders,
    TKey
  >
    ? never
    : TKey]: true;
};

type StringResponseHeaders<THeaders extends object> = {
  readonly [TKey in KnownHeaderKeys<THeaders>]: Exclude<
    THeaders[TKey],
    undefined
  > extends string
    ? THeaders[TKey]
    : never;
} & (string extends keyof THeaders
  ? Exclude<THeaders[string], undefined> extends string
    ? Readonly<Record<string, Exclude<THeaders[string], undefined>>>
    : Readonly<Record<string, never>>
  : object);

type RpcSuccessHeaders<THeaders extends object> = [THeaders] extends [
  Record<string, never>,
]
  ? { readonly headers?: StringResponseHeaders<THeaders> }
  : [RequiredKnownHeaderKeys<THeaders>] extends [never]
    ? { readonly headers?: StringResponseHeaders<THeaders> }
    : { readonly headers: StringResponseHeaders<THeaders> };

export type RpcSuccess<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends object = RpcResponseHeaderValues,
> = {
  readonly ok: true;
  readonly id: TId;
  readonly data: TData;
  readonly traceId: string;
} & RpcSuccessHeaders<THeaders>;

export interface RpcFailure<
  TId extends string = string,
  TError extends RpcError = RpcError,
> {
  readonly ok: false;
  readonly id: TId;
  readonly error: TError;
  readonly traceId: string;
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

export const validationDetails = (
  issues: readonly ValidationIssue[]
): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
