import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';
import { emitArtifacts } from '../src/compiler/emit.js';
import { loadProcedures } from '../src/compiler/load.js';
import { scanProcedureFiles } from '../src/compiler/scan.js';
import { defineProcedure, t } from '../src/index.js';

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const fixture = new URL('./fixtures/basic-app/rpc', import.meta.url).pathname;
const fixtureConfig = new URL(
  './fixtures/basic-app/joor.config.ts',
  import.meta.url
).pathname;
const contextlessFixtureConfig = new URL(
  './fixtures/contextless-app/joor.config.ts',
  import.meta.url
).pathname;

const toRelativeModuleSpecifier = (fromDir: string, toFile: string): string => {
  const specifier = relative(fromDir, toFile).replaceAll('\\', '/');
  return specifier.startsWith('.') ? specifier : `./${specifier}`;
};

const expectRouteFirstAliasesPrimary = (source: string) => {
  const routeFirstAliases = source.matchAll(
    /^export type (?<name>(?:Native)?Route(?:Unary|Stream)\w*)[\s\S]*?;/gm
  );

  for (const match of routeFirstAliases) {
    const alias = match.groups?.['name'];
    if (alias === undefined) continue;

    const legacyPrefix = alias.includes('RouteUnary')
      ? '(?:Native)?UnaryRoute'
      : '(?:Native)?StreamRoute';

    expect(match[0], `${alias} should be route-first primary`).not.toMatch(
      new RegExp(`=\\s*${legacyPrefix}`)
    );
  }
};

