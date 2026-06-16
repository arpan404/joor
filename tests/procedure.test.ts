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

  it('freezes procedure definitions and copied metadata', () => {
    const tags = ['users'];
    const auth = ['admin'];
    const cacheKey = ['id'];
    const errors = {
      BAD_REQUEST: t.object({ reason: t.string() }),
    };
    const originalError = errors.BAD_REQUEST;
    const procedure = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ ok: t.boolean() }),
      errors,
      meta: {
        kind: 'query',
        tags,
        auth,
        cache: { ttl: '1m', key: cacheKey },
        rateLimit: { limit: 10, window: '1m' },
      },
      async handler(ctx) {
        return ctx.ok({ ok: true });
      },
    });

    tags.push('mutated');
    auth.push('mutated');
    cacheKey.push('mutated');
    (errors as Record<string, unknown>)['BAD_REQUEST'] = t.object({
      mutated: t.boolean(),
    });

    expect(Object.isFrozen(defineProcedure)).toBe(true);
    expect(Object.isFrozen(defineProcedure.withContext<object>())).toBe(true);
    expect(Object.isFrozen(procedure)).toBe(true);
    expect(Object.isFrozen(procedure.errors)).toBe(true);
    expect(Object.isFrozen(procedure.meta)).toBe(true);
    expect(Object.isFrozen(procedure.meta.tags)).toBe(true);
    expect(Object.isFrozen(procedure.meta.auth)).toBe(true);
    expect(Object.isFrozen(procedure.meta.cache)).toBe(true);
    expect(Object.isFrozen(procedure.meta.cache?.key)).toBe(true);
    expect(Object.isFrozen(procedure.meta.rateLimit)).toBe(true);
    expect(procedure.meta.tags).toEqual(['users']);
    expect(procedure.meta.auth).toEqual(['admin']);
    expect(procedure.meta.cache?.key).toEqual(['id']);
    expect(procedure.errors['BAD_REQUEST']).toBe(originalError);
    expect(() => {
      (procedure as { stream?: unknown }).stream = t.string();
    }).toThrow(TypeError);
  });

  it('allows raw success returns', () => {
    const procedure = defineProcedure({
      input: t.object({ id: t.string() }),
      output: t.object({ ok: t.boolean() }),
      handler(_ctx, input) {
        expectTypeOf(input.id).toEqualTypeOf<string>();
        return { ok: true };
      },
    });

    expect(procedure.output?.kind).toBe('object');
  });

  it('allows contextless procedures', async () => {
    const procedure = defineProcedure({
      context: false,
      input: t.object({ count: t.number().int() }),
      output: t.object({ count: t.number().int() }),
      handler(input) {
        return { count: input.count + 1 };
      },
    });

    const contextlessHandler = procedure.contextlessHandler;
    if (contextlessHandler === undefined) {
      throw new Error('Expected contextless handler');
    }
    const result = await contextlessHandler({ count: 1 });

    expect(result).toEqual({ count: 2 });
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
