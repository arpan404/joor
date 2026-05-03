import { dirname, resolve } from 'node:path';
import type { JoorConfig } from '../config.js';
import { findConfigFile, loadConfig } from './config.js';
import { emitArtifacts } from './emit.js';
import { loadProcedures } from './load.js';

export interface BuildOptions {
  cwd?: string;
  config?: string;
  entry?: string;
  outDir?: string;
}

export const build = async (options: BuildOptions): Promise<void> => {
  const cwd = resolve(options.cwd ?? process.cwd());
  const configPath =
    options.config === undefined
      ? findConfigFile(cwd)
      : resolve(options.config);
  const config: JoorConfig = await loadConfig(cwd, configPath);
  const configDir = configPath === undefined ? cwd : dirname(configPath);
  const entry =
    options.entry === undefined
      ? resolve(configDir, config.entry ?? './rpc')
      : resolve(cwd, options.entry);
  const outDir =
    options.outDir === undefined
      ? resolve(configDir, config.outDir ?? './.joor')
      : resolve(cwd, options.outDir);
  const manifest = await loadProcedures(entry);
  await emitArtifacts(manifest, {
    outDir,
    config,
    ...(configPath === undefined ? {} : { configPath }),
  });
};
