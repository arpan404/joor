import type { InferSchema, Schema } from './types.js';

export type Infer<TSchema extends Schema> = InferSchema<TSchema>;
