import Jrror from "@/error";
import { RESPONSE, INTERNAL_RESPONSE } from "@/core/response/type";
import httpCodes from "../http/code";

/**
 * A class whose instance must be returned from a function handling route
 * @example
 * ```typescript
 * const response = new JoorResponse();
 * response.setStatus(200).setMessage("Ok!")
 *
 * return response
 *```
 *
 * Methods available:
 *
 * - setStatus - to set status code eg. 404, 200 in the response
 * - setMessage - to set message in the response
 * - setError - to set error in the response
 * - setCookies - to set cookies in the response
 * - setHeaders - to set http headers in the response
 * - setData - to set data in the response
 * - setDataAsJson - to set data in the response as json
 *
 * Note - Use setDataAsJson even if you have to send error data. You must provide http status code to indicate the error.
 */

class JoorResponse {
  private status: RESPONSE["status"];
  private message: RESPONSE["message"];
  private error: RESPONSE["error"];
  private cookies: RESPONSE["cookies"];
  private headers: RESPONSE["headers"];
  private data: RESPONSE["data"];
  private dataType: "normal" | "error" | "json" = "normal";

  /**
   * Sets the status of the response.
   *
   * @param value - The status value to set. Must be of type number.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type number.
   */
  public setStatus(value: typeof this.status): this {
    if (typeof value !== "number") {
      throw new Jrror({
        code: "response-status-invalid",
        message: `Status can only be of type number but ${typeof value} provided`,
        type: "error",
      });
    }
    this.status = value;
    return this;
  }

  /**
   * Sets the message of the response.
   *
   * @param value - The message value to set. Must be of type string.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type string.
   */
  public setMessage(value: typeof this.message): this {
    if (typeof value !== typeof this.message) {
      throw new Jrror({
        code: "response-message-invalid",
        message: `Message can only be of type ${typeof this
          .message} but ${typeof value} provided`,
        type: "error",
      });
    }
    this.message = value;
    return this;
  }

  /**
   * Sets the cookies in the response.
   *
   * @param value - The cookies value to set. Must be of type object.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type object.
   *
   * @example
   * ```typescript
   * response.setCookies({ "cookie1": { value: "value1", options: { domain: "example.com", path: "/", expires: new Date(), httpOnly: true, secure: true, sameSite: "Strict" }});
   * ```
   */
  public setCookies(value: typeof this.cookies): this {
    if (!value) {
      throw new Jrror({
        code: "response-cookies-invalid",
        message: `Cookies cannot be null or undefined`,
        type: "error",
      });
    }
    if (typeof value !== typeof this.cookies) {
      throw new Jrror({
        code: "response-cookies-invalid",
        message: `Cookies can only be of type ${typeof this
          .cookies} but ${typeof value} provided`,
        type: "error",
      });
    }
    if (Object.keys(value).length === 0) {
      throw new Jrror({
        code: "response-cookies-invalid",
        message: `Cookies cannot be empty`,
        type: "error",
      });
    }
    this.cookies = { ...this.cookies, ...value };
    return this;
  }

  /**
   * Sets the error in the response.
   *
   * @param value - The error value to set. Must be of type string or object.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type string or object.
   *
   * @example
   * ```typescript
   * response.setError("Error message");
   * // or
   * response.setError({ code: "auth-error", message: "Failed to authorize", data: {"reason":"Invalid user token"}, timestamp: "2025-01-10T08:59:00Z" });
   * ```
   * Note: If you want to send error as json, use `setDataAsJson` method.
   * Also, you cannot set both error and data at the same time. The one you set later will override the previous one.
   */
  public setError(value: typeof this.error): this {
    if (typeof value !== typeof this.error) {
      throw new Jrror({
        code: "response-error-invalid",
        message: `Error can only be of type ${typeof this
          .error} but ${typeof value} provided`,
        type: "error",
      });
    }
    if (this.data) {
      throw new Jrror({
        code: "response-data-already-set",
        message: `Response data has already been set. You cannot set error and data at the same time. The one you set later will override the previous one.`,
        type: "warn",
      });
    }
    this.error = value;
    this.dataType = "error";
    return this;
  }

