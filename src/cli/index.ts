import { build } from '../compiler/build.js';

const readOption = (args: string[], name: string, fallback: string): string => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (value === undefined) throw new Error(`Missing value for ${name}`);
  return value;
};

const main = async (): Promise<void> => {
  const [, , command, ...args] = process.argv;
  if (command !== 'build') {
    throw new Error(`Unknown command: ${command ?? ''}`);
  }
  await build({
    entry: readOption(args, '--entry', './rpc'),
    outDir: readOption(args, '--out', './.joor'),
  });
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Joor CLI failed';
  console.error(message);
  process.exitCode = 1;
});
