import { defineProcedure, t } from '../../../../src/index.js';
import { bearerAuth, type AppContext } from '../../joor.config.js';

export default defineProcedure.withContext<AppContext>()({
  input: t.object({
    id: t.string().uuid(),
  }),
  headers: t.object({
    authorization: t.string().min(1),
  }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  output: t.object({
    id: t.string(),
    name: t.string(),
    email: t.string().email(),
    plan: t.enum(['free', 'pro', 'enterprise']),
  }),
  errors: {
    NOT_FOUND: t.object({
      message: t.string(),
    }),
    UNAUTHORIZED: t.object({
      message: t.string(),
    }),
  },
  auth: bearerAuth,
  meta: {
    kind: 'query',
    summary: 'Get a user by id',
    tags: ['users'],
    rateLimit: {
      limit: 100_000,
      window: '1m',
    },
  },
  async handler(ctx, input) {
    ctx.auth.subject.toUpperCase();
    const user = await ctx.services.users.findById(input.id);
    if (user === null) {
      return ctx.error('NOT_FOUND', { message: 'User not found' });
    }
    return ctx.ok(user, { 'cache-control': 'private, max-age=30' });
  },
});
