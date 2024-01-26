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
    private static configData;
    /**
     * Method to start a new Joor server
     *
     * This method is async so it should always be awaited
     * @example```
     * const app = new Joor();
     * await app.start();
     * ```
     */
    start(): Promise<void>;
    private initialize;
}
import { REQUEST, RESPONSE } from "../types/app/index.js";
export { REQUEST, RESPONSE };
