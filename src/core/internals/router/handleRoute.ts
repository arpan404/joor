import JoorResponse from '@/core/response';
import { JoorRequest } from '@/types/request';
import { INTERNAL_RESPONSE } from '@/types/response';
import { ROUTE_METHOD } from '@/types/route';

const handleRoute = async (
  request: JoorRequest,
  globalMiddlewares: GLOBAL_MIDDLEWARES,
  pathURL: string
): Promise<INTERNAL_RESPONSE> => {
  try {
    let method = request.method as ROUTE_METHOD;
    if (!method) {
      method = 'GET';
    } else {
      method = method.toUpperCase() as ROUTE_METHOD;
    }
  } catch (error: unknown) {
    const response = new JoorResponse();
    response.setStatus(500).setMessage('Internal Server Error');
    return response.parseResponse();
  }
};
