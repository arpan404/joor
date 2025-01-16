type RESPONSE_ERROR = {
  code?: string;
  message?: string;
  data?: unknown;
  timeStamp?: Date;
};

type RESPONSE_STATUS = number;
type RESPONSE_MESSAGE = string;
type RESPONSE_DATA = unknown;
type RESPONSE_COOKIES = {
  [key: string]: {
    value: string;
    options?: {
      domain?: string;
      path?: string;
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    };
  };
};
type RESPONSE_HEADERS = { [key: string]: string };

type RESPONSE = {
  status?: RESPONSE_STATUS;
  message?: RESPONSE_MESSAGE;
  data?: RESPONSE_DATA;
  error?: string | RESPONSE_ERROR;
  cookies?: RESPONSE_COOKIES;
  headers?: RESPONSE_HEADERS;
};

type INTERNAL_RESPONSE = {
  status: RESPONSE_STATUS;
  message: RESPONSE_MESSAGE;
  data: RESPONSE_DATA;
  headers?: RESPONSE_HEADERS;
  cookies?: RESPONSE_COOKIES;
};

export { RESPONSE, INTERNAL_RESPONSE };
