import type { LoadedProcedure } from './manifest.js';
import type { Schema } from '../schema/types.js';
import { parseDurationMs } from '../internal/duration.js';

export interface CompiledProcedureGenerationOptions {
  readonly dispatchServicesType?: string;
  readonly enforceRateLimit: boolean;
  readonly includeDispatchWrapper?: boolean;
  readonly modes?: readonly CompiledProcedureMode[];
  readonly skipAuth?: boolean;
  readonly validateHeaders: boolean;
  readonly validateInput: boolean;
  readonly validateOutput: boolean;
  readonly validateResponseHeaders: boolean;
}

export type CompiledProcedureMode = 'body' | 'serialized' | 'response';

const validatorName = (base: string, suffix: string): string =>
  `${base}_${suffix}`.replace(/[^a-zA-Z0-9_$]/g, '_');

const renderPath = (base: string, key: string): string =>
  `${base} === '' ? ${JSON.stringify(key)} : \`${'${'}${base}${'}'}.${key}\``;

const renderArrayPath = (base: string): string =>
  `\`${'${'}${base}${'}'}[\${index}]\``;

const renderEnumMiss = (
  valueExpression: string,
  values: readonly string[]
): string =>
  values.length === 0
    ? 'true'
    : values
        .map((value) => `${valueExpression} !== ${JSON.stringify(value)}`)
        .join(' && ');

const canEmitJsonSerializer = (
  schema: Schema,
  allowOptional = false
): boolean => {
  switch (schema.kind) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'literal':
    case 'enum':
      return true;
    case 'optional':
      return allowOptional && canEmitJsonSerializer(schema.inner, true);
    case 'nullable':
      return canEmitJsonSerializer(schema.inner, true);
    case 'array':
    case 'object':
    case 'union':
    case 'record':
    case 'json':
      return false;
  }
};

const canEmitResponseHeadersSerializer = (schema: Schema): boolean => {
  if (schema.kind !== 'object') return false;
  return Object.values(schema.shape).every((child) =>
    canEmitJsonSerializer(child, true)
  );
};

const blockedResponseHeaderNames = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const headerNamePattern = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const isCompileSafeResponseHeaderName = (name: string): boolean =>
  headerNamePattern.test(name) && !blockedResponseHeaderNames.has(name);

const unwrapOptionalStringSchema = (schema: Schema): Schema | undefined =>
  schema.kind === 'optional' ? schema.inner : schema;

const canEmitResponseHeaderRecord = (schema: Schema): boolean =>
  schema.kind === 'object' &&
  Object.values(schema.shape).every((child) => {
    const inner = unwrapOptionalStringSchema(child);
    return inner?.kind === 'string';
  });

const emitResponseHeaderRecordFunction = (
  name: string,
  schema: Schema,
  definitions: string[]
): boolean => {
  if (!canEmitResponseHeaderRecord(schema) || schema.kind !== 'object') {
    return false;
  }
  const checks = Object.keys(schema.shape)
    .filter((key) => isCompileSafeResponseHeaderName(key.toLowerCase()))
    .map((key, index) => {
      const valueName = `value${index}`;
      const serializedKey = JSON.stringify(key);
      return `  const ${valueName} = headers[${serializedKey}];
  if (typeof ${valueName} === 'string' && !compiledHasInvalidHeaderValue(${valueName})) {
    output[${serializedKey}] = ${valueName};
  }`;
    })
    .join('\n');
  definitions.push(`const ${name} = (headers: Record<string, string>): Record<string, string> => {
  const output: Record<string, string> = { 'content-type': 'application/json' };
${checks}
  return output;
};`);
  return true;
};

