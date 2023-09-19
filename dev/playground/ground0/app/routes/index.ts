import { RESPONSE } from "joor";

export function route(request: Request): RESPONSE {
  console.log(request)
  return {
    body: {
      name: "Arpan",
    },
  };
}
