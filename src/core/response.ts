import { ServerResponse } from "node:http";
import { jssert, handleError } from "@/core/error";
import Response, { RESPONSE_LOCATION_STATUS, RESPONSE_HEADERS } from "@/types/response";
import mime from 'mime-types';
import logger from "@/helpers/joorLogger";
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
response.status = function (this: Response, status: number): Response {
    try {
        jssert(!this.headersSent, "Headers have already been sent", "/response");
        jssert(Number.isInteger(status), `Status must be a integer number, but ${status} is provided.`, "/response");
        jssert(status >= 100 && status <= 999, `Status must be between 100 and 999, but ${status} is provided.`, "/response");
        this.statusCode = status;
    }
    catch (error: unknown) {
        handleError(error);
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
response.location = function (this: Response, location: string, status: RESPONSE_LOCATION_STATUS = 301): void {
    try {
        jssert(!this.headersSent, "Headers have already been sent", "/response");
        jssert(typeof location === "string", "Location must be a string", "/response");
        jssert(location.trim().length > 0, "Location must not be empty", "/response");
        jssert(status >= 300 && status <= 308, "Status must be between 300 and 308", "/response");
        this.setHeader("Location", location);
        this.status(status);
    }
    catch (error: unknown) {
        handleError(error);
    }
}

/**
 * 
 * 
 */

response.set = function (this: Response, headers: RESPONSE_HEADERS): Response {
    try {
        jssert(!this.headersSent, "Headers have already been sent", "/response");
        jssert(typeof headers === "object", "Headers must be an object", "/response");
        for (let [headerName, headerValue] of Object.entries(headers)) {
            if (headerValue === undefined) {
                logger.warn(`Header ${headerName} is undefined. Skipping...`);
                continue;
            }
            if (headerName.toLowerCase() === 'content-type') {
                jssert(!Array.isArray(headerValue), "Content-Type header cannot be an array", "/response");
                headerValue = mime.contentType(String(headerValue)) || headerValue;
            }
            this.setHeader(headerName, headerValue);
        }
    } catch (error: unknown) {
        handleError(error);
    }
    finally {
        return this;
    }

}

/**
 * Get the value of a specific header from the response.
 * 
 * @param {string} headerName - The name of the header to retrieve.
 * @returns {string | undefined} The value of the header, or undefined if not set.
 */
response.get = function (this: Response, headerName: string): string | undefined {
    try {
        jssert(typeof headerName === "string", "Header name must be a string", "/response");
        return this.getHeader(headerName) as string || undefined;
    } catch (error: unknown) {
        handleError(error);
    }
    finally {
        return undefined;
    }
}
