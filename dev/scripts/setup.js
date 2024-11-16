import { promisify } from "util";
import { exec as execCallback } from "child_process";
import fs from "fs";
import path from "path";

// Promisify exec function to work with async/await
const exec = promisify(execCallback);

// Function to check if a specific version of a package is already installed globally
const isPackageVersionInstalledGlobally = async (packageName, version) => {
  try {
    const result = await exec(`npm list -g ${packageName}`);
    return result.stdout.includes(`${packageName}@${version}`);
  } catch (error) {
    return false;
  }
};

// Function to check if a specific version of a local package is installed
const isLocalPackageVersionInstalled = async (packageName, version) => {
  try {
    const packageJsonPath = path.join(
      process.cwd(),
      "node_modules",
      packageName,
      "package.json"
    );
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      return packageJson.version === version;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Function to install packages if they aren't already installed
const installPackage = async (name, version, isGlobal = false) => {
  const isInstalled = isGlobal
    ? await isPackageVersionInstalledGlobally(name, version)
    : await isLocalPackageVersionInstalled(name, version);

  if (isInstalled) {
    console.log(
      `${name}@${version} is already installed ${
        isGlobal ? "globally" : "locally"
      }.\n`
    );
    return true;
  } else {
    const command = `npm i ${isGlobal ? "-g " : ""}${name}@${version}`;
    console.log(`Installing ${name}@${version}...\n`);
    try {
      const result = await exec(command);
      if (result.stderr) {
        console.log(
          `Failed to install: ${name}@${version}. Try running: '${command}' manually.`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error installing ${name}@${version}:`, error);
      return false;
    }
  }
};

// Main function to set up the development environment
const main = async () => {
  const toInstallGlobally = [
    { name: "tsx", version: "3.0.0" },
    { name: "typescript", version: "5.6.3" },
  ];

  let totalInstalled = 0;

  if (console.clear) {
    console.clear();
  } else {
    process.stdout.write("\x1Bc");
  }

  console.log("\n\nSetting up the development environment for Joor.\n\n");
  console.log("\nInstalling Global Packages\n");

  // Install global packages
  for (const { name, version } of toInstallGlobally) {
    const success = await installPackage(name, version, true);
    if (success) totalInstalled++;
  }

  console.log(
    `\nInstalled ${totalInstalled}/${toInstallGlobally.length} global packages successfully.\n`
  );

  // Check if local dependencies are already installed
  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  if (fs.existsSync(nodeModulesPath)) {
    console.log("\nLocal dependencies are already installed.\n");
  } else {
    // Install local dependencies if not installed
    console.log("\nInstalling Joor's local dependencies...\n");
    try {
      const dependenciesResult = await exec("npm i");
      if (dependenciesResult.stderr) {
        console.log(
          "\nError while installing Joor's dependencies:\n",
          dependenciesResult.stderr
        );
      } else {
        console.log("\nAll local dependencies installed successfully.");
      }
    } catch (error) {
      console.error("\nError installing dependencies:", error);
    }
  }
};

// Call the main function to start the setup process
main();
