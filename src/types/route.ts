import JoorResponse from '@/core/reponse';
import { JoorRequest } from '@/types/request';

// For path name eg. "/path/to/resource"
type ROUTE_PATH = string;

// For route handler function, which can be synchronous or asynchronous, this can be used for defining route handlers, including middlewares
type ROUTE_HANDLER = (
  _request: JoorRequest, _response: JoorResponse
) => Promise<JoorResponse | undefined | void> | JoorResponse | undefined | void;

// For route methods
type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Type for route tree
interface ROUTES {
  [key: ROUTE_PATH]: {
    // global middleware will apply to all methods and child routes
    globalMiddlewares?: ROUTE_HANDLER[];
    // local middlewares will apply to all methods of this route
    localMiddlewares?: ROUTE_HANDLER[];
  } & {
    [_key in ROUTE_METHOD]?: {
      handlers: ROUTE_HANDLER[];
    };
  } & {
    children?: ROUTES;
  };
}

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_PATH };
