import Joor, { httpLogger, serveFile } from 'joor';
import { cors } from 'joor';
import { Router, JoorResponse } from 'joor';
import path from 'path';
process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';
const app = new Joor();
const router = new Router();
router.get('/', (req) => {
  const response = new JoorResponse();
  response.setMessage('Hello Noobie').setStatus(200);
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
router.get('/api/v1/hello', (req) => {
  const response = new JoorResponse();
  response
    .setDataAsJson({
      data: { message: 'Hello from API v1' },
    })
    .setStatus(200)
    .setHeaders({ 'Content-Type': 'application/json' });
  return response;
});
router.get('/api/v1/hello/:id', (req) => {
  const response = new JoorResponse();
  const id = req.params?.id;
  response
    .setMessage(`Hello from API v1 with id ${id}`)
    .setStatus(200)
    .setHeaders({ 'Content-Type': 'application/json' });
  return response;
});

router.get('/file', (req) => {
  return serveFile({
    filePath: path.join(__dirname, 'test.txt'),
    stream: true,
    download: false,
  });
});

app.start();
