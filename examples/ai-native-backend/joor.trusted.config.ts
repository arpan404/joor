import { defineConfig } from '../../src/index.js';
import baseConfig from './joor.config.js';

const config = defineConfig({
  ...baseConfig,
  outDir: './.joor-trusted',
  enforceRateLimit: false,
  validateHeaders: false,
  validateInput: false,
  validateOutput: false,
  validateResponseHeaders: false,
});

export default config;
