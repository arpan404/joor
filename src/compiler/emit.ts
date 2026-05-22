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
    'createCompiledRpcHandler',
    'createCompiledRpcTransportBodyResultHandler',
    ...(usesRateLimit ? ['compiledRateLimitFailureStatic'] : []),
    ...(usesValidationDetails ? ['compiledValidationDetails'] : []),
    ...(usesCache ? ['compiledReadCache', 'compiledWriteCache'] : []),
    ...(hasCompiledProcedures ? ['type CompiledFixedDispatch'] : []),
    'type CompiledFixedUnaryDispatch',
    'type CompiledSerializedEnvelope',
    ...(hasGenericFallback ? ['executeCompiledProcedure'] : []),
    'type CompiledDispatch',
    'type CompiledRpcTransportBodyResultHandler',
  ];
  const manifestTypeImports = [
    'JoorManifestRouteBody',
    'JoorManifestRouteBodyResultFor',
    'JoorManifestRouteBodyResult',
    'JoorManifestRouteId',
    'JoorManifestRouteProtocolRequest',
    'JoorManifestRouteProtocolRequestUnion',
    'JoorManifestRouteStreamProtocolRequestUnion',
    'JoorManifestRouteUnaryProtocolRequestUnion',
  ];
  const schemaTypeImport = hasCompiledProcedures
    ? "import type { JsonValue } from 'joor/schema';\n"
    : '';
  const procedureTypeImport = hasCompiledProcedures
    ? "import type { RpcError } from 'joor/procedure';\n"
    : '';
  const manifestTypeImport = `import type { ${manifestTypeImports.join(', ')} } from 'joor/manifest';\n`;
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

export type NativeRouteId = JoorManifestRouteId<NativeManifest>;
export type NativeRouteRequest<TId extends NativeRouteId> =
  JoorManifestRouteProtocolRequest<NativeManifest, TId>;
export type NativeProtocolRequest =
  JoorManifestRouteProtocolRequestUnion<NativeManifest>;
export type NativeUnaryProtocolRequest =
  JoorManifestRouteUnaryProtocolRequestUnion<NativeManifest>;
export type NativeStreamProtocolRequest =
  JoorManifestRouteStreamProtocolRequestUnion<NativeManifest>;
export type NativeBatchBody = NativeUnaryProtocolRequest[];
export type NativeBody = JoorManifestRouteBody<NativeManifest>;
export type NativeBodyResult = JoorManifestRouteBodyResult<NativeManifest>;
export type NativeBodyResultFor<TBody extends NativeBody> = JoorManifestRouteBodyResultFor<NativeManifest, TBody>;
export type NativeTransportResult = NativeBodyResult | CompiledSerializedEnvelope;
export type NativeTransportResultFor<TBody extends NativeBody> =
  NativeBodyResultFor<TBody> | CompiledSerializedEnvelope;
