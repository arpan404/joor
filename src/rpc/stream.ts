import type { JsonValue } from '../schema/json.js';
import type { RpcError, RpcFailure } from './protocol.js';

export type StreamEvent<
  TData extends JsonValue = JsonValue,
  TId extends string = string,
  TError extends RpcError = RpcError,
> =
  | { readonly event: 'data'; readonly data: TData }
  | { readonly event: 'error'; readonly data: RpcFailure<TId, TError> }
  | { readonly event: 'done'; readonly data: Readonly<Record<string, never>> };

const encoder = new TextEncoder();

export const encodeSse = <TId extends string = string>(
  event: string,
  data: JsonValue | RpcFailure<TId>
): Uint8Array =>
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
