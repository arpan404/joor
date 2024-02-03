import Marker from "../../app/misc/marker.js";
import fs from "fs";
import path from "path";
import createIndex from "./helpers/createIndex.js";
import createPackage from "./helpers/createPackage.js";
import createConfig from "./helpers/createConfig.js";
import createFolderStructure from "./helpers/createFolderStructure.js";
import createRouteFiles from "./helpers/createRouteFiles.js";
import joorInstaller from "./helpers/joorInstaller.js";
export default async function createApp(
  projectName: string,
  projectDescription: string,
  language: string,
  database: string,
  version: string,
  author: string,
) {
  try {
    let workingDirectory = path.join(process.cwd(), projectName);
    const isTypescript: boolean = language === "typescript";

    // Throw error if the folder with same as the project exists in current directory

    if (fs.existsSync(workingDirectory)) {
      throw new Error(
        `Folder named ${projectName} already exists. Try using other names for the project or delete the existing folder named ${projectName}.`,
      );
    }

    // Create project files and folder according to the user's requirement
    await fs.promises.mkdir(workingDirectory);
    await createIndex(workingDirectory, language === "typescript");
    await createPackage(
      workingDirectory,
      isTypescript,
      projectName,
      projectDescription,
      version,
      author,
    );
    await createConfig(workingDirectory, isTypescript);
    createFolderStructure(workingDirectory, isTypescript);
    await createRouteFiles(workingDirectory, isTypescript);
    await joorInstaller(projectName);
    console.log(database);
  } catch (error: any) {
    console.log(
      Marker.redBright(`Could not create project.\nError:\n${error}`),
    );
  }
}
