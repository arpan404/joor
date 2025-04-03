import { ServerResponse } from "node:http";
import Jrror, { JoorError } from "@/core/error";
import { HeaderSent } from "@/core/error/response";
import logger from '@/helpers/joorLogger';
import Response, {RESPONSE_LOCATION_STATUS} from "@/types/response";

const response = ServerResponse.prototype as Response;

/**
 * Sets the HTTP status code for the response.
 * 
 * @param {number} status - The HTTP status code to set.
 * 
 * @returns {Response} The response object for chaining.
 * 
 * @example
 * ```typescript
 * response.status(200);
 * ```
*/
response.status = function (this: ServerResponse, status: number): Response {
    try {
        if (this.headersSent) {
            throw HeaderSent; // Headers have already been sent
        }
        if (!Number.isInteger(status)) {
            throw new Jrror({
                code: "response-status-invalid",
                message: `Status must be a integer number, but ${status} is provided.`,
                type: "error",
                docsPath: "/response",
            });
        }

        if (status < 100 || status > 999) {
            throw new Jrror({
                code: "response-status-invalid",
                message: `Status must be between 100 and 999, but ${status} is provided.`,
                type: "error",
                docsPath: "/response",
            });
        }
        this.statusCode = status;
    }
    catch (error: unknown) {
        if (error instanceof Jrror || error instanceof JoorError) {
            error.handle();
        }
        else {
            logger.error(error);
        }
    }
    finally {
        return this;
    }

}

/**
Sets a location header for the response. Used for redirection.

@param {string} location - The URL to redirect to.
@param {RESPONSE_LOCATION_STATUS} [status=301] - The HTTP status code for the redirection (default is 301).

example
```typescript
response.location('https://example.com', 302);
```
For more information, see the [HTTP/1.1 RFC](https://datatracker.ietf.org/doc/html/rfc7231#section-6.4).
*/
response.location = function (this: ServerResponse, location: string, status: RESPONSE_LOCATION_STATUS = 301): void {
    try {
        if (this.headersSent) {
            throw HeaderSent; // Headers have already been sent
        }
        this.setHeader("Location", location);
        this.status(status);
    }
    catch (error: unknown) {

        if (error instanceof Jrror || error instanceof JoorError) {
            error.handle();
        }
        else {
            logger.error(error);
        }
    }
}