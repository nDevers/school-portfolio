'use strict';

/**
 * Generates a set of permission constants for a given resource type.
 *
 * @param {string} type - The type of resource for which permission constants are created.
 * @returns {Object} An object containing permission constants for various actions that can be performed on the resource type.
 */
const permissionsConstants = (type) => ({
    create: `create-${type}`,
    getList: `get-${type}-list`,
    getById: `get-${type}-by-id`,
    updateById: `update-${type}-by-id`,
    deleteById: `delete-${type}-by-id`,
    deleteByList: `delete-${type}-by-list`,
});

/**
 * A function to generate a string identifier for creating a specific type of entity.
 *
 * @param {string} type - The type of entity to create.
 * @returns {string} A string in the format "create-{type}", where {type} is the provided argument.
 */
const CREATE = (type) => `create-${type}`;

/**
 * Constructs a string for retrieving a specific type by a list.
 * The string is formatted as 'get-{type}-by-list', where {type}
 * is the parameter provided to the function.
 *
 * @param {string} type - The type of the object to retrieve.
 * @returns {string} A formatted string used for object retrieval based on the specified type.
 */
const GET = (type) => `get-${type}-by-list`;

/**
 * A function that takes a type as input and returns a string
 * formatted as "get-{type}-by-id".
 *
 * @param {string} type - The type to be included in the generated string.
 * @returns {string} A string in the format "get-{type}-by-id".
 */
const GET_BY_ID = (type) => `get-${type}-by-id`;

/**
 * A function that generates a string representing an operation to get items by their category.
 *
 * @param {string} type - The type of item to be retrieved.
 * @returns {string} A formatted string indicating the retrieval operation by category for the specified item type.
 */
const GET_BY_CATEGORY = (type) => `get-${type}-by-category`;

/**
 * A function that generates a string representing a specific action to retrieve
 * a resource by email address based on the given type.
 *
 * @constant
 * @function GET_BY_EMAIL
 * @param {string} type - The type of resource to retrieve, e.g., 'user', 'admin', etc.
 * @returns {string} A formatted string in the pattern 'get-{type}-by-email'.
 */
const GET_BY_EMAIL = (type) => `get-${type}-by-email`;

/**
 * A template literal function that generates a string based on the provided type.
 * The returned string follows the format: "get-{type}-by-category-and-id".
 *
 * @param {string} type - The specific type to include in the generated string.
 * @returns {string} A string that includes the provided type in the format "get-{type}-by-category-and-id".
 */
const GET_BY_CATEGORY_AND_ID = (type) => `get-${type}-by-category-and-id`;

/**
 * Generates a formatted update string based on the provided type.
 *
 * This function accepts a type parameter and returns a
 * string in the format "update-{type}", where {type}
 * is replaced with the provided type value.
 *
 * @param {string} type - The type to include in the update string.
 * @returns {string} A string formatted as "update-{type}".
 */
const UPDATE = (type) => `update-${type}`;

/**
 * A function that generates a unique update identifier string based on the specified type.
 *
 * @param {string} type - The type used to construct the update string.
 * @returns {string} A formatted update identifier string in the pattern `update-{type}-by-id`.
 */
const UPDATE_BY_ID = (type) => `update-${type}-by-id`;

/**
 * A function that constructs a formatted string used as an identifier for updating resources
 * by their category and ID. The format of the returned string is 'update-[type]-by-category-and-id'.
 *
 * @param {string} type - The type of the resource to be updated.
 * @returns {string} A formatted string containing the resource type to indicate
 * the update operation by category and ID.
 */
const UPDATE_BY_CATEGORY_AND_ID = (type) => `update-${type}-by-category-and-id`;

/**
 * A constant function that generates a string for deletion operations based on the provided type.
 *
 * @param {string} type - The type of entity or operation to be deleted.
 * @returns {string} A formatted string in the pattern `delete-{type}`.
 */
const DELETE = (type) => `delete-${type}`;

/**
 * A template literal function that generates a string used for deletion operations
 * by identifier. The string includes the specified `type` value.
 *
 * @param {string} type - The type of resource for which the delete operation is performed.
 * @returns {string} A formatted string in the form `delete-{type}-by-id`.
 */
