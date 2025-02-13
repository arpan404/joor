import JoorResponse from '@/core/response';
import serveFile from '@/enhanchers/serveFile';
jest.mock('@/core/response');
describe('serveFile', () => {
  let mockResponse: {
    sendAsFile: jest.Mock;
    sendAsStream: jest.Mock;
    sendAsDownload: jest.Mock;
  };
  beforeEach(() => {
    mockResponse = {
      sendAsFile: jest.fn(),
      sendAsStream: jest.fn(),
      sendAsDownload: jest.fn(),
    };
    (JoorResponse as jest.Mock).mockImplementation(() => mockResponse);
  });
  it('should send the file as a response', () => {
    const filePath: string = '/path/to/file.txt';
    serveFile({ filePath });
    expect(mockResponse.sendAsFile).toHaveBeenCalledWith(filePath);
  });
  it('should stream the file when stream is true', () => {
    const filePath: string = '/path/to/file.txt';
    serveFile({ filePath, stream: true });
    expect(mockResponse.sendAsStream).toHaveBeenCalled();
  });
  it('should not stream the file when stream is false', () => {
    const filePath: string = '/path/to/file.txt';
    serveFile({ filePath, stream: false });
    expect(mockResponse.sendAsStream).not.toHaveBeenCalled();
  });
  it('should trigger download when download is true', () => {
    const filePath: string = '/path/to/file.txt';
    serveFile({ filePath, stream: true, download: true });
    expect(mockResponse.sendAsDownload).toHaveBeenCalled();
  });
  it('should not trigger download when download is false', () => {
    const filePath: string = '/path/to/file.txt';
    serveFile({ filePath, stream: true, download: false });
    expect(mockResponse.sendAsDownload).not.toHaveBeenCalled();
  });
});
