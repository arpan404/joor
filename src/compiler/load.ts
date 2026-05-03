import { pathToFileURL } from 'node:url';
import type { ProcedureRuntime } from '../procedure/types.js';
import type { CompilerManifest, LoadedProcedure } from './manifest.js';
import { scanProcedureFiles } from './scan.js';

interface ProcedureModule {
  default?: ProcedureRuntime;
}

const assertProcedure = (
  value: ProcedureRuntime | undefined,
  file: string
): ProcedureRuntime => {
  if (value === undefined || typeof value.handler !== 'function') {
    throw new Error(
      `Procedure file must default-export defineProcedure(...): ${file}`
    );
  }
  return value;
};

export const loadProcedures = async (
  entry: string
): Promise<CompilerManifest> => {
  const files = await scanProcedureFiles(entry);
  const seen = new Set<string>();
  const procedures: LoadedProcedure[] = [];
  for (const file of files) {
    if (seen.has(file.id))
      throw new Error(`Duplicate procedure id: ${file.id}`);
    seen.add(file.id);
    const module = (await import(
      pathToFileURL(file.path).href
    )) as ProcedureModule;
    procedures.push({
      id: file.id,
      importPath: file.path,
      exportName: file.id.replace(/[^a-zA-Z0-9_$]/g, '_'),
      procedure: assertProcedure(module.default, file.path),
    });
  }
  return { procedures };
};