const emitValidatorFunction = (
  name: string,
  schema: Schema,
  definitions: string[]
): void => {
  if (
    definitions.some((definition) => definition.startsWith(`const ${name} = `))
  ) {
    return;
  }
  const invalid = (message: string): string =>
    `return { path, message: ${JSON.stringify(message)} };`;
  const emitJsonEquals = (): void => {
    if (definitions.some((definition) => definition.startsWith('const compiledJsonEquals = '))) {
      return;
    }
    definitions.push(`const compiledJsonEquals = (left: JsonValue | undefined, right: JsonValue | undefined): boolean => {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((item, index) => compiledJsonEquals(item, right[index]));
  }
  if (left === undefined || right === undefined) return false;
  if (!isJsonObject(left) || !isJsonObject(right)) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) =>
    Object.hasOwn(right, key) ? compiledJsonEquals(left[key], right[key]) : false
  );
};`);
  };

  switch (schema.kind) {
    case 'string': {
      if (schema.format === 'email') {
        definitions.push(
          `const ${name}_emailRegex = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/;`
        );
      }
      if (schema.format === 'uuid') {
        definitions.push(
          `const ${name}_uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;`
        );
      }
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (typeof value !== 'string') {
    ${invalid('Expected string')}
  }
  ${
    schema.minLength === undefined
      ? ''
      : `if (value.length < ${schema.minLength}) {
    return { path, message: ${JSON.stringify(`Expected at least ${schema.minLength} characters`)} };
  }`
  }
  ${
    schema.maxLength === undefined
      ? ''
      : `if (value.length > ${schema.maxLength}) {
    return { path, message: ${JSON.stringify(`Expected at most ${schema.maxLength} characters`)} };
  }`
  }
  ${
    schema.format !== 'email'
      ? ''
      : `if (!${name}_emailRegex.test(value)) {
    return { path, message: 'Expected email' };
  }`
  }
  ${
    schema.format !== 'uuid'
      ? ''
      : `if (!${name}_uuidRegex.test(value)) {
    return { path, message: 'Expected uuid' };
  }`
  }
  return undefined;
};`);
      return;
    }
    case 'number': {
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    ${invalid('Expected number')}
  }
  ${
    schema.integer !== true
      ? ''
      : `if (!Number.isInteger(value)) {
    return { path, message: 'Expected integer' };
  }`
  }
  ${
    schema.minimum === undefined
      ? ''
      : `if (value < ${schema.minimum}) {
    return { path, message: ${JSON.stringify(`Expected at least ${schema.minimum}`)} };
  }`
  }
  ${
    schema.maximum === undefined
      ? ''
      : `if (value > ${schema.maximum}) {
    return { path, message: ${JSON.stringify(`Expected at most ${schema.maximum}`)} };
  }`
  }
  return undefined;
};`);
      return;
    }
    case 'boolean':
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (typeof value !== 'boolean') {
    ${invalid('Expected boolean')}
  }
  return undefined;
};`);
      return;
    case 'literal':
      emitJsonEquals();
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (!compiledJsonEquals(value, ${JSON.stringify(schema.value)})) {
    ${invalid('Expected literal')}
  }
  return undefined;
};`);
      return;
    case 'enum':
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (typeof value !== 'string' || (${renderEnumMiss('value', [...schema.values])})) {
    ${invalid('Expected enum value')}
  }
  return undefined;
};`);
      return;
    case 'optional': {
      const innerName = validatorName(name, 'inner');
      emitValidatorFunction(innerName, schema.inner, definitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value === undefined) {
    return undefined;
  }
  return ${innerName}(value, path);
};`);
      return;
    }
    case 'nullable': {
      const innerName = validatorName(name, 'inner');
      emitValidatorFunction(innerName, schema.inner, definitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value === null) {
    return undefined;
  }
  return ${innerName}(value, path);
};`);
      return;
    }
    case 'array': {
      const itemName = validatorName(name, 'item');
      emitValidatorFunction(itemName, schema.item, definitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (!Array.isArray(value)) {
    ${invalid('Expected array')}
  }
  ${
    schema.minItems === undefined
      ? ''
      : `if (value.length < ${schema.minItems}) {
    return { path, message: ${JSON.stringify(`Expected at least ${schema.minItems} items`)} };
  }`
  }
  ${
    schema.maxItems === undefined
      ? ''
      : `if (value.length > ${schema.maxItems}) {
    return { path, message: ${JSON.stringify(`Expected at most ${schema.maxItems} items`)} };
  }`
  }
  for (let index = 0; index < value.length; index += 1) {
    const result = ${itemName}(value[index], ${renderArrayPath('path')});
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
};`);
      return;
    }
    case 'object': {
      const childDefinitions: string[] = [];
      const checks = Object.entries(schema.shape)
        .map(([key, child], index) => {
          const childName = validatorName(name, `${key}_${index}`);
          const pathExpression = renderPath('path', key);
          emitValidatorFunction(childName, child, childDefinitions);
          return `  {
    const childValue = objectValue[${JSON.stringify(key)}];
    ${
      child.kind === 'optional'
        ? `if (childValue !== undefined) {
      const result = ${childName}(childValue, ${pathExpression});
      if (result !== undefined) {
        return result;
      }
    }`
        : `const result = ${childName}(childValue, ${pathExpression});
    if (result !== undefined) {
      return result;
    }`
    }
  }`;
        })
        .join('\n');
      definitions.push(...childDefinitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value === undefined || typeof value !== 'object' || value === null || Array.isArray(value)) {
    ${invalid('Expected object')}
  }
  const objectValue = value as Record<string, JsonValue | undefined>;
${checks}
  ${
    schema.strictObject
      ? `for (const key of Object.keys(objectValue)) {
    if (${JSON.stringify(Object.keys(schema.shape))}.includes(key)) continue;
    return {
      path: path === '' ? key : \`${'${'}path${'}'}.\${key}\`,
      message: 'Unexpected property',
    };
  }`
      : ''
  }
  return undefined;
};`);
      return;
    }
    case 'union': {
      const variantNames = schema.variants.map((variant, index) => {
        const childName = validatorName(name, `variant_${index}`);
        emitValidatorFunction(childName, variant, definitions);
        return childName;
      });
      const checks = variantNames
        .map(
          (
            childName,
            index
          ) => `  const result${index} = ${childName}(value, path);
  if (result${index} === undefined) return undefined;`
        )
        .join('\n');
      const firstIssue = variantNames.length === 0 ? undefined : 'result0';
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
${checks}
  return ${firstIssue ?? "{ path, message: 'Expected union' }"};
};`);
      return;
    }
    case 'record': {
      const valueName = validatorName(name, 'value');
      emitValidatorFunction(valueName, schema.value, definitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value === undefined || typeof value !== 'object' || value === null || Array.isArray(value)) {
    ${invalid('Expected record')}
  }
  const objectValue = value as Record<string, JsonValue | undefined>;
  for (const key of Object.keys(objectValue)) {
    const result = ${valueName}(objectValue[key], path === '' ? key : \`${'${'}path${'}'}.\${key}\`);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
};`);
      return;
    }
    case 'json':
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value === undefined) {
    ${invalid('Expected JSON value')}
  }
  return undefined;
};`);
      return;
  }
};

const emitJsonSerializerFunction = (
  name: string,
  schema: Schema,
  definitions: string[]
): void => {
  if (
    definitions.some((definition) => definition.startsWith(`const ${name} = `))
  ) {
    return;
  }

  switch (schema.kind) {
    case 'string':
    case 'enum':
      definitions.push(
        `const ${name} = (value: JsonValue): string => typeof value === 'string' ? JSON.stringify(value) : 'null';`
      );
      return;
    case 'number':
      definitions.push(`const ${name} = (value: JsonValue): string => {
  return typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : 'null';
};`);
      return;
    case 'boolean':
      definitions.push(
        `const ${name} = (value: JsonValue): string => (value === true ? 'true' : 'false');`
      );
      return;
    case 'literal':
      definitions.push(
        `const ${name} = (_value: JsonValue): string => ${JSON.stringify(JSON.stringify(schema.value))};`
      );
      return;
    case 'optional': {
      const innerName = validatorName(name, 'inner');
      emitJsonSerializerFunction(innerName, schema.inner, definitions);
      definitions.push(`const ${name} = (value: JsonValue | undefined): string => {
  return value === undefined ? 'null' : ${innerName}(value);
};`);
      return;
    }
    case 'nullable': {
      const innerName = validatorName(name, 'inner');
      emitJsonSerializerFunction(innerName, schema.inner, definitions);
      definitions.push(`const ${name} = (value: JsonValue): string => {
  return value === null ? 'null' : ${innerName}(value);
};`);
      return;
    }
    case 'array': {
      const itemName = validatorName(name, 'item');
      emitJsonSerializerFunction(itemName, schema.item, definitions);
      definitions.push(`const ${name} = (value: JsonValue): string => {
  if (!Array.isArray(value)) return '[]';
  let output = '[';
  for (let index = 0; index < value.length; index += 1) {
    if (index > 0) output += ',';
    output += ${itemName}(value[index]);
  }
  return output + ']';
};`);
      return;
    }
    case 'object': {
      const childDefinitions: string[] = [];
      const steps = Object.entries(schema.shape)
        .map(([key, child], index) => {
          const childName = validatorName(name, `${key}_${index}`);
          const propertyKey = JSON.stringify(`"${key}":`);
          const childSchema = child.kind === 'optional' ? child.inner : child;
          emitJsonSerializerFunction(childName, childSchema, childDefinitions);
          if (child.kind === 'optional') {
            return `  {
    const childValue = objectValue[${JSON.stringify(key)}];
    if (childValue !== undefined) {
      if (needsComma) output += ',';
      output += ${propertyKey} + ${childName}(childValue);
      needsComma = true;
    }
  }`;
          }
          return `  if (needsComma) output += ',';
  output += ${propertyKey} + ${childName}(objectValue[${JSON.stringify(key)}] as JsonValue);
  needsComma = true;`;
        })
        .join('\n');
      definitions.push(...childDefinitions);
      definitions.push(`const ${name} = (value: JsonValue): string => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return '{}';
  }
  const objectValue = value as Record<string, JsonValue | undefined>;
  let output = '{';
  let needsComma = false;
