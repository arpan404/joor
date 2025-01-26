import JoorError from '@/core/error/JoorError';
import { JOOR_ERROR } from '@/types/error';

/**
 * Class to work with errors
 *
 * @example
 * ```typescript
 * // Throwing an error
 * throw new Jrror({code:"config-p1",
 * message: `Error: The configuration file '${joorData.configFile}' for Joor app is not found.\nMake sure the file is in the root directory of your project.`,
 * type: "panic"
 * })
 *
 * // Handling the thrown error
 * try{
 * ...
 * }
 * catch(error:unknown){
 *    if (error instanceof Jrror){
 *          if (error.type !=="warn"){
 *              error.handle() // Call this method to log and handle the error based on its type
 *          }
 *          else{
 *              error.reject() // Call this method to reject the error
 *          }
 *    }
 * }
 *
 *
 *
 */

class Jrror extends JoorError {
  constructor(errorData: JOOR_ERROR) {
    // Validate the error data provided when creating the instance of Jrror class
    if (!errorData?.code || !errorData.message || !errorData.type) {
      // Throws error code joor-e1 if errorData is not provided, e2 if code is not provided, e3 if message is not provided, e4 if type is not provided
      throw new Jrror({
        message: `Instance of Jrror has been created without passing required data. 
              Missing: ${
                !errorData
                  ? 'errorData'
                  : !errorData.code
                    ? 'error code'
                    : !errorData.message
                      ? 'message'
                      : 'type'
              }`,
        code: `jrror-${
          !errorData
            ? 'e1'
            : !errorData.code
              ? 'e2'
              : !errorData.message
                ? 'e3'
                : 'e4'
        }`,
        type: 'error',
      });
    }
    super({
      errorCode: errorData.code,
      message: errorData.message,
      type: errorData.type,
      docsPath: errorData.docsPath ?? '/',
    });
  }
}

export default Jrror;
