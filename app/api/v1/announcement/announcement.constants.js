'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * An array specifying the allowed content types for a particular operation or request.
 * This ensures that only the specified content types from the predefined constants
 * are permitted, providing a mechanism to enforce compatibility and security.
 *
 * The content type constants are typically defined in `contentTypesConstants`.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array that defines the MIME types allowed for processing or upload.
 *
 * The `allowedMimeTypes` variable contains a predefined list of MIME types
 * that are permitted. It is typically used to validate or restrict
 * file types in scenarios such as file uploads or media handling.
 *
 * MIME types included in the list:
 * - JPEG
 * - JPG
 * - PNG
 * - GIF
 *
 * The constants for the MIME types are imported from `mimeTypesConstants`.
 */
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * The constant `filesFieldName` represents the name of the field typically
 * used to identify or reference files within a data structure or system.
 *
 * This value is commonly used in contexts where file-related information
 * needs to be handled, such as file uploads, metadata processing, or file
 * management systems.
 *
 * @type {string}
 * @constant
 */
const filesFieldName = 'files';

/**
 * Represents the maximum file size, in bytes, that is allowed for uploads.
 * The value is set to 5 megabytes (5 * 1024 * 1024 bytes).
 */
const allowedFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a title.
 *
 * This variable defines the character limit that a title can have.
 * It is used to enforce restrictions on title length to maintain consistency
 * and ensure proper formatting or display across the application.
 *
 * @type {number}
 */
const titleMaxCharacter = 50;

/**
 * The maximum number of characters allowed for a description.
 *
 * This value specifies the upper limit for character count in a
 * description field to ensure consistent formatting and prevent
 * overly long descriptions. It is set to 50 characters.
 *
 * @type {number}
 */
const descriptionMaxCharacter = 50;

/**
 * Represents a collection of category types used in the application.
 * The keys indicate the category name, and the values represent the associated identifiers.
 *
 * @property {string} notice - The category representing notices.
 * @property {string} leaveCalender - The category representing leave calendar information.
 * @property {string} transportation - The category representing transportation-related information.
 * @property {string} admissionInfo - The category representing admission information.
 */
const categories = {
    notice: 'notice',
    leaveCalender: 'leave_calender',
    transportation: 'transportation',
    admissionInfo: 'admission_info',
};

/**
 * A variable that stores a list of allowed categories.
 * It is populated using the values from the `categories` object.
 * The values are retrieved dynamically using the `Object.values()` method.
 * This variable is intended to represent all permissible categories
 * derived from the `categories` object.
 *
 * @type {Array<any>}
 */
const allowedCategories = Object.values(categories);

/**
 * Object that holds constants related to faculty management.
 *
 * @property {Array<string>} allowedContentTypes - List of permissible content types for faculty-related files.
 * @property {Array<string>} allowedMimeTypes - List of allowed MIME types for files uploaded by faculty.
 * @property {string} filesFieldName - Name of the field used for file uploads.
 * @property {number} allowedFileSize - Maximum file size allowed for uploads, typically in bytes.
 * @property {number} titleMaxCharacter - Maximum number of characters permitted for a title.
 * @property {number} descriptionMaxCharacter - Maximum number of characters allowed in a description.
 * @property {Array<string>} categories - List of all possible categories associated with faculty.
 * @property {Array<string>} allowedCategories - Subset of valid categories allowed for specific operations.
 */
const facultyConstants = {
    allowedContentTypes,

    allowedMimeTypes,
    filesFieldName,
    allowedFileSize,

    titleMaxCharacter,
    descriptionMaxCharacter,

    categories,
    allowedCategories,
};

export default facultyConstants;
