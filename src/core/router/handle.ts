import Jrror, { JoorError } from '@/core/error';
// import Joor from '@/core/joor';
import matchRoute from '@/core/router/match';
// import findBestMatch from '@/helpers/findBestMatch';
import logger from '@/helpers/joorLogger';
import Request from '@/types/request';
import Response from '@/types/response';
// import serveStaticFiles from '@/middlewares/serveStaticFiles';
import { ROUTE_METHOD } from '@/types/route';

/**
 * Handles routing for incoming requests by matching the request path and method
 * to the appropriate route handlers and executing them. This function is meant to be used
 * inside the server of node.js [process method of JoorServer class].
 *
 * @param {JoorRequest} request - The incoming request object containing details such as method and headers.
 * @param {string} pathURL - The URL path of the request to match against defined routes.
 * @returns {Promise<INTERNAL_RESPONSE>} - A promise that resolves to an internal response object.
 *
 * @throws {Jrror} Throws an error if a route handler returns an invalid value or if all handlers return undefined.
 *
 * @example
 * const response = await handleRoute(request, '/api/data');
 * console.log(response);
 */
const handleRoute = async (
  request: Request,
  response: Response,
  pathURL: string
): Promise<void> => {
  try {
    let method = request.method as ROUTE_METHOD;

    if (!method) {
      method = 'GET';
    } else {
      method = method.toUpperCase() as ROUTE_METHOD;
    }

    // Get the details of the route; handlers to be specific
    const routeDetail = matchRoute(pathURL, method, request);

    // If no route is matched, search for files for then return static files or 404
    // if (
    //   method === 'GET' &&
    //   (!routeDetail?.handlers || routeDetail.handlers.length === 0)
    // ) {
    //   const servingDetail = (() => {
    //     const bestMatch = findBestMatch(
    //       Joor.staticFileDirectories.paths,
    //       pathURL
    //     );

    //     if (!bestMatch) {
    //       return null;
    //     }

    //     return {
    //       routePath: bestMatch,
    //       details: Joor.staticFileDirectories.details[bestMatch],
    //     };
    //   })();

    //   if (!servingDetail) {
    //     const response = new JoorResponse();
    //     response.setStatus(404).setMessage('Not Found');
    //     return response.parseResponse();
    //   }

    //   const response = serveStaticFiles({
    //     routePath: servingDetail.routePath,
    //     folderPath: servingDetail.details.folderPath,
    //     stream: servingDetail.details.stream,
    //     download: servingDetail.details.download,
    //   })(request);

    //   const parsedResponse = response.parseResponse();

    //   if (parsedResponse.status === 200) {
    //     return parsedResponse;
    //   } else {
    //     return new JoorResponse()
    //       .setStatus(404)
    //       .setMessage('Not Found')
    //       .parseResponse();
    //   }
    // }

    if (!routeDetail?.handlers || routeDetail.handlers.length === 0) {
      return response.status(404).send('Route not found');
    }

    for (const handler of routeDetail.handlers) {
      await handler(request, response);
      // If a valid response is returned, parse and return it
    }

    if (response.headersSent) return;

    // If all handlers return undefined, throw an error
    throw new Jrror({
      code: 'handler-return-undefined',
      message:
        'All route handlers returned undefined. At least one must return a response.',
      type: 'error',
    });
  } catch (error: unknown) {
    if (error instanceof Jrror || error instanceof JoorError) {
      error.handle();
    }
    logger.error(error);
    response.json({
      message: 'Internal Server Error',
      status: 500,
    });
  }
};

export default handleRoute;
