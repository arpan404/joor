import path from 'node:path';

import JoorResponse from '@/core/response';
import serveStaticFiles from '@/middlewares/files';
import { JoorRequest } from '@/types/request';
jest.mock('@/core/response');
describe('serveStaticFiles', () => {
  let mockRequest: JoorRequest;
  let mockResponse: jest.Mocked<JoorResponse>;
  beforeEach(() => {
    mockRequest = {
      url: '/filepath/somefile.txt',
      headers: {
        host: 'localhost:3000',
      },
    } as JoorRequest;
    mockResponse = new JoorResponse() as jest.Mocked<JoorResponse>;
    mockResponse.setStatus = jest.fn().mockReturnThis();
    mockResponse.setMessage = jest.fn().mockReturnThis();
    mockResponse.sendAsFile = jest.fn().mockReturnThis();
    mockResponse.sendAsStream = jest.fn().mockReturnThis();
    mockResponse.sendAsDownload = jest.fn().mockReturnThis();
    jest.spyOn(JoorResponse.prototype, 'setStatus').mockImplementation(mockResponse.setStatus);
    jest.spyOn(JoorResponse.prototype, 'setMessage').mockImplementation(mockResponse.setMessage);
    jest.spyOn(JoorResponse.prototype, 'sendAsFile').mockImplementation(mockResponse.sendAsFile);
    jest.spyOn(JoorResponse.prototype, 'sendAsStream').mockImplementation(mockResponse.sendAsStream);
    jest.spyOn(JoorResponse.prototype, 'sendAsDownload').mockImplementation(mockResponse.sendAsDownload);
    // Mocking path.join
    path.join = jest.fn((...args: string[]) => args.join('/'));
  });
  afterEach(() => {
    jest.restoreAllMocks(); // Clean up mocks
  });
  it('should return 404 if the route path does not match', async () => {
    const serveFiles = serveStaticFiles({
      routePath: '/wrongpath',
      folderPath: 'public',
      stream: true,
      download: false,
    });

    const response = await serveFiles(mockRequest);
    expect(response.setStatus).toHaveBeenCalledWith(404);
    expect(response.setMessage).toHaveBeenCalledWith('Not Found');
  });
  it('should serve the static file correctly', async () => {
    const serveFiles = serveStaticFiles({
      routePath: '/filepath',
      folderPath: 'public',
      stream: true,
      download: false,
    });
    await serveFiles(mockRequest);
    expect(path.join).toHaveBeenCalledWith('public', 'somefile.txt');
    expect(mockResponse.sendAsFile).toHaveBeenCalledWith('public/somefile.txt');
    expect(mockResponse.setStatus).toHaveBeenCalledWith(200);
  });
  it('should stream the file if the stream flag is true', async () => {
    const serveFiles = serveStaticFiles({
      routePath: '/filepath',
      folderPath: 'public',
      stream: true,
      download: false,
    });
    await serveFiles(mockRequest);
    expect(mockResponse.sendAsStream).toHaveBeenCalled();
  });
  it('should download the file if the download flag is true', async () => {
    const serveFiles = serveStaticFiles({
      routePath: '/filepath',
      folderPath: 'public',
      stream: false,
      download: true,
    });
    await serveFiles(mockRequest);
    expect(mockResponse.sendAsDownload).toHaveBeenCalled();
  });
  it('should handle both stream and download flags', async () => {
    const serveFiles = serveStaticFiles({
      routePath: '/filepath',
      folderPath: 'public',
      stream: true,
      download: true,
    });
    await serveFiles(mockRequest);
    expect(mockResponse.sendAsStream).toHaveBeenCalled();
    expect(mockResponse.sendAsDownload).toHaveBeenCalled();
  });
});
