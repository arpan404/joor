import fs from 'node:fs';
import * as nodePath from 'node:path';

import marker from '@/packages/marker';
import {
  LOGGER_CONFIG,
  LOGGER_TIMESTAMP,
  LOGGER_MESSAGE,
  LOGGER_MESSAGE_TO_LOG,
  LOGGER_LEVEL,
  LOGGER_FORMAT_CALLBACK,
} from '@/types/logger';

/**
 * A logger class that provides functionality for logging messages both to the console and to a file.
 * It supports different log levels such as INFO, WARN, ERROR, and DEBUG.
 * The logger can be customized with a configuration object that defines the logger name, file path,
 * and a callback function to format the log messages.
 *
 * @example
 * ```typescript
 * const logger = new Logger({
 *   name: 'api.logger',
 *   path: 'logs.log',
 *   formatCallBack: (timestamp, message) => `${timestamp}: ${message}`
 * });
 *
 * logger.info('This is an info message');
 * logger.error('This is an error message');
 * logger.warn('This is a warning message');
 * logger.debug('This is a debug message');
 * ```
 *
 * **Custom Formatting:**
 * You can customize the timestamp and message format by providing a `formatCallBack` function.
 * The logger will add the log level and logger name to the formatted message before logging it.
 */
class Logger {
  constructor({ name, path, formatCallBack }: LOGGER_CONFIG) {
    this.name = name ?? this.name; // Set logger name, default is 'logger'
    this.path = path ?? this.path; // Set log file path, default is 'logs.log' in current directory
    this.formatCallBack = formatCallBack ?? this.formatCallBack; // Custom format callback, default is basic timestamped message
  }

  // Default configuration for the logger
  private name = 'logger'; // Default logger name
  private path = nodePath.resolve(process.cwd(), 'logs.log'); // Default path for the log file
  private formatCallBack: LOGGER_FORMAT_CALLBACK = (
    timestamp: LOGGER_TIMESTAMP,
    message: LOGGER_MESSAGE
  ) => `${timestamp}: ${message}`; // Default format callback to prepend timestamp

  /**
   * Format the message to be logged to the console with appropriate log level markers.
   *
   * @param {LOGGER_LEVEL} level - The log level (INFO, WARN, ERROR, DEBUG).
   * @param {LOGGER_MESSAGE_TO_LOG} message - The message to be logged.
   * @returns {LOGGER_MESSAGE_TO_LOG} - The formatted message string to be displayed in the console.
   */
  private formatConsoleMessage(
    level: LOGGER_LEVEL,
    message: LOGGER_MESSAGE_TO_LOG
  ): LOGGER_MESSAGE_TO_LOG {
    let formattedMessage: string;

    switch (level) {
      case 'INFO':
        formattedMessage = `${marker.bgGreenBright(' INFO ')} '${this.name}' - ${message}`;
        break;
      case 'WARN':
        formattedMessage = `${marker.bgYellowBright(' WARN ')} '${this.name}' - ${message}`;
        break;
      case 'ERROR':
        formattedMessage = `${marker.bgRedBright(' ERROR ')} '${this.name}' - ${message}`;
        break;
      case 'DEBUG':
        formattedMessage = `${marker.bgBlueBright(' DEBUG ')} '${this.name}' - ${message}`;
        break;
      default:
        formattedMessage = `${marker.bgGreenBright(' INFO ')} '${this.name}' - ${message}`;
        break;
    }

    return formattedMessage;
  }

  /**
   * Format the message to be logged to the file.
   * The format includes the log level, logger name, and message.
   *
   * @param {LOGGER_LEVEL} level - The log level (INFO, WARN, ERROR, DEBUG).
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   * @returns {LOGGER_MESSAGE_TO_LOG} - The formatted message string to be written to the file.
   */
  private formatLogMessage(
    level: LOGGER_LEVEL,
    message: LOGGER_MESSAGE
  ): LOGGER_MESSAGE_TO_LOG {
    return `${level} '${this.name}' - ${message}\n`; // Returns formatted log message for the file
  }

  /**
   * Write the formatted log message to the file.
   * This method appends the log message to the log file specified in the configuration.
   *
   * @param {LOGGER_MESSAGE_TO_LOG} message - The message to be written to the log file.
   */
  private writeLog(message: LOGGER_MESSAGE_TO_LOG): void {
    fs.promises.appendFile(this.path, message).catch((error: unknown) => {
      // If writing the log file fails, log the error to the console with a formatted message
      console.error(
        this.formatConsoleMessage(
          'ERROR',
          `Failed to write log to file: ${error}`
        )
      );
    });
  }

  /**
   * Logs the message to both the console and the log file.
   *
   * @param {LOGGER_LEVEL} level - The log level (INFO, WARN, ERROR, DEBUG).
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  private logMessage(level: LOGGER_LEVEL, message: LOGGER_MESSAGE): void {
    const consoleMessage = this.formatConsoleMessage(level, message); // Format message for the console
    const messageToLogInFile = this.formatLogMessage(level, message); // Format message for the file
    const consoleMode = level.toLowerCase() as
      | 'info'
      | 'warn'
      | 'error'
      | 'debug'; // Dynamically map level to corresponding console method
    console[consoleMode](consoleMessage); // Log message to console
    setImmediate(() => this.writeLog(messageToLogInFile)); // Write message to log file using setInterval to use non-blocking I/O
  }

  /**
   * Logs an INFO level message to both the console and the log file.
   *
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  public info(message: LOGGER_MESSAGE): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(timeStamp, message);
    this.logMessage('INFO', formattedMessage);
  }

  /**
   * Logs an ERROR level message to both the console and the log file.
   *
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  public error(message: LOGGER_MESSAGE): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(timeStamp, message);
    this.logMessage('ERROR', formattedMessage);
  }

  /**
   * Logs a WARN level message to both the console and the log file.
   *
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  public warn(message: LOGGER_MESSAGE): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(timeStamp, message);
    this.logMessage('WARN', formattedMessage);
  }

  /**
   * Logs a DEBUG level message to both the console and the log file.
   *
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  public debug(message: LOGGER_MESSAGE): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(timeStamp, message);
    this.logMessage('DEBUG', formattedMessage);
  }
}

export default Logger;
