import Router from './index';

import Jrror from '@/core/error';
import { JoorRequest } from '@/types/request';
import { ROUTE_PATH, ROUTES, ROUTE_METHOD, ROUTE_HANDLER } from '@/types/route';

/**
 * Matches a given route path and method to the registered routes and returns the corresponding handlers.
 *
 * @param {ROUTE_PATH} path - The path of the route to match.
 * @param {ROUTE_METHOD} method - The HTTP method of the route to match.
 * @param {JoorRequest} request - The request object which may be modified to include query parameters and route parameters.
 * @returns {{ handlers: ROUTE_HANDLER[] } | null} An object containing the matched route handlers or null if no match is found.
 *
 * @throws {Jrror} Throws an error if the path is empty or not a string.
 *
 * @example
 * const handlers = matchRoute('/api/users', 'GET', request);
 * if (handlers) {
 *   // Process the handlers
 * } else {
 *   // Handle route not found
 * }
 */
const matchRoute = (
  path: ROUTE_PATH,
  method: ROUTE_METHOD,
  request: JoorRequest
): {
  handlers: ROUTE_HANDLER[];
} | null => {
  let handlers = [] as ROUTE_HANDLER[];

  const registeredRoutes: ROUTES = Router.routes;

  // Validate the path
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

  // Return null if no registered routes
  if (!registeredRoutes) {
    return null;
  }

  // Split the path into parts
  let routeParts = path.split('/');

  const lastElement = routeParts[routeParts.length - 1];

  // Handle query parameters
  if (lastElement.includes('?')) {
    const splitted = lastElement.split('?');

    const [pathPart] = splitted;
    routeParts[routeParts.length - 1] = pathPart;
    const queryParams = splitted[1].split('&');
    queryParams.forEach((queryParam) => {
      const [key, value] = queryParam.split('=');
      request.query = request.query ?? {};
      request.query[key] = value;
    });
  }

  // Handle hash fragments
  if (lastElement.includes('#')) {
    const [pathPart] = lastElement.split('#');
    routeParts[routeParts.length - 1] = pathPart;
  }
  // Remove empty parts
  routeParts = routeParts.filter((part) => part !== '');
  // Handle root path
  if (routeParts.length === 0) {
    if (registeredRoutes['/']?.[method]) {
      handlers = [
        ...(registeredRoutes['/'].globalMiddlewares ?? []),
        ...(registeredRoutes['/'].localMiddlewares ?? []),
        ...registeredRoutes['/'][method].handlers,
      ];
      return { handlers };
    } else {
      return null;
    }
  }

  // Traverse the route tree
  let currentNode = registeredRoutes['/'];

  for (const routePart of routeParts) {
    const currentNodeChildrenPaths = Object.keys(currentNode.children ?? {});

    // Check for static route match
    if (currentNodeChildrenPaths.includes(routePart)) {
      handlers = [...handlers, ...(currentNode.globalMiddlewares ?? [])];
      currentNode = currentNode.children![routePart];
      continue;
    }

    // Check for dynamic route match
    const dynamicNode = currentNodeChildrenPaths.find((childPath) =>
      childPath.startsWith(':')
    );

    if (dynamicNode) {
      handlers = [...handlers, ...(currentNode.globalMiddlewares ?? [])];
      currentNode = currentNode.children![dynamicNode];
      request.params = request.params ?? {};
      request.params[dynamicNode.slice(1)] = routePart;
      continue;
    } else {
      return null;
    }
  }
  // Add middlewares and handlers for the matched route
  handlers = [
    ...handlers,
    ...(currentNode.globalMiddlewares ?? []),
    ...(currentNode.localMiddlewares ?? []),
  ];
  if (currentNode[method]) {
    handlers.push(...currentNode[method].handlers);
    return { handlers: [...handlers] };
  }

  return null;
};

export default matchRoute;
