import * as nodePath from 'node:path';
import process from 'node:process';

import Logger from '@/packages/logger';
import { LOGGER_CONFIG } from '@/types/logger';
import { JoorRequest } from '@/types/request';

/**
 * Middleware to log HTTP requests to a file and console.
 *
 * Can be applied at different levels of routing, similar to other middleware.
 *
 * ### Usage
 * @example
 * ```typescript
 * import Joor, { httpLogger } from 'joor';
 * const app = new Joor();
 *
 * // Apply to all routes and methods
 * app.use(httpLogger());
 *
 * // Apply to a specific route and method
 * app.get('/users', httpLogger());
 *
 * // Apply to all methods of a specific route
 * app.use('/users', httpLogger());
 *
 * // Apply to a route and its subroutes
 * app.use('/users/*', httpLogger());
 * ```
 *
 * ### Configuration
 * `httpLogger` can be customized by passing a configuration object.
 *
 * @example
 * ```typescript
 * import Joor, { httpLogger } from 'joor';
 *
 * // Custom log format
 * const customFormat = (timestamp: string, message: string): string => `${timestamp} :: ${message}`;
 *
 * const app = new Joor();
 * const loggerConfig = {
 *   name: 'api.logger',
 *   path: 'logs/http.log',
 *   formatCallBack: customFormat
 * };
 *
 * app.use(httpLogger(loggerConfig)());
 * ```
 *
 * **Note:** If no configuration object is provided, default values will be used.
 *
 * ### Parameters
 * @param {LOGGER_CONFIG} [loggerConfig] - Optional configuration object for the logger.
 * @param {string} [loggerConfig.name] - Name of the logger.
 * @param {string} [loggerConfig.path] - Path to the log file.
 * @param {Function} [loggerConfig.formatCallBack] - Callback function to format log messages.
 *
 * ### Returns
 * @return {Function} A middleware function that logs HTTP requests.
 *
 * **Note:** `httpLogger` is a wrapper function that returns a middleware function.
 * It must be called when passing it as middleware, as shown in the examples above.
 */

export default function httpLogger(
  config?: LOGGER_CONFIG
): (_request: JoorRequest) => void {
  // Set up the logger configuration based on provided config or default values
  const loggerConfig = {
    name: config?.name ?? 'HTTP',
    path: config?.path ?? nodePath.resolve(process.cwd(), 'logs', 'http.log'),
    formatCallBack: config?.formatCallBack,
  };

  // Initialize the logger with the provided configuration
  const logger = new Logger(loggerConfig);

  // Return the middleware function
  return (request: JoorRequest): void => {
    // Log the HTTP request details
    logger.info(`${request.method} ${request.url} ${request.httpVersion}`);
  };
}
