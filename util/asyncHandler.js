'use strict';

import { z } from 'zod';
import mongoose from 'mongoose';

import {
    BadRequestError,
    CryptoError,
    UnsupportedContentTypeError,
} from '@/lib/customError';

import logger from '@/lib/logger';
import enviornmentsConstants from '@/constants/enviornments.constants';

import configurations from '@/configs/configurations';
import sendResponse from '@/util/sendResponse';
import {
    handleBadRequestError,
    handleCryptoError,
    handleGeneralError,
    handleMongooseError,
    handleUnsupportedContentTypeError,
    handleZodError,
} from '@/lib/customErrorHandlers';

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
