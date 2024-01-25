import http from "http";
import handleRequests from "./request/handleRequests.js";
import Marker from "../misc/marker.js";
import joor from "../../data.js";
export async function servePort(configData, availableRoutesDetail) {
    const isUnderDevelopment = configData.mode === "development" ? true : false;
    const server = http.createServer(async (request, response) => {
        try {
            const responseData = await handleRequests(request, configData, availableRoutesDetail);
            response.writeHead(responseData.status, responseData.headers);
            response.end(responseData.body);
        }
        catch (error) {
            console.error("Error handling request:", error);
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Internal Server Error");
        }
    });
    server.on("error", (error) => {
        if (configData.doLogs) {
            if (error.code === "EADDRINUSE") {
                console.log(Marker.red(`\nPort ${configData.port} is already in use.\nEdit ${Marker.bgBlue(" joor.config.json ")} ${Marker.red("file to use another port.")}\n`));
                console.log(Marker.greenBright(`For more information, have a look at: ${joor.docs}/port`));
            }
            else {
                console.log(Marker.redBright(`An error occurred while starting the server : `) +
                    "\n" +
                    error);
            }
            process.exit(1);
        }
    });
    server.listen(configData.port, () => {
        console.log(Marker.boldGreenBright("\n\nJoor app has been started."));
        if (isUnderDevelopment) {
            console.log(Marker.bgGreenBoldBlueBright(`\n Started at : http://localhost:${configData.port} \n`));
        }
        else {
            console.log(Marker.bgGreenBoldBlueBright(`\n Started production server at : Port ${configData.port} \n`));
        }
    });
}
//# sourceMappingURL=serve.js.map