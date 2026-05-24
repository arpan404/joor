import type { JoorContext } from '../context/context.js';
import type { ProcedureFailure } from '../procedure/result.js';
import type { MaybePromise } from '../procedure/types.js';
import type { JsonValue } from '../schema/json.js';

export type AuthPolicyHeaderValues = Record<string, string | undefined>;

export type AuthPolicyResult<TAuth extends object> =
  | TAuth
  | ProcedureFailure<string>;

export type AuthPolicyResultLike<TAuth extends object> = MaybePromise<
  AuthPolicyResult<TAuth>
>;

export interface AuthPolicy<
  TServices extends object,
  THeaders extends AuthPolicyHeaderValues,
  TAuth extends object,
  TRequest extends Request = Request,
> {
  name: string;
  readonly __requestType?: (request: TRequest) => TRequest;
  authenticate(
    ctx: JoorContext<
      TServices,
      THeaders,
      Record<string, never>,
      Record<string, never>,
      Record<string, JsonValue>,
      TRequest
    >
  ): AuthPolicyResultLike<TAuth>;
}

export type AuthPolicyServices<TPolicy> =
  TPolicy extends AuthPolicy<
    infer TServices,
    infer _THeaders,
    infer _TAuth,
    infer _TRequest extends Request
  >
    ? TServices
    : never;

export type AuthPolicyHeaders<TPolicy> =
  TPolicy extends AuthPolicy<
    infer _TServices,
    infer THeaders,
    infer _TAuth,
    infer _TRequest extends Request
  >
    ? THeaders
    : never;

export type AuthPolicyAuth<TPolicy> =
  TPolicy extends AuthPolicy<
    infer _TServices,
    infer _THeaders,
    infer TAuth,
    infer _TRequest extends Request
  >
    ? TAuth
    : never;

export type AuthPolicyRequest<TPolicy> =
  TPolicy extends AuthPolicy<
    infer _TServices,
    infer _THeaders,
    infer _TAuth,
    infer TRequest
  >
    ? TRequest
    : never;

export type DefineContextAuthPolicy<
  TServices extends object,
  TRequest extends Request = Request,
> = <
  THeaders extends AuthPolicyHeaderValues,
  TAuth extends object,
>(
  policy: AuthPolicy<TServices, THeaders, TAuth, TRequest>
) => AuthPolicy<TServices, THeaders, TAuth, TRequest>;

export interface DefineAuthPolicy {
  <
    TServices extends object,
    THeaders extends AuthPolicyHeaderValues,
    TAuth extends object,
    TRequest extends Request = Request,
  >(
    policy: AuthPolicy<TServices, THeaders, TAuth, TRequest>
  ): AuthPolicy<TServices, THeaders, TAuth, TRequest>;
  withContext<
    TNextServices extends object,
    TNextRequest extends Request = Request,
  >(): DefineContextAuthPolicy<TNextServices, TNextRequest>;
}

const createDefineAuthPolicy = (): DefineAuthPolicy => {
  const define = <
    TServices extends object,
    THeaders extends AuthPolicyHeaderValues,
    TAuth extends object,
    TRequest extends Request = Request,
  >(
    policy: AuthPolicy<TServices, THeaders, TAuth, TRequest>
  ): AuthPolicy<TServices, THeaders, TAuth, TRequest> => policy;
  return Object.assign(define, {
    withContext<TNextServices extends object, TNextRequest extends Request = Request>() {
      return <THeaders extends AuthPolicyHeaderValues, TAuth extends object>(
        policy: AuthPolicy<TNextServices, THeaders, TAuth, TNextRequest>
      ): AuthPolicy<TNextServices, THeaders, TAuth, TNextRequest> => policy;
    },
  });
};

export const createAuthPolicy = createDefineAuthPolicy();
