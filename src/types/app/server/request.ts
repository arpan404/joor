import { IncomingMessage } from "http";

// Providing custom REQUEST type by extending the IncmingMessage type provided by http
interface REQUEST extends IncomingMessage {}

export { REQUEST };
