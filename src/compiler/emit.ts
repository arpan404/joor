import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative } from 'node:path';
import type { JoorConfig } from '../config.js';
import { createAiDocs } from './ai-docs.js';
import {
  type CompiledProcedureGenerationOptions,
  type CompiledProcedureMode,
  emitCompiledProcedureSource,
} from './codegen.js';
import type { CompilerManifest } from './manifest.js';
import { createOpenApiDocument } from './openapi.js';

export interface EmitOptions {
  outDir: string;
  config?: JoorConfig;
  configPath?: string;
}

const toImportPath = (fromFile: string, targetFile: string): string => {
  const rel = relative(dirname(fromFile), targetFile).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
};

const writeJson = async (path: string, value: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
};

const emitManifest = async (
  manifest: CompilerManifest,
  outDir: string
): Promise<void> => {
  const manifestFile = `${outDir}/manifest.ts`;
  const imports = manifest.procedures
    .map((entry) => {
      const importPath = toImportPath(manifestFile, entry.importPath);
      return `import ${entry.exportName} from '${importPath}';`;
    })
    .join('\n');
  const entries = manifest.procedures
    .map(
      (entry) =>
        `    ${JSON.stringify(entry.id)}: { ...${entry.exportName}, id: ${JSON.stringify(entry.id)} },`
    )
    .join('\n');
  const source = `${imports}

export const manifest = {
  procedures: {
${entries}
  },
} as const;
`;
  await writeFile(manifestFile, source);
};

