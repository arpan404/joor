export interface BenchmarkSetting {
  requests: number;
  concurrency: number;
}

export interface BenchmarkSample {
  name: string;
  setting: BenchmarkSetting;
  run: number;
  requests: number;
  concurrency: number;
  durationMs: number;
  requestsPerSecond: number;
  averageLatencyMs: number;
  latenciesMs: number[];
}

export interface BenchmarkSampleInput {
  name: string;
  setting: BenchmarkSetting;
  run: number;
  durationMs: number;
  latenciesMs: number[];
}

export declare const benchmarkSettingLabel: (
  setting: BenchmarkSetting
) => string;

export declare const readBenchmarkRuns: (fallback?: number) => number;

export declare const readBenchmarkSettings: (
  fallback?: readonly BenchmarkSetting[]
) => BenchmarkSetting[];

export declare const average: (values: readonly number[]) => number;

export declare const benchmarkSample: (
  input: BenchmarkSampleInput
) => BenchmarkSample;

export declare const printBenchmarkSummary: (
  samples: readonly BenchmarkSample[]
) => void;

export declare const printBenchmarkPlan: (
  label: string,
  runs: number,
  settings: readonly BenchmarkSetting[]
) => void;
