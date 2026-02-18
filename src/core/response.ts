import { ServerResponse } from 'node:http';
import { jssert, handleError } from '@/core/error';
import Response, {
  RESPONSE_LOCATION_STATUS,
  RESPONSE_HEADERS,
  RESPONSE_STATUS,
  RESPONSE_COOKIES,
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

response.send = function (this: Response, data: unknown) {
  return;
};

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

/**
 * Sends a JSON response with the specified data.
 *
 * @param {unknown} _data - The data to be sent as JSON.
 * @returns {void}
 * @throws {Jrror} Throws an error if the headers have already been sent or if the data is not a valid JSON type.
 * @remarks This method sets the `Content-Type` header to `application/json` and sends the data as a JSON string.
 * The data can be of type `null`, `object`, `string`, `number`, or an array. If the data is not of a valid type, an error is thrown.
 * If the headers have already been sent, an error is thrown.
 * @example
 * ```typescript
 * response.json({ message: 'Hello, world!' });
 * ```
 * ```typescript
 * response.json([1, 2, 3]);
 * ```
 * ```typescript
 * response.json(null);
 * ```
 * ```typescript
 * response.json({ name: 'John', age: 30 });
 * ```
 */
response.json = function (this: Response, _data: unknown): void {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    this.setHeader('Content-Type', 'application/json');
    jssert(
      _data === null ||
        typeof _data === 'object' ||
        typeof _data === 'string' ||
        typeof _data === 'number' ||
        Array.isArray(_data),
      'Data must be a null, object, string, number, or array to be JSON stringified',
      '/response'
    );
    this.send(JSON.stringify(_data));
  } catch (error: unknown) {
    handleError(error);
  }
};

/**
 * Redirects the response to a specified location.
 *
 * The default status code is 301 (Moved Permanently). If the `_permanent` option is set to `false`, the status code will be changed to 302 (Found), indicating a temporary redirect.
 *
 * If you need more control over the status code or response, it is recommended to use the `location()` method to set the location, and then manually set the status code and send the response using `end()` or `send()`. This will give you the flexibility to provide a custom redirect HTML page or message.
 *
 * @param {string} _location - The URL to which the response should be redirected.
 * @param {boolean} [_permanent=true] - Whether the redirect is permanent (`301`) or temporary (`302`). Defaults to `true` (permanent).
 *
 * @example
 * ```typescript
 * response.redirect('https://example.com', false); // Redirects to example.com with a 302 status code (temporary).
 * ```
 *
 * @throws {Jrror} Throws an error if the headers have already been sent or if the `_permanent` option is not a boolean, or _location is not string or is empty.
 *
 * @remarks
 * - This method sets the `Location` header and the appropriate status code for redirection.
 * - After the headers are set, the response is sent with a basic message indicating the redirection (`"Redirecting..."`), which can be customized.
 * - To handle the redirection in a more detailed way (e.g., by sending a custom HTML page), you may use the `location()` method for setting the new location and then manually control the response using `status()`, `send()`, or `end()`.
 *
 */
response.redirect = function (
  this: Response,
  {
    _location,
    _permanent = true,
  }: {
    _location: string;
    _permanent?: boolean;
  }
): void {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(
      typeof _permanent === 'boolean',
      'Permanent must be a boolean',
      '/response'
    );
    this.location(_location);
    this.status(_permanent ? 301 : 302);
    this.send('Redirecting...'); // Todo: send a more informative redirect HTML page using view engine
  } catch (error: unknown) {
    handleError(error);
  }
};

/**
 * Sets cookies in the response using the Set-Cookie header.
 *
 * @param {RESPONSE_COOKIES} cookies - Object containing cookies to set where keys are cookie names
 * @param {string} cookies[key].value - The value of the cookie
 * @param {object} [cookies[key].options] - Optional cookie settings
 * @param {string} [cookies[key].options.domain] - Domain scope for the cookie
 * @param {string} [cookies[key].options.path] - Path scope for the cookie (defaults to '/')
 * @param {Date|string} [cookies[key].options.expires] - Cookie expiration date
 * @param {number} [cookies[key].options.maxAge] - Maximum age of the cookie in seconds
 * @param {boolean} [cookies[key].options.httpOnly] - Restricts access from JavaScript
 * @param {boolean} [cookies[key].options.secure] - Only sent over HTTPS connections
 * @param {'Strict'|'Lax'|'None'} [cookies[key].options.sameSite] - Controls cross-site request behavior
 *
 * @returns {Response} The response object for method chaining
 *
 * @throws {Jrror} If headers were already sent or cookies parameter is invalid
 *
 * @example
 * ```typescript
 * response.cookies({
 *   sessionId: {
 *     value: '123456',
 *     options: {
 *       httpOnly: true,
 *       maxAge: 3600,
 *       sameSite: 'Strict'
 *     }
 *   }
 * });
 * ```
 */
response.cookies = function (
  this: Response,
  cookies: RESPONSE_COOKIES
): Response {
  try {
    jssert(!this.headersSent, 'Headers have already been sent', '/response');
    jssert(
      typeof cookies === 'object',
      'Cookies must be an object',
      '/response'
    );

    const cookieHeaders: string[] = [];

    for (const [key, cookie] of Object.entries(cookies)) {
      if (!cookie) continue;

      // Start forming the cookie string
      let cookieStr = `${key}=${cookie.value}`;

      // Add options if they exist
      if (cookie.options) {
        const { options } = cookie;

        // Convert Date to UTC string
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }

        // Format options string
        const optionsStr = Object.entries(options)
          .map(([opt, val]) => `${opt}=${val}`)
          .join('; ');

        if (optionsStr) {
          cookieStr += `; ${optionsStr}`;
        }
      }

      cookieHeaders.push(cookieStr);
    }

    // Only set header if we have cookies to set
    if (cookieHeaders.length > 0) {
      this.setHeader('Set-Cookie', cookieHeaders);
    }
  } catch (error: unknown) {
    handleError(error);
  } finally {
    return this;
  }
};

/**
 * Deletes a specific header from the response.
 *
 * @param {string} header - The name of the header to delete.
 *
 * @example
 * ```typescript
 * response.delete('X-Custom-Header');
 * ```
 */
response.delete = function (this: Response, header: string): void {
  try {
    jssert(
      typeof header === 'string',
      'Header name must be a string',
      '/response'
    );
    this.removeHeader(header);
  } catch (error: unknown) {
    handleError(error);
  }
};
