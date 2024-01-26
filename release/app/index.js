/*
 - This file is the main file of the framework.
 - It is the entry point of the framework.
 - Every classes, methods and functions that should be accessible for users should be imported from their respective files, and exported from here.
*/
// import { JOORCONFIG } from ";
import { Config } from "./config/index.js";
import { Server } from "./server/index.js";
/**
 * Class to initiate a new Joor server
 * @example```
 * import Joor from "joor";
 * const app = new Joor();
 * await app.start();
 * ```
 *
 * This will start a new Joor server with default config data from joor.config.json file
 */
export default class Joor {
    // private variable to hold config data to use in server & initiated as null
    static configData = null;
    /**
     * Method to start a new Joor server
     *
     * This method is async so it should always be awaited
     * @example```
     * const app = new Joor();
     * await app.start();
     * ```
     */
    async start() {
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
    async initialize() {
        if (Config.configData === null) {
            const data = await Config.get();
            if (data !== null) {
                Joor.configData = data;
            }
        }
    }
}
//# sourceMappingURL=index.js.map