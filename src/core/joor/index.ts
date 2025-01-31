import addMiddlewares from '../router/addMiddlewares';

import Configuration from '@/core/config';
import Jrror from '@/core/error';
import loadEnv from '@/core/internals/loadEnv';
import Server from '@/core/joor/server';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';
import { ROUTE_HANDLER, ROUTE_PATH } from '@/types/route';

/**
 * Represents the Joor framework server.
 * This class is used to initiate and start a new Joor server with the provided configuration.
 *
 * @example
 * ```typescript
 * import Joor from "joor";
 * const app = new Joor();
 * await app.start();
 * ```
 * This example starts a new Joor server using the default configuration data from the `joor.config.ts` or `joor.config.js` file.
 *
 */
class Joor {
  // Private variable to hold configuration data used in the server, initialized as null
  private configData: JOOR_CONFIG | undefined;

  /**
   * Starts a new Joor server.
   * This method must always be awaited as it is asynchronous.
   *
   * @example
   * ```typescript
   * const app = new Joor();
   * await app.start();
   * ```
   * This example starts the server with the loaded configuration.
   *
   * @throws {Jrror} Throws a custom error if configuration is not found. But also handles it.
   */
  public async start(): Promise<void> {
    try {
      await this.initialize();
      loadEnv();
      if (this.configData) {
        const server = new Server();
        await server.listen();
      } else {
        throw new Jrror({
          code: 'config-load-failed',
          message: `Error occured while loading the configuration file.`,
          type: 'panic',
          docsPath: '/configuration',
        });
      }
    } catch (error: unknown) {
      if (error instanceof Jrror) {
        error.handle();
      } else {
        logger.info(`Unknown Error Occurred.\n${error}`);
      }
    }
  }

  /**
   * Adds global middlewares to specified routes.
   *
   * @example
   * ```typescript
   * const app = new Joor();
   * app.use("/", middleware1, middleware2); // Adds middleware1 and middleware2 to the route "/" and all its methods.
   * app.use("/api/*", middleware3); // Adds middleware3 to all routes starting with "/api/".
   * ```
   *
   * @param {...(ROUTE_PATH | ROUTE_HANDLER)[]} data - An array of route paths and middleware functions.
   *
   * @remarks
   * Middleware must accept a request object of type `JoorRequest` and must return `JoorResponse` to interrupt the request-response cycle.
   * If the request needs to be processed further, the middleware must return `void`.
   */
  public use(...data: Array<ROUTE_PATH | ROUTE_HANDLER>): void {
    let paths: Array<ROUTE_PATH> = [];
    let middlewares: Array<ROUTE_HANDLER> = [];

    // Separate paths and middleware functions from the provided data
    for (const d of data) {
      if (typeof d === 'string') {
        paths = [...paths, d];
      } else if (typeof d === 'function') {
        middlewares = [...middlewares, d];
      } else {
        logger.warn(
          `Invalid data type "${typeof d}" passed to use method. Ignoring...`
        );
      }
    }

    // Add middlewares to the specified paths
    // console.log(paths, middlewares);
    if (paths.length === 0) {
      paths = ['/'];
    }

    if (paths.length > 0 && middlewares.length > 0) {
      for (const path of paths) {
        addMiddlewares(path, middlewares);
      }
    } else {
      logger.warn(
        `Invalid data passed to use method. Ensure both paths and middlewares are provided. Ignoring...`
      );
    }
  }
  /**
   * Initializes the configuration for the server.
   * Loads configuration data asynchronously and assigns it to `configData`.
   *
   * @throws {Jrror} Throws a custom error if initialization fails.
   */
  private async initialize(): Promise<void> {
    const config = new Configuration();
    this.configData = await config.getConfig();
  }
}

export default Joor;
