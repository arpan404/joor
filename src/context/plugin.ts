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
  UnionToIntersection<PluginOutput<TPlugins[number]>>;

export const resolvePluginServices = async (
  plugins: readonly JoorPlugin<object>[]
): Promise<object> => {
  const services = {};
  for (const plugin of plugins) {
    Object.assign(services, await plugin.setup());
  }
  return services;
};
