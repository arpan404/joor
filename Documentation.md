# Joor Backend Framework Documentation (Version 1)

# Joor Backend Framework (Version 1)

Official Website: https://joor.socioy.com/

## Introduction

Joor is a modern backend framework designed to simplify server-side application development. This documentation provides comprehensive information about Version 1 of the framework's features, installation process, and usage guidelines.

## Getting Started

### Installation

```bash
# Install via npm
npm install joor@1.x --save

# Or using yarn
yarn add joor@1.x
```

### Basic Setup

```jsx
// Import the core Joor module
const Joor = require('joor');

// Create a new Joor application
const app = new Joor();

// Define a simple route
app.route('/hello', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(3000, () => {
  console.log('Joor server running on port 3000');
});
```

## Core Concepts

### Routing

Joor provides a flexible routing system that allows you to define how your application responds to client requests.

```jsx
// Basic route with GET method
app.get('/users', (req, res) => {
  // Handle GET request for users
});

// POST route
app.post('/users', (req, res) => {
  // Create a new user
});

// Route with path parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Fetch user by ID
});

// Route with query parameters
// Example: /search?q=term
app.get('/search', (req, res) => {
  const query = req.query.q;
  // Search using the query
});
```

### Middleware

Middleware functions have access to the request and response objects, and the next middleware function in the application's request-response cycle.

```jsx
// Application-level middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Route-specific middleware
app.get('/user/:id', (req, res, next) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  next();
}, (req, res) => {
  // This handler is executed for authenticated requests
  res.send('User profile');
});
```

### Request Object

The request object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and more.

| **Property** | **Description** |
| --- | --- |
| req.params | Object containing properties mapped to route parameters |
| req.query | Object containing query string parameters |
| req.body | Object containing the parsed request body |
| req.headers | Object containing the HTTP headers |
| req.cookies | Object containing cookies sent by the client |

### Response Object

The response object represents the HTTP response that Joor sends when it receives an HTTP request.

| **Method** | **Description** |
| --- | --- |
| res.send() | Sends the HTTP response |
| res.json() | Sends a JSON response |
| res.status() | Sets the HTTP status code |
| res.redirect() | Redirects to the specified path |
| res.render() | Renders a view template |

## Database Integration

Joor provides seamless integration with various database systems through its unified API.

### Connecting to a Database

```jsx
const { Database } = require('joor');

// Connect to a PostgreSQL database
const db = new Database({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb'
});

// Connect to MongoDB
const mongoDB = new Database({
  type: 'mongodb',
  url: 'mongodb://localhost:27017/mydb'
});
```

### Basic CRUD Operations

```jsx
// Create a record
const newUser = await db.users.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Read records
const allUsers = await db.users.findAll();
const user = await db.users.findOne({ email: 'john@example.com' });

// Update a record
await db.users.update(
  { id: 1 },
  { name: 'John Smith' }
);

// Delete a record
await db.users.delete({ id: 1 });
```

## Authentication

Joor includes a built-in authentication system that supports multiple strategies.

```jsx
const { Auth } = require('joor');

// Configure authentication
app.use(Auth.initialize());

// Setup JWT authentication
Auth.useJwt({
  secret: 'your-secret-key',
  expiresIn: '1h'
});

// Protected route
app.get('/profile', Auth.authenticate(), (req, res) => {
  res.json({ user: req.user });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const token = await Auth.login(username, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

## Error Handling

Joor provides comprehensive error handling mechanisms to manage application errors effectively.

```jsx
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

// Route-specific error handling
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.users.findOne({ id: req.params.id });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

## Deployment

Follow these guidelines to deploy your Joor application to production environments.

### Environment Configuration

```jsx
// Load environment variables
const env = process.env.NODE_ENV || 'development';

// Configuration based on environment
const config = {
  development: {
    port: 3000,
    database: { /* development db config */ },
    logLevel: 'debug'
  },
  production: {
    port: process.env.PORT || 8080,
    database: { /* production db config */ },
    logLevel: 'error'
  }
}[env];

// Use configuration in your app
app.listen(config.port);
```

### Performance Optimization

- Enable compression for faster response times
- Implement proper caching strategies
- Use clustering to take advantage of multi-core systems
- Configure proper HTTP headers for security

```jsx
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  const app = new Joor();
  // ... your app setup
  app.listen(8080);
}
```

## API Reference

For comprehensive API documentation for Version 1, please refer to the [official API reference](https://joor.socioy.com/api/v1).

## Troubleshooting

### Common Issues

- **Connection refused errors**
    
    Check if your database server is running and the connection details are correct.
    
- **Middleware not executing**
    
    Ensure middleware is added before the route definitions and the next() function is called appropriately.
    
- **Memory leaks**
    
    Check for unclosed database connections or event listeners that aren't properly removed.
    

## Community and Support

- GitHub: https://github.com/joor/framework
- Forum: https://forum.joor.socioy.com
- Discord: https://discord.gg/joor
- Stack Overflow: Tag your questions with "joor"

## License

Joor is released under the MIT License. See the LICENSE file for more details.