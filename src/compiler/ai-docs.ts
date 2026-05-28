import type { JsonObject, JsonValue } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { HeaderObjectSchema } from '../schema/types.js';
import { createClientDocs } from './client-docs.js';
import type { CompilerManifest } from './manifest.js';

const hasRequiredObjectFields = (schema: HeaderObjectSchema): boolean =>
  Object.values(schema.shape).some((child) => child.kind !== 'optional');

const frameworkErrorSchema: JsonObject = {
  type: 'object',
  required: ['code', 'message', 'status'],
  properties: {
    code: { type: 'string' },
    message: { type: 'string' },
    status: { type: 'integer' },
    details: {},
  },
};

export const createAiDocs = (manifest: CompilerManifest): JsonObject => ({
  framework: 'joor',
  schemaVersion: '0.1.0',
  transport: {
    endpoint: '/rpc',
    methods: ['POST'],
    streaming: 'text/event-stream',
  },
  procedures: manifest.procedures.map((entry) => ({
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
    examples: [],
    client: createClientDocs(entry.id, entry.procedure.stream),
    headersSchema:
      entry.procedure.headers === undefined
        ? {}
        : toJsonSchema(entry.procedure.headers),
    requestSchema: {
      type: 'object',
      required: ['id', 'input'],
      properties: {
        id: { const: entry.id },
        input: toJsonSchema(entry.procedure.input),
        traceId: { type: 'string' },
      },
      additionalProperties: false,
    },
    responseHeadersSchema:
      entry.procedure.responseHeaders === undefined
        ? {}
        : toJsonSchema(entry.procedure.responseHeaders),
    inputSchema: toJsonSchema(entry.procedure.input),
    outputSchema:
      entry.procedure.output === undefined
        ? {}
        : toJsonSchema(entry.procedure.output),
    streamSchema:
      entry.procedure.stream === undefined
        ? {}
        : toJsonSchema(entry.procedure.stream),
    streamEventSchema:
      entry.procedure.stream === undefined
        ? {}
        : {
            oneOf: [
              {
                type: 'object',
                required: ['event', 'data'],
                properties: {
                  event: { const: 'data' },
                  data: toJsonSchema(entry.procedure.stream),
                },
                additionalProperties: false,
              },
              {
                type: 'object',
                required: ['event', 'data'],
                properties: {
                  event: { const: 'error' },
                  data: {
                    type: 'object',
                    required: ['ok', 'id', 'error', 'traceId'],
                    properties: {
                      ok: { const: false },
                      id: { const: entry.id },
                      error: {
                        oneOf: [
                          ...Object.entries(entry.procedure.errors).map(
                            ([code, schema]) => ({
                              type: 'object',
                              required: [
                                'code',
                                'message',
                                'status',
                                'details',
                              ],
                              properties: {
                                code: { const: code },
                                message: { type: 'string' },
                                status: { type: 'integer' },
                                details: toJsonSchema(schema),
                              },
                              additionalProperties: false,
                            })
                          ),
                          frameworkErrorSchema,
                        ] as readonly JsonValue[],
                      },
                      traceId: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
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
          },
    successSchema: {
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
            : toJsonSchema(entry.procedure.output),
        traceId: { type: 'string' },
        ...(entry.procedure.responseHeaders === undefined
          ? {}
          : { headers: toJsonSchema(entry.procedure.responseHeaders) }),
      },
      additionalProperties: false,
    },
    errorSchema: {
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
        frameworkErrorSchema,
      ] as readonly JsonValue[],
    },
    failureSchema: {
      type: 'object',
      required: ['ok', 'id', 'error', 'traceId'],
      properties: {
        ok: { const: false },
        id: { const: entry.id },
        error: {
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
            frameworkErrorSchema,
          ] as readonly JsonValue[],
        },
        traceId: { type: 'string' },
      },
      additionalProperties: false,
    },
    responseSchema: {
      oneOf: [
        {
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
                : toJsonSchema(entry.procedure.output),
            traceId: { type: 'string' },
            ...(entry.procedure.responseHeaders === undefined
              ? {}
              : { headers: toJsonSchema(entry.procedure.responseHeaders) }),
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          required: ['ok', 'id', 'error', 'traceId'],
          properties: {
            ok: { const: false },
            id: { const: entry.id },
            error: {
              oneOf: [
                ...Object.entries(entry.procedure.errors).map(
                  ([code, schema]) => ({
                    type: 'object',
                    required: ['code', 'message', 'status', 'details'],
                    properties: {
                      code: { const: code },
                      message: { type: 'string' },
                      status: { type: 'integer' },
                      details: toJsonSchema(schema),
                    },
                    additionalProperties: false,
                  })
                ),
                frameworkErrorSchema,
              ] as readonly JsonValue[],
            },
            traceId: { type: 'string' },
          },
          additionalProperties: false,
        },
      ],
    },
    errors: Object.fromEntries(
      Object.entries(entry.procedure.errors).map(([code, schema]) => [
        code,
        toJsonSchema(schema),
      ])
    ),
  })),
});
