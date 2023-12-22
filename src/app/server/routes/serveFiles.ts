import * as pathModule from "path";
import fs from "fs";

import {
  ContentTypeMap,
  INTERNAL_FORMATTED_RESPONSE,
  JOORCONFIG,
} from "../../../types/app/index.js";
import Marker from "../../misc/marker.js";

// Map file extensions to corresponding content types
const contentTypeMap: ContentTypeMap = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".wma": "audio/x-ms-wma",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".7z": "application/x-7z-compressed",
  ".exe": "application/x-msdownload",
  ".bin": "application/octet-stream",
  ".dat": "application/octet-stream",
  ".psd": "application/octet-stream",
  ".torrent": "application/x-bittorrent",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

export default async function serveFiles(
  path: string,
  configData: JOORCONFIG
): Promise<boolean | INTERNAL_FORMATTED_RESPONSE> {
  let filePath = pathModule.join(process.cwd(), "app", "public", path);
  try {
    filePath = decodeURIComponent(filePath);
    const data = await fs.promises.readFile(filePath);
    let contentType = "text/plain"; // Default content type (if not found in the map)
    const ext = pathModule.extname(filePath).toLowerCase();
    contentType = contentTypeMap[ext] || contentType;
    return {
      status: 200,
      body: data,
      headers: { "Content-Type": contentType },
    };
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
    return false;
  }
}
