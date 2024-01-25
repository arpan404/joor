import { AVAILABLE_ROUTE } from "../../../types/app/index.js";
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
export default function readDirectories(appFolder: string): Array<AVAILABLE_ROUTE>;
