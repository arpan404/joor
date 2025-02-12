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
  logger?: {
    enable?: {
      file: boolean;
      console: boolean;
    };
    maxFileSize: number;
  };
  mode: 'development' | 'production' | 'testing' | 'staging';
  env?: {
    values?: Record<string, string>;
    defaults?: {
      enable?: boolean;
      file?: string;
    };
  };
}

export default JOOR_CONFIG;