const emitProfileDispatcher = async (
  manifest: CompilerManifest,
  _outDir: string,
  _config: JoorConfig | undefined,
  configPath: string | undefined,
  profileFile: string,
  profileOptions: CompiledProcedureGenerationOptions,
  modes: readonly CompiledProcedureMode[]
): Promise<void> => {
  const dispatcherFile = profileFile;
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(dispatcherFile, configPath)}';\n`;
  const configValue = configPath === undefined ? '{}' : 'config';
  const generationOptions: CompiledProcedureGenerationOptions = {
    ...profileOptions,
    dispatchServicesType: 'NativeServices',
    includeDispatchWrapper: false,
    modes,
  };
  const imports = manifest.procedures
    .map((entry) => {
      const importPath = toImportPath(dispatcherFile, entry.importPath);
      return `import ${entry.exportName} from '${importPath}';`;
    })
    .join('\n');
  const compiledEntries = manifest.procedures.filter(
    (entry) => entry.procedure.output !== undefined
  );
  const hasCompiledProcedures = compiledEntries.length > 0;
  const hasGenericFallback = manifest.procedures.some(
    (entry) => entry.procedure.output === undefined
  );
  const usesAuth = compiledEntries.some(
    (entry) => entry.procedure.auth !== undefined
  );
  const usesCache = compiledEntries.some(
    (entry) =>
      entry.procedure.meta.kind === 'query' &&
      entry.procedure.meta.cache !== undefined
  );
  const usesRateLimit =
    generationOptions.enforceRateLimit &&
    compiledEntries.some(
      (entry) => entry.procedure.meta.rateLimit !== undefined
    );
  const usesValidationDetails = compiledEntries.some(
    (entry) =>
      generationOptions.validateInput ||
      generationOptions.validateOutput ||
      (generationOptions.validateHeaders &&
        entry.procedure.headers !== undefined) ||
      (generationOptions.validateResponseHeaders &&
        entry.procedure.responseHeaders !== undefined)
  );
  const compiledImports = [
    'compiledNotFound',
    ...(usesAuth
      ? ['compiledAuthenticate', 'compiledAuthenticateUncached']
      : []),
    ...(hasCompiledProcedures
      ? [
          'compiledCreateContext',
          'compiledCreateJsonHeaderRecord',
          'compiledEmptyObject',
          'compiledHasInvalidHeaderValue',
          'compiledJsonOkResponseInit',
          'compiledTraceId',
        ]
      : []),
    'createCompiledRuntimeState',
    'createCompiledRpcBodyResultHandler',
    'createCompiledRpcHandler',
    'createCompiledRpcTransportBodyResultHandler',
    ...(usesRateLimit ? ['compiledRateLimitFailureStatic'] : []),
    ...(usesValidationDetails ? ['compiledValidationDetails'] : []),
    ...(usesCache ? ['compiledReadCache', 'compiledWriteCache'] : []),
    ...(hasCompiledProcedures ? ['type CompiledFixedDispatch'] : []),
    'type CompiledFixedUnaryDispatch',
    'type CompiledBodyResultFor',
    'type CompiledRouteUnaryBodyResultFor',
    'type CompiledRouteStreamBodyResultFor',
    'type CompiledRouteStreamTransportBodyResultFor',
    'type CompiledRouteUnaryTransportBodyResultFor',
    'type CompiledTransportBodyResultFor',
    'type CompiledRuntimeState',
    ...(hasGenericFallback ? ['executeCompiledProcedure'] : []),
    'type CompiledDispatch',
    'type CompiledRpcRequestHandler',
    'type CompiledRpcBodyResultHandlerFor',
    'type CompiledRpcRouteStreamTransportBodyResultHandlerFor',
    'type CompiledRpcRouteUnaryTransportBodyResultHandlerFor',
    'type CompiledRpcRouteStreamBodyResultHandlerFor',
    'type CompiledRpcTransportBodyResultHandler',
    'type CompiledRpcTransportBodyResultHandlerFor',
    'type CompiledRpcRouteUnaryBodyResultHandlerFor',
  ];
  const manifestTypeImports = [
    'JoorManifestRouteBody',
    'JoorManifestRouteBodyResultFor',
    'JoorManifestRouteBodyResult',
    'JoorManifestRouteBatchRequest',
    'JoorManifestRouteBatchResults',
    'JoorManifestRouteEnvelope',
    'JoorManifestRouteError',
    'JoorManifestRouteErrorCode',
    'JoorManifestRouteErrorDetails',
    'JoorManifestRouteHasHeaders',
    'JoorManifestRouteHasResponseHeaders',
    'JoorManifestRouteHeaders',
    'JoorManifestRouteClientArgs',
    'JoorManifestRouteClientHeaders',
    'JoorManifestRouteId',
    'JoorManifestRouteStreamId',
    'JoorManifestRouteUnaryId',
    'JoorManifestRouteEnvelopeUnion',
    'JoorManifestRouteResult',
    'JoorManifestRouteResultUnion',
    'JoorManifestRouteInput',
    'JoorManifestRouteOutput',
    'JoorManifestRouteProtocolBatchRequest',
    'JoorManifestRouteProtocolRequest',
    'JoorManifestRouteProtocolRequestUnion',
    'JoorManifestRouteProcedure',
    'JoorManifestRouteRequestOptions',
    'JoorManifestRouteRequiresHeaders',
    'JoorManifestRouteRequiresResponseHeaders',
    'JoorManifestRouteResponseHeaders',
    'JoorManifestRequiredServices',
    'JoorManifestRouteServices',
    'JoorManifestRouteStreamEvent',
    'JoorManifestStreamRouteClientArgs',
    'JoorManifestStreamRouteClientHeaders',
    'JoorManifestStreamRouteError',
    'JoorManifestStreamRouteErrorCode',
    'JoorManifestStreamRouteErrorDetails',
    'JoorManifestStreamRouteEvent',
    'JoorManifestStreamRouteHasHeaders',
    'JoorManifestStreamRouteHasResponseHeaders',
    'JoorManifestStreamRouteHeaders',
    'JoorManifestStreamRouteInput',
    'JoorManifestStreamRouteOutput',
    'JoorManifestStreamRouteProcedure',
    'JoorManifestStreamRouteRequiresHeaders',
    'JoorManifestStreamRouteRequiresResponseHeaders',
    'JoorManifestStreamRouteResponseHeaders',
    'JoorManifestStreamRouteRequestOptions',
    'JoorManifestRouteStreamProtocolRequest',
    'JoorManifestRouteStreamProtocolRequestUnion',
    'JoorManifestUnaryRouteClientArgs',
    'JoorManifestUnaryRouteClientHeaders',
    'JoorManifestUnaryRouteEnvelope',
    'JoorManifestUnaryRouteError',
    'JoorManifestUnaryRouteErrorCode',
    'JoorManifestUnaryRouteErrorDetails',
    'JoorManifestUnaryRouteHasHeaders',
    'JoorManifestUnaryRouteHasResponseHeaders',
    'JoorManifestUnaryRouteHeaders',
    'JoorManifestUnaryRouteInput',
    'JoorManifestUnaryRouteOutput',
    'JoorManifestUnaryRouteProcedure',
    'JoorManifestUnaryRouteResponseHeaders',
    'JoorManifestUnaryRouteResult',
    'JoorManifestUnaryRouteRequiresHeaders',
    'JoorManifestUnaryRouteRequiresResponseHeaders',
    'JoorManifestUnaryRouteRequestOptions',
    'JoorManifestRouteUnaryProcedure',
    'JoorManifestRouteStreamProcedure',
    'JoorManifestRouteUnaryInput',
    'JoorManifestRouteStreamInput',
    'JoorManifestRouteUnaryOutput',
    'JoorManifestRouteStreamOutput',
    'JoorManifestRouteUnaryHeaders',
    'JoorManifestRouteStreamHeaders',
    'JoorManifestRouteUnaryClientHeaders',
    'JoorManifestRouteStreamClientHeaders',
    'JoorManifestRouteUnaryResponseHeaders',
    'JoorManifestRouteStreamResponseHeaders',
    'JoorManifestRouteUnaryError',
    'JoorManifestRouteStreamError',
    'JoorManifestRouteUnaryErrorCode',
    'JoorManifestRouteStreamErrorCode',
    'JoorManifestRouteUnaryErrorDetails',
    'JoorManifestRouteStreamErrorDetails',
    'JoorManifestRouteUnaryEnvelope',
    'JoorManifestRouteUnaryEnvelopeUnion',
    'JoorManifestRouteUnaryResult',
    'JoorManifestRouteUnaryResultUnion',
    'JoorManifestRouteUnaryHasHeaders',
    'JoorManifestRouteStreamHasHeaders',
    'JoorManifestRouteUnaryRequiresHeaders',
    'JoorManifestRouteStreamRequiresHeaders',
    'JoorManifestRouteUnaryHasResponseHeaders',
    'JoorManifestRouteStreamHasResponseHeaders',
    'JoorManifestRouteUnaryRequiresResponseHeaders',
    'JoorManifestRouteStreamRequiresResponseHeaders',
    'JoorManifestRouteUnaryRequestOptions',
    'JoorManifestRouteStreamRequestOptions',
    'JoorManifestRouteUnaryClientArgs',
    'JoorManifestRouteStreamClientArgs',
    'JoorManifestRouteUnaryBatchRequest',
    'JoorManifestRouteUnaryBatchResults',
    'JoorManifestRouteUnaryBodyResult',
    'JoorManifestRouteStreamBodyResult',
    'JoorManifestRouteUnaryBodyResultFor',
    'JoorManifestRouteStreamBodyResultFor',
    'JoorManifestRouteUnaryRequest',
    'JoorManifestRouteUnaryRequestUnion',
    'JoorManifestRouteUnaryProtocolBatchRequest',
    'JoorManifestRouteUnaryProtocolRequest',
    'JoorManifestRouteUnaryProtocolRequestUnion',
  ];
  const schemaTypeImport = hasCompiledProcedures
    ? "import type { JsonValue } from 'joor/schema';\n"
    : '';
  const procedureTypeImport = hasCompiledProcedures
    ? "import type { ProcedureServices, RpcError } from 'joor/procedure';\n"
    : '';
  const manifestTypeImport = `import type { ${manifestTypeImports.join(', ')} } from 'joor/manifest';\n`;
  const contextTypeImport =
    "import type { ContextRequestSource, JoorPlugin } from 'joor/context';\n";
  const configTypeImports = [
    'DefineConfigFor',
    'DefineRouteStreamConfigFor',
    'DefineRouteUnaryConfigFor',
    'JoorConfigContext',
    'JoorConfigFor',
    'JoorRouteStreamConfigFor',
    'JoorRouteUnaryConfigFor',
  ];
  const configTypeImport = `import type { ${configTypeImports.join(', ')} } from 'joor/config';\n`;
  const handlerTypeImport =
    "import type { DefineHandlerOptions, DefineRouteStreamHandlerOptions, DefineRouteUnaryHandlerOptions, HandlerHookContextFor, HandlerHooksFor, HandlerOptionServices, HandlerOptionsArgs, HandlerOptionsArgsFor, HandlerOptionsFor, JoorMiddlewareFor, RpcManifestRouteStreamHandlerHookContextFor, RpcManifestRouteStreamHandlerHooksFor, RpcManifestRouteStreamHandlerOptionsArgs, RpcManifestRouteStreamHandlerOptionsFor, RpcManifestRouteStreamMiddlewareFor, RpcManifestRouteUnaryHandlerHookContextFor, RpcManifestRouteUnaryHandlerHooksFor, RpcManifestRouteUnaryHandlerOptionsArgs, RpcManifestRouteUnaryHandlerOptionsFor, RpcManifestRouteUnaryMiddlewareFor } from 'joor';\n";
  const nativeServicesType =
    configPath === undefined
      ? 'Record<string, never>'
      : 'JoorConfigContext<typeof config>';
  const nativeManifestEntries = manifest.procedures
    .map(
      (entry) => `    ${JSON.stringify(entry.id)}: typeof ${entry.exportName};`
    )
    .join('\n');
  const nativeManifestTypes = `export type NativeManifest = {
  procedures: {
${nativeManifestEntries}
  };
};

export type NativeServices = ${nativeServicesType};
export type NativeRuntimeState = CompiledRuntimeState<NativeServices>;
export type NativeDispatch = CompiledDispatch<NativeServices>;
export type NativeUnaryDispatch = CompiledFixedUnaryDispatch<NativeServices>;
export type NativeFetchHandler = CompiledRpcRequestHandler;
export type NativeRouteId = JoorManifestRouteId<NativeManifest>;
export type NativeRouteUnaryId = JoorManifestRouteUnaryId<NativeManifest>;
export type NativeUnaryRouteId = NativeRouteUnaryId;
export type NativeRouteStreamId = JoorManifestRouteStreamId<NativeManifest>;
export type NativeStreamRouteId = NativeRouteStreamId;
export type NativeRouteProcedure<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteProcedure<NativeManifest, TId>;
export type NativeRouteUnaryProcedure<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryProcedure<NativeManifest, TId>;
export type NativeUnaryRouteProcedure<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryProcedure<TId>;
export type NativeRouteStreamProcedure<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamProcedure<NativeManifest, TId>;
export type NativeStreamRouteProcedure<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamProcedure<TId>;
export type NativeRequiredServices = JoorManifestRequiredServices<NativeManifest>;
export type NativeRouteServices<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteServices<NativeManifest, TId>;
export type NativeRouteInput<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteInput<NativeManifest, TId>;
export type NativeRouteUnaryInput<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryInput<NativeManifest, TId>;
export type NativeUnaryRouteInput<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryInput<TId>;
export type NativeRouteStreamInput<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamInput<NativeManifest, TId>;
export type NativeStreamRouteInput<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamInput<TId>;
export type NativeRouteOutput<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteOutput<NativeManifest, TId>;
export type NativeRouteUnaryOutput<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryOutput<NativeManifest, TId>;
export type NativeUnaryRouteOutput<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryOutput<TId>;
export type NativeRouteStreamOutput<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamOutput<NativeManifest, TId>;
export type NativeStreamRouteOutput<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamOutput<TId>;
export type NativeRouteHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryHeaders<TId>;
export type NativeRouteStreamHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamHeaders<NativeManifest, TId>;
export type NativeStreamRouteHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamHeaders<TId>;
export type NativeRouteClientHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteClientHeaders<NativeManifest, TId>;
export type NativeRouteUnaryClientHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryClientHeaders<NativeManifest, TId>;
export type NativeUnaryRouteClientHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryClientHeaders<TId>;
export type NativeRouteStreamClientHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamClientHeaders<NativeManifest, TId>;
export type NativeStreamRouteClientHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamClientHeaders<TId>;
export type NativeRouteRequestOptions<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteRequestOptions<NativeManifest, TId>;
export type NativeRouteUnaryRequestOptions<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryRequestOptions<NativeManifest, TId>;
export type NativeUnaryRouteRequestOptions<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryRequestOptions<TId>;
export type NativeRouteStreamRequestOptions<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamRequestOptions<NativeManifest, TId>;
export type NativeStreamRouteRequestOptions<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamRequestOptions<TId>;
export type NativeRouteClientArgs<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteClientArgs<NativeManifest, TId>;
export type NativeRouteUnaryClientArgs<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryClientArgs<NativeManifest, TId>;
export type NativeUnaryRouteClientArgs<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryClientArgs<TId>;
export type NativeRouteStreamClientArgs<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamClientArgs<NativeManifest, TId>;
export type NativeStreamRouteClientArgs<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamClientArgs<TId>;
export type NativeRouteHasHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteHasHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHasHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryHasHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHasHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryHasHeaders<TId>;
export type NativeRouteStreamHasHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamHasHeaders<NativeManifest, TId>;
export type NativeStreamRouteHasHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamHasHeaders<TId>;
export type NativeRouteRequiresHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteRequiresHeaders<NativeManifest, TId>;
export type NativeRouteUnaryRequiresHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryRequiresHeaders<NativeManifest, TId>;
export type NativeUnaryRouteRequiresHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryRequiresHeaders<TId>;
export type NativeRouteStreamRequiresHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamRequiresHeaders<NativeManifest, TId>;
export type NativeStreamRouteRequiresHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamRequiresHeaders<TId>;
export type NativeRouteResponseHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryResponseHeaders<TId>;
export type NativeRouteStreamResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamResponseHeaders<NativeManifest, TId>;
export type NativeStreamRouteResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamResponseHeaders<TId>;
export type NativeRouteHasResponseHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteHasResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHasResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryHasResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHasResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryHasResponseHeaders<TId>;
export type NativeRouteStreamHasResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamHasResponseHeaders<NativeManifest, TId>;
export type NativeStreamRouteHasResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamHasResponseHeaders<TId>;
export type NativeRouteRequiresResponseHeaders<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteRequiresResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryRequiresResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryRequiresResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteRequiresResponseHeaders<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryRequiresResponseHeaders<TId>;
export type NativeRouteStreamRequiresResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamRequiresResponseHeaders<NativeManifest, TId>;
export type NativeStreamRouteRequiresResponseHeaders<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamRequiresResponseHeaders<TId>;
export type NativeRouteError<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteError<NativeManifest, TId>;
export type NativeRouteUnaryError<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryError<NativeManifest, TId>;
export type NativeUnaryRouteError<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryError<TId>;
export type NativeRouteStreamError<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamError<NativeManifest, TId>;
export type NativeStreamRouteError<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamError<TId>;
export type NativeRouteErrorCode<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteErrorCode<NativeManifest, TId>;
export type NativeRouteUnaryErrorCode<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryErrorCode<NativeManifest, TId>;
export type NativeUnaryRouteErrorCode<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryErrorCode<TId>;
export type NativeRouteStreamErrorCode<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamErrorCode<NativeManifest, TId>;
export type NativeStreamRouteErrorCode<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamErrorCode<TId>;
export type NativeRouteErrorDetails<TId extends NativeRouteId = NativeRouteId, TCode extends NativeRouteErrorCode<TId> = NativeRouteErrorCode<TId>> = JoorManifestRouteErrorDetails<NativeManifest, TId, TCode>;
export type NativeRouteUnaryErrorDetails<TId extends NativeRouteUnaryId = NativeRouteUnaryId, TCode extends NativeRouteUnaryErrorCode<TId> = NativeRouteUnaryErrorCode<TId>> = JoorManifestRouteUnaryErrorDetails<NativeManifest, TId, TCode>;
export type NativeUnaryRouteErrorDetails<TId extends NativeRouteUnaryId = NativeRouteUnaryId, TCode extends NativeRouteUnaryErrorCode<TId> = NativeRouteUnaryErrorCode<TId>> = NativeRouteUnaryErrorDetails<TId, TCode>;
export type NativeRouteStreamErrorDetails<TId extends NativeRouteStreamId = NativeRouteStreamId, TCode extends NativeRouteStreamErrorCode<TId> = NativeRouteStreamErrorCode<TId>> = JoorManifestRouteStreamErrorDetails<NativeManifest, TId, TCode>;
export type NativeStreamRouteErrorDetails<TId extends NativeRouteStreamId = NativeRouteStreamId, TCode extends NativeRouteStreamErrorCode<TId> = NativeRouteStreamErrorCode<TId>> = NativeRouteStreamErrorDetails<TId, TCode>;
export type NativeRouteEnvelope<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteEnvelope<NativeManifest, TId>;
export type NativeRouteUnaryEnvelope<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryEnvelope<NativeManifest, TId>;
export type NativeUnaryRouteEnvelope<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryEnvelope<TId>;
export type NativeRouteEnvelopeUnion = JoorManifestRouteEnvelopeUnion<NativeManifest>;
export type NativeRouteUnaryEnvelopeUnion = JoorManifestRouteUnaryEnvelopeUnion<NativeManifest>;
export type NativeUnaryRouteEnvelopeUnion = NativeRouteUnaryEnvelopeUnion;
export type NativeRouteResult<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteResult<NativeManifest, TId>;
export type NativeRouteUnaryResult<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryResult<NativeManifest, TId>;
export type NativeUnaryRouteResult<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryResult<TId>;
export type NativeRouteResultUnion = JoorManifestRouteResultUnion<NativeManifest>;
export type NativeRouteUnaryResultUnion = JoorManifestRouteUnaryResultUnion<NativeManifest>;
export type NativeUnaryRouteResultUnion = NativeRouteUnaryResultUnion;
export type NativeRouteStreamEvent<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamEvent<NativeManifest, TId>;
export type NativeStreamRouteEvent<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamEvent<TId>;
export type NativeStreamEvent<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeStreamRouteEvent<TId>;
export type NativeRouteProtocolRequest<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteProtocolRequest<NativeManifest, TId>;
export type NativeRouteProtocolRequestUnion = JoorManifestRouteProtocolRequestUnion<NativeManifest>;
export type NativeRouteRequest<TId extends NativeRouteId = NativeRouteId> =
  NativeRouteProtocolRequest<TId>;
export type NativeRouteRequestUnion =
  NativeRouteProtocolRequestUnion;
export type NativeProtocolRequest<TId extends NativeRouteId = NativeRouteId> =
  NativeRouteRequest<TId>;
export type NativeProtocolRequestUnion = NativeRouteProtocolRequestUnion;
export type NativeRouteUnaryProtocolRequest<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = JoorManifestRouteUnaryProtocolRequest<NativeManifest, TId>;
export type NativeUnaryRouteProtocolRequest<TId extends NativeRouteUnaryId = NativeRouteUnaryId> = NativeRouteUnaryProtocolRequest<TId>;
export type NativeRouteUnaryProtocolRequestUnion = JoorManifestRouteUnaryProtocolRequestUnion<NativeManifest>;
export type NativeUnaryRouteProtocolRequestUnion = NativeRouteUnaryProtocolRequestUnion;
export type NativeRouteUnaryRequest<TId extends NativeRouteUnaryId = NativeRouteUnaryId> =
  NativeRouteUnaryProtocolRequest<TId>;
export type NativeUnaryRouteRequest<TId extends NativeRouteUnaryId = NativeRouteUnaryId> =
  NativeRouteUnaryRequest<TId>;
export type NativeRouteUnaryRequestUnion = NativeRouteUnaryProtocolRequestUnion;
export type NativeUnaryRouteRequestUnion = NativeRouteUnaryRequestUnion;
export type NativeUnaryRequestUnion = NativeRouteUnaryRequestUnion;
export type NativeUnaryProtocolRequest<TId extends NativeRouteUnaryId = NativeRouteUnaryId> =
  NativeUnaryRouteRequest<TId>;
export type NativeUnaryProtocolRequestUnion =
  NativeRouteUnaryProtocolRequestUnion;
export type NativeRouteStreamProtocolRequest<TId extends NativeRouteStreamId = NativeRouteStreamId> = JoorManifestRouteStreamProtocolRequest<NativeManifest, TId>;
export type NativeStreamRouteProtocolRequest<TId extends NativeRouteStreamId = NativeRouteStreamId> = NativeRouteStreamProtocolRequest<TId>;
export type NativeRouteStreamProtocolRequestUnion = JoorManifestRouteStreamProtocolRequestUnion<NativeManifest>;
export type NativeStreamRouteProtocolRequestUnion = NativeRouteStreamProtocolRequestUnion;
export type NativeRouteStreamRequest<TId extends NativeRouteStreamId = NativeRouteStreamId> =
  NativeRouteStreamProtocolRequest<TId>;
export type NativeStreamRouteRequest<TId extends NativeRouteStreamId = NativeRouteStreamId> =
  NativeRouteStreamRequest<TId>;
export type NativeRouteStreamRequestUnion = NativeRouteStreamProtocolRequestUnion;
export type NativeStreamRouteRequestUnion = NativeRouteStreamRequestUnion;
export type NativeStreamProtocolRequest<TId extends NativeRouteStreamId = NativeRouteStreamId> =
  NativeStreamRouteRequest<TId>;
export type NativeStreamProtocolRequestUnion =
  NativeRouteStreamProtocolRequestUnion;
export type NativeRouteBatchRequest<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  JoorManifestRouteBatchRequest<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchRequest<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  JoorManifestRouteUnaryBatchRequest<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchRequest<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  NativeRouteUnaryBatchRequest<TRequests>;
export type NativeRouteProtocolBatchRequest<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  JoorManifestRouteProtocolBatchRequest<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchRequest<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  JoorManifestRouteUnaryProtocolBatchRequest<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchRequest<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteUnaryProtocolBatchRequest<TRequests>;
export type NativeProtocolBatchRequest<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteProtocolBatchRequest<TRequests>;
export type NativeRouteBatchResults<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  JoorManifestRouteBatchResults<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchResults<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  JoorManifestRouteUnaryBatchResults<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchResults<TRequests extends readonly NativeRouteUnaryRequest[] = readonly NativeRouteUnaryRequest[]> =
  NativeRouteUnaryBatchResults<TRequests>;
export type NativeRouteProtocolBatchResults<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteBatchResults<TRequests>;
export type NativeRouteUnaryProtocolBatchResults<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteUnaryBatchResults<TRequests>;
export type NativeUnaryRouteProtocolBatchResults<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteUnaryProtocolBatchResults<TRequests>;
export type NativeProtocolBatchResults<TRequests extends readonly NativeRouteUnaryProtocolRequestUnion[] = readonly NativeRouteUnaryProtocolRequestUnion[]> =
  NativeRouteProtocolBatchResults<TRequests>;
export type NativeBatchBody = NativeRouteBatchRequest;
export type NativeRouteBody = JoorManifestRouteBody<NativeManifest>;
export type NativeBody = NativeRouteBody;
export type NativeRouteUnaryBody =
  | NativeRouteUnaryProtocolRequestUnion
  | NativeRouteUnaryBatchRequest<readonly NativeRouteUnaryProtocolRequestUnion[]>;
export type NativeUnaryRouteBody = NativeRouteUnaryBody;
export type NativeRouteStreamBody = NativeRouteStreamProtocolRequestUnion;
export type NativeStreamRouteBody = NativeRouteStreamBody;
export type NativeConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  JoorConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  NativeConfig<TPlugins, TBody>;
export type NativeRouteUnaryConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  JoorRouteUnaryConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryConfig<TPlugins, TBody>;
export type NativeUnaryRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryConfig<TPlugins, TBody>;
export type NativeUnaryRouteConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryConfigFor<TPlugins, TBody>;
export type NativeRouteStreamConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  JoorRouteStreamConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamConfig<TPlugins, TBody>;
export type NativeStreamRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamConfig<TPlugins, TBody>;
export type NativeStreamRouteConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamConfigFor<TPlugins, TBody>;
export type NativeDefineConfig = DefineConfigFor<NativeManifest>;
export type NativeDefineRouteUnaryConfig = DefineRouteUnaryConfigFor<NativeManifest>;
export type NativeDefineUnaryRouteConfig = NativeDefineRouteUnaryConfig;
export type NativeDefineRouteStreamConfig = DefineRouteStreamConfigFor<NativeManifest>;
export type NativeDefineStreamRouteConfig = NativeDefineRouteStreamConfig;
export type NativeHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  NativeHandlerOptions<TPlugins, TBody>;
export type NativeRouteUnaryHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  RpcManifestRouteUnaryHandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerOptions<TPlugins, TBody>;
export type NativeUnaryRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerOptions<TPlugins, TBody>;
export type NativeUnaryRouteHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerOptionsFor<TPlugins, TBody>;
export type NativeRouteStreamHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  RpcManifestRouteStreamHandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerOptions<TPlugins, TBody>;
export type NativeStreamRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerOptions<TPlugins, TBody>;
export type NativeStreamRouteHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerOptionsFor<TPlugins, TBody>;
export type NativeHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeHandlerOptions<TPlugins> | NativeBody = NativeHandlerOptions<TPlugins, NativeBody>> =
  HandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody>;
export type NativeRouteUnaryHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  RpcManifestRouteUnaryHandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerOptionsArgs<TPlugins, TBody>;
export type NativeRouteStreamHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  RpcManifestRouteStreamHandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeStreamRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerOptionsArgs<TPlugins, TBody>;
export type NativeDefineHandlerOptions = DefineHandlerOptions<NativeManifest>;
export type NativeDefineRouteUnaryHandlerOptions = DefineRouteUnaryHandlerOptions<NativeManifest>;
export type NativeDefineUnaryRouteHandlerOptions = NativeDefineRouteUnaryHandlerOptions;
export type NativeDefineRouteStreamHandlerOptions = DefineRouteStreamHandlerOptions<NativeManifest>;
export type NativeDefineStreamRouteHandlerOptions = NativeDefineRouteStreamHandlerOptions;
export type NativeHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  RpcManifestRouteUnaryHandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerHookContext<TPlugins, TBody>;
export type NativeRouteStreamHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  RpcManifestRouteStreamHandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeStreamRouteHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerHookContext<TPlugins, TBody>;
export type NativeHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  RpcManifestRouteUnaryHandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryHandlerHooks<TPlugins, TBody>;
export type NativeRouteStreamHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  RpcManifestRouteStreamHandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeStreamRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamHandlerHooks<TPlugins, TBody>;
export type NativeMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  JoorMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  RpcManifestRouteUnaryMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> =
  NativeRouteUnaryMiddleware<TPlugins, TBody>;
export type NativeRouteStreamMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  RpcManifestRouteStreamMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeStreamRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody> =
  NativeRouteStreamMiddleware<TPlugins, TBody>;
export type NativeHandlerOptionServices<TOptions> = HandlerOptionServices<TOptions>;
export type NativeRouteBodyResult<TBody extends NativeRouteBody = NativeRouteBody> =
  JoorManifestRouteBodyResultFor<NativeManifest, TBody>;
export type NativeBodyResult<TBody extends NativeBody = NativeBody> = NativeRouteBodyResult<TBody>;
export type NativeRouteUnaryBodyResult<TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> = JoorManifestRouteUnaryBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteBodyResult<TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody> = NativeRouteUnaryBodyResult<TBody>;
export type NativeRouteStreamBodyResult<TBody extends NativeRouteStreamBody = NativeRouteStreamBody> = JoorManifestRouteStreamBodyResultFor<NativeManifest, TBody>;
export type NativeStreamRouteBodyResult<TBody extends NativeRouteStreamBody = NativeRouteStreamBody> = NativeRouteStreamBodyResult<TBody>;
export type NativeRouteBodyResultFor<TBody extends NativeRouteBody> = JoorManifestRouteBodyResultFor<NativeManifest, TBody>;
export type NativeBodyResultFor<TBody extends NativeBody> =
  NativeRouteBodyResultFor<TBody>;
export type NativeRouteUnaryBodyResultFor<TBody extends NativeRouteUnaryBody> =
  JoorManifestRouteUnaryBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteBodyResultFor<TBody extends NativeRouteUnaryBody> =
  NativeRouteUnaryBodyResultFor<TBody>;
export type NativeRouteStreamBodyResultFor<TBody extends NativeRouteStreamBody> =
  JoorManifestRouteStreamBodyResultFor<NativeManifest, TBody>;
export type NativeStreamRouteBodyResultFor<TBody extends NativeRouteStreamBody> =
  NativeRouteStreamBodyResultFor<TBody>;
export type NativeCompiledBodyResult<TBody extends NativeBody = NativeBody> = CompiledBodyResultFor<NativeManifest, TBody>;
export type NativeCompiledBodyResultFor<TBody extends NativeBody> =
  CompiledBodyResultFor<NativeManifest, TBody>;
export type NativeRouteUnaryCompiledBodyResultFor<TBody extends NativeRouteUnaryBody> =
  CompiledRouteUnaryBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteCompiledBodyResultFor<TBody extends NativeRouteUnaryBody> =
  NativeRouteUnaryCompiledBodyResultFor<TBody>;
export type NativeRouteStreamCompiledBodyResultFor<TBody extends NativeRouteStreamBody> =
  CompiledRouteStreamBodyResultFor<NativeManifest, TBody>;
export type NativeStreamRouteCompiledBodyResultFor<TBody extends NativeRouteStreamBody> =
  NativeRouteStreamCompiledBodyResultFor<TBody>;
export type NativeCompiledTransportResult<TBody extends NativeBody = NativeBody> =
  CompiledTransportBodyResultFor<NativeManifest, TBody>;
export type NativeTransportResult<TBody extends NativeBody = NativeBody> = NativeCompiledTransportResult<TBody>;
export type NativeTransportResultFor<TBody extends NativeBody> =
  CompiledTransportBodyResultFor<NativeManifest, TBody>;
export type NativeRouteUnaryTransportResultFor<TBody extends NativeRouteUnaryBody> =
  CompiledRouteUnaryTransportBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteTransportResultFor<TBody extends NativeRouteUnaryBody> =
  NativeRouteUnaryTransportResultFor<TBody>;
export type NativeRouteStreamTransportResultFor<TBody extends NativeRouteStreamBody> =
  CompiledRouteStreamTransportBodyResultFor<NativeManifest, TBody>;
export type NativeStreamRouteTransportResultFor<TBody extends NativeRouteStreamBody> =
  NativeRouteStreamTransportResultFor<TBody>;
export type NativeTransportHandler = CompiledRpcTransportBodyResultHandlerFor<NativeManifest>;
export type NativeRouteUnaryTransportHandler =
  CompiledRpcRouteUnaryTransportBodyResultHandlerFor<NativeManifest>;
export type NativeUnaryRouteTransportHandler = NativeRouteUnaryTransportHandler;
export type NativeRouteStreamTransportHandler =
  CompiledRpcRouteStreamTransportBodyResultHandlerFor<NativeManifest>;
export type NativeStreamRouteTransportHandler = NativeRouteStreamTransportHandler;
export type NativeBodyHandler = CompiledRpcBodyResultHandlerFor<NativeManifest>;
export type NativeRouteUnaryBodyHandler =
  CompiledRpcRouteUnaryBodyResultHandlerFor<NativeManifest>;
export type NativeUnaryRouteBodyHandler = NativeRouteUnaryBodyHandler;
export type NativeRouteStreamBodyHandler =
  CompiledRpcRouteStreamBodyResultHandlerFor<NativeManifest>;
export type NativeStreamRouteBodyHandler = NativeRouteStreamBodyHandler;
export type NativeTransportRequest = ContextRequestSource;`;
  const executors = manifest.procedures
    .map((entry) => emitCompiledProcedureSource(entry, generationOptions))
    .filter(Boolean)
    .join('\n\n');
  const hasBodyMode = modes.includes('body');
  const hasSerializedMode = modes.includes('serialized');
  const hasResponseMode = modes.includes('response');
  const compiledDispatchType = 'NativeDispatch';
  const nativeDispatchBodyType = 'NativeProtocolRequest';
  const compiledFixedUnaryDispatchType = 'NativeUnaryDispatch';
  const dispatchCaseForMode = (
    mode: 'body' | 'serialized' | 'response'
  ): string =>
    manifest.procedures
      .map((entry) => {
        const serialize =
          mode === 'response' ? "'response'" : mode === 'serialized';
        return entry.procedure.output === undefined
          ? `    case ${JSON.stringify(entry.id)}:
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest as NativeRouteProtocolRequest<${JSON.stringify(entry.id)}>, request, services as ProcedureServices<typeof ${entry.exportName}>, runtime, state, ${serialize});`
          : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute_${mode}(rpcRequest, request, services, runtime, state);`;
      })
      .join('\n');
  const dispatchBody = hasBodyMode
    ? `const dispatchBody: ${compiledDispatchType} = (
  rpcRequest,
  request,
  services,
  runtime,
  state,
  _serialize
) => {
  switch (rpcRequest.id) {
${dispatchCaseForMode('body')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const dispatchSerialized = hasSerializedMode
    ? `const dispatchSerialized: ${compiledDispatchType} = (
  rpcRequest,
  request,
  services,
  runtime,
  state,
  _serialize
) => {
  switch (rpcRequest.id) {
${dispatchCaseForMode('serialized')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const dispatchResponse = hasResponseMode
    ? `const dispatchResponse: ${compiledDispatchType} = (
  rpcRequest,
  request,
  services,
  runtime,
  state,
  _serialize
) => {
  switch (rpcRequest.id) {
${dispatchCaseForMode('response')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const unaryCases = (mode: 'body' | 'serialized' | 'response'): string =>
    manifest.procedures
      .map((entry) => {
        const serialize =
          mode === 'response' ? "'response'" : mode === 'serialized';
        return entry.procedure.output === undefined
          ? `    case ${JSON.stringify(entry.id)}:
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services as ProcedureServices<typeof ${entry.exportName}>, runtime, state, ${serialize});`
          : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute_${mode}(rpcRequest, request, services, runtime, state);`;
      })
      .join('\n');
  const bodyUnaryDispatch = hasBodyMode
    ? `const bodyUnaryDispatch: ${compiledFixedUnaryDispatchType} = (
  body,
  request,
  services,
  runtime,
  state
) => {
  const traceIdValue = body['traceId'];
  if (
    typeof body['id'] !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return undefined;
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('body')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const serializedUnaryDispatch = hasSerializedMode
    ? `const serializedUnaryDispatch: ${compiledFixedUnaryDispatchType} = (
  body,
  request,
  services,
  runtime,
  state
) => {
  const traceIdValue = body['traceId'];
  if (
    typeof body['id'] !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return undefined;
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('serialized')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const responseUnaryDispatch = hasResponseMode
    ? `const responseUnaryDispatch: ${compiledFixedUnaryDispatchType} = (
  body,
  request,
  services,
  runtime,
  state
) => {
  const traceIdValue = body['traceId'];
  if (
    typeof body['id'] !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return undefined;
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('response')}
    default:
      return compiledNotFound(rpcRequest, request);
  }
};`
    : '';
  const transportDispatchName = hasSerializedMode
    ? 'dispatchSerialized'
    : hasBodyMode
      ? 'dispatchBody'
      : 'dispatchResponse';
  const nativeUnaryDispatchName = hasSerializedMode
    ? 'serializedUnaryDispatch'
    : hasBodyMode
      ? 'bodyUnaryDispatch'
      : 'responseUnaryDispatch';
  const responseDispatchName = hasResponseMode
    ? 'dispatchResponse'
    : transportDispatchName;
  const nativeResponseUnaryDispatchName = hasResponseMode
    ? 'responseUnaryDispatch'
    : nativeUnaryDispatchName;
  const transportModeLiteral = hasSerializedMode
    ? 'true'
    : hasBodyMode
      ? 'false'
      : "'response'";
  await writeFile(
    dispatcherFile,
    `import {
  ${compiledImports.join(',\n  ')},
} from 'joor/runtime/compiled';
${schemaTypeImport}${procedureTypeImport}${manifestTypeImport}${contextTypeImport}${configTypeImport}${handlerTypeImport}${configImport}${imports}

${nativeManifestTypes}

${executors}

${dispatchBody}
${dispatchSerialized}
${dispatchResponse}

${bodyUnaryDispatch}
${serializedUnaryDispatch}
${responseUnaryDispatch}

const dispatch: ${compiledDispatchType} = ${transportDispatchName};
export const nativeUnaryDispatch: NativeUnaryDispatch = ${nativeUnaryDispatchName};
export const nativeResponseUnaryDispatch: NativeUnaryDispatch = ${nativeResponseUnaryDispatchName};
export const nativeRuntime: NativeRuntimeState = createCompiledRuntimeState(${configValue});
export const nativeTransport: NativeTransportHandler = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch,
  false,
  ${transportModeLiteral},
  nativeRuntime
) as NativeTransportHandler;
export const nativeResponseTransport: NativeTransportHandler = createCompiledRpcTransportBodyResultHandler(
  ${responseDispatchName},
  ${configValue},
  nativeResponseUnaryDispatch,
  false,
  'response',
  nativeRuntime
) as NativeTransportHandler;
export const nativeBody: NativeBodyHandler = createCompiledRpcBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch
) as NativeBodyHandler;
export const transport: NativeTransportHandler = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch,
  true,
  ${transportModeLiteral},
  nativeRuntime
) as NativeTransportHandler;
export const fetch: NativeFetchHandler = createCompiledRpcHandler(${responseDispatchName}, ${configValue}, nativeResponseUnaryDispatch);
`
  );
};

const emitDispatcher = async (
  manifest: CompilerManifest,
  outDir: string,
  config: JoorConfig | undefined,
  configPath?: string
): Promise<void> => {
  const toModuleSpecifier = (filePath: string): string => {
    const segments = filePath.split(/[/\\]/);
    const module = segments.at(-1) ?? '';
    return `./${module}`;
  };
  const baseModes = ['serialized'] as const;
  const baseOptions: CompiledProcedureGenerationOptions = {
    enforceRateLimit: config?.enforceRateLimit ?? true,
    includeDispatchWrapper: false,
    validateHeaders: config?.validateHeaders ?? true,
    validateInput: config?.validateInput ?? true,
    validateOutput: config?.validateOutput ?? true,
    validateResponseHeaders: config?.validateResponseHeaders ?? true,
  };
  const trustedOptions: CompiledProcedureGenerationOptions = {
    ...baseOptions,
    enforceRateLimit: false,
    skipAuth: true,
    validateHeaders: false,
    validateInput: false,
    validateOutput: false,
    validateResponseHeaders: false,
  };
  const bareOptions: CompiledProcedureGenerationOptions = {
    ...trustedOptions,
    includeDispatchWrapper: false,
    modes: ['serialized'],
  };
  const unsafeFastPath =
    config?.enforceRateLimit === false &&
    config.validateHeaders === false &&
    config.validateInput === false &&
    config.validateOutput === false &&
    config.validateResponseHeaders === false;
  const hasAuthProcedure = manifest.procedures.some(
    (entry) => entry.procedure.auth !== undefined
  );
  const useBareDispatcher =
    unsafeFastPath &&
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
  const dispatcherSafe = `${outDir}/dispatcher.safe.ts`;
  const dispatcherTrusted = `${outDir}/dispatcher.trusted.ts`;
  const dispatcherBare = `${outDir}/dispatcher.bare.ts`;
  const selectedDispatcher = unsafeFastPath
    ? hasAuthProcedure
      ? dispatcherSafe
      : useBareDispatcher
        ? dispatcherBare
        : dispatcherTrusted
    : dispatcherSafe;
  await writeFile(
    `${outDir}/dispatcher.ts`,
    `export * from '${toModuleSpecifier(selectedDispatcher)}';\n`
  );
  await emitProfileDispatcher(
    manifest,
    outDir,
    config,
    configPath,
    `${outDir}/dispatcher.safe.ts`,
    baseOptions,
    baseModes
  );
  if (unsafeFastPath && !hasAuthProcedure) {
    if (useBareDispatcher) {
      await emitProfileDispatcher(
        manifest,
        outDir,
        config,
        configPath,
        `${outDir}/dispatcher.bare.ts`,
        bareOptions,
        ['serialized']
      );
    } else {
      await emitProfileDispatcher(
        manifest,
        outDir,
        config,
        configPath,
        `${outDir}/dispatcher.trusted.ts`,
        trustedOptions,
        baseModes
      );
    }
  }
  await emitProfileDispatcher(
    manifest,
    outDir,
    config,
    configPath,
    `${outDir}/dispatcher.streaming.ts`,
    { ...baseOptions, includeDispatchWrapper: false },
    ['response']
  );
};

const emitDenoDispatcher = async (
  manifest: CompilerManifest,
  outDir: string,
  config: JoorConfig | undefined,
  configPath?: string
): Promise<void> => {
  const baseModes = ['serialized'] as const;
  const generationOptions: CompiledProcedureGenerationOptions = {
    includeDispatchWrapper: false,
    modes: baseModes,
    enforceRateLimit: config?.enforceRateLimit ?? true,
    validateHeaders: config?.validateHeaders ?? true,
    validateInput: config?.validateInput ?? true,
    validateOutput: config?.validateOutput ?? true,
    validateResponseHeaders: config?.validateResponseHeaders ?? true,
  };
  const trustedOptions: CompiledProcedureGenerationOptions = {
    ...generationOptions,
    enforceRateLimit: false,
    skipAuth: true,
    validateHeaders: false,
    validateInput: false,
    validateOutput: false,
    validateResponseHeaders: false,
  };
  const bareOptions: CompiledProcedureGenerationOptions = {
    ...trustedOptions,
    modes: baseModes,
  };
  const unsafeFastPath =
    config?.enforceRateLimit === false &&
    config.validateHeaders === false &&
    config.validateInput === false &&
    config.validateOutput === false &&
    config.validateResponseHeaders === false;
  const hasAuthProcedure = manifest.procedures.some(
    (entry) => entry.procedure.auth !== undefined
  );
  const useBareDispatcher =
    unsafeFastPath &&
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
  const safePath = `${outDir}/deno-dispatcher.safe.ts`;
  const trustedPath = `${outDir}/deno-dispatcher.trusted.ts`;
  const barePath = `${outDir}/deno-dispatcher.bare.ts`;
  const selectedPath = unsafeFastPath
    ? hasAuthProcedure
      ? safePath
      : useBareDispatcher
        ? barePath
        : trustedPath
    : safePath;
  const toModuleSpecifier = (filePath: string): string => {
    const segments = filePath.split(/[/\\]/);
    const module = segments.at(-1) ?? '';
    return `./${module}`;
  };
  await emitProfileDispatcher(
    manifest,
    outDir,
    config,
    configPath,
    safePath,
    generationOptions,
    baseModes
  );
  if (unsafeFastPath && hasAuthProcedure === false) {
    if (useBareDispatcher) {
      await emitProfileDispatcher(
        manifest,
        outDir,
        config,
        configPath,
        barePath,
        bareOptions,
        baseModes
      );
    } else {
      await emitProfileDispatcher(
        manifest,
        outDir,
        config,
        configPath,
        trustedPath,
        trustedOptions,
        baseModes
      );
    }
  }
  await writeFile(
    `${outDir}/deno-dispatcher.ts`,
    `export * from '${toModuleSpecifier(selectedPath)}';\n`
  );
};

const emitRuntimeTargets = async (
  manifest: CompilerManifest,
  outDir: string,
  config?: JoorConfig
): Promise<void> => {
  const configuredPath = JSON.stringify(config?.path ?? '/rpc');
  const configuredCors = JSON.stringify(config?.cors ?? null);
  const configuredMaxBodyBytes =
    typeof config?.maxBodyBytes === 'number' &&
    Number.isFinite(config.maxBodyBytes) &&
    config.maxBodyBytes >= 0
      ? Math.floor(config.maxBodyBytes)
      : 1024 * 1024;
  const unsafeFastPath =
    config?.enforceRateLimit === false &&
    config.validateHeaders === false &&
    config.validateInput === false &&
    config.validateOutput === false &&
    config.validateResponseHeaders === false;
  const hasAuthProcedure = manifest.procedures.some(
    (entry) => entry.procedure.auth !== undefined
  );
  const useBareDispatcher =
    unsafeFastPath &&
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
  const dispatcherImport = unsafeFastPath
    ? hasAuthProcedure
      ? './dispatcher.safe.js'
      : useBareDispatcher
        ? './dispatcher.bare.js'
        : './dispatcher.trusted.js'
    : './dispatcher.safe.js';
  const bunFastEntries = unsafeFastPath
    ? manifest.procedures.filter(
        (entry) =>
          entry.procedure.output !== undefined &&
          entry.procedure.context === 'none' &&
          entry.procedure.contextlessHandler !== undefined &&
          entry.procedure.auth === undefined &&
          entry.procedure.headers === undefined &&
          entry.procedure.responseHeaders === undefined &&
          entry.procedure.meta.cache === undefined &&
          entry.procedure.meta.rateLimit === undefined
      )
    : [];
  const bunFastImports = bunFastEntries
    .map((entry) => {
      const importPath = toImportPath(`${outDir}/bun.ts`, entry.importPath);
      return `import ${entry.exportName}_fast from '${importPath}';`;
    })
    .join('\n');
  const nodeFastImports = bunFastEntries
    .map((entry) => {
      const importPath = toImportPath(`${outDir}/node.ts`, entry.importPath);
      return `import ${entry.exportName}_fast from '${importPath}';`;
    })
    .join('\n');
  const bunFastHandlerConstants = bunFastEntries
    .map(
      (entry) =>
        `const ${entry.exportName}_fast_handler = ${entry.exportName}_fast.contextlessHandler;`
    )
    .join('\n');
  const nodeFastHandlerConstants = bunFastHandlerConstants;
  const bunFastCases = bunFastEntries
    .map(
      (entry) => `    case ${JSON.stringify(entry.id)}: {
      if (${entry.exportName}_fast_handler === undefined) return undefined;
      const trace = traceIdValue === undefined ? traceIdFromRequest(request) : traceIdValue;
      const result = ${entry.exportName}_fast_handler(body['input'] ?? {});
      return result instanceof Promise
        ? result.then((resolved) =>
            fastContextlessResultToResponse(${JSON.stringify(JSON.stringify(entry.id))}, trace, resolved, cors)
          )
        : fastContextlessResultToResponse(${JSON.stringify(JSON.stringify(entry.id))}, trace, result, cors);
    }`
    )
    .join('\n');
  const nodeFastCases = bunFastEntries
    .map(
      (entry) => `    case ${JSON.stringify(entry.id)}: {
      if (${entry.exportName}_fast_handler === undefined) return false;
      const trace = typeof traceIdValue === 'string'
        ? traceIdValue
        : traceIdFromIncoming(incoming);
      const result = ${entry.exportName}_fast_handler(body['input'] ?? {});
      if (result instanceof Promise) {
        await result.then((resolved) =>
          writeFastContextlessResult(outgoing, ${JSON.stringify(JSON.stringify(entry.id))}, trace, resolved, cors)
        );
        return true;
      }
      writeFastContextlessResult(outgoing, ${JSON.stringify(JSON.stringify(entry.id))}, trace, result, cors);
      return true;
    }`
    )
    .join('\n');
  const bunFastContextlessUnary =
    bunFastEntries.length === 0
      ? `const fastContextlessUnary = (
  _body: JsonObject,
  _request: Request,
  _cors?: Record<string, string>
): Promise<Response | undefined> | Response | undefined => undefined;`
      : `const fastContextlessResultToResponse = (
  idBody: string,
  trace: string,
  result: JsonValue,
  cors?: Record<string, string>
): Response => {
  const headers = createJsonHeaderRecord(cors);
  if (
    typeof result === 'object' &&
    result !== null &&
    !Array.isArray(result) &&
    'kind' in result
  ) {
    if (result.kind === 'error') {
      return new Response(
        failureBodyFromIdBody(idBody, trace, result.error.code, result.error.message, result.error.status),
        { status: 200, headers }
      );
    }
    return result.headers === undefined
      ? new Response(successBody(idBody, trace, result.data), { status: 200, headers })
      : (() => {
          appendJsonStringHeaders(headers, result.headers);
          return new Response(successBody(idBody, trace, result.data, result.headers), {
          status: 200,
          headers,
        });
        })();
  }
  return new Response(successBody(idBody, trace, result), { status: 200, headers });
};

const fastContextlessUnary = (
  body: JsonObject,
  request: Request,
  cors?: Record<string, string>
): Promise<Response | undefined> | Response | undefined => {
  const id = body['id'];
  const traceIdValue = body['traceId'];
  if (
    typeof id !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return undefined;
  }
  switch (id) {
${bunFastCases}
    default:
      return undefined;
  }
};`;
  const nodeFastContextlessUnary =
    bunFastEntries.length === 0
      ? `const fastContextlessUnary = (
  _body: JsonObject,
  _incoming: IncomingMessage,
  _outgoing: ServerResponse<IncomingMessage>,
  _cors?: Record<string, string>
): Promise<boolean> | boolean => false;`
      : `const writeFastContextlessResult = (
  outgoing: ServerResponse<IncomingMessage>,
  idBody: string,
  trace: string,
  result: JsonValue,
  cors?: Record<string, string>
): void => {
  const headers = createJsonHeaderRecord(cors);
  if (
    typeof result === 'object' &&
    result !== null &&
    !Array.isArray(result) &&
    'kind' in result
  ) {
    if (result.kind === 'error') {
      outgoing.writeHead(200, headers);
      outgoing.end(
        failureBodyFromIdBody(idBody, trace, result.error.code, result.error.message, result.error.status)
      );
      return;
    }
    if (result.headers === undefined) {
      outgoing.writeHead(200, headers);
      outgoing.end(successBody(idBody, trace, result.data));
      return;
    }
    appendJsonStringHeaders(headers, result.headers);
    outgoing.writeHead(200, headers);
    outgoing.end(successBody(idBody, trace, result.data, result.headers));
    return;
  }
  outgoing.writeHead(200, headers);
  outgoing.end(successBody(idBody, trace, result));
};

const fastContextlessUnary = async (
  body: JsonObject,
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>,
  cors?: Record<string, string>
): Promise<boolean> => {
  const id = body['id'];
  const traceIdValue = body['traceId'];
  if (
    typeof id !== 'string' ||
    (traceIdValue !== undefined && typeof traceIdValue !== 'string')
  ) {
    return false;
  }
  switch (id) {
${nodeFastCases}
    default:
      return false;
  }
};`;
  const denoUseCompiledUnaryFastPath = useBareDispatcher;
  const denoTransportImport = denoUseCompiledUnaryFastPath
    ? "import { createDenoCompiledTransportRequestHandler } from 'joor/runtime/deno-compiled-transport';"
    : "import { createDenoTransportRequestHandler } from 'joor/runtime/deno-transport';";
  const denoDispatcherImport = denoUseCompiledUnaryFastPath
    ? "import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from './deno-dispatcher.ts';"
    : "import { nativeTransport } from './deno-dispatcher.ts';";
  const denoCreateFetchReturn = denoUseCompiledUnaryFastPath
    ? `return createDenoCompiledTransportRequestHandler(
    nativeRuntime,
    nativeTransport,
    nativeUnaryDispatch,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`
    : `return createDenoTransportRequestHandler(
    nativeTransport,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`;

  const fetchFile = `${outDir}/fetch.ts`;
  await writeFile(
    fetchFile,
    `import { fetch } from '${dispatcherImport}';

export { fetch };
export default fetch;
`
  );

  const nodeFile = `${outDir}/node.ts`;
  await writeFile(
    nodeFile,
    `import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { JsonValue } from 'joor/schema';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBody, type NativeTransportResult } from '${dispatcherImport}';
${nodeFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

interface RequestSource {
  url: string;
  method: string;
  signal: AbortSignal;
  remoteAddress: string | undefined;
  getHeader(name: string): string | null;
  toHeaders(): Headers;
  toRequest(): Request;
}

const configuredPath = ${configuredPath};
const configuredCors = ${configuredCors};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const checkContentType = ${bunFastEntries.length === 0 ? 'true' : 'false'};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const neverAbortedSignal = new AbortController().signal;
const headerNamePattern = /^[A-Za-z0-9!#$%&'*+.^_|~-]+$/;
const blockedResponseHeaders = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
let traceCounter = 0;

class BodySizeLimitError extends Error {}

const normalizeMaxBodyBytes = (value?: number): number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : defaultMaxBodyBytes;

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const isJsonObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSerializedEnvelope = (
  result: NativeTransportResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  typeof result === 'object' &&
  result !== null &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\\0') || value.includes('\\r') || value.includes('\\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target['cache-control'] = cacheControl;
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target[key] = value;
    }
  }
};

const createJsonHeaderRecord = (
  source?: Record<string, string>
): Record<string, string> => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

const corsHeaders = (cors: NativeCorsOptions): Record<string, string> => {
  if (cors.origin === undefined) return {};
  if (hasInvalidHeaderValue(cors.origin)) return {};
  const methods = (cors.methods ?? ['POST', 'OPTIONS']).join(', ');
  const headers = (cors.headers ?? ['content-type', 'accept', 'x-request-id']).join(', ');
  return {
    'access-control-allow-origin': cors.origin,
    ...(hasInvalidHeaderValue(methods) ? {} : { 'access-control-allow-methods': methods }),
    ...(hasInvalidHeaderValue(headers) ? {} : { 'access-control-allow-headers': headers }),
  };
};

const resolveCorsHeaders = (
  cors: NativeCorsOptions | false | undefined
): Record<string, string> | undefined => {
  if (cors === false) return undefined;
  if (cors !== undefined) return corsHeaders(cors);
  const configured = configuredCors as NativeCorsOptions | null;
  return configured === null ? undefined : corsHeaders(configured);
};

const getIncomingHeader = (
  incoming: IncomingMessage,
  name: string
): string | null => {
  const value = incoming.headers[name.toLowerCase()];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return null;
};

const headersFromIncoming = (incoming: IncomingMessage): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    }
  }
  return headers;
};

class IncomingRequestSource implements RequestSource {
  readonly method: string;
  readonly url: string;
  readonly signal = neverAbortedSignal;
  readonly remoteAddress: string | undefined;
  private headers?: Headers;
  private request?: Request;

  constructor(
    private readonly incoming: IncomingMessage,
    hostname: string
  ) {
    this.method = incoming.method ?? 'GET';
    this.url =
      'http://' + (incoming.headers.host ?? hostname) + (incoming.url ?? '/rpc');
    this.remoteAddress = incoming.socket.remoteAddress;
  }

  getHeader(name: string): string | null {
    return getIncomingHeader(this.incoming, name);
  }

  toHeaders(): Headers {
    this.headers ??= headersFromIncoming(this.incoming);
    return this.headers;
  }

  toRequest(): Request {
    this.request ??= new Request(this.url, {
      headers: this.toHeaders(),
      method: this.method,
    });
    return this.request;
  }
}

const matchesPath = (url: string, path: string): boolean => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return path === '/';
  if (!url.startsWith(path, pathStart)) return false;
  const next = url[pathStart + path.length];
  return next === undefined || next === '?' || next === '#';
};

const isJsonContentType = (value: string): boolean => {
  if (value === 'application/json') return true;
  const semicolonIndex = value.indexOf(';');
  const type = semicolonIndex === -1 ? value : value.slice(0, semicolonIndex);
  const normalized = type.trim().toLowerCase();
  return normalized === 'application/json' || normalized.endsWith('+json');
};

const traceId = (request: RequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const traceIdFromIncoming = (incoming: IncomingMessage): string => {
  const headerTrace = getIncomingHeader(incoming, 'x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const successBody = (
  idBody: string,
  trace: string,
  data: JsonValue,
  headers?: Record<string, string>
): string =>
  headers === undefined
    ? '{"ok":true,"id":' +
      idBody +
      ',"traceId":' +
      JSON.stringify(trace) +
      ',"data":' +
      JSON.stringify(data) +
      '}'
    : '{"ok":true,"id":' +
      idBody +
      ',"traceId":' +
      JSON.stringify(trace) +
      ',"data":' +
      JSON.stringify(data) +
      ',"headers":' +
      JSON.stringify(headers) +
      '}';

const failureBodyFromIdBody = (
  idBody: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  '{"ok":false,"id":' +
  idBody +
  ',"traceId":' +
  JSON.stringify(trace) +
  ',"error":' +
  JSON.stringify({ code, message, status }) +
  '}';

const failureBody = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  JSON.stringify({
    ok: false,
    id,
    traceId: trace,
    error: { code, message, status },
  });

const preflight = (
  request: RequestSource,
  path: string,
  cors: Record<string, string> | undefined
): NativeTransportResult | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404, headers: cors ?? {} });
  }
  if (request.method === 'OPTIONS' && cors !== undefined) {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { allow: 'POST', ...cors },
    });
  }
  const contentType = checkContentType
    ? (request.getHeader('content-type') ?? '')
    : 'application/json';
  if (checkContentType && !isJsonContentType(contentType)) {
    const body = failureBody(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      );
    return cors === undefined ? { body } : { body, headers: cors };
  }
  return undefined;
};

const writeIncomingPreflightFailure = (
  outgoing: ServerResponse<IncomingMessage>,
  incoming: IncomingMessage,
  path: string,
  cors: Record<string, string> | undefined
): boolean => {
  const url = incoming.url ?? '/rpc';
  if (!matchesPath(url, path)) {
    outgoing.writeHead(404, cors);
    outgoing.end();
    return true;
  }
  if ((incoming.method ?? 'GET') === 'OPTIONS' && cors !== undefined) {
    outgoing.writeHead(204, cors);
    outgoing.end();
    return true;
  }
  if ((incoming.method ?? 'GET') !== 'POST') {
    outgoing.writeHead(405, { allow: 'POST', ...cors });
    outgoing.end();
    return true;
  }
  if (checkContentType) {
    const contentType = getIncomingHeader(incoming, 'content-type') ?? '';
    if (!isJsonContentType(contentType)) {
      outgoing.writeHead(200, createJsonHeaderRecord(cors));
      outgoing.end(
        failureBody(
          '',
          traceIdFromIncoming(incoming),
          'UNSUPPORTED_MEDIA_TYPE',
          'Content-Type must be application/json',
          415
        )
      );
      return true;
    }
  }
  return false;
};

const chunkToBuffer = (chunk: string | Buffer): Buffer =>
  typeof chunk === 'string' ? Buffer.from(chunk) : chunk;

const readIncomingBody = async (
  incoming: IncomingMessage,
  limit: number
): Promise<Buffer> => {
  const contentLength = incoming.headers['content-length'];
  if (Array.isArray(contentLength)) {
    throw new Error('Multiple Content-Length headers');
  }
  if (typeof contentLength === 'string') {
    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > limit) {
      throw new BodySizeLimitError();
    }
  }
  let first: Buffer | undefined;
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of incoming) {
    const buffer = chunkToBuffer(chunk);
    total += buffer.byteLength;
    if (total > limit) {
      throw new BodySizeLimitError();
    }
    if (first === undefined) first = buffer;
    else chunks.push(buffer);
  }
  if (first === undefined) return Buffer.alloc(0);
  if (chunks.length === 0) return first;
  chunks.unshift(first);
  return Buffer.concat(chunks, total);
};

