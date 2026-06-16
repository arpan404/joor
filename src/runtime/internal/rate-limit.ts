import type { ContextRequestSource } from '../../context/context.js';

const maxIdentityLength = 256;
export const DEFAULT_RATE_LIMIT_MAX_ENTRIES = 10_000;

export interface RateLimitWindow {
  count: number;
  resetAt: number;
}

export type RateLimitIdentityResolver = (
  request: Request
) => string | undefined;

export interface RateLimitRuntimeOptions {
  trustProxy: boolean;
  maxEntries: number;
  identity?: RateLimitIdentityResolver;
}

const normalizeIdentity = (
  identity: string | undefined
): string | undefined => {
  if (identity === undefined) return undefined;
  const trimmed = identity.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.length > maxIdentityLength
    ? trimmed.slice(0, maxIdentityLength)
    : trimmed;
};

const firstForwardedAddress = (
  request: ContextRequestSource
): string | undefined => {
  const forwarded =
    request.getHeader('x-forwarded-for') ??
    request.getHeader('cf-connecting-ip');
  if (forwarded === null) return undefined;
  return normalizeIdentity(forwarded.split(',')[0]);
};

export const createRateLimitKey = (
  procedureId: string,
  request: ContextRequestSource,
  options: RateLimitRuntimeOptions
): string => {
  const identity =
    normalizeIdentity(options.identity?.(request.toRequest())) ??
    (options.trustProxy ? firstForwardedAddress(request) : undefined) ??
    normalizeIdentity(request.remoteAddress) ??
    'anonymous';
  return `${procedureId}:${identity}`;
};

const pruneExpiredWindows = (
  windows: Map<string, RateLimitWindow>,
  now: number
): void => {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
};

const evictOldestWindows = (
  windows: Map<string, RateLimitWindow>,
  maxEntries: number
): void => {
  while (windows.size >= maxEntries) {
    const first = windows.keys().next();
    if (first.done === true) return;
    windows.delete(first.value);
  }
};

export const reserveRateLimitSlot = (
  windows: Map<string, RateLimitWindow>,
  key: string,
  limit: number,
  windowMs: number,
  maxEntries = DEFAULT_RATE_LIMIT_MAX_ENTRIES,
  now = Date.now()
): boolean => {
  const existing = windows.get(key);
  if (existing === undefined || existing.resetAt <= now) {
    const boundedMaxEntries = Math.max(1, maxEntries);
    if (windows.size >= boundedMaxEntries) {
      pruneExpiredWindows(windows, now);
    }
    if (windows.size >= boundedMaxEntries) {
      evictOldestWindows(windows, boundedMaxEntries);
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
};
