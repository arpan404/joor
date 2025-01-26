import JoorResponse from '@/core/response';
import { ROUTE_METHOD } from '@/types/tt';
import { JoorRequest } from '@/types/request';

interface CORS_OPTIONS {
  origins?: Array<string> | ['*']; // Allowed origins for CORS requests, for example, ['https://example.com', 'https://example.org'] or ['*'] and '*' for all origins
  methods?: Array<ROUTE_METHOD> | ['*']; // Allowed methods for CORS requests, for example, ['GET', 'POST'] or ['*'] and '*' for all methods
  allowedHeaders?: Array<string> | ['*']; // Allowed headers for CORS requests, for example, ['Content-Type', 'Authorization'] or ['*'] and '*' for all headers
  allowsCookies?: boolean; // Whether to allow cookies (credentials) in CORS requests
  maxAge?: number; // Maximum age for CORS preflight requests
  exposedHeaders?: Array<string>; // Headers that should be exposed in CORS responses
}

type CORS_RESPONSE = (_request: JoorRequest) => JoorResponse | void; // Type of function returned by the cors function

export { CORS_OPTIONS, CORS_RESPONSE };
