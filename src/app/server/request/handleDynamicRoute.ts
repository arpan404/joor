import chalk from "chalk";
import { DYNAMIC_ROUTE_RESPONSE } from "../../../types/app/index.js";
import { Config } from "../config/loadConfig.js";
import checkDynamicRoute from "./checkDynamicRoute.js";

/**
 *
 * @param folder - Absolute path of requested route but in folder style
 * @param fileExtension - Extension of files of the project : ".js" or ".ts"
 * @returns {DYNAMIC_ROUTE_RESPONSE} - The response object of type DYNAMIC_ROUTE_RESPONSE
 *
 *
 * param - folder should be like:
 *
 * /Users/Desktop/joor/app/routes/user/arpan
 *
 * For this, url should be like:
 *
 * http://localhost:8000/user/arpan
 *
 * And folder structure should be like:
 * app/route/[user]/index.ts
 *
 */

async function handleDynamicRoute(
  folder: string,
  fileExtension: ".js" | ".ts"
): Promise<DYNAMIC_ROUTE_RESPONSE> {
  try {
    // Getting param element and dynamic folder path from given folder parameter
    const pathArray: Array<string> = folder.split("/");
    const urlParamElement: string = pathArray.pop()!;
    const urlFolderElement: string = pathArray.pop()!;
    const isFolderAvailable: boolean = await checkDynamicRoute(
      pathArray.join("/"),
      urlFolderElement
    );
    //returning false if no folder is available to handle dynamic route
    if (!isFolderAvailable) {
      return false;
    }
    // getting file path by combining base folder, dynamic folder path and index.ts file
    const fileURL = `${pathArray.join(
      "/"
    )}/[${urlFolderElement}]/index${fileExtension}`;
    const dynamicData: DYNAMIC_ROUTE_RESPONSE = {
      param: urlParamElement,
      baseRoute: urlFolderElement,
      file: fileURL,
    };
    return dynamicData;
  } catch (error) {
    const configData = Config.configData;
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    //returning false if any error occurs
    return false;
  }
}

export default handleDynamicRoute;
