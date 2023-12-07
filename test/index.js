import fs from "fs";
import path from "path";
function readDirectories(appFolder) {
  let routesAvailable = [];
  const routeData = {
    filePath: "",
    hasMiddleWare: false,
  };
  const files = fs.readdirSync(appFolder);
  if (files.includes("index.js") || files.includes("index.ts")) {
    routeData.filePath = path.join(
      appFolder,
      files.includes("index.js") ? "index.js" : "index.ts"
    );
  }
  if (files.includes("middleware.js") || files.includes("middleware.ts")) {
    routeData.hasMiddleWare = true;
  }
  if (routeData.filePath.length !== 0) {
    routesAvailable = [...routesAvailable, routeData];
  }
  files.forEach((file) => {
    const filePath = path.join(appFolder, file);
    if (fs.statSync(filePath).isDirectory()) {
      routesAvailable = [...routesAvailable, ...readDirectories(filePath)];
    }
  });
  return routesAvailable;
}
function formatRoutes(route) {
  const formatedRoute = {
    route: "",
    filePath: route.filePath,
    hasMiddleWare: route.hasMiddleWare,
    isDynamic: false,
    type: route.filePath.includes("/app/routes/api") ? "api" : "web",
  };
  const routePathSplitted = route.filePath.split("/app/routes/");
  if (routePathSplitted.length !== 2) {
    throw new Error(
      "There cannot be more than one '/app/routes/' in path of your project"
    );
  }
  let routePath = routePathSplitted[1].split("/");
  routePath.pop();
  const dynamicRouteRegEx = /^\[.*\]$/;
  let dynamicFolders = 0;
  for (let index in routePath) {
    index = parseInt(index);
    routePath[index].match(dynamicRouteRegEx) ? dynamicFolders++ : "";
    if (dynamicFolders > 1) {
      throw new Error("You cannot use nested dynamic routing");
    }
    if (routePath[index].match(dynamicRouteRegEx)) {
      if (index !== routePath.length - 1) {
        throw new Error(
          "You can only use any other end points inside dynamic endpoint"
        );
      }
    }
  }
  routePath = "/" + routePath.join("/");
  dynamicFolders > 0 ? (formatedRoute.isDynamic = true) : "";

  if (formatedRoute.isDynamic) {
    const dynamicElement = routePath
      .split("/")
      .pop()
      .replace("[", "")
      .replace("]", "");
    routePath = routePath.replace(`[${dynamicElement}]`, "");
    routePath = routePath + `${dynamicElement}/:id`;
  }
  routePath = routePath.replace("/web", "");
  routePath.length === 0 ? (routePath = "/") : "";
  formatedRoute.route = routePath;
  return formatedRoute;
}
export default function index() {
  let routes = [];
  const appFolder = path.join(process.cwd(), "app/routes");
  const availableRoutes = readDirectories(appFolder);
  for (const route of availableRoutes) {
    try {
      routes = [...routes, formatRoutes(route)];
    } catch (error) {
      throw new Error(error);
    }
  }
  return routes;
}
const a = index();
console.log(a);
