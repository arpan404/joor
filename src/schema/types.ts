import type { JsonValue } from './json.js';

export interface SchemaMeta {
  description?: string;
  example?: JsonValue;
  default?: JsonValue;
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface BaseSchema<TValue> {
  readonly kind: string;
  readonly meta: SchemaMeta;
  readonly type?: TValue;
}

export interface StringSchema extends BaseSchema<string> {
  readonly kind: 'string';
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly format?: 'email' | 'uuid';
}

export interface NumberSchema extends BaseSchema<number> {
  readonly kind: 'number';
  readonly integer?: boolean;
  readonly minimum?: number;
  readonly maximum?: number;
}

export interface BooleanSchema extends BaseSchema<boolean> {
  readonly kind: 'boolean';
}

export interface LiteralSchema<
  TValue extends JsonValue,
> extends BaseSchema<TValue> {
  readonly kind: 'literal';
  readonly value: TValue;
}

export interface EnumSchema<
  TValue extends readonly string[],
> extends BaseSchema<TValue[number]> {
  readonly kind: 'enum';
  readonly values: TValue;
}

export interface ArraySchema<TItem extends Schema = Schema> extends BaseSchema<
  InferSchema<TItem>[]
> {
  readonly kind: 'array';
  readonly item: TItem;
  readonly minItems?: number;
  readonly maxItems?: number;
}

export interface ObjectSchema<
  TShape extends SchemaShape = SchemaShape,
> extends BaseSchema<InferObject<TShape>> {
  readonly kind: 'object';
  readonly shape: TShape;
  readonly strictObject: boolean;
}

export interface OptionalSchema<
  TInner extends Schema = Schema,
> extends BaseSchema<InferSchema<TInner> | undefined> {
  readonly kind: 'optional';
  readonly inner: TInner;
  readonly optional: true;
}

export interface NullableSchema<
  TInner extends Schema = Schema,
> extends BaseSchema<InferSchema<TInner> | null> {
  readonly kind: 'nullable';
  readonly inner: TInner;
}

export interface UnionSchema<
  TVariants extends readonly Schema[] = readonly Schema[],
> extends BaseSchema<InferSchema<TVariants[number]>> {
  readonly kind: 'union';
  readonly variants: TVariants;
}

export interface RecordSchema<
  TValue extends Schema = Schema,
> extends BaseSchema<Record<string, InferSchema<TValue>>> {
  readonly kind: 'record';
  readonly value: TValue;
}

export interface JsonSchema extends BaseSchema<JsonValue> {
  readonly kind: 'json';
}

export type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | LiteralSchema<JsonValue>
  | EnumSchema<readonly string[]>
  | ArraySchema
  | ObjectSchema
  | OptionalSchema
  | NullableSchema
  | UnionSchema
  | RecordSchema
  | JsonSchema;

export type SchemaShape = Record<string, Schema>;

export type HeaderValueSchema =
  | StringSchema
  | EnumSchema<readonly string[]>
  | LiteralSchema<string>
  | OptionalSchema<HeaderValueSchema>;

export type HeaderSchemaShape = Record<string, HeaderValueSchema>;

export type HeaderObjectSchema = ObjectSchema<HeaderSchemaShape>;

export type InferSchema<TSchema extends Schema> =
  TSchema extends BaseSchema<infer TValue> ? TValue : never;

type RequiredKeys<TShape extends SchemaShape> = {
  [TKey in keyof TShape]: TShape[TKey] extends OptionalSchema ? never : TKey;
}[keyof TShape];

type OptionalKeys<TShape extends SchemaShape> = {
  [TKey in keyof TShape]: TShape[TKey] extends OptionalSchema ? TKey : never;
}[keyof TShape];

export type InferObject<TShape extends SchemaShape> = {
  [TKey in RequiredKeys<TShape>]: InferSchema<TShape[TKey]>;
} & {
  [TKey in OptionalKeys<TShape>]?: TShape[TKey] extends OptionalSchema<
    infer TInner
  >
    ? InferSchema<TInner>
    : never;
};
