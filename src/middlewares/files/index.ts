import path from 'node:path';

import JoorResponse from '@/core/response';
import { JoorRequest } from '@/types/request';
import { ROUTE_PATH } from '@/types/route';

/**
 * Middleware for serving static files in a Joor application.
 * This middleware should only be used in dynamic routes and does not support
 * route nesting or directory nesting.
 *
 * Example usage:
 * ```ts
 * app.get('/public/:file', serveStaticFiles({ ... }));
 * ```
 * The middleware will look for the static file corresponding to the URL and serve it
 * from the specified directory.
 *
 * If route nesting is needed, a different approach should be used as this middleware
 * won't support such structures.
 *
 * @param {Object} options - Configuration options for the static file serving middleware.
 * @param {ROUTE_PATH} options.routePath - The base route path used to serve static files (e.g., '/public').
 * @param {string} options.folderPath - The local directory where static files are stored.
 * @param {boolean} [options.stream=true] - A flag to indicate whether to stream the file or not. Defaults to `true`.
 * @param {boolean} [options.download=false] - A flag to indicate whether to force download the file. Defaults to `false`.
 *
 * @returns {(request: JoorRequest) => Promise<JoorResponse>} - A middleware function that processes the incoming request,
 *     matches the URL, and serves the appropriate static file from the specified folder.
 *     Returns a `JoorResponse` object representing the file to be sent in the response.
 *
 * @throws {Error} If the static file does not exist or cannot be accessed, it will return a 404 Not Found response.
 */
export default function serveStaticFiles({
  routePath,
  folderPath,
  stream = true,
  download = false,
}: {
  routePath: ROUTE_PATH;
  folderPath: string;
  stream: boolean;
  download: boolean;
}): (_request: JoorRequest) => JoorResponse {
  return (request: JoorRequest) => {
    const parsedUrl = new URL(
      request.url ?? '',
      `http://${request.headers?.host ?? "localhost"}`
    );
    const pathURLSegments = decodeURIComponent(parsedUrl.pathname).split('/').filter((segment) => segment !== '');
    const routePathSegments = routePath.split('/').filter((segment) => segment !== '');

    // Check if the request URL matches the route path
    for (let i = 0; i < routePathSegments.length; i++) {
      if (routePathSegments[i] !== pathURLSegments[i]) {
        return new JoorResponse().setStatus(404).setMessage('Not Found');
      }
    }

    // Construct the file path and serve it
    const filePath = path.join(
      folderPath,
      ...pathURLSegments.slice(routePathSegments.length)
    );
    const response = new JoorResponse().sendAsFile(filePath).setStatus(200);

    // Optionally stream or force download the file
    if (stream) response.sendAsStream();
    if (download) response.sendAsDownload();

    return response;
  };
}
