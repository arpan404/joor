import { JOORCONFIG } from "../../types/app/index.js";
export declare class Config {
    private static configFile;
    static configData: JOORCONFIG | null;
    private static load;
    static get(): Promise<JOORCONFIG | null>;
}
