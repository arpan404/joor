import type { JoorPlugin, PluginServices } from './context/plugin.js';
import type {
  HandlerOptions,
  HandlerOptionsFor,
  RpcManifest,
} from './rpc/dispatcher.js';

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
> = HandlerOptionsFor<TManifest, TPlugins> & {
  entry?: string;
  outDir?: string;
};

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
>(
  config: JoorConfigFor<TManifest, TPlugins>
) => JoorConfigFor<TManifest, TPlugins>;

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
