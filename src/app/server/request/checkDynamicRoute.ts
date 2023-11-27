import fs, { Dirent } from "fs";
import chalk from "chalk";
import { Config } from "../config/loadConfig.js";
/**
 *
 * Function to check if folder handling dynamic routes exists or not
 *
 * @param baseFolder - The path of base folder of dynamic route
 * @param urlFolderElement - The name of folder that is serving dynamic route
 * @returns {boolean} - Boolean : true if route exists, false if route doesnot exist
 */

async function checkDynamicRoute(
  baseFolder: string,
  urlFolderElement: string
): Promise<boolean> {
  try {
    let result;
    // read all directories inside baseFolder
    const directories = await fs.promises.readdir(baseFolder, {
      withFileTypes: true,
    });
    // check if [dynamic_route] folder exists in the baseFolder
    const subDirectory: Dirent[] = directories.filter((sub) => {
      return sub.isDirectory() && sub.name === `[${urlFolderElement}]`;
    });
    // return true if folder to handle dynamic route exists; else return false
    if (subDirectory.length > 0) {
      result = true;
    } else {
      result = false;
    }
    return result;
  } catch (error) {
    // getting config data from Config class
    const configData = Config.configData;
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    return false;
  }
}
export default checkDynamicRoute;
