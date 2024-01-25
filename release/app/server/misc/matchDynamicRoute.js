/** Function to check if the route being accessed is of dynamic type or static type
 * @returns true if route is dynamic
 * @returns false if route is static or not valid
 *
 */
export default function matchDynamicRoute(request, route, url) {
    let mainRoute = route.split("/");
    const idString = mainRoute.pop();
    mainRoute = mainRoute.join("/");
    let urlRoute = url.split("/");
    const param = urlRoute.pop();
    urlRoute = urlRoute.join("/");
    request.param = param; //setting dynamic parameter to request object
    if (mainRoute === urlRoute && idString === ":id") {
        return true;
    }
    return false;
}
//# sourceMappingURL=matchDynamicRoute.js.map