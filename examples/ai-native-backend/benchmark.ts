import { performance } from 'node:perf_hooks';
import { build } from '../../src/compiler/build.js';
import { createJoorHandler } from '../../src/runtime/fetch.js';
import config from './joor.config.js';
import chat from './rpc/ai/chat.rpc.js';
import check from './rpc/health/check.rpc.js';
import getUser from './rpc/users/get.rpc.js';
import searchUsers from './rpc/users/search.rpc.js';

interface BenchmarkResult {
  name: string;
  requests: number;
  concurrency: number;
  durationMs: number;
  requestsPerSecond: number;
  averageLatencyMs: number;
}

const outDir = new URL('./.joor', import.meta.url).pathname;
const configPath = new URL('./joor.config.ts', import.meta.url).pathname;
const compiledDispatcherUrl = new URL('./.joor/dispatcher.ts', import.meta.url)
  .href;
const manifest = {
  procedures: {
    'ai.chat': chat,
    'health.check': check,
    'users.get': getUser,
    'users.search': searchUsers,
  },
};

const payload = JSON.stringify({
  id: 'users.get',
  input: {
    id: '550e8400-e29b-41d4-a716-446655440000',
  },
});

const createRequest = (): Request =>
  new Request('http://localhost/rpc', {
    method: 'POST',
    headers: {
      authorization: 'Bearer benchmark-token',
      'content-type': 'application/json',
      'x-forwarded-for': `benchmark-${crypto.randomUUID()}`,
    },
    body: payload,
  });

const runBenchmark = async (
  name: string,
  handler: (request: Request) => Promise<Response>,
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
      const response = await handler(createRequest());
      if (!response.ok) {
        throw new Error(`Unexpected HTTP status ${response.status}`);
      }
      const body = await response.json();
      if (body.ok !== true) {
        throw new Error('Unexpected RPC failure');
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

const printResult = (result: BenchmarkResult): void => {
  console.info(`${result.name}`);
  console.info(`  requests: ${result.requests}`);
  console.info(`  concurrency: ${result.concurrency}`);
  console.info(`  duration: ${result.durationMs.toFixed(2)} ms`);
  console.info(`  throughput: ${result.requestsPerSecond.toFixed(0)} req/s`);
  console.info(`  avg latency: ${result.averageLatencyMs.toFixed(3)} ms`);
};

await build({ config: configPath, outDir });

const genericHandler = createJoorHandler(manifest, config);
const compiled = (await import(compiledDispatcherUrl)) as {
  fetch(request: Request): Promise<Response>;
};
const compiledHandler = compiled.fetch;

const warmup = await runBenchmark('warmup', genericHandler, 500, 25);
printResult(warmup);

const genericResult = await runBenchmark(
  'users.get unary rpc (generic)',
  genericHandler,
  10_000,
  100
);
printResult(genericResult);

const compiledResult = await runBenchmark(
  'users.get unary rpc (compiled)',
  compiledHandler,
  10_000,
  100
);
printResult(compiledResult);