const writeResponseChunk = (
  outgoing: ServerResponse<IncomingMessage>,
  chunk: Uint8Array
): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const buffer = Buffer.from(
      chunk.buffer,
      chunk.byteOffset,
      chunk.byteLength
    );
    if (outgoing.write(buffer)) {
      resolvePromise();
      return;
    }
    const cleanup = (): void => {
      outgoing.off('drain', onDrain);
      outgoing.off('error', onError);
    };
    const onDrain = (): void => {
      cleanup();
      resolvePromise();
    };
    const onError = (error: Error): void => {
      cleanup();
      reject(error);
    };
    outgoing.once('drain', onDrain);
    outgoing.once('error', onError);
  });

const writeWebResponseBody = async (
  outgoing: ServerResponse<IncomingMessage>,
  body: ReadableStream<Uint8Array>
): Promise<void> => {
  const reader = body.getReader();
  try {
    for (;;) {
      const read = await reader.read();
      if (read.done) break;
      await writeResponseChunk(outgoing, read.value);
    }
  } finally {
    reader.releaseLock();
    outgoing.end();
  }
};

const writeResult = async (
  outgoing: ServerResponse<IncomingMessage>,
  result: NativeTransportResult,
  cors?: Record<string, string>
): Promise<void> => {
  if (isSerializedEnvelope(result)) {
    const headers = createJsonHeaderRecord(
      result.responseHeaders ?? result.headers
    );
    if (cors !== undefined) appendJsonStringHeaders(headers, cors);
    outgoing.writeHead(
      200,
      headers
    );
    outgoing.end(result.body);
    return;
  }
  if (result instanceof Response) {
    const headers = Object.fromEntries(result.headers);
    if (cors !== undefined) appendJsonStringHeaders(headers, cors);
    outgoing.writeHead(result.status, headers);
    if (result.body === null) {
      outgoing.end();
      return;
    }
    await writeWebResponseBody(outgoing, result.body);
    return;
  }
  const headers = createJsonHeaderRecord();
  if (cors !== undefined) appendJsonStringHeaders(headers, cors);
  if (isJsonObject(result) && result['ok'] === true) {
    const responseHeaders = result['headers'];
    if (isJsonObject(responseHeaders)) {
      appendJsonStringHeaders(headers, responseHeaders);
    }
  }
  outgoing.writeHead(200, headers);
  outgoing.end(JSON.stringify(result));
};

