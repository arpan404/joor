import { AVAILABLE_ROUTE, END_POINT_DETAIL } from "../../../types/app/index.js";
/**
 *
 * @param route - Returned By readDirectories function
 * @returns Individual Route details
 * @description  This function is used to format individual route details in proper usuable format.
 * @example formatRoutes({filePath: "/Users/Admin/Desktop/my-backend/app/routes/web/home/index.ts", hasMiddleWare: false}
 */
export default function formatRoutes(route: AVAILABLE_ROUTE): END_POINT_DETAIL;
