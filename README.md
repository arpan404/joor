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
  cors: { origin: '*' },
});

type AppContext = JoorConfigContext<typeof config>;

export const procedure = defineProcedure.withContext<AppContext>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string().min(1)),
    'x-tenant-id': t.string().min(1),
  }),
  output: t.object({ id: t.string(), name: t.string() }),
  async handler(ctx, input) {
    ctx.headers['x-tenant-id'];
    ctx.headers.authorization;
    ctx.rawHeaders.get('authorization');
    return ctx.ok(ctx.services.users.findById(input.id));
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
  openapi.json
  ai-docs.json
```

Use the generated Fetch dispatcher:

```ts
import { fetch } from './.joor/dispatcher.js';

export default { fetch };
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

Fetch is the base runtime. The package also exposes small adapters for Node, Bun, Deno, Cloudflare Workers, Vercel, and Netlify.

## Typed Headers

Procedures can declare headers with the same schema DSL used for input/output. Header names are normalized to lowercase before validation, so HTTP names like `X-Tenant-Id` are declared as `'x-tenant-id'`.

```ts
export default defineProcedure({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string()),
    'x-tenant-id': t.string(),
  }),
  output: t.object({ id: t.string(), tenantId: t.string() }),
  async handler(ctx, input) {
    return ctx.ok({
      id: input.id,
      tenantId: ctx.headers['x-tenant-id'],
    });
  },
});
```

`ctx.headers` is the typed, validated object. `ctx.rawHeaders` is the original Fetch `Headers` instance for lower-level access.

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
