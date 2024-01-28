import fs from "fs";
import path from "path";
import configSample from "../data/config.sample.js";
export default async function createConfig(
  projectPath: string,
  isTypescript: boolean
) {
  try {
    const lang = isTypescript ? "ts" : "js";
    const toWrite = configSample.replace("{##language##}", lang);
    const configPath = path.join(projectPath, "/joor.config.json");
    await fs.promises.writeFile(configPath, toWrite.trim());
  } catch (error: any) {
    throw error;
  }
}
