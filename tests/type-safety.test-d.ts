import { defineProcedure, t, type ProcedureInput } from '../src/index.js';

const procedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ ok: t.boolean() }),
  async handler(ctx, input) {
    return ctx.ok({ ok: input.id.length > 0 });
  },
});

const sample: ProcedureInput<typeof procedure> = { id: 'x' };
sample.id.toUpperCase();
