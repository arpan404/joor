/**
 * Parses the content of an environment file and returns an object
 * representing the key-value pairs.
 *
 * @param envContent - The content of the environment file as a string.
 * @returns An object where each key is an environment variable name and each value is the corresponding value.
 *
 * @example
 * ```typescript
 * const envContent = `
 *   # This is a comment
 *   KEY1=value1
 *   KEY2=value2
 * `;
 * const env = parseEnv(envContent);
 * console.log(env);
 * // Output: { KEY1: 'value1', KEY2: 'value2' }
 * ```
 */
const parseEnv = (envContent: string): Record<string, string> => {
  const env: Record<string, string> = {};
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Ignore the whitespace line and the comment line
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    // get first part of the line before the first '=' and the others after '='
    // the value part can contain = so we use the rest operator, and later join them using =
    const [key, ...values] = line.split('=');
    if (key && values) {
      env[key.trim()] = values.join('=').trim();
    }
  }

  return env;
};

export default parseEnv;
