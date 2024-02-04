import fs from "fs";
import path from "path";
import { REQUEST, JOORCONFIG } from "../../../types/app/index.js";
import Marker from "../../misc/marker.js";

export default async function handleFileUpload(
  request: REQUEST,
  configData: JOORCONFIG,
): Promise<void> {
  try {
    let data = "";
    let boundary = "";

    //Extract boundary from content-type header
    const contentType = request.headers["content-type"];
    if (contentType && contentType.includes("multipart/form-data")) {
      boundary = contentType.split("; ")[1].split("=")[1];
    } else {
      return;
    }

    request.on("data", (chunk) => {
      data += chunk.toString();
    });

    request.on("end", async () => {
      try {
        const parts = data.split(`--${boundary}`).filter((part) => part.trim());
        const uploadedFiles = [];
        for (const part of parts) {
          const match = part.match(/filename="(.+?)"/);
          if (match) {
            const fileName = match[1];
            const fileContent = part.split("\r\n\r\n")[1].slice(0, -2);
            const filePath = path.join(
              process.cwd(),
              "app",
              "upload",
              fileName,
            );
            await fs.promises.writeFile(filePath, fileContent, "binary");
            uploadedFiles.push(filePath);
          }
        }
        request.uploadedFiles = uploadedFiles;
        return;
      } catch (error) {
        throw error;
      }
    });
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
  }
}
