import { dirname, join, resolve } from 'node:path';
import type { JoorConfig } from '../config.js';
import { findConfigFile, loadConfig } from './config.js';
import { emitArtifacts } from './emit.js';
import { loadProcedures } from './load.js';
import type { CompilerManifest } from './manifest.js';

export interface BuildOptions {
  readonly cwd?: string;
  readonly config?: string;
  readonly entry?: string;
  readonly outDir?: string;
}

export type BuildDispatcherProfile = 'safe' | 'trusted' | 'bare';

export interface BuildResult {
  readonly entry: string;
  readonly outDir: string;
  readonly configPath?: string;
  readonly profiles: {
    readonly dispatcher: BuildDispatcherProfile;
    readonly denoDispatcher: BuildDispatcherProfile;
  };
  readonly selectedArtifacts: {
    readonly dispatcher: string;
    readonly denoDispatcher: string;
  };
  readonly artifacts: {
    readonly manifest: string;
    readonly dispatcher: string;
    readonly dispatcherSafe: string;
    readonly dispatcherStreaming: string;
    readonly denoDispatcher: string;
    readonly denoDispatcherSafe: string;
    readonly client: string;
    readonly fetch: string;
    readonly cloudflare: string;
    readonly next: string;
    readonly vercel: string;
    readonly netlify: string;
    readonly awsLambda: string;
    readonly node: string;
    readonly bun: string;
    readonly deno: string;
    readonly procedure: string;
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

const unsafeFastPath = (config: JoorConfig): boolean =>
  config.enforceRateLimit === false &&
  config.validateHeaders === false &&
  config.validateInput === false &&
  config.validateOutput === false &&
  config.validateResponseHeaders === false;

const canUseBareDispatcher = (manifest: CompilerManifest): boolean =>
  manifest.procedures.every(
    (entry) =>
      entry.procedure.output !== undefined &&
      entry.procedure.context === 'none' &&
      entry.procedure.contextlessHandler !== undefined &&
      entry.procedure.auth === undefined &&
      entry.procedure.headers === undefined &&
      entry.procedure.responseHeaders === undefined &&
      entry.procedure.meta.cache === undefined &&
      entry.procedure.meta.rateLimit === undefined
  );

const selectedDispatcherProfile = (
  manifest: CompilerManifest,
  config: JoorConfig
): BuildDispatcherProfile => {
  if (!unsafeFastPath(config)) return 'safe';
  if (manifest.procedures.some((entry) => entry.procedure.auth !== undefined)) {
    return 'safe';
  }
  return canUseBareDispatcher(manifest) ? 'bare' : 'trusted';
};

const dispatcherArtifact = (
  outDir: string,
  profile: BuildDispatcherProfile,
  prefix = 'dispatcher'
): string => join(outDir, `${prefix}.${profile}.ts`);

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
  const profile = selectedDispatcherProfile(manifest, config);
  await emitArtifacts(manifest, {
    outDir,
    config,
    ...(configPath === undefined ? {} : { configPath }),
  });
  return {
    entry,
    outDir,
    ...(configPath === undefined ? {} : { configPath }),
    profiles: {
      dispatcher: profile,
      denoDispatcher: profile,
    },
    selectedArtifacts: {
      dispatcher: dispatcherArtifact(outDir, profile),
      denoDispatcher: dispatcherArtifact(outDir, profile, 'deno-dispatcher'),
    },
    artifacts: {
      manifest: join(outDir, 'manifest.ts'),
      dispatcher: join(outDir, 'dispatcher.ts'),
      dispatcherSafe: join(outDir, 'dispatcher.safe.ts'),
      dispatcherStreaming: join(outDir, 'dispatcher.streaming.ts'),
      denoDispatcher: join(outDir, 'deno-dispatcher.ts'),
      denoDispatcherSafe: join(outDir, 'deno-dispatcher.safe.ts'),
      client: join(outDir, 'client.ts'),
      fetch: join(outDir, 'fetch.ts'),
      cloudflare: join(outDir, 'cloudflare.ts'),
      next: join(outDir, 'next.ts'),
      vercel: join(outDir, 'vercel.ts'),
      netlify: join(outDir, 'netlify.ts'),
      awsLambda: join(outDir, 'aws-lambda.ts'),
      node: join(outDir, 'node.ts'),
      bun: join(outDir, 'bun.ts'),
      deno: join(outDir, 'deno.ts'),
      procedure: join(outDir, 'procedure.ts'),
      openapi: join(outDir, 'openapi.json'),
      aiDocs: join(outDir, 'ai-docs.json'),
    },
  };
};
