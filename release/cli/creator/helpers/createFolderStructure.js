import fs from "fs";
import directories from "../data/directories.js";
import path from "path";
export function createDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
}
export default function createFolderStructure(projectDirectory, isTypescript) {
    directories.forEach((d) => {
        const directoryPath = path.join(projectDirectory, d.path);
        if (d.name === "types") {
            if (isTypescript)
                createDirectory(directoryPath);
        }
        else {
            createDirectory(directoryPath);
        }
    });
}
//# sourceMappingURL=createFolderStructure.js.map