import { INTERNAL_FORMATTED_RESPONSE, JOORCONFIG } from "../../../types/app/index.js";
/**
 * Function to serve files inside app/public folder.
 * @param path - Requested URL of file
 * @param configData - Config Data loaded from joor.config.json file
 * @returns false - If file is not found; Response - If file is found.
 */
export default function serveFiles(path: string, configData: JOORCONFIG): Promise<boolean | INTERNAL_FORMATTED_RESPONSE>;
