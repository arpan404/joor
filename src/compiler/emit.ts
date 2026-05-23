import { mkdir, writeFile } from 'node:fs/promises';
import { relative, dirname } from 'node:path';
import type { JoorConfig } from '../config.js';
import type { CompilerManifest } from './manifest.js';
import { createAiDocs } from './ai-docs.js';
import {
  emitCompiledProcedureSource,
  type CompiledProcedureGenerationOptions,
  type CompiledProcedureMode,
} from './codegen.js';
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
    'type CompiledStreamRouteBodyResultFor',
    'type CompiledStreamRouteTransportBodyResultFor',
    'type CompiledTransportBodyResultFor',
    'type CompiledUnaryRouteBodyResultFor',
    'type CompiledUnaryRouteTransportBodyResultFor',
    'type CompiledRuntimeState',
    ...(hasGenericFallback ? ['executeCompiledProcedure'] : []),
    'type CompiledDispatch',
    'type CompiledRpcRequestHandler',
    'type CompiledRpcBodyResultHandlerFor',
    'type CompiledRpcStreamRouteBodyResultHandlerFor',
    'type CompiledRpcStreamRouteTransportBodyResultHandlerFor',
    'type CompiledRpcTransportBodyResultHandler',
    'type CompiledRpcTransportBodyResultHandlerFor',
    'type CompiledRpcUnaryRouteBodyResultHandlerFor',
    'type CompiledRpcUnaryRouteTransportBodyResultHandlerFor',
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
    'JoorManifestRouteEnvelopeUnion',
    'JoorManifestRouteResult',
    'JoorManifestRouteResultUnion',
    'JoorManifestRouteInput',
    'JoorManifestRouteOutput',
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
    'JoorManifestStreamRouteProcedure',
    'JoorManifestStreamRouteRequiresHeaders',
    'JoorManifestStreamRouteRequiresResponseHeaders',
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
    'JoorManifestRouteUnaryProtocolRequest',
    'JoorManifestRouteUnaryProtocolRequestUnion',
    'JoorManifestStreamRouteId',
    'JoorManifestUnaryRouteId',
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
    'DefineStreamRouteConfigFor',
    'DefineUnaryRouteConfigFor',
    'JoorConfigContext',
    'JoorConfigFor',
    'JoorStreamRouteConfigFor',
    'JoorUnaryRouteConfigFor',
  ];
  const configTypeImport = `import type { ${configTypeImports.join(', ')} } from 'joor/config';\n`;
  const handlerTypeImport =
    "import type { DefineHandlerOptions, DefineStreamRouteHandlerOptions, DefineUnaryRouteHandlerOptions, HandlerHookContextFor, HandlerHooksFor, HandlerOptionServices, HandlerOptionsArgs, HandlerOptionsArgsFor, HandlerOptionsFor, JoorMiddlewareFor, RpcManifestStreamRouteHandlerHookContextFor, RpcManifestStreamRouteHandlerHooksFor, RpcManifestStreamRouteHandlerOptionsArgs, RpcManifestStreamRouteHandlerOptionsFor, RpcManifestStreamRouteMiddlewareFor, RpcManifestUnaryRouteHandlerHookContextFor, RpcManifestUnaryRouteHandlerHooksFor, RpcManifestUnaryRouteHandlerOptionsArgs, RpcManifestUnaryRouteHandlerOptionsFor, RpcManifestUnaryRouteMiddlewareFor } from 'joor';\n";
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
export type NativeUnaryRouteId = JoorManifestUnaryRouteId<NativeManifest>;
export type NativeStreamRouteId = JoorManifestStreamRouteId<NativeManifest>;
export type NativeRouteProcedure<TId extends NativeRouteId> = JoorManifestRouteProcedure<NativeManifest, TId>;
export type NativeUnaryRouteProcedure<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteProcedure<NativeManifest, TId>;
export type NativeRouteUnaryProcedure<TId extends NativeUnaryRouteId> = NativeUnaryRouteProcedure<TId>;
export type NativeStreamRouteProcedure<TId extends NativeStreamRouteId> = JoorManifestStreamRouteProcedure<NativeManifest, TId>;
export type NativeRouteStreamProcedure<TId extends NativeStreamRouteId> = NativeStreamRouteProcedure<TId>;
export type NativeRequiredServices = JoorManifestRequiredServices<NativeManifest>;
export type NativeRouteServices<TId extends NativeRouteId> = JoorManifestRouteServices<NativeManifest, TId>;
export type NativeRouteInput<TId extends NativeRouteId> = JoorManifestRouteInput<NativeManifest, TId>;
export type NativeUnaryRouteInput<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteInput<NativeManifest, TId>;
export type NativeRouteUnaryInput<TId extends NativeUnaryRouteId> = NativeUnaryRouteInput<TId>;
export type NativeStreamRouteInput<TId extends NativeStreamRouteId> = JoorManifestStreamRouteInput<NativeManifest, TId>;
export type NativeRouteStreamInput<TId extends NativeStreamRouteId> = NativeStreamRouteInput<TId>;
export type NativeRouteOutput<TId extends NativeUnaryRouteId> = JoorManifestRouteOutput<NativeManifest, TId>;
export type NativeUnaryRouteOutput<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteOutput<NativeManifest, TId>;
export type NativeRouteUnaryOutput<TId extends NativeUnaryRouteId> = NativeUnaryRouteOutput<TId>;
export type NativeRouteHeaders<TId extends NativeRouteId> = JoorManifestRouteHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteHeaders<TId>;
export type NativeStreamRouteHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteHeaders<NativeManifest, TId>;
export type NativeRouteStreamHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteHeaders<TId>;
export type NativeRouteClientHeaders<TId extends NativeRouteId> = JoorManifestRouteClientHeaders<NativeManifest, TId>;
export type NativeUnaryRouteClientHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteClientHeaders<NativeManifest, TId>;
export type NativeRouteUnaryClientHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteClientHeaders<TId>;
export type NativeStreamRouteClientHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteClientHeaders<NativeManifest, TId>;
export type NativeRouteStreamClientHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteClientHeaders<TId>;
export type NativeRouteRequestOptions<TId extends NativeRouteId> = JoorManifestRouteRequestOptions<NativeManifest, TId>;
export type NativeUnaryRouteRequestOptions<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteRequestOptions<NativeManifest, TId>;
export type NativeRouteUnaryRequestOptions<TId extends NativeUnaryRouteId> = NativeUnaryRouteRequestOptions<TId>;
export type NativeStreamRouteRequestOptions<TId extends NativeStreamRouteId> = JoorManifestStreamRouteRequestOptions<NativeManifest, TId>;
export type NativeRouteStreamRequestOptions<TId extends NativeStreamRouteId> = NativeStreamRouteRequestOptions<TId>;
export type NativeRouteClientArgs<TId extends NativeRouteId> = JoorManifestRouteClientArgs<NativeManifest, TId>;
export type NativeUnaryRouteClientArgs<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteClientArgs<NativeManifest, TId>;
export type NativeRouteUnaryClientArgs<TId extends NativeUnaryRouteId> = NativeUnaryRouteClientArgs<TId>;
export type NativeStreamRouteClientArgs<TId extends NativeStreamRouteId> = JoorManifestStreamRouteClientArgs<NativeManifest, TId>;
export type NativeRouteStreamClientArgs<TId extends NativeStreamRouteId> = NativeStreamRouteClientArgs<TId>;
export type NativeRouteHasHeaders<TId extends NativeRouteId> = JoorManifestRouteHasHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHasHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteHasHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHasHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteHasHeaders<TId>;
export type NativeStreamRouteHasHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteHasHeaders<NativeManifest, TId>;
export type NativeRouteStreamHasHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteHasHeaders<TId>;
export type NativeRouteRequiresHeaders<TId extends NativeRouteId> = JoorManifestRouteRequiresHeaders<NativeManifest, TId>;
export type NativeUnaryRouteRequiresHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteRequiresHeaders<NativeManifest, TId>;
export type NativeRouteUnaryRequiresHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteRequiresHeaders<TId>;
export type NativeStreamRouteRequiresHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteRequiresHeaders<NativeManifest, TId>;
export type NativeRouteStreamRequiresHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteRequiresHeaders<TId>;
export type NativeRouteResponseHeaders<TId extends NativeUnaryRouteId> = JoorManifestRouteResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteResponseHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryResponseHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteResponseHeaders<TId>;
export type NativeRouteHasResponseHeaders<TId extends NativeRouteId> = JoorManifestRouteHasResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteHasResponseHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteHasResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryHasResponseHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteHasResponseHeaders<TId>;
export type NativeStreamRouteHasResponseHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteHasResponseHeaders<NativeManifest, TId>;
export type NativeRouteStreamHasResponseHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteHasResponseHeaders<TId>;
export type NativeRouteRequiresResponseHeaders<TId extends NativeRouteId> = JoorManifestRouteRequiresResponseHeaders<NativeManifest, TId>;
export type NativeUnaryRouteRequiresResponseHeaders<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteRequiresResponseHeaders<NativeManifest, TId>;
export type NativeRouteUnaryRequiresResponseHeaders<TId extends NativeUnaryRouteId> = NativeUnaryRouteRequiresResponseHeaders<TId>;
export type NativeStreamRouteRequiresResponseHeaders<TId extends NativeStreamRouteId> = JoorManifestStreamRouteRequiresResponseHeaders<NativeManifest, TId>;
export type NativeRouteStreamRequiresResponseHeaders<TId extends NativeStreamRouteId> = NativeStreamRouteRequiresResponseHeaders<TId>;
export type NativeRouteError<TId extends NativeRouteId> = JoorManifestRouteError<NativeManifest, TId>;
export type NativeUnaryRouteError<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteError<NativeManifest, TId>;
export type NativeRouteUnaryError<TId extends NativeUnaryRouteId> = NativeUnaryRouteError<TId>;
export type NativeStreamRouteError<TId extends NativeStreamRouteId> = JoorManifestStreamRouteError<NativeManifest, TId>;
export type NativeRouteStreamError<TId extends NativeStreamRouteId> = NativeStreamRouteError<TId>;
export type NativeRouteErrorCode<TId extends NativeRouteId> = JoorManifestRouteErrorCode<NativeManifest, TId>;
export type NativeUnaryRouteErrorCode<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteErrorCode<NativeManifest, TId>;
export type NativeRouteUnaryErrorCode<TId extends NativeUnaryRouteId> = NativeUnaryRouteErrorCode<TId>;
export type NativeStreamRouteErrorCode<TId extends NativeStreamRouteId> = JoorManifestStreamRouteErrorCode<NativeManifest, TId>;
export type NativeRouteStreamErrorCode<TId extends NativeStreamRouteId> = NativeStreamRouteErrorCode<TId>;
export type NativeRouteErrorDetails<TId extends NativeRouteId, TCode extends NativeRouteErrorCode<TId>> = JoorManifestRouteErrorDetails<NativeManifest, TId, TCode>;
export type NativeUnaryRouteErrorDetails<TId extends NativeUnaryRouteId, TCode extends NativeUnaryRouteErrorCode<TId>> = JoorManifestUnaryRouteErrorDetails<NativeManifest, TId, TCode>;
export type NativeRouteUnaryErrorDetails<TId extends NativeUnaryRouteId, TCode extends NativeUnaryRouteErrorCode<TId>> = NativeUnaryRouteErrorDetails<TId, TCode>;
export type NativeStreamRouteErrorDetails<TId extends NativeStreamRouteId, TCode extends NativeStreamRouteErrorCode<TId>> = JoorManifestStreamRouteErrorDetails<NativeManifest, TId, TCode>;
export type NativeRouteStreamErrorDetails<TId extends NativeStreamRouteId, TCode extends NativeStreamRouteErrorCode<TId>> = NativeStreamRouteErrorDetails<TId, TCode>;
export type NativeRouteEnvelope<TId extends NativeUnaryRouteId> = JoorManifestRouteEnvelope<NativeManifest, TId>;
export type NativeUnaryRouteEnvelope<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteEnvelope<NativeManifest, TId>;
export type NativeRouteUnaryEnvelope<TId extends NativeUnaryRouteId> = NativeUnaryRouteEnvelope<TId>;
export type NativeRouteEnvelopeUnion = JoorManifestRouteEnvelopeUnion<NativeManifest>;
export type NativeUnaryRouteEnvelopeUnion = NativeRouteEnvelopeUnion;
export type NativeRouteUnaryEnvelopeUnion = NativeUnaryRouteEnvelopeUnion;
export type NativeRouteResult<TId extends NativeUnaryRouteId> = JoorManifestRouteResult<NativeManifest, TId>;
export type NativeUnaryRouteResult<TId extends NativeUnaryRouteId> = JoorManifestUnaryRouteResult<NativeManifest, TId>;
export type NativeRouteUnaryResult<TId extends NativeUnaryRouteId> = NativeUnaryRouteResult<TId>;
export type NativeRouteResultUnion = JoorManifestRouteResultUnion<NativeManifest>;
export type NativeUnaryRouteResultUnion = NativeRouteResultUnion;
export type NativeRouteUnaryResultUnion = NativeUnaryRouteResultUnion;
export type NativeRouteStreamEvent<TId extends NativeStreamRouteId> = JoorManifestRouteStreamEvent<NativeManifest, TId>;
export type NativeStreamRouteEvent<TId extends NativeStreamRouteId> = JoorManifestStreamRouteEvent<NativeManifest, TId>;
export type NativeStreamEvent<TId extends NativeStreamRouteId> = NativeStreamRouteEvent<TId>;
export type NativeRouteProtocolRequest<TId extends NativeRouteId> = JoorManifestRouteProtocolRequest<NativeManifest, TId>;
export type NativeRouteProtocolRequestUnion = JoorManifestRouteProtocolRequestUnion<NativeManifest>;
export type NativeRouteRequest<TId extends NativeRouteId> =
  NativeRouteProtocolRequest<TId>;
