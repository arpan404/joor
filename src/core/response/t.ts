import fs from 'node:fs';
import { ServerResponse } from 'node:http';
import path from 'node:path';

import mime from 'mime-types';

import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import logger from '@/helpers/joorLogger';
import { JoorRequest } from '@/types/request';
import { RESPONSE_HEADERS, RESPONSE_STATUS } from '@/types/response';

/** Extends ServerResponse with added functionality for better DX  */
class JoorReponse extends ServerResponse {
  constructor(request: JoorRequest) {
    super(request);
  }
  public status(code: RESPONSE_STATUS): JoorReponse {
    try {
      if (!Number.isInteger(code)) {
        throw new Jrror({
          code: 'response-status-invalid',
          message: `Status must be a integer number, but ${code} is provided.`,
          type: 'error',
          docsPath: '/response',
        });
      }

      if (code < 100 || code > 999) {
        throw new Jrror({
          code: 'response-status-invalid',
          message: `Status must be between 100 and 999, but ${code} is provided.`,
          type: 'error',
          docsPath: '/response',
        });
      }
      this.statusCode = code;
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }

    return this;
  }
  public set(headers: RESPONSE_HEADERS): JoorReponse {
    try {
      if (!headers) {
        throw new Jrror({
          code: 'response-headers-invalid',
          message: `Headers cannot be null or undefined.`,
          type: 'error',
        });
      }

      if (typeof headers !== 'object') {
        throw new Jrror({
          code: 'response-headers-invalid',
          message: `Headers must be an object, but ${typeof headers} was provided.`,
          type: 'error',
        });
      }

      for (const [headerName, headerValue] of Object.entries(headers)) {
        this.setHeader(headerName, headerValue);
      }
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }

    return this;
  }
  public json(data: unknown): void {
    try {
      if (!data) {
        throw new Jrror({
          code: 'response-json-invalid',
          message: `When using JoorResponse.json, json data must be provided.`,
          type: 'error',
          docsPath: '/response',
        });
      }

      const contentType = this.getHeader('Content-Type') as string | undefined;

      if (
        contentType !== undefined &&
        !contentType.includes('application/json')
      ) {
        logger.warn(
          `Content-Type header is not application/json. Current value: ${contentType}. Ensure the header is correctly set for JSON responses. Joor will set it to application/json automatically.`
        );
      }
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }
  public send(data?: unknown): void {
    if (!this.statusCode) {
      this.status(200);
    }

    if (!data) {
      this.end();
      return;
    }

    if (typeof data === 'object') {
      if (data) {
        this.json(data);
      } else {
        this.end();
      }
    } else {
      this.end(data);
    }
  }
  public async sendFile(
    filePath: string,
    asDownload: boolean = false
  ): Promise<void> {
    try {
      const fileExists = await fs.promises
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        this.statusCode = 404;
        this.end('File not found');
        return;
      }

      const fileStats = await fs.promises.stat(filePath);

      const fileName = path.basename(filePath);

      if (!fileStats.isFile()) {
        this.statusCode = 404;
        this.end('Not found');
        return;
      }

      const mimeType = mime.lookup(filePath) || 'application/octet-stream';

      const applyHeaders = (isDownload: boolean) => {
        const headers: Record<string, string | number> = {
          'Content-Type': mimeType,
          'Content-Disposition': isDownload
            ? `attachment; filename="${fileName}"`
            : `inline; filename="${fileName}"`,
        };

        if (isDownload) {
          headers['Content-Length'] = fileStats.size;
        }
        this.set(headers);
      };

      const { range } = this.req.headers;

      if (range) {
        const fileSize = fileStats.size;
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          this.statusCode = 416;
          this.setHeader('Content-Range', `bytes */${fileSize}`);
          this.end();
          return;
        }
        this.statusCode = 206;
        this.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        this.setHeader('Content-Length', end - start + 1);
        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.pipe(this);
      } else {
        this.statusCode = 200;
        applyHeaders(asDownload);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(this);
      }
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }
  public attachment(filePath: string): void {
    this.sendFile(filePath, true);
  }
  public redirect({
    location,
    permanent = true,
  }: {
    location: string;
    permanent?: boolean;
  }): void {
    this.status(permanent ? 301 : 302);
    this.setHeader('Location', location);
    this.end();
  }
}

export default JoorReponse;
