import type { JsonValue } from './json.js';
import { isJsonObject } from './json.js';
import type { InferSchema, Schema, ValidationIssue } from './types.js';

export type { ValidationIssue } from './types.js';

export type ValidationResult<TValue> =
  | { ok: true; value: TValue }
  | { ok: false; issues: ValidationIssue[] };

const issue = (path: string, message: string): ValidationIssue => ({
  path,
  message,
});

const childPath = (path: string, key: string): string =>
  path === '' ? key : `${path}.${key}`;

const jsonEquals = (
  left: JsonValue | undefined,
  right: JsonValue | undefined
): boolean => {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((item, index) => jsonEquals(item, right[index]));
  }
  if (left === undefined || right === undefined) return false;
  if (!isJsonObject(left) || !isJsonObject(right)) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) =>
    Object.hasOwn(right, key) ? jsonEquals(left[key], right[key]) : false
  );
};

const validateObject = <TSchema extends Schema>(
  schema: TSchema,
  value: JsonValue | undefined,
  path: string
): ValidationResult<InferSchema<TSchema>> => validate(schema, value, path);

export const validate = <TSchema extends Schema>(
  schema: TSchema,
  value: JsonValue | undefined,
  path = ''
): ValidationResult<InferSchema<TSchema>> => {
  switch (schema.kind) {
    case 'string': {
      if (typeof value !== 'string')
        return { ok: false, issues: [issue(path, 'Expected string')] };
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        return {
          ok: false,
          issues: [
            issue(path, `Expected at least ${schema.minLength} characters`),
          ],
        };
      }
      if (schema.maxLength !== undefined && value.length > schema.maxLength) {
        return {
          ok: false,
          issues: [
            issue(path, `Expected at most ${schema.maxLength} characters`),
          ],
        };
      }
      if (
        schema.format === 'email' &&
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
      ) {
        return { ok: false, issues: [issue(path, 'Expected email')] };
      }
      if (
        schema.format === 'uuid' &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value
        )
      ) {
        return { ok: false, issues: [issue(path, 'Expected uuid')] };
      }
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'number': {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { ok: false, issues: [issue(path, 'Expected number')] };
      }
      if (schema.integer === true && !Number.isInteger(value)) {
        return { ok: false, issues: [issue(path, 'Expected integer')] };
      }
      if (schema.minimum !== undefined && value < schema.minimum) {
        return {
          ok: false,
          issues: [issue(path, `Expected at least ${schema.minimum}`)],
        };
      }
      if (schema.maximum !== undefined && value > schema.maximum) {
        return {
          ok: false,
          issues: [issue(path, `Expected at most ${schema.maximum}`)],
        };
      }
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'boolean': {
      if (typeof value !== 'boolean')
        return { ok: false, issues: [issue(path, 'Expected boolean')] };
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'literal': {
      if (!jsonEquals(value, schema.value))
        return { ok: false, issues: [issue(path, 'Expected literal')] };
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'enum': {
      if (typeof value !== 'string' || !schema.values.includes(value)) {
        return { ok: false, issues: [issue(path, 'Expected enum value')] };
      }
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'array': {
      if (!Array.isArray(value))
        return { ok: false, issues: [issue(path, 'Expected array')] };
      if (schema.minItems !== undefined && value.length < schema.minItems) {
        return {
          ok: false,
          issues: [issue(path, `Expected at least ${schema.minItems} items`)],
        };
      }
      if (schema.maxItems !== undefined && value.length > schema.maxItems) {
        return {
          ok: false,
          issues: [issue(path, `Expected at most ${schema.maxItems} items`)],
        };
      }
      const issues: ValidationIssue[] = [];
      for (let index = 0; index < value.length; index += 1) {
        const item = value[index];
        const result = validateObject(schema.item, item, `${path}[${index}]`);
        if (!result.ok) issues.push(...result.issues);
      }
      if (issues.length > 0) return { ok: false, issues };
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'object': {
      if (value === undefined || !isJsonObject(value)) {
        return { ok: false, issues: [issue(path, 'Expected object')] };
      }
      const issues: ValidationIssue[] = [];
      for (const [key, child] of Object.entries(schema.shape)) {
        const childValue = value[key];
        if (child.kind === 'optional' && childValue === undefined) continue;
        const result = validateObject(child, childValue, childPath(path, key));
        if (!result.ok) issues.push(...result.issues);
      }
      if (schema.strictObject) {
        for (const key of Object.keys(value)) {
          if (schema.shape[key] === undefined)
            issues.push(issue(childPath(path, key), 'Unexpected property'));
        }
      }
      if (issues.length > 0) return { ok: false, issues };
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'optional': {
      if (value === undefined)
        return { ok: true, value: undefined as InferSchema<TSchema> };
      return validateObject(schema.inner, value, path) as ValidationResult<
        InferSchema<TSchema>
      >;
    }
    case 'nullable': {
      if (value === null)
        return { ok: true, value: null as InferSchema<TSchema> };
      return validateObject(schema.inner, value, path) as ValidationResult<
        InferSchema<TSchema>
      >;
    }
    case 'union': {
      const allIssues: ValidationIssue[] = [];
      for (const variant of schema.variants) {
        const result = validateObject(variant, value, path);
        if (result.ok)
          return { ok: true, value: result.value as InferSchema<TSchema> };
        allIssues.push(...result.issues);
      }
      return {
        ok: false,
        issues:
          allIssues.length > 0
            ? allIssues
            : [issue(path, 'Expected union variant')],
      };
    }
    case 'record': {
      if (value === undefined || !isJsonObject(value)) {
        return { ok: false, issues: [issue(path, 'Expected record')] };
      }
      const issues: ValidationIssue[] = [];
      for (const [key, recordValue] of Object.entries(value)) {
        const result = validateObject(
          schema.value,
          recordValue,
          childPath(path, key)
        );
        if (!result.ok) issues.push(...result.issues);
      }
      if (issues.length > 0) return { ok: false, issues };
      return { ok: true, value: value as InferSchema<TSchema> };
    }
    case 'json':
      if (value === undefined)
        return { ok: false, issues: [issue(path, 'Expected JSON value')] };
      return { ok: true, value: value as InferSchema<TSchema> };
  }
};
