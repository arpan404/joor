const express = require('express');
const app = express();
const port = 1000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/v1/hello', (req, res) => {
  res.json({ data: { message: 'Hello from API v1' } });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
