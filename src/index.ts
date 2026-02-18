import Joor from '@/core/joor';
import Router from '@/core/router';
import { loadEnv, serveFile } from '@/enhanchers';
import { httpLogger, cors, serveStaticFiles } from '@/middlewares';
import env from '@/packages/env';
import Logger from '@/packages/logger';
import marker from '@/packages/marker';
import JOOR_CONFIG from '@/types/config';
import Request from '@/types/request';
import Response from '@/types/response';
import { ROUTE_HANDLER } from '@/types/route';

// default export must always be Joor class
export default Joor;

// export all other methods and functions except TYPES
export {
  Joor,
  Router,
  Request,
  Response,
  loadEnv,
  serveFile,
  marker,
  Logger,
  env,
  httpLogger,
  cors,
  serveStaticFiles,
};

// export types
export { ROUTE_HANDLER, JOOR_CONFIG };
