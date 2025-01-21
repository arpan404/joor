import { ROUTE_HANDLER, ROUTE_METHOD, ROUTE_PATH, ROUTES } from '@/types/route';
import {
  validateRoute,
  validateHandler,
} from '@/core/internals/router/validators';

/**
 * Router Class
 * Manages and defines routes with various HTTP methods (GET, POST, etc.).
 * Supports middleware and route handlers.
 *
 * Example:
 * ```typescript
 * const router = new Router();
 * router.get("/home", middleware1, handler);
 * router.post("/home", handler);
 * ```
 *
 * Methods:
 * - `get`, `post`, `put`, `patch`, `delete`, `options`: Define a route with the specified HTTP method.
 *   - `route`: A string representing the route path.
 *   - `handlers`: One or more functions to handle the request.
 *
 * Middleware:
 * Middleware functions can preprocess requests. If a middleware returns a `Response`, further processing halts.
 *
 * Example:
 * ```typescript
 * const middleware = (req: JoorRequest) => {
 *   if (!req.headers["Authorization"]) {
 *     return new Response(401, "Unauthorized");
 *   }
 * };
 *
 * const handler = (req: Request) => new JoorResponse(200, "Success");
 *
 * router.get("/secure", middleware, handler);
 * ```
 *
 * Dynamic Routes:
 * - Must start with `[` and end with `]`, e.g., `/user/[id]`.
 * - Parameters inside brackets will be extracted and accessible via `req.params`.
 * - Example:
 * ```typescript
 * router.get("/user/[id]", (req) => {
 *  const userId = req.params.id;
 * return new JoorResponse(200, `User ID: ${userId}`);
 * });
 * ```
 */
class Router {
  static routes = {} as ROUTES;

  public get(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('GET', route, handlers);
  }

  public post(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('POST', route, handlers);
  }

  public put(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('PUT', route, handlers);
  }

  public patch(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('PATCH', route, handlers);
  }

  public delete(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('DELETE', route, handlers);
  }

  private addRoute(
    httpMethod: ROUTE_METHOD,
    route: ROUTE_PATH,
    handlers: ROUTE_HANDLER[]
  ) {
    validateRoute(route);
    handlers.forEach(validateHandler);

    // Check if the route already exists
    // If it does, log a warning
    // This is to prevent accidental overwrites and ensure that the developer is aware of it
    if (Router.routes[httpMethod]) {
      if (Router.routes[httpMethod][route]) {
        console.warn(
          `${route} with ${httpMethod} method has already been registered. Trying to register the same route will override the previous one, and there might be unintended behaviors`
        );
      }
    }

    if (
      route.split('/').at(-1)?.startsWith('[') &&
      route.split('/').at(-1)?.endsWith(']')
    ) {
      const dynamicParam = route.split('/').at(-1)?.slice(1, -1);

      Router.routes = {
        ...Router.routes,
        [httpMethod]: {
          ...Router.routes[httpMethod],
          [route]: {
            handlers,
            type: { isDynamic: true, dynamicParam },
          },
        },
      };
    } else {
      Router.routes = {
        ...Router.routes,
        [httpMethod]: {
          ...Router.routes[httpMethod],
          [route]: {
            handlers,
            type: { isDynamic: false },
          },
        },
      };
    }
  }
}

export default Router;
