'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * An array specifying the allowed content types for a specific operation or configuration.
 * The values in this array are derived from predefined constants.
 * This variable is often used to enforce restrictions on request payload formats
 * to ensure compatibility or security.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array containing the allowed MIME types for file uploads or processing.
 * This is used to validate file types by comparing their MIME type against the allowed list.
 *
 * The MIME types included are:
 * - JPEG image files
 * - JPG image files
 * - PNG image files
 * - GIF image files
 *
 * Each entry in the array is sourced from a constants object to ensure consistency and reusability.
 */
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * Represents the name of a file field used to identify a specific file input or property.
 * This variable holds the string value assigned to the name attribute or identifier
 * for file-related operations, such as uploads or file selection.
 */
const fileFieldName = 'icon';

/**
 * Represents the maximum file size allowed for banner uploads.
 * The size is defined in bytes. In this case, it is set to 5 MB
 * (5 multiplied by 1024 * 1024 bytes).
 */
const allowedBannerFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a question.
 * This variable is used to enforce a character limit on input fields
 * or text areas that accept user-submitted questions.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * Constants related to school achievement functionalities and configurations.
 *
 * @constant
 * @type {Object}
 * @property {Array<string>} allowedContentTypes - List of permitted content types for uploaded files.
 * @property {Array<string>} allowedMimeTypes - List of approved MIME types for uploaded files.
 * @property {string} fileFieldName - Name of the file field used during file uploads.
 * @property {number} allowedBannerFileSize - Maximum allowed file size for banner uploads, typically specified in bytes.
 * @property {number} questionMaxCharacter - Maximum character limit for a question field in the achievement form.
 */
const schoolAchievementConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default schoolAchievementConstants;
