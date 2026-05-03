import type { JsonValue, JsonObject } from '../schema/json.js';
import type { ValidationIssue } from '../schema/types.js';

export interface RpcRequest extends JsonObject {
  id: string;
  input?: JsonValue;
  traceId?: string;
}

export type RpcBatchRequest = RpcRequest[];

export interface RpcSuccess<
  TData extends JsonValue = JsonValue,
> extends JsonObject {
  ok: true;
  id: string;
  data: TData;
  traceId: string;
}

export interface RpcFailure extends JsonObject {
  ok: false;
  id: string;
  error: {
    code: string;
    message: string;
    status: number;
    details?: JsonValue;
  } & JsonObject;
  traceId: string;
}

export type RpcEnvelope<TData extends JsonValue = JsonValue> =
  | RpcSuccess<TData>
  | RpcFailure;

export type RpcResponse = RpcEnvelope | RpcEnvelope[];

export const validationDetails = (issues: ValidationIssue[]): JsonObject => ({
  issues: issues.map((item) => ({ path: item.path, message: item.message })),
});
