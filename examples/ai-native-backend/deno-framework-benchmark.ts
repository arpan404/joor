import { Hono } from 'hono';
import type { Context } from 'hono';
import {
  createDenoTransportRequestHandler,
  type DenoTransportBodyResultHandler,
} from 'joor/runtime/deno';

type JsonPrimitive = null | string | number | boolean;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

interface JsonObject {
  [key: string]: JsonValue;
}

interface BenchmarkResult {
  name: string;
  requests: number;
  concurrency: number;
  durationMs: number;
  requestsPerSecond: number;
  averageLatencyMs: number;
}

interface DenoServer {
  addr: {
    hostname: string;
    port: number;
    transport: string;
  };
  shutdown(): Promise<void> | void;
}

interface DenoRuntime {
  serve(options: {
    port: number;
    hostname: string;
    handler(request: Request): Response | Promise<Response>;
  }): DenoServer;
}

interface RunningServer {
  url: string;
  server: DenoServer;
  close(): Promise<void>;
}

interface RpcBody extends JsonObject {
  id: string;
  input: JsonObject;
}

interface UserDto extends JsonObject {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
}

const deno = (globalThis as typeof globalThis & { Deno?: DenoRuntime }).Deno;
if (deno === undefined) throw new Error('Run this benchmark with Deno');

const user: UserDto = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  plan: 'enterprise',
};

const payload = JSON.stringify({
  id: 'users.get',
  input: {
    id: user.id,
  },
});

const authHeader = 'Bearer benchmark-token';
const compiledDispatcherUrl = new URL('./.joor/dispatcher.ts', import.meta.url)
  .href;
const trustedDispatcherUrl = new URL(
  './.joor-trusted/dispatcher.ts',
  import.meta.url
).href;

const isJsonObject = (value: JsonValue): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJson = (text: string): JsonValue => JSON.parse(text) as JsonValue;

const hasRpcInput = (value: JsonObject): value is RpcBody => {
  const input = value['input'];
  return (
    input !== undefined &&
    isJsonObject(input) &&
    typeof input['id'] === 'string'
  );
};

const isRpcBody = (value: JsonValue): value is RpcBody =>
  isJsonObject(value) && value['id'] === 'users.get' && hasRpcInput(value);

const createRpcResponse = (body: RpcBody): JsonObject => {
  if (body.input['id'] !== user.id) {
    return {
      ok: false,
      id: body.id,
      traceId: 'benchmark',
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404,
      },
    };
  }
  return {
    ok: true,
    id: body.id,
    traceId: 'benchmark',
    data: user,
  };
};

const jsonResponse = (value: JsonValue): Response =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: {
      'cache-control': 'private, max-age=30',
      'content-type': 'application/json',
    },
  });

const serve = (
  handler: (request: Request) => Response | Promise<Response>,
  path = '/rpc'
): RunningServer => {
  const server = deno.serve({
    port: 0,
    hostname: '127.0.0.1',
    handler,
  });
  return {
    url: `http://${server.addr.hostname}:${server.addr.port}${path}`,
    server,
    async close() {
      await server.shutdown();
    },
  };
};

const startRawDeno = (): RunningServer =>
  serve(async (request) => {
    const body = parseJson(await request.text());
    if (!isRpcBody(body)) {
      return jsonResponse({ ok: false, id: '', traceId: 'benchmark' });
    }
    return jsonResponse(createRpcResponse(body));
  });

const startJoorFetch = async (
  dispatcherUrl: string
): Promise<RunningServer> => {
  const compiled = (await import(dispatcherUrl)) as {
    fetch(request: Request): Promise<Response>;
  };
  return serve(compiled.fetch);
};

const startJoorTransport = async (
  dispatcherUrl: string
): Promise<RunningServer> => {
  const compiled = (await import(dispatcherUrl)) as {
    transport: DenoTransportBodyResultHandler;
  };
  return serve(createDenoTransportRequestHandler(compiled.transport));
};

const startHono = (): RunningServer => {
  const app = new Hono();
  const route = async (context: Context): Promise<Response> => {
    const body = parseJson(await context.req.text());
    if (!isRpcBody(body)) {
      return context.json({ ok: false, id: '', traceId: 'benchmark' });
    }
    context.header('cache-control', 'private, max-age=30');
    return context.json(createRpcResponse(body));
  };
  app.post('/rpc', route);
  return serve((request) => app.fetch(request));
};

const createRequestInit = (body: string): RequestInit => ({
  method: 'POST',
  headers: {
    authorization: authHeader,
    'content-type': 'application/json',
    'x-forwarded-for': `benchmark-${crypto.randomUUID()}`,
  },
  body,
});

const runBenchmark = async (
  name: string,
  url: string,
  body: string,
  requests: number,
  concurrency: number
): Promise<BenchmarkResult> => {
  let next = 0;
  const latencies: number[] = [];
  const started = performance.now();
  const worker = async (): Promise<void> => {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= requests) return;
      const requestStarted = performance.now();
      const response = await fetch(url, createRequestInit(body));
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${name} returned HTTP ${response.status}: ${text}`);
      }
      latencies.push(performance.now() - requestStarted);
    }
  };
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      await worker();
    })
  );
  const durationMs = performance.now() - started;
  const averageLatencyMs =
    latencies.reduce((total, value) => total + value, 0) / latencies.length;
  return {
    name,
    requests,
    concurrency,
    durationMs,
    requestsPerSecond: (requests / durationMs) * 1_000,
    averageLatencyMs,
  };
};

const printResults = (results: readonly BenchmarkResult[]): void => {
  console.info(
    '| framework | requests | concurrency | duration ms | req/s | avg latency ms |'
  );
  console.info('| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const result of results) {
    console.info(
      `| ${result.name} | ${result.requests} | ${result.concurrency} | ${result.durationMs.toFixed(2)} | ${result.requestsPerSecond.toFixed(0)} | ${result.averageLatencyMs.toFixed(3)} |`
    );
  }
};

const waitForServer = async (url: string, body: string): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 250);
  });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await fetch(url, createRequestInit(body));
      return;
    } catch {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }
};

const requests = 5_000;
const concurrency = 100;
const servers: RunningServer[] = [];
const results: BenchmarkResult[] = [];

try {
  const entries: Array<{
    name: string;
    body: string;
    start(): RunningServer | Promise<RunningServer>;
  }> = [
    { name: 'raw deno', body: payload, start: startRawDeno },
    {
      name: 'joor deno fetch safe',
      body: payload,
      start: async () => await startJoorFetch(compiledDispatcherUrl),
    },
    {
      name: 'joor deno transport safe',
      body: payload,
      start: async () => await startJoorTransport(compiledDispatcherUrl),
    },
    {
      name: 'joor deno transport trusted',
      body: payload,
      start: async () => await startJoorTransport(trustedDispatcherUrl),
    },
    { name: 'hono deno', body: payload, start: startHono },
  ];

  for (const entry of entries) {
    const server = await entry.start();
    servers.push(server);
    await waitForServer(server.url, entry.body);
    await runBenchmark(`${entry.name} warmup`, server.url, entry.body, 250, 25);
    results.push(
      await runBenchmark(
        entry.name,
        server.url,
        entry.body,
        requests,
        concurrency
      )
    );
  }
  printResults(results);
} finally {
  for (const server of servers) {
    await server.close();
  }
}
