import { parseJson, type JsonValue } from '../schema/json.js';

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
};

export const readJsonRequestBody = async (
  request: Request,
  maxBodyBytes?: number
): Promise<JsonValue> => {
  if (maxBodyBytes === undefined) {
    const text = await request.text();
    return text.length === 0 ? {} : parseJson(text);
  }
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > maxBodyBytes) {
      throw new Error('Request body exceeds maxBodyBytes');
    }
  }
  const text = await request.text();
  if (text.length > maxBodyBytes) {
    throw new Error('Request body exceeds maxBodyBytes');
  }
  if (text.length === 0) return {};
  return parseJson(text);
};
