// import { RESPONSE } from "./type";

// /**
//  * A class representing a standardized response structure commonly used in API responses.
//  * It includes attributes like HTTP status, message, data, error information, cookies, headers, and session data.
//  * This class is useful for handling and sending consistent responses from API endpoints.
//  * 
//  * @example
//  * // Create a successful response with a status of 200 and message "OK!"
//  * return Response.send({ status: 200, message: "OK!" });
//  * 
//  * @template T - The type of the data included in the response (e.g., an object, array, or primitive data type).
//  */
// class Response<T> {
//   /**
//    * The HTTP status code of the response (e.g., 200 for success, 404 for not found).
//    *
//    * @type {number}
//    */
//   public status: RESPONSE<T>["status"] = 200;

//   /**
//    * A message associated with the response, such as "OK" or an error message.
//    *
//    * @type {string}
//    */
//   public message: RESPONSE<T>["message"];

//   /**
//    * The actual data returned by the API. This can be any type defined by the generic type `T`.
//    * It may include objects, arrays, or primitive values.
//    *
//    * @type {T}
//    */
//   public data: RESPONSE<T>["data"];

//   /**
//    * An error message or null if no error occurred.
//    * This field is typically used when the request fails.
//    *
//    * @type {string | null}
//    */
//   public error: RESPONSE<T>["error"];

//   /**
//    * Cookies associated with the response, if applicable.
//    * Often used for session management or tracking.
//    *
//    * @type {object | null}
//    */
//   public cookies: RESPONSE<T>["cookies"];

//   /**
//    * HTTP headers associated with the response, such as content type or authentication data.
//    *
//    * @type {object | null}
//    */
//   public headers: RESPONSE<T>["headers"];

//   /**
//    * Session data relevant to the response, typically for maintaining user state across requests.
//    *
//    * @type {object | null}
//    */
//   public session: RESPONSE<T>["session"];

//   /**
//    * Constructs a new instance of the `Response` class with the provided response data.
//    * 
//    * @param {RESPONSE<T>} responseData - An object containing the necessary fields for the response (status, message, data, etc.).
//    * @constructor
//    */
//   constructor(responseData: RESPONSE<T>) {
//     this.status = responseData.status;
//     this.message = responseData.message;
//     this.data = responseData.data;
//     this.error = responseData.error;
//     this.cookies = responseData.cookies;
//     this.headers = responseData.headers;
//     this.session = responseData.session;
//   }

//   /**
//    * A static method that creates and returns a new `Response` instance based on the provided response data.
//    * 
//    * @example
//    * // Example usage:
//    * return Response.send({ status: 200, message: "OK!", data: { user: "John Doe" } });
//    * 
//    * @param {RESPONSE<T>} responseData - An object containing the response data (status, message, data, etc.).
//    * @returns {Response<T>} A new instance of the `Response` class with the provided data.
//    */
//   static send<T>(responseData: RESPONSE<T>): Response<T> {
//     return new Response(responseData);
//   }
// }

// export default Response;
