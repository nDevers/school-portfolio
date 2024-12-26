'use strict';

import httpStatusConstants from '@/constants/httpStatus.constants';

/**
 * Represents an error that is thrown when user data is considered invalid.
 *
 * This error is typically used to indicate that the input data provided by
 * the user does not meet required validation rules or constraints.
 *
 * @extends Error
 */
export class InvalidUserDataError extends Error {
    constructor(message = 'Invalid user data provided.') {
        super(message);
        this.name = 'InvalidUserDataError';
        this.status = httpStatusConstants.BAD_REQUEST;
    }
}

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
