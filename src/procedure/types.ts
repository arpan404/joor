import type { JoorContext } from '../context/context.js';
import type { AuthPolicy, AuthPolicyHeaderValues } from '../auth/policy.js';
import type { JsonValue } from '../schema/json.js';
import type {
  HeaderObjectSchema,
  InferSchema,
  Schema,
} from '../schema/types.js';
import type {
  ProcedureResponseHeaderValues,
  ProcedureResult,
} from './result.js';

export type MaybePromise<TValue> = TValue | Promise<TValue>;

export type ErrorSchemas = Record<string, Schema>;

export type ErrorCode<TErrors extends ErrorSchemas> = [TErrors] extends [
  Record<string, never>,
]
  ? never
  : Extract<keyof TErrors, string>;

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
  TServices,
  TErrorDetails = unknown,
> {
  input: TInput;
  output: TOutput;
  stream: TStream;
  errors: TErrors;
  errorDetails?: TErrorDetails;
  headers: THeaders;
  responseHeaders: TResponseHeaders;
  auth: TAuth;
  services: TServices;
}

export type ProcedureRuntimeValue =
  MaybePromise<
    ProcedureResult<JsonValue, string> | JsonValue | AsyncIterable<JsonValue>
  >;

export type ContextlessProcedureHandler = (
  input: JsonValue
) => MaybePromise<ProcedureResult<JsonValue, string> | JsonValue>;

export interface ProcedureRuntime {
  id?: string;
  input: Schema;
  headers?: HeaderObjectSchema;
  responseHeaders?: HeaderObjectSchema;
  auth?: AuthPolicy<object, AuthPolicyHeaderValues, object>;
  output?: Schema;
  stream?: Schema;
  errors: ErrorSchemas;
  meta: ProcedureMeta;
  context?: 'none';
  contextlessHandler?: ContextlessProcedureHandler;
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
  THeaders extends HeaderObjectSchema | undefined =
    | HeaderObjectSchema
    | undefined,
  TResponseHeaders extends HeaderObjectSchema | undefined =
    | HeaderObjectSchema
    | undefined,
  TAuth extends object = Record<string, never>,
  TServices extends object = Record<string, never>,
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
    TAuth,
    TServices,
    ErrorDetails<TErrors>
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
    infer TStream,
    string,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >;
}
  ? [TStream] extends [never]
    ? TOutput
    : never
  : never;

export type StreamEvent<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    infer TStream,
    string,
    unknown,
    unknown,
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
    unknown,
    unknown,
    unknown
  >;
}
  ? THeaders extends object
    ? THeaders
    : never
  : never;

export type ProcedureHasHeaders<TProcedure> = [
  ProcedureHeaders<TProcedure>,
] extends [Record<string, never>]
  ? false
  : true;

type RequiredHeaderKeys<THeaders extends object> = keyof {
  [TKey in keyof THeaders as Record<never, never> extends Pick<THeaders, TKey>
    ? never
    : TKey]: true;
};

export type ProcedureRequiresHeaders<TProcedure> = [
  ProcedureHeaders<TProcedure>,
] extends [Record<string, never>]
  ? false
  : ProcedureHeaders<TProcedure> extends object
    ? [RequiredHeaderKeys<ProcedureHeaders<TProcedure>>] extends [never]
      ? false
      : true
    : false;

export type ProcedureResponseHeaders<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    infer TResponseHeaders,
    unknown,
    unknown,
    unknown
  >;
}
  ? TResponseHeaders extends object
    ? TResponseHeaders
    : never
  : never;

export type ProcedureHasResponseHeaders<TProcedure> = [
  ProcedureResponseHeaders<TProcedure>,
] extends [Record<string, never>]
  ? false
  : true;

export type ProcedureRequiresResponseHeaders<TProcedure> = [
  ProcedureResponseHeaders<TProcedure>,
] extends [Record<string, never>]
  ? false
  : ProcedureResponseHeaders<TProcedure> extends object
    ? [RequiredHeaderKeys<ProcedureResponseHeaders<TProcedure>>] extends [never]
      ? false
      : true
    : false;

export type ProcedureAuth<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    unknown,
    infer TAuth,
    unknown,
    unknown
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
    unknown,
    unknown,
    unknown
  >;
}
  ? TErrors extends string
    ? TErrors
    : never
  : never;

export type ProcedureErrorDetails<
  TProcedure,
  TCode extends ProcedureErrorCode<TProcedure>,
> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    unknown,
    unknown,
    unknown,
    infer TErrorDetails
  >;
}
  ? TCode extends keyof TErrorDetails
    ? TErrorDetails[TCode]
    : never
  : never;

export type ProcedureServices<TProcedure> = TProcedure extends {
  types?: ProcedureTypes<
    unknown,
    unknown,
    unknown,
    string,
    unknown,
    unknown,
    unknown,
    infer TServices,
    unknown
  >;
}
  ? TServices extends object
    ? TServices
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
} & (JsonValue extends TDetails
  ? { details?: TDetails }
  : { details: TDetails });

type KnownResponseHeaderKeys<THeaders extends object> = {
  [TKey in keyof THeaders]: string extends TKey
    ? never
    : number extends TKey
      ? never
      : symbol extends TKey
        ? never
        : TKey;
}[keyof THeaders];

type RequiredResponseHeaderKeys<THeaders extends object> = keyof {
  [TKey in KnownResponseHeaderKeys<THeaders> as Record<
    never,
    never
  > extends Pick<THeaders, TKey>
    ? never
    : TKey]: true;
};

type StringResponseHeaders<THeaders extends object> = {
  [TKey in KnownResponseHeaderKeys<THeaders>]: Exclude<
    THeaders[TKey],
    undefined
  > extends string
    ? THeaders[TKey]
    : never;
} & (string extends keyof THeaders
  ? Exclude<THeaders[string], undefined> extends string
    ? Record<string, Exclude<THeaders[string], undefined>>
    : Record<string, never>
  : object);

type RpcEnvelopeSuccessHeaders<THeaders extends object> = [THeaders] extends [
  Record<string, never>,
]
  ? { headers?: StringResponseHeaders<THeaders> }
  : [RequiredResponseHeaderKeys<THeaders>] extends [never]
    ? { headers?: StringResponseHeaders<THeaders> }
    : { headers: StringResponseHeaders<THeaders> };

export type RpcEnvelope<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  THeaders extends object = ProcedureResponseHeaderValues,
  TError extends RpcError = RpcError,
> =
  | ({
      ok: true;
      id: TId;
      data: TData;
      traceId: string;
    } & RpcEnvelopeSuccessHeaders<THeaders>)
  | {
      ok: false;
      id: TId;
      error: TError;
      traceId: string;
    };

export type { JoorContext } from '../context/context.js';
export type { JoorPlugin } from '../context/plugin.js';
export type { ProcedureResult } from './result.js';
