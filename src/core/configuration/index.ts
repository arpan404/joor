import path from "path";
import fs from "fs";
import chalk from "chalk";
import joorData from "../../data/joor";
import Jrror from "../error";
import JOOR_CONFIG from "./type";

/**
 * Class to work with configuration file.
 *
 * @example
 * const config = Configuration.getConfig();
 * console.log(config.port);
 *
 *
 */

class Configuration {
  private static configFile: string = joorData.configFile;
  private static configData: JOOR_CONFIG | null = null;

  private async loadConfig(): Promise<void> {
    if (Configuration.configData !== null) {
      throw new Jrror("config-1");
    }
    try {
      const configPath = path.resolve(process.cwd(), Configuration.configFile);
      Configuration.configData = (await JSON.parse(
        fs.readFileSync(configPath, "utf8")
      )) as JOOR_CONFIG;
      console.log(
        chalk.greenBright("Configurations have been loaded successfully")
      );
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Jrror("config-p1");
      } else if (error instanceof SyntaxError) {
        throw new Jrror("config-p2");
      } else {
        console.error(error);
        throw new Jrror("config-p3");
      }
    }
  }

  protected async getConfig(): Promise<JOOR_CONFIG> {
    if (Configuration.configData === null) {
      await this.loadConfig();
      if (Configuration.configData === null) {
        throw new Jrror("config-p3");
      }
    }
    return Configuration.configData;
  }
}

export default Configuration;
