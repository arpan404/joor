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
  THeaders extends Schema | undefined,
> {
  input: TInput;
  headers?: THeaders;
  output: TOutput;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>
    >,
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
  THeaders extends Schema | undefined,
> {
  input: TInput;
  headers?: THeaders;
  stream: TStream;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>
    >,
    input: InferSchema<TInput>
  ): AsyncIterable<InferSchema<TStream> & JsonValue>;
}

export interface DefineProcedure<TServices extends object = object> {
  <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
    THeaders extends Schema | undefined = undefined,
  >(
    config: UnaryProcedureConfig<TInput, TOutput, TErrors, TServices, THeaders>
  ): Procedure<TInput, TOutput, TErrors, undefined, THeaders>;

  <
    TInput extends Schema,
    TStream extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
    THeaders extends Schema | undefined = undefined,
  >(
    config: StreamProcedureConfig<TInput, TStream, TErrors, TServices, THeaders>
  ): Procedure<TInput, Schema, TErrors, TStream, THeaders>;

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
    THeaders extends Schema | undefined,
  >(
    config:
      | UnaryProcedureConfig<TInput, TOutput, TErrors, TServices, THeaders>
      | StreamProcedureConfig<TInput, TStream, TErrors, TServices, THeaders>
  ): Procedure => {
    const handler = (
      ctx: JoorContext<object, object>,
      input: JsonValue
    ): ProcedureRuntimeValue => {
      const typedContext = ctx as JoorContext<
        TServices,
        THeaders extends Schema
          ? InferSchema<THeaders> & object
          : Record<string, never>
      >;
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
      ...(config.headers === undefined ? {} : { headers: config.headers }),
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
