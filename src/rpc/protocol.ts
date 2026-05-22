import type { JsonValue, JsonObject } from '../schema/json.js';
import type { ValidationIssue } from '../schema/types.js';

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

export interface RpcFailure<TId extends string = string> extends JsonObject {
  ok: false;
  id: TId;
  error: {
    code: string;
    message: string;
    status: number;
    details?: JsonValue;
  } & JsonObject;
  traceId: string;
}

export type RpcEnvelope<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
> = RpcSuccess<TData, TId, THeaders> | RpcFailure<TId>;

export type RpcResponse<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends JsonObject = JsonObject,
> = RpcEnvelope<TData, TId, THeaders> | RpcEnvelope<TData, TId, THeaders>[];

export const validationDetails = (issues: ValidationIssue[]): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
