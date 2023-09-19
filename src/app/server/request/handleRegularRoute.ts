import {
  INTERNAL_RESPONSE,
  MIDDLEWARE_RESPONSE,
} from "../../../types/app/index.js";
import handleMiddleWare from "./handleMiddleWare.js";
// Function to handle regular route
// It search for route and middleware files, and returns response.
/**
 * @param {Request} request - The request object
 * @param {string} file - The absolute path to the file
 * @param {".js" | ".ts"} fileExtension - Extensions of the file
 * @returns {Promise<INTERNAL_RESPONSE>} - The response object

 * Use it to get the body of the response, the status code, and other information.
 *
 * @example
 * ```ts
 *   let result: INTERNAL_RESPONSE = await handleRegularRoute(request, file, fileExtension);
 * ```
 */
async function handleRegularRoute(
  request: Request,
  file: string,
  fileExtension: ".js" | ".ts"
): Promise<INTERNAL_RESPONSE> {
  try {
    const module = await import(file);
    let data: INTERNAL_RESPONSE | null = null;
    let httpMethod: string = request.method;
    httpMethod = module[httpMethod] ? httpMethod : httpMethod.toLowerCase();
    httpMethod = module[httpMethod]
      ? httpMethod
      : httpMethod.charAt(0).toUpperCase() + httpMethod.slice(1);
    const middleware: MIDDLEWARE_RESPONSE = await handleMiddleWare(
      request,
      file,
      fileExtension,
      httpMethod
    );
    if (middleware.isMiddleware && middleware.reponse) {
      return {
        success: true,
        response: middleware.reponse,
      };
    }
    if (module[httpMethod]) {
      data = module[httpMethod](request);
    } else {
      data = module.route(request);
    }
    if (data !== null) {
      return data;
    } else {
      return {
        success: false,
        code: "NoResponse",
      };
    }
  } catch (error) {
    return {
      success: false,
      code: "NotFound",
    };
  }
}
export default handleRegularRoute;
