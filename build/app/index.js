import Hash from "./hashing/index.js";
import { Config } from "./server/config/index.js";
import chalk from "chalk";
import { Server } from "./server/index.js";
export default class Joor {
    static configData = null;
    async start() {
        this.initialize().then(async () => {
            if (Joor.configData !== null) {
                const server = new Server(Joor.configData);
                await server.listen();
            }
        });
    }
    async initialize() {
        if (Config.configData === null) {
            const data = await Config.get();
            if (data !== null) {
                Joor.configData = data;
            }
            else {
                console.error(chalk.red("Error loading config file."));
            }
        }
    }
}
// const app = new Joor();
// await app.start();
// // console.log(await Hash.encrypt("Hello"));
// // console.log(await Hash.encrypt("Hello"));
export { Hash };
//# sourceMappingURL=index.js.map