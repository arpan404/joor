import type { AuthPolicy } from '../../auth/policy.js';
import type { JoorContext } from '../../context/context.js';
import type { ProcedureFailure } from '../../procedure/result.js';

export type AuthResult = object | ProcedureFailure<string>;
export type AuthResultLike = AuthResult | Promise<AuthResult>;

export interface ExecutionState {
  cacheAuth: boolean;
  authCache?: Map<AuthPolicy<object, object, object>, AuthResultLike>;
}

const emptyAuthResult: object = Object.freeze({});

export const uncachedExecutionState: ExecutionState = Object.freeze({
  cacheAuth: false,
});

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
  if (policy === undefined) return emptyAuthResult;
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
