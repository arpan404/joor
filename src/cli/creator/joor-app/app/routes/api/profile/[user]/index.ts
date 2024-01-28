import { REQUEST, RESPONSE } from "joor"

export async function get(req:REQUEST): Promise<RESPONSE>{
  return {
    body: [
      {
        userID: req.param,
        username: "@joor",
        email: "joor@domain.com",
      },
    ],
  };
}