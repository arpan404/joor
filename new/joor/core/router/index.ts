import { ROUTES } from "@/core/router/type";
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
 * - Each method takes:
 *   - `route`: A string representing the route path.
 *   - `handlers`: One or more functions to handle the request.
 *
 * Middleware Support:
 * Middleware functions can preprocess requests. If a middleware returns a `Response`, further processing halts.
 *
 * Example:
 * ```typescript
 * const middleware = (req: Request) => {
 *   if (!req.headers["Authorization"]) {
 *     return new Response(401, "Unauthorized");
 *   }
 * };
 *
 * const handler = (req: Request) => new Response(200, "Success");
 *
 * router.get("/secure", middleware, handler);
 * ```
 */
class Router {
  /**
   * Set of registered routes.
   * Uses `Set` to store unique route-method-handler combinations.
   */
  routes = new Set<ROUTES>();

  /**
   * Registers a GET route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  get(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
    this.addRoute("GET", route, handlers);
  }

  /**
   * Registers a POST route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  post(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
    this.addRoute("POST", route, handlers);
  }

  /**
   * Registers a PUT route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  put(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
    this.addRoute("PUT", route, handlers);
  }

  /**
   * Registers a PATCH route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  patch(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
    this.addRoute("PATCH", route, handlers);
  }

  /**
   * Registers a DELETE route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  delete(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
    this.addRoute("DELETE", route, handlers);
  }

  /**
   * Registers an OPTIONS route with the specified handlers.
   * @param route - The route path.
   * @param handlers - Middleware or handlers for the route.
   */
  options(route: ROUTES["route"], ...handlers: ROUTES["handlers"]) {
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
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS",
    route: ROUTES["route"],
    handlers: ROUTES["handlers"]
  ) {
    validateRoute(route);
    handlers.forEach(validateHandler);

    this.routes.add({ route, handlers, method });
  }
}

export default Router;
