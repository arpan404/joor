import { servePort } from "./serve.js";
import listEndPoints from "./routes/listEndPoints.js";
import { END_POINTS, JOORCONFIG } from "../../types/app/index.js";
import Marker from "../misc/marker.js";

// Class to handle server related work such as creating server, listening to the port, loading config file
export class Server {
  private config: JOORCONFIG | null = null;
  constructor(configData: JOORCONFIG | null) {
    this.config = configData;
  }

  public async listen() {
    try {
      // starts server only if routes and config files are loaded properly
      const availableRoutes: END_POINTS = await listEndPoints();
      if (availableRoutes.length === 0) {
        console.log(
          Marker.redBright(
            "No routes available. Create a route to start a server."
          )
        );
        process.exit(1);
      }
      if (this.config) {
        servePort(this.config, availableRoutes);
      }
    } catch (error: any) {
      console.log(Marker.redBright(error));
      process.exit(1); // Exit with error code 1 if there is an error in the server setup. This will stop the server from running.
    }
  }
}
