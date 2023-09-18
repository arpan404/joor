import chalk from "chalk";
import { JOORCONFIG } from "../../../types/app/index.js";
import handleRequests from "./handleRequests.js";

export async function servePort(configData: JOORCONFIG) {
  const isUnderDevelopment = configData.mode === "development" ? true : false;
  try {
    Bun.serve({
      port: configData.port,
      development: isUnderDevelopment,
      async fetch(request: Request): Promise<Response> {
        const response: Response = await handleRequests(request);
        return response;
      },
    });
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
  } catch (error) {
    if (configData.doLogs) {
      console.log(
        chalk.red(
          `\nPort ${configData.port} is already in use.\nEdit ${chalk.bgBlue(
            " joor.config.json "
          )} file to use another port.\n`
        )
      );
      console.log(
        chalk.greenBright(
          "For more information, have a look at: https://joor.xyz/docs/error/port"
        )
      );
    }
  }
}
