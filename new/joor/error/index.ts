import joorData from "@/data/joor";
import JoorError from "@/error/JoorError";
import { JOOR_ERROR } from "@/error/type";
import chalk from "chalk";

/**
 * Class to work with errors
 *
 * @example
 * ```typescript
 * // Throwing an error
 * throw new Jrror({code:"config-p1",
 * message: `Error: The configuration file '${joorData.configFile}' for Joor app is not found.\nMake sure the file is in the root directory of your project.`,
 * type: "panic"
 * })
 *
 * // Handling the thrown error
 * try{
 * ...
 * }
 * catch(error:unknown){
 *    if (error instanceof Jrror){
 *          if (error.type !=="warn"){
 *              error.handle() // Call this method to log and handle the error based on its type
 *          }
 *          else{
 *              error.reject() // Call this method to reject the error
 *          }
 *    }
 * }
 *
 *
 *
 */

class Jrror extends JoorError {
  constructor(errorData: JOOR_ERROR) {
    // Validate the error data provided when creating the instance of Jrror class
    if (
      !errorData ||
      !errorData.code ||
      !errorData.message ||
      !errorData.type
    ) {
      // Throws error code joor-e1 if errorData is not provided, e2 if code is not provided, e3 if message is not provided, e4 if type is not provided
      throw new Jrror({
        message: `Instance of Jrror has been created without passing required data. 
              Missing: ${
                !errorData
                  ? "errorData"
                  : !errorData.code
                  ? "error code"
                  : !errorData.message
                  ? "message"
                  : "type"
              }`,
        code: `jrror-${
          !errorData
            ? "e1"
            : !errorData.code
            ? "e2"
            : !errorData.message
            ? "e3"
            : "e4"
        }`,
        type: "error",
      });
    }
    super({
      errorCode: errorData.code,
      message: errorData.message,
      type: errorData.type,
    });
  }

  /**
   * Method to handle the error by logging it to the console
   * If the type of error thrown is `panic`, using `handle` method will cause the program to stop
   *  @example
   * ```typescript
   * try{
   * ...
   * }
   * catch(error:unknown){
   *    if (error instanceof Jrror){
   *        error.handle()
   *    }
   * }
   *
   */
  public handle(): void {
    const errorMessage = this.formatMessage();

    if (this.type === "warn") {
      console.warn(chalk.yellowBright(errorMessage));
    } else if (this.type === "error") {
      console.error(chalk.redBright(errorMessage));
      console.error(chalk.blueBright(`Stack Trace:\n${this.stackTrace}`));
    } else if (this.type === "panic") {
      console.error(chalk.redBright(errorMessage));
      console.error(chalk.blueBright(`Stack Trace:\n${this.stackTrace}`));
      process.exit(1);
    }
  }

  /**
   * Method to reject the error by not logging it console
   * @example
   * ```typescript
   * try{
   * ...
   * }
   * catch(error:unknown){
   *    if (error instanceof Jrror){
   *        error.reject()
   *    }
   * }
   *
   */
  public reject(): void {
    return;
  }
  /**
   * Formats the error message for user-friendly display, including the error code, message, and a link to documentation.
   *
   * @returns {string} The formatted error message.
   */
  private formatMessage(): string {
    const docLink = `${joorData.docs}/${joorData.docsVersion}/errors?errorCode=${this.errorCode}`;
    return `
          Error Code: ${this.errorCode}
          Message: ${this.message}
          ${chalk.greenBright(
            "For more information, visit:"
          )} ${chalk.bgGreenBright.whiteBright(docLink)}
          `;
  }
}

export default Jrror;
