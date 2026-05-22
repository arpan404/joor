import type { JsonObject, JsonValue } from '../schema/json.js';

export interface ProcedureSuccess<TData extends JsonValue> {
  kind: 'success';
  data: TData;
  headers?: JsonObject;
}

export interface ProcedureFailure<
  TCode extends string,
  TDetails extends JsonValue = JsonValue,
> {
  kind: 'error';
  error: {
    code: TCode;
    message: string;
    status: number;
    details?: TDetails;
  };
}

export type ProcedureResult<
  TData extends JsonValue,
  TCode extends string,
  TDetails extends JsonValue = JsonValue,
> =
  | ProcedureSuccess<TData>
  | ProcedureFailure<TCode, TDetails>;

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
