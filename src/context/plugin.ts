export interface JoorPlugin<TServices extends object = Record<string, never>> {
  name: string;
  setup(): TServices | Promise<TServices>;
}

export const createPlugin = <TServices extends object>(
  plugin: JoorPlugin<TServices>
): JoorPlugin<TServices> => plugin;

export type UnionToIntersection<TValue> = (
  TValue extends TValue ? (value: TValue) => void : never
) extends (value: infer TResult) => void
  ? TResult
  : never;

type PluginOutput<TPlugin> =
  TPlugin extends JoorPlugin<infer TServices> ? TServices : never;

export type PluginServices<TPlugins extends readonly JoorPlugin<object>[]> =
  TPlugins[number] extends never
    ? Record<string, never>
    : UnionToIntersection<PluginOutput<TPlugins[number]>> & object;

export const resolvePluginServices = async <
  const TPlugins extends readonly JoorPlugin<object>[],
>(
  plugins: TPlugins
): Promise<PluginServices<TPlugins>> => {
  const services = {} as PluginServices<TPlugins>;
  for (const plugin of plugins) {
    Object.assign(services, await plugin.setup());
  }
  return services;
};
