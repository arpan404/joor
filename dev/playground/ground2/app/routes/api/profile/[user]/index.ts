import { REQUEST, RESPONSE } from "joor";

export async function get(req: REQUEST): Promise<RESPONSE> {
  return {
    body: [
      {
        route: "/api/user/:id",
        filePath:
          "/Users/arpanbhandari/Documents/Coding/joor/dev/playground/ground1/app/routes/api/[user]/index.js",
        hasMiddleWare: false,
        isDynamic: true,
        type: "api",
      },
      {
        route: "/api/user/:id",
        filePath:
          "/Users/arpanbhandari/Documents/Coding/joor/dev/playground/ground1/app/routes/api/[user]/index.js",
        hasMiddleWare: false,
        isDynamic: true,
        type: "api",
      },
    ],
  };
}
