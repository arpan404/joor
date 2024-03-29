import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

export default async function joorInstaller(projectName: string) {
  try {
    await exec(`cd ${projectName} && npm i joor@latest`);
  } catch (error: any) {
    throw error;
  }
}
