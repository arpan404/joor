# Joor AI-Native Backend Example

This example is a complete Joor backend app with:

- file-routed RPC procedures
- typed request headers
- typed response headers
- typed auth policy and `ctx.auth`
- plugin-provided services
- OpenAPI and AI docs generation
- direct Fetch benchmark

## Build

```bash
npm run joor -- build --config ./examples/ai-native-backend/joor.config.ts
```

## Run

```bash
npm run joor -- build --config ./examples/ai-native-backend/joor.config.ts
tsx examples/ai-native-backend/server.ts
```

Then call:

```bash
curl http://localhost:3000/rpc \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer benchmark-token' \
  -d '{"id":"users.get","input":{"id":"550e8400-e29b-41d4-a716-446655440000"}}'
```

## Benchmark

```bash
tsx examples/ai-native-backend/benchmark.ts
```

The benchmark builds `.joor/` first, imports the generated dispatcher, warms up the handler, then measures direct Fetch dispatch without network overhead.

## Framework Benchmark

```bash
npm run benchmark:frameworks
```

This compares the same `users.get` workload over local HTTP loopback across raw Node, Joor, Express, Fastify, Hono, and tRPC. The benchmark is useful for local trend tracking, not as a universal claim about every deployment shape.
