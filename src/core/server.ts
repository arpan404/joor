import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

import Configuration from '@/core/config';
import { JoorError } from '@/core/error';
import Jrror from '@/core/error';
import handleRoute from '@/core/router/handle';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';
import Request from '@/types/request';
import Response from '@/types/response';
import prepare from '@/core/reponse';
prepare();
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
          async (req: Request, res: Response) => {
            await this.process(req, res);
          }
        );
      } else {
        this.server = http.createServer(
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (req: Request, res: Response) => {
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
   * @param {Request} req - The incoming request object.
   * @param {http.ServerResponse} res - The outgoing response object.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   * @throws {Jrror} Throws an error if any issues occur while processing the request.
   */
  private async process(req: Request, res: Response): Promise<void> {
    try {
      req.url = req.url?.replace(/\/+/g, '/');
      const parsedUrl = new URL(req.url ?? '', `https://${req.headers.host}`);
      const pathURL = parsedUrl.pathname;
      const query = parsedUrl.searchParams;
      req.ip = req.socket.remoteAddress ?? 'unknown';
      req.query = Object.fromEntries(query.entries());
      await handleRoute(req, res, pathURL);
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
}

export default Server;
