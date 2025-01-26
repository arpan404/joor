import { ROUTE_HANDLER, ROUTES, ROUTE_METHOD, ROUTE_PATH } from '@/types/route';
import { validateHandler, validateRoute } from '@/core/router/validation';
import Jrror from '@/core/error';
import marker from '@/packages/marker';
import JoorError from '../error/JoorError';

class Router {
  static routes = {
    '/': {},
  } as ROUTES;

  public get(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('GET', route, handlers);
  }

  public post(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('POST', route, handlers);
  }

  public put(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('PUT', route, handlers);
  }

  public patch(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('PATCH', route, handlers);
  }

  public delete(route: ROUTE_PATH, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute('DELETE', route, handlers);
  }
  private addRoute(
    httpMethod: ROUTE_METHOD,
    route: ROUTE_PATH,
    handlers: ROUTE_HANDLER[]
  ) {
    try {
      // validate if route is valid or not
      validateRoute(route);
      
      // validate each handler
      handlers.forEach(validateHandler);
      if (!Object.keys(Router.routes).includes('/')) {
        Router.routes['/'] = {};
      }

      if (Object.keys(Router.routes).length > 1) {
        Router.routes = {
          '/': Router.routes['/'],
        };
        console.warn(
          'Multiple root level routes detected. Only the first root level route will be considered. Rest will be ignored.'
        );
      }
      const routeParts = route.split('/').filter((part) => part !== '');
      if (routeParts.length === 0) {
        Router.routes['/'] = {
          ...Router.routes['/'],
          [httpMethod]: {
            handlers,
          },
        };
        return;
      }
      let currentNode = Router.routes['/'];
      for (const routePart of routeParts) {
        const [node] = routePart.split('#')[0].split('?');
        currentNode.children = currentNode.children ?? {};
        if (node.startsWith(':')) {
          const keys = Object.keys(currentNode.children).filter(
            (key) => key.startsWith(':') && key !== route
          );
          if (keys.length !== 0) {
            throw new Jrror({
              code: 'route-conflict',
              message: `Route conflict: ${route} conflicts with existing route ${keys[0]}. You cannot have multiple dynamic routes in same parent`,
              type: 'error',
              docsPath: '/routing',
            });
          }
        }
        currentNode.children[node] = currentNode.children[node] ?? {};
        currentNode = currentNode.children[node];
      }
      if (currentNode[httpMethod]) {
        throw new Jrror({
          code: 'route-duplicate',
          message: `Route conflict: ${route} with ${httpMethod} method has already been registered. Trying to register the same route will override the previous one, and there might be unintended behaviors`,
          type: 'warn',
          docsPath: '/routing',
        });
      }
      currentNode[httpMethod] = {
        handlers,
        middlewares: [],
      };
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        console.error(marker.bgRedBright.blackBright('Router Error: '), error);
      }
    }
  }
}

export default Router;
