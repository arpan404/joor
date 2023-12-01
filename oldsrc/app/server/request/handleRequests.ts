import chalk from "chalk";
import {
  DYNAMIC_ROUTE_RESPONSE,
  INTERNAL_RESPONSE,
  JOORCONFIG,

} from "../../../types/app/index.js";
import { Config } from "../../../../src/app/config/loadConfig.js";
import handleDynamicRoute from "./handleDynamicRoute.js";
import handleRegularRoute from "./handleRegularRoute.js";
import http from "http";

// Function to handle the every requests

/** This function is used to handle the every requests made to the Joor server.
 * @param {http.IncomingMessage} request - The request object
 * @returns {RESPONSE_TO_SEND}- The response object
 */
async function handleRequests(
  request: http.IncomingMessage,
  configData: JOORCONFIG
): Promise<RESPONSE_TO_SEND> {
  try {
    // getting the path name from the url
    const url: URL = new URL(request.url!);
    const pathName: string = url.pathname.slice(1);
    const rootFolder = "/app/routes/";
    let folder = process.cwd() + rootFolder + pathName;
    const fileExtension = configData.language === "js" ? ".js" : ".ts";
    const file = folder + "/index" + fileExtension;
    const type = "api";
    let result: INTERNAL_RESPONSE = await handleRegularRoute(
      request,
      file,
      fileExtension
    );
    if (result.success) {
      if (result.response === undefined) {
        return {
          code: 404,
          body: "Not found",
          header: "text/plain",
        };
      }
      return {
        code: 200,
        body: result.response?.body || "",
        header:
          type === "api"
            ? "application/json"
            : type === "web"
            ? "text/html"
            : "text/text",
      };
      // return new Response('{messa:"aaa"}');
    }
    const dynamicRoute: DYNAMIC_ROUTE_RESPONSE = await handleDynamicRoute(
      folder,
      fileExtension
    );
    if (!dynamicRoute) {
      return {
        code: 404,
        body: "Not found",
        header: "text/plain",
      };
    }
    const dynamicRouteResponseData: INTERNAL_RESPONSE =
      await handleRegularRoute(request, dynamicRoute.file, fileExtension);
    if (dynamicRouteResponseData.success) {
      if (dynamicRouteResponseData.response === undefined) {
        return {
          code: 404,
          body: "Not found",
          header: "text/plain",
        };
      }
      return new Response(dynamicRouteResponseData.response?.body, {
        status: dynamicRouteResponseData.response?.status || 200,
      });
      return {
        code: 200,
        body: dynamicRouteResponseData,
        header: "text/plain",
      };
    }
    return new Response(dynamicRouteResponseData.response?.body, {
      status: dynamicRouteResponseData.response?.status || 200,
    });
  } catch (error) {
    const configData = Config.configData;
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    if (configData?.mode === "production") {
      return {
        code: 404,
        body: "Not found",
        header: "text/plain",
      };
    }
    return {
      code: 505,
      body: "Internal Server Error",
      header: "text/plain",
    };
  }
}
export default handleRequests;
