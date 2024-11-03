import { REQUEST, RESPONSE } from "joor";

export async function get(req: REQUEST): Promise<RESPONSE> {
  console.log(req);
  return {
    body: [
      {
        userID: "#ty6a",
        username: "@joor",
        email: "joor@domain.com",
      },
      {
        userID: "#ty7a",
        username: "@socioy",
        email: "socioy@domain.com",
      },
    ],
  };
}
