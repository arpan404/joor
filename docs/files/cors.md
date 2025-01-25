# CORS (Cross-Origin Resource Sharing)

CORS allows secure resource sharing across different origins. Joor includes CORS support by default:

```typescript
import { cors } from 'joor';
```

The “cors” function accepts an options object with:

1. origins:  
   • An array of allowed URLs (default: ["*"]).  
   • Accepts patterns like https://\*.example.com for all subdomains.

2. methods:  
   • An array of uppercase HTTP methods (e.g., ["GET", "POST"]).  
   • Use ["*"] for all methods.

3. allowedHeaders:  
   • An array of acceptable headers (default: ["*"]).  
   • Must be uppercase for headers.

4. exposedHeaders:  
   • A string or array listing headers exposed to clients.

5. allowsCookies:  
   • A boolean indicating whether credentials are allowed (default: false).

6. maxAge:  
   • A number (in seconds) that sets how long a preflight response is cached (default: 0).

If any required array is missing or invalid, Joor reverts to ["*"]. Currently, only global CORS is supported.

Example usage:

```typescript
import joor, { cors } from 'joor';
import { CORS_OPTIONS } from 'joor/types';

const app = new Joor();
const corsOptions: CORS_OPTIONS = {
  origins: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  allowsCookies: true,
};

app.use(cors(corsOptions));
app.start();
```

`CORS_OPTIONS` is a type alias encompassing all supported CORS properties. If the options provided are invalid or not an object, a `cors-options-invalid` exception is thrown. If the options object lacks valid required data, defaults are applied.
