import { END_POINT_DETAIL, INTERNAL_FORMATTED_RESPONSE, JOORCONFIG } from "../../../types/app/index.js";
import { REQUEST } from "../../index.js";
/**
 *
 * @param request - Request object
 * @param routeData - Data related to route
 * @returns ResponseObject - Contains status, body, and headers
 */
export default function handleRoutes(request: REQUEST, routeData: END_POINT_DETAIL, configData: JOORCONFIG): Promise<INTERNAL_FORMATTED_RESPONSE>;
