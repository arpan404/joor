import Jrror from "@/error";
import { ROUTES } from "@/core/router/type";

function validateRoute(route: ROUTES["route"]) {
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

function validateHandler(handler: ROUTES["handler"]) {
  if (typeof handler !== "function") {
    throw new Jrror({
      code: "handler-invalid",
      message: `Handler must be of type function. But got ${typeof handler}`,
      type: "error",
    });
  }
}

export { validateRoute, validateHandler };