const writeBodyReadFailure = (
  outgoing: ServerResponse<IncomingMessage>,
  request: RequestSource,
  error: object,
  cors?: Record<string, string>
): void => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  outgoing.writeHead(status, createJsonHeaderRecord(cors));
  outgoing.end(
    failureBody(
      '',
      request.getHeader('x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    )
  );
};

const writeIncomingBodyReadFailure = (
  outgoing: ServerResponse<IncomingMessage>,
  incoming: IncomingMessage,
  error: object,
  cors?: Record<string, string>
): void => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  outgoing.writeHead(status, createJsonHeaderRecord(cors));
  outgoing.end(
    failureBody(
      '',
      getIncomingHeader(incoming, 'x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    )
  );
};

${nodeFastHandlerConstants}
${nodeFastContextlessUnary}

export interface NodeNativeOptions {
  hostname?: string;
  path?: string;
  cors?: NativeCorsOptions | false;
  maxBodyBytes?: number;
}

export interface NativeCorsOptions {
  origin?: string;
  methods?: string[];
  headers?: string[];
}

export interface NodeListenOptions extends NodeNativeOptions {
  port?: number;
}

export type NodeNativeHandler = (
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
) => Promise<void>;

export interface NodeNativeServer {
  readonly listening: boolean;
  address(): AddressInfo | string | null;
  close(callback?: (error?: Error) => void): this;
  ref(): this;
  unref(): this;
}

export const createHandler = (
  options: NodeNativeOptions = {}
): NodeNativeHandler => {
  const hostname = options.hostname ?? '0.0.0.0';
  const path = options.path ?? configuredPath;
  const cors = resolveCorsHeaders(options.cors);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  return async (
    incoming: IncomingMessage,
    outgoing: ServerResponse<IncomingMessage>
  ): Promise<void> => {
    let request: IncomingRequestSource | undefined;
    ${
      bunFastEntries.length === 0
        ? `request = new IncomingRequestSource(incoming, hostname);
    const early = preflight(request, path, cors);
    if (early !== undefined) {
      await writeResult(outgoing, early, cors);
      return;
    }`
        : `if (writeIncomingPreflightFailure(outgoing, incoming, path, cors)) return;`
    }
    let body: JsonValue;
    try {
      const buffer = await readIncomingBody(incoming, bodyLimit);
      body = buffer.length === 0 ? {} : parseJson(buffer.toString('utf8'));
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      if (request === undefined) writeIncomingBodyReadFailure(outgoing, incoming, error, cors);
      else writeBodyReadFailure(outgoing, request, error, cors);
      return;
    }
    if (isJsonObject(body)) {
      const handled = await fastContextlessUnary(body, incoming, outgoing, cors);
      if (handled) return;
      request ??= new IncomingRequestSource(incoming, hostname);
      const services =
        nativeRuntime.services ?? (await nativeRuntime.resolveServices());
      const result = await nativeUnaryDispatch(
        body,
        request,
        services,
        nativeRuntime.runtime,
        compiledUncachedExecutionState
      );
      if (result !== undefined) {
        await writeResult(outgoing, result as NativeTransportResult, cors);
        return;
      }
    }
    request ??= new IncomingRequestSource(incoming, hostname);
    await writeResult(
      outgoing,
      await nativeTransport(request, body as NativeBody),
      cors
    );
  };
};

export const handler: NodeNativeHandler = createHandler();

export const listen = (options: NodeListenOptions = {}): NodeNativeServer => {
  const hostname = options.hostname ?? '0.0.0.0';
  const server = createServer(createHandler(options));
  server.listen(options.port ?? 3000, hostname);
  return server;
};
`
  );

  const bunFile = `${outDir}/bun.ts`;
  await writeFile(
    bunFile,
    `import type { JsonValue } from 'joor/schema';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBody, type NativeTransportResult } from '${dispatcherImport}';
${bunFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

const configuredPath = ${configuredPath};
const configuredCors = ${configuredCors};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const checkContentType = ${bunFastEntries.length === 0 ? 'true' : 'false'};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const jsonOkResponseInit: ResponseInit = { status: 200, headers: jsonHeaders };
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const headerNamePattern = /^[A-Za-z0-9!#$%&'*+.^_|~-]+$/;
const blockedResponseHeaders = new Set([
  'connection',
  'content-length',
  'content-type',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
let traceCounter = 0;

class BodySizeLimitError extends Error {}

class FetchRequestSource {
  readonly url: string;
  readonly method: string;
  readonly signal: AbortSignal;
  readonly remoteAddress = undefined;

  constructor(private readonly request: Request) {
    this.url = request.url;
    this.method = request.method;
    this.signal = request.signal;
  }

  getHeader(name: string): string | null {
    return this.request.headers.get(name);
  }

  toHeaders(): Headers {
    return this.request.headers;
  }

  toRequest(): Request {
    return this.request;
  }
}

const normalizeMaxBodyBytes = (value?: number): number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : defaultMaxBodyBytes;

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const isJsonObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSerializedEnvelope = (
  result: NativeTransportResult
): result is SerializedJsonEnvelope =>
  !(result instanceof Response) &&
  typeof result === 'object' &&
  result !== null &&
  !Array.isArray(result) &&
  'body' in result &&
  typeof result.body === 'string';

const hasInvalidHeaderValue = (value: string): boolean =>
  value.includes('\\0') || value.includes('\\r') || value.includes('\\n');

const isSafeResponseHeader = (name: string, value: string): boolean => {
  if (hasInvalidHeaderValue(value)) return false;
  if (name === 'cache-control' || name === 'etag') return true;
  return (
    headerNamePattern.test(name) &&
    !blockedResponseHeaders.has(name.toLowerCase())
  );
};

const appendJsonStringHeaders = (
  target: Record<string, string>,
  source: JsonObject
): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target['cache-control'] = cacheControl;
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target[key] = value;
    }
  }
};

const createJsonHeaderRecord = (
  source?: Record<string, string>
): Record<string, string> => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (source !== undefined) appendJsonStringHeaders(headers, source);
  return headers;
};

const corsHeaders = (cors: NativeCorsOptions): Record<string, string> => {
  if (cors.origin === undefined) return {};
  if (hasInvalidHeaderValue(cors.origin)) return {};
  const methods = (cors.methods ?? ['POST', 'OPTIONS']).join(', ');
  const headers = (cors.headers ?? ['content-type', 'accept', 'x-request-id']).join(', ');
  return {
    'access-control-allow-origin': cors.origin,
    ...(hasInvalidHeaderValue(methods) ? {} : { 'access-control-allow-methods': methods }),
    ...(hasInvalidHeaderValue(headers) ? {} : { 'access-control-allow-headers': headers }),
  };
};

const resolveCorsHeaders = (
  cors: NativeCorsOptions | false | undefined
): Record<string, string> | undefined => {
  if (cors === false) return undefined;
  if (cors !== undefined) return corsHeaders(cors);
  const configured = configuredCors as NativeCorsOptions | null;
  return configured === null ? undefined : corsHeaders(configured);
};

const appendJsonHeaders = (target: Headers, source: JsonObject): void => {
  const cacheControl = source['cache-control'];
  if (
    Object.hasOwn(source, 'cache-control') &&
    typeof cacheControl === 'string' &&
    !hasInvalidHeaderValue(cacheControl)
  ) {
    target.set('cache-control', cacheControl);
  }
  for (const key in source) {
    if (key === 'cache-control') continue;
    if (!Object.hasOwn(source, key)) continue;
    const value = source[key];
    if (typeof value === 'string' && isSafeResponseHeader(key, value)) {
      target.set(key, value);
    }
  }
};

const transportResultToResponse = (
  result: NativeTransportResult,
  cors?: Record<string, string>
): Response => {
  if (isSerializedEnvelope(result)) {
    if (result.responseHeaders !== undefined) {
      const headers = createJsonHeaderRecord(result.responseHeaders);
      if (cors !== undefined) appendJsonStringHeaders(headers, cors);
      return new Response(result.body, {
        status: 200,
        headers,
      });
    }
    const headers = createJsonHeaderRecord(cors);
    if (result.headers !== undefined) {
      appendJsonStringHeaders(headers, result.headers);
    }
    return new Response(result.body, {
      status: 200,
      headers,
    });
  }
  if (result instanceof Response) {
    const responseHeaders = new Headers(result.headers);
    if (cors !== undefined) appendJsonHeaders(responseHeaders, cors);
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: responseHeaders,
    });
  }
  const headers = new Headers(jsonHeaders);
  if (cors !== undefined) appendJsonHeaders(headers, cors);
  if (!isJsonObject(result) || result['ok'] !== true) {
    return new Response(JSON.stringify(result), { status: 200, headers });
  }
  const responseHeaders = result['headers'];
  if (!isJsonObject(responseHeaders)) {
    return new Response(JSON.stringify(result), { status: 200, headers });
  }
  appendJsonHeaders(headers, responseHeaders);
  return new Response(JSON.stringify(result), { status: 200, headers });
};

