import type { JoorContext } from '../context/context.js';
import type { AuthPolicy, AuthPolicyHeaderValues } from '../auth/policy.js';
import type { JsonValue } from '../schema/json.js';
import type {
  HeaderObjectSchema,
  InferSchema,
  Schema,
} from '../schema/types.js';
import type {
  ProcedureFailure,
  ProcedureResult,
  ProcedureSuccess,
} from './result.js';
import type {
  ErrorCode,
  ErrorDetails,
  ErrorSchemas,
  MaybePromise,
  Procedure,
  ProcedureMeta,
  ProcedureRuntime,
  ProcedureRuntimeValue,
} from './types.js';

type ProcedureConfigResult<
  TOutput extends JsonValue,
  TErrors extends ErrorSchemas,
  TResponseHeaders extends object,
> =
  | ProcedureSuccess<TOutput, TResponseHeaders>
  | {
      [TCode in ErrorCode<TErrors>]: ProcedureFailure<
        TCode,
        ErrorDetails<TErrors>[TCode]
      >;
    }[ErrorCode<TErrors>];

export interface UnaryProcedureConfig<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas,
  TServices extends object,
  THeaders extends HeaderObjectSchema | undefined,
  TResponseHeaders extends HeaderObjectSchema | undefined,
  TAuth extends object,
  TRequest extends Request = Request,
> {
  readonly input: TInput;
  readonly headers?: THeaders;
  readonly responseHeaders?: TResponseHeaders;
  readonly auth?: AuthPolicy<
    TServices,
    THeaders extends Schema
      ? InferSchema<THeaders> & object
      : Record<string, never>,
    TAuth,
    TRequest
  >;
  readonly output: TOutput;
  readonly errors?: TErrors;
  readonly meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>,
      TResponseHeaders extends Schema
        ? InferSchema<TResponseHeaders> & object
        : Record<string, never>,
      TAuth,
      ErrorDetails<TErrors>,
      TRequest
    >,
    input: InferSchema<TInput>
  ): MaybePromise<
    | ProcedureConfigResult<
        InferSchema<TOutput> & JsonValue,
        TErrors,
        TResponseHeaders extends Schema
          ? InferSchema<TResponseHeaders> & object
          : Record<string, never>
      >
    | (InferSchema<TOutput> & JsonValue)
  >;
}

export interface ContextlessUnaryProcedureConfig<
  TInput extends Schema,
  TOutput extends Schema,
  TErrors extends ErrorSchemas,
> {
  readonly context: false;
  readonly input: TInput;
  readonly output: TOutput;
  readonly errors?: TErrors;
  readonly meta?: ProcedureMeta;
  handler(
    input: InferSchema<TInput>
  ): MaybePromise<
    | ProcedureConfigResult<
        InferSchema<TOutput> & JsonValue,
        TErrors,
        Record<string, never>
      >
    | (InferSchema<TOutput> & JsonValue)
  >;
}

export interface StreamProcedureConfig<
  TInput extends Schema,
  TStream extends Schema,
  TErrors extends ErrorSchemas,
  TServices extends object,
  THeaders extends HeaderObjectSchema | undefined,
  TAuth extends object,
  TRequest extends Request = Request,
> {
  readonly input: TInput;
  readonly headers?: THeaders;
  readonly auth?: AuthPolicy<
    TServices,
    THeaders extends Schema
      ? InferSchema<THeaders> & object
      : Record<string, never>,
    TAuth,
    TRequest
  >;
  readonly stream: TStream;
  readonly errors?: TErrors;
  readonly meta?: ProcedureMeta;
  handler(
    ctx: JoorContext<
      TServices,
      THeaders extends Schema
        ? InferSchema<THeaders> & object
        : Record<string, never>,
      Record<string, never>,
      TAuth,
      ErrorDetails<TErrors>,
      TRequest
    >,
    input: InferSchema<TInput>
  ): MaybePromise<AsyncIterable<InferSchema<TStream> & JsonValue>>;
}

export interface DefineProcedure<
  TServices extends object = Record<string, never>,
  TRequest extends Request = Request,
