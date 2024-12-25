/**
 * Retrieves the content type from the headers of the provided request object.
 *
 * If the "content-type" header is not found, an empty string is returned.
 *
 * @param {Request} request - The request object containing the headers.
 * @returns {string} The value of the "content-type" header, or an empty string if not present.
 */
const getContentType = (request) => request.headers.get("content-type") || "";

export default getContentType;
