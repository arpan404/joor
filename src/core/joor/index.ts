import { Server as SocketServer } from 'socket.io';

import Router from '../router';
import addMiddlewares from '../router/addMiddlewares';

import Configuration from '@/core/config';
import Jrror from '@/core/error';
import Server from '@/core/joor/server';
import loadEnv from '@/enhanchers/loadEnv';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';
import { SERVE_FILES, SERVE_FILES_CONFIG } from '@/types/joor';
import { ROUTE_HANDLER, ROUTE_PATH } from '@/types/route';

class Joor {
  private configData: JOOR_CONFIG | undefined;
  public static staticFileDirectories = {
    paths: [] as Array<string>,
    details: {} as SERVE_FILES,
  };

  private server: Server = null as unknown as Server;
  public sockets = null as unknown as SocketServer;
  public router = new Router();
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

  public use(...data: Array<ROUTE_PATH | ROUTE_HANDLER>): void {
    let paths: Array<ROUTE_PATH> = [];
    let middlewares: Array<ROUTE_HANDLER> = [];

    for (const d of data) {
      if (typeof d === 'string') {
        paths = [...paths, d];
      } else if (typeof d === 'function') {
        middlewares = [...middlewares, d];
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
