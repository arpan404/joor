import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';
import { CORS_OPTIONS, CORS_RESPONSE } from '@/types/cors';

/**
 * CORS (Cross-Origin Resource Sharing) middleware for Joor applications.
 *
 * Handles CORS preflight (OPTIONS) requests and sets appropriate Access-Control headers
 * based on the provided configuration. Must be used as global middleware.
 *
 * @param {CORS_OPTIONS} options - CORS configuration object with the following properties:
 * - origins: String or string[] of allowed origins (default: '*')
 * - methods: String or string[] of allowed HTTP methods (default: '*') 
 * - allowedHeaders: String or string[] of allowed headers (default: '*')
 * - exposedHeaders: String or string[] of headers exposed to client
 * - allowsCookies: Boolean to allow credentials (default: false)
 * - maxAge: Number of seconds to cache preflight (default: 0)
 *
 * @returns {CORS_RESPONSE} Middleware function that handles CORS
 *
 * @example
 * ```typescript
 * const app = new Joor();
 * 
 * // As middleware instance
 * app.use(cors({
 *   origins: ['http://localhost:3000'],
 *   methods: ['GET', 'POST'],
 *   allowedHeaders: ['Content-Type'],
 *   allowsCookies: true
 * }));
 * 
 * // Or as middleware function
 * const corsMiddleware = cors({
 *   origins: '*',
 *   methods: ['GET', 'POST']
 * });
 * app.use(corsMiddleware);
 * ```
 */

export default function cors(options: CORS_OPTIONS): CORS_RESPONSE {
  return (request: JoorRequest) => {
    // Create a new response instance for potential CORS preflight handling
    const response = new JoorResponse();

    // If the request is OPTIONS, respond with preflight headers
    if (request.method === 'OPTIONS') {
      const status = 204;
      response.setStatus(status);

      // Determine Access-Control-Allow-Origin
      if (options.origins) {
        const origin =
          options.origins === '*' ||
          (Array.isArray(options.origins) && options.origins[0] === '*')
            ? '*'
            : options.origins.includes(request.headers.origin as string)
              ? (request.headers.origin as string)
              : null;

        if (origin) {
          response.setHeaders({ 'Access-Control-Allow-Origin': origin });
        }
      } else {
        // Default to wildcard if no origins specified
        response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
      }

      // Determine Access-Control-Allow-Methods
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

      // Exposed Headers can be read via JavaScript
      if (options.exposedHeaders) {
        response.setHeaders({
          'Access-Control-Expose-Headers': Array.isArray(options.exposedHeaders)
            ? options.exposedHeaders.join(',')
            : options.exposedHeaders,
        });
      }

      // Determine Access-Control-Allow-Headers
      if (options.allowedHeaders) {
        response.setHeaders({
          'Access-Control-Allow-Headers': Array.isArray(options.allowedHeaders)
            ? options.allowedHeaders.join(',')
            : options.allowedHeaders,
        });
      } else {
        response.setHeaders({ 'Access-Control-Allow-Headers': '*' });
      }

      // Cookies
      if (options.allowsCookies) {
        response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
      } else {
        response.setHeaders({ 'Access-Control-Allow-Credentials': 'false' });
      }

      // Max-Age
      if (options.maxAge) {
        response.setHeaders({
          'Access-Control-Max-Age': options.maxAge.toString(),
        });
      } else {
        response.setHeaders({ 'Access-Control-Max-Age': '0' });
      }

      return response;
    }

    // For regular requests, only set the CORS origin if present
    if (options.origins) {
      const origin =
        options.origins === '*' ||
        (Array.isArray(options.origins) && options.origins[0] === '*')
          ? '*'
          : options.origins.includes(request.headers.origin as string)
            ? (request.headers.origin as string)
            : null;

      if (origin) {
        // Attach CORS origin headers directly to the request for later usage
        request.joorHeaders = { 'Access-Control-Allow-Origin': origin };
      }
    }

    // If cookies are allowed, set that header
    if (options.allowsCookies) {
      response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
    }

    // Return nothing for non-OPTIONS requests
    return;
  };
}
