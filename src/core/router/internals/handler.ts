import isAsync from '@/core/helpers/isAsync';
import { GLOBAL_MIDDLEWARES } from '@/core/joor/type';
import { JoorRequest } from '@/core/request/type';
import JoorResponse from '@/core/response';
import { INTERNAL_RESPONSE } from '@/core/response/type';
import Router from '@/core/router';
import matchRoute from '@/core/router/internals/matcher';
import { ROUTE_METHOD } from '@/core/router/type';
import Jrror from '@/error';

/**
 * Handles incoming HTTP requests by matching the request path and method to the relevant route,
 * executing the appropriate handlers, and returning a structured response.
 *
 * The function processes the incoming request as follows:
 *
 * 1. **Route Matching**:
 *    - It matches the provided `pathURL` and `request.method` to the registered routes using `matchRoute`.
 *    - If no matching route is found, a 404 response is returned.
 *
 * 2. **Dynamic Parameter Handling**:
 *    - If the matched route has dynamic parameters, it extracts and sets them in the `request.params`.
 *    - The dynamic parameters are pulled from the URL path, such as `/user/[id]`.
 *
 * 3. **Handler Execution**:
 *    - The route’s handlers are executed sequentially.
 *    - If any handler returns a response, that response is returned.
 *    - If all handlers return `undefined`, an error is thrown indicating that a handler must return a response.
 *
 * 4. **Error Handling**:
 *    - If an error occurs during route matching or handler execution, a 500 Internal Server Error is returned.
 *    - Errors thrown during the process are caught and logged, and the response status is set to 500.
 *
 * ### Error Handling:
 * - If no route matches the request, a 404 Not Found response is returned.
 * - If a handler does not return a valid response, a `Jrror` is thrown with the code `handler-return-undefined`.
 * - If any other error occurs, a 500 Internal Server Error is returned.
 *
 * ### Return Value:
 * - The function returns an `INTERNAL_RESPONSE` object that is prepared for further processing (such as generating the final HTTP response).
 *
 * @param {string} pathURL - The requested URL path for the incoming request.
 * @param {JoorRequest} request - The incoming request object that contains the request details, including method, headers, and body.
 *
 * @returns {Promise<INTERNAL_RESPONSE>} - A promise that resolves to the `INTERNAL_RESPONSE` object, which contains the HTTP response details (status, message, data).
 *
 * @throws {Jrror} - If an error occurs while processing the request, such as:
 *   - If no route matches the request path, a 404 Not Found response is returned.
 *   - If no handler returns a valid response, a `Jrror` with the code `handler-return-undefined` is thrown.
 *   - If there is any other internal error, a 500 Internal Server Error is returned.
 */
async function routeHandler(
  pathURL: string,
  request: JoorRequest, globalMiddlewares: GLOBAL_MIDDLEWARES
): Promise<INTERNAL_RESPONSE> {
  try {
    let method = request.method as ROUTE_METHOD;
    if (method) method = method?.toUpperCase() as ROUTE_METHOD;

    // Attempt to match the route based on the path and method
    const routeDetail = matchRoute(pathURL, method, Router.routes);

    // If no route is found, return a 404 Not Found response
    if (!routeDetail) {
      const response = new JoorResponse();
      response.setStatus(404).setMessage('Not Found');
      return response.parseResponse();
    }

    // If the route is dynamic, set the dynamic parameters in the request
    if (routeDetail.type.isDynamic) {
      request.params = request.params ?? {};
      if (routeDetail.type.dynamicParam) {
        request.params[routeDetail.type.dynamicParam] = pathURL
          .split('/')
          .pop()!; // Capture the dynamic part of the URL
      }
    }

    // Execute each route handler and return the response if available
    const handlers = { ...globalMiddlewares,...routeDetail.handlers };
    let response;
    for (const handler of handlers) {
      if(isAsync(handler)){
        response = await handler(request);
      }
      response = await handler();
      if (response) {
        if (response instanceof JoorResponse){

        return response.parseResponse();
        }
        else{
          throw new Jrror({
          code: "route-handler-invalid-return",
            message:"Route handler returned an invalid value which is not an instance of JoorResponse class. The handler and middleware must either return an instance of JoorResponse or undefined",
            type:"error"
          })
        }
      }
    }

    // If no handler returns a response, throw an error
    throw new Jrror({
      code: 'handler-return-undefined',
      message:
        'All route handlers returned undefined. At least one must return a response.',
      type: 'error',
    });
  } catch (e) {
    console.error(e);
    const response = new JoorResponse();
    response.setStatus(500).setMessage('Internal Server Error');
    return response.parseResponse();
  }
}

export default routeHandler;
