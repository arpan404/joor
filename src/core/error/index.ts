import JrrorHandler from "./handler";
import errorList from "./list";
import { JOOR_ERROR } from "./type";

class JoorError extends Error {
  public errorCode: JOOR_ERROR["errorCode"];
  public type: JOOR_ERROR["type"];

  constructor({
    message,
    errorCode,
    type,
  }: {
    message: JOOR_ERROR["message"];
    errorCode: JOOR_ERROR["errorCode"];
    type: JOOR_ERROR["type"];
  }) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.type = type;

    Object.setPrototypeOf(this, JoorError.prototype);
  }
}

class Jrror extends JoorError {
  constructor(errorCode: JOOR_ERROR["errorCode"]) {
    const errorInfo = errorList[errorCode];

    if (!errorInfo) {
      throw new Error(`Error code ${errorCode} is not defined in errorList.`);
    }

    super({
      errorCode: errorCode,
      message: errorInfo.message,
      type: errorInfo.type,
    });
  }
}

export default Jrror;
export { JrrorHandler };
