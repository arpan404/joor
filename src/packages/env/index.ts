import loadEnv from '@/packages/env/load';
import * as nodePath from 'node:path';
import fs from 'node:fs';
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
    loadEnv(absolutePath, override);
  }
}

export default dotenv;
