import path from "path";
import { Files } from "../../../types/cli/index.js";
import { routeFiles } from "../data/files.js";
import writeRouteFiles from "./writeRouteFiles.js";
import apiSample from "../data/api.sample.js";
import webSample from "../data/web.sample.js";
import dynamicApiSample from "../data/dynamicApi.sample.js";
import dynamicWebSample from "../data/dynamicWeb.sample.js";

export default async function createRouteFiles(
  projectDirectory: string,
  isTypescript: boolean
): Promise<void> {
  routeFiles.forEach(async (file: Files) => {
    try {
      const fileName = "index." + (isTypescript ? "ts" : "js");
      const writePath = path.join(projectDirectory, file.path, fileName);
      let data = "";
      if (file.type === "normal") {
        if (file.variant === "api") {
          data = apiSample;
        } else {
          data = webSample;
        }
      } else if (file.type === "dynamic") {
        if (file.variant === "api") {
          data = dynamicApiSample;
        } else {
          data = dynamicWebSample;
        }
      }

      await writeRouteFiles(data, writePath, isTypescript);
    } catch (error: any) {
      throw error;
    }
  });
}
