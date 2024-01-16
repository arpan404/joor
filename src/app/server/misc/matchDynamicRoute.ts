import { REQUEST } from "../../../types/app/index.js";

/** Function to check if the route being accessed is of dynamic type or static type
 * @returns true if route is dynamic
 * @returns false if route is static or not valid
 * 
 */
export default function matchDynamicRoute(
  request: REQUEST,
  route: string,
  url: string
): boolean {
  let mainRoute: Array<string> | string = route.split("/");
  const idString = mainRoute.pop();
  mainRoute = mainRoute.join("/");
  let urlRoute: Array<string> | string = url.split("/");
  const param = urlRoute.pop();
  urlRoute = urlRoute.join("/");
  request.param = param; //setting dynamic parameter to request object
  if (mainRoute === urlRoute && idString === ":id") {
    return true;
  }
  return false;
}
