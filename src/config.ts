import type { JoorPlugin, PluginServices } from './context/plugin.js';
import type {
  HandlerOptionsBody,
  HandlerOptions,
  HandlerOptionsFor,
  HandlerOptionsManifest,
  HandlerOptionsRequest,
  HandlerOptionsServices,
  HandlerOptionServices,
  RpcManifest,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
} from './rpc/dispatcher.js';

export type {
  HandlerOptionsBody,
  HandlerOptionServices,
  HandlerOptionsManifest,
  HandlerOptionsRequest,
  HandlerOptionsServices,
};

export type JoorConfig<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody = unknown,
  TRequest extends Request = Request,
> = Omit<HandlerOptions<TPlugins, TBody, TRequest>, 'plugins'> & {
  readonly entry?: string;
  readonly outDir?: string;
  readonly plugins?: TPlugins;
};

export type JoorConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest> & {
  readonly entry?: string;
  readonly outDir?: string;
};

export type JoorRouteUnaryConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
> & {
  readonly entry?: string;
  readonly outDir?: string;
};

export type JoorUnaryRouteConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorUnaryConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteStreamConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
> & {
  readonly entry?: string;
  readonly outDir?: string;
};

export type JoorStreamRouteConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorStreamConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorConfigContext<TConfig> = TConfig extends {
  plugins?: infer TPlugins;
}
  ? NonNullable<TPlugins> extends readonly JoorPlugin<object>[]
    ? PluginServices<NonNullable<TPlugins>>
    : Record<string, never>
  : Record<string, never>;

export type JoorConfigServices<TConfig> = JoorConfigContext<TConfig>;

export type JoorConfigBody<TConfig> = HandlerOptionsBody<TConfig>;

export type JoorConfigManifest<TConfig> = HandlerOptionsManifest<TConfig>;

export type JoorConfigRequest<TConfig> = [
  HandlerOptionsRequest<TConfig>,
] extends [never]
  ? Request
  : HandlerOptionsRequest<TConfig>;

type FreezableConfig = {
  readonly plugins?: readonly JoorPlugin<object>[];
  readonly middleware?: readonly unknown[];
  readonly hooks?: object;
  readonly cors?: {
    readonly origin?: string;
    readonly headers?: readonly string[];
    readonly methods?: readonly string[];
  };
  readonly cache?: object;
  readonly rateLimit?: object;
};

const freezeConfig = <TConfig extends FreezableConfig>(
  config: TConfig
): TConfig =>
  Object.freeze({
    ...config,
    ...(config.plugins === undefined
      ? {}
      : { plugins: Object.freeze([...config.plugins]) }),
    ...(config.middleware === undefined
      ? {}
      : { middleware: Object.freeze([...config.middleware]) }),
    ...(config.hooks === undefined
      ? {}
      : { hooks: Object.freeze({ ...config.hooks }) }),
    ...(config.cors === undefined
      ? {}
      : {
          cors: Object.freeze({
            ...config.cors,
            ...(config.cors.headers === undefined
              ? {}
              : { headers: Object.freeze([...config.cors.headers]) }),
            ...(config.cors.methods === undefined
              ? {}
              : { methods: Object.freeze([...config.cors.methods]) }),
          }),
        }),
    ...(config.cache === undefined
      ? {}
      : { cache: Object.freeze({ ...config.cache }) }),
    ...(config.rateLimit === undefined
      ? {}
      : { rateLimit: Object.freeze({ ...config.rateLimit }) }),
  }) as TConfig;

export function defineConfig<
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TBody = unknown,
  TRequest extends Request = Request,
>(
  config: JoorConfig<TPlugins, TBody, TRequest>
): JoorConfig<TPlugins, TBody, TRequest>;
export function defineConfig(config: JoorConfig): JoorConfig {
  return freezeConfig(config);
}

export type DefineConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  config: JoorConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineRouteUnaryConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  config: JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineUnaryRouteConfigFor<TManifest extends RpcManifest> =
  DefineRouteUnaryConfigFor<TManifest>;

export type DefineUnaryConfigFor<TManifest extends RpcManifest> =
  DefineRouteUnaryConfigFor<TManifest>;

export type DefineRouteStreamConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  config: JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineStreamRouteConfigFor<TManifest extends RpcManifest> =
  DefineRouteStreamConfigFor<TManifest>;

export type DefineStreamConfigFor<TManifest extends RpcManifest> =
  DefineRouteStreamConfigFor<TManifest>;

export function defineConfigFor<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineConfigFor<TManifest>;
export function defineConfigFor<
  TManifest extends RpcManifest,
>(): DefineConfigFor<TManifest>;
export function defineConfigFor<TManifest extends RpcManifest>(
  _manifest?: TManifest
): DefineConfigFor<TManifest> {
  return ((config) => freezeConfig(config)) as DefineConfigFor<TManifest>;
}

export function defineRouteUnaryConfigFor<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineRouteUnaryConfigFor<TManifest>;
export function defineRouteUnaryConfigFor<
  TManifest extends RpcManifest,
>(): DefineRouteUnaryConfigFor<TManifest>;
export function defineRouteUnaryConfigFor<TManifest extends RpcManifest>(
  _manifest?: TManifest
): DefineRouteUnaryConfigFor<TManifest> {
  return ((config) =>
    freezeConfig(config)) as DefineRouteUnaryConfigFor<TManifest>;
}

export const defineUnaryRouteConfigFor: typeof defineRouteUnaryConfigFor =
  defineRouteUnaryConfigFor;

export const defineUnaryConfigFor: typeof defineRouteUnaryConfigFor =
  defineRouteUnaryConfigFor;

export function defineRouteStreamConfigFor<TManifest extends RpcManifest>(
  manifest: TManifest
): DefineRouteStreamConfigFor<TManifest>;
export function defineRouteStreamConfigFor<
  TManifest extends RpcManifest,
>(): DefineRouteStreamConfigFor<TManifest>;
export function defineRouteStreamConfigFor<TManifest extends RpcManifest>(
  _manifest?: TManifest
): DefineRouteStreamConfigFor<TManifest> {
  return ((config) =>
    freezeConfig(config)) as DefineRouteStreamConfigFor<TManifest>;
}

export const defineStreamRouteConfigFor: typeof defineRouteStreamConfigFor =
  defineRouteStreamConfigFor;

export const defineStreamConfigFor: typeof defineRouteStreamConfigFor =
  defineRouteStreamConfigFor;
