import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * Specifies the list of allowed content types for a given operation or request.
 * This variable is intended to restrict or validate the type of content
 * that can be processed or accepted. It aids in ensuring proper handling
 * of input or payload types and enforces compatibility across systems.
 *
 * The variable is pre-configured with specific constants representing
 * allowable content types, such as form data. Additional content types
 * can be added as needed, depending on the application's requirements.
 *
 * The initial value is sourced from `contentTypesConstants` to ensure
 * values are standardized and consistent throughout the application.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * A list of allowed MIME types for file validation or upload purposes.
 *
 * This array contains the MIME type constants for commonly accepted image formats
 * such as JPEG, JPG, PNG, and GIF. It ensures that only files with these
 * specified MIME types are permitted for processing.
 *
 * @type {string[]}
 */
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * Represents the name of the field associated with a banner entity or component.
 * This variable holds the string value that identifies the specific field used for banner-related operations.
 */
const bannerFieldName = 'banner';

/**
 * The `logoFieldName` variable holds the name of the field associated with a logo.
 * It is a constant string designed to specify or reference the 'logo' field in data structures or configurations.
 * This field name may be used for accessing, updating, or processing logo data within the application.
 */
const logoFieldName = 'logo';

/**
 * The maximum allowed file size for logo uploads in bytes.
 * This value represents the size limit enforced on files being uploaded
 * as logos. Any file exceeding this size will be rejected.
 *
 * Value is set to 5 MB (5 * 1024 * 1024 bytes).
 */
const allowedLogoFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum allowed file size for banner uploads.
 * The value is defined in bytes and is set to 5 megabytes.
 * This limit ensures that uploaded banner files meet the size restriction.
 */
const allowedBannerFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a name.
 * This value is set to define a constraint on the character length
 * of names used in the application.
 *
 * The default value for this variable is 100.
 *
 * It can be used for validation to ensure that any given name
 * does not exceed the specified character limit.
 */
const nameMaxCharacter = 100;

/**
 * Represents the maximum number of characters allowed for an address.
 * This value is used to enforce limits on address input fields.
 *
 * @type {number}
 */
const addressMaxCharacter = 100;

/**
 * Configuration constants used for application settings and validations.
 *
 * @typedef {Object} configurationConstants
 * @property {Array<string>} allowedContentTypes - Specifies a list of allowed content types for certain operations.
 * @property {Array<string>} allowedMimeTypes - Defines the acceptable MIME types for file uploads.
 * @property {string} bannerFieldName - Represents the field name for banners in forms or APIs.
 * @property {string} logoFieldName - Represents the field name for logos in forms or APIs.
 * @property {number} allowedLogoFileSize - Specifies the maximum allowable size for uploaded logo files, typically measured in bytes.
 * @property {number} allowedBannerFileSize - Specifies the maximum allowable size for uploaded banner files, typically measured in bytes.
 * @property {number} nameMaxCharacter - Represents the maximum number of characters allowed for names.
 * @property {number} addressMaxCharacter - Represents the maximum number of characters allowed for addresses.
 */
const configurationConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    bannerFieldName,
    logoFieldName,
    allowedLogoFileSize,
    allowedBannerFileSize,
    nameMaxCharacter,
    addressMaxCharacter,
};

export default configurationConstants;
