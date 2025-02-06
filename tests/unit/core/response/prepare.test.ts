import JoorResponse from '@/core/response';
import prepareResponse from '@/core/response/prepare';
import { INTERNAL_RESPONSE, PREPARED_RESPONSE } from '@/types/response';
describe('prepareResponse', () => {
  let joorResponse: JoorResponse;
  beforeEach(() => {
    joorResponse = new JoorResponse();
  });
  const prepareAndAssert = (
    status: number,
    message: string,
    data: any,
    error: any,
    cookies: Record<string, { value: string; options: any }> | undefined,
    expectedStatus: number,
    expectedData: any,
    expectedHeaders: Record<string, string>,
    expectedCookies: string[] = []
  ) => {
    joorResponse.setStatus(status).setMessage(message).setData(data);
    if (error) {
      joorResponse.setError(error);
    }

    if (cookies) {
      joorResponse.setCookies(cookies);
    }

    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.status).toBe(expectedStatus);
    expect(preparedResponse.data).toBe(expectedData);
    expect(preparedResponse.headers).toEqual(expectedHeaders);
    expect(preparedResponse.cookies).toEqual(expectedCookies);
  };
  it('should prepare the response correctly with normal data', () => {
    const data = { key: 'value' };
    prepareAndAssert(
      200,
      'Success',
      data,
      null,
      undefined,
      200,
      JSON.stringify(data),
      { 'Content-Type': 'application/json' },
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should prepare the response correctly with error data', () => {
    prepareAndAssert(
      400,
      'Bad Request',
      null,
      'Invalid input',
      undefined,
      400,
      JSON.stringify({ message: 'Bad Request', data: 'Invalid input' }),
      { 'Content-Type': 'application/json' },
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should prepare the response with cookies', () => {
    const cookies = {
      session_id: { value: '123456', options: { expires: new Date() } },
    };
    prepareAndAssert(
      200,
      'Success',
      { key: 'value' },
      null,
      cookies,
      200,
      JSON.stringify({ key: 'value' }),
      { 'Content-Type': 'application/json' },
      expect.arrayContaining([expect.stringMatching(/^session_id=123456/)])
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should handle empty cookies array correctly', () => {
    prepareAndAssert(
      200,
      'Success',
      { key: 'value' },
      null,
      undefined,
      200,
      JSON.stringify({ key: 'value' }),
      { 'Content-Type': 'application/json' },
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should prepare the response with headers', () => {
    joorResponse
      .setStatus(200)
      .setMessage('Success')
      .setData({ key: 'value' })
      .setHeaders({ 'X-Custom-Header': 'HeaderValue' });
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.headers).toEqual(
      expect.objectContaining({
        'X-Custom-Header': 'HeaderValue',
        'Content-Type': 'application/json',
      })
    );
  });
  it('should prepare the response with null data correctly', () => {
    prepareAndAssert(
      200,
      'Success',
      null,
      null,
      undefined,
      200,
      'Success',
      {},
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should handle non-object data correctly', () => {
    prepareAndAssert(
      200,
      'Success',
      'simple string',
      null,
      undefined,
      200,
      'simple string',
      {},
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
  it('should correctly handle response with multiple cookies', () => {
    const cookies = {
      session_id: { value: '123456', options: { expires: new Date() } },
      auth_token: { value: 'abcdef', options: { path: '/' } },
    };
    prepareAndAssert(
      200,
      'Success',
      { key: 'value' },
      null,
      cookies,
      200,
      JSON.stringify({ key: 'value' }),
      { 'Content-Type': 'application/json' },
      expect.arrayContaining([
        expect.stringMatching(/^session_id=123456/),
        expect.stringMatching(/^auth_token=abcdef/),
      ])
    );
  });
  it('should correctly format error data with nested objects', () => {
    prepareAndAssert(
      400,
      'Bad Request',
      null,
      { message: 'Required Field' },
      undefined,
      400,
      JSON.stringify({
        message: 'Bad Request',
        data: { message: 'Required Field' },
      }),
      { 'Content-Type': 'application/json' },
      []
    );
    expect(1).toBe(1); // to avoid Test has no assertions warning
  });
});
