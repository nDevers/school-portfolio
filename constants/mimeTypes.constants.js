'use strict';

/**
 * Specifies the MIME type for JPEG image format.
 * This string constant is commonly used to represent the
 * media type for JPEG image files in various applications
 * and contexts, such as setting content types or validating file types.
 */
const JPEG = 'image/jpeg';

/**
 * A constant that represents the MIME type for JPEG images.
 * It is commonly used to specify the media type of files
 * with a .jpg extension when working with web APIs or file uploads.
 */
const JPG = 'image/jpg';

/**
 * Represents the MIME type for Portable Network Graphics (PNG) images.
 *
 * This variable defines the standard MIME type string used to identify PNG image files
 * when specifying content type in web development, file uploads, or other related contexts.
 *
 * Value: 'image/png'
 */
const PNG = 'image/png';

/**
 * Represents the MIME type for GIF image files.
 * This string is commonly used to specify the GIF media type in HTTP headers, file uploads, or type checks.
 */
const GIF = 'image/gif';

/**
 * A string constant representing the MIME type for PDF files.
 *
 * This variable is typically used to specify the media type of Portable Document Format (PDF) documents in applications that handle file uploads, downloads, or data processing associated with PDFs.
 */
const PDF = 'application/pdf';

/**
 * An object representing a collection of MIME type constants.
 *
 * This object is used to define common file format MIME types as constants
 * for easier and consistent reference throughout the application.
 */
const mimeTypesConstants = {
    JPEG,
    JPG,
    PNG,
    GIF,
    PDF,
};

export default mimeTypesConstants;