> {
  <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
  >(
    config: ContextlessUnaryProcedureConfig<TInput, TOutput, TErrors>
  ): Procedure<
    TInput,
    TOutput,
    TErrors,
    undefined,
    undefined,
    undefined,
    Record<string, never>,
    Record<string, never>
  >;

  <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
    THeaders extends HeaderObjectSchema | undefined = undefined,
    TResponseHeaders extends HeaderObjectSchema | undefined = undefined,
    TAuth extends object = Record<string, never>,
  >(
    config: UnaryProcedureConfig<
      TInput,
      TOutput,
      TErrors,
      TServices,
      THeaders,
      TResponseHeaders,
      TAuth,
      TRequest
    >
  ): Procedure<
    TInput,
    TOutput,
    TErrors,
    undefined,
    THeaders,
    TResponseHeaders,
    TAuth,
    TServices,
    TRequest
  >;

  <
    TInput extends Schema,
    TStream extends Schema,
    TErrors extends ErrorSchemas = Record<string, never>,
    THeaders extends HeaderObjectSchema | undefined = undefined,
    TAuth extends object = Record<string, never>,
  >(
    config: StreamProcedureConfig<
      TInput,
      TStream,
      TErrors,
      TServices,
      THeaders,
      TAuth,
      TRequest
    >
  ): Procedure<
    TInput,
    Schema,
    TErrors,
    TStream,
    THeaders,
    undefined,
    TAuth,
    TServices,
    TRequest
  >;

  withContext<
    TNextServices extends object,
    TNextRequest extends Request = Request,
  >(): DefineProcedure<TNextServices, TNextRequest>;
}

const createDefineProcedure = <
  TServices extends object,
  TRequest extends Request,
>(): DefineProcedure<TServices, TRequest> => {
  const define = <
    TInput extends Schema,
    TOutput extends Schema,
    TErrors extends ErrorSchemas,
    TStream extends Schema,
    THeaders extends HeaderObjectSchema | undefined,
    TResponseHeaders extends HeaderObjectSchema | undefined,
    TAuth extends object,
    TConfigRequest extends Request,
  >(
    config:
      | ContextlessUnaryProcedureConfig<TInput, TOutput, TErrors>
      | UnaryProcedureConfig<
          TInput,
          TOutput,
          TErrors,
          TServices,
          THeaders,
          TResponseHeaders,
          TAuth,
          TConfigRequest
        >
      | StreamProcedureConfig<
          TInput,
          TStream,
          TErrors,
          TServices,
          THeaders,
          TAuth,
          TConfigRequest
        >
  ): Procedure => {
    const headers = 'headers' in config ? config.headers : undefined;
    const responseHeaders =
      'stream' in config
        ? undefined
        : 'responseHeaders' in config
          ? config.responseHeaders
          : undefined;
    const auth = 'auth' in config ? config.auth : undefined;
    const contextlessHandler =
      'context' in config && config.context === false
        ? (input: JsonValue) =>
            config.handler(input as InferSchema<TInput>) as MaybePromise<
              ProcedureResult<JsonValue, string> | JsonValue
            >
        : undefined;
    const handler: ProcedureRuntime['handler'] =
      contextlessHandler === undefined
        ? (config.handler as ProcedureRuntime['handler'])
        : (
            _ctx: JoorContext<object, object, object, object>,
            input: JsonValue
          ): ProcedureRuntimeValue => contextlessHandler(input);
    return {
      input: config.input,
      ...(headers === undefined ? {} : { headers }),
      ...(responseHeaders === undefined ? {} : { responseHeaders }),
      ...(auth === undefined
        ? {}
        : {
            auth: auth as unknown as AuthPolicy<
              object,
              AuthPolicyHeaderValues,
              object,
              Request
            >,
          }),
      ...('output' in config ? { output: config.output } : {}),
      ...('stream' in config ? { stream: config.stream } : {}),
      errors: config.errors ?? {},
      meta: config.meta ?? {},
      ...(contextlessHandler === undefined
        ? {}
        : { context: 'none' as const, contextlessHandler }),
      handler,
    };
  };
  return Object.assign(define, {
    withContext<
      TNextServices extends object,
      TNextRequest extends Request = Request,
    >() {
      return createDefineProcedure<TNextServices, TNextRequest>();
    },
  }) as DefineProcedure<TServices, TRequest>;
};

export const defineProcedure = createDefineProcedure<
  Record<string, never>,
  Request
>();
