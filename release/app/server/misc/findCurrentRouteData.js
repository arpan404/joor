import matchDynamicRoute from "./matchDynamicRoute.js";
/**
 *
 * @param request - Request object
 * @param availableRoutesDetail - array of obejects of available file path to handle route and whether it has middleware file
 * @returns Details of end point if available else returns undefined
 */
export default async function findCurrentRouteData(request, availableRoutesDetail) {
    let currentRouteData = availableRoutesDetail.find((data) => data.route === request.url);
    if (currentRouteData && !currentRouteData.isDynamic)
        return currentRouteData;
    if (currentRouteData && currentRouteData.isDynamic)
        return;
    // Getting route data considering it as a dynamic route
    currentRouteData = availableRoutesDetail.find((data) => {
        const matches = matchDynamicRoute(request, data.route, request.url);
        return matches && data;
    });
    if (currentRouteData && currentRouteData.isDynamic)
        return currentRouteData;
    return;
}
//# sourceMappingURL=findCurrentRouteData.js.map