  /**
   * Sets the headers in the response.
   * @param value - The headers value to set. Must be of type object.
   * @param override - A boolean value to determine if the headers should be overridden or not. Default is false.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type object.
   * @example
   * ```typescript
   * response.setHeader{ "Content-Type": "application/json"});
   * ```
   * - Can be used to set multiple headers at once.
   * - Can be used multiple times to set different headers.
   * @example
   * ```typescript
   * response.setHeaders({ "Content-Type": "application/json"});
   * response.setHeaders({ "Authorization":"Bearer token"});
   * ```
   * Here, both headers will be set in the response.
   * - If override is set to true, the headers will be overridden.
   * @example
   * ```typescript
   * response.setHeaders({ "Content-Type": "application/json"}, override = true);
   * ```
   * Here, the previous headers will be overridden by the new headers.
   */
  public setHeader(
    value: typeof this.headers,
    override: boolean = false
  ): this {
    if (typeof value !== typeof this.headers) {
      throw new Jrror({
        code: "response-headers-invalid",
        message: `Headers can only be of type ${typeof this
          .headers} but ${typeof value} provided`,
        type: "error",
      });
    }
    if (override) {
      this.headers = value;
    } else {
      this.headers = { ...value };
    }
    return this;
  }

  /**
   * Sets the data to be sent in the response's body.
   * @param value - The data value to set. Must be of type object.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type object.
   * @example
   * ```typescript
   * response.setData({ "products": ["product1", "product2"]});
   * ```
   * - Note: If you want to send data as json, use `setDataAsJson` method.
   * - Also, you cannot set both error and data at the same time. The one you set later will override the previous one.
   */
  public setData(value: typeof this.data): this {
    if (typeof value !== typeof this.data) {
      throw new Jrror({
        code: "response-data-invalid",
        message: `Data can only be of type ${typeof this
          .data} but ${typeof value} provided`,
        type: "error",
      });
    }
    if (this.error) {
      throw new Jrror({
        code: "response-error-already-set",
        message: `Response error has already been set. You cannot set error and data at the same time. The one you set later will override the previous one.`,
        type: "warn",
      });
    }
    this.data = value;
    this.dataType = "normal";
    return this;
  }

  /**
   * Sets the data to be sent in the response's body as json.
   * @param value - The data value to set. Must be of type string.
   * @returns The current instance of the JoorResponse class.
   * @throws {Jrror} If the provided value is not of type string.
   * @example
   * ```typescript
   * response.setDataAsJson('{"products": ["product1", "product2"]}');
   * ```
   * - Note: If you want to send data as object or string, use `setData` method.
   * - Also, you cannot set both error and data at the same time. The one you set later will override the previous one.
   */
  public setDataAsJson(value: typeof this.data): this {
    if (this.data) {
      throw new Jrror({
        code: "response-data-already-set",
        message: `Response data has already been set. Use setDataAsJson only if you want to send data as json.`,
        type: "warn",
      });
    }
    if (this.error) {
      throw new Jrror({
        code: "response-error-already-set",
        message: `Response error has already been set. You cannot set error and json data at the same time. The one you set later will override the previous one.`,
        type: "warn",
      });
    }
    try {
      this.data = JSON.parse(value as string);
    } catch (e) {
      throw new Jrror({
        code: "response-json_data-invalid",
        message: `Failed to parse the json data in the response object.`,
        type: "error",
      });
    }
    this.dataType = "json";
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
    if (this.status) {
      response.status = this.status;
    } else {
      if (this.dataType === "error") {
        response.status = 500;
      } else {
        response.status = 200;
      }
    }

    if (this.message) {
      response.message = this.message;
    } else {
      if (httpCodes[response.status]) {
        response.message = httpCodes[response.status];
      } else {
        if (this.dataType === "error") {
          response.message = "Internal Server Error";
        } else {
          response.message = "OK";
        }
      }
    }

    if (this.cookies) {
      response.cookies = this.cookies;
    }

    if (this.headers) {
      response.headers = this.headers;
    }

    if (this.dataType === "error" && this.error) {
      response.data = this.error;
    } else if (
      this.data &&
      (this.dataType === "normal" || this.dataType === "json")
    ) {
      response.data = this.data;
      if (this.dataType === "json") {
        response.headers = {
          ...response.headers,
          "Content-Type": "application/json",
        };
      }
    } else {
      response.data = null;
    }

    return response;
  }
}

export default JoorResponse;
