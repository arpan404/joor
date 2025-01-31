import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import httpCodes from '@/data/httpCodes';
import {
  INTERNAL_RESPONSE,
  RESPONSE,
  RESPONSE_DATA_TYPE,
} from '@/types/response';

/**
 * A class to construct and manage HTTP responses.
 *
 * @example
 * ```typescript
 * const response = new JoorResponse();
 * response.setStatus(200).setMessage("Ok!");
 * return response;
 * ```
 *
 *  * Available methods:
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
  private status: RESPONSE['status']; // HTTP status code
  private message: RESPONSE['message']; // Response message
  private error: RESPONSE['error']; // Error message or object
  private cookies: RESPONSE['cookies']; // Cookies to be included in the response
  private headers: RESPONSE['headers']; // Response headers
  private data: RESPONSE['data']; // Response data
  private dataType: RESPONSE_DATA_TYPE = 'normal'; // Data type (normal, json, error)

  /**
   * Sets the status code for the response.
   * @param status The HTTP status code to set.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the status is not a valid number.
   */
  public setStatus(status: RESPONSE['status']): JoorResponse {
    try {
      if (typeof status !== 'number') {
        throw new Jrror({
          code: 'response-status-invalid',
          message: `Status must be a number, but ${typeof status} was provided.`,
          type: 'error',
        });
      }
      this.status = status;
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

    return this;
  }

  /**
   * Sets the headers for the response.
   * @param headers The headers to set.
   * @param override Whether to override the existing headers. Defaults to false.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the headers are not an object.
   */
  public setHeaders(
    headers: typeof this.headers,
    override: boolean = false
  ): JoorResponse {
    try {
      if (typeof headers !== 'object') {
        throw new Jrror({
          code: 'response-headers-invalid',
          message: `Headers must be an object, but ${typeof headers} was provided.`,
          type: 'error',
        });
      }

      if (override) {
        this.headers = { ...headers };
      } else {
        this.headers = { ...this.headers, ...headers };
      }
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

    return this;
  }

  /**
   * Sets the cookies for the response.
   * @param cookies The cookies to set.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the cookies are invalid.
   */
  public setCookies(cookies: typeof this.cookies): JoorResponse {
    try {
      if (!cookies) {
        throw new Jrror({
          code: 'response-cookies-invalid',
          message: `Cookies cannot be null or undefined.`,
          type: 'error',
        });
      }

      if (typeof cookies !== 'object' || Object.keys(cookies).length === 0) {
        throw new Jrror({
          code: 'response-cookies-invalid',
          message: `Cookies must be a non-empty object.`,
          type: 'error',
        });
      }
      this.cookies = { ...this.cookies, ...cookies };
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

    return this;
  }

  /**
   * Sets the message for the response.
   * @param value The message to set.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the message is not a string.
   */
  public setMessage(value: typeof this.message): JoorResponse {
    try {
      if (typeof value !== 'string') {
        throw new Jrror({
          code: 'response-message-invalid',
          message: `Message must be a string, but ${typeof value} was provided.`,
          type: 'error',
        });
      }
      this.message = value;
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

    return this;
  }

  /**
   * Sets the error for the response.
   * @param error The error message or object to set.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the error is not a valid type or if data has already been set.
   */
  public setError(error: typeof this.error): JoorResponse {
    try {
      if (typeof error !== 'string' && typeof error !== 'object') {
        throw new Jrror({
          code: 'response-error-invalid',
          message: `Error must be a string or object, but ${typeof error} was provided.`,
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
      this.error = error;
      this.dataType = 'error';
    } catch (e: unknown) {
      if (e instanceof Jrror || e instanceof JoorError) {
        e.handle();
      }
    }

    return this;
  }

  /**
   * Sets the data for the response.
   * @param data The data to set.
   * @returns The current JoorResponse instance.
   * @throws Jrror if data is not valid or if error has already been set.
   */
  public setData(data: typeof this.data): JoorResponse {
    try {
      if (this.error) {
        throw new Jrror({
          code: 'response-error-already-set',
          message: `Error has already been set. You cannot set both error and data simultaneously.`,
          type: 'warn',
        });
      }
      this.data = data;
      this.dataType = 'normal';
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

    return this;
  }

  /**
   * Sets the data as JSON.
   * @param value The value to be converted to JSON.
   * @returns The current JoorResponse instance.
   * @throws Jrror if the value cannot be converted to JSON.
   */
  public setDataAsJson(value: typeof this.data): JoorResponse {
    try {
      if (typeof value !== 'object') {
        throw new Jrror({
          code: 'response-json-invalid',
          message: `JSON data must be an object, but ${typeof value} was provided.`,
          type: 'error',
        });
      }
      this.data = this.data;
      this.dataType = 'json';
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      }
    }

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
   *   dataType?: 'json' | 'normal' | 'error'
   * }
   * ```
   */
  public parseResponse(): INTERNAL_RESPONSE {
    const response = {
      status: 200,
      message: 'OK',
      data: undefined,
      headers: undefined,
      cookies: undefined,
      dataType: 'normal',
    } as INTERNAL_RESPONSE;
    response.status = this.status ?? (this.dataType === 'error' ? 500 : 200);
    response.message =
      this.message ??
      httpCodes[response.status] ??
      (this.dataType === 'error' ? 'Internal Server Error' : 'OK');
    response.cookies = this.cookies;
    response.headers = this.headers;
    response.data =
      this.dataType === 'error' ? this.error : this.data || undefined;
    if (this.dataType === 'json') {
      response.headers = {
        ...response.headers,
        'Content-Type': 'application/json',
      };
    }
    response.dataType = this.dataType;
    return response;
  }
}

export default JoorResponse;
