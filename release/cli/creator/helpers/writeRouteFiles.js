import fs from "fs";
export default async function writeRouteFiles(data, writePath, isTypescript) {
    try {
        const importData = {
            placeholder: `{##ImportTypesReqRes##}`,
            actual: isTypescript ? `import { REQUEST, RESPONSE } from "joor"` : "",
        };
        const requestData = {
            placeholder: `{##RequestType##}`,
            actual: isTypescript ? `:REQUEST` : ``,
        };
        const responseData = {
            placeholder: `{##PromiseResponseType##}`,
            actual: isTypescript ? `: Promise<RESPONSE>` : ``,
        };
        const toWrite = data
            .replace(importData.placeholder, importData.actual)
            .replace(requestData.placeholder, requestData.actual)
            .replace(responseData.placeholder, responseData.actual).trim();
        await fs.promises.writeFile(writePath, toWrite);
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=writeRouteFiles.js.map