import { RESPONSE } from "../../../../../src/types/app";

export function route(request: Request): any{
  return {
    response:{
        body:{
            name:"Arpan"
        }
    }
  };
}
