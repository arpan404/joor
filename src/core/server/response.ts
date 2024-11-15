import { RESPONSE } from "./type";


class Response<T> {
  public status: RESPONSE<T>["status"] = 200;
  public message: RESPONSE<T>["message"];
  public data: RESPONSE<T>["data"];
  public error: RESPONSE<T>["error"];
  public cookies: RESPONSE<T>["cookies"];
  public headers: RESPONSE<T>["headers"];
  public session: RESPONSE<T>["session"];

  public statusCode(status:RESPONSE<T>["status"]){
    this.status = status
  }

  public send(message:RESPONSE<T>["message"]){
    this.message
  }

}
