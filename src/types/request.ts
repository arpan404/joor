import { IncomingMessage } from 'node:http';

// Extending the http.IncomingMessage interface to add a custom property 'param'
declare module 'http' {
  interface IncomingMessage {
    params?: { [key: string]: string }; // The 'params' property is used to store route parameters for the dynamic routes
    query?: { [key: string]: string }; // The 'query' property is used to store query parameters
    joorHeaders?: { [key: string]: string }; // The 'joorHeaders' property is used to store headers specific to the Joor framework
    ip?: string; // The 'ip' property is used to store the IP address of the request
  }
}

// Define a new interface JoorRequest that extends the modified IncomingMessage
// This JoorRequest interface can be used as a type for the request object in the user's code
interface JoorRequest extends IncomingMessage {}

// Export the JoorRequest interface for use in other parts of the application
export { JoorRequest };
