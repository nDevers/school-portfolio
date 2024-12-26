'use strict';

import httpStatusConstants from '@/constants/httpStatus.constants';

// Define a custom error class for invalid user data
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
