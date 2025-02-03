import { ROUTE_HANDLER } from '@/types/route';

type GLOBAL_MIDDLEWARES = Array<ROUTE_HANDLER>;
type SERVE_FILES_CONFIG = {
  routePath: string;
  folderPath: string;
  stream: boolean;
  download: boolean;
};

export { GLOBAL_MIDDLEWARES, SERVE_FILES_CONFIG };