${steps}
  return output + '}';
};`);
      return;
    }
    case 'union':
    case 'record':
    case 'json':
      definitions.push(
        `const ${name} = (value: JsonValue): string => JSON.stringify(value);`
      );
      return;
  }
};

const emitSerializerFunctions = (
  entry: LoadedProcedure,
  base: string,
  modes: readonly CompiledProcedureMode[]
): string => {
  const definitions: string[] = [];
  const needsSerialized = modes.includes('serialized');
  const needsResponse = modes.includes('response');
  const outputSchema = entry.procedure.output;
  if (outputSchema === undefined) return '';
  const outputSerializerName = canEmitJsonSerializer(outputSchema)
    ? `${base}_serialize_data`
    : undefined;
  if (outputSerializerName !== undefined) {
    emitJsonSerializerFunction(outputSerializerName, outputSchema, definitions);
  }
  const headerSerializerName =
    entry.procedure.responseHeaders !== undefined &&
    canEmitResponseHeadersSerializer(entry.procedure.responseHeaders)
      ? `${base}_serialize_headers`
      : undefined;
  const headerRecordName =
    entry.procedure.responseHeaders !== undefined &&
    canEmitResponseHeaderRecord(entry.procedure.responseHeaders)
      ? `${base}_response_header_record`
      : undefined;
  if (
    headerSerializerName !== undefined &&
    entry.procedure.responseHeaders !== undefined
  ) {
    emitJsonSerializerFunction(
      headerSerializerName,
      entry.procedure.responseHeaders,
      definitions
    );
  }
  const hasHeaderRecordFunction =
    headerRecordName !== undefined &&
    entry.procedure.responseHeaders !== undefined &&
    emitResponseHeaderRecordFunction(
      headerRecordName,
      entry.procedure.responseHeaders,
      definitions
    );
  const dataSerialization =
    outputSerializerName === undefined
      ? 'JSON.stringify(data)'
      : `${outputSerializerName}(data)`;
  const headerSerialization =
    headerSerializerName === undefined
      ? 'JSON.stringify(headers)'
      : `${headerSerializerName}(headers)`;
  const responseHeaderRecord =
    hasHeaderRecordFunction && headerRecordName !== undefined
      ? `${headerRecordName}(headers)`
      : 'compiledCreateJsonHeaderRecord(headers)';
  return `${definitions.join('\n\n')}

