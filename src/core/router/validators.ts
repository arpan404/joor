import Jrror from "@/error";
import { ROUTE_PATH } from "@/core/router/type";
import JoorResponse from "@/core/response";

function validateRoute(route: ROUTE_PATH) {
  if (typeof route !== "string") {
    throw new Jrror({
      code: "route-invalid",
      message: `Route address must be of type string but got ${typeof route}`,
      type: "error",
    });
  }

  if (route === "") {
    throw new Jrror({
      code: "route-empty",
      message: `Route cannot be empty. It must be a valid string`,
      type: "error",
    });
  }
}

function validateHandler(handler: () => Promise<JoorResponse>) {
  if (typeof handler !== "function") {
    throw new Jrror({
      code: "handler-invalid",
      message: `Handler must be of type function. But got ${typeof handler}`,
      type: "error",
    });
  }
}

export { validateRoute, validateHandler };
