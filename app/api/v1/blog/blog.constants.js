import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

/**
 * Represents the list of allowed content types for a specific operation or configuration.
 * This array contains content type constants that define valid formats for data handling.
 * Example values might include constants such as FORM_DATA.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array of allowed MIME types for banner assets.
 *
 * This variable defines the permissible image formats that can be used for banners.
 * It specifically includes commonly used image MIME types such as JPEG, JPG, PNG, and GIF.
 *
 * @type {Array<string>}
 */
const allowedBannerMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];

/**
 * An array of allowed MIME types for file uploads.
 * This variable defines the acceptable file types that can be processed or stored by the application.
 * Common use cases include validating file uploads to ensure they meet required formats.
 *
 * Possible values are constants representing specific MIME types:
 * - PDF: Represents application/pdf files.
 * - JPG: Represents image/jpeg files.
 * - PNG: Represents image/png files.
 * - GIF: Represents image/gif files.
 *
 * These MIME types are typically used for validating user-uploaded content such as documents or images.
 */
const allowedFilesMimeTypes = [mimeTypesConstants.PDF, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];

/**
 * An array containing the allowed MIME types for image uploads.
 * This restricts the types of image files that can be uploaded
 * by ensuring they are of specific, predefined formats.
 * The MIME types included are JPEG, JPG, PNG, and GIF.
 */
const allowedImagesMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];

/**
 * A constant variable representing the name of the banner field.
 * This variable holds the string value associated with the banner field,
 * which can be used as a key or identifier in various contexts, such as
 * accessing or setting properties in an object related to banners.
 */
const bannerFieldName = 'banner';

/**
 * Represents the name of the field used for file input or file-related operations.
 * This variable is typically used to identify or access the specific field associated with files in a form or request.
 */
const fileFieldName = 'files';

/**
 * Represents the field name used to reference or store image data.
 * This variable is typically used to identify the key or property name
 * associated with image files or image-related data in a data structure.
 */
const imageFieldName = 'images';

/**
 * Specifies the maximum allowed file size for an upload operation.
 * The value is defined in bytes. For instance, 5 * 1024 * 1024 represents 5 megabytes.
 */
const allowedFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a title.
 * This constant is typically used to validate and enforce constraints
 * on the length of titles in a given application or system.
 *
 * @type {number}
 */
const titleMaxCharacter = 100;

/**
 * A collection of constants for managing blog behaviors and restrictions.
 * These constants are used for content validation, file uploads, and setting various limits.
 *
 * Properties:
 * - `allowedContentTypes`: Specifies an array of content types allowed in the blog.
 * - `allowedBannerMimeTypes`: Defines allowed MIME types for banner files.
 * - `allowedFilesMimeTypes`: Specifies allowed MIME types for general file uploads.
 * - `allowedImagesMimeTypes`: Lists allowed MIME types for images.
 * - `bannerFieldName`: Field name for the banner file in uploads.
 * - `fileFieldName`: Field name for general file uploads.
 * - `imageFieldName`: Field name for image uploads.
 * - `allowedFileSize`: Maximum file size allowed for any uploaded file.
 * - `titleMaxCharacter`: Maximum number of characters allowed for a blog title.
 */
const blogConstants = {
    allowedContentTypes,

    allowedBannerMimeTypes,
    allowedFilesMimeTypes,
    allowedImagesMimeTypes,

    bannerFieldName,
    fileFieldName,
    imageFieldName,

    allowedFileSize,
    titleMaxCharacter,
};

export default blogConstants;
