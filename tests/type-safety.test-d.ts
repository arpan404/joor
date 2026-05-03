import {
  createPlugin,
  defineConfig,
  defineProcedure,
  t,
  type JoorConfigContext,
  type ProcedureInput,
  type ProcedureOutput,
  type ProcedureResponseHeaders,
} from '../src/index.js';
import { createClient } from '../src/rpc/client.js';

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

const config = defineConfig({ plugins: [usersPlugin] as const });
type Services = JoorConfigContext<typeof config>;

const procedure = defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string()),
    'x-tenant-id': t.string(),
  }),
  output: t.object({ id: t.string(), name: t.string() }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  async handler(ctx, input) {
    ctx.headers['x-tenant-id'].toUpperCase();
    ctx.headers.authorization?.toUpperCase();
    const user = ctx.services.users.findById(input.id);
    return ctx.ok(user, { 'cache-control': 'private' });
  },
});

const validInput: ProcedureInput<typeof procedure> = { id: '1' };
validInput.id.toUpperCase();

// @ts-expect-error id is required and must be a string.
const _invalidInput: ProcedureInput<typeof procedure> = { id: 1 };
_invalidInput;

const validOutput: ProcedureOutput<typeof procedure> = {
  id: '1',
  name: 'Ada',
};
validOutput.name.toUpperCase();

const responseHeaders: ProcedureResponseHeaders<typeof procedure> = {
  'cache-control': 'private',
};
responseHeaders['cache-control'].toUpperCase();

const client = createClient({ url: '/rpc' });
client.call<typeof procedure>(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
// @ts-expect-error x-tenant-id is required by the procedure header schema.
client.call<typeof procedure>('users.get', { id: '1' });

defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  // @ts-expect-error handler output must match the declared output schema.
  async handler(ctx, input) {
    ctx.services.users.findById(input.id);
    return ctx.ok({ missing: 'id' });
  },
});

defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  async handler(ctx, input) {
    input.id.toUpperCase();
    // @ts-expect-error no plugin context is available without withContext().
    ctx.services.users.findById(input.id);
    // @ts-expect-error no typed headers are available unless declared.
    ctx.headers.authorization.toUpperCase();
    return ctx.ok({ id: input.id });
  },
});
