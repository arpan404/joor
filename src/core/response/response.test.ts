import JoorResponse from '@/core/response';
import { RESPONSE_COOKIES } from '@/types/response';
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('JoorResponse', () => {
  let response: JoorResponse;
  beforeEach(() => {
    response = new JoorResponse();
    process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';
  });
  test('setStatus should set a valid status code', () => {
    response.setStatus(200);
    expect(response.parseResponse()['status']).toBe(200);
  });
  test('setStatus should throw error for invalid status code', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setStatus('invalid' as any);
    expect(errorSpy).toHaveBeenCalled();
  });
  test('setMessage should set a valid message', () => {
    response.setMessage('Success');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['message']).toBe('Success');
  });
  test('setMessage should throw error for invalid message type', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setMessage(123 as any);
    expect(errorSpy).toHaveBeenCalled();
  });
  test('setCookies should set valid cookies', () => {
    const cookies = {
      cookie1: {
        value: 'value1',
        options: {
          domain: 'example.com',
          path: '/',
          expires: new Date(),
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
        },
      },
    } as RESPONSE_COOKIES;
    response.setCookies(cookies);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['cookies']).toEqual(cookies);
  });
  test('setCookies should throw error for invalid cookies', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setCookies(null as any);
    expect(errorSpy).toHaveBeenCalled();
  });
  test('setError should set an error message', () => {
    response.setError('An error occurred');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['data']).toBe('An error occurred');
    expect(parsedResponse['dataType']).toBe('error');
  });
  test('setHeaders should add headers correctly', () => {
    const headers = { 'Content-Type': 'application/json' };
    response.setHeaders(headers);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['headers']).toEqual(headers);
  });
  test('setHeaders should override headers if specified', () => {
    const headers1 = { 'Content-Type': 'application/json' };
    const headers2 = { Authorization: 'Bearer token' };
    response.setHeaders(headers1);
    response.setHeaders(headers2, true);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['headers']).toEqual(headers2);
  });
  test('setData should set data correctly', () => {
    const data = { key: 'value' };
    response.setData(data);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['data']).toEqual(data);
    expect(parsedResponse['dataType']).toBe('normal');
  });
  test('setData should throw error when error is already set', () => {
    response.setError('Error occurred');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    response.setData({ key: 'value' });
    expect(warnSpy).toHaveBeenCalled();
  });
  // test('setDataAsJson should set JSON data correctly', () => {
  //   const jsonData = '{"key": "value"}';
  //   const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   response.setDataAsJson(jsonData);
  //   expect(errorSpy).toHaveBeenCalled();
  //   const validJsonData = JSON.parse(jsonData);
  //   response.setDataAsJson(validJsonData);
  //   const parsedResponse = response.parseResponse();
  //   expect(parsedResponse['dataType']).toBe('json');
  //   // expect(parsedResponse['data']).toEqual(validJsonData);//
  //   // expect(parsedResponse['headers']).toEqual({
  //   //   'Content-Type': 'application/json',
  //   // });
  // });
  // test('setDataAsJson should set object data correctly', () => {
  //   const jsonData = { key: 'value' };
  //   response.setDataAsJson(jsonData);
  //   const parsedResponse = response.parseResponse();
  //   expect(parsedResponse['dataType']).toBe('json');
  //   expect(parsedResponse['data']).toEqual(JSON.stringify(jsonData));
  // });
  test('setDataAsJson should throw error when data is already set', () => {
    response.setData({ key: 'value' });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setDataAsJson({ key: 'value' });
    expect(errorSpy).toHaveBeenCalled();
  });
  test('parseResponse should return a valid response object', () => {
    response.setStatus(200);
    response.setMessage('OK');
    response.setData({ key: 'value' });
    const parsedResponse = response.parseResponse();
    expect(parsedResponse).toEqual({
      status: 200,
      message: 'OK',
      data: { key: 'value' },
      cookies: undefined,
      headers: undefined,
      dataType: 'normal',
    });
  });
  test('parseResponse should handle error response', () => {
    response.setStatus(500);
    response.setMessage('Internal Server Error');
    response.setError('Something went wrong');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse).toEqual({
      status: 500,
      message: 'Internal Server Error',
      data: 'Something went wrong',
      cookies: undefined,
      headers: undefined,
      dataType: 'error',
    });
  });
  // Additional tests
  test('setStatus should handle edge case status codes', () => {
    response.setStatus(100);
    expect(response.parseResponse()['status']).toBe(100);
    response.setStatus(599);
    expect(response.parseResponse()['status']).toBe(599);
  });
  test('setMessage should handle empty string', () => {
    response.setMessage('');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['message']).toBe('');
  });
  test('setCookies should handle empty cookies object', () => {
    response.setCookies({});
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['cookies']).toBeUndefined();
  });
  test('setHeaders should handle empty headers object', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setHeaders({});
    expect(errorSpy).toHaveBeenCalled();
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['headers']).toEqual({});
  });
  test('setError should handle empty error message', () => {
    response.setError('');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['data']).toBe('');
    expect(parsedResponse['dataType']).toBe('error');
  });
  test('setData should handle null data', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    response.setData(null);
    expect(errorSpy).toHaveBeenCalled();
    const parsedResponse = response.parseResponse();
    expect(parsedResponse['data']).toBeUndefined();
    expect(parsedResponse['dataType']).toBe('normal');
  });
  // test('setDataAsJson should handle empty object', () => {
  //   const jsonData = {};
  //   response.setDataAsJson(jsonData);
  //   const parsedResponse = response.parseResponse();
  //   expect(parsedResponse['dataType']).toBe('json');
  //   expect(parsedResponse['data']).toEqual(JSON.stringify(jsonData));
  // });
  // test('setDataAsJson should handle empty array', () => {
  //   const jsonData = [] as any;
  //   response.setDataAsJson(jsonData);
  //   const parsedResponse = response.parseResponse();
  //   expect(parsedResponse['dataType']).toBe('json');
  //   expect(parsedResponse['data']).toEqual(JSON.stringify(jsonData));
  // });
  test('parseResponse should handle response with only status', () => {
    response.setStatus(204);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse).toEqual({
      status: 204,
      message: 'No Content',
      data: undefined,
      cookies: undefined,
      headers: undefined,
      dataType: 'normal',
    });
  });
  test('parseResponse should handle response with only message', () => {
    response.setMessage('No Content');
    const parsedResponse = response.parseResponse();
    expect(parsedResponse).toEqual({
      status: 200,
      message: 'No Content',
      data: undefined,
      cookies: undefined,
      headers: undefined,
      dataType: 'normal',
    });
  });
});
