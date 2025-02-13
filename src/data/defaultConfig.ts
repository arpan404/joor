import JOOR_CONFIG from '@/types/config';
const defaultConfig: JOOR_CONFIG = {
  server: {
    port: 8080,
    host: 'localhost',
    mode: 'http',
    ssl: undefined,
  },
  socket: undefined,
  logger: {
    enable: {
      file: true,
      console: true,
    },
    maxFileSize: 10485760, // 10MB
  },
  mode: 'development',
  env: {
    values: undefined,
    defaults: {
      enable: true,
    },
  },
};

export default defaultConfig;
