import { MIDDLEWARE_RESPONSE, RESPONSE } from "../../../types/app/index.js";
import { Config } from "../config/loadConfig.js";

async function handleMiddleWare(
  request: Request,
  file: string,
  fileExtension: ".js" | ".ts",
  httpMethod: string
): Promise<MIDDLEWARE_RESPONSE> {
  try {
    const pathArray: Array<string> = file.split("/");
    pathArray.pop();
    const middlewareFile: string =
      pathArray.join("/") + "/middleware" + fileExtension;
    if (await Bun.file(middlewareFile).exists()) {
      return {
        isMiddleware: false,
        reponse: undefined,
      };
    }
    const middleware = await import(middlewareFile);
    let data: RESPONSE | undefined = undefined;
    if (middleware[httpMethod]) {
      data = await middleware[httpMethod](request);
    } else {
      data = await middleware.route(request);
    }
    return {
      isMiddleware: true,
      reponse: data,
    };
  } catch (error) {
    const configData = Config.configData;
    if (configData?.doLogs) {
      console.log(error);
    }
    return {
      isMiddleware: false,
      reponse: undefined,
    };
  }
}
export default handleMiddleWare;
