import { defineProcedure, t } from '../../../../../src/index.js';

export default defineProcedure({
  context: false,
  input: t.object({
    id: t.string(),
  }),
  output: t.object({
    id: t.string(),
  }),
  handler(input) {
    return { id: input.id };
  },
});
