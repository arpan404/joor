import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';

type ROUTE_HANDLER = (
  // eslint-disable-next-line no-unused-vars
  request: JoorRequest
) => Promise<JoorResponse | undefined> | JoorResponse | undefined;
type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ROUTE_TYPE = {
  isDynamic: boolean;
  dynamicParam?: string;
};

type ROUTE_PATH = string;

type ROUTES = {
  // eslint-disable-next-line no-unused-vars
  [key in ROUTE_METHOD]: {
    [key: ROUTE_PATH]: {
      handlers: ROUTE_HANDLER[];
      type: ROUTE_TYPE;
    };
  };
};

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_TYPE, ROUTE_PATH };
