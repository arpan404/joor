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
  readonly outDir: string;
  readonly config?: JoorConfig;
  readonly configPath?: string;
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
        `    ${JSON.stringify(entry.id)}: Object.freeze({ ...${entry.exportName}, id: ${JSON.stringify(entry.id)} } as const),`
    )
    .join('\n');
  const source = `${imports}

export const manifest = Object.freeze({
  procedures: Object.freeze({
${entries}
  }),
} as const);
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
    'createCompiledRpcHandlerFor',
    'createCompiledRouteStreamRpcHandlerFor',
    'createCompiledRouteUnaryRpcHandlerFor',
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
    'JoorManifestRouteBatchClientHeaders',
    'JoorManifestRouteBatchOptions',
    'JoorManifestRouteBatchOptionsTuple',
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
    'JoorManifestProtocolBatchClientHeaders',
    'JoorManifestProtocolBatchOptions',
    'JoorManifestProtocolBatchOptionsTuple',
    'JoorManifestRouteProtocolBatchRequest',
    'JoorManifestRouteProtocolBatchClientHeaders',
    'JoorManifestRouteProtocolBatchOptions',
    'JoorManifestRouteProtocolBatchOptionsTuple',
    'JoorManifestRouteProtocolBatchResults',
    'JoorManifestRouteProtocolRequest',
    'JoorManifestRouteProtocolRequestUnion',
    'JoorManifestRouteProcedure',
    'JoorManifestRouteRequestOptions',
    'JoorManifestRouteRequiresHeaders',
    'JoorManifestRouteRequiresResponseHeaders',
    'JoorManifestRouteResponseHeaders',
    'JoorManifestRequiredRuntimeRequest',
    'JoorManifestRequiredServices',
    'JoorManifestRouteRuntimeRequest',
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
    'JoorManifestUnaryRouteBatchClientHeaders',
    'JoorManifestUnaryRouteBatchOptions',
    'JoorManifestUnaryRouteBatchOptionsTuple',
    'JoorManifestUnaryRouteProtocolBatchClientHeaders',
    'JoorManifestUnaryRouteProtocolBatchOptions',
    'JoorManifestUnaryRouteProtocolBatchOptionsTuple',
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
    'JoorManifestRouteUnaryBatchClientHeaders',
    'JoorManifestRouteUnaryBatchOptions',
    'JoorManifestRouteUnaryBatchOptionsTuple',
    'JoorManifestRouteUnaryBatchRequest',
    'JoorManifestRouteUnaryBatchResults',
    'JoorManifestRouteUnaryBodyResult',
    'JoorManifestRouteStreamBodyResult',
    'JoorManifestRouteUnaryBodyResultFor',
    'JoorManifestRouteStreamBodyResultFor',
    'JoorManifestRouteUnaryRequest',
    'JoorManifestRouteUnaryRequestUnion',
    'JoorManifestRouteUnaryProtocolBatchRequest',
    'JoorManifestRouteUnaryProtocolBatchClientHeaders',
    'JoorManifestRouteUnaryProtocolBatchOptions',
    'JoorManifestRouteUnaryProtocolBatchOptionsTuple',
    'JoorManifestRouteUnaryProtocolBatchResults',
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
    'JoorConfigBody',
    'JoorConfigContext',
    'JoorConfigFor',
    'JoorConfigManifest',
    'JoorConfigRequest',
    'JoorConfigServices',
    'JoorRouteStreamConfigFor',
    'JoorRouteUnaryConfigFor',
  ];
  const configTypeImport = `import type { ${configTypeImports.join(', ')} } from 'joor/config';\n`;
  const configValueImport =
    "import { defineConfigFor, defineRouteStreamConfigFor, defineRouteUnaryConfigFor, defineStreamRouteConfigFor, defineUnaryRouteConfigFor } from 'joor/config';\n";
  const handlerTypeImport =
    "import type { DefineHandlerOptions, DefineRouteStreamHandlerOptions, DefineRouteUnaryHandlerOptions, HandlerHookContextFor, HandlerHooksFor, HandlerOptionServices, HandlerOptionsArgs, HandlerOptionsArgsFor, HandlerOptionsBody, HandlerOptionsFor, HandlerOptionsManifest, HandlerOptionsRequest, HandlerOptionsServices, HandlerOptionsWithPreflightArgs, HandlerOptionsWithTrailingArgs, JoorMiddlewareFor, RpcManifestRouteStreamHandlerHookContextFor, RpcManifestRouteStreamHandlerHooksFor, RpcManifestRouteStreamHandlerOptionsArgs, RpcManifestRouteStreamHandlerOptionsArgsFor, RpcManifestRouteStreamHandlerOptionsFor, RpcManifestRouteStreamHandlerOptionsWithPreflightArgs, RpcManifestRouteStreamHandlerOptionsWithTrailingArgs, RpcManifestRouteStreamMiddlewareFor, RpcManifestRouteUnaryHandlerHookContextFor, RpcManifestRouteUnaryHandlerHooksFor, RpcManifestRouteUnaryHandlerOptionsArgs, RpcManifestRouteUnaryHandlerOptionsArgsFor, RpcManifestRouteUnaryHandlerOptionsFor, RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs, RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs, RpcManifestRouteUnaryMiddlewareFor } from 'joor';\n";
  const handlerValueImport =
    "import { defineHandlerOptions, defineRouteStreamHandlerOptions, defineRouteUnaryHandlerOptions, defineStreamRouteHandlerOptions, defineUnaryRouteHandlerOptions } from 'joor';\n";
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
  readonly procedures: {
${nativeManifestEntries}
  };
};

export type NativeServices = ${nativeServicesType};
export type NativeRuntimeState = CompiledRuntimeState<NativeServices>;
export type NativeDispatch = CompiledDispatch<NativeServices>;
export type NativeUnaryDispatch = CompiledFixedUnaryDispatch<NativeServices>;
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
export type NativeRequiredRuntimeRequest = JoorManifestRequiredRuntimeRequest<NativeManifest>;
export type NativeFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = CompiledRpcRequestHandler<TRequest>;
export type NativeRouteUnaryFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = NativeFetchHandler<TRequest>;
export type NativeUnaryRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = NativeRouteUnaryFetchHandler<TRequest>;
export type NativeRouteStreamFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = NativeFetchHandler<TRequest>;
export type NativeStreamRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = NativeRouteStreamFetchHandler<TRequest>;
export type NativeRequiredServices = JoorManifestRequiredServices<NativeManifest>;
export type NativeRouteRuntimeRequest<TId extends NativeRouteId = NativeRouteId> = JoorManifestRouteRuntimeRequest<NativeManifest, TId>;
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
export type NativeRouteBatchRequestUnion = NativeRouteUnaryRequestUnion;
export type NativeRouteUnaryBatchRequestUnion = NativeRouteBatchRequestUnion;
export type NativeUnaryRouteBatchRequestUnion =
  NativeRouteUnaryBatchRequestUnion;
export type NativeRouteProtocolBatchRequestUnion =
  NativeRouteUnaryProtocolRequestUnion;
export type NativeRouteUnaryProtocolBatchRequestUnion =
  NativeRouteProtocolBatchRequestUnion;
export type NativeUnaryRouteProtocolBatchRequestUnion =
  NativeRouteUnaryProtocolBatchRequestUnion;
export type NativeProtocolBatchRequestUnion =
  NativeRouteProtocolBatchRequestUnion;
export type NativeRouteBatchRequest<TRequests extends readonly NativeRouteBatchRequestUnion[] = readonly NativeRouteBatchRequestUnion[]> =
  JoorManifestRouteBatchRequest<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchRequest<TRequests extends readonly NativeRouteUnaryBatchRequestUnion[] = readonly NativeRouteUnaryBatchRequestUnion[]> =
  JoorManifestRouteUnaryBatchRequest<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchRequest<TRequests extends readonly NativeUnaryRouteBatchRequestUnion[] = readonly NativeUnaryRouteBatchRequestUnion[]> =
  NativeRouteUnaryBatchRequest<TRequests>;
export type NativeRouteProtocolBatchRequest<TRequests extends readonly NativeRouteProtocolBatchRequestUnion[] = readonly NativeRouteProtocolBatchRequestUnion[]> =
  JoorManifestRouteProtocolBatchRequest<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchRequest<TRequests extends readonly NativeRouteUnaryProtocolBatchRequestUnion[] = readonly NativeRouteUnaryProtocolBatchRequestUnion[]> =
  JoorManifestRouteUnaryProtocolBatchRequest<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchRequest<TRequests extends readonly NativeUnaryRouteProtocolBatchRequestUnion[] = readonly NativeUnaryRouteProtocolBatchRequestUnion[]> =
  NativeRouteUnaryProtocolBatchRequest<TRequests>;
export type NativeProtocolBatchRequest<TRequests extends readonly NativeProtocolBatchRequestUnion[] = readonly NativeProtocolBatchRequestUnion[]> =
  NativeRouteProtocolBatchRequest<TRequests>;
export type NativeRouteBatchClientHeaders<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  JoorManifestRouteBatchClientHeaders<NativeManifest, TRequests>;
export type NativeBatchClientHeaders<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  NativeRouteBatchClientHeaders<TRequests>;
export type NativeRouteUnaryBatchClientHeaders<TRequests extends readonly unknown[] = NativeRouteUnaryBatchRequest> =
  JoorManifestRouteUnaryBatchClientHeaders<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchClientHeaders<TRequests extends readonly unknown[] = NativeUnaryRouteBatchRequest> =
  JoorManifestUnaryRouteBatchClientHeaders<NativeManifest, TRequests>;
export type NativeRouteProtocolBatchClientHeaders<TRequests extends readonly unknown[] = NativeRouteProtocolBatchRequest> =
  JoorManifestRouteProtocolBatchClientHeaders<NativeManifest, TRequests>;
export type NativeProtocolBatchClientHeaders<TRequests extends readonly unknown[] = NativeProtocolBatchRequest> =
  JoorManifestProtocolBatchClientHeaders<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchClientHeaders<TRequests extends readonly unknown[] = NativeRouteUnaryProtocolBatchRequest> =
  JoorManifestRouteUnaryProtocolBatchClientHeaders<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchClientHeaders<TRequests extends readonly unknown[] = NativeUnaryRouteProtocolBatchRequest> =
  JoorManifestUnaryRouteProtocolBatchClientHeaders<NativeManifest, TRequests>;
export type NativeRouteBatchOptions<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  JoorManifestRouteBatchOptions<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchOptions<TRequests extends readonly unknown[] = NativeRouteUnaryBatchRequest> =
  JoorManifestRouteUnaryBatchOptions<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchOptions<TRequests extends readonly unknown[] = NativeUnaryRouteBatchRequest> =
  JoorManifestUnaryRouteBatchOptions<NativeManifest, TRequests>;
export type NativeBatchOptions<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  NativeRouteBatchOptions<TRequests>;
export type NativeRouteProtocolBatchOptions<TRequests extends readonly unknown[] = NativeRouteProtocolBatchRequest> =
  JoorManifestRouteProtocolBatchOptions<NativeManifest, TRequests>;
export type NativeProtocolBatchOptions<TRequests extends readonly unknown[] = NativeProtocolBatchRequest> =
  JoorManifestProtocolBatchOptions<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchOptions<TRequests extends readonly unknown[] = NativeRouteUnaryProtocolBatchRequest> =
  JoorManifestRouteUnaryProtocolBatchOptions<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchOptions<TRequests extends readonly unknown[] = NativeUnaryRouteProtocolBatchRequest> =
  JoorManifestUnaryRouteProtocolBatchOptions<NativeManifest, TRequests>;
export type NativeRouteBatchOptionsTuple<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  JoorManifestRouteBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchOptionsTuple<TRequests extends readonly unknown[] = NativeRouteUnaryBatchRequest> =
  JoorManifestRouteUnaryBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchOptionsTuple<TRequests extends readonly unknown[] = NativeUnaryRouteBatchRequest> =
  JoorManifestUnaryRouteBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeBatchOptionsTuple<TRequests extends readonly unknown[] = NativeRouteBatchRequest> =
  NativeRouteBatchOptionsTuple<TRequests>;
export type NativeRouteProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = NativeRouteProtocolBatchRequest> =
  JoorManifestRouteProtocolBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = NativeProtocolBatchRequest> =
  JoorManifestProtocolBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = NativeRouteUnaryProtocolBatchRequest> =
  JoorManifestRouteUnaryProtocolBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = NativeUnaryRouteProtocolBatchRequest> =
  JoorManifestUnaryRouteProtocolBatchOptionsTuple<NativeManifest, TRequests>;
export type NativeRouteBatchResults<TRequests extends readonly NativeRouteBatchRequestUnion[] = readonly NativeRouteBatchRequestUnion[]> =
  JoorManifestRouteBatchResults<NativeManifest, TRequests>;
export type NativeRouteUnaryBatchResults<TRequests extends readonly NativeRouteUnaryBatchRequestUnion[] = readonly NativeRouteUnaryBatchRequestUnion[]> =
  JoorManifestRouteUnaryBatchResults<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchResults<TRequests extends readonly NativeUnaryRouteBatchRequestUnion[] = readonly NativeUnaryRouteBatchRequestUnion[]> =
  NativeRouteUnaryBatchResults<TRequests>;
export type NativeRouteProtocolBatchResults<TRequests extends readonly NativeRouteProtocolBatchRequestUnion[] = readonly NativeRouteProtocolBatchRequestUnion[]> =
  JoorManifestRouteProtocolBatchResults<NativeManifest, TRequests>;
export type NativeRouteUnaryProtocolBatchResults<TRequests extends readonly NativeRouteUnaryProtocolBatchRequestUnion[] = readonly NativeRouteUnaryProtocolBatchRequestUnion[]> =
  JoorManifestRouteUnaryProtocolBatchResults<NativeManifest, TRequests>;
export type NativeUnaryRouteProtocolBatchResults<TRequests extends readonly NativeUnaryRouteProtocolBatchRequestUnion[] = readonly NativeUnaryRouteProtocolBatchRequestUnion[]> =
  NativeRouteUnaryProtocolBatchResults<TRequests>;
export type NativeProtocolBatchResults<TRequests extends readonly NativeProtocolBatchRequestUnion[] = readonly NativeProtocolBatchRequestUnion[]> =
  NativeRouteProtocolBatchResults<TRequests>;
export type NativeBatchBody = NativeRouteProtocolBatchRequest;
export type NativeRouteBody = JoorManifestRouteBody<NativeManifest>;
export type NativeBody = NativeRouteBody;
export type NativeRouteUnaryBody =
  | NativeRouteUnaryProtocolRequestUnion
  | NativeRouteUnaryProtocolBatchRequest;
export type NativeUnaryRouteBody = NativeRouteUnaryBody;
export type NativeRouteStreamBody = NativeRouteStreamProtocolRequestUnion;
export type NativeStreamRouteBody = NativeRouteStreamBody;
export type NativeConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  JoorConfigFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeConfig<TPlugins, TBody, TRequest>;
export type NativeRouteUnaryConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  JoorRouteUnaryConfigFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryConfig<TPlugins, TBody, TRequest>;
export type NativeUnaryRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryConfig<TPlugins, TBody, TRequest>;
export type NativeUnaryRouteConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryConfigFor<TPlugins, TBody, TRequest>;
export type NativeRouteStreamConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  JoorRouteStreamConfigFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteStreamConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamConfig<TPlugins, TBody, TRequest>;
export type NativeStreamRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamConfig<TPlugins, TBody, TRequest>;
export type NativeStreamRouteConfigFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamConfigFor<TPlugins, TBody, TRequest>;
export type NativeConfigBody<TConfig> = JoorConfigBody<TConfig>;
export type NativeConfigManifest<TConfig> = JoorConfigManifest<TConfig>;
export type NativeConfigRequest<TConfig> = JoorConfigRequest<TConfig>;
export type NativeConfigServices<TConfig> = JoorConfigServices<TConfig>;
export type NativeDefineConfig = DefineConfigFor<NativeManifest>;
export type NativeDefineRouteUnaryConfig = DefineRouteUnaryConfigFor<NativeManifest>;
export type NativeDefineUnaryRouteConfig = NativeDefineRouteUnaryConfig;
export type NativeDefineRouteStreamConfig = DefineRouteStreamConfigFor<NativeManifest>;
export type NativeDefineStreamRouteConfig = NativeDefineRouteStreamConfig;
export const defineNativeConfig: NativeDefineConfig = defineConfigFor<NativeManifest>();
export const defineNativeRouteUnaryConfig: NativeDefineRouteUnaryConfig = defineRouteUnaryConfigFor<NativeManifest>();
export const defineNativeUnaryRouteConfig: NativeDefineUnaryRouteConfig = defineUnaryRouteConfigFor<NativeManifest>();
export const defineNativeRouteStreamConfig: NativeDefineRouteStreamConfig = defineRouteStreamConfigFor<NativeManifest>();
export const defineNativeStreamRouteConfig: NativeDefineStreamRouteConfig = defineStreamRouteConfigFor<NativeManifest>();
export type NativeHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerOptionsFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeHandlerOptions<TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerOptionsFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptions<TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptions<TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptionsFor<TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerOptionsFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptions<TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptions<TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerOptionsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptionsFor<TPlugins, TBody, TRequest>;
export type NativeHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerOptionsArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeHandlerOptions<TPlugins> | NativeBody = NativeHandlerOptions<TPlugins, NativeBody>, TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody, TBody, NativeHandlerOptions<TPlugins, TBody, TRequest>, TRequest>;
export type NativeRouteUnaryHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerOptionsArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeRouteUnaryHandlerOptions<TPlugins> | NativeRouteUnaryBody = NativeRouteUnaryHandlerOptions<TPlugins, NativeRouteUnaryBody>, TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody, TBody, NativeRouteUnaryHandlerOptions<TPlugins, TBody, TRequest>, TRequest>;
export type NativeUnaryRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptionsArgs<TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeRouteUnaryHandlerOptions<TPlugins> | NativeRouteUnaryBody = NativeRouteUnaryHandlerOptions<TPlugins, NativeRouteUnaryBody>, TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptionsArgsFor<TPlugins, TOptionsOrBody, TBody, TRequest>;
export type NativeRouteStreamHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerOptionsArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeRouteStreamHandlerOptions<TPlugins> | NativeRouteStreamBody = NativeRouteStreamHandlerOptions<TPlugins, NativeRouteStreamBody>, TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody, TBody, NativeRouteStreamHandlerOptions<TPlugins, TBody, TRequest>, TRequest>;
export type NativeStreamRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptionsArgs<TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeRouteStreamHandlerOptions<TPlugins> | NativeRouteStreamBody = NativeRouteStreamHandlerOptions<TPlugins, NativeRouteStreamBody>, TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptionsArgsFor<TPlugins, TOptionsOrBody, TBody, TRequest>;
export type NativeHandlerOptionsWithTrailingArgs<TTrailingArgs extends readonly unknown[], TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerOptionsWithTrailingArgs<NativeManifest, TTrailingArgs, TPlugins, TBody, TRequest>;
export type NativeHandlerOptionsWithPreflightArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerOptionsWithPreflightArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerOptionsWithTrailingArgs<TTrailingArgs extends readonly unknown[], TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerOptionsWithTrailingArgs<NativeManifest, TTrailingArgs, TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerOptionsWithTrailingArgs<TTrailingArgs extends readonly unknown[], TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptionsWithTrailingArgs<TTrailingArgs, TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerOptionsWithTrailingArgs<TTrailingArgs extends readonly unknown[], TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerOptionsWithTrailingArgs<NativeManifest, TTrailingArgs, TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerOptionsWithTrailingArgs<TTrailingArgs extends readonly unknown[], TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptionsWithTrailingArgs<TTrailingArgs, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerOptionsWithPreflightArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerOptionsWithPreflightArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerOptionsWithPreflightArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerOptionsWithPreflightArgs<TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerOptionsWithPreflightArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerOptionsWithPreflightArgs<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerOptionsWithPreflightArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerOptionsWithPreflightArgs<TPlugins, TBody, TRequest>;
export type NativeDefineHandlerOptions = DefineHandlerOptions<NativeManifest>;
export type NativeDefineRouteUnaryHandlerOptions = DefineRouteUnaryHandlerOptions<NativeManifest>;
export type NativeDefineUnaryRouteHandlerOptions = NativeDefineRouteUnaryHandlerOptions;
export type NativeDefineRouteStreamHandlerOptions = DefineRouteStreamHandlerOptions<NativeManifest>;
export type NativeDefineStreamRouteHandlerOptions = NativeDefineRouteStreamHandlerOptions;
export const defineNativeHandlerOptions: NativeDefineHandlerOptions = defineHandlerOptions<NativeManifest>();
export const defineNativeRouteUnaryHandlerOptions: NativeDefineRouteUnaryHandlerOptions = defineRouteUnaryHandlerOptions<NativeManifest>();
export const defineNativeUnaryRouteHandlerOptions: NativeDefineUnaryRouteHandlerOptions = defineUnaryRouteHandlerOptions<NativeManifest>();
export const defineNativeRouteStreamHandlerOptions: NativeDefineRouteStreamHandlerOptions = defineRouteStreamHandlerOptions<NativeManifest>();
export const defineNativeStreamRouteHandlerOptions: NativeDefineStreamRouteHandlerOptions = defineStreamRouteHandlerOptions<NativeManifest>();
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
export type NativeHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  HandlerHooksFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryHandlerHooksFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeUnaryRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryHandlerHooks<TPlugins, TBody, TRequest>;
export type NativeRouteStreamHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamHandlerHooksFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeStreamRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamHandlerHooks<TPlugins, TBody, TRequest>;
export type NativeMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  JoorMiddlewareFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeRouteUnaryMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteUnaryMiddlewareFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeUnaryRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteUnaryBody = NativeRouteUnaryBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteUnaryMiddleware<TPlugins, TBody, TRequest>;
export type NativeRouteStreamMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  RpcManifestRouteStreamMiddlewareFor<NativeManifest, TPlugins, TBody, TRequest>;
export type NativeStreamRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeRouteStreamBody = NativeRouteStreamBody, TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  NativeRouteStreamMiddleware<TPlugins, TBody, TRequest>;
export type NativeHandlerOptionServices<TOptions> = HandlerOptionServices<TOptions>;
export type NativeHandlerOptionsServices<TOptions> = HandlerOptionsServices<TOptions>;
export type NativeHandlerOptionsBody<TOptions> = HandlerOptionsBody<TOptions>;
export type NativeHandlerOptionsManifest<TOptions> = HandlerOptionsManifest<TOptions>;
export type NativeHandlerOptionsRequest<TOptions> = HandlerOptionsRequest<TOptions>;
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
export type NativeBodyHandler =
  CompiledRpcBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>;
export type NativeRouteUnaryBodyHandler =
  CompiledRpcRouteUnaryBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>;
export type NativeUnaryRouteBodyHandler = NativeRouteUnaryBodyHandler;
export type NativeRouteStreamBodyHandler =
  CompiledRpcRouteStreamBodyResultHandlerFor<NativeManifest, NativeRequiredRuntimeRequest>;
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
${schemaTypeImport}${procedureTypeImport}${manifestTypeImport}${contextTypeImport}${configTypeImport}${configValueImport}${handlerTypeImport}${handlerValueImport}${configImport}${imports}

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
export const nativeRouteUnaryTransport: NativeRouteUnaryTransportHandler =
  nativeTransport as NativeRouteUnaryTransportHandler;
export const nativeUnaryRouteTransport: NativeUnaryRouteTransportHandler =
  nativeRouteUnaryTransport;
export const nativeRouteStreamTransport: NativeRouteStreamTransportHandler =
  nativeTransport as NativeRouteStreamTransportHandler;
export const nativeStreamRouteTransport: NativeStreamRouteTransportHandler =
  nativeRouteStreamTransport;
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
export const nativeRouteUnaryBody: NativeRouteUnaryBodyHandler =
  nativeBody as NativeRouteUnaryBodyHandler;
export const nativeUnaryRouteBody: NativeUnaryRouteBodyHandler =
  nativeRouteUnaryBody;
export const nativeRouteStreamBody: NativeRouteStreamBodyHandler =
  nativeBody as NativeRouteStreamBodyHandler;
export const nativeStreamRouteBody: NativeStreamRouteBodyHandler =
  nativeRouteStreamBody;
export const transport: NativeTransportHandler = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch,
  true,
  ${transportModeLiteral},
  nativeRuntime
) as NativeTransportHandler;
export const createFetchFor = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeFetchHandler<TRequest> =>
  createCompiledRpcHandlerFor<TRequest>()(${responseDispatchName}, ${configValue}, nativeResponseUnaryDispatch);
export const createRouteUnaryFetchFor: typeof createFetchFor = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeFetchHandler<TRequest> =>
  createCompiledRouteUnaryRpcHandlerFor<TRequest>()(${responseDispatchName}, ${configValue}, nativeResponseUnaryDispatch);
export const createUnaryRouteFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createRouteStreamFetchFor: typeof createFetchFor = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeFetchHandler<TRequest> =>
  createCompiledRouteStreamRpcHandlerFor<TRequest>()(${responseDispatchName}, ${configValue}, nativeResponseUnaryDispatch);
export const createStreamRouteFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
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
    ? "import { createDenoCompiledTransportRequestHandlerFor, createRouteStreamDenoCompiledTransportRequestHandlerFor, createRouteUnaryDenoCompiledTransportRequestHandlerFor, type DenoCompiledRouteStreamTransportBodyResultHandlerFor, type DenoCompiledRouteUnaryTransportBodyResultHandlerFor } from 'joor/runtime/deno-compiled-transport';"
    : "import { createDenoTransportRequestHandlerFor, createRouteStreamDenoTransportRequestHandlerFor, createRouteUnaryDenoTransportRequestHandlerFor, type DenoRouteStreamTransportBodyResultHandlerFor, type DenoRouteUnaryTransportBodyResultHandlerFor } from 'joor/runtime/deno-transport';";
  const denoRouteUnaryTransportHandlerType = denoUseCompiledUnaryFastPath
    ? 'DenoCompiledRouteUnaryTransportBodyResultHandlerFor<NativeManifest>'
    : 'DenoRouteUnaryTransportBodyResultHandlerFor<NativeManifest>';
  const denoRouteStreamTransportHandlerType = denoUseCompiledUnaryFastPath
    ? 'DenoCompiledRouteStreamTransportBodyResultHandlerFor<NativeManifest>'
    : 'DenoRouteStreamTransportBodyResultHandlerFor<NativeManifest>';
  const denoDispatcherImport = denoUseCompiledUnaryFastPath
    ? "import { nativeRouteStreamTransport, nativeRouteUnaryTransport, nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeManifest, type NativeRequiredRuntimeRequest } from './deno-dispatcher.ts';"
    : "import { nativeRouteStreamTransport, nativeRouteUnaryTransport, nativeTransport, type NativeManifest, type NativeRequiredRuntimeRequest } from './deno-dispatcher.ts';";
  const denoCreateFetchReturn = denoUseCompiledUnaryFastPath
    ? `return createDenoCompiledTransportRequestHandlerFor<TRequest>()(
    nativeRuntime,
    nativeTransport,
    nativeUnaryDispatch,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`
    : `return createDenoTransportRequestHandlerFor<TRequest>()(
    nativeTransport,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`;
  const denoCreateRouteUnaryFetchReturn = denoUseCompiledUnaryFastPath
    ? `return createRouteUnaryDenoCompiledTransportRequestHandlerFor<TRequest>()<NativeManifest>(
    nativeRuntime,
    nativeRouteUnaryTransport as ${denoRouteUnaryTransportHandlerType},
    nativeUnaryDispatch,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`
    : `return createRouteUnaryDenoTransportRequestHandlerFor<TRequest>()<NativeManifest>(
    nativeRouteUnaryTransport as ${denoRouteUnaryTransportHandlerType},
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`;
  const denoCreateRouteStreamFetchReturn = denoUseCompiledUnaryFastPath
    ? `return createRouteStreamDenoCompiledTransportRequestHandlerFor<TRequest>()<NativeManifest>(
    nativeRuntime,
    nativeRouteStreamTransport as ${denoRouteStreamTransportHandlerType},
    nativeUnaryDispatch,
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`
    : `return createRouteStreamDenoTransportRequestHandlerFor<TRequest>()<NativeManifest>(
    nativeRouteStreamTransport as ${denoRouteStreamTransportHandlerType},
    bodyLimit,
    createRpcRequestPreflight(cors === undefined ? { path } : { path, cors })
  );`;

  const fetchFile = `${outDir}/fetch.ts`;
  await writeFile(
    fetchFile,
    `import { createFetchFor, createRouteStreamFetchFor, createRouteUnaryFetchFor, createStreamRouteFetchFor, createUnaryRouteFetchFor, fetch, type NativeFetchHandler, type NativeRequiredRuntimeRequest, type NativeRouteStreamFetchHandler, type NativeRouteUnaryFetchHandler, type NativeStreamRouteFetchHandler, type NativeUnaryRouteFetchHandler } from '${dispatcherImport}';

export { createFetchFor, createRouteStreamFetchFor, createRouteUnaryFetchFor, createStreamRouteFetchFor, createUnaryRouteFetchFor, fetch };
export const createFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeFetchHandler<TRequest> =>
  createFetchFor<TRequest>();
export const createRouteUnaryFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeRouteUnaryFetchHandler<TRequest> =>
  createRouteUnaryFetchFor<TRequest>();
export const createUnaryRouteFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createRouteStreamFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(): NativeRouteStreamFetchHandler<TRequest> =>
  createRouteStreamFetchFor<TRequest>();
export const createStreamRouteFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export type { NativeFetchHandler, NativeRequiredRuntimeRequest, NativeRouteStreamFetchHandler, NativeRouteUnaryFetchHandler, NativeStreamRouteFetchHandler, NativeUnaryRouteFetchHandler };
export default fetch;
`
  );

  await writeFile(
    `${outDir}/cloudflare.ts`,
    `import type { CloudflareWorker } from 'joor/runtime/cloudflare';
import { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch, type NativeRequiredRuntimeRequest } from './fetch.js';

export { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch };
export const createCloudflareFetch: typeof createFetch = createFetch;
export const createCloudflareFetchFor: typeof createFetchFor = createFetchFor;
export const createRouteUnaryCloudflareFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createUnaryRouteCloudflareFetch: typeof createRouteUnaryCloudflareFetch =
  createRouteUnaryCloudflareFetch;
export const createRouteUnaryCloudflareFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createUnaryRouteCloudflareFetchFor: typeof createRouteUnaryCloudflareFetchFor =
  createRouteUnaryCloudflareFetchFor;
export const createRouteStreamCloudflareFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createStreamRouteCloudflareFetch: typeof createRouteStreamCloudflareFetch =
  createRouteStreamCloudflareFetch;
export const createRouteStreamCloudflareFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createStreamRouteCloudflareFetchFor: typeof createRouteStreamCloudflareFetchFor =
  createRouteStreamCloudflareFetchFor;
const createWorkerFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TEnv = never,
    TContext = never,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): CloudflareWorker<TEnv, TContext, TRequest> => ({
    fetch: fetchFactory<TRequest>() as CloudflareWorker<
      TEnv,
      TContext,
      TRequest
    >['fetch'],
  });
const createWorkerFromFetchFor =
  (fetchFactory: typeof createFetchFor) =>
  <
    TEnv = never,
    TContext = never,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): CloudflareWorker<TEnv, TContext, TRequest> => ({
    fetch: fetchFactory<TRequest>() as CloudflareWorker<
      TEnv,
      TContext,
      TRequest
    >['fetch'],
  });
export const createWorkerFor = createWorkerFromFetchFor(createFetchFor);
export const worker: CloudflareWorker<
  never,
  never,
  NativeRequiredRuntimeRequest
> = { fetch };
export const createWorker = createWorkerFromFetch(createFetch);
export const createCloudflareWorker: typeof createWorker = createWorker;
export const createCloudflareWorkerFor: typeof createWorkerFor = createWorkerFor;
export const createRouteUnaryWorker: typeof createWorker =
  createWorkerFromFetch(createRouteUnaryFetch);
export const createUnaryRouteWorker: typeof createRouteUnaryWorker =
  createRouteUnaryWorker;
export const createRouteUnaryCloudflareWorker: typeof createRouteUnaryWorker =
  createRouteUnaryWorker;
export const createUnaryRouteCloudflareWorker: typeof createRouteUnaryCloudflareWorker =
  createRouteUnaryCloudflareWorker;
export const createRouteUnaryWorkerFor: typeof createWorkerFor =
  createWorkerFromFetchFor(createRouteUnaryFetchFor);
export const createUnaryRouteWorkerFor: typeof createRouteUnaryWorkerFor =
  createRouteUnaryWorkerFor;
export const createRouteUnaryCloudflareWorkerFor: typeof createRouteUnaryWorkerFor =
  createRouteUnaryWorkerFor;
export const createUnaryRouteCloudflareWorkerFor: typeof createRouteUnaryCloudflareWorkerFor =
  createRouteUnaryCloudflareWorkerFor;
export const createRouteStreamWorker: typeof createWorker =
  createWorkerFromFetch(createRouteStreamFetch);
export const createStreamRouteWorker: typeof createRouteStreamWorker =
  createRouteStreamWorker;
export const createRouteStreamCloudflareWorker: typeof createRouteStreamWorker =
  createRouteStreamWorker;
export const createStreamRouteCloudflareWorker: typeof createRouteStreamCloudflareWorker =
  createRouteStreamCloudflareWorker;
export const createRouteStreamWorkerFor: typeof createWorkerFor =
  createWorkerFromFetchFor(createRouteStreamFetchFor);
export const createStreamRouteWorkerFor: typeof createRouteStreamWorkerFor =
  createRouteStreamWorkerFor;
export const createRouteStreamCloudflareWorkerFor: typeof createRouteStreamWorkerFor =
  createRouteStreamWorkerFor;
export const createStreamRouteCloudflareWorkerFor: typeof createRouteStreamCloudflareWorkerFor =
  createRouteStreamCloudflareWorkerFor;
export default worker;
`
  );

  await writeFile(
    `${outDir}/next.ts`,
    `import type { NextRouteHandlers } from 'joor/runtime/next';
import { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch, type NativeRequiredRuntimeRequest } from './fetch.js';

export { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor };
export const GET = fetch;
export const POST = fetch;
export const OPTIONS = fetch;
const createHandlersFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TContext = never,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NextRouteHandlers<TContext, TRequest> => {
    const handler = fetchFactory<TRequest>();
    return {
      GET: handler,
      POST: handler,
      OPTIONS: handler,
    } as NextRouteHandlers<TContext, TRequest>;
  };
const createHandlersFromFetchFor =
  (fetchFactory: typeof createFetchFor) =>
  <
    TContext = never,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NextRouteHandlers<TContext, TRequest> => {
    const handler = fetchFactory<TRequest>();
    return {
      GET: handler,
      POST: handler,
      OPTIONS: handler,
    } as NextRouteHandlers<TContext, TRequest>;
  };
export const createHandlersFor = createHandlersFromFetchFor(createFetchFor);
export const handlers: NextRouteHandlers<
  never,
  NativeRequiredRuntimeRequest
> = { GET, POST, OPTIONS };
export const createHandlers = createHandlersFromFetch(createFetch);
export const createNextRouteHandlers: typeof createHandlers = createHandlers;
export const createNextHandler: typeof createNextRouteHandlers =
  createNextRouteHandlers;
export const createNextRouteHandlersFor: typeof createHandlersFor =
  createHandlersFor;
export const createNextHandlerFor: typeof createNextRouteHandlersFor =
  createNextRouteHandlersFor;
export const createRouteUnaryHandlers: typeof createHandlers =
  createHandlersFromFetch(createRouteUnaryFetch);
export const createUnaryRouteHandlers: typeof createRouteUnaryHandlers =
  createRouteUnaryHandlers;
export const createRouteUnaryNextRouteHandlers: typeof createRouteUnaryHandlers =
  createRouteUnaryHandlers;
export const createUnaryRouteNextRouteHandlers: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;
export const createRouteUnaryNextHandler: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;
export const createUnaryRouteNextHandler: typeof createRouteUnaryNextRouteHandlers =
  createRouteUnaryNextRouteHandlers;
export const createRouteUnaryHandlersFor: typeof createHandlersFor =
  createHandlersFromFetchFor(createRouteUnaryFetchFor);
export const createUnaryRouteHandlersFor: typeof createRouteUnaryHandlersFor =
  createRouteUnaryHandlersFor;
export const createRouteUnaryNextRouteHandlersFor: typeof createRouteUnaryHandlersFor =
  createRouteUnaryHandlersFor;
export const createUnaryRouteNextRouteHandlersFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;
export const createRouteUnaryNextHandlerFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;
export const createUnaryRouteNextHandlerFor: typeof createRouteUnaryNextRouteHandlersFor =
  createRouteUnaryNextRouteHandlersFor;
export const createRouteStreamHandlers: typeof createHandlers =
  createHandlersFromFetch(createRouteStreamFetch);
export const createStreamRouteHandlers: typeof createRouteStreamHandlers =
  createRouteStreamHandlers;
export const createRouteStreamNextRouteHandlers: typeof createRouteStreamHandlers =
  createRouteStreamHandlers;
export const createStreamRouteNextRouteHandlers: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;
export const createRouteStreamNextHandler: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;
export const createStreamRouteNextHandler: typeof createRouteStreamNextRouteHandlers =
  createRouteStreamNextRouteHandlers;
export const createRouteStreamHandlersFor: typeof createHandlersFor =
  createHandlersFromFetchFor(createRouteStreamFetchFor);
export const createStreamRouteHandlersFor: typeof createRouteStreamHandlersFor =
  createRouteStreamHandlersFor;
export const createRouteStreamNextRouteHandlersFor: typeof createRouteStreamHandlersFor =
  createRouteStreamHandlersFor;
export const createStreamRouteNextRouteHandlersFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
export const createRouteStreamNextHandlerFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
export const createStreamRouteNextHandlerFor: typeof createRouteStreamNextRouteHandlersFor =
  createRouteStreamNextRouteHandlersFor;
export default handlers;
`
  );

  await writeFile(
    `${outDir}/vercel.ts`,
    `import type { VercelFunction } from 'joor/runtime/vercel';
import { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch, type NativeRequiredRuntimeRequest } from './fetch.js';

export { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch };
export const createVercelFetch: typeof createFetch = createFetch;
export const createVercelFetchFor: typeof createFetchFor = createFetchFor;
export const createRouteUnaryVercelFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createUnaryRouteVercelFetch: typeof createRouteUnaryVercelFetch =
  createRouteUnaryVercelFetch;
export const createRouteUnaryVercelFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createUnaryRouteVercelFetchFor: typeof createRouteUnaryVercelFetchFor =
  createRouteUnaryVercelFetchFor;
export const createRouteStreamVercelFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createStreamRouteVercelFetch: typeof createRouteStreamVercelFetch =
  createRouteStreamVercelFetch;
export const createRouteStreamVercelFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createStreamRouteVercelFetchFor: typeof createRouteStreamVercelFetchFor =
  createRouteStreamVercelFetchFor;
const createVercelFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): VercelFunction<TRequest> => ({
    fetch: fetchFactory<TRequest>(),
  });
const createVercelFromFetchFor =
  (fetchFactory: typeof createFetchFor) =>
  <
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): VercelFunction<TRequest> => ({
    fetch: fetchFactory<TRequest>(),
  });
export const createVercelFor = createVercelFromFetchFor(createFetchFor);
export const vercel: VercelFunction<NativeRequiredRuntimeRequest> = { fetch };
export const createVercel = createVercelFromFetch(createFetch);
export const createVercelFunction: typeof createVercel = createVercel;
export const createVercelFunctionFor: typeof createVercelFor =
  createVercelFor;
export const createRouteUnaryVercel: typeof createVercel =
  createVercelFromFetch(createRouteUnaryFetch);
export const createUnaryRouteVercel: typeof createRouteUnaryVercel =
  createRouteUnaryVercel;
export const createRouteUnaryVercelFunction: typeof createRouteUnaryVercel =
  createRouteUnaryVercel;
export const createUnaryRouteVercelFunction: typeof createRouteUnaryVercelFunction =
  createRouteUnaryVercelFunction;
export const createRouteUnaryVercelFor: typeof createVercelFor =
  createVercelFromFetchFor(createRouteUnaryFetchFor);
export const createUnaryRouteVercelFor: typeof createRouteUnaryVercelFor =
  createRouteUnaryVercelFor;
export const createRouteUnaryVercelFunctionFor: typeof createRouteUnaryVercelFor =
  createRouteUnaryVercelFor;
export const createUnaryRouteVercelFunctionFor: typeof createRouteUnaryVercelFunctionFor =
  createRouteUnaryVercelFunctionFor;
export const createRouteStreamVercel: typeof createVercel =
  createVercelFromFetch(createRouteStreamFetch);
export const createStreamRouteVercel: typeof createRouteStreamVercel =
  createRouteStreamVercel;
export const createRouteStreamVercelFunction: typeof createRouteStreamVercel =
  createRouteStreamVercel;
export const createStreamRouteVercelFunction: typeof createRouteStreamVercelFunction =
  createRouteStreamVercelFunction;
export const createRouteStreamVercelFor: typeof createVercelFor =
  createVercelFromFetchFor(createRouteStreamFetchFor);
export const createStreamRouteVercelFor: typeof createRouteStreamVercelFor =
  createRouteStreamVercelFor;
export const createRouteStreamVercelFunctionFor: typeof createRouteStreamVercelFor =
  createRouteStreamVercelFor;
export const createStreamRouteVercelFunctionFor: typeof createRouteStreamVercelFunctionFor =
  createRouteStreamVercelFunctionFor;
export default vercel;
`
  );

  await writeFile(
    `${outDir}/netlify.ts`,
    `import type { NetlifyEdgeFetchHandler } from 'joor/runtime/netlify';
import { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch, type NativeRequiredRuntimeRequest } from './fetch.js';

export { createFetch, createFetchFor, createRouteStreamFetch, createRouteStreamFetchFor, createRouteUnaryFetch, createRouteUnaryFetchFor, createStreamRouteFetch, createStreamRouteFetchFor, createUnaryRouteFetch, createUnaryRouteFetchFor, fetch };
export const createNetlifyFetch: typeof createFetch = createFetch;
export const createNetlifyFetchFor: typeof createFetchFor = createFetchFor;
export const createRouteUnaryNetlifyFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createUnaryRouteNetlifyFetch: typeof createRouteUnaryNetlifyFetch =
  createRouteUnaryNetlifyFetch;
export const createRouteUnaryNetlifyFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createUnaryRouteNetlifyFetchFor: typeof createRouteUnaryNetlifyFetchFor =
  createRouteUnaryNetlifyFetchFor;
export const createRouteStreamNetlifyFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createStreamRouteNetlifyFetch: typeof createRouteStreamNetlifyFetch =
  createRouteStreamNetlifyFetch;
export const createRouteStreamNetlifyFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createStreamRouteNetlifyFetchFor: typeof createRouteStreamNetlifyFetchFor =
  createRouteStreamNetlifyFetchFor;
const createEdgeFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TContext = unknown,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NetlifyEdgeFetchHandler<TContext, TRequest> => {
    const handler = fetchFactory<TRequest>();
    return (request) => handler(request);
  };
const createEdgeFromFetchFor =
  (fetchFactory: typeof createFetchFor) =>
  <
    TContext = unknown,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NetlifyEdgeFetchHandler<TContext, TRequest> => {
    const handler = fetchFactory<TRequest>();
    return (request) => handler(request);
  };
export const createEdgeFor = createEdgeFromFetchFor(createFetchFor);
export const edge: NetlifyEdgeFetchHandler<
  unknown,
  NativeRequiredRuntimeRequest
> = (request) => fetch(request);
export const createEdge = createEdgeFromFetch(createFetch);
export const createNetlifyEdgeFunction: typeof createEdge = createEdge;
export const createNetlifyEdgeFunctionFor: typeof createEdgeFor =
  createEdgeFor;
export const createRouteUnaryEdge: typeof createEdge =
  createEdgeFromFetch(createRouteUnaryFetch);
export const createUnaryRouteEdge: typeof createRouteUnaryEdge =
  createRouteUnaryEdge;
export const createRouteUnaryNetlifyEdgeFunction: typeof createRouteUnaryEdge =
  createRouteUnaryEdge;
export const createUnaryRouteNetlifyEdgeFunction: typeof createRouteUnaryNetlifyEdgeFunction =
  createRouteUnaryNetlifyEdgeFunction;
export const createRouteUnaryEdgeFor: typeof createEdgeFor =
  createEdgeFromFetchFor(createRouteUnaryFetchFor);
export const createUnaryRouteEdgeFor: typeof createRouteUnaryEdgeFor =
  createRouteUnaryEdgeFor;
export const createRouteUnaryNetlifyEdgeFunctionFor: typeof createRouteUnaryEdgeFor =
  createRouteUnaryEdgeFor;
export const createUnaryRouteNetlifyEdgeFunctionFor: typeof createRouteUnaryNetlifyEdgeFunctionFor =
  createRouteUnaryNetlifyEdgeFunctionFor;
export const createRouteStreamEdge: typeof createEdge =
  createEdgeFromFetch(createRouteStreamFetch);
export const createStreamRouteEdge: typeof createRouteStreamEdge =
  createRouteStreamEdge;
export const createRouteStreamNetlifyEdgeFunction: typeof createRouteStreamEdge =
  createRouteStreamEdge;
export const createStreamRouteNetlifyEdgeFunction: typeof createRouteStreamNetlifyEdgeFunction =
  createRouteStreamNetlifyEdgeFunction;
export const createRouteStreamEdgeFor: typeof createEdgeFor =
  createEdgeFromFetchFor(createRouteStreamFetchFor);
export const createStreamRouteEdgeFor: typeof createRouteStreamEdgeFor =
  createRouteStreamEdgeFor;
export const createRouteStreamNetlifyEdgeFunctionFor: typeof createRouteStreamEdgeFor =
  createRouteStreamEdgeFor;
export const createStreamRouteNetlifyEdgeFunctionFor: typeof createRouteStreamNetlifyEdgeFunctionFor =
  createRouteStreamNetlifyEdgeFunctionFor;
export default edge;
`
  );

  await writeFile(
    `${outDir}/aws-lambda.ts`,
    `import { Buffer } from 'node:buffer';
import type { AwsLambdaHandler, AwsLambdaHttpApiHandler, AwsLambdaHttpEventV2, AwsLambdaHttpResponseV2, AwsLambdaRestApiEventV1, AwsLambdaRestApiHandler, AwsLambdaRestApiResponseV1 } from 'joor/runtime/aws-lambda';
import { createFetch, createRouteStreamFetch, createRouteUnaryFetch, createStreamRouteFetch, createUnaryRouteFetch, type NativeRequiredRuntimeRequest } from './fetch.js';

export type NativeAwsLambdaRequestFactory<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = (event: TEvent) => TRequest;

export type NativeAwsLambdaHandlerOptions<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = Request extends TRequest
  ? { readonly createRequest?: NativeAwsLambdaRequestFactory<TEvent, TRequest> }
  : { readonly createRequest: NativeAwsLambdaRequestFactory<TEvent, TRequest> };

export type NativeAwsLambdaHandlerOptionsArgs<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = Request extends TRequest
  ? [options?: NativeAwsLambdaHandlerOptions<TEvent, TRequest>]
  : [options: NativeAwsLambdaHandlerOptions<TEvent, TRequest>];

export type NativeAwsLambdaHandlerFactory<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = (
  ...args: NativeAwsLambdaHandlerOptionsArgs<TEvent, TRequest>
) => AwsLambdaHttpApiHandler<TEvent>;

export type NativeAwsLambdaRestApiRequestFactory<
  TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = (event: TEvent) => TRequest;

export type NativeAwsLambdaRestApiHandlerOptions<
  TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = Request extends TRequest
  ? { readonly createRequest?: NativeAwsLambdaRestApiRequestFactory<TEvent, TRequest> }
  : { readonly createRequest: NativeAwsLambdaRestApiRequestFactory<TEvent, TRequest> };

export type NativeAwsLambdaRestApiHandlerOptionsArgs<
  TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = Request extends TRequest
  ? [options?: NativeAwsLambdaRestApiHandlerOptions<TEvent, TRequest>]
  : [options: NativeAwsLambdaRestApiHandlerOptions<TEvent, TRequest>];

export type NativeAwsLambdaRestApiHandlerFactory<
  TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
  TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
> = (
  ...args: NativeAwsLambdaRestApiHandlerOptionsArgs<TEvent, TRequest>
) => AwsLambdaRestApiHandler<TEvent>;

const eventHeader = (
  event: Pick<AwsLambdaHttpEventV2 | AwsLambdaRestApiEventV1, 'headers'>,
  name: string
): string | undefined => {
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (key.toLowerCase() === wanted) return value;
  }
  return undefined;
};

