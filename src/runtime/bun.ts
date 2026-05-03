import type { HandlerOptions, RpcManifest } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface BunServeOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export const createBunFetch = (
  manifest: RpcManifest,
  options?: HandlerOptions
): ((request: Request) => Promise<Response>) =>
  createJoorHandler(manifest, options);

export const serveBun = (
  manifest: RpcManifest,
  options: BunServeOptions = {}
): void => {
  const fetch = createJoorHandler(manifest, options);
  const bunGlobal = globalThis as typeof globalThis & {
    Bun?: {
      serve(options: {
        port: number;
        hostname: string;
        fetch(request: Request): Promise<Response>;
      }): object;
    };
  };
  if (bunGlobal.Bun === undefined) {
    throw new Error('Bun runtime is not available');
  }
  bunGlobal.Bun.serve({
    port: options.port ?? 3000,
    hostname: options.hostname ?? '0.0.0.0',
    fetch,
  });
};
