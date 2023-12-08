import { END_POINTS, JOORCONFIG } from "types/app/index.js";
import { servePort } from "./serve.js";
import listEndPoints from "./routes/listEndPoints.js";

// Class to handle server related work such as creating server, listening to the port, loading config file
export class Server {
  private config: JOORCONFIG | null = null;
  constructor(configData: JOORCONFIG | null) {
    this.config = configData;
  }
  public async listen() {
    const availableRoutes : END_POINTS = await listEndPoints();
    //serve the port only if the configuration file is loaded properly
    if (this.config) {
      servePort(this.config, availableRoutes);
    }
  }
}
