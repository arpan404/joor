import loadEnv from '@/packages/env/load';

// A class that wraps the loadEnv function for better readability and usage
class dotenv {
  // Static method to configure environment variables
  public static config({
    path,
    override,
  }: {
    path?: string;
    override?: boolean;
  }): void {
    // Call the loadEnv function with the provided path and override options
    loadEnv(path, override);
  }
}

export default dotenv;
