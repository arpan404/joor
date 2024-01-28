import path from "path";
import { routeFiles } from "../data/files.js";
import writeRouteFiles from "./writeRouteFiles.js";
import apiSample from "../data/api.sample.js";
import webSample from "../data/web.sample.js";
import dynamicApiSample from "../data/dynamicApi.sample.js";
import dynamicWebSample from "../data/dynamicWeb.sample.js";
export default async function createRouteFiles(projectDirectory, isTypescript) {
    routeFiles.forEach(async (file) => {
        try {
            const fileName = "index." + (isTypescript ? "ts" : "js");
            const writePath = path.join(projectDirectory, file.path, fileName);
            let data = "";
            if (file.type === "normal") {
                if (file.variant === "api") {
                    data = apiSample;
                }
                else {
                    data = webSample;
                }
            }
            else if (file.type === "dynamic") {
                if (file.variant === "api") {
                    data = dynamicApiSample;
                }
                else {
                    data = dynamicWebSample;
                }
            }
            await writeRouteFiles(data, writePath, isTypescript);
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=createRouteFiles.js.map