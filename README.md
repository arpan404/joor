# Joor

Joor is a Fetch-native, AOT-generated, type-safe RPC backend framework for AI-native TypeScript systems.

The first vertical slice is intentionally small and strict:

- file-routed procedures with one `*.rpc.ts` file per operation
- ahead-of-time manifest, dispatcher, typed client, OpenAPI JSON, and AI docs JSON
- O(1) procedure dispatch through generated manifest lookup
- unary RPC, batch RPC, and typed SSE streaming
- Joor-owned schema DSL with interpreted validation and OpenAPI conversion
- layered typed context through plugins
- Biome lint, oxfmt formatting, strict `tsc`, and Vitest

## Quickstart

Create a procedure:

```ts
import { defineProcedure, t } from 'joor';

export default defineProcedure({
  input: t.object({
    id: t.string().uuid(),
  }),
  output: t.object({
    id: t.string(),
    name: t.string(),
  }),
  errors: {
    NOT_FOUND: t.object({
      message: t.string(),
    }),
  },
  meta: {
    summary: 'Get a user',
    tags: ['users'],
  },
  async handler(ctx, input) {
    const user = await ctx.services.users.findById(input.id);
    if (!user) {
      return ctx.error('NOT_FOUND', { message: 'User not found' });
    }
    return ctx.ok(user);
  },
});
```

For plugin-provided services, define app config and bind the generated context type:

```ts
import {
  createPlugin,
  defineConfig,
  defineProcedure,
  t,
  type JoorConfigContext,
} from 'joor';

const usersPlugin = createPlugin({
  name: 'users',
  setup() {
    return {
      users: {
        findById(id: string) {
          return { id, name: 'Ada' };
        },
      },
    };
  },
});

const config = defineConfig({
  entry: './rpc',
  outDir: './.joor',
  plugins: [usersPlugin] as const,
  cors: { origin: 'http://localhost:3000' },
});

type AppContext = JoorConfigContext<typeof config>;

export const procedure = defineProcedure.withContext<AppContext>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string().min(1)),
    'x-tenant-id': t.string().min(1),
  }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  output: t.object({ id: t.string(), name: t.string() }),
  async handler(ctx, input) {
    ctx.headers['x-tenant-id'];
    ctx.headers.authorization;
    ctx.rawHeaders.get('authorization');
    return ctx.ok(ctx.services.users.findById(input.id), {
      'cache-control': 'private, max-age=60',
    });
  },
});
```

Build generated artifacts:

```bash
npm run joor -- build --entry ./rpc --out ./.joor
```

Or use config:

```bash
npm run joor -- build --config ./joor.config.ts
```

Generated output:

```txt
.joor/
  manifest.ts
  dispatcher.ts
  client.ts
  fetch.ts
  cloudflare.ts
  next.ts
  vercel.ts
  netlify.ts
  node.ts
  bun.ts
  deno.ts
  openapi.json
  ai-docs.json
```

Use the generated Fetch dispatcher:

```ts
import { fetch } from './.joor/dispatcher.js';

export default { fetch };
```

Or use a generated platform entrypoint directly:

```ts
// Cloudflare Workers
export { default } from './.joor/cloudflare.js';

// Next.js App Router
export { GET, POST, OPTIONS } from './.joor/next.js';

// Vercel Functions
export { default } from './.joor/vercel.js';

// Netlify Edge Functions
export { default } from './.joor/netlify.js';
```

Use the generated typed client:

```ts
import { client } from './.joor/client.js';

const result = await client.users.get({
  id: '550e8400-e29b-41d4-a716-446655440000',
});

if (result.ok) {
  result.data.name;
} else {
  result.error.code;
}
```

## RPC Model

All RPC calls go through:

```txt
POST /rpc
```

The dispatcher accepts a single request or a batch. Streaming procedures use the same endpoint with `Accept: text/event-stream` and emit `data`, `error`, and `done` SSE events.

Procedure ids are derived from file paths:

```txt
rpc/users/get.rpc.ts -> users.get
rpc/users/watch.rpc.ts -> users.watch
rpc/admin/users/list.rpc.ts -> admin.users.list
```

## CLI

```bash
npm run joor -- build
npm run joor -- dev
npm run joor -- typecheck
npm run joor -- openapi
npm run joor -- doctor
```

`build` emits `.joor/` artifacts, `dev` watches and rebuilds, `openapi` refreshes docs output, and `doctor` runs format, lint, tests, and package build.

## Runtime Options

`createJoorHandler` accepts:

- `plugins` for typed context services
- `path` to move the RPC endpoint away from `/rpc`
- `cors` for preflight and response headers
- `maxBodyBytes` for request body limits
- `onError` for runtime diagnostics

