import joorData from "../../data/joor";
import errorList from "./list";
import { JOOR_ERROR } from "./type";
import chalk from "chalk";

/**
 * A custom error class that extends the built-in `Error` class, adding specific properties
 * such as `errorCode` and `type` for enhanced error handling.
 */
class JoorError extends Error {
  /**
   * The error code associated with this error.
   * @type {JOOR_ERROR["errorCode"]}
   */
  public errorCode: JOOR_ERROR["errorCode"];

  /**
   * The type of the error (e.g., "warn", "panic", "error").
   * @type {JOOR_ERROR["type"]}
   */
  public type: JOOR_ERROR["type"];

  /**
   * Creates a new `JoorError` instance.
   *
   * @param {Object} params - The parameters for the error.
   * @param {JOOR_ERROR["message"]} params.message - A descriptive message for the error.
   * @param {JOOR_ERROR["errorCode"]} params.errorCode - A unique code identifying the error.
   * @param {JOOR_ERROR["type"]} params.type - The type of the error (e.g., "warn", "panic").
   */
  constructor({
    message,
    errorCode,
    type,
  }: {
    message: JOOR_ERROR["message"];
    errorCode: JOOR_ERROR["errorCode"];
    type: JOOR_ERROR["type"];
  }) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.type = type;

    // Ensures the prototype chain is set correctly when extending `Error`
    Object.setPrototypeOf(this, JoorError.prototype);
  }
}

/**
 * A specialized error class that extends `JoorError` to provide additional functionality,
 * such as handling and formatting error messages.
 */
class Jrror extends JoorError {
  /**
   * Creates a new `Jrror` instance based on a predefined error code.
   *
   * @param {JOOR_ERROR["errorCode"]} errorCode - A unique code identifying the error.
   * @throws {Error} Throws an error if the provided `errorCode` is not defined in `errorList`.
   */
  constructor(errorCode: JOOR_ERROR["errorCode"]) {
    const errorInfo = errorList[errorCode];

    if (!errorInfo) {
      throw new Error(`Error code ${errorCode} is not defined in errorList.`);
    }

    super({
      errorCode: errorCode,
      message: errorInfo.message,
      type: errorInfo.type,
    });
  }

  /**
   * Handles the error based on its type, displaying appropriate messages and taking actions.
   *
   * - Logs a warning if the type is "warn".
   * - Logs an error if the type is "error".
   * - Logs an error and exits the process if the type is "panic".
   */
  public handle(): void {
    const errorMessage = this.formatMessage(this);

    if (this.type === "warn") {
      console.warn(chalk.yellowBright(errorMessage));
    } else if (this.type === "error") {
      console.error(chalk.redBright(errorMessage));
    } else if (this.type === "panic") {
      console.error(chalk.redBright(errorMessage));
      process.exit(1);
    }
  }

  /**
   * Formats the error message for display, including a link to documentation.
   *
   * @private
   * @param {Jrror} jrror - The `Jrror` instance to format.
   * @returns {string} The formatted error message.
   */
  private formatMessage(jrror: Jrror): string {
    return (
      `Error Code : ${jrror.errorCode}\nMessage : ${jrror.message}\n` +
      chalk.greenBright(
        `For more information, have a look at :` +
          chalk.bgGreenBright.whiteBright(
            `${joorData.docs}/${joorData.docsVersion}/errors?errorCode=${jrror.errorCode}`
          )
      )
    );
  }
}

export default Jrror;