export type NativeRouteRequestUnion =
  NativeRouteProtocolRequestUnion;
export type NativeProtocolRequest =
  NativeRouteRequestUnion;
export type NativeUnaryRouteProtocolRequest<TId extends NativeUnaryRouteId> = JoorManifestRouteUnaryProtocolRequest<NativeManifest, TId>;
export type NativeRouteUnaryProtocolRequest<TId extends NativeUnaryRouteId> = NativeUnaryRouteProtocolRequest<TId>;
export type NativeUnaryRouteProtocolRequestUnion = JoorManifestRouteUnaryProtocolRequestUnion<NativeManifest>;
export type NativeRouteUnaryProtocolRequestUnion = NativeUnaryRouteProtocolRequestUnion;
export type NativeUnaryRouteRequest =
  NativeUnaryRouteProtocolRequestUnion;
export type NativeUnaryProtocolRequest =
  NativeUnaryRouteRequest;
export type NativeStreamRouteProtocolRequest<TId extends NativeStreamRouteId> = JoorManifestRouteStreamProtocolRequest<NativeManifest, TId>;
export type NativeRouteStreamProtocolRequest<TId extends NativeStreamRouteId> = NativeStreamRouteProtocolRequest<TId>;
export type NativeStreamRouteProtocolRequestUnion = JoorManifestRouteStreamProtocolRequestUnion<NativeManifest>;
export type NativeRouteStreamProtocolRequestUnion = NativeStreamRouteProtocolRequestUnion;
export type NativeStreamRouteRequest =
  NativeStreamRouteProtocolRequestUnion;