Fetch is the base runtime. The package also exposes small adapters for Node, Express, Fastify, Elysia, Hono, Koa, Bun, Deno, AWS Lambda HTTP API, Cloudflare Workers, Next.js, Vercel, and Netlify.
Custom adapters can reuse `joor/runtime/body` for JSON body limits and `joor/runtime/response` for serialized envelope and `Response` conversion helpers.

Platform helpers expose typed deployment shapes when you do not use generated entrypoints: `createCloudflareWorker()` returns a Worker object, `createCloudflareWorkerFor<Env, Context, Request>()` preserves typed Worker bindings, `createNextRouteHandlers()` returns App Router method exports, `createNextRouteHandlersFor<Context, Request>()` preserves App Router context and extended request types, `createVercelFunction()` returns a fetch object, `createNetlifyEdgeFunction()` returns a Netlify Edge handler, and `createNetlifyEdgeFunctionFor<Context, Request>()` preserves the Netlify context object. Framework adapters also provide typed factory forms such as `createJoorHandlerFor<Request>()`, `createBunFetchFor<Request>()`, `createDenoFetchFor<Request>()`, `createCloudflareFetchFor<Request>()`, `createVercelFetchFor<Request>()`, `createNetlifyFetchFor<Request>()`, `createAwsLambdaHandlerFor<Event>()`, `createNodeRpcRequestHandlerFor<Incoming, Outgoing>()`, `createExpressHandlerFor<Request, Response>()`, `createFastifyHandlerFor<Request, Reply>()`, `createKoaHandlerFor<Context>()`, `createHonoHandlerFor<Context>()`, and `createElysiaHandlerFor<Context>()` for apps with extended runtime event or framework context types.
Route-specific adapter factories narrow the accepted RPC body shape when a deployment surface only handles unary or streaming routes. Use `createRouteUnary*`/`createUnaryRoute*` for unary-only handlers and `createRouteStream*`/`createStreamRoute*` for stream-only handlers across Fetch, Bun, Deno, Node, AWS Lambda, Cloudflare, Next.js, Vercel, Netlify, Express, Fastify, Elysia, Hono, and Koa. Serve/listen helpers follow the same naming: `serveRouteUnaryBun()`, `serveRouteStreamDeno()`, `listenRouteUnary()`, and their route-first aliases preserve route-specific hooks, middleware bodies, plugin services, and extended request or platform context types.
Low-level RPC helpers expose the same pattern through `createRpcHandlerFor<Request>()`, `createRpcBodyHandlerFor<Request>()`, and `createRpcBodyResultHandlerFor<Request>()`.
Compiled runtime helpers mirror the same request typing with `createCompiledRpcHandlerFor<Request>()`, `createCompiledRouteUnaryRpcHandlerFor<Request>()`, `createCompiledRouteStreamRpcHandlerFor<Request>()`, `createDenoCompiledTransportRequestHandlerFor<Request>()`, `createRouteUnaryDenoCompiledTransportRequestHandlerFor<Request>()`, and `createRouteStreamDenoCompiledTransportRequestHandlerFor<Request>()`.
Generated native dispatcher, Bun, Deno, Node, Cloudflare, Next.js, Vercel, and Netlify entrypoints also export typed factory helpers such as `createFetchFor<Request>()`, `createRouteUnaryFetchFor<Request>()`, `.joor/node`'s `createHandler<Incoming, Outgoing>()`, `.joor/cloudflare`'s `createRouteUnaryWorkerFor<Env, Context, Request>()`, and `.joor/next`'s `createRouteStreamHandlersFor<Context, Request>()` so generated handlers can preserve extended request types while keeping route-first naming available in generated code.
Clients can also keep custom request types by pairing `ClientFetch<Request>()` with a matching `createRequest` factory, so the client transport never widens a typed fetch back to a plain `Request`.

## Next.js API Routes

For the Next.js App Router, create `app/api/rpc/route.ts` and export handlers from the generated manifest:

```ts
import { createNextRouteHandlers } from 'joor/runtime/next';
import config from '../../../joor.config';
import { manifest } from '../../../.joor/manifest';

const handlers = createNextRouteHandlers(manifest, {
  ...config,
  path: '/api/rpc',
});

export const runtime = 'edge';
export const { GET, POST, OPTIONS } = handlers;
```

The adapter is Fetch-native, so it works with both Edge-compatible route handlers and standard App Router `Request`/`Response` APIs.

For dynamic App Router segments, use the typed factory form to preserve the route context shape. The same factory can take a second generic for extended `Request` subtypes:

```ts
import {
  createNextRouteHandlersFor,
  type NextRouteContext,
} from 'joor/runtime/next';

type Params = { team: string };

const createHandlers = createNextRouteHandlersFor<NextRouteContext<Params>>();
const { GET, POST, OPTIONS } = createHandlers(manifest, {
  ...config,
  path: '/teams/[team]/rpc',
});

type AppRequest = Request & { requestId: string };

const createTypedHandlers = createNextRouteHandlersFor<
  NextRouteContext<Params>,
  AppRequest
>();
```

