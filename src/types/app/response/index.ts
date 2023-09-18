
/** 
@example
// If the function returns a status code and a body in string form
function route(req:Request):RESPONSE{
  return { status:200, body:"Hello World"}
}

@example
// If the function returns a status code and a body in Object form
function route(req:Request):RESPONSE{
  return{
    status:404,
    body:{ message:"Not Found"}
  }
}
*/
// This is the type for the response that is returned by the function of a route
type RESPONSE = {
  status?: number;
  body: any;
};

/**
 *@example
 *Successful response:
 * return {
 *   success: true,
 *   response: {
 *   status: 200,
 *   body: "Success"
 *   }
 * }
 *
 * @example
 * Failed response:
 * return {
 *  success: false,
 *  code: "FileNotFound",
 * }
 */

// This is the type for the response that is returned by the function handling a route
type INTERNAL_RESPONSE = {
  success: boolean;
  response?: RESPONSE;
  code?: string;
};
export { RESPONSE, INTERNAL_RESPONSE };
