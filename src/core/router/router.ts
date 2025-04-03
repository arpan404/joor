import { ROUTE_METHOD, ROUTE_PATH, ROUTES, ROUTE_HANDLER } from "@/types/route";
import { validateHandler, validateRoute } from "@/core/router/validation";
import { handleError, jssert } from "@/core/error";
import logger from "@/helpers/joorLogger";

/**
 * Router class for managing HTTP routes and their handlers.
 * It provides methods to register routes for different HTTP methods (GET, POST, PUT, PATCH, DELETE).
 * It also validates the routes and their handlers to ensure they are correctly defined.
 *
 * @class Router
 * @example
 * const router = new Router();
 * router.get('/api/users', (req, res) => {
 *   res.send('User list');
 * });
 * router.post('/api/users', (req, res) => {
 *   res.send('User created');
 * });
 * router.put('/api/users/:id', (req, res) => {
 *   res.send(`User ${req.params.id} updated`);
 * });
 * router.delete('/api/users/:id', (req, res) => { 
 *  res.send(`User ${req.params.id} deleted`);
 * });
 * router.patch('/api/users/:id', (req, res) => {
 *   res.send(`User ${req.params.id} partially updated`);
 * });
 * router.get('/api/users/:id', (req, res) => {
 *   res.send(`User ${req.params.id} details`);
 * });
 * router.get('/api/users/:id/friends', (req, res) => {
 *   res.send(`User ${req.params.id} friends`);
 * });
 * router.get('/api/users/:id/friends/:friendId', (req, res) => {
 *   res.send(`User ${req.params.id} friend ${req.params.friendId} details`);
 * });
 * 
 * @rules
 * - Routes must be unique and not conflict with existing routes.
 * - Dynamic routes (e.g., `/update/:id`) should not conflict with other dynamic routes in the same parent. Foe example, `/update/:id` and `/update/:name` are not allowed.
 * - Only one root level route (`/`) is allowed. Additional root level routes will be ignored.
 * - Handlers or middlewares must be functions.
 * - Routes must start with `/`.
 * - Routes cannot be empty.
 * - Routes can have multiple middlewares.
 * - Route handler or middleware can be synchronous or asynchronous.
 * - Route handler or middleware should return a `JoorResponse` object or `undefined`.
 * - If handler or middleware returns `undefined`, the request will be passed to the next handler or middleware, otherwise it will be sent as a response.
*/
class Router {
    // Static property to store routes.
    static routes: ROUTES = {
        "/": {},
    } as ROUTES;

    /**
     * Registers a GET route with the specified handlers.
     *
     * @param route - The route path.
     * @param handlers - The route handlers.
     */
    public get(route: string, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("GET", route, handlers);
}

    /**
     * Registers a POST route with the specified handlers.
     *
     * @param route - The route path.
     * @param handlers - The route handlers.
     */
    public post(route: string, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("POST", route, handlers);
}
    /**
     * Registers a PUT route with the specified handlers.
     *
     * @param route - The route path.
     * @param handlers - The route handlers.
     */
    public put(route: string, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("PUT", route, handlers);
}
    /**
     * Registers a PATCH route with the specified handlers.
     *
     * @param route - The route path.
     * @param handlers - The route handlers.
     */
    public patch(route: string, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("PATCH", route, handlers);
}
    /**
     * Registers a DELETE route with the specified handlers.
     *
     * @param route - The route path.
     * @param handlers - The route handlers.
     */
    public delete (route: string, ...handlers: ROUTE_HANDLER[]) {
    this.addRoute("DELETE", route, handlers);
}

    /**
  * Adds a route to the router.
  *
  * @private
  * @param httpMethod - The HTTP method.
  * @param route - The route path.
  * @param handlers - The route handlers.
  * @throws {Jrror} If there is a route conflict or duplicate.
  */
    private addRoute(
    httpMethod: ROUTE_METHOD,
    route: ROUTE_PATH,
    handlers: ROUTE_HANDLER[]
) {
    try {
        validateRoute(route);
        handlers.forEach(validateHandler);
        if (!Object.keys(Router.routes).includes('/')) {
            Router.routes['/'] = {};
        }

        if (Object.keys(Router.routes).length > 1) {
            Router.routes = {
                '/': Router.routes['/'],
            };
            logger.warn(
                'Multiple root level routes detected. Only the first root level route will be considered. Rest will be ignored.'
            );
        }

        const routeParts = route.split('/').filter((part) => part !== '');

        if (routeParts.length === 0) {
            Router.routes['/'] = {
                ...Router.routes['/'],
                localMiddlewares: Router.routes['/'].localMiddlewares ?? [],
                globalMiddlewares: Router.routes['/'].globalMiddlewares ?? [],
                [httpMethod]: {
                    handlers,
                },
            };
            return;
        }

        let currentNode = Router.routes['/'];

        for (const routePart of routeParts) {
            // Remove query params and hash from route
            const [node] = routePart.split('#')[0].split('?');
            // check if current node has children
            currentNode.children = currentNode.children ?? {};
            // check if current node is dynamic
            if (node.startsWith(':')) {
                // check if current parent node has other dynamic routes
                const keys = Object.keys(currentNode.children).filter(
                    (key) => key.startsWith(':') && key !== node
                );
                // check if current node has other static routes
                jssert(
                    keys.length === 0,
                    `Route conflict: ${route} conflicts with existing route ${keys[0]}. You cannot have multiple dynamic routes in same parent`,
                    '/route',
                    'error'
                )
            }
            // check if current node has the same route, if no create a new node with middlwares
            currentNode.children[node] = currentNode.children[node] ?? {
                // these middlwares will be used by all the children of this node
                globalMiddlewares: currentNode.globalMiddlewares ?? [],
                localMiddlewares: currentNode.localMiddlewares ?? [],
            };
            currentNode = currentNode.children[node];
        }

        // if same route with same method is already registered, show warning
        jssert(
            !currentNode[httpMethod],
            `Route conflict: ${route} with ${httpMethod} method has already been registered. Trying to register the same route will override the previous one, and there might be unintended behaviors`,
            '/route',
            'warn'
        )

        // after all above checks, register the route
        currentNode[httpMethod] = {
            handlers,
        };
    } catch (error: unknown) {
        handleError(error);
    }
}
}

export default Router;