import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

/**
 * Represents the allowed content types for a specific operation or module.
 * This variable is an array containing predefined constants indicating
 * the permissible types of content that can be processed.
 *
 * The `allowedContentTypes` is intended to ensure that only specified
 * content formats are accepted, providing better control and reducing
 * the potential for unsupported or erroneous data inputs.
 *
 * The content types are defined in the `contentTypesConstants` module,
 * which provides a standardized collection of constants for various
 * content formats. This ensures consistency and maintainability across
 * the codebase when handling content type restrictions.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * A list of allowed MIME types for file uploads or processing.
 *
 * This array contains constants representing the MIME types
 * supported for operations such as image uploads or validations.
 *
 * The allowed MIME types include:
 * - JPEG
 * - JPG
 * - PNG
 * - GIF
 *
 * This variable ensures that only specific file formats are
 * permitted to maintain consistency and security in file handling.
 */
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];

/**
 * Represents the name of the field used for file uploads or file-related operations.
 * Used as a key or identifier for handling file input in a system.
 */
const fileFieldName = 'files';

/**
 * The maximum file size allowed for banner uploads, measured in bytes.
 * This value defines the limit for the size of a banner file that can be uploaded.
 * The value is set to 5 MB (megabytes), calculated as 5 * 1024 * 1024 bytes.
 */
const allowedBannerFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a question.
 *
 * This value sets a restriction on the length of the question string,
 * ensuring that it does not exceed the specified character limit.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * An object containing constants related to career settings.
 *
 * @typedef {Object} careerConstants
 * @property {Array<String>} allowedContentTypes - List of content types allowed for career-related uploads.
 * @property {Array<String>} allowedMimeTypes - List of MIME types allowed for career-related uploads.
 * @property {String} fileFieldName - The name of the file field to be used for career-related file uploads.
 * @property {Number} allowedBannerFileSize - Maximum allowed file size (in bytes) for a banner image.
 * @property {Number} questionMaxCharacter - Maximum number of characters allowed for a career-related question.
 */
const careerConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default careerConstants;
