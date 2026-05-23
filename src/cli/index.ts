#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { build } from '../compiler/build.js';

const readOption = (args: string[], name: string): string | undefined => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (value === undefined) throw new Error(`Missing value for ${name}`);
  return value;
};

const readBuildOptions = (args: string[]) => {
  const config = readOption(args, '--config');
  const entry = readOption(args, '--entry');
  const outDir = readOption(args, '--out');
  return {
    ...(config === undefined ? {} : { config }),
    ...(entry === undefined ? {} : { entry }),
    ...(outDir === undefined ? {} : { outDir }),
  };
};

const run = (command: string, args: string[]): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} failed`));
    });
  });

const runBuild = async (args: string[]): Promise<void> => {
  await build(readBuildOptions(args));
};

const runDev = async (args: string[]): Promise<void> => {
  const options = readBuildOptions(args);
  const entry = resolve(options.entry ?? './rpc');
  await build(options);
  console.info(`Watching ${entry}`);
  let building = false;
  watch(dirname(entry), { recursive: true }, () => {
    if (building) return;
    building = true;
    build(options)
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Build failed';
        console.error(message);
      })
      .finally(() => {
        building = false;
      });
  });
};

const runOpenApi = async (args: string[]): Promise<void> => {
  await build(readBuildOptions(args));
  console.info('OpenAPI JSON written to .joor/openapi.json');
};

const runDoctor = async (): Promise<void> => {
  await run('npm', ['run', 'format:check']);
  await run('npm', ['run', 'lint']);
  await run('npm', ['run', 'test']);
  await run('npm', ['run', 'build']);
};

const main = async (): Promise<void> => {
  const [, , command, ...args] = process.argv;
  switch (command) {
    case 'build':
      await runBuild(args);
      return;
    case 'dev':
      await runDev(args);
      return;
    case 'typecheck':
      await run('npm', ['run', 'typecheck']);
      return;
    case 'openapi':
      await runOpenApi(args);
      return;
    case 'doctor':
      await runDoctor();
      return;
    default:
      throw new Error(`Unknown command: ${command ?? ''}`);
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Joor CLI failed';
  console.error(message);
  process.exitCode = 1;
});
