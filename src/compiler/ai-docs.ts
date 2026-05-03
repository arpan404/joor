import type { JsonObject } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { CompilerManifest } from './manifest.js';

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
    rateLimit: entry.procedure.meta.rateLimit ?? null,
    examples: [],
    headersSchema:
      entry.procedure.headers === undefined
        ? {}
        : toJsonSchema(entry.procedure.headers),
    inputSchema: toJsonSchema(entry.procedure.input),
    outputSchema:
      entry.procedure.output === undefined
        ? {}
        : toJsonSchema(entry.procedure.output),
    streamSchema:
      entry.procedure.stream === undefined
        ? {}
        : toJsonSchema(entry.procedure.stream),
    errors: Object.fromEntries(
      Object.entries(entry.procedure.errors).map(([code, schema]) => [
        code,
        toJsonSchema(schema),
      ])
    ),
  })),
});