const parseContentLength = (request: Request): number | undefined => {
  const value = request.headers.get('content-length');
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
};

const assertTextWithinLimit = (text: string, maxBodyBytes: number): void => {
  if (text.length > maxBodyBytes) {
    throw new BodySizeLimitError();
  }
  if (text.length * 4 <= maxBodyBytes) return;
  if (encoder.encode(text).byteLength <= maxBodyBytes) return;
  throw new BodySizeLimitError();
};

const readStreamText = async (
  request: Request,
  maxBodyBytes: number
): Promise<string> => {
  const body = request.body;
  if (body === null) return '';
  const reader = body.getReader();
  let firstChunk: Uint8Array | undefined;
  let chunks: Uint8Array[] | undefined;
  let total = 0;
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    total += read.value.byteLength;
    if (total > maxBodyBytes) {
      try {
        await reader.cancel();
      } catch {}
      throw new BodySizeLimitError();
    }
    if (firstChunk === undefined) firstChunk = read.value;
    else {
      chunks ??= [];
      chunks.push(read.value);
    }
  }
  if (firstChunk === undefined) return '';
  if (chunks === undefined) return decoder.decode(firstChunk);
  chunks.unshift(firstChunk);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return decoder.decode(merged);
};

const readJsonBody = async (
  request: Request,
  limit: number
): Promise<JsonValue> => {
  const contentLength = parseContentLength(request);
  if (contentLength === 0) return {};
  if (contentLength !== undefined) {
    if (contentLength > limit) throw new BodySizeLimitError();
    const text = await request.text();
    assertTextWithinLimit(text, limit);
    return text.length === 0 ? {} : parseJson(text);
  }
  const text = await readStreamText(request, limit);
  return text.length === 0 ? {} : parseJson(text);
};

