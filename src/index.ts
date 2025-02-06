import Joor from '@/core/joor';
import JoorResponse from '@/core/response';
import Router from '@/core/router';
import redirect from '@/core/router/redirect';
import cors from '@/middlewares/cors';
import serveStaticFiles from '@/middlewares/files';
import serveFile from '@/middlewares/files/serve';
import httpLogger from '@/middlewares/httpLogger';
import JOOR_CONFIG from '@/types/config';
import { GLOBAL_MIDDLEWARES } from '@/types/joor';
import { JoorRequest } from '@/types/request';
export default Joor;

export {
  Joor,
  Router,
  JoorRequest,
  JoorResponse,
  cors,
  GLOBAL_MIDDLEWARES,
  JOOR_CONFIG,
  httpLogger,
  serveFile,
  serveStaticFiles,
  redirect,
};
