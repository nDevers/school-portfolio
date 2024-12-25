import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import aboutConstants from "@/app/api/v1/about-us/about.us.constants";

const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedFilesMimeTypes, allowedImagesMimeTypes, allowedFileSize } = aboutConstants;

/**
 * Represents the title with a non-empty string validation, ensuring it contains a meaningful value.
 * The value is restricted to a maximum character length, as defined by the `titleMaxCharacter` variable.
 *
 * @param {string} description - A brief description of the value, e.g., purpose or context.
 * @param {number} titleMaxCharacter - The maximum number of characters allowed for the title.
 * @returns {string} The validated title string or throws an error if the validation fails.
 */
const title = nonEmptyString('More about us title', titleMaxCharacter);

/**
 * A non-empty string containing the description "More about us description".
 * This variable is used to hold a descriptive text that provides more
 * information about the subject or entity.
 */
const description = nonEmptyString('More about us description');

/**
 * A variable that holds the result of validating a Mongoose ObjectId.
 * This is used to determine whether the provided ID for the "More about us" section is valid.
 *
 * @type {boolean}
 */
const id = validMongooseId('More about us ID');

/**
 * Represents the configuration for file validation.
 *
 * @param {string} description - A brief description of the file validation purpose.
 * @param {Array<string>} allowedFilesMimeTypes - List of allowed MIME types for the files.
 * @param {number} allowedFileSize - Maximum allowed file size in bytes.
 * @param {number} minFiles - Minimum number of files required.
 * @param {number} maxFiles - Maximum number of files allowed.
 *
 * @returns {Object} The file validation configuration object.
 */
const files = filesValidator('More about us files', allowedFilesMimeTypes, allowedFileSize, 1, 10);

/**
 * Represents the validated and processed list of images for the "More about us" section.
 *
 * This variable holds the result of validating and processing a collection of images meant for display or use in the "More about us" section of an application. The validation ensures that all images conform to specified requirements, including MIME type, file size, and the number of files.
 *
 * @constant {Array} images - The list of validated image files for the section.
 * @see filesValidator - The utility function used for validating and processing the image files.
 * @param {string} sectionName - A descriptive label for the section requiring the images.
 * @param {Array<string>} allowedImagesMimeTypes - A set of permitted MIME types (e.g., 'image/jpeg', 'image/png').
 * @param {number} allowedFileSize - The maximum allowed file size for each image in bytes.
 * @param {number} minFiles - The minimum number of image files required to be processed.
 * @param {number} maxFiles - The maximum number of image files allowed for the section.
 */
const images = filesValidator('More about us images', allowedImagesMimeTypes, allowedFileSize, 1, 10);

/**
 * Represents a schema definition using a strict validation object.
 *
 * The `createSchema` variable is designed to define a structured validation
 * schema with strict rules. It includes the following fields:
 * - `title`: Represents the title of the schema.
 * - `description`: Describes the schema or object content.
 * - `files`: Represents a collection or set of files related to the schema.
 * - `images`: Represents an array or set of images associated with the schema.
 *
 * This schema is enforced strictly, meaning no additional properties
 * beyond the defined ones are allowed.
 */
const createSchema = z.object({
    title,
    description,
    files,
    images,
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema for validating and structuring data objects
 * queried based on certain parameters.
 *
 * This variable enforces a strict structure with optional properties
 * for the queried data, ensuring proper validation of data types.
 *
 * - `id`: An optional identifier for the data object.
 * - `title`: An optional title property for the data object.
 * - `description`: An optional description property for the data object.
 * - `createdAt`: An optional property representing the creation time
 *   of the data object, validated as a valid date.
 * - `updatedAt`: An optional property representing the last update time
 *   of the data object, validated as a valid date.
 */
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('More about us creation time').optional(),
    updatedAt: validDate('More about us last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * Schema for updating an entity.
 *
 * The `updateSchema` defines the expected structure and validation rules
 * for updating an entity. It validates the presence of required fields,
 * allows optional fields, enforces strict mode to disallow extra fields,
 * and ensures that at least one additional property is provided along with the `id`.
 *
 * Properties:
 * - `id`: Required identifier of the entity being updated.
 * - `title`: Optional new title for the entity.
 * - `description`: Optional new description for the entity.
 * - `files`: Optional new files associated with the entity.
 * - `images`: Optional new images associated with the entity.
 * - `deleteFiles`: Optional array of IDs of the files to be deleted.
 * - `deleteImages`: Optional array of IDs of the images to be deleted.
 *
 * Validation Rules:
 * - Enforces strict mode, preventing additional undefined fields in the schema.
 * - Requires the presence of an `id` field and at least one additional property
 *   (e.g., `title`, `description`) to ensure meaningful updates.
 */
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    files: files.optional(),
    images: files.optional(),
    deleteFiles: nonEmptyStringArray('ID of the file that will be deleted').optional(),
    deleteImages: nonEmptyStringArray('ID of the image that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

/**
 * Represents an object containing methods for managing the About Us schema.
 *
 * @property {Function} createSchema - Method responsible for creating a new About Us schema.
 * @property {Function} getDataByQuery - Method used to retrieve data based on a specified query.
 * @property {Function} updateSchema - Method used to update an existing About Us schema.
 */
const aboutUsSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default aboutUsSchema;
