import { JOORCONFIG } from "../types/app/index.js";
import Hash from "./hashing/index.js";
import { Config } from "./server/config/index.js";
import chalk from "chalk";
import { Server } from "./server/index.js";
export default class Joor {
  private static configData: JOORCONFIG | null = null;
  public async start() {
    this.initialize().then(async () => {
      if (Joor.configData !== null) {
        const server = new Server(Joor.configData);
        await server.listen();
      }
    });
  }
  private async initialize(): Promise<void> {
    if (Config.configData === null) {
      const data: JOORCONFIG | null = await Config.get();
      if (data !== null) {
        Joor.configData = data;
      } else {
        console.error(chalk.red("Error loading config file."));
      }
    }
  }
}
export { Hash };
