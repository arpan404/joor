import JoorResponse from '@/core/response';

/**
 * Redirects the client to a specified path with an appropriate HTTP status code.
 *
 * This function sets the `Location` header in the response to the given path,
 * and determines the HTTP status code based on whether the redirect is permanent
 * (301) or temporary (302). The status code and headers are then applied to the
 * JoorResponse object, which is returned to the client.
 *
 * @param {string} path - The URL path to redirect the client to.
 * @param {true} permanent - A boolean indicating if the redirect should be permanent.
 *   If `true`, the redirect will be permanent (HTTP status code 301).
 *   If `false` (default), the redirect will be temporary (HTTP status code 302).
 *
 * @returns {Promise<JoorResponse>} A promise that resolves to a JoorResponse object,
 *   which includes the correct status code (301 or 302) and a `Location` header
 *   pointing to the specified path.
 *
 * @example
 * ```typescript
 * const response = await redirect('/new-path', true);
 * return response;
 * // or
 * return redirect('/new-path', true);
 * // This will issue a permanent redirect (301) to '/new-path'.
 * // The response will have status 301 and the Location header set to '/new-path'.
 * ```
 */
export default async function redirect(
  path: string,
  permanent: boolean = true
): Promise<JoorResponse> {
  const response = new JoorResponse();
  const statusCode = permanent ? 301 : 302;
  response.setStatus(statusCode).setHeaders({ Location: path });
  return response;
}