const DELETE_BY_ID = (type) => `delete-${type}-by-id`;

/**
 * A function that generates a string identifier for delete operations by email.
 *
 * @param {string} type - The type or category associated with the delete operation.
 * @returns {string} A formatted string in the pattern "delete-{type}-by-email".
 */
const DELETE_BY_EMAIL = (type) => `delete-${type}-by-email`;

/**
 * A function that generates a string used as an identifier for deletion
 * operations based on the provided type. The resulting string follows the
 * pattern `delete-{type}-by-list`.
 *
 * @param {string} type - The type of the entity to be deleted.
 * @returns {string} A formatted string for deletion identification.
 */
const DELETE_BY_LIST = (type) => `delete-${type}-by-list`;

/**
 * A constant function that generates a string following the pattern "delete-{type}-by-category-and-id".
 * The function accepts a type parameter and incorporates it into the returned string.
 *
 * @param {string} type - The specified type to be included in the generated string.
 * @returns {string} A string in the format "delete-{type}-by-category-and-id".
 */
const DELETE_BY_CATEGORY_AND_ID = (type) => `delete-${type}-by-category-and-id`;

/**
 * Object containing route paths for the application.
 * This object is structured to allow nested routing paths.
 *
 * @property {string} aboutUs - Route path for the about us page.
 * @property {string} academic - Route path for the academic page.
 * @property {string} announcement - Route path for the announcement page.
 * @property {string} blog - Route path for the blog page.
 * @property {string} career - Route path for the career page.
 * @property {string} configuration - Route path for the configuration page.
 * @property {string} contact - Route path for the contact page.
 * @property {Object} gallery - Object containing gallery-related route paths.
 * @property {string} gallery.photo - Route path for the photo gallery.
 * @property {string} gallery.video - Route path for the video gallery.
 * @property {Object} home - Object containing home-related route paths.
 * @property {string} home.carousel - Route path for the home carousel section.
 * @property {string} newsletter - Route path for the newsletter page.
 * @property {Object} school - Object containing school-related route paths.
 * @property {string} school.achievement - Route path for the school achievement page.
 * @property {string} school.info - Route path for the school information page.
 * @property {string} school.speech - Route path for the school speech page.
 */
export const routes = {
    aboutUs: 'about-us',
    academic: 'academic',
    announcement: 'announcement',
    blog: 'blog',
    career: 'career',
    configuration: 'configuration',
    contact: 'contact',

    gallery: {
        photo: 'photo',
        video: 'video',
    },

    home: {
        carousel: 'carousel',
    },

    newsletter: 'newsletter',

    school: {
        achievement: 'achievement',
        info: 'info',
        speech: 'speech',
    },
};

/**
 * apiRoutesConstants provides a structured constant for API route configurations.
 * It defines endpoint routes, supported HTTP methods, parameters, and their corresponding permissions.
 *
 * Structure:
 * - Each key corresponds to a specific entity or module in the application (e.g., aboutUs, academic).
 * - Each entity contains:
 *   - `routes`: Defines the base route or path for the entity.
 *   - `methods`: Specifies supported HTTP methods (e.g., POST, GET) for the entity.
 *     - Each HTTP method may include:
 *       - `permissions`: An array of required permissions for accessing the route.
 *       - `params`: Parameters expected in the request (optional).
 *   - `subRoutes` (optional): Contains nested route definitions and configurations for sub-modules of the entity.
 *
 * Entities:
 * - `aboutUs`: Routes and permissions for About Us module.
 * - `academic`: Routes and permissions related to academics, supporting category-based parameters.
 * - `announcement`: Routes and permissions for announcements, supporting category and ID filtering.
 * - `blog`: Routes and permissions for the blog section.
 * - `career`: Routes and permissions for careers.
 * - `configuration`: Routes and permissions for application configuration settings.
 * - `contact`: Contact module routes, currently supporting only POST method.
 * - `faculty`: Faculty module routes, supporting category and ID-based queries.
 * - `faq`: FAQ module routes for managing frequently asked questions.
 * - `gallery`: Nested routes for photos and videos under the gallery module.
 * - `home`: Base home module, including a carousel sub-route defining its methods and permissions.
 * - `newsletter`: Newsletter module supporting email-based queries.
 * - `school`: Routes for school-related modules with sub-routes for achievements, info, and speeches.
 *
 * Use this constant to standardize route definitions and permissions across the application.
 */
