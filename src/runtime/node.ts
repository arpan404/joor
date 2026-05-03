import { createServer } from 'node:http';
import type { HandlerOptions, RpcManifest } from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface ListenOptions extends HandlerOptions {
  port?: number;
  hostname?: string;
}

export const listen = (
  manifest: RpcManifest,
  options: ListenOptions = {}
): void => {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  const handler = createJoorHandler(manifest, options);
  const server = createServer(async (incoming, outgoing) => {
    const chunks: Uint8Array[] = [];
    for await (const chunk of incoming) chunks.push(chunk as Uint8Array);
    const body = Buffer.concat(chunks);
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) {
      if (typeof value === 'string') headers.set(key, value);
      else if (Array.isArray(value)) {
        for (const entry of value) headers.append(key, entry);
      }
    }
    const init: RequestInit = { headers };
    if (incoming.method !== undefined) init.method = incoming.method;
    if (body.length > 0) init.body = body;
    const request = new Request(
      `http://${incoming.headers.host ?? hostname}${incoming.url ?? '/rpc'}`,
      init
    );
    const response = await handler(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body === null) {
      outgoing.end();
      return;
    }
    const responseBody = Buffer.from(await response.arrayBuffer());
    outgoing.end(responseBody);
  });
  server.listen(port, hostname);
};
