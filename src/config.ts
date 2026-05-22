import type { JoorPlugin, PluginServices } from './context/plugin.js';
import type { HandlerOptions } from './rpc/dispatcher.js';

export type JoorConfig<
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
> = Omit<HandlerOptions<TPlugins>, 'plugins'> & {
  entry?: string;
  outDir?: string;
  plugins?: TPlugins;
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
