import chalk from "chalk";
import Jrror from ".";
import joorData from "../../data/joor";

class JrrorHandler {
  constructor(jrror: Jrror) {
    this.handle(jrror);
  }

  public handle(jrror: Jrror): void {
    const errorMessage = this.formatMessage(jrror);
    if (jrror.type === "warn") {
      console.warn(chalk.yellowBright(errorMessage));
      return;
    }

    console.error(chalk.redBright(errorMessage));

    if (jrror.type === "panic") {
      process.exit(1);
    }
  }
  private formatMessage(jrror: Jrror) {
    return `Error Code : ${jrror.errorCode}\nMessage : ${jrror.message}\nFor more information, see: ${joorData.docs}/${joorData.docsVersion}/errors?errorCode=${jrror.errorCode}`;
  }
}

export default JrrorHandler;
