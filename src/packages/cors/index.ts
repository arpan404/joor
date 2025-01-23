import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';
import { CORS_OPTIONS, CORS_RESPONSE } from '@/types/cors';

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
 *   exposedHeaders: ["X-Custom-Header"]
 * };
 * app.use(cors(options));
 */
export default function cors(options: CORS_OPTIONS): CORS_RESPONSE {
  return (request: JoorRequest) => {
    console.log(options);
    const response = new JoorResponse();
    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      const status = 204;
      response.setStatus(status);

      // Set headers for preflight response
      if (options.origins) {
        if (
          options.origins === '*' ||
          (Array.isArray(options.origins) &&
            options.origins.length === 1 &&
            options.origins[0] === '*')
        ) {
          response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
        } else if (options.origins.includes(request.headers.origin as string)) {
          response.setHeaders({
            'Access-Control-Allow-Origin': request.headers.origin as string,
          });
        } else if (Array.isArray(options.origins)) {
          const regex = new RegExp(
            `^${options.origins.map((origin) => origin.replace(/\./g, '\\.').replace(/\*/g, '.*')).join('$|^')}$`
          );
          if (regex.test(request.headers.origin as string)) {
            response.setHeaders({
              'Access-Control-Allow-Origin': request.headers.origin as string,
            });
          }
        }
      } else {
        response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
      }

      if (options.methods) {
        if (options.methods === '*') {
          response.setHeaders({ 'Access-Control-Allow-Methods': '*' });
        } else {
          response.setHeaders({
            'Access-Control-Allow-Methods': Array.isArray(options.methods)
              ? options.methods.join(',')
              : options.methods,
          });
        }
      } else {
        response.setHeaders({ 'Access-Control-Allow-Methods': '*' });
      }

      if (options.exposedHeaders) {
        response.setHeaders({
          'Access-Control-Expose-Headers': Array.isArray(options.exposedHeaders)
            ? options.exposedHeaders.join(',')
            : options.exposedHeaders,
        });
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
      } else {
        response.setHeaders({ 'Access-Control-Allow-Credentials': 'false' });
      }

      if (options.maxAge) {
        response.setHeaders({
          'Access-Control-Max-Age': options.maxAge.toString(),
        });
      } else {
        response.setHeaders({
          'Access-Control-Max-Age': '0',
        });
      }

      return response;
    }

    // Apply CORS headers to other requests
    if (options.origins) {
      if (options.origins === '*') {
        request.joorHeaders = { 'Access-Control-Allow-Origin': '*' };
      } else if (options.origins.includes(request.headers.origin as string)) {
        request.joorHeaders = {
          'Access-Control-Allow-Origin': request.headers.origin as string,
        };
      }
    }

    if (options.allowsCookies) {
      response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
    }

    return;
  };
}
