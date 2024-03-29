import fs from "fs";
import indexSample from "../data/index.sample.js";
import path from "path";
export default async function createIndex(
  projectPath: string,
  isTypescript: boolean
): Promise<void> {
  try {
    const toWrite = isTypescript
      ? indexSample.replace("{##JoorType##}", ": Joor")
      : indexSample.replace("{##JoorType##}", "");
    const fileName = "/index." + (isTypescript ? "ts" : "js");
    const indexPath = path.join(projectPath, fileName);
    await fs.promises.writeFile(indexPath, toWrite.trim());
  } catch (error: any) {
    throw error;
  }
}
