import { JoorRequest } from "../request/type";
import JoorResponse from "../response";
import { CORS_OPTIONS } from "./type";

/**
 * Middleware function to handle Cross-Origin Resource Sharing (CORS).
 * Use this function with the `.use` method of the Joor application.
 *
 * @param {CORS_OPTIONS} options - Configuration for CORS:
 *   - `origins` (string | string[]): Allowed origins (e.g., `*`, specific URLs, or an array of URLs).
 *   - `methods` (string | string[]): Allowed HTTP methods (e.g., `*`, `GET`, `POST`).
 *   - `allowedHeaders` (string | string[]): Allowed headers (e.g., `*`, `Content-Type`).
 *   - `allowsCookies` (boolean): Whether to allow credentials (cookies).
 *   - `maxAge` (number): Cache duration for preflight requests in seconds.
 * @returns {(request: JoorRequest) => JoorResponse | undefined} Middleware for handling CORS requests.
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
 *
 * @typedef {Object} CORS_OPTIONS
 * @property {string | string[]} origins - Allowed origins for CORS.
 * @property {string | string[]} [methods] - Allowed HTTP methods.
 * @property {string | string[]} [allowedHeaders] - Allowed HTTP headers.
 * @property {boolean} [allowsCookies] - Enable credentials (cookies).
 * @property {number} [maxAge] - Cache duration for preflight response.
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