const apiRoutesConstants = {
    aboutUs: {
        routes: routes.aboutUs,
        methods: {
            POST: {
                permissions: [CREATE(routes.aboutUs)],
            },
            GET: {
                params: 'id',
                permissions: [GET(routes.aboutUs), GET_BY_ID(routes.aboutUs)],
            },
            PATCH: {
                params: 'id',
                permissions: [UPDATE_BY_ID(routes.aboutUs)],
            },
            DELETE: {
                params: 'id',
                permissions: [DELETE_BY_ID(routes.aboutUs)],
            },
        },
    },

    academic: {
        routes: routes.academic,
        methods: {
            POST: {
                permissions: [CREATE(routes.academic)],
            },
            GET: {
                params: 'categoryParams',
                permissions: [
                    GET(routes.academic),
                    GET_BY_CATEGORY(routes.academic),
                    GET_BY_CATEGORY_AND_ID(routes.academic),
                ],
            },
            PATCH: {
                params: 'categoryParams',
                permissions: [UPDATE_BY_CATEGORY_AND_ID(routes.academic)],
            },
            DELETE: {
                params: 'categoryParams',
                permissions: [DELETE_BY_CATEGORY_AND_ID(routes.academic)],
            },
        },
    },

    announcement: {
        routes: routes.announcement,
        methods: {
            POST: {
                permissions: [CREATE(routes.announcement)],
            },
            GET: {
                params: 'categoryParams',
                permissions: [
                    GET(routes.announcement),
                    GET_BY_CATEGORY(routes.announcement),
                    GET_BY_CATEGORY_AND_ID(routes.announcement),
                ],
            },
            PATCH: {
                params: 'categoryParams',
                permissions: [UPDATE_BY_CATEGORY_AND_ID(routes.announcement)],
            },
            DELETE: {
                params: 'categoryParams',
                permissions: [DELETE_BY_CATEGORY_AND_ID(routes.announcement)],
            },
        },
    },

    blog: {
        routes: routes.blog,
        methods: {
            POST: {
                permissions: [CREATE(routes.blog)],
            },
            GET: {
                params: 'id',
                permissions: [GET(routes.blog), GET_BY_ID(routes.blog)],
            },
            PATCH: {
                params: 'id',
                permissions: [UPDATE_BY_ID(routes.blog)],
            },
            DELETE: {
                params: 'id',
                permissions: [DELETE_BY_ID(routes.blog)],
            },
        },
    },

    career: {
        routes: routes.career,
        methods: {
            POST: {
                permissions: [CREATE(routes.career)],
            },
            GET: {
                params: 'id',
                permissions: [GET(routes.career), GET_BY_ID(routes.career)],
            },
            PATCH: {
                params: 'id',
                permissions: [UPDATE_BY_ID(routes.career)],
            },
            DELETE: {
                params: 'id',
                permissions: [DELETE_BY_ID(routes.career)],
            },
        },
    },

    configuration: {
        routes: routes.configuration,
        methods: {
            POST: {
                permissions: [CREATE(routes.configuration)],
            },
            GET: {
                permissions: [GET(routes.configuration)],
            },
            PATCH: {
                permissions: [UPDATE(routes.configuration)],
            },
            DELETE: {
                permissions: [DELETE(routes.configuration)],
            },
        },
    },

    contact: {
        routes: routes.contact,
        methods: {
            POST: {
                permissions: [CREATE(routes.contact)],
            },
        },
    },

    faculty: {
        routes: routes.faculty,
        methods: {
            POST: {
                permissions: [CREATE(routes.faculty)],
            },
            GET: {
                params: 'categoryParams',
                permissions: [
                    GET(routes.faculty),
                    GET_BY_CATEGORY(routes.faculty),
                    GET_BY_CATEGORY_AND_ID(routes.faculty),
                ],
            },
            PATCH: {
                params: 'categoryParams',
                permissions: [UPDATE_BY_CATEGORY_AND_ID(routes.faculty)],
            },
            DELETE: {
                params: 'categoryParams',
                permissions: [DELETE_BY_CATEGORY_AND_ID(routes.faculty)],
            },
        },
    },

    faq: {
        routes: routes.faq,
        methods: {
            POST: {
                permissions: [CREATE(routes.faq)],
            },
            GET: {
                params: 'id',
                permissions: [GET(routes.faq)],
            },
            PATCH: {
                params: 'id',
                permissions: [UPDATE(routes.faq)],
            },
            DELETE: {
                params: 'id',
                permissions: [DELETE(routes.faq)],
            },
        },
    },

    gallery: {
        routes: routes.gallery,
        subRoutes: {
            photo: {
                routes: routes.gallery.photo,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.gallery.photo)],
                    },
                    GET: {
                        params: 'id',
                        permissions: [GET(routes.gallery.photo)],
                    },
                    PATCH: {
                        params: 'id',
                        permissions: [UPDATE(routes.gallery.photo)],
                    },
                    DELETE: {
                        params: 'id',
                        permissions: [DELETE(routes.gallery.photo)],
                    },
                },
            },

            video: {
                routes: routes.gallery.video,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.gallery.video)],
                    },
                    GET: {
                        params: 'id',
                        permissions: [GET(routes.gallery.video)],
                    },
                    PATCH: {
                        params: 'id',
                        permissions: [UPDATE(routes.gallery.video)],
                    },
                    DELETE: {
                        params: 'id',
                        permissions: [DELETE(routes.gallery.video)],
                    },
                },
            },
        },
    },

    home: {
        routes: routes.home,
        subRoutes: {
            carousel: {
                routes: routes.home.carousel,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.home.carousel)],
                    },
                    GET: {
                        permissions: [GET(routes.home.carousel)],
                    },
                    PATCH: {
                        permissions: [UPDATE(routes.home.carousel)],
                    },
                    DELETE: {
                        permissions: [DELETE(routes.home.carousel)],
                    },
                },
            },
        },
    },

    newsletter: {
        routes: routes.newsletter,
        methods: {
            POST: {
                permissions: [CREATE(routes.newsletter)],
            },
            GET: {
                params: 'email',
                permissions: [GET_BY_EMAIL(routes.newsletter)],
            },
            PATCH: {
                permissions: [UPDATE(routes.newsletter)],
            },
            DELETE: {
                params: 'email',
                permissions: [DELETE_BY_EMAIL(routes.newsletter)],
            },
        },
    },

    school: {
        routes: routes.school,
        subRoutes: {
            achievement: {
                routes: routes.school.achievement,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.school.achievement)],
                    },
                    GET: {
                        permissions: [GET(routes.school.achievement)],
                    },
                    PATCH: {
                        permissions: [UPDATE(routes.school.achievement)],
                    },
                    DELETE: {
                        permissions: [DELETE(routes.school.achievement)],
                    },
                },
            },

            info: {
                routes: routes.school.info,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.school.info)],
                    },
                    GET: {
                        permissions: [GET(routes.school.info)],
                    },
                    PATCH: {
                        permissions: [UPDATE(routes.school.info)],
                    },
                    DELETE: {
                        permissions: [DELETE(routes.school.info)],
                    },
                },
            },

            speech: {
                routes: routes.school.speech,
                methods: {
                    POST: {
                        permissions: [CREATE(routes.school.speech)],
                    },
                    GET: {
                        permissions: [GET(routes.school.speech)],
                    },
                    PATCH: {
                        permissions: [UPDATE(routes.school.speech)],
                    },
                    DELETE: {
                        permissions: [DELETE(routes.school.speech)],
                    },
                },
            },
        },
    },
};

export default apiRoutesConstants;
