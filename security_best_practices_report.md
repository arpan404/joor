# Security Best Practices Report

Date: 2026-05-03

## Remediation Status

All findings in this report have been fixed in the current working tree.

- `bun audit` now reports no vulnerabilities.
- All Fetch-native runtimes enforce a default request body limit and return `PAYLOAD_TOO_LARGE` with HTTP `413`.
- Default procedure cache keys now include input, typed headers, and auth context.
- Rate limiting ignores forwarded client identity headers unless `rateLimit.trustProxy` is explicitly enabled.
- In-memory rate-limit and procedure-cache stores are bounded.
- CORS no longer defaults to wildcard origin when enabled without an explicit origin.
- `joor build` warns when runtime safety checks are disabled or wildcard CORS is configured.

## Executive Summary

The initial scan found no committed production secrets and no dynamic code evaluation in the runtime path. The highest-risk issues were framework-level defaults that can affect applications built on Joor:

- Some Fetch-native and compiled runtime paths read request bodies without enforcing `maxBodyBytes`.
- Procedure response caching can default to keys that ignore auth and headers, which can leak cached data across users if developers opt into caching without an auth-aware key.
- `bun audit` reports vulnerable `picomatch@2.3.1` in the dev dependency graph.
- Rate limiting trusts client-supplied forwarding headers and stores identities in an unbounded in-memory map.

## Automated Checks

- `bun audit`: passes with no vulnerabilities found after removing the vulnerable dev-tooling dependency path.
- `npm audit --audit-level=low --json`: could not run because the repo has no `package-lock.json`.
- Secret pattern scan: no production-looking secrets found. Matches were limited to demo/test values such as `Bearer benchmark-token`.

## High Severity

### SEC-001: Fetch-native runtime paths lack request body size enforcement

- Rule ID: JOOR-BODY-001
- Severity: High
- Status: Fixed
- Location:
  - `src/runtime/body.ts:11-18`
  - `src/runtime/bun.ts:36-45`
  - `src/runtime/deno.ts:37-45`
  - `src/runtime/compiled.ts:689-694`
- Evidence:
  - `readJsonRequestBody` only enforces size when `maxBodyBytes` is provided.
  - Bun, Deno, and compiled Fetch call `readJsonRequestBody(request)` without a limit.
- Impact: A public endpoint using these runtime paths can be forced to read large request bodies into memory before validation, causing memory or CPU denial of service.
- Fix:
  - Add a shared default body limit for all runtime adapters.
  - Thread `maxBodyBytes` from config/options into Bun, Deno, and compiled Fetch handlers.
  - Return a structured 413-style RPC failure for oversized bodies instead of treating every parse/body error as `{}`.
- Mitigation:
  - Put a reverse proxy or platform limit in front of public deployments until runtime limits are enforced in code.
- False positive notes:
  - Node generic and generic Fetch paths do enforce a default limit; this finding applies to the listed Fetch-native transport/compiled paths.

### SEC-002: Procedure cache keys can omit auth and headers by default

- Rule ID: JOOR-CACHE-001
- Severity: High
- Status: Fixed
- Location:
  - `src/runtime/internal/procedure-cache.ts:44-53`
  - `src/rpc/dispatcher.ts:341-352`
  - `src/rpc/dispatcher.ts:497-509`
  - `README.md:280-296`
- Evidence:
  - If `meta.cache.key` is missing or does not include auth/header fields, `createProcedureCacheKey` falls back to `procedureId + JSON.stringify(input)`.
  - README example recommends `key: ['input.id']` without calling out auth isolation.
- Impact: An authenticated query that returns user-specific data can leak cached responses across users when two users call the same procedure with the same input.
- Fix:
  - Make cache keys include auth identity by default when auth is present, or require explicit `cache.key` for procedures with auth.
  - Add documentation warning that `cache.key` must include auth/tenant/header dimensions for user-specific data.
  - Add tests proving two different auth subjects do not share cached responses by default.
- Mitigation:
  - Avoid `meta.cache` on authenticated or tenant-scoped procedures until cache isolation is explicit.
- False positive notes:
  - Cache is opt-in. This becomes exploitable when an app enables caching on user-specific data without an auth-aware cache key.

### SEC-003: Vulnerable transitive `picomatch@2.3.1` in dev dependency graph

- Rule ID: JOOR-SUPPLY-001
- Severity: High
- Status: Fixed
- Location:
  - `package.json:93-100`
  - `bun.lock:861`
  - `bun.lock:877`
  - `bun.lock:881`
- Evidence:
  - `bun audit` reports:
    - `picomatch <2.3.2` vulnerable to GHSA-3v7f-55p6-f55p.
    - `picomatch <2.3.2` vulnerable to GHSA-c2c7-rcm5-vvqj.
  - `bun pm why picomatch` shows vulnerable `picomatch@2.3.1` under `fast-glob`, `lint-staged`, and `tsc-alias` dependency trees.
- Impact: Glob matching on attacker-controlled patterns can lead to incorrect matching or ReDoS in tooling paths. The vulnerable copy is currently dev/tooling scoped, but it still affects CI and local developer workflows.
- Fix:
  - Refresh/upgrade dependency tree so `picomatch` resolves to a patched version.
  - Prefer direct tooling upgrades first: `tsc-alias`, `lint-staged`, and any glob stack dependencies.
  - Re-run `bun audit` after the lockfile changes.
