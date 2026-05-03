import { mkdir, writeFile } from 'node:fs/promises';
import { relative, dirname } from 'node:path';
import type { JoorConfig } from '../config.js';
import type { CompilerManifest } from './manifest.js';
import { createAiDocs } from './ai-docs.js';
import { createOpenApiDocument } from './openapi.js';

export interface EmitOptions {
  outDir: string;
  config?: JoorConfig;
  configPath?: string;
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

const emitDispatcher = async (
  outDir: string,
  configPath?: string
): Promise<void> => {
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(`${outDir}/dispatcher.ts`, configPath)}';\n`;
  const configArg = configPath === undefined ? '' : ', config';
  await writeFile(
    `${outDir}/dispatcher.ts`,
    `import { createJoorHandler } from 'joor';
${configImport}import { manifest } from './manifest.js';

export const fetch = createJoorHandler(manifest${configArg});
`
  );
};

const emitClient = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  interface ClientTree {
    procedures: string[];
    children: Map<string, ClientTree>;
  }
  const createNode = (): ClientTree => ({
    procedures: [],
    children: new Map(),
  });
  const tree = createNode();
  for (const entry of manifest.procedures) {
    const parts = entry.id.split('.');
    const methodName = parts.pop();
    if (methodName === undefined) continue;
    let node = tree;
    for (const part of parts) {
      const child = node.children.get(part) ?? createNode();
      node.children.set(part, child);
      node = child;
    }
    node.procedures.push(entry.id);
  }
  const renderNode = (node: ClientTree, depth: number): string => {
    const indent = '  '.repeat(depth);
    const childIndent = '  '.repeat(depth + 1);
    const childBlocks = [...node.children.entries()]
      .map(
        ([name, child]) => `${indent}${name}: {
${renderNode(child, depth + 1)}
${indent}},`
      )
      .join('\n');
    const procedureBlocks = node.procedures
      .map((id) => {
        const name = id.split('.').at(-1);
        if (name === undefined) return '';
        const typeRef = `typeof manifest.procedures[${JSON.stringify(id)}]`;
        return `${indent}${name}: {
${childIndent}call: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.call<${typeRef}>(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),
${childIndent}request: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.request<${typeRef}>(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),
${childIndent}stream: (...args: ClientArgs<${typeRef}>) =>
${childIndent}  transport.stream<${typeRef}>(${JSON.stringify(id)}, args[0], ...optionalOptions(args[1])),
${indent}},`;
      })
      .join('\n');
    return [childBlocks, procedureBlocks].filter(Boolean).join('\n');
  };
  const clientBody = renderNode(tree, 2);
  await writeFile(
    `${outDir}/client.ts`,
    `import { createClient as createTransportClient } from 'joor/client';
import type { ClientRequestOptions } from 'joor/client';
import type { ProcedureHeaders, ProcedureInput, ProcedureOutput, RpcEnvelope, StreamEvent } from 'joor';
import { manifest } from './manifest.js';

export type Manifest = typeof manifest;
export type Result<TId extends keyof Manifest['procedures']> = RpcEnvelope<ProcedureOutput<Manifest['procedures'][TId]>>;
export type Stream<TId extends keyof Manifest['procedures']> = StreamEvent<Manifest['procedures'][TId]>;
export type ClientArgs<TProcedure> = Record<string, never> extends ProcedureHeaders<TProcedure>
  ? [input: ProcedureInput<TProcedure>, options?: ClientRequestOptions<TProcedure>]
  : [input: ProcedureInput<TProcedure>, options: ClientRequestOptions<TProcedure>];

const optionalOptions = <TProcedure>(options: ClientRequestOptions<TProcedure> | undefined) =>
  options === undefined ? [] : [options] as const;

export const createClient = (options: Parameters<typeof createTransportClient>[0]) => {
  const transport = createTransportClient(options);
  return {
${clientBody}
    batch: transport.batch,
  };
};

export const client = createClient({ url: '/rpc' });
`
  );
};

const emitProcedureHelper = async (
  outDir: string,
  configPath?: string
): Promise<void> => {
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(`${outDir}/procedure.ts`, configPath)}';\n`;
  const contextType =
    configPath === undefined ? 'object' : 'JoorConfigContext<typeof config>';
  await writeFile(
    `${outDir}/procedure.ts`,
    `import { defineProcedure } from 'joor';
import type { JoorConfigContext } from 'joor';
${configImport}
export const procedure = defineProcedure.withContext<${contextType}>();
`
  );
};

export const emitArtifacts = async (
  manifest: CompilerManifest,
  options: EmitOptions
): Promise<void> => {
  await mkdir(options.outDir, { recursive: true });
  await emitManifest(manifest, options.outDir);
  await emitDispatcher(options.outDir, options.configPath);
  await emitClient(manifest, options.outDir);
  await emitProcedureHelper(options.outDir, options.configPath);
  await writeJson(
    `${options.outDir}/openapi.json`,
    createOpenApiDocument(manifest)
  );
  await writeJson(`${options.outDir}/ai-docs.json`, createAiDocs(manifest));
};
