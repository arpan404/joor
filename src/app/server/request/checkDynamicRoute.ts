import fs, { Dirent } from "fs";
import chalk from "chalk";
import { Config } from "../config/loadConfig.js";
async function checkDynamicRoute(
  baseFolder: string,
  urlFolderElement: string
): Promise<boolean> {
  const configData = Config.configData;
  try {
    let result;
    const directories = await fs.promises.readdir(baseFolder, {
      withFileTypes: true,
    });
    const subDirectory: Dirent[] = directories.filter((sub) => {
      return sub.isDirectory() && sub.name === `[${urlFolderElement}]`;
    });
    if (subDirectory.length > 0) {
      result = true;
    } else {
      result = false;
    }
    return result;
  } catch (error) {
    if (configData?.doLogs) {
      console.log(chalk.redBright(error));
    }
    return false;
  }
}
export default checkDynamicRoute;
