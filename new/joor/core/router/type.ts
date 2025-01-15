import { RESPONSE } from "@/core/response/type";

type ROUTES = {
  route: string;
  handlers: Array<() => RESPONSE>;
  method: string;
};

export { ROUTES };