## Typed Headers

Procedures can declare request and response headers with the same schema DSL used for input/output. Request header names are normalized to lowercase before validation, so HTTP names like `X-Tenant-Id` are declared as `'x-tenant-id'`.
Header schemas must be objects with string-like values (`t.string()`, `t.enum(...)`, string `t.literal(...)`, or optional versions of those), matching the values HTTP transports can read and emit.

```ts
export default defineProcedure({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string()),
    'x-tenant-id': t.string(),
  }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  output: t.object({ id: t.string(), tenantId: t.string() }),
  async handler(ctx, input) {
    return ctx.ok(
      {
        id: input.id,
        tenantId: ctx.headers['x-tenant-id'],
      },
      { 'cache-control': 'private' }
    );
  },
});
```

`ctx.headers` is the typed, validated request header object. `ctx.rawHeaders` is the original Fetch `Headers` instance for lower-level access. Declared response headers are validated before a success envelope is returned, included on the success envelope, and attached to the HTTP response for single unary calls.

## Auth, Hooks, and Limits

Auth policies are typed and procedure-local. A successful policy return value becomes `ctx.auth`; a `ctx.error(...)` return short-circuits the procedure.

```ts
import { createAuthPolicy, defineProcedure, t } from 'joor';

const sessionAuth = createAuthPolicy<
  { users: { findByToken(token: string): { id: string } | null } },
  { authorization: string },
  { userId: string }
>({
  name: 'session',
  authenticate(ctx) {
    const token = ctx.headers.authorization;
    const user = ctx.services.users.findByToken(token);
    if (user === null) {
      return ctx.error('UNAUTHORIZED', { message: 'Unauthorized' });
    }
    return { userId: user.id };
  },
});

export default defineProcedure({
  input: t.object({ ok: t.boolean() }),
  headers: t.object({ authorization: t.string() }),
  output: t.object({ userId: t.string() }),
  auth: sessionAuth,
  meta: {
    rateLimit: { limit: 60, window: '1m' },
  },
  async handler(ctx) {
    return ctx.ok({ userId: ctx.auth.userId });
  },
});
```

`createJoorHandler` also accepts `hooks` and `middleware` with `beforeRequest`/`afterResponse` callbacks. `meta.rateLimit` is enforced by the runtime with a bounded in-memory window. Forwarded client IP headers are ignored by default; enable `rateLimit.trustProxy` only behind a proxy that strips and rewrites those headers.

Query procedures can also opt into in-memory response caching:

```ts
export default defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string(), name: t.string() }),
  meta: {
    kind: 'query',
    cache: {
      ttl: '30s',
      key: ['input.id'],
    },
  },
  async handler(ctx, input) {
    return ctx.ok(await ctx.services.users.findById(input.id));
  },
});
```

Default cache keys include input, typed request headers, and auth context. If you provide `cache.key`, include every tenant/user dimension that can affect the response, such as `auth.subject` or `headers.x-tenant-id`.

## Security Defaults

All runtime adapters enforce `maxBodyBytes` by default. Oversized request bodies return a `PAYLOAD_TOO_LARGE` RPC error with HTTP status `413`.

CORS is disabled unless `cors` is configured. Enabling CORS without an explicit `origin` does not emit `Access-Control-Allow-Origin`; use a concrete origin or intentionally configure your own gateway policy.

`joor build` imports config and procedure files to inspect them, so run the compiler only for code you trust. The compiler warns when generated runtime safety checks are disabled or when wildcard CORS is configured.

## Performance Knobs

The default runtime validates request headers, input, output, response headers, and rate limits. For trusted internal edges or benchmark runs, these can be disabled independently:

```ts
createJoorHandler(manifest, {
  validateHeaders: false,
  validateInput: false,
  validateOutput: false,
  validateResponseHeaders: false,
  enforceRateLimit: false,
});
```

The Node runtime also has a parsed-body fast path so it does not need to read the same body twice.

`joor build` emits an AOT dispatcher that imports each procedure directly and switches on literal procedure ids. That keeps generated apps off the generic manifest lookup path while preserving the same envelopes, validation, auth, streaming, and plugin behavior.

## Development

```bash
npm run format:check
npm run lint
npm run test
npm run build
```

`npm run lint` runs Biome and strict TypeScript. `npm run format` formats the repository with oxfmt.

## Status

Joor is pre-release. The current implementation is the safe RPC foundation: schema validation, procedure definition, compiler output, Fetch runtime, typed client, OpenAPI, and AI-readable docs.

## License

MIT. See [LICENSE.md](./LICENSE.md).
