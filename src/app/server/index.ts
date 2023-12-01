import { JOORCONFIG } from "types/app/config/index.js";
import { servePort } from "./serve.js";
export class Server {
  private config: JOORCONFIG | null = null;
  constructor(configData: JOORCONFIG | null) {
    this.config = configData;
  }
  public async listen() {
    if (this.config) {
      servePort(this.config);
    }
  }
}
