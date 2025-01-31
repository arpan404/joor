import Router from './index';
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('Router', () => {
  beforeEach(() => {
    Router.routes = { '/': {} };
    jest.clearAllMocks();
  });
  it("shoud throw error if route doesn't start with /", () => {
    const router = new Router();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    router.get('invalid-route', async () => undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('show throw error if route is not a string', () => {
    const router = new Router();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    router.get(123 as any, async () => undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should throw error if handler is not a function', () => {
    const router = new Router();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    router.get('/invalid-handler', undefined as any);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should check multiple handlers for each route', () => {
    const router = new Router();

    const handler1 = jest.fn();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    router.get('/multiple-handlers', handler1, 'handler2' as any);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should support route addition for various methods', () => {
    const router = new Router();
    router.get('/fetch', async () => undefined);
    router.post('/create', async () => undefined);
    router.put('/update', async () => undefined);
    router.patch('/modify', async () => undefined);
    router.delete('/remove', async () => undefined);
    expect(Router.routes).toBeDefined();
    expect(Router.routes).toHaveProperty('/');
    expect(Router.routes['/'].children).toHaveProperty('fetch');
    expect(Router.routes['/'].children?.fetch.GET).toBeDefined();
    expect(Router.routes['/'].children).toHaveProperty('create');
    expect(Router.routes['/'].children?.create.POST).toBeDefined();
    expect(Router.routes['/'].children).toHaveProperty('update');
    expect(Router.routes['/'].children?.update.PUT).toBeDefined();
    expect(Router.routes['/'].children).toHaveProperty('modify');
    expect(Router.routes['/'].children?.modify.PATCH).toBeDefined();
    expect(Router.routes['/'].children).toHaveProperty('remove');
    expect(Router.routes['/'].children?.remove.DELETE).toBeDefined();
  });
  it('should handle nested dynamic routes', () => {
    const router = new Router();
    router.get('/parent/:parentId/child/:childId', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('parent');
    expect(Router.routes['/'].children?.parent.children).toHaveProperty(
      ':parentId'
    );
    expect(
      Router.routes['/'].children?.parent.children?.[':parentId'].children
    ).toHaveProperty('child');
    expect(
      Router.routes['/'].children?.parent.children?.[':parentId'].children
        ?.child.children
    ).toHaveProperty(':childId');
    expect(
      Router.routes['/'].children?.parent.children?.[':parentId'].children
        ?.child.children?.[':childId'].GET
    ).toBeDefined();
  });
  it('should handle multiple handlers for various methods', () => {
    const handler1 = jest.fn();

    const handler2 = jest.fn();

    const router = new Router();
    router.get('/api/v2', handler1, handler2);
    router.post('/api/v2', handler1, handler2);
    router.put('/api/v3', handler1, handler2);
    expect(Router.routes['/'].children).toHaveProperty('api');
    expect(Router.routes['/'].children?.api.children).toHaveProperty('v2');
    expect(
      Router.routes['/'].children?.api.children?.v2.GET?.handlers
    ).toHaveLength(2);
    expect(
      Router.routes['/'].children?.api.children?.v2.POST?.handlers
    ).toHaveLength(2);
    expect(Router.routes['/'].children?.api.children).toHaveProperty('v3');
    expect(
      Router.routes['/'].children?.api.children?.v3.PUT?.handlers
    ).toHaveLength(2);
  });
  it('should warn when registering the same route twice', () => {
    const router = new Router();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const DUPLICATE_ROUTE = '/duplicate';
    router.get(DUPLICATE_ROUTE, async () => undefined);
    router.get(DUPLICATE_ROUTE, () => undefined);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
  it('should handle routes with dynamic parameters', () => {
    const router = new Router();
    router.get('/user/:userId', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('user');
    expect(Router.routes['/'].children?.user.children).toHaveProperty(
      ':userId'
    );
    expect(
      Router.routes['/'].children?.user.children?.[':userId'].GET
    ).toBeDefined();
  });
  it('should handle multiple routes with the same base path but different methods', () => {
    const router = new Router();
    router.get('/common', async () => undefined);
    router.post('/common', async () => undefined);
    expect(Router.routes['/'].children?.common.GET).toBeDefined();
    expect(Router.routes['/'].children?.common.POST).toBeDefined();
  });
  it('should add different routes to root level', () => {
    const router = new Router();
    router.get('/initial', async () => undefined);
    router.get('/reset', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('reset');
    expect(Router.routes['/'].children).toHaveProperty('initial');
  });
  it('should show error when trying to add multiple dynamic routes to the same level', () => {
    const router = new Router();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    router.get('/user/:userId', async () => undefined);
    router.get('/user/:message', async () => undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
  it('should support route addition with middlewares', () => {
    const middleware1 = jest.fn();

    const middleware2 = jest.fn();

    const router = new Router();
    router.get('/middleware', middleware1, middleware2, async () => undefined);
    expect(Router.routes['/'].children?.middleware.GET?.handlers).toHaveLength(
      3
    );
  });
  it('should support route addition with middlewares in same order', () => {
    const middleware1 = jest.fn();
    const middleware2 = jest.fn();
    const handler = jest.fn();
    const router = new Router();
    router.get('/middleware', middleware1, middleware2, handler);
    expect(Router.routes['/'].children?.middleware.GET?.handlers).toEqual([
      middleware1,
      middleware2,
      handler,
    ]);
  });
  it('should handle routes with query parameters', () => {
    const router = new Router();
    router.get('/search', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('search');
    expect(Router.routes['/'].children?.search.GET).toBeDefined();
  });
  it('should handle routes with hash fragments', () => {
    const router = new Router();
    router.get('/fragment#section', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('fragment');
    expect(Router.routes['/'].children?.['fragment'].GET).toBeDefined();
  });
  it('should handle routes with optional parameters', () => {
    const router = new Router();
    router.get('/optional/:param?', async () => undefined);
    expect(Router.routes['/'].children).toHaveProperty('optional');
    expect(Router.routes['/'].children?.optional.children).toHaveProperty(
      ':param'
    );
    expect(
      Router.routes['/'].children?.optional.children?.[':param'].GET
    ).toBeDefined();
  });
});
