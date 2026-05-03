import { performance } from 'node:perf_hooks';
import { build } from '../../src/compiler/build.js';
import { createJoorHandler } from '../../src/runtime/fetch.js';
import config from './joor.config.js';
import chat from './rpc/ai/chat.rpc.js';
import check from './rpc/health/check.rpc.js';
import getUser from './rpc/users/get.rpc.js';
import searchUsers from './rpc/users/search.rpc.js';
import {
  benchmarkSample,
  printBenchmarkPlan,
  printBenchmarkSummary,
  readBenchmarkRuns,
  readBenchmarkSettings,
  type BenchmarkSample,
  type BenchmarkSetting,
} from './benchmark-stats.js';

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
      'content-length': String(payload.length),
      'content-type': 'application/json',
      'x-forwarded-for': `benchmark-${crypto.randomUUID()}`,
    },
    body: payload,
  });

const runBenchmark = async (
  name: string,
  handler: (request: Request) => Promise<Response>,
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

await build({ config: configPath, outDir });
await build({ config: trustedConfigPath, outDir: trustedOutDir });

const genericHandler = createJoorHandler(manifest, config);
const compiled = (await import(compiledDispatcherUrl)) as {
  fetch(request: Request): Promise<Response>;
};
const compiledHandler = compiled.fetch;
const trustedCompiled = (await import(trustedDispatcherUrl)) as {
  fetch(request: Request): Promise<Response>;
};
const trustedCompiledHandler = trustedCompiled.fetch;

const runs = readBenchmarkRuns();
const settings = readBenchmarkSettings([
  { requests: 10_000, concurrency: 100 },
]);
const samples: BenchmarkSample[] = [];
printBenchmarkPlan('direct benchmark', runs, settings);

const entries: Array<{
  name: string;
  handler(request: Request): Promise<Response>;
}> = [
  { name: 'users.get unary rpc (generic)', handler: genericHandler },
  { name: 'users.get unary rpc (compiled safe)', handler: compiledHandler },
  {
    name: 'users.get unary rpc (compiled trusted)',
    handler: trustedCompiledHandler,
  },
];

for (const entry of entries) {
  await runBenchmark(
    entry.name,
    entry.handler,
    { requests: 500, concurrency: 25 },
    0
  );
  for (const setting of settings) {
    for (let run = 1; run <= runs; run += 1) {
      samples.push(await runBenchmark(entry.name, entry.handler, setting, run));
    }
  }
}

printBenchmarkSummary(samples);
