import { INTERNAL_RESPONSE, PREPARED_RESPONSE } from '@/types/response';

/**
 * Prepares the response object to be sent to the client.
 *
 * @param {INTERNAL_RESPONSE} response - The preprocessed response object.
 * @returns {PREPARED_RESPONSE} The prepared response object.
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
  if (response.data && response.message && response.dataType !== 'normal') {
    preparedResponse.data = JSON.stringify({
      message: response.message,
      data: response.data,
    });
  } else if (
    response.data &&
    response.message &&
    response.dataType === 'normal'
  ) {
    preparedResponse.data = response.data;
  }

  // Copy the headers from the response
  preparedResponse.headers = { ...response.headers };

  // Process and format cookies if they exist
  if (response.cookies) {
    for (const key in response.cookies) {
      if (response.cookies[key]) {
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
                : '';
              return `${option}=${value}`;
            })
            .join('; ');

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
