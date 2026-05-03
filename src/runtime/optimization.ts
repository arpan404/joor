import type { JoorContext } from '../context/context.js';
import type { AuthPolicy } from '../auth/policy.js';
import type { ProcedureFailure } from '../procedure/result.js';
import type { JsonObject, JsonValue } from '../schema/json.js';

export interface CachedProcedureSuccess {
  data: JsonValue;
  headers?: JsonObject;
  expiresAt: number;
}

export type AuthResult = object | ProcedureFailure<string>;
export type AuthResultLike = AuthResult | Promise<AuthResult>;

export interface ExecutionState {
  cacheAuth: boolean;
  authCache?: Map<AuthPolicy<object, object, object>, AuthResultLike>;
}

export const uncachedExecutionState: ExecutionState = Object.freeze({
  cacheAuth: false,
});

interface CacheKeySource {
  auth: object;
  headers: JsonObject;
  input: JsonValue;
}

interface CachePathObject {
  [key: string]: JsonValue | CachePathObject | readonly JsonValue[] | undefined;
}

const isCachePathObject = (
  value: JsonValue | object | undefined
): value is CachePathObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const durationCache = new Map<string, number>();

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

export const parseDurationMs = (duration: string): number => {
  const cached = durationCache.get(duration);
  if (cached !== undefined) return cached;
  const match = /^(\d+)(ms|s|m|h)$/.exec(duration);
  if (match === null) {
    durationCache.set(duration, 60_000);
    return 60_000;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const value =
    unit === 'ms'
      ? amount
      : unit === 's'
        ? amount * 1_000
        : unit === 'm'
          ? amount * 60_000
          : amount * 3_600_000;
  durationCache.set(duration, value);
  return value;
};

export const createExecutionState = (cacheAuth = false): ExecutionState => ({
  cacheAuth,
});

const runAuthPolicy = (
  policy: AuthPolicy<object, object, object>,
  ctx: JoorContext<object, object, object, object>
): AuthResultLike =>
  policy.authenticate(
    ctx as JoorContext<
      object,
      object,
      Record<string, never>,
      Record<string, never>
    >
  );

export const authenticateOnce = (
  policy: AuthPolicy<object, object, object> | undefined,
  ctx: JoorContext<object, object, object, object>,
  state: ExecutionState
): AuthResultLike => {
  if (policy === undefined) return {};
  if (!state.cacheAuth) {
    return runAuthPolicy(policy, ctx);
  }
  state.authCache ??= new Map();
  const cached = state.authCache.get(policy);
  if (cached instanceof Promise) return cached;
  if (cached !== undefined) return cached;
  const pending = Promise.resolve(runAuthPolicy(policy, ctx));
  state.authCache.set(policy, pending);
  return pending.then((resolved) => {
    state.authCache?.set(policy, resolved);
    return resolved;
  });
};

export const createProcedureCacheKey = (
  id: string,
  keyPaths: readonly string[] | undefined,
  input: JsonValue,
  headers: JsonObject,
  auth: object
): string => {
  if (keyPaths === undefined || keyPaths.length === 0) {
    return `${id}:${JSON.stringify(input)}`;
  }
  const source: CacheKeySource = { auth, headers, input };
  const parts = keyPaths.map((path) => {
    const segments = path.split('.');
    const root = segments.shift();
    if (root !== 'auth' && root !== 'headers' && root !== 'input') {
      return `${path}=`;
    }
    const value = readPath(source[root], segments);
    return `${path}=${JSON.stringify(value)}`;
  });
  return `${id}:${parts.join('|')}`;
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
  headers?: JsonObject
): void => {
  store.set(key, {
    data,
    ...(headers === undefined ? {} : { headers }),
    expiresAt: Date.now() + ttlMs,
  });
};
