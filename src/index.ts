import Joor from '@/core/joor';
import JoorResponse from '@/core/response';
import Router from '@/core/router';
import { loadEnv, redirect, serveFile } from '@/enhanchers';
import { httpLogger, cors, serveStaticFiles } from '@/middlewares';
import env from '@/packages/env';
import Logger from '@/packages/logger';
import marker from '@/packages/marker';
import { JoorRequest } from '@/types/request';
import { ROUTE_HANDLER } from '@/types/route';

// default export must always be Joor class
export default Joor;

// export all other methods and functions except TYPES
export {
  Router,
  JoorResponse,
  loadEnv,
  redirect,
  serveFile,
  marker,
  Logger,
  env,
  httpLogger,
  cors,
  serveStaticFiles,
};

// export types
export { JoorRequest, ROUTE_HANDLER };
