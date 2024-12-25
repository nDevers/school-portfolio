import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

/**
 * An array that specifies the allowed content types for a particular operation or request.
 * This array typically includes constants representing the acceptable content types,
 * ensuring that only specified types of data are processed.
 *
 * Note: The contents of this array should usually correspond to constants defined
 * in the `contentTypesConstants` module or similar structure.
 *
 * Example of content types that could be included:
 * - FORM_DATA
 * - APPLICATION_JSON
 * - TEXT_PLAIN
 *
 * This variable is particularly useful for validation and content handling processes.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * An array of allowed MIME types for file uploads or processing.
 * The list specifies the file formats that are permitted,
 * typically used for validating uploaded files or ensuring
 * compatibility with the application.
 *
 * The array includes MIME type constants for:
 * - JPEG
 * - JPG
 * - PNG
 * - GIF
 *
 * The constants are defined in `mimeTypesConstants`.
 */
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];

/**
 * Represents the name of the file field used in form data submissions or file-related operations.
 * This variable is typically used to identify the key corresponding to a file input in requests or file handling processes.
 */
const fileFieldName = 'file';

/**
 * Specifies the maximum allowed file size for uploads.
 * The unit is in bytes (B).
 *
 * For example, if the variable is set to 5 * 1024 * 1024, it means the allowed file size is 5MB.
 */
const allowedFileSize = 5 * 1024 * 1024;

/**
 * Defines the maximum number of characters allowed for a title.
 * This value sets the limit to ensure titles remain concise and
 * do not exceed the specified character count.
 *
 * @type {number}
 */
const titleMaxCharacter = 100;

/**
 * Defines the maximum number of characters allowed for a badge label.
 *
 * This variable sets a limit to ensure that badge labels do not exceed the
 * specified number of characters, which could disrupt design consistency or
 * layout integrity in the user interface.
 *
 * @type {number}
 */
const badgeMaxCharacter = 50;

/**
 * An object representing different categories used in the application.
 *
 * @property {string} routine - Represents a routine category.
 * @property {string} result - Represents a result category.
 * @property {string} admissionForm - Represents an admission form category.
 */
const categories = {
    routine: "routine",
    result: "result",
    admissionForm: "admission_form",
};

/**
 * A list of allowed categories retrieved from the values of the `categories` object.
 *
 * This variable contains the category names as an array derived from the `categories` object.
 * It is typically used to validate or restrict operations to a predefined set of category values.
 *
 * @type {Array<string>}
 */
const allowedCategories = Object.values(categories);

/**
 * A constant object containing various academic-related configuration values and constraints.
 *
 * Properties:
 * - `allowedContentTypes` (Array): An array of allowed content types for academic materials.
 * - `allowedMimeTypes` (Array): An array of allowed MIME types for file uploads.
 * - `fileFieldName` (String): The field name used for file uploads.
 * - `allowedFileSize` (Number): Maximum allowed file size in bytes.
 *
 * - `titleMaxCharacter` (Number): Maximum number of characters allowed for titles.
 * - `badgeMaxCharacter` (Number): Maximum number of characters allowed for badge descriptions.
 *
 * - `categories` (Array): A predefined list of categories for academic classification.
 * - `allowedCategories` (Array): A subset of allowed categories that content can belong to.
 */
const academicConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedFileSize,

    titleMaxCharacter,
    badgeMaxCharacter,

    categories,
    allowedCategories,
};

export default academicConstants;
