/**
 * Check if a function is asynchronous
 * @param fn - The function to check
 * @returns True if the function is asynchronous, otherwise false
 */
function isAsync(fn: unknown): boolean {
  return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}

export default isAsync;
