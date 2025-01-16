import { JoorRequest } from "@/core/request/type";
import JoorResponse from "@/core/response";
async function routeHandler(req: JoorRequest): Promise<JoorResponse> {
  try {
    const url = req.url;
    const response = new JoorResponse();
    response.setStatus(200).setMessage("Success");
    return response;

  } catch (e) {
    console.error(e);
    const response = new JoorResponse();
    response.setStatus(500).setMessage("Internal Server Error");
    return response;
  }
}

export default routeHandler;
