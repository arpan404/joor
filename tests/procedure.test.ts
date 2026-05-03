import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  createPlugin,
  defineConfig,
  defineProcedure,
  t,
  type JoorConfigContext,
  type ProcedureInput,
} from '../src/index.js';

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

  it('types plugin services through context', () => {
    const plugin = createPlugin({
      name: 'math',
      setup() {
        return {
          math: {
            double(value: number) {
              return value * 2;
            },
          },
        };
      },
    });
    const config = defineConfig({ plugins: [plugin] as const });
    type Services = JoorConfigContext<typeof config>;

    defineProcedure.withContext<Services>()({
      input: t.object({ count: t.number().int() }),
      output: t.object({ count: t.number().int() }),
      async handler(ctx, input) {
        expectTypeOf(ctx.services.math.double).toEqualTypeOf<
          (value: number) => number
        >();
        return ctx.ok({ count: ctx.services.math.double(input.count) });
      },
    });
  });
});
