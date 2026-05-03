const defaultSettings = Object.freeze([{ requests: 5_000, concurrency: 100 }]);

const readEnv = (name) => {
  const processValue = globalThis.process?.env?.[name];
  if (typeof processValue === 'string') return processValue;
  try {
    const denoValue = globalThis.Deno?.env?.get(name);
    return typeof denoValue === 'string' ? denoValue : undefined;
  } catch {
    return undefined;
  }
};

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const parseSetting = (value) => {
  const match = /^(\d+)[x:](\d+)$/.exec(value.trim().toLowerCase());
  if (match === null) return undefined;
  const requestsText = match[1];
  const concurrencyText = match[2];
  if (requestsText === undefined || concurrencyText === undefined) {
    return undefined;
  }
  const requests = parsePositiveInteger(requestsText);
  const concurrency = parsePositiveInteger(concurrencyText);
  if (requests === undefined || concurrency === undefined) return undefined;
  return { requests, concurrency };
};

export const benchmarkSettingLabel = (setting) =>
  `${setting.requests}x${setting.concurrency}`;

export const readBenchmarkRuns = (fallback = 1) => {
  const configured = readEnv('BENCHMARK_RUNS');
  if (configured === undefined) return fallback;
  return parsePositiveInteger(configured) ?? fallback;
};

export const readBenchmarkSettings = (fallback = defaultSettings) => {
  const configured = readEnv('BENCHMARK_SETTINGS');
  if (configured === undefined || configured.trim() === '') {
    return [...fallback];
  }
  const parsed = configured
    .split(',')
    .map(parseSetting)
    .filter((setting) => setting !== undefined);
  return parsed.length === 0 ? [...fallback] : parsed;
};

export const average = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
};

const sortedNumbers = (values) =>
  [...values].sort((left, right) => left - right);

const quantileSorted = (sorted, quantile) => {
  if (sorted.length === 0) return 0;
  const position = (sorted.length - 1) * quantile;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lowerValue = sorted[lowerIndex] ?? 0;
  const upperValue = sorted[upperIndex] ?? lowerValue;
  return lowerValue + (upperValue - lowerValue) * (position - lowerIndex);
};

const summarizeValues = (values) => {
  const sorted = sortedNumbers(values);
  return {
    average: average(values),
    median: quantileSorted(sorted, 0.5),
    q75: quantileSorted(sorted, 0.75),
    q90: quantileSorted(sorted, 0.9),
    q95: quantileSorted(sorted, 0.95),
    q99: quantileSorted(sorted, 0.99),
  };
};

export const benchmarkSample = ({
  name,
  setting,
  run,
  durationMs,
  latenciesMs,
}) => ({
  name,
  setting,
  run,
  requests: setting.requests,
  concurrency: setting.concurrency,
  durationMs,
  requestsPerSecond: (setting.requests / durationMs) * 1_000,
  averageLatencyMs: average(latenciesMs),
  latenciesMs,
});

const aggregateSamples = (samples) => {
  const groups = new Map();
  for (const sample of samples) {
    const key = `${benchmarkSettingLabel(sample.setting)}\0${sample.name}`;
    const existing = groups.get(key);
    if (existing === undefined) {
      groups.set(key, [sample]);
    } else {
      existing.push(sample);
    }
  }
  return [...groups.values()].map((group) => {
    const first = group[0];
    const throughput = summarizeValues(
      group.map((sample) => sample.requestsPerSecond)
    );
    const latency = summarizeValues(
      group.flatMap((sample) => sample.latenciesMs)
    );
    return {
      name: first.name,
      setting: first.setting,
      runs: group.length,
      throughput,
      latency,
    };
  });
};

export const printBenchmarkSummary = (samples) => {
  const rows = aggregateSamples(samples);
  console.info(
    '| setting | framework | runs | avg req/s | median req/s | q75 req/s | q90 req/s | q95 req/s | q99 req/s | avg latency ms | p50 latency ms | p75 latency ms | p90 latency ms | p95 latency ms | p99 latency ms |'
  );
  console.info(
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  );
  for (const row of rows) {
    console.info(
      `| ${benchmarkSettingLabel(row.setting)} | ${row.name} | ${row.runs} | ${row.throughput.average.toFixed(0)} | ${row.throughput.median.toFixed(0)} | ${row.throughput.q75.toFixed(0)} | ${row.throughput.q90.toFixed(0)} | ${row.throughput.q95.toFixed(0)} | ${row.throughput.q99.toFixed(0)} | ${row.latency.average.toFixed(3)} | ${row.latency.median.toFixed(3)} | ${row.latency.q75.toFixed(3)} | ${row.latency.q90.toFixed(3)} | ${row.latency.q95.toFixed(3)} | ${row.latency.q99.toFixed(3)} |`
    );
  }
};

export const printBenchmarkPlan = (label, runs, settings) => {
  console.info(
    `${label}: ${runs} run${runs === 1 ? '' : 's'} across ${settings
      .map(benchmarkSettingLabel)
      .join(', ')}`
  );
};
