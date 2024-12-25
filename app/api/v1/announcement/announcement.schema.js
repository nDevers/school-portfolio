import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import announcementConstants from '@/app/api/v1/announcement/announcement.constants';

const {
    nonEmptyString,
    nonEmptyStringArray,
    enumValidation,
    validMongooseId,
    validDate,
    filesValidator,
    booleanString,
} = schemaShared;
const {
    titleMaxCharacter,
    descriptionMaxCharacter,
    allowedCategories,
    allowedMimeTypes,
    allowedFileSize,
} = announcementConstants;

/**
 * Generates and validates a title string based on the provided field name.
 *
 * The function ensures that the title string is non-empty
 * and adheres to the maximum character length constraint.
 *
 * @param {string} fieldName - The name of the field used to construct the title.
 * @returns {string} - A validated, non-empty title string that respects the maximum character limit.
 * @throws {Error} - Throws an error if the generated title exceeds the maximum allowed characters or is empty.
 */
const title = (fieldName) =>
    nonEmptyString(`${fieldName} title`, titleMaxCharacter);

/**
 * Generates a non-empty string using the provided field name and a maximum character limit for the description.
 *
 * @param {string} fieldName - The name of the field for which the description is being generated.
 * @returns {string} A non-empty string representing the description of the specified field, constrained by the maximum character limit.
 */
const description = (fieldName) =>
    nonEmptyString(`${fieldName} description`, descriptionMaxCharacter);

/**
 * Generates a valid Mongoose ID based on the provided field name.
 *
 * @function
 * @param {string} fieldName - The name of the field for which the ID is generated.
 * @returns {string} A string representing a valid Mongoose ID formatted with the field name.
 */
const id = (fieldName) => validMongooseId(`${fieldName} ID`);

/**
 * Generates a validation function for category parameters based on the provided field name.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Function} A validation function configured to enforce category parameter rules for the specified field name.
 */
const categoryParams = (fieldName) =>
    enumValidation(`${fieldName} category parameter`, allowedCategories);

/**
 * A function to validate file inputs based on predefined constraints such as allowed MIME types, file size, and quantity.
 *
 * @param {string} fieldName - The name of the field for which the file validation is being applied.
 * @returns {Function} A validator function instantiated with the provided parameters.
 *
 * Validation Parameters:
 * - The field label is constructed using the `fieldName` and the string "files".
 * - Allows only specific file types defined in `allowedMimeTypes`.
 * - Enforces a maximum file size limit as defined in `allowedFileSize`.
 * - Requires at least one file to be uploaded.
 * - Allows up to a maximum of 10 files.
 */
const files = (fieldName) =>
    filesValidator(
        `${fieldName} files`,
        allowedMimeTypes,
        allowedFileSize,
        1,
        10
    );

/**
 * Deletes files based on the provided field name.
 *
 * @param {string} fieldName - The name of the field containing identifiers for the files to be deleted.
 * @returns {string[]} A non-empty array of strings representing the IDs of the files that will be deleted,
 *                     constrained by a maximum title character limit.
 */
const deleteFiles = (fieldName) =>
    nonEmptyStringArray(
        `${fieldName} IDs of the file that will be deleted`,
        titleMaxCharacter
    );

/**
 * A function that validates a date based on the provided field name.
 *
 * @param {string} fieldName - The name of the field used to construct the date validation.
 * @returns {Function} A validation function that checks if the value is a valid date for the specified field.
 */
const date = (fieldName) => validDate(`${fieldName} date`);

/**
 * A function that validates and converts the given field name into a date string for advertisement mail purposes.
 *
 * @param {string} fieldName - The name of the field to be processed into a date string.
 * @returns {Function} Returns the result of the validDate function with the field name formatted as a date string.
 */
const advertiseMailTime = (fieldName) => validDate(`${fieldName} date`);

/**
 * Determines if a given field name represents a headline.
 * This function appends " is headline" to the provided field name and processes it with booleanString.
 *
 * @param {string} fieldName - The name of the field to check if it is a headline.
 * @returns {boolean} - Returns a boolean indicating whether the fieldName represents a headline.
 */
const isHeadline = (fieldName) => booleanString(`${fieldName} is headline`);

/**
 * Determines if the specified field name is related to an advertisement.
 *
 * This function appends "is advertise" to the provided field name
 * and evaluates it as a boolean-compatible string.
 *
 * @param {string} fieldName - The name of the field to check.
 * @returns {string} A boolean-compatible string indicating advertisement status.
 */
const isAdvertise = (fieldName) => booleanString(`${fieldName} is advertise`);

/**
 * Generates a Zod schema object for validating input data fields.
 *
 * @param {string} fieldName - The name of the field being validated, used to dynamically configure the individual schema properties.
 * @returns {object} - A Zod schema object with strict validation rules for the specified field.
 */
const createSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            title: title(fieldName),
            description: description(fieldName),
            files: files(fieldName),
            date: date(fieldName),
            isHeadline: isHeadline(fieldName),
            isAdvertise: isAdvertise(fieldName),
            advertiseMailTime: advertiseMailTime(fieldName),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * Generates a strict zod schema for validating data based on the provided field name.
 *
 * The resulting schema validates the structure of an object containing fields that
 * can optionally include identifiers, category parameters, and content metadata such
 * as a title, description, and timestamps. Ensures that all fields are strictly typed
 * and validates specific formats where applicable, like date and boolean indicators.
 *
 * @param {string} fieldName - The base identifier for the fields in the object schema.
 *                             Used to generate dynamic validation error messages and contexts.
 * @returns {z.ZodObject} A zod schema object with validation specifications for the given field name.
 */
const getDataByQuery = (fieldName) =>
    z
        .object({
            id: id(fieldName).optional(),
            categoryParams: categoryParams(fieldName).optional(),
            title: title(fieldName).optional(),
            description: description(fieldName).optional(),
            createdAt: validDate(`${fieldName} creation time`).optional(),
            updatedAt: validDate(`${fieldName} last update time`).optional(),
            date: date(fieldName),
            isHeadline: isHeadline(fieldName).optional(),
            isAdvertise: isAdvertise(fieldName).optional(),
            advertiseMailTime: advertiseMailTime(fieldName).optional(),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * `updateSchema` is a function that generates a Zod schema for validating update operations.
 *
 * This schema validates that the input object includes the required `id` and `categoryParams` fields,
 * along with at least one additional optional field (`category`, `title`, `description`, `files`,
 * `deleteFiles`, `date`, `isHeadline`, `isAdvertise`, or `advertiseMailTime`).
 *
 * The schema is enforced with strict mode to disallow any extra fields not explicitly defined.
 * It further applies a validation rule to ensure that, in addition to `id` and `categoryParams`,
 * at least one optional field is present. If this rule is violated, a custom error message is returned.
 *
 * Fields:
 * - `id` (required): The ID field for uniquely identifying the entity.
 * - `categoryParams` (required): Additional category-related parameters.
 * - `category` (optional): Specific category information.
 * - `title` (optional): Title associated with the entity.
 * - `description` (optional): Detailed description of the entity.
 * - `files` (optional): Files associated with the entity.
 * - `deleteFiles` (optional): Indicates files to be deleted.
 * - `date` (optional): Date information related to the entity.
 * - `isHeadline` (optional): Boolean field indicating headline status.
 * - `isAdvertise` (optional): Boolean field indicating advertisement status.
 * - `advertiseMailTime` (optional): Time field indicating scheduled advertisement mail time.
 */
const updateSchema = (fieldName) =>
    z
        .object({
            id: id(fieldName),
            categoryParams: categoryParams(fieldName),
            category: categoryParams(fieldName).optional(),
            title: title(fieldName).optional(),
            description: description(fieldName).optional(),
            files: files(fieldName).optional(),
            deleteFiles: deleteFiles(fieldName).optional(),
            date: date(fieldName).optional(),
            isHeadline: isHeadline(fieldName).optional(),
            isAdvertise: isAdvertise(fieldName).optional(),
            advertiseMailTime: advertiseMailTime(fieldName).optional(),
        })
        .strict() // Enforce strict mode to disallow extra fields
        .refine(
            (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
            {
                message:
                    'At least one of "category", "title", "description", "files", "date" or "isHeadline" is required along with "id" and "categoryParams".',
            }
        );

/**
 * Defines a schema for category-related data validation, ensuring that the structure adheres strictly to the expected format.
 *
 * @param {string} fieldName - The name of the field being validated, used to construct the schema's parameters.
 * @returns {z.ZodObject} A strict schema object that validates the specified category parameters.
 */
const categorySchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
        })
        .strict();

/**
 * Schema definition for validating an object containing category parameters and an ID.
 * The schema ensures that the provided data conforms strictly to the expected structure,
 * where the object must include validated `categoryParams` and `id` fields.
 *
 * @param {string} fieldName - The name of the field being validated; used to provide context for errors.
 * @returns {ZodObject} A strict schema object with `categoryParams` and `id` validation.
 */
const categoryAndIdSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            id: id(fieldName),
        })
        .strict();

/**
 * Represents the schema containing various methods and attributes related to announcements.
 *
 * @property {Function} createSchema - Method used to create a new schema for announcements.
 * @property {Function} getDataByQuery - Method used to retrieve announcement data based on specific queries.
 * @property {Function} updateSchema - Method used to update an existing announcement schema.
 * @property {Object} categorySchema - Object defining the schema structure for announcement categories.
 * @property {Object} categoryAndIdSchema - Object defining the schema structure for mapping categories and IDs.
 */
const announcementSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default announcementSchema;
