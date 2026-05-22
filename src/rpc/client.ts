import type { JsonObject, JsonValue } from '../schema/json.js';
import type {
  ProcedureInput,
  ProcedureOutput,
  ProcedureHeaders,
  ProcedureResponseHeaders,
  StreamEvent,
} from '../procedure/types.js';
import type { RpcEnvelope, RpcRequest } from './protocol.js';

export interface ClientOptions {
  url: string;
  fetch?: (request: Request) => Promise<Response>;
  headers?: Record<string, string>;
  maxStreamEventBytes?: number;
}

export type RpcRouteMap = Record<string, unknown>;

export type RpcRouteId<TRoutes extends RpcRouteMap> = Extract<
  keyof TRoutes,
  string
>;

export type RpcRouteProcedure<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = TRoutes[TId];

export type RpcRouteInput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureInput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteOutput<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureOutput<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteResponseHeaders<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = ProcedureResponseHeaders<RpcRouteProcedure<TRoutes, TId>> & JsonObject;

export type RpcRouteStreamEvent<
  TRoutes extends RpcRouteMap,
  TId extends RpcRouteId<TRoutes>,
> = StreamEvent<RpcRouteProcedure<TRoutes, TId>>;

export type RpcUnaryRouteId<TRoutes extends RpcRouteMap> = {
  [TId in RpcRouteId<TRoutes>]: [RpcRouteStreamEvent<TRoutes, TId>] extends [
    never,
  ]
    ? TId
    : never;
}[RpcRouteId<TRoutes>];

export type RpcStreamRouteId<TRoutes extends RpcRouteMap> = Exclude<
  RpcRouteId<TRoutes>,
  RpcUnaryRouteId<TRoutes>
>;

export type RpcRouteEnvelope<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = RpcEnvelope<
  RpcRouteOutput<TRoutes, TId> & JsonValue,
  TId,
  RpcRouteResponseHeaders<TRoutes, TId>
>;

type PendingRpcRequestHeaders<TProcedure> = Record<
  string,
  never
> extends ProcedureHeaders<TProcedure>
  ? { headers?: ProcedureHeaders<TProcedure> }
  : { headers: ProcedureHeaders<TProcedure> };

type ClientRequestOptionsTuple<TProcedure> = Record<
  string,
  never
> extends ProcedureHeaders<TProcedure>
  ? [ClientRequestOptions<TProcedure>?]
  : [ClientRequestOptions<TProcedure>];

export interface PendingRpcRequest<
  TProcedure = never,
  TId extends string = string,
> {
  id: TId;
  input: ProcedureInput<TProcedure>;
  headers?: ProcedureHeaders<TProcedure>;
}

export type RpcRouteRequest<
  TRoutes extends RpcRouteMap,
  TId extends RpcUnaryRouteId<TRoutes>,
> = PendingRpcRequest<RpcRouteProcedure<TRoutes, TId>, TId> &
  PendingRpcRequestHeaders<RpcRouteProcedure<TRoutes, TId>>;

export type RpcRouteRequestUnion<TRoutes extends RpcRouteMap> = {
  [TId in RpcUnaryRouteId<TRoutes>]: RpcRouteRequest<TRoutes, TId>;
}[RpcUnaryRouteId<TRoutes>];

export type RpcRouteBatchResults<
  TRoutes extends RpcRouteMap,
  TRequests extends readonly unknown[],
> = {
  [TIndex in keyof TRequests]: TRequests[TIndex] extends {
    id: infer TId extends RpcUnaryRouteId<TRoutes>;
  }
    ? RpcRouteEnvelope<TRoutes, TId>
    : never;
};

export type ClientRequestOptions<TProcedure> =
  Record<string, never> extends ProcedureHeaders<TProcedure>
    ? { headers?: ProcedureHeaders<TProcedure> }
    : { headers: ProcedureHeaders<TProcedure> };

export type BatchResults<TRequests extends readonly unknown[]> = {
  [TIndex in keyof TRequests]: TRequests[TIndex] extends PendingRpcRequest<
    infer TProcedure,
    infer TId
  >
    ? RpcEnvelope<
        ProcedureOutput<TProcedure> & JsonValue,
        TId,
        ProcedureResponseHeaders<TProcedure> & JsonObject
      >
    : never;
};

export interface LegacyRpcTransportClient {
  call<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...options: ClientRequestOptionsTuple<TProcedure>
  ): Promise<
    RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue,
      string,
      ProcedureResponseHeaders<TProcedure> & JsonObject
    >
  >;
  request<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...options: ClientRequestOptionsTuple<TProcedure>
  ): PendingRpcRequest<TProcedure, string>;
  batch<const TRequests extends readonly PendingRpcRequest[]>(
    requests: TRequests
  ): Promise<BatchResults<TRequests>>;
  stream<TProcedure>(
    id: string,
    input: ProcedureInput<TProcedure>,
    ...options: ClientRequestOptionsTuple<TProcedure>
  ): AsyncIterable<StreamEvent<TProcedure> & JsonValue>;
}

export interface RouteRpcTransportClient<TRoutes extends RpcRouteMap> {
  call<TId extends RpcUnaryRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): Promise<RpcRouteEnvelope<TRoutes, TId>>;
  request<TId extends RpcUnaryRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): RpcRouteRequest<TRoutes, TId>;
  batch<const TRequests extends readonly RpcRouteRequestUnion<TRoutes>[]>(
    requests: TRequests
  ): Promise<RpcRouteBatchResults<TRoutes, TRequests>>;
  stream<TId extends RpcStreamRouteId<TRoutes>>(
    id: TId,
    input: RpcRouteInput<TRoutes, TId>,
    ...options: ClientRequestOptionsTuple<RpcRouteProcedure<TRoutes, TId>>
  ): AsyncIterable<RpcRouteStreamEvent<TRoutes, TId> & JsonValue>;
}

export type RpcTransportClient<
  TRoutes extends RpcRouteMap = never,
> = [TRoutes] extends [never]
  ? LegacyRpcTransportClient
  : RouteRpcTransportClient<TRoutes>;

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

export const createClient = <TRoutes extends RpcRouteMap = never>(
  options: ClientOptions
): RpcTransportClient<TRoutes> => {
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
  ): Promise<
    RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue,
      string,
      ProcedureResponseHeaders<TProcedure> & JsonObject
    >
  > => {
    const [callOptions] = requestOptions;
    const response = await fetcher(
      new Request(options.url, {
        method: 'POST',
        headers: createHeaders(options.headers, callOptions?.headers),
        body: JSON.stringify({ id, input }),
      })
    );
    return (await response.json()) as RpcEnvelope<
      ProcedureOutput<TProcedure> & JsonValue,
      string,
      ProcedureResponseHeaders<TProcedure> & JsonObject
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
  } as RpcTransportClient<TRoutes>;
};
