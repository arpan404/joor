import { JoorRequest } from '@/types/request';
import JoorResponse from '@/core/response';

type ROUTE_PATH = string;
type ROUTE_HANDLER = (
  _request: JoorRequest
) => Promise<JoorResponse | undefined> | JoorResponse | undefined;

type ROUTE_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ROUTES {
  [key: ROUTE_PATH]: {
    middlewares?: Function[];
    dynamicParam?: string;
  } & {
    [_key in ROUTE_METHOD]?: {
      middlewares: Function[];
      handlers: Function[];
    };
  } & {
    children?: ROUTES;
  };
}

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD , ROUTE_PATH};
