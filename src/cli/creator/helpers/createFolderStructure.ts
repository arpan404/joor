import fs from "fs";
import directories from "../data/directories.js";
import { Directory } from "../../../types/cli/index.js";
import path from "path";
export function createDirectory(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}
export default function createFolderStructure(
  projectDirectory: string,
  isTypescript: boolean
) {
  directories.forEach((d: Directory) => {
    const directoryPath = path.join(projectDirectory, d.path);
    if (d.name === "types") {
      if (isTypescript) createDirectory(directoryPath);
    } else {
      createDirectory(directoryPath);
    }
  });
}
