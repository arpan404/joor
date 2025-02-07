import dotenv from '@/packages/env';

/**
 * Loads environment variables from a .env file based on the `NODE_ENV` environment variable.
 *
 * Defaults to `.env.local` if `NODE_ENV` is not set or is set to "development".
 * Otherwise, it loads `.env.[NODE_ENV]` (e.g., `.env.production` for `NODE_ENV=production`).
 */
const loadEnv = (): void => {
  let envPath = '.env.local';

  if (process.env.NODE_ENV === 'production') {
    envPath = '.env.production';
  } else if (process.env.NODE_ENV === 'staging') {
    envPath = '.env.staging';
  } else if (process.env.NODE_ENV === 'testing') {
    envPath = '.env.testing';
  }
  dotenv.config({ path: envPath });
};

export default loadEnv;
