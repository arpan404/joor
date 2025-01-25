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
}

export default JoorError;
