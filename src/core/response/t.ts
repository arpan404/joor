import { ServerResponse } from 'node:http';

import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import logger from '@/helpers/joorLogger';
import { JoorRequest } from '@/types/request';

/** Extends ServerResponse with added functionality for better DX  */
class JoorReponse extends ServerResponse {
  constructor(req: JoorRequest) {
    super(req);
  }
  public status(code: number): JoorReponse {
    try {
      if (typeof code !== 'number') {
        throw new Jrror({
          code: 'response-status-invalid',
          message: `Status must be a number, but ${typeof code} was provided.`,
          type: 'error',
          docsPath: '/response',
        });
      }

      if (code < 100 || code > 599) {
        throw new Jrror({
          code: 'response-status-invalid',
          message: `Status must be a number, but ${typeof code} was provided.`,
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

  public json(data: unknown): void {
    this.setHeader('Content-Type', 'application/json');
    this.write(JSON.stringify(data));
    this.end();
  }
  public send(): void {
    this.end();
  }
}

export default JoorReponse;
