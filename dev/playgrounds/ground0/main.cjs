const http = require('http');

// const express = require('express');
// const app = express();
// const port = 1000;

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.get('/api/v1/hello', (req, res) => {
//   res.json({ data: { message: 'Hello from API v1' } });
// });

// app.use((req, res) => {
//   res.status(404).send('Not Found');
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const port = 1000;

const requestHandler = (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  } else if (req.url === '/api/v1/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: { message: 'Hello from API v1' } }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
