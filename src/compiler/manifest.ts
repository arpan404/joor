import type { ProcedureRuntime } from '../procedure/types.js';

export interface LoadedProcedure {
  readonly id: string;
  readonly importPath: string;
  readonly exportName: string;
  readonly procedure: ProcedureRuntime;
}

export interface CompilerManifest {
  readonly procedures: readonly LoadedProcedure[];
}
