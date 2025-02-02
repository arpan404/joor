import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

import mime from 'mime-types';

import Configuration from '@/core/config';
import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import prepareResponse from '@/core/response/prepare';
import handleRoute from '@/core/router/handle';
import logger from '@/helpers/joorLogger';
import { JoorRequest } from '@/types/request';
import { PREPARED_RESPONSE } from '@/types/response';

/**
 * Represents the server class responsible for starting the HTTP(S) server
 * and processing incoming requests.
 */
class Server {
  /**
   * Starts the server and listens on the configured port.
   * Handles both HTTP and HTTPS based on the configuration.
   * @returns {Promise<void>} A promise that resolves when the server starts listening.
   * @throws {Jrror} Throws an error if the configuration is not loaded or SSL files cannot be read.
   */
  public async listen(): Promise<void> {
    const config = new Configuration();
    const configData = await config.getConfig();

    if (!configData) {
      throw new Jrror({
        code: 'config-not-loaded',
        message: 'Configuration not loaded properly',
        type: 'error',
        docsPath: '/configuration',
      });
    }

    let server: http.Server | https.Server;

    if (configData.server?.ssl?.cert && configData.server?.ssl?.key) {
      try {
        const credentials = {
          key: fs.readFileSync(configData.server.ssl.key),
          cert: fs.readFileSync(configData.server.ssl.cert),
        };
        server = https.createServer(
          credentials,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (req: JoorRequest, res: http.ServerResponse) => {
            await this.process(req, res);
          }
        );
      } catch (error: unknown) {
        throw new Jrror({
          code: 'ssl-error',
          message: `Failed to read SSL files.\n${error}`,
          type: 'error',
          docsPath: '/joor-server',
        });
      }
    } else {
      server = http.createServer(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: JoorRequest, res: http.ServerResponse) => {
          await this.process(req, res);
        }
      );
    }

    try {
      server.listen(configData.server.port, () => {
        logger.info(
          `Server listening on ${configData.server.ssl ? 'https' : 'http'}://${
            configData.server.host ? configData.server.host : 'localhost'
          }:${configData.server.port}`
        );
      });
    } catch (error: unknown) {
      if ((error as Error).message.includes('EADDRINUSE')) {
        throw new Jrror({
          code: 'server-port-in-use',
          message: `Port ${configData.server.port} is already in use.`,
          type: 'error',
          docsPath: '/joor-server',
        });
      } else {
        throw new Jrror({
          code: 'server-listen-failed',
          message: `Failed to start the server. ${error}`,
          type: 'error',
          docsPath: '/joor-server',
        });
      }
    }
  }

  /**
   * Processes incoming HTTP(S) requests, prepares the response, and handles file requests.
   * @param {JoorRequest} req - The incoming request object.
   * @param {http.ServerResponse} res - The outgoing response object.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   * @throws {Jrror} Throws an error if any issues occur while processing the request.
   */
  private async process(
    req: JoorRequest,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const parsedUrl = new URL(req.url ?? '', `http://${req.headers.host}`);
      const pathURL = parsedUrl.pathname;
      const query = parsedUrl.searchParams;
      req.ip = req.socket.remoteAddress ?? 'unknown';
      req.query = Object.fromEntries(query.entries());
      const internalResponse = await handleRoute(req, pathURL);

      const parsedResponse = prepareResponse(internalResponse);
      res.statusCode = parsedResponse.status;
      // Set headers from parsed response
      for (const [headerName, headerValue] of Object.entries(
        parsedResponse.headers
      )) {
        res.setHeader(headerName, headerValue);
      }

      // Set custom request headers if present
      if (req.joorHeaders) {
        for (const [headerName, headerValue] of Object.entries(
          req.joorHeaders
        )) {
          res.setHeader(headerName, headerValue);
        }
      }

      // Set cookies if present
      if (parsedResponse.cookies) {
        res.setHeader('Set-Cookie', parsedResponse.cookies);
      }

      // Handle non-file response or file response
      if (!parsedResponse.dataType.isFile) {
        res.end(parsedResponse.data);
        return;
      }
      await this.handleFileRequest(req, res, parsedResponse);
    } catch (error: unknown) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }

  /**
   * Handles file requests, streams the file if necessary, or sends it as a response.
   * @param {JoorRequest} _req - The incoming request object (not used in this method).
   * @param {http.ServerResponse} res - The outgoing response object.
   * @param {PREPARED_RESPONSE} parsedResponse - The parsed response object containing file information.
   * @returns {Promise<void>} A promise that resolves when the file is sent.
   * @throws {Jrror} Throws an error if there is an issue with file processing.
   */
  private async handleFileRequest(
    req: JoorRequest,
    res: http.ServerResponse,
    parsedResponse: PREPARED_RESPONSE
  ): Promise<void> {
    const filePath = parsedResponse.dataType.filePath ?? '';

    if (!filePath) {
      res.statusCode = 400;
      res.end('File path is missing');
      return;
    }

    try {
      const fileExists = await fs.promises
        .access(filePath)
        .then(() => true)
        .catch(() => false);
        
      if (!fileExists) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      const fileStats = await fs.promises.stat(filePath);
      const fileName = filePath.split('/').pop() ?? 'file';

      if (!fileStats.isFile()) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      const mimeType = mime.lookup(filePath) || 'text/plain'; // Fallback to text/plain if MIME type is not found

      // Helper function to set response headers
      const setHeaders = (isDownload: boolean) => {
        const headers: Record<string, string | number> = {
          'Content-Type': mimeType,
          'Content-Disposition': isDownload
            ? `attachment; filename="${fileName}"`
            : `inline; filename="${fileName}"`,
        };

        if (isDownload) {
          headers['Content-Length'] = fileStats.size; // Include Content-Length for downloads
        }

        for (const [key, value] of Object.entries(headers)) {
          if (!res.getHeader(key)) {
            res.setHeader(key, value);
          }
        }
      };

      const { range } = req.headers;

      if (range) {
        const fileSize = fileStats.size;
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          res.statusCode = 416;
          res.setHeader('Content-Range', `bytes */${fileSize}`);
          res.end();
          return;
        }
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', end - start + 1);
        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.pipe(res);
      } else if (parsedResponse.dataType.isStream) {
        res.statusCode = 200;
        setHeaders(parsedResponse.dataType.isDownload ?? false);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.statusCode = 200;
        setHeaders(parsedResponse.dataType.isDownload ?? false);
        const fileData = await fs.promises.readFile(filePath);
        res.end(fileData);
      }
    } catch (error) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }
}

export default Server;