export type NativeStreamProtocolRequest =
  NativeStreamRouteRequest;
export type NativeRouteBatchRequest<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  JoorManifestRouteBatchRequest<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchRequest<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  NativeRouteBatchRequest<TRequests>;
export type NativeRouteUnaryBatchRequest<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  NativeUnaryRouteBatchRequest<TRequests>;
export type NativeProtocolBatchRequest<TRequests extends readonly NativeUnaryProtocolRequest[] = readonly NativeUnaryProtocolRequest[]> =
  NativeRouteBatchRequest<TRequests>;
export type NativeRouteBatchResults<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  JoorManifestRouteBatchResults<NativeManifest, TRequests>;
export type NativeUnaryRouteBatchResults<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  NativeRouteBatchResults<TRequests>;
export type NativeRouteUnaryBatchResults<TRequests extends readonly NativeUnaryRouteRequest[] = readonly NativeUnaryRouteRequest[]> =
  NativeUnaryRouteBatchResults<TRequests>;
export type NativeBatchBody = NativeRouteBatchRequest;
export type NativeRouteBody = JoorManifestRouteBody<NativeManifest>;
export type NativeBody = NativeRouteBody;
export type NativeUnaryRouteBody =
  | NativeUnaryRouteProtocolRequestUnion
  | NativeUnaryRouteBatchRequest<readonly NativeUnaryRouteProtocolRequestUnion[]>;
export type NativeRouteUnaryBody = NativeUnaryRouteBody;
export type NativeStreamRouteBody = NativeStreamRouteProtocolRequestUnion;
export type NativeRouteStreamBody = NativeStreamRouteBody;
export type NativeConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  JoorConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  JoorUnaryRouteConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteConfig<TPlugins, TBody>;
export type NativeStreamRouteConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  JoorStreamRouteConfigFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamConfig<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteConfig<TPlugins, TBody>;
export type NativeDefineConfig = DefineConfigFor<NativeManifest>;
export type NativeDefineUnaryRouteConfig = DefineUnaryRouteConfigFor<NativeManifest>;
export type NativeDefineRouteUnaryConfig = NativeDefineUnaryRouteConfig;
export type NativeDefineStreamRouteConfig = DefineStreamRouteConfigFor<NativeManifest>;
export type NativeDefineRouteStreamConfig = NativeDefineStreamRouteConfig;
export type NativeHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  RpcManifestUnaryRouteHandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteHandlerOptions<TPlugins, TBody>;
export type NativeStreamRouteHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  RpcManifestStreamRouteHandlerOptionsFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamHandlerOptions<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteHandlerOptions<TPlugins, TBody>;
export type NativeHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeHandlerOptionsArgsFor<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TOptionsOrBody extends NativeHandlerOptions<TPlugins> | NativeBody = NativeHandlerOptions<TPlugins, NativeBody>> =
  HandlerOptionsArgsFor<NativeManifest, TPlugins, TOptionsOrBody>;
export type NativeUnaryRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  RpcManifestUnaryRouteHandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteHandlerOptionsArgs<TPlugins, TBody>;
export type NativeStreamRouteHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  RpcManifestStreamRouteHandlerOptionsArgs<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamHandlerOptionsArgs<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteHandlerOptionsArgs<TPlugins, TBody>;
export type NativeDefineHandlerOptions = DefineHandlerOptions<NativeManifest>;
export type NativeDefineUnaryRouteHandlerOptions = DefineUnaryRouteHandlerOptions<NativeManifest>;
export type NativeDefineRouteUnaryHandlerOptions = NativeDefineUnaryRouteHandlerOptions;
export type NativeDefineStreamRouteHandlerOptions = DefineStreamRouteHandlerOptions<NativeManifest>;
export type NativeDefineRouteStreamHandlerOptions = NativeDefineStreamRouteHandlerOptions;
export type NativeHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  RpcManifestUnaryRouteHandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteHandlerHookContext<TPlugins, TBody>;
export type NativeStreamRouteHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  RpcManifestStreamRouteHandlerHookContextFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamHandlerHookContext<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteHandlerHookContext<TPlugins, TBody>;
export type NativeHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  HandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  RpcManifestUnaryRouteHandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteHandlerHooks<TPlugins, TBody>;
export type NativeStreamRouteHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  RpcManifestStreamRouteHandlerHooksFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamHandlerHooks<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteHandlerHooks<TPlugins, TBody>;
export type NativeMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeBody = NativeBody> =
  JoorMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeUnaryRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  RpcManifestUnaryRouteMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteUnaryMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeUnaryRouteBody = NativeUnaryRouteBody> =
  NativeUnaryRouteMiddleware<TPlugins, TBody>;
export type NativeStreamRouteMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  RpcManifestStreamRouteMiddlewareFor<NativeManifest, TPlugins, TBody>;
export type NativeRouteStreamMiddleware<TPlugins extends readonly JoorPlugin<object>[] = readonly JoorPlugin<object>[], TBody extends NativeStreamRouteBody = NativeStreamRouteBody> =
  NativeStreamRouteMiddleware<TPlugins, TBody>;
export type NativeHandlerOptionServices<TOptions> = HandlerOptionServices<TOptions>;
export type NativeRouteBodyResult =
  JoorManifestRouteBodyResult<NativeManifest>;
