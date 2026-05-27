import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const srcRoot = join(repoRoot, 'src');
const rootIndex = join(srcRoot, 'index.ts');
const compilerEmitter = join(srcRoot, 'compiler/emit.ts');
const packageManifest = join(repoRoot, 'package.json');
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
  const parts = specifier
    .trim()
    .replace(/^type\s+/, '')
    .split(/\s+as\s+/);
  return (parts[1] ?? parts[0] ?? '').trim();
};

const sourceName = (specifier: string): string => {
  return (
    specifier
      .trim()
      .replace(/^type\s+/, '')
      .split(/\s+as\s+/)[0] ?? ''
  );
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

const collectStarExportFiles = (file: string, source: string): string[] => {
  const files: string[] = [];
  for (const match of source.matchAll(
    /\bexport\s+\*\s+from\s+['"]([^'"]+)['"]/g
  )) {
    const moduleSpecifier = match[1];
    if (moduleSpecifier === undefined) continue;
    files.push(join(dirname(file), moduleSpecifier.replace(/\.js$/, '.ts')));
  }

  return files;
};

const collectReachableExportNames = (
  file: string,
  sources: ReadonlyMap<string, string>,
  seen = new Set<string>()
): ReadonlySet<string> => {
  if (seen.has(file)) return new Set();
  seen.add(file);
  const source = sources.get(file);
  if (source === undefined) return new Set();

  const names = new Set(
    collectExportedSymbols(file, source).map(({ name }) => name)
  );
  for (const starExportFile of collectStarExportFiles(file, source)) {
    for (const name of collectReachableExportNames(
      starExportFile,
      sources,
      seen
    )) {
      names.add(name);
    }
  }

  return names;
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

const rootReExportSets = async (): Promise<
  Map<string, ReadonlySet<string>>
> => {
  const source = await readFile(rootIndex, 'utf8');
  const entries = new Map<string, Set<string>>();

  for (const match of source.matchAll(
    /\bexport\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g
  )) {
    const specifiers = match[1];
    const moduleSpecifier = match[2];
    if (specifiers === undefined || moduleSpecifier === undefined) continue;
    const sourceFile = join(
      dirname(rootIndex),
      moduleSpecifier.replace(/\.js$/, '.ts')
    );
    const names = entries.get(sourceFile) ?? new Set<string>();
    for (const specifier of specifiers.split(',')) {
      const name = sourceName(specifier).trim();
      if (name.length > 0) names.add(name);
    }
    entries.set(sourceFile, names);
  }

  return entries;
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

const packageSubpathForSourceFile = (file: string): string | undefined => {
  const relativeFile = relative(srcRoot, file);
  if (relativeFile === 'index.ts') return '.';
  if (relativeFile === 'config.ts') return './config';
  if (relativeFile === 'manifest.ts') return './manifest';
  if (relativeFile === 'context/index.ts') return './context';
  if (relativeFile === 'rpc/client.ts') return './client';
  if (relativeFile === 'rpc/index.ts') return './rpc';
  if (relativeFile === 'runtime/index.ts') return './runtime';
  if (relativeFile.startsWith('runtime/')) {
    return `./${relativeFile.replace(/\.ts$/, '')}`;
  }

  return undefined;
};

const barrelIndexForSourceFile = (file: string): string | undefined => {
  const relativeFile = relative(srcRoot, file);
  if (
    relativeFile.startsWith('runtime/') &&
    relativeFile !== 'runtime/index.ts'
  ) {
    return join(srcRoot, 'runtime/index.ts');
  }
  if (
    relativeFile === 'rpc/client.ts' ||
    relativeFile === 'rpc/dispatcher.ts'
  ) {
    return join(srcRoot, 'rpc/index.ts');
  }

  return undefined;
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

  it('keeps root route re-exports in sync with source modules', async () => {
    const rootExportNames = new Set(
      collectExportedSymbols(rootIndex, await readFile(rootIndex, 'utf8')).map(
        ({ name }) => name
      )
    );
    const rootReExports = await rootReExportSets();
    const publicExports = await publicRouteExports();
    const missing = publicExports
      .filter(({ file, name }) => {
        if (file === rootIndex) return false;
        return (
          !rootReExports.get(file)?.has(name) && !rootExportNames.has(name)
        );
      })
      .map(({ file, name }) => `${relative(repoRoot, file)}: ${name}`)
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps package exports mapped for route-bearing public files', async () => {
    const packageSource = await readFile(packageManifest, 'utf8');
    const packageJson = JSON.parse(packageSource) as {
      readonly exports?: Readonly<Record<string, unknown>>;
    };
    const packageExports = new Set(Object.keys(packageJson.exports ?? {}));
    const files = new Set((await publicRouteExports()).map(({ file }) => file));
    const missing = [...files]
      .flatMap((file) => {
        const packageSubpath = packageSubpathForSourceFile(file);
        if (
          packageSubpath === undefined ||
          packageExports.has(packageSubpath)
        ) {
          return [];
        }
        return [`${relative(repoRoot, file)}: ${packageSubpath}`];
      })
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps route-bearing barrel exports reachable', async () => {
    const files = await collectTypeScriptFiles(srcRoot);
    const sources = new Map(
      await Promise.all(
        files.map(
          async (file): Promise<readonly [string, string]> => [
            file,
            await readFile(file, 'utf8'),
          ]
        )
      )
    );
    const localExportNames = new Map(
      [...sources].map(([file, source]) => [
        file,
        new Set(collectExportedSymbols(file, source).map(({ name }) => name)),
      ])
    );
    const reachableExportNames = new Map(
      [...sources].map(([file]) => [
        file,
        collectReachableExportNames(file, sources),
      ])
    );
    const missing = [...localExportNames]
      .flatMap(([file, names]) => {
        const barrel = barrelIndexForSourceFile(file);
        if (barrel === undefined) return [];
        const barrelNames =
          reachableExportNames.get(barrel) ?? new Set<string>();
        return [...names]
          .filter((name) => routeNamePattern.test(name))
          .filter((name) => !barrelNames.has(name))
          .map(
            (name) =>
              `${relative(repoRoot, barrel)} missing ${name} from ${relative(repoRoot, file)}`
          );
      })
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
