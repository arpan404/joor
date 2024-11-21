import Jrror from "../../error";
import { RESPONSE } from "./type";

class Response {
  private status: RESPONSE["status"];
  private message: RESPONSE["message"];
  private error: RESPONSE["error"];
  private cookies: RESPONSE["cookies"];
  private headers: RESPONSE["headers"];
  private session: RESPONSE["session"];

  public setStatus(value: typeof this.status): this {
    if (typeof value !== "number") {
    //   throw new Jrror("response-e1");
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
}
export default Response;
