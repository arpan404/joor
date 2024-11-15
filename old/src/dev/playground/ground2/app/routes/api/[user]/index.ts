import { REQUEST, RESPONSE } from "joorData";

export async function get(req: REQUEST): Promise<RESPONSE> {
  console.log(req);
  return {
    body: [
      {
        userID: "#ty6a",
        username: "@joorData",
        email: "joorData@domain.com",
      },
      {
        userID: "#ty7a",
        username: "@socioy",
        email: "socioy@domain.com",
      },
    ],
  };
}
