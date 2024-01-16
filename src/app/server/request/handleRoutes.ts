import {
  END_POINT_DETAIL,
  INTERNAL_FORMATTED_RESPONSE,
  JOORCONFIG,
  RESPONSE,
} from "../../../types/app/index.js";
import { REQUEST } from "../../index.js";
import Marker from "../../misc/marker.js";

/**
 *
 * @param request - Request object
 * @param routeData - Data related to route
 * @returns ResponseObject - Contains status, body, and headers
 */
export default async function handleRoutes(
  request: REQUEST,
  routeData: END_POINT_DETAIL,
  configData: JOORCONFIG
): Promise<INTERNAL_FORMATTED_RESPONSE> {
  try {
    const module = await import(routeData.filePath);
    let data: RESPONSE;
    //if method name is being used as function name to handle request, it must be in small letters
    if (module[request.method!.toLowerCase()]) {
      data = await module[request.method!.toLowerCase()](request);
    } else {
      data = await module.route(request); // default function to handle  route is 'route'
    }
    if (!data) {
      return {
        status: 400,
        body: "Not found",
        headers: { "Content-Type": "text/plain" },
      };
    }
    data.body =
      routeData.type === "api" ? JSON.stringify(data.body) : data.body;
    data.headers = data.headers
      ? data.headers
      : routeData.type === "api"
      ? { "Content-Type": "application/json" }
      : { "Content-Type": "text/html" };

    return {
      status: data.status || 200,
      body: data.body,
      headers: data.headers,
    };
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
    return {
      status: 400,
      body: "Not found",
      headers: { "Content-Type": "text/plain" },
    };
  }
}
