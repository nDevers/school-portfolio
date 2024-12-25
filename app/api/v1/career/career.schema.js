import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import careerConstants from "@/app/api/v1/career/career.constants";

const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = careerConstants;

/**
 * Represents the title of a school career.
 *
 * This variable ensures the title is a non-empty string that adheres to the maximum
 * character length constraint defined by `titleMaxCharacter`.
 *
 * @type {string}
 * @param {string} description - A brief descriptor for the title content, specifying context or usage.
 * @param {number} titleMaxCharacter - The maximum allowed number of characters in the title.
 * @throws {Error} Throws an error if the title is empty or exceeds `titleMaxCharacter`.
 */
const title = nonEmptyString('School career title', titleMaxCharacter);

/**
 * Represents the subtitle for a school career, ensuring it is a non-empty string.
 * The value of this variable is bounded by the maximum character limit specified.
 *
 * @type {string}
 * @param {string} description - A short description of the subtitle.
 * @param {number} titleMaxCharacter - The maximum allowable number of characters for the subtitle.
 * @throws {Error} If the value exceeds the specified character limit or is empty.
 */
const subTitle = nonEmptyString('School career sub title', titleMaxCharacter);

/**
 * A variable representing a non-empty string that describes a school career.
 * The value of this variable must always be a non-empty string.
 */
const description = nonEmptyString('School career description');

/**
 * A variable representing a valid Mongoose ID for the 'School career ID'.
 *
 * This variable is expected to hold a value generated or validated
 * as a proper Mongoose ObjectID for interactions with a MongoDB database.
 *
 * @type {string}
 */
const id = validMongooseId('School career ID');

/**
 * Represents a collection of file validation rules for a specific set of files.
 *
 * @variable {Object} files
 * @description A variable that defines validation rules and constraints for handling school career files.
 * It ensures that files conform to specific allowed MIME types, comply with size restrictions, and adhere to a defined file count limit.
 *
 * @property {string} description - A brief summary of the purpose of the files (e.g. "School career files").
 * @property {Array<string>} allowedMimeTypes - An array of MIME types that are permitted for the files being processed.
 * @property {number} allowedBannerFileSize - The maximum allowed file size, typically specified in bytes.
 * @property {number} minFileCount - The minimum number of files required for validation.
 * @property {number} maxFileCount - The maximum number of files allowed for validation.
 */
const files = filesValidator('School career files', allowedMimeTypes, allowedBannerFileSize, 1, 10);

/**
 * The `date` variable represents a validated date input, specifically intended
 * to capture and validate the provided 'School career date'.
 * It ensures the input meets the format and conditions of a valid date.
 */
const date = validDate('School career date');

/**
 * A schema object definition utilizing Zod library for validation.
 * Defines a strict schema with properties: title, subTitle, description, date, and files.
 *
 * The schema ensures that only the defined properties are allowed,
 * enforcing stricter validation by disallowing extra fields.
 *
 * Type safety and validation are enforced for the specified properties,
 * enabling robust data integrity checks when instantiated or validated.
 */
const createSchema = z.object({
    title,
    subTitle,
    description,
    date,
    files,
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * An object schema definition for validating data using a query structure.
 *
 * The `getDataByQuery` variable provides a schema object designed to validate specific query parameters.
 * Each field in the object is optional and, if provided, must conform to its defined structure or validation rule.
 *
 * Fields:
 * - `id`: An optional identifier; validation is applied if present.
 * - `title`: An optional title; will be validated if included in the query.
 * - `subTitle`: An optional subtitle for the data query.
 * - `description`: An optional description field for the data query.
 * - `date`: An optional date field; validated if included.
 * - `createdAt`: An optional date indicating the creation time for the school career.
 *   Validation is specific for date formatting or constraints.
 * - `updatedAt`: An optional date indicating the last update time for the school career.
 *   Validation is specific for date formatting or constraints.
 *
 * The schema is strict, meaning no additional fields beyond those defined will be permitted.
 */
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    subTitle: subTitle.optional(),
    description: description.optional(),
    date: date.optional(),
    createdAt: validDate('School career creation time').optional(),
    updatedAt: validDate('School career last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * A schema definition for updating an object with specific validation rules.
 *
 * This schema enforces strict validation, allowing only specified fields
 * and disallowing extra unknown fields. Additionally, it ensures that the
 * object contains a mandatory "id" field along with at least one of the
 * optional fields for a valid update operation.
 *
 * Fields:
 * - id: Required. Unique identifier for the object being updated.
 * - title: Optional. New title for the object.
 * - subTitle: Optional. New subtitle for the object.
 * - description: Optional. New description for the object.
 * - date: Optional. Date associated with the update.
 * - files: Optional. Files to be associated with the object.
 * - deleteFiles: Optional. Array of file IDs to be deleted, with validation ensuring
 *   at least one ID is provided if this field is used.
 *
 * Validation:
 * - Extra fields not defined in the schema are not allowed.
 * - The object must include an "id" field and at least one additional field for updates.
 * - If no optional fields are provided, the update is considered invalid.
 */
const updateSchema = z.object({
    id,
    title: title.optional(),
    subTitle: subTitle.optional(),
    description: description.optional(),
    date: date.optional(),
    files: files.optional(),
    deleteFiles: nonEmptyStringArray('ID of the file that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

/**
 * An object representing the schema and operations related to a career entity.
 *
 * @property {Function} createSchema - Function to create the schema structure.
 * @property {Function} getDataByQuery - Function to retrieve data based on a specific query.
 * @property {Function} updateSchema - Function to update the schema structure.
 */
const careerSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default careerSchema;
