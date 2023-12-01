import chalk from "chalk";
import { MIDDLEWARE_RESPONSE, RESPONSE } from "../../../types/app/index.js";
import { Config } from "../../../../src/app/config/loadConfig.js";
import http from "http";
import fs from "fs";
/**
 *
 * @param request - The request object
 * @param file - Absolute path of the file which is in same directory as the middleware file
 * @param fileExtension - Extension of the files of the projects
 * @param httpMethod - Name of http method of the request
 * @return {MIDDLEWARE_RESPONSE} - The middleware response object
 * */
async function handleMiddleWare(
  request: http.IncomingMessage,
  file: string,
  fileExtension: ".js" | ".ts",
  httpMethod: string
): Promise<MIDDLEWARE_RESPONSE> {
  try {
    // check if the middleware file exists or not in the same folder of the route file i.e index.ts
    const pathArray: Array<string> = file.split("/");
    pathArray.pop();
    const middlewareFile: string =
      pathArray.join("/") + "middleware" + fileExtension;
    //if no middleware files found return
   
await fs.promises.access(middlewareFile)
    // importing the middleware file
    const middleware = await import(middlewareFile);
    let data: RESPONSE | undefined = undefined;
    //checking if the middleware has the function with same name as the http method or not
    if (middleware[httpMethod]) {
      // getting return value of the function with same name as the http method from middlware file
      data = await middleware[httpMethod](request);
    } else {
      // getting return value of the route function from middlware file
      data = await middleware.route(request);
    }
    // returning return value of function from middleware file
    return {
      isMiddleware: true,
      reponse: data,
    };
  } catch (error) {
    const configData = Config.configData;
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    //returning return value such that no middleware file exists if any error occurs
    return {
      isMiddleware: false,
      reponse: undefined,
    };
  }
}
export default handleMiddleWare;
