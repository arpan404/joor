import type { JoorContext } from '../context/context.js';
import type { JsonValue } from '../schema/json.js';
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
> {
  input: TInput;
  output: TOutput;
  stream: TStream;
  errors: TErrors;
}

export type ProcedureRuntimeValue =
  | MaybePromise<ProcedureResult<JsonValue, string>>
  | AsyncIterable<JsonValue>;

export interface ProcedureRuntime {
  id?: string;
  input: Schema;
  output?: Schema;
  stream?: Schema;
  errors: ErrorSchemas;
  meta: ProcedureMeta;
  handler(ctx: JoorContext<object>, input: JsonValue): ProcedureRuntimeValue;
}

export interface Procedure<
  TInput extends Schema = Schema,
  TOutput extends Schema = Schema,
  TErrors extends ErrorSchemas = ErrorSchemas,
  TStream extends Schema | undefined = Schema | undefined,
> extends ProcedureRuntime {
  types?: ProcedureTypes<
    InferSchema<TInput>,
    InferSchema<TOutput>,
    TStream extends Schema ? InferSchema<TStream> : never,
    ErrorCode<TErrors>
  >;
}

export type ProcedureInput<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<infer TInput, JsonValue, JsonValue, string>;
}
  ? TInput
  : never;

export type ProcedureOutput<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<JsonValue, infer TOutput, JsonValue, string>;
}
  ? TOutput
  : never;

export type StreamEvent<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<JsonValue, JsonValue, infer TStream, string>;
}
  ? TStream
  : never;

export interface ProcedureMeta {
  summary?: string;
  description?: string;
  tags?: string[];
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
