import fs from 'node:fs';
import * as nodePath from 'node:path';

import Jrror from '@/core/error';
import JoorError from '@/core/error/JoorError';
import loadEnv from '@/packages/env/load';
import logger from '@/helpers/joorLogger';

/**
 * `env` class provides methods to manage environment variables.
 *
 */
class env {
  /**
   * Configures environment variables from a specified file.
   * @param {string} path - The path to the `.env` file. Defaults to `.env`.
   * @param {boolean} override - If `true`, existing environment variables will be overridden.
   * @example
   * ```typescript
   * env.config({ path: '.env', override: true });
   * ```
   */
  public static config({
    path = '.env',
    override,
  }: {
    path?: string;
    override?: boolean;
  }): void {
    // Call the loadEnv function with the provided path and override options
    let absolutePath = nodePath.normalize(path);

    if (!fs.existsSync(path)) {
      absolutePath = nodePath.resolve(process.cwd(), path);
    }

    try {
      loadEnv(absolutePath, override);
    } catch (error: unknown) {
      if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
      } else {
        logger.error(error);
      }
    }
  }
}

export default env;
