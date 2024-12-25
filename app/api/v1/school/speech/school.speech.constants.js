import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

/**
 * A variable that defines the allowed content types for a specific operation or context.
 * It is used to specify and restrict the type of content that can be processed or accepted.
 * The values in this array are derived from predefined constants.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];
/**
 * An array containing the allowed MIME types for file uploads or processing.
 *
 * This variable holds a predefined list of MIME types that are supported, ensuring
 * only specific types of files can be accepted or handled by the application.
 * The MIME types included in the array correspond to common image formats,
 * specifically JPEG, JPG, PNG, and GIF.
 *
 * Utilizes predefined constants from `mimeTypesConstants` to maintain consistency
 * and avoid hardcoding MIME type strings directly.
 */
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
/**
 * A variable representing the name of the field that stores the image information.
 * This is typically used as a key to access or reference image-related data in objects or systems.
 * The value is a string set to 'image'.
 */
const imageFieldName = 'image';

/**
 * Defines the maximum allowed file size for a banner upload in bytes.
 * The size is specified as 5 MB (5 * 1024 * 1024 bytes).
 */
const allowedBannerFileSize = 5 * 1024 * 1024;
/**
 * Specifies the maximum number of characters allowed for a question.
 * This variable defines the character limit to ensure questions remain concise and within constraints.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * A constant object `schoolSpeechConstants` that contains configuration settings used
 * within the school speech application. Includes parameters for content types, file handling,
 * size limitations, and question formatting.
 *
 * Properties:
 * - allowedContentTypes: Defines the permissible content types.
 * - allowedMimeTypes: Specifies the allowed MIME (Multipurpose Internet Mail Extensions) types for file validation.
 * - imageFieldName: Represents the field name used for uploading images.
 * - allowedBannerFileSize: Indicates the maximum allowable file size for banner uploads.
 * - questionMaxCharacter: Specifies the maximum character length allowed for questions.
 */
const schoolSpeechConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imageFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default schoolSpeechConstants;
