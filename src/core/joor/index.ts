import chalk from 'chalk';
import JOOR_CONFIG from '@/types/config';
import Jrror from '@/core/error';
import Server from '@/core/joor/server';
import Configuration from '@/core/config';
import loadEnv from '@/core/internals/loadEnv';
import { GLOBAL_MIDDLEWARES } from '@/types/joor';
import { ROUTE_HANDLER } from '@/types/route';

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
 * This example starts a new Joor server using the default configuration data from the `joorData.config.json` file.
 */
class Joor {
  // Private variable to hold configuration data used in the server, initialized as null
  private configData: JOOR_CONFIG | undefined;
  private globalMiddlewares: GLOBAL_MIDDLEWARES = [];

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
        await server.listen(this.globalMiddlewares);
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
        console.info(chalk.redBright('Unknown Error Occurred.\n') + error);
      }
    }
  }

  /**
   * Method to add global middleares
   *
   * @example
   * ```typecript
   * const app = Joor()
   * app.use(middlware1)
   * ```
   *
   * Note: middlware must accept request object of type JoorRequest, and must return JoorResponse to interrupt the request-response cycle. If the request need to processed further, the middleware must return void; nothing else
   *
   * */
  public use(handler: ROUTE_HANDLER): void {
    if (typeof handler !== 'function') {
      throw new Jrror({
        code: 'middleware-not-function',
        message: 'Could not register a middleware; non function value provided',
        type: 'panic',
        docsPath: '/middlewares',
      });
    }
    this.globalMiddlewares.push(handler);
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
