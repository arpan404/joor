export interface JoorPlugin<TServices extends object = Record<string, never>> {
  name: string;
  setup(): TServices | Promise<TServices>;
}

export const createPlugin = <TServices extends object>(
  plugin: JoorPlugin<TServices>
): JoorPlugin<TServices> => plugin;

type UnionToIntersection<TValue> = (
  TValue extends TValue ? (value: TValue) => void : never
) extends (value: infer TResult) => void
  ? TResult
  : never;

export type PluginServices<TPlugins extends readonly JoorPlugin<object>[]> =
  UnionToIntersection<Awaited<ReturnType<TPlugins[number]['setup']>>>;

export const resolvePluginServices = async (
  plugins: readonly JoorPlugin<object>[]
): Promise<object> => {
  const services = {};
  for (const plugin of plugins) {
    Object.assign(services, await plugin.setup());
  }
  return services;
};
