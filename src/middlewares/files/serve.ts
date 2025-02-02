import JoorResponse from '@/core/response';

/**
 * A utility function to serve files as HTTP responses.
 *
 * This function can be used to send files either as a stream or as a complete download,
 * depending on the provided options. It also allows the flexibility to control the file serving behavior.
 *
 * @example
 * // Example of using serveFile in an Express.js route
 * app.get('/file', (req, res) => {
 *   return serveFile({
 *     filePath: 'path/to/file',  // Specify the file path to be served
 *     stream: true,             // Optionally stream the file (default: true)
 *     download: true,           // Optionally trigger file download (default: false)
 *   });
 * });
 *
 * @param {Object} options - Options for serving the file.
 * @param {string} options.filePath - The path to the file that needs to be served.
 * @param {boolean} [options.stream=true] - Whether to stream the file. If `true`, the file will be served as a stream. If `false`, the entire file is sent in one response.
 * @param {boolean} [options.download=false] - If set to `true`, the response will prompt the browser to download the file instead of displaying it.
 *
 * @returns {JoorResponse} The response object, allowing for further manipulation or chaining.
 */
export default function serveFile({
  filePath,
  stream = true,
  download = false,
}: {
  filePath: string;
  stream?: boolean;
  download?: boolean;
}): JoorResponse {
  const response = new JoorResponse();
  response.sendAsFile(filePath);
  if (stream) {
    response.sendAsStream();
  }

  if (download) {
    response.sendAsDownload();
  }

  return response;
}
