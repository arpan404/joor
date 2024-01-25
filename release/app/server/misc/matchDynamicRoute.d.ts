import { REQUEST } from "../../../types/app/index.js";
/** Function to check if the route being accessed is of dynamic type or static type
 * @returns true if route is dynamic
 * @returns false if route is static or not valid
 *
 */
export default function matchDynamicRoute(request: REQUEST, route: string, url: string): boolean;
