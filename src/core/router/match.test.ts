import Router from '@/core/router';
import matchRoute from '@/core/router/match';
import { JoorRequest } from '@/types/request';
describe('Route Matcher', () => {
  const router = new Router();
  beforeEach(() => {
    Router.routes = { '/': {} };
    jest.clearAllMocks();
  });
  it('should return null if path is empty', () => {
    const request = { params: {} } as JoorRequest;
    expect(() => matchRoute('', 'GET', request)).toThrow();
  });
  it('should return null if path is not a string', () => {
    const request = { params: {} } as JoorRequest;
    expect(() => matchRoute(123 as any, 'GET', request)).toThrow();
  });
  it('should return null if no routes are registered', () => {
    const request = { params: {} } as JoorRequest;
    Router.routes = undefined as any;
    expect(matchRoute('/', 'GET', request)).toBeNull();
  });
  it('should return handlers for registered route', () => {
    const request = { params: {} } as JoorRequest;
    router.get('/', async () => undefined);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [expect.any(Function)],
    });
  });
  it('should return middlewares for registered route', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();
    router.get('/', middleware, async () => undefined);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [middleware, expect.any(Function)],
    });
  });
  it('should return global middleware for a route', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware],
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [middleware, expect.any(Function)],
    });
  });
  it('should return global middleware for a certain route', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();

    const localMiddleware = jest.fn();

    const worldFunction = jest.fn();

    const helloFunction = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware],
        children: {
          hello: {
            middlewares: [localMiddleware],
            GET: {
              handlers: [helloFunction],
            },
            children: {
              world: {
                GET: {
                  handlers: [worldFunction],
                },
              },
            },
          },
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/hello', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, helloFunction],
    });
    expect(matchRoute('/hello/world', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, worldFunction],
    });
  });
  it('should handle single level dynamic route', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();

    const localMiddleware = jest.fn();

    const idFunction = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware],
        children: {
          user: {
            middlewares: [localMiddleware],
            children: {
              ':id': {
                GET: {
                  handlers: [idFunction],
                },
              },
            },
          },
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/user/arpan404', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, idFunction],
    });
    expect(request.params).toEqual({ id: 'arpan404' });
    request.params = {};
    expect(matchRoute('/user/123', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, idFunction],
    });
    expect(request.params).toEqual({ id: '123' });
  });
  it('should handle multilevel dynamic route', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();

    const localMiddleware = jest.fn();

    const trackFunction = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware],
        children: {
          user: {
            middlewares: [localMiddleware],
            children: {
              ':id': {
                children: {
                  track: {
                    children: {
                      ':trackId': {
                        GET: {
                          handlers: [trackFunction],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/user/arpan404/track/123', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, trackFunction],
    });
    expect(request.params).toEqual({ id: 'arpan404', trackId: '123' });
    request.params = {};
    expect(matchRoute('/user/123/track/1bha', 'GET', request)).toEqual({
      handlers: [middleware, localMiddleware, trackFunction],
    });
    expect(request.params).toEqual({ id: '123', trackId: '1bha' });
  });
  it('should handle multilevel dynamic route with different routes', () => {
    const request = { params: {} } as JoorRequest;

    const middleware = jest.fn();

    const localMiddleware = jest.fn();

    const trackFunction = jest.fn();

    const deleteFunction = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware],
        children: {
          user: {
            middlewares: [localMiddleware],
            children: {
              ':id': {
                DELETE: {
                  handlers: [deleteFunction],
                },
                children: {
                  track: {
                    children: {
                      ':trackId': {
                        DELETE: {
                          handlers: [trackFunction],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/user/arpan404/track/123', 'DELETE', request)).toEqual({
      handlers: [middleware, localMiddleware, trackFunction],
    });
    expect(request.params).toEqual({ id: 'arpan404', trackId: '123' });
    request.params = {};
    expect(matchRoute('/user/123/track/1bha', 'DELETE', request)).toEqual({
      handlers: [middleware, localMiddleware, trackFunction],
    });
    expect(request.params).toEqual({ id: '123', trackId: '1bha' });
    request.params = {};
    expect(matchRoute('/user/123', 'DELETE', request)).toEqual({
      handlers: [middleware, localMiddleware, deleteFunction],
    });
    expect(request.params).toEqual({ id: '123' });
  });
  it('should handle route with query parameters', () => {
    const request = { params: {}, query: {} } as JoorRequest;

    const handler = jest.fn();
    Router.routes = {
      '/': {},
    };
    router.get('/', handler);
    expect(matchRoute('/?search=test', 'GET', request)).toEqual({
      handlers: [handler],
    });
    expect(request.query).toEqual({ search: 'test' });
  });
  it('should handle route with hash fragment', () => {
    const request = { params: {} } as JoorRequest;

    const handler = jest.fn();
    Router.routes = {
      '/': {},
    };
    router.get('/', handler);
    expect(matchRoute('/#section', 'GET', request)).toEqual({
      handlers: [handler],
    });
  });
  it('should handle route with trailing slash', () => {
    const request = { params: {} } as JoorRequest;

    const handler = jest.fn();
    Router.routes = {
      '/': {},
    };
    router.get('/', handler);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [handler],
    });
    expect(matchRoute('//', 'GET', request)).toEqual({
      handlers: [handler],
    });
  });
  it('should handle route with multiple middlewares', () => {
    const request = { params: {} } as JoorRequest;

    const middleware1 = jest.fn();

    const middleware2 = jest.fn();

    const handler = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware1, middleware2],
      },
    };
    router.get('/', handler);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [middleware1, middleware2, handler],
    });
  });
  it('should handle route with nested middlewares', () => {
    const request = { params: {} } as JoorRequest;

    const middleware1 = jest.fn();

    const middleware2 = jest.fn();

    const handler = jest.fn();
    Router.routes = {
      '/': {
        middlewares: [middleware1],
        children: {
          nested: {
            middlewares: [middleware2],
          },
        },
      },
    };
    router.get('/nested', handler);
    expect(matchRoute('/nested', 'GET', request)).toEqual({
      handlers: [middleware1, middleware2, handler],
    });
  });
  it('should handle route with multiple methods', () => {
    const request = { params: {} } as JoorRequest;

    const getHandler = jest.fn();

    const postHandler = jest.fn();
    Router.routes = {
      '/': {},
    };
    router.get('/', getHandler);
    router.post('/', postHandler);
    expect(matchRoute('/', 'GET', request)).toEqual({
      handlers: [getHandler],
    });
    expect(matchRoute('/', 'POST', request)).toEqual({
      handlers: [postHandler],
    });
  });
  it('should handle route with no matching method', () => {
    const request = { params: {} } as JoorRequest;

    const getHandler = jest.fn();
    Router.routes = {
      '/': {
        GET: {
          handlers: [getHandler],
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/', 'POST', request)).toBeNull();
  });
  it('should handle route with no matching path', () => {
    const request = { params: {} } as JoorRequest;

    const handler = jest.fn();
    Router.routes = {
      '/': {
        GET: {
          handlers: [handler],
        },
      },
    };
    router.get('/', async () => undefined);
    expect(matchRoute('/nonexistent', 'GET', request)).toBeNull();
  });
});
