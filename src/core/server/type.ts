import { IncomingMessage } from "http";

declare namespace http {
  interface IncmingMessage {
    param?: string;
  }
}
interface REQUEST extends IncomingMessage {}

// type RESPONSE<T> = {
//   status: number;
//   message?: string;
//   data?: T;
//   error?: string | JOOR_ERROR;
//   cookies?: { [key: string]: string };
//   headers?: { [key: string]: string };
//   session?: string;
// };

export { REQUEST };
