import JoorResponse from '@/core/response';
import Router from '@/core/router';
import handleRoute from '@/core/router/handle';
import { JoorRequest } from '@/types/request';
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('Route Handler', () => {
  const router = new Router();
  let consoleSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleSpy.mockRestore();
  });
  beforeEach(() => {
    Router.routes = { '/': {} };
    jest.clearAllMocks();
  });
  it('should return not found for invalid method', async () => {
    const request = { params: {}, query: {}, method: 'post' } as JoorRequest;
    router.get('/test', async () => undefined);
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(404);
    expect(response.message).toBe('Not Found');
  });
  it('should return response for valid route and method', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;
    router.get('/test', async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('OK');
  });
  it('should handle middlewares sending response', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = async (_request: JoorRequest) => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('Middleware');
      return response;
    };
    router.get('/test', middleware, async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('Middleware');
  });
  it('should handle middlewares manipulating request', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = async (req: JoorRequest) => {
      req.params = { id: '1' };
    };
    router.get('/test', middleware, async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('OK');
    expect(request.params).toHaveProperty('id');
    expect(request.params?.id).toBe('1');
  });
  it("should handle situation when no data is returned by middleware and route handler doesn't return anything", async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = async (_request: JoorRequest) => {};
    router.get('/test', middleware, async (_request: JoorRequest) => {});
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(500);
  });
  it('should handle situation when middleware throws an error', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = async (_request: JoorRequest) => {
      throw new Error('Middleware Error');
    };
    router.get('/test', middleware, async () => {});
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(500);
  });
  it('should handle situation when route handler throws an error', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;
    router.get('/test', async () => {
      throw new Error('Route Handler Error');
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(500);
  });
  it("should handle when other data is returned by handlers which is not of JoorResponse's instance", async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;
    router.get('/test', async () => 'Invalid Response' as any);
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(500);
  });
  it('should handle multiple middlewares and route handlers', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware1 = async (req: JoorRequest) => {
      req.params = { id: '1' };
    };

    const middleware2 = async (_request: JoorRequest) => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('Middleware2');
      return response;
    };
    router.get('/test', middleware1, middleware2, async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('Middleware2');
    expect(request.params).toHaveProperty('id');
    expect(request.params?.id).toBe('1');
  });
  it('should handle synchronous route handlers', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;
    router.get('/test', (_request: JoorRequest) => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('OK');
  });
  it('should handle synchronous middlewares', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = (_request: JoorRequest) => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('Middleware');
      return response;
    };
    router.get('/test', middleware, async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('Middleware');
  });
  it('should handle route handlers returning undefined', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;
    router.get('/test', async () => undefined);
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(500);
  });
  it('should handle middlewares returning undefined', async () => {
    const request = { params: {}, query: {}, method: 'get' } as JoorRequest;

    const middleware = async (_request: JoorRequest) => undefined;
    router.get('/test', middleware, async () => {
      const response = new JoorResponse();
      response.setStatus(200).setMessage('OK');
      return response;
    });
    const response = await handleRoute(request, '/test');
    expect(response.status).toBe(200);
    expect(response.message).toBe('OK');
  });
});