const ${base}_success_prefix = ${JSON.stringify(
    `{"ok":true,"id":${JSON.stringify(entry.id)},"traceId":`
  )};
const ${base}_success_data_prefix = ${JSON.stringify(',"data":')};
const ${base}_success_headers_prefix = ${JSON.stringify(',"headers":')};
const ${base}_error_prefix = ${JSON.stringify(
    `{"ok":false,"id":${JSON.stringify(entry.id)},"traceId":`
  )};
const ${base}_error_data_prefix = ${JSON.stringify(',"error":')};

${
  needsSerialized
    ? `
const ${base}_serialize_success = (
  traceId: string,
  data: JsonValue,
  headers?: Record<string, string>
) => {
  const traceBody = JSON.stringify(traceId);
  const dataBody = ${dataSerialization};
  if (headers === undefined) {
    return {
      body:
        ${base}_success_prefix +
        traceBody +
        ${base}_success_data_prefix +
        dataBody +
        '}',
    };
  }
  const headersBody = ${headerSerialization};
  const responseHeaders = ${responseHeaderRecord};
  return {
    body:
      ${base}_success_prefix +
      traceBody +
      ${base}_success_data_prefix +
      dataBody +
      ${base}_success_headers_prefix +
      headersBody +
      '}',
    headers,
    responseHeaders,
  };
};
`
    : ''
}

