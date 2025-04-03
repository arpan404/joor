import { ServerResponse } from 'node:http';

// Type aliases for various response components
type RESPONSE_STATUS = number;

type RESPONSE_MESSAGE = string;

type RESPONSE_DATA = unknown;

type RESPONSE_LOCATION_STATUS = 301 | 302 | 303 | 307 | 308;

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
  [key: string]: string | string[];
}

declare module 'http' {
  interface ServerResponse {
    status: (_status: RESPONSE_STATUS) => Response;
    links: (_links: Record<string, string>) => void;
    set: (_headers: RESPONSE_HEADERS) => Response;
    get: (_header: string) => string | undefined;
    header: (_header: string) => string | undefined;
    cookies: (_cookies: RESPONSE_COOKIES) => Response;
    sendStatus: (_status: RESPONSE_STATUS) => void;
    json: (_data: unknown) => void;
    send: (_data?: unknown) => void;
    redirect: ({
      _location,
      _permanent,
    }: {
      _location: string;
      _permanent?: boolean;
    }) => void;
    sendFile: (_filePath: string, _asDownload: boolean) => void;
    attachment: (_filePath: string, _filename?: string) => void;
    location: (_path: string) => void;
  }
}

interface Response extends ServerResponse {}

export default Response;

export {
  RESPONSE_STATUS,
  RESPONSE_MESSAGE,
  RESPONSE_DATA,
  RESPONSE_COOKIES,
  RESPONSE_HEADERS,
  RESPONSE_LOCATION_STATUS,
};
