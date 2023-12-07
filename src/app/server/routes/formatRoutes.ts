import { AVAILABLE_ROUTE, END_POINT_DETAIL } from "types/app/index.js";

/**
 *
 * @param route - Returned By readDirectories function
 * @returns Individual Route details
 * @description  This function is used to format individual route details in proper usuable format.
 * @example formatRoutes({filePath: "/Users/Admin/Desktop/my-backend/app/routes/web/home/index.ts", hasMiddleWare: false}
 */

export default function formatRoutes(route: AVAILABLE_ROUTE): END_POINT_DETAIL {
  const formatedRoute: END_POINT_DETAIL = {
    route: "",
    filePath: route.filePath,
    hasMiddleWare: route.hasMiddleWare,
    isDynamic: false,
    type: route.filePath.includes("/app/routes/api") ? "api" : "web",
  };
  const routePathSplitted = route.filePath.split("/app/routes/");
  if (routePathSplitted.length !== 2) {
    throw new Error(
      "There cannot be more than one '/app/routes/' in path of your project"
    );
  }
  let routePath: string | string[] = routePathSplitted[1].split("/");
  routePath.pop();
  const dynamicRouteRegEx = /^\[.*\]$/;
  let dynamicFolders = 0;
  for (let i in routePath) {
    let index = parseInt(i);
    routePath[index].match(dynamicRouteRegEx) ? dynamicFolders++ : "";
    if (dynamicFolders > 1) {
      throw new Error("You cannot use nested dynamic routing");
    }
    if (routePath[index].match(dynamicRouteRegEx)) {
      if (index !== routePath.length - 1) {
        throw new Error(
          "You can only use any other end points inside dynamic endpoint"
        );
      }
    }
  }
  routePath = "/" + routePath.join("/");
  dynamicFolders > 0 ? (formatedRoute.isDynamic = true) : "";

  if (formatedRoute.isDynamic) {
    const dynamicElement = routePath
      .split("/")
      .pop()!
      .replace("[", "")
      .replace("]", "");
    routePath = routePath.replace(`[${dynamicElement}]`, "");
    routePath = routePath + `${dynamicElement}/:id`;
  }
  routePath = routePath.replace("/web", "");
  routePath.length === 0 ? (routePath = "/") : "";
  formatedRoute.route = routePath;
  return formatedRoute;
}
