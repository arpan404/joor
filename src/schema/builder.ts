import type { JsonValue } from './json.js';
import type {
  ArraySchema,
  BooleanSchema,
  EnumSchema,
  JsonSchema,
  LiteralSchema,
  NullableSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  RecordSchema,
  Schema,
  SchemaMeta,
  SchemaShape,
  StringSchema,
  UnionSchema,
} from './types.js';

interface MetaChain<TSelf> {
  describe(description: string): TSelf;
  example(example: JsonValue): TSelf;
  default(defaultValue: JsonValue): TSelf;
}

export interface StringChain extends StringSchema, MetaChain<StringChain> {
  min(length: number): StringChain;
  max(length: number): StringChain;
  email(): StringChain;
  uuid(): StringChain;
  optional(): OptionalSchema<StringChain>;
  nullable(): NullableSchema<StringChain>;
}

export interface NumberChain extends NumberSchema, MetaChain<NumberChain> {
  int(): NumberChain;
  gte(value: number): NumberChain;
  lte(value: number): NumberChain;
  optional(): OptionalSchema<NumberChain>;
  nullable(): NullableSchema<NumberChain>;
}

export interface BooleanChain extends BooleanSchema, MetaChain<BooleanChain> {
  optional(): OptionalSchema<BooleanChain>;
  nullable(): NullableSchema<BooleanChain>;
}

export interface ArrayChain<TItem extends Schema>
  extends ArraySchema<TItem>, MetaChain<ArrayChain<TItem>> {
  min(length: number): ArrayChain<TItem>;
  max(length: number): ArrayChain<TItem>;
  optional(): OptionalSchema<ArrayChain<TItem>>;
  nullable(): NullableSchema<ArrayChain<TItem>>;
}

export interface ObjectChain<TShape extends SchemaShape>
  extends ObjectSchema<TShape>, MetaChain<ObjectChain<TShape>> {
  strict(): ObjectChain<TShape>;
  optional(): OptionalSchema<ObjectChain<TShape>>;
  nullable(): NullableSchema<ObjectChain<TShape>>;
}

const withMeta = <TSchema extends { readonly meta: SchemaMeta }>(
  schema: TSchema,
  meta: SchemaMeta
): TSchema => ({ ...schema, meta });

const makeOptional = <TInner extends Schema>(
  inner: TInner
): OptionalSchema<TInner> =>
  Object.freeze({ kind: 'optional', inner, optional: true, meta: {} });

const makeNullable = <TInner extends Schema>(
  inner: TInner
): NullableSchema<TInner> =>
  Object.freeze({ kind: 'nullable', inner, meta: {} });

const stringFrom = (base: Omit<StringSchema, 'type'>): StringChain => {
  const schema = {
    ...base,
    min(length: number) {
      return stringFrom({ ...base, minLength: length });
    },
    max(length: number) {
      return stringFrom({ ...base, maxLength: length });
    },
    email() {
      return stringFrom({ ...base, format: 'email' });
    },
    uuid() {
      return stringFrom({ ...base, format: 'uuid' });
    },
    describe(description: string) {
      return stringFrom(withMeta(base, { ...base.meta, description }));
    },
    example(example: JsonValue) {
      return stringFrom(withMeta(base, { ...base.meta, example }));
    },
    default(defaultValue: JsonValue) {
      return stringFrom(
        withMeta(base, { ...base.meta, default: defaultValue })
      );
    },
    optional() {
      return makeOptional(schema);
    },
    nullable() {
      return makeNullable(schema);
    },
  };
  return Object.freeze(schema);
};

const numberFrom = (base: Omit<NumberSchema, 'type'>): NumberChain => {
  const schema = {
    ...base,
    int() {
      return numberFrom({ ...base, integer: true });
    },
    gte(value: number) {
      return numberFrom({ ...base, minimum: value });
    },
    lte(value: number) {
      return numberFrom({ ...base, maximum: value });
    },
    describe(description: string) {
      return numberFrom(withMeta(base, { ...base.meta, description }));
    },
    example(example: JsonValue) {
      return numberFrom(withMeta(base, { ...base.meta, example }));
    },
    default(defaultValue: JsonValue) {
      return numberFrom(
        withMeta(base, { ...base.meta, default: defaultValue })
      );
    },
    optional() {
      return makeOptional(schema);
    },
    nullable() {
      return makeNullable(schema);
    },
  };
  return Object.freeze(schema);
};

