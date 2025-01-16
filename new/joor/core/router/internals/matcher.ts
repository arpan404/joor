import Jrror from "@/error";
import { ROUTE_HANDLER, ROUTE_METHOD, ROUTE_TYPE } from "@/core/router/type";
import Router from "@/core/router";

async function matchRoute(
  path: string,
  method: ROUTE_METHOD
): Promise<{
  handlers: ROUTE_HANDLER[];
  type: ROUTE_TYPE;
} | null> {
  try {
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
    if (!Router.routes) {
      return null;
    }

    const routes = Router.routes[method];
    if (!routes) {
      return null;
    }

    const route = routes[path];
    if (route) {
      return route;
    }

    const pathParts = path.split("/");
    const keys = Object.keys(routes);
    for (const key of keys) {
      const route = routes[key];
      const routeParts = key.split("/");
      if (pathParts.length !== routeParts.length) {
        continue;
      }

      let match = true;
      for (let i = 0; i < pathParts.length; i++) {
        if (routeParts[i] === pathParts[i]) {
          continue;
        }

        if (
          routeParts[i].startsWith("[") &&
          routeParts[i].endsWith("]") &&
          routeParts[i].length > 2
        ) {
          continue;
        }

        match = false;
        break;
      }

      if (match) {
        return route;
      }
    }

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

export default matchRoute;
