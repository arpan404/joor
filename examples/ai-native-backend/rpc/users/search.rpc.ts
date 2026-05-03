import { defineProcedure, t } from '../../../../src/index.js';
import { bearerAuth, type AppContext } from '../../joor.config.js';

const userSchema = t.object({
  id: t.string(),
  name: t.string(),
  email: t.string().email(),
  plan: t.enum(['free', 'pro', 'enterprise']),
});

export default defineProcedure.withContext<AppContext>()({
  input: t.object({
    query: t.string().min(1).max(100),
  }),
  headers: t.object({
    authorization: t.string().min(1),
  }),
  output: t.object({
    users: t.array(userSchema),
  }),
  errors: {
    UNAUTHORIZED: t.object({
      message: t.string(),
    }),
  },
  auth: bearerAuth,
  meta: {
    kind: 'query',
    summary: 'Search users',
    tags: ['users'],
  },
  async handler(ctx, input) {
    return ctx.ok({ users: ctx.services.users.search(input.query) });
  },
});
