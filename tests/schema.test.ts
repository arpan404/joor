import { describe, expect, it } from 'vitest';
import { t } from '../src/schema/builder.js';
import { toJsonSchema } from '../src/schema/openapi.js';
import { validate } from '../src/schema/validate.js';

describe('schema', () => {
  it('validates object schemas', () => {
    const schema = t
      .object({
        id: t.string().uuid(),
        count: t.number().int().gte(1),
        active: t.boolean().optional(),
      })
      .strict();

    const result = validate(schema, {
      id: '550e8400-e29b-41d4-a716-446655440000',
      count: 2,
    });

    expect(result.ok).toBe(true);
  });

  it('rejects invalid shapes', () => {
    const result = validate(t.object({ name: t.string() }), { name: 1 });

    expect(result.ok).toBe(false);
  });

  it('emits json schema', () => {
    const schema = toJsonSchema(t.object({ id: t.string() }));

    expect(schema['type']).toBe('object');
  });
});
