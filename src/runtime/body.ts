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

export const normalizeMaxBodyBytes = (
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): number =>
  Number.isFinite(maxBodyBytes) && maxBodyBytes >= 0
    ? Math.floor(maxBodyBytes)
    : DEFAULT_MAX_BODY_BYTES;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
};

const assertTextWithinLimit = (text: string, maxBodyBytes: number): void => {
  if (text.length > maxBodyBytes) {
    throw new BodySizeLimitError(maxBodyBytes);
  }
  if (text.length * 4 <= maxBodyBytes) return;
  if (encoder.encode(text).byteLength <= maxBodyBytes) return;
  throw new BodySizeLimitError(maxBodyBytes);
};

const decodeChunks = (chunks: Uint8Array[]): string => {
  if (chunks.length === 0) return '';
  if (chunks.length === 1) {
    const [chunk] = chunks;
    return chunk === undefined ? '' : decoder.decode(chunk);
  }
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return decoder.decode(merged);
};

const readRequestText = async (
  request: Request,
  maxBodyBytes: number
): Promise<string> => {
  const body = request.body;
  if (body === null) return '';
  const reader = body.getReader();
  let firstChunk: Uint8Array | undefined;
  let chunks: Uint8Array[] | undefined;
  let total = 0;
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    total += read.value.byteLength;
    if (total > maxBodyBytes) {
      try {
        await reader.cancel();
      } catch {
        // The size violation is the security boundary; cancellation failure
        // should not change the error returned to callers.
      }
      throw new BodySizeLimitError(maxBodyBytes);
    }
    if (firstChunk === undefined) {
      firstChunk = read.value;
    } else {
      chunks ??= [];
      chunks.push(read.value);
    }
  }
  if (firstChunk === undefined) return '';
  if (chunks === undefined) return decoder.decode(firstChunk);
  chunks.unshift(firstChunk);
  return decodeChunks(chunks);
};

export const readJsonRequestBodyWithLimit = async (
  request: Request,
  limit: number
): Promise<JsonValue> => {
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
    const text = await request.text();
    assertTextWithinLimit(text, limit);
    return text.length === 0 ? {} : parseJson(text);
  }
  const text = await readRequestText(request, limit);
  if (text.length === 0) return {};
  return parseJson(text);
};

export const readJsonRequestBody = (
  request: Request,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
): Promise<JsonValue> =>
  readJsonRequestBodyWithLimit(request, normalizeMaxBodyBytes(maxBodyBytes));