const queryString = (
  single?: Readonly<Record<string, string | undefined>> | null,
  multi?: Readonly<Record<string, readonly (string | undefined)[] | undefined>> | null
): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(single ?? {})) {
    if (value !== undefined) params.append(key, value);
  }
  for (const [key, values] of Object.entries(multi ?? {})) {
    if (values === undefined) continue;
    params.delete(key);
    for (const value of values) {
      if (value !== undefined) params.append(key, value);
    }
  }
  return params.toString();
};

const eventBody = (
  event: Pick<AwsLambdaHttpEventV2 | AwsLambdaRestApiEventV1, 'body' | 'isBase64Encoded'>
): BodyInit | undefined => {
  if (event.body === undefined || event.body === null) return undefined;
  return event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
};

const eventHeaders = (event: AwsLambdaHttpEventV2): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (value !== undefined) headers.set(key, value);
  }
  if (event.cookies !== undefined && !headers.has('cookie')) {
    headers.set('cookie', event.cookies.join('; '));
  }
  return headers;
};

const restApiEventHeaders = (event: AwsLambdaRestApiEventV1): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (value !== undefined) headers.set(key, value);
  }
  for (const [key, values] of Object.entries(event.multiValueHeaders ?? {})) {
    if (values === undefined) continue;
    const normalizedValues = values.filter(
      (value): value is string => value !== undefined
    );
    if (normalizedValues.length === 0) continue;
    headers.set(
      key,
      key.toLowerCase() === 'cookie'
        ? normalizedValues.join('; ')
        : normalizedValues.join(', ')
    );
  }
  return headers;
};

