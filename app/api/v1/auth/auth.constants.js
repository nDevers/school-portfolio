import contentTypesConstants from "@/constants/contentTypes.constants";

/**
 * An array that defines the list of allowed content types for a particular operation or configuration.
 * This variable ensures that only specified content types are permitted.
 * The content types are derived or referenced from predefined constants.
 */
const allowedContentTypes = [contentTypesConstants.JSON];

/**
 * An object representing constants used for login functionalities.
 *
 * @property {Array<string>} allowedContentTypes - An array of strings specifying the allowed content types for login-related operations.
 */
const loginConstants = {
    allowedContentTypes
};

export default loginConstants;
