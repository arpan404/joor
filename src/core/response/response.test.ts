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
  });

  it('should set status correctly', () => {
    response.setStatus(200);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.status).toBe(200);
  });

  it('should warn for invalid status', () => {
    response.setStatus('invalid' as any);
    expect(console.error).toHaveBeenCalled();
  });

  it('should set headers correctly', () => {
    response.setHeaders({ 'Content-Type': 'application/json' });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('should warn for invalid headers', () => {
    response.setHeaders('invalid' as any);
    expect(console.error).toHaveBeenCalled();
  });

  it('should set cookies correctly', () => {
    response.setCookies({ session_id: { value: 'abc123' } });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.cookies).toEqual({ session_id: { value: 'abc123' } });
  });

  it('should warn for invalid cookies', () => {
    response.setCookies('invalid' as any);
    expect(console.error).toHaveBeenCalled();
  });

  it('should set message correctly', () => {
    response.setMessage('OK');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.message).toBe('OK');
  });

  it('should warn for invalid message', () => {
    response.setMessage(123 as any);
    expect(console.error).toHaveBeenCalled();
  });

  it('should set error correctly', () => {
    response.setError('Not Found');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.data).toBe('Not Found');
  });

  it('should warn when setting both error and data', () => {
    response.setData({ user: 'John Doe' });
    response.setError('Error');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should set data correctly', () => {
    response.setData({ user: 'John Doe' });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.data).toEqual({ user: 'John Doe' });
  });

  it('should send data as stream', () => {
    response.sendAsStream();
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.dataType?.isStream).toBe(true);
  });

  it('should send data as file', () => {
    response.sendAsFile('/path/to/file.txt');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.dataType?.isFile).toBe(true);
    expect(parsedResponse.dataType?.filePath).toBe('/path/to/file.txt');
  });

  it('should return the correct response when parsed', () => {
    response.setStatus(200).setMessage('OK').setData({ user: 'John Doe' });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.status).toBe(200);
    expect(parsedResponse.message).toBe('OK');
    expect(parsedResponse.data).toEqual({ user: 'John Doe' });
  });

  it('should handle empty strings as values for status, headers, and message', () => {
    response.setStatus('' as any);
    expect(console.error).toHaveBeenCalled();
    response.setHeaders({ 'Custom-Header': '' });
    response.setMessage('');
    expect(console.error).toHaveBeenCalled();
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.headers).toEqual({ 'Custom-Header': '' });
  });

  it('should handle null or undefined values', () => {
    response.setStatus(null as any);
    expect(console.error).toHaveBeenCalled();
    response.setHeaders(null as any);
    expect(console.error).toHaveBeenCalled();
    response.setMessage(null as any);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle large strings and objects', () => {
    const largeString = 'a'.repeat(10000);
    response.setMessage(largeString);
    response.setData({ largeData: largeString });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.message).toBe(largeString);
    expect(parsedResponse.data).toEqual({ largeData: largeString });
  });

  it('should handle extreme numbers for status and headers', () => {
    response.setStatus(Number.MAX_SAFE_INTEGER);
    response.setHeaders({ 'X-Large-Header': Number.MAX_SAFE_INTEGER });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.status).toBe(Number.MAX_SAFE_INTEGER);
    expect(parsedResponse.headers).toEqual({
      'X-Large-Header': Number.MAX_SAFE_INTEGER,
    });
  });

  it('should handle empty object for data', () => {
    response.setData({});
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.data).toEqual({});
  });

  it('should warn when setting both error and data simultaneously', () => {
    response.setData({ user: 'John Doe' });
    response.setError('Error occurred');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should handle large arrays in data', () => {
    const largeArray = new Array(10000).fill('item');
    response.setData({ items: largeArray });
    const parsedResponse = response.parseResponse();
    expect((parsedResponse?.data as any)?.items.length).toBe(10000);
    expect((parsedResponse?.data as any)?.items[0]).toBe('item');
  });
});
