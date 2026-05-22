import type { JoorManifest } from '../manifest.js';
import type { HandlerOptions } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface NextRouteHandlers {
  GET(request: Request): Promise<Response>;
  POST(request: Request): Promise<Response>;
  OPTIONS(request: Request): Promise<Response>;
}

export const createNextRouteHandlers = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): NextRouteHandlers => {
  const fetch = createJoorHandler(manifest, options);
  return {
    GET: fetch,
    POST: fetch,
    OPTIONS: fetch,
  };
};

export const createNextHandler = createNextRouteHandlers;
