import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import Configuration from '@/core/config';
import Jrror from '@/error';
import { JoorRequest } from '@/types/request';
import { GLOBAL_MIDDLEWARES } from '@/types/joor';
import handleRoute from '../internals/router/handleRoute';
import prepareResponse from '../internals/response/prepareResponse';

/**
 * Represents the server class responsible for starting the HTTP(S) server and processing requests.
 */
class Server {
  /**
   * Starts the server and listens on the configured port.
   * @param {GLOBAL_MIDDLEWARES} globalMiddlewares - The global middlewares to be applied to requests.
   * @returns {Promise<void>} A promise that resolves when the server starts listening.
   */
  public async listen(globalMiddlewares: GLOBAL_MIDDLEWARES): Promise<void> {
    const config = new Configuration();
    const configData = await config.getConfig();
    let server: http.Server | https.Server;

    // If configuration is not loaded, throw an error
    if (!configData) {
      throw new Jrror({
        code: 'config-not-loaded',
        message: 'Configuration not loaded properly',
        type: 'error',
      });
    }

    // Check if SSL configuration exists and create the server accordingly
    if (
      configData.server.ssl &&
      configData.server.ssl.key &&
      configData.server.ssl.cert
    ) {
      try {
        // Reading SSL credentials from files
        const credentials = {
          key: fs.readFileSync(configData.server.ssl.key),
          cert: fs.readFileSync(configData.server.ssl.cert),
        };

        // Create an HTTPS server with credentials
        server = https.createServer(
          credentials,
          (req: JoorRequest, res: http.ServerResponse): void => {
            this.process(req, res, globalMiddlewares);
          }
        );
      } catch (error) {
        // Throw an error if SSL files cannot be read
        throw new Jrror({
          code: 'ssl-error',
          message: 'Failed to read SSL files.',
          type: 'error',
        });
      }
    } else {
      // If no SSL configuration, create an HTTP server
      server = http.createServer(
        (req: JoorRequest, res: http.ServerResponse): void => {
          this.process(req, res, globalMiddlewares);
        }
      );
    }

    // Start listening on the configured port
    server.listen(configData.server.port, () => {
      console.info(
        `Server listening on ${configData.server.ssl ? 'https' : 'http'}://${
          configData.server.host ? configData.server.host : 'localhost'
        }:${configData.server.port}`
      );
    });
  }

  /**
   * Processes incoming HTTP(S) requests and generates appropriate responses.
   * @param {JoorRequest} req - The incoming request object.
   * @param {http.ServerResponse} res - The outgoing response object.
   * @param {GLOBAL_MIDDLEWARES} globalMiddlewares - The global middlewares to be applied to the request.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  private async process(
    req: JoorRequest,
    res: http.ServerResponse,
    globalMiddlewares: GLOBAL_MIDDLEWARES
  ): Promise<void> {
    try {
      // Parse the URL and extract the path
      const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
      const pathURL = parsedUrl.pathname;

      // Handle the route based on the path and middlewares
      const internalResponse = await handleRoute(
        req,
        globalMiddlewares,
        pathURL
      );

      // Prepare the response by setting the status, headers, and cookies
      const parsedResponse = prepareResponse(internalResponse);

      // Write the response headers
      res.writeHead(parsedResponse.status, parsedResponse.headers);

      // Set cookies if any are present
      if (parsedResponse.cookies) {
        res.setHeader('Set-Cookie', parsedResponse.cookies);
      }

      // Set additional headers if present
      if (parsedResponse.headers) {
        const keys = Object.keys(parsedResponse.headers);
        for (const key of keys) {
          res.setHeader(key, parsedResponse.headers[key]);
        }
      }

      // Send the response data
      res.end(parsedResponse.data);
      return;
    } catch (error: unknown) {
      // If an error occurs, respond with a 500 status and log the error
      res.statusCode = 500;
      res.end('Internal Server Error');

      // Handle the error if it's an instance of Jrror
      if (error instanceof Jrror) {
        error.handle();
      } else {
        console.error(error);
      }
    }
  }
}

export default Server;
