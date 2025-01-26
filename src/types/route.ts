import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';

// For path name eg. "/path/to/resource"
type ROUTE_PATH = string;

// For route handler function, which can be synchronous or asynchronous, this can be used for defining route handlers, including middlewares
type ROUTE_HANDLER = (
  _request: JoorRequest
) => Promise<JoorResponse | undefined> | JoorResponse | undefined;

// For route methods
type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Type for route tree
interface ROUTES {
  [key: ROUTE_PATH]: {
    middlewares?: Function[];
  } & {
    [_key in ROUTE_METHOD]?: {
      handlers: Function[];
    };
  } & {
    children?: ROUTES;
  };
}

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_PATH };
