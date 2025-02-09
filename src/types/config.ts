import { ServerOptions } from 'socket.io';
interface JOOR_CONFIG {
  server: {
    port?: number;
    host?: string;
    mode?: 'tls' | 'http';
    ssl?: {
      key: string;
      cert: string;
    };
  };
  socket?: {
    options: ServerOptions;
  };
}

export default JOOR_CONFIG;
