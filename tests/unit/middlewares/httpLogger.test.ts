import path from 'path';

import httpLogger from '@/middlewares/httpLogger';
import Logger from '@/packages/logger';
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
      path: expect.stringContaining(path.normalize('logs/http.log')), // Use normalized path
      formatCallBack: undefined,
    });
    expect(mockedLoggerInstance.info).toHaveBeenCalledTimes(1);
    expect(mockedLoggerInstance.info).toHaveBeenCalledWith(
      'GET /test-endpoint 1.1'
    );
  });

  // other tests...
});
