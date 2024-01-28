import fs from "fs";
import packageSample from "../data/package.sample.js";
import path from "path";

export default async function createPackage(
  projectPath: string,
  isTypescript: boolean,
  name: string,
  description: string,
  version: string,
  author: string
): Promise<void> {
  try {
    const packagePath = path.join(projectPath, "/package.json");
    const mainFile = "index." + (isTypescript ? "ts" : "js");
    let toWrite = packageSample
      .replace("##Name##", name)
      .replace("##Description##", description)
      .replace("##Author##", author)
      .replace("##Version##", version)
      .replace("##MainFile##", mainFile)
      .trim();
    await fs.promises.writeFile(packagePath, toWrite);
  } catch (error: any) {
    throw error;
  }
}
