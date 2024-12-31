import httpStatusConstants from '@/constants/httpStatus.constants';

import configurations from '@/configs/configurations';
import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import scheduleCronJob from '@/lib/scheduleCronJob';
import createDefaultAdmin from '@/util/createDefaultAdmin';

/**
 * Asynchronously retrieves and stores the application's configuration settings.
 *
 * This variable holds the result of the `configurations()` function, which is expected
 * to load and return the necessary configuration data required by the application.
 *
 * The configuration may include settings such as API keys, environment variables,
 * database connections, feature toggles, and other customizable options.
 *
 * Ensure that the configurations are correctly retrieved before using any dependent
 * functionality within your application.
 *
 * Note: This variable must be awaited to ensure the asynchronous resolution of the
 * configuration process.
 */
const configuration = await configurations();

/**
 * Assembles and returns the index data of the API, including its configuration, contact details, and metadata.
 *
 * The function constructs the index data object dynamically using the provided configuration object.
 * - Includes API details such as name, version, license, engines, and documentation links.
 * - Populates contact information, covering owner, support, admin, author, and social links.
 * - Adds additional metadata like repository, homepage, issues, terms of service, and custom endpoints.
 *
 * The response object returned contains:
 * - A success status.
 * - HTTP status code indicating the result (success).
 * - A message communicating the request status.
 * - A detailed payload containing the assembled index data.
 *
 * @param {Object} request - The HTTP request object for the incoming request.
 * @returns {Object} A standardized response object wrapping the API index data.
 */
const getIndexData = async (request) => {
    scheduleCronJob();

    await createDefaultAdmin();

    const indexData = {
        ...(configuration.api.name && {
            message: `Welcome to ${configuration.api.name} API.`,
        }),
        ...(configuration.api.description && {
            description: configuration.api.description,
        }),

        engines: {
            ...(configuration.api.engines?.node && {
                node: configuration.api.engines.node,
            }),
            ...(configuration.api.engines?.npm && {
                npm: configuration.api.engines.npm,
            }),
        },

        api: {
            ...(configuration.api.version && {
                version: configuration.api.version,
            }),
            ...(configuration.api.license && {
                license: configuration.api.license,
            }),

            details: {
                ...(configuration.api.details.repository && {
                    repository: configuration.api.details.repository,
                }),
                ...(configuration.api.details.homepage && {
                    homepage: configuration.api.details.homepage,
                }),
                ...(configuration.api.details.issues && {
                    issues: configuration.api.details.issues,
                }),
                ...(configuration.api.details.bugs && {
                    bugs: configuration.api.details.bugs,
                }),
                ...(configuration.api.details.termsOfService && {
                    termsOfService: configuration.api.details.termsOfService,
                }),

                documentation: {
                    ...(configuration.api.details.documentation.docs && {
                        docs: configuration.api.details.documentation.docs,
                    }),
                    ...(configuration.api.details.documentation.swagger && {
                        swagger:
                            configuration.api.details.documentation.swagger,
                    }),
                    ...(configuration.api.details.documentation.tutorials && {
                        tutorials:
                            configuration.api.details.documentation.tutorials,
                    }),
                },

                endpoints: {
                    v1: { ...configuration.api.details.endpoints },
                },
            },
        },

        contact: {
            owner: {
                ...(configuration.contact.owner.email && {
                    email: configuration.contact.owner.email,
                }),
                ...(configuration.contact.owner.mobile && {
                    mobile: configuration.contact.owner.mobile,
                }),
            },

            support: {
                ...(configuration.contact.support.email && {
                    email: configuration.contact.support.email,
                }),
                ...(configuration.contact.support.mobile && {
                    mobile: configuration.contact.support.mobile,
                }),
            },

            admin: {
                ...(configuration.contact.admin?.email && {
                    email: configuration.contact.admin.email,
                }),
                ...(configuration.contact.admin?.mobile && {
                    mobile: configuration.contact.admin.mobile,
                }),
            },

            social: {
                ...(configuration.contact.social.linkedIn && {
                    linkedIn: configuration.contact.social.linkedIn,
                }),
                ...(configuration.contact.social.gitHub && {
                    gitHub: configuration.contact.social.gitHub,
                }),
                ...(configuration.contact.social.x && {
                    x: configuration.contact.social.x,
                }),
                ...(configuration.contact.social.facebook && {
                    facebook: configuration.contact.social.facebook,
                }),
                ...(configuration.contact.social.instagram && {
                    instagram: configuration.contact.social.instagram,
                }),
            },

            author: {
                ...(configuration.author.name && {
                    name: configuration.author.name,
                }),

                contact: {
                    ...(configuration.author.contact.email && {
                        email: configuration.author.contact.email,
                    }),
                    ...(configuration.author.contact.mobile && {
                        mobile: configuration.author.contact.mobile,
                    }),
                },

                social: {
                    ...(configuration.author.social.linkedIn && {
                        linkedIn: configuration.author.social.linkedIn,
                    }),
                    ...(configuration.author.social.gitHub && {
                        gitHub: configuration.author.social.gitHub,
                    }),
                    ...(configuration.author.social.x && {
                        x: configuration.author.social.x,
                    }),
                    ...(configuration.author.social.facebook && {
                        facebook: configuration.author.social.facebook,
                    }),
                    ...(configuration.author.social.instagram && {
                        instagram: configuration.author.social.instagram,
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
 * GET is an asynchronous function wrapped with the `asyncHandler` utility to handle any
 * asynchronous errors gracefully while fetching index-related data.
 *
 * The function is designed to retrieve data for an index page or endpoint. It ensures
 * proper error handling by leveraging the provided `asyncHandler` middleware, which
 * simplifies error management in asynchronous requests.
 *
 * @constant {Function}
 */
export const GET = asyncHandler(getIndexData);