export type NativeBodyResult = NativeRouteBodyResult;
export type NativeUnaryRouteBodyResult = NativeRouteBodyResult;
export type NativeRouteUnaryBodyResult = NativeUnaryRouteBodyResult;
export type NativeStreamRouteBodyResult = Response;
export type NativeRouteStreamBodyResult = NativeStreamRouteBodyResult;
export type NativeRouteBodyResultFor<TBody extends NativeRouteBody> = JoorManifestRouteBodyResultFor<NativeManifest, TBody>;
export type NativeBodyResultFor<TBody extends NativeBody> =
  NativeRouteBodyResultFor<TBody>;
export type NativeUnaryRouteBodyResultFor<TBody extends NativeUnaryRouteBody> =
  NativeRouteBodyResultFor<TBody>;
export type NativeRouteUnaryBodyResultFor<TBody extends NativeUnaryRouteBody> =
  NativeUnaryRouteBodyResultFor<TBody>;
export type NativeStreamRouteBodyResultFor<TBody extends NativeStreamRouteBody> =
  NativeRouteBodyResultFor<TBody>;
export type NativeRouteStreamBodyResultFor<TBody extends NativeStreamRouteBody> =
  NativeStreamRouteBodyResultFor<TBody>;
export type NativeCompiledBodyResult = CompiledBodyResultFor<NativeManifest>;
export type NativeCompiledBodyResultFor<TBody extends NativeBody> =
  CompiledBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteCompiledBodyResultFor<TBody extends NativeUnaryRouteBody> =
  CompiledUnaryRouteBodyResultFor<NativeManifest, TBody>;
export type NativeRouteUnaryCompiledBodyResultFor<TBody extends NativeUnaryRouteBody> =
  NativeUnaryRouteCompiledBodyResultFor<TBody>;
export type NativeStreamRouteCompiledBodyResultFor<TBody extends NativeStreamRouteBody> =
  CompiledStreamRouteBodyResultFor<NativeManifest, TBody>;
export type NativeRouteStreamCompiledBodyResultFor<TBody extends NativeStreamRouteBody> =
  NativeStreamRouteCompiledBodyResultFor<TBody>;
export type NativeCompiledTransportResult =
  CompiledTransportBodyResultFor<NativeManifest>;
export type NativeTransportResult = NativeCompiledTransportResult;
export type NativeTransportResultFor<TBody extends NativeBody> =
  CompiledTransportBodyResultFor<NativeManifest, TBody>;
export type NativeUnaryRouteTransportResultFor<TBody extends NativeUnaryRouteBody> =
  CompiledUnaryRouteTransportBodyResultFor<NativeManifest, TBody>;
export type NativeRouteUnaryTransportResultFor<TBody extends NativeUnaryRouteBody> =
  NativeUnaryRouteTransportResultFor<TBody>;
export type NativeStreamRouteTransportResultFor<TBody extends NativeStreamRouteBody> =
  CompiledStreamRouteTransportBodyResultFor<NativeManifest, TBody>;
export type NativeRouteStreamTransportResultFor<TBody extends NativeStreamRouteBody> =
  NativeStreamRouteTransportResultFor<TBody>;
export type NativeTransportHandler = CompiledRpcTransportBodyResultHandlerFor<NativeManifest>;
export type NativeUnaryRouteTransportHandler =
  CompiledRpcUnaryRouteTransportBodyResultHandlerFor<NativeManifest>;
export type NativeRouteUnaryTransportHandler = NativeUnaryRouteTransportHandler;
export type NativeStreamRouteTransportHandler =
  CompiledRpcStreamRouteTransportBodyResultHandlerFor<NativeManifest>;
export type NativeRouteStreamTransportHandler = NativeStreamRouteTransportHandler;
export type NativeBodyHandler = CompiledRpcBodyResultHandlerFor<NativeManifest>;
export type NativeUnaryRouteBodyHandler =
  CompiledRpcUnaryRouteBodyResultHandlerFor<NativeManifest>;
export type NativeRouteUnaryBodyHandler = NativeUnaryRouteBodyHandler;
export type NativeStreamRouteBodyHandler =
  CompiledRpcStreamRouteBodyResultHandlerFor<NativeManifest>;
export type NativeRouteStreamBodyHandler = NativeStreamRouteBodyHandler;
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
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services as ProcedureServices<typeof ${entry.exportName}>, runtime, state, ${serialize});`
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
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
    return Promise.resolve(undefined);
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('body')}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
    return Promise.resolve(undefined);
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('serialized')}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
    return Promise.resolve(undefined);
  }
  const rpcRequest = body as ${nativeDispatchBodyType};
  switch (rpcRequest.id) {
${unaryCases('response')}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
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
            fastContextlessResultToResponse(${JSON.stringify(JSON.stringify(entry.id))}, trace, resolved)
          )
        : fastContextlessResultToResponse(${JSON.stringify(JSON.stringify(entry.id))}, trace, result);
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
          writeFastContextlessResult(outgoing, ${JSON.stringify(JSON.stringify(entry.id))}, trace, resolved)
        );
        return true;
      }
      writeFastContextlessResult(outgoing, ${JSON.stringify(JSON.stringify(entry.id))}, trace, result);
      return true;
    }`
    )
    .join('\n');
  const bunFastContextlessUnary =
    bunFastEntries.length === 0
      ? `const fastContextlessUnary = (
  _body: JsonObject,
  _request: Request
): Promise<Response | undefined> | Response | undefined => undefined;`
      : `const fastContextlessResultToResponse = (
  idBody: string,
  trace: string,
  result: JsonValue
): Response => {
  if (
    typeof result === 'object' &&
    result !== null &&
    !Array.isArray(result) &&
    'kind' in result
  ) {
    if (result.kind === 'error') {
      return new Response(
        failureBodyFromIdBody(idBody, trace, result.error.code, result.error.message, result.error.status),
        jsonOkResponseInit
      );
    }
    return result.headers === undefined
      ? new Response(successBody(idBody, trace, result.data), jsonOkResponseInit)
      : new Response(successBody(idBody, trace, result.data, result.headers), {
          status: 200,
          headers: createJsonHeaderRecord(result.headers),
        });
  }
  return new Response(successBody(idBody, trace, result), jsonOkResponseInit);
};

const fastContextlessUnary = (
  body: JsonObject,
  request: Request
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
  _outgoing: ServerResponse<IncomingMessage>
): Promise<boolean> | boolean => false;`
      : `const writeFastContextlessResult = (
  outgoing: ServerResponse<IncomingMessage>,
  idBody: string,
  trace: string,
  result: JsonValue
): void => {
  if (
    typeof result === 'object' &&
    result !== null &&
    !Array.isArray(result) &&
    'kind' in result
  ) {
    if (result.kind === 'error') {
      outgoing.writeHead(200, jsonHeaders);
      outgoing.end(
        failureBodyFromIdBody(idBody, trace, result.error.code, result.error.message, result.error.status)
      );
      return;
    }
    if (result.headers === undefined) {
      outgoing.writeHead(200, jsonHeaders);
      outgoing.end(successBody(idBody, trace, result.data));
      return;
    }
    outgoing.writeHead(200, createJsonHeaderRecord(result.headers));
    outgoing.end(successBody(idBody, trace, result.data, result.headers));
    return;
  }
  outgoing.writeHead(200, jsonHeaders);
  outgoing.end(successBody(idBody, trace, result));
};

const fastContextlessUnary = async (
  body: JsonObject,
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
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
    ? "import { createDenoCompiledTransportRequestHandlerWithPath } from 'joor/runtime/deno-compiled-transport';"
    : "import { createDenoTransportRequestHandlerWithPath } from 'joor/runtime/deno-transport';";
  const denoDispatcherImport = denoUseCompiledUnaryFastPath
    ? "import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from './deno-dispatcher.ts';"
    : "import { nativeTransport } from './deno-dispatcher.ts';";
  const denoCreateFetchReturn = denoUseCompiledUnaryFastPath
    ? `return createDenoCompiledTransportRequestHandlerWithPath(
    nativeRuntime,
    nativeTransport,
    nativeUnaryDispatch,
    configuredPath,
    bodyLimit
  );`
    : `return createDenoTransportRequestHandlerWithPath(
    nativeTransport,
    configuredPath,
    bodyLimit
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
  path: string
): NativeTransportResult | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  const contentType = checkContentType
    ? (request.getHeader('content-type') ?? '')
    : 'application/json';
  if (checkContentType && !isJsonContentType(contentType)) {
    return {
      body: failureBody(
        '',
        traceId(request),
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json',
        415
      ),
    };
  }
  return undefined;
};

