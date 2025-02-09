import { Server as SocketServer } from 'socket.io';

import Router from '@/core/router';
import addMiddlewares from '@/core/router/addMiddlewares';

import Configuration from '@/core/config';
import Jrror from '@/core/error';
import Server from '@/core/joor/server';
import loadEnv from '@/enhanchers/loadEnv';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';
import { SERVE_FILES, SERVE_FILES_CONFIG } from '@/types/joor';
import { ROUTE_HANDLER, ROUTE_PATH } from '@/types/route';

/**
 * The core class for creating a Joor server application.
 */
class Joor {
  /**
   * The loaded configuration data for the server.
   */
  private configData: JOOR_CONFIG | undefined;

  /**
   * Static file serving configuration.  Stores paths and details for serving static files.
   */
  public static staticFileDirectories = {
    paths: [] as Array<string>,
    details: {} as SERVE_FILES,
  };

  /**
   * The underlying HTTP/HTTPS server instance.
   */
  private server: Server = null as unknown as Server;

  /**
   * The Socket.IO server instance for real-time communication.
   */
  public sockets: SocketServer | null = null;

  /**
   * The router instance for defining application routes.
   * Use this to define your API endpoints.
   * @example
   * ```typescript
   * app.router.get('/hello', (req) => {
   *   return new JoorResponse().setMessage('Hello Noobie').setStatus(200);
   * });
   * ```
   */
  public router = new Router();

  /**
   * Prepares the Joor application by initializing the server and sockets.
   * This method must be called immediately after creating an instance of Joor.
   * @returns A Promise that resolves to the Joor instance.
   * @throws {Jrror} If server preparation fails.
   */
  public async prepare(): Promise<Joor> {
    try {
      this.server = new Server();
      await this.server.initialize();
      await this.initializeSockets();
      return this;
    } catch (error) {
      logger.error('Failed to prepare server:', error);
      throw new Jrror({
        code: 'server-preparation-failed',
        message: `Failed to prepare server: ${error}`,
        type: 'panic',
        docsPath: '/joor-server',
      });
    }
  }

  /**
   * Starts the Joor server. This method is asynchronous and must be awaited.
   * @returns A Promise that resolves when the server starts successfully.
   * @throws {Jrror} If configuration loading or server start fails.
   * @example
   * ```typescript
   * const app = new Joor();
   * await app.prepare().start();
   * ```
   */
  public async start(): Promise<void> {
    try {
      await this.initialize();
      loadEnv();
      if (!this.configData) {
        throw new Jrror({
          code: 'config-load-failed',
          message: 'Configuration not loaded',
          type: 'panic',
          docsPath: '/configuration',
        });
      }
      await this.server.listen();
    } catch (error: unknown) {
      if (error instanceof Jrror) {
        error.handle();
      } else {
        logger.error(`Server start failed:`, error);
        throw new Jrror({
          code: 'server-start-failed',
          message: `Failed to start server: ${error}`,
          type: 'panic',
          docsPath: '/joor-server',
        });
      }
    }
  }

  /**
   * Initializes the Socket.IO server.
   * @returns A Promise that resolves when the Socket.IO server is initialized.
   * @throws {Jrror} If Socket.IO initialization fails.
   */
  private async initializeSockets(): Promise<void> {
    try {
      this.sockets = new SocketServer(
        this.server.server,
        this.configData?.socket?.options
      );
    } catch (error) {
      logger.error('Socket initialization failed:', error);
      throw new Jrror({
        code: 'socket-initialization-failed',
        message: `Failed to initialize Socket.IO: ${error}`,
        type: 'error',
        docsPath: '/websockets',
      });
    }
  }

  /**
   * Adds global middleware to specified routes.
   * @param {...(ROUTE_PATH | ROUTE_HANDLER)[]} data - An array of route paths and middleware functions.
   * Route paths can be strings (e.g., "/", "/api/*").
   * Middleware functions are functions that handle requests.
   * @example
   * ```typescript
   * app.use("/", middleware1, middleware2); // Adds middleware1 and middleware2 to the route "/" and all its methods.
   * app.use("/api/*", middleware3); // Adds middleware3 to all routes starting with "/api/".
   * ```
   * @remarks Middleware functions should accept a request object (JoorRequest) and can optionally return a response object (JoorResponse) to interrupt the request-response cycle. If the request should continue to the next handler, the middleware should not return anything (void).
   */
  public use(...data: Array<ROUTE_PATH | ROUTE_HANDLER>): void {
    let paths: Array<ROUTE_PATH> = [];
    let middlewares: Array<ROUTE_HANDLER> = [];

    for (const d of data) {
      if (typeof d === 'string') {
        paths.push(d);
      } else if (typeof d === 'function') {
        middlewares.push(d);
      } else {
        logger.warn(`Invalid data type "${typeof d}" passed to use method`);
      }
    }

    if (paths.length === 0) {
      paths = ['/'];
    }

    if (paths.length > 0 && middlewares.length > 0) {
      for (const p of paths) {
        addMiddlewares(p, middlewares);
      }
    } else {
      logger.warn('Invalid data passed to use method');
    }
  }

  /**
   * Configures static file serving for a specific route path.
   * @param {SERVE_FILES_CONFIG} config - Configuration object for serving static files.
   * @example
   * ```typescript
   * app.serveFiles({
   *   routePath: '/static',
   *   folderPath: path.join(__dirname, 'public'),
   * });
   * ```
   */
  public serveFiles({
    routePath,
    folderPath,
    stream = true,
    download = false,
  }: SERVE_FILES_CONFIG): void {
    Joor.staticFileDirectories.paths.push(routePath);
    Joor.staticFileDirectories.details[routePath] = {
      folderPath,
      stream,
      download,
    };
  }

  /**
   * Initializes the server configuration.
   * @returns A Promise that resolves when the configuration is loaded.
   * @throws {Jrror} If configuration loading fails.
   */
  private async initialize(): Promise<void> {
    try {
      const config = new Configuration();
      this.configData = await config.getConfig();
      if (!this.configData) {
        throw new Error('Configuration not loaded');
      }
    } catch (error) {
      throw new Jrror({
        code: 'initialization-failed',
        message: `Failed to initialize: ${error}`,
        type: 'panic',
        docsPath: '/configuration',
      });
    }
  }
}

export default Joor;
