import {
    PARSEJSON,
    PORT,
    CORS,
    URLENCODED,
    LANGUAGE,
    MODE,
    DOLOGS,
  } from "./data";
  
  export interface JOORCONFIG {
    port?: PORT;
    parseJson?: PARSEJSON;
    cors?: CORS;
    urlEncoded?: URLENCODED;
    allowedURL?: string[];
    language: LANGUAGE;
    mode: MODE;
    doLogs?: DOLOGS;
    saltRounds?: number;
  }
  