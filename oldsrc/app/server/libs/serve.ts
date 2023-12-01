import chalk from "chalk";
import { JOORCONFIG } from "../../../types/app/index.js";
import http from "http";
import handleRequests from "../request/handleRequests.js";
import joor from "data.js";

export async function servePort(configData: JOORCONFIG) {
  const isUnderDevelopment = configData.mode === "development" ? true : false;
  const server = http.createServer(
    async (request: http.IncomingMessage, response: http.ServerResponse) => {
      try {
        const responseData = await handleRequests(request, configData);
        response.writeHead(responseData.status, responseData.headers);
        response.end(responseData.body);
      } catch (error: any) {
        console.error("Error handling request:", error);
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Internal Server Error");
      }
    }
  );
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (configData.doLogs) {
      if (error.code === "EADDRINUSE") {
        console.log(
          chalk.red(
            `\nPort ${configData.port} is already in use.\nEdit ${chalk.bgBlue(
              " joor.config.json "
            )} file to use another port.\n`
          )
        );
        console.log(
          chalk.greenBright(
            `For more information, have a look at: ${joor.docs}/error/port`
          )
        );
      } else {
        console.log(
          chalk.redBright(`An error occurred while starting the server : `) +
            "\n" +
            error
        );
      }
      process.exit(1);
    }
  });
  server.listen(configData.port, () => {
    console.log(chalk.bold.greenBright("\n\nJoor app has been started."));
    if (isUnderDevelopment) {
      console.log(
        chalk.bgGreen.bold.blueBright(
          `\n Started at : http://localhost:${configData.port} \n`
        )
      );
    } else {
      console.log(
        chalk.bgGreen.bold.blueBright(
          `\n Started production server at : Port ${configData.port} \n`
        )
      );
    }
  });
}
