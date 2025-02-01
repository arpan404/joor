import JoorResponse from '@/core/response';
import prepareResponse from '@/core/response/prepare';
import { INTERNAL_RESPONSE, PREPARED_RESPONSE } from '@/types/response';
describe('prepareResponse', () => {
  let joorResponse: JoorResponse;
  beforeEach(() => {
    joorResponse = new JoorResponse();
  });
  it('should prepare the response correctly with normal data', () => {
    const data = { key: 'value' };
    joorResponse.setStatus(200).setMessage('Success').setData(data);
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.status).toBe(200);
    expect(preparedResponse.headers).toEqual({});
    expect(preparedResponse.cookies).toEqual([]);
  });
  it('should prepare the response correctly with error data', () => {
    joorResponse
      .setStatus(400)
      .setMessage('Bad Request')
      .setError('Invalid input');
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.status).toBe(400);
    expect(preparedResponse.data).toBe(
      JSON.stringify({ message: 'Bad Request', data: 'Invalid input' })
    );
    expect(preparedResponse.headers).toEqual({});
    expect(preparedResponse.cookies).toEqual([]);
  });
  it('should prepare the response with cookies', () => {
    joorResponse
      .setStatus(200)
      .setMessage('Success')
      .setData({ key: 'value' })
      .setCookies({
        session_id: { value: '123456', options: { expires: new Date() } },
      });
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.cookies.length).toBe(1);
    expect(preparedResponse.cookies[0]).toMatch(/^session_id=123456/);
  });
  it('should handle empty cookies array correctly', () => {
    joorResponse.setStatus(200).setMessage('Success').setData({ key: 'value' });
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.cookies).toEqual([]);
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
    expect(preparedResponse.headers).toEqual({
      'X-Custom-Header': 'HeaderValue',
    });
  });
  it('should prepare the response with null data correctly', () => {
    joorResponse.setStatus(200).setMessage('Success').setData(null);
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.data).toBe('Success');
  });
  it('should handle non-object data correctly', () => {
    joorResponse.setStatus(200).setMessage('Success').setData('simple string');
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.data).toBe('simple string');
  });
  it('should correctly handle response with multiple cookies', () => {
    joorResponse
      .setStatus(200)
      .setMessage('Success')
      .setData({ key: 'value' })
      .setCookies({
        session_id: { value: '123456', options: { expires: new Date() } },
        auth_token: { value: 'abcdef', options: { path: '/' } },
      });
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.cookies.length).toBe(2);
    expect(preparedResponse.cookies[0]).toMatch(/^session_id=123456/);
    expect(preparedResponse.cookies[1]).toMatch(/^auth_token=abcdef/);
  });
  it('should correctly format error data with nested objects', () => {
    joorResponse
      .setStatus(400)
      .setMessage('Bad Request')
      .setError({ message: 'Required Field' });
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    expect(preparedResponse.data).toBe(
      JSON.stringify({
        message: 'Bad Request',
        data: { message: 'Required Field' },
      })
    );
  });
});
