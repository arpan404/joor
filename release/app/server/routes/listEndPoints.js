import { join } from "path";
import readDirectories from "./readDirectories.js";
import formatRoutes from "./formatRoutes.js";
/**
 * This function scans the whole directory inside 'app/routes/' folder of Joor App
 *
 * @returns Available Valid Routes
 *
 * The array returned from this function is used to check if the endpoint is valid or not.
 *
 * This function helps to load all possible routes in the initilization of server, which makes routing system faster than before.
 *
 */
export default async function listEndPoints() {
    let routes = [];
    let appFolder = join(process.cwd(), "app/routes");
    try {
        const availableRoutes = readDirectories(appFolder);
        for (const route of availableRoutes) {
            try {
                routes = [...routes, formatRoutes(route)];
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
    catch (error) {
        return (routes = []);
    }
    return routes;
}
//# sourceMappingURL=listEndPoints.js.map