import { resolve } from 'node:path';
import { emitArtifacts } from './emit.js';
import { loadProcedures } from './load.js';

export interface BuildOptions {
  entry: string;
  outDir: string;
}

export const build = async (options: BuildOptions): Promise<void> => {
  const entry = resolve(options.entry);
  const outDir = resolve(options.outDir);
  const manifest = await loadProcedures(entry);
  await emitArtifacts(manifest, { outDir });
};
