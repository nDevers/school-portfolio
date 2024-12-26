'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * A list of content types that are allowed for processing.
 * This array typically includes predefined constants representing specific
 * content types that the system or application can accept or handle.
 *
 * The values in this array should align with predefined constants, such as
 * those defined in the `contentTypesConstants` module.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array of allowed MIME types for file uploads or processing.
 * This list typically defines the acceptable formats for files
 * within a specific feature or application.
 *
 * Contains:
 * - JPEG: Standard JPEG image format.
 * - JPG: Alternate JPEG image extension.
 * - PNG: Portable Network Graphics, a common lossless image format.
 * - GIF: Graphics Interchange Format, supporting animations.
 *
 * Used to validate file types against these acceptable formats.
 */
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * Represents the name of the field used to store or reference images.
 * Typically used as a key in objects or databases to identify where image data
 * or image-related information is stored.
 *
 * @type {string}
 */
const imagesFieldName = 'images';

/**
 * Maximum allowed file size for image uploads, in bytes.
 *
 * This variable sets the upper limit for the size of an image file that can be uploaded.
 * The value is defined as 5 megabytes (5 * 1024 * 1024 bytes).
 *
 * Intended to ensure that uploaded images remain within an acceptable size
 * for performance or storage considerations.
 */
const allowedImageFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of images allowed.
 * Used to enforce a limit on image-related operations.
 *
 * @type {number}
 */
const maxImage = 10;

/**
 * Represents the maximum number of characters allowed for a question.
 * Use this variable to enforce limits on question length to ensure consistency and prevent excessive input.
 */
const questionMaxCharacter = 100;

/**
 * An object containing constants used for configuring the home carousel functionality.
 *
 * @typedef {Object} HomeCarouselConstants
 * @property {Array<string>} allowedContentTypes - List of allowed content types for the carousel items.
 * @property {Array<string>} allowedMimeTypes - List of allowed MIME types for the uploaded files.
 * @property {string} imagesFieldName - The name of the field used for uploading images.
 * @property {number} allowedImageFileSize - The maximum allowed file size for uploaded images, usually in bytes.
 * @property {number} maxImage - The maximum number of images that can be uploaded to the carousel.
 * @property {number} questionMaxCharacter - The maximum number of characters allowed in a question associated with the carousel.
 */
const homeCarouselConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imagesFieldName,
    allowedImageFileSize,
    maxImage,
    questionMaxCharacter,
};

export default homeCarouselConstants;
