import { RESPONSE } from "../../index.js";

export default function formatResponse(
  data: RESPONSE,
  routeType: "api" | "web",
): RESPONSE {
  let toReturn: RESPONSE = { body: "" };
  toReturn.status = data.status || 200;
  toReturn.body = routeType === "api" ? JSON.stringify(data.body) : data.body;
  toReturn.headers = data.headers
    ? data.headers
    : routeType === "api"
      ? { "Content-Type": "application/json" }
      : { "Content-Type": "text/html" };
  return toReturn;
}
