/**
 * Represents the HTTP GET method as a string.
 * The GET method requests a representation of the specified resource.
 * Requests using GET should only retrieve data and should not have any other effect on the resource.
 * It is commonly used to fetch data from a server.
 */
const GET = 'GET';

/**
 * A string constant that represents the HTTP POST method.
 *
 * Typically used to indicate a request method where data is sent to the server
 * to create or update a resource.
 */
const POST = 'POST';

/**
 * Represents the HTTP PUT method.
 *
 * The PUT method is used to upload or update the specified resource
 * on a server. It is an idempotent operation, meaning multiple identical
 * requests should have the same effect as a single request.
 *
 * Typically employed to create or replace a resource at a known URL.
 */
const PUT = 'PUT';

/**
 * A constant variable that represents the HTTP DELETE method.
 *
 * The `DELETE` method is typically used to delete a resource identified by the URL from the server.
 * This constant can be used when configuring HTTP requests to clearly indicate the use of the DELETE method.
 */
const DELETE = 'DELETE';

/**
 * Represents the HTTP OPTIONS method.
 * The OPTIONS method is used to describe the communication options
 * for the target resource. Clients can use this method to determine
 * the supported methods or features of a resource on the server.
 *
 * Typically used in Cross-Origin Resource Sharing (CORS) preflight
 * requests and to retrieve information about the requested URL
 * without performing any additional operations.
 */
const OPTIONS = 'OPTIONS';

/**
 * An object containing constants for the standard HTTP methods.
 * Each constant represents a commonly used HTTP request method.
 * These methods are used to specify the action to be performed for a given resource.
 *
 * Properties:
 * - GET: Represents the HTTP GET method, used to request data from a resource.
 * - POST: Represents the HTTP POST method, used to submit data to a resource for processing.
 * - PUT: Represents the HTTP PUT method, used to update or replace a resource.
 * - DELETE: Represents the HTTP DELETE method, used to delete a resource.
 * - OPTIONS: Represents the HTTP OPTIONS method, used to describe the communication options for a resource.
 */
const httpMethodsConstants = {
    GET,
    POST,
    PUT,
    DELETE,
    OPTIONS
};

export default httpMethodsConstants
