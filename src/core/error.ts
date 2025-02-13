import joorData from '@/data/joor';
import logger from '@/helpers/joorLogger';
import marker from '@/packages/marker';
import { JOOR_ERROR } from '@/types/error';

/**
 * Custom class with additional metadata such as error code, message and type.
 * Extends the native `Error` class to support structured error handling
 */
class JoorError extends Error {
  /**
   * The unique code indentifying the error
   * @type number
   */
  public errorCode: JOOR_ERROR['code'];

  /**
   * The type of error
   * @type "warn"|"error"|"panic"
   */
  public type: JOOR_ERROR['type'];

  /**
   * The path to the documentation for the error
   * @type string
   */
  public docsPath: JOOR_ERROR['docsPath'];

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
    docsPath,
  }: {
    message: JOOR_ERROR['message'];
    errorCode: JOOR_ERROR['code'];
    type: JOOR_ERROR['type'];
    docsPath?: JOOR_ERROR['docsPath'];
  }) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.type = type;
    this.docsPath = docsPath;
    // Capture stack trace if the environment supports it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JoorError);
    }
    this.stackTrace = this.stack;
    // Set the prototype chain correctly for proper inheritance
    Object.setPrototypeOf(this, JoorError.prototype);
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

    if (this.type === 'warn') {
      logger.warn(errorMessage);
    } else if (this.type === 'error') {
      logger.error(`${errorMessage}\nStack Trace:\n${this.stackTrace}`);
    } else if (this.type === 'panic') {
      logger.error(`${errorMessage}\nStack Trace:\n${this.stackTrace}`);
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
    const docLink = `${joorData.docs}/${joorData.docsVersion}${this.docsPath}?error=${this.errorCode}`;

    return `
              Error Code: ${this.errorCode}
              Message: ${this.message}
              ${marker.greenBright(
                'For more information, visit:'
              )} ${marker.bgGreenBright.whiteBright(docLink)}
              `;
  }
}

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
 */

class Jrror extends JoorError {
  constructor(errorData: JOOR_ERROR) {
    // Validate the error data provided when creating the instance of Jrror class
    if (!errorData?.code || !errorData.message || !errorData.type) {
      // Throws error code joor-e1 if errorData is not provided, e2 if code is not provided, e3 if message is not provided, e4 if type is not provided
      throw new Jrror({
        message: `Instance of Jrror has been created without passing required data. 
              Missing: ${
                !errorData
                  ? 'errorData'
                  : !errorData.code
                    ? 'error code'
                    : !errorData.message
                      ? 'message'
                      : 'type'
              }`,
        code: `jrror-${
          !errorData
            ? 'e1'
            : !errorData.code
              ? 'e2'
              : !errorData.message
                ? 'e3'
                : 'e4'
        }`,
        type: 'error',
      });
    }
    super({
      errorCode: errorData.code,
      message: errorData.message,
      type: errorData.type,
      docsPath: errorData.docsPath ?? '/',
    });
  }
}

export { JoorError };
export default Jrror;
