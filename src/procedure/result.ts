import type { JsonValue } from '../schema/json.js';

export interface ProcedureSuccess<TData extends JsonValue> {
  kind: 'success';
  data: TData;
}

export interface ProcedureFailure<TCode extends string> {
  kind: 'error';
  error: {
    code: TCode;
    message: string;
    status: number;
    details?: JsonValue;
  };
}

export type ProcedureResult<TData extends JsonValue, TCode extends string> =
  | ProcedureSuccess<TData>
  | ProcedureFailure<TCode>;

export const ok = <TData extends JsonValue>(
  data: TData
): ProcedureSuccess<TData> => ({
  kind: 'success',
  data,
});

export const failure = <TCode extends string>(
  code: TCode,
  details: JsonValue,
  status = 400,
  message = code
): ProcedureFailure<TCode> => ({
  kind: 'error',
  error: { code, details, status, message },
});
