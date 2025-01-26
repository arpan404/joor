import JoorResponse from '@/core/response';
import prepareResponse from '@/core/response/prepare';
import { INTERNAL_RESPONSE, PREPARED_RESPONSE } from '@/types/response';
describe('prepareResponse', () => {
  let joorResponse: JoorResponse;
  beforeEach(() => {
    joorResponse = new JoorResponse();
  });
  it('should prepare the response correctly with normal data', () => {
    // Set up the JoorResponse object
    const data = { key: 'value' };
    joorResponse.setStatus(200).setMessage('Success').setData(data);
    // Get the internal response object from parseResponse
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();

    // Prepare the response using prepareResponse function
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    console.log(preparedResponse.data);
    // Assert the prepared response is correctly formatted
    expect(preparedResponse.status).toBe(200);
    expect(preparedResponse.data).toBe(data);
    console.log(preparedResponse.data);
    expect(preparedResponse.headers).toEqual({});
    expect(preparedResponse.cookies).toEqual([]);
  });
  it('should prepare the response correctly with error data', () => {
    // Set up the JoorResponse object with an error
    joorResponse
      .setStatus(400)
      .setMessage('Bad Request')
      .setError('Invalid input');
    // Get the internal response object from parseResponse
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();

    // Prepare the response using prepareResponse function
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    // Assert the prepared response is correctly formatted
    expect(preparedResponse.status).toBe(400);
    expect(preparedResponse.data).toBe(
      JSON.stringify({ message: 'Bad Request', data: 'Invalid input' })
    );
    expect(preparedResponse.headers).toEqual({});
    expect(preparedResponse.cookies).toEqual([]);
  });
  it('should prepare the response with cookies', () => {
    // Set up the JoorResponse object with cookies
    joorResponse
      .setStatus(200)
      .setMessage('Success')
      .setData({ key: 'value' })
      .setCookies({
        session_id: { value: '123456', options: { expires: new Date() } },
      });
    // Get the internal response object from parseResponse
    const internalResponse: INTERNAL_RESPONSE = joorResponse.parseResponse();

    // Prepare the response using prepareResponse function
    const preparedResponse: PREPARED_RESPONSE =
      prepareResponse(internalResponse);
    // Assert the prepared response contains cookies
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
});
