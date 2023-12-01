import { JOORCONFIG } from "types/app/config/index.js";
import http from "http"
export async function servePort(configData: JOORCONFIG) {
    const isUnderDevelopment =configData.mode === "development" ? true : false;
}