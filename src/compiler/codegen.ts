import type { LoadedProcedure } from './manifest.js';
import type { Schema } from '../schema/types.js';
import { parseDurationMs } from '../internal/duration.js';

export interface CompiledProcedureGenerationOptions {
  enforceRateLimit: boolean;
  validateHeaders: boolean;
  validateInput: boolean;
  validateOutput: boolean;
  validateResponseHeaders: boolean;
}

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
      definitions.push(`const ${name} = (value: JsonValue | undefined, path = '') => {
  if (value !== ${JSON.stringify(schema.value)}) {
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
  output += ${propertyKey} + ${childName}(objectValue[${JSON.stringify(key)}]);
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
  base: string
): string => {
  const definitions: string[] = [];
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
  const dataSerialization =
    outputSerializerName === undefined
      ? 'JSON.stringify(data)'
      : `${outputSerializerName}(data)`;
  const headerSerialization =
    headerSerializerName === undefined
      ? 'JSON.stringify(headers)'
      : `${headerSerializerName}(headers)`;
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

const ${base}_serialize_success = (
  traceId: string,
  data: JsonValue,
  headers?: Record<string, JsonValue>
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
  const responseHeaders = compiledCreateJsonHeaderRecord(headers);
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

const ${base}_response_success = (
  traceId: string,
  data: JsonValue,
  headers?: Record<string, JsonValue>
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
  const responseHeaders = compiledCreateJsonHeaderRecord(headers);
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
  );`;
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
  if (entry.procedure.output === undefined) return '';
  const base = entry.exportName;
  const hasAuth = entry.procedure.auth !== undefined;
  const hasCache =
    entry.procedure.meta.kind === 'query' &&
    entry.procedure.meta.cache !== undefined;
  const hasRateLimit = entry.procedure.meta.rateLimit !== undefined;
  const validators: string[] = [];
  if (options.validateInput) {
    emitValidatorFunction(
      `${base}_validate_input`,
      entry.procedure.input,
      validators
    );
  }
  if (entry.procedure.headers !== undefined && options.validateHeaders) {
    emitValidatorFunction(
      `${base}_validate_headers`,
      entry.procedure.headers,
      validators
    );
  }
  if (options.validateOutput) {
    emitValidatorFunction(
      `${base}_validate_output`,
      entry.procedure.output,
      validators
    );
  }
  if (
    entry.procedure.responseHeaders !== undefined &&
    options.validateResponseHeaders
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
    errorExpression: string,
    fallbackExpression: string
  ): string => `return serialize === 'response'
      ? ${base}_response_error(trace, ${errorExpression})
      : serialize
        ? ${base}_serialize_error(trace, ${errorExpression})
        : ${fallbackExpression};`;
  const successReturn = (
    dataExpression: string,
    headersExpression: string | undefined,
    fallbackExpression: string
  ): string => {
    const args =
      headersExpression === undefined
        ? `trace, ${dataExpression}`
        : `trace, ${dataExpression}, ${headersExpression}`;
    return `return serialize === 'response'
      ? ${base}_response_success(${args})
      : serialize
        ? ${base}_serialize_success(${args})
        : ${fallbackExpression};`;
  };
  const headerValidationBlock =
    entry.procedure.headers === undefined || !options.validateHeaders
      ? ''
      : `const headerIssue = ${base}_validate_headers(headerValue, 'headers');
  if (headerIssue !== undefined) {
    const error = {
      code: 'HEADER_VALIDATION_ERROR',
      message: 'Header validation failed',
      status: 400,
      details: compiledValidationDetails([headerIssue]),
    };
    ${errorReturn('error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
  }`;
  const inputValidationBlock = options.validateInput
    ? `const inputIssue = ${base}_validate_input(rpcRequest.input, 'input');
  if (inputIssue !== undefined) {
    const error = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      status: 400,
      details: compiledValidationDetails([inputIssue]),
    };
    ${errorReturn('error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
  }`
    : '';
  const responseHeaderValidation =
    entry.procedure.responseHeaders === undefined ||
    !options.validateResponseHeaders
      ? ''
      : `{
    const responseHeaderIssue = ${base}_validate_response_headers(result.headers, 'responseHeaders');
    if (responseHeaderIssue !== undefined) {
      const error = {
        code: 'RESPONSE_HEADER_VALIDATION_ERROR',
        message: 'Handler returned invalid response headers',
        status: 500,
        details: compiledValidationDetails([responseHeaderIssue]),
      };
      ${errorReturn('error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
    }
  }`;
  const rateLimitBlock =
    hasRateLimit && options.enforceRateLimit
      ? `const limited = compiledRateLimitFailureStatic(${JSON.stringify(entry.id)}, ${entry.procedure.meta.rateLimit?.limit ?? 0}, ${JSON.stringify(entry.procedure.meta.rateLimit?.window ?? '1m')}, ${parseDurationMs(entry.procedure.meta.rateLimit?.window ?? '1m')}, rpcRequest, request, trace, runtime);
  if (limited !== undefined) {
    ${errorReturn('limited.error', 'limited')}
  }`
      : '';
  const authValueDeclaration = hasCache
    ? `
  const authValue = authResult;`
    : '';
  const authBlock = hasAuth
    ? `const ctx = compiledCreateContext(
    request,
    trace,
    services,
    headerValue as object,
    compiledEmptyObject
  );
  const authResultValue = compiledAuthenticate(${entry.exportName}.auth, ctx, state);
  const authResult = authResultValue instanceof Promise ? await authResultValue : authResultValue;
  if ('kind' in authResult && authResult.kind === 'error') {
    ${errorReturn('authResult.error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error: authResult.error }')}
  }
  ctx.auth = authResult;
  ${authValueDeclaration}`
    : '';
  const authValueExpression = hasAuth ? 'authValue' : 'compiledEmptyObject';
  const cacheReadBlock = hasCache
    ? `const cached = compiledReadCache(
    ${JSON.stringify(entry.id)},
    ${entry.exportName},
    inputValue,
    headerValue as Record<string, JsonValue>,
    ${authValueExpression}
  );
  if (cached !== undefined) {
    ${successReturn(
      'cached.data',
      'cached.headers',
      `cached.headers === undefined
        ? { ok: true as const, id: rpcRequest.id, traceId: trace, data: cached.data }
        : { ok: true as const, id: rpcRequest.id, traceId: trace, data: cached.data, headers: cached.headers }`
    )}
  }`
    : '';
  const cacheWriteBlock = hasCache
    ? `compiledWriteCache(
    ${JSON.stringify(entry.id)},
    ${entry.exportName},
    inputValue,
    headerValue as Record<string, JsonValue>,
    ${authValueExpression},
    result.data,
    result.headers
  );`
    : '';
  const contextCreationBlock = hasAuth
    ? ''
    : `const ctx = compiledCreateContext(
    request,
    trace,
    services,
    headerValue as object,
    compiledEmptyObject
  );`;
  const stateParameter = hasAuth ? 'state' : '_state';
  const runtimeParameter =
    hasRateLimit && options.enforceRateLimit ? 'runtime' : '_runtime';
  const resultShapeBlock = options.validateOutput
    ? `if (typeof result !== 'object' || result === null || !('kind' in result)) {
    const error = {
      code: 'STREAM_REQUIRED',
      message: 'Use streaming transport',
      status: 400,
    };
    ${errorReturn('error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
  }`
    : `if (typeof result !== 'object' || result === null || !('kind' in result)) {
    ${successReturn(
      'result as JsonValue',
      undefined,
      '{ ok: true as const, id: rpcRequest.id, traceId: trace, data: result as JsonValue }'
    )}
  }`;
  return `${validators.join('\n\n')}

${emitSerializerFunctions(entry, base)}

const ${base}_execute: CompiledDispatch = async (
  rpcRequest,
  request,
  services,
  ${runtimeParameter},
  ${stateParameter},
  serialize
) => {
  const trace = compiledTraceId(request, rpcRequest.traceId);
  ${rateLimitBlock}
  ${headerValueBlock}
  ${headerValidationBlock}
  ${authBlock}
  ${inputValidationBlock}
  const inputValue = (rpcRequest.input ?? {}) as JsonValue;
  ${cacheReadBlock}
  ${contextCreationBlock}
  const result = await ${entry.exportName}.handler(ctx, inputValue);
  ${resultShapeBlock}
  if (result.kind === 'error') {
    ${errorReturn('result.error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error: result.error }')}
  }
  ${
    options.validateOutput
      ? `{
    const outputIssue = ${base}_validate_output(result.data, 'output');
    if (outputIssue !== undefined) {
      const error = {
        code: 'OUTPUT_VALIDATION_ERROR',
        message: 'Handler returned invalid output',
        status: 500,
        details: compiledValidationDetails([outputIssue]),
      };
      ${errorReturn('error', '{ ok: false as const, id: rpcRequest.id, traceId: trace, error }')}
    }
  }`
      : ''
  }
  ${responseHeaderValidation}
  ${cacheWriteBlock}
  ${successReturn(
    'result.data',
    'result.headers',
    `result.headers === undefined
      ? { ok: true as const, id: rpcRequest.id, traceId: trace, data: result.data }
      : { ok: true as const, id: rpcRequest.id, traceId: trace, data: result.data, headers: result.headers }`
  )}
};`;
};
