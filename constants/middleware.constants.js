/**
 * A list of user agent strings that are blocked from accessing the system.
 *
 * This variable contains a predefined set of user agent substrings commonly associated
 * with API testing tools, automated HTTP clients, and other similar utilities.
 * Requests originating from user agents matching any substring in this list may
 * be denied or flagged to prevent unauthorized access or excessive automated traffic.
 *
 * Note: Matching is typically performed as a partial match against the user agent string.
 */
const blockedUserAgents = [
    'PostmanRuntime',
    'Insomnia',
    'RapidAPI-Client',
    'Paw/',
    'curl/',
    'HTTPie/',
    'Thunder Client',
    'AdvancedRestClient',
    'RestSharp',
    'Swagger-UI',
    'k6',
    'ApacheBench',
    'SoapUI',
    'Apache JMeter',
    'Fiddler',
    'Wget',
];

/**
 * A constant object containing middleware-related configuration values and settings.
 *
 * @constant {Object} middlewareConstants
 * @property {Array<string>} blockedUserAgents - A list of user agent strings that are blocked by the middleware.
 */
const middlewareConstants = {
    blockedUserAgents,
};

export default middlewareConstants;
