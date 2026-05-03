import { mkdir, writeFile } from 'node:fs/promises';
import { relative, dirname } from 'node:path';
import type { CompilerManifest } from './manifest.js';
import { createAiDocs } from './ai-docs.js';
import { createOpenApiDocument } from './openapi.js';

export interface EmitOptions {
  outDir: string;
}

const toImportPath = (fromFile: string, targetFile: string): string => {
  const rel = relative(dirname(fromFile), targetFile).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
};

const writeJson = async (path: string, value: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
};

const emitManifest = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  const manifestFile = `${outDir}/manifest.ts`;
  const imports = manifest.procedures
    .map((entry) => {
      const importPath = toImportPath(manifestFile, entry.importPath);
      return `import ${entry.exportName} from '${importPath}';`;
    })
    .join('\n');
  const entries = manifest.procedures
    .map(
      (entry) =>
        `    ${JSON.stringify(entry.id)}: { ...${entry.exportName}, id: ${JSON.stringify(entry.id)} },`
    )
    .join('\n');
  const source = `${imports}

export const manifest = {
  procedures: {
${entries}
  },
} as const;
`;
  await writeFile(manifestFile, source);
};

const emitDispatcher = async (outDir: string): Promise<void> => {
  await writeFile(
    `${outDir}/dispatcher.ts`,
    `import { createJoorHandler } from 'joor';
import { manifest } from './manifest.js';

export const fetch = createJoorHandler(manifest);
`
  );
};

const emitClient = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  const groups = new Map<string, string[]>();
  for (const entry of manifest.procedures) {
    const [group, name] = entry.id.split('.');
    if (group === undefined || name === undefined) continue;
    const list = groups.get(group) ?? [];
    list.push(entry.id);
    groups.set(group, list);
  }
  const groupBlocks = [...groups.entries()]
    .map(([group, ids]) => {
      const methods = ids
        .map((id) => {
          const name = id.split('.').at(-1);
          if (name === undefined) return '';
          const typeRef = `typeof manifest.procedures[${JSON.stringify(id)}]`;
          return `    ${name}: {
      call: (input: ProcedureInput<${typeRef}>) => transport.call<${typeRef}>(${JSON.stringify(id)}, input),
      request: (input: ProcedureInput<${typeRef}>) => transport.request<${typeRef}>(${JSON.stringify(id)}, input),
      stream: (input: ProcedureInput<${typeRef}>) => transport.stream<${typeRef}>(${JSON.stringify(id)}, input),
    },`;
        })
        .join('\n');
      return `  ${group}: {
${methods}
  },`;
    })
    .join('\n');
  await writeFile(
    `${outDir}/client.ts`,
    `import { createClient as createTransportClient } from 'joor/client';
import type { ProcedureInput } from 'joor';
import { manifest } from './manifest.js';

export const createClient = (options: Parameters<typeof createTransportClient>[0]) => {
  const transport = createTransportClient(options);
  return {
${groupBlocks}
    batch: transport.batch,
  };
};
`
  );
};

export const emitArtifacts = async (
  manifest: CompilerManifest,
  options: EmitOptions
): Promise<void> => {
  await mkdir(options.outDir, { recursive: true });
  await emitManifest(manifest, options.outDir);
  await emitDispatcher(options.outDir);
  await emitClient(manifest, options.outDir);
  await writeJson(
    `${options.outDir}/openapi.json`,
    createOpenApiDocument(manifest)
  );
  await writeJson(`${options.outDir}/ai-docs.json`, createAiDocs(manifest));
};
