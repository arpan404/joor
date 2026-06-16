import { defineConfig } from '../../src/index.js';

const config = defineConfig({
  entry: './rpc-bare',
  outDir: './.joor-bare',
  path: '/rpc',
  maxBodyBytes: Number.MAX_SAFE_INTEGER,
  enforceRateLimit: false,
  validateHeaders: false,
  validateInput: false,
  validateOutput: false,
  validateResponseHeaders: false,
});

export default config;
