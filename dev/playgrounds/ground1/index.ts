import Joor, { httpLogger } from 'joor';
import { cors } from 'joor';
import { Router, JoorResponse } from 'joor';
const app = new Joor();
app.use(
  cors({
    origins: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    allowsCookies: true,
  })
);
app.use(httpLogger());
const router = new Router();
router.get('/', (req) => {
  const response = new JoorResponse();
  response.setMessage('Hello Noobie').setStatus(200);
  return response;
});
router.get('/api', (req) => {
  const response = new JoorResponse();
  response.setDataAsJson({ message: 'Hello from Joor!' }).setStatus(200);
  return response;
});
app.start();
