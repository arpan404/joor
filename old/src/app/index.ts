/*
 - This file is the main file of the framework.
 - It is the entry point of the framework.
 - Every classes, methods and functions that should be accessible for users should be imported from their respective files, and exported from here.
*/
// import { JOORCONFIG } from ";

import { JOORCONFIG } from "../types/app/config/index.js";
import { Config } from "./config/index.js";
import { Server } from "./server/index.js";

/**
 * Class to initiate a new Joor server
 * @example```
 * import Joor from "joorData";
 * const app = new Joor();
 * await app.start();
 * ```
 *
 * This will start a new Joor server with default config data from joorData.config.json file
 */
export default class Joor {
  // private variable to hold config data to use in server & initiated as null
  private static configData: JOORCONFIG | null = null;

  /**
   * Method to start a new Joor server
   *
   * This method is async so it should always be awaited
   * @example```
   * const app = new Joor();
   * await app.start();
   * ```
   */

  public async start() {
    //First load config data, then only start a new server id data is not null
    this.initialize().then(async () => {
      if (Joor.configData !== null) {
        // if present, then started a new server with configData as parameter.
        const server = new Server(Joor.configData);
        await server.listen();
      }
    });
  }
  //Always private method, used to load config data from config file
  private async initialize(): Promise<void> {
    if (Config.configData === null) {
      const data: JOORCONFIG | null = await Config.get();
      if (data !== null) {
        Joor.configData = data;
      }
    }
  }
}

/* 
Other classes or functions that should be accessible for users should be imported from their respective files, and exported from here.

Note: You should import respective classes/functions/types from their respective folder's index file, and export them from here.

Example:
import { Hash } from "./hashing/index.js";
export { Hash };

You should not import any other classes/functions from any other file.
For example:
import { Hash } from "./hashing/hash.js";
export {Hash};


Also, Joor class should be default export from this file

*/

import { REQUEST, RESPONSE } from "../types/app/index.js";

export { REQUEST, RESPONSE };
