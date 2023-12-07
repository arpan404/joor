import { JOORCONFIG } from "types/app/index.js";
import { servePort } from "./serve.js";

// Class to handle server related work such as creating server, listening to the port, loading config file
export class Server {
  private config: JOORCONFIG | null = null;
  constructor(configData: JOORCONFIG | null) {
    this.config = configData;
  }
  public async listen() {
    //serve the port only if the configuration file is loaded properly
    if (this.config) {
      servePort(this.config);
    }
  }
}
