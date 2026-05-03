import type { JsonObject } from '../schema/json.js';
import { toJsonSchema } from '../schema/openapi.js';
import type { CompilerManifest } from './manifest.js';

export const createAiDocs = (manifest: CompilerManifest): JsonObject => ({
  framework: 'joor',
  procedures: manifest.procedures.map((entry) => ({
    id: entry.id,
    summary: entry.procedure.meta.summary ?? entry.id,
    description: entry.procedure.meta.description ?? '',
    tags: entry.procedure.meta.tags ?? [],
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
