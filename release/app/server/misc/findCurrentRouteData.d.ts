import { END_POINTS, END_POINT_DETAIL, REQUEST } from "../../../types/app/index.js";
/**
 *
 * @param request - Request object
 * @param availableRoutesDetail - array of obejects of available file path to handle route and whether it has middleware file
 * @returns Details of end point if available else returns undefined
 */
export default function findCurrentRouteData(request: REQUEST, availableRoutesDetail: END_POINTS): Promise<END_POINT_DETAIL | undefined>;
