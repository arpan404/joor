import Joor from '@/core/joor';
import Router from '@/core/router';
import JoorResponse from '@/core/response';
import { loadEnv, redirect, serveFile } from '@/enhanchers';

import marker from '@/packages/marker';
import Logger from '@/packages/logger';
import env from '@/packages/env';

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
};

// export types
export { JoorRequest, ROUTE_HANDLER };
