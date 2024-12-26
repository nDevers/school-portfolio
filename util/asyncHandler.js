import { z } from 'zod';
import mongoose from 'mongoose';

import httpStatusConstants from '@/constants/httpStatus.constants';
import logger from '@/lib/logger';
import enviornmentsConstants from '@/constants/enviornments.constants';

import configurations from '@/configs/configurations';
import sendResponse from '@/util/sendResponse';

/**
 * Represents a configuration object retrieved asynchronously.
 *
 * The `configuration` variable holds the configuration settings obtained
 * from a call to the `configurations()` asynchronous function. This may
 * include various system-specific, environment-specific, or application-specific
 * settings that are required for proper execution or customization.
 *
 * The exact structure of the returned configuration object depends on the
 * implementation of the `configurations()` function.
 *
 * Note:
 * - Ensure the configuration is fetched successfully before proceeding with
 *   dependent operations.
 * - Handle any potential errors that may arise during the asynchronous call.
 * - The returned configuration object may contain sensitive information, be cautious
 *   with logging or sharing its contents.
 */
const configuration = await configurations();

/**
 * Represents an error for bad requests, typically caused by invalid client inputs.
 * Extends the built-in Error object.
 */
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.status = httpStatusConstants.BAD_REQUEST;
    }
}

/**
 * Represents an error specific to cryptographic operations.
 *
 * This class extends the built-in Error class and is used to standardize
 * cryptographic error handling. It provides a default name and HTTP status
 * code for errors that occur during cryptographic operations.
 *
 * Usage of this class allows consistent error reporting and simplifies
 * debugging of cryptographic-related issues.
 *
 * Extends:
 * - Error
 *
 * Properties:
 * - name: A string that specifies the type of error, set to "CryptoError".
 * - status: A numeric HTTP status code, defaulting to 500 (Internal Server Error).
 *
 * Constructor:
 * - Accepts a custom error message as a parameter and sets it on the error object.
 *
 * Note:
 * This error class is commonly used in scenarios where cryptographic
 * computations, encryption, or decryption processes fail unexpectedly.
 */
export class CryptoError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CryptoError';
        this.status = httpStatusConstants.INTERNAL_SERVER_ERROR; // 500 Internal Server Error
    }
}

/**
 * Handles general errors by standardizing the error response format and providing appropriate error messages
 * based on the type of error received.
 *
 * This function is designed to handle a variety of potential error conditions, such as invalid ID formats,
 * network connection issues, or other general server errors. It processes the error object to extract useful
 * metadata and creates a structured error response.
 *
 * @param {Error} error - The error object to be handled. It may include details such as `name`, `message`, `stack`,
 *                        `code`, `cause`, `isOperational`, and other meta information.
 * @returns {Object} An object representing the standardized response, which includes:
 *                   - `success`: Indicates the operation failed (always `false`).
 *                   - `message`: A human-readable error message.
 *                   - `errors`: An object containing detailed error information such as:
 *                       - `message`: The original error message or a default one if unavailable.
 *                       - `name`: The name/type of the error.
 *                       - `stack`: The stack trace of the error, if available.
 *                       - `code`: Error code, like `ECONNRESET`, if available.
 *                       - `status`: The corresponding HTTP status code.
 *                       - `cause`: The underlying cause of the error, if any.
 *                       - `isOperational`: A flag indicating if the error was operational (expected).
 *                       - `fileName`, `lineNumber`, `columnNumber`: Relevant code location details, if available.
 *                   - `status`: The HTTP status code representing the specific error (e.g., `400`, `500`).
 */
const handleGeneralError = (error) => {
    let message = 'An error occurred while processing the request.';
    let status = httpStatusConstants.INTERNAL_SERVER_ERROR;

    // Specific handling for BSONError (invalid ObjectId)
    if (error?.name === 'BSONError') {
        message = 'Invalid ID format. The provided ID is not valid.';
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.code === 'ECONNRESET') {
        message =
            'The connection was reset. This may be a temporary network issue. Please try again.';
        status = httpStatusConstants.SERVICE_UNAVAILABLE;
    }

    return {
        success: false,
        message,
        errors: {
            message: error?.message || 'Internal Server Error',
            name: error?.name || 'Error',
            stack: error?.stack || 'No stack trace available',
            code: error?.code || null,
            status,
            cause: error?.cause || null,
            isOperational: error?.isOperational || false,
            fileName: error?.fileName || null,
            lineNumber: error?.lineNumber || null,
            columnNumber: error?.columnNumber || null,
        },
        status,
    };
};

