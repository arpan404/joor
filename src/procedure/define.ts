import type { JoorContext } from '../context/context.js';
import type { JsonValue } from '../schema/json.js';
import type { InferSchema, Schema } from '../schema/types.js';
import type { ProcedureResult } from './result.js';
import type {
  ErrorCode,
  ErrorSchemas,
  MaybePromise,
  Procedure,
  ProcedureMeta,
  ProcedureRuntimeValue,
} from './types.js';

export interface UnaryProcedureConfig<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas,
  TServices extends object,
> {
  input: TInput;
  output: TOutput;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<TServices>,
    input: InferSchema<TInput>
  ): MaybePromise<
    ProcedureResult<InferSchema<TOutput> & JsonValue, ErrorCode<TErrors>>
  >;
}

export interface StreamProcedureConfig<
  TInput extends Schema,
  TStream extends Schema,
  TErrors extends ErrorSchemas,
  TServices extends object,
> {
  input: TInput;
  stream: TStream;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<TServices>,
    input: InferSchema<TInput>
  ): AsyncIterable<InferSchema<TStream> & JsonValue>;
}

export interface DefineProcedure<TServices extends object = object> {
  <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
  >(
    config: UnaryProcedureConfig<TInput, TOutput, TErrors, TServices>
  ): Procedure<TInput, TOutput, TErrors, undefined>;

  <
    TInput extends Schema,
    TStream extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
  >(
    config: StreamProcedureConfig<TInput, TStream, TErrors, TServices>
  ): Procedure<TInput, Schema, TErrors, TStream>;

  withContext<TNextServices extends object>(): DefineProcedure<TNextServices>;
}

const createDefineProcedure = <
  TServices extends object,
>(): DefineProcedure<TServices> => {
  const define = <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas,
    TStream extends Schema,
  >(
    config:
      | UnaryProcedureConfig<TInput, TOutput, TErrors, TServices>
      | StreamProcedureConfig<TInput, TStream, TErrors, TServices>
  ): Procedure => {
    const handler = (
      ctx: JoorContext<object>,
      input: JsonValue
    ): ProcedureRuntimeValue => {
      const typedContext = ctx as JoorContext<TServices>;
      if ('stream' in config) {
        return config.handler(
          typedContext,
          input as InferSchema<TInput>
        ) as AsyncIterable<JsonValue>;
      }
      return config.handler(
        typedContext,
        input as InferSchema<TInput>
      ) as MaybePromise<ProcedureResult<JsonValue, string>>;
    };
    return {
      input: config.input,
      ...('output' in config ? { output: config.output } : {}),
      ...('stream' in config ? { stream: config.stream } : {}),
      errors: config.errors ?? {},
      meta: config.meta ?? {},
      handler,
    };
  };
  return Object.assign(define, {
    withContext<TNextServices extends object>() {
      return createDefineProcedure<TNextServices>();
    },
  });
};

export const defineProcedure = createDefineProcedure<object>();
