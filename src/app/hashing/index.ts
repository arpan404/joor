import chalk from "chalk";
import { JOORCONFIG } from "../../types/app/index.js";
import { Config } from "../server/config/index.js";
export default class Hash {
  private static configData: JOORCONFIG | null = null;
  public static async encrypt(plainText: string): Promise<string | boolean> {
    this.configData = await Config.get();
    if (this.configData !== null) {
      try {
        let saltRounds = this.configData?.saltRounds!;
        if (!saltRounds || saltRounds < 4 || saltRounds > 31) saltRounds = 10;
        const encryptedText = await Bun.password.hash(plainText, {
          algorithm: "bcrypt",
          cost: saltRounds,
        });
        return encryptedText;
      } catch (error) {
        if (this.configData?.doLogs) {
          console.log(chalk.redBright(error));
        }
        return false;
      }
    } else {
      console.error(chalk.red("Error loading config file."));
      return false;
    }
  }
  public static async verify(
    normalText: string,
    encryptedText: string
  ): Promise<boolean> {
    try {
      const isValid = await Bun.password.verify(normalText, encryptedText);
      if (isValid) return true;
      return false;
    } catch (error) {
      if (this.configData?.doLogs) {
        console.log(chalk.redBright(error));
      }
      return false;
    }
  }
}