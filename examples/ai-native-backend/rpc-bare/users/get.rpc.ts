import { defineProcedure, t } from '../../../../src/index.js';
import { users } from '../../data.js';

export default defineProcedure({
  context: false,
  input: t.object({
    id: t.string().uuid(),
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
  },
  meta: {
    kind: 'query',
    summary: 'Bare benchmark user lookup',
    tags: ['users'],
  },
  handler(input) {
    const user = users.get(input.id);
    if (user === undefined) {
      return {
        kind: 'error',
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
          status: 404,
          details: { message: 'User not found' },
        },
      } as const;
    }
    return user;
  },
});
