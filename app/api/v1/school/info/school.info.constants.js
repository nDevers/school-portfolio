'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * A list of content types that are allowed for a specific functionality.
 *
 * This variable is initialized with a constant value representing the
 * "FORM_DATA" content type, as defined in the contentTypesConstants module.
 * Additional content types might be added based on requirements.
 *
 * Example content type: FORM_DATA
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];
/**
 * A list of allowed MIME types for file validation.
 *
 * This variable contains an array of predefined MIME types
 * which are permitted for file uploads or processing.
 *
 * MIME types included:
 * - JPEG
 * - JPG
 * - PNG
 * - GIF
 *
 * Typically used to restrict file types during file handling operations.
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
 * Represents the name of the file field. This value is typically used to
 * identify or reference the specific file-related field within a context,
 * such as form submissions, database records, or API requests.
 *
 * The value of this variable is a string, which can be used as a key,
 * field name, or identifier wherever needed.
 */
const fileFieldName = 'icon';

/**
 * Represents the maximum allowed file size for banner uploads.
 * The size is measured in bytes.
 * In this specific case, it is set to 5 MB (5 * 1024 * 1024 bytes).
 */
const allowedBannerFileSize = 5 * 1024 * 1024;
/**
 * Represents the maximum number of characters allowed for a question.
 * This value defines the character limit for question input fields to ensure
 * that user input does not exceed the predefined maximum length.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * An object containing constants related to school information configurations.
 * This includes restrictions and settings for file handling, character limits, and other content constraints.
 *
 * @constant {Object} schoolInfoConstants
 * @property {Array<string>} allowedContentTypes - List of acceptable content types for uploads or processing.
 * @property {Array<string>} allowedMimeTypes - List of allowed MIME types for file uploads.
 * @property {string} fileFieldName - The designated field name for file uploads.
 * @property {number} allowedBannerFileSize - Maximum allowed file size for banner uploads, in bytes.
 * @property {number} questionMaxCharacter - Maximum character limit for questions or input fields.
 */
const schoolInfoConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default schoolInfoConstants;
