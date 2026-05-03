import type { ProcedureRuntime } from '../procedure/types.js';

export interface LoadedProcedure {
  id: string;
  importPath: string;
  exportName: string;
  procedure: ProcedureRuntime;
}

export interface CompilerManifest {
  procedures: LoadedProcedure[];
}
