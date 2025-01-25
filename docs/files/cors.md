# CORS (Cross-Origin Resource Sharing)

Joor provides built-in support for Cross-Origin Resource Sharing (CORS), allowing you to securely share resources across different origins.

### Importing CORS

To use the CORS functionality in your Joor application, you need to import the `cors` function from the `joor` package:

```typescript
import { cors } from 'joor';
```


The `cors` function takes an options object with these properties:

| Property           | Type                   | Default     | Description                                                                    |
| ------------------ | ---------------------- | ----------- | ------------------------------------------------------------------------------ |
| **origins**        | `string[]`             | `["*"]`     | An array of allowed URLs. Supports patterns like `https://*.example.com`.      |
| **methods**        | `string[]`             | `["*"]`     | An array of uppercase HTTP methods (e.g., `["GET", "POST"]`).                  |
| **allowedHeaders** | `string[]`             | `["*"]`     | An array of acceptable headers. Use capitalized headers, e.g., `Content-Type`. |
| **exposedHeaders** | `string[]` or `string` | `undefined` | A string or array listing headers exposed to clients. Optional.                |
| **allowsCookies**  | `boolean`              | `false`     | A boolean indicating whether credentials are allowed.                          |
| **maxAge**         | `number`               | `0`         | A number (in seconds) that sets how long a preflight response is cached.       |

If any required array is missing or invalid, Joor defaults to `["*"]`. Currently, only global CORS is supported.

### Pattern Matching in Origins

The `origins` property supports pattern matching to allow multiple subdomains or specific URL patterns. For example:
- `https://*.example.com` allows any subdomain of `example.com`.
- `http://localhost:*` allows any port on `localhost`.

### Example Usage

#### Basic Example

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

#### Example with All Defaults

```typescript
import joor, { cors } from 'joor';

const app = new Joor();

app.use(cors());
app.start();
```

#### Example with Custom Headers and Methods

```typescript
import joor, { cors } from 'joor';
import { CORS_OPTIONS } from 'joor/types';

const app = new Joor();
const corsOptions: CORS_OPTIONS = {
    origins: ['https://*.example.com'],
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Custom-Header'],
    allowsCookies: false,
    maxAge: 3600,
};

app.use(cors(corsOptions));
app.start();
```

`CORS_OPTIONS` is a type alias covering all supported CORS properties. If the options provided are invalid or not an object, a `cors-options-invalid` exception is thrown. If the options object lacks valid required data, defaults are applied.
