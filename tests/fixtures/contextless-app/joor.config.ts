import { defineConfig } from '../../../src/index.js';

const config = defineConfig({
  entry: './rpc',
  enforceRateLimit: false,
  maxBodyBytes: Number.MAX_SAFE_INTEGER,
  validateHeaders: false,
  validateInput: false,
  validateOutput: false,
  validateResponseHeaders: false,
});

export default config;
