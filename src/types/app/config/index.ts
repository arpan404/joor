import {
    PARSEJSON,
    PORT,
    CORS,
    URLENCODED,
    MODE,
    DOLOGS,
  } from "./data.js";
  
  // This is the type of the config object that is stored in the joor.config.json file
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
  