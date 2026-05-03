import type { JoorContext } from '../context/context.js';
import type { JsonValue } from '../schema/json.js';
import type { InferSchema, Schema } from '../schema/types.js';
import type {
  ErrorCode,
  ErrorSchemas,
  MaybePromise,
  Procedure,
  ProcedureMeta,
  ProcedureRuntimeValue,
} from './types.js';
import type { ProcedureResult } from './result.js';

interface UnaryProcedureConfig<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas,
> {
  input: TInput;
  output: TOutput;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<object>,
    input: InferSchema<TInput>
  ): MaybePromise<
    ProcedureResult<InferSchema<TOutput> & JsonValue, ErrorCode<TErrors>>
  >;
}

interface StreamProcedureConfig<
  TInput extends Schema,
  TStream extends Schema,
  TErrors extends ErrorSchemas,
> {
  input: TInput;
  stream: TStream;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<object>,
    input: InferSchema<TInput>
  ): AsyncIterable<InferSchema<TStream> & JsonValue>;
}

export function defineProcedure<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas = Record<string, never>,
>(
  config: UnaryProcedureConfig<TInput, TOutput, TErrors>
): Procedure<TInput, TOutput, TErrors, undefined>;

export function defineProcedure<
  TInput extends Schema,
  TStream extends Schema,
  TErrors extends ErrorSchemas = Record<string, never>,
>(
  config: StreamProcedureConfig<TInput, TStream, TErrors>
): Procedure<TInput, Schema, TErrors, TStream>;

export function defineProcedure<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas,
  TStream extends Schema,
>(
  config:
    | UnaryProcedureConfig<TInput, TOutput, TErrors>
    | StreamProcedureConfig<TInput, TStream, TErrors>
): Procedure {
  const handler = (
    ctx: JoorContext<object>,
    input: JsonValue
  ): ProcedureRuntimeValue => {
    if ('stream' in config) {
      return config.handler(
        ctx,
        input as InferSchema<TInput>
      ) as AsyncIterable<JsonValue>;
    }
    return config.handler(ctx, input as InferSchema<TInput>) as MaybePromise<
      ProcedureResult<JsonValue, string>
    >;
  };
  return {
    input: config.input,
    ...('output' in config ? { output: config.output } : {}),
    ...('stream' in config ? { stream: config.stream } : {}),
    errors: config.errors ?? {},
    meta: config.meta ?? {},
    handler,
  };
}