export type NativeTransportHandler = <const TBody extends NativeBody>(
  request: Parameters<CompiledRpcTransportBodyResultHandler<NativeBody>>[0],
  body: TBody
) => Promise<NativeTransportResultFor<TBody>>;`;
  const executors = manifest.procedures
    .map((entry) => emitCompiledProcedureSource(entry, generationOptions))
    .filter(Boolean)
    .join('\n\n');
  const hasBodyMode = modes.includes('body');
  const hasSerializedMode = modes.includes('serialized');
  const hasResponseMode = modes.includes('response');
  const dispatchCaseForMode = (
    mode: 'body' | 'serialized' | 'response'
  ): string =>
    manifest.procedures
      .map((entry) => {
        const serialize =
          mode === 'response' ? "'response'" : mode === 'serialized';
        return entry.procedure.output === undefined
          ? `    case ${JSON.stringify(entry.id)}:
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services, runtime, state, ${serialize});`
          : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute_${mode}(rpcRequest, request, services, runtime, state);`;
      })
      .join('\n');
  const dispatchBody = hasBodyMode
    ? `const dispatchBody: CompiledDispatch = (
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
    ? `const dispatchSerialized: CompiledDispatch = (
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
    ? `const dispatchResponse: CompiledDispatch = (
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
      return executeCompiledProcedure(${JSON.stringify(entry.id)}, ${entry.exportName}, rpcRequest, request, services, runtime, state, ${serialize});`
          : `    case ${JSON.stringify(entry.id)}:
      return ${entry.exportName}_execute_${mode}(rpcRequest, request, services, runtime, state);`;
      })
      .join('\n');
  const bodyUnaryDispatch = hasBodyMode
    ? `const bodyUnaryDispatch: CompiledFixedUnaryDispatch = (
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
  const rpcRequest = body as Parameters<CompiledDispatch>[0];
  switch (rpcRequest.id) {
${unaryCases('body')}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
  }
};`
    : '';
  const serializedUnaryDispatch = hasSerializedMode
    ? `const serializedUnaryDispatch: CompiledFixedUnaryDispatch = (
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
  const rpcRequest = body as Parameters<CompiledDispatch>[0];
  switch (rpcRequest.id) {
${unaryCases('serialized')}
    default:
      return Promise.resolve(compiledNotFound(rpcRequest, request));
  }
};`
    : '';
  const responseUnaryDispatch = hasResponseMode
    ? `const responseUnaryDispatch: CompiledFixedUnaryDispatch = (
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
  const rpcRequest = body as Parameters<CompiledDispatch>[0];
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
${schemaTypeImport}${procedureTypeImport}${manifestTypeImport}${configImport}${imports}

${nativeManifestTypes}

${executors}

${dispatchBody}
${dispatchSerialized}
${dispatchResponse}

${bodyUnaryDispatch}
${serializedUnaryDispatch}
${responseUnaryDispatch}

const dispatch: CompiledDispatch = ${transportDispatchName};
export const nativeUnaryDispatch = ${nativeUnaryDispatchName};
export const nativeResponseUnaryDispatch = ${nativeResponseUnaryDispatchName};
export const nativeRuntime = createCompiledRuntimeState(${configValue});
export const nativeTransport = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch,
  false,
  ${transportModeLiteral},
  nativeRuntime
) as NativeTransportHandler;
export const nativeResponseTransport = createCompiledRpcTransportBodyResultHandler(
  ${responseDispatchName},
  ${configValue},
  nativeResponseUnaryDispatch,
  false,
  'response',
  nativeRuntime
) as NativeTransportHandler;
export const transport = createCompiledRpcTransportBodyResultHandler(
  dispatch,
  ${configValue},
  nativeUnaryDispatch,
  true,
  ${transportModeLiteral},
  nativeRuntime
) as NativeTransportHandler;
export const fetch = createCompiledRpcHandler(${responseDispatchName}, ${configValue}, nativeResponseUnaryDispatch);
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
import type { JsonValue } from 'joor/schema';
import { compiledUncachedExecutionState } from 'joor/runtime/compiled';
import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from '${dispatcherImport}';
${nodeFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
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

type NativeTransportResult = Awaited<ReturnType<typeof nativeTransport>>;

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

const createJsonHeaderRecord = (source?: JsonObject): Record<string, string> => {
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
  headers?: JsonObject
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

export const createHandler = (options: NodeNativeOptions = {}) => {
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
      await nativeTransport(request, body as Parameters<typeof nativeTransport>[1])
    );
  };
};

export const handler: (
  incoming: IncomingMessage,
  outgoing: ServerResponse<IncomingMessage>
) => Promise<void> = createHandler();

export const listen = (options: NodeListenOptions = {}) => {
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
import { nativeRuntime, nativeTransport, nativeUnaryDispatch } from '${dispatcherImport}';
${bunFastImports}

interface JsonObject {
  [key: string]: JsonValue;
}

interface SerializedJsonEnvelope {
  body: string;
  headers?: JsonObject;
  responseHeaders?: Record<string, string>;
}

type NativeTransportResult = Awaited<ReturnType<typeof nativeTransport>>;

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

const createJsonHeaderRecord = (source?: JsonObject): Record<string, string> => {
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
  headers?: JsonObject
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

export const createFetch = (options: BunNativeOptions = {}) => {
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
      await nativeTransport(source, body as Parameters<typeof nativeTransport>[1])
    );
  };
};

export const fetch = createFetch();

export const serve = (options: BunNativeOptions = {}) => {
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(config: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): object;
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

export const createFetch = (options: DenoNativeOptions = {}) => {
  const bodyLimit =
    options.maxBodyBytes ?? configuredMaxBodyBytes;
  ${denoCreateFetchReturn}
};

export const fetch = createFetch();

export const serve = (options: DenoNativeOptions = {}) => {
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(config: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): object;
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
  const clientBody = renderNode(tree, 2);
  const defaultUrl = config?.path ?? '/rpc';
  await writeFile(
    `${outDir}/client.ts`,
    `import { createManifestClient as createTransportClient } from 'joor/client';
