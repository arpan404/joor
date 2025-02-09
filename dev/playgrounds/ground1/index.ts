import {
  JoorRequest,
  httpLogger,
  serveFile,
  redirect,
  serveStaticFiles,
  Logger,
} from 'joor';

import { Router, JoorResponse } from 'joor';
import Joor from 'joor';
import path from 'node:path';

process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'false';
process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING = 'true';
process.env.JOOR_RESPONSE_STREAM_CHUNK_SIZE = '200000';

const app = new Joor();

(async () => {
  try {
    await app.prepare();

    const socketLogger = new Logger({
      name: 'Socket',
      path: path.join(process.cwd(), 'logs', 'socket.log'),
    });

    app.use(
      httpLogger({
        flushInterval: 120000,
      })
    );

    app.router.get('/hello', (req) => {
      const response = new JoorResponse();
      response.setMessage('Hello Noobie').setStatus(200);
      return response;
    });

    app.router.get('/', (req) => {
      const response = new JoorResponse();
      response.setMessage('Hello Noobie').setStatus(200).sendAsStream();
      return response;
    });

    app.router.get('/api/v1/hello', async (req) => {
      const response = new JoorResponse();
      response.setDataAsJson({ data: { message: 'Hello from API v1' } });
      return response;
    });

    const print = (req: JoorRequest) => {
      console.log(req.params);
    };
    // app.get('/a', (req) => {});

    app.router.get('/api/v1/hello/:id/:user', print, (req) => {
      const response = new JoorResponse();
      const id = req.params?.id;
      console.log(req.params);
      if (id === '1') {
        return redirect({
          path: '/api/v1/hello/2',
          permanent: true,
        });
      }
      response
        .setMessage(`Hello from API v1 with id ${id}`)
        .setStatus(200)
        .setHeaders({ 'Content-Type': 'application/json' });
      return response;
    });

    app.router.get('/api/files/:type', (req) => {
      if (req.params?.type === 'json') {
        return serveFile({
          filePath: path.join(__dirname, 'public/benchmark.yml'),
          stream: true,
          download: false,
        });
      } else if (req.params?.type === 'txt') {
        return serveFile({
          filePath: path.join(__dirname, 'tes 1 .txt'),
          stream: true,
          download: false,
        });
      } else {
        const response = new JoorResponse();
        response.setMessage('File type not supported').setStatus(400);
        return response;
      }
    });

    app.router.get('/file', (req) => {
      return serveFile({
        filePath: path.join(__dirname, 'tes 1 .txt'),
        stream: true,
        download: false,
      });
    });

    app.use('/file/:path', async (req) => {
      console.log(req.params);
    });

    app.router.get(
      '/file/:path',
      serveStaticFiles({
        routePath: '/file',
        folderPath: __dirname,
        stream: true,
        download: false,
      })
    );

    app.router.get('/public', (req) => {
      return serveFile({
        filePath: path.join(__dirname, 'public/benchmark.yml'),
        stream: true,
        download: false,
      });
    });

    app.serveFiles({
      routePath: '/public1',
      folderPath: path.join(__dirname, 'public'),
      stream: true,
      download: false,
    });

    app.serveFiles({
      routePath: '/public',
      folderPath: path.join(__dirname, 'public/f'),
      stream: true,
      download: false,
    });
    // app.sockets.on('connection', (socket) => {
    //   console.log(socket.id);
    //   socketLogger.info(`New socket connection: ${socket.id}`);
    //   socket.onAny((event, ...args) => {
    //     socketLogger.info(`Socket event: ${event}`, args);
    //   });
    //   socket.on('message', (message) => {
    //     socketLogger.info(`Received message from ${socket.id}: ${message}`);
    //     socket.send(`Echo: ${message}`);
    //   });
    //   socket.on('disconnect', () => {
    //     socketLogger.info(`Socket disconnected: ${socket.id}`);
    //   });
    // });

    app.start();
  } catch (error) {
    console.error('Error during app preparation:', error);
    process.exit(1);
  }
})();
