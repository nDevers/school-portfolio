/**
 * Retrieves the name of the function that called the current function.
 *
 * This function analyzes the error stack trace to determine the caller's function name.
 * If the caller's name cannot be determined, it returns "UNKNOWN".
 *
 * @returns {string} The name of the caller function, or "UNKNOWN" if the name cannot be determined.
 */
const getCallerFunctionName = () => {
    const stack = new Error().stack || '';
    const stackArray = stack.split('\n');

    // Get the second stack frame (the caller function's name)
    const callerFrame = stackArray[2] || '';

    // Extract the function name using regex (matches words before the parentheses)
    const match = callerFrame.match(/at (\w+)/);

    return match ? match[1] : 'UNKNOWN';
};

export default getCallerFunctionName;
