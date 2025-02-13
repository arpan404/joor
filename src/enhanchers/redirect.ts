import JoorResponse from '@/core/reponse';

/**
 * Redirects the client to the given path, when returned from a route handler or middleware.
 * @param path The URL to redirect to.
 * @param permanent Whether the redirect is permanent (301) or temporary (302). Defaults to true.
 * @returns A JoorResponse with the appropriate status code and Location header.
 *
 * @example
 * ```ts
 * // Redirect to a new path
 * router.get('/old-path', async () => {
 *  return redirect({
 *    path: '/new-path',
 *    permanent: true,
 *  });
 * });
 *
 * // Redirect to a new path temporarily
 * router.get('/temporary-path', async () => {
 *  return redirect({
 *    path: '/new-path',
 *    permanent: false,
 *  });
 * });
 * ```
 */
export default async function redirect({
  path,
  permanent = true,
}: {
  path: string;
  permanent?: boolean;
}): Promise<JoorResponse> {
  const response = new JoorResponse();
  const statusCode = permanent ? 301 : 302;
  response.setStatus(statusCode).setHeaders({ Location: path });
  return response;
}
