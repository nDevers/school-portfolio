/**
 * Extracts the authentication token from the Authorization header in the request.
 *
 * The function retrieves the Authorization header from the incoming request's headers.
 * If the header exists and starts with the "Bearer " scheme, it extracts and returns the token portion
 * of the header by removing the "Bearer " prefix. If the header is absent, does not start with "Bearer ",
 * or is otherwise invalid, the function returns null.
 *
 * @param {Request} request - The incoming request object containing headers with potential authorization information.
 * @returns {string|null} The extracted authentication token if valid, otherwise null.
 */
const getAuthToken = (request) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader?.slice(7); // Remove "Bearer " (7 characters)
    }
    return null; // Return null if no valid token is found
};

export default getAuthToken;
