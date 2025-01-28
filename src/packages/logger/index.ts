import fs from 'node:fs';
import * as nodePath from 'node:path';

import convertStringToBoolean from '@/helpers/convertStringToBoolean';
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
  private logBuffer: string[] = []; // Buffer to store log messages
  private flushInterval: NodeJS.Timeout; // Interval for flushing logs

  constructor({ name, path, formatCallBack, flushInterval }: LOGGER_CONFIG) {
    this.name = name ?? this.name; // Set logger name, default is 'logger'
    this.path = path ?? this.path; // Set log file path, default is 'logs.log' in current directory
    if (!this.path.endsWith('.log')) {
      // Ensure that the log file has a .log extension
      this.path = `${this.path}.log`;
    }
    this.formatCallBack = formatCallBack ?? this.formatCallBack; // Custom format callback, default is basic timestamped message
    // Start interval to flush logs every 10 seconds by default
    this.flushInterval = setInterval(() => {
      void this.flushLogs();
    }, flushInterval ?? 10000);
    this.flushInterval.unref(); // This ensures that this timer doesn't prevent the process from exiting
    // Handle process shutdown (clear interval)
    process.on('exit', () => this.clearFlushInterval());
    process.on('SIGINT', () => this.clearFlushInterval());
    process.on('SIGTERM', () => this.clearFlushInterval());
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
        formattedMessage = `${marker.bgGreenBright.bold(' INFO ')} '${this.name}' - ${message}`;
        break;
      case 'WARN':
        formattedMessage = `${marker.bgYellowBright.bold(' WARN ')} '${this.name}' - ${message}`;
        break;
      case 'ERROR':
        formattedMessage = `${marker.bgRedBright.bold(' ERROR ')} '${this.name}' - ${message}`;
        break;
      case 'DEBUG':
        formattedMessage = `${marker.bgBlueBright.bold(' DEBUG ')} '${this.name}' - ${message}`;
        break;
      default:
        formattedMessage = `${marker.bgGreenBright.bold(' INFO ')} '${this.name}' - ${message}`;
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
   * Flush the accumulated log messages to the log file.
   * This method writes the messages in the buffer to the log file and clears the buffer.
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length > 0) {
      const logsToWrite = this.logBuffer.join('');
      this.logBuffer = []; // Clear the buffer after flushing
      try {
        const dirname = nodePath.dirname(this.path);

        if (!fs.existsSync(dirname)) {
          await fs.promises.mkdir(dirname, { recursive: true });
        }

        const fileStats = await fs.promises.stat(this.path);

        if (fileStats.size > 10485760) {
          // if file size exceeds 10MB, write to a new file
          this.path = this.path.replace(
            '.log',
            `-${new Date().toISOString()}.log`
          );
        }
        await fs.promises.appendFile(this.path, logsToWrite);
      } catch (error) {
        console.error(
          this.formatConsoleMessage('ERROR', `Failed to flush logs: ${error}`)
        );
      }
    }
  }

  /**
   * Clear the flush interval to stop periodic flushing when the application exits.
   */
  private clearFlushInterval(): void {
    clearInterval(this.flushInterval);
  }

  /**
   * Logs the message to both the console and the log file.
   * It also manages the log buffer and ensures logs are flushed periodically.
   *
   * @param {LOGGER_LEVEL} level - The log level (INFO, WARN, ERROR, DEBUG).
   * @param {LOGGER_MESSAGE} message - The message to be logged.
   */
  private async logMessage(
    level: LOGGER_LEVEL,
    message: LOGGER_MESSAGE
  ): Promise<void> {
    const consoleMessage = this.formatConsoleMessage(level, message); // Format message for the console
    const messageToLogInFile = this.formatLogMessage(level, message); // Format message for the file
    const consoleMode = level.toLowerCase() as
      | 'info'
      | 'warn'
      | 'error'
      | 'debug'; // Dynamically map level to corresponding console method
    // eslint-disable-next-line no-console
    console[consoleMode](consoleMessage); // Log message to console
    // Check if file logging is enabled via the environment variable JOOR_LOGGER_ENABLE_FILE_LOGGING
    // If enabled, write the log message to the file using setImmediate for non-blocking I/O
    if (
      process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING &&
      convertStringToBoolean(process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING)
    ) {
      this.logBuffer.push(messageToLogInFile);
      if (this.logBuffer.length >= 100) {
        // Flush if buffer exceeds 100 messages
        await this.flushLogs();
      }
    }
  }
  /**
   * Logs an ERROR level message to both the console and the log file.
   *
   * @param {...any[]} messages - The message(s) to be logged, can be of any type.
   */
  public error(...messages: any[]): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(
      timeStamp,
      messages.map((msg) => String(msg)).join(' ')
    );
    void this.logMessage('ERROR', formattedMessage);
  }

  /**
   * Logs a WARN level message to both the console and the log file.
   *
   * @param {...any[]} messages - The message(s) to be logged, can be of any type.
   */
  public warn(...messages: any[]): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(
      timeStamp,
      messages.map((msg) => String(msg)).join(' ')
    );
    void this.logMessage('WARN', formattedMessage);
  }

  /**
   * Logs a DEBUG level message to both the console and the log file.
   *
   * @param {...any[]} messages - The message(s) to be logged, can be of any type.
   */
  public debug(...messages: any[]): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(
      timeStamp,
      messages.map((msg) => String(msg)).join(' ')
    );
    void this.logMessage('DEBUG', formattedMessage);
  }

  /**
   * Logs an INFO level message to both the console and the log file.
   *
   * @param {...any[]} messages - The message(s) to be logged, can be of any type.
   */
  public info(...messages: any[]): void {
    const timeStamp = new Date().toISOString();
    const formattedMessage = this.formatCallBack(
      timeStamp,
      messages.map((msg) => String(msg)).join(' ')
    );
    void this.logMessage('INFO', formattedMessage);
  }
}

export default Logger;
