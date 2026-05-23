import type { JoorPlugin, PluginServices } from './context/plugin.js';
import type {
  HandlerOptionsBody,
  HandlerOptions,
  HandlerOptionsFor,
  HandlerOptionsManifest,
  RpcManifest,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from './rpc/dispatcher.js';

export type { HandlerOptionsBody, HandlerOptionsManifest };

export type JoorConfig<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> = Omit<HandlerOptions<TPlugins>, 'plugins'> & {
  entry?: string;
  outDir?: string;
  plugins?: TPlugins;
};

export type JoorConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest> & {
  entry?: string;
  outDir?: string;
};

export type JoorRouteUnaryConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = JoorConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorUnaryRouteConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
> = JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorRouteStreamConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = JoorConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorStreamRouteConfigFor<
  TManifest extends RpcManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
> = JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type JoorConfigContext<TConfig> = TConfig extends {
  plugins?: infer TPlugins;
}
  ? NonNullable<TPlugins> extends readonly JoorPlugin<object>[]
    ? PluginServices<NonNullable<TPlugins>>
    : Record<string, never>
  : Record<string, never>;

export function defineConfig<
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(config: JoorConfig<TPlugins>): JoorConfig<TPlugins>;
export function defineConfig(config: JoorConfig): JoorConfig {
  return config;
}

export type DefineConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = Request,
>(
  config: JoorConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineRouteUnaryConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request = Request,
>(
  config: JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorRouteUnaryConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineUnaryRouteConfigFor<TManifest extends RpcManifest> =
  DefineRouteUnaryConfigFor<TManifest>;

export type DefineRouteStreamConfigFor<TManifest extends RpcManifest> = <
  const TPlugins extends readonly JoorPlugin<object>[],
  const TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request = Request,
>(
  config: JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>
) => JoorRouteStreamConfigFor<TManifest, TPlugins, TBody, TRequest>;

export type DefineStreamRouteConfigFor<TManifest extends RpcManifest> =
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
  return ((config) => config) as DefineConfigFor<TManifest>;
}
