import { error } from './../../../node_modules/@commitlint/config-validator/node_modules/ajv/lib/vocabularies/applicator/dependencies';
import Jrror from '@/error';
import {
  RESPONSE,
  INTERNAL_RESPONSE,
  RESPONSE_DATA_TYPE,
} from '@/types/response';
import httpCodes from '@/data/httpCodes';

/**
 * A class to construct and manage HTTP responses.
 * @example
 * ```typescript
 * const response = new JoorResponse();
 * response.setStatus(200).setMessage("Ok!");
 * return response;
 * ```
 *
 * Available methods:
 * - setStatus: Sets the HTTP status code (e.g., 200, 404).
 * - setMessage: Sets the response message.
 * - setError: Sets an error message or object.
 * - setCookies: Sets cookies in the response.
 * - setHeaders: Sets HTTP headers in the response.
 * - setData: Sets data in the response.
 * - setDataAsJson: Sets data in the response as JSON.
 *
 * Note: Use `setDataAsJson` for sending JSON data. Provide an HTTP status code to indicate errors.
 */
class JoorResponse {
  private status: RESPONSE['status'];
  private message: RESPONSE['message'];
  private error: RESPONSE['error'];
  private cookies: RESPONSE['cookies'];
  private headers: RESPONSE['headers'];
  private data: RESPONSE['data'];
  private dataType: RESPONSE_DATA_TYPE = 'normal';

  /**
   * Sets the HTTP status code for the response.
   * @param value - The status code to set (must be a number).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not a number.
   */
  public setStatus(value: typeof this.status): this {
    if (typeof value !== 'number') {
      throw new Jrror({
        code: 'response-status-invalid',
        message: `Status must be a number, but ${typeof value} was provided.`,
        type: 'error',
      });
    }
    this.status = value;
    return this;
  }

  /**
   * Sets the response message.
   * @param value - The message to set (must be a string).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not a string.
   */
  public setMessage(value: typeof this.message): this {
    if (typeof value !== 'string') {
      throw new Jrror({
        code: 'response-message-invalid',
        message: `Message must be a string, but ${typeof value} was provided.`,
        type: 'error',
      });
    }
    this.message = value;
    return this;
  }

  /**
   * Sets cookies in the response.
   * @param value - The cookies to set (must be an object).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not an object or is empty.
   * @example
   * ```typescript
   * response.setCookies({ "cookie1": { value: "value1", options: { domain: "example.com", path: "/", expires: new Date(), httpOnly: true, secure: true, sameSite: "Strict" }});
   * ```
   */
  public setCookies(value: typeof this.cookies): this {
    if (!value) {
      throw new Jrror({
        code: 'response-cookies-invalid',
        message: `Cookies cannot be null or undefined.`,
        type: 'error',
      });
    }
    if (typeof value !== 'object' || Object.keys(value).length === 0) {
      throw new Jrror({
        code: 'response-cookies-invalid',
        message: `Cookies must be a non-empty object.`,
        type: 'error',
      });
    }
    this.cookies = { ...this.cookies, ...value };
    return this;
  }

  /**
   * Sets an error message or object in the response.
   * @param value - The error to set (must be a string or object).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not a string or object.
   * @example
   * ```typescript
   * response.setError("Error message");
   * // or
   * response.setError({ code: "auth-error", message: "Failed to authorize", data: {"reason":"Invalid user token"}, timestamp: "2025-01-10T08:59:00Z" });
   * ```
   * Note: Use `setDataAsJson` for sending error data as JSON. You cannot set both error and data simultaneously.
   */
  public setError(value: typeof this.error): this {
    if (typeof value !== 'string' && typeof value !== 'object') {
      throw new Jrror({
        code: 'response-error-invalid',
        message: `Error must be a string or object, but ${typeof value} was provided.`,
        type: 'error',
      });
    }
    if (this.data) {
      throw new Jrror({
        code: 'response-data-already-set',
        message: `Data has already been set. You cannot set both error and data simultaneously.`,
        type: 'warn',
      });
    }
    this.error = value;
    this.dataType = 'error';
    return this;
  }

