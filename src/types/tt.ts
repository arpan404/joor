import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';

// Type for route handler function, which can be synchronous or asynchronous, this can be used for defining route handlers, including middlewares
type ROUTE_HANDLER = (
  _request: JoorRequest
) => Promise<JoorResponse | undefined> | JoorResponse | undefined;

// Type for route methods
type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Type for route type, whether it is dynamic or not
interface ROUTE_TYPE {
  isDynamic: boolean;
  dynamicParam?: string;
}

// Type alias for path name eg: /users/:id
type ROUTE_PATH = string;

// Type for routes, which is an object with route methods as keys and route paths as values
type ROUTES = {
  [_key in ROUTE_METHOD]: {
    [key: ROUTE_PATH]: {
      handlers: ROUTE_HANDLER[];
      type: ROUTE_TYPE;
    };
  };
};

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_TYPE, ROUTE_PATH };
