import { ROUTE_HANDLER } from "../router/type"

type CORS_OPTIONS ={
  origins?: Array<string> | "*"
  methods?: Array<ROUTE_HANDLER> | "*"
  allowedHeaders?: Array<{[key:string]: string}> | "*"
  allowsCookies?: boolean,
  maxAge?: number
}

export {CORS_OPTIONS}
