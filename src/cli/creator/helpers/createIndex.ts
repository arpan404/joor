import fs from "fs";
import indexSample from "../data/index.sample.js";
export default async function createIndex(
  projectPath: string,
  language: "typescript" | "javascript"
): Promise<void> {
  try {
    const toWrite =
      language === "typescript"
        ? indexSample.replace("{##JoorType##}", ":Joor")
        : indexSample.replace("{##JoorType##}", "");
    const indexPath =
      projectPath + "/index." + language === "typescript" ? "ts" : "js";
    await fs.promises.writeFile(indexPath, toWrite);
  } catch (error: any) {
    throw error;
  }
}
