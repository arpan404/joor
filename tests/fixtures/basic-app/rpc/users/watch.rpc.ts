import { defineProcedure, t } from '../../../../../src/index.js';

export default defineProcedure({
  input: t.object({
    userId: t.string(),
  }),
  stream: t.object({
    type: t.literal('user.updated'),
    userId: t.string(),
  }),
  meta: {
    summary: 'Watch user updates',
    tags: ['users'],
  },
  async *handler(
    _ctx,
    input
  ): AsyncIterable<{ type: 'user.updated'; userId: string }> {
    yield {
      type: 'user.updated',
      userId: input.userId,
    };
  },
});
