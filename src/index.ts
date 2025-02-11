import { otp } from './packages/otp/otp';

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

export default Joor;

export {
  Router,
  JoorResponse,
  loadEnv,
  redirect,
  otp,
  serveFile,
  marker,
  Logger,
  env,
  httpLogger,
  cors,
  serveStaticFiles,
};

export { JoorRequest, ROUTE_HANDLER };
