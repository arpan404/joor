import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';
import { CORS_OPTIONS, CORS_RESPONSE } from '@/types/cors';
import Jrror from '@/core/error';

/**
 * Middleware for handling Cross-Origin Resource Sharing (CORS) in Joor applications.
 *
 * Processes CORS preflight (OPTIONS) requests and sets necessary Access-Control headers
 * based on the provided configuration. This middleware should be applied globally.
 *
 * @param {CORS_OPTIONS} options - Configuration for CORS with the following properties:
 * - `origins`: Single origin or array of allowed origins (default: ['*'])
 * - `methods`: Single method or array of allowed HTTP methods (default: ['*'])
 * - `allowedHeaders`: Single header or array of allowed headers (default: ['*'])
 * - `exposedHeaders`: Headers exposed to the client
 * - `allowsCookies`: Enables credentials support (default: false)
 * - `maxAge`: Duration in seconds to cache preflight responses (default: 0)
 *
 * @returns {CORS_RESPONSE} A middleware function to handle CORS.
 *
 * @example
 * ```typescript
 * const app = new Joor();
 *
 * // Using as a middleware instance
 * app.use(cors({
 *   origins: ['http://localhost:3000'],
 *   methods: ['GET', 'POST'],
 *   allowedHeaders: ['Content-Type'],
 *   allowsCookies: true
 * }));
 *
 * // Using as a middleware function
 * const corsMiddleware = cors({
 *   origins: ['*'],
 *   methods: ['GET', 'POST']
 * });
 * app.use(corsMiddleware);
 * ```
 */

export default function cors(options: CORS_OPTIONS): CORS_RESPONSE {
  if (typeof options !== 'object') {
    throw new Jrror({
      code: 'cors-options-invalid',
      message: `CORS options must be an object, but ${typeof options} was provided.`,
      type: 'error',
      docsPath: '/cors',
    });
  }

  const opt = {
    origins: options.origins ?? ['*'],
    methods: options.methods ?? ['*'],
    allowedHeaders: options.allowedHeaders ?? ['*'],
    allowsCookies: options.allowsCookies ?? false,
    maxAge: options.maxAge ?? 0,
    exposedHeaders: options.exposedHeaders ?? undefined,
  };

  // Ensure configuration options are arrays
  opt.origins = Array.isArray(opt.origins) ? opt.origins : ['*'];
  opt.allowedHeaders = Array.isArray(opt.allowedHeaders)
    ? opt.allowedHeaders
    : ['*'];
  options.methods = Array.isArray(options.methods) ? options.methods : ['*'];
  options.methods = options.methods.map((method) =>
    method.toUpperCase()
  ) as CORS_OPTIONS['methods'];

  return (request: JoorRequest): JoorResponse | void => {
    const response = new JoorResponse();

    // Set status code for preflight response
    const status = 204; // No Content
    response.setStatus(status);

    // Configure "Access-Control-Allow-Origin" header
    const origin = request.headers.origin;
    if (
      (!origin && opt.origins.includes('*')) ||
      (opt.origins.length === 1 && opt.origins[0] === '*')
    ) {
      response.setHeaders({ 'Access-Control-Allow-Origin': '*' });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Origin': '*',
      };
    } else if (opt.origins.includes(request.headers.origin ?? '*')) {
      response.setHeaders({
        'Access-Control-Allow-Origin': request.headers.origin ?? '*',
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Allow-Origin': request.headers.origin ?? '*',
      };
    } else {
      if (Array.isArray(options.origins)) {
        const regex = new RegExp(
          `^${opt.origins
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
    }

    // Set "Access-Control-Allow-Methods" header
    response.setHeaders({
      'Access-Control-Allow-Methods': opt.methods.join(','),
    });
    request.joorHeaders = {
      ...request.joorHeaders,
      'Access-Control-Allow-Methods': opt.methods.join(','),
    };

    // Set "Access-Control-Expose-Headers" if specified
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

    // Set "Access-Control-Allow-Headers" header
    response.setHeaders({
      'Access-Control-Allow-Headers': opt.allowedHeaders.join(','),
    });
    request.joorHeaders = {
      ...request.joorHeaders,
      'Access-Control-Allow-Headers': opt.allowedHeaders.join(','),
    };

    // Set "Access-Control-Allow-Credentials" header
    response.setHeaders({
      'Access-Control-Allow-Credentials': `${opt.allowsCookies}`,
    });
    request.joorHeaders = {
      ...request.joorHeaders,
      'Access-Control-Allow-Credentials': `${opt.allowsCookies}`,
    };

    // Set "Access-Control-Max-Age" header
    response.setHeaders({
      'Access-Control-Max-Age': opt.maxAge.toString(),
    });
    request.joorHeaders = {
      ...request.joorHeaders,
      'Access-Control-Max-Age': opt.maxAge.toString(),
    };

    // Return preflight response for OPTIONS requests
    if (request.method === 'OPTIONS') return response;
    return undefined;
  };
}
