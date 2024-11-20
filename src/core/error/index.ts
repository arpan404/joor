import joorData from "../../data/joor";
import errorList from "../../data/errors";
import { JOOR_ERROR } from "./type";
import chalk from "chalk";

/**
 * Represents a custom error with additional metadata such as error codes and types.
 * Extends the native `Error` class to support structured error handling.
 */
class JoorError extends Error {
  /**
   * The unique code identifying the error.
   * @type {JOOR_ERROR["errorCode"]}
   */
  public errorCode: JOOR_ERROR["errorCode"];

  /**
   * The type of the error (e.g., "warn", "panic", "error").
   * Defines how the error should be handled.
   * @type {JOOR_ERROR["type"]}
   */
  public type: JOOR_ERROR["type"];

  /**
   * The stack trace of the error, captured at the point of instantiation.
   * @type {string | undefined}
   */
  public stackTrace: string | undefined;

  /**
   * Constructs a new `JoorError` instance.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {JOOR_ERROR["message"]} params.message - A descriptive message for the error.
   * @param {JOOR_ERROR["errorCode"]} params.errorCode - A unique identifier for the error.
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

    // Capture stack trace if the environment supports it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JoorError);
    }
    this.stackTrace = this.stack;

    // Set the prototype chain correctly for proper inheritance
    Object.setPrototypeOf(this, JoorError.prototype);
  }
}

/**
 * A specialized error class derived from `JoorError` to handle application-specific errors.
 * Provides additional functionality such as formatting and handling errors based on type.
 */
class Jrror extends JoorError {
  /**
   * Creates a new `Jrror` instance using a predefined error code.
   *
   * @param {JOOR_ERROR["errorCode"]} errorCode - The unique code identifying the error.
   * @throws {Error} If the provided error code is not defined in `errorList`.
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
   * Handles the error based on its type.
   * - For "warn": Logs a warning message to the console.
   * - For "error": Logs the error and stack trace to the console.
   * - For "panic": Logs the error, stack trace, and terminates the process.
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