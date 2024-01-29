import path from "path";
const routeFiles = [
    {
        path: path.join("app", "routes", "api"),
        type: "normal",
        variant: "api",
    },
    {
        path: path.join("app", "routes", "api", "profile"),
        type: "normal",
        variant: "api",
    },
    {
        path: path.join("app", "routes", "api", "profile", "[user]"),
        type: "dynamic",
        variant: "api",
    },
    {
        path: path.join("app", "routes", "api", "[user]"),
        type: "dynamic",
        variant: "api",
    },
    {
        path: path.join("app", "routes", "web"),
        type: "normal",
        variant: "web",
    },
    {
        path: path.join("app", "routes", "web", "[user]"),
        type: "dynamic",
        variant: "web",
    },
];
export { routeFiles };
//# sourceMappingURL=files.js.map