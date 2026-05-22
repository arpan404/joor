import type { JsonObject, JsonValue } from '../schema/json.js';

type ProcedureSuccessHeaders<THeaders extends object> =
  Record<string, never> extends THeaders
    ? { headers?: THeaders & JsonObject }
    : { headers: THeaders & JsonObject };

export type ProcedureSuccess<
  TData extends JsonValue,
  THeaders extends object = JsonObject,
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
  THeaders extends object = JsonObject,
> = ProcedureSuccess<TData, THeaders> | ProcedureFailure<TCode, TDetails>;

export const ok = <TData extends JsonValue>(
  data: TData,
  headers?: JsonObject
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
