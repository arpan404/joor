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
    ctx: JoorContext<TServices, THeaders, Record<string, never>, Record<string, never>>
  ): MaybePromise<TAuth | ProcedureFailure<string>>;
}

export const createAuthPolicy = <
  TServices extends object,
  THeaders extends object,
  TAuth extends object,
>(
  policy: AuthPolicy<TServices, THeaders, TAuth>
): AuthPolicy<TServices, THeaders, TAuth> => policy;
