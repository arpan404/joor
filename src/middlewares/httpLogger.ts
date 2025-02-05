import * as nodePath from 'node:path';
import process from 'node:process';

import Logger from '@/packages/logger';
import { LOGGER_CONFIG } from '@/types/logger';
import { JoorRequest } from '@/types/request';

/**
 * Middleware to log HTTP requests to a file and console.
 *
 * @example
 * ```typescript
 * import Joor from 'joor';
 * import httpLogger from '@/middlewares/httpLogger';
 * import cors from 'cors';
 *
 * const app = new Joor();
 * app.use(httpLogger());
 * app.use(cors());
 * app.start();
 * ```
 * @example
 * ```typescript
 * import Joor from 'joor';
 * import httpLogger from '@/middlewares/httpLogger';
 *
 * const customFormat = (timestamp: string, message: string): string => `${timestamp} :: ${message}`;
 * const app = new Joor();
 * app.use(httpLogger({ name: 'api.logger', path: 'logs/http.log', formatCallBack: customFormat }));
 * app.start();
 * ```
 * @param {LOGGER_CONFIG} [loggerConfig] - Optional configuration for the logger.
 * @param {string} [loggerConfig.name] - Name of the logger.
 * @param {string} [loggerConfig.path] - Path to the log file.
 * @param {Function} [loggerConfig.formatCallBack] - Callback function to format log messages.
 *
 * @returns {(request: JoorRequest) => void} Middleware function to log HTTP requests.
 */
export default function httpLogger(
  loggerConfig?: LOGGER_CONFIG
): (_request: JoorRequest) => void {
  // Set up the logger configuration with defaults
  const config = {
    name: loggerConfig?.name ?? 'HTTP',
    path:
      loggerConfig?.path ?? nodePath.resolve(process.cwd(), 'logs', 'http.log'),
    formatCallBack: loggerConfig?.formatCallBack,
  };

  // Initialize the logger with the provided configuration
  const logger = new Logger(config);

  // Return the middleware function
  return (request: JoorRequest): void => {
    // Log the HTTP request details
    logger.info(`${request.method} ${request.url} ${request.httpVersion}`);
  };
}