/**
 * Handles errors related to unsupported content types.
 *
 * This function takes in an error object, extracts relevant information, and returns
 * a structured response object indicating failure, the error message, the problematic
 * content type, and the corresponding HTTP status code for a bad request.
 *
 * @param {Object} error - The error object containing details about the unsupported content type issue.
 * @param {string} error.message - The error message describing the issue.
 * @param {string} error.contentType - The unsupported content type that triggered the error.
 * @returns {Object} A structured response object.
 * @returns {boolean} return.success - Indicates the success status of the operation (always `false`).
 * @returns {string} return.message - The error message extracted from the input error object.
 * @returns {Object} return.errors - Object detailing specific errors encountered.
 * @returns {string} return.errors.contentType - The specific content type causing the error.
 * @returns {number} return.status - The HTTP status code representing a bad request.
 */
const handleUnsupportedContentTypeError = (error) => ({
    success: false,
    message: error.message,
    errors: { contentType: error.contentType },
    status: httpStatusConstants.BAD_REQUEST,
});

/**
 * Function to handle bad request errors by returning a structured error response.
 *
 * @function handleBadRequestError
 * @param {Object} error - The error object containing information about the bad request.
 * @param {string} error.message - The message describing the details of the bad request error.
 * @returns {Object} A structured response object indicating the error details.
 * @returns {boolean} returns.success - Indicates operation failure, value is always false.
 * @returns {string} returns.message - The error message describing the bad request.
 * @returns {number} returns.status - The HTTP status code for Bad Request from httpStatusConstants.
 */
const handleBadRequestError = (error) => ({
    success: false,
    message: error.message,
    status: httpStatusConstants.BAD_REQUEST,
});

/**
 * Handles Zod validation errors and transforms them into a standardized error response object.
 *
 * @param {Object} error - Zod error object containing validation details.
 * @returns {Object} An object containing the error response.
 * @property {boolean} success - Indicates the failure of the operation (always false).
 * @property {string} message - A general error message indicating a validation error occurred.
 * @property {Array} errors - An array of objects detailing individual validation errors, each containing:
 *   - {string} path - The specific path to the property that failed validation.
 *   - {string} message - The validation error message.
 * @property {number} status - HTTP status code corresponding to a bad request.
 */
const handleZodError = (error) => ({
    success: false,
    message: 'Validation error occurred.',
    errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
    })),
    status: httpStatusConstants.BAD_REQUEST,
});

/**
 * Handles errors encountered during Mongoose operations and formats them into
 * a structured error response object.
 *
 * @param {Error} error - The error object thrown during a Mongoose operation.
 * @returns {{success: boolean, message: string, errors: string[], status: number}}
 *          Returns an object containing success status, error message, error details, and HTTP status code.
 *
 * Error conditions handled:
 * - ValidationError (e.g., schema validation issues, missing required fields).
 * - CastError (e.g., invalid data types or values for a particular field).
 * - Duplicate key errors (e.g., unique constraint violations).
 * - MongoNetworkError (e.g., network issues, SSL/TLS connection problems).
 * - DNS resolution or connection errors.
 * - Generic connection errors (e.g., database unavailability).
 *
 * Additional Info:
 * - Generic database errors are logged for further inspection.
 * - Provides specific HTTP status codes (e.g., 400, 500, etc.) depending on the error nature.
 */
