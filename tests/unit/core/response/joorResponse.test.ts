import JoorResponse from '@/core/response';

jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('JoorResponse Class Tests', () => {
  let response: JoorResponse;
  process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';

  beforeEach(() => {
    response = new JoorResponse();
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  const expectConsoleErrorToBeCalled = () => {
    expect(console.error).toHaveBeenCalled();
  };

  const expectConsoleWarnToBeCalled = () => {
    expect(console.warn).toHaveBeenCalled();
  };

  describe('Status Handling', () => {
    it('should set status correctly', () => {
      const status = 200;
      response.setStatus(status);
      expect(response.parseResponse().status).toBe(status);
    });

    it('should warn for invalid status', () => {
      response.setStatus('invalid' as any);
      expectConsoleErrorToBeCalled();
    });

    it('should handle null status', () => {
      response.setStatus(null as any);
      expectConsoleErrorToBeCalled();
    });

    it('should handle empty string status', () => {
      response.setStatus('' as any);
      expectConsoleErrorToBeCalled();
    });

    it('should handle extreme numbers for status', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      response.setStatus(largeNumber);
      expect(response.parseResponse().status).toBe(largeNumber);
    });
  });

  describe('Headers Handling', () => {
    it('should set headers correctly', () => {
      const headers = { 'Content-Type': 'application/json' };
      response.setHeaders(headers);
      expect(response.parseResponse().headers).toEqual(headers);
    });

    it('should warn for invalid headers', () => {
      response.setHeaders('invalid' as any);
      expectConsoleErrorToBeCalled();
    });

    it('should handle null headers', () => {
      response.setHeaders(null as any);
      expectConsoleErrorToBeCalled();
    });
  });

  describe('Cookies Handling', () => {
    it('should set cookies correctly', () => {
      const cookies = { session_id: { value: 'abc123' } };
      response.setCookies(cookies);
      expect(response.parseResponse().cookies).toEqual(cookies);
    });

    it('should warn for invalid cookies', () => {
      response.setCookies('invalid' as any);
      expectConsoleErrorToBeCalled();
    });
  });

  describe('Message Handling', () => {
    it('should set message correctly', () => {
      const message = 'OK';
      response.setMessage(message);
      expect(response.parseResponse().message).toBe(message);
    });

    it('should warn for invalid message', () => {
      response.setMessage(123 as any);
      expectConsoleErrorToBeCalled();
    });

    it('should handle empty string message', () => {
      response.setMessage('');
      expectConsoleWarnToBeCalled();
    });

    it('should handle null message', () => {
      response.setMessage(null as any);
      expectConsoleErrorToBeCalled();
    });
  });

  describe('Data and Error Handling', () => {
    it('should set error correctly', () => {
      const error = 'Not Found';
      response.setError(error);
      expect(response.parseResponse().data).toBe(error);
    });

    it('should set data correctly', () => {
      const data = { user: 'John Doe' };
      response.setData(data);
      expect(response.parseResponse().data).toEqual(data);
    });

    it('should warn when setting both error and data', () => {
      response.setData({ user: 'John Doe' });
      response.setError('Error');
      expectConsoleWarnToBeCalled();
    });

    it('should handle empty object for data', () => {
      response.setData({});
      expect(response.parseResponse().data).toEqual({});
    });
  });

  describe('Data Type Handling', () => {
    it('should send data as stream', () => {
      response.sendAsStream();
      expect(response.parseResponse().dataType?.isStream).toBe(true);
    });

    it('should send data as file', () => {
      const filePath = '/path/to/file.txt';
      response.sendAsFile(filePath);
      const parsedResponse = response.parseResponse();
      expect(parsedResponse.dataType?.isFile).toBe(true);
      expect(parsedResponse.dataType?.filePath).toBe(filePath);
    });
  });

  describe('Combined Operations', () => {
    it('should return the correct response when parsed', () => {
      const status = 200;
      const message = 'OK';
      const data = { user: 'John Doe' };

      response.setStatus(status).setMessage(message).setData(data);
      const parsedResponse = response.parseResponse();

      expect(parsedResponse.status).toBe(status);
      expect(parsedResponse.message).toBe(message);
      expect(parsedResponse.data).toEqual(data);
    });
  });

  describe('Large Data Handling', () => {
    it('should handle large strings and objects', () => {
      const largeString = 'a'.repeat(10000);
      response.setMessage(largeString);
      response.setData({ largeData: largeString });
      const parsedResponse = response.parseResponse();
      expect(parsedResponse.message).toBe(largeString);
      expect(parsedResponse.data).toEqual({ largeData: largeString });
    });

    it('should handle large arrays in data', () => {
      const largeArray = new Array(10000).fill('item');
      response.setData({ items: largeArray });
      const parsedResponse = response.parseResponse();
      expect((parsedResponse?.data as any)?.items.length).toBe(10000);
      expect((parsedResponse?.data as any)?.items[0]).toBe('item');
    });
  });
});
