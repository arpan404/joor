import { defineProcedure, t } from '../../../../../src/index.js';

export default defineProcedure({
  input: t.object({
    userId: t.string(),
  }),
  output: t.array(
    t.object({
      id: t.string(),
      title: t.string(),
    })
  ),
  meta: {
    summary: 'List posts',
    tags: ['posts'],
  },
  async handler(ctx, input) {
    return ctx.ok([{ id: `post-${input.userId}`, title: 'Hello' }]);
  },
});
