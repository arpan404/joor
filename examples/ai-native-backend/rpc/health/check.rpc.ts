import { defineProcedure, t } from '../../../../src/index.js';

export default defineProcedure({
  input: t.object({}),
  output: t.object({
    ok: t.boolean(),
    service: t.literal('ai-native-backend'),
  }),
  meta: {
    kind: 'query',
    summary: 'Health check',
    tags: ['system'],
  },
  async handler(ctx) {
    return ctx.ok({ ok: true, service: 'ai-native-backend' as const });
  },
});
