import chalk from "chalk";
import JOOR_CONFIG from "@/core/config/type";
import Jrror from "@/error";
import Server from "@/core/server";
import Configuration from "@/core/config";

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
      if (this.configData) {
        const server = new Server();
        await server.listen();
      } else {
        throw new Jrror({
          code: "config-load-failed",
          message: `Error occured while loading the configuration file.`,
          type: "panic",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Jrror) {
        error.handle();
      } else {
        console.log(chalk.redBright("Unknown Error Occurred.\n") + error);
      }
    }
  }

  /**
   * Initializes the configuration for the server.
   * Loads configuration data asynchronously and assigns it to `configData`.
   *
   * @throws {Jrror} Throws a custom error if initialization fails.
   */
  private async initialize(): Promise<void> {
    try {
      const config = new Configuration();
      this.configData = await config.getConfig();
    } catch (error: unknown) {
      throw error;
    }
  }
}

export default Joor;
