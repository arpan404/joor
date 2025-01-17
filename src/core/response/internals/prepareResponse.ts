import { INTERNAL_RESPONSE } from "@/core/response/type";
import { PREPARED_RESPONSE } from "@/core/server/type";

/**
 * Prepares the response object to be sent to the client by the HTTP server.
 *
 * This function takes a preprocessed response object of type `INTERNAL_RESPONSE`, processes it,
 * and returns an object of type `PREPARED_RESPONSE` which will be sent to the client.
 * It extracts necessary details like status, headers, data, and cookies to structure the response
 * correctly before sending it.
 *
 * The function ensures that:
 * - The status code is properly set.
 * - The response message and data are correctly formatted based on the data type.
 * - Any headers defined in the response are added to the prepared response.
 * - Any cookies in the response are formatted according to HTTP standards.
 * 
 * ### Key Processing Steps:
 * 1. **Status**: Sets the `status` field in the response.
 * 2. **Data Formatting**: 
 *    - If the `dataType` is not "normal", it wraps the `data` and `message` in a JSON string.
 *    - If the `dataType` is "normal", it directly assigns the `data` to the response.
 * 3. **Headers**: Copies any provided headers into the prepared response.
 * 4. **Cookies**: Formats cookies, ensuring any options (like expiration) are included, and constructs the cookie string.
 * 
 * ### Error Handling:
 * - If cookies are provided, the function processes them correctly by handling expiration and other options.
 *
 * @param {INTERNAL_RESPONSE} response - The preprocessed response object, containing status, data, message, headers, and cookies.
 * @returns {PREPARED_RESPONSE} The prepared response object, structured for the HTTP server to send to the client.
 * 
 * @throws {Error} - This function does not throw any exceptions but will rely on the correctness of the `INTERNAL_RESPONSE` structure.
 */
export default function prepareResponse(
  response: INTERNAL_RESPONSE
): PREPARED_RESPONSE {
  const preparedResponse: PREPARED_RESPONSE = {
    headers: {},
    status: 200,
    data: null,
    cookies: [],
  };

  // Set the response status
  preparedResponse.status = response.status;

  // Format the data based on the type of response
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

  // Copy the headers from the response
  preparedResponse.headers = { ...response.headers };

  // Process and format cookies if they exist
  if (response.cookies) {
    for (const key in response.cookies) {
      if (response.cookies.hasOwnProperty(key)) {
        const cookie = response.cookies[key];

        // Start forming the cookie string
        let cookieStr = `${key}=${cookie.value}`;

        // Handle cookie options (e.g., expiration)
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

        // Push the formatted cookie string into the cookies array
        preparedResponse.cookies.push(cookieStr);
      }
    }
  }

  // Return the prepared response object
  return preparedResponse;
}