const booleanFrom = (base: Omit<BooleanSchema, 'type'>): BooleanChain => {
  const schema = {
    ...base,
    describe(description: string) {
      return booleanFrom(withMeta(base, { ...base.meta, description }));
    },
    example(example: JsonValue) {
      return booleanFrom(withMeta(base, { ...base.meta, example }));
    },
    default(defaultValue: JsonValue) {
      return booleanFrom(
        withMeta(base, { ...base.meta, default: defaultValue })
      );
    },
    optional() {
      return makeOptional(schema);
    },
    nullable() {
      return makeNullable(schema);
    },
  };
  return Object.freeze(schema);
};

const arrayFrom = <TItem extends Schema>(
  base: Omit<ArraySchema<TItem>, 'type'>
): ArrayChain<TItem> => {
  const schema = {
    ...base,
    min(length: number) {
      return arrayFrom({ ...base, minItems: length });
    },
    max(length: number) {
      return arrayFrom({ ...base, maxItems: length });
    },
    describe(description: string) {
      return arrayFrom(withMeta(base, { ...base.meta, description }));
    },
    example(example: JsonValue) {
      return arrayFrom(withMeta(base, { ...base.meta, example }));
    },
    default(defaultValue: JsonValue) {
      return arrayFrom(withMeta(base, { ...base.meta, default: defaultValue }));
    },
    optional() {
      return makeOptional(schema);
    },
    nullable() {
      return makeNullable(schema);
    },
  };
  return Object.freeze(schema);
};

const objectFrom = <TShape extends SchemaShape>(
  base: Omit<ObjectSchema<TShape>, 'type'>
): ObjectChain<TShape> => {
  const schema = {
    ...base,
    strict() {
      return objectFrom({ ...base, strictObject: true });
    },
    describe(description: string) {
      return objectFrom(withMeta(base, { ...base.meta, description }));
    },
    example(example: JsonValue) {
      return objectFrom(withMeta(base, { ...base.meta, example }));
    },
    default(defaultValue: JsonValue) {
      return objectFrom(
        withMeta(base, { ...base.meta, default: defaultValue })
      );
    },
    optional() {
      return makeOptional(schema);
    },
    nullable() {
      return makeNullable(schema);
    },
  };
  return Object.freeze(schema);
};

export const t = {
  string: (): StringChain => stringFrom({ kind: 'string', meta: {} }),
  number: (): NumberChain => numberFrom({ kind: 'number', meta: {} }),
  boolean: (): BooleanChain => booleanFrom({ kind: 'boolean', meta: {} }),
  literal: <TValue extends JsonValue>(value: TValue): LiteralSchema<TValue> =>
    Object.freeze({ kind: 'literal', value, meta: {} }),
  enum: <const TValue extends readonly string[]>(
    values: TValue
  ): EnumSchema<TValue> => Object.freeze({ kind: 'enum', values, meta: {} }),
  array: <TItem extends Schema>(item: TItem): ArrayChain<TItem> =>
    arrayFrom({ kind: 'array', item, meta: {} }),
  object: <TShape extends SchemaShape>(shape: TShape): ObjectChain<TShape> =>
    objectFrom({ kind: 'object', shape, strictObject: false, meta: {} }),
  optional: <TInner extends Schema>(inner: TInner): OptionalSchema<TInner> =>
    makeOptional(inner),
  nullable: <TInner extends Schema>(inner: TInner): NullableSchema<TInner> =>
    makeNullable(inner),
  union: <const TVariants extends readonly Schema[]>(
    variants: TVariants
  ): UnionSchema<TVariants> =>
    Object.freeze({ kind: 'union', variants, meta: {} }),
  record: <TValue extends Schema>(value: TValue): RecordSchema<TValue> =>
    Object.freeze({ kind: 'record', value, meta: {} }),
  json: (): JsonSchema => Object.freeze({ kind: 'json', meta: {} }),
} as const;
