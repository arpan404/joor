type JOOR_CONFIG = {
  server: {
    port?: number;
    host?: string;
    mode?: 'tls' | 'http';
    ssl?: {
      key: string;
      cert: string;
    };
  };
};

export default JOOR_CONFIG;
