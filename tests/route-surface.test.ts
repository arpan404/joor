import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const srcRoot = join(repoRoot, 'src');
const rootIndex = join(srcRoot, 'index.ts');
const configSource = join(srcRoot, 'config.ts');
const compilerEmitter = join(srcRoot, 'compiler/emit.ts');
const manifestSource = join(srcRoot, 'manifest.ts');
const rpcClient = join(srcRoot, 'rpc/client.ts');
const rpcDispatcher = join(srcRoot, 'rpc/dispatcher.ts');
const runtimeResponse = join(srcRoot, 'runtime/response.ts');
const runtimeCompiled = join(srcRoot, 'runtime/compiled.ts');
const runtimeRoot = join(srcRoot, 'runtime');
const packageManifest = join(repoRoot, 'package.json');
const packageSubpathTest = join(repoRoot, 'tests/package-subpaths.test-d.ts');
const fixture = join(repoRoot, 'tests/fixtures/basic-app/rpc');

type ExportedSymbol = {
  readonly file: string;
  readonly kind: 'type' | 'value';
  readonly name: string;
};

const routeNamePattern = /(?:RouteUnary|UnaryRoute|RouteStream|StreamRoute)/;
const routeKindTypePattern = /(?:RouteUnary|RouteStream)/;

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
    /\bexport\s+(?:declare\s+)?(const|function|type|interface|class)\s+([A-Za-z_][A-Za-z0-9_]*)/g
  )) {
    const declarationKind = match[1];
    const name = match[2];
    if (name !== undefined) {
      symbols.push({
        file,
        kind:
          declarationKind === 'type' || declarationKind === 'interface'
            ? 'type'
            : 'value',
        name,
      });
    }
  }

  for (const match of source.matchAll(
    /\bexport\s+(type\s+)?\{([^}]*)\}(?:\s+from\s+['"][^'"]+['"])?/g
  )) {
    const typeOnlyExport = match[1] !== undefined;
    const specifiers = match[2];
    if (specifiers === undefined) continue;
    for (const specifier of specifiers.split(',')) {
      const name = exportedName(specifier);
      if (name.length > 0) {
        symbols.push({
          file,
          kind:
            typeOnlyExport || specifier.trim().startsWith('type ')
              ? 'type'
              : 'value',
          name,
        });
      }
    }
  }

  return symbols;
};

const collectImportedSourceNamesByModule = (
  source: string
): ReadonlyMap<string, ReadonlySet<string>> => {
  const imports = new Map<string, Set<string>>();

  for (const match of source.matchAll(
    /\bimport\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g
  )) {
    const specifiers = match[1];
    const moduleSpecifier = match[2];
    if (specifiers === undefined || moduleSpecifier === undefined) continue;
    const names = imports.get(moduleSpecifier) ?? new Set<string>();
    for (const specifier of specifiers.split(',')) {
      const name = sourceName(specifier).trim();
      if (name.length > 0) names.add(name);
    }
    imports.set(moduleSpecifier, names);
  }

  return imports;
};

const collectImportedValueSourceNamesByModule = (
  source: string
): ReadonlyMap<string, ReadonlySet<string>> => {
  const imports = new Map<string, Set<string>>();

  for (const match of source.matchAll(
    /\bimport\s+\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g
  )) {
    const specifiers = match[1];
    const moduleSpecifier = match[2];
    if (specifiers === undefined || moduleSpecifier === undefined) continue;
    const names = imports.get(moduleSpecifier) ?? new Set<string>();
    for (const specifier of specifiers.split(',')) {
      if (specifier.trim().startsWith('type ')) continue;
      const name = sourceName(specifier).trim();
      if (name.length > 0) names.add(name);
    }
    imports.set(moduleSpecifier, names);
  }

  return imports;
};

