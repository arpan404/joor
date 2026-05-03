import {
  createPlugin,
  defineConfig,
  defineProcedure,
  t,
  type JoorConfigContext,
  type ProcedureInput,
  type ProcedureOutput,
} from '../src/index.js';

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
  output: t.object({ id: t.string(), name: t.string() }),
  async handler(ctx, input) {
    const user = ctx.services.users.findById(input.id);
    return ctx.ok(user);
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
    return ctx.ok({ id: input.id });
  },
});
