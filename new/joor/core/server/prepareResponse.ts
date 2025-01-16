import { INTERNAL_RESPONSE } from "@/core/response/type";
import { PREPARED_RESPONSE } from "./type";

function prepareResponse(response: INTERNAL_RESPONSE) {
  const preparedResponse = {
    headers: {} as { [key: string]: string },
    status: 200,
    data: null,
  } as PREPARED_RESPONSE;
  preparedResponse.status = response.status;
  if (response.data) {
    preparedResponse.data = response.data;
  } else {
    if (response.message) {
      preparedResponse.data = response.message;
    }
  }
  for (const key in response.headers) {
    preparedResponse.headers[key] = response.headers[key];
  }
}
