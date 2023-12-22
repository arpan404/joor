import {
  END_POINT_DETAIL,
  INTERNAL_FORMATTED_RESPONSE,
  RESPONSE,
} from "../../../types/app/index.js";
import { REQUEST } from "../../index.js";

export default async function handleRoutes(
  request: REQUEST,
  routeData: END_POINT_DETAIL
): Promise<INTERNAL_FORMATTED_RESPONSE> {
  const module = await import(routeData.filePath);
  let data: RESPONSE;
  if (module[request.method!.toLowerCase()]) {
    data = await module[request.method!.toLowerCase()](request);
  } else {
    data = await module.route(request);
  }
  if (!data) {
    return {
      status: 400,
      body: "Not found",
      headers: { "Content-Type": "text/plain" },
    };
  }
  data.body = routeData.type === "api" ? JSON.stringify(data.body) : data.body;
  data.headers = data.headers
    ? data.headers
    : routeData.type === "api"
    ? { "Content-Type": "application/json" }
    : { "Content-Type": "text/html" };

  return {
    status: data.status || 200,
    body: data.body,
    headers: data.headers,
  };
}
