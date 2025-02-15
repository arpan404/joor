// Interface for error details in a response
interface RESPONSE_ERROR {
  code?: string;
  message?: string;
  data?: unknown;
  timeStamp?: Date;
}

// Type aliases for various response components
type RESPONSE_STATUS = number;

type RESPONSE_MESSAGE = string;

type RESPONSE_DATA = unknown;

interface RESPONSE_DATA_TYPE {
  type: 'normal' | 'json' | 'error' | 'binary';
  isStream: boolean;
  isFile: boolean;
  isDownload?: boolean;
  filePath?: string;
}

// Interface for response cookies
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

// Interface for response headers
interface RESPONSE_HEADERS {
  [key: string]: string | number;
}

// Interface for the main response structure used by the JoorResponse class
interface RESPONSE {
  status?: RESPONSE_STATUS;
  message?: RESPONSE_MESSAGE;
  data?: RESPONSE_DATA;
  error?: string | RESPONSE_ERROR;
  cookies?: RESPONSE_COOKIES;
  headers?: RESPONSE_HEADERS;
}

// Interface for internal response structure used to prepare response data for sending
interface INTERNAL_RESPONSE {
  status: RESPONSE_STATUS;
  message: RESPONSE_MESSAGE;
  data: RESPONSE_DATA;
  headers?: RESPONSE_HEADERS;
  cookies?: RESPONSE_COOKIES;
  dataType: RESPONSE_DATA_TYPE;
}

// Interface for the final prepared response data to be sent to the client
interface PREPARED_RESPONSE {
  headers: RESPONSE_HEADERS;
  status: RESPONSE_STATUS;
  data: unknown;
  cookies: Array<string>;
  httpMessage: string;
  dataType: RESPONSE_DATA_TYPE;
}

export {
  RESPONSE,
  INTERNAL_RESPONSE,
  RESPONSE_DATA_TYPE,
  PREPARED_RESPONSE,
  RESPONSE_COOKIES,
};