const readJsonBodyUnchecked = async (request: Request): Promise<JsonValue> => {
  const text = await request.text();
  return text.length === 0 ? {} : parseJson(text);
};

const matchesPath = (url: string, path: string): boolean => {
  const protocolIndex = url.indexOf('://');
  const pathStart =
    protocolIndex === -1 ? 0 : url.indexOf('/', protocolIndex + 3);
  if (pathStart === -1) return path === '/';
  if (!url.startsWith(path, pathStart)) return false;
  const next = url[pathStart + path.length];
  return next === undefined || next === '?' || next === '#';
};

const isJsonContentType = (value: string): boolean => {
  if (value === 'application/json') return true;
  const semicolonIndex = value.indexOf(';');
  const type = semicolonIndex === -1 ? value : value.slice(0, semicolonIndex);
  const normalized = type.trim().toLowerCase();
  return normalized === 'application/json' || normalized.endsWith('+json');
};

const traceId = (request: FetchRequestSource, requested?: string): string => {
  if (requested !== undefined) return requested;
  const headerTrace = request.getHeader('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const traceIdFromRequest = (request: Request): string => {
  const headerTrace = request.headers.get('x-request-id');
  if (headerTrace !== null) return headerTrace;
  traceCounter += 1;
  return 'trace-' + traceCounter;
};

const successBody = (
  idBody: string,
  trace: string,
  data: JsonValue,
  headers?: Record<string, string>
): string =>
  headers === undefined
    ? '{"ok":true,"id":' +
      idBody +
      ',"traceId":' +
      JSON.stringify(trace) +
      ',"data":' +
      JSON.stringify(data) +
      '}'
    : '{"ok":true,"id":' +
      idBody +
      ',"traceId":' +
      JSON.stringify(trace) +
      ',"data":' +
      JSON.stringify(data) +
      ',"headers":' +
      JSON.stringify(headers) +
      '}';

const failureBodyFromIdBody = (
  idBody: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  '{"ok":false,"id":' +
  idBody +
  ',"traceId":' +
  JSON.stringify(trace) +
  ',"error":' +
  JSON.stringify({ code, message, status }) +
  '}';

const failureBody = (
  id: string,
  trace: string,
  code: string,
  message: string,
  status: number
): string =>
  JSON.stringify({
    ok: false,
    id,
    traceId: trace,
    error: { code, message, status },
  });

const preflight = (
  request: Request,
  path: string,
  cors: Record<string, string> | undefined
): Response | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404, headers: cors ?? {} });
  }
  if (request.method === 'OPTIONS' && cors !== undefined) {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { allow: 'POST', ...cors },
    });
  }
  if (checkContentType) {
    const contentType = request.headers.get('content-type') ?? '';
    if (!isJsonContentType(contentType)) {
      return new Response(
        failureBody(
          '',
          traceIdFromRequest(request),
          'UNSUPPORTED_MEDIA_TYPE',
          'Content-Type must be application/json',
          415
        ),
        { status: 200, headers: createJsonHeaderRecord(cors) }
      );
    }
  }
  return undefined;
};

const bodyReadFailure = (
  request: Request,
  error: object,
  cors?: Record<string, string>
): Response => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  return new Response(
    failureBody(
      '',
      request.headers.get('x-request-id') ?? 'trace-body-error',
      payloadTooLarge ? 'PAYLOAD_TOO_LARGE' : 'PARSE_ERROR',
      payloadTooLarge ? 'Request body too large' : 'Invalid JSON body',
      status
    ),
    { status, headers: createJsonHeaderRecord(cors) }
  );
};

${bunFastHandlerConstants}
${bunFastContextlessUnary}

export interface BunNativeOptions {
  hostname?: string;
  path?: string;
  cors?: NativeCorsOptions | false;
  maxBodyBytes?: number;
  port?: number;
}

export interface NativeCorsOptions {
  origin?: string;
  methods?: string[];
  headers?: string[];
}

export type BunNativeFetchHandler = (request: Request) => Promise<Response>;

export interface BunNativeServer {
  readonly hostname?: string;
  readonly port?: number;
  readonly url?: URL;
  stop?(force?: boolean): void;
  ref?(): void;
  unref?(): void;
}

export const createFetch = (
  options: BunNativeOptions = {}
): BunNativeFetchHandler => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsHeaders(options.cors);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  const unlimitedBody = bodyLimit >= Number.MAX_SAFE_INTEGER;
  return async (request: Request): Promise<Response> => {
    const early = preflight(request, path, cors);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = unlimitedBody
        ? await readJsonBodyUnchecked(request)
        : await readJsonBody(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error, cors);
    }
    if (isJsonObject(body)) {
      const fastValue = fastContextlessUnary(body, request, cors);
      const fast =
        fastValue instanceof Promise ? await fastValue : fastValue;
      if (fast !== undefined) return fast;
    }
    const source = new FetchRequestSource(request);
    const services =
      nativeRuntime.services ?? (await nativeRuntime.resolveServices());
    if (isJsonObject(body)) {
      const result = await nativeUnaryDispatch(
        body,
        source,
        services,
        nativeRuntime.runtime,
        compiledUncachedExecutionState
      );
      if (result !== undefined) {
        return transportResultToResponse(result as NativeTransportResult, cors);
      }
    }
    return transportResultToResponse(
      await nativeTransport(source, body as NativeBody),
      cors
    );
  };
};

export const fetch: BunNativeFetchHandler = createFetch();

export const serve = (options: BunNativeOptions = {}): BunNativeServer => {
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(config: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): BunNativeServer;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  return bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch: createFetch(options),
  });
};
`
  );

  const denoFile = `${outDir}/deno.ts`;
  await writeFile(
    denoFile,
    `${denoTransportImport}
import { createRpcRequestPreflight } from 'joor';
${denoDispatcherImport}

const configuredPath = ${configuredPath};
const configuredCors = ${configuredCors};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};

export interface NativeCorsOptions {
  origin?: string;
  methods?: string[];
  headers?: string[];
}

const resolveCorsOptions = (
  cors: NativeCorsOptions | false | undefined
): NativeCorsOptions | undefined => {
  if (cors === false) return undefined;
  if (cors !== undefined) return cors;
  const configured = configuredCors as NativeCorsOptions | null;
  return configured === null ? undefined : configured;
};

export interface DenoNativeOptions {
  hostname?: string;
  path?: string;
  cors?: NativeCorsOptions | false;
  maxBodyBytes?: number;
  port?: number;
}

export type DenoNativeFetchHandler = (request: Request) => Promise<Response>;

export interface DenoNativeServer {
  readonly finished: Promise<void>;
  shutdown(): Promise<void>;
  ref?(): void;
  unref?(): void;
}

export const createFetch = (
  options: DenoNativeOptions = {}
): DenoNativeFetchHandler => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsOptions(options.cors);
  const bodyLimit =
    options.maxBodyBytes ?? configuredMaxBodyBytes;
  ${denoCreateFetchReturn}
};

export const fetch: DenoNativeFetchHandler = createFetch();

export const serve = (options: DenoNativeOptions = {}): DenoNativeServer => {
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(config: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): DenoNativeServer;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  return denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: createFetch(options),
  });
};
`
  );
};

const emitClient = async (
  manifest: CompilerManifest,
  outDir: string,
  config?: JoorConfig
): Promise<void> => {
  interface ClientTree {
    procedures: string[];
    children: Map<string, ClientTree>;
  }
  const createNode = (): ClientTree => ({
    procedures: [],
    children: new Map(),
  });
  const tree = createNode();
  const entryById = new Map(
    manifest.procedures.map((entry) => [entry.id, entry])
  );
  for (const entry of manifest.procedures) {
    const parts = entry.id.split('.');
    const methodName = parts.pop();
    if (methodName === undefined) continue;
    let node = tree;
    for (const part of parts) {
      const child = node.children.get(part) ?? createNode();
      node.children.set(part, child);
      node = child;
    }
    node.procedures.push(entry.id);
  }
  const renderNode = (node: ClientTree, depth: number): string => {
    const indent = '  '.repeat(depth);
    const childBlocks = [...node.children.entries()]
      .map(
        ([name, child]) => `${indent}${JSON.stringify(name)}: {
${renderNode(child, depth + 1)}
${indent}},`
      )
      .join('\n');
    const procedureBlocks = node.procedures
      .map((id) => {
        const name = id.split('.').at(-1);
        if (name === undefined) return '';
        const entry = entryById.get(id);
        if (entry === undefined) return '';
        const methods =
          entry.procedure.stream === undefined
            ? `routeUnary(${JSON.stringify(id)})`
            : `routeStream(${JSON.stringify(id)})`;
        return `${indent}${JSON.stringify(name)}: ${methods},`;
      })
      .join('\n');
    return [childBlocks, procedureBlocks].filter(Boolean).join('\n');
  };
  const renderTypeNode = (node: ClientTree, depth: number): string => {
    const indent = '  '.repeat(depth);
    const childBlocks = [...node.children.entries()]
      .map(
        ([name, child]) => `${indent}${JSON.stringify(name)}: {
${renderTypeNode(child, depth + 1)}
${indent}};`
      )
      .join('\n');
    const procedureBlocks = node.procedures
      .map((id) => {
        const name = id.split('.').at(-1);
        if (name === undefined) return '';
        const entry = entryById.get(id);
        if (entry === undefined) return '';
        const typeName =
          entry.procedure.stream === undefined
            ? 'RouteUnaryFunction'
            : 'RouteStreamFunction';
        return `${indent}${JSON.stringify(name)}: ${typeName}<${JSON.stringify(id)}>;`;
      })
      .join('\n');
    return [childBlocks, procedureBlocks].filter(Boolean).join('\n');
  };
  const clientBody = renderNode(tree, 2);
  const clientTypeBody = renderTypeNode(tree, 1);
  const defaultUrl = config?.path ?? '/rpc';
  await writeFile(
    `${outDir}/client.ts`,
    `import { createManifestClient as createTransportClient, createManifestRouteProtocolRequest as createTransportRouteProtocolRequest, createManifestRouteRequest as createTransportRouteRequest, createManifestRouteStreamProtocolRequest as createTransportRouteStreamProtocolRequest, createManifestRouteStreamRequest as createTransportRouteStreamRequest, createManifestRouteUnaryProtocolRequest as createTransportRouteUnaryProtocolRequest, type ClientBatchOptions, type RpcProtocolRequestOptions } from 'joor/client';
import type { JoorManifestClientOptions, JoorManifestRouteBatchRequest, JoorManifestRouteBatchResults, JoorManifestRouteBody, JoorManifestRouteBodyResult, JoorManifestRouteBodyResultFor, JoorManifestRouteClientArgs, JoorManifestRouteClientHeaders, JoorManifestRouteEnvelope, JoorManifestRouteEnvelopeUnion, JoorManifestRouteError, JoorManifestRouteErrorCode, JoorManifestRouteErrorDetails, JoorManifestRouteHasHeaders, JoorManifestRouteHasResponseHeaders, JoorManifestRouteHeaders, JoorManifestRouteId, JoorManifestRouteInput, JoorManifestRouteOutput, JoorManifestRouteProcedure, JoorManifestRouteProtocolBatchRequest, JoorManifestRouteProtocolRequest, JoorManifestRouteProtocolRequestUnion, JoorManifestRouteRequest, JoorManifestRouteRequestOptions, JoorManifestRouteRequestUnion, JoorManifestRouteRequiresHeaders, JoorManifestRouteRequiresResponseHeaders, JoorManifestRouteResponseHeaders, JoorManifestRequiredServices, JoorManifestRouteResult, JoorManifestRouteResultUnion, JoorManifestRouteServices, JoorManifestRouteStreamEvent, JoorManifestRouteStreamId, JoorManifestRouteStreamProtocolRequest, JoorManifestRouteStreamProtocolRequestUnion, JoorManifestRouteStreamRequest, JoorManifestRouteStreamRequestUnion, JoorManifestRouteUnaryId, JoorManifestRouteUnaryProcedure, JoorManifestRouteStreamProcedure, JoorManifestRouteUnaryInput, JoorManifestRouteStreamInput, JoorManifestRouteUnaryOutput, JoorManifestRouteStreamOutput, JoorManifestRouteUnaryHeaders, JoorManifestRouteStreamHeaders, JoorManifestRouteUnaryClientHeaders, JoorManifestRouteStreamClientHeaders, JoorManifestRouteUnaryResponseHeaders, JoorManifestRouteStreamResponseHeaders, JoorManifestRouteUnaryError, JoorManifestRouteStreamError, JoorManifestRouteUnaryErrorCode, JoorManifestRouteStreamErrorCode, JoorManifestRouteUnaryErrorDetails, JoorManifestRouteStreamErrorDetails, JoorManifestRouteUnaryEnvelope, JoorManifestRouteUnaryEnvelopeUnion, JoorManifestRouteUnaryResult, JoorManifestRouteUnaryResultUnion, JoorManifestRouteUnaryHasHeaders, JoorManifestRouteStreamHasHeaders, JoorManifestRouteUnaryRequiresHeaders, JoorManifestRouteStreamRequiresHeaders, JoorManifestRouteUnaryHasResponseHeaders, JoorManifestRouteStreamHasResponseHeaders, JoorManifestRouteUnaryRequiresResponseHeaders, JoorManifestRouteStreamRequiresResponseHeaders, JoorManifestRouteUnaryRequestOptions, JoorManifestRouteStreamRequestOptions, JoorManifestRouteUnaryClientArgs, JoorManifestRouteStreamClientArgs, JoorManifestRouteUnaryBatchRequest, JoorManifestRouteUnaryBatchResults, JoorManifestRouteUnaryBodyResult, JoorManifestRouteStreamBodyResult, JoorManifestRouteUnaryBodyResultFor, JoorManifestRouteStreamBodyResultFor, JoorManifestRouteUnaryRequest, JoorManifestRouteUnaryRequestUnion, JoorManifestRouteUnaryProtocolBatchRequest, JoorManifestRouteUnaryProtocolRequest, JoorManifestRouteUnaryProtocolRequestUnion, JoorManifestStreamRouteClientArgs, JoorManifestStreamRouteClientHeaders, JoorManifestStreamRouteError, JoorManifestStreamRouteErrorCode, JoorManifestStreamRouteErrorDetails, JoorManifestStreamRouteEvent, JoorManifestStreamRouteHasHeaders, JoorManifestStreamRouteHasResponseHeaders, JoorManifestStreamRouteHeaders, JoorManifestStreamRouteInput, JoorManifestStreamRouteOutput, JoorManifestStreamRouteProcedure, JoorManifestStreamRouteRequiresHeaders, JoorManifestStreamRouteRequiresResponseHeaders, JoorManifestStreamRouteResponseHeaders, JoorManifestStreamRouteRequestOptions, JoorManifestTransportClient, JoorManifestUnaryRouteClientArgs, JoorManifestUnaryRouteClientHeaders, JoorManifestUnaryRouteEnvelope, JoorManifestUnaryRouteError, JoorManifestUnaryRouteErrorCode, JoorManifestUnaryRouteErrorDetails, JoorManifestUnaryRouteHasHeaders, JoorManifestUnaryRouteHasResponseHeaders, JoorManifestUnaryRouteHeaders, JoorManifestUnaryRouteInput, JoorManifestUnaryRouteOutput, JoorManifestUnaryRouteProcedure, JoorManifestUnaryRouteResponseHeaders, JoorManifestUnaryRouteResult, JoorManifestUnaryRouteRequiresHeaders, JoorManifestUnaryRouteRequiresResponseHeaders, JoorManifestUnaryRouteRequestOptions } from 'joor/manifest';
import { manifest } from './manifest.js';

