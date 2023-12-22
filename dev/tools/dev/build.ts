import { promisify } from "util";
import { exec as execCallback } from "child_process";
import fs from "fs";

const exec = promisify(execCallback);

async function runBuilds() {
  try {
    const buildPath = process.cwd().replace("/dev/tools", "/build");
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

runBuilds();
