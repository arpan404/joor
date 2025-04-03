import Jrror, { JoorError } from "@/core/error";
import logger from "@/helpers/joorLogger";

/**
 * Handles errors by checking their type and calling the appropriate method.
 * If the error is not an instance of Jrror or JoorError, it logs the error.
 *
 * @param {unknown} error - The error to handle.
 * 
 * Meant to reduce code duplication while handling errors in the codebase.
 */
function handleError(error: unknown): void {
    if (error instanceof Jrror || error instanceof JoorError) {
        error.handle();
    } else {
        logger.error(error);
    }
}

export default handleError;