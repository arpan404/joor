import { JoorRequest } from "@/core/request/type";
import JoorResponse from "@/core/response";
import { INTERNAL_RESPONSE } from "@/core/response/type";
import Router from "@/core/router";
import matchRoute from "@/core/router/internals/matcher";
import { ROUTE_METHOD } from "@/core/router/type";
import Jrror from "@/error";

async function routeHandler(
  pathURL: string,
  request: JoorRequest
): Promise<INTERNAL_RESPONSE> {
  try {
    let method = request.method as ROUTE_METHOD;
    if (method) method = method?.toUpperCase() as ROUTE_METHOD;
    const routeDetail = matchRoute(pathURL, method, Router.routes);
    if (!routeDetail) {
      const response = new JoorResponse();
      response.setStatus(404).setMessage("Not Found");
      return response.parseResponse();
    }
    const handlers = routeDetail.handlers;
    let response = new JoorResponse();
    for (const handler of handlers) {
      response = await handler();
      if (response) {
        return response.parseResponse();
      }
    }
    throw new Jrror({
      code: "handler-return-undefined",
      message:
        "All route handlers returned undefined. At least, one must return a response.",
      type: "error",
    });
  } catch (e) {
    console.error(e);
    const response = new JoorResponse();
    response.setStatus(500).setMessage("Internal Server Error");
    return response.parseResponse();
  }
}

export default routeHandler;
