import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';
import { CORS_OPTIONS } from '@/types/cors';

/**
 * CORS middleware for Joor application.
 *
 * @param {CORS_OPTIONS} options - CORS configuration.
 * @returns {(request: JoorRequest) => JoorResponse | undefined} Middleware function.
 *
 * @example
 * import Joor from "joor";
 * import cors from "./cors";
 *
 * const app = new Joor();
 * const options = {
 *   origins: ["http://localhost:3000"],
 *   methods: ["GET", "POST"],
 *   allowedHeaders: ["Content-Type"],
 *   allowsCookies: true,
 *   maxAge: 86400,
 * };
 * app.use(cors(options));
 */
export default function cors(
  options: CORS_OPTIONS
): (request: JoorRequest) => JoorResponse | undefined {
  return (request: JoorRequest) => {
    const response = new JoorResponse();

    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      response.setStatus(204);

      // Set headers for preflight response
      if (options.origins) {
        if (options.origins === '*') {
          response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
        } else if (options.origins.includes(request.headers.origin as string)) {
          response.setHeaders({
            'Access-Control-Allow-Origin': request.headers.origin as string,
          });
        }
      }

      if (options.methods) {
        response.setHeaders({
          'Access-Control-Allow-Methods': Array.isArray(options.methods)
            ? options.methods.join(',')
            : options.methods,
        });
      } else {
        response.setHeaders({ 'Access-Control-Allow-Methods': '*' });
      }

      if (options.allowedHeaders) {
        response.setHeaders({
          'Access-Control-Allow-Headers': Array.isArray(options.allowedHeaders)
            ? options.allowedHeaders.join(',')
            : options.allowedHeaders,
        });
      } else {
        response.setHeaders({ 'Access-Control-Allow-Headers': '*' });
      }

      if (options.allowsCookies) {
        response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
      }

      if (options.maxAge) {
        response.setHeaders({
          'Access-Control-Max-Age': options.maxAge.toString(),
        });
      }

      return response;
    }

    // Apply CORS headers to other requests
    if (options.origins) {
      if (options.origins === '*') {
        response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
      } else if (options.origins.includes(request.headers.origin as string)) {
        response.setHeaders({
          'Access-Control-Allow-Origin': request.headers.origin as string,
        });
      }
    }

    if (options.allowsCookies) {
      response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
    }

    return undefined;
  };
}
