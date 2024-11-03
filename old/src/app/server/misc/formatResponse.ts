import {
  INTERNAL_FORMATTED_RESPONSE,
  RESPONSE,
} from "../../../types/app/index.js";

export default function formatResponse(
  data: RESPONSE,
  routeType: "api" | "web",
): INTERNAL_FORMATTED_RESPONSE {
  let toReturn: INTERNAL_FORMATTED_RESPONSE = {
    status: 200,
    body: "",
    headers: {},
  };
  toReturn.status = data.status || 200;
  toReturn.body = routeType === "api" ? JSON.stringify(data.body) : data.body;
  toReturn.headers = data.headers
    ? data.headers
    : routeType === "api"
      ? { "Content-Type": "application/json" }
      : { "Content-Type": "text/html" };

  return toReturn;
}
