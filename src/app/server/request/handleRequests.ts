import {
  DYNAMIC_ROUTE_RESPONSE,
  INTERNAL_RESPONSE,
  JOORCONFIG,
} from "../../../types/app/index.js";
import handleDynamicRoute from "./handleDynamicRoute.js";
import handleRegularRoute from "./handleRegularRoute.js";

// Function to handle the every requests

/** This function is used to handle the every requests made to the Joor server.
 * @param {Request} request - The request object
 * @returns {RESPONSE}- The response object
 */
async function handleRequests(
  request: Request,
  configData: JOORCONFIG
): Promise<Response> {
  // getting the path name from the url
  const url: URL = new URL(request.url);
  const pathName: string = url.pathname.slice(1);
  const rootFolder = "/app/routes/";
  let folder = process.cwd() + rootFolder + pathName;
  const fileExtension = configData.language === "js" ? ".js" : ".ts";
  const file = folder + "/index" + fileExtension;
  let result: INTERNAL_RESPONSE = await handleRegularRoute(
    request,
    file,
    fileExtension
  );
  if (result.success) {
    if (result.response === undefined) {
      return new Response("Route not found", { status: 404 });
    }
    return new Response(result.response?.body, {
      status: result.response?.status || 200,
    });
  }
  const dynamicRoute: DYNAMIC_ROUTE_RESPONSE = await handleDynamicRoute(
    folder,
    fileExtension
  );
  if (!dynamicRoute) {
    return new Response("Route not found", { status: 404 });
  }
  const dynamicRouteResponseData: INTERNAL_RESPONSE = await handleRegularRoute(
    request,
    dynamicRoute.file,
    fileExtension
  );
  if (dynamicRouteResponseData.success) {
    if (dynamicRouteResponseData.response === undefined) {
      return new Response("Route not found", { status: 404 });
    }
    return new Response(dynamicRouteResponseData.response?.body, {
      status: dynamicRouteResponseData.response?.status || 200,
    });
  }
  return new Response(dynamicRouteResponseData.response?.body, {
    status: dynamicRouteResponseData.response?.status || 200,
  });
}
export default handleRequests;
