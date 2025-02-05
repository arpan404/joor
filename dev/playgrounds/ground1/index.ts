import {
  Joor,
  JoorRequest,
  httpLogger,
  serveFile,
  serveStaticFiles,
  redirect,
} from 'joor';

import { Router, JoorResponse } from 'joor';
import path from 'node:path';
process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';
process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING = 'true';
process.env.JOOR_RESPONSE_STREAM_CHUNK_SIZE = '200000';
const app = new Joor();
app.use(httpLogger());
const router = new Router();

// app.use(httpLogger());
router.get('/', (req) => {
  const response = new JoorResponse();
  response.setMessage('Hello Noobie').setStatus(200).sendAsStream();
  return response;
});

// app.use(
//   cors({
//     origins: ['*'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type '],
//     exposedHeaders: ['Content-Type'],
//     maxAge: 3600,
//     allowsCookies: false,
//   })
// );
router.get('/api/v1/hello', async (req) => {
  const response = new JoorResponse();
  response.setDataAsJson({ data: { message: 'Hello from API v1' } });
  return response;
});
const print = (req: JoorRequest) => {
  console.log(req.params);
};
router.get('/api/v1/hello/:id/:user', print, (req) => {
  const response = new JoorResponse();
  const id = req.params?.id;
  console.log(req.params);
  if (id === '1') {
    return redirect('/api/v1/hello/2', true);
  }
  response
    .setMessage(`Hello from API v1 with id ${id}`)
    .setStatus(200)
    .setHeaders({ 'Content-Type': 'application/json' });
  return response;
});

router.get('/api/files/:type', (req) => {
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

router.get('/file', (req) => {
  return serveFile({
    filePath: path.join(__dirname, 'tes 1 .txt'),
    stream: true,
    download: false,
  });
});
app.use('/file/:path', async (req) => {
  console.log(req.params);
});
router.get(
  '/file/:path',
  serveStaticFiles({
    routePath: '/file',
    folderPath: __dirname,
    stream: true,
    download: false,
  })
);

router.get('/public', (req) => {
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

// app.start();

app.start();