export type Manifest = typeof manifest;
export type RouteId = JoorManifestRouteId<Manifest>;
export type RouteUnaryId = JoorManifestRouteUnaryId<Manifest>;
export type UnaryRouteId = RouteUnaryId;
export type RouteStreamId = JoorManifestRouteStreamId<Manifest>;
export type StreamRouteId = RouteStreamId;
export type RouteProcedure<TId extends RouteId = RouteId> = JoorManifestRouteProcedure<Manifest, TId>;
export type RouteUnaryProcedure<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryProcedure<Manifest, TId>;
export type UnaryRouteProcedure<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryProcedure<TId>;
export type RouteStreamProcedure<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamProcedure<Manifest, TId>;
export type StreamRouteProcedure<TId extends RouteStreamId = RouteStreamId> = RouteStreamProcedure<TId>;
export type RequiredServices = JoorManifestRequiredServices<Manifest>;
export type RouteServices<TId extends RouteId = RouteId> = JoorManifestRouteServices<Manifest, TId>;
export type RouteInput<TId extends RouteId = RouteId> = JoorManifestRouteInput<Manifest, TId>;
export type RouteUnaryInput<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryInput<Manifest, TId>;
export type UnaryRouteInput<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryInput<TId>;
export type RouteStreamInput<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamInput<Manifest, TId>;
export type StreamRouteInput<TId extends RouteStreamId = RouteStreamId> = RouteStreamInput<TId>;
export type RouteOutput<TId extends RouteId = RouteId> = JoorManifestRouteOutput<Manifest, TId>;
export type RouteUnaryOutput<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryOutput<Manifest, TId>;
export type UnaryRouteOutput<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryOutput<TId>;
export type RouteStreamOutput<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamOutput<Manifest, TId>;
export type StreamRouteOutput<TId extends RouteStreamId = RouteStreamId> = RouteStreamOutput<TId>;
export type RouteHeaders<TId extends RouteId = RouteId> = JoorManifestRouteHeaders<Manifest, TId>;
export type RouteUnaryHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryHeaders<Manifest, TId>;
export type UnaryRouteHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryHeaders<TId>;
export type RouteStreamHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamHeaders<Manifest, TId>;
export type StreamRouteHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamHeaders<TId>;
export type RouteClientHeaders<TId extends RouteId = RouteId> = JoorManifestRouteClientHeaders<Manifest, TId>;
export type RouteUnaryClientHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryClientHeaders<Manifest, TId>;
export type UnaryRouteClientHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryClientHeaders<TId>;
export type RouteStreamClientHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamClientHeaders<Manifest, TId>;
export type StreamRouteClientHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamClientHeaders<TId>;
export type RouteResponseHeaders<TId extends RouteId = RouteId> = JoorManifestRouteResponseHeaders<Manifest, TId>;
export type RouteUnaryResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryResponseHeaders<Manifest, TId>;
export type UnaryRouteResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryResponseHeaders<TId>;
export type RouteStreamResponseHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamResponseHeaders<Manifest, TId>;
export type StreamRouteResponseHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamResponseHeaders<TId>;
export type RouteError<TId extends RouteId = RouteId> = JoorManifestRouteError<Manifest, TId>;
export type RouteUnaryError<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryError<Manifest, TId>;
export type UnaryRouteError<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryError<TId>;
export type RouteStreamError<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamError<Manifest, TId>;
export type StreamRouteError<TId extends RouteStreamId = RouteStreamId> = RouteStreamError<TId>;
export type RouteErrorCode<TId extends RouteId = RouteId> = JoorManifestRouteErrorCode<Manifest, TId>;
export type RouteUnaryErrorCode<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryErrorCode<Manifest, TId>;
export type UnaryRouteErrorCode<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryErrorCode<TId>;
export type RouteStreamErrorCode<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamErrorCode<Manifest, TId>;
export type StreamRouteErrorCode<TId extends RouteStreamId = RouteStreamId> = RouteStreamErrorCode<TId>;
export type RouteErrorDetails<TId extends RouteId = RouteId, TCode extends RouteErrorCode<TId> = RouteErrorCode<TId>> = JoorManifestRouteErrorDetails<Manifest, TId, TCode>;
export type RouteUnaryErrorDetails<TId extends RouteUnaryId = RouteUnaryId, TCode extends RouteUnaryErrorCode<TId> = RouteUnaryErrorCode<TId>> = JoorManifestRouteUnaryErrorDetails<Manifest, TId, TCode>;
export type UnaryRouteErrorDetails<TId extends RouteUnaryId = RouteUnaryId, TCode extends RouteUnaryErrorCode<TId> = RouteUnaryErrorCode<TId>> = RouteUnaryErrorDetails<TId, TCode>;
export type RouteStreamErrorDetails<TId extends RouteStreamId = RouteStreamId, TCode extends RouteStreamErrorCode<TId> = RouteStreamErrorCode<TId>> = JoorManifestRouteStreamErrorDetails<Manifest, TId, TCode>;
export type StreamRouteErrorDetails<TId extends RouteStreamId = RouteStreamId, TCode extends RouteStreamErrorCode<TId> = RouteStreamErrorCode<TId>> = RouteStreamErrorDetails<TId, TCode>;
export type RouteEnvelope<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteEnvelope<Manifest, TId>;
export type RouteUnaryEnvelope<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryEnvelope<Manifest, TId>;
export type UnaryRouteEnvelope<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryEnvelope<TId>;
export type RouteRequest<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteRequest<Manifest, TId>;
export type RouteUnaryRequest<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryRequest<Manifest, TId>;
export type UnaryRouteRequest<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryRequest<TId>;
export type RouteRequestUnion = JoorManifestRouteRequestUnion<Manifest>;
export type RouteUnaryRequestUnion = JoorManifestRouteUnaryRequestUnion<Manifest>;
export type UnaryRouteRequestUnion = RouteUnaryRequestUnion;
export type RouteBatchRequest<TRequests extends readonly (RouteRequestUnion | RouteUnaryProtocolRequestUnion)[] = readonly (RouteRequestUnion | RouteUnaryProtocolRequestUnion)[]> = JoorManifestRouteBatchRequest<Manifest, TRequests>;
export type RouteUnaryBatchRequest<TRequests extends readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[] = readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[]> = JoorManifestRouteUnaryBatchRequest<Manifest, TRequests>;
export type UnaryRouteBatchRequest<TRequests extends readonly (UnaryRouteRequestUnion | UnaryRouteProtocolRequestUnion)[] = readonly (UnaryRouteRequestUnion | UnaryRouteProtocolRequestUnion)[]> = RouteUnaryBatchRequest<TRequests>;
export type RouteBatchResults<TRequests extends readonly (RouteRequestUnion | RouteUnaryProtocolRequestUnion)[] = readonly (RouteRequestUnion | RouteUnaryProtocolRequestUnion)[]> = JoorManifestRouteBatchResults<Manifest, TRequests>;
export type RouteUnaryBatchResults<TRequests extends readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[] = readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[]> = JoorManifestRouteUnaryBatchResults<Manifest, TRequests>;
export type UnaryRouteBatchResults<TRequests extends readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[] = readonly (RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion)[]> = RouteUnaryBatchResults<TRequests>;
export type RouteProtocolRequest<TId extends RouteId = RouteId> = JoorManifestRouteProtocolRequest<Manifest, TId>;
export type RouteProtocolRequestUnion = JoorManifestRouteProtocolRequestUnion<Manifest>;
export type ProtocolRequest<TId extends RouteId = RouteId> = RouteProtocolRequest<TId>;
export type ProtocolRequestUnion = RouteProtocolRequestUnion;
export type RouteUnaryProtocolRequest<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryProtocolRequest<Manifest, TId>;
export type UnaryRouteProtocolRequest<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryProtocolRequest<TId>;
export type RouteUnaryProtocolRequestUnion = JoorManifestRouteUnaryProtocolRequestUnion<Manifest>;
export type UnaryRouteProtocolRequestUnion = RouteUnaryProtocolRequestUnion;
export type UnaryProtocolRequest<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryProtocolRequest<TId>;
export type UnaryProtocolRequestUnion = RouteUnaryProtocolRequestUnion;
export type RouteStreamProtocolRequest<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamProtocolRequest<Manifest, TId>;
export type StreamRouteProtocolRequest<TId extends RouteStreamId = RouteStreamId> = RouteStreamProtocolRequest<TId>;
export type RouteStreamProtocolRequestUnion = JoorManifestRouteStreamProtocolRequestUnion<Manifest>;
export type StreamRouteProtocolRequestUnion = RouteStreamProtocolRequestUnion;
export type StreamProtocolRequest<TId extends RouteStreamId = RouteStreamId> = RouteStreamProtocolRequest<TId>;
export type StreamProtocolRequestUnion = RouteStreamProtocolRequestUnion;
export type RouteStreamRequest<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamRequest<Manifest, TId>;
export type StreamRouteRequest<TId extends RouteStreamId = RouteStreamId> = RouteStreamRequest<TId>;
export type RouteStreamRequestUnion = JoorManifestRouteStreamRequestUnion<Manifest>;
export type StreamRouteRequestUnion = RouteStreamRequestUnion;
export type RouteProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolRequestUnion[] = readonly RouteUnaryProtocolRequestUnion[]> = JoorManifestRouteProtocolBatchRequest<Manifest, TRequests>;
export type RouteUnaryProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolRequestUnion[] = readonly RouteUnaryProtocolRequestUnion[]> = JoorManifestRouteUnaryProtocolBatchRequest<Manifest, TRequests>;
export type UnaryRouteProtocolBatchRequest<TRequests extends readonly UnaryRouteProtocolRequestUnion[] = readonly UnaryRouteProtocolRequestUnion[]> = RouteUnaryProtocolBatchRequest<TRequests>;
export type ProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolRequestUnion[] = readonly RouteUnaryProtocolRequestUnion[]> = RouteProtocolBatchRequest<TRequests>;
export type RouteBody = JoorManifestRouteBody<Manifest>;
export type RouteUnaryBody =
  | RouteUnaryProtocolRequestUnion
  | RouteUnaryProtocolBatchRequest<readonly RouteUnaryProtocolRequestUnion[]>;
