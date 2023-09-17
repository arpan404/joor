import path from "path";
import chalk from "chalk";
import { JOORCONFIG } from "../../../types/app/index.js";
export class Config {
  private static configFile: string = "joor.config.json";
  public static configData: JOORCONFIG | null = null;
  public static async load() {
    if (this.configData === null) {
      try {
        const configPath = path.resolve(process.cwd(), this.configFile);
        this.configData = (await Bun.file(configPath).json()) as JOORCONFIG;
        console.log(chalk.greenBright("Successfully loaded config file."));
      } catch (error: any) {
        if (error.code === "ENOENT") {
          console.error(
            chalk.red(
              `Error: The configuration file '${this.configFile}' for joor app is not found.\nMake sure the file is in the root directory of your project.`
            )
          );
        } else if (error instanceof SyntaxError) {
          console.error(
            chalk.red(
              `Error: The configuration file '${this.configFile}' for joor app is not in the proper JSON format.\nPlease check the content and ensure it is valid JSON.`
            )
          );
        } else {
          console.error(chalk.red("Error loading config file."), error);
        }
        console.log(
          "For more information, have a look at : " +
            chalk.green("https://joor.xyz/docs/error/configfile")
        );
      }
    }
  }
  public static async get(): Promise<JOORCONFIG | null> {
    if (this.configData === null) {
      await this.load();
    }
    return this.configData;
  }
}
