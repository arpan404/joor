import fs from 'node:fs';
import * as nodePath from 'node:path';
import process from 'node:process';

import Jrror from '@/core/error';
import parseEnv from '@/packages/env/parse';

/**
 * Loads environment variables from a specified file into `process.env`.
 *
 * @param {string} [path='.env'] - The path to the environment file. Defaults to '.env'.
 * @param {boolean} [override=false] - Whether to override existing environment variables. Defaults to `false`.
 *
 * @throws {Jrror} Throws an error if the environment file cannot be loaded.
 *
 * @example
 * ```typescript
 * // Load environment variables from the default .env file
 * loadEnv();
 *
 * // Load environment variables from a custom file
 * loadEnv('custom.env');
 *
 * // Load environment variables from a custom file and override existing variables
 * loadEnv('custom.env', true);
 * ```
 */
const loadEnv = (path: string, override: boolean = false) => {
  try {
    // Resolve the absolute path of the environment file
    const envPath = nodePath.resolve(path);

    // Check if the file exists
    if (!fs.existsSync(envPath)) return;

    const env = fs.readFileSync(envPath, 'utf-8');

    const parsedKeyValuePair = parseEnv(env);

    // Override or set environment variables
    for (const [key, value] of Object.entries(parsedKeyValuePair)) {
      if (!override && process.env[key]) continue;
      process.env[key] = value;
    }
  } catch (error: unknown) {
    throw new Jrror({
      code: 'env-load-failed',
      message: `Could not load env file: ${(error as Error).message}`,
      type: 'error',
      docsPath: '/env',
    });
  }
};

export default loadEnv;
