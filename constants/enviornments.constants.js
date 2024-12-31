'use strict';

/**
 * A constant variable representing the development environment.
 * Typically used to specify or check the context in which the application is running.
 * The value is a string: 'development'.
 */
const DEVELOPMENT = 'development';

/**
 * A constant variable representing the test string.
 *
 * @constant
 * @type {string}
 */
const TEST = 'test';

/**
 * A constant variable representing the staging environment.
 * It is used to differentiate between deployment environments
 * in the application, such as production, development, and staging.
 * The value of this constant is a string: 'staging'.
 */
const STAGING = 'staging';

/**
 * Represents the "uat" environment identifier.
 * Typically used to denote the User Acceptance Testing (UAT) environment
 * in a multi-environment deployment setup.
 * This value is usually employed to differentiate configurations,
 * behaviors, or resources specific to the UAT environment.
 */
const UAT = 'uat';

/**
 * A constant variable indicating the production environment.
 * Used to differentiate environments such as development, testing, or production.
 * Holds the string value 'production'.
 */
const PRODUCTION = 'production';

/**
 * Represents various runtime environments for the application.
 *
 * @enum {string}
 * @property {string} DEVELOPMENT - Used for local development purposes.
 * @property {string} TEST - Used for executing automated tests or quality assurance processes.
 * @property {string} STAGING - Used for testing in an environment that closely resembles production.
 * @property {string} UAT - User Acceptance Testing environment, where end-users validate features before production.
 * @property {string} PRODUCTION - Live environment where the application is accessible to end users.
 */
const environments = {
    DEVELOPMENT,
    TEST,
    STAGING,
    UAT,
    PRODUCTION,
};

export default environments;
