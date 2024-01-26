import fs from "fs";
import path from "path";
/**
 *
 * @param appFolder - The path to folder which contains routing files and folder
 * @description It read provided folder and return available routes in Simple format
 *
 * @example
 *
 * readDirectories("src/routes")
 *
 * @returns
 * [
 *
 *  {
 * filePath: "src/routes/api/index.ts",hasMiddleWare: false
 * },
 *
 *  {
 * filePath: "src/routes/api/user/index.ts",hasMiddleWare: true
 * }
 *
 * ]
 */
export default function readDirectories(appFolder) {
    let routesAvailable = [];
    const routeData = {
        filePath: "",
        hasMiddleWare: false,
    };
    // Listing all files and directories available in the folder
    const files = fs.readdirSync(appFolder);
    // Checking if the folder contains index.js or index.ts file
    // If the folder doesnot contain index file, the route will not be considered valid
    if (files.includes("index.js") || files.includes("index.ts")) {
        const flag = process.platform === "win32" ? "file://" : "";
        routeData.filePath =
            flag +
                path
                    .join(appFolder, files.includes("index.js") ? "index.js" : "index.ts")
                    .replace(/\\/g, "/");
    }
    // Checking if the folder contains middleware.js or middleware.ts file
    // This is to check if the route has middleware or not.
    if (files.includes("middleware.js") || files.includes("middleware.ts")) {
        routeData.hasMiddleWare = true;
    }
    // Only appending routes list if length of file name is not 0
    if (routeData.filePath.length !== 0) {
        routesAvailable = [...routesAvailable, routeData];
    }
    // Looping into other directories and appending the list of available routes
    files.forEach((file) => {
        const filePath = path.join(appFolder, file);
        if (fs.statSync(filePath).isDirectory()) {
            routesAvailable = [...routesAvailable, ...readDirectories(filePath)];
        }
    });
    return routesAvailable;
}
//# sourceMappingURL=readDirectories.js.map