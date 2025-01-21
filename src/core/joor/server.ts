import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import Configuration from '@/core/config';
import Jrror from '@/error';
import { JoorRequest } from '@/types/request';
import { GLOBAL_MIDDLEWARES } from '@/types/joor';
import handleRoute from '../internals/router/handleRoute';
import prepareResponse from '../internals/response/prepareResponse';

class Server {
  public async listen(globalMiddlewares: GLOBAL_MIDDLEWARES): Promise<void> {
    const config = new Configuration();
    const configData = await config.getConfig();
    let server: http.Server | https.Server;
    if (!configData) {
      throw new Jrror({
        code: 'config-not-loaded',
        message: 'Configuration not loaded properly',
        type: 'error',
      });
    }
    if (
      configData.server.ssl &&
      configData.server.ssl.key &&
      configData.server.ssl.cert
    ) {
      const credentials = {
        key: fs.readFileSync(configData.server.ssl.key),
        cert: fs.readFileSync(configData.server.ssl.cert),
      };
      server = https.createServer(
        credentials,
        (req: JoorRequest, res: http.ServerResponse): void => {
          this.process(req, res, globalMiddlewares);
        }
      );
    } else {
      server = http.createServer(
        (req: JoorRequest, res: http.ServerResponse): void => {
          this.process(req, res, globalMiddlewares);
        }
      );
    }
    server.listen(configData.server.port, () => {
      console.info(
        `Server listening on ${configData.server.ssl ? 'https' : 'http'}://${
          configData.server.host ? configData.server.host : 'localhost'
        }:${configData.server.port}`
      );
    });
  }
  private async process(
    req: JoorRequest,
    res: http.ServerResponse,
    globalMiddlewares: GLOBAL_MIDDLEWARES
  ): Promise<void> {
    try {
      const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
      const pathURL = parsedUrl.pathname;
      const internalResponse = await handleRoute(
        req,
        globalMiddlewares,
        pathURL
      );
      const parsedResponse = prepareResponse(internalResponse);

      res.writeHead(parsedResponse.status, parsedResponse.headers);
      if (parsedResponse.cookies) {
        parsedResponse.cookies.forEach((cookie: string) => {
          res.setHeader('Set-Cookie', cookie);
        });
      }
      if (parsedResponse.headers) {
        const keys = Object.keys(parsedResponse.headers);
        for (const key of keys) {
          res.setHeader(key, parsedResponse.headers[key]);
        }
      }
      res.end(parsedResponse.data);
      return;
    } catch (error: unknown) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      if (error instanceof Jrror) {
        error.handle();
      }
    }
  }
}
export default Server;
