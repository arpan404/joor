import { exec as execCallback } from 'child_process';
import fs from 'fs';
import path from 'path';
import Readline from 'readline/promises';
import { promisify } from 'util';

const exec = promisify(execCallback);

// content of package.json file
const packageFileData = `
{
  "name": "joor",
  "version": "version_placeholder",
  "description": "Joor is a full-fledged backend web framework for small to enterprise level projects. Joor.js provides blazing fast responsiveness to the web app with many built-in features.",
  "main": "./src/index.js",
  "types": "./src/index.d.ts",
  "type":"commonjs",
  "dependencies": ##dependencies##
}
`;
const toRemoveDependencies = `"dependencies": ##dependencies##`;

// This is used to take input from user in command line
const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const flag = '';

// regex for checking version
const versionRegex =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

// function to create builds using typescript compiler
async function runBuilds() {
  try {
    const buildPath = flag + path.join(process.cwd(), 'build');

    // deleting build folder, if it exists
    if (fs.existsSync(buildPath)) {
      console.warn('\n\nBuild folder exists\nDeleting build folder...');
      await fs.promises
        .rm(buildPath, { recursive: true })
        .catch((error) => {
          console.warn(
            'Error deleting folder. Try deleting the existing build folder to continue building the project.'
          );
          throw error;
        })
        .then(() => console.warn('Deleted build folder\n'));
    } else {
      console.warn('No existing build folder.\n');
    }
    console.warn('\nStarted building the project\n');
    // running build command from root directory
    const buildResult = await exec('npm run compile');

    if (buildResult.stderr) {
      console.warn(
        'Something went wrong while building the project\nError: ',
        buildResult.stderr
      );
    } else {
      console.warn('Build completed\n');
    }
  } catch (error: unknown) {
    console.error('Error building project.');
    throw error;
  }
}

// function to copy files from each folder and create each subfolder
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
  } catch (error: unknown) {
    console.warn('Error while copying build files to release folder.');
    throw error;
  }
}

async function makePackageFile(version: string, packagFilePath: string) {
  try {
    const packageDataFileLocation =
      flag + path.join(process.cwd(), '/package.json').replace(/\\/g, '/');

    let packageData = packageFileData.replace('version_placeholder', version);

    const sourcePackageJson = await fs.promises.readFile(
      packageDataFileLocation,
      'utf8'
    );
    const sourcePackageData = JSON.parse(sourcePackageJson);

    if (
      sourcePackageData.dependencies &&
      Object.keys(sourcePackageData.dependencies).length > 0
    ) {
      packageData = packageData.replace(
        '##dependencies##',
        JSON.stringify(sourcePackageData.dependencies, null, 2)
      );
    } else {
      packageData = packageData.replace(toRemoveDependencies, ' ');
      const commaIndex = packageData.lastIndexOf(',');
      packageData =
        packageData.slice(0, commaIndex) + packageData.slice(commaIndex + 1);
      console.warn(packageData);
    }
    await fs.promises.writeFile(packagFilePath, packageData.trim());
  } catch (error: unknown) {
    console.error('Error while making package file for release.');
    throw error;
  }
}

async function createRelease() {
  try {
    // compile typescript files first to js
    await runBuilds();
    console.warn('\n....Creating Release Version....\n');
    const releasePath =
      flag + path.join(process.cwd(), '/release').replace(/\\/g, '/');
    const buildPath =
      flag + path.join(process.cwd(), '/build').replace(/\\/g, '/');

    // delete release folder if it exists to avoid ambiguity
    if (fs.existsSync(releasePath)) {
      console.warn('\n\nRelease folder exists\nDeleting release folder...');
      await fs.promises
        .rm(releasePath, { recursive: true })
        .catch((error) => {
          console.error(
            'Error deleting folder. Try deleting the existing release folder to continue building the project.'
          );
          throw error;
        })
        .then(() => console.warn('Deleted release folder\n'));
    } else {
      console.warn('No existing release folder.\n');
    }
    await fs.promises.mkdir(releasePath);
    console.warn('\nCopying build files to release folder...\n');
    await copyFolder(buildPath, releasePath);
    console.warn('Copied all files from build folder to release folder.\n');
    console.warn('Copying package.json and Readme files\n');
    const readMeSourcePath =
      flag + path.join(process.cwd(), '/README.md').replace(/\\/g, '/');
    const readMeDestinationPath = path.join(releasePath, 'README.md');
    const packagFilePath = path.join(releasePath, 'package.json');
    await fs.promises.copyFile(readMeSourcePath, readMeDestinationPath);
    let version = await rl.question('Enter the version of this release: ');

    while (!versionRegex.test(version)) {
      console.warn('\nInvalid version name.\n');
      version = await rl.question('Enter the version of this release: ');
    }
    rl.close();
    await makePackageFile(version, packagFilePath);
    if (fs.existsSync(buildPath)) {
      console.warn('\nDeleting build folder...');
      await fs.promises
        .rm(buildPath, { recursive: true })
        .catch((error) => {
          console.error(
            'Error deleting folder. Try deleting the build folder manually.'
          );
          throw error;
        })
        .then(() => console.warn('Deleted build folder\n'));
    } else {
      console.warn('No existing build folder.\n');
    }
    console.warn(
      `\n\nSuccessfully built a new release version of Joor.\nVersion: ${version}\n`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    rl.close();
  }
}
void createRelease();