import type { ClientOptions, ClientRequestOptions } from 'joor/client';
import type { JoorManifestRouteBatchRequest, JoorManifestRouteBatchResults, JoorManifestRouteBody, JoorManifestRouteBodyResult, JoorManifestRouteBodyResultFor, JoorManifestRouteEnvelope, JoorManifestRouteError, JoorManifestRouteHeaders, JoorManifestRouteId, JoorManifestRouteInput, JoorManifestRouteOutput, JoorManifestRouteProtocolRequest, JoorManifestRouteProtocolRequestUnion, JoorManifestRouteRequest, JoorManifestRouteRequestUnion, JoorManifestRouteResponseHeaders, JoorManifestRouteStreamEvent, JoorManifestRouteStreamProtocolRequest, JoorManifestRouteStreamProtocolRequestUnion, JoorManifestRouteUnaryProtocolRequest, JoorManifestRouteUnaryProtocolRequestUnion, JoorManifestStreamRouteId, JoorManifestUnaryRouteId } from 'joor/manifest';
import { manifest } from './manifest.js';

export type Manifest = typeof manifest;
export type RouteId = JoorManifestRouteId<Manifest>;
export type UnaryRouteId = JoorManifestUnaryRouteId<Manifest>;
export type StreamRouteId = JoorManifestStreamRouteId<Manifest>;
export type RouteProcedure<TId extends RouteId> = Manifest['procedures'][TId];
export type RouteInput<TId extends RouteId> = JoorManifestRouteInput<Manifest, TId>;
export type RouteOutput<TId extends UnaryRouteId> = JoorManifestRouteOutput<Manifest, TId>;
export type RouteHeaders<TId extends RouteId> = JoorManifestRouteHeaders<Manifest, TId>;
export type RouteResponseHeaders<TId extends UnaryRouteId> = JoorManifestRouteResponseHeaders<Manifest, TId>;
export type RouteError<TId extends RouteId> = JoorManifestRouteError<Manifest, TId>;
export type RouteRequest<TId extends UnaryRouteId> = JoorManifestRouteRequest<Manifest, TId>;
export type RouteRequestUnion = JoorManifestRouteRequestUnion<Manifest>;
export type RouteBatchRequest<TRequests extends readonly RouteRequestUnion[]> = TRequests;
export type RouteBatchResults<TRequests extends readonly unknown[]> = JoorManifestRouteBatchResults<Manifest, TRequests>;
export type RouteProtocolRequest<TId extends RouteId> = JoorManifestRouteProtocolRequest<Manifest, TId>;
export type RouteProtocolRequestUnion = JoorManifestRouteProtocolRequestUnion<Manifest>;
export type RouteUnaryProtocolRequest<TId extends UnaryRouteId> = JoorManifestRouteUnaryProtocolRequest<Manifest, TId>;
export type RouteUnaryProtocolRequestUnion = JoorManifestRouteUnaryProtocolRequestUnion<Manifest>;
export type RouteStreamProtocolRequest<TId extends StreamRouteId> = JoorManifestRouteStreamProtocolRequest<Manifest, TId>;
export type RouteStreamProtocolRequestUnion = JoorManifestRouteStreamProtocolRequestUnion<Manifest>;
export type RouteProtocolBatchRequest<TRequests extends readonly RouteUnaryProtocolRequestUnion[]> = JoorManifestRouteBatchRequest<Manifest, TRequests>;
export type RouteBody = JoorManifestRouteBody<Manifest>;
export type RouteBodyResult = JoorManifestRouteBodyResult<Manifest>;
export type RouteBodyResultFor<TBody extends RouteBody> = JoorManifestRouteBodyResultFor<Manifest, TBody>;
export type RouteResult<TId extends UnaryRouteId> = JoorManifestRouteEnvelope<Manifest, TId>;
export type Result<TId extends UnaryRouteId> = RouteResult<TId>;
export type Stream<TId extends StreamRouteId> = JoorManifestRouteStreamEvent<Manifest, TId>;
export type ClientArgs<TId extends RouteId> = Record<string, never> extends RouteHeaders<TId>
  ? [input: RouteInput<TId>, options?: ClientRequestOptions<RouteProcedure<TId>>]
  : [input: RouteInput<TId>, options: ClientRequestOptions<RouteProcedure<TId>>];
