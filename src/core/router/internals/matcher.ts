import Jrror from "@/error";
import {
  ROUTE_HANDLER,
  ROUTE_METHOD,
  ROUTE_TYPE,
  ROUTES,
} from "@/core/router/type";
import Router from "@/core/router";

/**
 * Matches a route handler based on the provided path and HTTP method, and returns the matched route's handlers and type.
 *
 * This function is designed to find the appropriate route handler for a given request based on the path and HTTP method (e.g., GET, POST).
 * It performs both exact and dynamic path matching.
 *
 * - Exact Matching: The function first checks if there is an exact match between the provided path and any of the registered routes.
 * - Dynamic Matching: If no exact match is found, it checks for dynamic path parameters, such as `/user/[id]`.
 *   Dynamic parameters are represented within square brackets, and the function matches these parts of the path with the corresponding dynamic segments.
 *
 * The matching process occurs in the following order:
 * 1. If the provided path is empty or not a string, an error is thrown.
 * 2. The function checks if any routes are registered for the specified HTTP method.
 * 3. If there is no route registered for the provided method or path, it checks for dynamic path matches.
 * 4. If no matching route is found, it returns `null`.
 * 5. If an error occurs during route matching (e.g., invalid path format), a `Jrror` error is thrown.
 *
 * ### Error Handling:
 * - If the `path` is not provided or is an empty string, a `Jrror` with the code `path-empty` is thrown.
 * - If the `path` is not a string, a `Jrror` with the code `path-invalid` is thrown, indicating that the path must be a string.
 * - If there is an issue matching the route or any other error occurs, a `Jrror` with the code `match-route-error` is thrown.
 *
 * ### Return Value:
 * - If a route is found that matches the provided path and method, an object is returned containing:
 *    - `handlers`: An array of handler functions associated with the matched route.
 *    - `type`: The type of the route (e.g., GET, POST, etc.).
 * - If no matching route is found, `null` is returned.
 *
 * @param {string} path - The URL path of the request. This can be a static or dynamic path. A dynamic path may contain parameters in the form of `[parameterName]`.
 * @param {ROUTE_METHOD} method - The HTTP method (e.g., GET, POST, etc.) for which to match the route.
 * @param {ROUTES} routesRegistered - The object containing all registered routes and their handlers, grouped by HTTP method (GET, POST, etc.).
 *
 * @returns {Object | null} - If a matching route is found, returns an object with `handlers` (an array of handler functions) and `type` (the route type).
 *                             If no matching route is found, returns `null`.
 *
 * @throws {Jrror} - If an error occurs during route matching:
 *   - `path-empty`: If the path is empty.
 *   - `path-invalid`: If the path is not a string.
 *   - `match-route-error`: If an error occurs during the route matching process.
 */
export default function matchRoute(
  path: string,
  method: ROUTE_METHOD,
  routesRegistered: ROUTES
): {
  handlers: ROUTE_HANDLER[];
  type: ROUTE_TYPE;
} | null {
  try {
    // If path is empty or is not string, throw an error
    if (!path) {
      throw new Jrror({
        code: "path-empty",
        message: "Path cannot be empty",
        type: "error",
      });
    } else if (typeof path !== "string") {
      throw new Jrror({
        code: "path-invalid",
        message: `Path must be of type string but got ${typeof path}`,
        type: "error",
      });
    }

    // If no routes are registered, return null
    if (!Router.routes) {
      return null;
    }

    // Get all routes with the provided method (e.g., GET, POST)
    const routes = routesRegistered[method];
    if (!routes) {
      return null;
    }

    // Check if the route is registered with the exact path
    const route = routes[path];
    if (route) {
      return route;
    }

    // If no exact match, check if the route is registered with dynamic parameters
    const pathParts = path.split("/");
    const keys = Object.keys(routes);

    for (const key of keys) {
      const route = routes[key];
      const routeParts = key.split("/");

      // If the number of segments in the path and route don't match, skip this route
      if (pathParts.length !== routeParts.length) {
        continue;
      }

      let match = true;

      // Compare each segment in the path and route
      for (let i = 0; i < pathParts.length; i++) {
        if (routeParts[i] === pathParts[i]) {
          continue;
        }

        // If the route part is dynamic (e.g., [id]), skip it
        if (
          routeParts[i].startsWith("[") &&
          routeParts[i].endsWith("]") &&
          routeParts[i].length > 2
        ) {
          continue;
        }

        // If no match is found, set match to false
        match = false;
        break;
      }

      // If the route matches, return the route
      if (match) {
        return route;
      }
    }

    // If no route matched, return null
    return null;
  } catch (e) {
    console.error(e);
    throw new Jrror({
      code: "match-route-error",
      message: `Error while matching the route. path: ${path}`,
      type: "error",
    });
  }
}
