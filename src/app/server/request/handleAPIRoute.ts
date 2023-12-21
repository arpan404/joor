import { END_POINT_DETAIL, RESPONSE } from "../../../types/app/index.js";
import { REQUEST } from "../../index.js";

export default async function handleAPIRoute(
  request: REQUEST,
  routeData: END_POINT_DETAIL
) {
  const module = await import(routeData.filePath);
  let data: RESPONSE;
  console.log(request.param);
  if (module[request.method!]) {
    data = await module[request.method!](request);
  } else {
    data = await module.route(request);
  }
  return data;
}
