export type JsonPrimitive = null | string | number | boolean;

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export type JsonValue = JsonPrimitive | readonly JsonValue[] | JsonObject;

export const isJsonObject = (value: JsonValue): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const parseJson = (text: string): JsonValue =>
  JSON.parse(text) as JsonValue;
