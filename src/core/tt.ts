import { ServerResponse } from 'node:http';

import mime from 'mime-types';
// import fs from 'node:fs';
// import path from 'node:path';

// import mime from 'mime-types';

import Jrror, { JoorError } from '@/core/error';
import logger from '@/helpers/joorLogger';
import {
  RESPONSE_DATA,
  RESPONSE_HEADERS,
  RESPONSE_STATUS,
} from '@/types/response';
const response = ServerResponse.prototype;
response.status = function (this: ServerResponse, status: RESPONSE_STATUS) {
  try {
    if (!Number.isInteger(status)) {
      throw new Jrror({
        code: 'response-status-invalid',
        message: `Status must be a integer number, but ${status} is provided.`,
        type: 'error',
        docsPath: '/response',
      });
    }

    if (status < 100 || status > 999) {
      throw new Jrror({
        code: 'response-status-invalid',
        message: `Status must be between 100 and 999, but ${status} is provided.`,
        type: 'error',
        docsPath: '/response',
      });
    }
    this.statusCode = status;
  } catch (error: unknown) {
    if (error instanceof Jrror || error instanceof JoorError) {
      error.handle();
    } else {
      logger.error(error);
    }
  }

  return this;
};
response.get = function (this: ServerResponse, name: string) {
  return this.getHeader(name) as string | undefined;
};
response.send = function send(body: unknown) {
  let chunk = body;
  let encoding: BufferEncoding | undefined;
  const { req } = this;

  const contentType = this.get('Content-Type');

  switch (typeof chunk) {
    case 'string':
      if (!contentType) this.type('html');
      encoding = 'utf8';
      break;
    case 'boolean':
    case 'number':
      chunk = String(chunk);
      encoding = 'utf8';
      break;
    case 'object':
      if (chunk === null) {
        chunk = '';
      } else if (ArrayBuffer.isView(chunk)) {
        if (!contentType) this.type('bin');
      } else {
        return this.json(chunk);
      }

      break;
  }

  if (encoding && !contentType) {
    this.set('Content-Type', setCharset('text/plain', 'utf-8'));
  }

  const etagFn = app.get('etag fn');
  const generateETag = !this.get('ETag') && typeof etagFn === 'function';

  let len: number | undefined;

  if (chunk !== undefined) {
    if (Buffer.isBuffer(chunk)) {
      len = chunk.length;
    } else {
      if (!generateETag && chunk.length < 1000) {
        len = Buffer.byteLength(chunk, encoding);
      } else {
        chunk = Buffer.from(chunk, encoding);
        encoding = undefined;
        len = chunk.length;
      }
    }
    this.set('Content-Length', len);
  }

  if (generateETag && len !== undefined) {
    const etag = etagFn(chunk, encoding);
    if (etag) this.set('ETag', etag);
  }

  if (req.fresh) return this.status(304).end();

  if ([204, 304, 205].includes(this.statusCode)) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    this.removeHeader('Transfer-Encoding');
    chunk = '';
  }

  if (req.method === 'HEAD') return this.end();

  return this.end(chunk, encoding);
};
response.links = function (links: Record<string, string>) {
  const existingLink = this.get('Link') || '';
  const newLinks = Object.entries(links)
    .map(([rel, url]) => `<${url}>; rel="${rel}"`)
    .join(', ');
  this.set({ Link: existingLink ? `${existingLink}, ${newLinks}` : newLinks });
};
response.set = function (this: ServerResponse, headers: RESPONSE_HEADERS) {
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

    for (let [headerName, headerValue] of Object.entries(headers)) {
      if (headerValue === undefined) {
        logger.warn(`Header ${headerName} is undefined. Skipping...`);
        continue;
      }

      if (headerName.toLowerCase() === 'content-type') {
        if (Array.isArray(headerValue)) {
          throw new Jrror({
            code: 'response-headers-invalid',
            message: `Content-Type header cannot be an array.`,
            type: 'error',
            docsPath: '/response',
          });
        }
        headerValue = mime.contentType(String(headerValue)) || headerValue;
      }
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
};
response.location = function (this: ServerResponse, path: string) {
  this.setHeader('Location', path);
};
response.json = function (this: ServerResponse, data: RESPONSE_DATA) {
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
};
//   public send(data?: unknown): void {
//     if (!this.statusCode) {
//       this.status(200);
//     }

//     if (!data) {
//       this.end();
//       return;
//     }

//     if (typeof data === 'object') {
//       if (data) {
//         this.json(data);
//       } else {
//         this.end();
//       }
//     } else {
//       this.end(data);
//     }
//   }
//   public async sendFile(
//     filePath: string,
//     asDownload: boolean = false
//   ): Promise<void> {
//     try {
//       const fileExists = await fs.promises
//         .access(filePath)
//         .then(() => true)
//         .catch(() => false);

//       if (!fileExists) {
//         this.statusCode = 404;
//         this.end('File not found');
//         return;
//       }

//       const fileStats = await fs.promises.stat(filePath);

//       const fileName = path.basename(filePath);

//       if (!fileStats.isFile()) {
//         this.statusCode = 404;
//         this.end('Not found');
//         return;
//       }

//       const mimeType = mime.lookup(filePath) || 'application/octet-stream';

//       const applyHeaders = (isDownload: boolean) => {
//         const headers: Record<string, string | number> = {
//           'Content-Type': mimeType,
//           'Content-Disposition': isDownload
//             ? `attachment; filename="${fileName}"`
//             : `inline; filename="${fileName}"`,
//         };

//         if (isDownload) {
//           headers['Content-Length'] = fileStats.size;
//         }
//         this.set(headers);
//       };

//       const { range } = this.req.headers;

//       if (range) {
//         const fileSize = fileStats.size;
//         const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
//         const start = parseInt(startStr, 10);
//         const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

//         if (start >= fileSize || end >= fileSize) {
//           this.statusCode = 416;
//           this.setHeader('Content-Range', `bytes */${fileSize}`);
//           this.end();
//           return;
//         }
//         this.statusCode = 206;
//         this.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
//         this.setHeader('Content-Length', end - start + 1);
//         const fileStream = fs.createReadStream(filePath, { start, end });
//         fileStream.pipe(this);
//       } else {
//         this.statusCode = 200;
//         applyHeaders(asDownload);
//         const fileStream = fs.createReadStream(filePath);
//         fileStream.pipe(this);
//       }
//     } catch (error: unknown) {
//       if (error instanceof Jrror || error instanceof JoorError) {
//         error.handle();
//       } else {
//         logger.error(error);
//       }
//     }
//   }
//   public attachment(filePath: string): void {
//     this.sendFile(filePath, true);
//   }
//   public redirect({
//     location,
//     permanent = true,
//   }: {
//     location: string;
//     permanent?: boolean;
//   }): void {
//     this.status(permanent ? 301 : 302);
//     this.setHeader('Location', location);
//     this.end();
//   }
// }
export default function prepare() {}
