import { Socket } from 'socket.io';

import { ROUTE_HANDLER } from '@/types/route';

type GLOBAL_MIDDLEWARES = Array<ROUTE_HANDLER>;

type SOCKET_HANDLER = (_socket: Socket) => void;

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

interface SOCKET_CONFIG {
  event: string;
  handler: SOCKET_HANDLER;
}

interface SOCKET {
  [key: string]: SOCKET_HANDLER;
}
export {
  GLOBAL_MIDDLEWARES,
  SERVE_FILES_CONFIG,
  SERVE_FILES,
  SOCKET_CONFIG,
  SOCKET_HANDLER,
  SOCKET,
};
