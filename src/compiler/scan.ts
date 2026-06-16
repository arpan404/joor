import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export interface ProcedureFile {
  readonly path: string;
  readonly id: string;
}

const toProcedureId = (entryRoot: string, file: string): string => {
  const relativePath = relative(entryRoot, file);
  const noExtension = relativePath.replace(/\.rpc\.[cm]?[tj]s$/, '');
  const parts = noExtension.split(sep).filter((part) => part.length > 0);
  return parts.join('.');
};

const isProcedureModule = (fileName: string): boolean =>
  /\.rpc\.[cm]?[tj]s$/.test(fileName);

export const scanProcedureFiles = async (
  entry: string
): Promise<ProcedureFile[]> => {
  const files: string[] = [];
  const scan = async (dir: string): Promise<void> => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const item of entries) {
      const path = join(dir, item.name);
      if (item.isDirectory()) {
        await scan(path);
        continue;
      }
      if (item.isFile() && isProcedureModule(item.name)) {
        files.push(path);
      }
    }
  };
  await scan(entry);
  return files
    .sort()
    .map((file) => ({ path: file, id: toProcedureId(entry, file) }));
};
