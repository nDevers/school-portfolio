/**
 * Prepares form data for logging by transforming any `FormData` or object containing `File` instances
 * into a serialized structure that includes base64-encoded files. This method also includes query
 * parameters and route parameters in the final logged data.
 *
 * @param {FormData|Object|null} data - The form data or object containing data to be logged. Can be `null` or `undefined`.
 * @param {Object} [queryAndParams={}] - An optional object containing query and route parameters.
 * @param {Object} [queryAndParams.query] - The query parameters to include in the logged data.
 * @param {Object} [queryAndParams.params] - The route parameters to include in the logged data.
 *
 * @returns {Promise<Object>} A promise resolving to an object containing the serialized body, query parameters, and route parameters:
 * - `body` contains the form data or object, with `File` instances transformed into base64-encoded strings.
 * - `query` contains the passed query parameters.
 * - `params` contains the passed route parameters.
 *
 * @throws {Error} May throw an error if the `File` or `FormData` processing fails.
 */
const prepareFormDataForLogging = async (data, queryAndParams = {}) => {
    const loggedData = {
        body: {},
        query: queryAndParams.query || {},
        params: queryAndParams.params || {},
    };

    // Check if data is null or undefined to avoid processing errors
    if (!data) {
        return loggedData;
    }

    // Handle FormData separately
    if (data instanceof FormData) {
        for (const [key, value] of data.entries()) {
            if (value instanceof File) {
                const fileData = await value.arrayBuffer();
                const base64String = Buffer.from(fileData).toString('base64');
                loggedData.body[key] =
                    `data:${value.type};base64,${base64String}`;
            } else {
                loggedData.body[key] = value;
            }
        }
    } else {
        // Handle plain object, and check if it contains File instances
        for (const [key, value] of Object.entries(data)) {
            if (value instanceof File) {
                const fileData = await value.arrayBuffer();
                const base64String = Buffer.from(fileData).toString('base64');
                loggedData.body[key] =
                    `data:${value.type};base64,${base64String}`;
            } else {
                loggedData.body[key] = value;
            }
        }
    }

    return loggedData;
};

export default prepareFormDataForLogging;
