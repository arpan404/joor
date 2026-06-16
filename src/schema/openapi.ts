import type { JsonObject, JsonValue } from './json.js';
import type { Schema } from './types.js';

export type OpenApiSchema = Readonly<JsonObject>;

type MutableJsonObject = Record<string, JsonValue>;

const withMeta = (schema: JsonObject, source: Schema): JsonObject => {
  const next: MutableJsonObject = { ...schema };
  if (source.meta.description !== undefined)
    next['description'] = source.meta.description;
  if (source.meta.example !== undefined) next['example'] = source.meta.example;
  if (source.meta.default !== undefined) next['default'] = source.meta.default;
  return next;
};

export const toJsonSchema = (schema: Schema): OpenApiSchema => {
  switch (schema.kind) {
    case 'string': {
      const output: MutableJsonObject = { type: 'string' };
      if (schema.minLength !== undefined)
        output['minLength'] = schema.minLength;
      if (schema.maxLength !== undefined)
        output['maxLength'] = schema.maxLength;
      if (schema.format !== undefined) output['format'] = schema.format;
      return withMeta(output, schema);
    }
    case 'number': {
      const output: MutableJsonObject = {
        type: schema.integer === true ? 'integer' : 'number',
      };
      if (schema.minimum !== undefined) output['minimum'] = schema.minimum;
      if (schema.maximum !== undefined) output['maximum'] = schema.maximum;
      return withMeta(output, schema);
    }
    case 'boolean':
      return withMeta({ type: 'boolean' }, schema);
    case 'literal':
      return withMeta({ const: schema.value }, schema);
    case 'enum':
      return withMeta(
        { type: 'string', enum: [...schema.values] as JsonValue[] },
        schema
      );
    case 'array': {
      const output: MutableJsonObject = {
        type: 'array',
        items: toJsonSchema(schema.item),
      };
      if (schema.minItems !== undefined) output['minItems'] = schema.minItems;
      if (schema.maxItems !== undefined) output['maxItems'] = schema.maxItems;
      return withMeta(output, schema);
    }
    case 'object': {
      const properties: MutableJsonObject = {};
      const required: JsonValue[] = [];
      for (const [key, child] of Object.entries(schema.shape)) {
        const propertySchema = child.kind === 'optional' ? child.inner : child;
        properties[key] = toJsonSchema(propertySchema);
        if (child.kind !== 'optional') required.push(key);
      }
      const output: MutableJsonObject = {
        type: 'object',
        properties,
        additionalProperties: !schema.strictObject,
      };
      if (required.length > 0) output['required'] = required;
      return withMeta(output, schema);
    }
    case 'optional':
      return toJsonSchema(schema.inner);
    case 'nullable':
      return withMeta(
        { anyOf: [toJsonSchema(schema.inner), { type: 'null' }] },
        schema
      );
    case 'union':
      return withMeta(
        { anyOf: schema.variants.map((variant) => toJsonSchema(variant)) },
        schema
      );
    case 'record':
      return withMeta(
        { type: 'object', additionalProperties: toJsonSchema(schema.value) },
        schema
      );
    case 'json':
      return withMeta({}, schema);
  }
};
