import httpLogger from '@/middlewares/httpLogger';
import Logger from '@/packages/logger';
import { LOGGER_CONFIG } from '@/types/logger';
import { JoorRequest } from '@/types/request';
jest.mock('@/packages/logger');
describe('httpLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a Logger instance with default config when no config is provided', () => {
    const mockedLoggerInstance = {
      info: jest.fn(),
    };
    (Logger as jest.Mock).mockImplementation(() => mockedLoggerInstance);
    const logRequest = httpLogger();

    const fakeRequest = {
      method: 'GET',
      url: '/test-endpoint',
      httpVersion: '1.1',
      headers: {},
    } as JoorRequest;
    logRequest(fakeRequest);
    expect(Logger).toHaveBeenCalledWith({
      name: 'HTTP',
      path: expect.stringContaining('logs/http.log'),
      formatCallBack: undefined,
    });
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'GET /test-endpoint 1.1'
    );
  });
  it('should create a Logger instance with provided config', () => {
    const mockedLoggerInstance = {
      info: jest.fn(),
    };
    (Logger as jest.Mock).mockImplementation(() => mockedLoggerInstance);
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
    expect(Logger).toHaveBeenCalledWith(customConfig);
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'POST /api/data 2.0'
    );
  });
  it('should log the request details correctly', () => {
    const mockedLoggerInstance = {
      info: jest.fn(),
    };
    (Logger as jest.Mock).mockImplementation(() => mockedLoggerInstance);
    const logRequest = httpLogger();

    const fakeRequest = {
      method: 'DELETE',
      url: '/api/resource/123',
      httpVersion: '1.1',
      headers: {},
    } as JoorRequest;
    logRequest(fakeRequest);
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'DELETE /api/resource/123 1.1'
    );
  });
});
