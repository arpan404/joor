import httpLogger from '@/middlewares/httpLogger';
import Logger from '@/packages/logger';
import { LOGGER_CONFIG } from '@/types/logger';
import { JoorRequest } from '@/types/request';

jest.mock('@/packages/logger');

describe('httpLogger Middleware', () => {
  let mockedLoggerInstance: { info: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoggerInstance = { info: jest.fn() };
    (Logger as jest.Mock).mockImplementation(() => mockedLoggerInstance);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize Logger with default configuration when no config is provided', () => {
    const logRequest = httpLogger();

    const fakeRequest = {
      method: 'GET',
      url: '/test-endpoint',
      httpVersion: '1.1',
      headers: {},
    } as JoorRequest;

    logRequest(fakeRequest);

    expect(Logger).toHaveBeenCalledTimes(1);
    expect(Logger).toHaveBeenCalledWith({
      name: 'HTTP',
      path: expect.stringContaining('logs/http.log'),
      formatCallBack: undefined,
    });

    expect(mockedLoggerInstance.info).toHaveBeenCalledTimes(1);
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'GET /test-endpoint 1.1'
    );
  });

  it('should initialize Logger with provided configuration', () => {
    const customConfig: LOGGER_CONFIG = {
      name: 'CustomLogger',
      path: '/custom/path/to/http.log',
      formatCallBack: jest.fn(),
    };

    const logRequest = httpLogger(customConfig);

    const fakeRequest = {
      method: 'POST',
      url: '/api/data',
      httpVersion: '2.0',
      headers: {},
    } as JoorRequest;

    logRequest(fakeRequest);

    expect(Logger).toHaveBeenCalledTimes(1);
    expect(Logger).toHaveBeenCalledWith(customConfig);

    expect(mockedLoggerInstance.info).toHaveBeenCalledTimes(1);
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'POST /api/data 2.0'
    );
  });

  it('should log request details correctly for different HTTP methods and URLs', () => {
    const logRequest = httpLogger();

    const testCases: { method: string; url: string; httpVersion: string }[] = [
      { method: 'DELETE', url: '/api/resource/123', httpVersion: '1.1' },
      { method: 'PUT', url: '/api/items/456', httpVersion: '2.0' },
      { method: 'PATCH', url: '/users/profile', httpVersion: '1.1' },
    ];

    testCases.forEach(({ method, url, httpVersion }) => {
      const fakeRequest = {
        method,
        url,
        httpVersion,
        headers: {},
      } as JoorRequest;
      logRequest(fakeRequest);
      expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
        `${method} ${url} ${httpVersion}`
      );
    });

    expect(mockedLoggerInstance.info).toHaveBeenCalledTimes(testCases.length);
  });
});