${
  needsResponse
    ? `
const ${base}_response_success = (
  traceId: string,
  data: JsonValue,
  headers?: Record<string, string>
): Response => {
  const traceBody = JSON.stringify(traceId);
  const dataBody = ${dataSerialization};
  if (headers === undefined) {
    return new Response(
      ${base}_success_prefix +
        traceBody +
        ${base}_success_data_prefix +
        dataBody +
        '}',
      compiledJsonOkResponseInit
    );
  }
  const headersBody = ${headerSerialization};
  const responseHeaders = ${responseHeaderRecord};
  return new Response(
    ${base}_success_prefix +
      traceBody +
      ${base}_success_data_prefix +
      dataBody +
      ${base}_success_headers_prefix +
      headersBody +
      '}',
    { status: 200, headers: responseHeaders }
  );
};
`
    : ''
}

${
  needsSerialized
    ? `
const ${base}_serialize_error = (
  traceId: string,
  error: RpcError
) => ({
  body:
    ${base}_error_prefix +
    JSON.stringify(traceId) +
    ${base}_error_data_prefix +
    JSON.stringify(error) +
    '}',
});
`
    : ''
}

${
  needsResponse
    ? `
const ${base}_response_error = (
  traceId: string,
  error: RpcError
): Response =>
  new Response(
    ${base}_error_prefix +
      JSON.stringify(traceId) +
      ${base}_error_data_prefix +
      JSON.stringify(error) +
      '}',
    compiledJsonOkResponseInit
  );
`
    : ''
}`;
};

const emitHeaderValueExpression = (entry: LoadedProcedure): string => {
  const headers = entry.procedure.headers;
  if (headers === undefined) return '{}';
  if (headers.kind !== 'object') {
    return `compiledHeaderObject(request, ${entry.exportName})`;
  }
  const entries = Object.keys(headers.shape)
    .map((key) => {
      const serializedKey = JSON.stringify(key);
      return `    ${serializedKey}: request.getHeader(${serializedKey}) ?? undefined,`;
    })
    .join('\n');
  return `{
${entries}
  }`;
};

export const emitCompiledProcedureSource = (
  entry: LoadedProcedure,
  options: CompiledProcedureGenerationOptions
): string => {
  const compiledFixedDispatchType = `CompiledFixedDispatch${options.dispatchServicesType === undefined ? '' : `<${options.dispatchServicesType}>`}`;
  const compiledDispatchType = `CompiledDispatch${options.dispatchServicesType === undefined ? '' : `<${options.dispatchServicesType}>`}`;
  if (entry.procedure.output === undefined) return '';
  const modes = options.modes ?? (['body', 'serialized', 'response'] as const);
  const base = entry.exportName;
  const hasAuth = entry.procedure.auth !== undefined;
  const needsAuth = hasAuth && options.skipAuth !== true;
  const isContextless =
    entry.procedure.context === 'none' &&
    entry.procedure.contextlessHandler !== undefined &&
    !needsAuth;
  const hasCache =
    entry.procedure.meta.kind === 'query' &&
    entry.procedure.meta.cache !== undefined;
  const hasRateLimit = entry.procedure.meta.rateLimit !== undefined;
  const needsInputValidation = options.validateInput;
  const needsHeaderValidation =
    entry.procedure.headers !== undefined && options.validateHeaders;
  const needsOutputValidation = options.validateOutput;
  const needsResponseHeaderValidation =
    entry.procedure.responseHeaders !== undefined &&
    options.validateResponseHeaders;
  const needsRateLimit = hasRateLimit && options.enforceRateLimit;
  const validators: string[] = [];
  if (needsInputValidation) {
    emitValidatorFunction(
      `${base}_validate_input`,
      entry.procedure.input,
      validators
    );
  }
  if (needsHeaderValidation && entry.procedure.headers !== undefined) {
    emitValidatorFunction(
      `${base}_validate_headers`,
      entry.procedure.headers,
      validators
    );
  }
  if (needsOutputValidation) {
    emitValidatorFunction(
      `${base}_validate_output`,
      entry.procedure.output,
      validators
    );
  }
  if (
    needsResponseHeaderValidation &&
    entry.procedure.responseHeaders !== undefined
  ) {
    emitValidatorFunction(
      `${base}_validate_response_headers`,
      entry.procedure.responseHeaders,
      validators
    );
  }
  const headerValueBlock =
    entry.procedure.headers === undefined
      ? 'const headerValue = compiledEmptyObject;'
      : `const headerValue = ${emitHeaderValueExpression(entry)};`;
  const errorReturn = (
    mode: 'body' | 'serialized' | 'response',
    errorExpression: string,
    fallbackExpression: string
  ): string => {
    if (mode === 'response') {
      return `return ${base}_response_error(trace, ${errorExpression});`;
    }
    if (mode === 'serialized') {
      return `return ${base}_serialize_error(trace, ${errorExpression});`;
    }
    return `return ${fallbackExpression};`;
  };
  const successReturn = (
    mode: 'body' | 'serialized' | 'response',
    dataExpression: string,
    headersExpression: string | undefined,
    fallbackExpression: string
  ): string => {
    const args =
      headersExpression === undefined
        ? `trace, ${dataExpression}`
        : `trace, ${dataExpression}, ${headersExpression}`;
    if (mode === 'response') {
      return `return ${base}_response_success(${args});`;
    }
    if (mode === 'serialized') {
      return `return ${base}_serialize_success(${args});`;
    }
    return `return ${fallbackExpression};`;
  };
  const headerValidationBlock = (mode: 'body' | 'serialized' | 'response') =>
    entry.procedure.headers === undefined || !needsHeaderValidation
      ? ''
      : `const headerIssue = ${base}_validate_headers(headerValue as JsonValue, 'headers');
  if (headerIssue !== undefined) {
    const error = {
      code: 'HEADER_VALIDATION_ERROR',
      message: 'Header validation failed',
      status: 400,
      details: compiledValidationDetails([headerIssue]),
    };
    ${errorReturn(mode, 'error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
  }`;
  const inputValidationBlock = (mode: 'body' | 'serialized' | 'response') =>
    needsInputValidation
      ? `const inputIssue = ${base}_validate_input(rpcRequest.input, 'input');
  if (inputIssue !== undefined) {
    const error = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      status: 400,
      details: compiledValidationDetails([inputIssue]),
    };
    ${errorReturn(mode, 'error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
  }`
      : '';
  const responseHeaderValidation = (
    mode: 'body' | 'serialized' | 'response',
    headersExpression = 'result.headers'
  ) =>
    entry.procedure.responseHeaders === undefined ||
    !needsResponseHeaderValidation
      ? ''
      : `{
    const responseHeaderIssue = ${base}_validate_response_headers(${headersExpression}, 'responseHeaders');
    if (responseHeaderIssue !== undefined) {
      const error = {
        code: 'RESPONSE_HEADER_VALIDATION_ERROR',
        message: 'Handler returned invalid response headers',
        status: 500,
        details: compiledValidationDetails([responseHeaderIssue]),
      };
      ${errorReturn(mode, 'error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
    }
  }`;
  const rateLimitBlock = (mode: 'body' | 'serialized' | 'response') =>
    needsRateLimit
      ? `const limited = compiledRateLimitFailureStatic(${JSON.stringify(entry.id)}, ${entry.procedure.meta.rateLimit?.limit ?? 0}, ${JSON.stringify(entry.procedure.meta.rateLimit?.window ?? '1m')}, ${parseDurationMs(entry.procedure.meta.rateLimit?.window ?? '1m')}, rpcRequest, request, trace, runtime);
  if (limited !== undefined) {
    ${errorReturn(mode, 'limited.error', 'limited')}
  }`
      : '';
  const authValueDeclaration = hasCache
    ? `
  const authValue = authResult;`
    : '';
  const authBlock = (mode: 'body' | 'serialized' | 'response') =>
    needsAuth
      ? `const ctx = compiledCreateContext(
    request,
    trace,
    services,
    headerValue as object,
    compiledEmptyObject
  );
  const authResultValue = ${
    mode === 'body' ? 'compiledAuthenticate' : 'compiledAuthenticateUncached'
  }(${entry.exportName}.auth, ctx${mode === 'body' ? ', state' : ''});
  const authResult = authResultValue instanceof Promise ? await authResultValue : authResultValue;
  if ('kind' in authResult && authResult.kind === 'error') {
    ${errorReturn(mode, 'authResult.error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error: authResult.error }')}
  }
  ctx.auth = authResult;
  ${authValueDeclaration}`
      : '';
  const authValueExpression = needsAuth ? 'authValue' : 'compiledEmptyObject';
  const cacheReadBlock = (mode: 'body' | 'serialized' | 'response') =>
    hasCache
      ? `const cached = compiledReadCache(
    ${JSON.stringify(entry.id)},
    ${entry.exportName},
    inputValue,
    headerValue as Record<string, string>,
    ${authValueExpression}
  );
  if (cached !== undefined) {
    ${successReturn(
      mode,
      'cached.data',
      'cached.headers',
      `cached.headers === undefined
        ? { ok: true as const, id: rpcRequest.id, traceId: trace, data: cached.data }
        : { ok: true as const, id: rpcRequest.id, traceId: trace, data: cached.data, headers: cached.headers }`
    )}
  }`
      : '';
  const cacheWriteBlockFor = (
    dataExpression: string,
    headersExpression?: string
  ): string =>
    hasCache
      ? `compiledWriteCache(
    ${JSON.stringify(entry.id)},
    ${entry.exportName},
    inputValue,
    headerValue as Record<string, string>,
    ${authValueExpression},
    ${dataExpression},
    ${headersExpression === undefined ? 'undefined' : headersExpression},
    runtime.cacheMaxEntries
  );`
      : '';
  const contextCreationBlock =
    needsAuth || isContextless
      ? ''
      : `const ctx = compiledCreateContext(
    request,
    trace,
    services,
    headerValue as object,
    compiledEmptyObject
  );`;
  const handlerCall = isContextless
    ? `${entry.exportName}.contextlessHandler(inputValue)`
    : `${entry.exportName}.handler(ctx, inputValue)`;
  const stateParameter = (mode: 'body' | 'serialized' | 'response'): string =>
    needsAuth && mode === 'body' ? 'state' : '_state';
  const runtimeParameter = needsRateLimit ? 'runtime' : '_runtime';
  const outputValidationFor = (
    mode: 'body' | 'serialized' | 'response',
    dataExpression: string
  ): string =>
    needsOutputValidation
      ? `{
    const outputIssue = ${base}_validate_output(${dataExpression}, 'output');
    if (outputIssue !== undefined) {
      const error = {
        code: 'OUTPUT_VALIDATION_ERROR',
        message: 'Handler returned invalid output',
        status: 500,
        details: compiledValidationDetails([outputIssue]),
      };
      ${errorReturn(mode, 'error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
    }
  }`
      : '';
  const resultShapeBlock = (mode: 'body' | 'serialized' | 'response') =>
    `if (typeof result !== 'object' || result === null || !('kind' in result)) {
    const outputValue = result as JsonValue;
    ${outputValidationFor(mode, 'outputValue')}
    ${responseHeaderValidation(mode, 'undefined')}
    ${cacheWriteBlockFor('outputValue')}
    ${successReturn(
      mode,
      'outputValue',
      undefined,
      '{ ok: true as const, id: rpcRequest.id, traceId: trace, data: outputValue }'
    )}
  }
  const procedureResult = result as
    | { kind: 'success'; data: JsonValue; headers?: Record<string, string> }
    | { kind: 'error'; error: RpcError };`;
  const emitExecutor = (
    mode: 'body' | 'serialized' | 'response'
  ): string => `${mode === 'body' ? '' : '\n'}const ${base}_execute_${mode}: ${compiledFixedDispatchType} = async (
  rpcRequest,
  request,
  services,
  ${runtimeParameter},
  ${stateParameter(mode)}
) => {
  const trace = compiledTraceId(request, rpcRequest.traceId);
  ${rateLimitBlock(mode)}
  ${headerValueBlock}
  ${headerValidationBlock(mode)}
  ${authBlock(mode)}
  ${inputValidationBlock(mode)}
  const inputValue = (rpcRequest.input ?? compiledEmptyObject) as JsonValue;
  ${cacheReadBlock(mode)}
  ${contextCreationBlock}
  const result = await ${handlerCall};
  ${resultShapeBlock(mode)}
  if (procedureResult.kind === 'error') {
    ${errorReturn(mode, 'procedureResult.error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error: procedureResult.error }')}
  }
  ${outputValidationFor(mode, 'procedureResult.data')}
  ${responseHeaderValidation(mode, 'procedureResult.headers')}
  ${cacheWriteBlockFor('procedureResult.data', 'procedureResult.headers')}
  ${successReturn(
    mode,
    'procedureResult.data',
    'procedureResult.headers',
    `procedureResult.headers === undefined
      ? { ok: true as const, id: rpcRequest.id, traceId: trace, data: procedureResult.data }
      : { ok: true as const, id: rpcRequest.id, traceId: trace, data: procedureResult.data, headers: procedureResult.headers }`
  )}
};`;
  const dispatchWrapper =
    options.includeDispatchWrapper === false || modes.length === 1
      ? ''
      : `
const ${base}_execute: ${compiledDispatchType} = async (
  rpcRequest,
  request,
  services,
  runtime,
  state,
  serialize
) =>
  serialize === 'response'
    ? ${base}_execute_response(rpcRequest, request, services, runtime, state)
    : serialize
      ? ${base}_execute_serialized(rpcRequest, request, services, runtime, state)
      : ${base}_execute_body(rpcRequest, request, services, runtime, state);`;
  const procedureMetadata = `const ${base}_metadata = {
  needsInputValidation: ${needsInputValidation ? 'true' : 'false'},
  needsOutputValidation: ${needsOutputValidation ? 'true' : 'false'},
  needsHeaderValidation: ${needsHeaderValidation ? 'true' : 'false'},
  hasRateLimit: ${needsRateLimit ? 'true' : 'false'},
  needsAuth: ${needsAuth ? 'true' : 'false'},
} as const;`;
  return `${validators.join('\n\n')}

${procedureMetadata}

${emitSerializerFunctions(entry, base, modes)}

${modes.map((mode) => emitExecutor(mode)).join('\n')}

${dispatchWrapper}`;
};
