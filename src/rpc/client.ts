import type { JsonValue } from '../schema/json.js';
import type {
  ProcedureInput,
  ProcedureOutput,
  ProcedureHeaders,
  StreamEvent,
} from '../procedure/types.js';
import type { RpcEnvelope, RpcRequest } from './protocol.js';

export interface ClientOptions {
  url: string;
  fetch?: (request: Request) => Promise<Response>;
  headers?: Record<string, string>;
  maxStreamEventBytes?: number;
}

export interface PendingRpcRequest<TProcedure = never> {
  id: string;
  input: ProcedureInput<TProcedure>;
  headers?: ProcedureHeaders<TProcedure>;
}

export type ClientRequestOptions<TProcedure> =
  Record<string, never> extends ProcedureHeaders<TProcedure>
    ? { headers?: ProcedureHeaders<TProcedure> }
    : { headers: ProcedureHeaders<TProcedure> };

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
    input: ProcedureInput<TProcedure>,
    ...options: Record<string, never> extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): Promise<RpcEnvelope<ProcedureOutput<TProcedure> & JsonValue>>;
  request<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...options: Record<string, never> extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): PendingRpcRequest<TProcedure>;
  batch<const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>>;
  stream<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...options: Record<string, never> extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
}

const createHeaders = (
  baseHeaders?: Record<string, string>,
  requestHeaders?: object
): Headers => {
  const output = new Headers(baseHeaders);
  if (requestHeaders !== undefined) {
    for (const [key, value] of Object.entries(requestHeaders)) {
      if (typeof value === 'string') output.set(key, value);
    }
  }
  output.set('content-type', 'application/json');
  return output;
};

const defaultMaxStreamEventBytes = 1024 * 1024;

const normalizeMaxStreamEventBytes = (value: number | undefined): number =>
  value === undefined || !Number.isFinite(value) || value < 0
    ? defaultMaxStreamEventBytes
    : Math.floor(value);

const parseSse = async function* <TEvent extends JsonValue>(
  response: Response,
  maxEventBytes: number
): AsyncIterable<TEvent> {
  if (response.body === null) return;
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const read = await reader.read();
    if (read.done) break;
    buffer += read.value;
    if (buffer.length > maxEventBytes) {
      throw new Error('SSE event exceeds maxStreamEventBytes');
    }
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';
    for (const chunk of chunks) {
      if (chunk.length > maxEventBytes) {
        throw new Error('SSE event exceeds maxStreamEventBytes');
      }
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
  const maxStreamEventBytes = normalizeMaxStreamEventBytes(
    options.maxStreamEventBytes
  );
  const call = async <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: Record<
      string,
      never
    > extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): Promise<RpcEnvelope<ProcedureOutput<TProcedure> & JsonValue>> => {
    const [callOptions] = requestOptions;
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: createHeaders(options.headers, callOptions?.headers),
        body: JSON.stringify({ id, input }),
      })
    );
    return (await response.json()) as RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue
    >;
  };
  const request = <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: Record<
      string,
      never
    > extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): PendingRpcRequest<TProcedure> => ({
    id,
    input,
    ...(requestOptions[0]?.headers === undefined
      ? {}
      : { headers: requestOptions[0].headers }),
  });
  const batch = async <const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>> => {
    const body: RpcRequest[] = requests.map((pending) => ({
      id: pending.id,
      input: pending.input as JsonValue,
    }));
    const requestHeaders = new Headers(options.headers);
    for (const pending of requests) {
      if (pending.headers === undefined) continue;
      for (const [key, value] of Object.entries(pending.headers)) {
        if (typeof value === 'string') requestHeaders.set(key, value);
      }
    }
    requestHeaders.set('content-type', 'application/json');
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(body),
      })
    );
    return (await response.json()) as BatchResults<TRequests>;
  };
  const stream = <TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...requestOptions: Record<
      string,
      never
    > extends ProcedureHeaders<TProcedure>
      ? [ClientRequestOptions<TProcedure>?]
      : [ClientRequestOptions<TProcedure>]
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue> => ({
    async *[Symbol.asyncIterator]() {
      const headers = createHeaders(
        options.headers,
        requestOptions[0]?.headers
      );
      headers.set('accept', 'text/event-stream');
      const response = await fetcher(
        new Request(options.url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ id, input }),
        })
      );
      yield* parseSse<JsonValue>(
        response,
        maxStreamEventBytes
      ) as AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
    },
  });
  return {
    call,
    request,
    batch,
    stream,
  };
};
