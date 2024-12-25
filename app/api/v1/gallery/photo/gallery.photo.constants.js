import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

/**
 * An array that specifies the allowed content types for a specific operation or feature.
 * This can be used to validate or restrict the type of data received or processed.
 *
 * The array contains constants that represent valid content types, such as form-data in this case.
 *
 * Example constants may include types like FORM_DATA, JSON, TEXT, etc., which are predefined in contentTypesConstants.
 */
const allowedContentTypes = [contentTypesConstants.FORM_DATA];

/**
 * A list of allowed MIME types for file uploads or processing.
 *
 * This array contains MIME type constants that specify the set of permitted
 * file formats. It is used to validate file types and enforce restrictions
 * on supported formats such as images.
 *
 * The allowed MIME types include:
 * - JPEG
 * - JPG
 * - PNG
 * - GIF
 *
 * Modify or extend this list to support additional MIME types as needed.
 *
 * @type {Array<string>}
 */
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

/**
 * A constant variable representing the field name used to store or reference images in a data structure.
 * This variable is commonly utilized to access or identify the "images" field within an object or database.
 */
const imagesFieldName = 'images';

/**
 * Represents the maximum allowed file size for a banner upload.
 * The size is specified in bytes.
 * This variable is used to validate the size of banner files before processing.
 * The value is set to 5 MB (5 * 1024 * 1024 bytes).
 */
const allowedBannerFileSize = 5 * 1024 * 1024;

/**
 * Represents the maximum number of characters allowed for a question.
 * This limit is used to enforce constraints on the length of a question input.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * An object containing constants used for handling gallery photos.
 *
 * @property {Array<string>} allowedContentTypes - List of content types that are permitted for gallery photos.
 * @property {Array<string>} allowedMimeTypes - List of MIME types that are allowed for gallery photos.
 * @property {string} imagesFieldName - The field name used for uploading or referencing images.
 * @property {number} allowedBannerFileSize - The maximum allowed file size for banner images, typically in bytes.
 * @property {number} questionMaxCharacter - The maximum number of characters allowed in a question associated with the gallery.
 */
const galleryPhotoConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imagesFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default galleryPhotoConstants;
