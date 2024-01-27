import fs from "fs";
import configSample from "../data/config.sample.js";
export default async function createConfig(
  projectPath: string,
  language: "typescript" | "javascript"
) {
  try {
    const lang = language === "typescript" ? "ts" : "js";
    const toWrite = configSample.replace("{##language##}", lang);
    const configPath = projectPath + "/joor.config.json";
    await fs.promises.writeFile(configPath, toWrite);
  } catch (error: any) {
    throw error;
  }
}
