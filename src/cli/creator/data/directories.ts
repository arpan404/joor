import { Directory } from "../../../types/cli/index.js";
import path from "path";
const directories: Directory[] = [
  { name: "app", path: "app" },
  { name: "configs", path: path.join("app", "configs") },
  { name: "routes", path: path.join("app", "routes") },
  { name: "routes", path: path.join("app", "routes") },
  { name: "api", path: path.join("app", "routes", "api") },
  { name: "api", path: path.join("app", "routes", "api", "[user]") },
  { name: "api", path: path.join("app", "routes", "api", "profile") },
  { name: "api", path: path.join("app", "routes", "api", "profile", "[user]") },
  { name: "api", path: path.join("app", "routes", "web") },
  { name: "api", path: path.join("app", "routes", "web", "[user]") },
  { name: "utils", path: path.join("app", "utils") },
  { name: "database", path: path.join("app", "database") },
  { name: "types", path: path.join("app", "types") },
  { name: "public", path: path.join("app", "public") },
  { name: "css", path: path.join("app", "public", "css") },
  { name: "js", path: path.join("app", "public", "js") },
  { name: "videos", path: path.join("app", "public", "videos") },
  { name: "images", path: path.join("app", "public", "images") },
  { name: "tests", path: path.join("app", "tests") },
  { name: "unit", path: path.join("app", "tests", "unit") },
  { name: "integration", path: path.join("app", "tests", "integration") },
];
export default directories;