const collectNamespaceImportsByModule = (
  source: string
): ReadonlyMap<string, string> => {
  const imports = new Map<string, string>();

  for (const match of source.matchAll(
    /\bimport\s+type\s+\*\s+as\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+['"]([^'"]+)['"]/g
  )) {
    const alias = match[1];
    const moduleSpecifier = match[2];
    if (alias !== undefined && moduleSpecifier !== undefined) {
      imports.set(moduleSpecifier, alias);
    }
  }

  return imports;
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

const conciseRouteAliasName = (name: string): string | undefined => {
  if (name.includes('RouteUnary')) {
    return name.replaceAll('RouteUnary', 'Unary');
  }
  if (name.includes('UnaryRoute')) {
    return name.replaceAll('UnaryRoute', 'Unary');
  }
  if (name.includes('RouteStream')) {
    return name.replaceAll('RouteStream', 'Stream');
  }
  if (name.includes('StreamRoute')) {
    return name.replaceAll('StreamRoute', 'Stream');
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

const publicConciseRouteAliasExports = async (): Promise<
  readonly ExportedSymbol[]
> => {
  const byFile = new Map<string, Map<string, ExportedSymbol>>();
  for (const symbol of await publicRouteExports()) {
    const symbols =
      byFile.get(symbol.file) ?? new Map<string, ExportedSymbol>();
    symbols.set(symbol.name, symbol);
    byFile.set(symbol.file, symbols);
  }

  const aliases = new Map<string, ExportedSymbol>();
  for (const [file, symbols] of byFile) {
    for (const symbol of symbols.values()) {
      const aliasName = conciseRouteAliasName(symbol.name);
      if (aliasName === undefined) continue;
      const alias = symbols.get(aliasName);
      if (alias === undefined) continue;
      aliases.set(`${file}\0${alias.kind}\0${alias.name}`, alias);
    }
  }

  return [...aliases.values()];
};

const publicRouteSurfaceExports = async (): Promise<
  readonly ExportedSymbol[]
> => [
  ...(await publicRouteExports()),
  ...(await publicConciseRouteAliasExports()),
];

const publicRouteValueExports = async (): Promise<readonly ExportedSymbol[]> =>
  (await publicRouteSurfaceExports()).filter(({ kind }) => kind === 'value');

const publicRouteTypeExports = async (): Promise<readonly ExportedSymbol[]> =>
  (await publicRouteSurfaceExports()).filter(
    ({ file, kind }) => kind === 'type' && file !== rootIndex
  );

const publicRouteTypedFactoryExports = async (): Promise<
  readonly ExportedSymbol[]
> =>
  (await publicRouteValueExports()).filter(
    ({ file, name }) =>
      file !== rootIndex &&
      relative(srcRoot, file) !== 'runtime/index.ts' &&
      name.endsWith('For')
  );

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

const packageSubpathForRouteFile = (file: string): string | undefined => {
  const directSubpath = packageSubpathForSourceFile(file);
  if (directSubpath !== undefined) return directSubpath;
  const barrel = barrelIndexForSourceFile(file);
  return barrel === undefined ? undefined : packageSubpathForSourceFile(barrel);
};

const packageImportSpecifier = (packageSubpath: string): string =>
  packageSubpath === '.'
    ? 'joor'
    : `joor/${packageSubpath.replace(/^\.\//, '')}`;

const packageSubpathFromImportSpecifier = (
  moduleSpecifier: string
): string | undefined => {
  if (moduleSpecifier === 'joor') return '.';
  if (moduleSpecifier.startsWith('joor/')) {
    return `./${moduleSpecifier.slice('joor/'.length)}`;
  }

  return undefined;
};

const packageExportSet = async (): Promise<ReadonlySet<string>> => {
  const packageSource = await readFile(packageManifest, 'utf8');
  const packageJson = JSON.parse(packageSource) as {
    readonly exports?: Readonly<Record<string, unknown>>;
  };
  return new Set(Object.keys(packageJson.exports ?? {}));
};

type PackageExportEntrypoint = {
  readonly file: string;
  readonly moduleSpecifier: string;
  readonly packageSubpath: string;
};

const packageExportSourceFile = (importPath: string): string => {
  const distPrefix = './dist/';
  return join(
    srcRoot,
    importPath.slice(distPrefix.length).replace(/\.js$/, '.ts')
  );
};

const packageExportEntrypoints = async (): Promise<
  readonly PackageExportEntrypoint[]
> => {
  const packageSource = await readFile(packageManifest, 'utf8');
  const packageJson = JSON.parse(packageSource) as {
    readonly exports?: Readonly<Record<string, { readonly import?: unknown }>>;
  };

  return Object.entries(packageJson.exports ?? {}).flatMap(
    ([packageSubpath, entry]) => {
      if (typeof entry.import !== 'string') return [];
      return [
        {
          file: packageExportSourceFile(entry.import),
          moduleSpecifier: packageImportSpecifier(packageSubpath),
          packageSubpath,
        },
      ];
    }
  );
};

const collectPackageImportSubpaths = (source: string): ReadonlySet<string> => {
  const subpaths = new Set<string>();
  for (const match of source.matchAll(
    /\bimport\s+(?:type\s+)?(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g
  )) {
    const moduleSpecifier = match[1];
    if (moduleSpecifier === undefined) continue;
    const packageSubpath = packageSubpathFromImportSpecifier(moduleSpecifier);
    if (packageSubpath !== undefined) subpaths.add(packageSubpath);
  }

  return subpaths;
};

const namespaceReferencePattern = (alias: string, name: string): RegExp =>
  new RegExp(`\\b${alias}\\s*\\.\\s*${name}\\b`);

const missingCanonicalNamespaceReferences = (
  exports: readonly ExportedSymbol[],
  source: string
): readonly string[] => {
  const namespaceImports = collectNamespaceImportsByModule(source);

  return exports
    .flatMap(({ file, name }) => {
      const packageSubpath = packageSubpathForRouteFile(file);
      if (packageSubpath === undefined) {
        return [`${relative(repoRoot, file)}: ${name} <no package path>`];
      }
      const moduleSpecifier = packageImportSpecifier(packageSubpath);
      const alias = namespaceImports.get(moduleSpecifier);
      if (alias === undefined) {
        return [
          `${relative(repoRoot, file)}: ${name} missing namespace import from ${moduleSpecifier}`,
        ];
      }
      if (namespaceReferencePattern(alias, name).test(source)) {
        return [];
      }
      return [
        `${relative(repoRoot, file)}: ${alias}.${name} from ${moduleSpecifier}`,
      ];
    })
    .sort();
};

const generatedRouteSurfaceTestTimeout = 30_000;

const collectGeneratedExportSets = async (): Promise<
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

let generatedExportSetsPromise:
  | Promise<Map<string, ReadonlySet<string>>>
  | undefined;

const generatedExportSets = async (): Promise<
  Map<string, ReadonlySet<string>>
> => {
  generatedExportSetsPromise ??= collectGeneratedExportSets();
  return generatedExportSetsPromise;
};

const routeExportNames = (names: ReadonlySet<string>): readonly string[] =>
  [...names].filter((name) => routeNamePattern.test(name)).sort();

const generatedPlatformEntrypoints = [
  'aws-lambda.ts',
  'bun.ts',
  'cloudflare.ts',
  'deno.ts',
  'fetch.ts',
  'netlify.ts',
  'next.ts',
  'node.ts',
  'vercel.ts',
] as const;

const generatedRouteRequirementAliases = [
  'NativeRouteStreamRequiredRuntimeRequest',
  'NativeRouteStreamRequiredServices',
  'NativeRouteUnaryRequiredRuntimeRequest',
  'NativeRouteUnaryRequiredServices',
  'NativeStreamRouteRequiredRuntimeRequest',
  'NativeStreamRouteRequiredServices',
  'NativeUnaryRouteRequiredRuntimeRequest',
  'NativeUnaryRouteRequiredServices',
] as const;

const generatedClientRouteBatchAliases = [
  'RouteBatchRequestUnion',
  'RouteUnaryBatchRequestUnion',
  'UnaryRouteBatchRequestUnion',
  'RouteBatchRequest',
  'RouteUnaryBatchRequest',
  'UnaryRouteBatchRequest',
  'RouteBatchResults',
  'RouteUnaryBatchResults',
  'UnaryRouteBatchResults',
  'RouteProtocolBatchRequestUnion',
  'RouteUnaryProtocolBatchRequestUnion',
  'UnaryRouteProtocolBatchRequestUnion',
  'ProtocolBatchRequestUnion',
  'RouteProtocolBatchRequest',
  'RouteUnaryProtocolBatchRequest',
  'UnaryRouteProtocolBatchRequest',
  'ProtocolBatchRequest',
  'RouteProtocolBatchResults',
  'RouteUnaryProtocolBatchResults',
  'UnaryRouteProtocolBatchResults',
  'ProtocolBatchResults',
  'RouteBatchClientHeaders',
  'RouteUnaryBatchClientHeaders',
  'UnaryRouteBatchClientHeaders',
  'RouteProtocolBatchClientHeaders',
  'ProtocolBatchClientHeaders',
  'RouteUnaryProtocolBatchClientHeaders',
  'UnaryRouteProtocolBatchClientHeaders',
  'RouteBatchOptions',
  'RouteUnaryBatchOptions',
  'UnaryRouteBatchOptions',
  'RouteProtocolBatchOptions',
  'ProtocolBatchOptions',
  'RouteUnaryProtocolBatchOptions',
  'UnaryRouteProtocolBatchOptions',
  'RouteBatchOptionsTuple',
  'RouteUnaryBatchOptionsTuple',
  'UnaryRouteBatchOptionsTuple',
  'RouteProtocolBatchOptionsTuple',
  'ProtocolBatchOptionsTuple',
  'RouteUnaryProtocolBatchOptionsTuple',
  'UnaryRouteProtocolBatchOptionsTuple',
] as const;

const generatedClientRouteTransportExports = [
  'GeneratedRouteUnaryClient',
  'GeneratedUnaryRouteClient',
  'GeneratedUnaryClient',
  'RouteUnaryClient',
  'UnaryRouteClient',
  'UnaryClient',
  'GeneratedRouteStreamClient',
  'GeneratedStreamRouteClient',
  'GeneratedStreamClient',
  'RouteStreamClient',
  'StreamRouteClient',
  'StreamClient',
  'GeneratedRouteUnaryClientOptions',
  'GeneratedUnaryRouteClientOptions',
  'GeneratedUnaryClientOptions',
  'RouteUnaryClientOptions',
  'UnaryRouteClientOptions',
  'UnaryClientOptions',
  'GeneratedRouteStreamClientOptions',
  'GeneratedStreamRouteClientOptions',
  'GeneratedStreamClientOptions',
  'RouteStreamClientOptions',
  'StreamRouteClientOptions',
  'StreamClientOptions',
  'RouteUnaryTransportClient',
  'UnaryRouteTransportClient',
  'UnaryTransportClient',
  'RouteStreamTransportClient',
  'StreamRouteTransportClient',
  'StreamTransportClient',
  'createRouteUnaryClient',
  'createUnaryRouteClient',
  'createUnaryClient',
  'createRouteStreamClient',
  'createStreamRouteClient',
  'createStreamClient',
  'createRouteUnaryTransport',
  'createUnaryRouteTransport',
  'createUnaryTransport',
  'createRouteStreamTransport',
  'createStreamRouteTransport',
  'createStreamTransport',
  'routeUnaryClient',
  'unaryRouteClient',
  'unaryClient',
  'routeStreamClient',
  'streamRouteClient',
  'streamClient',
  'routeUnaryTransport',
  'unaryRouteTransport',
  'unaryTransport',
  'routeStreamTransport',
  'streamRouteTransport',
  'streamTransport',
] as const;

const generatedDispatcherRouteBatchAliases = [
  'NativeRouteBatchRequestUnion',
  'NativeRouteUnaryBatchRequestUnion',
  'NativeUnaryRouteBatchRequestUnion',
  'NativeRouteProtocolBatchRequestUnion',
  'NativeRouteUnaryProtocolBatchRequestUnion',
  'NativeUnaryRouteProtocolBatchRequestUnion',
  'NativeProtocolBatchRequestUnion',
  'NativeRouteBatchRequest',
  'NativeRouteUnaryBatchRequest',
  'NativeUnaryRouteBatchRequest',
  'NativeRouteProtocolBatchRequest',
  'NativeRouteUnaryProtocolBatchRequest',
  'NativeUnaryRouteProtocolBatchRequest',
  'NativeProtocolBatchRequest',
  'NativeRouteBatchClientHeaders',
  'NativeBatchClientHeaders',
  'NativeRouteUnaryBatchClientHeaders',
  'NativeUnaryRouteBatchClientHeaders',
  'NativeRouteProtocolBatchClientHeaders',
  'NativeProtocolBatchClientHeaders',
  'NativeRouteUnaryProtocolBatchClientHeaders',
  'NativeUnaryRouteProtocolBatchClientHeaders',
  'NativeRouteBatchOptions',
  'NativeRouteUnaryBatchOptions',
  'NativeUnaryRouteBatchOptions',
  'NativeBatchOptions',
  'NativeRouteProtocolBatchOptions',
  'NativeProtocolBatchOptions',
  'NativeRouteUnaryProtocolBatchOptions',
  'NativeUnaryRouteProtocolBatchOptions',
  'NativeRouteBatchOptionsTuple',
  'NativeRouteUnaryBatchOptionsTuple',
  'NativeUnaryRouteBatchOptionsTuple',
  'NativeBatchOptionsTuple',
  'NativeRouteProtocolBatchOptionsTuple',
  'NativeProtocolBatchOptionsTuple',
  'NativeRouteUnaryProtocolBatchOptionsTuple',
  'NativeUnaryRouteProtocolBatchOptionsTuple',
  'NativeRouteBatchResults',
  'NativeRouteUnaryBatchResults',
  'NativeUnaryRouteBatchResults',
  'NativeRouteProtocolBatchResults',
  'NativeRouteUnaryProtocolBatchResults',
  'NativeUnaryRouteProtocolBatchResults',
  'NativeProtocolBatchResults',
  'NativeBatchBody',
] as const;

const generatedDispatcherRouteDefinitionAliases = [
  'NativeRouteUnaryConfig',
  'NativeRouteUnaryConfigFor',
  'NativeUnaryRouteConfig',
  'NativeUnaryRouteConfigFor',
  'NativeUnaryConfig',
  'NativeUnaryConfigFor',
  'NativeRouteStreamConfig',
  'NativeRouteStreamConfigFor',
  'NativeStreamRouteConfig',
  'NativeStreamRouteConfigFor',
  'NativeStreamConfig',
  'NativeStreamConfigFor',
  'NativeDefineRouteUnaryConfig',
  'NativeDefineUnaryRouteConfig',
  'NativeDefineUnaryConfig',
  'NativeDefineRouteStreamConfig',
  'NativeDefineStreamRouteConfig',
  'NativeDefineStreamConfig',
  'defineNativeRouteUnaryConfig',
  'defineNativeUnaryRouteConfig',
  'defineNativeUnaryConfig',
  'defineNativeRouteStreamConfig',
  'defineNativeStreamRouteConfig',
  'defineNativeStreamConfig',
  'NativeRouteUnaryHandlerOptions',
  'NativeRouteUnaryHandlerOptionsFor',
  'NativeUnaryRouteHandlerOptions',
  'NativeUnaryRouteHandlerOptionsFor',
  'NativeUnaryHandlerOptions',
  'NativeUnaryHandlerOptionsFor',
  'NativeRouteStreamHandlerOptions',
  'NativeRouteStreamHandlerOptionsFor',
  'NativeStreamRouteHandlerOptions',
  'NativeStreamRouteHandlerOptionsFor',
  'NativeStreamHandlerOptions',
  'NativeStreamHandlerOptionsFor',
  'NativeRouteUnaryHandlerOptionsArgs',
  'NativeRouteUnaryHandlerOptionsArgsFor',
  'NativeUnaryRouteHandlerOptionsArgs',
  'NativeUnaryRouteHandlerOptionsArgsFor',
  'NativeUnaryHandlerOptionsArgs',
  'NativeUnaryHandlerOptionsArgsFor',
  'NativeRouteStreamHandlerOptionsArgs',
  'NativeRouteStreamHandlerOptionsArgsFor',
  'NativeStreamRouteHandlerOptionsArgs',
  'NativeStreamRouteHandlerOptionsArgsFor',
  'NativeStreamHandlerOptionsArgs',
  'NativeStreamHandlerOptionsArgsFor',
  'NativeRouteUnaryHandlerOptionsWithTrailingArgs',
  'NativeUnaryRouteHandlerOptionsWithTrailingArgs',
  'NativeUnaryHandlerOptionsWithTrailingArgs',
  'NativeRouteStreamHandlerOptionsWithTrailingArgs',
  'NativeStreamRouteHandlerOptionsWithTrailingArgs',
  'NativeStreamHandlerOptionsWithTrailingArgs',
  'NativeRouteUnaryHandlerOptionsWithPreflightArgs',
  'NativeUnaryRouteHandlerOptionsWithPreflightArgs',
  'NativeUnaryHandlerOptionsWithPreflightArgs',
  'NativeRouteStreamHandlerOptionsWithPreflightArgs',
  'NativeStreamRouteHandlerOptionsWithPreflightArgs',
  'NativeStreamHandlerOptionsWithPreflightArgs',
  'NativeDefineRouteUnaryHandlerOptions',
  'NativeDefineUnaryRouteHandlerOptions',
  'NativeDefineUnaryHandlerOptions',
  'NativeDefineRouteStreamHandlerOptions',
  'NativeDefineStreamRouteHandlerOptions',
  'NativeDefineStreamHandlerOptions',
  'defineNativeRouteUnaryHandlerOptions',
  'defineNativeUnaryRouteHandlerOptions',
  'defineNativeUnaryHandlerOptions',
  'defineNativeRouteStreamHandlerOptions',
  'defineNativeStreamRouteHandlerOptions',
  'defineNativeStreamHandlerOptions',
  'NativeRouteUnaryHandlerHookContext',
  'NativeUnaryRouteHandlerHookContext',
  'NativeUnaryHandlerHookContext',
  'NativeRouteStreamHandlerHookContext',
  'NativeStreamRouteHandlerHookContext',
  'NativeStreamHandlerHookContext',
  'NativeRouteUnaryHandlerHooks',
  'NativeUnaryRouteHandlerHooks',
  'NativeUnaryHandlerHooks',
  'NativeRouteStreamHandlerHooks',
  'NativeStreamRouteHandlerHooks',
  'NativeStreamHandlerHooks',
  'NativeRouteUnaryMiddleware',
  'NativeUnaryRouteMiddleware',
  'NativeUnaryMiddleware',
  'NativeRouteStreamMiddleware',
  'NativeStreamRouteMiddleware',
  'NativeStreamMiddleware',
] as const;

const generatedDispatcherCompiledRouteAliases = [
  'NativeRouteUnaryCompiledBodyResultFor',
  'NativeUnaryRouteCompiledBodyResultFor',
  'NativeUnaryCompiledBodyResultFor',
  'NativeRouteStreamCompiledBodyResultFor',
  'NativeStreamRouteCompiledBodyResultFor',
  'NativeStreamCompiledBodyResultFor',
  'NativeRouteUnaryTransportResultFor',
  'NativeUnaryRouteTransportResultFor',
  'NativeUnaryTransportResultFor',
  'NativeRouteStreamTransportResultFor',
  'NativeStreamRouteTransportResultFor',
  'NativeStreamTransportResultFor',
  'NativeRouteUnaryTransportHandler',
  'NativeUnaryRouteTransportHandler',
  'NativeUnaryTransportHandler',
  'NativeRouteStreamTransportHandler',
  'NativeStreamRouteTransportHandler',
  'NativeStreamTransportHandler',
  'NativeRouteUnaryBodyHandler',
  'NativeUnaryRouteBodyHandler',
  'NativeUnaryBodyHandler',
  'NativeRouteStreamBodyHandler',
  'NativeStreamRouteBodyHandler',
  'NativeStreamBodyHandler',
  'nativeRouteUnaryTransport',
  'nativeUnaryRouteTransport',
  'nativeUnaryTransport',
  'nativeRouteStreamTransport',
  'nativeStreamRouteTransport',
  'nativeStreamTransport',
  'nativeRouteUnaryBody',
  'nativeUnaryRouteBody',
  'nativeUnaryBody',
  'nativeRouteStreamBody',
  'nativeStreamRouteBody',
  'nativeStreamBody',
] as const;

const generatedPlatformRouteHandlerTypeAliases = [
  {
    entrypoint: 'bun.ts',
    names: [
      'BunNativeRouteUnaryFetchHandler',
      'BunNativeUnaryRouteFetchHandler',
      'BunNativeUnaryFetchHandler',
      'BunNativeRouteStreamFetchHandler',
      'BunNativeStreamRouteFetchHandler',
      'BunNativeStreamFetchHandler',
    ],
  },
  {
    entrypoint: 'deno.ts',
    names: [
      'DenoNativeRouteUnaryFetchHandler',
      'DenoNativeUnaryRouteFetchHandler',
      'DenoNativeUnaryFetchHandler',
      'DenoNativeRouteStreamFetchHandler',
      'DenoNativeStreamRouteFetchHandler',
      'DenoNativeStreamFetchHandler',
    ],
  },
  {
    entrypoint: 'fetch.ts',
    names: [
      'NativeRouteUnaryFetchHandler',
      'NativeUnaryRouteFetchHandler',
      'NativeUnaryFetchHandler',
      'NativeRouteStreamFetchHandler',
      'NativeStreamRouteFetchHandler',
      'NativeStreamFetchHandler',
    ],
  },
] as const;

const generatedPlatformGenericFactoryExports = [
  {
    entrypoint: 'aws-lambda.ts',
    names: [
      'createAwsLambdaHandler',
      'createAwsLambdaHandlerFor',
      'createAwsLambdaHttpApiHandler',
      'createAwsLambdaHttpApiHandlerFor',
      'createAwsLambdaRestApiHandler',
      'createAwsLambdaRestApiHandlerFor',
    ],
  },
  {
    entrypoint: 'bun.ts',
    names: ['createFetchFor', 'createBunFetch', 'createBunFetchFor'],
  },
  {
    entrypoint: 'cloudflare.ts',
    names: [
      'createFetchFor',
      'createCloudflareFetch',
      'createCloudflareFetchFor',
      'createWorkerFor',
      'createCloudflareWorker',
      'createCloudflareWorkerFor',
    ],
  },
  {
    entrypoint: 'deno.ts',
    names: ['createFetchFor', 'createDenoFetch', 'createDenoFetchFor'],
  },
  {
    entrypoint: 'fetch.ts',
    names: ['createFetchFor'],
  },
  {
    entrypoint: 'netlify.ts',
    names: [
      'createFetchFor',
      'createNetlifyFetch',
      'createNetlifyFetchFor',
      'createEdgeFor',
      'createNetlifyEdgeFunction',
      'createNetlifyEdgeFunctionFor',
    ],
  },
  {
    entrypoint: 'next.ts',
    names: [
      'createFetchFor',
      'createHandlersFor',
      'createNextRouteHandlers',
      'createNextRouteHandlersFor',
      'createNextHandler',
      'createNextHandlerFor',
    ],
  },
  {
    entrypoint: 'node.ts',
    names: ['createNodeHandler', 'createServerFor'],
  },
  {
    entrypoint: 'vercel.ts',
    names: [
      'createFetchFor',
      'createVercelFetch',
      'createVercelFetchFor',
      'createVercelFor',
      'createVercelFunction',
      'createVercelFunctionFor',
    ],
  },
] as const;

const generatedPlatformRouteFactoryExports = [
  {
    entrypoint: 'aws-lambda.ts',
    names: [
      'createRouteUnaryAwsLambdaHandler',
      'createRouteUnaryAwsLambdaHandlerFor',
      'createUnaryRouteAwsLambdaHandler',
      'createUnaryRouteAwsLambdaHandlerFor',
      'createUnaryAwsLambdaHandler',
      'createUnaryAwsLambdaHandlerFor',
      'createRouteStreamAwsLambdaHandler',
      'createRouteStreamAwsLambdaHandlerFor',
      'createStreamRouteAwsLambdaHandler',
      'createStreamRouteAwsLambdaHandlerFor',
      'createStreamAwsLambdaHandler',
      'createStreamAwsLambdaHandlerFor',
      'createRouteUnaryAwsLambdaHttpApiHandler',
      'createRouteUnaryAwsLambdaHttpApiHandlerFor',
      'createUnaryRouteAwsLambdaHttpApiHandler',
      'createUnaryRouteAwsLambdaHttpApiHandlerFor',
      'createUnaryAwsLambdaHttpApiHandler',
      'createUnaryAwsLambdaHttpApiHandlerFor',
      'createRouteStreamAwsLambdaHttpApiHandler',
      'createRouteStreamAwsLambdaHttpApiHandlerFor',
      'createStreamRouteAwsLambdaHttpApiHandler',
      'createStreamRouteAwsLambdaHttpApiHandlerFor',
      'createStreamAwsLambdaHttpApiHandler',
      'createStreamAwsLambdaHttpApiHandlerFor',
      'createRouteUnaryAwsLambdaRestApiHandler',
      'createRouteUnaryAwsLambdaRestApiHandlerFor',
      'createUnaryRouteAwsLambdaRestApiHandler',
      'createUnaryRouteAwsLambdaRestApiHandlerFor',
      'createUnaryAwsLambdaRestApiHandler',
      'createUnaryAwsLambdaRestApiHandlerFor',
      'createRouteStreamAwsLambdaRestApiHandler',
      'createRouteStreamAwsLambdaRestApiHandlerFor',
      'createStreamRouteAwsLambdaRestApiHandler',
      'createStreamRouteAwsLambdaRestApiHandlerFor',
      'createStreamAwsLambdaRestApiHandler',
      'createStreamAwsLambdaRestApiHandlerFor',
      'createRouteUnaryFetch',
      'createUnaryRouteFetch',
      'createUnaryFetch',
      'createRouteStreamFetch',
      'createStreamRouteFetch',
      'createStreamFetch',
    ],
  },
  {
    entrypoint: 'bun.ts',
    names: [
      'createRouteUnaryBunFetch',
      'createRouteUnaryBunFetchFor',
      'createUnaryRouteBunFetch',
      'createUnaryRouteBunFetchFor',
      'createUnaryBunFetch',
      'createUnaryBunFetchFor',
      'createRouteStreamBunFetch',
      'createRouteStreamBunFetchFor',
      'createStreamRouteBunFetch',
      'createStreamRouteBunFetchFor',
      'createStreamBunFetch',
      'createStreamBunFetchFor',
      'serveRouteUnaryBun',
      'serveUnaryRouteBun',
      'serveUnary',
      'serveUnaryBun',
      'serveBunUnary',
      'serveRouteStreamBun',
      'serveStreamRouteBun',
      'serveStream',
      'serveStreamBun',
      'serveBunStream',
      'listenRouteUnary',
      'listenUnaryRoute',
      'listenUnary',
      'listenRouteStream',
      'listenStreamRoute',
      'listenStream',
    ],
  },
  {
    entrypoint: 'cloudflare.ts',
    names: [
      'createRouteUnaryCloudflareFetch',
      'createRouteUnaryCloudflareFetchFor',
      'createRouteUnaryFetch',
      'createRouteUnaryFetchFor',
      'createUnaryRouteCloudflareFetch',
      'createUnaryRouteCloudflareFetchFor',
      'createUnaryCloudflareFetch',
      'createUnaryCloudflareFetchFor',
      'createUnaryRouteFetch',
      'createUnaryRouteFetchFor',
      'createUnaryFetch',
      'createUnaryFetchFor',
      'createRouteStreamCloudflareFetch',
      'createRouteStreamCloudflareFetchFor',
      'createRouteStreamFetch',
      'createRouteStreamFetchFor',
      'createStreamRouteCloudflareFetch',
      'createStreamRouteCloudflareFetchFor',
      'createStreamCloudflareFetch',
      'createStreamCloudflareFetchFor',
      'createStreamRouteFetch',
      'createStreamRouteFetchFor',
      'createStreamFetch',
      'createStreamFetchFor',
      'createRouteUnaryWorker',
      'createRouteUnaryWorkerFor',
      'createRouteUnaryCloudflareWorker',
      'createRouteUnaryCloudflareWorkerFor',
      'createUnaryRouteWorker',
      'createUnaryRouteWorkerFor',
      'createUnaryWorker',
      'createUnaryWorkerFor',
      'createUnaryRouteCloudflareWorker',
      'createUnaryRouteCloudflareWorkerFor',
      'createUnaryCloudflareWorker',
      'createUnaryCloudflareWorkerFor',
      'createRouteStreamWorker',
      'createRouteStreamWorkerFor',
      'createRouteStreamCloudflareWorker',
      'createRouteStreamCloudflareWorkerFor',
      'createStreamRouteWorker',
      'createStreamRouteWorkerFor',
      'createStreamWorker',
      'createStreamWorkerFor',
      'createStreamRouteCloudflareWorker',
      'createStreamRouteCloudflareWorkerFor',
      'createStreamCloudflareWorker',
      'createStreamCloudflareWorkerFor',
    ],
  },
  {
    entrypoint: 'deno.ts',
    names: [
      'createRouteUnaryDenoFetch',
      'createRouteUnaryDenoFetchFor',
      'createUnaryRouteDenoFetch',
      'createUnaryRouteDenoFetchFor',
      'createUnaryDenoFetch',
      'createUnaryDenoFetchFor',
      'createRouteStreamDenoFetch',
      'createRouteStreamDenoFetchFor',
      'createStreamRouteDenoFetch',
      'createStreamRouteDenoFetchFor',
      'createStreamDenoFetch',
      'createStreamDenoFetchFor',
      'serveRouteUnaryDeno',
      'serveUnaryRouteDeno',
      'serveUnary',
      'serveUnaryDeno',
      'serveDenoRouteUnary',
      'serveDenoUnaryRoute',
      'serveDenoUnary',
      'serveRouteStreamDeno',
      'serveStreamRouteDeno',
      'serveStream',
      'serveStreamDeno',
      'serveDenoRouteStream',
      'serveDenoStreamRoute',
      'serveDenoStream',
      'listenRouteUnary',
      'listenUnaryRoute',
      'listenUnary',
      'listenRouteStream',
      'listenStreamRoute',
      'listenStream',
    ],
  },
  {
    entrypoint: 'fetch.ts',
    names: [
      'createRouteUnaryFetch',
      'createRouteUnaryFetchFor',
      'createUnaryRouteFetch',
      'createUnaryRouteFetchFor',
      'createUnaryFetch',
      'createUnaryFetchFor',
      'createRouteStreamFetch',
      'createRouteStreamFetchFor',
      'createStreamRouteFetch',
      'createStreamRouteFetchFor',
      'createStreamFetch',
      'createStreamFetchFor',
    ],
  },
  {
    entrypoint: 'netlify.ts',
    names: [
      'createRouteUnaryNetlifyFetch',
      'createRouteUnaryNetlifyFetchFor',
      'createRouteUnaryFetch',
      'createRouteUnaryFetchFor',
      'createUnaryRouteNetlifyFetch',
      'createUnaryRouteNetlifyFetchFor',
      'createUnaryNetlifyFetch',
      'createUnaryNetlifyFetchFor',
      'createUnaryRouteFetch',
      'createUnaryRouteFetchFor',
      'createUnaryFetch',
      'createUnaryFetchFor',
      'createRouteStreamNetlifyFetch',
      'createRouteStreamNetlifyFetchFor',
      'createRouteStreamFetch',
      'createRouteStreamFetchFor',
      'createStreamRouteNetlifyFetch',
      'createStreamRouteNetlifyFetchFor',
      'createStreamNetlifyFetch',
      'createStreamNetlifyFetchFor',
      'createStreamRouteFetch',
      'createStreamRouteFetchFor',
      'createStreamFetch',
      'createStreamFetchFor',
      'createRouteUnaryEdge',
      'createRouteUnaryEdgeFor',
      'createRouteUnaryNetlifyEdgeFunction',
      'createRouteUnaryNetlifyEdgeFunctionFor',
      'createUnaryRouteEdge',
      'createUnaryRouteEdgeFor',
      'createUnaryEdge',
      'createUnaryEdgeFor',
      'createUnaryRouteNetlifyEdgeFunction',
      'createUnaryRouteNetlifyEdgeFunctionFor',
      'createUnaryNetlifyEdgeFunction',
      'createUnaryNetlifyEdgeFunctionFor',
      'createRouteStreamEdge',
      'createRouteStreamEdgeFor',
      'createRouteStreamNetlifyEdgeFunction',
      'createRouteStreamNetlifyEdgeFunctionFor',
      'createStreamRouteEdge',
      'createStreamRouteEdgeFor',
      'createStreamEdge',
      'createStreamEdgeFor',
      'createStreamRouteNetlifyEdgeFunction',
      'createStreamRouteNetlifyEdgeFunctionFor',
      'createStreamNetlifyEdgeFunction',
      'createStreamNetlifyEdgeFunctionFor',
    ],
  },
  {
    entrypoint: 'next.ts',
    names: [
      'createRouteUnaryNextHandler',
      'createRouteUnaryNextHandlerFor',
      'createRouteUnaryHandlers',
      'createRouteUnaryHandlersFor',
      'createUnaryRouteNextHandler',
      'createUnaryRouteNextHandlerFor',
      'createUnaryRouteHandlers',
      'createUnaryRouteHandlersFor',
      'createUnaryNextHandler',
      'createUnaryNextHandlerFor',
      'createUnaryHandlers',
      'createUnaryHandlersFor',
      'createRouteStreamNextHandler',
      'createRouteStreamNextHandlerFor',
      'createRouteStreamHandlers',
      'createRouteStreamHandlersFor',
      'createStreamRouteNextHandler',
      'createStreamRouteNextHandlerFor',
      'createStreamRouteHandlers',
      'createStreamRouteHandlersFor',
      'createStreamNextHandler',
      'createStreamNextHandlerFor',
      'createStreamHandlers',
      'createStreamHandlersFor',
      'createRouteUnaryNextRouteHandlers',
      'createRouteUnaryNextRouteHandlersFor',
      'createUnaryRouteNextRouteHandlers',
      'createUnaryRouteNextRouteHandlersFor',
      'createUnaryNextRouteHandlers',
      'createUnaryNextRouteHandlersFor',
      'createRouteStreamNextRouteHandlers',
      'createRouteStreamNextRouteHandlersFor',
      'createStreamRouteNextRouteHandlers',
      'createStreamRouteNextRouteHandlersFor',
      'createStreamNextRouteHandlers',
      'createStreamNextRouteHandlersFor',
    ],
  },
  {
    entrypoint: 'node.ts',
    names: [
      'createRouteUnaryHandler',
      'createRouteUnaryNodeHandler',
      'createUnaryRouteHandler',
      'createUnaryRouteNodeHandler',
      'createUnaryHandler',
      'createUnaryNodeHandler',
      'createRouteStreamHandler',
      'createRouteStreamNodeHandler',
      'createStreamRouteHandler',
      'createStreamRouteNodeHandler',
      'createStreamHandler',
      'createStreamNodeHandler',
      'createRouteUnaryServerFor',
      'createRouteUnaryNodeServerFor',
      'createUnaryRouteServerFor',
      'createUnaryRouteNodeServerFor',
      'createUnaryServerFor',
      'createUnaryNodeServerFor',
      'createRouteStreamServerFor',
      'createRouteStreamNodeServerFor',
      'createStreamRouteServerFor',
      'createStreamRouteNodeServerFor',
      'createStreamServerFor',
      'createStreamNodeServerFor',
      'listenRouteUnary',
      'listenUnaryRoute',
      'listenUnary',
      'listenNodeUnary',
      'listenRouteStream',
      'listenStreamRoute',
      'listenStream',
      'listenNodeStream',
    ],
  },
  {
    entrypoint: 'vercel.ts',
    names: [
      'createRouteUnaryVercelFetch',
      'createRouteUnaryVercelFetchFor',
      'createRouteUnaryFetch',
      'createRouteUnaryFetchFor',
      'createUnaryRouteVercelFetch',
      'createUnaryRouteVercelFetchFor',
      'createUnaryVercelFetch',
      'createUnaryVercelFetchFor',
      'createUnaryRouteFetch',
      'createUnaryRouteFetchFor',
      'createUnaryFetch',
      'createUnaryFetchFor',
      'createRouteStreamVercelFetch',
      'createRouteStreamVercelFetchFor',
      'createRouteStreamFetch',
      'createRouteStreamFetchFor',
      'createStreamRouteVercelFetch',
      'createStreamRouteVercelFetchFor',
      'createStreamVercelFetch',
      'createStreamVercelFetchFor',
      'createStreamRouteFetch',
      'createStreamRouteFetchFor',
      'createStreamFetch',
      'createStreamFetchFor',
      'createRouteUnaryVercel',
      'createRouteUnaryVercelFor',
      'createRouteUnaryVercelFunction',
      'createRouteUnaryVercelFunctionFor',
      'createUnaryRouteVercel',
      'createUnaryRouteVercelFor',
      'createUnaryVercel',
      'createUnaryVercelFor',
      'createUnaryRouteVercelFunction',
      'createUnaryRouteVercelFunctionFor',
      'createUnaryVercelFunction',
      'createUnaryVercelFunctionFor',
      'createRouteStreamVercel',
      'createRouteStreamVercelFor',
      'createRouteStreamVercelFunction',
      'createRouteStreamVercelFunctionFor',
      'createStreamRouteVercel',
      'createStreamRouteVercelFor',
      'createStreamVercel',
      'createStreamVercelFor',
      'createStreamRouteVercelFunction',
      'createStreamRouteVercelFunctionFor',
      'createStreamVercelFunction',
      'createStreamVercelFunctionFor',
    ],
  },
] as const;

const routeKindClientInputPatterns = [
  [
    'createRouteUnaryProtocolRequest',
    /export function createRouteUnaryProtocolRequest[\s\S]*?input: RpcRouteUnaryInput<TRoutes, NoInfer<TId>>/,
  ],
  [
    'createRouteStreamProtocolRequest',
    /export function createRouteStreamProtocolRequest[\s\S]*?input: RpcRouteStreamInput<TRoutes, NoInfer<TId>>/,
  ],
  [
    'createManifestRouteUnaryProtocolRequest',
    /export function createManifestRouteUnaryProtocolRequest[\s\S]*?input: RpcManifestRouteUnaryInput<TManifest, NoInfer<TId>>/,
  ],
  [
    'createManifestRouteStreamProtocolRequest',
    /export function createManifestRouteStreamProtocolRequest[\s\S]*?input: RpcManifestRouteStreamInput<TManifest, NoInfer<TId>>/,
  ],
  [
    'createRouteRequest',
    /export function createRouteRequest[\s\S]*?input: RpcRouteUnaryInput<TRoutes, NoInfer<TId>>/,
  ],
  [
    'createManifestRouteRequest',
    /export function createManifestRouteRequest[\s\S]*?input: RpcManifestRouteUnaryInput<TManifest, NoInfer<TId>>/,
  ],
  [
    'RpcRouteUnaryTransportClient',
    /export interface RpcRouteUnaryTransportClient[\s\S]*?input: RpcRouteUnaryInput<TRoutes, NoInfer<TId>>/,
  ],
  [
    'RpcRouteStreamTransportClient',
    /export interface RpcRouteStreamTransportClient[\s\S]*?input: RpcRouteStreamInput<TRoutes, NoInfer<TId>>/,
  ],
  [
    'RpcManifestRouteUnaryTransportClient',
    /export interface RpcManifestRouteUnaryTransportClient[\s\S]*?input: RpcManifestRouteUnaryInput<TManifest, NoInfer<TId>>/,
  ],
  [
    'RpcManifestRouteStreamTransportClient',
    /export interface RpcManifestRouteStreamTransportClient[\s\S]*?input: RpcManifestRouteStreamInput<TManifest, NoInfer<TId>>/,
  ],
] as const;

const routeKindClientCoreAliasSnippets = [
  {
    name: 'RpcRouteUnaryProcedure',
    snippets: ['TRoutes[TId]'],
  },
  {
    name: 'RpcRouteStreamProcedure',
    snippets: ['TRoutes[TId]'],
  },
  {
    name: 'RpcRouteUnaryInput',
    snippets: ['ProcedureInput<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamInput',
    snippets: ['ProcedureInput<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryOutput',
    snippets: ['ProcedureOutput<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamOutput',
    snippets: ['ProcedureOutput<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryHeaders',
    snippets: ['ProcedureHeaders<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamHeaders',
    snippets: ['ProcedureHeaders<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryClientHeaders',
    snippets: ['ClientProcedureHeaders<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamClientHeaders',
    snippets: ['ClientProcedureHeaders<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders<RpcRouteUnaryProcedure<TRoutes, TId>>',
    ],
  },
  {
    name: 'RpcRouteStreamResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders<RpcRouteStreamProcedure<TRoutes, TId>>',
    ],
  },
  {
    name: 'RpcRouteUnaryError',
    snippets: ['RpcProcedureError<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamError',
    snippets: ['RpcProcedureError<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryErrorCode',
    snippets: ['ProcedureErrorCode<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamErrorCode',
    snippets: ['ProcedureErrorCode<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryErrorDetails',
    snippets: ['ProcedureErrorDetails<RpcRouteUnaryProcedure<TRoutes, TId>'],
  },
  {
    name: 'RpcRouteStreamErrorDetails',
    snippets: ['ProcedureErrorDetails<RpcRouteStreamProcedure<TRoutes, TId>'],
  },
  {
    name: 'RpcRouteStreamEvent',
    snippets: ['ProcedureStreamEvent<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryRequestOptions',
    snippets: ['ClientRequestOptions<RpcRouteUnaryProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteStreamRequestOptions',
    snippets: ['ClientRequestOptions<RpcRouteStreamProcedure<TRoutes, TId>>'],
  },
  {
    name: 'RpcRouteUnaryClientArgs',
    snippets: ['RpcRouteUnaryClientArgsFor<TRoutes, TId>'],
  },
  {
    name: 'RpcRouteStreamClientArgs',
    snippets: ['RpcRouteStreamClientArgsFor<TRoutes, TId>'],
  },
  {
    name: 'RpcRouteUnaryBodyResultFor',
    snippets: [
      'RpcRouteUnaryProtocolBatchResults<TRoutes, TBody>',
      'RpcRouteUnaryProtocolBodyResultFor<TRoutes, TBody>',
    ],
  },
  {
    name: 'RpcRouteStreamBodyResultFor',
    snippets: ['RpcRouteStreamBodyResult<TRoutes>'],
  },
] as const;

const routeKindDispatcherInputPatterns = [
  [
    'RpcManifestRouteProtocolRequestFor',
    /type RpcManifestRouteProtocolRequestFor<[\s\S]*?readonly input: RpcManifestRouteInput<TManifest, TId> & JsonValue/,
  ],
  [
    'RpcManifestRouteUnaryClientArgs',
    /export type RpcManifestRouteUnaryClientArgs<[\s\S]*?RpcManifestRouteUnaryClientArgsFor<TManifest, TId>/,
  ],
  [
    'RpcManifestRouteStreamClientArgs',
    /export type RpcManifestRouteStreamClientArgs<[\s\S]*?RpcManifestRouteStreamClientArgsFor<TManifest, TId>/,
  ],
  [
    'RpcManifestRouteRequestFor',
    /type RpcManifestRouteRequestFor<[\s\S]*?readonly input: RpcManifestRouteUnaryInput<TManifest, TId>/,
  ],
] as const;

const routeKindManifestCoreAliasSnippets = [
  {
    name: 'JoorManifestRouteUnaryProcedure',
    snippets: ['JoorManifestRoutes<TManifest>[TId]'],
  },
  {
    name: 'JoorManifestRouteStreamProcedure',
    snippets: ['JoorManifestRoutes<TManifest>[TId]'],
  },
  {
    name: 'JoorManifestRouteUnaryInput',
    snippets: [
      'ProcedureInput<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamInput',
    snippets: [
      'ProcedureInput<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryOutput',
    snippets: [
      'ProcedureOutput<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamOutput',
    snippets: [
      'ProcedureOutput<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryHeaders',
    snippets: [
      'ProcedureHeaders<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamHeaders',
    snippets: [
      'ProcedureHeaders<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryClientHeaders',
    snippets: [
      'ClientProcedureHeaders<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamClientHeaders',
    snippets: [
      'ClientProcedureHeaders<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders< JoorManifestRouteUnaryProcedure<TManifest, TId> >',
    ],
  },
  {
    name: 'JoorManifestRouteStreamResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders< JoorManifestRouteStreamProcedure<TManifest, TId> >',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryError',
    snippets: [
      'RpcProcedureError<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamError',
    snippets: [
      'RpcProcedureError<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryErrorCode',
    snippets: [
      'ProcedureErrorCode<JoorManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamErrorCode',
    snippets: [
      'ProcedureErrorCode<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryErrorDetails',
    snippets: [
      'ProcedureErrorDetails< JoorManifestRouteUnaryProcedure<TManifest, TId>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamErrorDetails',
    snippets: [
      'ProcedureErrorDetails< JoorManifestRouteStreamProcedure<TManifest, TId>',
    ],
  },
  {
    name: 'JoorManifestRouteStreamEvent',
    snippets: [
      'ProcedureStreamEvent<JoorManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'JoorManifestRouteUnaryRequestOptions',
    snippets: ['RpcRouteUnaryRequestOptions<JoorManifestRoutes<TManifest>, TId>'],
  },
  {
    name: 'JoorManifestRouteStreamRequestOptions',
    snippets: ['RpcRouteStreamRequestOptions<JoorManifestRoutes<TManifest>, TId>'],
  },
  {
    name: 'JoorManifestRouteUnaryClientArgs',
    snippets: ['RpcRouteUnaryClientArgs<JoorManifestRoutes<TManifest>, TId>'],
  },
  {
    name: 'JoorManifestRouteStreamClientArgs',
    snippets: ['RpcRouteStreamClientArgs<JoorManifestRoutes<TManifest>, TId>'],
  },
  {
    name: 'JoorManifestRouteUnaryBodyResultFor',
    snippets: ['RpcRouteUnaryBodyResultFor<JoorManifestRoutes<TManifest>, TBody>'],
  },
  {
    name: 'JoorManifestRouteStreamBodyResultFor',
    snippets: ['RpcRouteStreamBodyResultFor<JoorManifestRoutes<TManifest>, TBody>'],
  },
] as const;

const routeKindDispatcherHandlerOptionSnippets = [
  {
    name: 'RpcManifestRouteUnaryHandlerOptionsFor',
    snippets: [
      'TBody extends RpcManifestRouteUnaryBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
      'HandlerOptionsForRequirements<',
      'RpcManifestRouteUnaryRequiredServices<TManifest>',
      'RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamHandlerOptionsFor',
    snippets: [
      'TBody extends RpcManifestRouteStreamBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
      'HandlerOptionsForRequirements<',
      'RpcManifestRouteStreamRequiredServices<TManifest>',
      'RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryHandlerOptionsArgsFor',
    snippets: [
      'TOptionsOrBody = HandlerOptions< TPlugins, RpcManifestRouteUnaryBody<TManifest> >',
      'TBody extends RpcManifestRouteUnaryBody<TManifest>',
      'HandlerOptionsArgsForRequirements<',
      'RpcManifestRouteUnaryRequiredServices<TManifest>',
      'RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamHandlerOptionsArgsFor',
    snippets: [
      'TOptionsOrBody = HandlerOptions< TPlugins, RpcManifestRouteStreamBody<TManifest> >',
      'TBody extends RpcManifestRouteStreamBody<TManifest>',
      'HandlerOptionsArgsForRequirements<',
      'RpcManifestRouteStreamRequiredServices<TManifest>',
      'RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs',
    snippets: [
      'TBody extends RpcManifestRouteUnaryBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
      'HandlerOptionsWithTrailingArgsForRequirements<',
      'RpcManifestRouteUnaryRequiredServices<TManifest>',
      'RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamHandlerOptionsWithTrailingArgs',
    snippets: [
      'TBody extends RpcManifestRouteStreamBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
      'HandlerOptionsWithTrailingArgsForRequirements<',
      'RpcManifestRouteStreamRequiredServices<TManifest>',
      'RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
    ],
  },
] as const;

const routeKindDispatcherCoreAliasSnippets = [
  {
    name: 'RpcManifestRouteUnaryInput',
    snippets: ['ProcedureInput<RpcManifestRouteUnaryProcedure<TManifest, TId>>'],
  },
  {
    name: 'RpcManifestRouteStreamInput',
    snippets: [
      'ProcedureInput<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryOutput',
    snippets: [
      'ProcedureOutput<RpcManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamOutput',
    snippets: [
      'ProcedureOutput<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryHeaders',
    snippets: [
      'ProcedureHeaders<RpcManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamHeaders',
    snippets: [
      'ProcedureHeaders<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryClientHeaders',
    snippets: [
      'ClientProcedureHeaders<RpcManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamClientHeaders',
    snippets: [
      'ClientProcedureHeaders<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders< RpcManifestRouteUnaryProcedure<TManifest, TId> >',
    ],
  },
  {
    name: 'RpcManifestRouteStreamResponseHeaders',
    snippets: [
      'ProcedureResponseHeaders< RpcManifestRouteStreamProcedure<TManifest, TId> >',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryError',
    snippets: [
      'RpcManifestProcedureError<RpcManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamError',
    snippets: [
      'RpcManifestProcedureError<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryErrorCode',
    snippets: [
      'ProcedureErrorCode<RpcManifestRouteUnaryProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamErrorCode',
    snippets: [
      'ProcedureErrorCode<RpcManifestRouteStreamProcedure<TManifest, TId>>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryRequestOptions',
    snippets: [
      'RpcManifestRouteUnaryProcedure<TManifest, TId>',
      'RpcManifestRouteUnaryClientHeaders<TManifest, TId>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamRequestOptions',
    snippets: [
      'RpcManifestRouteStreamProcedure<TManifest, TId>',
      'RpcManifestRouteStreamClientHeaders<TManifest, TId>',
    ],
  },
  {
    name: 'RpcManifestRouteUnaryBodyResultFor',
    snippets: [
      'RpcManifestRouteUnaryProtocolBatchResults<TManifest, TBody>',
      'RpcManifestRouteUnaryProtocolBodyResultFor<TManifest, TBody>',
    ],
  },
  {
    name: 'RpcManifestRouteStreamBodyResultFor',
    snippets: ['RpcManifestRouteStreamBodyResult<TManifest>'],
  },
] as const;

const routeKindConfigAliasSnippets = [
  {
    name: 'JoorRouteUnaryConfigFor',
    snippets: [
      'TBody extends RpcManifestRouteUnaryBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
      'RpcManifestRouteUnaryHandlerOptionsFor<',
    ],
  },
  {
    name: 'JoorRouteStreamConfigFor',
    snippets: [
      'TBody extends RpcManifestRouteStreamBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
      'RpcManifestRouteStreamHandlerOptionsFor<',
    ],
  },
  {
    name: 'DefineRouteUnaryConfigFor',
    snippets: [
      'TBody extends RpcManifestRouteUnaryBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>',
      'JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'DefineRouteStreamConfigFor',
    snippets: [
      'TBody extends RpcManifestRouteStreamBody<TManifest>',
      'TRequest extends Request = RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>',
      'JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>',
    ],
  },
] as const;

const generatedClientRouteKindCoreAliasSnippets = [
  {
    name: 'RouteUnaryProcedure',
    snippets: ['JoorManifestRouteUnaryProcedure<Manifest, TId>'],
  },
  {
    name: 'RouteStreamProcedure',
    snippets: ['JoorManifestRouteStreamProcedure<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryInput',
    snippets: ['JoorManifestRouteUnaryInput<Manifest, TId>'],
  },
  {
    name: 'RouteStreamInput',
    snippets: ['JoorManifestRouteStreamInput<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryOutput',
    snippets: ['JoorManifestRouteUnaryOutput<Manifest, TId>'],
  },
  {
    name: 'RouteStreamOutput',
    snippets: ['JoorManifestRouteStreamOutput<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryHeaders',
    snippets: ['JoorManifestRouteUnaryHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteStreamHeaders',
    snippets: ['JoorManifestRouteStreamHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryClientHeaders',
    snippets: ['JoorManifestRouteUnaryClientHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteStreamClientHeaders',
    snippets: ['JoorManifestRouteStreamClientHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryResponseHeaders',
    snippets: ['JoorManifestRouteUnaryResponseHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteStreamResponseHeaders',
    snippets: ['JoorManifestRouteStreamResponseHeaders<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryError',
    snippets: ['JoorManifestRouteUnaryError<Manifest, TId>'],
  },
  {
    name: 'RouteStreamError',
    snippets: ['JoorManifestRouteStreamError<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryErrorCode',
    snippets: ['JoorManifestRouteUnaryErrorCode<Manifest, TId>'],
  },
  {
    name: 'RouteStreamErrorCode',
    snippets: ['JoorManifestRouteStreamErrorCode<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryErrorDetails',
    snippets: ['JoorManifestRouteUnaryErrorDetails<Manifest, TId, TCode>'],
  },
  {
    name: 'RouteStreamErrorDetails',
    snippets: ['JoorManifestRouteStreamErrorDetails<Manifest, TId, TCode>'],
  },
  {
    name: 'RouteStreamEvent',
    snippets: ['JoorManifestRouteStreamEvent<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryRequestOptions',
    snippets: ['JoorManifestRouteUnaryRequestOptions<Manifest, TId>'],
  },
  {
    name: 'RouteStreamRequestOptions',
    snippets: ['JoorManifestRouteStreamRequestOptions<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryClientArgs',
    snippets: ['JoorManifestRouteUnaryClientArgs<Manifest, TId>'],
  },
  {
    name: 'RouteStreamClientArgs',
    snippets: ['JoorManifestRouteStreamClientArgs<Manifest, TId>'],
  },
  {
    name: 'RouteUnaryTransportClient',
    snippets: ['JoorManifestRouteUnaryTransportClient<Manifest>'],
  },
  {
    name: 'RouteStreamTransportClient',
    snippets: ['JoorManifestRouteStreamTransportClient<Manifest>'],
  },
  {
    name: 'RouteUnaryBodyResultFor',
    snippets: ['JoorManifestRouteUnaryBodyResultFor<Manifest, TBody>'],
  },
  {
    name: 'RouteStreamBodyResultFor',
    snippets: ['JoorManifestRouteStreamBodyResult<Manifest>'],
  },
] as const;

const generatedNativeRouteKindCoreAliasSnippets = [
  {
    name: 'NativeRouteUnaryProcedure',
    snippets: ['JoorManifestRouteUnaryProcedure<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamProcedure',
    snippets: ['JoorManifestRouteStreamProcedure<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryInput',
    snippets: ['JoorManifestRouteUnaryInput<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamInput',
    snippets: ['JoorManifestRouteStreamInput<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryOutput',
    snippets: ['JoorManifestRouteUnaryOutput<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamOutput',
    snippets: ['JoorManifestRouteStreamOutput<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryHeaders',
    snippets: ['JoorManifestRouteUnaryHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamHeaders',
    snippets: ['JoorManifestRouteStreamHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryClientHeaders',
    snippets: ['JoorManifestRouteUnaryClientHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamClientHeaders',
    snippets: ['JoorManifestRouteStreamClientHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryResponseHeaders',
    snippets: ['JoorManifestRouteUnaryResponseHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamResponseHeaders',
    snippets: ['JoorManifestRouteStreamResponseHeaders<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryError',
    snippets: ['JoorManifestRouteUnaryError<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamError',
    snippets: ['JoorManifestRouteStreamError<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryErrorCode',
    snippets: ['JoorManifestRouteUnaryErrorCode<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamErrorCode',
    snippets: ['JoorManifestRouteStreamErrorCode<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryErrorDetails',
    snippets: [
      'JoorManifestRouteUnaryErrorDetails<NativeManifest, TId, TCode>',
    ],
  },
  {
    name: 'NativeRouteStreamErrorDetails',
    snippets: [
      'JoorManifestRouteStreamErrorDetails<NativeManifest, TId, TCode>',
    ],
  },
  {
    name: 'NativeRouteStreamEvent',
    snippets: ['JoorManifestRouteStreamEvent<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryRequestOptions',
    snippets: ['JoorManifestRouteUnaryRequestOptions<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamRequestOptions',
    snippets: ['JoorManifestRouteStreamRequestOptions<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryClientArgs',
    snippets: ['JoorManifestRouteUnaryClientArgs<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteStreamClientArgs',
    snippets: ['JoorManifestRouteStreamClientArgs<NativeManifest, TId>'],
  },
  {
    name: 'NativeRouteUnaryConfig',
    snippets: ['JoorRouteUnaryConfigFor<NativeManifest, TPlugins, TBody, TRequest>'],
  },
  {
    name: 'NativeRouteStreamConfig',
    snippets: ['JoorRouteStreamConfigFor<NativeManifest, TPlugins, TBody, TRequest>'],
  },
  {
    name: 'NativeRouteUnaryHandlerOptions',
    snippets: [
      'RpcManifestRouteUnaryHandlerOptionsFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteStreamHandlerOptions',
    snippets: [
      'RpcManifestRouteStreamHandlerOptionsFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteUnaryHandlerOptionsArgsFor',
    snippets: [
      'TOptionsOrBody extends NativeRouteUnaryHandlerOptions<TPlugins> | NativeRouteUnaryBody',
      'RpcManifestRouteUnaryHandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody, TBody, NativeRouteUnaryHandlerOptions<TPlugins, TBody, TRequest>, TRequest>',
    ],
  },
  {
    name: 'NativeRouteStreamHandlerOptionsArgsFor',
    snippets: [
      'TOptionsOrBody extends NativeRouteStreamHandlerOptions<TPlugins> | NativeRouteStreamBody',
      'RpcManifestRouteStreamHandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody, TBody, NativeRouteStreamHandlerOptions<TPlugins, TBody, TRequest>, TRequest>',
    ],
  },
  {
    name: 'NativeRouteUnaryHandlerHookContext',
    snippets: [
      'RpcManifestRouteUnaryHandlerHookContextFor<NativeManifest, TPlugins, TBody>',
    ],
  },
  {
    name: 'NativeRouteStreamHandlerHookContext',
    snippets: [
      'RpcManifestRouteStreamHandlerHookContextFor<NativeManifest, TPlugins, TBody>',
    ],
  },
  {
    name: 'NativeRouteUnaryHandlerHooks',
    snippets: [
      'RpcManifestRouteUnaryHandlerHooksFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteStreamHandlerHooks',
    snippets: [
      'RpcManifestRouteStreamHandlerHooksFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteUnaryMiddleware',
    snippets: [
      'RpcManifestRouteUnaryMiddlewareFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteStreamMiddleware',
    snippets: [
      'RpcManifestRouteStreamMiddlewareFor<NativeManifest, TPlugins, TBody, TRequest>',
    ],
  },
  {
    name: 'NativeRouteUnaryBodyResultFor',
    snippets: ['JoorManifestRouteUnaryBodyResultFor<NativeManifest, TBody>'],
  },
  {
    name: 'NativeRouteStreamBodyResultFor',
    snippets: ['JoorManifestRouteStreamBodyResult<NativeManifest>'],
  },
] as const;

const routeKindRuntimeResponseAliasSnippets = [
  {
    name: 'RouteUnaryTransportBodyResultFor',
    snippets: [
      'RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>',
      'SerializedJsonEnvelope',
    ],
  },
  {
    name: 'RouteStreamTransportBodyResultFor',
    snippets: [
      'RpcManifestRouteStreamBodyResultFor<TManifest, TBody>',
      'SerializedJsonEnvelope',
    ],
  },
] as const;

const routeKindRuntimeCompiledAliasSnippets = [
  {
    name: 'CompiledRouteUnaryTransportBodyResultFor',
    snippets: [
      'RpcManifestRouteUnaryBodyResultFor<TManifest, TBody>',
      'CompiledSerializedEnvelope',
    ],
  },
  {
    name: 'CompiledRouteStreamTransportBodyResultFor',
    snippets: [
      'RpcManifestRouteStreamBodyResultFor<TManifest, _TBody>',
      'CompiledSerializedEnvelope',
    ],
  },
] as const;

const routeKindManifestWideForbiddenSnippets = [
  {
    label: 'RpcManifestBody<TManifest>',
    pattern: /\bRpcManifestBody<TManifest>/,
  },
  {
    label: 'RpcManifestRequiredRuntimeRequest<TManifest>',
    pattern: /\bRpcManifestRequiredRuntimeRequest<TManifest>/,
  },
  {
    label: 'RpcManifestRequiredServices<TManifest>',
    pattern: /\bRpcManifestRequiredServices<TManifest>/,
  },
  {
    label: 'HandlerOptionsFor<TManifest',
    pattern: /\bHandlerOptionsFor<TManifest/,
  },
  {
    label: 'HandlerOptionsArgs<TManifest',
    pattern: /\bHandlerOptionsArgs<TManifest/,
  },
] as const;

const normalizeTypeSource = (source: string): string =>
  source.replace(/\s+/g, ' ');

const exportedTypeSource = (source: string, name: string): string => {
  const typePattern = new RegExp(
    `\\bexport\\s+type\\s+${name}(?:\\s*<|\\s*=)`
  );
  const match = typePattern.exec(source);
  if (match === null || match.index === undefined) return '';
  const marker = match[0];
  const start = match.index;
  const end = source.indexOf('\nexport type ', start + marker.length);
  return normalizeTypeSource(source.slice(start, end === -1 ? undefined : end));
};

const collectExportedTypeAliasSources = (
  source: string
): ReadonlyMap<string, string> => {
  const aliases = new Map<string, string>();
  for (const match of source.matchAll(
    /\bexport\s+type\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s*<|[\s=])/g
  )) {
    const name = match[1];
    if (name === undefined) continue;
    const start = match.index;
    if (start === undefined) continue;
    const nextExport = /\nexport\s+(?:type|interface|function|const|class)\s+/.exec(
      source.slice(start + match[0].length)
    );
    const end =
      nextExport === null
        ? undefined
        : start + match[0].length + nextExport.index;
    aliases.set(
      name,
      normalizeTypeSource(source.slice(start, end))
    );
  }

  return aliases;
};

const collectExportedValueDeclarationSources = (
  source: string
): ReadonlyMap<string, string> => {
  const declarations = new Map<string, string>();
  for (const match of source.matchAll(
    /\bexport\s+(?:function|const)\s+([A-Za-z_][A-Za-z0-9_]*)/g
  )) {
    const name = match[1];
    if (name === undefined) continue;
    const start = match.index;
    if (start === undefined) continue;
    const nextExport = /\nexport\s+(?:type|interface|function|const|class)\s+/.exec(
      source.slice(start + match[0].length)
    );
    const end =
      nextExport === null
        ? undefined
        : start + match[0].length + nextExport.index;
    declarations.set(name, normalizeTypeSource(source.slice(start, end)));
  }

  return declarations;
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

  it('keeps source concise route aliases available', async () => {
    const exportSets = await sourceExportSets();
    const missing = [...exportSets]
      .flatMap(([file, names]) => {
        if (file === compilerEmitter) return [];
        return [...names].flatMap((name) => {
          const conciseName = conciseRouteAliasName(name);
          return conciseName !== undefined && !names.has(conciseName)
            ? [`${relative(repoRoot, file)}: ${name} is missing ${conciseName}`]
            : [];
        });
      })
      .sort();

    expect(missing).toEqual([]);
  });

  it(
    'keeps generated route-first and noun-first aliases paired',
    async () => {
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
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated concise route aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const missing = [...exportSets]
        .flatMap(([file, names]) =>
          [...names].flatMap((name) => {
            const conciseName = conciseRouteAliasName(name);
            return conciseName !== undefined && !names.has(conciseName)
              ? [
                  `${relative(repoRoot, file)}: ${name} is missing ${conciseName}`,
                ]
              : [];
          })
        )
        .sort();

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated dispatcher route export surfaces aligned',
    async () => {
      const exportSets = await generatedExportSets();
      const dispatchers = new Map(
        [...exportSets]
          .filter(([file]) =>
            [
              'deno-dispatcher.safe.ts',
              'dispatcher.safe.ts',
              'dispatcher.streaming.ts',
            ].includes(basename(file))
          )
          .map(([file, names]) => [basename(file), routeExportNames(names)])
      );
      const baseline = dispatchers.get('dispatcher.safe.ts');
      const missing = [
        'deno-dispatcher.safe.ts',
        'dispatcher.safe.ts',
        'dispatcher.streaming.ts',
      ].flatMap((name) =>
        dispatchers.has(name) ? [] : [`${name}: <missing generated file>`]
      );
      const mismatched =
        baseline === undefined
          ? []
          : [...dispatchers].flatMap(([name, names]) =>
              names.join('\n') === baseline.join('\n')
                ? []
                : [`${name}: ${names.length} route exports`]
            );

      expect([...missing, ...mismatched].sort()).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated client route batch aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const exports = [...exportSets].find(
        ([file]) => basename(file) === 'client.ts'
      )?.[1];
      const missing =
        exports === undefined
          ? ['client.ts: <missing>']
          : generatedClientRouteBatchAliases.flatMap((name) =>
              exports.has(name) ? [] : [`client.ts: ${name}`]
            );

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated client route-specific exports available',
    async () => {
      const exportSets = await generatedExportSets();
      const exports = [...exportSets].find(
        ([file]) => basename(file) === 'client.ts'
      )?.[1];
      const missing =
        exports === undefined
          ? ['client.ts: <missing>']
          : generatedClientRouteTransportExports.flatMap((name) =>
              exports.has(name) ? [] : [`client.ts: ${name}`]
            );

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated dispatcher route batch aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const dispatchers = new Map(
        [...exportSets]
          .filter(([file]) =>
            [
              'deno-dispatcher.safe.ts',
              'dispatcher.safe.ts',
              'dispatcher.streaming.ts',
            ].includes(basename(file))
          )
          .map(([file, names]) => [basename(file), names])
      );
      const missing = [
        'deno-dispatcher.safe.ts',
        'dispatcher.safe.ts',
        'dispatcher.streaming.ts',
      ].flatMap((entrypoint) => {
        const exports = dispatchers.get(entrypoint);
        if (exports === undefined) return [`${entrypoint}: <missing>`];
        return generatedDispatcherRouteBatchAliases.flatMap((name) =>
          exports.has(name) ? [] : [`${entrypoint}: ${name}`]
        );
      });

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated dispatcher route definition aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const dispatchers = new Map(
        [...exportSets]
          .filter(([file]) =>
            [
              'deno-dispatcher.safe.ts',
              'dispatcher.safe.ts',
              'dispatcher.streaming.ts',
            ].includes(basename(file))
          )
          .map(([file, names]) => [basename(file), names])
      );
      const missing = [
        'deno-dispatcher.safe.ts',
        'dispatcher.safe.ts',
        'dispatcher.streaming.ts',
      ].flatMap((entrypoint) => {
        const exports = dispatchers.get(entrypoint);
        if (exports === undefined) return [`${entrypoint}: <missing>`];
        return generatedDispatcherRouteDefinitionAliases.flatMap((name) =>
          exports.has(name) ? [] : [`${entrypoint}: ${name}`]
        );
      });

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated dispatcher compiled route aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const dispatchers = new Map(
        [...exportSets]
          .filter(([file]) =>
            [
              'deno-dispatcher.safe.ts',
              'dispatcher.safe.ts',
              'dispatcher.streaming.ts',
            ].includes(basename(file))
          )
          .map(([file, names]) => [basename(file), names])
      );
      const missing = [
        'deno-dispatcher.safe.ts',
        'dispatcher.safe.ts',
        'dispatcher.streaming.ts',
      ].flatMap((entrypoint) => {
        const exports = dispatchers.get(entrypoint);
        if (exports === undefined) return [`${entrypoint}: <missing>`];
        return generatedDispatcherCompiledRouteAliases.flatMap((name) =>
          exports.has(name) ? [] : [`${entrypoint}: ${name}`]
        );
      });

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated platform route requirement aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const exportsByBasename = new Map(
        [...exportSets].map(([file, names]) => [basename(file), names])
      );
      const missing = generatedPlatformEntrypoints.flatMap((entrypoint) => {
        const exports = exportsByBasename.get(entrypoint);
        if (exports === undefined) return [`${entrypoint}: <missing>`];
        return generatedRouteRequirementAliases.flatMap((name) =>
          exports.has(name) ? [] : [`${entrypoint}: ${name}`]
        );
      });

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated platform route handler type aliases available',
    async () => {
      const exportSets = await generatedExportSets();
      const exportsByBasename = new Map(
        [...exportSets].map(([file, names]) => [basename(file), names])
      );
      const missing = generatedPlatformRouteHandlerTypeAliases.flatMap(
        ({ entrypoint, names }) => {
          const exports = exportsByBasename.get(entrypoint);
          if (exports === undefined) return [`${entrypoint}: <missing>`];
          return names.flatMap((name) =>
            exports.has(name) ? [] : [`${entrypoint}: ${name}`]
          );
        }
      );

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated platform generic factory exports available',
    async () => {
      const exportSets = await generatedExportSets();
      const exportsByBasename = new Map(
        [...exportSets].map(([file, names]) => [basename(file), names])
      );
      const missing = generatedPlatformGenericFactoryExports.flatMap(
        ({ entrypoint, names }) => {
          const exports = exportsByBasename.get(entrypoint);
          if (exports === undefined) return [`${entrypoint}: <missing>`];
          return names.flatMap((name) =>
            exports.has(name) ? [] : [`${entrypoint}: ${name}`]
          );
        }
      );

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it(
    'keeps generated platform route factory exports available',
    async () => {
      const exportSets = await generatedExportSets();
      const exportsByBasename = new Map(
        [...exportSets].map(([file, names]) => [basename(file), names])
      );
      const missing = generatedPlatformRouteFactoryExports.flatMap(
        ({ entrypoint, names }) => {
          const exports = exportsByBasename.get(entrypoint);
          if (exports === undefined) return [`${entrypoint}: <missing>`];
          return names.flatMap((name) =>
            exports.has(name) ? [] : [`${entrypoint}: ${name}`]
          );
        }
      );

      expect(missing).toEqual([]);
    },
    generatedRouteSurfaceTestTimeout
  );

  it('keeps generated client route-kind aliases tied to manifest route aliases', async () => {
    const source = await readFile(compilerEmitter, 'utf8');
    const missing = generatedClientRouteKindCoreAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps generated native route-kind aliases tied to manifest route aliases', async () => {
    const source = await readFile(compilerEmitter, 'utf8');
    const missing = generatedNativeRouteKindCoreAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind client inputs spelled with specific public aliases', async () => {
    const source = await readFile(rpcClient, 'utf8');
    const missing = routeKindClientInputPatterns
      .flatMap(([name, pattern]) => (pattern.test(source) ? [] : [name]))
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps route-kind client core aliases tied to route-specific procedures', async () => {
    const source = await readFile(rpcClient, 'utf8');
    const missing = routeKindClientCoreAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind dispatcher inputs spelled with specific public aliases', async () => {
    const source = await readFile(rpcDispatcher, 'utf8');
    const missing = routeKindDispatcherInputPatterns
      .flatMap(([name, pattern]) => (pattern.test(source) ? [] : [name]))
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps route-kind manifest core aliases tied to route-specific procedures', async () => {
    const source = await readFile(manifestSource, 'utf8');
    const missing = routeKindManifestCoreAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind dispatcher core aliases tied to route-specific procedures', async () => {
    const source = await readFile(rpcDispatcher, 'utf8');
    const missing = routeKindDispatcherCoreAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind config aliases tied to route-specific handler options', async () => {
    const source = await readFile(configSource, 'utf8');
    const missing = routeKindConfigAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind runtime aliases from widening to manifest-wide handler types', async () => {
    const files = [configSource, ...(await collectTypeScriptFiles(runtimeRoot))];
    const leaking = (
      await Promise.all(
        files.map(async (file) => {
          const source = await readFile(file, 'utf8');
          return [...collectExportedTypeAliasSources(source)].flatMap(
            ([name, typeSource]) => {
              if (!routeKindTypePattern.test(name)) return [];
              return routeKindManifestWideForbiddenSnippets.flatMap(
                ({ label, pattern }) =>
                  pattern.test(typeSource)
                    ? [`${relative(repoRoot, file)}: ${name}: ${label}`]
                    : []
              );
            }
          );
        })
      )
    ).flat();

    expect(leaking).toEqual([]);
  });

  it('keeps route-kind runtime factories from widening to manifest-wide handler types', async () => {
    const files = [configSource, ...(await collectTypeScriptFiles(runtimeRoot))];
    const leaking = (
      await Promise.all(
        files.map(async (file) => {
          const source = await readFile(file, 'utf8');
          return [...collectExportedValueDeclarationSources(source)].flatMap(
            ([name, declarationSource]) => {
              if (!routeKindTypePattern.test(name)) return [];
              return routeKindManifestWideForbiddenSnippets.flatMap(
                ({ label, pattern }) =>
                  pattern.test(declarationSource)
                    ? [`${relative(repoRoot, file)}: ${name}: ${label}`]
                    : []
              );
            }
          );
        })
      )
    ).flat();

    expect(leaking).toEqual([]);
  });

  it('keeps route-kind runtime response aliases tied to route-specific body results', async () => {
    const source = await readFile(runtimeResponse, 'utf8');
    const missing = routeKindRuntimeResponseAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind compiled runtime aliases tied to route-specific body results', async () => {
    const source = await readFile(runtimeCompiled, 'utf8');
    const missing = routeKindRuntimeCompiledAliasSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

    expect(missing).toEqual([]);
  });

  it('keeps route-kind dispatcher handler options tied to route-specific requirements', async () => {
    const source = await readFile(rpcDispatcher, 'utf8');
    const missing = routeKindDispatcherHandlerOptionSnippets.flatMap(
      ({ name, snippets }) => {
        const typeSource = exportedTypeSource(source, name);
        if (typeSource.length === 0) return [`${name}: <missing>`];
        return snippets.flatMap((snippet) =>
          typeSource.includes(snippet) ? [] : [`${name}: ${snippet}`]
        );
      }
    );

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

  it('keeps root concise route aliases in sync with source modules', async () => {
    const rootExportNames = new Set(
      collectExportedSymbols(rootIndex, await readFile(rootIndex, 'utf8')).map(
        ({ name }) => name
      )
    );
    const rootReExports = await rootReExportSets();
    const sourceExports = await sourceExportSets();
    const missing = [...sourceExports]
      .flatMap(([file, names]) => {
        if (file === rootIndex || file === compilerEmitter) return [];
        return [...names].flatMap((name) => {
          const conciseName = conciseRouteAliasName(name);
          if (conciseName === undefined || !names.has(conciseName)) return [];
          return !rootReExports.get(file)?.has(conciseName) &&
            !rootExportNames.has(conciseName)
            ? [`${relative(repoRoot, file)}: ${conciseName}`]
            : [];
        });
      })
      .sort();

    expect([...new Set(missing)]).toEqual([]);
  });

  it('keeps package exports mapped for route-bearing public files', async () => {
    const packageExports = await packageExportSet();
    const files = new Set((await publicRouteExports()).map(({ file }) => file));
    const missing = [...files]
      .flatMap((file) => {
        const packageSubpath = packageSubpathForRouteFile(file);
        if (
          packageSubpath !== undefined &&
          packageExports.has(packageSubpath)
        ) {
          return [];
        }
        return [
          `${relative(repoRoot, file)}: ${packageSubpath ?? '<no package path>'}`,
        ];
      })
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps package-subpath smoke imports backed by package exports', async () => {
    const packageExports = await packageExportSet();
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const missing = [...collectPackageImportSubpaths(packageSubpathSource)]
      .filter((packageSubpath) => !packageExports.has(packageSubpath))
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps package exports covered by package-subpath smoke imports', async () => {
    const packageExports = await packageExportSet();
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const smokeImports = collectPackageImportSubpaths(packageSubpathSource);
    const missing = [...packageExports]
      .filter((packageSubpath) => !smokeImports.has(packageSubpath))
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps value-bearing package exports covered by value smoke imports', async () => {
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const importedValues =
      collectImportedValueSourceNamesByModule(packageSubpathSource);
    const sources = new Map(
      await Promise.all(
        (await packageExportEntrypoints()).map(
          async (
            entrypoint
          ): Promise<
            readonly [PackageExportEntrypoint, readonly ExportedSymbol[]]
          > => [
            entrypoint,
            collectExportedSymbols(
              entrypoint.file,
              await readFile(entrypoint.file, 'utf8')
            ),
          ]
        )
      )
    );
    const missing = [...sources]
      .flatMap(([entrypoint, exports]) => {
        const valueNames = exports
          .filter(({ kind }) => kind === 'value')
          .map(({ name }) => name);
        if (valueNames.length === 0) return [];
        const importedNames =
          importedValues.get(entrypoint.moduleSpecifier) ?? new Set<string>();
        if (valueNames.some((name) => importedNames.has(name))) return [];
        return [
          `${entrypoint.packageSubpath}: ${entrypoint.moduleSpecifier} missing value import`,
        ];
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
    const missing = (await publicRouteSurfaceExports())
      .filter(({ name }) => !packageSubpathTokens.has(name))
      .map(({ file, name }) => `${relative(repoRoot, file)}: ${name}`)
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps package-subpath route factory imports tied to canonical subpaths', async () => {
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const importedNames =
      collectImportedSourceNamesByModule(packageSubpathSource);
    const missing = (await publicRouteTypedFactoryExports())
      .flatMap(({ file, name }) => {
        const packageSubpath = packageSubpathForRouteFile(file);
        if (packageSubpath === undefined) {
          return [`${relative(repoRoot, file)}: ${name} <no package path>`];
        }
        const moduleSpecifier = packageImportSpecifier(packageSubpath);
        if (importedNames.get(moduleSpecifier)?.has(name)) return [];
        return [`${relative(repoRoot, file)}: ${name} from ${moduleSpecifier}`];
      })
      .sort();

    expect(missing).toEqual([]);
  });

  it('keeps route type namespace smoke coverage tied to canonical subpaths', async () => {
    const packageSubpathSource = await readFile(packageSubpathTest, 'utf8');
    const missing = missingCanonicalNamespaceReferences(
      await publicRouteTypeExports(),
      packageSubpathSource
    );

    expect(missing).toEqual([]);
  });
});
