import type {
  AuthPolicy,
  AuthPolicyHeaderValues,
  AuthPolicyResult,
  AuthPolicyResultLike,
} from '../../auth/policy.js';
import type { JoorContext } from '../../context/context.js';

export type AuthResult = AuthPolicyResult<object>;
export type AuthResultLike = AuthPolicyResultLike<object>;

export interface ExecutionState {
  cacheAuth: boolean;
  authCache?: Map<
    AuthPolicy<object, AuthPolicyHeaderValues, object>,
    AuthResultLike
  >;
}

const emptyAuthResult: object = Object.freeze({});

export const uncachedExecutionState: ExecutionState = Object.freeze({
  cacheAuth: false,
});

export const createExecutionState = (cacheAuth = false): ExecutionState => ({
  cacheAuth,
});

const asAuthContext = (
  ctx: JoorContext<object, object, object, object>
): JoorContext<
  object,
  AuthPolicyHeaderValues,
  Record<string, never>,
  Record<string, never>
> =>
  ctx as JoorContext<
    object,
    AuthPolicyHeaderValues,
    Record<string, never>,
    Record<string, never>
  >;

export const authenticateOnce = (
  policy: AuthPolicy<object, AuthPolicyHeaderValues, object> | undefined,
  ctx: JoorContext<object, object, object, object>,
  state: ExecutionState
): AuthResultLike => {
  if (policy === undefined) return emptyAuthResult;
  if (!state.cacheAuth) {
    return policy.authenticate(asAuthContext(ctx));
  }
  state.authCache ??= new Map();
  const cached = state.authCache.get(policy);
  if (cached instanceof Promise) return cached;
  if (cached !== undefined) return cached;
  const pending = Promise.resolve(policy.authenticate(asAuthContext(ctx)));
  state.authCache.set(policy, pending);
  return pending.then((resolved) => {
    state.authCache?.set(policy, resolved);
    return resolved;
  });
};

export const authenticateUncached = (
  policy: AuthPolicy<object, AuthPolicyHeaderValues, object> | undefined,
  ctx: JoorContext<object, object, object, object>
): AuthResultLike => {
  if (policy === undefined) return emptyAuthResult;
  return policy.authenticate(asAuthContext(ctx));
};
