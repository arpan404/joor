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
    const response = new JoorResponse();
    // Handle OPTIONS preflight request

    const status = 204; // HTTP status code for "No Content"
    response.setStatus(status); // Set the status for preflight response

    // Handle the "Access-Control-Allow-Origin" header based on the provided options
    if (options.origins) {
      if (
        options.origins === '*' || // Wildcard for all origins
        (Array.isArray(options.origins) &&
          options.origins.length === 1 &&
          options.origins[0] === '*')
      ) {
        // Allow all origins
        response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
        // Store the header for later use in request handling
        request.joorHeaders = {
          ...request.joorHeaders,
          'Access-Control-Allow-Origin': '*',
        };
      } else if (options.origins.includes(request.headers.origin as string)) {
        // Allow specific origin if it matches the request origin
        response.setHeaders({
          'Access-Control-Allow-Origin': request.headers.origin as string,
        });
        request.joorHeaders = {
          ...request.joorHeaders,
          'Access-Control-Allow-Origin': request.headers.origin as string,
        };
      } else if (Array.isArray(options.origins)) {
        // Handle wildcard origins with regex
        const regex = new RegExp(
          `^${options.origins
            .map((origin) => origin.replace(/\./g, '\\.').replace(/\*/g, '.*'))
            .join('$|^')}$`
        );
        if (regex.test(request.headers.origin as string)) {
          response.setHeaders({
            'Access-Control-Allow-Origin': request.headers.origin as string,
          });
          request.joorHeaders = {
            ...request.joorHeaders,
            'Access-Control-Allow-Origin': request.headers.origin as string,
          };
        }
      }
    } else {
      // Default to allow all origins
      response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Origin': '*',
      };
    }

    // Handle the "Access-Control-Allow-Methods" header
    if (options.methods) {
      if (options.methods === '*') {
        // Allow all methods
        response.setHeaders({ 'Access-Control-Allow-Methods': '*' });
        request.joorHeaders = {
          ...request.joorHeaders,
          'Access-Control-Allow-Methods': '*',
        };
      } else {
        // Allow specified methods
        response.setHeaders({
          'Access-Control-Allow-Methods': Array.isArray(options.methods)
            ? options.methods.join(',')
            : options.methods,
        });
      }
    } else {
      // Default to allow all methods
      response.setHeaders({ 'Access-Control-Allow-Methods': '*' });
    }

    // Handle the "Access-Control-Expose-Headers" header
    if (options.exposedHeaders) {
      response.setHeaders({
        'Access-Control-Expose-Headers': Array.isArray(options.exposedHeaders)
          ? options.exposedHeaders.join(',')
          : options.exposedHeaders,
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Expose-Headers': Array.isArray(options.exposedHeaders)
          ? options.exposedHeaders.join(',')
          : options.exposedHeaders,
      };
    }

    // Handle the "Access-Control-Allow-Headers" header
    if (options.allowedHeaders) {
      response.setHeaders({
        'Access-Control-Allow-Headers': Array.isArray(options.allowedHeaders)
          ? options.allowedHeaders.join(',')
          : options.allowedHeaders,
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Headers': Array.isArray(options.allowedHeaders)
          ? options.allowedHeaders.join(',')
          : options.allowedHeaders,
      };
    } else {
      // Default to allow all headers
      response.setHeaders({ 'Access-Control-Allow-Headers': '*' });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Headers': '*',
      };
    }

    // Handle the "Access-Control-Allow-Credentials" header
    if (options.allowsCookies) {
      response.setHeaders({ 'Access-Control-Allow-Credentials': 'true' });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Credentials': 'true',
      };
    } else {
      response.setHeaders({ 'Access-Control-Allow-Credentials': 'false' });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Credentials': 'false',
      };
    }

    // Handle the "Access-Control-Max-Age" header
    if (options.maxAge) {
      response.setHeaders({
        'Access-Control-Max-Age': options.maxAge.toString(),
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Max-Age': options.maxAge.toString(),
      };
    } else {
      // Default max-age is 0
      response.setHeaders({
        'Access-Control-Max-Age': '0',
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Max-Age': '0',
      };
    }

    // If the request method is OPTIONS, return the preflight response immediately
    if (request.method === 'OPTIONS') return response;
  };
}
