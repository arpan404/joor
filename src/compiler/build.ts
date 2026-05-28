import { dirname, join, resolve } from 'node:path';
import type { JoorConfig } from '../config.js';
import { findConfigFile, loadConfig } from './config.js';
import { emitArtifacts } from './emit.js';
import { loadProcedures } from './load.js';

export interface BuildOptions {
  readonly cwd?: string;
  readonly config?: string;
  readonly entry?: string;
  readonly outDir?: string;
}

export interface BuildResult {
  readonly entry: string;
  readonly outDir: string;
  readonly configPath?: string;
  readonly artifacts: {
    readonly manifest: string;
    readonly dispatcher: string;
    readonly client: string;
    readonly openapi: string;
    readonly aiDocs: string;
  };
}

const disabledSafetyOptions = (config: JoorConfig): string[] => {
  const disabled: string[] = [];
  if (config.enforceRateLimit === false) disabled.push('enforceRateLimit');
  if (config.validateHeaders === false) disabled.push('validateHeaders');
  if (config.validateInput === false) disabled.push('validateInput');
  if (config.validateOutput === false) disabled.push('validateOutput');
  if (config.validateResponseHeaders === false) {
    disabled.push('validateResponseHeaders');
  }
  return disabled;
};

const warnUnsafeBuildOptions = (config: JoorConfig): void => {
  const disabled = disabledSafetyOptions(config);
  if (disabled.length > 0) {
    console.warn(
      `[joor] safety checks disabled in generated runtime: ${disabled.join(', ')}. Use this only behind a trusted internal boundary.`
    );
  }
  if (config.cors?.origin === '*') {
    console.warn(
      '[joor] CORS origin is "*". Prefer an explicit origin for browser-facing deployments.'
    );
  }
};

export const build = async (options: BuildOptions): Promise<BuildResult> => {
  const cwd = resolve(options.cwd ?? process.cwd());
  const configPath =
    options.config === undefined
      ? findConfigFile(cwd)
      : resolve(options.config);
  const config: JoorConfig = await loadConfig(cwd, configPath);
  warnUnsafeBuildOptions(config);
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
  return {
    entry,
    outDir,
    ...(configPath === undefined ? {} : { configPath }),
    artifacts: {
      manifest: join(outDir, 'manifest.ts'),
      dispatcher: join(outDir, 'dispatcher.ts'),
      client: join(outDir, 'client.ts'),
      openapi: join(outDir, 'openapi.json'),
      aiDocs: join(outDir, 'ai-docs.json'),
    },
  };
};
