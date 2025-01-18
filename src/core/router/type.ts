import { JoorRequest } from '@/core/request/type';
import JoorResponse from '@/core/response';

type ROUTE_HANDLER = (
  request: JoorRequest
) => Promise<JoorResponse | undefined> | JoorResponse | undefined;
type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ROUTE_TYPE = {
  isDynamic: boolean;
  dynamicParam?: string;
};

type ROUTE_PATH = string;

type ROUTE_DETAILS = {
  [key: ROUTE_PATH]: {
    handlers: ROUTE_HANDLER[];
    type: ROUTE_TYPE;
  };
};

type ROUTES = ROUTE_DETAILS;

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_TYPE, ROUTE_PATH };
