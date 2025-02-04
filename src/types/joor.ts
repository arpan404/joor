import { ROUTE_HANDLER } from '@/types/route';

type GLOBAL_MIDDLEWARES = Array<ROUTE_HANDLER>;
interface SERVE_FILES {
  [key: string]: {
    folderPath: string;
    stream: boolean;
    download: boolean;
  };
}
interface SERVE_FILES_CONFIG {
  routePath: string;
  folderPath: string;
  stream?: boolean;
  download?: boolean;
}

interface WEBSOCKET_CONFIG {
  route: string;
  handler: ROUTE_HANDLER;
}

export {
  GLOBAL_MIDDLEWARES,
  SERVE_FILES_CONFIG,
  SERVE_FILES,
  WEBSOCKET_CONFIG,
};
