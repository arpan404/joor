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
      'tenants.current',
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
      ).resolves.toContain('export type NativeBodyHandler');
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
      ).resolves.not.toContain('Parameters<CompiledDispatch');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain(
        'CompiledRpcTransportBodyResultHandlerFor<NativeManifest>'
      );
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('CompiledRpcBodyResultHandlerFor<NativeManifest>');
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
      ).resolves.toContain('export type NativeRouteProtocolRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteProtocolRequestUnion');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeUnaryRouteBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeRouteUnaryBatchRequest');
      await expect(
        readFile(join(outDir, 'dispatcher.safe.ts'), 'utf8')
      ).resolves.toContain('export type NativeProtocolBatchRequest');
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
      const dispatcher = await readFile(
        join(outDir, 'dispatcher.safe.ts'),
        'utf8'
      );
      expect(dispatcher).toContain('headers?: Record<string, string>');
      expect(dispatcher).not.toContain('headers?: Record<string, JsonValue>');
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
      ).resolves.toContain('export type RouteBatchRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBody');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBodyResult');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteBodyResultFor');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RequiredServices');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteServices');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteProtocolBatchRequest');
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
      expect(clientSource).toContain("from 'joor/manifest'");
      expect(clientSource).toContain('export type UnaryRouteFunction');
      expect(clientSource).toContain('export type StreamRouteFunction');
      expect(clientSource).toContain('export type BatchFunction');
      expect(clientSource).toContain(
        'export type BatchFunction = <const TRequests extends RouteBatchRequest>'
      );
      expect(clientSource).toContain('export type GeneratedClient');
      expect(clientSource).toContain(
        'export const createTransport = (\n  options: GeneratedClientOptions = {}\n): TransportClient =>'
      );
      expect(clientSource).toContain('"get": UnaryRouteFunction<"users.get">');
      expect(clientSource).toContain(
        '"watch": StreamRouteFunction<"users.watch">'
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
      expect(clientSource).toContain('"get": unaryRoute("users.get")');
      expect(clientSource).toContain('"watch": streamRoute("users.watch")');
      expect(clientSource).toContain(
        '"current": unaryRoute("tenants.current")'
      );
      expect(clientSource).toContain(
        'call(...args: [id: TId, ...ClientArgs<TId>])'
      );
      expect(clientSource).toContain('Object.assign(call, { call, request })');
      expect(clientSource).not.toContain('ProcedureInput');
      expect(clientSource).toContain('export type RouteProcedure');
      expect(clientSource).toContain('export type UnaryRouteProcedure');
      expect(clientSource).toContain('export type StreamRouteProcedure');
      expect(clientSource).toContain('export type UnaryRouteInput');
      expect(clientSource).toContain('export type StreamRouteInput');
      expect(clientSource).toContain('export type UnaryRouteOutput');
      expect(clientSource).toContain('export type UnaryRouteResult');
      expect(clientSource).toContain('export type StreamRouteEvent');
      expect(clientSource).toContain('export type UnaryRouteId');
      expect(clientSource).toContain('export type StreamRouteId');
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
      expect(clientSource).toContain(
        'export type UnaryRouteProtocolRequestUnion'
      );
      expect(clientSource).toContain('export type StreamRouteProtocolRequest');
      expect(clientSource).toContain(
        'export type StreamRouteProtocolRequestUnion'
      );
      expect(clientSource).toContain('export type UnaryRouteRequestOptions');
      expect(clientSource).toContain('export type StreamRouteRequestOptions');
      expect(clientSource).toContain('export type RouteClientArgs');
      expect(clientSource).toContain('export type UnaryRouteClientArgs');
      expect(clientSource).toContain('export type StreamRouteClientArgs');
      expect(clientSource).toContain('export type RouteTransportClient');
      expect(clientSource).toContain('JoorManifestClientOptions<Manifest>');
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

  it('typechecks generated callable client route leaves', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'joor-'));
    try {
      await build({ entry: fixture, outDir });
      const usageFile = join(outDir, 'client-usage.ts');
      await writeFile(
        usageFile,
        `import { client, createClient, createTransport, type BatchFunction, type Client, type GeneratedClient, type GeneratedClientOptions, type RequiredServices, type RouteBatchRequest, type RouteBatchResults, type RouteUnaryBatchRequest, type RouteBody, type RouteBodyResult, type RouteBodyResultFor, type RouteClientArgs, type RouteClientHeaders, type RouteEnvelope, type RouteEnvelopeUnion, type RouteErrorCode, type RouteErrorDetails, type RouteHasHeaders, type RouteHasResponseHeaders, type RouteHeaders, type RouteInput, type RouteOutput, type RouteProcedure, type RouteProtocolBatchRequest, type RouteProtocolRequest, type RouteProtocolRequestUnion, type RouteRequestOptions, type RouteRequiresHeaders, type RouteRequiresResponseHeaders, type RouteRequestUnion, type RouteResponseHeaders, type RouteResult, type RouteResultUnion, type RouteServices, type RouteStreamClientArgs, type RouteStreamClientHeaders, type RouteStreamEvent, type RouteStreamHeaders, type RouteStreamInput, type RouteStreamProcedure, type RouteStreamProtocolRequest, type RouteStreamRequestOptions, type RouteTransportClient, type RouteUnaryClientArgs, type RouteUnaryClientHeaders, type RouteUnaryEnvelope, type RouteUnaryEnvelopeUnion, type RouteUnaryHeaders, type RouteUnaryInput, type RouteUnaryOutput, type RouteUnaryProcedure, type RouteUnaryProtocolRequest, type RouteUnaryRequest, type RouteUnaryRequestOptions, type RouteUnaryRequestUnion, type RouteUnaryResponseHeaders, type RouteUnaryResult, type RouteUnaryResultUnion, type StreamRouteClientArgs, type StreamRouteErrorCode, type StreamRouteErrorDetails, type StreamRouteEvent, type StreamRouteHasResponseHeaders, type StreamRouteInput, type StreamRouteProtocolRequest, type StreamRouteProtocolRequestUnion, type StreamRouteRequestOptions, type TransportClient, type UnaryRouteClientArgs, type UnaryRouteEnvelope, type UnaryRouteEnvelopeUnion, type UnaryRouteErrorCode, type UnaryRouteErrorDetails, type UnaryRouteHasHeaders, type UnaryRouteHasResponseHeaders, type UnaryRouteBatchRequest, type UnaryRouteInput, type UnaryRouteOutput, type UnaryRouteProtocolRequest, type UnaryRouteProtocolRequestUnion, type UnaryRouteRequest, type UnaryRouteRequestOptions, type UnaryRouteRequestUnion, type UnaryRouteRequiresHeaders, type UnaryRouteRequiresResponseHeaders, type UnaryRouteResponseHeaders, type UnaryRouteResult, type UnaryRouteResultUnion } from './client.js';
import { fetch as nativeFetch, nativeBody as nativeBodyValue, nativeResponseUnaryDispatch, nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBatchBody, type NativeBody, type NativeBodyHandler, type NativeBodyResult, type NativeBodyResultFor, type NativeCompiledBodyResult, type NativeCompiledBodyResultFor, type NativeCompiledTransportResult, type NativeDispatch, type NativeFetchHandler, type NativeProtocolBatchRequest, type NativeRouteUnaryBatchRequest, type NativeRequiredServices, type NativeRouteBatchRequest, type NativeUnaryRouteBatchRequest, type NativeRouteBody, type NativeRouteBodyResult, type NativeRouteBodyResultFor, type NativeRouteClientArgs, type NativeRouteClientHeaders, type NativeRouteEnvelope, type NativeRouteEnvelopeUnion, type NativeRouteErrorCode, type NativeRouteErrorDetails, type NativeRouteHasHeaders, type NativeRouteHasResponseHeaders, type NativeRouteHeaders, type NativeRouteInput, type NativeRouteOutput, type NativeRouteProcedure, type NativeRouteProtocolRequest, type NativeRouteProtocolRequestUnion, type NativeRouteRequest, type NativeRouteRequestOptions, type NativeRouteRequestUnion, type NativeRouteRequiresHeaders, type NativeRouteRequiresResponseHeaders, type NativeRouteResponseHeaders, type NativeRouteResult, type NativeRouteResultUnion, type NativeRouteUnaryEnvelopeUnion, type NativeRouteUnaryResultUnion, type NativeRouteServices, type NativeRouteStreamClientArgs, type NativeRouteStreamClientHeaders, type NativeRouteStreamEvent, type NativeRouteStreamHeaders, type NativeRouteStreamInput, type NativeRouteStreamProcedure, type NativeRouteStreamProtocolRequest, type NativeRouteStreamProtocolRequestUnion, type NativeRouteStreamRequestOptions, type NativeRouteUnaryClientArgs, type NativeRouteUnaryClientHeaders, type NativeRouteUnaryEnvelope, type NativeRouteUnaryHeaders, type NativeRouteUnaryInput, type NativeRouteUnaryOutput, type NativeRouteUnaryProcedure, type NativeRouteUnaryProtocolRequest, type NativeRouteUnaryProtocolRequestUnion, type NativeRouteUnaryRequestOptions, type NativeRouteUnaryResponseHeaders, type NativeRouteUnaryResult, type NativeRuntimeState, type NativeServices, type NativeStreamEvent, type NativeStreamProtocolRequest, type NativeStreamRouteClientArgs, type NativeStreamRouteClientHeaders, type NativeStreamRouteErrorCode, type NativeStreamRouteErrorDetails, type NativeStreamRouteEvent, type NativeStreamRouteHasResponseHeaders, type NativeStreamRouteHeaders, type NativeStreamRouteInput, type NativeStreamRouteProcedure, type NativeStreamRouteProtocolRequest, type NativeStreamRouteProtocolRequestUnion, type NativeStreamRouteRequest, type NativeStreamRouteRequestOptions, type NativeTransportHandler, type NativeTransportRequest, type NativeTransportResult, type NativeTransportResultFor, type NativeUnaryDispatch, type NativeUnaryProtocolRequest, type NativeUnaryRouteClientArgs, type NativeUnaryRouteClientHeaders, type NativeUnaryRouteEnvelope, type NativeUnaryRouteEnvelopeUnion, type NativeUnaryRouteErrorCode, type NativeUnaryRouteErrorDetails, type NativeUnaryRouteHasHeaders, type NativeUnaryRouteHasResponseHeaders, type NativeUnaryRouteHeaders, type NativeUnaryRouteInput, type NativeUnaryRouteOutput, type NativeUnaryRouteProcedure, type NativeUnaryRouteProtocolRequest, type NativeUnaryRouteProtocolRequestUnion, type NativeUnaryRouteRequest, type NativeUnaryRouteRequestOptions, type NativeUnaryRouteRequiresHeaders, type NativeUnaryRouteRequiresResponseHeaders, type NativeUnaryRouteResponseHeaders, type NativeUnaryRouteResult, type NativeUnaryRouteResultUnion } from './dispatcher.safe.js';
import { createFetch as createBunNativeFetch, fetch as bunNativeFetch, serve as serveBunNative, type BunNativeFetchHandler, type BunNativeServer } from './bun.js';
import { createFetch as createDenoNativeFetch, fetch as denoNativeFetch, serve as serveDenoNative, type DenoNativeFetchHandler, type DenoNativeServer } from './deno.js';
import { createHandler as createNodeNativeHandler, handler as nodeNativeHandler, listen as listenNodeNative, type NodeNativeHandler, type NodeNativeServer } from './node.js';
import { manifest } from './manifest.js';

const defaultClient = createClient();
const generatedClient: GeneratedClient = defaultClient;
const generatedClientAlias: Client = generatedClient;
generatedClientAlias.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' });
defaultClient.users.get({ id: '550e8400-e29b-41d4-a716-446655440000' });
const options: GeneratedClientOptions = { headers: { authorization: 'token' } };
createClient(options).users.watch({ userId: '1' });
const generatedTransport: TransportClient = createTransport(options);
const generatedRouteTransport: RouteTransportClient = generatedTransport;
generatedTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' }).then((result) => {
  if (result.ok) result.data.name.toUpperCase();
});
generatedRouteTransport.call('users.get', { id: '550e8400-e29b-41d4-a716-446655440000' });
generatedTransport.stream('users.watch', { userId: '1' });
const bunFetchHandler: BunNativeFetchHandler = createBunNativeFetch();
const bunDefaultFetchHandler: BunNativeFetchHandler = bunNativeFetch;
bunFetchHandler(new Request('https://example.com/rpc'));
bunDefaultFetchHandler(new Request('https://example.com/rpc'));
const bunServer: BunNativeServer = serveBunNative({ port: 3000 });
bunServer.stop?.();
bunServer.ref?.();
const denoFetchHandler: DenoNativeFetchHandler = createDenoNativeFetch();
const denoDefaultFetchHandler: DenoNativeFetchHandler = denoNativeFetch;
denoFetchHandler(new Request('https://example.com/rpc'));
denoDefaultFetchHandler(new Request('https://example.com/rpc'));
const denoServer: DenoNativeServer = serveDenoNative({ port: 3000 });
denoServer.shutdown();
denoServer.finished.then(() => undefined);
const nodeHandler: NodeNativeHandler = createNodeNativeHandler();
const nodeDefaultHandler: NodeNativeHandler = nodeNativeHandler;
nodeHandler;
nodeDefaultHandler;
const nodeServer: NodeNativeServer = listenNodeNative({ port: 3000 });
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
const routeServices: RouteServices<'users.get'> = requiredServices;
routeServices.users.findById('1')?.name.toUpperCase();
const routeInput: RouteInput<'users.get'> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
};
routeInput.id.toUpperCase();
const unaryRouteInput: UnaryRouteInput<'users.get'> = routeInput;
const routeUnaryInput: RouteUnaryInput<'users.get'> = unaryRouteInput;
routeUnaryInput.id.toUpperCase();
const streamRouteInput: StreamRouteInput<'users.watch'> = { userId: '1' };
const routeStreamInput: RouteStreamInput<'users.watch'> = streamRouteInput;
routeStreamInput.userId.toUpperCase();
const routeOutput: RouteOutput<'users.get'> = { id: '1', name: 'Ada' };
routeOutput.name.toUpperCase();
const unaryRouteOutput: UnaryRouteOutput<'users.get'> = routeOutput;
const routeUnaryOutput: RouteUnaryOutput<'users.get'> = unaryRouteOutput;
routeUnaryOutput.name.toUpperCase();
const routeResponseHeaders: RouteResponseHeaders<'users.get'> = {
  'cache-control': 'private',
};
const unaryRouteResponseHeaders: UnaryRouteResponseHeaders<'users.get'> =
  routeResponseHeaders;
const routeUnaryResponseHeaders: RouteUnaryResponseHeaders<'users.get'> =
  unaryRouteResponseHeaders;
routeUnaryResponseHeaders['cache-control'].toUpperCase();
const routeProcedure: RouteProcedure<'users.get'> = manifest.procedures['users.get'];
routeProcedure.output;
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
nativeUnary;
nativeResponseUnary;
const nativeDispatch: NativeDispatch = async () => ({
  ok: false,
  id: 'users.get',
  traceId: 'trace',
  error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
});
nativeDispatch;
const nativeFetchHandler: NativeFetchHandler = nativeFetch;
nativeFetchHandler(new Request('https://example.com/rpc'));
const nativeRequiredServices: NativeRequiredServices = requiredServices;
nativeRequiredServices.users.findById('1')?.name.toUpperCase();
const nativeRouteServices: NativeRouteServices<'users.get'> = requiredServices;
nativeRouteServices.users.findById('1')?.name.toUpperCase();
const nativeRouteInput: NativeRouteInput<'users.get'> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
};
nativeRouteInput.id.toUpperCase();
const nativeUnaryRouteInput: NativeUnaryRouteInput<'users.get'> =
  nativeRouteInput;
const nativeRouteUnaryInput: NativeRouteUnaryInput<'users.get'> =
  nativeUnaryRouteInput;
nativeRouteUnaryInput.id.toUpperCase();
const nativeStreamRouteInput: NativeStreamRouteInput<'users.watch'> = {
  userId: '1',
};
const nativeRouteStreamInput: NativeRouteStreamInput<'users.watch'> =
  nativeStreamRouteInput;
nativeRouteStreamInput.userId.toUpperCase();
const nativeRouteOutput: NativeRouteOutput<'users.get'> = {
  id: '1',
  name: 'Ada',
};
nativeRouteOutput.name.toUpperCase();
const nativeUnaryRouteOutput: NativeUnaryRouteOutput<'users.get'> =
  nativeRouteOutput;
const nativeRouteUnaryOutput: NativeRouteUnaryOutput<'users.get'> =
  nativeUnaryRouteOutput;
nativeRouteUnaryOutput.name.toUpperCase();
const nativeRouteProcedure: NativeRouteProcedure<'users.get'> = manifest.procedures['users.get'];
nativeRouteProcedure.output;
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
nativeRouteHasHeaders.valueOf();
const nativeUnaryRouteHasHeaders: NativeUnaryRouteHasHeaders<'tenants.current'> = true;
nativeUnaryRouteHasHeaders.valueOf();
const nativeRouteRequiresHeaders: NativeRouteRequiresHeaders<'tenants.current'> = true;
nativeRouteRequiresHeaders.valueOf();
const nativeUnaryRouteRequiresHeaders: NativeUnaryRouteRequiresHeaders<'tenants.current'> = true;
nativeUnaryRouteRequiresHeaders.valueOf();
const nativeRouteResponseHeaders: NativeRouteResponseHeaders<'users.get'> = {
  'cache-control': 'private',
};
nativeRouteResponseHeaders['cache-control'].toUpperCase();
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
nativeRouteErrorCode.toUpperCase();
const nativeUnaryRouteErrorCode: NativeUnaryRouteErrorCode<'users.get'> = 'NOT_FOUND';
nativeUnaryRouteErrorCode.toUpperCase();
const nativeStreamRouteErrorCode: NativeStreamRouteErrorCode<'users.watch'> = 'VALIDATION_ERROR';
nativeStreamRouteErrorCode.toUpperCase();
const nativeRouteErrorDetails: NativeRouteErrorDetails<'users.get', 'NOT_FOUND'> = {
  message: 'Missing',
};
nativeRouteErrorDetails.message.toUpperCase();
const nativeUnaryRouteErrorDetails: NativeUnaryRouteErrorDetails<'users.get', 'NOT_FOUND'> = nativeRouteErrorDetails;
nativeUnaryRouteErrorDetails.message.toUpperCase();
const nativeStreamRouteErrorDetails: NativeStreamRouteErrorDetails<'users.watch', 'VALIDATION_ERROR'> = { issue: 'input' };
nativeStreamRouteErrorDetails.valueOf();
const nativeRouteStreamEvent: NativeRouteStreamEvent<'users.watch'> = {
  type: 'user.updated',
  userId: '1',
};
nativeRouteStreamEvent.userId.toUpperCase();
const nativeStreamRouteEvent: NativeStreamRouteEvent<'users.watch'> =
  nativeRouteStreamEvent;
const nativeStreamEvent: NativeStreamEvent<'users.watch'> =
  nativeStreamRouteEvent;
nativeStreamEvent.userId.toUpperCase();

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
const unaryRouteRequest: UnaryRouteRequest<'users.get'> = request;
const routeUnaryRequest: RouteUnaryRequest<'users.get'> = unaryRouteRequest;
routeUnaryRequest.input.id.toUpperCase();
const unaryRouteRequestUnion: UnaryRouteRequestUnion = unaryRouteRequest;
const routeUnaryRequestUnion: RouteUnaryRequestUnion = unaryRouteRequestUnion;
routeUnaryRequestUnion.id.toUpperCase();
const batchFunction: BatchFunction = client.batch;
const routeBatchRequest: RouteBatchRequest<readonly [typeof request]> = [request] as const;
routeBatchRequest[0].input.id.toUpperCase();
const unaryRouteBatchRequest: UnaryRouteBatchRequest<readonly [typeof request]> = [request] as const;
const routeUnaryBatchRequest: RouteUnaryBatchRequest<readonly [typeof request]> = unaryRouteBatchRequest;
routeUnaryBatchRequest[0].input.id.toUpperCase();
const defaultRouteBatchRequest: RouteBatchRequest = [request] as const;
defaultRouteBatchRequest.length.toFixed();
const tenantHeaders: RouteHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
tenantHeaders['x-tenant-id'].toUpperCase();
const tenantUnaryHeaders: RouteUnaryHeaders<'tenants.current'> = tenantHeaders;
const tenantUnaryHeadersAlias: RouteUnaryHeaders<'tenants.current'> =
  tenantUnaryHeaders;
tenantUnaryHeadersAlias['x-tenant-id'].toUpperCase();
const watchStreamHeaders: RouteStreamHeaders<'users.watch'> = {};
watchStreamHeaders.valueOf();
const userClientHeaders: RouteClientHeaders<'users.get'> = { authorization: undefined };
userClientHeaders.authorization?.toUpperCase();
const tenantClientHeaders: RouteClientHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
tenantClientHeaders['x-tenant-id'].toUpperCase();
const tenantUnaryClientHeaders: RouteUnaryClientHeaders<'tenants.current'> = tenantClientHeaders;
tenantUnaryClientHeaders['x-tenant-id'].toUpperCase();
const watchStreamClientHeaders: RouteStreamClientHeaders<'users.watch'> = {};
watchStreamClientHeaders.valueOf();
const tenantRequestOptions: RouteRequestOptions<'tenants.current'> = { headers: tenantHeaders };
tenantRequestOptions.headers['x-tenant-id'].toUpperCase();
const tenantUnaryRequestOptions: UnaryRouteRequestOptions<'tenants.current'> = tenantRequestOptions;
const tenantRouteUnaryRequestOptions: RouteUnaryRequestOptions<'tenants.current'> = tenantUnaryRequestOptions;
tenantRouteUnaryRequestOptions.headers['x-tenant-id'].toUpperCase();
const watchStreamRequestOptions: StreamRouteRequestOptions<'users.watch'> = {};
const watchRouteStreamRequestOptions: RouteStreamRequestOptions<'users.watch'> = watchStreamRequestOptions;
watchRouteStreamRequestOptions.valueOf();
const tenantRouteClientArgs: RouteClientArgs<'tenants.current'> = [
  { ok: true },
  tenantRequestOptions,
];
tenantRouteClientArgs[0].ok.valueOf();
const tenantUnaryClientArgs: UnaryRouteClientArgs<'tenants.current'> = tenantRouteClientArgs;
const tenantRouteUnaryClientArgs: RouteUnaryClientArgs<'tenants.current'> = tenantUnaryClientArgs;
tenantRouteUnaryClientArgs[0].ok.valueOf();
const watchStreamClientArgs: StreamRouteClientArgs<'users.watch'> = [
  { userId: '1' },
  watchStreamRequestOptions,
];
const watchRouteStreamClientArgs: RouteStreamClientArgs<'users.watch'> = watchStreamClientArgs;
watchRouteStreamClientArgs[0].userId.toUpperCase();
const nativeRouteHeaders: NativeRouteHeaders<'tenants.current'> = tenantHeaders;
nativeRouteHeaders['x-tenant-id'].toUpperCase();
const nativeTenantUnaryHeaders: NativeUnaryRouteHeaders<'tenants.current'> = nativeRouteHeaders;
const nativeTenantRouteUnaryHeaders: NativeRouteUnaryHeaders<'tenants.current'> = nativeTenantUnaryHeaders;
nativeTenantRouteUnaryHeaders['x-tenant-id'].toUpperCase();
const nativeWatchStreamHeaders: NativeStreamRouteHeaders<'users.watch'> = {};
const nativeWatchRouteStreamHeaders: NativeRouteStreamHeaders<'users.watch'> = nativeWatchStreamHeaders;
nativeWatchRouteStreamHeaders.valueOf();
const nativeUserClientHeaders: NativeRouteClientHeaders<'users.get'> = { authorization: undefined };
nativeUserClientHeaders.authorization?.toUpperCase();
const nativeTenantClientHeaders: NativeRouteClientHeaders<'tenants.current'> = { 'x-tenant-id': 'tenant-1' };
nativeTenantClientHeaders['x-tenant-id'].toUpperCase();
const nativeTenantUnaryClientHeaders: NativeUnaryRouteClientHeaders<'tenants.current'> = nativeTenantClientHeaders;
const nativeTenantRouteUnaryClientHeaders: NativeRouteUnaryClientHeaders<'tenants.current'> = nativeTenantUnaryClientHeaders;
nativeTenantRouteUnaryClientHeaders['x-tenant-id'].toUpperCase();
const nativeWatchStreamClientHeaders: NativeStreamRouteClientHeaders<'users.watch'> = {};
const nativeWatchRouteStreamClientHeaders: NativeRouteStreamClientHeaders<'users.watch'> = nativeWatchStreamClientHeaders;
nativeWatchRouteStreamClientHeaders.valueOf();
const nativeTenantRequestOptions: NativeRouteRequestOptions<'tenants.current'> = { headers: nativeTenantClientHeaders };
nativeTenantRequestOptions.headers['x-tenant-id'].toUpperCase();
const nativeTenantUnaryRequestOptions: NativeUnaryRouteRequestOptions<'tenants.current'> = nativeTenantRequestOptions;
const nativeTenantRouteUnaryRequestOptions: NativeRouteUnaryRequestOptions<'tenants.current'> = nativeTenantUnaryRequestOptions;
nativeTenantRouteUnaryRequestOptions.headers['x-tenant-id'].toUpperCase();
const nativeWatchStreamRequestOptions: NativeStreamRouteRequestOptions<'users.watch'> = {};
const nativeWatchRouteStreamRequestOptions: NativeRouteStreamRequestOptions<'users.watch'> = nativeWatchStreamRequestOptions;
nativeWatchRouteStreamRequestOptions.valueOf();
const nativeTenantClientArgs: NativeRouteClientArgs<'tenants.current'> = [
  { ok: true },
  nativeTenantRequestOptions,
];
nativeTenantClientArgs[0].ok.valueOf();
const nativeTenantUnaryClientArgs: NativeUnaryRouteClientArgs<'tenants.current'> = nativeTenantClientArgs;
const nativeTenantRouteUnaryClientArgs: NativeRouteUnaryClientArgs<'tenants.current'> = nativeTenantUnaryClientArgs;
nativeTenantRouteUnaryClientArgs[0].ok.valueOf();
const nativeWatchStreamClientArgs: NativeStreamRouteClientArgs<'users.watch'> = [
  { userId: '1' },
  nativeWatchStreamRequestOptions,
];
const nativeWatchRouteStreamClientArgs: NativeRouteStreamClientArgs<'users.watch'> = nativeWatchStreamClientArgs;
nativeWatchRouteStreamClientArgs[0].userId.toUpperCase();
const nativeUserClientArgs: NativeRouteClientArgs<'users.get'> = [
  { id: '550e8400-e29b-41d4-a716-446655440000' },
];
nativeUserClientArgs[0].id.toUpperCase();
const usersGetHasHeaders: RouteHasHeaders<'users.get'> = true;
usersGetHasHeaders.valueOf();
const usersGetUnaryHasHeaders: UnaryRouteHasHeaders<'users.get'> = true;
usersGetUnaryHasHeaders.valueOf();
const usersGetRequiresHeaders: RouteRequiresHeaders<'users.get'> = false;
usersGetRequiresHeaders.valueOf();
const usersGetUnaryRequiresHeaders: UnaryRouteRequiresHeaders<'users.get'> = false;
usersGetUnaryRequiresHeaders.valueOf();
const tenantsCurrentHasHeaders: RouteHasHeaders<'tenants.current'> = true;
tenantsCurrentHasHeaders.valueOf();
const tenantsCurrentRequiresHeaders: RouteRequiresHeaders<'tenants.current'> = true;
tenantsCurrentRequiresHeaders.valueOf();
const usersGetHasResponseHeaders: RouteHasResponseHeaders<'users.get'> = true;
usersGetHasResponseHeaders.valueOf();
const usersGetUnaryHasResponseHeaders: UnaryRouteHasResponseHeaders<'users.get'> = true;
usersGetUnaryHasResponseHeaders.valueOf();
const usersGetRequiresResponseHeaders: RouteRequiresResponseHeaders<'users.get'> = true;
usersGetRequiresResponseHeaders.valueOf();
const usersGetUnaryRequiresResponseHeaders: UnaryRouteRequiresResponseHeaders<'users.get'> = true;
usersGetUnaryRequiresResponseHeaders.valueOf();
const usersWatchHasResponseHeaders: RouteHasResponseHeaders<'users.watch'> = false;
usersWatchHasResponseHeaders.valueOf();
const usersWatchStreamHasResponseHeaders: StreamRouteHasResponseHeaders<'users.watch'> = false;
usersWatchStreamHasResponseHeaders.valueOf();
const usersGetErrorCode: RouteErrorCode<'users.get'> = 'NOT_FOUND';
usersGetErrorCode.toUpperCase();
const usersGetUnaryErrorCode: UnaryRouteErrorCode<'users.get'> = 'NOT_FOUND';
usersGetUnaryErrorCode.toUpperCase();
const usersWatchStreamErrorCode: StreamRouteErrorCode<'users.watch'> = 'VALIDATION_ERROR';
usersWatchStreamErrorCode.toUpperCase();
const usersGetErrorDetails: RouteErrorDetails<'users.get', 'NOT_FOUND'> = {
  message: 'Missing',
};
usersGetErrorDetails.message.toUpperCase();
const usersGetUnaryErrorDetails: UnaryRouteErrorDetails<'users.get', 'NOT_FOUND'> = usersGetErrorDetails;
usersGetUnaryErrorDetails.message.toUpperCase();
const usersWatchStreamErrorDetails: StreamRouteErrorDetails<'users.watch', 'VALIDATION_ERROR'> = { issue: 'input' };
usersWatchStreamErrorDetails.valueOf();
const routeStreamEvent: RouteStreamEvent<'users.watch'> = {
  type: 'user.updated',
  userId: '1',
};
routeStreamEvent.userId.toUpperCase();
const streamRouteEvent: StreamRouteEvent<'users.watch'> = routeStreamEvent;
streamRouteEvent.userId.toUpperCase();
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
const _extraProtocolRequest: RouteProtocolRequest<'users.get'> = {
  id: 'users.get',
  input: { id: '550e8400-e29b-41d4-a716-446655440000' },
  // @ts-expect-error generated protocol request types reject unknown envelope fields.
  extra: true,
};
_extraProtocolRequest.id.toUpperCase();
const protocolRequestUnion: RouteProtocolRequestUnion = protocolRequest;
const unaryProtocolRequest: RouteUnaryProtocolRequest<'users.get'> = protocolRequest;
const unaryRouteProtocolRequest: UnaryRouteProtocolRequest<'users.get'> =
  unaryProtocolRequest;
unaryRouteProtocolRequest.input.id.toUpperCase();
const unaryRouteProtocolRequestUnion: UnaryRouteProtocolRequestUnion =
  unaryRouteProtocolRequest;
unaryRouteProtocolRequestUnion.id.toUpperCase();
const streamProtocolRequest: RouteStreamProtocolRequest<'users.watch'> = {
  id: 'users.watch',
  input: { userId: '1' },
};
const streamRouteProtocolRequest: StreamRouteProtocolRequest<'users.watch'> =
  streamProtocolRequest;
streamRouteProtocolRequest.input.userId.toUpperCase();
const streamRouteProtocolRequestUnion: StreamRouteProtocolRequestUnion =
  streamRouteProtocolRequest;
streamRouteProtocolRequestUnion.input.userId.toUpperCase();
const routeBody: RouteBody = streamProtocolRequest;
const routeBodyResult: RouteBodyResult = {
  ok: true,
  id: 'users.get',
  traceId: 'trace-1',
  data: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Ada' },
  headers: { 'cache-control': 'private' },
};
const routeBodyResultFor: RouteBodyResultFor<typeof protocolRequest> = routeBodyResult;
const routeEnvelope: RouteEnvelope<'users.get'> = routeBodyResult;
const unaryRouteEnvelope: UnaryRouteEnvelope<'users.get'> = routeEnvelope;
const routeUnaryEnvelope: RouteUnaryEnvelope<'users.get'> = unaryRouteEnvelope;
routeEnvelope.id.toUpperCase();
routeUnaryEnvelope.id.toUpperCase();
const routeEnvelopeUnion: RouteEnvelopeUnion = routeBodyResult;
const unaryRouteEnvelopeUnion: UnaryRouteEnvelopeUnion = routeEnvelopeUnion;
const routeUnaryEnvelopeUnion: RouteUnaryEnvelopeUnion =
  unaryRouteEnvelopeUnion;
const routeResultUnion: RouteResultUnion = routeEnvelopeUnion;
const unaryRouteResultUnion: UnaryRouteResultUnion = routeResultUnion;
const routeUnaryResultUnion: RouteUnaryResultUnion = unaryRouteResultUnion;
const unaryRouteResult: UnaryRouteResult<'users.get'> = routeEnvelope;
const routeUnaryResult: RouteUnaryResult<'users.get'> = unaryRouteResult;
routeUnaryResult.id.toUpperCase();
const protocolBatch: RouteProtocolBatchRequest<readonly [typeof unaryProtocolRequest]> = [
  unaryProtocolRequest,
];
const readonlyRouteBody: RouteBody = protocolBatch;
protocolRequestUnion.id.toUpperCase();
routeBody.id.toUpperCase();
readonlyRouteBody.length.toFixed();
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
configured.batch([request] as const).then((results) => {
  const exact: RouteBatchResults<readonly [typeof request]> = results;
  const firstId: 'users.get' = exact[0].id;
  firstId.toUpperCase();
  if (exact[0].ok) exact[0].data.name.toUpperCase();
});
batchFunction([request] as const).then((results) => {
  const exact: RouteBatchResults<readonly [typeof request]> = results;
  if (exact[0].ok) exact[0].data.name.toUpperCase();
});
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
const nativeUnaryBody: NativeRouteRequest<'users.get'> = {
  id: 'users.get',
  input: { id: '550e8400-e29b-41d4-a716-446655440000' },
};
const nativeUnaryProtocolBody: NativeRouteProtocolRequest<'users.get'> =
  nativeUnaryBody;
nativeUnaryProtocolBody.input.id.toUpperCase();
const nativeUnaryRequestUnion: NativeUnaryProtocolRequest = nativeUnaryBody;
const nativeRouteProtocolRequestUnion: NativeRouteProtocolRequestUnion =
  nativeUnaryProtocolBody;
nativeRouteProtocolRequestUnion.id.toUpperCase();
const nativeUnaryRouteProtocolRequest: NativeUnaryRouteProtocolRequest<'users.get'> =
  nativeUnaryProtocolBody;
nativeUnaryRouteProtocolRequest.input.id.toUpperCase();
const nativeRouteUnaryProtocolRequest: NativeRouteUnaryProtocolRequest<'users.get'> =
  nativeUnaryRouteProtocolRequest;
nativeRouteUnaryProtocolRequest.input.id.toUpperCase();
const nativeUnaryRouteProtocolRequestUnion: NativeUnaryRouteProtocolRequestUnion =
  nativeUnaryRouteProtocolRequest;
nativeUnaryRouteProtocolRequestUnion.id.toUpperCase();
const nativeRouteUnaryProtocolRequestUnion: NativeRouteUnaryProtocolRequestUnion =
  nativeRouteUnaryProtocolRequest;
nativeRouteUnaryProtocolRequestUnion.id.toUpperCase();
const nativeUnaryRouteRequest: NativeUnaryRouteRequest = nativeUnaryRequestUnion;
const nativeRouteRequestUnion: NativeRouteRequestUnion = nativeUnaryRequestUnion;
const nativeStreamBody: NativeStreamProtocolRequest = {
  id: 'users.watch',
  input: { userId: '1' },
};
const nativeStreamRouteProtocolRequest: NativeStreamRouteProtocolRequest<'users.watch'> =
  nativeStreamBody;
nativeStreamRouteProtocolRequest.input.userId.toUpperCase();
const nativeRouteStreamProtocolRequest: NativeRouteStreamProtocolRequest<'users.watch'> =
  nativeStreamRouteProtocolRequest;
nativeRouteStreamProtocolRequest.input.userId.toUpperCase();
const nativeStreamRouteProtocolRequestUnion: NativeStreamRouteProtocolRequestUnion =
  nativeStreamRouteProtocolRequest;
nativeStreamRouteProtocolRequestUnion.input.userId.toUpperCase();
const nativeRouteStreamProtocolRequestUnion: NativeRouteStreamProtocolRequestUnion =
  nativeRouteStreamProtocolRequest;
nativeRouteStreamProtocolRequestUnion.input.userId.toUpperCase();
const nativeStreamRouteRequest: NativeStreamRouteRequest = nativeStreamBody;
const nativeRouteBody: NativeRouteBody = nativeUnaryBody;
const nativeBody: NativeBody = nativeUnaryBody;
const nativeRouteBodyResult: NativeRouteBodyResult = routeBodyResult;
const nativeBodyResult: NativeBodyResult = routeBodyResult;
const nativeRouteBodyResultFor: NativeRouteBodyResultFor<typeof nativeUnaryBody> = nativeRouteBodyResult;
const nativeBodyResultFor: NativeBodyResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const nativeCompiledBodyResult: NativeCompiledBodyResult = nativeBodyResult;
const nativeCompiledBodyResultFor: NativeCompiledBodyResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const nativeCompiledTransportResult: NativeCompiledTransportResult = nativeCompiledBodyResult;
const nativeRouteEnvelope: NativeRouteEnvelope<'users.get'> = nativeBodyResult;
nativeRouteEnvelope.id.toUpperCase();
const nativeRouteEnvelopeUnion: NativeRouteEnvelopeUnion = nativeRouteEnvelope;
const nativeUnaryRouteEnvelope: NativeUnaryRouteEnvelope<'users.get'> =
  nativeRouteEnvelope;
const nativeUnaryRouteEnvelopeUnion: NativeUnaryRouteEnvelopeUnion =
  nativeRouteEnvelopeUnion;
const nativeRouteUnaryEnvelope: NativeRouteUnaryEnvelope<'users.get'> =
  nativeUnaryRouteEnvelope;
const nativeRouteUnaryEnvelopeUnion: NativeRouteUnaryEnvelopeUnion =
  nativeUnaryRouteEnvelopeUnion;
nativeRouteUnaryEnvelope.id.toUpperCase();
nativeRouteUnaryEnvelopeUnion.id.toUpperCase();
const nativeRouteResult: NativeRouteResult<'users.get'> = nativeBodyResult;
const nativeUnaryRouteResult: NativeUnaryRouteResult<'users.get'> =
  nativeRouteResult;
const nativeRouteUnaryResult: NativeRouteUnaryResult<'users.get'> =
  nativeUnaryRouteResult;
nativeRouteUnaryResult.id.toUpperCase();
const nativeRouteResultUnion: NativeRouteResultUnion = nativeBodyResult;
const nativeUnaryRouteResultUnion: NativeUnaryRouteResultUnion =
  nativeRouteResultUnion;
const nativeRouteUnaryResultUnion: NativeRouteUnaryResultUnion =
  nativeUnaryRouteResultUnion;
const nativeTransportResult: NativeTransportResult = nativeCompiledTransportResult;
const nativeUnaryTransportResult: NativeTransportResultFor<typeof nativeUnaryBody> = nativeBodyResult;
const isNativeResultArray = (
  result: NativeTransportResult
): result is Extract<NativeTransportResult, readonly unknown[]> => Array.isArray(result);
const nativeRouteRequest: NativeRouteRequest<'users.get'> = nativeUnaryBody;
const nativeBatchBody: NativeBatchBody = [nativeUnaryBody];
const nativeReadonlyBatchBody: NativeBatchBody = [nativeUnaryBody] as const;
const nativeExactBatchBody = [nativeUnaryBody] as const;
const nativeRouteBatchRequest: NativeRouteBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
const nativeUnaryRouteBatchRequest: NativeUnaryRouteBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
const nativeRouteUnaryBatchRequest: NativeRouteUnaryBatchRequest<readonly [typeof nativeUnaryBody]> = nativeUnaryRouteBatchRequest;
const nativeProtocolBatchRequest: NativeProtocolBatchRequest<readonly [typeof nativeUnaryBody]> = nativeExactBatchBody;
nativeRouteBatchRequest[0].input.id.toUpperCase();
nativeRouteUnaryBatchRequest[0].input.id.toUpperCase();
nativeProtocolBatchRequest[0].input.id.toUpperCase();
nativeUnaryRequestUnion.id.toUpperCase();
nativeUnaryRouteRequest.id.toUpperCase();
nativeRouteRequestUnion.id.toUpperCase();
nativeStreamRouteRequest.input.userId.toUpperCase();
nativeRouteBody.id.toUpperCase();
nativeTransport(source, nativeBody);
nativeTransportHandler(source, nativeBody);
nativeBodyHandler(new Request('https://example.com/rpc'), nativeUnaryBody);
nativeTransport(source, nativeStreamBody);
nativeTransport(source, nativeUnaryBody).then((result) => {
  const exact: NativeTransportResultFor<typeof nativeUnaryBody> = result;
  if (!(exact instanceof Response) && !('body' in exact) && exact.ok) {
    exact.data.name.toUpperCase();
  }
});
nativeTransport(source, nativeBatchBody);
nativeTransport(source, nativeReadonlyBatchBody);
nativeTransport(source, nativeExactBatchBody).then((result) => {
  const exact: NativeTransportResultFor<typeof nativeExactBatchBody> = result;
  if (!(exact instanceof Response) && !('body' in exact)) {
    const firstId: 'users.get' = exact[0].id;
    firstId.toUpperCase();
  }
});
nativeTransportHandler(source, nativeUnaryBody).then((result) => {
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
if (!(nativeCompiledBodyResultFor instanceof Response) && nativeCompiledBodyResultFor.ok) {
  nativeCompiledBodyResultFor.data.name.toUpperCase();
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
nativeRouteRequest.id.toUpperCase();

// @ts-expect-error generated clients reject unknown route leaves.
client.users.missing({ id: '1' });

// @ts-expect-error generated callable leaves validate input by route id.
client.users.get({ ok: true });

// @ts-expect-error generated callable leaves require route headers.
client.tenants.current({ ok: true });

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

const invalidProtocolRequest: RouteProtocolRequest<'users.get'> = {
  id: 'users.get',
  // @ts-expect-error generated route protocol requests validate input by id.
  input: { ok: true },
};
invalidProtocolRequest;

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
  });
});
