import { relative, sep } from 'node:path';
import fastGlob from 'fast-glob';

export interface ProcedureFile {
  path: string;
  id: string;
}

const toProcedureId = (entryRoot: string, file: string): string => {
  const relativePath = relative(entryRoot, file);
  const noExtension = relativePath.replace(/\.rpc\.ts$/, '');
  const parts = noExtension.split(sep).filter((part) => part.length > 0);
  return parts.join('.');
};

export const scanProcedureFiles = async (
  entry: string
): Promise<ProcedureFile[]> => {
  const files = await fastGlob('**/*.rpc.ts', {
    cwd: entry,
    absolute: true,
    onlyFiles: true,
  });
  return files
    .sort()
    .map((file) => ({ path: file, id: toProcedureId(entry, file) }));
};
