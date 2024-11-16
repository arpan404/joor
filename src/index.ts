/*
 - This file acts as the main entry point for the framework.
 - It imports and exports all essential classes, methods, and functions that users need access to.
 - Ensure that each class or function is imported from its respective file and exported from here for consistency and simplicity.

 - If there are any new classes or functions that should be available to users, import them from their respective files 
   and export them from this file to maintain a central access point.

 - Example:
   import { Response } from "./server";
   export { Response };

 - For clarity, the 'Joor' class is exported as the default from this file.
*/

import Joor from "./core";

// Default export: Joor class
export default Joor;

import { Response, REQUEST } from "./core/server";

export { Response, REQUEST };
