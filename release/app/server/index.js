import { servePort } from "./serve.js";
import listEndPoints from "./routes/listEndPoints.js";
import Marker from "../misc/marker.js";
// Class to handle server related work such as creating server, listening to the port, loading config file
export class Server {
    config = null;
    constructor(configData) {
        this.config = configData;
    }
    async listen() {
        try {
            // starts server only if routes and config files are loaded properly
            const availableRoutesDetail = await listEndPoints();
            if (availableRoutesDetail.length === 0) {
                console.log(Marker.redBright("No routes available. Create a route to start a server."));
                process.exit(1);
            }
            if (this.config) {
                servePort(this.config, availableRoutesDetail);
            }
        }
        catch (error) {
            console.log(Marker.redBright(error));
            process.exit(1); // Exit with error code 1 if there is an error in the server setup. This will stop the server from running.
        }
    }
}
//# sourceMappingURL=index.js.map