/**
 * Parses a URL query string into an object of key-value pairs.
 *
 * This function takes a search query string, processes it using the `URLSearchParams` API,
 * and converts the key-value pairs into a JavaScript object.
 *
 * @param {string} search - The query string to be parsed, typically from the URL.
 * @returns {Object} An object where each key corresponds to a parameter name from the query string
 * and its value is the associated parameter value.
 */
const getQueryParams = (search) => {
    const urlParams = new URLSearchParams(search); // Parse the search query string
    const params = {};

    // Iterate over the searchParams to extract key-value pairs
    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};

export default getQueryParams;
