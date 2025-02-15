import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import mime from 'mime-types';

import JoorError from '../error/JoorError';
import prepareResponse from '../response/prepare';
import handleRoute from '../router/handle';

import Configuration from '@/core/config';
import Jrror from '@/core/error';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';
import { JoorRequest } from '@/types/request';
import { PREPARED_RESPONSE } from '@/types/response';

class Server {
  public server: http.Server | https.Server = null as unknown as http.Server;
  private configData: JOOR_CONFIG = null as unknown as JOOR_CONFIG;
  private isInitialized = false;

  /**
   * Initializes the server with SSL if configured, and sets up error handling.
   * @returns {Promise<void>} A promise that resolves when the server is initialized.
   * @throws {Jrror} Throws an error if server initialization fails.
   */
  public async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      const config = new Configuration();
      this.configData = await config.getConfig();
      if (!this.configData) {
        throw new Error('Configuration not loaded');
      }

      if (
        this.configData.server?.ssl?.cert &&
        this.configData.server?.ssl?.key
      ) {
        const credentials = {
          key: await fs.promises.readFile(this.configData.server.ssl.key),
          cert: await fs.promises.readFile(this.configData.server.ssl.cert),
        };
        this.server = https.createServer(
          credentials,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (req: JoorRequest, res: http.ServerResponse) => {
            await this.process(req, res);
          }
        );
      } else {
        this.server = http.createServer(
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (req: JoorRequest, res: http.ServerResponse) => {
            await this.process(req, res);
          }
        );
      }
      // Add server-level error handling
      this.server.on('error', (error) => {
        logger.error('Server error:', error);
        throw new Jrror({
          code: 'server-error',
          message: `Server error: ${error}`,
          type: 'error',
          docsPath: '/joor-server',
        });
      });
      this.isInitialized = true;
    } catch (error) {
      logger.error('Server initialization failed:', error);
      throw new Jrror({
        code: 'server-initialization-failed',
        message: `Failed to initialize server: ${error}`,
        type: 'panic',
        docsPath: '/joor-server',
      });
    }
  }

  public async listen(): Promise<void> {
    try {
      await this.initialize(); // Ensure initialization is complete before listening
      this.server.listen(this.configData.server.port, () => {
        logger.info(
          `Server listening on ${this.configData.server.ssl ? 'https' : 'http'}://${
            this.configData.server.host ?? 'localhost'
          }:${this.configData.server.port}`
        );
      });
    } catch (error: unknown) {
      if ((error as Error).message.includes('EADDRINUSE')) {
        throw new Jrror({
          code: 'server-port-in-use',
          message: `Port ${this.configData.server.port} is already in use.`,
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
      req.url = req.url?.replace(/\/+/g, '/');
      const parsedUrl = new URL(req.url ?? '', `https://${req.headers.host}`);
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
        // If response is not meant to stream send at once
        if (!parsedResponse.dataType.isStream) {
          res.end(parsedResponse.data);
          return;
        }
        await this.handleResponseStream(res, parsedResponse);
      } else {
        await this.handleFileRequest(req, res, parsedResponse);
      }
    } catch (error: unknown) {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }

      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }

  /**
   * Handles the response stream for large data.
   * @param {http.ServerResponse} res - The outgoing response object.
   * @param {PREPARED_RESPONSE} parsedResponse - The parsed response object containing the data to be streamed.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   * @throws {Jrror} Throws an error if there is an issue with streaming the response.
   *
   * This method is responsible for streaming large responses in smaller chunks for faster response time.
   */
  private async handleResponseStream(
    res: http.ServerResponse,
    parsedResponse: PREPARED_RESPONSE
  ): Promise<void> {
    let chunkSize = Number(process.env.JOOR_RESPONSE_STREAM_CHUNK_SIZE);

    if (!chunkSize || chunkSize <= 0 || isNaN(chunkSize)) {
      chunkSize = 1024;
    }

    if (typeof parsedResponse.data === 'object') {
      parsedResponse.data = JSON.stringify(parsedResponse.data);
    } else if (
      typeof parsedResponse.data === 'number' ||
      typeof parsedResponse.data === 'boolean' ||
      typeof parsedResponse.data === 'bigint' ||
      typeof parsedResponse.data === 'symbol'
    ) {
      parsedResponse.data = parsedResponse.data.toString();
    } else {
      parsedResponse.data = String(parsedResponse.data);
    }

    let currentIndex = 0;
    const data = parsedResponse.data as string;

    const streamText = () => {
      if (currentIndex < data.length) {
        const chunk = data.slice(currentIndex, currentIndex + chunkSize);
        res.write(chunk);
        currentIndex += chunk.length;
        setImmediate(streamText); // Continue asynchronously
      } else {
        res.end();
      }
    };
    streamText();
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
        res.end('Not found');
        return;
      }

      const fileStats = await fs.promises.stat(filePath);

      const fileName = path.basename(filePath);

      if (!fileStats.isFile()) {
        res.statusCode = 404;
        res.end('Not found');
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

      // Handle range requests for partial content delivery
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
