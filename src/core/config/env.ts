import dotenv from 'dotenv';

/**
 * Loads environment variables from the appropriate .env file based on the NODE_ENV variable.
 * The function will load different .env files depending on the environment:
 * - If NODE_ENV is set to "production", it will load .env.production.
 * - If NODE_ENV is set to "staging", it will load .env.staging.
 * - If NODE_ENV is set to "testing", it will load .env.testing.
 * - If NODE_ENV is not set or is set to "development", it defaults to loading .env.local.
 *
 * This ensures that the correct set of environment variables is loaded based on the runtime environment.
 *
 * @returns {void} This function does not return anything. It loads the environment variables
 * directly into `process.env`.
 */
export default function loadEnv(): void {
  let envPath = '.env.local';
  if (process.env.NODE_ENV === 'production') {
    envPath = '.env.production';
  } else if (process.env.NODE_ENV === 'staging') {
    envPath = '.env.staging';
  } else if (process.env.NODE_ENV === 'testing') {
    envPath = '.env.testing';
  }
  dotenv.config({ path: envPath });
}
