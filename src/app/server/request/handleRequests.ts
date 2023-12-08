import { IncomingMessage } from "http";
import {
  END_POINTS,
  INTERNAL_FORMATTED_REQUEST,
  JOORCONFIG,
} from "../../../types/app/index.js";

export default async function handleRequests(
  request: IncomingMessage,
  configData: JOORCONFIG,
  availableRoutes: END_POINTS
): Promise<INTERNAL_FORMATTED_REQUEST> {
  console.log(request, configData, availableRoutes);
  return {
    status: 400,
    body: "Not Found",
    headers: { "Content-Type": "text/plain" },
  };
}
