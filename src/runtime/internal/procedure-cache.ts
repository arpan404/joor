import type { JsonValue } from '../../schema/json.js';

export const DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES = 10_000;

export type CachedProcedureHeaders = Readonly<Record<string, string>>;
export type ProcedureCacheHeaderValues = Readonly<Record<string, string>>;

export interface CachedProcedureSuccess {
  readonly data: JsonValue;
  readonly headers?: CachedProcedureHeaders;
  readonly expiresAt: number;
}

interface CacheKeySource {
  auth: object;
  headers: ProcedureCacheHeaderValues;
  input: JsonValue;
}

interface CachePathObject {
  [key: string]: JsonValue | CachePathObject | readonly JsonValue[] | undefined;
}

const isCachePathObject = (
  value: JsonValue | object | undefined
): value is CachePathObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readPath = (
  value: JsonValue | object | undefined,
  path: readonly string[]
): JsonValue | undefined => {
  let current: JsonValue | object | undefined = value;
  for (const segment of path) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
      continue;
    }
    if (!isCachePathObject(current)) return undefined;
    current = current[segment];
  }
  return current as JsonValue | undefined;
};

const stringifyCachePart = (value: JsonValue | object): string => {
  try {
    return JSON.stringify(value) ?? 'undefined';
  } catch {
    return '"[unserializable]"';
  }
};

const defaultCacheKey = (
  id: string,
  input: JsonValue,
  headers: ProcedureCacheHeaderValues,
  auth: object
): string =>
  `${id}:input=${stringifyCachePart(input)}|headers=${stringifyCachePart(headers)}|auth=${stringifyCachePart(auth)}`;

const cacheScopeKey = (
  headers: ProcedureCacheHeaderValues,
  auth: object
): string =>
  `headers=${stringifyCachePart(headers)}|auth=${stringifyCachePart(auth)}`;

export const createProcedureCacheKey = (
  id: string,
  keyPaths: readonly string[] | undefined,
  input: JsonValue,
  headers: ProcedureCacheHeaderValues,
  auth: object
): string => {
  if (keyPaths === undefined || keyPaths.length === 0) {
    return defaultCacheKey(id, input, headers, auth);
  }
  const source: CacheKeySource = { auth, headers, input };
  const parts = keyPaths.map((path) => {
    const segments = path.split('.');
    const root = segments.shift();
    if (root !== 'auth' && root !== 'headers' && root !== 'input') {
      return `${path}=`;
    }
    const value = readPath(source[root], segments);
    return `${path}=${stringifyCachePart(value ?? null)}`;
  });
  return `${id}:${cacheScopeKey(headers, auth)}|${parts.join('|')}`;
};

const pruneExpiredCacheEntries = (
  store: Map<string, CachedProcedureSuccess>,
  now: number
): void => {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
};

const evictOldestCacheEntries = (
  store: Map<string, CachedProcedureSuccess>,
  maxEntries: number
): void => {
  while (store.size >= maxEntries) {
    const first = store.keys().next();
    if (first.done === true) return;
    store.delete(first.value);
  }
};

export const readCachedProcedureSuccess = (
  store: Map<string, CachedProcedureSuccess>,
  key: string,
  now = Date.now()
): CachedProcedureSuccess | undefined => {
  const cached = store.get(key);
  if (cached === undefined) return undefined;
  if (cached.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }
  return cached;
};

export const writeCachedProcedureSuccess = (
  store: Map<string, CachedProcedureSuccess>,
  key: string,
  ttlMs: number,
  data: JsonValue,
  headers?: CachedProcedureHeaders,
  maxEntries = DEFAULT_PROCEDURE_CACHE_MAX_ENTRIES
): void => {
  const now = Date.now();
  const boundedMaxEntries = Math.max(1, maxEntries);
  if (store.size >= boundedMaxEntries) {
    pruneExpiredCacheEntries(store, now);
  }
  if (store.size >= boundedMaxEntries) {
    evictOldestCacheEntries(store, boundedMaxEntries);
  }
  store.set(key, {
    data,
    ...(headers === undefined ? {} : { headers }),
    expiresAt: now + ttlMs,
  });
};
