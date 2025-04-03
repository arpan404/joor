import { ROUTE_HANDLER, ROUTE_PATH } from '@/types/route';
import { jssert } from '@/core/error';
/**
 * Validates the route path.
 * Uses jssert to check the conditions.
 *
 * @param {ROUTE_PATH} route - The route path to validate.
 * @throws {Jrror} If the route path is not a string or is empty.
 */
function validateRoute(route: ROUTE_PATH) {
  jssert(
    typeof route === 'string',
    'Route address must be of type string but got ' + typeof route,
    '/route',
    'error'
  );
  jssert(
    route !== '',
    'Route cannot be empty. It must be a valid string',
    '/route',
    'error'
  );
  jssert(route.startsWith('/'), 'Route must starts with /', '/route', 'error');
}

/**
 * Validates the route handler.
 * Uses jssert to check the conditions.
 *
 * @param {ROUTE_HANDLER} handler - The route handler to validate.
 * @throws {Jrror} If the handler is not a function.
 */
function validateHandler(handler: ROUTE_HANDLER) {
  jssert(
    typeof handler === 'function',
    'Handler must be of type function. But got ' + typeof handler,
    '/handler',
    'error'
  );
}

export { validateRoute, validateHandler };
