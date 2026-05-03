import { performance } from 'node:perf_hooks';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { build } from '../../src/compiler/build.js';
import {
  createBunTransportRequestHandler,
  type BunTransportBodyResultHandler,
} from '../../src/runtime/bun.js';
import {
  isJsonObject,
  parseJson,
  type JsonObject,
  type JsonValue,
} from '../../src/schema/json.js';
import {
  benchmarkSample,
  printBenchmarkPlan,
  printBenchmarkSummary,
  readBenchmarkRuns,
  readBenchmarkSettings,
  type BenchmarkSample,
  type BenchmarkSetting,
} from './benchmark-stats.js';

interface RunningServer {
  url: string;
  server: BunServer;
  close(): void;
}

interface BunServer {
  url: URL;
  fetch(request: Request): Response | Promise<Response>;
  stop(closeActiveConnections?: boolean): void;
}

interface BunRuntime {
  serve(options: {
    port: number;
    hostname: string;
    fetch(request: Request): Response | Promise<Response>;
  }): BunServer;
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

const bun = (globalThis as typeof globalThis & { Bun?: BunRuntime }).Bun;
if (bun === undefined) throw new Error('Run this benchmark with Bun');

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
const outDir = new URL('./.joor', import.meta.url).pathname;
const trustedOutDir = new URL('./.joor-trusted', import.meta.url).pathname;
const configPath = new URL('./joor.config.ts', import.meta.url).pathname;
const trustedConfigPath = new URL('./joor.trusted.config.ts', import.meta.url)
  .pathname;
const compiledDispatcherUrl = new URL('./.joor/dispatcher.ts', import.meta.url)
  .href;
const trustedDispatcherUrl = new URL(
  './.joor-trusted/dispatcher.ts',
  import.meta.url
).href;

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
  const server = bun.serve({
    port: 0,
    hostname: '127.0.0.1',
    fetch: handler,
  });
  return {
    url: `${server.url.origin}${path}`,
    server,
    close() {
      server.stop(true);
    },
  };
};

const startRawBun = (): RunningServer =>
  serve(async (request) => {
    const body = parseJson(await request.text());
    if (!isRpcBody(body)) {
      return jsonResponse({ ok: false, id: '', traceId: 'benchmark' });
    }
    return jsonResponse(createRpcResponse(body));
  });

const startJoor = async (
  buildConfigPath: string,
  buildOutDir: string,
  dispatcherUrl: string
): Promise<RunningServer> => {
  await build({ config: buildConfigPath, outDir: buildOutDir });
  const compiled = (await import(dispatcherUrl)) as {
    transport: BunTransportBodyResultHandler;
  };
  return serve(
    createBunTransportRequestHandler(compiled.transport, undefined, false)
  );
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

const createRequest = (body: string): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      authorization: authHeader,
      'content-length': String(body.length),
      'content-type': 'application/json',
      'x-forwarded-for': `benchmark-${crypto.randomUUID()}`,
    },
    body,
  });

const createNetworkRequestInit = (body: string): RequestInit => ({
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
  server: BunServer,
  body: string,
  setting: BenchmarkSetting,
  run: number
): Promise<BenchmarkSample> => {
  let next = 0;
  const latencies: number[] = [];
  const started = performance.now();
  const worker = async (): Promise<void> => {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= setting.requests) return;
      const requestStarted = performance.now();
      const response = await server.fetch(createRequest(body));
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${name} returned HTTP ${response.status}: ${text}`);
      }
      latencies.push(performance.now() - requestStarted);
    }
  };
  await Promise.all(
    Array.from({ length: setting.concurrency }, async () => {
      await worker();
    })
  );
  const durationMs = performance.now() - started;
  return benchmarkSample({
    name,
    setting,
    run,
    durationMs,
    latenciesMs: latencies,
  });
};

const runNetworkSmoke = async (
  name: string,
  url: string,
  body: string
): Promise<void> => {
  const response = await fetch(url, createNetworkRequestInit(body));
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${name} returned HTTP ${response.status}: ${text}`);
  }
};

const waitForServer = async (
  name: string,
  url: string,
  body: string
): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await runNetworkSmoke(name, url, body);
      return;
    } catch {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }
  throw new Error(`${name} did not accept connections at ${url}`);
};

const runs = readBenchmarkRuns();
const settings = readBenchmarkSettings();
const servers: RunningServer[] = [];
const samples: BenchmarkSample[] = [];
printBenchmarkPlan('bun framework benchmark', runs, settings);

try {
  const entries: Array<{
    name: string;
    body: string;
    start(): RunningServer | Promise<RunningServer>;
  }> = [
    { name: 'raw bun', body: payload, start: startRawBun },
    {
      name: 'joor bun safe',
      body: payload,
      start: async () =>
        await startJoor(configPath, outDir, compiledDispatcherUrl),
    },
    {
      name: 'joor bun trusted',
      body: payload,
      start: async () =>
        await startJoor(trustedConfigPath, trustedOutDir, trustedDispatcherUrl),
    },
    { name: 'hono bun', body: payload, start: startHono },
  ];

  for (const entry of entries) {
    const server = await entry.start();
    servers.push(server);
    await waitForServer(entry.name, server.url, entry.body);
    await runBenchmark(
      `${entry.name} warmup`,
      server.server,
      entry.body,
      { requests: 250, concurrency: 25 },
      0
    );
    for (const setting of settings) {
      for (let run = 1; run <= runs; run += 1) {
        samples.push(
          await runBenchmark(
            entry.name,
            server.server,
            entry.body,
            setting,
            run
          )
        );
      }
    }
  }
  printBenchmarkSummary(samples);
} finally {
  for (const server of servers) server.close();
}
