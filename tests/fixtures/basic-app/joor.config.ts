import {
  createPlugin,
  defineConfig,
  type JoorConfigContext,
} from '../../../src/index.js';

const users = new Map([
  [
    '550e8400-e29b-41d4-a716-446655440000',
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Ada' },
  ],
]);

const usersPlugin = createPlugin({
  name: 'users',
  setup() {
    return {
      users: {
        findById(id: string) {
          return users.get(id) ?? null;
        },
        async *watch(userId: string): AsyncIterable<{
          type: 'user.updated';
          userId: string;
        }> {
          yield { type: 'user.updated', userId };
        },
      },
    };
  },
});

const config = defineConfig({
  entry: './rpc',
  outDir: './.joor',
  plugins: [usersPlugin] as const,
  cors: {
    origin: '*',
  },
});

export type AppContext = JoorConfigContext<typeof config>;
export default config;
