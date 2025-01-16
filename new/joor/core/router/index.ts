import {
  ROUTE_HANDLER,
  ROUTE_METHOD,
  ROUTE_PATH,
  ROUTES,
} from "@/core/router/type";
import { validateRoute, validateHandler } from "@/core/router/validators";

/**
 * Router Class
 * Manages and defines routes in the application.
 *
 * Usage:
 * Create an instance to define routes with various HTTP methods (GET, POST, etc.).
 * Supports adding middleware and route handlers.
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
 * Middleware Support:
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
 * - Dynamic routes must start with `[` and end with `]`, for example: `/user/[id]`.
 * - These routes will be treated as dynamic and the parameter inside the brackets will be extracted.
 * - Dynamic routes parameters can be accessed using `req.params`.
 * - Example:
 * ```typescript
 * router.get("/user/[id]", (req) => {
 *  const userId = req.params.id;
 * return new JoorResponse(200, `User ID: ${userId}`);
 * });
 * ```
 */
class Router {
  /**
   * Set of registered routes.
   * Uses `Set` to store unique route-method-handler combinations.
   */
  static routes = {} as ROUTES;

  /**
   * Registers a GET route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public get(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("GET", route, handlers);
  }

  /**
   * Registers a POST route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public post(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("POST", route, handlers);
  }

  /**
   * Registers a PUT route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public put(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("PUT", route, handlers);
  }

  /**
   * Registers a PATCH route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public patch(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("PATCH", route, handlers);
  }

  /**
   * Registers a DELETE route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public delete(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("DELETE", route, handlers);
  }

  /**
   * Registers an OPTIONS route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  public options(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("OPTIONS", route, handlers);
  }

  /**
   * Adds a route with the specified method, path, and handlers.
   * Validates the route and handlers before adding them.
   * @param method - HTTP method for the route.
   * @param route - Route path.
   * @param handlers - Array of middleware or handler functions.
   */
  private addRoute(
    method: ROUTE_METHOD,
    route: ROUTE_PATH,
    handlers: ROUTE_HANDLER[]
  ) {
    validateRoute(route);
    handlers.forEach(validateHandler);
    if (
      route.split("/").at(-1)?.startsWith("[") &&
      route.split("/").at(-1)?.endsWith("]")
    ) {
      const dynamicParam = route.split("/").at(-1)?.slice(1, -1);

      Router.routes = {
        ...Router.routes,
        [method]: {
          ...Router.routes[method],
          [route]: {
            handlers,
            type: { isDynamic: true, dynamicParam },
          },
        },
      };
    } else {
      Router.routes = {
        ...Router.routes,
        [method]: {
          ...Router.routes[method],
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