describe('compiler', () => {
  it('loads procedure files and derives ids', async () => {
    const manifest = await loadProcedures(fixture);

    expect(manifest.procedures.map((entry) => entry.id)).toEqual([
      'admin-user.get-profile',
      'posts.list',
      'tenants.current',
      'users.get',
      'users.watch',
    ]);
    expect(Object.isFrozen(manifest)).toBe(true);
    expect(Object.isFrozen(manifest.procedures)).toBe(true);
    expect(manifest.procedures.every((entry) => Object.isFrozen(entry))).toBe(
      true
    );
  });

  it('discovers JavaScript and TypeScript procedure module extensions', async () => {
    const entry = await mkdtemp(join(tmpdir(), 'joor-scan-'));
    try {
      await mkdir(join(entry, 'admin'), { recursive: true });
      await mkdir(join(entry, 'users'), { recursive: true });
      await writeFile(join(entry, 'health.rpc.ts'), '');
      await writeFile(join(entry, 'admin', 'audit.rpc.mts'), '');
      await writeFile(join(entry, 'admin', 'metrics.rpc.cts'), '');
      await writeFile(join(entry, 'users', 'get.rpc.js'), '');
      await writeFile(join(entry, 'users', 'list.rpc.mjs'), '');
      await writeFile(join(entry, 'users', 'legacy.rpc.cjs'), '');
      await writeFile(join(entry, 'users', 'ignored.ts'), '');

      const files = await scanProcedureFiles(entry);

      expect(files.map((file) => file.id)).toEqual([
        'admin.audit',
        'admin.metrics',
        'health',
        'users.get',
        'users.legacy',
        'users.list',
      ]);
    } finally {
      await rm(entry, { force: true, recursive: true });
    }
  });

  it('emits declarations for inferred protocol request constants', async () => {
    const entry = await mkdtemp(join(repoRoot, '.tmp-joor-declarations-'));
    try {
      const sourceFile = join(entry, 'exports.ts');
      await writeFile(
        sourceFile,
        `import { createManifestRouteUnaryProtocolRequest, defineManifest, defineProcedure, t } from 'joor';

const procedure = defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ name: t.string() }),
  handler(ctx, input) {
    return ctx.ok({ name: input.id });
  },
});

const manifest = defineManifest({
  procedures: {
    'users.get': procedure,
  },
});

export const protocolRequest = createManifestRouteUnaryProtocolRequest(
  manifest,
  'users.get',
  { id: '1' }
);
`
      );
      const tsconfigFile = join(entry, 'tsconfig.json');
      await writeFile(
        tsconfigFile,
        JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'ESNext',
              lib: ['ES2022', 'DOM', 'DOM.Iterable'],
              moduleResolution: 'bundler',
              declaration: true,
              emitDeclarationOnly: true,
              noEmitOnError: true,
              rootDir: repoRoot,
              outDir: join(entry, 'dist'),
              strict: true,
              noImplicitAny: true,
              strictNullChecks: true,
              exactOptionalPropertyTypes: true,
              skipLibCheck: true,
              verbatimModuleSyntax: true,
              isolatedModules: true,
              types: ['node'],
              typeRoots: [join(repoRoot, 'node_modules/@types')],
              baseUrl: repoRoot,
              paths: {
                joor: ['./src/index.ts'],
              },
            },
            include: [sourceFile],
          },
          null,
          2
        )
      );

      try {
        await execFileAsync(
          join(repoRoot, 'node_modules/.bin/tsc'),
          ['--project', tsconfigFile],
          {
            cwd: repoRoot,
            maxBuffer: 1024 * 1024 * 4,
          }
        );
      } catch (error) {
        const output = error as { stdout?: string; stderr?: string };
        throw new Error(
          [output.stdout, output.stderr].filter(Boolean).join('\n')
        );
      }

      const declaration = await readFile(
        join(
          entry,
          'dist',
          relative(repoRoot, sourceFile).replace(/\.ts$/, '.d.ts')
        ),
        'utf8'
      );
      expect(declaration).toContain('protocolRequest');
      expect(declaration).toContain('users.get');
    } finally {
      await rm(entry, { force: true, recursive: true });
    }
  });

  it('emits artifacts', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ entry: fixture, outDir });
      const manifestSource = await readFile(
        join(outDir, 'manifest.ts'),
        'utf8'
      );
      expect(manifestSource).toContain('users.get');
      expect(manifestSource).toContain(
        'export const manifest = Object.freeze({'
      );
      expect(manifestSource).toContain('procedures: Object.freeze({');
      expect(manifestSource).toContain('Object.freeze({ ...');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.safe.ts'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('createCompiledRpcHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain("from 'joor/manifest'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain("from 'joor/schema'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain("from 'joor/procedure'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('createCompiledRpcTransportBodyResultHandler');
      await expect(
        readFile(join(outDir, 'fetch.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.safe.js'");
      await expect(
        readFile(join(outDir, 'cloudflare.ts'), 'utf8')
      ).resolves.toContain('CloudflareWorker');
      await expect(
        readFile(join(outDir, 'next.ts'), 'utf8')
      ).resolves.toContain('NextRouteHandlers');
      await expect(
        readFile(join(outDir, 'next.ts'), 'utf8')
      ).resolves.toContain('createHandlersFor');
      await expect(
        readFile(join(outDir, 'vercel.ts'), 'utf8')
      ).resolves.toContain('VercelFunction');
      await expect(
        readFile(join(outDir, 'netlify.ts'), 'utf8')
      ).resolves.toContain('NetlifyEdgeFetchHandler');
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.toContain('readIncomingBody');
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.toContain('type NativeBody');
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.toContain('type NativeTransportResult');
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.not.toContain('Parameters<typeof nativeTransport>');
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.not.toContain('ReturnType<typeof nativeTransport>');
      await expect(readFile(join(outDir, 'bun.ts'), 'utf8')).resolves.toContain(
        'readJsonBody'
      );
      await expect(readFile(join(outDir, 'bun.ts'), 'utf8')).resolves.toContain(
        'type NativeBody'
      );
      await expect(readFile(join(outDir, 'bun.ts'), 'utf8')).resolves.toContain(
        'type NativeTransportResult'
      );
      await expect(
        readFile(join(outDir, 'bun.ts'), 'utf8')
      ).resolves.not.toContain('Parameters<typeof nativeTransport>');
      await expect(
        readFile(join(outDir, 'bun.ts'), 'utf8')
      ).resolves.not.toContain('ReturnType<typeof nativeTransport>');
      await expect(
        readFile(join(outDir, 'deno.ts'), 'utf8')
      ).resolves.toContain("from './deno-dispatcher.ts'");
      await expect(
        readFile(join(outDir, 'deno-dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('_execute_serialized');
      await expect(
        readFile(join(outDir, 'deno-dispatcher.safe.ts'), 'utf8')
      ).resolves.not.toContain('_execute_response');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export const nativeTransport: NativeTransportHandler ='
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBody');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBody');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBodyResult');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBodyResult');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBodyResultFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeCompiledBodyResultFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteCompiledBodyResultFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeStreamRouteCompiledBodyResultFor'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeTransportResult');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeCompiledTransportResult');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeTransportResultFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeTransportHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteTransportHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeStreamRouteTransportHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBodyHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBodyHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeStreamRouteBodyHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain("from 'joor/context'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeTransportRequest = ContextRequestSource'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.not.toContain(
        'Parameters<CompiledRpcTransportBodyResultHandler'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('const rpcRequest = body as NativeProtocolRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('return compiledNotFound(rpcRequest, request);');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('return undefined;');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.not.toContain('return Promise.resolve(compiledNotFound');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.not.toContain('return Promise.resolve(undefined)');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.not.toContain('Parameters<CompiledDispatch');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'CompiledRpcTransportBodyResultHandlerFor<NativeManifest>'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'CompiledRpcBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export const nativeResponseTransport: NativeTransportHandler ='
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export const nativeTransport: NativeTransportHandler ='
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const nativeBody: NativeBodyHandler =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const nativeRuntime: NativeRuntimeState =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeServices');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRuntimeState');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeConfigFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeConfigBody');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeConfigManifest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeConfigRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeConfigServices');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeHandlerOptionsFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeHandlerOptionsBody');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeHandlerOptionsManifest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeHandlerOptionsRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeHandlerOptionsServices');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeStreamRouteHandlerOptionsFor');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeDispatch');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryDispatch');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeFetchHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteInput');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryId');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteStreamId');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeRouteUnaryProtocolBatchClientHeaders'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeUnaryRouteProtocolBatchClientHeaders'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryProtocolBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteProtocolBatchOptions');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeRouteUnaryProtocolBatchOptionsTuple'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeUnaryRouteProtocolBatchOptionsTuple'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteStreamRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteStreamRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeStreamRouteRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeStreamProtocolRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeRouteUnaryProtocolBatchRequestUnion'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeUnaryRouteProtocolBatchRequestUnion'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteClientHeaders');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteErrorDetails');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export const nativeUnaryDispatch: NativeUnaryDispatch ='
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'const serializedUnaryDispatch: NativeUnaryDispatch'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('switch (rpcRequest.id)');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('_validate_input');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('_serialize_success');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('_response_header_record');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('compiledHasInvalidHeaderValue');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const transport: NativeTransportHandler =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const fetch: NativeFetchHandler =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const createFetchFor =');
      await expect(
        readFile(join(outDir, 'cloudflare.ts'), 'utf8')
      ).resolves.toContain('export const createWorkerFor =');
      await expect(
        readFile(join(outDir, 'vercel.ts'), 'utf8')
      ).resolves.toContain('export const createVercelFor =');
      await expect(
        readFile(join(outDir, 'netlify.ts'), 'utf8')
      ).resolves.toContain('export const createEdgeFor =');
      const dispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );
      expect(dispatcher).toContain('JoorRouteUnaryConfigFor<NativeManifest');
      expect(dispatcher).toContain('JoorRouteStreamConfigFor<NativeManifest');
      expect(dispatcher).toContain('DefineRouteUnaryConfigFor<NativeManifest>');
      expect(dispatcher).toContain(
        'DefineRouteStreamConfigFor<NativeManifest>'
      );
      expect(dispatcher).toContain(
        'RpcManifestRouteUnaryHandlerOptionsFor<NativeManifest'
      );
      expect(dispatcher).toContain(
        'RpcManifestRouteStreamHandlerOptionsFor<NativeManifest'
      );
      expect(dispatcher).toContain(
        'DefineRouteUnaryHandlerOptions<NativeManifest>'
      );
      expect(dispatcher).toContain(
        'DefineRouteStreamHandlerOptions<NativeManifest>'
      );
      expect(dispatcher).toContain(
        'CompiledRouteUnaryTransportBodyResultFor<NativeManifest'
      );
      expect(dispatcher).toContain(
        'CompiledRouteStreamTransportBodyResultFor<NativeManifest'
      );
      expect(dispatcher).toContain(
        'CompiledRpcRouteUnaryTransportBodyResultHandlerFor<NativeManifest>'
      );
      expect(dispatcher).toContain(
        'CompiledRpcRouteStreamTransportBodyResultHandlerFor<NativeManifest>'
      );
      expect(dispatcher).toContain(
        'CompiledRpcRouteUnaryBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>'
      );
      expect(dispatcher).toContain(
        'CompiledRpcRouteStreamBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>'
      );
      expect(dispatcher).toContain('headers?: Record<string, string>');
      expect(dispatcher).not.toContain('headers?: Record<string, JsonValue>');
      const nodeSource = await readFile(join(outDir, 'node.ts'), 'utf8');
      expect(nodeSource).toMatch(
        /createJsonHeaderRecord\(\s*result\.responseHeaders \?\? result\.headers\s*\)/
      );
      expect(nodeSource).toContain('hasInvalidHeaderValue(cors.origin)');
      expect(nodeSource).toContain('hasInvalidHeaderValue(methods)');
      expect(nodeSource).toContain('hasInvalidHeaderValue(headers)');
      expect(nodeSource).toContain(
        'if (cors !== undefined) appendJsonStringHeaders(headers, cors);'
      );
      expect(nodeSource).toContain(
        'outgoing.writeHead(status, createJsonHeaderRecord(cors));'
      );
      expect(nodeSource).not.toContain('...Object.fromEntries(result.headers)');
      expect(nodeSource).not.toContain('{ ...jsonHeaders, ...cors }');
      const bunSource = await readFile(join(outDir, 'bun.ts'), 'utf8');
      expect(bunSource).toContain('hasInvalidHeaderValue(cors.origin)');
      expect(bunSource).toContain('hasInvalidHeaderValue(methods)');
      expect(bunSource).toContain('hasInvalidHeaderValue(headers)');
      expect(bunSource).toContain(
        '{ status, headers: createJsonHeaderRecord(cors) }'
      );
      expect(bunSource).not.toContain('{ ...jsonHeaders, ...cors }');
      const postsListMatch = dispatcher.match(
        /const posts_list_execute_serialized: CompiledFixedDispatch<NativeServices> = async \([\s\S]*?const users_get_execute_serialized: CompiledFixedDispatch<NativeServices> = async \(/
      );
      expect(postsListMatch?.[0]).toBeDefined();
      expect(postsListMatch?.[0]).not.toContain('compiledAuthenticate');
      expect(postsListMatch?.[0]).not.toContain('compiledReadCache');
      expect(postsListMatch?.[0]).not.toContain('compiledWriteCache');
      expect(postsListMatch?.[0]).not.toContain('compiledRateLimitFailure');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('const dispatchSerialized: NativeDispatch');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('createClient');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('"admin-user": {');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain(
        '"get-profile": routeUnary("admin-user.get-profile")'
      );
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteRequestUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBatchOptionsTuple');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBody');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteBody');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type StreamRouteBody');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBodyResult');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteBodyResult');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type StreamRouteBodyResult');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBodyResultFor');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RequiredRuntimeRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RequiredServices');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteRuntimeRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteServices');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type ProtocolRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteUnaryProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteUnaryProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteUnaryProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type ProtocolBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type ProtocolBatchResults');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type ProtocolBatchRequestUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('JoorManifestRouteResult<Manifest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteResultUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type UnaryRouteResultUnion');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('createManifestClient');
      const clientSource = await readFile(join(outDir, 'client.ts'), 'utf8');
      const dispatcherSafeSource = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );
      expectRouteFirstAliasesPrimary(clientSource);
      expectRouteFirstAliasesPrimary(dispatcherSafeSource);
      expect(clientSource).toContain("from 'joor/manifest'");
      expect(clientSource).toContain('export type UnaryRouteFunction');
      expect(clientSource).toContain('export type StreamRouteFunction');
      expect(clientSource).toContain('export type RouteUnaryFunction');
      expect(clientSource).toContain('export type RouteStreamFunction');
      expect(clientSource).toContain('export type BatchFunction');
      expect(clientSource).toContain(
        'export type RouteUnaryFunction<TId extends RouteUnaryId = RouteUnaryId> = {'
      );
      expect(clientSource).toContain(
        'export type UnaryRouteFunction<TId extends RouteUnaryId = RouteUnaryId> =\n  RouteUnaryFunction<TId>;'
      );
      expect(clientSource).toContain(
        'export type RouteStreamFunction<TId extends RouteStreamId = RouteStreamId> = {'
      );
      expect(clientSource).toContain(
        'export type StreamRouteFunction<TId extends RouteStreamId = RouteStreamId> =\n  RouteStreamFunction<TId>;'
      );
      expect(clientSource).toContain(
        'export type BatchFunction = <const TRequests extends readonly [...RouteBatchRequestUnion[]]>'
      );
      expect(clientSource).toContain(
        'readonly call: (...args: RouteUnaryClientArgs<TId>) => Promise<RouteResult<TId>>;'
      );
      expect(clientSource).toContain(
        'readonly request: (...args: RouteUnaryClientArgs<TId>) => RouteRequest<TId>;'
      );
      expect(clientSource).toContain(
        'readonly stream: (...args: RouteStreamClientArgs<TId>) => AsyncIterable<Stream<TId>>;'
      );
      expect(clientSource).toContain('  readonly batch: BatchFunction;');
      expect(clientSource).toContain('export type BatchClientHeaders');
      expect(clientSource).toContain(
        'export type RouteUnaryBatchClientHeaders'
      );
      expect(clientSource).toContain(
        'export type UnaryRouteBatchClientHeaders'
      );
      expect(clientSource).toContain('export type ProtocolBatchClientHeaders');
      expect(clientSource).toContain(
        'export type RouteProtocolBatchClientHeaders'
      );
      expect(clientSource).toContain(
        'export type RouteUnaryProtocolBatchClientHeaders'
      );
      expect(clientSource).toContain(
        'export type UnaryRouteProtocolBatchClientHeaders'
      );
      expect(clientSource).toContain('export type BatchOptions');
      expect(clientSource).toContain('export type BatchOptionsTuple');
      expect(clientSource).toContain('export type ProtocolBatchOptions');
      expect(clientSource).toContain('export type ProtocolBatchOptionsTuple');
      expect(clientSource).toContain('export type RouteBatchOptions');
      expect(clientSource).toContain('export type RouteBatchOptionsTuple');
      expect(clientSource).toContain('export type RouteProtocolBatchOptions');
      expect(clientSource).toContain(
        'export type RouteProtocolBatchOptionsTuple'
      );
      expect(clientSource).toContain('export type RouteUnaryBatchOptions');
      expect(clientSource).toContain('export type RouteUnaryBatchOptionsTuple');
      expect(clientSource).toContain(
        'export type RouteUnaryProtocolBatchOptions'
      );
      expect(clientSource).toContain(
        'export type RouteUnaryProtocolBatchOptionsTuple'
      );
      expect(clientSource).toContain('export type UnaryRouteBatchOptions');
      expect(clientSource).toContain('export type UnaryRouteBatchOptionsTuple');
      expect(clientSource).toContain(
        'export type UnaryRouteProtocolBatchOptions'
      );
      expect(clientSource).toContain(
        'export type UnaryRouteProtocolBatchOptionsTuple'
      );
      expect(clientSource).toContain('export type UnaryRouteTransport');
      expect(clientSource).toContain('export type StreamRouteTransport');
      expect(clientSource).toContain('export type UnaryRouteTransportClient');
      expect(clientSource).toContain('export type StreamRouteTransportClient');
      expect(clientSource).toContain(
        'export type RouteUnaryTransport<TId extends RouteUnaryId = RouteUnaryId> = {'
      );
      expect(clientSource).toContain(
        'export type UnaryRouteTransport<TId extends RouteUnaryId = RouteUnaryId> =\n  RouteUnaryTransport<TId>;'
      );
      expect(clientSource).toContain(
        'export type RouteStreamTransport<TId extends RouteStreamId = RouteStreamId> = {'
      );
      expect(clientSource).toContain(
        'export type StreamRouteTransport<TId extends RouteStreamId = RouteStreamId> =\n  RouteStreamTransport<TId>;'
      );
      expect(clientSource).toContain(
        "export type RouteUnaryTransportClient = Pick<\n  RouteTransportClient,\n  'call' | 'request' | 'batch'\n>;"
      );
      expect(clientSource).toContain(
        'export type UnaryRouteTransportClient = RouteUnaryTransportClient;'
      );
      expect(clientSource).toContain(
        "export type RouteStreamTransportClient = Pick<RouteTransportClient, 'stream'>;"
      );
      expect(clientSource).toContain(
        'export type StreamRouteTransportClient = RouteStreamTransportClient;'
      );
      expect(clientSource).toContain('export type GeneratedClient');
      expect(clientSource).toContain(
        'export function createTransport<TRequest extends Request>'
      );
      expect(clientSource).toContain(
        'readonly "get": RouteUnaryFunction<"users.get">'
      );
      expect(clientSource).toContain(
        'readonly "watch": RouteStreamFunction<"users.watch">'
      );
      expect(clientSource).toContain('export type Client');
      expect(clientSource).not.toContain(
        'export type GeneratedClient = ReturnType<typeof createClient>'
      );
      expect(clientSource).toContain('export type RouteHasHeaders');
      expect(clientSource).toContain('export type RouteRequiresHeaders');
      expect(clientSource).toContain('export type RouteHasResponseHeaders');
      expect(clientSource).toContain(
        'export type RouteRequiresResponseHeaders'
      );
      expect(clientSource).toContain('"get": routeUnary("users.get")');
      expect(clientSource).toContain('"watch": routeStream("users.watch")');
      expect(clientSource).toContain(
        '"current": routeUnary("tenants.current")'
      );
      expect(clientSource).toContain(
        'readonly call: (...args: [id: TId, ...ClientArgs<TId>]) => Promise<RouteResult<TId>>;'
      );
      expect(clientSource).toContain(
        'Object.assign(call, { call, request, protocolRequest })'
      );
      expect(clientSource).not.toContain('ProcedureInput');
      expect(clientSource).toContain('export type RouteProcedure');
      expect(clientSource).toContain('export type UnaryRouteProcedure');
      expect(clientSource).toContain('export type StreamRouteProcedure');
      expect(clientSource).toContain('export type UnaryRouteInput');
      expect(clientSource).toContain('export type StreamRouteInput');
      expect(clientSource).toContain('export type UnaryRouteOutput');
      expect(clientSource).toContain('export type StreamRouteOutput');
      expect(clientSource).toContain('export type UnaryRouteResult');
      expect(clientSource).toContain('export type StreamRouteEvent');
      expect(clientSource).toContain('export type StreamRouteResponseHeaders');
      expect(clientSource).toContain('export type UnaryRouteId');
      expect(clientSource).toContain('export type RouteUnaryId');
      expect(clientSource).toContain('export type StreamRouteId');
      expect(clientSource).toContain('export type RouteStreamId');
      expect(clientSource).toContain('export type RouteResponseHeaders');
      expect(clientSource).toContain('export type RouteError');
      expect(clientSource).toContain('export type RouteErrorCode');
      expect(clientSource).toContain('export type RouteErrorDetails');
      expect(clientSource).toContain('export type UnaryRouteError');
      expect(clientSource).toContain('export type StreamRouteError');
      expect(clientSource).toContain('export type UnaryRouteHasHeaders');
      expect(clientSource).toContain('export type StreamRouteHasHeaders');
      expect(clientSource).toContain('export type RouteStreamEvent');
      expect(clientSource).toContain('export type RouteClientHeaders');
      expect(clientSource).toContain('export type RouteRequestOptions');
      expect(clientSource).toContain('export type UnaryRouteRequest');
      expect(clientSource).toContain('export type RouteUnaryRequest');
      expect(clientSource).toContain('export type UnaryRouteRequestUnion');
      expect(clientSource).toContain('export type RouteUnaryRequestUnion');
      expect(clientSource).toContain('export type UnaryRouteBatchRequest');
      expect(clientSource).toContain('export type RouteUnaryBatchRequest');
      expect(clientSource).toContain('export type UnaryRouteProtocolRequest');
      expect(clientSource).toContain('export type UnaryProtocolRequest');
      expect(clientSource).toContain(
        'export type UnaryRouteProtocolRequestUnion'
      );
      expect(clientSource).toContain('export type UnaryProtocolRequestUnion');
      expect(clientSource).toContain('export type StreamRouteProtocolRequest');
      expect(clientSource).toContain('export type StreamProtocolRequest');
      expect(clientSource).toContain(
        'export type StreamRouteProtocolRequestUnion'
      );
      expect(clientSource).toContain('export type StreamProtocolRequestUnion');
      expect(clientSource).toContain('export type RouteStreamRequest');
      expect(clientSource).toContain('export type StreamRouteRequest');
      expect(clientSource).toContain('export type RouteStreamRequestUnion');
      expect(clientSource).toContain('export type StreamRouteRequestUnion');
      expect(clientSource).toContain('export type UnaryRouteRequestOptions');
      expect(clientSource).toContain('export type StreamRouteRequestOptions');
      expect(clientSource).toContain('export type RouteClientArgs');
      expect(clientSource).toContain('export type UnaryRouteClientArgs');
      expect(clientSource).toContain('export type StreamRouteClientArgs');
      expect(clientSource).toContain('export type ProtocolRequestOptions');
      expect(clientSource).toContain('export type RouteTransportClient');
      expect(clientSource).toContain(
        'JoorManifestClientOptions<Manifest, TRequest>'
      );
      expect(clientSource).toContain(
        'export type GeneratedClientOptions<TRequest extends Request = RequiredRuntimeRequest>'
      );
      expect(clientSource).toContain(
        'export function createTransport<TRequest extends Request = RequiredRuntimeRequest>'
      );
      expect(clientSource).toContain(
        'export function createClient<TRequest extends Request = RequiredRuntimeRequest>'
      );
      expect(clientSource).toContain(
        'createManifestRouteProtocolRequest as createTransportRouteProtocolRequest'
      );
      expect(clientSource).toContain(
        'createManifestRouteRequest as createTransportRouteRequest'
      );
      expect(clientSource).toContain(
        'createManifestRouteStreamProtocolRequest as createTransportRouteStreamProtocolRequest'
      );
      expect(clientSource).toContain(
        'createManifestRouteStreamRequest as createTransportRouteStreamRequest'
      );
      expect(clientSource).toContain(
        'createManifestRouteUnaryProtocolRequest as createTransportRouteUnaryProtocolRequest'
      );
      expect(clientSource).toContain('export type RouteProtocolRequestBuilder');
      expect(clientSource).toContain(
        'export type RouteUnaryProtocolRequestBuilder'
      );
      expect(clientSource).toContain(
        'export type RouteStreamProtocolRequestBuilder'
      );
      expect(clientSource).toContain('export type RouteStreamRequestBuilder');
      expect(clientSource).toContain('export const createRouteProtocolRequest');
      expect(clientSource).toContain(
        'export const createRouteUnaryProtocolRequest'
      );
      expect(clientSource).toContain(
        'export const createUnaryRouteProtocolRequest: typeof createRouteUnaryProtocolRequest'
      );
      expect(clientSource).toContain(
        'export const createRouteStreamProtocolRequest'
      );
      expect(clientSource).toContain(
        'export const createStreamRouteProtocolRequest: typeof createRouteStreamProtocolRequest'
      );
      expect(clientSource).toContain('export const createRouteStreamRequest');
      expect(clientSource).toContain(
        'export const createStreamRouteRequest: typeof createRouteStreamRequest'
      );
      expect(clientSource).toContain('readonly protocolRequest: (');
      expect(clientSource).toContain('input: RouteUnaryInput<TId>');
      expect(clientSource).toContain('input: RouteStreamInput<TId>');
      expect(clientSource).toContain('export type RouteRequestBuilder');
      expect(clientSource).toContain('export const createRouteRequest');
      expect(clientSource).toContain(
        'export const createRouteUnaryRequest: typeof createRouteRequest'
      );
      expect(clientSource).toContain(
        'export const createUnaryRouteRequest: typeof createRouteUnaryRequest'
      );
      expect(clientSource).not.toContain(
        "import type { ClientOptions } from 'joor/client';"
      );
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain('defineProcedure.withContext');
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain(
        'defineProcedure.withContext<Record<string, never>>()'
      );
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain("from 'joor/procedure'");
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain("from 'joor/config'");
      await expect(
        readFile(join(outDir, 'openapi.json'), 'utf8')
      ).resolves.toContain('/rpc');
      await expect(
        readFile(join(outDir, 'ai-docs.json'), 'utf8')
      ).resolves.toContain('users.get');
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('prunes disabled safety checks from compiled artifacts', async () => {
    const manifest = await loadProcedures(fixture);
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await emitArtifacts(manifest, {
        outDir,
        config: {},
      });
      const safeDispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );
      expect(safeDispatcher).toContain('_validate_input');
      expect(safeDispatcher).toContain('_validate_headers');
      expect(safeDispatcher).toContain('_validate_output');
      expect(safeDispatcher).toContain('_serialize_success');
      expect(safeDispatcher).not.toContain('_response_success');
      expect(safeDispatcher).toContain(
        'const outputValue = result as JsonValue'
      );

      const trustedOutDir = await mkdtemp(join(tmpdir(), 'joor-'));
      try {
        await emitArtifacts(manifest, {
          outDir: trustedOutDir,
          config: {
            enforceRateLimit: false,
            validateHeaders: false,
            validateInput: false,
            validateOutput: false,
            validateResponseHeaders: false,
          },
        });
        const trustedDispatcher = await readFile(
          join(trustedOutDir, 'dispatcher.trusted.ts'),
          'utf8'
        );
        expect(trustedDispatcher).not.toContain('_validate_input');
        expect(trustedDispatcher).not.toContain('_validate_headers');
        expect(trustedDispatcher).not.toContain('_validate_output');
        expect(trustedDispatcher).not.toContain('compiledValidationDetails');
        expect(trustedDispatcher).toContain('result as JsonValue');
        expect(trustedDispatcher).toContain('_serialize_success');
        expect(trustedDispatcher).not.toContain('_response_success');
      } finally {
        await rm(trustedOutDir, { recursive: true, force: true });
      }
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('emits structural validators for JSON literals', async () => {
    const procedure = defineProcedure({
      input: t.object({
        expected: t.literal({ role: 'admin', scopes: ['read', 'write'] }),
      }),
      output: t.object({ ok: t.boolean() }),
      async handler(ctx) {
        return ctx.ok({ ok: true });
      },
    });
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await emitArtifacts(
        {
          procedures: [
            {
              id: 'literal.check',
              importPath: join(outDir, 'literal.check.rpc.ts'),
              exportName: 'literal_check',
              procedure,
            },
          ],
        },
        { outDir, config: {} }
      );
      const safeDispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );

      expect(safeDispatcher).toContain('const compiledJsonEquals =');
      expect(safeDispatcher).toContain('!compiledJsonEquals(value, {');
      expect(safeDispatcher).not.toContain('value !== {"role":"admin"');
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('loads config-relative entry paths', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ config: fixtureConfig, outDir });
      await expect(
        readFile(join(outDir, 'manifest.ts'), 'utf8')
      ).resolves.toContain('users.watch');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('joor.config.ts');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain("from 'joor/config'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'export type NativeServices = JoorConfigContext<typeof config>'
      );
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain(
        'defineProcedure.withContext<JoorConfigContext<typeof config>>()'
      );
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('uses configured path as the generated client default url', async () => {
    const manifest = await loadProcedures(fixture);
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await emitArtifacts(manifest, {
        outDir,
        config: {
          path: '/api/rpc',
        },
      });
      const clientSource = await readFile(join(outDir, 'client.ts'), 'utf8');

      expect(clientSource).toContain('const defaultUrl = "/api/rpc"');
      expect(clientSource).toContain(
        'export const client: GeneratedClient = createClient()'
      );
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('emits Bun fast path for unsafe contextless procedures', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ config: contextlessFixtureConfig, outDir });
      const bunTarget = await readFile(join(outDir, 'bun.ts'), 'utf8');
      const dispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );

      expect(bunTarget).toContain('fastContextlessUnary');
      expect(bunTarget).toContain('contextlessHandler');
      expect(bunTarget).toContain('checkContentType = false');
      expect(dispatcher).toContain('contextlessHandler(inputValue)');
      expect(dispatcher).not.toContain('const ctx = compiledCreateContext');
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  it('defaults generated fetch runtimes to the manifest required request type', async () => {
    const appDir = await mkdtemp(join(tmpdir(), 'joor-request-app-'));
    try {
      const rpcDir = join(appDir, 'rpc');
      const routeDir = join(rpcDir, 'request');
      const outDir = join(appDir, '.joor');
      await mkdir(routeDir, { recursive: true });
      const procedureFile = join(routeDir, 'get.rpc.ts');
      const srcImport = toRelativeModuleSpecifier(
        routeDir,
        join(repoRoot, 'src/index.ts')
      );
      await writeFile(
        procedureFile,
        `import { defineProcedure, t } from '${srcImport}';

export interface AppRequest extends Request {
  readonly requestId: string;
}

export default defineProcedure.withContext<Record<string, never>, AppRequest>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  handler(ctx, input) {
    ctx.request.requestId.toUpperCase();
    return { id: input.id };
  },
});
`
      );

      await build({ cwd: appDir, entry: rpcDir, outDir });

      const usageFile = join(outDir, 'request-runtime-usage.ts');
      const procedureImport = toRelativeModuleSpecifier(outDir, procedureFile);
      await writeFile(
        usageFile,
        `import { createFetchFor, fetch, nativeBody, type NativeBody, type NativeBodyHandler, type NativeFetchHandler, type NativeHandlerHooks, type NativeHandlerOptions, type NativeHandlerOptionsRequest, type NativeMiddleware, type NativeRequiredRuntimeRequest, type NativeRouteUnaryBodyHandler } from './dispatcher.safe.js';
import { createFetchFor as createRuntimeFetchFor, fetch as runtimeFetch, type NativeRequiredRuntimeRequest as RuntimeRequiredRuntimeRequest } from './fetch.js';
import { createWorkerFor, worker } from './cloudflare.js';
import { createHandlersFor, handlers, GET } from './next.js';
import { createVercelFor, vercel } from './vercel.js';
import { createEdgeFor, edge } from './netlify.js';
import { createFetch as createBunFetch, createFetchFor as createBunFetchFor, fetch as bunFetch, type BunNativeFetchHandler } from './bun.js';
import { createFetch as createDenoFetch, createFetchFor as createDenoFetchFor, fetch as denoFetch, type DenoNativeFetchHandler } from './deno.js';
import type { AppRequest } from '${procedureImport}';

const appRequest = Object.assign(new Request('https://example.com/rpc'), {
  requestId: 'req_1',
}) as AppRequest;
const plainRequest = new Request('https://example.com/rpc');

const requiredRequest: NativeRequiredRuntimeRequest = appRequest;
requiredRequest.requestId.toUpperCase();
const runtimeRequiredRequest: RuntimeRequiredRuntimeRequest = appRequest;
runtimeRequiredRequest.requestId.toUpperCase();
const nativeHandlerOptions: NativeHandlerOptions = {};
const nativeHandlerOptionsRequest: NativeHandlerOptionsRequest<
  typeof nativeHandlerOptions
> = appRequest;
nativeHandlerOptionsRequest.requestId.toUpperCase();
const _broadNativeHandlerOptions = {} as NativeHandlerOptions<
  readonly [],
  NativeBody,
  // @ts-expect-error generated native handler option type parameters must satisfy the manifest request subtype.
  Request
>;
const nativeHandlerHooks: NativeHandlerHooks = {
  beforeRequest(request) {
    request.requestId.toUpperCase();
    return undefined;
  },
};
nativeHandlerHooks.beforeRequest?.(appRequest, { services: {} });
nativeHandlerHooks.beforeRequest?.(
  // @ts-expect-error generated native handler hooks default to the manifest request subtype.
  plainRequest,
  { services: {} }
);
const nativeMiddleware: NativeMiddleware = {
  name: 'request-audit',
  beforeRequest(request) {
    request.requestId.toUpperCase();
    return undefined;
  },
};
nativeMiddleware.beforeRequest?.(appRequest, { services: {} });
nativeMiddleware.beforeRequest?.(
  // @ts-expect-error generated native middleware defaults to the manifest request subtype.
  plainRequest,
  { services: {} }
);

const nativeHandler: NativeFetchHandler = fetch;
nativeHandler(appRequest);
// @ts-expect-error generated native fetch defaults reject requests missing required request fields.
nativeHandler(plainRequest);
const nativeBodyValue = { id: 'request.get', input: { id: '1' } } as const;
const nativeBodyHandler: NativeBodyHandler = nativeBody;
nativeBodyHandler(appRequest, nativeBodyValue);
// @ts-expect-error generated body handlers default to the manifest request subtype.
nativeBodyHandler(plainRequest, nativeBodyValue);
const nativeRouteUnaryBodyHandler: NativeRouteUnaryBodyHandler = nativeBody;
nativeRouteUnaryBodyHandler(appRequest, nativeBodyValue);
// @ts-expect-error generated route body handlers default to the manifest request subtype.
nativeRouteUnaryBodyHandler(plainRequest, nativeBodyValue);
createFetchFor()(appRequest);
// @ts-expect-error generated native fetch factories default to the manifest request subtype.
createFetchFor()(plainRequest);
// @ts-expect-error generated native fetch handler type parameters must satisfy the manifest request subtype.
const broadNativeHandler: NativeFetchHandler<Request> = fetch;
broadNativeHandler;

runtimeFetch(appRequest);
// @ts-expect-error generated fetch target defaults reject broad Request values.
runtimeFetch(plainRequest);
createRuntimeFetchFor()(appRequest);
// @ts-expect-error generated fetch target factories default to the manifest request subtype.
createRuntimeFetchFor()(plainRequest);

const cloudflareWorker = createWorkerFor();
cloudflareWorker.fetch(appRequest);
worker.fetch(appRequest);
// @ts-expect-error generated Cloudflare workers default to the manifest request subtype.
cloudflareWorker.fetch(plainRequest);
// @ts-expect-error generated named Cloudflare workers preserve the manifest request subtype.
worker.fetch(plainRequest);

const nextHandlers = createHandlersFor();
nextHandlers.GET(appRequest);
handlers.POST(appRequest);
GET(appRequest);
// @ts-expect-error generated Next handlers default to the manifest request subtype.
nextHandlers.GET(plainRequest);
// @ts-expect-error generated named Next handlers preserve the manifest request subtype.
handlers.POST(plainRequest);

const vercelFunction = createVercelFor();
vercelFunction.fetch(appRequest);
vercel.fetch(appRequest);
// @ts-expect-error generated Vercel functions default to the manifest request subtype.
vercelFunction.fetch(plainRequest);
// @ts-expect-error generated named Vercel functions preserve the manifest request subtype.
vercel.fetch(plainRequest);

const netlifyEdge = createEdgeFor();
netlifyEdge(appRequest, {});
edge(appRequest, {});
// @ts-expect-error generated Netlify edge functions default to the manifest request subtype.
netlifyEdge(plainRequest, {});
// @ts-expect-error generated named Netlify edge functions preserve the manifest request subtype.
edge(plainRequest, {});

const bunHandler: BunNativeFetchHandler = bunFetch;
bunHandler(appRequest);
createBunFetch()(appRequest);
createBunFetchFor()(undefined)(appRequest);
// @ts-expect-error generated Bun fetch defaults reject broad Request values.
bunHandler(plainRequest);
// @ts-expect-error generated Bun fetch factories default to the manifest request subtype.
createBunFetch()(plainRequest);

const denoHandler: DenoNativeFetchHandler = denoFetch;
denoHandler(appRequest);
createDenoFetch()(appRequest);
createDenoFetchFor()(undefined)(appRequest);
// @ts-expect-error generated Deno fetch defaults reject broad Request values.
denoHandler(plainRequest);
// @ts-expect-error generated Deno fetch factories default to the manifest request subtype.
createDenoFetch()(plainRequest);
`
      );
      const tsconfigFile = join(outDir, 'tsconfig.request-runtime.json');
      await writeFile(
        tsconfigFile,
        JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'ESNext',
              lib: ['ES2022', 'DOM', 'DOM.Iterable'],
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              strict: true,
              noImplicitAny: true,
              strictNullChecks: true,
              exactOptionalPropertyTypes: true,
              noUncheckedIndexedAccess: true,
              noPropertyAccessFromIndexSignature: true,
              skipLibCheck: true,
              verbatimModuleSyntax: true,
              isolatedModules: true,
              noEmit: true,
              types: ['node'],
              typeRoots: [join(repoRoot, 'node_modules/@types')],
              baseUrl: repoRoot,
              paths: {
                joor: ['./src/index.ts'],
                'joor/config': ['./src/config.ts'],
                'joor/context': ['./src/context/index.ts'],
                'joor/manifest': ['./src/manifest.ts'],
                'joor/procedure': ['./src/procedure/index.ts'],
                'joor/rpc': ['./src/rpc/index.ts'],
                'joor/runtime/*': ['./src/runtime/*.ts'],
                'joor/schema': ['./src/schema/index.ts'],
              },
            },
            include: [
              usageFile,
              procedureFile,
              join(outDir, 'dispatcher.safe.ts'),
              join(outDir, 'fetch.ts'),
              join(outDir, 'cloudflare.ts'),
              join(outDir, 'next.ts'),
              join(outDir, 'vercel.ts'),
              join(outDir, 'netlify.ts'),
              join(outDir, 'bun.ts'),
              join(outDir, 'deno.ts'),
              join(outDir, 'deno-dispatcher.safe.ts'),
            ],
          },
          null,
          2
        )
      );

      try {
        await execFileAsync(
          join(repoRoot, 'node_modules/.bin/tsc'),
          ['--project', tsconfigFile],
          {
            cwd: repoRoot,
            maxBuffer: 1024 * 1024 * 4,
          }
        );
      } catch (error) {
        const output = error as { stdout?: string; stderr?: string };
        throw new Error(
          [output.stdout, output.stderr].filter(Boolean).join('\n')
        );
      }
    } finally {
      await rm(appDir, { recursive: true, force: true });
    }
  }, 10_000);

  it('typechecks generated callable client route leaves', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ entry: fixture, outDir });
      const usageFile = join(outDir, 'client-usage.ts');
      await writeFile(
        usageFile,
        `import { client, createClient, createRouteProtocolRequest, createRouteRequest, createRouteStreamProtocolRequest, createRouteStreamRequest, createRouteUnaryProtocolRequest, createRouteUnaryRequest, createStreamRouteProtocolRequest, createStreamRouteRequest, createTransport, createUnaryRouteProtocolRequest, createUnaryRouteRequest, type BatchClientHeaders, type BatchFunction, type BatchOptions, type BatchOptionsTuple, type Client, type GeneratedClient, type GeneratedClientOptions, type RequiredRuntimeRequest, type RequiredServices, type ProtocolBatchRequest, type ProtocolBatchResults, type ProtocolBatchRequestUnion, type ProtocolRequest, type ProtocolRequestOptions, type ProtocolRequestUnion, type RouteBatchClientHeaders, type RouteBatchOptions, type RouteBatchOptionsTuple, type RouteBatchRequest, type RouteBatchResults, type RouteUnaryBatchClientHeaders, type RouteUnaryBatchOptions, type RouteUnaryBatchOptionsTuple, type RouteUnaryBatchRequest, type RouteUnaryBatchResults, type RouteBody, type RouteBodyResult, type RouteBodyResultFor, type RouteClientArgs, type RouteClientHeaders, type RouteEnvelope, type RouteEnvelopeUnion, type RouteErrorCode, type RouteErrorDetails, type RouteHasHeaders, type RouteHasResponseHeaders, type RouteHeaders, type RouteInput, type RouteOutput, type RouteProcedure, type RouteProtocolBatchRequest, type RouteProtocolBatchResults, type RouteProtocolBatchRequestUnion, type RouteProtocolRequest, type RouteProtocolRequestBuilder, type RouteProtocolRequestUnion, type RouteRequest, type RouteRequestOptions, type RouteRequiresHeaders, type RouteRequiresResponseHeaders, type RouteRequestUnion, type RouteResponseHeaders, type RouteResult, type RouteResultUnion, type RouteRuntimeRequest, type RouteServices, type RouteStreamBody, type RouteStreamBodyResult, type RouteStreamBodyResultFor, type RouteStreamClientArgs, type RouteStreamClientHeaders, type RouteStreamEvent, type RouteStreamFunction, type RouteStreamHeaders, type RouteStreamId, type RouteStreamInput, type RouteStreamOutput, type RouteStreamProcedure, type RouteStreamProtocolRequest, type RouteStreamProtocolRequestBuilder, type RouteStreamRequest, type RouteStreamRequestBuilder, type RouteStreamRequestOptions, type RouteStreamRequestUnion, type RouteStreamResponseHeaders, type RouteStreamTransport, type RouteStreamTransportClient, type RouteTransportClient, type RouteUnaryBody, type RouteUnaryBodyResult, type RouteUnaryBodyResultFor, type RouteUnaryClientArgs, type RouteUnaryClientHeaders, type RouteUnaryEnvelope, type RouteUnaryEnvelopeUnion, type RouteUnaryFunction, type RouteUnaryHeaders, type RouteUnaryId, type RouteUnaryInput, type RouteUnaryOutput, type RouteUnaryProcedure, type RouteUnaryProtocolBatchRequest, type RouteUnaryProtocolBatchResults, type RouteUnaryProtocolBatchRequestUnion, type RouteUnaryProtocolRequest, type RouteUnaryProtocolRequestBuilder, type RouteUnaryRequest, type RouteUnaryRequestOptions, type RouteUnaryRequestUnion, type RouteUnaryResponseHeaders, type RouteUnaryResult, type RouteUnaryResultUnion, type RouteUnaryTransport, type RouteUnaryTransportClient, type StreamProtocolRequest, type StreamProtocolRequestUnion, type StreamRouteBody, type StreamRouteBodyResult, type StreamRouteBodyResultFor, type StreamRouteClientArgs, type StreamRouteErrorCode, type StreamRouteErrorDetails, type StreamRouteEvent, type StreamRouteFunction, type StreamRouteHasResponseHeaders, type StreamRouteInput, type StreamRouteOutput, type StreamRouteProtocolRequest, type StreamRouteProtocolRequestBuilder, type StreamRouteProtocolRequestUnion, type StreamRouteRequest, type StreamRouteRequestBuilder, type StreamRouteRequestOptions, type StreamRouteRequestUnion, type StreamRouteResponseHeaders, type StreamRouteTransport, type StreamRouteTransportClient, type TransportClient, type UnaryProtocolRequest, type UnaryProtocolRequestUnion, type UnaryRouteBatchClientHeaders, type UnaryRouteBatchOptions, type UnaryRouteBatchOptionsTuple, type UnaryRouteBatchResults, type UnaryRouteBody, type UnaryRouteBodyResult, type UnaryRouteBodyResultFor, type UnaryRouteClientArgs, type UnaryRouteEnvelope, type UnaryRouteEnvelopeUnion, type UnaryRouteErrorCode, type UnaryRouteErrorDetails, type UnaryRouteFunction, type UnaryRouteHasHeaders, type UnaryRouteHasResponseHeaders, type UnaryRouteBatchRequest, type UnaryRouteInput, type UnaryRouteOutput, type UnaryRouteProtocolBatchRequest, type UnaryRouteProtocolBatchResults, type UnaryRouteProtocolBatchRequestUnion, type UnaryRouteProtocolRequest, type UnaryRouteProtocolRequestBuilder, type UnaryRouteProtocolRequestUnion, type UnaryRouteRequest, type UnaryRouteRequestOptions, type UnaryRouteRequestUnion, type UnaryRouteRequiresHeaders, type UnaryRouteRequiresResponseHeaders, type UnaryRouteResponseHeaders, type UnaryRouteResult, type UnaryRouteResultUnion, type UnaryRouteTransport, type UnaryRouteTransportClient } from './client.js';
import type { ProtocolBatchClientHeaders, ProtocolBatchOptions, ProtocolBatchOptionsTuple, RouteProtocolBatchClientHeaders, RouteProtocolBatchOptions, RouteProtocolBatchOptionsTuple, RouteUnaryProtocolBatchClientHeaders, RouteUnaryProtocolBatchOptions, RouteUnaryProtocolBatchOptionsTuple, UnaryRouteProtocolBatchClientHeaders, UnaryRouteProtocolBatchOptions, UnaryRouteProtocolBatchOptionsTuple } from './client.js';
import { createFetchFor as createNativeFetchFor, defineNativeConfig, defineNativeHandlerOptions, defineNativeRouteStreamConfig, defineNativeRouteStreamHandlerOptions, defineNativeRouteUnaryConfig, defineNativeRouteUnaryHandlerOptions, defineNativeStreamRouteConfig, defineNativeStreamRouteHandlerOptions, defineNativeUnaryRouteConfig, defineNativeUnaryRouteHandlerOptions, fetch as nativeFetch, nativeBody as nativeBodyValue, nativeResponseUnaryDispatch, nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBatchBody, type NativeBody, type NativeBodyHandler, type NativeBodyResult, type NativeBodyResultFor, type NativeCompiledBodyResult, type NativeCompiledBodyResultFor, type NativeCompiledTransportResult, type NativeDispatch, type NativeFetchHandler, type NativeProtocolBatchRequest, type NativeProtocolBatchRequestUnion, type NativeProtocolBatchResults, type NativeProtocolRequest, type NativeProtocolRequestUnion, type NativeRouteUnaryBatchRequest, type NativeRouteUnaryBatchRequestUnion, type NativeRouteUnaryBatchResults, type NativeRequiredRuntimeRequest, type NativeRequiredServices, type NativeRouteBatchRequest, type NativeRouteBatchRequestUnion, type NativeRouteBatchResults, type NativeRouteProtocolBatchRequest, type NativeRouteProtocolBatchRequestUnion, type NativeRouteProtocolBatchResults, type NativeRouteUnaryProtocolBatchRequest, type NativeRouteUnaryProtocolBatchRequestUnion, type NativeRouteUnaryProtocolBatchResults, type NativeUnaryRouteBatchRequest, type NativeUnaryRouteBatchRequestUnion, type NativeUnaryRouteBatchResults, type NativeUnaryRouteProtocolBatchRequest, type NativeUnaryRouteProtocolBatchRequestUnion, type NativeUnaryRouteProtocolBatchResults, type NativeRouteBody, type NativeRouteBodyResult, type NativeRouteBodyResultFor, type NativeRouteClientArgs, type NativeRouteClientHeaders, type NativeRouteEnvelope, type NativeRouteEnvelopeUnion, type NativeRouteErrorCode, type NativeRouteErrorDetails, type NativeRouteHasHeaders, type NativeRouteHasResponseHeaders, type NativeRouteHeaders, type NativeRouteInput, type NativeRouteOutput, type NativeRouteProcedure, type NativeRouteProtocolRequest, type NativeRouteProtocolRequestUnion, type NativeRouteRequest, type NativeRouteRequestOptions, type NativeRouteRequestUnion, type NativeRouteRequiresHeaders, type NativeRouteResponseHeaders, type NativeRouteRequiresResponseHeaders, type NativeRouteResult, type NativeRouteResultUnion, type NativeRouteStreamBody, type NativeRouteStreamBodyResult, type NativeRouteStreamBodyResultFor, type NativeRouteStreamId, type NativeRouteStreamRequest, type NativeRouteStreamRequestUnion, type NativeRouteUnaryBody, type NativeRouteUnaryBodyResult, type NativeRouteUnaryBodyResultFor, type NativeRouteUnaryEnvelopeUnion, type NativeRouteUnaryId, type NativeRouteUnaryRequest, type NativeRouteUnaryRequestUnion, type NativeRouteUnaryResultUnion, type NativeRouteRuntimeRequest, type NativeRouteServices, type NativeRouteStreamClientArgs, type NativeRouteStreamClientHeaders, type NativeRouteStreamEvent, type NativeRouteStreamHeaders, type NativeRouteStreamInput, type NativeRouteStreamOutput, type NativeRouteStreamProcedure, type NativeRouteStreamProtocolRequest, type NativeRouteStreamProtocolRequestUnion, type NativeRouteStreamRequestOptions, type NativeRouteStreamResponseHeaders, type NativeRouteUnaryClientArgs, type NativeRouteUnaryClientHeaders, type NativeRouteUnaryEnvelope, type NativeRouteUnaryHeaders, type NativeRouteUnaryInput, type NativeRouteUnaryOutput, type NativeRouteUnaryProcedure, type NativeRouteUnaryProtocolRequest, type NativeRouteUnaryProtocolRequestUnion, type NativeRouteUnaryRequestOptions, type NativeRouteUnaryResponseHeaders, type NativeRouteUnaryResult, type NativeRuntimeState, type NativeServices, type NativeStreamEvent, type NativeStreamProtocolRequest, type NativeStreamProtocolRequestUnion, type NativeStreamRouteBody, type NativeStreamRouteBodyResult, type NativeStreamRouteBodyResultFor, type NativeStreamRouteClientArgs, type NativeStreamRouteClientHeaders, type NativeStreamRouteErrorCode, type NativeStreamRouteErrorDetails, type NativeStreamRouteEvent, type NativeStreamRouteHasResponseHeaders, type NativeStreamRouteHeaders, type NativeStreamRouteInput, type NativeStreamRouteOutput, type NativeStreamRouteProcedure, type NativeStreamRouteProtocolRequest, type NativeStreamRouteProtocolRequestUnion, type NativeStreamRouteRequest, type NativeStreamRouteRequestOptions, type NativeStreamRouteRequestUnion, type NativeStreamRouteResponseHeaders, type NativeTransportHandler, type NativeTransportRequest, type NativeTransportResult, type NativeTransportResultFor, type NativeUnaryDispatch, type NativeUnaryProtocolRequest, type NativeUnaryProtocolRequestUnion, type NativeUnaryRequestUnion, type NativeUnaryRouteBody, type NativeUnaryRouteBodyResult, type NativeUnaryRouteBodyResultFor, type NativeUnaryRouteClientArgs, type NativeUnaryRouteClientHeaders, type NativeUnaryRouteEnvelope, type NativeUnaryRouteEnvelopeUnion, type NativeUnaryRouteErrorCode, type NativeUnaryRouteErrorDetails, type NativeUnaryRouteHasHeaders, type NativeUnaryRouteHasResponseHeaders, type NativeUnaryRouteHeaders, type NativeUnaryRouteInput, type NativeUnaryRouteOutput, type NativeUnaryRouteProcedure, type NativeUnaryRouteProtocolRequest, type NativeUnaryRouteProtocolRequestUnion, type NativeUnaryRouteRequest, type NativeUnaryRouteRequestOptions, type NativeUnaryRouteRequestUnion, type NativeUnaryRouteRequiresHeaders, type NativeUnaryRouteRequiresResponseHeaders, type NativeUnaryRouteResponseHeaders, type NativeUnaryRouteResult, type NativeUnaryRouteResultUnion } from './dispatcher.safe.js';
import type { NativeBatchClientHeaders, NativeBatchOptions, NativeBatchOptionsTuple, NativeRouteBatchClientHeaders, NativeRouteBatchOptions, NativeRouteBatchOptionsTuple, NativeRouteUnaryBatchClientHeaders, NativeRouteUnaryBatchOptions, NativeRouteUnaryBatchOptionsTuple, NativeUnaryRouteBatchClientHeaders, NativeUnaryRouteBatchOptions, NativeUnaryRouteBatchOptionsTuple } from './dispatcher.safe.js';
import type { NativeProtocolBatchClientHeaders, NativeProtocolBatchOptions, NativeProtocolBatchOptionsTuple, NativeRouteProtocolBatchClientHeaders, NativeRouteProtocolBatchOptions, NativeRouteProtocolBatchOptionsTuple, NativeRouteUnaryProtocolBatchClientHeaders, NativeRouteUnaryProtocolBatchOptions, NativeRouteUnaryProtocolBatchOptionsTuple, NativeUnaryRouteProtocolBatchClientHeaders, NativeUnaryRouteProtocolBatchOptions, NativeUnaryRouteProtocolBatchOptionsTuple } from './dispatcher.safe.js';
import type { NativeConfig, NativeConfigBody, NativeConfigFor, NativeConfigManifest, NativeConfigRequest, NativeConfigServices, NativeDefineConfig, NativeDefineHandlerOptions, NativeDefineRouteStreamConfig, NativeDefineRouteStreamHandlerOptions, NativeDefineRouteUnaryConfig, NativeDefineRouteUnaryHandlerOptions, NativeDefineStreamRouteConfig, NativeDefineStreamRouteHandlerOptions, NativeDefineUnaryRouteConfig, NativeDefineUnaryRouteHandlerOptions, NativeHandlerHookContext, NativeHandlerHooks, NativeHandlerOptionServices, NativeHandlerOptions, NativeHandlerOptionsArgs, NativeHandlerOptionsArgsFor, NativeHandlerOptionsBody, NativeHandlerOptionsFor, NativeHandlerOptionsManifest, NativeHandlerOptionsRequest, NativeHandlerOptionsServices, NativeHandlerOptionsWithPreflightArgs, NativeHandlerOptionsWithTrailingArgs, NativeMiddleware, NativeRouteStreamConfig, NativeRouteStreamConfigFor, NativeRouteStreamHandlerHookContext, NativeRouteStreamHandlerHooks, NativeRouteStreamHandlerOptions, NativeRouteStreamHandlerOptionsArgs, NativeRouteStreamHandlerOptionsArgsFor, NativeRouteStreamHandlerOptionsFor, NativeRouteStreamHandlerOptionsWithPreflightArgs, NativeRouteStreamHandlerOptionsWithTrailingArgs, NativeRouteStreamMiddleware, NativeRouteUnaryConfig, NativeRouteUnaryConfigFor, NativeRouteUnaryHandlerHookContext, NativeRouteUnaryHandlerHooks, NativeRouteUnaryHandlerOptions, NativeRouteUnaryHandlerOptionsArgs, NativeRouteUnaryHandlerOptionsArgsFor, NativeRouteUnaryHandlerOptionsFor, NativeRouteUnaryHandlerOptionsWithPreflightArgs, NativeRouteUnaryHandlerOptionsWithTrailingArgs, NativeRouteUnaryMiddleware, NativeStreamRouteConfig, NativeStreamRouteConfigFor, NativeStreamRouteHandlerHookContext, NativeStreamRouteHandlerHooks, NativeStreamRouteHandlerOptions, NativeStreamRouteHandlerOptionsArgs, NativeStreamRouteHandlerOptionsArgsFor, NativeStreamRouteHandlerOptionsFor, NativeStreamRouteHandlerOptionsWithPreflightArgs, NativeStreamRouteHandlerOptionsWithTrailingArgs, NativeStreamRouteMiddleware, NativeUnaryRouteConfig, NativeUnaryRouteConfigFor, NativeUnaryRouteHandlerHookContext, NativeUnaryRouteHandlerHooks, NativeUnaryRouteHandlerOptions, NativeUnaryRouteHandlerOptionsArgs, NativeUnaryRouteHandlerOptionsArgsFor, NativeUnaryRouteHandlerOptionsFor, NativeUnaryRouteHandlerOptionsWithPreflightArgs, NativeUnaryRouteHandlerOptionsWithTrailingArgs, NativeUnaryRouteMiddleware } from './dispatcher.safe.js';
import type { NativeRouteStreamBodyHandler, NativeRouteStreamCompiledBodyResultFor, NativeRouteStreamTransportHandler, NativeRouteStreamTransportResultFor, NativeRouteUnaryBodyHandler, NativeRouteUnaryCompiledBodyResultFor, NativeRouteUnaryTransportHandler, NativeRouteUnaryTransportResultFor, NativeStreamRouteBodyHandler, NativeStreamRouteCompiledBodyResultFor, NativeStreamRouteTransportHandler, NativeStreamRouteTransportResultFor, NativeUnaryRouteBodyHandler, NativeUnaryRouteCompiledBodyResultFor, NativeUnaryRouteTransportHandler, NativeUnaryRouteTransportResultFor } from './dispatcher.safe.js';
import { createPlugin } from 'joor';
import { createFetch as createBunNativeFetch, createFetchFor as createBunNativeFetchFor, fetch as bunNativeFetch, serve as serveBunNative, type BunNativeFetchHandler, type BunNativeOptions, type BunNativeServer, type NativeCorsOptions as BunNativeCorsOptions } from './bun.js';
import cloudflareWorker, { createWorkerFor as createGeneratedCloudflareWorkerFor, fetch as cloudflareFetch, worker as namedCloudflareWorker } from './cloudflare.js';
import { createFetch as createDenoNativeFetch, createFetchFor as createDenoNativeFetchFor, fetch as denoNativeFetch, serve as serveDenoNative, type DenoNativeFetchHandler, type DenoNativeOptions, type DenoNativeServer, type NativeCorsOptions as DenoNativeCorsOptions } from './deno.js';
import netlifyEdge, { createEdgeFor as createGeneratedNetlifyEdgeFor, edge as namedNetlifyEdge, fetch as netlifyFetch } from './netlify.js';
import nextHandlers, { GET, OPTIONS, POST, createHandlersFor as createGeneratedNextHandlersFor, handlers as namedNextHandlers } from './next.js';
import { createHandler as createNodeNativeHandler, handler as nodeNativeHandler, listen as listenNodeNative, type NodeNativeHandler, type NodeNativeOptions, type NodeNativeServer, type NativeCorsOptions as NodeNativeCorsOptions } from './node.js';
import vercelFunction, { createVercelFor as createGeneratedVercelFor, fetch as vercelFetch, vercel as namedVercelFunction } from './vercel.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { CloudflareWorker } from 'joor/runtime/cloudflare';
import type { NetlifyEdgeFetchHandler, NetlifyEdgeResult } from 'joor/runtime/netlify';
import type { NextRouteHandlers } from 'joor/runtime/next';
import type { VercelFunction } from 'joor/runtime/vercel';
import { manifest } from './manifest.js';

const defaultClient = createClient();
const generatedClient: GeneratedClient = defaultClient;
const generatedClientAlias: Client = generatedClient;
// @ts-expect-error generated client route groups are readonly.
generatedClient.users = generatedClient.users;
// @ts-expect-error generated client route leaves are readonly.
generatedClient.users.get = generatedClient.users.get;
// @ts-expect-error generated unary route command slots are readonly.
generatedClient.users.get.call = generatedClient.users.get.call;
// @ts-expect-error generated stream route command slots are readonly.
generatedClient.users.watch.stream = generatedClient.users.watch.stream;
// @ts-expect-error generated client batch commands are readonly.
generatedClient.batch = generatedClient.batch;
class GeneratedRequest extends Request {
  readonly runtimeTag = 'generated';
}
const generatedRequest = new GeneratedRequest('https://example.com/rpc');
const generatedCloudflareWorker: CloudflareWorker = cloudflareWorker;
const generatedCloudflareFetch: NativeFetchHandler = cloudflareFetch;
const generatedDefaultNativeFetch: NativeFetchHandler = createNativeFetchFor();
const generatedTypedNativeFetch: NativeFetchHandler<GeneratedRequest> =
  createNativeFetchFor<GeneratedRequest>();
const generatedTypedCloudflareWorker: CloudflareWorker<
  never,
  never,
  GeneratedRequest
> = createGeneratedCloudflareWorkerFor<never, never, GeneratedRequest>();
const generatedNamedCloudflareWorker: CloudflareWorker = namedCloudflareWorker;
const generatedNextHandlers: NextRouteHandlers = nextHandlers;
const generatedNamedNextHandlers: NextRouteHandlers = namedNextHandlers;
const generatedTypedNextHandlers: NextRouteHandlers<never, GeneratedRequest> =
  createGeneratedNextHandlersFor<never, GeneratedRequest>();
type GeneratedNextContext = { params: Promise<{ team: string }> };
const generatedTypedNextContextHandlers: NextRouteHandlers<
  GeneratedNextContext,
  GeneratedRequest
> = createGeneratedNextHandlersFor<GeneratedNextContext, GeneratedRequest>();
const generatedVercelFunction: VercelFunction = vercelFunction;
const generatedVercelFetch: NativeFetchHandler = vercelFetch;
const generatedTypedVercelFunction: VercelFunction<GeneratedRequest> =
  createGeneratedVercelFor<GeneratedRequest>();
const generatedNamedVercelFunction: VercelFunction = namedVercelFunction;
const generatedNetlifyEdge: NetlifyEdgeFetchHandler = netlifyEdge;
const generatedNetlifyFetch: NativeFetchHandler = netlifyFetch;
const generatedTypedNetlifyEdge: NetlifyEdgeFetchHandler<
  { site: string },
  GeneratedRequest
> = createGeneratedNetlifyEdgeFor<{ site: string }, GeneratedRequest>();
const generatedNamedNetlifyEdge: NetlifyEdgeFetchHandler = namedNetlifyEdge;
const generatedNetlifyEdgeResult: NetlifyEdgeResult | Promise<NetlifyEdgeResult> =
  generatedNamedNetlifyEdge(new Request('https://example.com/rpc'), {});
generatedCloudflareWorker.fetch(new Request('https://example.com/rpc'));
generatedCloudflareFetch(new Request('https://example.com/rpc'));
generatedDefaultNativeFetch(new Request('https://example.com/rpc'));
generatedTypedNativeFetch(generatedRequest);
// @ts-expect-error generated typed native fetch handlers preserve custom request types.
generatedTypedNativeFetch(new Request('https://example.com/rpc'));
generatedNamedCloudflareWorker.fetch(new Request('https://example.com/rpc'));
generatedTypedCloudflareWorker.fetch(generatedRequest);
// @ts-expect-error generated typed Cloudflare workers preserve custom request types.
generatedTypedCloudflareWorker.fetch(new Request('https://example.com/rpc'));
generatedNextHandlers.GET(new Request('https://example.com/rpc'));
generatedNamedNextHandlers.POST(new Request('https://example.com/rpc'));
generatedTypedNextHandlers.GET(generatedRequest);
// @ts-expect-error generated typed Next handlers preserve custom request types.
generatedTypedNextHandlers.GET(new Request('https://example.com/rpc'));
generatedTypedNextContextHandlers.POST(generatedRequest, {
  params: Promise.resolve({ team: 'core' }),
});
GET(new Request('https://example.com/rpc'));
POST(new Request('https://example.com/rpc'));
OPTIONS(new Request('https://example.com/rpc'));
generatedVercelFunction.fetch(new Request('https://example.com/rpc'));
generatedVercelFetch(new Request('https://example.com/rpc'));
generatedTypedVercelFunction.fetch(generatedRequest);
// @ts-expect-error generated typed Vercel functions preserve custom request types.
generatedTypedVercelFunction.fetch(new Request('https://example.com/rpc'));
generatedNamedVercelFunction.fetch(new Request('https://example.com/rpc'));
generatedNetlifyEdge(new Request('https://example.com/rpc'), {});
generatedNetlifyFetch(new Request('https://example.com/rpc'));
generatedTypedNetlifyEdge(generatedRequest, { site: 'docs' });
// @ts-expect-error generated typed Netlify edge functions preserve custom request types.
generatedTypedNetlifyEdge(new Request('https://example.com/rpc'), {
  site: 'docs',
});
generatedNetlifyEdgeResult;
const generatedRouteUnaryFunction: RouteUnaryFunction<'users.get'> =
  generatedClient.users.get;
const generatedRouteStreamFunction: RouteStreamFunction<'users.watch'> =
  generatedClient.users.watch;
const defaultRouteUnaryFunction: RouteUnaryFunction =
  generatedRouteUnaryFunction;
const defaultUnaryRouteFunction: UnaryRouteFunction =
  defaultRouteUnaryFunction;
const defaultRouteStreamFunction: RouteStreamFunction =
  generatedRouteStreamFunction;
const defaultStreamRouteFunction: StreamRouteFunction =
  defaultRouteStreamFunction;
generatedRouteUnaryFunction({ id: '550e8400-e29b-41d4-a716-446655440000' });
generatedRouteStreamFunction({ userId: '1' });
const generatedLeafProtocolRequest =
  generatedRouteUnaryFunction.protocolRequest(
    { id: '550e8400-e29b-41d4-a716-446655440000' },
    { traceId: 'trace-leaf' }
  );
const generatedLeafStreamProtocolRequest =
  generatedRouteStreamFunction.protocolRequest({ userId: '1' });
const typedGeneratedLeafProtocolRequest: RouteUnaryProtocolRequest<'users.get'> =
  generatedLeafProtocolRequest;
const typedGeneratedLeafStreamProtocolRequest: RouteStreamProtocolRequest<'users.watch'> =
  generatedLeafStreamProtocolRequest;
typedGeneratedLeafProtocolRequest.traceId?.toUpperCase();
typedGeneratedLeafStreamProtocolRequest.input.userId.toUpperCase();
defaultUnaryRouteFunction.valueOf();
defaultStreamRouteFunction.valueOf();
generatedClientAlias.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' });
defaultClient.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' });
const options: GeneratedClientOptions = {
  headers: { authorization: 'token' },
  request: { credentials: 'include' },
};
const typedGeneratedClientOptions: GeneratedClientOptions<GeneratedRequest> = {
  createRequest(args) {
    return new GeneratedRequest(args.url, {
      ...args.baseRequest,
      ...args.request,
      method: 'POST',
      headers: args.headers,
      body: JSON.stringify(args.body),
    });
  },
  fetch(request) {
    return new Response(request.runtimeTag);
  },
};
// @ts-expect-error generated typed client options require a matching request factory.
const missingGeneratedClientRequestFactory: GeneratedClientOptions<GeneratedRequest> = {
  fetch(request) {
    return new Response(request.runtimeTag);
  },
};
const batchHeaders: BatchClientHeaders<readonly [RouteRequest<'users.get'>]> = {
  authorization: 'Bearer token',
};
const routeBatchHeaders: RouteBatchClientHeaders<
  readonly [RouteRequest<'users.get'>]
> = batchHeaders;
const routeUnaryBatchHeaders: RouteUnaryBatchClientHeaders<
  readonly [RouteUnaryRequest<'users.get'>]
> = routeBatchHeaders;
const unaryRouteBatchHeaders: UnaryRouteBatchClientHeaders<
  readonly [UnaryRouteRequest<'users.get'>]
> = routeUnaryBatchHeaders;
const batchOptions: BatchOptions<readonly [RouteRequest<'users.get'>]> = {
  headers: batchHeaders,
  request: { cache: 'no-store' },
};
const batchOptionsTuple: BatchOptionsTuple<
  readonly [RouteRequest<'users.get'>]
> = [batchOptions];
const routeBatchOptions: RouteBatchOptions<
  readonly [RouteRequest<'users.get'>]
> = batchOptions;
const routeBatchOptionsTuple: RouteBatchOptionsTuple<
  readonly [RouteRequest<'users.get'>]
> = batchOptionsTuple;
const routeUnaryBatchOptions: RouteUnaryBatchOptions<
  readonly [RouteUnaryRequest<'users.get'>]
> = routeBatchOptions;
const routeUnaryBatchOptionsTuple: RouteUnaryBatchOptionsTuple<
  readonly [RouteUnaryRequest<'users.get'>]
> = routeBatchOptionsTuple;
const unaryRouteBatchOptions: UnaryRouteBatchOptions<
  readonly [UnaryRouteRequest<'users.get'>]
> = routeUnaryBatchOptions;
const unaryRouteBatchOptionsTuple: UnaryRouteBatchOptionsTuple<
  readonly [UnaryRouteRequest<'users.get'>]
> = routeUnaryBatchOptionsTuple;
routeBatchHeaders.authorization?.toUpperCase();
routeUnaryBatchHeaders.authorization?.toUpperCase();
unaryRouteBatchHeaders.authorization?.toUpperCase();
routeBatchOptions.headers?.authorization?.toUpperCase();
routeUnaryBatchOptions.headers?.authorization?.toUpperCase();
unaryRouteBatchOptions.headers?.authorization?.toUpperCase();
batchOptionsTuple[0]?.headers?.authorization?.toUpperCase();
routeBatchOptionsTuple[0]?.headers?.authorization?.toUpperCase();
routeUnaryBatchOptionsTuple[0]?.headers?.authorization?.toUpperCase();
unaryRouteBatchOptionsTuple[0]?.headers?.authorization?.toUpperCase();
const generatedTenantProtocolRequest = createRouteUnaryProtocolRequest(
  'tenants.current',
  { ok: true }
);
const tenantProtocolBatchOptions: BatchOptions<
  readonly [typeof generatedTenantProtocolRequest]
> = {
  headers: { 'x-tenant-id': 'tenant-1' },
};
const tenantProtocolBatchOptionsTuple: BatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = [tenantProtocolBatchOptions];
const routeProtocolBatchHeaders: RouteProtocolBatchClientHeaders<
  readonly [typeof generatedTenantProtocolRequest]
> = tenantProtocolBatchOptions.headers;
const protocolBatchHeaders: ProtocolBatchClientHeaders<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchHeaders;
const routeUnaryProtocolBatchHeaders: RouteUnaryProtocolBatchClientHeaders<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchHeaders;
const unaryRouteProtocolBatchHeaders: UnaryRouteProtocolBatchClientHeaders<
  readonly [typeof generatedTenantProtocolRequest]
> = routeUnaryProtocolBatchHeaders;
const routeProtocolBatchOptions: RouteProtocolBatchOptions<
  readonly [typeof generatedTenantProtocolRequest]
> = tenantProtocolBatchOptions;
const protocolBatchOptions: ProtocolBatchOptions<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchOptions;
const routeUnaryProtocolBatchOptions: RouteUnaryProtocolBatchOptions<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchOptions;
const unaryRouteProtocolBatchOptions: UnaryRouteProtocolBatchOptions<
  readonly [typeof generatedTenantProtocolRequest]
> = routeUnaryProtocolBatchOptions;
const routeProtocolBatchOptionsTuple: RouteProtocolBatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = tenantProtocolBatchOptionsTuple;
const protocolBatchOptionsTuple: ProtocolBatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchOptionsTuple;
const routeUnaryProtocolBatchOptionsTuple: RouteUnaryProtocolBatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = routeProtocolBatchOptionsTuple;
const unaryRouteProtocolBatchOptionsTuple: UnaryRouteProtocolBatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = routeUnaryProtocolBatchOptionsTuple;
tenantProtocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
protocolBatchHeaders['x-tenant-id'].toUpperCase();
unaryRouteProtocolBatchHeaders['x-tenant-id'].toUpperCase();
protocolBatchOptions.headers['x-tenant-id'].toUpperCase();
unaryRouteProtocolBatchOptions.headers['x-tenant-id'].toUpperCase();
protocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
unaryRouteProtocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
const _wrongBatchOptions: BatchOptions<
  readonly [RouteRequest<'users.get'>]
> = {
  headers: {
    // @ts-expect-error generated batch options preserve selected route headers.
    missing: 'value',
  },
};
_wrongBatchOptions;
const _wrongNoHeaderBatchOptions: BatchOptions<
  readonly [
    {
      readonly id: 'posts.list';
      readonly input: { readonly userId: '1' };
    },
  ]
> = {
  // @ts-expect-error generated batch headers are unavailable when selected routes declare none.
  headers: { authorization: 'Bearer token' },
};
_wrongNoHeaderBatchOptions;
// @ts-expect-error generated protocol batches require batch headers for header-required routes.
const _missingTenantProtocolBatchOptionsTuple: BatchOptionsTuple<
  readonly [typeof generatedTenantProtocolRequest]
> = [];
_missingTenantProtocolBatchOptionsTuple;
createClient(options).users.watch({ userId: '1' });
createClient<GeneratedRequest>(typedGeneratedClientOptions).users.get({
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const generatedTransport: TransportClient = createTransport(options);
const generatedTypedTransport: TransportClient = createTransport<GeneratedRequest>(
  typedGeneratedClientOptions
);
const generatedRouteTransport: RouteTransportClient = generatedTransport;
const generatedRouteUnaryTransport: RouteUnaryTransportClient =
  generatedRouteTransport;
const generatedRouteStreamTransport: RouteStreamTransportClient =
  generatedRouteTransport;
const generatedUnaryTransport: UnaryRouteTransportClient =
  generatedRouteUnaryTransport;
const generatedStreamTransport: StreamRouteTransportClient =
  generatedRouteStreamTransport;
generatedTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' }).then((result) => {
  if (result.ok) result.data.name.toUpperCase();
});
generatedTypedTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' });
generatedRouteTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' });
generatedRouteUnaryTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' });
generatedTransport.stream('users.watch', { userId: '1' });
generatedRouteStreamTransport.stream('users.watch', { userId: '1' });
const routeUnaryTransport: RouteUnaryTransport<'users.get'> =
  generatedRouteTransport;
routeUnaryTransport.request('users.get', {
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const routeStreamTransport: RouteStreamTransport<'users.watch'> =
  generatedRouteTransport;
routeStreamTransport.stream('users.watch', { userId: '1' });
const defaultRouteUnaryTransport: RouteUnaryTransport = routeUnaryTransport;
const defaultUnaryRouteTransport: UnaryRouteTransport =
  defaultRouteUnaryTransport;
const defaultRouteStreamTransport: RouteStreamTransport = routeStreamTransport;
const defaultStreamRouteTransport: StreamRouteTransport =
  defaultRouteStreamTransport;
defaultUnaryRouteTransport.valueOf();
defaultStreamRouteTransport.valueOf();
const bunNativeCors: BunNativeCorsOptions = { origin: 'https://example.com' };
// @ts-expect-error generated Bun CORS options are readonly.
bunNativeCors.origin = 'https://other.example.com';
// @ts-expect-error generated Bun CORS header lists are readonly.
bunNativeCors.headers?.push('authorization');
const bunNativeOptions: BunNativeOptions = { path: '/custom-rpc', cors: bunNativeCors, maxBodyBytes: 1024 };
// @ts-expect-error generated Bun native options are readonly.
bunNativeOptions.path = '/other-rpc';
const bunFetchHandler: BunNativeFetchHandler = createBunNativeFetch(bunNativeOptions);
const createTypedBunNativeFetch = createBunNativeFetchFor<GeneratedRequest>();
const typedBunFetchHandler: BunNativeFetchHandler<GeneratedRequest> =
  createTypedBunNativeFetch(bunNativeOptions);
const createDefaultBunNativeFetch = createBunNativeFetchFor();
const defaultTypedBunFetchHandler: BunNativeFetchHandler =
  createDefaultBunNativeFetch(bunNativeOptions);
const directTypedBunFetchHandler: BunNativeFetchHandler<GeneratedRequest> =
  createBunNativeFetch<GeneratedRequest>(bunNativeOptions);
createBunNativeFetch({ ...bunNativeOptions, cors: false });
const bunDefaultFetchHandler: BunNativeFetchHandler = bunNativeFetch;
const syncBunFetchHandler: BunNativeFetchHandler = () => new Response();
bunFetchHandler(new Request('https://example.com/rpc'));
defaultTypedBunFetchHandler(new Request('https://example.com/rpc'));
typedBunFetchHandler(generatedRequest);
directTypedBunFetchHandler(generatedRequest);
// @ts-expect-error generated direct typed Bun fetch handlers preserve request types.
directTypedBunFetchHandler(new Request('https://example.com/rpc'));
bunDefaultFetchHandler(new Request('https://example.com/rpc'));
syncBunFetchHandler(new Request('https://example.com/rpc'));
const bunServer: BunNativeServer = serveBunNative({ ...bunNativeOptions, port: 3000 });
bunServer.stop?.();
bunServer.ref?.();
const denoNativeCors: DenoNativeCorsOptions = { origin: 'https://example.com' };
// @ts-expect-error generated Deno CORS options are readonly.
denoNativeCors.origin = 'https://other.example.com';
// @ts-expect-error generated Deno CORS method lists are readonly.
denoNativeCors.methods?.push('GET');
const denoNativeOptions: DenoNativeOptions = { path: '/custom-rpc', cors: denoNativeCors, maxBodyBytes: 1024 };
// @ts-expect-error generated Deno native options are readonly.
denoNativeOptions.path = '/other-rpc';
const denoFetchHandler: DenoNativeFetchHandler = createDenoNativeFetch(denoNativeOptions);
const createTypedDenoNativeFetch = createDenoNativeFetchFor<GeneratedRequest>();
const typedDenoFetchHandler: DenoNativeFetchHandler<GeneratedRequest> =
  createTypedDenoNativeFetch(denoNativeOptions);
const createDefaultDenoNativeFetch = createDenoNativeFetchFor();
const defaultTypedDenoFetchHandler: DenoNativeFetchHandler =
  createDefaultDenoNativeFetch(denoNativeOptions);
const directTypedDenoFetchHandler: DenoNativeFetchHandler<GeneratedRequest> =
  createDenoNativeFetch<GeneratedRequest>(denoNativeOptions);
createDenoNativeFetch({ ...denoNativeOptions, cors: false });
const denoDefaultFetchHandler: DenoNativeFetchHandler = denoNativeFetch;
const syncDenoFetchHandler: DenoNativeFetchHandler = () => new Response();
denoFetchHandler(new Request('https://example.com/rpc'));
defaultTypedDenoFetchHandler(new Request('https://example.com/rpc'));
typedDenoFetchHandler(generatedRequest);
directTypedDenoFetchHandler(generatedRequest);
// @ts-expect-error generated direct typed Deno fetch handlers preserve request types.
directTypedDenoFetchHandler(new Request('https://example.com/rpc'));
denoDefaultFetchHandler(new Request('https://example.com/rpc'));
syncDenoFetchHandler(new Request('https://example.com/rpc'));
const denoServer: DenoNativeServer = serveDenoNative({ ...denoNativeOptions, port: 3000 });
denoServer.shutdown();
denoServer.finished.then(() => undefined);
const nodeNativeCors: NodeNativeCorsOptions = { origin: 'https://example.com' };
// @ts-expect-error generated Node CORS options are readonly.
nodeNativeCors.origin = 'https://other.example.com';
// @ts-expect-error generated Node CORS header lists are readonly.
nodeNativeCors.headers?.push('authorization');
const nodeNativeOptions: NodeNativeOptions = { path: '/custom-rpc', cors: nodeNativeCors, maxBodyBytes: 1024 };
// @ts-expect-error generated Node native options are readonly.
nodeNativeOptions.path = '/other-rpc';
const nodeHandler: NodeNativeHandler = createNodeNativeHandler(nodeNativeOptions);
interface GeneratedIncomingMessage extends IncomingMessage {
  readonly requestId: string;
}
type GeneratedServerResponse = ServerResponse<GeneratedIncomingMessage> & {
  readonly locals: { traceId: string };
};
declare const generatedIncomingMessage: GeneratedIncomingMessage;
declare const generatedServerResponse: GeneratedServerResponse;
declare const baseIncomingMessage: IncomingMessage;
declare const baseServerResponse: ServerResponse<IncomingMessage>;
const typedNodeNativeHandler: NodeNativeHandler<
  GeneratedIncomingMessage,
  GeneratedServerResponse
> = createNodeNativeHandler<GeneratedIncomingMessage, GeneratedServerResponse>(
  nodeNativeOptions
);
createNodeNativeHandler({ ...nodeNativeOptions, cors: false });
const nodeDefaultHandler: NodeNativeHandler = nodeNativeHandler;
const syncNodeHandler: NodeNativeHandler = () => undefined;
const syncTypedNodeHandler: NodeNativeHandler<
  GeneratedIncomingMessage,
  GeneratedServerResponse
> = (incoming, outgoing) => {
  incoming.requestId.toUpperCase();
  outgoing.locals.traceId.toUpperCase();
};
nodeHandler;
nodeDefaultHandler;
syncNodeHandler;
typedNodeNativeHandler(generatedIncomingMessage, generatedServerResponse);
syncTypedNodeHandler(generatedIncomingMessage, generatedServerResponse);
// @ts-expect-error generated typed Node handlers preserve custom incoming message types.
typedNodeNativeHandler(baseIncomingMessage, generatedServerResponse);
// @ts-expect-error generated typed Node handlers preserve custom outgoing response types.
typedNodeNativeHandler(generatedIncomingMessage, baseServerResponse);
const nodeServer: NodeNativeServer = listenNodeNative({ ...nodeNativeOptions, port: 3000 });
nodeServer.close();
nodeServer.address();
nodeServer.ref().unref();
const requiredServices: RequiredServices = {
  users: {
    findById(id) {
      return { id, name: 'Ada' };
    },
    async *watch(userId) {
      yield { type: 'user.updated' as const, userId };
    },
  },
};
const nativeUsersPlugin = createPlugin({
  name: 'users',
  setup() {
    return requiredServices;
  },
});
const routeServices: RouteServices<'users.get'> = requiredServices;
const defaultRouteServices: RouteServices = routeServices;
routeServices.users.findById('1')?.name.toUpperCase();
defaultRouteServices.users.findById('1')?.name.toUpperCase();
const requiredRuntimeRequest: RequiredRuntimeRequest = new Request('https://example.com/rpc');
requiredRuntimeRequest.url.toUpperCase();
const routeRuntimeRequest: RouteRuntimeRequest<'users.get'> = requiredRuntimeRequest;
const defaultRouteRuntimeRequest: RouteRuntimeRequest = routeRuntimeRequest;
routeRuntimeRequest.url.toUpperCase();
defaultRouteRuntimeRequest.url.toUpperCase();
const routeUnaryId: RouteUnaryId = 'users.get';
routeUnaryId.toUpperCase();
const routeStreamId: RouteStreamId = 'users.watch';
routeStreamId.toUpperCase();
const routeInput: RouteInput<'users.get'> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
};
const defaultRouteInput: RouteInput = routeInput;
routeInput.id.toUpperCase();
if ('id' in defaultRouteInput) defaultRouteInput.id.toUpperCase();
const unaryRouteInput: UnaryRouteInput<'users.get'> = routeInput;
const routeUnaryInput: RouteUnaryInput<'users.get'> = unaryRouteInput;
const defaultUnaryRouteInput: UnaryRouteInput = routeUnaryInput;
routeUnaryInput.id.toUpperCase();
defaultUnaryRouteInput.id.toUpperCase();
const streamRouteInput: StreamRouteInput<'users.watch'> = { userId: '1' };
const routeStreamInput: RouteStreamInput<'users.watch'> = streamRouteInput;
const defaultStreamRouteInput: StreamRouteInput = routeStreamInput;
routeStreamInput.userId.toUpperCase();
defaultStreamRouteInput.userId.toUpperCase();
const routeOutput: RouteOutput<'users.get'> = { id: '1', name: 'Ada' };
const defaultRouteOutput: RouteOutput = routeOutput;
routeOutput.name.toUpperCase();
defaultRouteOutput.name.toUpperCase();
type RouteStreamOutputIsNever = [RouteOutput<'users.watch'>] extends [never]
  ? true
  : false;
const routeStreamOutputIsNever: RouteStreamOutputIsNever = true;
routeStreamOutputIsNever.valueOf();
type StreamRouteOutputIsNever = [
  StreamRouteOutput<'users.watch'>,
] extends [never]
  ? true
  : false;
const streamRouteOutputIsNever: StreamRouteOutputIsNever = true;
streamRouteOutputIsNever.valueOf();
type RouteStreamRouteOutputIsNever = [
  RouteStreamOutput<'users.watch'>,
] extends [never]
  ? true
  : false;
const routeStreamRouteOutputIsNever: RouteStreamRouteOutputIsNever = true;
routeStreamRouteOutputIsNever.valueOf();
const unaryRouteOutput: UnaryRouteOutput<'users.get'> = routeOutput;
const routeUnaryOutput: RouteUnaryOutput<'users.get'> = unaryRouteOutput;
const defaultUnaryRouteOutput: UnaryRouteOutput = routeUnaryOutput;
routeUnaryOutput.name.toUpperCase();
defaultUnaryRouteOutput.name.toUpperCase();
const routeResponseHeaders: RouteResponseHeaders<'users.get'> = {
  'cache-control': 'private',
};
const defaultRouteResponseHeaders: RouteResponseHeaders = routeResponseHeaders;
defaultRouteResponseHeaders['cache-control'].toUpperCase();
const routeStreamResponseHeaders: RouteResponseHeaders<'users.watch'> = {};
const streamRouteResponseHeaders: StreamRouteResponseHeaders<'users.watch'> =
  routeStreamResponseHeaders;
const defaultStreamRouteResponseHeaders: StreamRouteResponseHeaders =
  streamRouteResponseHeaders;
defaultStreamRouteResponseHeaders.valueOf();
const routeStreamRouteResponseHeaders: RouteStreamResponseHeaders<'users.watch'> =
  streamRouteResponseHeaders;
routeStreamRouteResponseHeaders.valueOf();
const unaryRouteResponseHeaders: UnaryRouteResponseHeaders<'users.get'> =
  routeResponseHeaders;
const routeUnaryResponseHeaders: RouteUnaryResponseHeaders<'users.get'> =
  unaryRouteResponseHeaders;
const defaultUnaryRouteResponseHeaders: UnaryRouteResponseHeaders =
  routeUnaryResponseHeaders;
routeUnaryResponseHeaders['cache-control'].toUpperCase();
defaultUnaryRouteResponseHeaders['cache-control'].toUpperCase();
const routeProcedure: RouteProcedure<'users.get'> = manifest.procedures['users.get'];
const defaultRouteProcedure: RouteProcedure = routeProcedure;
routeProcedure.output;
defaultRouteProcedure.input;
const routeUnaryProcedure: RouteUnaryProcedure<'users.get'> = routeProcedure;
routeUnaryProcedure.output;
const routeStreamProcedure: RouteStreamProcedure<'users.watch'> = manifest.procedures['users.watch'];
routeStreamProcedure.stream;
const nativeServices: NativeServices = {};
const nativeRuntimeState: NativeRuntimeState = nativeRuntime;
nativeRuntimeState.getServices();
nativeServices;
const nativeUnary: NativeUnaryDispatch = nativeUnaryDispatch;
const nativeResponseUnary: NativeUnaryDispatch = nativeResponseUnaryDispatch;
const syncNativeUnary: NativeUnaryDispatch = () => undefined;
nativeUnary;
nativeResponseUnary;
syncNativeUnary;
const nativeDispatch: NativeDispatch = async () => ({
  ok: false,
  id: 'users.get',
  traceId: 'trace',
  error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
});
const syncNativeDispatch: NativeDispatch = () => ({
  ok: false,
  id: 'users.get',
  traceId: 'trace',
  error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
});
nativeDispatch;
syncNativeDispatch;
const nativeFetchHandler: NativeFetchHandler = nativeFetch;
nativeFetchHandler(new Request('https://example.com/rpc'));
const nativeRequiredServices: NativeRequiredServices = requiredServices;
nativeRequiredServices.users.findById('1')?.name.toUpperCase();
const nativeRequiredRuntimeRequest: NativeRequiredRuntimeRequest = new Request(
  'https://example.com/rpc',
);
nativeRequiredRuntimeRequest.url.toUpperCase();
const nativeRouteUnaryId: NativeRouteUnaryId = 'users.get';
nativeRouteUnaryId.toUpperCase();
const nativeRouteStreamId: NativeRouteStreamId = 'users.watch';
nativeRouteStreamId.toUpperCase();
const nativeRouteServices: NativeRouteServices<'users.get'> = requiredServices;
const defaultNativeRouteServices: NativeRouteServices = nativeRouteServices;
nativeRouteServices.users.findById('1')?.name.toUpperCase();
defaultNativeRouteServices.users.findById('1')?.name.toUpperCase();
const nativeRouteRuntimeRequest: NativeRouteRuntimeRequest<'users.get'> =
  nativeRequiredRuntimeRequest;
const defaultNativeRouteRuntimeRequest: NativeRouteRuntimeRequest =
  nativeRouteRuntimeRequest;
nativeRouteRuntimeRequest.url.toUpperCase();
defaultNativeRouteRuntimeRequest.url.toUpperCase();
const nativeRouteInput: NativeRouteInput<'users.get'> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
};
const defaultNativeRouteInput: NativeRouteInput = nativeRouteInput;
nativeRouteInput.id.toUpperCase();
if ('id' in defaultNativeRouteInput) defaultNativeRouteInput.id.toUpperCase();
const nativeUnaryRouteInput: NativeUnaryRouteInput<'users.get'> =
  nativeRouteInput;
const nativeRouteUnaryInput: NativeRouteUnaryInput<'users.get'> =
  nativeUnaryRouteInput;
const defaultNativeUnaryRouteInput: NativeUnaryRouteInput =
  nativeRouteUnaryInput;
nativeRouteUnaryInput.id.toUpperCase();
defaultNativeUnaryRouteInput.id.toUpperCase();
const nativeStreamRouteInput: NativeStreamRouteInput<'users.watch'> = {
  userId: '1',
};
const nativeRouteStreamInput: NativeRouteStreamInput<'users.watch'> =
  nativeStreamRouteInput;
const defaultNativeStreamRouteInput: NativeStreamRouteInput =
  nativeRouteStreamInput;
nativeRouteStreamInput.userId.toUpperCase();
defaultNativeStreamRouteInput.userId.toUpperCase();
const nativeRouteOutput: NativeRouteOutput<'users.get'> = {
  id: '1',
  name: 'Ada',
};
const defaultNativeRouteOutput: NativeRouteOutput = nativeRouteOutput;
nativeRouteOutput.name.toUpperCase();
defaultNativeRouteOutput.name.toUpperCase();
type NativeRouteStreamOutputIsNever = [
  NativeRouteOutput<'users.watch'>,
] extends [never]
  ? true
  : false;
const nativeRouteStreamOutputIsNever: NativeRouteStreamOutputIsNever = true;
nativeRouteStreamOutputIsNever.valueOf();
type NativeStreamRouteOutputIsNever = [
  NativeStreamRouteOutput<'users.watch'>,
] extends [never]
  ? true
  : false;
const nativeStreamRouteOutputIsNever: NativeStreamRouteOutputIsNever = true;
nativeStreamRouteOutputIsNever.valueOf();
type NativeRouteStreamRouteOutputIsNever = [
  NativeRouteStreamOutput<'users.watch'>,
] extends [never]
  ? true
  : false;
const nativeRouteStreamRouteOutputIsNever: NativeRouteStreamRouteOutputIsNever = true;
nativeRouteStreamRouteOutputIsNever.valueOf();
const nativeUnaryRouteOutput: NativeUnaryRouteOutput<'users.get'> =
  nativeRouteOutput;
const nativeRouteUnaryOutput: NativeRouteUnaryOutput<'users.get'> =
  nativeUnaryRouteOutput;
const defaultNativeUnaryRouteOutput: NativeUnaryRouteOutput =
  nativeRouteUnaryOutput;
nativeRouteUnaryOutput.name.toUpperCase();
defaultNativeUnaryRouteOutput.name.toUpperCase();
const nativeRouteProcedure: NativeRouteProcedure<'users.get'> = manifest.procedures['users.get'];
const defaultNativeRouteProcedure: NativeRouteProcedure = nativeRouteProcedure;
nativeRouteProcedure.output;
defaultNativeRouteProcedure.input;
const nativeUnaryRouteProcedure: NativeUnaryRouteProcedure<'users.get'> =
  nativeRouteProcedure;
nativeUnaryRouteProcedure.output;
const nativeRouteUnaryProcedure: NativeRouteUnaryProcedure<'users.get'> =
  nativeUnaryRouteProcedure;
nativeRouteUnaryProcedure.output;
const nativeStreamRouteProcedure: NativeStreamRouteProcedure<'users.watch'> =
  manifest.procedures['users.watch'];
nativeStreamRouteProcedure.stream;
const nativeRouteStreamProcedure: NativeRouteStreamProcedure<'users.watch'> =
  nativeStreamRouteProcedure;
nativeRouteStreamProcedure.stream;
const nativeRouteHasHeaders: NativeRouteHasHeaders<'tenants.current'> = true;
const defaultNativeRouteHasHeaders: NativeRouteHasHeaders =
  nativeRouteHasHeaders;
nativeRouteHasHeaders.valueOf();
defaultNativeRouteHasHeaders.valueOf();
const nativeUnaryRouteHasHeaders: NativeUnaryRouteHasHeaders<'tenants.current'> = true;
nativeUnaryRouteHasHeaders.valueOf();
const nativeRouteRequiresHeaders: NativeRouteRequiresHeaders<'tenants.current'> = true;
const defaultNativeRouteRequiresHeaders: NativeRouteRequiresHeaders =
  false;
nativeRouteRequiresHeaders.valueOf();
defaultNativeRouteRequiresHeaders.valueOf();
const nativeUnaryRouteRequiresHeaders: NativeUnaryRouteRequiresHeaders<'tenants.current'> = true;
nativeUnaryRouteRequiresHeaders.valueOf();
const nativeRouteResponseHeaders: NativeRouteResponseHeaders<'users.get'> = {
  'cache-control': 'private',
};
const defaultNativeRouteResponseHeaders: NativeRouteResponseHeaders =
  nativeRouteResponseHeaders;
nativeRouteResponseHeaders['cache-control'].toUpperCase();
defaultNativeRouteResponseHeaders['cache-control'].toUpperCase();
const nativeRouteStreamResponseHeaders: NativeRouteResponseHeaders<'users.watch'> =
  {};
const nativeStreamRouteResponseHeaders: NativeStreamRouteResponseHeaders<'users.watch'> =
  nativeRouteStreamResponseHeaders;
const nativeRouteStreamRouteResponseHeaders: NativeRouteStreamResponseHeaders<'users.watch'> =
  nativeStreamRouteResponseHeaders;
nativeRouteStreamRouteResponseHeaders.valueOf();
const nativeUnaryRouteResponseHeaders: NativeUnaryRouteResponseHeaders<'users.get'> =
  nativeRouteResponseHeaders;
const nativeRouteUnaryResponseHeaders: NativeRouteUnaryResponseHeaders<'users.get'> =
  nativeUnaryRouteResponseHeaders;
nativeRouteUnaryResponseHeaders['cache-control'].toUpperCase();
const _wrongNativeRouteResponseHeaders: NativeRouteResponseHeaders<'users.get'> = {
  // @ts-expect-error generated native response headers require HTTP string values.
  'cache-control': 1,
};
_wrongNativeRouteResponseHeaders;
const nativeRouteHasResponseHeaders: NativeRouteHasResponseHeaders<'users.get'> = true;
nativeRouteHasResponseHeaders.valueOf();
const nativeUnaryRouteHasResponseHeaders: NativeUnaryRouteHasResponseHeaders<'users.get'> = true;
nativeUnaryRouteHasResponseHeaders.valueOf();
const nativeStreamRouteHasResponseHeaders: NativeStreamRouteHasResponseHeaders<'users.watch'> = false;
nativeStreamRouteHasResponseHeaders.valueOf();
const nativeRouteRequiresResponseHeaders: NativeRouteRequiresResponseHeaders<'users.get'> = true;
nativeRouteRequiresResponseHeaders.valueOf();
const nativeUnaryRouteRequiresResponseHeaders: NativeUnaryRouteRequiresResponseHeaders<'users.get'> = true;
nativeUnaryRouteRequiresResponseHeaders.valueOf();
const nativeRouteErrorCode: NativeRouteErrorCode<'users.get'> = 'NOT_FOUND';
const defaultNativeRouteErrorCode: NativeRouteErrorCode = nativeRouteErrorCode;
nativeRouteErrorCode.toUpperCase();
defaultNativeRouteErrorCode.toUpperCase();
const nativeUnaryRouteErrorCode: NativeUnaryRouteErrorCode<'users.get'> = 'NOT_FOUND';
const defaultNativeUnaryRouteErrorCode: NativeUnaryRouteErrorCode =
  nativeUnaryRouteErrorCode;
nativeUnaryRouteErrorCode.toUpperCase();
defaultNativeUnaryRouteErrorCode.toUpperCase();
const nativeStreamRouteErrorCode: NativeStreamRouteErrorCode<'users.watch'> = 'VALIDATION_ERROR';
const defaultNativeStreamRouteErrorCode: NativeStreamRouteErrorCode =
  nativeStreamRouteErrorCode;
nativeStreamRouteErrorCode.toUpperCase();
defaultNativeStreamRouteErrorCode.toUpperCase();
const nativeRouteErrorDetails: NativeRouteErrorDetails<'users.get', 'NOT_FOUND'> = {
  message: 'Missing',
};
const defaultNativeRouteErrorDetails: NativeRouteErrorDetails =
  nativeRouteErrorDetails;
nativeRouteErrorDetails.message.toUpperCase();
defaultNativeRouteErrorDetails.valueOf();
const nativeUnaryRouteErrorDetails: NativeUnaryRouteErrorDetails<'users.get', 'NOT_FOUND'> = nativeRouteErrorDetails;
const defaultNativeUnaryRouteErrorDetails: NativeUnaryRouteErrorDetails =
  nativeUnaryRouteErrorDetails;
nativeUnaryRouteErrorDetails.message.toUpperCase();
defaultNativeUnaryRouteErrorDetails.valueOf();
const nativeStreamRouteErrorDetails: NativeStreamRouteErrorDetails<'users.watch', 'VALIDATION_ERROR'> = { issue: 'input' };
const defaultNativeStreamRouteErrorDetails: NativeStreamRouteErrorDetails =
  nativeStreamRouteErrorDetails;
nativeStreamRouteErrorDetails.valueOf();
defaultNativeStreamRouteErrorDetails.valueOf();
const nativeRouteStreamEvent: NativeRouteStreamEvent<'users.watch'> = {
  type: 'user.updated',
  userId: '1',
};
const defaultNativeRouteStreamEvent: NativeRouteStreamEvent =
  nativeRouteStreamEvent;
nativeRouteStreamEvent.userId.toUpperCase();
defaultNativeRouteStreamEvent.userId.toUpperCase();
const nativeStreamRouteEvent: NativeStreamRouteEvent<'users.watch'> =
  nativeRouteStreamEvent;
const nativeStreamEvent: NativeStreamEvent<'users.watch'> =
  nativeStreamRouteEvent;
const defaultNativeStreamRouteEvent: NativeStreamRouteEvent =
  nativeStreamRouteEvent;
const defaultNativeStreamEvent: NativeStreamEvent = nativeStreamEvent;
nativeStreamEvent.userId.toUpperCase();
defaultNativeStreamRouteEvent.userId.toUpperCase();
defaultNativeStreamEvent.userId.toUpperCase();

client.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' }).then((result) => {
  const exact: RouteResult<'users.get'> = result;
  exact.id.toUpperCase();
  if (result.ok) {
    result.data.name.toUpperCase();
    result.headers?.['cache-control'].toUpperCase();
  }
});

client.users.get.call({ id: '550e8400-e29b-41d4-a716-446655440000' });
const request = client.users.get.request({
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const standaloneRequest = createRouteRequest('users.get', {
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const standaloneRouteUnaryRequest = createRouteUnaryRequest('users.get', {
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const standaloneUnaryRouteRequest = createUnaryRouteRequest('users.get', {
  id: '550e8400-e29b-41d4-a716-446655440000',
});
const tenantStandaloneRequest = createRouteRequest(
  'tenants.current',
  { ok: true },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const requestId: 'users.get' = request.id;
requestId.toUpperCase();
const requestUnion: RouteRequestUnion = request;
requestUnion.id.toUpperCase();
const standaloneRequestId: 'users.get' = standaloneRequest.id;
standaloneRequestId.toUpperCase();
standaloneRouteUnaryRequest.input.id.toUpperCase();
standaloneUnaryRouteRequest.input.id.toUpperCase();
tenantStandaloneRequest.headers['x-tenant-id'].toUpperCase();
// @ts-expect-error generated request builders reject stream route ids.
createRouteRequest('users.watch', { userId: '1' });
// @ts-expect-error generated request builders require declared headers.
createRouteRequest('tenants.current', { ok: true });
createRouteRequest('tenants.current', { ok: true }, {
  headers: {
    // @ts-expect-error generated request builders validate declared header values.
    'x-tenant-id': 1,
  },
});
const unaryRouteRequest: UnaryRouteRequest<'users.get'> = request;
const defaultUnaryRouteRequest: UnaryRouteRequest = unaryRouteRequest;
const routeUnaryRequest: RouteUnaryRequest<'users.get'> = unaryRouteRequest;
const defaultRouteUnaryRequest: RouteUnaryRequest = routeUnaryRequest;
routeUnaryRequest.input.id.toUpperCase();
defaultUnaryRouteRequest.id.toUpperCase();
defaultRouteUnaryRequest.id.toUpperCase();
const unaryRouteRequestUnion: UnaryRouteRequestUnion = unaryRouteRequest;
const routeUnaryRequestUnion: RouteUnaryRequestUnion = unaryRouteRequestUnion;
routeUnaryRequestUnion.id.toUpperCase();
const batchFunction: BatchFunction = client.batch;
const routeBatchRequest: RouteBatchRequest<readonly [typeof request]> = [request] as const;
routeBatchRequest[0].input.id.toUpperCase();
const routeProtocolBatchRequest: RouteProtocolBatchRequest<readonly [typeof generatedLeafProtocolRequest]> = [generatedLeafProtocolRequest] as const;
const routeUnaryProtocolBatchRequest: RouteUnaryProtocolBatchRequest<readonly [typeof generatedLeafProtocolRequest]> = routeProtocolBatchRequest;
const unaryRouteProtocolBatchRequest: UnaryRouteProtocolBatchRequest<readonly [typeof generatedLeafProtocolRequest]> = routeUnaryProtocolBatchRequest;
const protocolBatchRequestAlias: ProtocolBatchRequest<readonly [typeof generatedLeafProtocolRequest]> = unaryRouteProtocolBatchRequest;
const routeProtocolBatchRequestUnion: RouteProtocolBatchRequestUnion =
  generatedLeafProtocolRequest;
const routeUnaryProtocolBatchRequestUnion: RouteUnaryProtocolBatchRequestUnion =
  routeProtocolBatchRequestUnion;
const unaryRouteProtocolBatchRequestUnion: UnaryRouteProtocolBatchRequestUnion =
  routeUnaryProtocolBatchRequestUnion;
const protocolBatchRequestUnion: ProtocolBatchRequestUnion =
  unaryRouteProtocolBatchRequestUnion;
routeProtocolBatchRequestUnion.id.toUpperCase();
routeUnaryProtocolBatchRequestUnion.id.toUpperCase();
unaryRouteProtocolBatchRequestUnion.id.toUpperCase();
protocolBatchRequestUnion.id.toUpperCase();
protocolBatchRequestAlias[0].input.id.toUpperCase();
const unaryRouteBatchRequest: UnaryRouteBatchRequest<readonly [typeof request]> = [request] as const;
const routeUnaryBatchRequest: RouteUnaryBatchRequest<readonly [typeof request]> = unaryRouteBatchRequest;
routeUnaryBatchRequest[0].input.id.toUpperCase();
const defaultRouteBatchRequest: RouteBatchRequest = [request] as const;
defaultRouteBatchRequest.length.toFixed();
const tenantHeaders: RouteHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
const defaultRouteHeaders: RouteHeaders = tenantHeaders;
tenantHeaders['x-tenant-id'].toUpperCase();
if ('x-tenant-id' in defaultRouteHeaders) {
  defaultRouteHeaders['x-tenant-id']?.toUpperCase();
}
const tenantUnaryHeaders: RouteUnaryHeaders<'tenants.current'> = tenantHeaders;
const tenantUnaryHeadersAlias: RouteUnaryHeaders<'tenants.current'> =
  tenantUnaryHeaders;
tenantUnaryHeadersAlias['x-tenant-id'].toUpperCase();
const watchStreamHeaders: RouteStreamHeaders<'users.watch'> = {};
watchStreamHeaders.valueOf();
const userClientHeaders: RouteClientHeaders<'users.get'> = { authorization: undefined };
userClientHeaders.authorization?.toUpperCase();
const tenantClientHeaders: RouteClientHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
const defaultRouteClientHeaders: RouteClientHeaders = tenantClientHeaders;
tenantClientHeaders['x-tenant-id'].toUpperCase();
if ('x-tenant-id' in defaultRouteClientHeaders) {
  defaultRouteClientHeaders['x-tenant-id']?.toUpperCase();
}
const tenantUnaryClientHeaders: RouteUnaryClientHeaders<'tenants.current'> = tenantClientHeaders;
tenantUnaryClientHeaders['x-tenant-id'].toUpperCase();
const watchStreamClientHeaders: RouteStreamClientHeaders<'users.watch'> = {};
watchStreamClientHeaders.valueOf();
const tenantRequestOptions: RouteRequestOptions<'tenants.current'> = { headers: tenantHeaders };
const defaultRouteRequestOptions: RouteRequestOptions = tenantRequestOptions;
tenantRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultRouteRequestOptions.headers?.valueOf();
const tenantUnaryRequestOptions: UnaryRouteRequestOptions<'tenants.current'> = tenantRequestOptions;
const defaultUnaryRouteRequestOptions: UnaryRouteRequestOptions =
  tenantUnaryRequestOptions;
const tenantRouteUnaryRequestOptions: RouteUnaryRequestOptions<'tenants.current'> = tenantUnaryRequestOptions;
const defaultRouteUnaryRequestOptions: RouteUnaryRequestOptions =
  tenantRouteUnaryRequestOptions;
tenantRouteUnaryRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultUnaryRouteRequestOptions.headers?.valueOf();
defaultRouteUnaryRequestOptions.headers?.valueOf();
const watchStreamRequestOptions: StreamRouteRequestOptions<'users.watch'> = {};
const defaultStreamRouteRequestOptions: StreamRouteRequestOptions =
  watchStreamRequestOptions;
const watchRouteStreamRequestOptions: RouteStreamRequestOptions<'users.watch'> = watchStreamRequestOptions;
const defaultRouteStreamRequestOptions: RouteStreamRequestOptions =
  watchRouteStreamRequestOptions;
watchRouteStreamRequestOptions.valueOf();
defaultStreamRouteRequestOptions.valueOf();
defaultRouteStreamRequestOptions.valueOf();
const tenantRouteClientArgs: RouteClientArgs<'tenants.current'> = [
  { ok: true },
  tenantRequestOptions,
];
const defaultRouteClientArgs: RouteClientArgs = tenantRouteClientArgs;
tenantRouteClientArgs[0].ok.valueOf();
defaultRouteClientArgs[0].valueOf();
const tenantUnaryClientArgs: UnaryRouteClientArgs<'tenants.current'> = tenantRouteClientArgs;
const defaultUnaryRouteClientArgs: UnaryRouteClientArgs = tenantUnaryClientArgs;
const tenantRouteUnaryClientArgs: RouteUnaryClientArgs<'tenants.current'> = tenantUnaryClientArgs;
const defaultRouteUnaryClientArgs: RouteUnaryClientArgs =
  tenantRouteUnaryClientArgs;
tenantRouteUnaryClientArgs[0].ok.valueOf();
defaultUnaryRouteClientArgs[0].valueOf();
defaultRouteUnaryClientArgs[0].valueOf();
const watchStreamClientArgs: StreamRouteClientArgs<'users.watch'> = [
  { userId: '1' },
  watchStreamRequestOptions,
];
const defaultStreamRouteClientArgs: StreamRouteClientArgs =
  watchStreamClientArgs;
const watchRouteStreamClientArgs: RouteStreamClientArgs<'users.watch'> = watchStreamClientArgs;
const defaultRouteStreamClientArgs: RouteStreamClientArgs =
  watchRouteStreamClientArgs;
watchRouteStreamClientArgs[0].userId.toUpperCase();
defaultStreamRouteClientArgs[0].userId.toUpperCase();
defaultRouteStreamClientArgs[0].userId.toUpperCase();
const nativeRouteHeaders: NativeRouteHeaders<'tenants.current'> = tenantHeaders;
const defaultNativeRouteHeaders: NativeRouteHeaders = nativeRouteHeaders;
nativeRouteHeaders['x-tenant-id'].toUpperCase();
if ('x-tenant-id' in defaultNativeRouteHeaders) {
  defaultNativeRouteHeaders['x-tenant-id']?.toUpperCase();
}
const nativeTenantUnaryHeaders: NativeUnaryRouteHeaders<'tenants.current'> = nativeRouteHeaders;
const nativeTenantRouteUnaryHeaders: NativeRouteUnaryHeaders<'tenants.current'> = nativeTenantUnaryHeaders;
nativeTenantRouteUnaryHeaders['x-tenant-id'].toUpperCase();
const nativeWatchStreamHeaders: NativeStreamRouteHeaders<'users.watch'> = {};
const nativeWatchRouteStreamHeaders: NativeRouteStreamHeaders<'users.watch'> = nativeWatchStreamHeaders;
nativeWatchRouteStreamHeaders.valueOf();
const nativeUserClientHeaders: NativeRouteClientHeaders<'users.get'> = { authorization: undefined };
nativeUserClientHeaders.authorization?.toUpperCase();
const nativeTenantClientHeaders: NativeRouteClientHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
const defaultNativeRouteClientHeaders: NativeRouteClientHeaders =
  nativeTenantClientHeaders;
nativeTenantClientHeaders['x-tenant-id'].toUpperCase();
if ('x-tenant-id' in defaultNativeRouteClientHeaders) {
  defaultNativeRouteClientHeaders['x-tenant-id']?.toUpperCase();
}
const nativeTenantUnaryClientHeaders: NativeUnaryRouteClientHeaders<'tenants.current'> = nativeTenantClientHeaders;
const nativeTenantRouteUnaryClientHeaders: NativeRouteUnaryClientHeaders<'tenants.current'> = nativeTenantUnaryClientHeaders;
nativeTenantRouteUnaryClientHeaders['x-tenant-id'].toUpperCase();
const nativeWatchStreamClientHeaders: NativeStreamRouteClientHeaders<'users.watch'> = {};
const nativeWatchRouteStreamClientHeaders: NativeRouteStreamClientHeaders<'users.watch'> = nativeWatchStreamClientHeaders;
nativeWatchRouteStreamClientHeaders.valueOf();
const nativeTenantRequestOptions: NativeRouteRequestOptions<'tenants.current'> = { headers: nativeTenantClientHeaders };
const defaultNativeRouteRequestOptions: NativeRouteRequestOptions =
  nativeTenantRequestOptions;
nativeTenantRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultNativeRouteRequestOptions.headers?.valueOf();
const nativeTenantUnaryRequestOptions: NativeUnaryRouteRequestOptions<'tenants.current'> = nativeTenantRequestOptions;
const defaultNativeUnaryRouteRequestOptions: NativeUnaryRouteRequestOptions =
  nativeTenantUnaryRequestOptions;
const nativeTenantRouteUnaryRequestOptions: NativeRouteUnaryRequestOptions<'tenants.current'> = nativeTenantUnaryRequestOptions;
const defaultNativeRouteUnaryRequestOptions: NativeRouteUnaryRequestOptions =
  nativeTenantRouteUnaryRequestOptions;
nativeTenantRouteUnaryRequestOptions.headers['x-tenant-id'].toUpperCase();
defaultNativeUnaryRouteRequestOptions.headers?.valueOf();
defaultNativeRouteUnaryRequestOptions.headers?.valueOf();
const nativeWatchStreamRequestOptions: NativeStreamRouteRequestOptions<'users.watch'> = {};
const defaultNativeStreamRouteRequestOptions: NativeStreamRouteRequestOptions =
  nativeWatchStreamRequestOptions;
const nativeWatchRouteStreamRequestOptions: NativeRouteStreamRequestOptions<'users.watch'> = nativeWatchStreamRequestOptions;
const defaultNativeRouteStreamRequestOptions: NativeRouteStreamRequestOptions =
  nativeWatchRouteStreamRequestOptions;
nativeWatchRouteStreamRequestOptions.valueOf();
defaultNativeStreamRouteRequestOptions.valueOf();
defaultNativeRouteStreamRequestOptions.valueOf();
const nativeTenantClientArgs: NativeRouteClientArgs<'tenants.current'> = [
  { ok: true },
  nativeTenantRequestOptions,
];
const defaultNativeRouteClientArgs: NativeRouteClientArgs =
  nativeTenantClientArgs;
nativeTenantClientArgs[0].ok.valueOf();
defaultNativeRouteClientArgs[0].valueOf();
const nativeTenantUnaryClientArgs: NativeUnaryRouteClientArgs<'tenants.current'> = nativeTenantClientArgs;
const defaultNativeUnaryRouteClientArgs: NativeUnaryRouteClientArgs =
  nativeTenantUnaryClientArgs;
const nativeTenantRouteUnaryClientArgs: NativeRouteUnaryClientArgs<'tenants.current'> = nativeTenantUnaryClientArgs;
const defaultNativeRouteUnaryClientArgs: NativeRouteUnaryClientArgs =
  nativeTenantRouteUnaryClientArgs;
nativeTenantRouteUnaryClientArgs[0].ok.valueOf();
defaultNativeUnaryRouteClientArgs[0].valueOf();
defaultNativeRouteUnaryClientArgs[0].valueOf();
const nativeWatchStreamClientArgs: NativeStreamRouteClientArgs<'users.watch'> = [
  { userId: '1' },
  nativeWatchStreamRequestOptions,
];
const defaultNativeStreamRouteClientArgs: NativeStreamRouteClientArgs =
  nativeWatchStreamClientArgs;
const nativeWatchRouteStreamClientArgs: NativeRouteStreamClientArgs<'users.watch'> = nativeWatchStreamClientArgs;
const defaultNativeRouteStreamClientArgs: NativeRouteStreamClientArgs =
  nativeWatchRouteStreamClientArgs;
nativeWatchRouteStreamClientArgs[0].userId.toUpperCase();
defaultNativeStreamRouteClientArgs[0].userId.toUpperCase();
defaultNativeRouteStreamClientArgs[0].userId.toUpperCase();
const nativeUserClientArgs: NativeRouteClientArgs<'users.get'> = [
  { id: '550e8400-e29b-41d4-a716-446655440000' },
];
const defaultNativeUserClientArgs: NativeRouteClientArgs = nativeUserClientArgs;
nativeUserClientArgs[0].id.toUpperCase();
if ('id' in defaultNativeUserClientArgs[0]) {
  defaultNativeUserClientArgs[0].id.toUpperCase();
}
const usersGetHasHeaders: RouteHasHeaders<'users.get'> = true;
const defaultRouteHasHeaders: RouteHasHeaders = usersGetHasHeaders;
usersGetHasHeaders.valueOf();
defaultRouteHasHeaders.valueOf();
const usersGetUnaryHasHeaders: UnaryRouteHasHeaders<'users.get'> = true;
usersGetUnaryHasHeaders.valueOf();
const usersGetRequiresHeaders: RouteRequiresHeaders<'users.get'> = false;
const defaultRouteRequiresHeaders: RouteRequiresHeaders =
  usersGetRequiresHeaders;
usersGetRequiresHeaders.valueOf();
defaultRouteRequiresHeaders.valueOf();
const usersGetUnaryRequiresHeaders: UnaryRouteRequiresHeaders<'users.get'> = false;
usersGetUnaryRequiresHeaders.valueOf();
const tenantsCurrentHasHeaders: RouteHasHeaders<'tenants.current'> = true;
tenantsCurrentHasHeaders.valueOf();
const tenantsCurrentRequiresHeaders: RouteRequiresHeaders<'tenants.current'> = true;
tenantsCurrentRequiresHeaders.valueOf();
const usersGetHasResponseHeaders: RouteHasResponseHeaders<'users.get'> = true;
const defaultRouteHasResponseHeaders: RouteHasResponseHeaders =
  usersGetHasResponseHeaders;
usersGetHasResponseHeaders.valueOf();
defaultRouteHasResponseHeaders.valueOf();
const usersGetUnaryHasResponseHeaders: UnaryRouteHasResponseHeaders<'users.get'> = true;
usersGetUnaryHasResponseHeaders.valueOf();
const usersGetRequiresResponseHeaders: RouteRequiresResponseHeaders<'users.get'> = true;
const defaultRouteRequiresResponseHeaders: RouteRequiresResponseHeaders =
  false;
usersGetRequiresResponseHeaders.valueOf();
defaultRouteRequiresResponseHeaders.valueOf();
const usersGetUnaryRequiresResponseHeaders: UnaryRouteRequiresResponseHeaders<'users.get'> = true;
usersGetUnaryRequiresResponseHeaders.valueOf();
const usersWatchHasResponseHeaders: RouteHasResponseHeaders<'users.watch'> = false;
usersWatchHasResponseHeaders.valueOf();
const usersWatchStreamHasResponseHeaders: StreamRouteHasResponseHeaders<'users.watch'> = false;
usersWatchStreamHasResponseHeaders.valueOf();
const usersGetErrorCode: RouteErrorCode<'users.get'> = 'NOT_FOUND';
const defaultRouteErrorCode: RouteErrorCode = usersGetErrorCode;
usersGetErrorCode.toUpperCase();
defaultRouteErrorCode.toUpperCase();
const usersGetUnaryErrorCode: UnaryRouteErrorCode<'users.get'> = 'NOT_FOUND';
const defaultUnaryRouteErrorCode: UnaryRouteErrorCode = usersGetUnaryErrorCode;
usersGetUnaryErrorCode.toUpperCase();
defaultUnaryRouteErrorCode.toUpperCase();
const usersWatchStreamErrorCode: StreamRouteErrorCode<'users.watch'> = 'VALIDATION_ERROR';
const defaultStreamRouteErrorCode: StreamRouteErrorCode =
  usersWatchStreamErrorCode;
usersWatchStreamErrorCode.toUpperCase();
defaultStreamRouteErrorCode.toUpperCase();
const usersGetErrorDetails: RouteErrorDetails<'users.get', 'NOT_FOUND'> = {
  message: 'Missing',
};
const defaultRouteErrorDetails: RouteErrorDetails = usersGetErrorDetails;
usersGetErrorDetails.message.toUpperCase();
defaultRouteErrorDetails.valueOf();
const usersGetUnaryErrorDetails: UnaryRouteErrorDetails<'users.get', 'NOT_FOUND'> = usersGetErrorDetails;
const defaultUnaryRouteErrorDetails: UnaryRouteErrorDetails =
  usersGetUnaryErrorDetails;
usersGetUnaryErrorDetails.message.toUpperCase();
defaultUnaryRouteErrorDetails.valueOf();
const usersWatchStreamErrorDetails: StreamRouteErrorDetails<'users.watch', 'VALIDATION_ERROR'> = { issue: 'input' };
const defaultStreamRouteErrorDetails: StreamRouteErrorDetails =
  usersWatchStreamErrorDetails;
usersWatchStreamErrorDetails.valueOf();
defaultStreamRouteErrorDetails.valueOf();
const routeStreamEvent: RouteStreamEvent<'users.watch'> = {
  type: 'user.updated',
  userId: '1',
};
const defaultRouteStreamEvent: RouteStreamEvent = routeStreamEvent;
routeStreamEvent.userId.toUpperCase();
defaultRouteStreamEvent.userId.toUpperCase();
const streamRouteEvent: StreamRouteEvent<'users.watch'> = routeStreamEvent;
const defaultStreamRouteEvent: StreamRouteEvent = streamRouteEvent;
streamRouteEvent.userId.toUpperCase();
defaultStreamRouteEvent.userId.toUpperCase();
client.tenants.current({ ok: true }, { headers: tenantHeaders }).then((result) => {
  const exact: RouteResult<'tenants.current'> = result;
  exact.id.toUpperCase();
  if (result.ok) result.data.tenantId.toUpperCase();
});
client.tenants.current.call({ ok: true }, { headers: tenantHeaders });
const tenantRequest = client.tenants.current.request({ ok: true }, { headers: tenantHeaders });
const tenantRequestId: 'tenants.current' = tenantRequest.id;
tenantRequestId.toUpperCase();
tenantRequest.headers['x-tenant-id'].toUpperCase();
const protocolRequest: RouteProtocolRequest<'users.get'> = {
  id: 'users.get',
  input: { id: '550e8400-e29b-41d4-a716-446655440000' },
};
const protocolRequestOptions: ProtocolRequestOptions = { traceId: 'trace-1' };
const routeProtocolRequestBuilder: RouteProtocolRequestBuilder =
  createRouteProtocolRequest;
const routeUnaryProtocolRequestBuilder: RouteUnaryProtocolRequestBuilder =
  createRouteUnaryProtocolRequest;
const unaryRouteProtocolRequestBuilder: UnaryRouteProtocolRequestBuilder =
  createUnaryRouteProtocolRequest;
const routeStreamProtocolRequestBuilder: RouteStreamProtocolRequestBuilder =
  createRouteStreamProtocolRequest;
const streamRouteProtocolRequestBuilder: StreamRouteProtocolRequestBuilder =
  createStreamRouteProtocolRequest;
const routeStreamRequestBuilder: RouteStreamRequestBuilder =
  createRouteStreamRequest;
const streamRouteRequestBuilder: StreamRouteRequestBuilder =
  createStreamRouteRequest;
const builtProtocolRequest = routeProtocolRequestBuilder(
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' },
  protocolRequestOptions
);
const builtRouteUnaryProtocolRequest = routeUnaryProtocolRequestBuilder(
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' }
);
const builtUnaryRouteProtocolRequest = unaryRouteProtocolRequestBuilder(
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' }
);
const builtRouteStreamProtocolRequest = routeStreamProtocolRequestBuilder(
  'users.watch',
  { userId: '1' }
);
const builtStreamRouteProtocolRequest = streamRouteProtocolRequestBuilder(
  'users.watch',
  { userId: '1' }
);
const builtRouteStreamRequest = routeStreamRequestBuilder('users.watch', {
  userId: '1',
});
const builtStreamRouteRequest = streamRouteRequestBuilder('users.watch', {
  userId: '1',
});
const builtProtocolRequestDirect = createRouteProtocolRequest(
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' },
  { traceId: 'trace-2' }
);
const builtRouteUnaryProtocolRequestDirect = createRouteUnaryProtocolRequest(
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' }
);
const builtRouteStreamProtocolRequestDirect = createRouteStreamProtocolRequest(
  'users.watch',
  { userId: '1' }
);
const builtRouteStreamRequestDirect = createRouteStreamRequest('users.watch', {
  userId: '1',
});
const typedBuiltProtocolRequest: RouteProtocolRequest<'users.get'> =
  builtProtocolRequest;
const typedBuiltRouteUnaryProtocolRequest: RouteUnaryProtocolRequest<'users.get'> =
  builtRouteUnaryProtocolRequest;
const typedBuiltUnaryRouteProtocolRequest: UnaryRouteProtocolRequest<'users.get'> =
  builtUnaryRouteProtocolRequest;
const typedBuiltRouteStreamProtocolRequest: RouteStreamProtocolRequest<'users.watch'> =
  builtRouteStreamProtocolRequest;
const typedBuiltStreamRouteProtocolRequest: StreamRouteProtocolRequest<'users.watch'> =
  builtStreamRouteProtocolRequest;
const typedBuiltRouteStreamRequest: RouteStreamRequest<'users.watch'> =
  builtRouteStreamRequest;
const typedBuiltStreamRouteRequest: StreamRouteRequest<'users.watch'> =
  builtStreamRouteRequest;
typedBuiltProtocolRequest.traceId?.toUpperCase();
typedBuiltRouteUnaryProtocolRequest.input.id.toUpperCase();
typedBuiltUnaryRouteProtocolRequest.input.id.toUpperCase();
typedBuiltRouteStreamProtocolRequest.input.userId.toUpperCase();
typedBuiltStreamRouteProtocolRequest.input.userId.toUpperCase();
typedBuiltRouteStreamRequest.input.userId.toUpperCase();
typedBuiltStreamRouteRequest.input.userId.toUpperCase();
builtProtocolRequestDirect.traceId?.toUpperCase();
builtRouteUnaryProtocolRequestDirect.input.id.toUpperCase();
builtRouteStreamProtocolRequestDirect.input.userId.toUpperCase();
builtRouteStreamRequestDirect.input.userId.toUpperCase();
createRouteProtocolRequest(
  'users.get',
  // @ts-expect-error generated protocol request builders validate input by id.
  { ok: true }
);
createRouteUnaryProtocolRequest(
  // @ts-expect-error generated unary protocol request builders reject stream route ids.
  'users.watch',
  { userId: '1' }
);
createRouteStreamProtocolRequest(
  // @ts-expect-error generated stream protocol request builders reject unary route ids.
  'users.get',
  { id: '550e8400-e29b-41d4-a716-446655440000' }
);
const defaultProtocolRequest: RouteProtocolRequest = protocolRequest;
const protocolRequestAlias: ProtocolRequest<'users.get'> = protocolRequest;
const defaultProtocolRequestAlias: ProtocolRequest = protocolRequestAlias;
if (defaultProtocolRequest.id === 'users.get') {
  defaultProtocolRequest.input.id.toUpperCase();
}
if (defaultProtocolRequestAlias.id === 'users.get') {
  defaultProtocolRequestAlias.input.id.toUpperCase();
}
const _extraProtocolRequest: RouteProtocolRequest<'users.get'> = {
  id: 'users.get',
  input: { id: '550e8400-e29b-41d4-a716-446655440000' },
  // @ts-expect-error generated protocol request types reject unknown envelope fields.
  extra: true,
};
_extraProtocolRequest.id.toUpperCase();
const protocolRequestUnion: RouteProtocolRequestUnion = protocolRequest;
const protocolRequestUnionAlias: ProtocolRequestUnion = protocolRequestUnion;
protocolRequestUnionAlias.id.toUpperCase();
const unaryProtocolRequest: RouteUnaryProtocolRequest<'users.get'> = protocolRequest;
const unaryProtocolRequestAlias: UnaryProtocolRequest<'users.get'> =
  unaryProtocolRequest;
const defaultUnaryProtocolRequest: RouteUnaryProtocolRequest =
  unaryProtocolRequest;
const defaultUnaryProtocolRequestAlias: UnaryProtocolRequest =
  unaryProtocolRequestAlias;
const unaryRouteProtocolRequest: UnaryRouteProtocolRequest<'users.get'> =
  unaryProtocolRequest;
const defaultUnaryRouteProtocolRequest: UnaryRouteProtocolRequest =
  unaryRouteProtocolRequest;
unaryRouteProtocolRequest.input.id.toUpperCase();
defaultUnaryProtocolRequest.id.toUpperCase();
defaultUnaryProtocolRequestAlias.id.toUpperCase();
defaultUnaryRouteProtocolRequest.id.toUpperCase();
const unaryProtocolRequestUnion: UnaryProtocolRequestUnion =
  unaryProtocolRequestAlias;
unaryProtocolRequestUnion.id.toUpperCase();
const unaryRouteProtocolRequestUnion: UnaryRouteProtocolRequestUnion =
  unaryRouteProtocolRequest;
unaryRouteProtocolRequestUnion.id.toUpperCase();
const streamProtocolRequest: RouteStreamProtocolRequest<'users.watch'> = {
  id: 'users.watch',
  input: { userId: '1' },
};
const streamProtocolRequestAlias: StreamProtocolRequest<'users.watch'> =
  streamProtocolRequest;
const defaultRouteStreamProtocolRequest: RouteStreamProtocolRequest =
  streamProtocolRequest;
const defaultStreamProtocolRequestAlias: StreamProtocolRequest =
  streamProtocolRequestAlias;
const streamRouteProtocolRequest: StreamRouteProtocolRequest<'users.watch'> =
  streamProtocolRequest;
const defaultStreamRouteProtocolRequest: StreamRouteProtocolRequest =
  streamRouteProtocolRequest;
const streamRequest: RouteStreamRequest<'users.watch'> = streamProtocolRequest;
const defaultRouteStreamRequest: RouteStreamRequest = streamRequest;
const streamRouteRequest: StreamRouteRequest<'users.watch'> = streamRequest;
const defaultStreamRouteRequest: StreamRouteRequest = streamRouteRequest;
streamRouteProtocolRequest.input.userId.toUpperCase();
streamProtocolRequestAlias.input.userId.toUpperCase();
streamRequest.input.userId.toUpperCase();
defaultRouteStreamProtocolRequest.input.userId.toUpperCase();
defaultStreamProtocolRequestAlias.input.userId.toUpperCase();
defaultStreamRouteProtocolRequest.input.userId.toUpperCase();
defaultRouteStreamRequest.input.userId.toUpperCase();
defaultStreamRouteRequest.input.userId.toUpperCase();
const streamRouteProtocolRequestUnion: StreamRouteProtocolRequestUnion =
  streamRouteProtocolRequest;
const streamProtocolRequestUnion: StreamProtocolRequestUnion =
  streamRouteProtocolRequestUnion;
streamRouteProtocolRequestUnion.input.userId.toUpperCase();
streamProtocolRequestUnion.input.userId.toUpperCase();
const routeStreamRequestUnion: RouteStreamRequestUnion = streamRequest;
const streamRouteRequestUnion: StreamRouteRequestUnion = streamRouteRequest;
routeStreamRequestUnion.input.userId.toUpperCase();
streamRouteRequestUnion.input.userId.toUpperCase();
const routeBody: RouteBody = streamProtocolRequest;
const unaryRouteBody: UnaryRouteBody = unaryRouteProtocolRequest;
const routeUnaryBody: RouteUnaryBody = unaryRouteBody;
const streamRouteBody: StreamRouteBody = streamRouteProtocolRequest;
const routeStreamBody: RouteStreamBody = streamRouteBody;
const routeBodyResult: RouteBodyResult = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Ada' },
  headers: { 'cache-control': 'private' },
};
const unaryRouteBodyResult: UnaryRouteBodyResult = routeBodyResult;
const routeUnaryBodyResult: RouteUnaryBodyResult = unaryRouteBodyResult;
const streamRouteBodyResult: StreamRouteBodyResult = new Response();
const routeStreamBodyResult: RouteStreamBodyResult = streamRouteBodyResult;
const routeBodyResultFor: RouteBodyResultFor<typeof protocolRequest> = routeBodyResult;
const genericRouteBodyResult: RouteBodyResult<typeof protocolRequest> =
  routeBodyResultFor;
if (!(genericRouteBodyResult instanceof Response) && genericRouteBodyResult.ok) {
  const genericRouteBodyResultId: 'users.get' = genericRouteBodyResult.id;
  genericRouteBodyResultId.toUpperCase();
  // @ts-expect-error generated route body result aliases preserve exact route ids.
  const wrongGenericRouteBodyResultId: 'posts.list' =
    genericRouteBodyResult.id;
  wrongGenericRouteBodyResultId.toUpperCase();
}
const unaryRouteBodyResultFor: UnaryRouteBodyResultFor<typeof unaryRouteBody> =
  routeBodyResult;
const genericUnaryRouteBodyResult: UnaryRouteBodyResult<typeof unaryRouteBody> =
  unaryRouteBodyResultFor;
if (
  !(genericUnaryRouteBodyResult instanceof Response) &&
  genericUnaryRouteBodyResult.ok
) {
  const genericUnaryRouteBodyResultId: 'users.get' =
    genericUnaryRouteBodyResult.id;
  genericUnaryRouteBodyResultId.toUpperCase();
  // @ts-expect-error generated unary route body result aliases preserve exact route ids.
  const wrongGenericUnaryRouteBodyResultId: 'posts.list' =
    genericUnaryRouteBodyResult.id;
  wrongGenericUnaryRouteBodyResultId.toUpperCase();
}
const routeUnaryBodyResultFor: RouteUnaryBodyResultFor<typeof routeUnaryBody> =
  unaryRouteBodyResultFor;
const streamRouteBodyResultFor: StreamRouteBodyResultFor<typeof streamRouteBody> =
  routeStreamBodyResult;
const genericStreamRouteBodyResult: StreamRouteBodyResult<typeof streamRouteBody> =
  streamRouteBodyResultFor;
genericStreamRouteBodyResult.headers.get('content-type');
const routeStreamBodyResultFor: RouteStreamBodyResultFor<typeof routeStreamBody> =
  streamRouteBodyResultFor;
const routeEnvelope: RouteEnvelope<'users.get'> = routeBodyResult;
const defaultRouteEnvelope: RouteEnvelope = routeEnvelope;
const unaryRouteEnvelope: UnaryRouteEnvelope<'users.get'> = routeEnvelope;
const defaultUnaryRouteEnvelope: UnaryRouteEnvelope = unaryRouteEnvelope;
const routeUnaryEnvelope: RouteUnaryEnvelope<'users.get'> = unaryRouteEnvelope;
const defaultRouteUnaryEnvelope: RouteUnaryEnvelope = routeUnaryEnvelope;
routeEnvelope.id.toUpperCase();
routeUnaryEnvelope.id.toUpperCase();
defaultRouteEnvelope.id.toUpperCase();
defaultUnaryRouteEnvelope.id.toUpperCase();
defaultRouteUnaryEnvelope.id.toUpperCase();
const routeEnvelopeUnion: RouteEnvelopeUnion = routeBodyResult;
const unaryRouteEnvelopeUnion: UnaryRouteEnvelopeUnion = routeEnvelopeUnion;
const routeUnaryEnvelopeUnion: RouteUnaryEnvelopeUnion =
  unaryRouteEnvelopeUnion;
const routeResultUnion: RouteResultUnion = routeEnvelopeUnion;
const unaryRouteResultUnion: UnaryRouteResultUnion = routeResultUnion;
const routeUnaryResultUnion: RouteUnaryResultUnion = unaryRouteResultUnion;
const unaryRouteResult: UnaryRouteResult<'users.get'> = routeEnvelope;
const defaultUnaryRouteResult: UnaryRouteResult = unaryRouteResult;
const routeUnaryResult: RouteUnaryResult<'users.get'> = unaryRouteResult;
const defaultRouteUnaryResult: RouteUnaryResult = routeUnaryResult;
routeUnaryResult.id.toUpperCase();
defaultUnaryRouteResult.id.toUpperCase();
defaultRouteUnaryResult.id.toUpperCase();
const protocolBatch: RouteProtocolBatchRequest<readonly [typeof unaryProtocolRequest]> = [
  unaryProtocolRequest,
];
const unaryProtocolBatch: RouteUnaryProtocolBatchRequest<readonly [typeof unaryProtocolRequest]> =
  protocolBatch;
const unaryRouteProtocolBatch: UnaryRouteProtocolBatchRequest<readonly [typeof unaryProtocolRequest]> =
  unaryProtocolBatch;
const protocolBatchAlias: ProtocolBatchRequest<readonly [typeof unaryProtocolRequest]> =
  unaryRouteProtocolBatch;
const defaultProtocolBatch: RouteProtocolBatchRequest = protocolBatch;
const defaultProtocolBatchFirst = defaultProtocolBatch[0];
if (defaultProtocolBatchFirst) {
  defaultProtocolBatchFirst.id.toUpperCase();
}
protocolBatchAlias[0].input.id.toUpperCase();
const routeProtocolBatchBody: RouteBody = protocolBatch;
const routeUnaryProtocolBatchBody: RouteUnaryBody = unaryProtocolBatch;
const unaryRouteProtocolBatchBody: UnaryRouteBody = unaryRouteProtocolBatch;
const readonlyRouteBody: RouteBody = protocolBatch;
protocolRequestUnion.id.toUpperCase();
routeBody.id.toUpperCase();
routeUnaryBody.id.toUpperCase();
routeStreamBody.input.userId.toUpperCase();
routeProtocolBatchBody.length.toFixed();
routeUnaryProtocolBatchBody.length.toFixed();
unaryRouteProtocolBatchBody.length.toFixed();
readonlyRouteBody.length.toFixed();
routeUnaryBodyResult.valueOf();
routeStreamBodyResult.headers.get('content-type');
if (!(routeBodyResult instanceof Response) && !Array.isArray(routeBodyResult) && routeBodyResult.ok) {
  routeBodyResult.data.name.toUpperCase();
}
if (routeEnvelopeUnion.ok) {
  routeEnvelopeUnion.data.name.toUpperCase();
}
if (routeUnaryEnvelopeUnion.ok) {
  routeUnaryEnvelopeUnion.data.name.toUpperCase();
}
if (routeResultUnion.ok) {
  routeResultUnion.data.name.toUpperCase();
}
if (routeUnaryResultUnion.ok) {
  routeUnaryResultUnion.data.name.toUpperCase();
}
if (!(routeBodyResultFor instanceof Response) && routeBodyResultFor.ok) {
  routeBodyResultFor.data.name.toUpperCase();
}
if (!(routeUnaryBodyResultFor instanceof Response) && routeUnaryBodyResultFor.ok) {
  routeUnaryBodyResultFor.data.name.toUpperCase();
}
routeStreamBodyResultFor.headers.get('content-type');
protocolBatch[0].input.id.toUpperCase();

const configured = createClient({ url: '/rpc' });
configured['admin-user']['get-profile']({ id: '1' }).then((result) => {
  if (result.ok) result.data.name.toUpperCase();
});
configured.posts.list({ userId: '1' }).then((result) => {
  if (result.ok) result.data[0]?.title.toUpperCase();
});
configured.tenants.current({ ok: true }, { headers: tenantHeaders }).then((result) => {
  if (result.ok) result.data.tenantId.toUpperCase();
});
configured.batch([request] as const, batchOptions).then((results) => {
  const exact: RouteBatchResults<readonly [typeof request]> = results;
  const exactUnary: UnaryRouteBatchResults<readonly [typeof request]> = exact;
  const exactRouteUnary: RouteUnaryBatchResults<readonly [typeof request]> =
    exactUnary;
  const defaultResults: RouteBatchResults = results;
  const defaultUnaryResults: UnaryRouteBatchResults = exactUnary;
  const firstId: 'users.get' = exact[0].id;
  firstId.toUpperCase();
  if (exact[0].ok) exact[0].data.name.toUpperCase();
  if (exactRouteUnary[0].ok) exactRouteUnary[0].data.name.toUpperCase();
  const defaultResult = defaultResults[0];
  if (defaultResult) defaultResult.id.toUpperCase();
  const defaultUnaryResult = defaultUnaryResults[0];
  if (defaultUnaryResult) defaultUnaryResult.id.toUpperCase();
});
configured
  .batch([builtRouteUnaryProtocolRequest] as const, batchOptions)
  .then((results) => {
    const exact: RouteBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = results;
    const exactProtocol: RouteProtocolBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = exact;
    const exactUnary: UnaryRouteBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = exact;
    const exactRouteUnaryProtocol: RouteUnaryProtocolBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = exactProtocol;
    const exactUnaryRouteProtocol: UnaryRouteProtocolBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = exactRouteUnaryProtocol;
    const exactProtocolAlias: ProtocolBatchResults<
      readonly [typeof builtRouteUnaryProtocolRequest]
    > = exactProtocol;
    const firstId: 'users.get' = exact[0].id;
    firstId.toUpperCase();
    if (exactUnary[0].ok) exactUnary[0].data.name.toUpperCase();
    if (exactProtocol[0].ok) exactProtocol[0].data.name.toUpperCase();
    if (exactUnaryRouteProtocol[0].ok)
      exactUnaryRouteProtocol[0].data.name.toUpperCase();
    if (exactProtocolAlias[0].ok)
      exactProtocolAlias[0].data.name.toUpperCase();
  });
batchFunction([request] as const).then((results) => {
  const exact: RouteBatchResults<readonly [typeof request]> = results;
  const defaultResults: RouteBatchResults = exact;
  if (exact[0].ok) exact[0].data.name.toUpperCase();
  const defaultResult = defaultResults[0];
  if (defaultResult) defaultResult.id.toUpperCase();
});
batchFunction([builtRouteUnaryProtocolRequest] as const).then((results) => {
  const exact: RouteBatchResults<
    readonly [typeof builtRouteUnaryProtocolRequest]
  > = results;
  if (exact[0].ok) exact[0].data.name.toUpperCase();
});
batchFunction([generatedTenantProtocolRequest] as const, {
  headers: { 'x-tenant-id': 'tenant-1' },
}).then((results) => {
  const exact: RouteBatchResults<
    readonly [typeof generatedTenantProtocolRequest]
  > = results;
  if (exact[0].ok) exact[0].data.tenantId.toUpperCase();
});
// @ts-expect-error generated client protocol batches require headers for header-required routes.
batchFunction([generatedTenantProtocolRequest] as const);
type _WrongRouteBatchResults = RouteBatchResults<
  // @ts-expect-error generated route batch result helpers reject invalid request tuples.
  readonly [{ id: 'users.get'; input: { ok: true }; headers: { 'x-tenant-id': 'tenant-1' } }]
>;

async function consumeStream() {
  for await (const event of client.users.watch({ userId: '1' })) {
    const eventType: 'user.updated' = event.type;
    eventType.toUpperCase();
    event.userId.toUpperCase();
  }
  for await (const event of client.users.watch.stream({ userId: '1' })) {
    event.userId.toUpperCase();
  }
}
consumeStream();

const source = {} as NativeTransportRequest;
const nativeTransportHandler: NativeTransportHandler = nativeTransport;
const nativeBodyHandler: NativeBodyHandler = nativeBodyValue;
const nativeRouteUnaryTransportHandler: NativeRouteUnaryTransportHandler =
  nativeTransport;
const nativeRouteStreamTransportHandler: NativeRouteStreamTransportHandler =
  nativeTransport;
const nativeUnaryRouteTransportHandler: NativeUnaryRouteTransportHandler =
  nativeRouteUnaryTransportHandler;
const nativeStreamRouteTransportHandler: NativeStreamRouteTransportHandler =
  nativeRouteStreamTransportHandler;
const nativeUnaryRouteBodyHandler: NativeUnaryRouteBodyHandler =
  nativeBodyValue;
const nativeRouteUnaryBodyHandler: NativeRouteUnaryBodyHandler =
  nativeUnaryRouteBodyHandler;
const nativeStreamRouteBodyHandler: NativeStreamRouteBodyHandler =
  nativeBodyValue;
const nativeRouteStreamBodyHandler: NativeRouteStreamBodyHandler =
  nativeStreamRouteBodyHandler;
const nativeUnaryBody: NativeRouteRequest<'users.get'> = {
  id: 'users.get',
  input: { id: '550e8400-e29b-41d4-a716-446655440000' },
};
const defaultNativeRouteRequest: NativeRouteRequest = nativeUnaryBody;
if (defaultNativeRouteRequest.id === 'users.get') {
  defaultNativeRouteRequest.input.id.toUpperCase();
}
const nativeUnaryProtocolBody: NativeRouteProtocolRequest<'users.get'> =
  nativeUnaryBody;
const nativeProtocolBody: NativeProtocolRequest<'users.get'> =
  nativeUnaryProtocolBody;
const defaultNativeRouteProtocolRequest: NativeRouteProtocolRequest =
  nativeUnaryProtocolBody;
const defaultNativeProtocolRequest: NativeProtocolRequest = nativeProtocolBody;
nativeUnaryProtocolBody.input.id.toUpperCase();
if (defaultNativeRouteProtocolRequest.id === 'users.get') {
  defaultNativeRouteProtocolRequest.input.id.toUpperCase();
}
if (defaultNativeProtocolRequest.id === 'users.get') {
  defaultNativeProtocolRequest.input.id.toUpperCase();
}
const nativeUnaryRequestUnion: NativeUnaryProtocolRequest<'users.get'> =
  nativeUnaryBody;
const defaultNativeUnaryProtocolRequest: NativeUnaryProtocolRequest =
  nativeUnaryRequestUnion;
const nativeRouteProtocolRequestUnion: NativeRouteProtocolRequestUnion =
  nativeUnaryProtocolBody;
const nativeProtocolRequestUnion: NativeProtocolRequestUnion =
  nativeRouteProtocolRequestUnion;
nativeRouteProtocolRequestUnion.id.toUpperCase();
nativeProtocolRequestUnion.id.toUpperCase();
const nativeRouteUnaryProtocolRequest: NativeRouteUnaryProtocolRequest<'users.get'> =
  nativeUnaryProtocolBody;
const defaultNativeRouteUnaryProtocolRequest: NativeRouteUnaryProtocolRequest =
  nativeRouteUnaryProtocolRequest;
nativeRouteUnaryProtocolRequest.input.id.toUpperCase();
defaultNativeRouteUnaryProtocolRequest.id.toUpperCase();
const nativeTenantProtocolRequest: NativeRouteUnaryProtocolRequest<'tenants.current'> =
  {
    id: 'tenants.current',
    input: { ok: true },
  };
const nativeUnaryRouteProtocolRequest: NativeUnaryRouteProtocolRequest<'users.get'> =
  nativeRouteUnaryProtocolRequest;
const defaultNativeUnaryRouteProtocolRequest: NativeUnaryRouteProtocolRequest =
  nativeUnaryRouteProtocolRequest;
nativeUnaryRouteProtocolRequest.input.id.toUpperCase();
defaultNativeUnaryRouteProtocolRequest.id.toUpperCase();
const nativeRouteUnaryProtocolRequestUnion: NativeRouteUnaryProtocolRequestUnion =
  nativeRouteUnaryProtocolRequest;
nativeRouteUnaryProtocolRequestUnion.id.toUpperCase();
const nativeUnaryProtocolRequestUnion: NativeUnaryProtocolRequestUnion =
  nativeRouteUnaryProtocolRequestUnion;
nativeUnaryProtocolRequestUnion.id.toUpperCase();
const nativeUnaryRouteProtocolRequestUnion: NativeUnaryRouteProtocolRequestUnion =
  nativeRouteUnaryProtocolRequestUnion;
nativeUnaryRouteProtocolRequestUnion.id.toUpperCase();
const nativeRouteProtocolBatchRequestUnion: NativeRouteProtocolBatchRequestUnion =
  nativeRouteUnaryProtocolRequest;
const nativeRouteUnaryProtocolBatchRequestUnion: NativeRouteUnaryProtocolBatchRequestUnion =
  nativeRouteProtocolBatchRequestUnion;
const nativeUnaryRouteProtocolBatchRequestUnion: NativeUnaryRouteProtocolBatchRequestUnion =
  nativeRouteUnaryProtocolBatchRequestUnion;
const nativeProtocolBatchRequestUnion: NativeProtocolBatchRequestUnion =
  nativeUnaryRouteProtocolBatchRequestUnion;
nativeRouteProtocolBatchRequestUnion.id.toUpperCase();
nativeRouteUnaryProtocolBatchRequestUnion.id.toUpperCase();
nativeUnaryRouteProtocolBatchRequestUnion.id.toUpperCase();
nativeProtocolBatchRequestUnion.id.toUpperCase();
const nativeRouteUnaryRequest: NativeRouteUnaryRequest<'users.get'> =
  nativeRouteUnaryProtocolRequest;
const defaultNativeRouteUnaryRequest: NativeRouteUnaryRequest =
  nativeRouteUnaryProtocolRequestUnion;
nativeRouteUnaryRequest.id.toUpperCase();
defaultNativeRouteUnaryRequest.id.toUpperCase();
const nativeRouteUnaryRequestUnion: NativeRouteUnaryRequestUnion =
  nativeRouteUnaryRequest;
const nativeUnaryRouteRequestUnion: NativeUnaryRouteRequestUnion =
  nativeRouteUnaryRequestUnion;
const nativeUnaryRequestUnionAlias: NativeUnaryRequestUnion =
  nativeUnaryRouteRequestUnion;
const nativeRouteBatchRequestUnion: NativeRouteBatchRequestUnion =
  nativeRouteUnaryRequest;
const nativeRouteUnaryBatchRequestUnion: NativeRouteUnaryBatchRequestUnion =
  nativeRouteBatchRequestUnion;
const nativeUnaryRouteBatchRequestUnion: NativeUnaryRouteBatchRequestUnion =
  nativeRouteUnaryBatchRequestUnion;
nativeRouteUnaryRequestUnion.id.toUpperCase();
nativeUnaryRouteRequestUnion.id.toUpperCase();
nativeUnaryRequestUnionAlias.id.toUpperCase();
nativeRouteBatchRequestUnion.id.toUpperCase();
nativeRouteUnaryBatchRequestUnion.id.toUpperCase();
nativeUnaryRouteBatchRequestUnion.id.toUpperCase();
const nativeUnaryRouteRequest: NativeUnaryRouteRequest<'users.get'> =
  nativeRouteUnaryRequest;
const defaultNativeUnaryRouteRequestAlias: NativeUnaryRouteRequest =
  nativeUnaryRouteRequest;
defaultNativeUnaryRouteRequestAlias.id.toUpperCase();
const nativeRouteRequestUnion: NativeRouteRequestUnion = nativeUnaryRequestUnion;
defaultNativeUnaryProtocolRequest.id.toUpperCase();
const nativeStreamBody: NativeStreamProtocolRequest<'users.watch'> = {
  id: 'users.watch',
  input: { userId: '1' },
};
const defaultNativeStreamProtocolRequest: NativeStreamProtocolRequest =
  nativeStreamBody;
const nativeRouteStreamProtocolRequest: NativeRouteStreamProtocolRequest<'users.watch'> =
  nativeStreamBody;
const defaultNativeRouteStreamProtocolRequest: NativeRouteStreamProtocolRequest =
  nativeRouteStreamProtocolRequest;
nativeRouteStreamProtocolRequest.input.userId.toUpperCase();
defaultNativeRouteStreamProtocolRequest.input.userId.toUpperCase();
const nativeStreamRouteProtocolRequest: NativeStreamRouteProtocolRequest<'users.watch'> =
  nativeRouteStreamProtocolRequest;
const defaultNativeStreamRouteProtocolRequest: NativeStreamRouteProtocolRequest =
  nativeStreamRouteProtocolRequest;
nativeStreamRouteProtocolRequest.input.userId.toUpperCase();
defaultNativeStreamRouteProtocolRequest.input.userId.toUpperCase();
const nativeRouteStreamProtocolRequestUnion: NativeRouteStreamProtocolRequestUnion =
  nativeStreamRouteProtocolRequest;
nativeRouteStreamProtocolRequestUnion.input.userId.toUpperCase();
const nativeStreamRouteProtocolRequestUnion: NativeStreamRouteProtocolRequestUnion =
  nativeRouteStreamProtocolRequestUnion;
nativeStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const nativeStreamProtocolRequestUnion: NativeStreamProtocolRequestUnion =
  nativeStreamRouteProtocolRequestUnion;
nativeStreamProtocolRequestUnion.input.userId.toUpperCase();
const nativeRouteStreamRequest: NativeRouteStreamRequest<'users.watch'> =
  nativeRouteStreamProtocolRequest;
const defaultNativeRouteStreamRequest: NativeRouteStreamRequest =
  nativeRouteStreamProtocolRequestUnion;
nativeRouteStreamRequest.input.userId.toUpperCase();
defaultNativeRouteStreamRequest.input.userId.toUpperCase();
const nativeStreamRouteRequest: NativeStreamRouteRequest<'users.watch'> =
  nativeRouteStreamRequest;
const defaultNativeStreamRouteRequest: NativeStreamRouteRequest =
  nativeStreamRouteRequest;
const nativeRouteStreamRequestUnion: NativeRouteStreamRequestUnion =
  nativeRouteStreamRequest;
const nativeStreamRouteRequestUnion: NativeStreamRouteRequestUnion =
  nativeStreamRouteRequest;
defaultNativeStreamRouteRequest.input.userId.toUpperCase();
nativeRouteStreamRequestUnion.input.userId.toUpperCase();
nativeStreamRouteRequestUnion.input.userId.toUpperCase();
defaultNativeStreamProtocolRequest.input.userId.toUpperCase();
const nativeRouteBody: NativeRouteBody = nativeUnaryBody;
const nativeRouteUnaryBody: NativeRouteUnaryBody = nativeRouteUnaryProtocolRequest;
const nativeUnaryRouteBody: NativeUnaryRouteBody = nativeRouteUnaryBody;
const nativeRouteStreamBody: NativeRouteStreamBody =
  nativeRouteStreamProtocolRequest;
const nativeStreamRouteBody: NativeStreamRouteBody = nativeRouteStreamBody;
const nativeConfig: NativeConfig<readonly [typeof nativeUsersPlugin]> = {
  plugins: [nativeUsersPlugin] as const,
};
// @ts-expect-error generated native configs inherit readonly options.
nativeConfig.plugins = [] as const;
const nativeConfigFor: NativeConfigFor<readonly [typeof nativeUsersPlugin]> =
  nativeConfig;
const nativeRequestTypedConfigFor: NativeConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = {
  plugins: [nativeUsersPlugin] as const,
  hooks: {
    beforeRequest(request, context) {
      request.runtimeTag.toUpperCase();
      context.body?.input.id.toUpperCase();
      return undefined;
    },
  },
};
const nativeConfigRequest: NativeConfigRequest<typeof nativeRequestTypedConfigFor> =
  generatedRequest;
nativeConfigRequest.runtimeTag.toUpperCase();
const nativeConfigBody: NativeConfigBody<typeof nativeRequestTypedConfigFor> =
  nativeUnaryRouteBody;
nativeConfigBody.input.id.toUpperCase();
const nativeConfigManifest: NativeConfigManifest<typeof nativeRequestTypedConfigFor> =
  manifest;
nativeConfigManifest.procedures['users.get'].output;
const nativeConfigServices: NativeConfigServices<typeof nativeRequestTypedConfigFor> =
  requiredServices;
nativeConfigServices.users.findById('1')?.name.toUpperCase();
// @ts-expect-error generated config request aliases preserve custom request types.
const _wrongNativeConfigRequest: NativeConfigRequest<typeof nativeRequestTypedConfigFor> =
  new Request('https://example.com/rpc');
const nativeUnaryRouteConfig: NativeUnaryRouteConfig<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeConfig;
const nativeUnaryRouteConfigFor: NativeUnaryRouteConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeUnaryRouteConfig;
const nativeRouteUnaryConfig: NativeRouteUnaryConfig<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteConfig;
const nativeRouteUnaryConfigFor: NativeRouteUnaryConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeRouteUnaryConfig;
const nativeRequestTypedRouteUnaryConfigFor: NativeRouteUnaryConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody,
  GeneratedRequest
> = nativeRequestTypedConfigFor;
const nativeStreamRouteConfig: NativeStreamRouteConfig<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = nativeConfig;
const nativeStreamRouteConfigFor: NativeStreamRouteConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = nativeStreamRouteConfig;
const nativeRouteStreamConfig: NativeRouteStreamConfig<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteConfig;
const nativeRouteStreamConfigFor: NativeRouteStreamConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeRouteStreamConfig;
const nativeRequestTypedRouteStreamConfigFor: NativeRouteStreamConfigFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody,
  GeneratedRequest
> = {
  plugins: [nativeUsersPlugin] as const,
  hooks: {
    beforeRequest(request, context) {
      request.runtimeTag.toUpperCase();
      context.body?.input.userId.toUpperCase();
      return undefined;
    },
  },
};
const nativeHandlerHooks: NativeHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = {
  beforeRequest(_request, context) {
    context.body?.input.id.toUpperCase();
    context.services.users.findById('1')?.name.toUpperCase();
    return undefined;
  },
};
const nativeRequestTypedHandlerHooks: NativeHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = {
  beforeRequest(request, context) {
    request.runtimeTag.toUpperCase();
    context.body?.input.id.toUpperCase();
    context.services.users.findById('1')?.name.toUpperCase();
    return undefined;
  },
};
const nativeUnaryRouteHandlerHooks: NativeUnaryRouteHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerHooks;
const nativeRequestTypedUnaryRouteHandlerHooks: NativeUnaryRouteHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = nativeRequestTypedHandlerHooks;
const nativeRouteUnaryHandlerHooks: NativeRouteUnaryHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteHandlerHooks;
const nativeRequestTypedRouteUnaryHandlerHooks: NativeRouteUnaryHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody,
  GeneratedRequest
> = nativeRequestTypedUnaryRouteHandlerHooks;
const nativeStreamRouteHandlerHooks: NativeStreamRouteHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = {
  beforeRequest(_request, context) {
    context.body?.input.userId.toUpperCase();
    context.services.users.findById('1')?.id.toUpperCase();
    return undefined;
  },
};
const nativeRequestTypedStreamRouteHandlerHooks: NativeStreamRouteHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody,
  GeneratedRequest
> = {
  beforeRequest(request, context) {
    request.runtimeTag.toUpperCase();
    context.body?.input.userId.toUpperCase();
    context.services.users.findById('1')?.id.toUpperCase();
    return undefined;
  },
};
const nativeRouteStreamHandlerHooks: NativeRouteStreamHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteHandlerHooks;
const nativeRequestTypedRouteStreamHandlerHooks: NativeRouteStreamHandlerHooks<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody,
  GeneratedRequest
> = nativeRequestTypedStreamRouteHandlerHooks;
const nativeHandlerOptions: NativeHandlerOptions<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = {
  plugins: [nativeUsersPlugin] as const,
  hooks: nativeHandlerHooks,
};
const nativeHandlerOptionsFor: NativeHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerOptions;
const nativeRequestTypedHandlerOptions: NativeHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = {
  plugins: [nativeUsersPlugin] as const,
  hooks: {
    beforeRequest(request, context) {
      request.runtimeTag.toUpperCase();
      context.body?.input.id.toUpperCase();
      return undefined;
    },
  },
};
const nativeHandlerOptionsRequest: NativeHandlerOptionsRequest<
  typeof nativeRequestTypedHandlerOptions
> = generatedRequest;
nativeHandlerOptionsRequest.runtimeTag.toUpperCase();
const nativeHandlerOptionsManifest: NativeHandlerOptionsManifest<
  typeof nativeRequestTypedHandlerOptions
>['procedures']['users.get'] = nativeRouteProcedure;
nativeHandlerOptionsManifest.input.valueOf();
const nativeHandlerOptionsBody: NativeHandlerOptionsBody<
  typeof nativeRequestTypedHandlerOptions
> = nativeUnaryRouteBody;
nativeHandlerOptionsBody.input.id.toUpperCase();
// @ts-expect-error generated handler option request aliases preserve custom request types.
const _wrongNativeHandlerOptionsRequest: NativeHandlerOptionsRequest<
  typeof nativeRequestTypedHandlerOptions
> = new Request('https://example.com/rpc');
const nativeUnaryRouteHandlerOptions: NativeUnaryRouteHandlerOptions<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerOptionsFor;
const nativeUnaryRouteHandlerOptionsFor: NativeUnaryRouteHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeUnaryRouteHandlerOptions;
const nativeRouteUnaryHandlerOptions: NativeRouteUnaryHandlerOptions<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteHandlerOptions;
const nativeRouteUnaryHandlerOptionsFor: NativeRouteUnaryHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeRouteUnaryHandlerOptions;
const nativeRequestTypedRouteUnaryHandlerOptionsFor: NativeRouteUnaryHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody,
  GeneratedRequest
> = nativeRequestTypedHandlerOptions;
const nativeStreamRouteHandlerOptions: NativeStreamRouteHandlerOptions<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = {
  plugins: [nativeUsersPlugin] as const,
  hooks: nativeStreamRouteHandlerHooks,
};
const nativeStreamRouteHandlerOptionsFor: NativeStreamRouteHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = nativeStreamRouteHandlerOptions;
const nativeRouteStreamHandlerOptions: NativeRouteStreamHandlerOptions<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteHandlerOptions;
const nativeRouteStreamHandlerOptionsFor: NativeRouteStreamHandlerOptionsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeRouteStreamHandlerOptions;
const nativeHandlerOptionsArgs: NativeHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = [nativeHandlerOptions];
const nativeHandlerOptionsArgsFor: NativeHandlerOptionsArgsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerOptionsArgs;
const nativeRequestTypedHandlerOptionsArgs: NativeHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = [nativeRequestTypedHandlerOptions];
const nativeRequestTypedRouteUnaryHandlerOptionsArgs: NativeRouteUnaryHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody,
  GeneratedRequest
> = [nativeRequestTypedRouteUnaryHandlerOptionsFor];
const nativeUnaryRouteHandlerOptionsArgs: NativeUnaryRouteHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = [nativeUnaryRouteHandlerOptions];
const nativeRouteUnaryHandlerOptionsArgs: NativeRouteUnaryHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteHandlerOptionsArgs;
const nativeUnaryRouteHandlerOptionsArgsFor: NativeUnaryRouteHandlerOptionsArgsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeUnaryRouteHandlerOptionsArgs;
const nativeRouteUnaryHandlerOptionsArgsFor: NativeRouteUnaryHandlerOptionsArgsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeRouteUnaryHandlerOptionsArgs;
const nativeStreamRouteHandlerOptionsArgs: NativeStreamRouteHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = [nativeStreamRouteHandlerOptions];
const nativeRouteStreamHandlerOptionsArgs: NativeRouteStreamHandlerOptionsArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteHandlerOptionsArgs;
const nativeStreamRouteHandlerOptionsArgsFor: NativeStreamRouteHandlerOptionsArgsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = nativeStreamRouteHandlerOptionsArgs;
const nativeRouteStreamHandlerOptionsArgsFor: NativeRouteStreamHandlerOptionsArgsFor<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeRouteStreamHandlerOptionsArgs;
const nativeHandlerOptionsWithTrailingArgs: NativeHandlerOptionsWithTrailingArgs<
  [preflight?: boolean],
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = [nativeHandlerOptions, true];
const nativeHandlerOptionsWithPreflightArgs: NativeHandlerOptionsWithPreflightArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerOptionsWithTrailingArgs;
const nativeUnaryRouteHandlerOptionsWithTrailingArgs: NativeUnaryRouteHandlerOptionsWithTrailingArgs<
  [preflight?: boolean],
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = [nativeUnaryRouteHandlerOptions, true];
const nativeRouteUnaryHandlerOptionsWithTrailingArgs: NativeRouteUnaryHandlerOptionsWithTrailingArgs<
  [preflight?: boolean],
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteHandlerOptionsWithTrailingArgs;
const nativeStreamRouteHandlerOptionsWithTrailingArgs: NativeStreamRouteHandlerOptionsWithTrailingArgs<
  [preflight?: boolean],
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = [nativeStreamRouteHandlerOptions, true];
const nativeRouteStreamHandlerOptionsWithTrailingArgs: NativeRouteStreamHandlerOptionsWithTrailingArgs<
  [preflight?: boolean],
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteHandlerOptionsWithTrailingArgs;
const nativeUnaryRouteHandlerOptionsWithPreflightArgs: NativeUnaryRouteHandlerOptionsWithPreflightArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeUnaryRouteHandlerOptionsWithTrailingArgs;
const nativeRouteUnaryHandlerOptionsWithPreflightArgs: NativeRouteUnaryHandlerOptionsWithPreflightArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeRouteUnaryHandlerOptionsWithTrailingArgs;
const nativeStreamRouteHandlerOptionsWithPreflightArgs: NativeStreamRouteHandlerOptionsWithPreflightArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = nativeStreamRouteHandlerOptionsWithTrailingArgs;
const nativeRouteStreamHandlerOptionsWithPreflightArgs: NativeRouteStreamHandlerOptionsWithPreflightArgs<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeRouteStreamHandlerOptionsWithTrailingArgs;
const nativeHandlerHookContext: NativeHandlerHookContext<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = {
  services: requiredServices,
  body: nativeUnaryRouteBody,
};
const nativeUnaryRouteHandlerHookContext: NativeUnaryRouteHandlerHookContext<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeHandlerHookContext;
const nativeRouteUnaryHandlerHookContext: NativeRouteUnaryHandlerHookContext<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteHandlerHookContext;
const nativeStreamRouteHandlerHookContext: NativeStreamRouteHandlerHookContext<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = {
  services: requiredServices,
  body: nativeStreamRouteBody,
};
const nativeRouteStreamHandlerHookContext: NativeRouteStreamHandlerHookContext<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteHandlerHookContext;
const nativeMiddleware: NativeMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = { name: 'native', ...nativeHandlerHooks };
const nativeRequestTypedMiddleware: NativeMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = { name: 'native-request', ...nativeRequestTypedHandlerHooks };
const nativeUnaryRouteMiddleware: NativeUnaryRouteMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody
> = nativeMiddleware;
const nativeRequestTypedUnaryRouteMiddleware: NativeUnaryRouteMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
> = nativeRequestTypedMiddleware;
const nativeRouteUnaryMiddleware: NativeRouteUnaryMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody
> = nativeUnaryRouteMiddleware;
const nativeRequestTypedRouteUnaryMiddleware: NativeRouteUnaryMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteUnaryBody,
  GeneratedRequest
> = nativeRequestTypedUnaryRouteMiddleware;
const nativeStreamRouteMiddleware: NativeStreamRouteMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody
> = { name: 'native-stream', ...nativeStreamRouteHandlerHooks };
const nativeRequestTypedStreamRouteMiddleware: NativeStreamRouteMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeStreamRouteBody,
  GeneratedRequest
> = {
  name: 'native-stream-request',
  ...nativeRequestTypedStreamRouteHandlerHooks,
};
const nativeRouteStreamMiddleware: NativeRouteStreamMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody
> = nativeStreamRouteMiddleware;
const nativeRequestTypedRouteStreamMiddleware: NativeRouteStreamMiddleware<
  readonly [typeof nativeUsersPlugin],
  typeof nativeRouteStreamBody,
  GeneratedRequest
> = nativeRequestTypedStreamRouteMiddleware;
const nativeHandlerOptionServices: NativeHandlerOptionServices<
  typeof nativeHandlerOptions
> = requiredServices;
nativeHandlerOptionServices.users.findById('1')?.name.toUpperCase();
const nativeHandlerOptionsServices: NativeHandlerOptionsServices<
  typeof nativeHandlerOptions
> = nativeHandlerOptionServices;
nativeHandlerOptionsServices.users.findById('1')?.name.toUpperCase();
const nativeDefineConfig: NativeDefineConfig = (config) => config;
const nativeDefineUnaryRouteConfig: NativeDefineUnaryRouteConfig = nativeDefineConfig;
const nativeDefineRouteUnaryConfig: NativeDefineRouteUnaryConfig =
  nativeDefineUnaryRouteConfig;
const nativeDefineStreamRouteConfig: NativeDefineStreamRouteConfig =
  nativeDefineConfig;
const nativeDefineRouteStreamConfig: NativeDefineRouteStreamConfig =
  nativeDefineStreamRouteConfig;
nativeDefineRouteUnaryConfig(nativeRouteUnaryConfig).plugins?.[0]?.name.toUpperCase();
nativeDefineRouteStreamConfig(nativeRouteStreamConfig).plugins?.[0]?.name.toUpperCase();
defineNativeConfig(nativeConfig).plugins?.[0]?.name.toUpperCase();
defineNativeRouteUnaryConfig(nativeRouteUnaryConfig).plugins?.[0]?.name.toUpperCase();
defineNativeUnaryRouteConfig(nativeUnaryRouteConfig).plugins?.[0]?.name.toUpperCase();
defineNativeRouteStreamConfig(nativeRouteStreamConfig).plugins?.[0]?.name.toUpperCase();
defineNativeStreamRouteConfig(nativeStreamRouteConfig).plugins?.[0]?.name.toUpperCase();
nativeDefineConfig<
  readonly [typeof nativeUsersPlugin],
  typeof nativeUnaryRouteBody,
  GeneratedRequest
>(nativeRequestTypedConfigFor).hooks?.beforeRequest?.(
  generatedRequest,
  nativeUnaryRouteHandlerHookContext
);
nativeConfigFor.plugins?.[0]?.name.toUpperCase();
nativeUnaryRouteConfigFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeUnaryRouteHandlerHookContext
);
nativeRequestTypedConfigFor.hooks?.beforeRequest?.(
  generatedRequest,
  nativeUnaryRouteHandlerHookContext
);
nativeRouteUnaryConfigFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeRouteUnaryHandlerHookContext
);
nativeRequestTypedRouteUnaryConfigFor.hooks?.beforeRequest?.(
  generatedRequest,
  nativeRouteUnaryHandlerHookContext
);
nativeStreamRouteConfigFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeStreamRouteHandlerHookContext
);
nativeRouteStreamConfigFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeRouteStreamHandlerHookContext
);
nativeRequestTypedRouteStreamConfigFor.hooks?.beforeRequest?.(
  generatedRequest,
  nativeRouteStreamHandlerHookContext
);
const nativeDefineHandlerOptions: NativeDefineHandlerOptions = (options) =>
  options;
const nativeDefineUnaryRouteHandlerOptions: NativeDefineUnaryRouteHandlerOptions =
  nativeDefineHandlerOptions;
const nativeDefineRouteUnaryHandlerOptions: NativeDefineRouteUnaryHandlerOptions =
  nativeDefineUnaryRouteHandlerOptions;
const nativeDefineStreamRouteHandlerOptions: NativeDefineStreamRouteHandlerOptions =
  nativeDefineHandlerOptions;
const nativeDefineRouteStreamHandlerOptions: NativeDefineRouteStreamHandlerOptions =
  nativeDefineStreamRouteHandlerOptions;
nativeDefineRouteUnaryHandlerOptions(nativeRouteUnaryHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeRouteUnaryHandlerHookContext
  );
nativeDefineRouteStreamHandlerOptions(nativeRouteStreamHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeRouteStreamHandlerHookContext
  );
defineNativeHandlerOptions(nativeHandlerOptions).plugins?.[0]?.name.toUpperCase();
defineNativeRouteUnaryHandlerOptions(nativeRouteUnaryHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeRouteUnaryHandlerHookContext
  );
defineNativeUnaryRouteHandlerOptions(nativeUnaryRouteHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeUnaryRouteHandlerHookContext
  );
defineNativeRouteStreamHandlerOptions(nativeRouteStreamHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeRouteStreamHandlerHookContext
  );
defineNativeStreamRouteHandlerOptions(nativeStreamRouteHandlerOptions)
  .hooks?.beforeRequest?.(
    new Request('https://example.com/rpc'),
    nativeStreamRouteHandlerHookContext
  );
nativeHandlerOptionsFor.plugins?.[0]?.name.toUpperCase();
nativeRequestTypedHandlerOptions.hooks?.beforeRequest?.(
  generatedRequest,
  nativeUnaryRouteHandlerHookContext
);
nativeUnaryRouteHandlerOptionsFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeUnaryRouteHandlerHookContext
);
nativeRouteUnaryHandlerOptionsFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeRouteUnaryHandlerHookContext
);
nativeRequestTypedRouteUnaryHandlerOptionsFor.hooks?.beforeRequest?.(
  generatedRequest,
  nativeRouteUnaryHandlerHookContext
);
nativeStreamRouteHandlerOptionsFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeStreamRouteHandlerHookContext
);
nativeRouteStreamHandlerOptionsFor.hooks?.beforeRequest?.(
  new Request('https://example.com/rpc'),
  nativeRouteStreamHandlerHookContext
);
nativeHandlerOptionsArgsFor[0]?.plugins?.[0]?.name.toUpperCase();
nativeUnaryRouteHandlerOptionsArgsFor[0]?.plugins?.[0]?.name.toUpperCase();
nativeRouteUnaryHandlerOptionsArgsFor[0]?.plugins?.[0]?.name.toUpperCase();
nativeStreamRouteHandlerOptionsArgsFor[0]?.plugins?.[0]?.name.toUpperCase();
nativeRouteStreamHandlerOptionsArgsFor[0]?.plugins?.[0]?.name.toUpperCase();
nativeHandlerOptionsWithPreflightArgs[0]?.plugins?.[0]?.name.toUpperCase();
nativeUnaryRouteHandlerOptionsWithPreflightArgs[0]?.plugins?.[0]?.name.toUpperCase();
nativeRouteUnaryHandlerOptionsWithPreflightArgs[0]?.plugins?.[0]?.name.toUpperCase();
nativeStreamRouteHandlerOptionsWithPreflightArgs[0]?.plugins?.[0]?.name.toUpperCase();
nativeRouteStreamHandlerOptionsWithPreflightArgs[0]?.plugins?.[0]?.name.toUpperCase();
nativeRequestTypedHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  generatedRequest,
  nativeUnaryRouteHandlerHookContext
);
nativeRequestTypedRouteUnaryHandlerOptionsArgs[0]?.hooks?.beforeRequest?.(
  generatedRequest,
  nativeRouteUnaryHandlerHookContext
);
nativeRouteUnaryHandlerOptionsArgs[0]?.middleware?.concat(
  nativeRouteUnaryMiddleware
);
nativeRouteStreamHandlerOptionsArgs[0]?.middleware?.concat(
  nativeRouteStreamMiddleware
);
const nativeBody: NativeBody = nativeUnaryBody;
const nativeRouteBodyResult: NativeRouteBodyResult = routeBodyResult;
const nativeUnaryRouteBodyResult: NativeUnaryRouteBodyResult =
  nativeRouteBodyResult;
const nativeRouteUnaryBodyResult: NativeRouteUnaryBodyResult =
  nativeUnaryRouteBodyResult;
const nativeStreamRouteBodyResult: NativeStreamRouteBodyResult =
  new Response();
const nativeRouteStreamBodyResult: NativeRouteStreamBodyResult =
  nativeStreamRouteBodyResult;
const nativeBodyResult: NativeBodyResult = routeBodyResult;
const nativeRouteBodyResultFor: NativeRouteBodyResultFor<typeof nativeUnaryBody> = nativeRouteBodyResult;
const nativeUnaryRouteBodyResultFor: NativeUnaryRouteBodyResultFor<typeof nativeUnaryRouteBody> =
  nativeRouteBodyResult;
const nativeRouteUnaryBodyResultFor: NativeRouteUnaryBodyResultFor<typeof nativeRouteUnaryBody> =
  nativeUnaryRouteBodyResultFor;
const nativeStreamRouteBodyResultFor: NativeStreamRouteBodyResultFor<typeof nativeStreamRouteBody> =
  nativeRouteStreamBodyResult;
const nativeRouteStreamBodyResultFor: NativeRouteStreamBodyResultFor<typeof nativeRouteStreamBody> =
  nativeStreamRouteBodyResultFor;
const nativeBodyResultFor: NativeBodyResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const nativeGenericBodyResult: NativeBodyResult<typeof nativeUnaryBody> = nativeBodyResultFor;
if (!(nativeGenericBodyResult instanceof Response) && nativeGenericBodyResult.ok) {
  const nativeGenericBodyResultId: 'users.get' = nativeGenericBodyResult.id;
  nativeGenericBodyResultId.toUpperCase();
  // @ts-expect-error generated native body result aliases preserve exact route ids.
  const wrongNativeGenericBodyResultId: 'posts.list' =
    nativeGenericBodyResult.id;
  wrongNativeGenericBodyResultId.toUpperCase();
}
const nativeCompiledBodyResult: NativeCompiledBodyResult = nativeBodyResult;
const nativeCompiledBodyResultFor: NativeCompiledBodyResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const nativeGenericCompiledBodyResult: NativeCompiledBodyResult<typeof nativeUnaryBody> =
  nativeCompiledBodyResultFor;
if (
  !(nativeGenericCompiledBodyResult instanceof Response) &&
  !('body' in nativeGenericCompiledBodyResult) &&
  nativeGenericCompiledBodyResult.ok
) {
  const nativeGenericCompiledBodyResultId: 'users.get' =
    nativeGenericCompiledBodyResult.id;
  nativeGenericCompiledBodyResultId.toUpperCase();
  // @ts-expect-error generated native compiled body aliases preserve exact route ids.
  const wrongNativeGenericCompiledBodyResultId: 'posts.list' =
    nativeGenericCompiledBodyResult.id;
  wrongNativeGenericCompiledBodyResultId.toUpperCase();
}
const nativeUnaryRouteCompiledBodyResultFor: NativeUnaryRouteCompiledBodyResultFor<typeof nativeUnaryRouteBody> =
  nativeBodyResult;
const nativeRouteUnaryCompiledBodyResultFor: NativeRouteUnaryCompiledBodyResultFor<typeof nativeRouteUnaryBody> =
  nativeUnaryRouteCompiledBodyResultFor;
const nativeStreamRouteCompiledBodyResultFor: NativeStreamRouteCompiledBodyResultFor<typeof nativeStreamRouteBody> =
  new Response();
const nativeRouteStreamCompiledBodyResultFor: NativeRouteStreamCompiledBodyResultFor<typeof nativeRouteStreamBody> =
  nativeStreamRouteCompiledBodyResultFor;
const nativeCompiledTransportResult: NativeCompiledTransportResult = nativeCompiledBodyResult;
const nativeRouteEnvelope: NativeRouteEnvelope<'users.get'> = nativeBodyResult;
const defaultNativeRouteEnvelope: NativeRouteEnvelope = nativeRouteEnvelope;
nativeRouteEnvelope.id.toUpperCase();
defaultNativeRouteEnvelope.id.toUpperCase();
const nativeRouteEnvelopeUnion: NativeRouteEnvelopeUnion = nativeRouteEnvelope;
const nativeUnaryRouteEnvelope: NativeUnaryRouteEnvelope<'users.get'> =
  nativeRouteEnvelope;
const defaultNativeUnaryRouteEnvelope: NativeUnaryRouteEnvelope =
  nativeUnaryRouteEnvelope;
const nativeUnaryRouteEnvelopeUnion: NativeUnaryRouteEnvelopeUnion =
  nativeRouteEnvelopeUnion;
const nativeRouteUnaryEnvelope: NativeRouteUnaryEnvelope<'users.get'> =
  nativeUnaryRouteEnvelope;
const defaultNativeRouteUnaryEnvelope: NativeRouteUnaryEnvelope =
  nativeRouteUnaryEnvelope;
const nativeRouteUnaryEnvelopeUnion: NativeRouteUnaryEnvelopeUnion =
  nativeUnaryRouteEnvelopeUnion;
nativeRouteUnaryEnvelope.id.toUpperCase();
defaultNativeUnaryRouteEnvelope.id.toUpperCase();
defaultNativeRouteUnaryEnvelope.id.toUpperCase();
nativeRouteUnaryEnvelopeUnion.id.toUpperCase();
const nativeRouteResult: NativeRouteResult<'users.get'> = nativeBodyResult;
const defaultNativeRouteResult: NativeRouteResult = nativeRouteResult;
const nativeUnaryRouteResult: NativeUnaryRouteResult<'users.get'> =
  nativeRouteResult;
const defaultNativeUnaryRouteResult: NativeUnaryRouteResult =
  nativeUnaryRouteResult;
const nativeRouteUnaryResult: NativeRouteUnaryResult<'users.get'> =
  nativeUnaryRouteResult;
const defaultNativeRouteUnaryResult: NativeRouteUnaryResult =
  nativeRouteUnaryResult;
nativeRouteUnaryResult.id.toUpperCase();
defaultNativeRouteResult.id.toUpperCase();
defaultNativeUnaryRouteResult.id.toUpperCase();
defaultNativeRouteUnaryResult.id.toUpperCase();
const nativeRouteResultUnion: NativeRouteResultUnion = nativeBodyResult;
const nativeUnaryRouteResultUnion: NativeUnaryRouteResultUnion =
  nativeRouteResultUnion;
const nativeRouteUnaryResultUnion: NativeRouteUnaryResultUnion =
  nativeUnaryRouteResultUnion;
const nativeTransportResult: NativeTransportResult = nativeCompiledTransportResult;
const nativeUnaryTransportResult: NativeTransportResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const nativeGenericTransportResult: NativeTransportResult<typeof nativeUnaryBody> =
  nativeUnaryTransportResult;
if (
  !(nativeGenericTransportResult instanceof Response) &&
  !('body' in nativeGenericTransportResult) &&
  nativeGenericTransportResult.ok
) {
  const nativeGenericTransportResultId: 'users.get' =
    nativeGenericTransportResult.id;
  nativeGenericTransportResultId.toUpperCase();
  // @ts-expect-error generated native transport aliases preserve exact route ids.
  const wrongNativeGenericTransportResultId: 'posts.list' =
    nativeGenericTransportResult.id;
  wrongNativeGenericTransportResultId.toUpperCase();
}
const nativeRouteUnaryTransportResult: NativeRouteUnaryTransportResultFor<typeof nativeRouteUnaryBody> =
  nativeBodyResult;
const nativeRouteStreamTransportResult: NativeRouteStreamTransportResultFor<typeof nativeRouteStreamBody> =
  new Response();
const nativeUnaryRouteTransportResult: NativeUnaryRouteTransportResultFor<typeof nativeUnaryRouteBody> =
  nativeRouteUnaryTransportResult;
const nativeStreamRouteTransportResult: NativeStreamRouteTransportResultFor<typeof nativeStreamRouteBody> =
  nativeRouteStreamTransportResult;
const isNativeResultArray = (
  result: NativeTransportResult
): result is Extract<NativeTransportResult, readonly unknown[]> => Array.isArray(result);
const nativeRouteRequest: NativeRouteRequest<'users.get'> = nativeUnaryBody;
const defaultNativeUnaryRouteRequest: NativeUnaryRouteRequest = nativeRouteRequest;
defaultNativeUnaryRouteRequest.id.toUpperCase();
const nativeBatchBody: NativeBatchBody = [nativeUnaryBody];
const nativeReadonlyBatchBody: NativeBatchBody = [nativeUnaryBody] as const;
const nativeExactBatchBody = [nativeUnaryBody] as const;
const nativeRouteBatchRequest: NativeRouteBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
const nativeRouteUnaryBatchRequest: NativeRouteUnaryBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
const nativeUnaryRouteBatchRequest: NativeUnaryRouteBatchRequest<readonly [typeof nativeUnaryBody]> = nativeRouteUnaryBatchRequest;
const nativeProtocolBatchRequest: NativeProtocolBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
const nativeRouteBatchHeaders: NativeRouteBatchClientHeaders<
  readonly [typeof nativeUnaryBody]
> = { authorization: 'Bearer token' };
const nativeBatchHeaders: NativeBatchClientHeaders<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchHeaders;
const nativeRouteUnaryBatchHeaders: NativeRouteUnaryBatchClientHeaders<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchHeaders;
const nativeUnaryRouteBatchHeaders: NativeUnaryRouteBatchClientHeaders<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryBatchHeaders;
const nativeRouteBatchOptions: NativeRouteBatchOptions<
  readonly [typeof nativeUnaryBody]
> = { headers: nativeRouteBatchHeaders };
const nativeBatchOptions: NativeBatchOptions<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchOptions;
const nativeRouteUnaryBatchOptions: NativeRouteUnaryBatchOptions<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchOptions;
const nativeUnaryRouteBatchOptions: NativeUnaryRouteBatchOptions<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryBatchOptions;
const nativeRouteBatchOptionsTuple: NativeRouteBatchOptionsTuple<
  readonly [typeof nativeUnaryBody]
> = [nativeRouteBatchOptions];
const nativeBatchOptionsTuple: NativeBatchOptionsTuple<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchOptionsTuple;
const nativeRouteUnaryBatchOptionsTuple: NativeRouteUnaryBatchOptionsTuple<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchOptionsTuple;
const nativeUnaryRouteBatchOptionsTuple: NativeUnaryRouteBatchOptionsTuple<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryBatchOptionsTuple;
const nativeTenantProtocolBatchOptions: NativeBatchOptions<
  readonly [typeof nativeTenantProtocolRequest]
> = {
  headers: { 'x-tenant-id': 'tenant-1' },
};
const nativeTenantProtocolBatchOptionsTuple: NativeBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = [nativeTenantProtocolBatchOptions];
const nativeRouteProtocolBatchHeaders: NativeRouteProtocolBatchClientHeaders<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeTenantProtocolBatchOptions.headers;
const nativeProtocolBatchHeaders: NativeProtocolBatchClientHeaders<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchHeaders;
const nativeRouteUnaryProtocolBatchHeaders: NativeRouteUnaryProtocolBatchClientHeaders<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchHeaders;
const nativeUnaryRouteProtocolBatchHeaders: NativeUnaryRouteProtocolBatchClientHeaders<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteUnaryProtocolBatchHeaders;
const nativeRouteProtocolBatchOptions: NativeRouteProtocolBatchOptions<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeTenantProtocolBatchOptions;
const nativeProtocolBatchOptions: NativeProtocolBatchOptions<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchOptions;
const nativeRouteUnaryProtocolBatchOptions: NativeRouteUnaryProtocolBatchOptions<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchOptions;
const nativeUnaryRouteProtocolBatchOptions: NativeUnaryRouteProtocolBatchOptions<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteUnaryProtocolBatchOptions;
const nativeRouteProtocolBatchOptionsTuple: NativeRouteProtocolBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeTenantProtocolBatchOptionsTuple;
const nativeProtocolBatchOptionsTuple: NativeProtocolBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchOptionsTuple;
const nativeRouteUnaryProtocolBatchOptionsTuple: NativeRouteUnaryProtocolBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteProtocolBatchOptionsTuple;
const nativeUnaryRouteProtocolBatchOptionsTuple: NativeUnaryRouteProtocolBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = nativeRouteUnaryProtocolBatchOptionsTuple;
nativeTenantProtocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
nativeProtocolBatchHeaders['x-tenant-id'].toUpperCase();
nativeUnaryRouteProtocolBatchHeaders['x-tenant-id'].toUpperCase();
nativeProtocolBatchOptions.headers['x-tenant-id'].toUpperCase();
nativeUnaryRouteProtocolBatchOptions.headers['x-tenant-id'].toUpperCase();
nativeProtocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
nativeUnaryRouteProtocolBatchOptionsTuple[0].headers['x-tenant-id'].toUpperCase();
// @ts-expect-error generated native protocol batches require batch headers for header-required routes.
const _missingNativeTenantProtocolBatchOptionsTuple: NativeBatchOptionsTuple<
  readonly [typeof nativeTenantProtocolRequest]
> = [];
_missingNativeTenantProtocolBatchOptionsTuple;
const nativeRouteProtocolBatchRequest: NativeRouteProtocolBatchRequest<
  readonly [typeof nativeUnaryBody]
> = nativeProtocolBatchRequest;
const nativeRouteUnaryProtocolBatchRequest: NativeRouteUnaryProtocolBatchRequest<
  readonly [typeof nativeUnaryBody]
> = nativeRouteProtocolBatchRequest;
const nativeUnaryRouteProtocolBatchRequest: NativeUnaryRouteProtocolBatchRequest<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryProtocolBatchRequest;
const nativeProtocolBatchBody: NativeBatchBody = nativeProtocolBatchRequest;
const nativeRouteProtocolBatchBody: NativeRouteBody =
  nativeRouteProtocolBatchRequest;
const nativeRouteUnaryProtocolBatchBody: NativeRouteUnaryBody =
  nativeRouteUnaryProtocolBatchRequest;
const nativeUnaryRouteProtocolBatchBody: NativeUnaryRouteBody =
  nativeUnaryRouteProtocolBatchRequest;
const nativeRouteBatchResults: NativeRouteBatchResults<readonly [typeof nativeUnaryBody]> =
  [nativeRouteEnvelope];
const nativeRouteProtocolBatchResults: NativeRouteProtocolBatchResults<
  readonly [typeof nativeUnaryBody]
> = [nativeRouteEnvelope];
const nativeRouteUnaryBatchResults: NativeRouteUnaryBatchResults<
  readonly [typeof nativeUnaryBody]
> = nativeRouteBatchResults;
const nativeRouteUnaryProtocolBatchResults: NativeRouteUnaryProtocolBatchResults<
  readonly [typeof nativeUnaryBody]
> = nativeRouteProtocolBatchResults;
const nativeUnaryRouteBatchResults: NativeUnaryRouteBatchResults<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryBatchResults;
const nativeUnaryRouteProtocolBatchResults: NativeUnaryRouteProtocolBatchResults<
  readonly [typeof nativeUnaryBody]
> = nativeRouteUnaryProtocolBatchResults;
const nativeProtocolBatchResults: NativeProtocolBatchResults<
  readonly [typeof nativeUnaryBody]
> = nativeRouteProtocolBatchResults;
nativeRouteBatchRequest[0].input.id.toUpperCase();
nativeRouteUnaryBatchRequest[0].input.id.toUpperCase();
nativeRouteUnaryBatchResults[0].id.toUpperCase();
nativeProtocolBatchRequest[0].input.id.toUpperCase();
nativeRouteProtocolBatchRequest[0].input.id.toUpperCase();
nativeUnaryRouteProtocolBatchRequest[0].input.id.toUpperCase();
nativeProtocolBatchBody.length.toFixed();
nativeRouteProtocolBatchBody.length.toFixed();
nativeRouteUnaryProtocolBatchBody.length.toFixed();
nativeUnaryRouteProtocolBatchBody.length.toFixed();
nativeRouteProtocolBatchResults[0].id.toUpperCase();
nativeRouteUnaryProtocolBatchResults[0].id.toUpperCase();
nativeUnaryRouteProtocolBatchResults[0].id.toUpperCase();
nativeProtocolBatchResults[0].id.toUpperCase();
nativeUnaryRequestUnion.id.toUpperCase();
nativeUnaryRouteRequest.id.toUpperCase();
nativeRouteRequestUnion.id.toUpperCase();
nativeStreamRouteRequest.input.userId.toUpperCase();
nativeRouteBody.id.toUpperCase();
nativeRouteUnaryBody.id.toUpperCase();
nativeRouteStreamBody.input.userId.toUpperCase();
nativeRouteUnaryBodyResult.valueOf();
nativeRouteStreamBodyResult.headers.get('content-type');
nativeTransport(source, nativeBody);
nativeTransportHandler(source, nativeBody);
nativeBodyHandler(new Request('https://example.com/rpc'), nativeUnaryBody);
nativeUnaryRouteTransportHandler(source, nativeUnaryRouteBody);
nativeRouteUnaryTransportHandler(source, nativeRouteUnaryBody);
nativeStreamRouteTransportHandler(source, nativeStreamRouteBody);
nativeRouteStreamTransportHandler(source, nativeRouteStreamBody);
nativeUnaryRouteBodyHandler(
  new Request('https://example.com/rpc'),
  nativeUnaryRouteBody
);
nativeRouteUnaryBodyHandler(
  new Request('https://example.com/rpc'),
  nativeRouteUnaryBody
);
nativeStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  nativeStreamRouteBody
);
nativeRouteStreamBodyHandler(
  new Request('https://example.com/rpc'),
  nativeRouteStreamBody
);
nativeUnaryRouteTransportHandler(
  source,
  // @ts-expect-error generated native unary transport handlers reject stream route bodies.
  nativeStreamRouteBody
);
nativeStreamRouteBodyHandler(
  new Request('https://example.com/rpc'),
  // @ts-expect-error generated native stream body handlers reject unary route bodies.
  nativeUnaryRouteBody
);
nativeTransport(source, nativeStreamBody);
Promise.resolve(nativeTransport(source, nativeUnaryBody)).then((result) => {
  const exact: NativeTransportResultFor<typeof nativeUnaryBody> = result;
  if (!(exact instanceof Response) && !('body' in exact) && exact.ok) {
    exact.data.name.toUpperCase();
  }
});
nativeTransport(source, nativeBatchBody);
nativeTransport(source, nativeReadonlyBatchBody);
Promise.resolve(nativeTransport(source, nativeExactBatchBody)).then((result) => {
  const exact: NativeTransportResultFor<typeof nativeExactBatchBody> = result;
  if (!(exact instanceof Response) && !('body' in exact)) {
    const firstId: 'users.get' = exact[0].id;
    firstId.toUpperCase();
  }
});
Promise.resolve(nativeTransportHandler(source, nativeUnaryBody)).then((result) => {
  const exact: NativeTransportResultFor<typeof nativeUnaryBody> = result;
  if (!(exact instanceof Response) && !('body' in exact) && exact.ok) {
    exact.data.name.toUpperCase();
  }
});
if (!(nativeTransportResult instanceof Response) && !isNativeResultArray(nativeTransportResult) && !('body' in nativeTransportResult) && nativeTransportResult.ok) {
  nativeTransportResult.id.toUpperCase();
}
if (!(nativeBodyResultFor instanceof Response) && nativeBodyResultFor.ok) {
  nativeBodyResultFor.data.name.toUpperCase();
}
if (!(nativeRouteBodyResultFor instanceof Response) && nativeRouteBodyResultFor.ok) {
  nativeRouteBodyResultFor.data.name.toUpperCase();
}
if (!(nativeRouteUnaryBodyResultFor instanceof Response) && nativeRouteUnaryBodyResultFor.ok) {
  nativeRouteUnaryBodyResultFor.data.name.toUpperCase();
}
nativeRouteStreamBodyResultFor.headers.get('content-type');
if (!(nativeCompiledBodyResultFor instanceof Response) && nativeCompiledBodyResultFor.ok) {
  nativeCompiledBodyResultFor.data.name.toUpperCase();
}
if (!(nativeRouteUnaryCompiledBodyResultFor instanceof Response) && !('body' in nativeRouteUnaryCompiledBodyResultFor) && nativeRouteUnaryCompiledBodyResultFor.ok) {
  nativeRouteUnaryCompiledBodyResultFor.data.name.toUpperCase();
}
if (nativeRouteStreamCompiledBodyResultFor instanceof Response) {
  nativeRouteStreamCompiledBodyResultFor.headers.get('content-type');
}
if (nativeRouteResult.ok) {
  nativeRouteResult.data.name.toUpperCase();
}
if (nativeRouteResultUnion.ok) {
  nativeRouteResultUnion.data.name.toUpperCase();
}
if (nativeRouteUnaryResultUnion.ok) {
  nativeRouteUnaryResultUnion.data.name.toUpperCase();
}
if (!(nativeUnaryTransportResult instanceof Response) && !('body' in nativeUnaryTransportResult) && nativeUnaryTransportResult.ok) {
  nativeUnaryTransportResult.data.name.toUpperCase();
}
if (!(nativeRouteUnaryTransportResult instanceof Response) && !('body' in nativeRouteUnaryTransportResult) && nativeRouteUnaryTransportResult.ok) {
  nativeRouteUnaryTransportResult.data.name.toUpperCase();
}
if (nativeRouteStreamTransportResult instanceof Response) {
  nativeRouteStreamTransportResult.headers.get('content-type');
}
nativeRouteRequest.id.toUpperCase();

// @ts-expect-error generated clients reject unknown route leaves.
client.users.missing({ id: '1' });

// @ts-expect-error generated callable leaves validate input by route id.
client.users.get({ ok: true });

// @ts-expect-error generated callable leaves require route headers.
client.tenants.current({ ok: true });

// @ts-expect-error generated default route client args preserve route-specific required headers.
const missingDefaultRouteClientArgs: RouteClientArgs = [{ ok: true }];
missingDefaultRouteClientArgs[0].valueOf();

// @ts-expect-error generated default route requests preserve route-specific required headers.
const missingDefaultRouteRequestHeaders: RouteRequest = {
  id: 'tenants.current',
  input: { ok: true },
};
missingDefaultRouteRequestHeaders.id.toUpperCase();

// @ts-expect-error generated callable leaves validate required route headers.
client.tenants.current({ ok: true }, { headers: {} });

// @ts-expect-error generated transports reject unknown route ids.
generatedTransport.call('users.missing', { id: '1' });

// @ts-expect-error generated transports validate input by route id.
generatedTransport.call('users.get', { ok: true });

// @ts-expect-error generated transports require route headers.
generatedTransport.call('tenants.current', { ok: true });

// @ts-expect-error unary routes do not expose stream methods.
client.users.get.stream({ id: '550e8400-e29b-41d4-a716-446655440000' });

// @ts-expect-error stream routes do not expose unary request methods.
client.users.watch.request({ userId: '1' });

client.users.get.protocolRequest(
  // @ts-expect-error generated unary leaf protocol requests validate input by route id.
  { ok: true }
);

client.users.watch.protocolRequest(
  // @ts-expect-error generated stream leaf protocol requests validate input by route id.
  { id: '550e8400-e29b-41d4-a716-446655440000' }
);

const invalidProtocolRequest: RouteProtocolRequest<'users.get'> = {
  id: 'users.get',
  // @ts-expect-error generated route protocol requests validate input by id.
  input: { ok: true },
};
invalidProtocolRequest;

// @ts-expect-error generated default route protocol requests preserve id/input correlation.
const invalidDefaultProtocolRequest: RouteProtocolRequest = {
  id: 'users.get',
  input: { userId: '1' },
};
invalidDefaultProtocolRequest.id.toUpperCase();

const invalidProtocolBatch: RouteProtocolBatchRequest<
  // @ts-expect-error generated route protocol batches reject stream requests.
  readonly [typeof streamProtocolRequest]
> = [streamProtocolRequest];
invalidProtocolBatch;

// @ts-expect-error generated native transports reject unknown route ids.
nativeTransport(source, { id: 'users.missing', input: {} });

// @ts-expect-error generated native transports validate input by route id.
nativeTransport(source, { id: 'users.get', input: { ok: true } });

// @ts-expect-error streaming native route requests cannot be batched.
const invalidNativeBatch: NativeBatchBody = [nativeStreamBody];
invalidNativeBatch;
`
      );
      const tsconfigFile = join(outDir, 'tsconfig.generated-client.json');
      await writeFile(
        tsconfigFile,
        JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'ESNext',
              lib: ['ES2022', 'DOM', 'DOM.Iterable'],
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              strict: true,
              noImplicitAny: true,
              strictNullChecks: true,
              exactOptionalPropertyTypes: true,
              noUncheckedIndexedAccess: true,
              noPropertyAccessFromIndexSignature: true,
              skipLibCheck: true,
              verbatimModuleSyntax: true,
              isolatedModules: true,
              noEmit: true,
              types: ['node'],
              typeRoots: [join(repoRoot, 'node_modules/@types')],
              baseUrl: repoRoot,
              paths: {
                joor: ['./src/index.ts'],
                'joor/client': ['./src/rpc/client.ts'],
                'joor/config': ['./src/config.ts'],
                'joor/context': ['./src/context/index.ts'],
                'joor/manifest': ['./src/manifest.ts'],
                'joor/procedure': ['./src/procedure/index.ts'],
                'joor/schema': ['./src/schema/index.ts'],
                'joor/runtime/*': ['./src/runtime/*.ts'],
              },
            },
            include: [
              usageFile,
              join(outDir, 'client.ts'),
              join(outDir, 'dispatcher.safe.ts'),
              join(outDir, 'dispatcher.streaming.ts'),
              join(outDir, 'node.ts'),
              join(outDir, 'bun.ts'),
              join(outDir, 'deno.ts'),
              join(outDir, 'deno-dispatcher.safe.ts'),
            ],
          },
          null,
          2
        )
      );

      try {
        await execFileAsync(
          join(repoRoot, 'node_modules/.bin/tsc'),
          ['--project', tsconfigFile],
          {
            cwd: repoRoot,
            maxBuffer: 1024 * 1024 * 4,
          }
        );
      } catch (error) {
        const output = error as { stdout?: string; stderr?: string };
        throw new Error(
          [output.stdout, output.stderr].filter(Boolean).join('\n')
        );
      }
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  }, 10_000);
});
