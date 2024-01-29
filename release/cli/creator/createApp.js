import Marker from "../../app/misc/marker.js";
import fs from "fs";
import path from "path";
import createIndex from "./helpers/createIndex.js";
import createPackage from "./helpers/createPackage.js";
import createConfig from "./helpers/createConfig.js";
import createFolderStructure from "./helpers/createFolderStructure.js";
import createRouteFiles from "./helpers/createRouteFiles.js";
import joorInstaller from "./helpers/joorInstaller.js";
export default async function createApp(projectName, projectDescription, language, database, version, author) {
    let workingDirectory = path.join(process.cwd(), projectName);
    const isTypescript = language === "typescript";
    if (fs.existsSync(workingDirectory)) {
        throw new Error(`Folder named ${projectName} already exists. Try using other names for the project or delete the existing folder named ${projectName}.`);
    }
    await fs.promises.mkdir(workingDirectory);
    await createIndex(workingDirectory, language === "typescript");
    await createPackage(workingDirectory, language === "typescript", projectName, projectDescription, version, author);
    await createConfig(workingDirectory, isTypescript);
    createFolderStructure(workingDirectory, isTypescript);
    await createRouteFiles(workingDirectory, isTypescript);
    await joorInstaller(projectName);
    console.log(database);
    try {
    }
    catch (error) {
        console.log(Marker.redBright(`Could not create project.\nError:\n${error}`));
    }
}
//# sourceMappingURL=createApp.js.map