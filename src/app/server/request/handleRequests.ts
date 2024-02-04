import {
  END_POINTS,
  INTERNAL_FORMATTED_RESPONSE,
  JOORCONFIG,
  REQUEST,
} from "../../../types/app/index.js";
import Marker from "../../misc/marker.js";
import findCurrentRouteData from "../misc/findCurrentRouteData.js";
import serveFiles from "../misc/serveFiles.js";
import handleFileUpload from "../upload/handleFileUpload.js";
import handleRoutes from "./handleRoutes.js";

export default async function handleRequests(
  request: REQUEST,
  configData: JOORCONFIG,
  availableRoutesDetail: END_POINTS,
): Promise<INTERNAL_FORMATTED_RESPONSE> {
  let response: INTERNAL_FORMATTED_RESPONSE | undefined;
  try {
    // uploading files to server directly
    if (request.method === "POST" && configData.allowsFileUpload) {
      await handleFileUpload(request, configData);
    }

    // checking if the route is valid or not
    const currentRouteData = await findCurrentRouteData(
      request,
      availableRoutesDetail,
    );
    // if route is valid; then handling the request using function to handle route
    if (currentRouteData) {
      response = await handleRoutes(request, currentRouteData, configData);
    } else {
      // if route is invalid; checking if any files are available under same url
      const fileSystemResponse = await serveFiles(request.url!, configData);

      //if file exists return data of that file else return 404 error and message
      if (fileSystemResponse && typeof fileSystemResponse !== "boolean") {
        response = fileSystemResponse;
      } else {
        response = {
          status: 400,
          body: "Not found",
          headers: { "Content-Type": "text/plain" },
        };
      }
    }
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
    response = {
      status: 500,
      body: "Internal Server Error",
      headers: { "Content-Type": "text/plain" },
    };
  } finally {
    return response as INTERNAL_FORMATTED_RESPONSE;
  }
}
