import { parseJson, type JsonValue } from '../schema/json.js';

export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;

export class BodySizeLimitError extends Error {
  constructor(readonly limit: number) {
    super(`Request body exceeds ${limit} bytes`);
    this.name = 'BodySizeLimitError';
  }
}

export const isBodySizeLimitError = (
  error: object
): error is BodySizeLimitError => error instanceof BodySizeLimitError;

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
};

export const readJsonRequestBody = async (
  request: Request,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): Promise<JsonValue> => {
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > maxBodyBytes) {
      throw new BodySizeLimitError(maxBodyBytes);
    }
  }
  const text = await request.text();
  if (text.length > maxBodyBytes) {
    throw new BodySizeLimitError(maxBodyBytes);
  }
  if (text.length === 0) return {};
  return parseJson(text);
};
