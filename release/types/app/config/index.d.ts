import { PARSEJSON, PORT, CORS, URLENCODED, MODE, DOLOGS } from "./data.js";
export interface JOORCONFIG {
    port: PORT;
    parseJson?: PARSEJSON;
    cors?: CORS;
    urlEncoded?: URLENCODED;
    allowedURL?: string[];
    mode: MODE;
    doLogs?: DOLOGS;
    saltRounds?: number;
}
