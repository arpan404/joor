// Type of data that a function handling a certain route should return
type RESPONSE = {
  status?: number;
  body: any;
};

/*

examples:

function route(req:Request):RESPONSE{
  return {
    status:200,
    body:"Hello World"
  }
}

function route(req:Request):RESPONSE{
  return{
    status:404,
    body:{
      message:"Not Found"
    }
  }
}

*/

export default RESPONSE;
