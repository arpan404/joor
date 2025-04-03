import Jrror from "@/core/error"; // Ensure "@/core/error" exports a valid Jrror class or function
/**
* Implicitly asserts that a condition is true. If the condition is false, it throws an error with the provided message and documentation path.
* Alternative to `assert(condition, message)` from the `node:assert` module.
* 
* For naming convention, `jssert` is used to avoid confusion with the `assert` function from the `node:assert` module.
* 
* @param {boolean} condition - The condition to assert.
* @param {string} message - The error message to throw if the assertion fails.
* @param {string} docsPath - The documentation path for the error.
*/
function jssert(condition: boolean, message: string, docsPath:string = "/assertion"): asserts condition {
    if (!condition) {
        throw new Jrror({
            code: 'assertion-failed',
            message,
            type: 'error',
            docsPath: docsPath,
        })
    }
}
export default jssert;