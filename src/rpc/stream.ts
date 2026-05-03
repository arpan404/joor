import type { JsonValue } from '../schema/json.js';
import type { RpcFailure } from './protocol.js';

export type StreamEvent<TData extends JsonValue = JsonValue> =
  | { event: 'data'; data: TData }
  | { event: 'error'; data: RpcFailure }
  | { event: 'done'; data: Record<string, never> };

const encoder = new TextEncoder();

export const encodeSse = (event: string, data: JsonValue): Uint8Array =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export const createSseResponse = (
  stream: ReadableStream<Uint8Array>
): Response =>
  new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
    },
  });
