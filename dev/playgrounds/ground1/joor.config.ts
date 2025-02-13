import { JOOR_CONFIG } from 'joor';
const config: JOOR_CONFIG = {
  server: {
    port: 3000,
    host: 'localhost',
    mode: 'tls',
  },
  mode: 'development',
  logger: {
    maxFileSize: 1024,
    enable: {
      file: true,
      console: false,
    },
  },
};

export { config };
