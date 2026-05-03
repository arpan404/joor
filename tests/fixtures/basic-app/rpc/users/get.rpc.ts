import { defineProcedure, t } from '../../../../../src/index.js';
import type { AppContext } from '../../joor.config.js';

export default defineProcedure.withContext<AppContext>()({
  input: t.object({
    id: t.string().uuid(),
  }),
  headers: t.object({
    authorization: t.optional(t.string().min(1)),
  }),
  output: t.object({
    id: t.string(),
    name: t.string(),
  }),
  errors: {
    NOT_FOUND: t.object({
      message: t.string(),
    }),
  },
  meta: {
    summary: 'Get a user',
    tags: ['users'],
  },
  async handler(ctx, input) {
    ctx.headers.authorization?.toUpperCase();
    const user = await ctx.services.users.findById(input.id);
    if (user === null) {
      return ctx.error('NOT_FOUND', { message: 'User not found' });
    }
    return ctx.ok(user);
  },
});
