import Router from '@/core/router';
import addMiddlewares from '@/core/router/addMiddlewares';
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('addMiddlewares', () => {
  beforeEach(() => {
    Router.routes = {
      '/': {},
    };
    jest.clearAllMocks();
  });
  it('should add local middlewares to a specific route', () => {
    const middlewares = [jest.fn(), jest.fn()];
    addMiddlewares('/api/user', middlewares);
    expect(
      Router.routes['/'].children?.api?.children?.user?.localMiddlewares
    ).toEqual(middlewares);
  });
  it('should add global middlewares to all sub-routes when path ends with *', () => {
    const middlewares = [jest.fn(), jest.fn()];
    addMiddlewares('/api/*', middlewares);
    const route = Router.routes['/']?.children?.api;
    expect(route?.globalMiddlewares).toEqual(middlewares);
  });
  it('should throw an error if path is not a string', () => {
    const middlewares = [jest.fn()];
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    addMiddlewares(null as any, middlewares);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should throw an error for conflicting dynamic routes', () => {
    Router.routes = {
      '/': {
        children: {
          api: {
            children: {
              ':id': {
                children: {},
                globalMiddlewares: [],
                localMiddlewares: [],
              },
            },
            globalMiddlewares: [],
            localMiddlewares: [],
          },
        },
      },
    };
    const middlewares = [jest.fn()];
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    addMiddlewares('/api/:id', middlewares);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should handle errors gracefully and log them', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const middlewares = [jest.fn()];
    addMiddlewares(null as any, middlewares);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
  it('should create nested route nodes if they do not exist', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/api/products/list', middlewares);
    const listRoute =
      Router.routes['/']?.children?.api?.children?.products?.children?.list;
    expect(listRoute?.localMiddlewares).toEqual(middlewares);
  });
  it('should append to existing middlewares for a route', () => {
    Router.routes = {
      '/': {
        children: {
          api: {
            children: {
              user: {
                children: {},
                globalMiddlewares: [],
                localMiddlewares: [jest.fn()],
              },
            },
            globalMiddlewares: [],
            localMiddlewares: [],
          },
        },
        globalMiddlewares: [],
        localMiddlewares: [],
      },
    };
    const newMiddleware = jest.fn();
    addMiddlewares('/api/user', [newMiddleware]);
    const userRoute = Router.routes['/'].children?.api?.children?.user;
    expect(userRoute?.localMiddlewares).toHaveLength(2);
    expect(userRoute?.localMiddlewares).toContain(newMiddleware);
  });
  it('should not overwrite existing middlewares when adding new ones', () => {
    Router.routes = {
      '/': {
        children: {
          api: {
            children: {
              user: {
                children: {},
                globalMiddlewares: [],
                localMiddlewares: [jest.fn()],
              },
            },
            globalMiddlewares: [],
            localMiddlewares: [],
          },
        },
        globalMiddlewares: [],
        localMiddlewares: [],
      },
    };
    const existingMiddleware =
      Router.routes['/'].children?.api?.children?.user?.localMiddlewares?.[0];
    const newMiddleware = jest.fn();
    addMiddlewares('/api/user', [newMiddleware]);
    const userRoute = Router.routes['/'].children?.api?.children?.user;
    expect(userRoute?.localMiddlewares).toContain(existingMiddleware);
    expect(userRoute?.localMiddlewares).toContain(newMiddleware);
  });
  it('should add middlewares to deeply nested routes', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/api/v1/users/profile', middlewares);
    const profileRoute =
      Router.routes['/']?.children?.api?.children?.v1?.children?.users?.children
        ?.profile;
    expect(profileRoute?.localMiddlewares).toEqual(middlewares);
  });
  it('should handle adding middlewares to root route', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/', middlewares);
    expect(Router.routes['/'].localMiddlewares).toEqual(middlewares);
  });
  it('should handle adding middlewares to routes with query parameters', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/api/users?active=true', middlewares);
    const usersRoute = Router.routes['/']?.children?.api?.children?.users;
    expect(usersRoute?.localMiddlewares).toEqual(middlewares);
  });
  it('should handle adding middlewares to routes with hash fragments', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/api/users#section', middlewares);
    const usersRoute = Router.routes['/']?.children?.api?.children?.users;
    expect(usersRoute?.localMiddlewares).toEqual(middlewares);
  });
  it('should handle adding global middlewares to routes with trailing slashes', () => {
    const middlewares = [jest.fn()];
    addMiddlewares('/api/users/*/', middlewares);
    const usersRoute = Router.routes['/']?.children?.api?.children?.users;
    expect(usersRoute?.globalMiddlewares).toEqual(middlewares);
  });
});
