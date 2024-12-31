'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * An array that specifies the allowed content types for incoming requests.
 * This variable is typically used to validate the "Content-Type" header in HTTP requests.
 *
 * The content types are defined in the `contentTypesConstants` module and can include
 * values such as FORM_DATA, APPLICATION_JSON, etc.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array containing the allowed MIME types for file uploads.
 *
 * This variable specifies the MIME types that are permitted for files
 * being uploaded to the application or system. Each MIME type in the array
 * represents a specific format that is acceptable, providing control over
 * the types of files users can upload.
 *
 * The list includes the following MIME types:
 * - Portable Document Format (PDF)
 * - JPEG images (JPG)
 * - Portable Network Graphics (PNG)
 * - Graphics Interchange Format (GIF)
 *
 * It is recommended to ensure that MIME types listed here comply with
 * the application's requirements and security policies.
 */
const allowedFilesMimeTypes = [
    mimeTypesConstants.PDF,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * An array that defines the allowed MIME types for image uploads.
 * This variable specifies which image formats are permitted,
 * typically used for validating image files in an application.
 * The allowed MIME types include JPEG, JPG, PNG, and GIF formats,
 * defined using constants from the `mimeTypesConstants` object.
 */
const allowedImagesMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * Specifies the name of the field associated with file uploads.
 * This variable represents the key used in form submissions or data processing
 * to reference uploaded files.
 *
 * Typically used in APIs or applications to handle file input fields.
 */
const fileFieldName = 'files';

/**
 * A string variable representing the name of the field
 * used to store or reference image data.
 */
const imageFieldName = 'images';

/**
 * Represents the maximum allowed file size for uploads.
 * The value is in bytes and is equivalent to 5 megabytes (5 * 1024 * 1024).
 */
const allowedFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a title.
 * This variable is typically used to enforce input or validation constraints
 * ensuring that no title exceeds the defined character limit.
 *
 * Value: 100
 */
const titleMaxCharacter = 100;

/**
 * aboutUsConstants is an object that provides configuration values for the About Us feature or module.
 * This object includes constants related to file and image handling, content type restrictions,
 * field names, maximum allowed file size, and character limitations for the title.
 *
 * Properties:
 * - allowedContentTypes: Lists the content types that are permitted.
 * - allowedFilesMimeTypes: Specifies the allowed MIME types for files.
 * - allowedImagesMimeTypes: Specifies the allowed MIME types for images.
 * - fileFieldName: Defines the name of the field for uploading files.
 * - imageFieldName: Defines the name of the field for uploading images.
 * - allowedFileSize: Specifies the maximum allowable size for uploaded files, typically in bytes.
 * - titleMaxCharacter: Sets the maximum allowed character count for the title.
 */
const aboutUsConstants = {
    allowedContentTypes,
    allowedFilesMimeTypes,
    allowedImagesMimeTypes,
    fileFieldName,
    imageFieldName,
    allowedFileSize,
    titleMaxCharacter,
};

export default aboutUsConstants;
