import {
  createAuthPolicy,
  createPlugin,
  defineConfig,
  type JoorConfigContext,
} from '../../src/index.js';
import { searchUsers, summarizeMessages, users } from './data.js';

const appPlugin = createPlugin({
  name: 'app',
  setup() {
    return {
      users: {
        findById(id: string) {
          return users.get(id) ?? null;
        },
        search(query: string) {
          return searchUsers(query);
        },
      },
      ai: {
        complete(
          messages: readonly { role: 'user' | 'assistant'; content: string }[]
        ) {
          return `Demo completion\n${summarizeMessages(messages)}`;
        },
      },
    };
  },
});

export const bearerAuth = createAuthPolicy<
  JoorConfigContext<{ plugins: readonly [typeof appPlugin] }>,
  { authorization: string },
  { subject: string; scopes: string[] }
>({
  name: 'demo-bearer',
  authenticate(ctx) {
    if (ctx.headers.authorization !== 'Bearer benchmark-token') {
      return ctx.error('UNAUTHORIZED', { message: 'Invalid bearer token' });
    }
    return {
      subject: 'benchmark-user',
      scopes: ['users:read', 'ai:chat'],
    };
  },
});

const config = defineConfig({
  entry: './rpc',
  outDir: './.joor',
  plugins: [appPlugin] as const,
  path: '/rpc',
  cors: {
    origin: 'http://localhost:3000',
  },
  maxBodyBytes: 64 * 1024,
});

export type AppContext = JoorConfigContext<typeof config>;
export default config;
