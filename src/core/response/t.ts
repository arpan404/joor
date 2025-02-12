import { ServerResponse } from 'node:http';

import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import logger from '@/helpers/joorLogger';
import { JoorRequest } from '@/types/request';
import { RESPONSE_HEADERS, RESPONSE_STATUS } from '@/types/response';

/** Extends ServerResponse with added functionality for better DX  */
class JoorReponse extends ServerResponse {
  constructor(req: JoorRequest) {
    super(req);
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
  public set(headers: RESPONSE_HEADERS, override: boolean = false){

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
  public redirect({
    path,
    permanent = true,
  }: {
    path: string;
    permanent?: boolean;
  }): void {
    this.status(permanent ? 301 : 302);
    this.setHeader('Location', path);
    this.end();
  }
}

export default JoorReponse;
