import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import schoolSpeechConstants from '@/app/api/v1/school/speech/school.speech.constants';

const { nonEmptyString, validMongooseId, validDate, filesValidator } =
    schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } =
    schoolSpeechConstants;

/**
 * Represents the title of a school speech.
 * The title is validated to ensure it is a non-empty string and does not exceed the maximum character limit.
 *
 * @constant {string} title
 * @param {string} label - A descriptive label for the title, e.g. 'School speech title'.
 * @param {number} titleMaxCharacter - The maximum allowed characters for the title.
 * @throws {Error} Throws an error if the title is empty or exceeds the character limit.
 */
const title = nonEmptyString('School speech title', titleMaxCharacter);
/**
 * Represents a non-empty string value for a school speech description.
 * This variable should always contain a string with at least one character.
 */
const description = nonEmptyString('School speech description');
/**
 * Represents a unique identifier validated as a valid Mongoose ObjectId.
 *
 * @param {string} description - A brief description of what the ID represents.
 * @returns {string} A string representing a valid Mongoose ObjectId if the validation is successful.
 */
const id = validMongooseId('School speech ID');
/**
 * A function call to validate and upload an image file with specific requirements.
 *
 * @param {string} image A string description of the image file being uploaded, in this case, "School speech image".
 * @param {Array<string>} allowedMimeTypes An array of allowed MIME types specifying the valid image formats.
 * @param {number} allowedBannerFileSize The maximum allowed file size for the image, typically in bytes.
 * @param {number} minFileCount The minimum number of files required to upload, in this case, 1.
 * @param {number} maxFileCount The maximum number of files allowed to upload, in this case, 1.
 * @return {Object} Returns an object containing the validation results.
 */
const image = filesValidator(
    'School speech image',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    1
);

/**
 * createSchema is a Zod object schema definition that validates an object with specific properties.
 * The schema ensures the presence of the following properties with their corresponding constraints:
 * - title: The title of the object.
 * - description: Description providing details about the object.
 * - image: Represents the image associated with the object.
 *
 * The schema uses "strict" mode to restrict any additional properties not defined in the object schema.
 */
const createSchema = z
    .object({
        title,
        description,
        image,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * A schema object that validates data based on the specified query structure.
 *
 * The `getDataByQuery` variable defines a strict validation schema using `z.object()`.
 * It enforces the following optional properties:
 *
 * - `id`: Represents the unique identifier of the data.
 * - `title`: Specifies the title of the item.
 * - `description`: Contains a textual description of the item.
 * - `createdAt`: Captures the creation timestamp in a valid date format, labeled as "School speech creation time".
 * - `updatedAt`: Captures the last update timestamp in a valid date format, labeled as "School speech last update time".
 *
 * The schema is strict, meaning no additional properties outside of the defined ones are allowed.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        title: title.optional(),
        description: description.optional(),
        createdAt: validDate('School speech creation time').optional(),
        updatedAt: validDate('School speech last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema for updating an entity where certain fields can be optionally updated.
 * Enforces strict mode to disallow extra or unexpected fields, ensuring only valid properties are included.
 *
 * Validation Rules:
 * - Requires an `id` field and at least one additional field (`title`, `description`, or `image`).
 * - If only the `id` field is provided without any other optional fields, the validation fails.
 *
 * Fields:
 * - `id`: The unique identifier for the entity (required).
 * - `title`: The title of the entity (optional).
 * - `description`: A detailed description of the entity (optional).
 * - `image`: A reference for the image or visual representation of the entity (optional).
 *
 * Error Message:
 * - Provides a custom validation error message if the `id` field is included without any other fields:
 *   "At least one of 'title' or 'description' is required along with 'id'."
 */
const updateSchema = z
    .object({
        id,
        title: title.optional(),
        description: description.optional(),
        image: image.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title" or "description" is required along with "id".',
        }
    );

/**
 * schoolSpeechSchema is an object containing methods related to managing school speech operations.
 *
 * Properties:
 * - createSchema: Method to create a new schema for school speech.
 * - getDataByQuery: Method to retrieve data based on a specific query.
 * - updateSchema: Method to update an existing school speech schema.
 */
const schoolSpeechSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolSpeechSchema;