const handleMongooseError = (error) => {
    let message = 'Database error occurred.';
    let status = httpStatusConstants.INTERNAL_SERVER_ERROR;

    if (error instanceof mongoose.Error.ValidationError) {
        message = 'Validation error occurred in the database.';
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error instanceof mongoose.Error.CastError) {
        message = `Invalid value for ${error.path}: ${error.value}.`;
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.code === 11000) {
        // Duplicate Key Error
        const field = Object.keys(error.keyPattern)[0];
        message = `Duplicate value error: An entry with the same ${field} already exists.`;
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.name === 'MongoNetworkError') {
        // Specific handling for SSL/TLS errors
        if (
            error.cause &&
            error.cause.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR'
        ) {
            message =
                'SSL/TLS error occurred while connecting to the database. Please check SSL configuration.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        } else {
            message =
                'Network error while connecting to the database. Please check the network connection or SSL/TLS configuration.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        }
    } else if (error.code === 'EREFUSED') {
        // DNS resolution error
        message =
            'DNS resolution failed while connecting to the database. The MongoDB server may be unavailable.';
        status = httpStatusConstants.SERVICE_UNAVAILABLE;
    } else {
        if (error instanceof mongoose.Error.ConnectionError) {
            message = 'Database connection error.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        }
    }

    return {
        success: false,
        message,
        errors: [error.message],
        status,
    };
};

/**
 * Handles errors related to cryptographic operations and returns a standardized response object.
 *
 * @param {Error} error - The error object caught during cryptographic operations.
 * @returns {Object} A response object indicating failure, containing:
 *   - `success` (boolean): Indicates the operation was unsuccessful (always `false`).
 *   - `message` (string): The error message extracted from the caught error.
 *   - `status` (number): HTTP status code representing unauthorized access.
 */
const handleCryptoError = (error) => ({
    success: false,
    message: error.message,
    status: httpStatusConstants.UNAUTHORIZED,
});

/**
 * Represents an error thrown when an unsupported Content-Type is encountered.
 * This error is typically used in scenarios where the server does not support the
 * Content-Type provided in the request.
 *
 * @class
 * @extends Error
 *
 * @param {string} contentType - The unsupported Content-Type that triggered the error.
 *
 * @property {string} name - The name of the error, set to "UnsupportedContentTypeError".
 * @property {string} contentType - The unsupported Content-Type value.
 * @property {number} status - The HTTP status code associated with the error,
 * representing "415 Unsupported Media Type".
 */
export class UnsupportedContentTypeError extends Error {
    constructor(contentType) {
        super(`Unsupported Content-Type: ${contentType}`);
        this.name = 'UnsupportedContentTypeError';
        this.contentType = contentType;
        this.status = httpStatusConstants.UNSUPPORTED_MEDIA_TYPE;
    }
}

/**
 * An asynchronous function wrapper that handles and processes errors for a given function, while logging the execution lifecycle and errors.
 *
 * @param {Function} fn - The asynchronous function to be wrapped and executed.
 * @returns {Function} A new asynchronous function that, when invoked, logs the start and completion of the given function, manages specific error types, and sends an appropriate response.
 *
 * This handler:
 * - Logs function execution start, errors, and completion using a `logger`.
 * - Catches and processes errors into pre-defined responses based on their type (e.g., `UnsupportedContentTypeError`, `BadRequestError`, `CryptoError`, `ZodError`, and `mongoose.Error`).
 * - Sends responses based on the error type or a general response for unrecognized errors.
 * - Provides environment-specific response content based on the configuration (e.g., hides error details in production).
 */
const asyncHandler =
    (fn) =>
    async (...args) => {
        logger.info(`STARTED: ${fn.name}`);

        // const [request] = args;
        // // Log request data based on the content type
        // const contentType = request.headers.get("content-type") || "";
        // if (contentType.includes("application/json")) {
        //     const jsonData = await request.json();
        //     logger.info(`Request JSON: ${JSON.stringify(jsonData)}`);
        // } else if (contentType.includes("multipart/form-data")) {
        //     const formData = await request.formData();
        //     const formDataObject = {};
        //     formData.forEach((value, key) => {
        //         formDataObject[key] = value instanceof File ? `File(${value.name})` : value;
        //     });
        //     logger.info(`Request FormData: ${JSON.stringify(formDataObject)}`);
        // }

        try {
            return await fn(...args);
        } catch (error) {
            logger.error(`FAILED: ${fn.name}`, error);

            let response;

            switch (true) {
                case error instanceof UnsupportedContentTypeError:
                    response = handleUnsupportedContentTypeError(error);
                    break;

                case error instanceof BadRequestError: // New case for BadRequestError
                    response = handleBadRequestError(error);
                    break;

                case error instanceof CryptoError:
                    response = handleCryptoError(error);
                    break;

                case error instanceof z.ZodError:
                    response = handleZodError(error);
                    break;

                case error instanceof mongoose.Error:
                    response = handleMongooseError(error);
                    break;

                default:
                    response = handleGeneralError(error);
                    break;
            }

            return sendResponse(
                response.success,
                response.status,
                response.message,
                configuration?.env === enviornmentsConstants.PRODUCTION
                    ? {}
                    : response.errors,
                args[0] // Assuming the first argument in `args` is the `Request` object
            );
        } finally {
            logger.info(`COMPLETED: ${fn.name}`);
        }
    };

export default asyncHandler;
