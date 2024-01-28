import { REQUEST, RESPONSE } from "joor"

export async function get(req:REQUEST): Promise<RESPONSE>{
  return {
    body: [
      {
        method: req.method,
        username: "@joor",
        email: "joor@domain.com",
      },
    ],
  };
}