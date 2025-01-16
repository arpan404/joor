import path from "path";
import fs from "fs";
import chalk from "chalk";
import joorData from "@/data/joor";
import JOOR_CONFIG from "./type";
import Jrror from "@/error";

/**
 * Class to handle application configuration files.
 *
 * This class provides methods to load and access configuration data from a file.
 * It ensures that configuration is loaded only once and throws custom errors in case of issues.
 *
 * @example
 * const config = new Configuration()
 * const configData = config.getConfig()
 * console.log(configData)
 */
class Configuration {
  /**
   * The relative path to the configuration file.
   * @type {string}
   * @private
   */
  private static configFile: string = joorData.configFile;

  /**
   * The loaded configuration data.
   * Null if the configuration has not yet been loaded.
   * @type {JOOR_CONFIG | null}
   * @private
   */
  private static configData: JOOR_CONFIG | null = null;

  /**
   * Loads the configuration file and parses its contents.
   *
   * This method reads the configuration file, parses it as JSON, and stores the result
   * in `Configuration.configData`. It ensures that the configuration is only loaded once.
   *
   * @throws {Jrror} Throws:
   * @private
   */
  private async loadConfig(): Promise<void> {
    if (Configuration.configData !== null) {
      throw new Jrror({
        code: "config-loaded-already",
        message:
          "The configuration data is already loaded. Attempting to load it again is not recommended",
        type: "warn",
      });
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
        throw new Jrror({
          code: "config-not-found",
          message: `Error: The configuration file '${joorData.configFile}' for Joor app is not found.\nMake sure the file is in the root directory of your project.`,
          type: "panic",
        });
      } else if (error instanceof SyntaxError) {
        throw new Jrror({
          code: "config-invalid-json",
          message: `Error: The configuration file '${joorData.configFile}' for Joor app is not in the proper JSON format.\nPlease check the content and ensure it is valid JSON.`,
          type: "panic",
        });
      } else {
        console.error(error);
        throw new Jrror({
          code: "config-load-failed",
          message: `Error occured while loading the configuration file.`,
          type: "panic",
        });
      }
    }
  }

  /**
   * Retrieves the configuration data.
   *
   * If the configuration data has not been loaded, it calls `loadConfig` to load it.
   *
   * @returns {Promise<JOOR_CONFIG>} The configuration data.
   * @throws {Jrror} Throws "config-p3" if configuration loading fails unexpectedly.
   * @protected
   */
  public async getConfig(): Promise<JOOR_CONFIG> {
    if (Configuration.configData === null) {
      await this.loadConfig();
      if (Configuration.configData === null) {
        throw new Jrror({
          code: "config-load-failed",
          message: `Error occured while loading the configuration data from ${joorData.configFile}.`,
          type: "panic",
        });
      }
    }
    return Configuration.configData;
  }
}

export default Configuration;
