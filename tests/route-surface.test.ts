import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const srcRoot = join(repoRoot, 'src');
const compilerEmitter = join(srcRoot, 'compiler/emit.ts');
const packageSubpathTest = join(repoRoot, 'tests/package-subpaths.test-d.ts');
const fixture = join(repoRoot, 'tests/fixtures/basic-app/rpc');

type ExportedSymbol = {
  readonly file: string;
  readonly name: string;
};

const routeNamePattern = /(?:RouteUnary|UnaryRoute|RouteStream|StreamRoute)/;

const collectTypeScriptFiles = async (
  dir: string
): Promise<readonly string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry): Promise<readonly string[]> => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return collectTypeScriptFiles(path);
      return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
    })
  );

  return files.flat();
};

const exportedName = (specifier: string): string => {
  const parts = specifier.trim().split(/\s+as\s+/);
  return (parts[1] ?? parts[0] ?? '').trim();
};

const collectExportedSymbols = (
  file: string,
  source: string
): ExportedSymbol[] => {
  const symbols: ExportedSymbol[] = [];

  for (const match of source.matchAll(
    /\bexport\s+(?:declare\s+)?(?:const|function|type|interface|class)\s+([A-Za-z_][A-Za-z0-9_]*)/g
  )) {
    const name = match[1];
    if (name !== undefined) symbols.push({ file, name });
  }

  for (const match of source.matchAll(
    /\bexport\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"][^'"]+['"]/g
  )) {
    const specifiers = match[1];
    if (specifiers === undefined) continue;
    for (const specifier of specifiers.split(',')) {
      const name = exportedName(specifier);
      if (name.length > 0) symbols.push({ file, name });
    }
  }

  return symbols;
};

const routeTwinName = (name: string): string | undefined => {
  if (name.includes('RouteUnary')) {
    return name.replaceAll('RouteUnary', 'UnaryRoute');
  }
  if (name.includes('UnaryRoute')) {
    return name.replaceAll('UnaryRoute', 'RouteUnary');
  }
  if (name.includes('RouteStream')) {
    return name.replaceAll('RouteStream', 'StreamRoute');
  }
  if (name.includes('StreamRoute')) {
    return name.replaceAll('StreamRoute', 'RouteStream');
  }

  return undefined;
};

const sourceExportSets = async (): Promise<
  Map<string, ReadonlySet<string>>
> => {
  const files = await collectTypeScriptFiles(srcRoot);
  const entries = await Promise.all(
    files.map(async (file): Promise<readonly [string, ReadonlySet<string>]> => {
      const source = await readFile(file, 'utf8');
      const names = collectExportedSymbols(file, source).map(
        ({ name }) => name
      );
      return [file, new Set(names)];
    })
  );

  return new Map(entries);
};

const publicRouteExports = async (): Promise<readonly ExportedSymbol[]> => {
  const files = await collectTypeScriptFiles(srcRoot);
  const symbols = await Promise.all(
    files
      .filter((file) => file !== compilerEmitter)
      .map(async (file): Promise<readonly ExportedSymbol[]> => {
        const source = await readFile(file, 'utf8');
        return collectExportedSymbols(file, source);
      })
  );

  return symbols.flat().filter(({ name }) => routeNamePattern.test(name));
};

const generatedExportSets = async (): Promise<
  Map<string, ReadonlySet<string>>
> => {
  const outDir = await mkdtemp(join(tmpdir(), 'joor-route-surface-'));
  try {
    await build({ entry: fixture, outDir });
    const files = await collectTypeScriptFiles(outDir);
    const entries = await Promise.all(
      files.map(
        async (file): Promise<readonly [string, ReadonlySet<string>]> => {
          const source = await readFile(file, 'utf8');
          const names = collectExportedSymbols(file, source).map(
            ({ name }) => name
          );
          return [file, new Set(names)];
        }
      )
    );

    return new Map(entries);
  } finally {
    await rm(outDir, { force: true, recursive: true });
  }
};

describe('route public surface', () => {
  it('keeps route-first and noun-first exported aliases paired', async () => {
    const exportSets = await sourceExportSets();
    const missing = [...exportSets]
      .flatMap(([file, names]) =>
        [...names].flatMap((name) => {
          const twin = routeTwinName(name);
          return twin !== undefined && !names.has(twin)
            ? [`${relative(repoRoot, file)}: ${name} is missing ${twin}`]
            : [];
        })
      )
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps generated route-first and noun-first aliases paired', async () => {
    const exportSets = await generatedExportSets();
    const missing = [...exportSets]
      .flatMap(([file, names]) =>
        [...names].flatMap((name) => {
          const twin = routeTwinName(name);
          return twin !== undefined && !names.has(twin)
            ? [`${relative(repoRoot, file)}: ${name} is missing ${twin}`]
            : [];
        })
      )
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps package-subpath route type smoke coverage in sync', async () => {
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const packageSubpathTokens = new Set(
      [...packageSubpathSource.matchAll(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)].map(
        ([token]) => token
      )
    );
    const missing = (await publicRouteExports())
      .filter(({ name }) => !packageSubpathTokens.has(name))
      .map(({ file, name }) => `${relative(repoRoot, file)}: ${name}`)
      .sort();

    expect(missing).toEqual([]);
  });
});
