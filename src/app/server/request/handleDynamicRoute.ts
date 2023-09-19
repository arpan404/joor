import chalk from "chalk";
import { DYNAMIC_ROUTE_RESPONSE } from "../../../types/app/index.js";
import { Config } from "../config/loadConfig.js";
import checkDynamicRoute from "./checkDynamicRoute.js";

async function handleDynamicRoute(
  folder: string,
  fileExtension: ".js" | ".ts"
): Promise<DYNAMIC_ROUTE_RESPONSE> {
  const configData = Config.configData;
  try {
    const pathArray: Array<string> = folder.split("/");
    const urlParamElement: string = pathArray.pop()!;
    const urlFolderElement: string = pathArray.pop()!;
    const isFolderAvailable: boolean = await checkDynamicRoute(
      pathArray.join("/"),
      urlFolderElement
    );
    if (!isFolderAvailable) {
      return false;
    }
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
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    return false;
  }
}

export default handleDynamicRoute;