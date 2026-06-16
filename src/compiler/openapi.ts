import type { JsonObject, JsonValue } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { HeaderObjectSchema } from '../schema/types.js';
import type { RpcPath } from '../rpc/dispatcher.js';
import { createClientDocs } from './client-docs.js';
import type { CompilerManifest } from './manifest.js';

const componentName = (id: string, suffix: string): string =>
  `${id
    .split('.')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join('')}${suffix}`;

const schemaRef = (name: string): JsonObject => ({
  $ref: `#/components/schemas/${name}`,
});

const hasRequiredObjectFields = (schema: HeaderObjectSchema): boolean =>
  Object.values(schema.shape).some((child) => child.kind !== 'optional');

export interface OpenApiDocumentOptions {
  readonly path?: RpcPath;
}

export const createOpenApiDocument = (
  manifest: CompilerManifest,
  options: OpenApiDocumentOptions = {}
): JsonObject => {
  const path = options.path ?? '/rpc';
  const schemas: Record<string, JsonValue> = {
    RpcFrameworkError: {
      type: 'object',
      required: ['code', 'message', 'status'],
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        status: { type: 'integer' },
        details: {},
      },
    },
    RpcRequest: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        input: {},
        traceId: { type: 'string' },
      },
    },
    RpcSuccess: {
      type: 'object',
      required: ['ok', 'id', 'data', 'traceId'],
      properties: {
        ok: { const: true },
        id: { type: 'string' },
        data: {},
        traceId: { type: 'string' },
      },
    },
    RpcFailure: {
      type: 'object',
      required: ['ok', 'id', 'error', 'traceId'],
      properties: {
        ok: { const: false },
        id: { type: 'string' },
        error: {
          type: 'object',
          required: ['code', 'message', 'status'],
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'integer' },
            details: {},
          },
        },
        traceId: { type: 'string' },
      },
    },
  };
  const routeRequestRefs: JsonObject[] = [];
  const routeResponseRefs: JsonObject[] = [];
  const routeStreamEventRefs: JsonObject[] = [];
  const procedures = manifest.procedures.map((entry): JsonObject => {
    const inputComponent = componentName(entry.id, 'Input');
    const requestComponent = componentName(entry.id, 'Request');
    const outputComponent = componentName(entry.id, 'Output');
    const streamComponent = componentName(entry.id, 'Stream');
    const streamEventComponent = componentName(entry.id, 'StreamEvent');
    const responseHeadersComponent = componentName(entry.id, 'ResponseHeaders');
    const errorComponent = componentName(entry.id, 'Error');
    const successComponent = componentName(entry.id, 'Success');
    const failureComponent = componentName(entry.id, 'Failure');
    const responseComponent = componentName(entry.id, 'Response');
    schemas[inputComponent] = toJsonSchema(entry.procedure.input);
    schemas[requestComponent] = {
      type: 'object',
      required: ['id', 'input'],
      properties: {
        id: { const: entry.id },
        input: schemaRef(inputComponent),
        traceId: { type: 'string' },
      },
      additionalProperties: false,
    };
    routeRequestRefs.push(schemaRef(requestComponent));
    if (entry.procedure.headers !== undefined) {
      schemas[componentName(entry.id, 'Headers')] = toJsonSchema(
        entry.procedure.headers
      );
    }
    if (entry.procedure.responseHeaders !== undefined) {
      schemas[responseHeadersComponent] = toJsonSchema(
        entry.procedure.responseHeaders
      );
    }
    if (entry.procedure.output !== undefined) {
      schemas[outputComponent] = toJsonSchema(entry.procedure.output);
    }
    if (entry.procedure.stream !== undefined) {
      schemas[streamComponent] = toJsonSchema(entry.procedure.stream);
    }
    const errors = Object.fromEntries(
      Object.entries(entry.procedure.errors).map(([code, schema]) => [
        code,
        toJsonSchema(schema),
      ])
    ) as JsonObject;
    schemas[componentName(entry.id, 'Errors')] = errors;
    schemas[errorComponent] = {
      oneOf: [
        ...Object.entries(entry.procedure.errors).map(([code, schema]) => ({
          type: 'object',
          required: ['code', 'message', 'status', 'details'],
          properties: {
            code: { const: code },
            message: { type: 'string' },
            status: { type: 'integer' },
            details: toJsonSchema(schema),
          },
          additionalProperties: false,
        })),
        schemaRef('RpcFrameworkError'),
      ],
    };
    schemas[successComponent] = {
      type: 'object',
      required: [
        'ok',
        'id',
        'data',
        'traceId',
        ...(entry.procedure.responseHeaders !== undefined &&
        hasRequiredObjectFields(entry.procedure.responseHeaders)
          ? ['headers']
          : []),
      ],
      properties: {
        ok: { const: true },
        id: { const: entry.id },
        data:
          entry.procedure.output === undefined
            ? {}
            : schemaRef(outputComponent),
        traceId: { type: 'string' },
        ...(entry.procedure.responseHeaders === undefined
          ? {}
          : { headers: schemaRef(responseHeadersComponent) }),
      },
      additionalProperties: false,
    };
    schemas[failureComponent] = {
      type: 'object',
      required: ['ok', 'id', 'error', 'traceId'],
      properties: {
        ok: { const: false },
        id: { const: entry.id },
        error: schemaRef(errorComponent),
        traceId: { type: 'string' },
      },
      additionalProperties: false,
    };
    schemas[responseComponent] = {
      oneOf: [schemaRef(successComponent), schemaRef(failureComponent)],
    };
    routeResponseRefs.push(schemaRef(responseComponent));
    if (entry.procedure.stream !== undefined) {
      schemas[streamEventComponent] = {
        oneOf: [
          {
            type: 'object',
            required: ['event', 'data'],
            properties: {
              event: { const: 'data' },
              data: schemaRef(streamComponent),
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: ['event', 'data'],
            properties: {
              event: { const: 'error' },
              data: schemaRef(failureComponent),
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: ['event', 'data'],
            properties: {
              event: { const: 'done' },
              data: {
                type: 'object',
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        ],
      };
      routeStreamEventRefs.push(schemaRef(streamEventComponent));
    }
    return {
      id: entry.id,
      kind:
        entry.procedure.meta.kind ??
        (entry.procedure.stream === undefined ? 'query' : 'subscription'),
      summary: entry.procedure.meta.summary ?? entry.id,
      description: entry.procedure.meta.description ?? '',
      tags: entry.procedure.meta.tags ?? [],
      auth: entry.procedure.meta.auth ?? [],
      authPolicy: entry.procedure.auth?.name ?? null,
      rateLimit: entry.procedure.meta.rateLimit ?? null,
      client: createClientDocs(entry.id, entry.procedure.stream),
      inputRef: `#/components/schemas/${componentName(entry.id, 'Input')}`,
      requestRef: `#/components/schemas/${requestComponent}`,
      responseRef: `#/components/schemas/${responseComponent}`,
      successRef: `#/components/schemas/${successComponent}`,
      failureRef: `#/components/schemas/${failureComponent}`,
      errorRef: `#/components/schemas/${errorComponent}`,
      streamEventRef:
        entry.procedure.stream === undefined
          ? null
          : `#/components/schemas/${streamEventComponent}`,
      headersRef:
        entry.procedure.headers === undefined
          ? null
          : `#/components/schemas/${componentName(entry.id, 'Headers')}`,
      responseHeadersRef:
        entry.procedure.responseHeaders === undefined
          ? null
          : `#/components/schemas/${componentName(entry.id, 'ResponseHeaders')}`,
      outputRef:
        entry.procedure.output === undefined
          ? null
          : `#/components/schemas/${componentName(entry.id, 'Output')}`,
      streamRef:
        entry.procedure.stream === undefined
          ? null
          : `#/components/schemas/${componentName(entry.id, 'Stream')}`,
      errors,
    };
  });
  if (routeRequestRefs.length > 0) {
    schemas['RpcRequest'] = { oneOf: routeRequestRefs };
  }
  if (routeResponseRefs.length > 0) {
    schemas['RpcResponse'] = { oneOf: routeResponseRefs };
  }
  if (routeStreamEventRefs.length > 0) {
    schemas['RpcStreamEvent'] = { oneOf: routeStreamEventRefs };
  }
  const rpcRequestSchema =
    routeRequestRefs.length > 0
      ? schemaRef('RpcRequest')
      : { $ref: '#/components/schemas/RpcRequest' };
  const rpcResponseSchema =
    routeResponseRefs.length > 0
      ? schemaRef('RpcResponse')
      : {
          oneOf: [
            { $ref: '#/components/schemas/RpcSuccess' },
            { $ref: '#/components/schemas/RpcFailure' },
          ],
        };

  return {
    openapi: '3.1.0',
    info: {
      title: 'Joor RPC API',
      version: '0.0.0',
    },
    paths: {
      [path]: {
        post: {
          summary: 'Joor RPC endpoint',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    rpcRequestSchema,
                    {
                      type: 'array',
                      items: rpcRequestSchema,
                    },
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'RPC envelope',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      rpcResponseSchema,
                      {
                        type: 'array',
                        items: rpcResponseSchema,
                      },
                    ],
                  },
                },
                'text/event-stream': {
                  schema: { type: 'string' },
                  'x-joor-stream-event-schema':
                    routeStreamEventRefs.length > 0
                      ? schemaRef('RpcStreamEvent')
                      : null,
                },
              },
            },
          },
          'x-joor-procedures': procedures as JsonValue,
        },
      },
    },
    components: {
      schemas,
    },
  };
};
