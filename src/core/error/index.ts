import joorData from "../../data/joor";
import JoorError from "./JoorError";
import { JOOR_ERROR } from "./type";
import chalk from "chalk";

/**
 * Class to work with errors
 *
 * @example
 * ```typescript
 * // Throwing an error
 * throw new Jrror({errorCode:"config-p1",
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
      !errorData.errorCode ||
      !errorData.message ||
      !errorData.type
    ) {
      throw new Jrror({
        message: `Instance of Jrror has been created without passing required data. 
            Missing: ${
              !errorData
                ? "errorData"
                : !errorData.errorCode
                ? "errorCode"
                : !errorData.message
                ? "message"
                : "type"
            }`,
        errorCode: `jrror-${
          !errorData
            ? "e1"
            : !errorData.errorCode
            ? "e2"
            : !errorData.message
            ? "e3"
            : "e4"
        }`,
        type: "error",
      });
    }
    super({
      errorCode: errorData.errorCode,
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
    const errorMessage = this.formatMessage(this);

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
   * Formats the error message for user-friendly display.
   * Includes the error code, message, and a link to documentation.
   *
   * @private
   * @param {Jrror} jrror - The `Jrror` instance to format.
   * @returns {string} The formatted error message.
   */
  private formatMessage(jrror: Jrror): string {
    const docLink = `${joorData.docs}/${joorData.docsVersion}/errors?errorCode=${jrror.errorCode}`;
    return `
        Error Code: ${jrror.errorCode}
        Message: ${jrror.message}
        ${chalk.greenBright(
          "For more information, visit:"
        )} ${chalk.bgGreenBright.whiteBright(docLink)}
        `;
  }
}

export default Jrror;
