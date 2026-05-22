import { defineProcedure, t } from '../../../../../src/index.js';

export default defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string(), name: t.string() }),
  async handler(_ctx, input) {
    return { id: input.id, name: 'Ada' };
  },
});
