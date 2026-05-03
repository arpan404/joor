import type { JsonValue } from '../schema/json.js';
import type {
  ProcedureInput,
  ProcedureOutput,
  StreamEvent,
} from '../procedure/types.js';
import type { RpcEnvelope, RpcRequest } from './protocol.js';

export interface ClientOptions {
  url: string;
  fetch?: (request: Request) => Promise<Response>;
  headers?: Record<string, string>;
}

export interface PendingRpcRequest<TProcedure = never> {
  id: string;
  input: ProcedureInput<TProcedure>;
}

export type BatchResults<TRequests extends readonly PendingRpcRequest[]> = {
  [TIndex in keyof TRequests]: TRequests[TIndex] extends PendingRpcRequest<
    infer TProcedure
  >
    ? RpcEnvelope<ProcedureOutput<TProcedure> & JsonValue>
    : never;
};

export interface RpcTransportClient {
  call<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): Promise<RpcEnvelope<ProcedureOutput<TProcedure> & JsonValue>>;
  request<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): PendingRpcRequest<TProcedure>;
  batch<const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>>;
  stream<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
}

const createHeaders = (headers?: Record<string, string>): Headers => {
  const output = new Headers(headers);
  output.set('content-type', 'application/json');
  return output;
};

const parseSse = async function* <TEvent extends JsonValue>(
  response: Response
): AsyncIterable<TEvent> {
  if (response.body === null) return;
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    buffer += read.value;
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';
    for (const chunk of chunks) {
      const eventLine = chunk
        .split('\n')
        .find((line) => line.startsWith('event: '));
      const eventName = eventLine?.slice(7);
      if (eventName === 'done') return;
      const dataLine = chunk
        .split('\n')
        .find((line) => line.startsWith('data: '));
      if (dataLine !== undefined) {
        const parsed = JSON.parse(dataLine.slice(6)) as JsonValue;
        if (eventName === 'error') {
          throw new Error(JSON.stringify(parsed));
        }
        yield parsed as TEvent;
      }
    }
  }
};

export const createClient = (options: ClientOptions): RpcTransportClient => {
  const fetcher =
    options.fetch ??
    ((request: Request): Promise<Response> => globalThis.fetch(request));
  const call = async <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): Promise<RpcEnvelope<ProcedureOutput<TProcedure> & JsonValue>> => {
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: createHeaders(options.headers),
        body: JSON.stringify({ id, input }),
      })
    );
    return (await response.json()) as RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue
    >;
  };
  const request = <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): PendingRpcRequest<TProcedure> => ({ id, input });
  const batch = async <const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>> => {
    const body: RpcRequest[] = requests.map((pending) => ({
      id: pending.id,
      input: pending.input as JsonValue,
    }));
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: createHeaders(options.headers),
        body: JSON.stringify(body),
      })
    );
    return (await response.json()) as BatchResults<TRequests>;
  };
  const stream = <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue> => ({
    async *[Symbol.asyncIterator]() {
      const headers = createHeaders(options.headers);
      headers.set('accept', 'text/event-stream');
      const response = await fetcher(
        new Request(options.url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ id, input }),
        })
      );
      yield* parseSse<JsonValue>(response) as AsyncIterable<
        StreamEvent<TProcedure> & JsonValue
      >;
    },
  });
  return {
    call,
    request,
    batch,
    stream,
  };
};
