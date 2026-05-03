import type { JoorContext } from '../context/context.js';
import type { AuthPolicy } from '../auth/policy.js';
import type { JsonObject, JsonValue } from '../schema/json.js';
import type { InferSchema, Schema } from '../schema/types.js';
import type { ProcedureResult } from './result.js';

export type MaybePromise<TValue> = TValue | Promise<TValue>;

export type ErrorSchemas = Record<string, Schema>;

export type ErrorCode<TErrors extends ErrorSchemas> = Extract<
  keyof TErrors,
  string
>;

export interface ProcedureTypes<
  TInput,
  TOutput,
  TStream,
  TErrors extends string,
  THeaders,
  TResponseHeaders,
  TAuth,
> {
  input: TInput;
  output: TOutput;
  stream: TStream;
  errors: TErrors;
  headers: THeaders;
  responseHeaders: TResponseHeaders;
  auth: TAuth;
}

export type ProcedureRuntimeValue =
  | MaybePromise<ProcedureResult<JsonValue, string>>
  | AsyncIterable<JsonValue>;

export interface ProcedureRuntime {
  id?: string;
  input: Schema;
  headers?: Schema;
  responseHeaders?: Schema;
  auth?: AuthPolicy<object, object, object>;
  output?: Schema;
  stream?: Schema;
  errors: ErrorSchemas;
  meta: ProcedureMeta;
  handler(
    ctx: JoorContext<object, object, object, object>,
    input: JsonValue
  ): ProcedureRuntimeValue;
}

export interface Procedure<
  TInput extends Schema = Schema,
  TOutput extends Schema = Schema,
  TErrors extends ErrorSchemas = ErrorSchemas,
  TStream extends Schema | undefined = Schema | undefined,
  THeaders extends Schema | undefined = Schema | undefined,
  TResponseHeaders extends Schema | undefined = Schema | undefined,
  TAuth extends object = Record<string, never>,
> extends ProcedureRuntime {
  types?: ProcedureTypes<
    InferSchema<TInput>,
    InferSchema<TOutput>,
    TStream extends Schema ? InferSchema<TStream> : never,
    ErrorCode<TErrors>,
    THeaders extends Schema ? InferSchema<THeaders> : Record<string, never>,
    TResponseHeaders extends Schema
      ? InferSchema<TResponseHeaders>
      : Record<string, never>,
    TAuth
  >;
}

export type ProcedureInput<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    infer TInput,
    JsonValue,
    JsonValue,
    string,
    object,
    object,
    object
  >;
}
  ? TInput
  : never;

export type ProcedureOutput<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    JsonValue,
    infer TOutput,
    JsonValue,
    string,
    object,
    object,
    object
  >;
}
  ? TOutput
  : never;

export type StreamEvent<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    JsonValue,
    JsonValue,
    infer TStream,
    string,
    object,
    object,
    object
  >;
}
  ? TStream
  : never;

export type ProcedureHeaders<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    JsonValue,
    JsonValue,
    JsonValue,
    string,
    infer THeaders extends object,
    object,
    object
  >;
}
  ? THeaders
  : never;

export type ProcedureResponseHeaders<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    JsonValue,
    JsonValue,
    JsonValue,
    string,
    object,
    infer TResponseHeaders extends object,
    object
  >;
}
  ? TResponseHeaders
  : never;

export type ProcedureAuth<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    JsonValue,
    JsonValue,
    JsonValue,
    string,
    object,
    object,
    infer TAuth extends object
  >;
}
  ? TAuth
  : never;

export interface ProcedureMeta {
  kind?: 'query' | 'mutation' | 'subscription';
  summary?: string;
  description?: string;
  tags?: string[];
  auth?: string[];
  cache?: {
    ttl: string;
    key?: readonly string[];
  };
  rateLimit?: {
    limit: number;
    window: string;
  };
}

export type RpcError = {
  code: string;
  message: string;
  status: number;
  details?: JsonValue;
};

export type RpcEnvelope<TData extends JsonValue = JsonValue> =
  | {
      ok: true;
      id: string;
      data: TData;
      headers?: JsonObject;
      traceId: string;
    }
  | {
      ok: false;
      id: string;
      error: RpcError;
      traceId: string;
    };

export type { JoorContext } from '../context/context.js';
export type { JoorPlugin } from '../context/plugin.js';
export type { ProcedureResult } from './result.js';
