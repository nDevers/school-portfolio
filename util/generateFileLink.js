'use strict';

/**
 * Generates a complete file URL based on the server's address and the provided file path.
 *
 * This function dynamically determines the server's protocol and host from the
 * request headers, constructs the base URL, and appends the given file path to it.
 *
 * @param {Object} request - The HTTP request object containing headers.
 * @param {string} filePath - The path to the file to be appended to the base URL.
 * @returns {string} - The full URL of the file.
 */
const generateFileLink = (request, filePath) => {
    // Extract host and protocol information from the request headers
    const host = request.headers.get('host');
    const protocol = host.startsWith('localhost') ? 'http' : 'https';

    // Dynamically create the server base URL
    const SERVER_BASE_URL = `${protocol}://${host}`;

    return `${SERVER_BASE_URL}/${filePath}`;
};

export default generateFileLink;
