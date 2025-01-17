import { IncomingMessage } from 'http';

// Extending the http.IncomingMessage interface to add a custom property 'param'
declare module 'http' {
  interface IncomingMessage {
    params?: { [key: string]: any }; // The 'params' property is used to store route parameters for the dynamic routes
  }
}

// Define a new interface JoorRequest that extends the modified IncomingMessage
// This JoorRequest interface can be used as a type for the request object in the user's code
interface JoorRequest extends IncomingMessage {}

// Export the JoorRequest interface for use in other parts of the application
export { JoorRequest };
