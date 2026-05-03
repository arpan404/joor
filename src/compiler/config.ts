import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { JoorConfig } from '../config.js';

interface ConfigModule {
  default?: JoorConfig;
}

const defaultConfigFiles = [
  'joor.config.ts',
  'joor.config.js',
  'joor.config.mjs',
];

export const findConfigFile = (cwd: string): string | undefined => {
  for (const file of defaultConfigFiles) {
    const path = resolve(cwd, file);
    if (existsSync(path)) return path;
  }
  return undefined;
};

export const loadConfig = async (
  cwd: string,
  configPath?: string
): Promise<JoorConfig> => {
  const resolved =
    configPath === undefined ? findConfigFile(cwd) : resolve(configPath);
  if (resolved === undefined) return {};
  const module = (await import(pathToFileURL(resolved).href)) as ConfigModule;
  return module.default ?? {};
};
