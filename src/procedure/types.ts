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

export type ErrorDetails<TErrors extends ErrorSchemas> = {
  [TCode in ErrorCode<TErrors>]: InferSchema<TErrors[TCode]> & JsonValue;
};

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
    unknown,
    unknown,
    string,
    unknown,
    unknown,
    unknown
  >;
}
  ? TInput
  : never;

export type ProcedureOutput<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    infer TOutput,
    unknown,
    string,
    unknown,
    unknown,
    unknown
  >;
}
  ? TOutput
  : never;

export type StreamEvent<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    infer TStream,
    string,
    unknown,
    unknown,
    unknown
  >;
}
  ? TStream
  : never;

export type ProcedureHeaders<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    infer THeaders,
    unknown,
    unknown
  >;
}
  ? THeaders extends object
    ? THeaders
    : never
  : never;

export type ProcedureResponseHeaders<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    infer TResponseHeaders,
    unknown
  >;
}
  ? TResponseHeaders extends object
    ? TResponseHeaders
    : never
  : never;

export type ProcedureAuth<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    unknown,
    infer TAuth
  >;
}
  ? TAuth extends object
    ? TAuth
    : never
  : never;

export type ProcedureErrorCode<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    infer TErrors,
    unknown,
    unknown,
    unknown
  >;
}
  ? TErrors
  : never;

export type ProcedureErrorDetails<
  TProcedure,
  TCode extends ProcedureErrorCode<TProcedure>,
> = TProcedure extends Procedure<
  Schema,
  Schema,
  infer TErrors,
  Schema | undefined,
  Schema | undefined,
  Schema | undefined,
  object
>
  ? TCode extends keyof TErrors
    ? InferSchema<TErrors[TCode]>
    : never
  : never;

export type ProcedureError<TProcedure> = {
  [TCode in ProcedureErrorCode<TProcedure>]: RpcError<
    TCode,
    ProcedureErrorDetails<TProcedure, TCode> & JsonValue
  >;
}[ProcedureErrorCode<TProcedure>];

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

export type RpcError<
  TCode extends string = string,
  TDetails extends JsonValue = JsonValue,
> = {
  code: TCode;
  message: string;
  status: number;
  details?: TDetails;
};

export type RpcEnvelope<
  TData extends JsonValue = JsonValue,
  THeaders extends JsonObject = JsonObject,
  TError extends RpcError = RpcError,
> =
  | {
      ok: true;
      id: string;
      data: TData;
      headers?: THeaders;
      traceId: string;
    }
  | {
      ok: false;
      id: string;
      error: TError;
      traceId: string;
    };

export type { JoorContext } from '../context/context.js';
export type { JoorPlugin } from '../context/plugin.js';
export type { ProcedureResult } from './result.js';
