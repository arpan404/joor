import { defineProcedure, t } from '../../../../../src/index.js';

export default defineProcedure({
  input: t.object({ ok: t.boolean() }),
  headers: t.object({
    'x-tenant-id': t.string(),
  }),
  output: t.object({ tenantId: t.string() }),
  handler(ctx) {
    return ctx.ok({ tenantId: ctx.headers['x-tenant-id'] });
  },
});
