import Jrror from '@/core/error';
import { ROUTE_HANDLER, ROUTE_METHOD, ROUTES } from '@/types/route';

/**
 * Matches a given path and method against a set of registered routes and returns the corresponding route handlers and type information.
 *
 * @param path - The path to match against the registered routes.
 * @param method - The HTTP method (e.g., GET, POST) to match against the registered routes.
 * @param registeredRoutes - An object containing the registered routes organized by HTTP method.
 * @returns An object containing the route handlers, type information, and optional parameter value if a dynamic route is matched, or `null` if no match is found.
 *
 * @throws {Jrror} If the path is empty or not a string.
 * @throws {Jrror} If an error occurs while matching the route.
 *
 * @example
 * ```typescript
 * const registeredRoutes = {
 *   GET: {
 *     "/users": {
 *       handlers: [getUserHandler],
 *       type: { isDynamic: false }
 *     },
 *     "/users/[id]": {
 *       handlers: [getUserByIdHandler],
 *       type: { isDynamic: true, dynamicParam: "id" }
 *     }
 *   }
 * };
 *
 * const result = matchRoute("/users/123", "GET", registeredRoutes);
 * // result: {
 * //   handlers: [getUserByIdHandler],
 * //   type: { isDynamic: true, dynamicParam: "id" },
 * //   paramValue: "123"
 * // }
 * ```
 */
const matchRoute = (
  path: string,
  method: ROUTE_METHOD,
  registeredRoutes: ROUTES
): {
  handlers: ROUTE_HANDLER[];
  type: {
    isDynamic: boolean;
    dynamicParam?: string;
  };
  paramValue?: string;
} | null => {
  try {
    if (!path) {
      throw new Jrror({
        code: 'path-empty',
        message: 'Path cannot be empty',
        type: 'error',
      });
    }
    if (typeof path !== 'string') {
      throw new Jrror({
        code: 'path-invalid',
        message: `Path must be of type string but got ${typeof path}`,
        type: 'error',
      });
    }

    if (!registeredRoutes) {
      return null;
    }

    const routes = registeredRoutes[method];

    if (!routes) {
      return null;
    }
    if (routes[path]) {
      return routes[path];
    }

    // Iterate over each registered route to check for dynamic segments
    for (const route in routes) {
      const routeParts = route.split('/');
      const pathParts = path.split('/');

      // Skip routes that do not have the same number of segments
      if (routeParts.length !== pathParts.length) {
        continue;
      }

      // Extract the last segment of the path and route for comparison
      const paramValue = pathParts.pop() as string;
      const paramPlaceholder = routeParts.pop() as string;

      // Check if the static parts of the route and path match
      if (routeParts.join('/') !== pathParts.join('/')) {
        continue;
      }

      // Check if the last segment of the route is a dynamic parameter
      if (
        paramPlaceholder[0] === '[' &&
        paramPlaceholder[paramPlaceholder.length - 1] === ']'
      ) {
        const param = paramPlaceholder.replace(/[[\]]/g, '');
        return {
          handlers: routes[route].handlers,
          type: {
            isDynamic: true,
            dynamicParam: param,
          },
          paramValue,
        };
      }
    }
    return null;
  } catch (error: unknown) {
    console.error(error);
    throw new Jrror({
      code: 'match-route-error',
      message: `Error while matching the route. path: ${path}`,
      type: 'error',
    });
  }
};

export default matchRoute;
