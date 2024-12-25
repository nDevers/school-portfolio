import httpStatusConstants from '@/constants/httpStatus.constants';

import sendResponse from '@/util/sendResponse';

/**
 * Represents a function that sends a response with a "Created" status.
 *
 * @const {Function} CREATED
 * @param {string} message - The message to include in the response data.
 * @param {Date} date - The timestamp associated with the response.
 * @param {Object} request - The request information to include in the response.
 * @returns {*} The standardized "Created" response object.
 */
const CREATED = (message, date, request) =>
    sendResponse(true, httpStatusConstants.CREATED, message, date, request);

/**
 * A function that sends a successful response with predefined parameters.
 *
 * @param {string} message - The message to include in the response.
 * @param {Date} date - The date and time associated with the response.
 * @param {object} request - The original request object.
 * @returns {object} The formatted response object indicating success.
 */
const OK = (message, date, request) =>
    sendResponse(true, httpStatusConstants.OK, message, date, request);

/**
 * Represents a function for handling internal server errors by generating a standardized response.
 *
 * This function creates and sends a response indicating an internal server error with a specified message.
 * It uses the HTTP status code for internal server error, allowing consistent error handling throughout the application.
 *
 * @function
 * @param {string} message - The error message to include in the response, describing the internal server error.
 * @param {Object} request - The request object associated with the error, used for response construction.
 * @returns {void} - Sends the response with the internal server error status and the provided message.
 */
const INTERNAL_SERVER_ERROR = (message, request) =>
    sendResponse(
        false,
        httpStatusConstants.INTERNAL_SERVER_ERROR,
        message,
        {},
        request
    );

/**
 * Handles HTTP conflict responses by sending a standardized error response.
 *
 * This function is used to send a response with an HTTP 409 Conflict status, indicating
 * that the request could not be completed due to a conflict with the current state
 * of the target resource. It provides a consistent structure for the response payload.
 *
 * @param {string} message - The descriptive error message to be sent in the response.
 * @param {Object} request - The HTTP request object associated with the operation.
 * @returns {Object} - The response object with a conflict status, containing the provided
 *                     message and metadata.
 */
const CONFLICT = (message, request) =>
    sendResponse(false, httpStatusConstants.CONFLICT, message, {}, request);

/**
 * A function that sends a response indicating a resource was not found.
 *
 * @param {string} message - The message to include in the response describing the details of the not found error.
 * @param {Object} request - The original request object that led to the not found error.
 * @returns {void}
 */
const NOT_FOUND = (message, request) =>
    sendResponse(false, httpStatusConstants.NOT_FOUND, message, {}, request);

/**
 * BAD_REQUEST is a function used to send a standardized HTTP 400 Bad Request response.
 * It encapsulates the process of constructing and sending a response for cases
 * where the server cannot process a request due to client-side errors.
 *
 * @param {string} message - A descriptive message explaining why the request is considered bad.
 * @param {Object} request - The original request object, used for processing and generating the response.
 * @returns {Object} - The standardized response object indicating the failure and including the provided message.
 */
const BAD_REQUEST = (message, request) =>
    sendResponse(false, httpStatusConstants.BAD_REQUEST, message, {}, request);

/**
 * Represents a function to handle unauthorized access responses.
 *
 * This function generates a standardized response indicating an unauthorized access error.
 * It provides a consistent structure for unauthorized responses across the application
 * by including the status, message, and any additional data related to the request.
 *
 * @param {string} message - The specific message detailing the unauthorized action or reason.
 * @param {Object} request - The request object associated with the unauthorized access.
 * @returns {Object} The structured server response for the unauthorized access scenario.
 */
const UNAUTHORIZED = (message, request) =>
    sendResponse(false, httpStatusConstants.UNAUTHORIZED, message, {}, request);

/**
 * Sends a response indicating a forbidden request.
 *
 * This method creates and sends a response with an HTTP status code of 403 (Forbidden).
 * It is typically used when the server understands the request but refuses to authorize it.
 *
 * @param {string} message - A message describing the reason for the forbidden response.
 * @param {object} request - The HTTP request object triggering the response.
 * @returns {void} - Sends the forbidden response directly.
 */
const FORBIDDEN = (message, request) =>
    sendResponse(false, httpStatusConstants.FORBIDDEN, message, {}, request);

/**
 * A utility function that sends an HTTP response with the status code for "Unsupported Media Type".
 *
 * This function is typically used when a request is made with a media type that is not supported
 * by the server or service. It constructs and sends a response with the given error message and
 * request details.
 *
 * @param {string} message - The error message to include in the response.
 * @param {Object} request - The request object containing details of the client request.
 * @returns {Object} The response object indicating the unsupported media type error.
 */
const UNSUPPORTED_MEDIA_TYPE = (message, request) =>
    sendResponse(
        false,
        httpStatusConstants.UNSUPPORTED_MEDIA_TYPE,
        message,
        {},
        request
    );

/**
 * Handles HTTP responses for unprocessable entity errors.
 *
 * This constant function is used to send a formatted HTTP response indicating
 * that the request entity cannot be processed, typically due to semantic errors
 * in the request payload or invalid data. It encapsulates the response status
 * code, message, and additional metadata.
 *
 * @param {string} message - A descriptive error message explaining the reason for the error.
 * @param {object} request - The HTTP request object associated with the current operation.
 * @returns {object} - The response object sent to the client, containing status, message,
 * and any additional information.
 */
const UNPROCESSABLE_ENTITY = (message, request) =>
    sendResponse(
        false,
        httpStatusConstants.UNPROCESSABLE_ENTITY,
        message,
        {},
        request
    );

/**
 * An object containing a set of shared HTTP response types.
 * These constants can be used to standardize response handling across
 * various parts of the application.
 *
 * @typedef {Object} sharedResponseTypes
 * @property {string} CREATED - Represents an HTTP 201 Created response.
 * @property {string} OK - Represents an HTTP 200 OK response.
 * @property {string} INTERNAL_SERVER_ERROR - Represents an HTTP 500 Internal Server Error response.
 * @property {string} CONFLICT - Represents an HTTP 409 Conflict response.
 * @property {string} NOT_FOUND - Represents an HTTP 404 Not Found response.
 * @property {string} BAD_REQUEST - Represents an HTTP 400 Bad Request response.
 * @property {string} UNAUTHORIZED - Represents an HTTP 401 Unauthorized response.
 * @property {string} FORBIDDEN - Represents an HTTP 403 Forbidden response.
 * @property {string} UNSUPPORTED_MEDIA_TYPE - Represents an HTTP 415 Unsupported Media Type response.
 * @property {string} UNPROCESSABLE_ENTITY - Represents an HTTP 422 Unprocessable Entity response.
 */
const sharedResponseTypes = {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    UNSUPPORTED_MEDIA_TYPE,
    UNPROCESSABLE_ENTITY,
};

export default sharedResponseTypes;
