import type { JsonValue } from '../schema/json.js';

export type ProcedureResponseHeaderValues = Record<string, string>;

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

type ProcedureSuccessHeaders<THeaders extends object> = [THeaders] extends [
  Record<string, never>,
]
  ? { headers?: StringResponseHeaders<THeaders> }
  : [RequiredResponseHeaderKeys<THeaders>] extends [never]
    ? { headers?: StringResponseHeaders<THeaders> }
    : { headers: StringResponseHeaders<THeaders> };

export type ProcedureSuccess<
  TData extends JsonValue,
  THeaders extends object = ProcedureResponseHeaderValues,
> = {
  kind: 'success';
  data: TData;
} & ProcedureSuccessHeaders<THeaders>;

export interface ProcedureFailure<
  TCode extends string,
  TDetails extends JsonValue = JsonValue,
> {
  kind: 'error';
  error: {
    code: TCode;
    message: string;
    status: number;
  } & (JsonValue extends TDetails
    ? { details?: TDetails }
    : { details: TDetails });
}

export type ProcedureResult<
  TData extends JsonValue,
  TCode extends string,
  TDetails extends JsonValue = JsonValue,
  THeaders extends object = ProcedureResponseHeaderValues,
> = ProcedureSuccess<TData, THeaders> | ProcedureFailure<TCode, TDetails>;

export const ok = <TData extends JsonValue>(
  data: TData,
  headers?: ProcedureResponseHeaderValues
): ProcedureSuccess<TData> => ({
  kind: 'success',
  data,
  ...(headers === undefined ? {} : { headers }),
});

export const failure = <TCode extends string, TDetails extends JsonValue>(
  code: TCode,
  details: TDetails,
  status = 400,
  message = code
): ProcedureFailure<TCode, TDetails> => ({
  kind: 'error',
  error: { code, details, status, message },
});
