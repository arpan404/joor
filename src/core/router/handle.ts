import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import JoorResponse from '@/core/response';
import matchRoute from '@/core/router/match';
import isAsync from '@/helpers/isAsync';
import { JoorRequest } from '@/types/request';
import { INTERNAL_RESPONSE } from '@/types/response';
import { ROUTE_METHOD } from '@/types/route';

/**
 * Handles routing for incoming requests by matching the request path and method
 * to the appropriate route handlers and executing them. This function is meant to be used
 * inside the server of node.js [process method of JoorServer class].
 *
 * @param {JoorRequest} request - The incoming request object containing details such as method and headers.
 * @param {string} pathURL - The URL path of the request to match against defined routes.
 * @returns {Promise<INTERNAL_RESPONSE>} - A promise that resolves to an internal response object.
 *
 * @throws {Jrror} Throws an error if a route handler returns an invalid value or if all handlers return undefined.
 *
 * @example
 * const response = await handleRoute(request, '/api/data');
 * console.log(response);
 */
const handleRoute = async (
  request: JoorRequest,
  pathURL: string
): Promise<INTERNAL_RESPONSE> => {
  try {
    let method = request.method as ROUTE_METHOD;

    if (!method) {
      method = 'GET';
    } else {
      method = method.toUpperCase() as ROUTE_METHOD;
    }

    // Get the details of the route; handlers to be specific
    const routeDetail = matchRoute(pathURL, method, request);

    // If no route is matched, return a 404 Not Found response
    if (!routeDetail?.handlers || routeDetail.handlers.length === 0) {
      const response = new JoorResponse();
      response.setStatus(404).setData('Not Found');
      return response.parseResponse();
    }

    let response;

    for (const handler of routeDetail.handlers) {
      if (isAsync(handler)) {
        response = await handler(request);
      } else {
        response = handler(request);
      }

      // If a valid response is returned, parse and return it
      if (response) {
        if (response instanceof JoorResponse) {
          return response.parseResponse();
        } else {
          throw new Jrror({
            code: 'route-handler-invalid-return',
            message:
              'Route handler returned an invalid value which is not an instance of JoorResponse class. The handler and middleware must either return an instance of JoorResponse or undefined',
            type: 'error',
          });
        }
      }
    }

    // If all handlers return undefined, throw an error
    throw new Jrror({
      code: 'handler-return-undefined',
      message:
        'All route handlers returned undefined. At least one must return a response.',
      type: 'error',
    });
  } catch (error: unknown) {
    if (error instanceof Jrror || error instanceof JoorError) {
      error.handle();
    }

    const response = new JoorResponse();
    response.setStatus(500).setMessage('Internal Server Error');
    return response.parseResponse();
  }
};

export default handleRoute;
