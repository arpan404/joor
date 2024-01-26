/// <reference types="node/http.js" />
import { IncomingMessage } from "http";
declare module 'http' {
    interface IncomingMessage {
        param?: string;
    }
}
interface REQUEST extends IncomingMessage {
}
export { REQUEST };