- Mitigation:
  - Do not pass untrusted glob patterns to dev tooling or compiler inputs.
- False positive notes:
  - Runtime package exports do not expose `picomatch`; this is currently a supply-chain/tooling risk, not a direct published runtime dependency risk.

## Medium Severity

### SEC-004: Rate limiting trusts spoofable forwarding headers

- Rule ID: JOOR-RATELIMIT-001
- Severity: Medium
- Status: Fixed
- Location:
  - `src/runtime/internal/rate-limit.ts:8-17`
- Evidence:
  - Rate-limit identity uses `x-forwarded-for` or `cf-connecting-ip` directly.
- Impact: On deployments where the edge/proxy does not strip or overwrite these headers, clients can spoof identity per request and bypass rate limits.
- Fix:
  - Add a configurable `clientIp` or `rateLimit.identity` resolver.
  - Only trust forwarding headers when an explicit `trustProxy`/trusted-edge option is enabled.
  - Use runtime-native peer address when available, especially in Node.
- Mitigation:
  - Ensure proxies strip incoming `X-Forwarded-For` and set the trusted value themselves.
- False positive notes:
  - This is safe behind a correctly configured trusted proxy/CDN, but that assumption is not encoded in the framework API.

### SEC-005: Rate-limit and cache maps are unbounded

- Rule ID: JOOR-MEMORY-001
- Severity: Medium
- Status: Fixed
- Location:
  - `src/runtime/internal/rate-limit.ts:19-34`
  - `src/runtime/internal/procedure-cache.ts:67-93`
- Evidence:
  - In-memory rate-limit and procedure-cache stores have no maximum entry count or periodic sweep.
- Impact: Attackers can generate many identities or cache keys to grow memory until process pressure or crash.
- Fix:
  - Add bounded LRU/TTL stores with maximum entry counts.
  - Periodically sweep expired windows/cache entries.
  - Expose production storage adapters for distributed environments.
- Mitigation:
  - Keep these in-memory features for development/single-node use only until bounded stores exist.

### SEC-006: CORS helper defaults to wildcard origin when CORS is enabled without an explicit origin

- Rule ID: JOOR-CORS-001
- Severity: Medium
- Status: Fixed
- Location:
  - `src/rpc/dispatcher.ts:114-124`
  - `examples/ai-native-backend/joor.config.ts:54-56`
- Evidence:
  - `options.cors.origin ?? '*'`
  - Example config sets `origin: '*'`.
- Impact: Browser-based clients from any origin can call RPC endpoints when CORS is enabled. This is especially risky if an app later adds cookie-based auth or exposes sensitive bearer tokens to browser code.
- Fix:
  - Require explicit origin allowlists for production examples/docs.
  - Add an optional origin predicate.
  - Document that wildcard CORS is only safe for public, non-cookie APIs.
- Mitigation:
  - Keep `Access-Control-Allow-Credentials` unset unless strict origin checking is implemented.

## Low Severity / Informational

### SEC-007: Trusted performance profile disables runtime safety checks

- Rule ID: JOOR-TRUSTED-001
- Severity: Low
- Status: Fixed with build warnings and documentation
- Location:
  - `examples/ai-native-backend/joor.trusted.config.ts:4-12`
  - `README.md:299-310`
- Evidence:
  - Trusted config disables header/input/output/response-header validation and rate limiting.
- Impact: This is intentional for trusted internal edges, but users may copy it into internet-facing deployments and lose core protections.
- Fix:
  - Add stronger naming and docs: `trusted-internal-only`.
  - Emit a build warning when trusted flags are disabled and `NODE_ENV=production`.
- Mitigation:
  - Keep trusted builds behind an authenticated gateway that validates payloads and enforces abuse limits.

### SEC-008: Compiler intentionally executes config and procedure files at build time

- Rule ID: JOOR-BUILD-001
- Severity: Low
- Status: Fixed with documentation
- Location:
  - `src/compiler/config.ts:24-32`
  - `src/compiler/load.ts:22-40`
- Evidence:
  - Build loads config and procedure modules using dynamic `import()`.
- Impact: Running `joor build` on untrusted projects executes arbitrary code from that project.
- Fix:
  - Document this as an explicit trust boundary.
  - Avoid running the compiler against untrusted repos in CI.
- False positive notes:
  - This is normal for many framework compilers and not a runtime vulnerability.

## Positive Findings

- No `eval`, `new Function`, or dynamic runtime code generation found in `src/`.
- Generic Fetch and Node request paths include body-size limits.
- Runtime input validation exists and is enabled by default in the safe profile.
- TypeScript/Biome gates are strict and currently pass.
- `.env*` files are ignored, and the scan did not find production-looking secrets.

## Fixes Applied

1. Enforced `maxBodyBytes` across Bun, Deno, compiled Fetch, Node, and transport adapters.
2. Fixed cache isolation defaults for authenticated and header-scoped procedures.
3. Removed vulnerable `picomatch@2.3.1` dependency paths by dropping unused glob/build tooling.
4. Added explicit trusted-proxy and identity resolver support for rate limiting.
5. Added bounded stores for rate-limit and cache state.
6. Tightened CORS defaults/examples and added build warnings for trusted profile flags.
