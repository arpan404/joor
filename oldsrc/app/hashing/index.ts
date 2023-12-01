import chalk from "chalk";
import { JOORCONFIG } from "../../types/app/index.js";
import { Config } from "../../../src/app/config/index.js";

// Class to handle all encryption and verification of passwords, and other data.
// This class should be accessible to user

export default class Hash {
  // private variable to hold config data to use in server & initiated as null
  private static configData: JOORCONFIG | null = null;

  //async public method to encrypt the plainText and return the encryptedText if encryption is successful.
  // This should return false if encryption is failed.
  // This method
  public static async encrypt(plainText: string): Promise<string | boolean> {
    //getting config data from config file
    this.configData = await Config.get();
    //checking if config data is present or not, and return false if loading of config data fails
    if (this.configData !== null) {
      try {
        let saltRounds = this.configData?.saltRounds!;
        //checking if saltRounds is present or not and setting it to 10 if not present or its value is not acceptable
        if (!saltRounds || saltRounds < 4 || saltRounds > 31) saltRounds = 10;

        // hashing and returning encrypted text
        const encryptedText = await Bun.password.hash(plainText, {
          algorithm: "bcrypt",
          cost: saltRounds,
        });
        return encryptedText;
      } catch (error) {
        // returning false if encryption is failed
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

  // async public method to verify the plainText with the encryptedText
  // This method should return 'true', only if given plainText and encryptedText are same.
  // This method should return 'false', if given plainText and encryptedText are not same or there is some error while verifying the given encrypted and normal text
  public static async verify(
    normalText: string,
    encryptedText: string
  ): Promise<boolean> {
    try {
      const isValid = await Bun.password.verify(normalText, encryptedText);
      if (isValid) return true;
      return false;
    } catch (error) {
      // Catching all the errors and displaying them to the user only if doLogs is true in joor.config.json
      if (this.configData?.doLogs) {
        console.log(chalk.redBright(error));
      }
      return false;
    }
  }
}