const writeIncomingPreflightFailure = (
  outgoing: ServerResponse<IncomingMessage>,
  incoming: IncomingMessage,
  path: string
): boolean => {
  const url = incoming.url ?? '/rpc';
  if (!matchesPath(url, path)) {
    outgoing.writeHead(404);
    outgoing.end();
    return true;
  }
  if ((incoming.method ?? 'GET') !== 'POST') {
    outgoing.writeHead(405, { allow: 'POST' });
    outgoing.end();
    return true;
  }
  if (checkContentType) {
    const contentType = getIncomingHeader(incoming, 'content-type') ?? '';
    if (!isJsonContentType(contentType)) {
      outgoing.writeHead(200, jsonHeaders);
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
  result: NativeTransportResult
): Promise<void> => {
  if (isSerializedEnvelope(result)) {
    outgoing.writeHead(
      200,
      result.responseHeaders ?? createJsonHeaderRecord(result.headers)
    );
    outgoing.end(result.body);
    return;
  }
  if (result instanceof Response) {
    outgoing.writeHead(result.status, Object.fromEntries(result.headers));
    if (result.body === null) {
      outgoing.end();
      return;
    }
    await writeWebResponseBody(outgoing, result.body);
    return;
  }
  const headers = createJsonHeaderRecord();
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
  error: object
): void => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  outgoing.writeHead(status, jsonHeaders);
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
  error: object
): void => {
  const payloadTooLarge = error instanceof BodySizeLimitError;
  const status = payloadTooLarge ? 413 : 400;
  outgoing.writeHead(status, jsonHeaders);
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
  maxBodyBytes?: number;
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
  const path = configuredPath;
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
    const early = preflight(request, path);
    if (early !== undefined) {
      await writeResult(outgoing, early);
      return;
    }`
        : `if (writeIncomingPreflightFailure(outgoing, incoming, path)) return;`
    }
    let body: JsonValue;
    try {
      const buffer = await readIncomingBody(incoming, bodyLimit);
      body = buffer.length === 0 ? {} : parseJson(buffer.toString('utf8'));
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      if (request === undefined) writeIncomingBodyReadFailure(outgoing, incoming, error);
      else writeBodyReadFailure(outgoing, request, error);
      return;
    }
    if (isJsonObject(body)) {
      const handled = await fastContextlessUnary(body, incoming, outgoing);
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
        await writeResult(outgoing, result as NativeTransportResult);
        return;
      }
    }
    request ??= new IncomingRequestSource(incoming, hostname);
    await writeResult(
      outgoing,
      await nativeTransport(request, body as NativeBody)
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

const transportResultToResponse = (result: NativeTransportResult): Response => {
  if (isSerializedEnvelope(result)) {
    return result.responseHeaders !== undefined
      ? new Response(result.body, {
          status: 200,
          headers: result.responseHeaders,
        })
      : result.headers === undefined
        ? new Response(result.body, jsonOkResponseInit)
        : new Response(result.body, {
            status: 200,
            headers: createJsonHeaderRecord(result.headers),
          });
  }
  if (result instanceof Response) return result;
  if (!isJsonObject(result) || result['ok'] !== true) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const responseHeaders = result['headers'];
  if (!isJsonObject(responseHeaders)) {
    return new Response(JSON.stringify(result), jsonOkResponseInit);
  }
  const headers = new Headers(jsonHeaders);
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
  path: string
): Response | undefined => {
  if (!matchesPath(request.url, path)) {
    return new Response(null, { status: 404 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
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
        jsonOkResponseInit
      );
    }
  }
  return undefined;
};

const bodyReadFailure = (request: Request, error: object): Response => {
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
    { status, headers: jsonHeaders }
  );
};

${bunFastHandlerConstants}
${bunFastContextlessUnary}

export interface BunNativeOptions {
  hostname?: string;
  maxBodyBytes?: number;
  port?: number;
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
  const path = configuredPath;
  const bodyLimit = normalizeMaxBodyBytes(
    options.maxBodyBytes ?? configuredMaxBodyBytes
  );
  const unlimitedBody = bodyLimit >= Number.MAX_SAFE_INTEGER;
  return async (request: Request): Promise<Response> => {
    const early = preflight(request, path);
    if (early !== undefined) return early;
    let body: JsonValue;
    try {
      body = unlimitedBody
        ? await readJsonBodyUnchecked(request)
        : await readJsonBody(request, bodyLimit);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return bodyReadFailure(request, error);
    }
    if (isJsonObject(body)) {
      const fastValue = fastContextlessUnary(body, request);
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
        return transportResultToResponse(result as NativeTransportResult);
      }
    }
    return transportResultToResponse(
      await nativeTransport(source, body as NativeBody)
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
${denoDispatcherImport}

const configuredPath = ${configuredPath};
const configuredMaxBodyBytes = ${configuredMaxBodyBytes};

export interface DenoNativeOptions {
  hostname?: string;
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
            ? `unaryRoute(${JSON.stringify(id)})`
            : `streamRoute(${JSON.stringify(id)})`;
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
            ? 'UnaryRouteFunction'
            : 'StreamRouteFunction';
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
    `import { createManifestClient as createTransportClient } from 'joor/client';
import type { JoorManifestClientOptions, JoorManifestRouteBatchRequest, JoorManifestRouteBatchResults, JoorManifestRouteBody, JoorManifestRouteBodyResult, JoorManifestRouteBodyResultFor, JoorManifestRouteClientArgs, JoorManifestRouteClientHeaders, JoorManifestRouteEnvelope, JoorManifestRouteEnvelopeUnion, JoorManifestRouteError, JoorManifestRouteErrorCode, JoorManifestRouteErrorDetails, JoorManifestRouteHasHeaders, JoorManifestRouteHasResponseHeaders, JoorManifestRouteHeaders, JoorManifestRouteId, JoorManifestRouteInput, JoorManifestRouteOutput, JoorManifestRouteProcedure, JoorManifestRouteProtocolRequest, JoorManifestRouteProtocolRequestUnion, JoorManifestRouteRequest, JoorManifestRouteRequestOptions, JoorManifestRouteRequestUnion, JoorManifestRouteRequiresHeaders, JoorManifestRouteRequiresResponseHeaders, JoorManifestRouteResponseHeaders, JoorManifestRequiredServices, JoorManifestRouteResult, JoorManifestRouteResultUnion, JoorManifestRouteServices, JoorManifestRouteStreamEvent, JoorManifestRouteStreamProtocolRequest, JoorManifestRouteStreamProtocolRequestUnion, JoorManifestRouteUnaryProtocolRequest, JoorManifestRouteUnaryProtocolRequestUnion, JoorManifestStreamRouteClientArgs, JoorManifestStreamRouteClientHeaders, JoorManifestStreamRouteError, JoorManifestStreamRouteErrorCode, JoorManifestStreamRouteErrorDetails, JoorManifestStreamRouteEvent, JoorManifestStreamRouteHasHeaders, JoorManifestStreamRouteHasResponseHeaders, JoorManifestStreamRouteHeaders, JoorManifestStreamRouteId, JoorManifestStreamRouteInput, JoorManifestStreamRouteProcedure, JoorManifestStreamRouteRequiresHeaders, JoorManifestStreamRouteRequiresResponseHeaders, JoorManifestStreamRouteRequestOptions, JoorManifestTransportClient, JoorManifestUnaryRouteClientArgs, JoorManifestUnaryRouteClientHeaders, JoorManifestUnaryRouteEnvelope, JoorManifestUnaryRouteError, JoorManifestUnaryRouteErrorCode, JoorManifestUnaryRouteErrorDetails, JoorManifestUnaryRouteHasHeaders, JoorManifestUnaryRouteHasResponseHeaders, JoorManifestUnaryRouteHeaders, JoorManifestUnaryRouteId, JoorManifestUnaryRouteInput, JoorManifestUnaryRouteOutput, JoorManifestUnaryRouteProcedure, JoorManifestUnaryRouteResponseHeaders, JoorManifestUnaryRouteResult, JoorManifestUnaryRouteRequiresHeaders, JoorManifestUnaryRouteRequiresResponseHeaders, JoorManifestUnaryRouteRequestOptions } from 'joor/manifest';
import { manifest } from './manifest.js';

export type Manifest = typeof manifest;
export type RouteId = JoorManifestRouteId<Manifest>;
export type UnaryRouteId = JoorManifestUnaryRouteId<Manifest>;
export type StreamRouteId = JoorManifestStreamRouteId<Manifest>;
export type RouteProcedure<TId extends RouteId> = JoorManifestRouteProcedure<Manifest, TId>;
export type UnaryRouteProcedure<TId extends UnaryRouteId> = JoorManifestUnaryRouteProcedure<Manifest, TId>;
export type RouteUnaryProcedure<TId extends UnaryRouteId> = UnaryRouteProcedure<TId>;
export type StreamRouteProcedure<TId extends StreamRouteId> = JoorManifestStreamRouteProcedure<Manifest, TId>;
export type RouteStreamProcedure<TId extends StreamRouteId> = StreamRouteProcedure<TId>;
export type RequiredServices = JoorManifestRequiredServices<Manifest>;
export type RouteServices<TId extends RouteId> = JoorManifestRouteServices<Manifest, TId>;
export type RouteInput<TId extends RouteId> = JoorManifestRouteInput<Manifest, TId>;
export type UnaryRouteInput<TId extends UnaryRouteId> = JoorManifestUnaryRouteInput<Manifest, TId>;
export type RouteUnaryInput<TId extends UnaryRouteId> = UnaryRouteInput<TId>;
export type StreamRouteInput<TId extends StreamRouteId> = JoorManifestStreamRouteInput<Manifest, TId>;
export type RouteStreamInput<TId extends StreamRouteId> = StreamRouteInput<TId>;
export type RouteOutput<TId extends UnaryRouteId> = JoorManifestRouteOutput<Manifest, TId>;
export type UnaryRouteOutput<TId extends UnaryRouteId> = JoorManifestUnaryRouteOutput<Manifest, TId>;
export type RouteUnaryOutput<TId extends UnaryRouteId> = UnaryRouteOutput<TId>;
export type RouteHeaders<TId extends RouteId> = JoorManifestRouteHeaders<Manifest, TId>;
export type UnaryRouteHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteHeaders<Manifest, TId>;
export type RouteUnaryHeaders<TId extends UnaryRouteId> = UnaryRouteHeaders<TId>;
export type StreamRouteHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteHeaders<Manifest, TId>;
export type RouteStreamHeaders<TId extends StreamRouteId> = StreamRouteHeaders<TId>;
export type RouteClientHeaders<TId extends RouteId> = JoorManifestRouteClientHeaders<Manifest, TId>;
export type UnaryRouteClientHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteClientHeaders<Manifest, TId>;
export type RouteUnaryClientHeaders<TId extends UnaryRouteId> = UnaryRouteClientHeaders<TId>;
export type StreamRouteClientHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteClientHeaders<Manifest, TId>;
export type RouteStreamClientHeaders<TId extends StreamRouteId> = StreamRouteClientHeaders<TId>;
export type RouteResponseHeaders<TId extends UnaryRouteId> = JoorManifestRouteResponseHeaders<Manifest, TId>;
export type UnaryRouteResponseHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteResponseHeaders<Manifest, TId>;
export type RouteUnaryResponseHeaders<TId extends UnaryRouteId> = UnaryRouteResponseHeaders<TId>;
export type RouteError<TId extends RouteId> = JoorManifestRouteError<Manifest, TId>;
export type UnaryRouteError<TId extends UnaryRouteId> = JoorManifestUnaryRouteError<Manifest, TId>;
export type RouteUnaryError<TId extends UnaryRouteId> = UnaryRouteError<TId>;
export type StreamRouteError<TId extends StreamRouteId> = JoorManifestStreamRouteError<Manifest, TId>;
export type RouteStreamError<TId extends StreamRouteId> = StreamRouteError<TId>;
export type RouteErrorCode<TId extends RouteId> = JoorManifestRouteErrorCode<Manifest, TId>;
export type UnaryRouteErrorCode<TId extends UnaryRouteId> = JoorManifestUnaryRouteErrorCode<Manifest, TId>;
export type RouteUnaryErrorCode<TId extends UnaryRouteId> = UnaryRouteErrorCode<TId>;
export type StreamRouteErrorCode<TId extends StreamRouteId> = JoorManifestStreamRouteErrorCode<Manifest, TId>;
export type RouteStreamErrorCode<TId extends StreamRouteId> = StreamRouteErrorCode<TId>;
export type RouteErrorDetails<TId extends RouteId, TCode extends RouteErrorCode<TId>> = JoorManifestRouteErrorDetails<Manifest, TId, TCode>;
export type UnaryRouteErrorDetails<TId extends UnaryRouteId, TCode extends UnaryRouteErrorCode<TId>> = JoorManifestUnaryRouteErrorDetails<Manifest, TId, TCode>;
export type RouteUnaryErrorDetails<TId extends UnaryRouteId, TCode extends UnaryRouteErrorCode<TId>> = UnaryRouteErrorDetails<TId, TCode>;
export type StreamRouteErrorDetails<TId extends StreamRouteId, TCode extends StreamRouteErrorCode<TId>> = JoorManifestStreamRouteErrorDetails<Manifest, TId, TCode>;
export type RouteStreamErrorDetails<TId extends StreamRouteId, TCode extends StreamRouteErrorCode<TId>> = StreamRouteErrorDetails<TId, TCode>;
export type RouteEnvelope<TId extends UnaryRouteId> = JoorManifestRouteEnvelope<Manifest, TId>;
export type UnaryRouteEnvelope<TId extends UnaryRouteId> = JoorManifestUnaryRouteEnvelope<Manifest, TId>;
export type RouteUnaryEnvelope<TId extends UnaryRouteId> = UnaryRouteEnvelope<TId>;
export type RouteRequest<TId extends UnaryRouteId> = JoorManifestRouteRequest<Manifest, TId>;
export type UnaryRouteRequest<TId extends UnaryRouteId> = RouteRequest<TId>;
export type RouteUnaryRequest<TId extends UnaryRouteId> = UnaryRouteRequest<TId>;
export type RouteRequestUnion = JoorManifestRouteRequestUnion<Manifest>;
export type UnaryRouteRequestUnion = RouteRequestUnion;
export type RouteUnaryRequestUnion = UnaryRouteRequestUnion;
export type RouteBatchRequest<TRequests extends readonly RouteRequestUnion[] = readonly RouteRequestUnion[]> = TRequests;
export type UnaryRouteBatchRequest<TRequests extends readonly UnaryRouteRequestUnion[] = readonly UnaryRouteRequestUnion[]> = RouteBatchRequest<TRequests>;
export type RouteUnaryBatchRequest<TRequests extends readonly UnaryRouteRequestUnion[] = readonly UnaryRouteRequestUnion[]> = UnaryRouteBatchRequest<TRequests>;
export type RouteBatchResults<TRequests extends readonly (RouteRequestUnion | RouteUnaryProtocolRequestUnion)[]> = JoorManifestRouteBatchResults<Manifest, TRequests>;
export type UnaryRouteBatchResults<TRequests extends readonly (UnaryRouteRequestUnion | UnaryRouteProtocolRequestUnion)[]> = RouteBatchResults<TRequests>;
export type RouteUnaryBatchResults<TRequests extends readonly (UnaryRouteRequestUnion | UnaryRouteProtocolRequestUnion)[]> = UnaryRouteBatchResults<TRequests>;
export type RouteProtocolRequest<TId extends RouteId> = JoorManifestRouteProtocolRequest<Manifest, TId>;
export type RouteProtocolRequestUnion = JoorManifestRouteProtocolRequestUnion<Manifest>;
export type RouteUnaryProtocolRequest<TId extends UnaryRouteId> = JoorManifestRouteUnaryProtocolRequest<Manifest, TId>;
export type UnaryRouteProtocolRequest<TId extends UnaryRouteId> = RouteUnaryProtocolRequest<TId>;
export type RouteUnaryProtocolRequestUnion = JoorManifestRouteUnaryProtocolRequestUnion<Manifest>;
export type UnaryRouteProtocolRequestUnion = RouteUnaryProtocolRequestUnion;
export type RouteStreamProtocolRequest<TId extends StreamRouteId> = JoorManifestRouteStreamProtocolRequest<Manifest, TId>;
export type StreamRouteProtocolRequest<TId extends StreamRouteId> = RouteStreamProtocolRequest<TId>;
export type RouteStreamProtocolRequestUnion = JoorManifestRouteStreamProtocolRequestUnion<Manifest>;
export type StreamRouteProtocolRequestUnion = RouteStreamProtocolRequestUnion;
export type RouteProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolRequestUnion[]> = JoorManifestRouteBatchRequest<Manifest, TRequests>;
export type RouteBody = JoorManifestRouteBody<Manifest>;
export type UnaryRouteBody =
  | UnaryRouteProtocolRequestUnion
  | RouteProtocolBatchRequest<readonly RouteUnaryProtocolRequestUnion[]>;
export type RouteUnaryBody = UnaryRouteBody;
export type StreamRouteBody = StreamRouteProtocolRequestUnion;
export type RouteStreamBody = StreamRouteBody;
export type RouteBodyResult = JoorManifestRouteBodyResult<Manifest>;
export type UnaryRouteBodyResult = RouteBodyResult;
export type RouteUnaryBodyResult = UnaryRouteBodyResult;
export type StreamRouteBodyResult = Response;
export type RouteStreamBodyResult = StreamRouteBodyResult;
export type RouteBodyResultFor<TBody extends RouteBody> = JoorManifestRouteBodyResultFor<Manifest, TBody>;
export type UnaryRouteBodyResultFor<TBody extends UnaryRouteBody> = RouteBodyResultFor<TBody>;
export type RouteUnaryBodyResultFor<TBody extends UnaryRouteBody> = UnaryRouteBodyResultFor<TBody>;
export type StreamRouteBodyResultFor<TBody extends StreamRouteBody> = RouteBodyResultFor<TBody>;
export type RouteStreamBodyResultFor<TBody extends StreamRouteBody> = StreamRouteBodyResultFor<TBody>;
export type RouteEnvelopeUnion = JoorManifestRouteEnvelopeUnion<Manifest>;
export type UnaryRouteEnvelopeUnion = RouteEnvelopeUnion;
export type RouteUnaryEnvelopeUnion = UnaryRouteEnvelopeUnion;
export type RouteResult<TId extends UnaryRouteId> = JoorManifestRouteResult<Manifest, TId>;
export type UnaryRouteResult<TId extends UnaryRouteId> = JoorManifestUnaryRouteResult<Manifest, TId>;
export type RouteUnaryResult<TId extends UnaryRouteId> = UnaryRouteResult<TId>;
export type RouteResultUnion = JoorManifestRouteResultUnion<Manifest>;
export type UnaryRouteResultUnion = RouteResultUnion;
export type RouteUnaryResultUnion = UnaryRouteResultUnion;
export type Result<TId extends UnaryRouteId> = RouteResult<TId>;
export type ResultUnion = RouteResultUnion;
export type RouteStreamEvent<TId extends StreamRouteId> = JoorManifestRouteStreamEvent<Manifest, TId>;
export type StreamRouteEvent<TId extends StreamRouteId> = JoorManifestStreamRouteEvent<Manifest, TId>;
export type Stream<TId extends StreamRouteId> = RouteStreamEvent<TId>;
export type RouteHasHeaders<TId extends RouteId> = JoorManifestRouteHasHeaders<Manifest, TId>;
export type UnaryRouteHasHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteHasHeaders<Manifest, TId>;
export type RouteUnaryHasHeaders<TId extends UnaryRouteId> = UnaryRouteHasHeaders<TId>;
export type StreamRouteHasHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteHasHeaders<Manifest, TId>;
export type RouteStreamHasHeaders<TId extends StreamRouteId> = StreamRouteHasHeaders<TId>;
export type RouteRequiresHeaders<TId extends RouteId> = JoorManifestRouteRequiresHeaders<Manifest, TId>;
export type UnaryRouteRequiresHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteRequiresHeaders<Manifest, TId>;
export type RouteUnaryRequiresHeaders<TId extends UnaryRouteId> = UnaryRouteRequiresHeaders<TId>;
export type StreamRouteRequiresHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteRequiresHeaders<Manifest, TId>;
export type RouteStreamRequiresHeaders<TId extends StreamRouteId> = StreamRouteRequiresHeaders<TId>;
export type RouteHasResponseHeaders<TId extends RouteId> = JoorManifestRouteHasResponseHeaders<Manifest, TId>;
export type UnaryRouteHasResponseHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteHasResponseHeaders<Manifest, TId>;
export type RouteUnaryHasResponseHeaders<TId extends UnaryRouteId> = UnaryRouteHasResponseHeaders<TId>;
export type StreamRouteHasResponseHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteHasResponseHeaders<Manifest, TId>;
export type RouteStreamHasResponseHeaders<TId extends StreamRouteId> = StreamRouteHasResponseHeaders<TId>;
export type RouteRequiresResponseHeaders<TId extends RouteId> = JoorManifestRouteRequiresResponseHeaders<Manifest, TId>;
export type UnaryRouteRequiresResponseHeaders<TId extends UnaryRouteId> = JoorManifestUnaryRouteRequiresResponseHeaders<Manifest, TId>;
export type RouteUnaryRequiresResponseHeaders<TId extends UnaryRouteId> = UnaryRouteRequiresResponseHeaders<TId>;
export type StreamRouteRequiresResponseHeaders<TId extends StreamRouteId> = JoorManifestStreamRouteRequiresResponseHeaders<Manifest, TId>;
export type RouteStreamRequiresResponseHeaders<TId extends StreamRouteId> = StreamRouteRequiresResponseHeaders<TId>;
export type RouteRequestOptions<TId extends RouteId> = JoorManifestRouteRequestOptions<Manifest, TId>;
export type UnaryRouteRequestOptions<TId extends UnaryRouteId> = JoorManifestUnaryRouteRequestOptions<Manifest, TId>;
export type RouteUnaryRequestOptions<TId extends UnaryRouteId> = UnaryRouteRequestOptions<TId>;
export type StreamRouteRequestOptions<TId extends StreamRouteId> = JoorManifestStreamRouteRequestOptions<Manifest, TId>;
export type RouteStreamRequestOptions<TId extends StreamRouteId> = StreamRouteRequestOptions<TId>;
export type RouteClientArgs<TId extends RouteId> = JoorManifestRouteClientArgs<Manifest, TId>;
export type UnaryRouteClientArgs<TId extends UnaryRouteId> = JoorManifestUnaryRouteClientArgs<Manifest, TId>;
export type RouteUnaryClientArgs<TId extends UnaryRouteId> = UnaryRouteClientArgs<TId>;
export type StreamRouteClientArgs<TId extends StreamRouteId> = JoorManifestStreamRouteClientArgs<Manifest, TId>;
export type RouteStreamClientArgs<TId extends StreamRouteId> = StreamRouteClientArgs<TId>;
export type ClientArgs<TId extends RouteId> = RouteClientArgs<TId>;
export type UnaryRouteFunction<TId extends UnaryRouteId> = {
  (...args: UnaryRouteClientArgs<TId>): Promise<RouteResult<TId>>;
  call(...args: UnaryRouteClientArgs<TId>): Promise<RouteResult<TId>>;
  request(...args: UnaryRouteClientArgs<TId>): RouteRequest<TId>;
};
export type StreamRouteFunction<TId extends StreamRouteId> = {
  (...args: StreamRouteClientArgs<TId>): AsyncIterable<Stream<TId>>;
  stream(...args: StreamRouteClientArgs<TId>): AsyncIterable<Stream<TId>>;
};
export type BatchFunction = <const TRequests extends RouteBatchRequest>(
  requests: TRequests
) => Promise<RouteBatchResults<TRequests>>;
export type GeneratedClientOptions = Omit<JoorManifestClientOptions<Manifest>, 'url'> & {
  url?: string;
};
export type UnaryRouteTransport<TId extends UnaryRouteId> = {
  call(...args: [id: TId, ...ClientArgs<TId>]): Promise<RouteResult<TId>>;
  request(...args: [id: TId, ...ClientArgs<TId>]): RouteRequest<TId>;
};

export type RouteUnaryTransport<TId extends UnaryRouteId> =
  UnaryRouteTransport<TId>;

export type StreamRouteTransport<TId extends StreamRouteId> = {
  stream(...args: [id: TId, ...ClientArgs<TId>]): AsyncIterable<Stream<TId>>;
};

export type RouteStreamTransport<TId extends StreamRouteId> =
  StreamRouteTransport<TId>;

export type RouteTransportClient = JoorManifestTransportClient<Manifest>;
export type UnaryRouteTransportClient = Pick<
  RouteTransportClient,
  'call' | 'request' | 'batch'
>;
export type RouteUnaryTransportClient = UnaryRouteTransportClient;
export type StreamRouteTransportClient = Pick<RouteTransportClient, 'stream'>;
export type RouteStreamTransportClient = StreamRouteTransportClient;
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
  const unaryRoute = <TId extends UnaryRouteId>(id: TId): UnaryRouteFunction<TId> => {
    const routeTransport = transport as UnaryRouteTransport<TId>;
    const call = (...args: ClientArgs<TId>) =>
      routeTransport.call(id, ...args);
    const request = (...args: ClientArgs<TId>) =>
      routeTransport.request(id, ...args);
    return Object.assign(call, { call, request });
  };
  const streamRoute = <TId extends StreamRouteId>(id: TId): StreamRouteFunction<TId> => {
    const routeTransport = transport as StreamRouteTransport<TId>;
    const stream = (...args: ClientArgs<TId>) =>
      routeTransport.stream(id, ...args);
    return Object.assign(stream, { stream });
  };
  const batch: BatchFunction = (requests) => transport.batch(requests);
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
