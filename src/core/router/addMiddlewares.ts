import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import Router from '@/core/router';
import logger from '@/helpers/joorLogger';
import marker from '@/packages/marker';
import { ROUTE_HANDLER, ROUTE_PATH, ROUTES } from '@/types/route';

/**
 * Adds middlewares to a specified route path in the router.
 *
 * @param {ROUTE_PATH} path - The route path to which the middlewares should be added. Must be a string.
 * @param {ROUTE_HANDLER[]} middlewares - An array of middleware functions to be applied to the route.
 *
 * @throws {Jrror} Throws an error if the path is not a string or if there is a route conflict with dynamic routes.
 *
 * @example
 * // Adding middlewares to a specific route
 * addMiddlewares('/api/user', [authMiddleware, logMiddleware]);
 *
 * @example
 * // Adding global middlewares to all sub-routes
 * addMiddlewares('/api/*', [globalMiddleware]);
 *
 * @remarks
 * - If the path ends with '*', the middleware is considered global and will be applied to all methods and sub-routes.
 * - The function ensures that there are no conflicting dynamic routes in the same parent node.
 * - Middlewares can be either global or local. Global middlewares are applied to all children of the node.
 */
const addMiddlewares = (path: ROUTE_PATH, middlewares: ROUTE_HANDLER[]) => {
  try {
    if (typeof path !== 'string') {
      throw new Jrror({
        code: 'path-invalid',
        message: `Path must be of type string but got ${typeof path}`,
        type: 'error',
        docsPath: '/middlewares',
      });
    }

    const registeredRoutes: ROUTES = Router.routes;
    let routePath = path.startsWith('/') ? path : `/${path}`;
    const routeMiddlewares = middlewares ?? [];

    // Determine if the middleware is global.
    // If the path ends with '*', it is a global middleware.
    // Global middleware will be applied to all methods and sub-routes.
    let isGlobalMiddleware = false;

    if (isGlobalMiddleware) {
      routePath = routePath.slice(0, -1);
    }

    let routeParts = routePath.split('/').filter((part) => part !== '');

    if (routeParts[routeParts.length - 1] === '*') {
      isGlobalMiddleware = true;
      routeParts = routeParts.slice(0, routeParts.length - 1);
    }

    let currentNode = registeredRoutes['/' as ROUTE_PATH];

    // Traverse each part of the route and create a new node if it doesn't exist.
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      // Remove query parameters and hash from the route part.
      const [node] = routePart.split('#')[0].split('?');
      // Ensure the current node has children.
      currentNode.children = currentNode.children ?? {};
      // Check if the current node is dynamic.
      if (node.startsWith(':')) {
        // Ensure there are no conflicting dynamic routes in the same parent node.
        const keys = Object.keys(currentNode.children).filter(
          (key) => key.startsWith(':') && key !== node
        );

        if (keys.length !== 0) {
          throw new Jrror({
            code: 'route-conflict',
            message: `Route conflict: ${path} conflicts with existing route ${keys[0]}. You cannot have multiple dynamic routes in the same parent.`,
            type: 'error',
            docsPath: '/routing',
          });
        }
      }
      // Create a new node with middlewares if it doesn't exist.
      currentNode.children[node] = currentNode.children[node] ?? {
        // These middlewares will be used by all the children of this node.
        globalMiddlewares: [],
        localMiddlewares: [],
      };
      currentNode = currentNode.children[node];
    }

    // Apply the middlewares to the current node.
    if (isGlobalMiddleware) {
      currentNode.globalMiddlewares = [
        ...(currentNode.globalMiddlewares ?? []),
        ...routeMiddlewares,
      ];
    } else {
      currentNode.localMiddlewares = [
        ...(currentNode.localMiddlewares ?? []),
        ...routeMiddlewares,
      ];
    }
  } catch (error: unknown) {
    if (error instanceof Jrror || error instanceof JoorError) {
      error.handle();
    } else {
      logger.error(
        marker.bgRedBright.whiteBright('Failed to add middlewares'),
        error
      );
    }
  }
};

export default addMiddlewares;
