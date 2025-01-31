import Joor, { httpLogger } from 'joor';
import { cors } from 'joor';
import { Router, JoorResponse } from 'joor';
const app = new Joor();
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
