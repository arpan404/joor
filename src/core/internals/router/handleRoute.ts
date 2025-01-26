import JoorResponse from '@/core/response';
import { JoorRequest } from '@/types/request';
import { INTERNAL_RESPONSE } from '@/types/response';
import { ROUTE_METHOD } from '@/types/tt';
import matchRoute from '@/core/internals/router/matchRoute';
import Router from '@/core/router';
import Jrror from '@/core/error';
import isAsync from '@/helpers/isAsync';
import { GLOBAL_MIDDLEWARES } from '@/types/joor';

/**
 * Handles routing for incoming requests by matching the request path and method
 * to the appropriate route handler and executing the associated middlewares.
 *
 *
 * @param {JoorRequest} request - The incoming request object.
 * @param {GLOBAL_MIDDLEWARES} globalMiddlewares - An object containing global middleware functions.
 * @param {string} pathURL - The URL path of the incoming request.
 * @returns {Promise<INTERNAL_RESPONSE>} - A promise that resolves to an internal response object.
 *
 * @throws {Jrror} Throws an error if a route handler returns an invalid value or if all handlers return undefined.
 */
const handleRoute = async (
  request: JoorRequest,
  globalMiddlewares: GLOBAL_MIDDLEWARES,
  pathURL: string
): Promise<INTERNAL_RESPONSE> => {
  try {
    let method = request.method as ROUTE_METHOD;
    if (!method) {
      method = 'GET';
    } else {
      method = method.toUpperCase() as ROUTE_METHOD;
    }
    // Attempt to match the route based on the path and method
    const routeDetail = matchRoute(pathURL, method, Router.routes);

    // If no route is found, return a 404 Not Found response
    if (!routeDetail) {
      const response = new JoorResponse();
      response.setStatus(404).setMessage('Not Found');
      return response.parseResponse();
    }
    if (routeDetail.type.isDynamic) {
      request.params = request.params ?? {};
      if (routeDetail.type.dynamicParam) {
        request.params[routeDetail.type.dynamicParam] = routeDetail.paramValue!;
      }
    }
    const handlers = { ...globalMiddlewares, ...routeDetail.handlers };
    let response;
    for (const handler of handlers) {
      if (isAsync(handler)) {
        response = await handler(request);
      } else {
        response = handler(request);
      }
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
    throw new Jrror({
      code: 'handler-return-undefined',
      message:
        'All route handlers returned undefined. At least one must return a response.',
      type: 'error',
    });
  } catch (error: unknown) {
    console.error(error);
    const response = new JoorResponse();
    response.setStatus(500).setMessage('Internal Server Error');
    return response.parseResponse();
  }
};

export default handleRoute;
