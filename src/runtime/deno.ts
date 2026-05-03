import type { HandlerOptions, RpcManifest } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface DenoServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export const createDenoFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const serveDeno = (
  manifest: RpcManifest,
  options: DenoServeOptions = {}
): void => {
  const fetch = createJoorHandler(manifest, options);
  const denoGlobal = globalThis as typeof globalThis & {
    Deno?: {
      serve(options: {
        port: number;
        hostname: string;
        handler(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (denoGlobal.Deno === undefined) {
    throw new Error('Deno runtime is not available');
  }
  denoGlobal.Deno.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    handler: fetch,
  });
};
