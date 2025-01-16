import { RESPONSE } from "@/core/response/type";

type ROUTE_HANDLER = () => RESPONSE;
type ROUTE_METHOD = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

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

type ROUTES = {
  [key in ROUTE_METHOD]: ROUTE_DETAILS;
};

export { ROUTES, ROUTE_HANDLER, ROUTE_METHOD, ROUTE_TYPE, ROUTE_PATH };
