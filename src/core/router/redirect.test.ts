import redirect from './redirect';
describe('redirect', () => {
  it('should return a JoorResponse with status 301 and Location header set to the given path when permanent is true', async () => {
    const path = '/new-path';
    const permanent = true;
    const response = await redirect(path, permanent);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.status).toBe(301);
    expect(parsedResponse.headers!.Location).toBe(path);
  });
  it('should return a JoorResponse with status 302 and Location header set to the given path when permanent is false', async () => {
    const path = '/new-path';
    const permanent = false;
    const response = await redirect(path, permanent);
    const parsedResponse = response.parseResponse();
    expect(parsedResponse.status).toBe(302);
    expect(parsedResponse.headers!.Location).toBe(path);
  });
});
