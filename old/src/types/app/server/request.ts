import { IncomingMessage } from "http";

// Extending the http.IncomingMessage interface to add a custom property
declare module "http" {
  interface IncomingMessage {
    param?: string;
  }
}
// Providing custom REQUEST type by extending the IncmingMessage type provided by http
interface REQUEST extends IncomingMessage {}

export { REQUEST };
