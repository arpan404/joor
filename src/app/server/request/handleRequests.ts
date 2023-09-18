import { INTERNAL_RESPONSE, JOORCONFIG } from "types/app/index.js";
import handleRegularRoute from "./handleRegularRoute.js";

// Function to handle the every requests

/*
 * Example function for handling a route
 * @param {Request} req - The request object
 * @returns {RESPONSE} The response object
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
  console.log(result);
  return new Response(result.response?.body);
}
export default handleRequests;
