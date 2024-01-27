import fs from "fs";
import packageSample from "../data/package.sample.js";

export default async function createPackage(
  projectPath: string,
  language: "typescript" | "javascript",
  name: string,
  description: string,
  version: string,
  author: string
): Promise<void> {
  try {
    const packagePath = projectPath + "/package.json";
    const mainFile = "main." + language === "typescript" ? "ts" : "js";
    let toWrite = packageSample
      .replace("##Name##", name)
      .replace("##Description##", description)
      .replace("##Author##", author)
      .replace("##Version##", version)
      .replace("##MainFile##", mainFile);
    await fs.promises.writeFile(packagePath, toWrite);
  } catch (error: any) {
    throw error;
  }
}
