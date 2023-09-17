import chalk from "chalk";
import { JOORCONFIG } from "../../../types/app/index.js";

export async function servePort(configData: JOORCONFIG) {
  const isUnderDevelopment = configData.mode === "development" ? true : false;
  try {
    Bun.serve({
      port: configData.port,
      development: isUnderDevelopment,
      fetch(request: Request) {
        const url = new URL(request.url);
        console.log(url);
        console.log(request);
        return new Response("Hello World!");
      },
    });
    console.log(
      chalk.greenBright(
        `\nServer is running on : http:///localhost:${configData.port}\n`
      )
    );
  } catch (error) {
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
