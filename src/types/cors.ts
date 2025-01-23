import JoorResponse from '@/core/response';
import { ROUTE_METHOD } from '@/types/route';
import { JoorRequest } from '@/types/request';

type CORS_OPTIONS = {
  origins?: Array<string> | '*'; // Allowed origins for CORS requests, for example, ['https://example.com', 'https://example.org'] or '*' for all origins
  methods?: Array<ROUTE_METHOD> | '*'; // Allowed methods for CORS requests, for example, ['GET', 'POST'] or '*' for all methods
  allowedHeaders?: Array<string> | '*'; // Allowed headers for CORS requests, for example, ['Content-Type', 'Authorization'] or '*' for all headers
  allowsCookies?: boolean; // Whether to allow cookies (credentials) in CORS requests
  maxAge?: number; // Maximum age for CORS preflight requests
  exposedHeaders?: Array<string>; // Headers that should be exposed in CORS responses
};

// eslint-disable-next-line no-unused-vars
type CORS_RESPONSE = (request: JoorRequest) => JoorResponse | void; // Type of function returned by the cors function

export { CORS_OPTIONS, CORS_RESPONSE };
