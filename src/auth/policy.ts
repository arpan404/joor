import type { JoorContext } from '../context/context.js';
import type { ProcedureFailure } from '../procedure/result.js';
import type { MaybePromise } from '../procedure/types.js';

export interface AuthPolicy<
  TServices extends object,
  THeaders extends object,
  TAuth extends object,
> {
  name: string;
  authenticate(
    ctx: JoorContext<
      TServices,
      THeaders,
      Record<string, never>,
      Record<string, never>
    >
  ): MaybePromise<TAuth | ProcedureFailure<string>>;
}

export type AuthPolicyServices<TPolicy> =
  TPolicy extends AuthPolicy<infer TServices, object, object>
    ? TServices
    : never;

export type AuthPolicyHeaders<TPolicy> =
  TPolicy extends AuthPolicy<object, infer THeaders, object> ? THeaders : never;

export type AuthPolicyAuth<TPolicy> =
  TPolicy extends AuthPolicy<object, object, infer TAuth> ? TAuth : never;

export type DefineContextAuthPolicy<TServices extends object> = <
  THeaders extends object,
  TAuth extends object,
>(
  policy: AuthPolicy<TServices, THeaders, TAuth>
) => AuthPolicy<TServices, THeaders, TAuth>;

export interface DefineAuthPolicy {
  <TServices extends object, THeaders extends object, TAuth extends object>(
    policy: AuthPolicy<TServices, THeaders, TAuth>
  ): AuthPolicy<TServices, THeaders, TAuth>;
  withContext<
    TNextServices extends object,
  >(): DefineContextAuthPolicy<TNextServices>;
}

const createDefineAuthPolicy = (): DefineAuthPolicy => {
  const define = <
    TServices extends object,
    THeaders extends object,
    TAuth extends object,
  >(
    policy: AuthPolicy<TServices, THeaders, TAuth>
  ): AuthPolicy<TServices, THeaders, TAuth> => policy;
  return Object.assign(define, {
    withContext<TNextServices extends object>() {
      return <THeaders extends object, TAuth extends object>(
        policy: AuthPolicy<TNextServices, THeaders, TAuth>
      ): AuthPolicy<TNextServices, THeaders, TAuth> => policy;
    },
  });
};

export const createAuthPolicy = createDefineAuthPolicy();
