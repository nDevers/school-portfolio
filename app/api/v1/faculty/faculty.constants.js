import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * A constant that defines the allowed content types for a specific context or operation.
 * This variable is typically used to validate or restrict the type of incoming or outgoing content
 * that can be processed within an application.
 *
 * @constant {Array} allowedContentTypes
 * Contains a list of content type constants, each representing a permissible content type.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * A list of allowed MIME types for file validation or processing.
 *
 * This variable contains an array of MIME type constants, typically used
 * to determine whether a given file type is permissible in a specific context
 * (e.g., file uploads). The allowed MIME types include popular image formats
 * such as JPEG, JPG, PNG, and GIF.
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
 * A constant string that represents the field name used for storing or referencing image data.
 * This could be utilized in contexts such as form submissions, API payloads, and database records.
 */
const imageFieldName = 'image';

/**
 * Specifies the maximum allowed file size for uploads.
 * The value is represented in bytes.
 * In this case, the limit is set to 5 megabytes (5 * 1024 * 1024 bytes).
 */
const allowedFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum allowed number of characters for a name.
 * This value is used to enforce a limit on the length of a name input.
 *
 * Value: 50
 */
const nameMaxCharacter = 50;

/**
 * Represents the maximum number of characters allowed for a designation field.
 * This variable is used to define the character limit for the designation,
 * ensuring input data adheres to the specified constraints.
 *
 * @type {number}
 */
const designationMaxCharacter = 50;

/**
 * Object representing category types.
 *
 * @property {string} teacher - Represents the "teacher" category.
 * @property {string} board - Represents the "board" category.
 * @property {string} exHeadTeacher - Represents the "ex_head_teacher" category.
 * @property {string} meritStudent - Represents the "merit_student" category.
 */
const categories = {
    teacher: 'teacher',
    board: 'board',
    exHeadTeacher: 'ex_head_teacher',
    meritStudent: 'merit_student',
};

/**
 * A collection of category values extracted from the `categories` object.
 * This variable stores an array of values retrieved using `Object.values(categories)`.
 * It represents the list of allowed categories to be used throughout the application.
 *
 * @type {Array<any>}
 */
const allowedCategories = Object.values(categories);

/**
 * An object containing configuration constants for the faculty-related module.
 * It provides settings and validation criteria necessary for handling faculty attributes.
 *
 * @typedef {Object} facultyConstants
 * @property {Array.<string>} allowedContentTypes - Array of allowed content types for file validation.
 * @property {Array.<string>} allowedMimeTypes - Array of allowed MIME types for files.
 * @property {string} imageFieldName - The name of the field used for image uploads.
 * @property {number} allowedFileSize - Maximum file size allowed for uploads, typically in bytes.
 * @property {number} nameMaxCharacter - The maximum number of characters allowed for a faculty name.
 * @property {number} designationMaxCharacter - The maximum number of characters allowed for a faculty designation.
 * @property {Array.<string>} categories - List of all possible categories related to faculty.
 * @property {Array.<string>} allowedCategories - List of permitted categories for faculty assignments.
 */
const facultyConstants = {
    allowedContentTypes,

    allowedMimeTypes,
    imageFieldName,
    allowedFileSize,

    nameMaxCharacter,
    designationMaxCharacter,

    categories,
    allowedCategories,
};

export default facultyConstants;
