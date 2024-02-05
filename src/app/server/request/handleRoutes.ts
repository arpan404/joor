import {
  END_POINT_DETAIL,
  INTERNAL_FORMATTED_RESPONSE,
  JOORCONFIG,
  RESPONSE,
} from "../../../types/app/index.js";
import { REQUEST } from "../../index.js";
import Marker from "../../misc/marker.js";
import formatResponse from "../misc/formatResponse.js";

/**
 *
 * @param request - Request object
 * @param routeData - Data related to route
 * @returns ResponseObject - Contains status, body, and headers
 */
export default async function handleRoutes(
  request: REQUEST,
  routeData: END_POINT_DETAIL,
  configData: JOORCONFIG,
): Promise<INTERNAL_FORMATTED_RESPONSE> {
  try {
    const method = request.method!.toLowerCase();

    let data: RESPONSE;

    let module;

    // Using middleware if it exists
    if (routeData.middlwareFilePath) {
      module = await import(routeData.middlwareFilePath);
      if (module[method]) {
        data = (await module[method](request)) as RESPONSE;
        if (data) {
          return formatResponse(data, routeData.type);
        }
      } else {
        data = (await module.route(request)) as RESPONSE;
        if (data) {
          return formatResponse(data, routeData.type);
        }
      }
    }

    if (routeData.uploadFilePath) {
      module = await import(routeData.uploadFilePath);
      if (module[method]) {
        data = (await module[method](request)) as RESPONSE;
        if (data) {
          return formatResponse(data, routeData.type);
        }
      } else {
        data = (await module.route(request)) as RESPONSE;
        if (data) {
          return formatResponse(data, routeData.type);
        }
      }
    }

    // if method name is being used as function name to in middleware, it must be in small lettersif method name is being used as function name to handle request, it must be in small letters
    if (module[method]) {
      data = (await module[method](request)) as RESPONSE;
    } else {
      data = (await module.route(request)) as RESPONSE; // default function to handle  route is 'route'
    }
    if (!data) {
      return {
        status: 404,
        body: "Not found",
        headers: { "Content-Type": "text/plain" },
      };
    }
    return formatResponse(data, routeData.type);
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
    return {
      status: 500,
      body: "Internal Server Error",
      headers: { "Content-Type": "text/plain" },
    };
  }
}
