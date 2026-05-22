import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';
import { emitArtifacts } from '../src/compiler/emit.js';
import { loadProcedures } from '../src/compiler/load.js';

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

describe('compiler', () => {
  it('loads procedure files and derives ids', async () => {
    const manifest = await loadProcedures(fixture);

    expect(manifest.procedures.map((entry) => entry.id)).toEqual([
      'admin-user.get-profile',
      'posts.list',
      'users.get',
      'users.watch',
    ]);
  });

  it('emits artifacts', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ entry: fixture, outDir });
      await expect(
        readFile(join(outDir, 'manifest.ts'), 'utf8')
      ).resolves.toContain('users.get');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.safe.ts'");
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('createCompiledRpcHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('createCompiledRpcTransportBodyResultHandler');
      await expect(
        readFile(join(outDir, 'fetch.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.safe.js'");
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.toContain('readIncomingBody');
      await expect(readFile(join(outDir, 'bun.ts'), 'utf8')).resolves.toContain(
        'readJsonBody'
      );
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
      ).resolves.toContain('export const nativeTransport =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const nativeResponseTransport =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const nativeRuntime =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export const nativeUnaryDispatch =');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'const serializedUnaryDispatch: CompiledFixedUnaryDispatch'
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
      ).resolves.toContain('export const transport =');
      const dispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );
      const postsListMatch = dispatcher.match(
        /const posts_list_execute_serialized: CompiledFixedDispatch = async \([\s\S]*?const users_get_execute_serialized: CompiledFixedDispatch = async \(/
      );
      expect(postsListMatch?.[0]).toBeDefined();
      expect(postsListMatch?.[0]).not.toContain('compiledAuthenticate');
      expect(postsListMatch?.[0]).not.toContain('compiledReadCache');
      expect(postsListMatch?.[0]).not.toContain('compiledWriteCache');
      expect(postsListMatch?.[0]).not.toContain('compiledRateLimitFailure');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('const dispatchSerialized: CompiledDispatch');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('createClient');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('"admin-user": {');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain(
        '"get-profile": unaryRoute("admin-user.get-profile")'
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
      ).resolves.toContain('JoorManifestRouteEnvelope<Manifest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('createManifestClient');
      const clientSource = await readFile(join(outDir, 'client.ts'), 'utf8');
      expect(clientSource).toContain('export type UnaryRouteFunction');
      expect(clientSource).toContain('export type StreamRouteFunction');
      expect(clientSource).toContain('"get": unaryRoute("users.get")');
      expect(clientSource).toContain('"watch": streamRoute("users.watch")');
      expect(clientSource).toContain('Object.assign(call, { call, request })');
      expect(clientSource).not.toContain('ProcedureInput');
      expect(clientSource).toContain('export type UnaryRouteId');
      expect(clientSource).toContain('export type StreamRouteId');
      expect(clientSource).toContain('export type RouteResponseHeaders');
      expect(clientSource).toContain('export type RouteError');
      await expect(
        readFile(join(outDir, 'procedure.ts'), 'utf8')
      ).resolves.toContain('defineProcedure.withContext');
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
      expect(clientSource).toContain('export const client = createClient()');
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

  it('typechecks generated callable client route leaves', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ entry: fixture, outDir });
      const usageFile = join(outDir, 'client-usage.ts');
      await writeFile(
        usageFile,
        `import { client, createClient, type GeneratedClientOptions, type RouteBatchResults, type RouteRequestUnion, type RouteResult } from './client.js';

const defaultClient = createClient();
defaultClient.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' });
const options: GeneratedClientOptions = { headers: { authorization: 'token' } };
createClient(options).users.watch({ userId: '1' });

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
const requestId: 'users.get' = request.id;
requestId.toUpperCase();
const requestUnion: RouteRequestUnion = request;
requestUnion.id.toUpperCase();

const configured = createClient({ url: '/rpc' });
configured['admin-user']['get-profile']({ id: '1' }).then((result) => {
  if (result.ok) result.data.name.toUpperCase();
});
configured.posts.list({ userId: '1' }).then((result) => {
  if (result.ok) result.data[0]?.title.toUpperCase();
});
configured.batch([request] as const).then((results) => {
  const exact: RouteBatchResults<readonly [typeof request]> = results;
  const firstId: 'users.get' = exact[0].id;
  firstId.toUpperCase();
  if (exact[0].ok) exact[0].data.name.toUpperCase();
});

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

// @ts-expect-error generated clients reject unknown route leaves.
client.users.missing({ id: '1' });

// @ts-expect-error generated callable leaves validate input by route id.
client.users.get({ ok: true });

// @ts-expect-error unary routes do not expose stream methods.
client.users.get.stream({ id: '550e8400-e29b-41d4-a716-446655440000' });

// @ts-expect-error stream routes do not expose unary request methods.
client.users.watch.request({ userId: '1' });
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
                'joor/runtime/*': ['./src/runtime/*.ts'],
              },
            },
            include: [usageFile, join(outDir, 'client.ts')],
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
  });
});
