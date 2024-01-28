import fs from "fs";
import packageSample from "../data/package.sample.js";
import path from "path";
export default async function createPackage(projectPath, isTypescript, name, description, version, author) {
    try {
        const packagePath = path.join(projectPath, "/package.json");
        const mainFile = "index." + (isTypescript ? "ts" : "js");
        let toWrite = packageSample
            .replace("##Name##", name)
            .replace("##Description##", description)
            .replace("##Author##", author)
            .replace("##Version##", version)
            .replace("##MainFile##", mainFile)
            .trim();
        await fs.promises.writeFile(packagePath, toWrite);
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=createPackage.js.map