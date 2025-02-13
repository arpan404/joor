import Jrror from '@/core/error';
import JoorResponse from '@/core/reponse';
import { CORS_OPTIONS, CORS_RESPONSE } from '@/types/cors';
import { JoorRequest } from '@/types/request';

/**
 * A middleware function that returns a function to handle CORS preflight requests in the Joor application.
 * The CORS middleware can be applied globally or to specific routes.
 *
 * ### Applying CORS Globally
 * To enable CORS for the entire application, use:
 * @example
 * ```typescript
 * import Joor, { cors } from 'joor';
 * const app = new Joor();
 * app.use(cors());
 * app.start();
 * ```
 *
 * ### Applying CORS to Specific Routes
 * To apply CORS to a particular route:
 * @example
 * ```typescript
 * app.use('/api', cors()); // Applies CORS to all methods of the `/api` route
 * ```
 *
 * To apply CORS to a specific HTTP method of a route:
 * @example
 * ```typescript
 * app.get('/api/user', cors(), async (request, response) => {
 *   // Handle the request
 * });
 * ```
 *
 * To apply CORS to a route and its subroutes:
 * @example
 * ```typescript
 * app.use('/api/*', cors()); // Applies CORS to all subroutes under `/api`
 * ```
 *
 * **Note:** By default, CORS will be applied with its default settings.
 *
 * ### Configuring CORS
 * The middleware can be customized by passing an options object:
 * @example
 * ```typescript
 * const options = {
 *   origins: ['http://localhost:3000'],
 *   methods: ['GET', 'POST'],
 *   allowedHeaders: ['Content-Type'],
 *   allowsCookies: true,
 *   maxAge: 3600
 * };
 * app.use(cors(options)());
 * ```
 *
 * #### Origin Options:
 * - You can specify a single origin or an array of allowed origins.
 * - To allow all subdomains, use a wildcard: `'https://*.example.com'`.
 * - To allow both the main domain and all subdomains: `'https://example.com, https://*.example.com'`.
 * - To allow different ports: `'http://localhost:3000, http://localhost:3001'` or `'http://localhost:*'`.
 *
 * ### Parameters
 * @param {CORS_OPTIONS} options - Configuration object for CORS:
 * - `origins` (string | string[]) - Allowed origins (default: `['*']`).
 * - `methods` (string | string[]) - Allowed HTTP methods (default: `['*']`).
 * - `allowedHeaders` (string | string[]) - Allowed headers (default: `['*']`).
 * - `exposedHeaders` (string | string[]) - Headers exposed to the client.
 * - `allowsCookies` (boolean) - Enables credentials support (default: `false`).
 * - `maxAge` (number) - Cache duration for preflight responses in seconds (default: `0`).
 *
 * ### Returns
 * @returns {CORS_RESPONSE} A middleware function that handles CORS.
 *
 * **Usage:** Since this function returns a middleware handler, it must be executed before applying it.
 * @example
 * ```typescript
 * import Joor, { cors } from 'joor';
 * const app = new Joor();
 * app.use(cors()); // Direct usage
 * app.start();
 *
 * // or
 *
 * const corsMiddleware = cors(); // Store middleware in a variable
 * app.use(corsMiddleware);
 * ```
 */

export default function cors(options?: CORS_OPTIONS): CORS_RESPONSE {
  if (options && typeof options !== 'object') {
    throw new Jrror({
      code: 'cors-options-invalid',
      message: `CORS options must be an object, but ${typeof options} was provided.`,
      type: 'error',
      docsPath: '/cors',
    });
  }

  const opt = {
    origins: options ? (options.origins ?? ['*']) : ['*'],
    methods: options ? (options.methods ?? ['*']) : ['*'],
    allowedHeaders: options ? (options.allowedHeaders ?? ['*']) : ['*'],
    allowsCookies: options ? (options.allowsCookies ?? false) : false,
    maxAge: options ? (options.maxAge ?? 0) : 0,
    exposedHeaders: options ? (options.exposedHeaders ?? undefined) : undefined,
  };
  // Ensure configuration options are arrays
  opt.origins = Array.isArray(opt.origins) ? opt.origins : ['*'];
  opt.allowedHeaders = Array.isArray(opt.allowedHeaders)
    ? opt.allowedHeaders
    : ['*'];
  opt.methods = Array.isArray(opt.methods) ? opt.methods : ['*'];
  opt.methods = opt.methods.map((method) => method.toUpperCase());
  return (request: JoorRequest): JoorResponse | void => {
    const response = new JoorResponse();

    // Set status code for preflight response
    const status = 204; // No Content
    response.setStatus(status);
    // Configure "Access-Control-Allow-Origin" header
    const { origin } = request.headers;

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
      if (Array.isArray(opt.origins)) {
        const regex = new RegExp(
          `^${opt.origins
            .map((org) => org.replace(/\./g, '\\.').replace(/\*/g, '.*'))
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
    if (opt.exposedHeaders) {
      response.setHeaders({
        'Access-Control-Expose-Headers': Array.isArray(opt.exposedHeaders)
          ? opt.exposedHeaders.join(',')
          : opt.exposedHeaders,
      });
      request.joorHeaders = {
        ...request.joorHeaders,
        'Access-Control-Expose-Headers': Array.isArray(opt.exposedHeaders)
          ? opt.exposedHeaders.join(',')
          : opt.exposedHeaders,
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
