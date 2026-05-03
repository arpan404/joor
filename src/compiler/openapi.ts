import type { JsonObject, JsonValue } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { CompilerManifest } from './manifest.js';

export const createOpenApiDocument = (
  manifest: CompilerManifest
): JsonObject => {
  const procedures = manifest.procedures.map(
    (entry): JsonObject => ({
      id: entry.id,
      summary: entry.procedure.meta.summary ?? entry.id,
      input: toJsonSchema(entry.procedure.input),
      output:
        entry.procedure.output === undefined
          ? {}
          : toJsonSchema(entry.procedure.output),
      ...(entry.procedure.stream === undefined
        ? {}
        : { stream: toJsonSchema(entry.procedure.stream) }),
      errors: Object.fromEntries(
        Object.entries(entry.procedure.errors).map(([code, schema]) => [
          code,
          toJsonSchema(schema),
        ])
      ) as JsonObject,
    })
  );

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
            },
          },
          'x-joor-procedures': procedures as JsonValue,
        },
      },
    },
    components: {
      schemas: {
        RpcRequest: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
            input: {},
            traceId: { type: 'string' },
          },
        },
      },
    },
  };
};
