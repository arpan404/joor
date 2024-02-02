import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

const main = async () => {
  const toInstallGlobally = ["tsx", "typescript"];

  let totalInstalled = 0;

  if (console.clear) {
    console.clear();
  } else {
    process.stdout.write("\x1Bc");
  }

  console.log("\n\nSetting up the development environment for Joor.\n\n");
  console.log("\nInstalling Global Packages\n");

  for (const packageName of toInstallGlobally) {
    try {
      const command = `npm i -g ${packageName}`;
      console.log(`Installing ${packageName}...`);
      const installingResult = await exec(command);
      if (installingResult.stderr) {
        console.log(
          `Failed to install : ${packageName} Globally.\nTry running :' ${command} ' manually to install it.`,
        );
      } else {
        totalInstalled++;
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log(
    `\nInstalled ${totalInstalled}/${toInstallGlobally.length} packages successfully.\n`,
  );

  console.log("\nInstalling Joor's dependencies...\n");
  const dependenciesResult = await exec("npm i");
  if (dependenciesResult.stderr) {
    console.log(
      "\nError while installing Joor's dependencies.\n",
      dependenciesResult.stderr,
    );
  } else {
    console.log("\nAll dependencies are installed successfully.");
  }
};

main();
