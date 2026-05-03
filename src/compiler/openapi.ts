import type { JsonObject, JsonValue } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { CompilerManifest } from './manifest.js';

const componentName = (id: string, suffix: string): string =>
  `${id
    .split('.')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join('')}${suffix}`;

export const createOpenApiDocument = (
  manifest: CompilerManifest
): JsonObject => {
  const schemas: Record<string, JsonValue> = {
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
  const procedures = manifest.procedures.map((entry): JsonObject => {
    schemas[componentName(entry.id, 'Input')] = toJsonSchema(
      entry.procedure.input
    );
    if (entry.procedure.headers !== undefined) {
      schemas[componentName(entry.id, 'Headers')] = toJsonSchema(
        entry.procedure.headers
      );
    }
    if (entry.procedure.responseHeaders !== undefined) {
      schemas[componentName(entry.id, 'ResponseHeaders')] = toJsonSchema(
        entry.procedure.responseHeaders
      );
    }
    if (entry.procedure.output !== undefined) {
      schemas[componentName(entry.id, 'Output')] = toJsonSchema(
        entry.procedure.output
      );
    }
    if (entry.procedure.stream !== undefined) {
      schemas[componentName(entry.id, 'Stream')] = toJsonSchema(
        entry.procedure.stream
      );
    }
    const errors = Object.fromEntries(
      Object.entries(entry.procedure.errors).map(([code, schema]) => [
        code,
        toJsonSchema(schema),
      ])
    ) as JsonObject;
    schemas[componentName(entry.id, 'Errors')] = errors;
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
      inputRef: `#/components/schemas/${componentName(entry.id, 'Input')}`,
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

  return {
    openapi: '3.1.0',
    info: {
      title: 'Joor RPC API',
      version: '0.0.0',
    },
    paths: {
      '/rpc': {
        post: {
          summary: 'Joor RPC endpoint',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/RpcRequest' },
                    {
                      type: 'array',
                      items: { $ref: '#/components/schemas/RpcRequest' },
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
                      { $ref: '#/components/schemas/RpcSuccess' },
                      { $ref: '#/components/schemas/RpcFailure' },
                      {
                        type: 'array',
                        items: {
                          oneOf: [
                            { $ref: '#/components/schemas/RpcSuccess' },
                            { $ref: '#/components/schemas/RpcFailure' },
                          ],
                        },
                      },
                    ],
                  },
                },
                'text/event-stream': {
                  schema: { type: 'string' },
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
