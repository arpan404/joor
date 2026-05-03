import { defineProcedure, t } from '../../../../../src/index.js';

const users = new Map([
  [
    '550e8400-e29b-41d4-a716-446655440000',
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Ada' },
  ],
]);

export default defineProcedure({
  input: t.object({
    id: t.string().uuid(),
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
    const user = users.get(input.id);
    if (user === undefined) {
      return ctx.error('NOT_FOUND', { message: 'User not found' });
    }
    return ctx.ok(user);
  },
});