export type UnaryRouteFunction<TId extends UnaryRouteId> = {
  (...args: ClientArgs<TId>): Promise<RouteResult<TId>>;
  call(...args: ClientArgs<TId>): Promise<RouteResult<TId>>;
  request(...args: ClientArgs<TId>): RouteRequest<TId>;
};
export type StreamRouteFunction<TId extends StreamRouteId> = {
  (...args: ClientArgs<TId>): AsyncIterable<Stream<TId>>;
  stream(...args: ClientArgs<TId>): AsyncIterable<Stream<TId>>;
};
export type GeneratedClientOptions = Omit<ClientOptions<Manifest>, 'manifest' | 'url'> & {
  url?: string;
};
type UnaryRouteTransport<TId extends UnaryRouteId> = {
  call(
    id: TId,
    input: RouteInput<TId>,
    options?: ClientRequestOptions<RouteProcedure<TId>>
  ): Promise<RouteResult<TId>>;
  request(
    id: TId,
    input: RouteInput<TId>,
    options?: ClientRequestOptions<RouteProcedure<TId>>
  ): RouteRequest<TId>;
};
type StreamRouteTransport<TId extends StreamRouteId> = {
  stream(
    id: TId,
    input: RouteInput<TId>,
    options?: ClientRequestOptions<RouteProcedure<TId>>
  ): AsyncIterable<Stream<TId>>;
};

const defaultUrl = ${JSON.stringify(defaultUrl)};

export const createClient = (options: GeneratedClientOptions = {}) => {
  const transport = createTransportClient(manifest, {
    ...options,
    url: options.url ?? defaultUrl,
  });
  const unaryRoute = <TId extends UnaryRouteId>(id: TId): UnaryRouteFunction<TId> => {
    const routeTransport = transport as UnaryRouteTransport<TId>;
    const call = (...args: ClientArgs<TId>) =>
      routeTransport.call(id, args[0], args[1]);
    const request = (...args: ClientArgs<TId>) =>
      routeTransport.request(id, args[0], args[1]);
    return Object.assign(call, { call, request });
  };
  const streamRoute = <TId extends StreamRouteId>(id: TId): StreamRouteFunction<TId> => {
    const routeTransport = transport as StreamRouteTransport<TId>;
    const stream = (...args: ClientArgs<TId>) =>
      routeTransport.stream(id, args[0], args[1]);
    return Object.assign(stream, { stream });
  };
  return {
${clientBody}
    batch: transport.batch,
  };
};

export const client = createClient();
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
    configPath === undefined ? 'object' : 'JoorConfigContext<typeof config>';
  await writeFile(
    `${outDir}/procedure.ts`,
    `import { defineProcedure } from 'joor/procedure';
import type { JoorConfigContext } from 'joor/context';
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
