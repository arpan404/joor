import { promisify } from "util";
import { exec as execCallback } from "child_process";
import fs from "fs";
import path from "path";
import Readline from "readline/promises";

const exec = promisify(execCallback);

//content of package.json file

const packageFileData = `
{
  "name": "joor",
  "version": "version_placeholder",
  "description": "Joor is a full-fledged backend web framework for small to enterprise level projects. Joor.js provides blazing fast responsiveness to the web app with many built-in features.",
  "main": "./app/index.js", 
  "types": "./app/index.d.ts",
  "type":"module"
} 
`;

// This is used to take input from user in command line
const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//regex for checking version
const versionRegex =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

//function to create builds using typescript compiler
async function runBuilds() {
  try {
    const buildPath = process.cwd().replace("/dev/tools", "/build");

    // deleting build folder, if it exists
    if (fs.existsSync(buildPath)) {
      console.log("\n\nBuild folder exists\nDeleting build folder...");
      await fs.promises
        .rm(buildPath, { recursive: true })
        .catch((error) => {
          console.log(
            "Error deleting folder. Try deleting the existing build folder to continue building the project."
          );
        })
        .then(() => console.log("Deleted build folder\n"));
    } else {
      console.log("No existing build folder.\n");
    }
    console.log("\nStarted building the project\n");

    // running build command from root directory
    const buildResult = await exec("cd ../../ && npm run build");
    if (buildResult.stderr) {
      console.log(
        "Something went wrong while building the project\nError: ",
        buildResult.stderr
      );
    } else {
      console.log("Build completed\n");
    }
  } catch (error) {
    console.error("Error building project:", error);
  }
}

//function to copy files from each folder and create each subfolders
async function copyFolder(source: string, destination: string) {
  try {
    const buildFiles = await fs.promises.readdir(source);
    for (const file of buildFiles) {
      const sourceFile = path.join(source, file);
      const destFile = path.join(destination, file);

      const stats = await fs.promises.stat(sourceFile);
      if (stats.isDirectory()) {
        await copyFolder(sourceFile, destFile);
      } else {
        const destDir = path.dirname(destFile);
        await fs.promises.mkdir(destDir, { recursive: true });
        await fs.promises.copyFile(sourceFile, destFile);
      }
    }
  } catch (error) {
    console.log("Error while copying build files to release folder: ", error);
  }
}


async function createRelease() {
  try {
    // compile typescript files first to js
    await runBuilds();

    console.log("\n....Creating Release Version....\n");

    const releasePath = process.cwd().replace("/dev/tools", "/release");
    const buildPath = process.cwd().replace("/dev/tools", "/build");

    //delete relase folder if it exists to avoid ambiguity
    if (fs.existsSync(releasePath)) {
      console.log("\n\nRelease folder exists\nDeleting release folder...");
      await fs.promises
        .rm(releasePath, { recursive: true })
        .catch((error) => {
          console.log(
            "Error deleting folder. Try deleting the existing release folder to continue building the project."
          );
        })
        .then(() => console.log("Deleted release folder\n"));
    } else {
      console.log("No existing release folder.\n");
    }
    await fs.promises.mkdir(releasePath);
    console.log("\nCopying build files to release folder...\n");

    await copyFolder(buildPath, releasePath);
    console.log("Copied all files from build folder to release folder.\n");
    console.log("Copying package.json and Readme files\n");
    const readMeSourcePath = process.cwd().replace("/dev/tools", "/README.md");
    const readMeDestinationPath = releasePath.concat("/README.md");
    const packagFilePath = releasePath.concat("/package.json");
    await fs.promises.copyFile(readMeSourcePath, readMeDestinationPath);
    let version = await rl.question("Enter the version of of this release: ");
    while (!versionRegex.test(version)) {
      console.log("\nInvalid version name.\n");
      version = await rl.question("Enter the version of of this release: ");
    }
    rl.close();
    const packageData = packageFileData.replace("version_placeholder", version);
    fs.promises.writeFile(packagFilePath, packageData);

    if (fs.existsSync(buildPath)) {
      console.log("\nDeleting build folder...");
      await fs.promises
        .rm(buildPath, { recursive: true })
        .catch((error) => {
          console.log(
            "Error deleting folder. Try deleting the build folder manually."
          );
        })
        .then(() => console.log("Deleted build folder\n"));
    } else {
      console.log("No existing release folder.\n");
    }

    console.log(
      `\n\nSuccessfully, build a new release version of Joor.\nVersion : ${version}\n`
    );
  } catch (error) {
    console.error("Error building project:", error);
  }
}
createRelease();
