import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { performance } from 'node:perf_hooks';
import express, {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
} from 'express';
import fastify from 'fastify';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { initTRPC, TRPCError } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { z } from 'zod';
import { build } from '../../src/compiler/build.js';
import {
  createNodeTransportRequestHandler,
  type NodeRpcRequestHandler,
  type NodeTransportBodyResultHandler,
} from '../../src/runtime/node.js';
import {
  isJsonObject,
  parseJson,
  type JsonObject,
  type JsonValue,
} from '../../src/schema/json.js';

interface BenchmarkResult {
  name: string;
  requests: number;
  concurrency: number;
  durationMs: number;
  requestsPerSecond: number;
  averageLatencyMs: number;
}

interface RunningServer {
  url: string;
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

const trpcPayload = JSON.stringify({
  id: user.id,
});

const authHeader = 'Bearer benchmark-token';
const outDir = new URL('./.joor', import.meta.url).pathname;
const configPath = new URL('./joor.config.ts', import.meta.url).pathname;
const compiledDispatcherUrl = new URL('./.joor/dispatcher.ts', import.meta.url)
  .href;

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

const readIncomingBody = async (incoming: IncomingMessage): Promise<string> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of incoming) {
    if (chunk instanceof Uint8Array) chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};

const writeJson = (outgoing: ServerResponse, value: JsonValue): void => {
  outgoing.writeHead(200, {
    'cache-control': 'private, max-age=30',
    'content-type': 'application/json',
  });
  outgoing.end(JSON.stringify(value));
};

const toFetchRequest = async (incoming: IncomingMessage): Promise<Request> => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    }
  }
  const body = await readIncomingBody(incoming);
  const init: RequestInit = { headers };
  if (incoming.method !== undefined) init.method = incoming.method;
  if (body.length > 0) init.body = body;
  return new Request(
    `http://${incoming.headers.host ?? 'localhost'}${incoming.url ?? '/rpc'}`,
    init
  );
};

const startFetchServer = async (
  handler: (request: Request) => Promise<Response>
): Promise<RunningServer> =>
  new Promise((resolvePromise, reject) => {
    const server = createServer(async (incoming, outgoing) => {
      try {
        const request = await toFetchRequest(incoming);
        const response = await handler(request);
        outgoing.writeHead(
          response.status,
          Object.fromEntries(response.headers)
        );
        outgoing.end(Buffer.from(await response.arrayBuffer()));
      } catch {
        outgoing.writeHead(500);
        outgoing.end();
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('Unable to allocate server port'));
        return;
      }
      resolvePromise({
        url: `http://127.0.0.1:${address.port}/rpc`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error === undefined) closeResolve();
              else closeReject(error);
            });
          }),
      });
    });
  });

const startNodeHandler = async (
  handler: NodeRpcRequestHandler
): Promise<RunningServer> =>
  new Promise((resolvePromise, reject) => {
    const server = createServer(async (incoming, outgoing) => {
      try {
        await handler(incoming, outgoing);
      } catch {
        outgoing.writeHead(500);
        outgoing.end();
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('Unable to allocate server port'));
        return;
      }
      resolvePromise({
        url: `http://127.0.0.1:${address.port}/rpc`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error === undefined) closeResolve();
              else closeReject(error);
            });
          }),
      });
    });
  });

const startRawNode = async (): Promise<RunningServer> =>
  new Promise((resolvePromise, reject) => {
    const server = createServer(async (incoming, outgoing) => {
      const body = parseJson(await readIncomingBody(incoming));
      if (!isRpcBody(body)) {
        writeJson(outgoing, { ok: false, id: '', traceId: 'benchmark' });
        return;
      }
      writeJson(outgoing, createRpcResponse(body));
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('Unable to allocate server port'));
        return;
      }
      resolvePromise({
        url: `http://127.0.0.1:${address.port}/rpc`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error === undefined) closeResolve();
              else closeReject(error);
            });
          }),
      });
    });
  });

const startExpress = async (): Promise<RunningServer> =>
  new Promise((resolvePromise) => {
    const app = express();
    app.use(express.json());
    app.post('/rpc', (request: ExpressRequest, response: ExpressResponse) => {
      const body = request.body as JsonValue;
      if (!isRpcBody(body)) {
        response.json({ ok: false, id: '', traceId: 'benchmark' });
        return;
      }
      response.setHeader('cache-control', 'private, max-age=30');
      response.json(createRpcResponse(body));
    });
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        throw new Error('Unable to allocate server port');
      }
      resolvePromise({
        url: `http://127.0.0.1:${address.port}/rpc`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error === undefined) closeResolve();
              else closeReject(error);
            });
          }),
      });
    });
  });

const startFastify = async (): Promise<RunningServer> => {
  const app = fastify({ logger: false });
  app.post('/rpc', async (request, reply) => {
    const body = request.body as JsonValue;
    if (!isRpcBody(body)) {
      return { ok: false, id: '', traceId: 'benchmark' };
    }
    reply.header('cache-control', 'private, max-age=30');
    return createRpcResponse(body);
  });
  const url = await app.listen({ port: 0, host: '127.0.0.1' });
  return {
    url: `${url}/rpc`,
    close: async () => {
      await app.close();
    },
  };
};

const startHono = async (): Promise<RunningServer> => {
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
  return startFetchServer(async (request) => await app.fetch(request));
};

const startTrpc = async (): Promise<RunningServer> => {
  const t = initTRPC.create();
  const router = t.router({
    'users.get': t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        if (input.id !== user.id) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        return user;
      }),
  });
  const server = await startFetchServer((request) =>
    fetchRequestHandler({
      endpoint: '/rpc',
      req: request,
      router,
      createContext: () => ({}),
    })
  );
  return {
    ...server,
    url: `${server.url}/users.get`,
  };
};

const startJoor = async (): Promise<RunningServer> => {
  await build({ config: configPath, outDir });
  const compiled = (await import(compiledDispatcherUrl)) as {
    transport: NodeTransportBodyResultHandler;
  };
  return startNodeHandler(
    createNodeTransportRequestHandler(compiled.transport, '127.0.0.1')
  );
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

const requests = 5_000;
const concurrency = 100;
const servers: RunningServer[] = [];
const results: BenchmarkResult[] = [];

try {
  const entries: Array<{
    name: string;
    body: string;
    start(): Promise<RunningServer>;
  }> = [
    { name: 'raw node', body: payload, start: startRawNode },
    { name: 'joor', body: payload, start: startJoor },
    { name: 'express', body: payload, start: startExpress },
    { name: 'fastify', body: payload, start: startFastify },
    { name: 'hono', body: payload, start: startHono },
    { name: 'trpc', body: trpcPayload, start: startTrpc },
  ];

  for (const entry of entries) {
    const server = await entry.start();
    servers.push(server);
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
  await Promise.all(servers.map((server) => server.close()));
}
