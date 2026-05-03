import { defineProcedure, t } from '../../../../src/index.js';
import { bearerAuth, type AppContext } from '../../joor.config.js';

const messageSchema = t.object({
  role: t.enum(['user', 'assistant']),
  content: t.string().min(1).max(2_000),
});

export default defineProcedure.withContext<AppContext>()({
  input: t.object({
    messages: t.array(messageSchema).min(1),
  }),
  headers: t.object({
    authorization: t.string().min(1),
  }),
  output: t.object({
    completion: t.string(),
  }),
  errors: {
    UNAUTHORIZED: t.object({
      message: t.string(),
    }),
  },
  auth: bearerAuth,
  meta: {
    kind: 'mutation',
    summary: 'Demo AI chat completion',
    tags: ['ai'],
  },
  async handler(ctx, input) {
    return ctx.ok({ completion: ctx.services.ai.complete(input.messages) });
  },
});
