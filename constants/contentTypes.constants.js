/**
 * Represents the MIME type for JSON data format.
 * Used to specify the content type in HTTP requests or responses
 * when the data being sent or received is in JSON format.
 */
const JSON = 'application/json';

/**
 * Represents the MIME type for encoding form data that is submitted via HTTP.
 * Typically used when submitting forms containing files, non-ASCII data, or binary data.
 *
 * Value: "multipart/form-data"
 */
const FORM_DATA = 'multipart/form-data';

/**
 * Represents the MIME type for form data that is encoded as key-value pairs.
 * It is commonly used in HTTP requests, specifically with the "application/x-www-form-urlencoded"
 * content type. This encoding is often encountered when submitting HTML forms using the
 * POST or GET methods.
 *
 * Typically, spaces are replaced with "+" signs, and non-alphanumeric characters
 * are percent-encoded.
 *
 * @constant {string} X_WWW_FORM_URLENCODED
 */
const X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';

/**
 * An object representing commonly used content type constants.
 * These constants are utilized to specify the format of the data
 * being sent in HTTP requests.
 *
 * @constant {Object} contentTypesConstants
 * @property {string} JSON - Represents the content type for JSON formatted data.
 * @property {string} FORM_DATA - Represents the content type for form-data, often used for file uploads.
 * @property {string} X_WWW_FORM_URLENCODED - Represents the content type for URL-encoded form data.
 */
const contentTypesConstants = {
    JSON,
    FORM_DATA,
    X_WWW_FORM_URLENCODED,
};

export default contentTypesConstants;
