import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { build } from '../src/compiler/build.js';
import { emitArtifacts } from '../src/compiler/emit.js';
import { loadProcedures } from '../src/compiler/load.js';

const fixture = new URL('./fixtures/basic-app/rpc', import.meta.url).pathname;
const fixtureConfig = new URL(
  './fixtures/basic-app/joor.config.ts',
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
      ).resolves.toContain('createCompiledRpcHandler');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('createCompiledRpcTransportBodyResultHandler');
      await expect(
        readFile(join(outDir, 'fetch.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.js'");
      await expect(
        readFile(join(outDir, 'node.ts'), 'utf8')
      ).resolves.toContain('readIncomingBody');
      await expect(readFile(join(outDir, 'bun.ts'), 'utf8')).resolves.toContain(
        'readJsonBody'
      );
      await expect(
        readFile(join(outDir, 'deno.ts'), 'utf8')
      ).resolves.toContain("from './dispatcher.ts'");
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('export const nativeTransport =');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('export const nativeResponseTransport =');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('export const nativeRuntime =');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('export const nativeUnaryDispatch =');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('const unaryDispatch: CompiledUnaryDispatch');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('switch (rpcRequest.id)');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('_validate_input');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('_serialize_success');
      await expect(
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('export const transport =');
      const dispatcher = await readFile(join(outDir, 'dispatcher.ts'), 'utf8');
      const postsListMatch = dispatcher.match(
        /const posts_list_execute: CompiledDispatch = async \([\s\S]*?const users_get_execute: CompiledDispatch = async \(/
      );
      expect(postsListMatch?.[0]).toBeDefined();
      expect(postsListMatch?.[0]).not.toContain('compiledAuthenticate');
      expect(postsListMatch?.[0]).not.toContain('compiledReadCache');
      expect(postsListMatch?.[0]).not.toContain('compiledWriteCache');
      expect(postsListMatch?.[0]).not.toContain('compiledRateLimitFailure');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('createClient');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('"admin-user": {');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('"get-profile": {');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('export type RouteRequest');
      await expect(
        readFile(join(outDir, 'client.ts'), 'utf8')
      ).resolves.toContain('RpcRouteEnvelope<Manifest');
      const clientSource = await readFile(join(outDir, 'client.ts'), 'utf8');
      const watchClientMatch = clientSource.match(
        /"watch": \{[\s\S]*?\n {4}\},/
      );
      expect(clientSource).toContain('export type UnaryRouteId');
      expect(clientSource).toContain('export type StreamRouteId');
      expect(clientSource).toContain('export type RouteResponseHeaders');
      expect(watchClientMatch?.[0]).toContain('stream:');
      expect(watchClientMatch?.[0]).not.toContain('call:');
      expect(watchClientMatch?.[0]).not.toContain('request:');
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
        join(outDir, 'dispatcher.ts'),
        'utf8'
      );
      expect(safeDispatcher).toContain('_validate_input');
      expect(safeDispatcher).toContain('_validate_headers');
      expect(safeDispatcher).toContain('_validate_output');
      expect(safeDispatcher).toContain('_response_success');
      expect(safeDispatcher).toContain("serialize === 'response'");
      expect(safeDispatcher).toContain('STREAM_REQUIRED');

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
          join(trustedOutDir, 'dispatcher.ts'),
          'utf8'
        );
        expect(trustedDispatcher).not.toContain('_validate_input');
        expect(trustedDispatcher).not.toContain('_validate_headers');
        expect(trustedDispatcher).not.toContain('_validate_output');
        expect(trustedDispatcher).not.toContain('compiledValidationDetails');
        expect(trustedDispatcher).toContain('result as JsonValue');
        expect(trustedDispatcher).toContain('_response_success');
        expect(trustedDispatcher).toContain("serialize === 'response'");
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
        readFile(join(outDir, 'dispatcher.ts'), 'utf8')
      ).resolves.toContain('joor.config.ts');
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });
});
