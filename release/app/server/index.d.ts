import { JOORCONFIG } from "../../types/app/index.js";
export declare class Server {
    private config;
    constructor(configData: JOORCONFIG | null);
    listen(): Promise<void>;
}
