// Type aliases for various response components
type RESPONSE_STATUS = number;

type RESPONSE_MESSAGE = string;

type RESPONSE_DATA = unknown;

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

export {
  RESPONSE_STATUS,
  RESPONSE_MESSAGE,
  RESPONSE_DATA,
  RESPONSE_COOKIES,
  RESPONSE_HEADERS,
};
