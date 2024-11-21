import Jrror from "../../error";
import { RESPONSE } from "./type";
/**
 * A class whose instance must be returned from a function handling route
 * @example
 * ```typescript
 * const response = new Response();
 * response.setStatus(200).setMessage("Ok!")
 *
 * return response
 *
 * 
 * Methods available:
 * setStatus - to set status code eg. 404, 200 in the response
 * setMessage - to set message in the response
 * setError - to set error in the response
 * setCookies - to set cookies in the response
 * setHeaders - to set http headers in the response
 * setSession - to set session data in the response
 */
class Response {
  private status: RESPONSE["status"];
  private message: RESPONSE["message"];
  private error: RESPONSE["error"];
  private cookies: RESPONSE["cookies"];
  private headers: RESPONSE["headers"];
  private session: RESPONSE["session"];
  private data: RESPONSE["data"]

  public setStatus(value: typeof this.status): this {
    if (typeof value !== "number") {
      throw new Jrror({
        errorCode: "response-status-invalid",
        message: `Status can only be of type number but ${typeof value} provided`,
        type: "error",
      });
    }
    this.status = value;
    return this;
  }
  public setMessage(value: typeof this.message): this {
    this.message = value;
    return this;
  }
  public setError(value: typeof this.error): this {
    this.error = value;
    return this;
  }

  public setCookies(value: typeof this.cookies): this {
    this.cookies = value;
    return this;
  }
  public setHeaders(value: typeof this.headers): this {
    this.headers = value;
    return this;
  }
  public setSession(value: typeof this.session): this {
    this.session = value;
    return this;
  }

//   public setData(value: typeof this.session, )
}
export default Response;
