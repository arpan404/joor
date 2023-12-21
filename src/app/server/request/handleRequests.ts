import {
  END_POINTS,
  END_POINT_DETAIL,
  INTERNAL_FORMATTED_RESPONSE,
  JOORCONFIG,
  REQUEST,
} from "../../../types/app/index.js";
import Marker from "../../misc/marker.js";
import handleAPIRoute from "./handleAPIRoute.js";

export default async function handleRequests(
  request: REQUEST,
  configData: JOORCONFIG,
  availableRoutesDetail: END_POINTS
): Promise<INTERNAL_FORMATTED_RESPONSE> {
  let response: INTERNAL_FORMATTED_RESPONSE | undefined;
  try {
    const currentRouteData = await findCurrentRouteData(
      request,
      availableRoutesDetail
    );
    console.log(currentRouteData);
    if (currentRouteData) {
      await handleAPIRoute(request, currentRouteData);
    } else {
      response = {
        status: 400,
        body: "Not found",
        headers: { "Content-Type": "text/plain" },
      };
    }
  } catch (error: any) {
    if (configData.doLogs) {
      console.log(Marker.redBright(error));
    }
    response = {
      status: 500,
      body: "Internal Server Error",
      headers: { "Content-Type": "text/plain" },
    };
  } finally {
    return response as INTERNAL_FORMATTED_RESPONSE;
  }
}

async function findCurrentRouteData(
  request: REQUEST,
  availableRoutesDetail: END_POINTS
): Promise<END_POINT_DETAIL | undefined> {
  let currentRouteData: END_POINT_DETAIL | undefined =
    availableRoutesDetail.find((data) => data.route === request.url);

  if (currentRouteData && !currentRouteData.isDynamic) return currentRouteData;
  if (currentRouteData && currentRouteData.isDynamic) return;

  currentRouteData = availableRoutesDetail.find((data) => {
    const matches = matchDynamicRoute(request, data.route, request.url!);
    return matches && data;
  });

  if (currentRouteData && currentRouteData.isDynamic) return currentRouteData;
  return;
}
function matchDynamicRoute(
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
  request.param = param;
  if (mainRoute === urlRoute && idString === ":id") {
    return true;
  }
  return false;
}
