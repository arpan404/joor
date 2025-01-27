import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import Router from '@/core/router';
import marker from '@/packages/marker';
import { ROUTE_HANDLER, ROUTE_PATH, ROUTES } from '@/types/route';

const addMiddlewares = (path: ROUTE_PATH, middlewares: ROUTE_HANDLER[]) => {
  try {
    if (typeof path !== 'string') {
      throw new Jrror({
        code: 'path-invalid',
        message: `Path must be of type string but got ${typeof path}`,
        type: 'error',
        docsPath: '/middlewares',
      });
    }

    const registeredRoutes: ROUTES = Router.routes;
    let routePath = path.startsWith('/') ? path : `/${path}`;
    const routeMiddlewares = middlewares ?? [];
    const isGlobalMiddleware = path.endsWith('*');

    if (isGlobalMiddleware) {
      routePath = routePath.slice(0, -1);
    }

    const routeParts = routePath.split('/').filter((part) => part !== '');
    const currentRoute = registeredRoutes['/' as ROUTE_PATH];
  } catch (error: unknown) {
    if (error instanceof Jrror || error instanceof JoorError) {
      error.handle();
    } else {
      console.error(
        marker.bgRedBright.whiteBright('Failed to add middlwares'),
        error
      );
    }
  }
};

export default addMiddlewares;
