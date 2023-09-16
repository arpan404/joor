import chalk from "chalk";
import { Config } from "../server/config";
import { JOORCONFIG } from "../types";

export default class Hash {
  private static configData: JOORCONFIG | null = Config.configData;
  public static async encrypt(plainText: string): Promise<string | boolean> {
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
