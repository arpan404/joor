import type { JoorContext } from '../context/context.js';
import type { AuthPolicy } from '../auth/policy.js';
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
  TResponseHeaders extends Schema | undefined,
  TAuth extends object,
> {
  input: TInput;
  headers?: THeaders;
  responseHeaders?: TResponseHeaders;
  auth?: AuthPolicy<
    TServices,
    THeaders extends Schema
      ? InferSchema<THeaders> & object
      : Record<string, never>,
    TAuth
  >;
  output: TOutput;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>,
      TResponseHeaders extends Schema
        ? InferSchema<TResponseHeaders> & object
        : Record<string, never>,
      TAuth
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
  TResponseHeaders extends Schema | undefined,
  TAuth extends object,
> {
  input: TInput;
  headers?: THeaders;
  responseHeaders?: TResponseHeaders;
  auth?: AuthPolicy<
    TServices,
    THeaders extends Schema
      ? InferSchema<THeaders> & object
      : Record<string, never>,
    TAuth
  >;
  stream: TStream;
  errors?: TErrors;
  meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>,
      TResponseHeaders extends Schema
        ? InferSchema<TResponseHeaders> & object
        : Record<string, never>,
      TAuth
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
    TResponseHeaders extends Schema | undefined = undefined,
    TAuth extends object = Record<string, never>,
  >(
    config: UnaryProcedureConfig<
      TInput,
      TOutput,
      TErrors,
      TServices,
      THeaders,
      TResponseHeaders,
      TAuth
    >
  ): Procedure<
    TInput,
    TOutput,
    TErrors,
    undefined,
    THeaders,
    TResponseHeaders,
    TAuth
  >;

  <
    TInput extends Schema,
    TStream extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
    THeaders extends Schema | undefined = undefined,
    TResponseHeaders extends Schema | undefined = undefined,
    TAuth extends object = Record<string, never>,
  >(
    config: StreamProcedureConfig<
      TInput,
      TStream,
      TErrors,
      TServices,
      THeaders,
      TResponseHeaders,
      TAuth
    >
  ): Procedure<
    TInput,
    Schema,
    TErrors,
    TStream,
    THeaders,
    TResponseHeaders,
    TAuth
  >;

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
    TResponseHeaders extends Schema | undefined,
    TAuth extends object,
  >(
    config:
      | UnaryProcedureConfig<
          TInput,
          TOutput,
          TErrors,
          TServices,
          THeaders,
          TResponseHeaders,
          TAuth
        >
      | StreamProcedureConfig<
          TInput,
          TStream,
          TErrors,
          TServices,
          THeaders,
          TResponseHeaders,
          TAuth
        >
  ): Procedure => {
    const handler = (
      ctx: JoorContext<object, object, object, object>,
      input: JsonValue
    ): ProcedureRuntimeValue => {
      const typedContext = ctx as JoorContext<
        TServices,
        THeaders extends Schema
          ? InferSchema<THeaders> & object
          : Record<string, never>,
        TResponseHeaders extends Schema
          ? InferSchema<TResponseHeaders> & object
          : Record<string, never>,
        TAuth
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
      ...(config.responseHeaders === undefined
        ? {}
        : { responseHeaders: config.responseHeaders }),
      ...(config.auth === undefined
        ? {}
        : { auth: config.auth as AuthPolicy<object, object, object> }),
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
