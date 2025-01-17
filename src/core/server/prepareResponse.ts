import { INTERNAL_RESPONSE } from "@/core/response/type";
import { PREPARED_RESPONSE } from "@/core/server/type";

export default function prepareResponse(
  response: INTERNAL_RESPONSE
): PREPARED_RESPONSE {
  const preparedResponse: PREPARED_RESPONSE = {
    headers: {},
    status: 200,
    data: null,
    cookies: [],
  };

  preparedResponse.status = response.status;

  if (response.data && response.message && response.dataType !== "normal") {
    preparedResponse.data = JSON.stringify({
      message: response.message,
      data: response.data,
    });
  } else if (
    response.data &&
    response.message &&
    response.dataType === "normal"
  ) {
    preparedResponse.data = response.data;
  }

  preparedResponse.headers = { ...response.headers };

  if (response.cookies) {
    for (const key in response.cookies) {
      if (response.cookies.hasOwnProperty(key)) {
        const cookie = response.cookies[key];

        let cookieStr = `${key}=${cookie.value}`;

        if (cookie.options) {
          if (cookie.options.expires instanceof Date) {
            cookie.options.expires = cookie.options.expires.toUTCString();
          }

          const options = Object.keys(cookie.options)
            .map((option) => {
              const value = cookie.options
                ? cookie.options[option as keyof typeof cookie.options]
                : "";
              return `${option}=${value}`;
            })
            .join("; ");

          if (options) {
            cookieStr += `; ${options}`;
          }
        }

        preparedResponse.cookies.push(cookieStr);
      }
    }
  }
  return preparedResponse;
}
