import { defineProcedure, t } from '../../../../../src/index.js';
import type { AppContext } from '../../joor.config.js';

export default defineProcedure.withContext<AppContext>()({
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
  async *handler(ctx, input) {
    for await (const event of ctx.services.users.watch(input.userId)) {
      yield event;
    }
  },
});