export type UnaryRouteBody = RouteUnaryBody;
export type RouteStreamBody = RouteStreamProtocolRequestUnion;
export type StreamRouteBody = RouteStreamBody;
export type RouteBodyResult<TBody extends RouteBody = RouteBody> = JoorManifestRouteBodyResultFor<Manifest, TBody>;
export type RouteUnaryBodyResult<TBody extends RouteUnaryBody = RouteUnaryBody> = JoorManifestRouteUnaryBodyResultFor<Manifest, TBody>;
export type UnaryRouteBodyResult<TBody extends RouteUnaryBody = RouteUnaryBody> = RouteUnaryBodyResult<TBody>;
export type RouteStreamBodyResult<TBody extends RouteStreamBody = RouteStreamBody> = JoorManifestRouteStreamBodyResultFor<Manifest, TBody>;
export type StreamRouteBodyResult<TBody extends RouteStreamBody = RouteStreamBody> = RouteStreamBodyResult<TBody>;
export type RouteBodyResultFor<TBody extends RouteBody> = JoorManifestRouteBodyResultFor<Manifest, TBody>;
export type RouteUnaryBodyResultFor<TBody extends RouteUnaryBody> = JoorManifestRouteUnaryBodyResultFor<Manifest, TBody>;
export type UnaryRouteBodyResultFor<TBody extends RouteUnaryBody> = RouteUnaryBodyResultFor<TBody>;
export type RouteStreamBodyResultFor<TBody extends RouteStreamBody> = JoorManifestRouteStreamBodyResultFor<Manifest, TBody>;
export type StreamRouteBodyResultFor<TBody extends RouteStreamBody> = RouteStreamBodyResultFor<TBody>;
export type RouteEnvelopeUnion = JoorManifestRouteEnvelopeUnion<Manifest>;
export type RouteUnaryEnvelopeUnion = JoorManifestRouteUnaryEnvelopeUnion<Manifest>;
export type UnaryRouteEnvelopeUnion = RouteUnaryEnvelopeUnion;
export type RouteResult<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteResult<Manifest, TId>;
export type RouteUnaryResult<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryResult<Manifest, TId>;
export type UnaryRouteResult<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryResult<TId>;
export type RouteResultUnion = JoorManifestRouteResultUnion<Manifest>;
export type RouteUnaryResultUnion = JoorManifestRouteUnaryResultUnion<Manifest>;
export type UnaryRouteResultUnion = RouteUnaryResultUnion;
export type Result<TId extends RouteUnaryId = RouteUnaryId> = RouteResult<TId>;
export type ResultUnion = RouteResultUnion;
export type RouteStreamEvent<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamEvent<Manifest, TId>;
export type StreamRouteEvent<TId extends RouteStreamId = RouteStreamId> = RouteStreamEvent<TId>;
export type Stream<TId extends RouteStreamId = RouteStreamId> = RouteStreamEvent<TId>;
export type RouteHasHeaders<TId extends RouteId = RouteId> = JoorManifestRouteHasHeaders<Manifest, TId>;
export type RouteUnaryHasHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryHasHeaders<Manifest, TId>;
export type UnaryRouteHasHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryHasHeaders<TId>;
export type RouteStreamHasHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamHasHeaders<Manifest, TId>;
export type StreamRouteHasHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamHasHeaders<TId>;
export type RouteRequiresHeaders<TId extends RouteId = RouteId> = JoorManifestRouteRequiresHeaders<Manifest, TId>;
export type RouteUnaryRequiresHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryRequiresHeaders<Manifest, TId>;
export type UnaryRouteRequiresHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryRequiresHeaders<TId>;
export type RouteStreamRequiresHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamRequiresHeaders<Manifest, TId>;
export type StreamRouteRequiresHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamRequiresHeaders<TId>;
export type RouteHasResponseHeaders<TId extends RouteId = RouteId> = JoorManifestRouteHasResponseHeaders<Manifest, TId>;
export type RouteUnaryHasResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryHasResponseHeaders<Manifest, TId>;
export type UnaryRouteHasResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryHasResponseHeaders<TId>;
export type RouteStreamHasResponseHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamHasResponseHeaders<Manifest, TId>;
export type StreamRouteHasResponseHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamHasResponseHeaders<TId>;
export type RouteRequiresResponseHeaders<TId extends RouteId = RouteId> = JoorManifestRouteRequiresResponseHeaders<Manifest, TId>;
export type RouteUnaryRequiresResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryRequiresResponseHeaders<Manifest, TId>;
export type UnaryRouteRequiresResponseHeaders<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryRequiresResponseHeaders<TId>;
export type RouteStreamRequiresResponseHeaders<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamRequiresResponseHeaders<Manifest, TId>;
export type StreamRouteRequiresResponseHeaders<TId extends RouteStreamId = RouteStreamId> = RouteStreamRequiresResponseHeaders<TId>;
export type RouteRequestOptions<TId extends RouteId = RouteId> = JoorManifestRouteRequestOptions<Manifest, TId>;
export type RouteUnaryRequestOptions<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryRequestOptions<Manifest, TId>;
export type UnaryRouteRequestOptions<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryRequestOptions<TId>;
export type RouteStreamRequestOptions<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamRequestOptions<Manifest, TId>;
export type StreamRouteRequestOptions<TId extends RouteStreamId = RouteStreamId> = RouteStreamRequestOptions<TId>;
export type RouteClientArgs<TId extends RouteId = RouteId> = JoorManifestRouteClientArgs<Manifest, TId>;
export type RouteUnaryClientArgs<TId extends RouteUnaryId = RouteUnaryId> = JoorManifestRouteUnaryClientArgs<Manifest, TId>;
export type UnaryRouteClientArgs<TId extends RouteUnaryId = RouteUnaryId> = RouteUnaryClientArgs<TId>;
export type RouteStreamClientArgs<TId extends RouteStreamId = RouteStreamId> = JoorManifestRouteStreamClientArgs<Manifest, TId>;
export type StreamRouteClientArgs<TId extends RouteStreamId = RouteStreamId> = RouteStreamClientArgs<TId>;
export type ClientArgs<TId extends RouteId = RouteId> = RouteClientArgs<TId>;
export type ProtocolRequestOptions = RpcProtocolRequestOptions;
type RouteUnaryFunctionFor<TId extends RouteUnaryId> = {
  (...args: RouteUnaryClientArgs<TId>): Promise<RouteResult<TId>>;
  call(...args: RouteUnaryClientArgs<TId>): Promise<RouteResult<TId>>;
  request(...args: RouteUnaryClientArgs<TId>): RouteRequest<TId>;
  protocolRequest(
    input: RouteUnaryInput<TId>,
    options?: ProtocolRequestOptions
  ): RouteUnaryProtocolRequest<TId>;
};
export type RouteUnaryFunction<TId extends RouteUnaryId = RouteUnaryId> = {
  [TRouteId in TId]: RouteUnaryFunctionFor<TRouteId>;
}[TId];
export type UnaryRouteFunction<TId extends RouteUnaryId = RouteUnaryId> =
  RouteUnaryFunction<TId>;
type RouteStreamFunctionFor<TId extends RouteStreamId> = {
  (...args: RouteStreamClientArgs<TId>): AsyncIterable<Stream<TId>>;
  stream(...args: RouteStreamClientArgs<TId>): AsyncIterable<Stream<TId>>;
  protocolRequest(
    input: RouteStreamInput<TId>,
    options?: ProtocolRequestOptions
  ): RouteStreamProtocolRequest<TId>;
};
export type RouteStreamFunction<TId extends RouteStreamId = RouteStreamId> = {
  [TRouteId in TId]: RouteStreamFunctionFor<TRouteId>;
}[TId];
export type StreamRouteFunction<TId extends RouteStreamId = RouteStreamId> =
  RouteStreamFunction<TId>;
export type BatchOptions = ClientBatchOptions;
export type BatchFunction = <const TRequests extends RouteBatchRequest>(
  requests: TRequests,
  options?: BatchOptions
) => Promise<RouteBatchResults<TRequests>>;
export type RouteProtocolRequestBuilder = <TId extends RouteId>(
  id: TId,
  input: RouteInput<TId>,
  options?: ProtocolRequestOptions
) => RouteProtocolRequest<TId>;
export type RouteUnaryProtocolRequestBuilder = <TId extends RouteUnaryId>(
  id: TId,
  input: RouteUnaryInput<TId>,
  options?: ProtocolRequestOptions
) => RouteUnaryProtocolRequest<TId>;
export type UnaryRouteProtocolRequestBuilder =
  RouteUnaryProtocolRequestBuilder;
export type RouteStreamProtocolRequestBuilder = <TId extends RouteStreamId>(
  id: TId,
  input: RouteStreamInput<TId>,
  options?: ProtocolRequestOptions
) => RouteStreamProtocolRequest<TId>;
export type StreamRouteProtocolRequestBuilder =
  RouteStreamProtocolRequestBuilder;
export type RouteStreamRequestBuilder = <TId extends RouteStreamId>(
  id: TId,
  input: RouteStreamInput<TId>,
  options?: ProtocolRequestOptions
) => RouteStreamRequest<TId>;
export type StreamRouteRequestBuilder = RouteStreamRequestBuilder;
export type RouteRequestBuilder = <TId extends RouteUnaryId>(
  id: TId,
  ...args: RouteUnaryClientArgs<TId>
) => RouteRequest<TId>;
const createManifestRouteRequest = <TId extends RouteUnaryId>(
  id: TId,
  ...args: RouteUnaryClientArgs<TId>
): RouteRequest<TId> =>
  createTransportRouteRequest<Manifest, TId>(
    manifest,
    id,
    args[0] as RouteUnaryInput<TId>,
    args[1] as RouteUnaryRequestOptions<TId>
  ) as RouteRequest<TId>;
export const createRouteRequest: RouteRequestBuilder = <
  TId extends RouteUnaryId,
>(
  id: TId,
  ...args: RouteUnaryClientArgs<TId>
): RouteRequest<TId> =>
  createManifestRouteRequest(id, ...args);
export const createRouteUnaryRequest: typeof createRouteRequest =
  createRouteRequest;
export const createUnaryRouteRequest: typeof createRouteUnaryRequest =
  createRouteUnaryRequest;
export const createRouteProtocolRequest: RouteProtocolRequestBuilder = <
  TId extends RouteId,
>(
  id: TId,
  input: RouteInput<TId>,
  options?: ProtocolRequestOptions
): RouteProtocolRequest<TId> =>
  createTransportRouteProtocolRequest<Manifest, TId>(
    manifest,
    id,
    input,
    options
  ) as RouteProtocolRequest<TId>;
export const createRouteUnaryProtocolRequest: RouteUnaryProtocolRequestBuilder = <
  TId extends RouteUnaryId,
>(
  id: TId,
  input: RouteUnaryInput<TId>,
  options?: ProtocolRequestOptions
): RouteUnaryProtocolRequest<TId> =>
  createTransportRouteUnaryProtocolRequest<Manifest, TId>(
    manifest,
    id,
    input,
    options
  ) as RouteUnaryProtocolRequest<TId>;
export const createUnaryRouteProtocolRequest: typeof createRouteUnaryProtocolRequest =
  createRouteUnaryProtocolRequest;
export const createRouteStreamProtocolRequest: RouteStreamProtocolRequestBuilder = <
  TId extends RouteStreamId,
>(
  id: TId,
  input: RouteStreamInput<TId>,
  options?: ProtocolRequestOptions
): RouteStreamProtocolRequest<TId> =>
  createTransportRouteStreamProtocolRequest<Manifest, TId>(
    manifest,
    id,
    input,
    options
  ) as RouteStreamProtocolRequest<TId>;
export const createStreamRouteProtocolRequest: typeof createRouteStreamProtocolRequest =
  createRouteStreamProtocolRequest;
export const createRouteStreamRequest: RouteStreamRequestBuilder = <
  TId extends RouteStreamId,
>(
  id: TId,
  input: RouteStreamInput<TId>,
  options?: ProtocolRequestOptions
): RouteStreamRequest<TId> =>
  createTransportRouteStreamRequest<Manifest, TId>(
    manifest,
    id,
    input,
    options
  ) as RouteStreamRequest<TId>;
export const createStreamRouteRequest: typeof createRouteStreamRequest =
  createRouteStreamRequest;
export type GeneratedClientOptions = Omit<JoorManifestClientOptions<Manifest>, 'url'> & {
  url?: string;
};
export type RouteTransportClient = JoorManifestTransportClient<Manifest>;
type RouteUnaryTransportFor<TId extends RouteUnaryId> = {
  call(...args: [id: TId, ...ClientArgs<TId>]): Promise<RouteResult<TId>>;
  request(...args: [id: TId, ...ClientArgs<TId>]): RouteRequest<TId>;
};
export type RouteUnaryTransport<TId extends RouteUnaryId = RouteUnaryId> = {
  [TRouteId in TId]: RouteUnaryTransportFor<TRouteId>;
}[TId];
export type UnaryRouteTransport<TId extends RouteUnaryId = RouteUnaryId> =
  RouteUnaryTransport<TId>;
type RouteStreamTransportFor<TId extends RouteStreamId> = {
  stream(...args: [id: TId, ...ClientArgs<TId>]): AsyncIterable<Stream<TId>>;
};
export type RouteStreamTransport<TId extends RouteStreamId = RouteStreamId> = {
  [TRouteId in TId]: RouteStreamTransportFor<TRouteId>;
}[TId];
export type StreamRouteTransport<TId extends RouteStreamId = RouteStreamId> =
  RouteStreamTransport<TId>;
export type RouteUnaryTransportClient = Pick<
  RouteTransportClient,
  'call' | 'request' | 'batch'
>;
export type UnaryRouteTransportClient = RouteUnaryTransportClient;
export type RouteStreamTransportClient = Pick<RouteTransportClient, 'stream'>;
export type StreamRouteTransportClient = RouteStreamTransportClient;
export type TransportClient = RouteTransportClient;

const defaultUrl = ${JSON.stringify(defaultUrl)};

export const createTransport = (
  options: GeneratedClientOptions = {}
): TransportClient =>
  createTransportClient(manifest, {
    ...options,
    url: options.url ?? defaultUrl,
  });

export type GeneratedClient = {
${clientTypeBody}
  batch: BatchFunction;
};
export type Client = GeneratedClient;

export const createClient = (options: GeneratedClientOptions = {}): GeneratedClient => {
  const transport = createTransport(options);
  const routeUnary = <TId extends RouteUnaryId>(id: TId): RouteUnaryFunction<TId> => {
    const routeTransport = transport as RouteUnaryTransport<TId>;
    const call = (...args: ClientArgs<TId>) =>
      routeTransport.call(id, ...args);
    const request = (...args: ClientArgs<TId>) =>
      routeTransport.request(id, ...args);
    const protocolRequest = (
      input: RouteUnaryInput<TId>,
      options?: ProtocolRequestOptions
    ) => createRouteUnaryProtocolRequest(id, input, options);
    return Object.assign(call, { call, request, protocolRequest });
  };
  const routeStream = <TId extends RouteStreamId>(id: TId): RouteStreamFunction<TId> => {
    const routeTransport = transport as RouteStreamTransport<TId>;
    const stream = (...args: ClientArgs<TId>) =>
      routeTransport.stream(id, ...args);
    const protocolRequest = (
      input: RouteStreamInput<TId>,
      options?: ProtocolRequestOptions
    ) => createRouteStreamProtocolRequest(id, input, options);
    return Object.assign(stream, { stream, protocolRequest });
  };
  const batch: BatchFunction = (requests, options) =>
    transport.batch(requests, options);
  return {
${clientBody}
    batch,
  };
};

export const client: GeneratedClient = createClient();
`
  );
};

const emitProcedureHelper = async (
  outDir: string,
  configPath?: string
): Promise<void> => {
  const configImport =
    configPath === undefined
      ? ''
      : `import config from '${toImportPath(`${outDir}/procedure.ts`, configPath)}';\n`;
  const contextType =
    configPath === undefined
      ? 'Record<string, never>'
      : 'JoorConfigContext<typeof config>';
  await writeFile(
    `${outDir}/procedure.ts`,
    `import { defineProcedure } from 'joor/procedure';
import type { JoorConfigContext } from 'joor/config';
${configImport}
export const procedure = defineProcedure.withContext<${contextType}>();
`
  );
};

export const emitArtifacts = async (
  manifest: CompilerManifest,
  options: EmitOptions
): Promise<void> => {
  await mkdir(options.outDir, { recursive: true });
  await emitManifest(manifest, options.outDir);
  await emitDispatcher(
    manifest,
    options.outDir,
    options.config,
    options.configPath
  );
  await emitDenoDispatcher(
    manifest,
    options.outDir,
    options.config,
    options.configPath
  );
  await emitRuntimeTargets(manifest, options.outDir, options.config);
  await emitClient(manifest, options.outDir, options.config);
  await emitProcedureHelper(options.outDir, options.configPath);
  await writeJson(
    `${options.outDir}/openapi.json`,
    createOpenApiDocument(manifest)
  );
  await writeJson(`${options.outDir}/ai-docs.json`, createAiDocs(manifest));
};
