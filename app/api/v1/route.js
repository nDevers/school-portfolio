import httpStatusConstants from '@/constants/httpStatus.constants';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import configurations from '@/configs/configurations';

/**
 * Represents the configuration settings fetched asynchronously from the system.
 *
 * The `configuration` variable holds the runtime configurations and settings
 * required by the application, obtained by invoking the `configurations` function.
 *
 * This variable should contain all the necessary parameters or options returned
 * by the `configurations` method, ensuring that the application has access to
 * dynamically loaded operational data or preferences.
 *
 * It is intended to be used internally within the application to access or modify
 * these configurations, as needed, throughout the execution lifecycle.
 *
 * Note: Since the configuration data is fetched asynchronously, ensure that all
 * dependent functionalities are executed after successfully retrieving the configurations.
 */
const configuration = await configurations();

/**
 * Asynchronous function to retrieve API version 1 data.
 *
 * This function constructs and returns comprehensive information about the API version 1 configuration, including metadata, endpoints, and various system settings. The response is customized based on the provided configuration parameters.
 *
 * @async
 * @function getV1Data
 * @param {Object} request - The request object containing information about the incoming request.
 * @returns {Promise<Object>} A promise that resolves to a response object containing API details such as metadata, configuration settings, authentication parameters, rate limits, JWT settings, cookies, and cache information.
 */
const getV1Data = async (request) => {
    const indexData = {
        ...(configuration.api.name && {
            message: `Welcome to ${configuration.api.name} API v1.`,
        }),
        ...(configuration.api.description && {
            description: configuration.api.description,
        }),

        api: {
            ...(configuration.api.version && {
                version: configuration.api.version,
            }),

            endpoints: { ...configuration.api.details.endpoints },

            details: {
                ...(configuration.timeout && {
                    timeout: configuration.timeout,
                }),
                ...(configuration.jsonPayloadLimit && {
                    jsonPayloadLimit: configuration.jsonPayloadLimit,
                }),

                cors: {
                    ...(configuration.cors.allowedMethods && {
                        allowedMethods: configuration.cors.allowedMethods,
                    }),
                    ...(configuration.cors.allowedOrigins && {
                        allowedOrigins: configuration.cors.allowedOrigins,
                    }),
                },

                databases: ['MongoDB', 'Google Drive', 'Local Drive'],

                authentication: {
                    ...(configuration.authentication.maximumLoginAttempts && {
                        maximumLoginAttempts:
                            configuration.authentication.maximumLoginAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumResetPasswordAttempts && {
                        maximumResetPasswordAttempts:
                            configuration.authentication
                                .maximumResetPasswordAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumVerifyEmailAttempts && {
                        maximumVerifyEmailAttempts:
                            configuration.authentication
                                .maximumVerifyEmailAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangeEmailAttempts && {
                        maximumChangeEmailAttempts:
                            configuration.authentication
                                .maximumChangeEmailAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangeMobileAttempts && {
                        maximumChangeMobileAttempts:
                            configuration.authentication
                                .maximumChangeMobileAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangePasswordAttempts && {
                        maximumChangePasswordAttempts:
                            configuration.authentication
                                .maximumChangePasswordAttempts,
                    }),
                    ...(configuration.authentication.maximumActiveSessions && {
                        maximumActiveSessions:
                            configuration.authentication.maximumActiveSessions,
                    }),
                    ...(configuration.authentication.accountLockDuration && {
                        accountLockDuration:
                            configuration.authentication.accountLockDuration,
                    }),
                },

                jwt: {
                    ...(configuration.jwt.accessToken && {
                        accessToken: {
                            secret: configuration.jwt.accessToken.secret,
                            expiration:
                                configuration.jwt.accessToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.refreshToken && {
                        refreshToken: {
                            secret: configuration.jwt.refreshToken.secret,
                            expiration:
                                configuration.jwt.refreshToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.resetPasswordToken && {
                        resetPasswordToken: {
                            secret: configuration.jwt.resetPasswordToken.secret,
                            expiration:
                                configuration.jwt.resetPasswordToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.verifyEmailToken && {
                        verifyEmailToken: {
                            secret: configuration.jwt.verifyEmailToken.secret,
                            expiration:
                                configuration.jwt.verifyEmailToken.expiration,
                        },
                    }),
                },

                rateLimit: {
                    ...(configuration.rateLimit.limit && {
                        limit: configuration.rateLimit.limit,
                    }),
                    ...(configuration.rateLimit.windowMs && {
                        windowMs: configuration.rateLimit.windowMs,
                    }),
                    ...(configuration.rateLimit.headers && {
                        headers: configuration.rateLimit.headers,
                    }),
                },

                cookies: {
                    ...(configuration.cookies.secure && {
                        secure: configuration.cookies.secure,
                    }),
                    ...(configuration.cookies.sameSite && {
                        sameSite: configuration.cookies.sameSite,
                    }),
                    ...(configuration.cookies.httpOnly && {
                        httpOnly: configuration.cookies.httpOnly,
                    }),
                    ...(configuration.cookies.maxAge && {
                        maxAge: configuration.cookies.maxAge,
                    }),
                },

                cache: {
                    ...(configuration.cache.maxAge && {
                        maxAge: configuration.cache.maxAge,
                    }),
                },
            },
        },
    };

    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Request successful.',
        indexData,
        request
    );
};

/**
 * The `GET` variable is an asynchronous function that is assigned using the `asyncHandler` utility.
 * It wraps the `getV1Data` function to handle any asynchronous errors and passes them to the middleware for error handling.
 * Primarily used to fetch or retrieve version 1 data based on a request.
 *
 * @constant {Function}
 */
export const GET = asyncHandler(getV1Data);
