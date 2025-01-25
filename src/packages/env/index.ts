import loadEnv from '@/packages/env/load';
import * as nodePath from 'node:path';
import fs from 'node:fs';
import Jrror from '@/core/error';
// A class that wraps the loadEnv function for better readability and usage
class dotenv {
  // Static method to configure environment variables
  public static config({
    path = '.env',
    override,
  }: {
    path?: string;
    override?: boolean;
  }): void {
    // Call the loadEnv function with the provided path and override options
    let absolutePath = path;
    if (!fs.existsSync(path)) {
      absolutePath = nodePath.resolve(process.cwd(), path);
    }
    try {
      loadEnv(absolutePath, override);
    } catch (error: unknown) {
      if (error instanceof Jrror) {
        error.reject();
      }
    }
  }
}

export default dotenv;
