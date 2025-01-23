interface RESPONSE_ERROR {
  code?: string;
  message?: string;
  data?: unknown;
  timeStamp?: Date;
}

type RESPONSE_STATUS = number;
type RESPONSE_MESSAGE = string;
type RESPONSE_DATA = unknown;
type RESPONSE_DATA_TYPE = 'json' | 'normal' | 'error';
interface RESPONSE_COOKIES {
  [key: string]: {
    value: string;
    options?: {
      domain?: string;
      path?: string;
      expires?: Date | string;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    };
  };
}
interface RESPONSE_HEADERS {
  [key: string]: string;
}

interface RESPONSE {
  status?: RESPONSE_STATUS;
  message?: RESPONSE_MESSAGE;
  data?: RESPONSE_DATA;
  error?: string | RESPONSE_ERROR;
  cookies?: RESPONSE_COOKIES;
  headers?: RESPONSE_HEADERS;
}

interface INTERNAL_RESPONSE {
  status: RESPONSE_STATUS;
  message: RESPONSE_MESSAGE;
  data: RESPONSE_DATA;
  headers?: RESPONSE_HEADERS;
  cookies?: RESPONSE_COOKIES;
  dataType?: RESPONSE_DATA_TYPE;
}

interface PREPARED_RESPONSE {
  headers: {
    [key: string]: string;
  };
  status: number;
  data: unknown;
  cookies: Array<string>;
}

export { RESPONSE, INTERNAL_RESPONSE, RESPONSE_DATA_TYPE, PREPARED_RESPONSE };
