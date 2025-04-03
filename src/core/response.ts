import { ServerResponse } from 'node:http';
import { jssert, handleError } from '@/core/error';
import Response, {
  RESPONSE_LOCATION_STATUS,
  RESPONSE_HEADERS,
  RESPONSE_STATUS,
} from '@/types/response';
import mime from 'mime-types';
import logger from '@/helpers/joorLogger';
import httpCodes from '@/data/httpCodes';
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
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(
      Number.isInteger(status),
      `Status must be a integer number, but ${status} is provided.`,
      '/response'
    );
    jssert(
      status >= 100 && status <= 999,
      `Status must be between 100 and 999, but ${status} is provided.`,
      '/response'
    );
    this.statusCode = status;
  } catch (error: unknown) {
    handleError(error);
  } finally {
    return this;
  }
};

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
response.location = function (
  this: Response,
  location: string,
  status: RESPONSE_LOCATION_STATUS = 301
): void {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(
      typeof location === 'string',
      'Location must be a string',
      '/response'
    );
    jssert(
      location.trim().length > 0,
      'Location must not be empty',
      '/response'
    );
    jssert(
      status >= 300 && status <= 308,
      'Status must be between 300 and 308',
      '/response'
    );
    this.setHeader('Location', location);
    this.status(status);
  } catch (error: unknown) {
    handleError(error);
  }
};

/**
 *
 *
 */

response.set = function (this: Response, headers: RESPONSE_HEADERS): Response {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(
      typeof headers === 'object',
      'Headers must be an object',
      '/response'
    );
    for (let [headerName, headerValue] of Object.entries(headers)) {
      if (headerValue === undefined) {
        logger.warn(`Header ${headerName} is undefined. Skipping...`);
        continue;
      }
      if (headerName.toLowerCase() === 'content-type') {
        jssert(
          !Array.isArray(headerValue),
          'Content-Type header cannot be an array',
          '/response'
        );
        headerValue = mime.contentType(String(headerValue)) || headerValue;
      }
      this.setHeader(headerName, headerValue);
    }
  } catch (error: unknown) {
    handleError(error);
  } finally {
    return this;
  }
};

/**
 * Get the value of a specific header from the response.
 *
 * @param {string} headerName - The name of the header to retrieve.
 * @returns {string | undefined} The value of the header, or undefined if not set.
 */
response.get = function (
  this: Response,
  headerName: string
): string | undefined {
  try {
    jssert(
      typeof headerName === 'string',
      'Header name must be a string',
      '/response'
    );
    return (this.getHeader(headerName) as string) || undefined;
  } catch (error: unknown) {
    handleError(error);
  } finally {
    return undefined;
  }
};

/**
 * Sets the `Link` header for the response.
 *
 * @param {Record<string, string>} links - An object representing the links to set, where the key is the rel attribute and the value is the URL.
 *
 * @returns {Response} The response object for chaining.
 *
 * @example
 * ```typescript
 * response.links({ self: '/api/resource', next: '/api/resource?page=2' });
 * ```
 */
response.links = function (
  this: Response,
  links: Record<string, string>
): Response {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(typeof links === 'object', 'Links must be an object', '/response');
    const existingLink = this.get('Link') || '';
    const newLinks = Object.entries(links)
      .map(([rel, url]) => `<${url}>; rel="${rel}"`)
      .join(', ');
    this.set({
      Link: existingLink ? `${existingLink}, ${newLinks}` : newLinks,
    });
  } catch (error: unknown) {
    handleError(error);
  } finally {
    return this;
  }
};

response.send = function (_this: Response, data: unknown) {};

/**
 * Sends a response with the specified status code and message.
 * @example
 * ```typescript
 * response.sendStatus(200);
 * ```
 * @param {RESPONSE_STATUS} _status - The HTTP status code to send.
 * @returns {void}
 * @throws {Jrror} Throws an error if the status code is invalid or if headers have already been sent.
 * @remarks This method sets the status code and sends a response with the corresponding status message.
 * The status message is determined based on the provided status code. If the status code is not recognized, it defaults to the string representation of the status code.
 */
response.sendStatus = function (
  this: Response,
  _status: RESPONSE_STATUS
): void {
  this.status(_status); // Set the status code
  const statusMessage = httpCodes[_status] || String(_status);
  this.send(statusMessage);
};

