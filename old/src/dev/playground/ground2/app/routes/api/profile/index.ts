import { REQUEST, RESPONSE } from "joorData";
export async function get(req:REQUEST):Promise<RESPONSE> {
  console.log(req);
  return {
    body: [
      {
        route: "/api/user/:id",
        filePath:
          "/Users/arpanbhandari/Documents/Coding/joorData/dev/playground/ground1/app/routes/api/[user]/index.js",
        hasMiddleWare: false,
        isDynamic: true,
        type: "api",
      },
    ],
  };
}