export const createAwsLambdaRequest = (event: AwsLambdaHttpEventV2): Request => {
  const protocol = eventHeader(event, 'x-forwarded-proto') ?? 'https';
  const host =
    eventHeader(event, 'host') ??
    event.requestContext?.domainName ??
    'localhost';
  const path = event.rawPath ?? '/';
  const query = event.rawQueryString;
  const body = eventBody(event);
  return new Request(
    \`\${protocol}://\${host}\${path}\${query === undefined || query === '' ? '' : \`?\${query}\`}\`,
    {
      method: event.requestContext?.http?.method ?? 'GET',
      headers: eventHeaders(event),
      ...(body === undefined ? {} : { body }),
    }
  );
};

export const createAwsLambdaRestApiRequest = (
  event: AwsLambdaRestApiEventV1
): Request => {
  const protocol = eventHeader(event, 'x-forwarded-proto') ?? 'https';
  const host =
    eventHeader(event, 'host') ??
    event.requestContext?.domainName ??
    'localhost';
  const path = event.path ?? event.requestContext?.path ?? '/';
  const query = queryString(
    event.queryStringParameters,
    event.multiValueQueryStringParameters
  );
  const body = eventBody(event);
  return new Request(
    \`\${protocol}://\${host}\${path}\${query === '' ? '' : \`?\${query}\`}\`,
    {
      method: event.httpMethod ?? 'GET',
      headers: restApiEventHeaders(event),
      ...(body === undefined ? {} : { body }),
    }
  );
};

const getSetCookies = (headers: Headers): string[] => {
  const withSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  return withSetCookie.getSetCookie?.() ?? [];
};

const responseHeaders = (response: Response): Record<string, string> => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') headers[key] = value;
  });
  return headers;
};

export const createAwsLambdaResponse = async (
  response: Response
): Promise<AwsLambdaHttpResponseV2> => {
  const cookies = getSetCookies(response.headers);
  return {
    statusCode: response.status,
    headers: responseHeaders(response),
    ...(cookies.length === 0 ? {} : { cookies }),
    body: await response.text(),
    isBase64Encoded: false,
  };
};

export const createAwsLambdaRestApiResponse = async (
  response: Response
): Promise<AwsLambdaRestApiResponseV1> => {
  const cookies = getSetCookies(response.headers);
  return {
    statusCode: response.status,
    headers: responseHeaders(response),
    ...(cookies.length === 0
      ? {}
      : { multiValueHeaders: { 'set-cookie': cookies } }),
    body: await response.text(),
    isBase64Encoded: false,
  };
};

const createHttpApiHandlerFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(
    ...args: NativeAwsLambdaHandlerOptionsArgs<TEvent, TRequest>
  ): AwsLambdaHttpApiHandler<TEvent> => {
    const options = args[0] as
      | NativeAwsLambdaHandlerOptions<TEvent, TRequest>
      | undefined;
    const createRequest =
      options?.createRequest ??
      (createAwsLambdaRequest as unknown as NativeAwsLambdaRequestFactory<
        TEvent,
        TRequest
      >);
    const handler = fetchFactory<TRequest>();
    return async (event) =>
      createAwsLambdaResponse(await handler(createRequest(event)));
  };

const createRestApiHandlerFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(
    ...args: NativeAwsLambdaRestApiHandlerOptionsArgs<TEvent, TRequest>
  ): AwsLambdaRestApiHandler<TEvent> => {
    const options = args[0] as
      | NativeAwsLambdaRestApiHandlerOptions<TEvent, TRequest>
      | undefined;
    const createRequest =
      options?.createRequest ??
      (createAwsLambdaRestApiRequest as unknown as NativeAwsLambdaRestApiRequestFactory<
        TEvent,
        TRequest
      >);
    const handler = fetchFactory<TRequest>();
    return async (event) =>
      createAwsLambdaRestApiResponse(await handler(createRequest(event)));
  };

const createHttpApiHandlerFactoryFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NativeAwsLambdaHandlerFactory<TEvent, TRequest> =>
    (...args) =>
      createHttpApiHandlerFromFetch(fetchFactory)<TEvent, TRequest>(...args);

const createRestApiHandlerFactoryFromFetch =
  (fetchFactory: typeof createFetch) =>
  <
    TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
    TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest,
  >(): NativeAwsLambdaRestApiHandlerFactory<TEvent, TRequest> =>
    (...args) =>
      createRestApiHandlerFromFetch(fetchFactory)<TEvent, TRequest>(...args);

export const createAwsLambdaHandler = createHttpApiHandlerFromFetch(createFetch);
export const createAwsLambdaHandlerFor =
  createHttpApiHandlerFactoryFromFetch(createFetch);
export const createAwsLambdaHttpApiHandler: typeof createAwsLambdaHandler =
  createAwsLambdaHandler;
export const createAwsLambdaHttpApiHandlerFor: typeof createAwsLambdaHandlerFor =
  createAwsLambdaHandlerFor;
const defaultAwsLambdaHandler: AwsLambdaHttpApiHandler = async (event) => {
  const fetch = createFetch<NativeRequiredRuntimeRequest>();
  return createAwsLambdaResponse(
    await fetch(createAwsLambdaRequest(event) as NativeRequiredRuntimeRequest)
  );
};
export const handler = defaultAwsLambdaHandler as Request extends NativeRequiredRuntimeRequest
  ? AwsLambdaHttpApiHandler
  : never;
export const httpApiHandler: typeof handler = handler;

export const createRouteUnaryAwsLambdaHandler =
  createHttpApiHandlerFromFetch(createRouteUnaryFetch);
export const createUnaryRouteAwsLambdaHandler: typeof createRouteUnaryAwsLambdaHandler =
  createRouteUnaryAwsLambdaHandler;
export const createRouteUnaryAwsLambdaHandlerFor =
  createHttpApiHandlerFactoryFromFetch(createRouteUnaryFetch);
export const createUnaryRouteAwsLambdaHandlerFor: typeof createRouteUnaryAwsLambdaHandlerFor =
  createRouteUnaryAwsLambdaHandlerFor;
export const createRouteUnaryAwsLambdaHttpApiHandler: typeof createRouteUnaryAwsLambdaHandler =
  createRouteUnaryAwsLambdaHandler;
export const createUnaryRouteAwsLambdaHttpApiHandler: typeof createRouteUnaryAwsLambdaHttpApiHandler =
  createRouteUnaryAwsLambdaHttpApiHandler;
export const createRouteUnaryAwsLambdaHttpApiHandlerFor: typeof createRouteUnaryAwsLambdaHandlerFor =
  createRouteUnaryAwsLambdaHandlerFor;
export const createUnaryRouteAwsLambdaHttpApiHandlerFor: typeof createRouteUnaryAwsLambdaHttpApiHandlerFor =
  createRouteUnaryAwsLambdaHttpApiHandlerFor;

export const createRouteStreamAwsLambdaHandler =
  createHttpApiHandlerFromFetch(createRouteStreamFetch);
export const createStreamRouteAwsLambdaHandler: typeof createRouteStreamAwsLambdaHandler =
  createRouteStreamAwsLambdaHandler;
export const createRouteStreamAwsLambdaHandlerFor =
  createHttpApiHandlerFactoryFromFetch(createRouteStreamFetch);
export const createStreamRouteAwsLambdaHandlerFor: typeof createRouteStreamAwsLambdaHandlerFor =
  createRouteStreamAwsLambdaHandlerFor;
export const createRouteStreamAwsLambdaHttpApiHandler: typeof createRouteStreamAwsLambdaHandler =
  createRouteStreamAwsLambdaHandler;
export const createStreamRouteAwsLambdaHttpApiHandler: typeof createRouteStreamAwsLambdaHttpApiHandler =
  createRouteStreamAwsLambdaHttpApiHandler;
export const createRouteStreamAwsLambdaHttpApiHandlerFor: typeof createRouteStreamAwsLambdaHandlerFor =
  createRouteStreamAwsLambdaHandlerFor;
export const createStreamRouteAwsLambdaHttpApiHandlerFor: typeof createRouteStreamAwsLambdaHttpApiHandlerFor =
  createRouteStreamAwsLambdaHttpApiHandlerFor;

export const createAwsLambdaRestApiHandler =
  createRestApiHandlerFromFetch(createFetch);
export const createAwsLambdaRestApiHandlerFor =
  createRestApiHandlerFactoryFromFetch(createFetch);
const defaultAwsLambdaRestApiHandler: AwsLambdaRestApiHandler = async (event) => {
  const fetch = createFetch<NativeRequiredRuntimeRequest>();
  return createAwsLambdaRestApiResponse(
    await fetch(
      createAwsLambdaRestApiRequest(event) as NativeRequiredRuntimeRequest
    )
  );
};
export const restApiHandler = defaultAwsLambdaRestApiHandler as Request extends NativeRequiredRuntimeRequest
  ? AwsLambdaRestApiHandler
  : never;

export const createRouteUnaryAwsLambdaRestApiHandler =
  createRestApiHandlerFromFetch(createRouteUnaryFetch);
export const createUnaryRouteAwsLambdaRestApiHandler: typeof createRouteUnaryAwsLambdaRestApiHandler =
  createRouteUnaryAwsLambdaRestApiHandler;
export const createRouteUnaryAwsLambdaRestApiHandlerFor =
  createRestApiHandlerFactoryFromFetch(createRouteUnaryFetch);
export const createUnaryRouteAwsLambdaRestApiHandlerFor: typeof createRouteUnaryAwsLambdaRestApiHandlerFor =
  createRouteUnaryAwsLambdaRestApiHandlerFor;

export const createRouteStreamAwsLambdaRestApiHandler =
  createRestApiHandlerFromFetch(createRouteStreamFetch);
export const createStreamRouteAwsLambdaRestApiHandler: typeof createRouteStreamAwsLambdaRestApiHandler =
  createRouteStreamAwsLambdaRestApiHandler;
export const createRouteStreamAwsLambdaRestApiHandlerFor =
  createRestApiHandlerFactoryFromFetch(createRouteStreamFetch);
export const createStreamRouteAwsLambdaRestApiHandlerFor: typeof createRouteStreamAwsLambdaRestApiHandlerFor =
  createRouteStreamAwsLambdaRestApiHandlerFor;

export { createRouteStreamFetch, createRouteUnaryFetch, createStreamRouteFetch, createUnaryRouteFetch };
export default handler;
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
import { nativeRouteStreamTransport, nativeRouteUnaryTransport, nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBody, type NativeRequiredRuntimeRequest, type NativeRouteStreamBody, type NativeRouteUnaryBody, type NativeTransportResult } from '${dispatcherImport}';
${nodeFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  readonly body: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly responseHeaders?: Readonly<Record<string, string>>;
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
  source: Readonly<Record<string, string>>
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
  source?: Readonly<Record<string, string>>
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
  readonly hostname?: string;
  readonly path?: string;
  readonly cors?: NativeCorsOptions | false;
  readonly maxBodyBytes?: number;
}

export interface NativeCorsOptions {
  readonly origin?: string;
  readonly methods?: readonly string[];
  readonly headers?: readonly string[];
}

export interface NodeListenOptions extends NodeNativeOptions {
  readonly port?: number;
}

export type NodeNativeHandler<
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
> = (
  incoming: TIncoming,
  outgoing: TOutgoing
) => void | Promise<void>;
type NodeNativeTransportHandler<TBody extends NativeBody = NativeBody> = (
  request: IncomingRequestSource,
  body: TBody
) => NativeTransportResult | Promise<NativeTransportResult>;

export interface NodeNativeServer {
  readonly listening: boolean;
  address(): AddressInfo | string | null;
  close(callback?: (error?: Error) => void): this;
  ref(): this;
  unref(): this;
}

const createHandlerFromTransport =
  <TBody extends NativeBody>(transport: NodeNativeTransportHandler<TBody>) =>
  <
  TIncoming extends IncomingMessage = IncomingMessage,
  TOutgoing extends ServerResponse<TIncoming> = ServerResponse<TIncoming>,
>(
  options: NodeNativeOptions = {}
): NodeNativeHandler<TIncoming, TOutgoing> => {
  const hostname = options.hostname ?? '0.0.0.0';
  const path = options.path ?? configuredPath;
  const cors = resolveCorsHeaders(options.cors);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  return async (
    incoming: TIncoming,
    outgoing: TOutgoing
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
      await transport(request, body as TBody),
      cors
    );
  };
};
export const createHandler = createHandlerFromTransport<NativeBody>(
  nativeTransport
);

export const handler: NodeNativeHandler = createHandler();
export const createNodeHandler: typeof createHandler = createHandler;
export const createRouteUnaryHandler: typeof createHandler =
  createHandlerFromTransport<NativeRouteUnaryBody>(nativeRouteUnaryTransport);
export const createUnaryRouteHandler: typeof createRouteUnaryHandler =
  createRouteUnaryHandler;
export const createRouteUnaryNodeHandler: typeof createRouteUnaryHandler =
  createRouteUnaryHandler;
export const createUnaryRouteNodeHandler: typeof createRouteUnaryNodeHandler =
  createRouteUnaryNodeHandler;
export const createRouteStreamHandler: typeof createHandler =
  createHandlerFromTransport<NativeRouteStreamBody>(nativeRouteStreamTransport);
export const createStreamRouteHandler: typeof createRouteStreamHandler =
  createRouteStreamHandler;
export const createRouteStreamNodeHandler: typeof createRouteStreamHandler =
  createRouteStreamHandler;
export const createStreamRouteNodeHandler: typeof createRouteStreamNodeHandler =
  createRouteStreamNodeHandler;

const listenWithHandler = (
  handlerFactory: typeof createHandler,
  options: NodeListenOptions = {}
): NodeNativeServer => {
  const hostname = options.hostname ?? '0.0.0.0';
  const server = createServer(handlerFactory(options));
  server.listen(options.port ?? 3000, hostname);
  return server;
};
export const listen = (options: NodeListenOptions = {}): NodeNativeServer =>
  listenWithHandler(createHandler, options);
export const serve: typeof listen = listen;
export const createServerFor: typeof listen = listen;
export const createRouteUnaryServerFor: typeof listen = (
  options: NodeListenOptions = {}
): NodeNativeServer => listenWithHandler(createRouteUnaryHandler, options);
export const createUnaryRouteServerFor: typeof createRouteUnaryServerFor =
  createRouteUnaryServerFor;
export const createRouteUnaryNodeServerFor: typeof createRouteUnaryServerFor =
  createRouteUnaryServerFor;
export const createUnaryRouteNodeServerFor: typeof createRouteUnaryNodeServerFor =
  createRouteUnaryNodeServerFor;
export const listenRouteUnary: typeof createRouteUnaryServerFor =
  createRouteUnaryServerFor;
export const listenUnaryRoute: typeof listenRouteUnary = listenRouteUnary;
export const listenNodeRouteUnary: typeof listenRouteUnary = listenRouteUnary;
export const listenNodeUnaryRoute: typeof listenRouteUnary = listenRouteUnary;
export const createRouteStreamServerFor: typeof listen = (
  options: NodeListenOptions = {}
): NodeNativeServer => listenWithHandler(createRouteStreamHandler, options);
export const createStreamRouteServerFor: typeof createRouteStreamServerFor =
  createRouteStreamServerFor;
export const createRouteStreamNodeServerFor: typeof createRouteStreamServerFor =
  createRouteStreamServerFor;
export const createStreamRouteNodeServerFor: typeof createRouteStreamNodeServerFor =
  createRouteStreamNodeServerFor;
export const listenRouteStream: typeof createRouteStreamServerFor =
  createRouteStreamServerFor;
export const listenStreamRoute: typeof listenRouteStream = listenRouteStream;
export const listenNodeRouteStream: typeof listenRouteStream =
  listenRouteStream;
export const listenNodeStreamRoute: typeof listenRouteStream =
  listenRouteStream;
`
  );

  const bunFile = `${outDir}/bun.ts`;
  await writeFile(
    bunFile,
    `import type { JsonValue } from 'joor/schema';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRouteStreamTransport, nativeRouteUnaryTransport, nativeRuntime, nativeTransport, nativeUnaryDispatch, type NativeBody, type NativeRequiredRuntimeRequest, type NativeRouteStreamBody, type NativeRouteUnaryBody, type NativeTransportResult } from '${dispatcherImport}';
${bunFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  readonly body: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly responseHeaders?: Readonly<Record<string, string>>;
}

const configuredPath = ${configuredPath};
const configuredCors = ${configuredCors};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};
const checkContentType = ${bunFastEntries.length === 0 ? 'true' : 'false'};
const defaultMaxBodyBytes = 1024 * 1024;
const jsonHeaders = Object.freeze({ 'content-type': 'application/json' });
const jsonOkResponseInit: Readonly<ResponseInit> = {
  status: 200,
  headers: jsonHeaders,
};
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
  source: Readonly<Record<string, string>>
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
  source?: Readonly<Record<string, string>>
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
  readonly hostname?: string;
  readonly path?: string;
  readonly cors?: NativeCorsOptions | false;
  readonly maxBodyBytes?: number;
  readonly port?: number;
}

export interface NativeCorsOptions {
  readonly origin?: string;
  readonly methods?: readonly string[];
  readonly headers?: readonly string[];
}

export type BunNativeFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = (
  request: TRequest
) => Response | Promise<Response>;
export type BunNativeRouteUnaryFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  BunNativeFetchHandler<TRequest>;
export type BunNativeUnaryRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  BunNativeRouteUnaryFetchHandler<TRequest>;
export type BunNativeRouteStreamFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  BunNativeFetchHandler<TRequest>;
export type BunNativeStreamRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  BunNativeRouteStreamFetchHandler<TRequest>;
type BunNativeTransportHandler<TBody extends NativeBody = NativeBody> = (
  request: FetchRequestSource,
  body: TBody
) => NativeTransportResult | Promise<NativeTransportResult>;

export interface BunNativeServer {
  readonly hostname?: string;
  readonly port?: number;
  readonly url?: URL;
  stop?(force?: boolean): void;
  ref?(): void;
  unref?(): void;
}

const createFetchFromTransportFor =
  <TBody extends NativeBody>(transport: BunNativeTransportHandler<TBody>) =>
  <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>() =>
  (options: BunNativeOptions = {}): BunNativeFetchHandler<TRequest> => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsHeaders(options.cors);
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  const unlimitedBody = bodyLimit >= Number.MAX_SAFE_INTEGER;
  return async (request: TRequest): Promise<Response> => {
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
      await transport(source, body as TBody),
      cors
    );
  };
};
export const createFetchFor = createFetchFromTransportFor<NativeBody>(
  nativeTransport
);
export const createBunFetchFor: typeof createFetchFor = createFetchFor;
export const createRouteUnaryFetchFor: typeof createFetchFor =
  createFetchFromTransportFor<NativeRouteUnaryBody>(nativeRouteUnaryTransport);
export const createUnaryRouteFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createRouteUnaryBunFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createUnaryRouteBunFetchFor: typeof createRouteUnaryBunFetchFor =
  createRouteUnaryBunFetchFor;
export const createRouteStreamFetchFor: typeof createFetchFor =
  createFetchFromTransportFor<NativeRouteStreamBody>(nativeRouteStreamTransport);
export const createStreamRouteFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createRouteStreamBunFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createStreamRouteBunFetchFor: typeof createRouteStreamBunFetchFor =
  createRouteStreamBunFetchFor;

export const createFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: BunNativeOptions = {}
): BunNativeFetchHandler<TRequest> => createFetchFor<TRequest>()(options);
export const createBunFetch: typeof createFetch = createFetch;
export const createRouteUnaryFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: BunNativeOptions = {}
): BunNativeRouteUnaryFetchHandler<TRequest> =>
  createRouteUnaryFetchFor<TRequest>()(options);
export const createUnaryRouteFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createRouteUnaryBunFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createUnaryRouteBunFetch: typeof createRouteUnaryBunFetch =
  createRouteUnaryBunFetch;
export const createRouteStreamFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: BunNativeOptions = {}
): BunNativeRouteStreamFetchHandler<TRequest> =>
  createRouteStreamFetchFor<TRequest>()(options);
export const createStreamRouteFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createRouteStreamBunFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createStreamRouteBunFetch: typeof createRouteStreamBunFetch =
  createRouteStreamBunFetch;

export const fetch: BunNativeFetchHandler = createFetch();

const createServerFromFetch =
  (fetchFactory: typeof createFetch) =>
  (options: BunNativeOptions = {}): BunNativeServer => {
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(config: {
        port: number;
        hostname: string;
        fetch(request: Request): Response | Promise<Response>;
      }): BunNativeServer;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  return bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch: fetchFactory(options),
  });
};
export const serve = createServerFromFetch(createFetch);
export const listen: typeof serve = serve;
export const serveBun: typeof serve = serve;
export const serveRouteUnary = createServerFromFetch(createRouteUnaryFetch);
export const serveUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const listenRouteUnary: typeof serveRouteUnary = serveRouteUnary;
export const listenUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const serveRouteUnaryBun: typeof serveRouteUnary = serveRouteUnary;
export const serveUnaryRouteBun: typeof serveRouteUnary = serveRouteUnary;
export const serveBunRouteUnary: typeof serveRouteUnary = serveRouteUnary;
export const serveBunUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const serveRouteStream = createServerFromFetch(createRouteStreamFetch);
export const serveStreamRoute: typeof serveRouteStream = serveRouteStream;
export const listenRouteStream: typeof serveRouteStream = serveRouteStream;
export const listenStreamRoute: typeof serveRouteStream = serveRouteStream;
export const serveRouteStreamBun: typeof serveRouteStream = serveRouteStream;
export const serveStreamRouteBun: typeof serveRouteStream = serveRouteStream;
export const serveBunRouteStream: typeof serveRouteStream = serveRouteStream;
export const serveBunStreamRoute: typeof serveRouteStream = serveRouteStream;
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
  readonly origin?: string;
  readonly methods?: readonly string[];
  readonly headers?: readonly string[];
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
  readonly hostname?: string;
  readonly path?: string;
  readonly cors?: NativeCorsOptions | false;
  readonly maxBodyBytes?: number;
  readonly port?: number;
}

export type DenoNativeFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> = (
  request: TRequest
) => Response | Promise<Response>;
export type DenoNativeRouteUnaryFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  DenoNativeFetchHandler<TRequest>;
export type DenoNativeUnaryRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  DenoNativeRouteUnaryFetchHandler<TRequest>;
export type DenoNativeRouteStreamFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  DenoNativeFetchHandler<TRequest>;
export type DenoNativeStreamRouteFetchHandler<TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest> =
  DenoNativeRouteStreamFetchHandler<TRequest>;

export interface DenoNativeServer {
  readonly finished: Promise<void>;
  shutdown(): Promise<void>;
  ref?(): void;
  unref?(): void;
}

export const createFetchFor =
  <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>() =>
  (options: DenoNativeOptions = {}): DenoNativeFetchHandler<TRequest> => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsOptions(options.cors);
  const bodyLimit =
    options.maxBodyBytes ?? configuredMaxBodyBytes;
  ${denoCreateFetchReturn}
};
export const createDenoFetchFor: typeof createFetchFor = createFetchFor;
export const createRouteUnaryFetchFor =
  <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>() =>
  (options: DenoNativeOptions = {}): DenoNativeRouteUnaryFetchHandler<TRequest> => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsOptions(options.cors);
  const bodyLimit =
    options.maxBodyBytes ?? configuredMaxBodyBytes;
  ${denoCreateRouteUnaryFetchReturn}
};
export const createUnaryRouteFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createRouteUnaryDenoFetchFor: typeof createRouteUnaryFetchFor =
  createRouteUnaryFetchFor;
export const createUnaryRouteDenoFetchFor: typeof createRouteUnaryDenoFetchFor =
  createRouteUnaryDenoFetchFor;
export const createRouteStreamFetchFor =
  <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>() =>
  (options: DenoNativeOptions = {}): DenoNativeRouteStreamFetchHandler<TRequest> => {
  const path = options.path ?? configuredPath;
  const cors = resolveCorsOptions(options.cors);
  const bodyLimit =
    options.maxBodyBytes ?? configuredMaxBodyBytes;
  ${denoCreateRouteStreamFetchReturn}
};
export const createStreamRouteFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createRouteStreamDenoFetchFor: typeof createRouteStreamFetchFor =
  createRouteStreamFetchFor;
export const createStreamRouteDenoFetchFor: typeof createRouteStreamDenoFetchFor =
  createRouteStreamDenoFetchFor;

export const createFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: DenoNativeOptions = {}
): DenoNativeFetchHandler<TRequest> => createFetchFor<TRequest>()(options);
export const createDenoFetch: typeof createFetch = createFetch;
export const createRouteUnaryFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: DenoNativeOptions = {}
): DenoNativeRouteUnaryFetchHandler<TRequest> =>
  createRouteUnaryFetchFor<TRequest>()(options);
export const createUnaryRouteFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createRouteUnaryDenoFetch: typeof createRouteUnaryFetch =
  createRouteUnaryFetch;
export const createUnaryRouteDenoFetch: typeof createRouteUnaryDenoFetch =
  createRouteUnaryDenoFetch;
export const createRouteStreamFetch = <TRequest extends NativeRequiredRuntimeRequest = NativeRequiredRuntimeRequest>(
  options: DenoNativeOptions = {}
): DenoNativeRouteStreamFetchHandler<TRequest> =>
  createRouteStreamFetchFor<TRequest>()(options);
export const createStreamRouteFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createRouteStreamDenoFetch: typeof createRouteStreamFetch =
  createRouteStreamFetch;
export const createStreamRouteDenoFetch: typeof createRouteStreamDenoFetch =
  createRouteStreamDenoFetch;

export const fetch: DenoNativeFetchHandler = createFetch();

const createServerFromFetch =
  (fetchFactory: typeof createFetch) =>
  (options: DenoNativeOptions = {}): DenoNativeServer => {
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(config: {
        port: number;
        hostname: string;
        handler(request: Request): Response | Promise<Response>;
      }): DenoNativeServer;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  return denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: fetchFactory(options),
  });
};
export const serve = createServerFromFetch(createFetch);
export const listen: typeof serve = serve;
export const serveDeno: typeof serve = serve;
export const serveRouteUnary = createServerFromFetch(createRouteUnaryFetch);
export const serveUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const listenRouteUnary: typeof serveRouteUnary = serveRouteUnary;
export const listenUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const serveRouteUnaryDeno: typeof serveRouteUnary = serveRouteUnary;
export const serveUnaryRouteDeno: typeof serveRouteUnary = serveRouteUnary;
export const serveDenoRouteUnary: typeof serveRouteUnary = serveRouteUnary;
export const serveDenoUnaryRoute: typeof serveRouteUnary = serveRouteUnary;
export const serveRouteStream = createServerFromFetch(createRouteStreamFetch);
export const serveStreamRoute: typeof serveRouteStream = serveRouteStream;
export const listenRouteStream: typeof serveRouteStream = serveRouteStream;
export const listenStreamRoute: typeof serveRouteStream = serveRouteStream;
export const serveRouteStreamDeno: typeof serveRouteStream = serveRouteStream;
export const serveStreamRouteDeno: typeof serveRouteStream = serveRouteStream;
export const serveDenoRouteStream: typeof serveRouteStream = serveRouteStream;
export const serveDenoStreamRoute: typeof serveRouteStream = serveRouteStream;
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
        ([name, child]) => `${indent}readonly ${JSON.stringify(name)}: {
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
        return `${indent}readonly ${JSON.stringify(name)}: ${typeName}<${JSON.stringify(id)}>;`;
      })
      .join('\n');
    return [childBlocks, procedureBlocks].filter(Boolean).join('\n');
  };
  const clientBody = renderNode(tree, 2);
  const clientTypeBody = renderTypeNode(tree, 1);
  const defaultUrl = config?.path ?? '/rpc';
  await writeFile(
    `${outDir}/client.ts`,
    `import { createManifestClient as createTransportClient, createManifestRouteProtocolRequest as createTransportRouteProtocolRequest, createManifestRouteRequest as createTransportRouteRequest, createManifestRouteStreamProtocolRequest as createTransportRouteStreamProtocolRequest, createManifestRouteStreamRequest as createTransportRouteStreamRequest, createManifestRouteUnaryProtocolRequest as createTransportRouteUnaryProtocolRequest, type RpcProtocolRequestOptions } from 'joor/client';
import type { JoorManifestClientOptions, JoorManifestRouteBatchClientHeaders, JoorManifestRouteBatchOptions, JoorManifestRouteBatchOptionsTuple, JoorManifestRouteBatchRequest, JoorManifestRouteBatchResults, JoorManifestRouteBody, JoorManifestRouteBodyResult, JoorManifestRouteBodyResultFor, JoorManifestRouteClientArgs, JoorManifestRouteClientHeaders, JoorManifestRouteEnvelope, JoorManifestRouteEnvelopeUnion, JoorManifestRouteError, JoorManifestRouteErrorCode, JoorManifestRouteErrorDetails, JoorManifestRouteHasHeaders, JoorManifestRouteHasResponseHeaders, JoorManifestRouteHeaders, JoorManifestRouteId, JoorManifestRouteInput, JoorManifestRouteOutput, JoorManifestRouteProcedure, JoorManifestRouteProtocolBatchRequest, JoorManifestRouteProtocolBatchResults, JoorManifestRouteProtocolRequest, JoorManifestRouteProtocolRequestUnion, JoorManifestRouteRequest, JoorManifestRouteRequestOptions, JoorManifestRouteRequestUnion, JoorManifestRouteRequiresHeaders, JoorManifestRouteRequiresResponseHeaders, JoorManifestRouteResponseHeaders, JoorManifestRequiredRuntimeRequest, JoorManifestRequiredServices, JoorManifestRouteResult, JoorManifestRouteResultUnion, JoorManifestRouteRuntimeRequest, JoorManifestRouteServices, JoorManifestRouteStreamEvent, JoorManifestRouteStreamId, JoorManifestRouteStreamProtocolRequest, JoorManifestRouteStreamProtocolRequestUnion, JoorManifestRouteStreamRequest, JoorManifestRouteStreamRequestUnion, JoorManifestRouteUnaryId, JoorManifestRouteUnaryProcedure, JoorManifestRouteStreamProcedure, JoorManifestRouteUnaryInput, JoorManifestRouteStreamInput, JoorManifestRouteUnaryOutput, JoorManifestRouteStreamOutput, JoorManifestRouteUnaryHeaders, JoorManifestRouteStreamHeaders, JoorManifestRouteUnaryClientHeaders, JoorManifestRouteStreamClientHeaders, JoorManifestRouteUnaryResponseHeaders, JoorManifestRouteStreamResponseHeaders, JoorManifestRouteUnaryError, JoorManifestRouteStreamError, JoorManifestRouteUnaryErrorCode, JoorManifestRouteStreamErrorCode, JoorManifestRouteUnaryErrorDetails, JoorManifestRouteStreamErrorDetails, JoorManifestRouteUnaryEnvelope, JoorManifestRouteUnaryEnvelopeUnion, JoorManifestRouteUnaryResult, JoorManifestRouteUnaryResultUnion, JoorManifestRouteUnaryHasHeaders, JoorManifestRouteStreamHasHeaders, JoorManifestRouteUnaryRequiresHeaders, JoorManifestRouteStreamRequiresHeaders, JoorManifestRouteUnaryHasResponseHeaders, JoorManifestRouteStreamHasResponseHeaders, JoorManifestRouteUnaryRequiresResponseHeaders, JoorManifestRouteStreamRequiresResponseHeaders, JoorManifestRouteUnaryRequestOptions, JoorManifestRouteStreamRequestOptions, JoorManifestRouteUnaryClientArgs, JoorManifestRouteStreamClientArgs, JoorManifestRouteUnaryBatchClientHeaders, JoorManifestRouteUnaryBatchOptions, JoorManifestRouteUnaryBatchOptionsTuple, JoorManifestRouteUnaryBatchRequest, JoorManifestRouteUnaryBatchResults, JoorManifestRouteUnaryBodyResult, JoorManifestRouteStreamBodyResult, JoorManifestRouteUnaryBodyResultFor, JoorManifestRouteStreamBodyResultFor, JoorManifestRouteUnaryRequest, JoorManifestRouteUnaryRequestUnion, JoorManifestRouteUnaryProtocolBatchRequest, JoorManifestRouteUnaryProtocolBatchResults, JoorManifestRouteUnaryProtocolRequest, JoorManifestRouteUnaryProtocolRequestUnion, JoorManifestStreamRouteClientArgs, JoorManifestStreamRouteClientHeaders, JoorManifestStreamRouteError, JoorManifestStreamRouteErrorCode, JoorManifestStreamRouteErrorDetails, JoorManifestStreamRouteEvent, JoorManifestStreamRouteHasHeaders, JoorManifestStreamRouteHasResponseHeaders, JoorManifestStreamRouteHeaders, JoorManifestStreamRouteInput, JoorManifestStreamRouteOutput, JoorManifestStreamRouteProcedure, JoorManifestStreamRouteRequiresHeaders, JoorManifestStreamRouteRequiresResponseHeaders, JoorManifestStreamRouteResponseHeaders, JoorManifestStreamRouteRequestOptions, JoorManifestTransportClient, JoorManifestUnaryRouteBatchClientHeaders, JoorManifestUnaryRouteBatchOptions, JoorManifestUnaryRouteBatchOptionsTuple, JoorManifestUnaryRouteClientArgs, JoorManifestUnaryRouteClientHeaders, JoorManifestUnaryRouteEnvelope, JoorManifestUnaryRouteError, JoorManifestUnaryRouteErrorCode, JoorManifestUnaryRouteErrorDetails, JoorManifestUnaryRouteHasHeaders, JoorManifestUnaryRouteHasResponseHeaders, JoorManifestUnaryRouteHeaders, JoorManifestUnaryRouteInput, JoorManifestUnaryRouteOutput, JoorManifestUnaryRouteProcedure, JoorManifestUnaryRouteResponseHeaders, JoorManifestUnaryRouteResult, JoorManifestUnaryRouteRequiresHeaders, JoorManifestUnaryRouteRequiresResponseHeaders, JoorManifestUnaryRouteRequestOptions } from 'joor/manifest';
import type { JoorManifestProtocolBatchClientHeaders, JoorManifestProtocolBatchOptions, JoorManifestProtocolBatchOptionsTuple, JoorManifestRouteProtocolBatchClientHeaders, JoorManifestRouteProtocolBatchOptions, JoorManifestRouteProtocolBatchOptionsTuple, JoorManifestRouteUnaryProtocolBatchClientHeaders, JoorManifestRouteUnaryProtocolBatchOptions, JoorManifestRouteUnaryProtocolBatchOptionsTuple, JoorManifestUnaryRouteProtocolBatchClientHeaders, JoorManifestUnaryRouteProtocolBatchOptions, JoorManifestUnaryRouteProtocolBatchOptionsTuple } from 'joor/manifest';
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
export type RequiredRuntimeRequest = JoorManifestRequiredRuntimeRequest<Manifest>;
export type RequiredServices = JoorManifestRequiredServices<Manifest>;
export type RouteRuntimeRequest<TId extends RouteId = RouteId> = JoorManifestRouteRuntimeRequest<Manifest, TId>;
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
export type RouteBatchRequestUnion = RouteRequestUnion | RouteUnaryProtocolRequestUnion;
export type RouteUnaryBatchRequestUnion = RouteUnaryRequestUnion | RouteUnaryProtocolRequestUnion;
export type UnaryRouteBatchRequestUnion = RouteUnaryBatchRequestUnion;
export type RouteBatchRequest<TRequests extends readonly RouteBatchRequestUnion[] = readonly RouteBatchRequestUnion[]> = JoorManifestRouteBatchRequest<Manifest, TRequests>;
export type RouteUnaryBatchRequest<TRequests extends readonly RouteUnaryBatchRequestUnion[] = readonly RouteUnaryBatchRequestUnion[]> = JoorManifestRouteUnaryBatchRequest<Manifest, TRequests>;
export type UnaryRouteBatchRequest<TRequests extends readonly UnaryRouteBatchRequestUnion[] = readonly UnaryRouteBatchRequestUnion[]> = RouteUnaryBatchRequest<TRequests>;
export type RouteBatchResults<TRequests extends readonly RouteBatchRequestUnion[] = readonly RouteBatchRequestUnion[]> = JoorManifestRouteBatchResults<Manifest, TRequests>;
export type RouteUnaryBatchResults<TRequests extends readonly RouteUnaryBatchRequestUnion[] = readonly RouteUnaryBatchRequestUnion[]> = JoorManifestRouteUnaryBatchResults<Manifest, TRequests>;
export type UnaryRouteBatchResults<TRequests extends readonly UnaryRouteBatchRequestUnion[] = readonly UnaryRouteBatchRequestUnion[]> = RouteUnaryBatchResults<TRequests>;
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
export type RouteProtocolBatchRequestUnion = RouteUnaryProtocolRequestUnion;
export type RouteUnaryProtocolBatchRequestUnion =
  RouteProtocolBatchRequestUnion;
export type UnaryRouteProtocolBatchRequestUnion =
  RouteUnaryProtocolBatchRequestUnion;
export type ProtocolBatchRequestUnion = RouteProtocolBatchRequestUnion;
export type RouteProtocolBatchRequest<TRequests extends readonly RouteProtocolBatchRequestUnion[] = readonly RouteProtocolBatchRequestUnion[]> = JoorManifestRouteProtocolBatchRequest<Manifest, TRequests>;
export type RouteUnaryProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolBatchRequestUnion[] = readonly RouteUnaryProtocolBatchRequestUnion[]> = JoorManifestRouteUnaryProtocolBatchRequest<Manifest, TRequests>;
export type UnaryRouteProtocolBatchRequest<TRequests extends readonly UnaryRouteProtocolBatchRequestUnion[] = readonly UnaryRouteProtocolBatchRequestUnion[]> = RouteUnaryProtocolBatchRequest<TRequests>;
export type ProtocolBatchRequest<TRequests extends readonly ProtocolBatchRequestUnion[] = readonly ProtocolBatchRequestUnion[]> = RouteProtocolBatchRequest<TRequests>;
export type RouteProtocolBatchResults<TRequests extends readonly RouteProtocolBatchRequestUnion[] = readonly RouteProtocolBatchRequestUnion[]> = JoorManifestRouteProtocolBatchResults<Manifest, TRequests>;
export type RouteUnaryProtocolBatchResults<TRequests extends readonly RouteUnaryProtocolBatchRequestUnion[] = readonly RouteUnaryProtocolBatchRequestUnion[]> = JoorManifestRouteUnaryProtocolBatchResults<Manifest, TRequests>;
export type UnaryRouteProtocolBatchResults<TRequests extends readonly UnaryRouteProtocolBatchRequestUnion[] = readonly UnaryRouteProtocolBatchRequestUnion[]> = RouteUnaryProtocolBatchResults<TRequests>;
export type ProtocolBatchResults<TRequests extends readonly ProtocolBatchRequestUnion[] = readonly ProtocolBatchRequestUnion[]> = RouteProtocolBatchResults<TRequests>;
export type RouteBody = JoorManifestRouteBody<Manifest>;
export type RouteUnaryBody =
  | RouteUnaryProtocolRequestUnion
  | RouteUnaryProtocolBatchRequest;
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
  readonly call: (...args: RouteUnaryClientArgs<TId>) => Promise<RouteResult<TId>>;
  readonly request: (...args: RouteUnaryClientArgs<TId>) => RouteRequest<TId>;
  readonly protocolRequest: (
    input: RouteUnaryInput<TId>,
    options?: ProtocolRequestOptions
  ) => RouteUnaryProtocolRequest<TId>;
};
export type RouteUnaryFunction<TId extends RouteUnaryId = RouteUnaryId> = {
  [TRouteId in TId]: RouteUnaryFunctionFor<TRouteId>;
}[TId];
export type UnaryRouteFunction<TId extends RouteUnaryId = RouteUnaryId> =
  RouteUnaryFunction<TId>;
type RouteStreamFunctionFor<TId extends RouteStreamId> = {
  (...args: RouteStreamClientArgs<TId>): AsyncIterable<Stream<TId>>;
  readonly stream: (...args: RouteStreamClientArgs<TId>) => AsyncIterable<Stream<TId>>;
  readonly protocolRequest: (
    input: RouteStreamInput<TId>,
    options?: ProtocolRequestOptions
  ) => RouteStreamProtocolRequest<TId>;
};
export type RouteStreamFunction<TId extends RouteStreamId = RouteStreamId> = {
  [TRouteId in TId]: RouteStreamFunctionFor<TRouteId>;
}[TId];
export type StreamRouteFunction<TId extends RouteStreamId = RouteStreamId> =
  RouteStreamFunction<TId>;
export type RouteBatchClientHeaders<TRequests extends readonly unknown[] = RouteBatchRequest> = JoorManifestRouteBatchClientHeaders<Manifest, TRequests>;
export type BatchClientHeaders<TRequests extends readonly unknown[] = RouteBatchRequest> = RouteBatchClientHeaders<TRequests>;
export type RouteUnaryBatchClientHeaders<TRequests extends readonly unknown[] = RouteUnaryBatchRequest> = JoorManifestRouteUnaryBatchClientHeaders<Manifest, TRequests>;
export type UnaryRouteBatchClientHeaders<TRequests extends readonly unknown[] = UnaryRouteBatchRequest> = JoorManifestUnaryRouteBatchClientHeaders<Manifest, TRequests>;
export type RouteProtocolBatchClientHeaders<TRequests extends readonly unknown[] = RouteProtocolBatchRequest> = JoorManifestRouteProtocolBatchClientHeaders<Manifest, TRequests>;
export type ProtocolBatchClientHeaders<TRequests extends readonly unknown[] = ProtocolBatchRequest> = JoorManifestProtocolBatchClientHeaders<Manifest, TRequests>;
export type RouteUnaryProtocolBatchClientHeaders<TRequests extends readonly unknown[] = RouteUnaryProtocolBatchRequest> = JoorManifestRouteUnaryProtocolBatchClientHeaders<Manifest, TRequests>;
export type UnaryRouteProtocolBatchClientHeaders<TRequests extends readonly unknown[] = UnaryRouteProtocolBatchRequest> = JoorManifestUnaryRouteProtocolBatchClientHeaders<Manifest, TRequests>;
export type RouteBatchOptions<TRequests extends readonly unknown[] = RouteBatchRequest> = JoorManifestRouteBatchOptions<Manifest, TRequests>;
export type RouteUnaryBatchOptions<TRequests extends readonly unknown[] = RouteUnaryBatchRequest> = JoorManifestRouteUnaryBatchOptions<Manifest, TRequests>;
export type UnaryRouteBatchOptions<TRequests extends readonly unknown[] = UnaryRouteBatchRequest> = JoorManifestUnaryRouteBatchOptions<Manifest, TRequests>;
export type BatchOptions<TRequests extends readonly unknown[] = RouteBatchRequest> = RouteBatchOptions<TRequests>;
export type RouteProtocolBatchOptions<TRequests extends readonly unknown[] = RouteProtocolBatchRequest> = JoorManifestRouteProtocolBatchOptions<Manifest, TRequests>;
export type ProtocolBatchOptions<TRequests extends readonly unknown[] = ProtocolBatchRequest> = JoorManifestProtocolBatchOptions<Manifest, TRequests>;
export type RouteUnaryProtocolBatchOptions<TRequests extends readonly unknown[] = RouteUnaryProtocolBatchRequest> = JoorManifestRouteUnaryProtocolBatchOptions<Manifest, TRequests>;
export type UnaryRouteProtocolBatchOptions<TRequests extends readonly unknown[] = UnaryRouteProtocolBatchRequest> = JoorManifestUnaryRouteProtocolBatchOptions<Manifest, TRequests>;
export type RouteBatchOptionsTuple<TRequests extends readonly unknown[] = RouteBatchRequest> = JoorManifestRouteBatchOptionsTuple<Manifest, TRequests>;
export type RouteUnaryBatchOptionsTuple<TRequests extends readonly unknown[] = RouteUnaryBatchRequest> = JoorManifestRouteUnaryBatchOptionsTuple<Manifest, TRequests>;
export type UnaryRouteBatchOptionsTuple<TRequests extends readonly unknown[] = UnaryRouteBatchRequest> = JoorManifestUnaryRouteBatchOptionsTuple<Manifest, TRequests>;
export type BatchOptionsTuple<TRequests extends readonly unknown[] = RouteBatchRequest> = RouteBatchOptionsTuple<TRequests>;
export type RouteProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = RouteProtocolBatchRequest> = JoorManifestRouteProtocolBatchOptionsTuple<Manifest, TRequests>;
export type ProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = ProtocolBatchRequest> = JoorManifestProtocolBatchOptionsTuple<Manifest, TRequests>;
export type RouteUnaryProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = RouteUnaryProtocolBatchRequest> = JoorManifestRouteUnaryProtocolBatchOptionsTuple<Manifest, TRequests>;
export type UnaryRouteProtocolBatchOptionsTuple<TRequests extends readonly unknown[] = UnaryRouteProtocolBatchRequest> = JoorManifestUnaryRouteProtocolBatchOptionsTuple<Manifest, TRequests>;
export type BatchFunction = <const TRequests extends readonly [...RouteBatchRequestUnion[]]>(
  requests: TRequests,
  ...options: BatchOptionsTuple<NoInfer<TRequests>>
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
export type GeneratedClientOptions<TRequest extends Request = RequiredRuntimeRequest> = Omit<
  JoorManifestClientOptions<Manifest, TRequest>,
  'url'
> & {
  url?: string;
};
export type RouteTransportClient = JoorManifestTransportClient<Manifest>;
type RouteUnaryTransportFor<TId extends RouteUnaryId> = {
  readonly call: (...args: [id: TId, ...ClientArgs<TId>]) => Promise<RouteResult<TId>>;
  readonly request: (...args: [id: TId, ...ClientArgs<TId>]) => RouteRequest<TId>;
};
export type RouteUnaryTransport<TId extends RouteUnaryId = RouteUnaryId> = {
  [TRouteId in TId]: RouteUnaryTransportFor<TRouteId>;
}[TId];
export type UnaryRouteTransport<TId extends RouteUnaryId = RouteUnaryId> =
  RouteUnaryTransport<TId>;
type RouteStreamTransportFor<TId extends RouteStreamId> = {
  readonly stream: (...args: [id: TId, ...ClientArgs<TId>]) => AsyncIterable<Stream<TId>>;
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

export function createTransport(): TransportClient;
export function createTransport<TRequest extends Request>(
  options: GeneratedClientOptions<TRequest>
): TransportClient;
export function createTransport<TRequest extends Request = RequiredRuntimeRequest>(
  options?: GeneratedClientOptions<TRequest>
): TransportClient {
  const resolved = options ?? ({} as GeneratedClientOptions<Request>);
  return createTransportClient(manifest, {
    ...(resolved as Omit<JoorManifestClientOptions<Manifest, TRequest>, 'url'>),
    url: resolved.url ?? defaultUrl,
  } as JoorManifestClientOptions<Manifest, TRequest>);
}

export type GeneratedClient = {
${clientTypeBody}
  readonly batch: BatchFunction;
};
export type Client = GeneratedClient;

export function createClient(): GeneratedClient;
export function createClient<TRequest extends Request>(
  options: GeneratedClientOptions<TRequest>
): GeneratedClient;
export function createClient<TRequest extends Request = RequiredRuntimeRequest>(
  options?: GeneratedClientOptions<TRequest>
): GeneratedClient {
  const transport =
    options === undefined ? createTransport() : createTransport(options);
  const routeUnary = <TId extends RouteUnaryId>(id: TId): RouteUnaryFunction<TId> => {
    const routeTransport = transport as unknown as RouteUnaryTransport<TId>;
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
    const routeTransport = transport as unknown as RouteStreamTransport<TId>;
    const stream = (...args: ClientArgs<TId>) =>
      routeTransport.stream(id, ...args);
    const protocolRequest = (
      input: RouteStreamInput<TId>,
      options?: ProtocolRequestOptions
    ) => createRouteStreamProtocolRequest(id, input, options);
    return Object.assign(stream, { stream, protocolRequest });
  };
  const batch: BatchFunction = (requests, ...options) =>
    transport.batch(requests, ...options);
  return {
${clientBody}
    batch,
  };
}

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