  /**
   * Sets HTTP headers in the response.
   * @param value - The headers to set (must be an object).
   * @param override - Whether to override existing headers (default is false).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not an object.
   * @example
   * ```typescript
   * response.setHeaders({ "Content-Type": "application/json", "Authorization": "Bearer token" });
   * ```
   */
  public setHeaders(
    value: typeof this.headers,
    override: boolean = false
  ): this {
    if (typeof value !== 'object') {
      throw new Jrror({
        code: 'response-headers-invalid',
        message: `Headers must be an object, but ${typeof value} was provided.`,
        type: 'error',
      });
    }
    if (override) {
      this.headers = { ...value };
    } else {
      this.headers = { ...this.headers, ...value };
    }
    return this;
  }

  /**
   * Sets data in the response body.
   * @param value - The data to set (must be an object).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not an object.
   * @example
   * ```typescript
   * response.setData({ "products": ["product1", "product2"] });
   * ```
   * Note: Use `setDataAsJson` for sending data as JSON. You cannot set both error and data simultaneously.
   */
  public setData(value: typeof this.data): this {
    if (typeof value !== 'object') {
      throw new Jrror({
        code: 'response-data-invalid',
        message: `Data must be an object, but ${typeof value} was provided.`,
        type: 'error',
      });
    }
    if (this.error) {
      throw new Jrror({
        code: 'response-error-already-set',
        message: `Error has already been set. You cannot set both error and data simultaneously.`,
        type: 'warn',
      });
    }
    this.data = value;
    this.dataType = 'normal';
    return this;
  }

  /**
   * Sets data in the response body as JSON.
   * @param value - The JSON data to set (must be a string).
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not a string or cannot be parsed as JSON.
   * @example
   * ```typescript
   * response.setDataAsJson('{"products": ["product1", "product2"]}');
   * ```
   * Note: Use `setData` for sending data as an object. You cannot set both error and data simultaneously.
   */
  public setDataAsJson(value: typeof this.data): this {
    if (this.data) {
      throw new Jrror({
        code: 'response-data-already-set',
        message: `Data has already been set. Use setDataAsJson only for JSON data.`,
        type: 'warn',
      });
    }
    if (this.error) {
      throw new Jrror({
        code: 'response-error-already-set',
        message: `Error has already been set. You cannot set both error and JSON data simultaneously.`,
        type: 'warn',
      });
    }
    try {
      this.data = JSON.parse(value as string);
    } catch (error) {
      throw new Jrror({
        code: 'response-json_data-invalid',
        message: `Failed to parse JSON data.\n${error}`,
        type: 'error',
      });
    }
    this.dataType = 'json';
    return this;
  }

  /**
   * Parses the response object for internal use.
   * This method is not intended for external use.
   * @returns {INTERNAL_RESPONSE} - The parsed response object.
   * @example
   * ```typescript
   * {
   *   status: number,
   *   message: string,
   *   data: object | null,
   *   cookies?: object,
   *   headers?: object
   * }
   * ```
   */
  public parseResponse(): INTERNAL_RESPONSE {
    const response = {} as INTERNAL_RESPONSE;
    response.status = this.status || (this.dataType === 'error' ? 500 : 200);
    response.message =
      this.message ||
      httpCodes[response.status] ||
      (this.dataType === 'error' ? 'Internal Server Error' : 'OK');
    response.cookies = this.cookies;
    response.headers = this.headers;
    response.data = this.dataType === 'error' ? this.error : this.data || null;

    if (this.dataType === 'json') {
      response.headers = {
        ...response.headers,
        'Content-Type': 'application/json',
      };
    }

    return response;
  }
}

export default JoorResponse;
