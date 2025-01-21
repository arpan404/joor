import JOOR_CONFIG from '../config/type';
import { GLOBAL_MIDDLEWARES } from '../joor/type';
import http from 'http';
class Server {
  public async listen(
    configData: JOOR_CONFIG,
    globalMiddlewares: GLOBAL_MIDDLEWARES
  ): Promise<void> {
    http
      .createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World\n');
      })
      .listen(configData.port, () => {
        console.log(`Server running at http://localhost:${configData.port}/`);
      });
  }
}
