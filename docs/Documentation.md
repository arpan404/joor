# Joor v1 Documentation

## Introduction

Joor v1 is a modern, high-performance backend framework designed for efficiency, scalability, and simplicity. It offers a fast routing system, built-in middleware, and essential tools while maintaining full type safety.

### Key Features

- **Minimal & Intuitive:** Straightforward API ideal for beginners.
- **High Performance:** Optimized for speed with auto-scaling capabilities.
- **Flexible & Configurable:** Easily tailored for both small and large applications.
- **Secure & Reliable:** Built-in security features and rigorous testing.
- **Zero Dependency Bloat:** Reduces the need for external packages.
- **Type-Safe:** Built with TypeScript to minimize runtime errors.
- **Cross-Platform:** Runs on Node.js, Bun, and Deno.

---

## Installation

Install Joor using npm or yarn:

### Using npm

```sh
npm install joor
```

### Using yarn

```sh
yarn add joor
```

---

## Getting Started

### Creating a Joor Application

1. **Import Joor:**

   ```js
   import { createServer } from 'joor';
   ```

2. **Initialize the Server:**

   ```js
   const app = createServer();
   ```

3. **Define Routes:**

   ```js
   app.get('/', (req, res) => {
     res.send('Hello, Joor!');
   });
   ```

4. **Start the Server:**
   ```js
   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

---

## Routing

Joor supports flexible routing with various HTTP methods.

### Basic Routing

```js
app.get('/users', (req, res) => res.send('User List'));
app.post('/users', (req, res) => res.send('Create User'));
app.put('/users/:id', (req, res) => res.send(`Update User ${req.params.id}`));
app.delete('/users/:id', (req, res) =>
  res.send(`Delete User ${req.params.id}`)
);
```

### Route Parameters

```js
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

### Query Parameters

```js
app.get('/search', (req, res) => {
  res.send(`Search Query: ${req.query.q}`);
});
```

---

## Middleware

### Custom Middleware

```js
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});
```

### Built-in Middleware

#### JSON Parser & URL-Encoded Parser

```js
import { jsonParser, urlEncoded } from 'joor/middleware';

app.use(jsonParser());
app.use(urlEncoded());
```

#### Static File Serving

```js
import { serveStatic } from 'joor/middleware';

app.use(serveStatic('public'));
```

---

## Error Handling

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});
```

---

## Authentication

Joor supports JWT-based authentication:

```js
import { jwtAuth } from 'joor/auth';

app.use(jwtAuth({ secret: 'your-secret-key' }));
```

---

## Database Integration

### Connecting to MongoDB

```js
import { connect } from 'joor/database';

connect('mongodb://localhost:27017/mydb')
  .then(() => console.log('Database Connected'))
  .catch((err) => console.error('Database Connection Failed', err));
```

---

## WebSockets

### Setting Up a WebSocket Server

```js
import { createWebSocketServer } from 'joor/websockets';

const wss = createWebSocketServer(app);

wss.on('connection', (socket) => {
  console.log('New WebSocket Connection');
  socket.on('message', (msg) => console.log('Received:', msg));
  socket.send('Hello from server');
});
```

---

## CLI Support

### Creating a New Project

```sh
npx joor create my-app
```

---

## Deployment

### Deployment to Vercel

1. Ensure your `package.json` includes a start script:
   ```json
   "scripts": {
      "start": "node index.js"
   }
   ```
2. Deploy using:
   ```sh
   vercel
   ```

### Deployment to Heroku

1. Create a Heroku application:
   ```sh
   heroku create
   ```
2. Deploy with:
   ```sh
   git push heroku main
   ```

---

## API Reference

### Core Methods

#### `createServer`

```js
import { createServer } from 'joor';
const app = createServer();
```

#### Routing Methods

```js
app.get('/path', (req, res) => {
  /* handler */
});
```

#### Middleware Functions

```js
app.use(jsonParser());
```

#### Authentication Middleware

```js
app.use(jwtAuth({ secret: 'your-secret-key' }));
```

#### WebSockets

```js
const wss = createWebSocketServer(app);
```

---

## Contributing

Contributions to improve Joor are welcome.

- **Fork the Repository:** Create a fork on GitHub.
- **Follow the Guidelines:** Review the CONTRIBUTING.md file.
- **Submit Pull Requests:** Ensure your changes include tests and documentation updates.

---

## License

Joor is released under the MIT License. See the LICENSE file for details.

---

## Additional Resources

- **Official Website:** [Joor Home Page](https://joor.socioy.com/v1/introduction)
- **GitHub Repository:** [socioy/joor](https://github.com/socioy/joor)
- **NPM Package:** [joor on npm](https://www.npmjs.com/package/joor)

This documentation provides a complete guide to using and extending Joor v1. For further details, consult the additional resources or reach out to the community.
