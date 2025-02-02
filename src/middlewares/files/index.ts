import path from 'node:path';

import JoorResponse from '@/core/response';
import { JoorRequest } from '@/types/request';
import { ROUTE_PATH } from '@/types/route';

/**
 * Serves static files as middleware in a Joor application.
 *
 * @param {Object} options - Configuration options.
 * @param {ROUTE_PATH} options.routePath - Base route to serve files from.
 * @param {string} options.folderPath - Directory containing the files.
 * @param {boolean} [options.stream=true] - Whether to stream the file.
 * @param {boolean} [options.download=false] - Whether to force download.
 * @returns {(request: JoorRequest) => Promise<JoorResponse>} - Middleware function handling file requests.
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
}): (_request: JoorRequest) => Promise<JoorResponse> {
  return async (request: JoorRequest) => {
    const parsedUrl = new URL(
      request.url ?? '',
      `http://${request.headers.host}`
    );
    const pathURLSegments = parsedUrl.pathname.split('/');
    const routePathSegments = routePath.split('/');

    for (let i = 0; i < routePathSegments.length; i++) {
      if (routePathSegments[i] !== pathURLSegments[i]) {
        return new JoorResponse().setStatus(404).setMessage('Not Found');
      }
    }

    const filePath = path.join(
      folderPath,
      ...pathURLSegments.slice(routePathSegments.length)
    );
    const response = new JoorResponse().sendAsFile(filePath).setStatus(200);

    if (stream) response.sendAsStream();
    if (download) response.sendAsDownload();

    return response;
  };
}
