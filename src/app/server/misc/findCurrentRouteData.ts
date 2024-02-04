import {
  END_POINTS,
  END_POINT_DETAIL,
  REQUEST,
} from "../../../types/app/index.js";
import matchDynamicRoute from "./matchDynamicRoute.js";

/**
 *
 * @param request - Request object
 * @param availableRoutesDetail - array of obejects of available file path to handle route and whether it has middleware file
 * @returns Details of end point if available else returns undefined
 */
export default async function findCurrentRouteData(
  request: REQUEST,
  availableRoutesDetail: END_POINTS,
): Promise<END_POINT_DETAIL | undefined> {
  let currentRouteData: END_POINT_DETAIL | undefined =
    availableRoutesDetail.find((data) => data.route === request.url);
  if (currentRouteData && !currentRouteData.isDynamic) return currentRouteData;
  if (currentRouteData && currentRouteData.isDynamic) return;

  // Getting route data considering it as a dynamic route
  currentRouteData = availableRoutesDetail.find((data) => {
    const matches = matchDynamicRoute(request, data.route, request.url!);
    return matches && data;
  });

  if (currentRouteData && currentRouteData.isDynamic) return currentRouteData;
  return;
}
