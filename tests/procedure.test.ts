import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineProcedure, t, type ProcedureInput } from '../src/index.js';

describe('procedure', () => {
  it('preserves input inference', () => {
    const procedure = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx, input) {
        expectTypeOf(input.id).toEqualTypeOf<string>();
        return ctx.ok({ ok: true });
      },
    });

    const sample: ProcedureInput<typeof procedure> = { id: 'x' };
    expectTypeOf(sample.id).toEqualTypeOf<string>();
    expect(procedure.meta).toEqual({});
  });
});
