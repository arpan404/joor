import Router from './index';
import { ROUTES } from '@/types/route';

describe('Router', () => {
  const TEST_ROUTE = '/test';
  const API_ROUTE = '/api/data';
  const DUPLICATE_ROUTE = '/duplicate';
  const DYNAMIC_ROUTE = '/user/[id]';

  beforeEach(() => {
    // Reset routes before each test
    Router.routes = {} as ROUTES;
    jest.clearAllMocks();
  });

  it('should add a GET route', () => {
    const router = new Router();
    router.get(TEST_ROUTE, async () => undefined);
    expect(Router.routes.GET[TEST_ROUTE].handlers).toHaveLength(1);
    expect(Router.routes.GET[TEST_ROUTE].type.isDynamic).toBe(false);
  });

  it('should add multiple handlers to a POST route', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const router = new Router();
    router.post(API_ROUTE, handler1, handler2);
    expect(Router.routes.POST[API_ROUTE].handlers).toHaveLength(2);
    expect(Router.routes.POST[API_ROUTE].handlers).toContain(handler1);
    expect(Router.routes.POST[API_ROUTE].handlers).toContain(handler2);
  });

  it('should warn when registering the same route twice', () => {
    const router = new Router();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    router.get(DUPLICATE_ROUTE, async () => undefined);
    router.get(DUPLICATE_ROUTE, () => undefined);
    expect(warnSpy).toHaveBeenCalledWith(
      `${DUPLICATE_ROUTE} with GET method has already been registered. ` +
        'Trying to register the same route will override the previous one, ' +
        'and there might be unintended behaviors'
    );
  });

  it('should handle dynamic routes', () => {
    const router = new Router();
    router.get(DYNAMIC_ROUTE, async () => undefined);
    const routeInfo = Router.routes.GET[DYNAMIC_ROUTE];
    expect(routeInfo.type.isDynamic).toBe(true);
    expect(routeInfo.type.dynamicParam).toBe('id');
  });

  it('should throw an error for invalid route', () => {
    const router = new Router();
    expect(() => router.get('', async () => undefined)).toThrow(
      'Route cannot be empty. It must be a valid string'
    );
  });

  it('should throw an error for invalid handler', () => {
    const router = new Router();
    expect(() => router.get(TEST_ROUTE, null as any)).toThrow(
      'Handler must be of type function. But got object'
    );
  });

  it('should add a PUT route', () => {
    const router = new Router();
    router.put(TEST_ROUTE, async () => undefined);
    expect(Router.routes.PUT[TEST_ROUTE].handlers).toHaveLength(1);
  });

  it('should add a DELETE route', () => {
    const router = new Router();
    router.delete(TEST_ROUTE, async () => undefined);
    expect(Router.routes.DELETE[TEST_ROUTE].handlers).toHaveLength(1);
  });

  it('should add multiple handlers to a PUT route', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const router = new Router();
    router.put(API_ROUTE, handler1, handler2);
    expect(Router.routes.PUT[API_ROUTE].handlers).toHaveLength(2);
    expect(Router.routes.PUT[API_ROUTE].handlers).toContain(handler1);
    expect(Router.routes.PUT[API_ROUTE].handlers).toContain(handler2);
  });

  it('should add multiple handlers to a DELETE route', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const router = new Router();
    router.delete(API_ROUTE, handler1, handler2);
    expect(Router.routes.DELETE[API_ROUTE].handlers).toHaveLength(2);
    expect(Router.routes.DELETE[API_ROUTE].handlers).toContain(handler1);
    expect(Router.routes.DELETE[API_ROUTE].handlers).toContain(handler2);
  });

  it('should add a GET route', () => {
    const router = new Router();
    router.get(TEST_ROUTE, async () => undefined);
    expect(Router.routes.GET[TEST_ROUTE].handlers).toHaveLength(1);
    expect(Router.routes.GET[TEST_ROUTE].type.isDynamic).toBe(false);
  });

  it('should add multiple handlers to a POST route', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const router = new Router();
    router.post(API_ROUTE, handler1, handler2);
    expect(Router.routes.POST[API_ROUTE].handlers).toHaveLength(2);
    expect(Router.routes.POST[API_ROUTE].handlers).toContain(handler1);
    expect(Router.routes.POST[API_ROUTE].handlers).toContain(handler2);
  });

  it('should warn when registering the same route twice', () => {
    const router = new Router();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    router.get(DUPLICATE_ROUTE, async () => undefined);
    router.get(DUPLICATE_ROUTE, () => undefined);
    expect(warnSpy).toHaveBeenCalledWith(
      `${DUPLICATE_ROUTE} with GET method has already been registered. ` +
        'Trying to register the same route will override the previous one, ' +
        'and there might be unintended behaviors'
    );
  });

  it('should handle dynamic routes', () => {
    const router = new Router();
    router.get(DYNAMIC_ROUTE, async () => undefined);
    const routeInfo = Router.routes.GET[DYNAMIC_ROUTE];
    expect(routeInfo.type.isDynamic).toBe(true);
    expect(routeInfo.type.dynamicParam).toBe('id');
  });

  it('should throw an error for invalid route', () => {
    const router = new Router();
    expect(() => router.get('', async () => undefined)).toThrow(
      'Route cannot be empty. It must be a valid string'
    );
  });

  it('should throw an error for invalid handler', () => {
    const router = new Router();
    expect(() => router.get(TEST_ROUTE, null as any)).toThrow(
      'Handler must be of type function. But got object'
    );
  });
});
